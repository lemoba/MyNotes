# 构建镜像

## 1. 基本命令

```shell
# 1 FROM 				# 选择基础镜像
# 2 RUN  				# 运行命令
# 3 COPY 				# 复制文件
# 4 ADD  				# 复制文件，如果是压缩文件则自动解压
# 5 WORKDIR 		# 设置当前工作目录，类似于cd，但是如果目标目录不存在则会创建
# 6 ENV					# 设置环境变量
# 7 ARG					# 设置环境变量
# 8 CMD					# 容器启动命令
# 9 ENTRYPOINT	# 容器启动命令
# 10 EXPOSE			# 对外定义暴露端口
# 11 VOLUME 		# 持久化数据
```

### 1.1 文件复制和目录操作

**复制普通文件**

> COPY和ADD都可以把local的一个文件复制到镜像里，如果目标目录不存在，则会自动创建

**复制压缩文件**

> 如果复制的是一个gzip等压缩文件，ADD会帮助我们自动去解压缩文件

### 1.2 构建参数和环境变量(ARG vs ENV)

* ARG仅仅在构建镜像的时候可以使用，一旦构建完成在容器中是不能使用的，可以在构建是通过--build-arg来动态指定
* ENV可以在镜像构建完成后可以在容器中使用

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220317113950638.png" style="zoom:50%;" />

### 1.3 CMD容器启动命令

* shell格式
    * CMD echo "hello"
    * ENTRYPOINT echo "hello"
* Exec格式
    * CMD["echo", "hello"]
    * ENTRYPOINT["echo", "hello"]

CMD可以用来设置容器启动时默认会执行的命令

* 容器启动时默认执行的命令
* 如果docker container run启动容器时指定了其他命令，则CMD命令会被忽略
* 如果定义了多个CMD，只有最后一个会被执行

**ENTRYPONT和CMD区别**

* CMD设置的命令，可以在docker container run时传入其他的命令，覆盖掉CMD的命令，但是ENTRYPOINT所设置的命令是一定会被执行的
* ENTRYPOINT和CMD可以联合使用，ENTRYPOINT设置执行的命令，CMD传递参数

**实例构建falsk应用**

```dockerfile
FROM python:3.9.5-slim
COPY app.py /src/
RUN pip install flask

WORKDIR /src
ENV FLASH=app.py

EXPOSE 5000
 
CMD ["flask", "run", "-h", "0.0.0.0"]
```

## 2. 合理使用缓存

* 一旦发现文件有变动，docker从当前行向下都不会使用缓存
* 将经常需要变动的文件放入行末
