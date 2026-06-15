
export SERVICE_NAME=web
export APP_NAME=${GAME}-${SERVICE_NAME}
export IP=23.88.13.76

ssh -o StrictHostKeyChecking=no root@${IP} "docker ps -q -f name=${APP_NAME}.web.* | xargs -L 1 -P `docker ps | wc -l` docker logs --since 1h -f"
