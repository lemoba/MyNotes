# Docker Swarm

## 1. 单节点

```shell
# 查看swarm激活状态
docker info	#Swarm: inactive

# 激活swarm
docker swarm init # Swarm: inactive

# 查看结点信息
docker node ls

# 加入结点
docker swarm join --token SWMTKN-1-42fgufb0zrr4k72eh78k9oa8qlgsfvbuzm418tg8rkfoh8ec12-1xzie5n0rd2ab809om9tfh9l6 10.130.16.119:2377

# 退出集群
docker swarm leave --force

# 创建service
docker service create

# 列出services
docker service ls

# 显示详细信息
docker service ps [SERVICEID]

# 复制多个service
docker service update [SERVICEID] --replicas [NUM]
#docker service update x4s --replicas 3

# 删除service
docker service rm [SERVICEID]
```

**docker swarm init背后发生了什么**

主要是PKI和安全相关的自动化

* 创建swarm集群的根证书
* manager结点的证书
* 其他节点加入集群需要的tokens

创建Raft数据库用于存储证书，配置，密码等数据

## 2. 多节点集群

```shell
# 初始化swarm
docker swarm init

# 加入swarm
docker swarm join --token SWMTKN-1-38v1jkv3fjqhz9j72p2il4i30nhgxrjfvbsh1z56hy9j9if7f5-eo3axzmazx7t00obnd211hpov 139.198.175.236:2377

# 在manager节点上创建service
docker service create --name web nginx

# 复制三份
docker service update web --replicas 3

# 水平扩展
docker service scale web=4

# 创建overlay网络
docker network create -d overlay mynet

# 创建服务
docker service create --network mynet --name test --replicas 2 busybox ping 8.8.8.8

# 抓包
sudo tcpdump -i enp0s8 port 4789 # 4789 vxlan
```

## 3. 网络

### 3.1 overlay网络

**容器内部访问**

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220319145246818.png" style="zoom:50%;" />

### 3.1 ingress 网络

> 主要是为了实现把service的服务端口对外发布出去，让其能够被外部网络访问到

```shell
docker service create --name web --network mynet -p 8000:80 --replicas 3 containous/whoami

iptables -nvL -t nat

docker run -it --rm -v /var/run/docker/netns:/netns --privileged=true nicolaka/netshoot nsenter --net=/netns/ingress_sbox sh
```