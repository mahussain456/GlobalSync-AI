"""Test the actual deployed entry point with no credentials or production storage."""
import importlib
import os
import sys
import types
import unittest
from unittest.mock import patch

import httpx

class SecurityRoutes(unittest.IsolatedAsyncioTestCase):
    async def test_public_routes_reject_private_data_access(self):
        with patch.dict(os.environ, {}, clear=True), patch.dict(sys.modules, {
            'dotenv': types.SimpleNamespace(load_dotenv=lambda *args, **kwargs: False)
        }):
            app = importlib.import_module('api.index').app
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
            for path, status in [('/api/users', 403), ('/api/history', 410), ('/api/teams/user/test@example.invalid', 403)]:
                response = await client.get(path)
                self.assertEqual(response.status_code, status, path)
                self.assertIn('detail', response.json())
            response = await client.post('/api/teams', json={'name': 'Test', 'members': [], 'is_paid': True})
            self.assertEqual(response.status_code, 403)

if __name__ == '__main__':
    unittest.main()
