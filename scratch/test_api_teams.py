import requests
import json

url = "http://127.0.0.1:8000/api/teams"
payload = {
    "name": "Test Team",
    "email": "test@example.com",
    "opt_in": True,
    "custom_slug": None,
    "is_paid": False,
    "members": [
        {
            "name": "sreekanth",
            "city": "Mumbai",
            "timezone_id": "Asia/Kolkata",
            "utc_offset": "UTC+5:30"
        },
        {
            "name": "Ahmed",
            "city": "San Francisco",
            "timezone_id": "America/Los_Angeles",
            "utc_offset": "UTC-7"
        }
    ]
}

try:
    print("Sending POST request to:", url)
    print("Payload:", json.dumps(payload, indent=2))
    response = requests.post(url, json=payload)
    print("Response Status Code:", response.status_code)
    print("Response Text:", response.text)
except Exception as e:
    print("Error:", e)
