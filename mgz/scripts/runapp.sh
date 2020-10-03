#!/bin/sh
gunicorn --chdir /app/src --bind 0.0.0.0:$SERVER_PORT server:app --worker-connections $GUWORKERS_CONNECTIONS --workers $GUWORKERS --log-file /app/gunicorn.log
