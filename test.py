import requests

API_KEY = "sk_e7f433cb7ec5f97a7645889eb26077ad2a83b6d07df36e25"
url = "https://api.elevenlabs.io/v1/voices"
headers = {"xi-api-key": API_KEY}
response = requests.get(url, headers=headers)
print(response.status_code)
print(response.json())