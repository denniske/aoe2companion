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
import subprocess

app = Flask(__name__)

# import gc
# import tracemalloc
# import psutil
# process = psutil.Process(os.getpid())
# tracemalloc.start()
s = None
# global_var = []

# def _get_foo():
#     global global_var
#     global_var.append([1, "a", 3, True] * 10000)  # This is our (amplified) memory leak
#     return {'foo': True}

# @app.route('/foo')
# def get_foo():
#     gc.collect()  # does not help
#     return _get_foo()
#     return 'gc collected'

# @app.route('/warmup')
# def get_warmup():
#     return 'warmup'
#     # return 'gc collected'
#
# @app.route('/gc')
# def get_gc():
#     gc.collect()  # does not help
#     return 'gc collected'
#
# @app.route('/memory')
# def print_memory():
#     return {'memory': process.memory_info().rss}
#
#
# @app.route("/snapshot")
# def snap():
#     global s
#     if not s:
#         s = tracemalloc.take_snapshot()
#         return "taken snapshot\n"
#     else:
#         lines = []
#         top_stats = tracemalloc.take_snapshot().compare_to(s, 'lineno')
#         for stat in top_stats[:5]:
#             lines.append(str(stat))
#         return "\n".join(lines)

@app.route("/replay")
def replay():
    match_id = request.args.get('match_id')
    profile_id = request.args.get('profile_id')

    # cmd = subprocess.run(["/Users/denniskeil/Downloads/pypy3.7-v7.3.2-osx64/bin/pypy", "process.py", match_id, profile_id], capture_output=True)
    cmd = subprocess.run(["pypy", "process.py", match_id, profile_id], capture_output=True)
    if cmd.returncode != 0:
        return jsonify({"error": cmd.stderr.decode() })
    return jsonify(json.loads(cmd.stdout.decode()))

if __name__ == '__main__':
    app.run(threaded=False, host='0.0.0.0', port=80, processes=1)
    # app.run(debug=True, host='0.0.0.0', port=80)
