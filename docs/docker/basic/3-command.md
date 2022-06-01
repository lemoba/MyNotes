# 常见命令

```shell
# 1 查看docker版本
docker version

# 2 查看docker信息
docker info

# 3 docker命令列表
docker
docker [command] --help

# 4 运行容器
docker run nginx # attashed模式-前台运行
docker run -d nginx # detashed模式-后台运行
docker container nginx

# 5 停止容器
docker stop [CONTAINERID]...
docker stop $(docker ps -aq) # 停止所有容器
docker container stop [CONTAINERID]

# 6 列出运行的容器
docker ps
docker ps -a # 列出运行的容器
docker ps -aq # 列出所有容器id
docker container ls

# 7 删除容器
docker rm [CONTAINERID]
docker rm [CONTAINERID] -f # 强制删除容器
docker rm -f $(docker ps -aq) # 删除所有容器
docker container rm [CONTAINERID]

# 8 进入容器内部 -it: 交互式
docker exec -it [CONTAINERID] sh

# 9 列出所有镜像
docker images
docker images -aq

# 10 删除镜像
docker rmi [IMAGEID]
docker rmi $(docker ps -aq)
docker image rm [IMAGEID]

# 11 查看log
docker logs [IMAGEID]
docker logs -f [IMAGEID] # 实时查看日志

# 12 拉取镜像 默认latest tag:指定版本号
docker pull nginx:tag
docker pull nginx:1.20.0
docker image pull

# 13 显示详细信息
docker inspect [IMAGEID]

# 14 保存image文件
docker image save nginx:1.20.0 -o nigx.image

# 15 导入image文件
docker image load -i nigx.image

# 16 通过commit创建镜像
docker commit [IMAGEID] [IMAGENAME]

# 17 构建镜像
docker build -t -f[IMAGENAME] -t[TAG] .

#docker build -t php-composer-nginx:php74-v1.0 .

# 18 添加tag
docker tag [IMAGEID] [SOURCEINFO]

#docker tag 8042ae5858cb swr.cn-north-4.myhuaweicloud.com/lemoba/php-composer-nginx:php74-v1.0

# 19 登录docker
docker login -u [USERNAME] [URL]

# 20 清理未运行的容器
docker system prune -f

# 21 清理未使用的镜像
docker image prune -a

# 22 --rm 容器退出后自动清理
docker container run --rm -it ipinfo ipinfo

# 23 列出本地所有volume
docker volume ls

# 24 列出网络
docker network ls

# 25 详细信息
docker network inspect [NETWORKID]
```

