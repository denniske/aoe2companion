import json
import time
import aoeapi
import os
from flask import Flask
from flask import request
from flask import jsonify
from flask import abort
import io
import mgz.summary

app = Flask(__name__)

import gc
import tracemalloc
import psutil
process = psutil.Process(os.getpid())
tracemalloc.start()
s = None
global_var = []

def _get_foo():
    global global_var
    global_var.append([1, "a", 3, True] * 10000)  # This is our (amplified) memory leak
    return {'foo': True}

@app.route('/foo')
def get_foo():
    gc.collect()  # does not help
    return _get_foo()
    # return 'gc collected'

@app.route('/warmup')
def get_warmup():
    return 'warmup'
    # return 'gc collected'

@app.route('/gc')
def get_gc():
    gc.collect()  # does not help
    return 'gc collected'


@app.route('/memory')
def print_memory():
    return {'memory': process.memory_info().rss}


@app.route("/snapshot")
def snap():
    global s
    if not s:
        s = tracemalloc.take_snapshot()
        return "taken snapshot\n"
    else:
        lines = []
        top_stats = tracemalloc.take_snapshot().compare_to(s, 'lineno')
        for stat in top_stats[:5]:
            lines.append(str(stat))
        return "\n".join(lines)

@app.route("/replay")
def replay():
    match_id = request.args.get('match_id')
    profile_id = request.args.get('profile_id')

    url = 'https://aoe.ms/replay/?gameId={}&profileId={}'.format(match_id, profile_id)

    try:
        filename = aoeapi.download_rec(url, 'recs')
    except aoeapi.AoeApiError:
        print('could not download valid rec: ', match_id, ' - ', profile_id)
        abort(404)
        return
    except RuntimeError:
        print('could not download valid rec: ', match_id, ' - ', profile_id)
        abort(404)
        return

    print('recs/' + filename)

    start = time.time()
    with open('recs/' + filename, 'rb') as handle:
        data = handle.read()

    handle = io.BytesIO(data)
    summary = mgz.summary.Summary(handle, None)

    end = time.time()
    print('process', end - start, 's')

    os.remove('recs/' + filename)

    map = summary.get_map()
    del map['tiles']

    return json.dumps({
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
    }, default=str)

    # print(json.dumps(summary.get_hash())) # non serializable
    # print(json.dumps(summary.get_header())) # non serializable
    # print(json.dumps(summary.get_version())) # non serializable

    # print(json.dumps(summary.get_objects())) #80KB
    # print(json.dumps(summary.get_map())) # 2.1MB

    # raise ValueError('A very specific error happened.')

if __name__ == '__main__':
    app.run(threaded=False, host='0.0.0.0', port=80, processes=1)
    # app.run(debug=True, host='0.0.0.0', port=80)
