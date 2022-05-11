# 数据库

## 1. 服务器中的数据库

* dbnum 默认为16， 由redis.conf中的database选项决定

```c
//redis.h/redisServer
struct redisServer {
    ...
    // 数组中保存着服务器中所有的数据
    redisDb *db;

    // 服务器的数据库数量
    int dbnum;
    ...
}
```

## 2. 切换数据库

> 客户端默认的目标数据库为0号 可使用select命令来切换

```shell
127.0.0.1:6378> keys *
1) "name"
2) "redis"
127.0.0.1:6378> get name
"ranen"
127.0.0.1:6378> select 2
OK
127.0.0.1:6378[2]> dbsize
(integer) 0
127.0.0.1:6378[2]> set name redis
OK
127.0.0.1:6378[2]> get name
"redis"
```

```c
//redis.h
typedef struct redisClient {
    ...
 	  // 当前正在使用的数据库
    redisDb *db;

    // 当前正在使用的数据库的 id
    int dictid;	
  	...
}redisClient;
```

**select 命令就是变redisclient.db的指针，让它指向服务器中不同的数据库。**

## 3. 数据库键空间

> redis是一个键值对的数据库服务器，每个数据库都有redis.h/redisDb结构表示， 其中dic字典中保存了数据库中所有的键值对，这个字典称为键空间(key space)

```c
typedef struct redisDb {
  	...
    // 数据库键空间，保存着数据库中的所有键值对
    dict *dict;                 /* The keyspace for this DB */
    ...

} redisDb;
```

* 键空间的键就是数据库的键，每个键名都是一个字符串对象
* 键空间的值就是数据库的值，每个值可以是任意一种redis对象(字符串、列表、哈希表、集合、有序集合

**针对数据库的一系列操作(添加、删除、更新，取值等)本质上是通过对键空间字典进行操作操作实现的**

## 4. 读写键空间时的维护操作

> 对redis进行读写时，服务器不仅会对键空间执行指定的读写操作，还会执行一些额外的维护操作

* 在读取一个键之后(读/写)，服务器会判断该键是否存在来更新服务器的键空间命中(hit)次数或键空间不命中(miss)次数

```shell
# info stats
127.0.0.1:6378[2]> info stats
# Stats
...
keyspace_hits:288
keyspace_misses:1
...
```

* 在读取一个键后，服务器会更新键的LRU(最少最近使用)时间，用于计算键的闲置时间

```shell
# OBJECT idletime key
127.0.0.1:6378[2]> keys *
1) "name"
127.0.0.1:6378[2]> OBJECT idletime name
(integer) 2028
127.0.0.1:6378[2]> OBJECT idletime name
(integer) 2035
127.0.0.1:6378[2]> get name
"redis"
127.0.0.1:6378[2]> OBJECT idletime name
(integer) 3
```

* 如果在读取一个键时发现改键已经过期，那么服务器会先删除这个过期键再进行其他操作
* 如果client使用功能WATCH监视了某个键，那么再对这个被监视的键进行修改之后，会将这个键标记为脏(dirty)， 从而让事务程序注意到该键已经被修改
* 如果服务器开启了数据通知功能，那么在对键进行修改后，服务器将按配置发送相应的数据库通知

## 5. 设置键的生存时间或过期时间

> 通过expire和pexpire命令，client可以以秒或毫秒为数据库中的键设置生存时间(Time TO Live， TTL)。当TTL=0时，服务器会删除该键

| 命令      | 作用                                  |
| --------- | ------------------------------------- |
| EXPIRE    | 设置过期时间为**ttl秒**               |
| PEXPIRE   | 设置过期时间为**ttl毫秒**             |
| EXPIREAT  | 设置过期时间为**timestamp秒时间戳**   |
| PEXPIREAT | 设置过期时间为**timestamp毫秒时间戳** |
| PEXSIST   | 移除键的过期时间                      |
| TTL       | 查看键剩余生存时间                    |

**EXPIRE PEXPIRE EXPIREAT 命令都是使用PEXPIREAT命令来实现的**

* EXPIRE 转换成 PEXPIRE再转换成PEXPIREAT

* EXPIREAT 转换为PEXPIREAT

```shell
127.0.0.1:6378[2]> EXPIRE name 1111
(integer) 1
```

### 5.1. 保存过期时间

* 过期字典的键是一个指针，指向键空间中的某个键对象(即某个数据库键)
* 过期字典的值是一个long long类型的整数，这个整数保存了键所指向的数据库键的过期时间(**毫秒精度的UNIX时间戳**)

```c
typedef struct redisDb {
  	...
    // 键的过期时间，字典的键为键，字典的值为过期事件 UNIX 时间戳
    dict *expires;              /* Timeout of keys with a timeout set */
    ...

} redisDb;
```

* PEXPIREAT伪码定义

```python
def PEXPIREAT(key， expire_time_in_ms)
{
  	# 如果给定的键不存在于键空间，则返回
  	if key not in redisDb.dict:
  			return 0;
  
    # 在过期字典中关联键和过期时间
  	redisDb.expires[key] = expire_time_in_ms
    
    # 设置成功
    return 1;
}
```

### 5.2. 移除过期时间

> PERSIST命令可以移除一个键的过期时间

```shell
127.0.0.1:6378[2]> PERSIST name
(integer) 1
127.0.0.1:6378[2]> ttl name
(integer) -1
```

* PERSIST伪码定义

```python
def PERSIST(key)
{
  	# 如果给定的键不存在于过期字典中，则返回
  	if key not int redisDb.expires:
  			return 0;
  
    # 从过期字段中移除该键
    redisDb.expires.remove(key)
    
  	# 移除成功
    return 1;
}
```

### 5.3. 计算并返回剩余生存时间

> TTL以秒为单位返回键的剩余生存时间，而PTTL则是以毫秒为单位返回键的剩余生存时间

* PTTL伪码定义

```python
def PTTL(key)
	# 键不存在库中
  if key not in redisDb.dict:
    return -2
  
  # 获取键的过期时间 没有则为None
  expire_time_in_ms = redisDb.expries.get(key)
  
  # 键没有设置过期时间
  if expire_time_in_ms is None:
    return -1
  
  # 获得当前时间
  now_ms = get_current_unix_timestamp_in_ms()
  
  # 过期时间 - 当前时间
  return (expire_time_in_ms - now_ms)

def TTL(key)
	ttl_in_ms = PTTL(key)
  
  if ttl_in_ms < 0:
    return ttl_in_ms
  else:
    # 将毫秒转成秒
    return ms_to_sec(ttl_in_ms)
```

### 5.4. 过期键的判断

* 检查给定键是否存在于过期字段中：如果存在，获取键的过期时间
* 检查当前UNIX时间戳是否大于键的过期时间：如果是则表明键已过期，反之还为过期

* 伪代码实现

```python
def is_expired(key)
	# 获取键的过期时间
  expire_time_in_ms = redisDb.expire.get(key)
  
  if expire_time_in_ms is None:
    return false
  
  # 获取当前linux时间戳
  now_ms = get_current_unix_timestamp_in_ms()
  
  # 检查当前时间是否大于键的过期时间
  if now_ms > expire_time_in_ms:
    # 过期
    return True
  esle:
    # 未过期
    return False
```

## 6. AOF、RDB和复制功能对过期键的处理

### 6.1 生成RDB文件

在执行save或者bgsave创建一个新的RDB文件时，程序会检测数据库中的键，已过期的键不会被保存到新的RDB文件中

**过期键不会对新生成的RDB文件有影响**

### 6.2 载入RDB文件

* **主服务器**：只会将未过期键载入到数据库中，过期键则忽略， 不会产生影响
* **从服务器**：不论是否过期全部载入到数据库中，但是在主从同步的时候，从数据库就会被清空，不会产生影响

### 6.3 AOF文件写入

* 如果数据库中某个键已经过期，但它还没有被惰性删除或者定期删除，AOF文件不会产生影响
* 当过期键被惰性删除或定期删除之后，程序会向AOF文件追加一条DEL命令，来显示地记录该键已被删除

* 举例：如果客户端使用GET name， 来访问过期的键时，服务器会执行以下三个操作：
    * 从数据库中删除name键
    * 追加一条DEL name命令到AOF文件
    * 想执行GET命令的客户端返回空回复(nil)

### 6.4 AOF重写

**已过期的键不会保存到重写后的AOF文件中**

### 6.5 复制

在复制模式下，从服务器的删除动作是由主服务器的控制：

* 主服务器删除一个键之后，会显式地向所有从服务器发送一个DEL命令，告知从服务器删除这个过期键
* 从服务器接受客户端读命令时，即使碰到过期的键也不会进行删除，而是像处理未过期键一样
* 从服务器只有在接到主服务器发来的DEL命令之后，才会主动删除过期键

## 7. 数据库通知

数据库通知是在2.8版本新增的功能