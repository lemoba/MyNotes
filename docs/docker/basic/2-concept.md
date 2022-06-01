# 基本概念

### 1. Image VS Container 

**image镜像**

* Docker image 是一个read-only文件
* 这个文件包含文件系统，源码，库文件，依赖，工具等一些运行application所需要的文件
* 可以理解成一个模板
* docker image具有分层的概念

**container容器**

* 一个运行中的docker images
* 实质是复制image并在image最上层加上一层read-write的层(container layer, 容器层)
* 基于同一个image可以创建多个container

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220316182335099.png" style="zoom:50%;" />

**docker image的获取**

* 自己制作
* 从registery拉取(docker hub)



### 2. 两种模式

* Attached模式：前台运行
* Detached模式：后台运行

### 3. 容器和虚拟机的区别

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220316191008188.png" style="zoom:50%;" />

### 4. docker container run背后发生了什么？

```shell
docker container run -dp 8000:80 --name webhost nginx 
```

1. 在本地查找是否有nignx这个image镜像
2. 有则使用本地，没有则去远程imgage registry查找nignx镜像(docker hub)
3. 下载最新版的nignx镜像(nignx:latest)
4. 基于ningx镜像来创建一个新的容器，并且准备运行
5. docker engine分配给这个容器一个虚拟IP地址
6. 在宿主机上打开8000端口并把容器的80端口转发到宿主机上
7. 启动容器，运行指定的命令(使用shell脚本启动nginx)

### 5. 什么是dockerfile?

1. dockerfile是用于构建docker镜像的文件
2. dockerfile里包含了构建镜像所需的"指定"
3. dockerfile有其特定的语法规则

```dockerfile
# DEBIAN_FRONTEND=noninteractive 取消交互式
# --no-install-recommends 不安装非必须的依赖包
FROM ubuntu:21.04
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y python3.9 python3-pip python3.9-dev
ADD hello.py /
CMD ["python3", "/hello.py"]
```