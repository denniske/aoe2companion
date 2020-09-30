import json
import time
import aoeapi
from flask import Flask
app = Flask(__name__)
from flask import request
from flask import jsonify

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
            continue
        except RuntimeError:
            raise RuntimeError("could not download valid rec: %s", match_id)
            continue

        # print(filename)

        start = time.time()
        with open('recs/' + filename, 'rb') as handle:
            data = handle.read()

        handle = io.BytesIO(data)
        # playback = self.playback
        # if rec_path.endswith('aoe2record') and os.path.exists(rec_path.replace('.aoe2record', '.json')):
        #     playback = open(rec_path.replace('.aoe2record', '.json'))
        summary = mgz.summary.Summary(handle, None)

        end = time.time()
        print('process', end - start, 's')

        # print('--- BREAK')

        # for player2 in summary.get_players():
        #     print(player2['name'] + ': ' + str(player2['winner']))

        break

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

        # print(json.dumps(summary))

        # print(summary.get_players())
        # print(json.dumps(summary.get_players()))

    return jsonify(players)


if __name__ == '__main__':
    app.run(threaded=False, host='0.0.0.0', port=80, processes=3)
    # app.run(debug=True, host='0.0.0.0', port=80)
