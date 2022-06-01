# Docker-Compose

> 特定格式的YML文件

[docker compose文件的语法说明](https://docs.docker.com/compose/compose-file/) 

**下载docker-compose**

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/v2.1.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

## 1. composer文件格式

```dockerfile
version: "3.8"

services: # 容器
  servicename: # 服务名字，这个名字也是内部 bridge网络可以使用的 DNS name
    image: # 镜像的名字
    command: # 可选，如果设置，则会覆盖默认镜像里的 CMD命令
    environment: # 可选，相当于 docker run里的 --env
    volumes: # 可选，相当于docker run里的 -v
    networks: # 可选，相当于 docker run里的 --network
    ports: # 可选，相当于 docker run里的 -p
  servicename2:

volumes: # 可选，相当于 docker volume create

networks: # 可选，相当于 docker network create

```

* 案例

```dockerfile
version: "3.8"

services:
  flask-demo:
  	build:
  		context: ./flask # 目录
  		dockerfile: Dockerfile.dev # 指定Dockerfile
    image: flask-demo:latest
    environment:
      - REDIS_HOST=redis-server
    networks:
      - demo-network
    ports:
      - 8080:5000

  redis-server:
    image: redis:latest
    networks:
     	- demo-network
 
networks:
  demo-network:
```

## 2. 基本命令

```shell
# 1 后台启动 -d:后台启动 --build:重新构建修改
docker-compose up -d --build

# 2 停止
docker-compose stop

# 3 拉取镜像
docker-compose pull

# 4 构建镜像
docker-compose build

# 5 重启
docker-compose restart
```