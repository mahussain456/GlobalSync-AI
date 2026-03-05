"""Backend tests for GlobalSync AI app"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealth:
    """Health check"""
    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "GlobalSync" in data.get("message", "")

class TestTimezone:
    """Timezone endpoints"""
    def test_popular_cities(self):
        r = requests.get(f"{BASE_URL}/api/timezone/cities")
        assert r.status_code == 200
        data = r.json()
        assert "cities" in data
        assert len(data["cities"]) > 0

    def test_convert_current_time(self):
        r = requests.post(f"{BASE_URL}/api/timezone/convert", json={"cities": ["New York", "London", "Mumbai"]})
        assert r.status_code == 200
        data = r.json()
        assert "cities" in data
        assert len(data["cities"]) == 3
        for city in data["cities"]:
            assert city.get("known") == True
            assert "current_time" in city

    def test_overlap(self):
        r = requests.post(f"{BASE_URL}/api/timezone/overlap", json={"cities": ["New York", "London"]})
        assert r.status_code == 200
        data = r.json()
        assert "has_overlap" in data
        assert "city_details" in data

    def test_overlap_single_city(self):
        r = requests.post(f"{BASE_URL}/api/timezone/overlap", json={"cities": ["New York"]})
        assert r.status_code == 200
        data = r.json()
        assert data["has_overlap"] == False

class TestCurrency:
    """Currency endpoints"""
    def test_convert(self):
        r = requests.get(f"{BASE_URL}/api/currency/convert", params={"amount": 100, "from_currency": "USD", "to_currency": "EUR"})
        assert r.status_code == 200
        data = r.json()
        assert data["from"] == "USD"
        assert data["to"] == "EUR"
        assert data["amount"] == 100
        assert data["rate"] > 0
        assert data["converted"] > 0

    def test_trend(self):
        r = requests.get(f"{BASE_URL}/api/currency/trend", params={"from_currency": "USD", "to_currency": "EUR"})
        assert r.status_code == 200
        data = r.json()
        assert "trend" in data
        assert len(data["trend"]) > 0
        assert "change_percent" in data

class TestAI:
    """AI parse endpoint"""
    def test_currency_intent(self):
        r = requests.post(f"{BASE_URL}/api/ai/parse", json={"query": "Convert 100 USD to EUR"})
        assert r.status_code == 200
        data = r.json()
        assert data.get("intent") == "currency_conversion"
        entities = data.get("entities", {})
        assert entities.get("from_currency") == "USD"
        assert entities.get("to_currency") == "EUR"

    def test_meeting_intent(self):
        r = requests.post(f"{BASE_URL}/api/ai/parse", json={"query": "Best meeting time for NYC, London, Tokyo"})
        assert r.status_code == 200
        data = r.json()
        assert data.get("intent") == "meeting_overlap"

class TestHistory:
    """History endpoints"""
    def test_save_and_get(self):
        payload = {"query": "TEST_query", "intent": "currency_conversion", "result": {"rate": 0.9}}
        r = requests.post(f"{BASE_URL}/api/history", json=payload)
        assert r.status_code == 200
        item = r.json()
        assert item["query"] == "TEST_query"
        assert "id" in item

        r2 = requests.get(f"{BASE_URL}/api/history")
        assert r2.status_code == 200
        items = r2.json()["items"]
        assert any(i["query"] == "TEST_query" for i in items)

    def test_clear(self):
        r = requests.delete(f"{BASE_URL}/api/history")
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/history")
        assert r2.json()["items"] == []
