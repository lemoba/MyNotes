# docker的存储

> 默认情况下，在运行中的容器里创建的文件，被保存在一个可写的容器层：

* 如果容器被删除，则数据也没有了
* 这个可写的容器层是和特定的容器绑定的，也就是这些数据无法方便的和其他容器共享

**Docker主要提供了两种方式做数据的持久化**

  * Data Volume：由Docker管理 (/var/lib/docker/volumes/Liunx)，持久化数据的最好方式
  * Bind Mount：由用户指定存储的数据具体mount在系统什么位置

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220317123300709.png" style="zoom:50%;" />

**命令**

```shell
docker volume ls
docker volume inspece [VOLUMENNAME]

# -v 设置volume
docker run -d -v cron-data:/app my-cron
```

**安装mysql5.7**

```shell
# 1
docker pull mysql:5.7

# 2
docker container run --name some-mysql -e MYSQL_ROOT_PASSWORD=root -d -v mysql-data:/var/lib/mysql mysql:5.7
```

**多个机器之间的容器共享数据**

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220317164441701.png" style="zoom:50%;" />