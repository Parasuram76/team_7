
import requests

url = "http://localhost:2002/socratic_chat"
payload = {
    "message": "What is gravity?",
    "apiKey": "AIzaSyDmXQzuK2D9Cc4RLX0Kd2-cvAZMXSLu89k"
}

try:
    print(f"Testing {url}...")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
