"""Attack-style checks against the deployed ASGI app, with no credentials or storage."""
import base64
import importlib
import os
import sys
import types
import unittest
from unittest.mock import patch

import httpx


def load_app():
    with patch.dict(os.environ, {}, clear=True), patch.dict(sys.modules, {
        'dotenv': types.SimpleNamespace(load_dotenv=lambda *args, **kwargs: False)
    }):
        return importlib.import_module('api.index')


class Hardening(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.mod = load_app()
        self.mod.app.state.limiter.reset()

    def client(self):
        return httpx.AsyncClient(transport=httpx.ASGITransport(app=self.mod.app), base_url='http://test')

    async def test_no_diagnostics_or_api_docs_exposed(self):
        async with self.client() as c:
            for path in ['/api/build-info', '/docs', '/redoc', '/openapi.json']:
                self.assertEqual((await c.get(path)).status_code, 404, path)

    async def test_cors_only_trusts_our_own_origin(self):
        async with self.client() as c:
            evil = await c.get('/api/timezone/cities', headers={'Origin': 'https://evil.example'})
            self.assertNotIn('access-control-allow-origin', evil.headers)
            ours = await c.get('/api/timezone/cities', headers={'Origin': 'https://www.globalsync-ai.com'})
            self.assertEqual(ours.headers.get('access-control-allow-origin'), 'https://www.globalsync-ai.com')
            self.assertNotIn('access-control-allow-credentials', ours.headers)

    async def test_currency_codes_cannot_inject_into_upstream_urls(self):
        async with self.client() as c:
            for bad in ['US/../x', 'USD?x=1', 'usdd', '']:
                r = await c.get('/api/currency/convert', params={'amount': 1, 'from_currency': bad, 'to_currency': 'EUR'})
                self.assertEqual(r.status_code, 422, bad)
            r = await c.get('/api/currency/convert', params={'amount': 'inf', 'from_currency': 'USD', 'to_currency': 'EUR'})
            self.assertEqual(r.status_code, 422)

    async def test_invoice_mailer_rejects_spam_and_header_injection(self):
        pdf = base64.b64encode(b'%PDF-1.4 test').decode()
        good = dict(sender_email='me@example.com', client_email='them@example.com', client_name='Client',
                    invoice_number='INV-2026-0001', pdf_base64=pdf)
        cases = [
            dict(good, client_email='them@example.com\nBcc: victim@example.com'),
            dict(good, sender_email='<script>@x.com'),
            dict(good, invoice_number='../../etc/passwd'),
            dict(good, pdf_base64=base64.b64encode(b'MZ\x90\x00 not a pdf').decode()),
            dict(good, pdf_base64='%%%not-base64%%%'),
        ]
        async with self.client() as c:
            for body in cases:
                self.mod.app.state.limiter.reset()  # 3/hour limit is tested separately
                r = await c.post('/api/invoices/send', json=body)
                self.assertEqual(r.status_code, 422, body)

    async def test_invoice_mailer_is_rate_limited(self):
        pdf = base64.b64encode(b'not a pdf').decode()
        body = dict(sender_email='me@example.com', client_email='them@example.com', client_name='C',
                    invoice_number='INV-1', pdf_base64=pdf)
        async with self.client() as c:
            codes = [(await c.post('/api/invoices/send', json=body)).status_code for _ in range(4)]
        self.assertEqual(codes[:3], [422, 422, 422])
        self.assertEqual(codes[3], 429)

    async def test_oversized_inputs_rejected(self):
        async with self.client() as c:
            self.assertEqual((await c.post('/api/ai/parse', json={'query': 'x' * 301})).status_code, 422)
            self.assertEqual((await c.post('/api/timezone/overlap', json={'cities': ['London'] * 21})).status_code, 422)
            r = await c.post('/api/timezone/overlap', json={'cities': ['London', 'Tokyo'], 'business_start_hour': 17, 'business_end_hour': 9})
            self.assertEqual(r.status_code, 422)
            r = await c.post('/api/contact', json={'name': 'A', 'email': 'a@b.co', 'message': 'x' * 5001})
            self.assertEqual(r.status_code, 422)

    async def test_contact_form_rejects_bad_reply_address(self):
        async with self.client() as c:
            r = await c.post('/api/contact', json={'name': 'A', 'email': 'a@b.co\r\nBcc: x@y.z', 'message': 'hi'})
            self.assertEqual(r.status_code, 422)

    def test_model_output_is_reduced_to_a_safe_shape(self):
        clean = importlib.import_module('frontend.api.index').sanitize_intent
        self.assertIsNone(clean({'intent': 'run_shell', 'entities': {}}))
        self.assertIsNone(clean({'intent': 'currency_conversion', 'entities': {'from_currency': 'USD;DROP', 'to_currency': 'EUR'}}))
        out = clean({'intent': 'currency_conversion', 'entities': {'amount': float('inf'), 'from_currency': 'usd', 'to_currency': 'eur', 'extra': '<img>'}})
        self.assertEqual(out, {'intent': 'currency_conversion', 'entities': {'amount': 1.0, 'from_currency': 'USD', 'to_currency': 'EUR'}})
        out = clean({'intent': 'meeting_overlap', 'entities': {'cities': ['A' * 500] + ['B'] * 20}})
        self.assertEqual(len(out['entities']['cities']), 10)
        self.assertEqual(len(out['entities']['cities'][0]), 100)


if __name__ == '__main__':
    unittest.main()
