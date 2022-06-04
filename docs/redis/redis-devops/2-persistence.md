# 持久化

> Redis支持RDB和AOF两中持久化机制，持久化功能有效地避免因进程退出造成的数据丢失问题，当下次重启时利用之前持久化的文件计科实现数据恢复。

## 1. RDB

> RDB持久化是把当前进程数据生成快照保存到硬盘的过程，触发RDB持久化过程分为手动触发和自动触发。

### 1.1 触发机制

**手动触发**

* **save命令**：阻塞当前Redis服务器，直到RDB过程完成为止，对于内存比较大的实例会造成长时间阻塞，不建议线上环境使用。
* **bgsave命令**：Redis当前进程执行fork操作创建子进程，RDB持久化过程由子进程负责，完成后自动结束。阻塞只会发送在fork阶段。

```shell
127.0.0.1:6379> bgsave
Background saving started
127.0.0.1:6379> save
OK

# 日志输出
# bgsave
25522:M 17 May 2022 14:44:37.116 * Background saving started by pid 10276
10276:C 17 May 2022 14:44:37.120 * DB saved on disk
10276:C 17 May 2022 14:44:37.121 * RDB: 2 MB of memory used by copy-on-write
25522:M 17 May 2022 14:44:37.187 * Background saving terminated with success

# save
25522:M 17 May 2022 14:49:26.342 * DB saved on disk
```

*bgsave命令是针对save阻塞问题做出的优化。因此Redis内部所有的涉及RDB的操作都采用bgsave的方式。*

**自动触发**

* "Save m n"：表示m秒内数据集存在n次修改时，自动触发bgsave
* 如果节点执行全量复制操作，主节点自动执行bgsave生成RDB文件并发送给从节点
* 执行debug reload命令重载Redis时，也会自动触发save操作
* 默认情况下执行shutdown命令时，如果没有开启AOF持久化功能则自动执行bgsave

### 1.2 bgsave流程说明

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220517150743.png" style="zoom:50%;" />

**1.** **执行bgsave命令**，Redis父进会判断当前是否存在正在执行的子进程，如RDB/AOF子进程，存在则直接返回。

**2.** **父进程fork子进程**，fork操作会阻塞父进程，通过info stats命令查看latest_fork_usec选项，获取耗时(微秒)。

```shell
127.0.0.1:6379> info stats
# Stats
...
latest_fork_usec:318
...
```

**3.** 父进程完成后，结束阻塞，继续响应其他命令。

**4. 子进程创建RDB文件**，根据父进程内存生成临时快照文件，完成后对原有文件进行**原子替换。**

```shell
# 最后一次生成RDB的时间

127.0.0.1:6379> lastsave
(integer) 1652770166

127.0.0.1:6379> info persistence
# Persistence
...
rdb_last_save_time:1652770166
...
```

**5.** 进程发送信号给父进程表示完成，父进程更新统计信息。(使用info persistence查看)

### 1.3 RDB文件的处理

* **保存**：RDB文件保存在dir配置指定的目录下，文件名通过dbfilename配置指定。可通过config set dir {newDir} 和config set dbfilename {newFileName}运行期动态执行。当下次运行时RDB文件会保存到新目录。
* **压缩**：Redis默认采用LZF算法对RDB文件进行压缩处理，可通过config set rdbcompression {yes|no}动态修改。
* **校验**：Redis提供redis-check-rdp工具检测RDB文件并获取对应的错误信息。

### 1.4 RDB的优缺点

**优点：**

* RDB是一个紧凑压缩的二进制文件，代表Redis在某个时间点上的数据快照。非常适用于备份，全量复制等场景。如每6个小时执行bgsave备份，并上传到远程机器上用于灾难恢复。
* Redis加载RDB恢复数据远远快于AOF的方式。

**缺点**：

* RDB方式数据无法做到实时持久化/秒级持久化。因为bgsave每次运行都要执行fork操作创建子进程，属于重量级操作，频繁执行成本过高。
* RDB文件使用特定二进制格式保存，Redis演进过程中存在多个版本的RDB，可能存在老版本Redis无法兼容新版RDB格式的问题。

## 2. AOF

> 以独立日志的方式记录每次写命令，重启时再重新执行AOF文件中的命令以达到恢复数据的目的

### 2.1 使用AOF

* 默认不开启，如果要开启需要设置：appendonly yes
* AOF文件名通过appendfilename来设置，默认文件名是appendonly.aof
* 保存路径通过dir来设置

**AOF的工作流程如下图所示：**

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220601192824.png" style="zoom:50%;" />

* 所有的写入命令会追加到aof_buf(缓冲区)中
* AOF缓冲区根据对应的策略向硬盘做同步操作
* 随着AOF文件越来越大，需要定期对AOF文件进行重写，达到压缩的目的
* 当redis服务器重启时，可以加载AOF文件进行数据恢复

### 2.2 写命令

> AOF命令写入的内容直接是文本协议格式

**为什么采用文本协议？**

* 文本协议具有很好的兼容性
* 开启AOF后，所有写入命令都包含追加操作，直接采用协议格式，避免了二次处理开销
* 文本协议具有可读性，方便直接修改和处理

**AOF为什么把命令追加到aof_buf中?**

* Redis使用单线程相应命令，如果每次写入AOF文件命令都追加到硬盘，那么性能完全取决于当前硬盘负载
* Redis可以提供多种缓冲区同步硬盘的策略，在性能和安全性方面做出平衡

### 2.3 文件同步

> Redis提供了多种AOF缓冲区同步文集策略，由参数appendfsync控制

| 可配置值 | 说明                                                         |
| :------: | :----------------------------------------------------------- |
|  always  | 命令写入aof_buf后调用系统fsync操作同步到AOF文件，fsync完成后线程返回 |
| everysec | 命令写入aof_buf后调用系统write操作，write完成后线程返回。fsync同步文件操作由专门线程每秒调用一次 |
|    No    | 命令写入aof_buf后调用系统write操作，不对AOF文件做fsync同步，同步硬盘操作由操作系统负责，通常同步周期最长30秒 |

* 配置为always时，每次写入都要同步AOF文件，其性能取决于硬盘速度，与Redis高性能特性背道而驰，不建议配置

* 配置为no， 由于操作系统每次同步AOF文件的周期不可控，而且会加大每次同步硬盘的数据量，虽然提升了性能，但数据安全性无法保证
* 配置为everysec，建议的同步策略，也是默认配置，能做到兼顾性能和数据安全性。理论上只有在系统突然宕机的情况下丢失1秒的数据

### 2.4 重写机制

> AOF文件重写是把Redis进程内的数据转化为写命令同步到新的AOF文件的过程

**为什么要重写？**

AOF重写除了降低文件占用的空间，另外更小的AOF文件可以更快地被Redis加载。

**重写后的AOF文件为什么可以变小**

* 进程内已经超时的数据不再写入文件
* 旧的AOF文件含有无效命令(del key1、hdel key2、srem keys等)，重写使用进程内数据直接生成，这样新的AOF文件只保留最终数据的写入命令
* 多条写命令可以合并为一个(lpush list a、lpush list b、lpush list c 可以转换为：lpush list a b c)。为了防止单条命令过大造成客户端缓冲区溢出，对于list、set、hash、zset等类型操作，以64个元素为届拆分为多条
