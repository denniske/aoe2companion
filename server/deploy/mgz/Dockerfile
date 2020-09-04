FROM python:3.8

COPY ../../mgz/requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY ../../mgz /app

ENTRYPOINT [ "python" ]

CMD [ "app.py" ]