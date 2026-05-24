import requests

url = "https://api.frankfurter.app/latest?from=USD"
try:
    response = requests.get(url)
    print("Status Code:", response.status_code)
    for k, v in response.headers.items():
        print(f"{k}: {v}")
    print("Response Data:", response.json().get('rates', {})['GBP'])
except Exception as e:
    print("Error:", e)
