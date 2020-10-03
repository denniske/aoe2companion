import os
from datetime import datetime
from flask import Flask
from werkzeug.contrib.fixers import ProxyFix

app = Flask(__name__)

app.wsgi_app = ProxyFix(app.wsgi_app)

flask_debug = os.environ.get("FLASK_DEBUG", False)

app.config.update({"DEBUG": bool(flask_debug)})


@app.route("/")
def index():
    a = datetime.now()
    return "Hello, World from PyPy 3, Gunicorn and Gevent! {}".format(a.strftime("%Y-%m-%d %H:%M:%S.%f"))


# Following code is executed when running the server directly, for development
if __name__ == "__main__":
    # NB: for the server port, read an environmental variable called "SERVER_PORT", or use a default value
    SERVER_PORT = os.environ.get("SERVER_PORT", "8000")
    app.run(host="", port=int(SERVER_PORT))