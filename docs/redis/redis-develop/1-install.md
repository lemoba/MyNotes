# 安装
[下载地址](https://download.redis.io/releases/)

```shell
wget https://download.redis.io/releases/redis-5.0.1.tar.gz
tar -zxvf redis-5.0.1.tar.gz -C /usr/local
cd /usr/local
ln -s redis-5.0.1 redis
cd redis
make && make install

# 显示版本号
redis-cli -v 	# redis-cli 5.0.1

# 配置文件
mkdir -p /etc/redis
cp redis.conf /etc/redis/

# 设置守护经常运行
# redis.conf
daemonize yes

# 启动
redis-server /etc/redis/redis.conf

# Ping
redis-cli ping 	# Pong 成功启动

# 设置开机启动
cp /usr/local/redis/utils/redis_init_script /etc/init.d/redis-server
chmod +x /etc/init.d/redis-server
chkconfig --add redis-server # 添加到开机启动
chkconfig --list # 查看信息