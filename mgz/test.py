import requests
from pprint import pprint

# Warm up, so you don't measure flask internal memory usage
for _ in range(10):
    requests.get('http://127.0.0.1:80/warmup')

# Memory usage before API calls
resp = requests.get('http://127.0.0.1:80/memory')
print(f'Memory before API call: {int(resp.json().get("memory"))}')

# Take first memory usage snapshot
# resp = requests.get('http://127.0.0.1:80/snapshot')
# print(resp.text)

# Start some API Calls
for _ in range(1):
    requests.get('http://127.0.0.1:80/replay?match_id=41318074&profile_id=1550422')
    # requests.get('http://127.0.0.1:80/foo')

# Memory usage after
requests.get('http://127.0.0.1:80/gc')
resp = requests.get('http://127.0.0.1:80/memory')
print(f'Memory after  API call: {int(resp.json().get("memory"))}')

for _ in range(1):
    requests.get('http://127.0.0.1:80/replay?match_id=41318074&profile_id=1550422')
    # requests.get('http://127.0.0.1:80/foo')

# Memory usage after
requests.get('http://127.0.0.1:80/gc')
resp = requests.get('http://127.0.0.1:80/memory')
print(f'Memory after  API call: {int(resp.json().get("memory"))}')

# Take 2nd snapshot and print result
# resp = requests.get('http://127.0.0.1:80/snapshot')
# print(resp.text)
# pprint(resp.text)
