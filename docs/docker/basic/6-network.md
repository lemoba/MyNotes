# docker的网络

## 1. 端口转发

> -p [PORT1]:[PORT2] --PORT1: 本地端口 --PORT2: 容器内端口

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318135734323.png" style="zoom:50%;" />

```shell
docker container run -d --rm --name web -p 8000:80 nginx-alpine:v.1.0

docker container inspect --format '{{.NetworkSettings.IPAddress}}' web
#172.17.0.3

docker container run -d --rm --name client busybox /bin/sh -c "while true; do sleep 3600; done"

docker container exec -it client wget http://172.17.0.3


sudo iptables -t nat -nvxL
# 如下图所示
```

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318141333226.png" style="zoom:50%;" />

## 2. 常见网络命令

* ifconfig | ip addr

* ping
* telnet：测试端口的连通性
* tracepath：路径探测跟踪
* curl： [请求web服务](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

## 3. 网桥

| <img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318150548920.png" style="zoom:50%;" /> | <img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318150400457.png" style="zoom:50%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

```shell
# 1 查看网桥
ifconfig

docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:91ff:fe42:c15e  prefixlen 64  scopeid 0x20<link>
        ether 02:42:91:42:c1:5e  txqueuelen 0  (Ethernet)
        RX packets 27233  bytes 2141194 (2.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 27279  bytes 48324171 (46.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 2 列出网络
docker network ls

NETWORK ID     NAME      DRIVER    SCOPE
33618a38984a   bridge    bridge    local
381f2cfd273d   host      host      local
bf8f85b3153d   none      null      local

yum install -y bridge-utils

# 3 显示bridge
brctl show

# 4 路由表
ip route
```

### 3.1 容器对外通信

* 查看路由 ip

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318151122562.png" style="zoom:50%;" />

* iptable 转发规则

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220318151244345.png" style="zoom:50%;" />

* NAT转换

    > 在公有地址和私有地址之间进行转换

### 3.2 bridge网络

```shell
# 1 创建网络
docker network create -d bridge mybridge

# 2 --network [BRIDGENAME] 指定网络
docker container run -d --rm --name client3 --network mybridge busybox /bin/sh -c "while true; do sleep 3600; done"

# 3 指定容器连接的网络
docker network connect [BRIDGE_NAME] [CONTAINER_NAME]
#docker network connect bridge client3

# 4 删除容器连接的网络
docker network disconnect [BRIDGE_NAME] [CONTAINER_NAME]
```

### 3.3 host网络

> 和宿主机共享同一网络

## 4. 网络命名空间

> linux的Namespace是一种隔离技术

**Namepace**

* user namespace
* process namespace
* network namespace