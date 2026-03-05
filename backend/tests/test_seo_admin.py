"""Tests for SEO-related APIs, admin endpoints, and rate-limited endpoints"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestAdminAndUsers:
    """Admin/users API tests"""

    def test_get_users_returns_200(self):
        res = requests.get(f"{BASE_URL}/api/users")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        assert "total" in data, "Missing 'total' key"
        assert "users" in data, "Missing 'users' key"
        assert isinstance(data["total"], int)
        assert isinstance(data["users"], list)
        print(f"GET /api/users OK: total={data['total']}")


class TestCurrencyAPI:
    """Currency conversion API tests"""

    def test_currency_convert_usd_eur(self):
        res = requests.get(f"{BASE_URL}/api/currency/convert", params={
            "from_currency": "USD", "to_currency": "EUR", "amount": 100
        })
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        assert "rate" in data or "converted_amount" in data or "result" in data, f"Unexpected response: {data}"
        print(f"GET /api/currency/convert OK: {data}")

    def test_currency_trend(self):
        res = requests.get(f"{BASE_URL}/api/currency/trend", params={
            "from_currency": "USD", "to_currency": "EUR"
        })
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        print(f"GET /api/currency/trend OK")


class TestAIParseAPI:
    """AI parse endpoint tests"""

    def test_ai_parse_returns_200(self):
        res = requests.post(f"{BASE_URL}/api/ai/parse", json={"query": "Convert 100 USD to EUR"})
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        print(f"POST /api/ai/parse OK: intent={data.get('intent', 'n/a')}")
