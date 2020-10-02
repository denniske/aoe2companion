import json
import time
import aoeapi
import os
import io
import mgz.summary
import sys

# redirect stdout
old_stdout = sys.stdout
sys.stdout = open(os.devnull, "w")

match_id = sys.argv[1]
profile_id = sys.argv[2]

url = 'https://aoe.ms/replay/?gameId={}&profileId={}'.format(match_id, profile_id)

try:
    filename = aoeapi.download_rec(url, 'recs')
except aoeapi.AoeApiError:
    # print('could not download valid rec: ', match_id, ' - ', profile_id)
    sys.stdout = old_stdout
    print(json.dumps({
        "status": 404,
    }))
    exit()
except RuntimeError:
    # print('could not download valid rec: ', match_id, ' - ', profile_id)
    sys.stdout = old_stdout
    print(json.dumps({
        "status": 404,
    }))
    exit()

# print('recs/' + filename)
# start = time.time()

with open('recs/' + filename, 'rb') as handle:
    data = handle.read()

handle = io.BytesIO(data)
summary = mgz.summary.Summary(handle, None)

# end = time.time()
# print('process', end - start, 's')

os.remove('recs/' + filename)

map = summary.get_map()
del map['tiles']

sys.stdout = old_stdout
print(json.dumps({
    "players": summary.get_players(),
    "completed": summary.get_completed(),
    "chat": summary.get_chat(),
    "dataset": summary.get_dataset(),
    "diplomacy": summary.get_diplomacy(),
    "duration": summary.get_duration(),
    "encoding": summary.get_encoding(),
    "file_hash": summary.get_file_hash(),
    "language": summary.get_language(),
    "mirror": summary.get_mirror(),
    "owner": summary.get_owner(),
    "platform": summary.get_platform(),
    "postgame": summary.get_postgame(), # null
    "teams": summary.get_teams(),
    "start_time": summary.get_start_time(), # 0
    "restored": summary.get_restored(),
    "ratings": summary.get_ratings(), # empty
    "profile_ids": summary.get_profile_ids(),
    "map": map,
}, default=str))
