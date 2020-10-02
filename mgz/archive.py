import json
import time
import aoeapi
import os
from flask import Flask
app = Flask(__name__)
from flask import request
from flask import jsonify
from flask import abort

import io
import mgz.summary

@app.route("/")
def home():
    return "Hello, Flask2!"


@app.route("/won")
def won():
    match_id = request.args.get('match_id')

    try:
        match = aoeapi.get_match(match_id)
    except aoeapi.AoeApiError:
        raise RuntimeError('could not get match')

    players = match['players']
    # print(json.dumps(match['players2']))

    for player in players:
        if not player['url']:
            continue
        try:
            start = time.time()
            filename = aoeapi.download_rec(player['url'], 'recs')
            end = time.time()
            # print('download', end - start, 's')
        except aoeapi.AoeApiError:
            # raise RuntimeError("could not download valid rec: %s", match_id)
            print('error')
            continue
        except RuntimeError:
            raise RuntimeError("could not download valid rec: %s", match_id)
            print('error')
            continue

        print('recs/' + filename)

        start = time.time()
        with open('recs/' + filename, 'rb') as handle:
            data = handle.read()

        handle = io.BytesIO(data)
        summary = mgz.summary.Summary(handle, None)

        end = time.time()
        print('process', end - start, 's')

        # print('--- BREAK')

        # for player2 in summary.get_players():
        #     print(player2['name'] + ': ' + str(player2['winner']))

        os.remove('recs/' + filename)

        return jsonify({
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
        })

        # print(json.dumps(summary.get_hash())) # non serializable
        # print(json.dumps(summary.get_header())) # non serializable
        # print(json.dumps(summary.get_version())) # non serializable

        # print(json.dumps(summary.get_objects())) #80KB
        # print(json.dumps(summary.get_map())) # 2.1MB

        # print('get_completed', summary.get_completed())
        # print('get_chat', summary.get_chat())
        # print('get_objects', summary.get_objects())
        # print('get_hash', summary.get_hash())
        # print('get_map', summary.get_map())
        # print('get_dataset', summary.get_dataset())
        # print('get_diplomacy', summary.get_diplomacy())
        # print('get_duration', summary.get_duration())
        # print('get_encoding', summary.get_encoding())
        # print('get_file_hash', summary.get_file_hash())
        # print('get_header', summary.get_header())
        # print('get_version', summary.get_version())
        # print('get_language', summary.get_language())
        # print('get_mirror', summary.get_mirror())
        # print('get_owner', summary.get_owner())
        # print('get_platform', summary.get_platform())
        # print('get_postgame', summary.get_postgame())
        # print('get_teams', summary.get_teams())
        # print('get_start_time', summary.get_start_time())
        # print('get_restored', summary.get_restored())
        # print('get_ratings', summary.get_ratings())
        # print('get_profile_ids', summary.get_profile_ids())

    abort(404)
    # return jsonify(match)
    # return jsonify(players)


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

    return jsonify({
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
    })

    # print(json.dumps(summary.get_hash())) # non serializable
    # print(json.dumps(summary.get_header())) # non serializable
    # print(json.dumps(summary.get_version())) # non serializable

    # print(json.dumps(summary.get_objects())) #80KB
    # print(json.dumps(summary.get_map())) # 2.1MB

if __name__ == '__main__':
    app.run(threaded=False, host='0.0.0.0', port=80, processes=3)
    # app.run(debug=True, host='0.0.0.0', port=80)
