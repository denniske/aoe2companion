FROM pypy:3.7-7.3.2

# Run apt-get, to install the SSH server, and supervisor
RUN apt-get update \
    && apt-get install -y supervisor \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD requirements.txt /app/requirements.txt

# Run python's package manager and install the flask package
RUN pip install -r requirements.txt

ADD . /app

# start scripts
COPY scripts/runapp.sh /usr/bin/

# supervisor config
ADD supervisor/app.conf /etc/supervisor/conf.d/

# Run the chmod command to change permissions on above file in the /bin directory
RUN chmod 755 /usr/bin/runapp.sh

# Default environmental variables
ENV SERVER_PORT 80
ENV GUWORKERS 4
ENV GUWORKERS_CONNECTIONS 1001

# Configure ports
EXPOSE 80

# run commands in supervisor
CMD ["supervisord", "-n"]
