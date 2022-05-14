# 字典

> 字典，又称符号表，关联数组或者映射，是一种用于保存键值对的抽象数据结构。
>
> 字典中的每个键都是唯一的，值可以不同

## 1. 字典的实现

### 1.1 哈希表

> 哈希表是根据关键码的值而直接进行访问的数据结构

**结构定义**

```c
/*
 * dict.h/dictht
 * 哈希表
 * 每个字典都使用两个哈希表，从而实现渐进式 rehash 。
 */
typedef struct dictht {
    
    // 哈希表数组
    dictEntry **table;

    // 哈希表大小
    unsigned long size;
    
    // 哈希表大小掩码，用于计算索引值
    // 总是等于 size - 1
    unsigned long sizemask;

    // 该哈希表已有节点的数量
    unsigned long used;

} dictht;
```

* **table**：表示一个数组，每个元素都指向dictEntry结构的指针，每个dictEntry结构保存着一个键值对
* **size**：表示哈希表的大小(dictEntry)
* **used**：表示哈希表当前已有的节点数量
* **sizemask**：总是等于size - 1， 它和哈希值一起决定一个键应该被放到table数组的哪个索引上面

### 1.2 哈希表节点

**结构定义**

```c
/*
 * 哈希表节点
 */
typedef struct dictEntry {
    
    // 键
    void *key;

    // 值
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
    } v;

    // 指向下个哈希表节点，形成链表
    struct dictEntry *next;

} dictEntry;
```

* **key**：保存着键值对中的键
* **v**：保存着键值对中的值，可以是一个指针、uint64_t整数或者int64_t整数
* **next**：指向另一个哈希表节点的指针，构成一个单链表，以此来解决哈希冲突(collsion)问题

### 1.3 字典

**结构定义**

```c
/*
 * 字典
 */
typedef struct dict {
    // 类型特定函数
    dictType *type;

    // 私有数据
    void *privdata;

    // 哈希表
    dictht ht[2];

    // rehash 索引
    // 当 rehash 不在进行时，值为 -1
    int rehashidx; /* rehashing not in progress if rehashidx == -1 */

    // 目前正在运行的安全迭代器的数量
    int iterators; /* number of iterators currently running */

} dict;
```

> type属性和privdata属性是针对不同类型的键值对，为创建多态字典而设置的。

* **type**：指向dictType结构的指针，每个dictType结构保存了一簇用于操作特定类型键值对的函数，Redis会为用途不同的字段设置不同的类型特定函数。

* **privdata**：保存了需要传给那些类型特定函数的可选参数。

```c
/*
 * 字典类型特定函数
 */
typedef struct dictType {

    // 计算哈希值的函数
    unsigned int (*hashFunction)(const void *key);

    // 复制键的函数
    void *(*keyDup)(void *privdata, const void *key);

    // 复制值的函数
    void *(*valDup)(void *privdata, const void *obj);

    // 对比键的函数
    int (*keyCompare)(void *privdata, const void *key1, const void *key2);

    // 销毁键的函数
    void (*keyDestructor)(void *privdata, void *key);
    
    // 销毁值的函数
    void (*valDestructor)(void *privdata, void *obj);

} dictType;
```

* **ht**：是一个包含两个项的数组，数组中每一项都是一个dictht哈希表，一般情况下，字典只使用ht[0]哈希表，ht[1]哈希表只会在对ht[0]进行rehash时使用。
* **rehashidx**：它记录了rehash目前的进度，如果目前没有在进行rehash，那么它的值为-1。

## 2. 哈希算法

> 当要将一个新的键值对添加到字典里面时，程序需要先根据键值对的键计算出哈希值和索引值，然后再根据索引值，将包含新键值对的哈希表节点放到哈希表数组的指定索引上面

**计算哈希值和索引值**

```c
// 使用字典设置的哈希函数，计算键key的哈希值
hash = dict->type->hashFunction(key);

// 根据哈希表的sizemask属性和哈希值，计算出索引值
// 根据情况不用，ht[x]可以是h[0]或者h[1]
index = hash & dict->ht[x]->sizemask; // 放入dictEntry数组index位置上
```

*MurmurHash算法最初由Austin Appleby于2008年发明，这种算法的有点在于，即使输入的键是有规律的，算法仍能给出一个很好的随机分布性，并且算法的计算速度也非常快。*

[参考算法的主页](http://code.google.com/p/smhasher)

## 3. 解决键冲突

> 当有两个或者以上数量的键被分配到了哈希表数组的同一个索引上，我们称这些键发生了冲突(collision)

Redis的哈希表使用链地址发来解决冲突，每个哈希表节点都有一个next指针，多个节点可以用next指针构成一个单链表。由于dictEntry节点组成的链表没有指向链表**尾部**的指针，所以Redis采用**头插法**来插入节点。

## 4. rehash

> 随着操作的不断执行，哈希表保存的键值对会逐渐地增多或减少，为了让哈希表的负载因子(load factor)维持在一个合理的范围区间，当哈希表保存的键值对数量太多或者太少时，程序需要对哈希表的大小进行相应的扩展或者收缩。

### 4. 1 rehash的步骤

**1.**  为字典的ht[1]哈希表分配空间，这个哈希表的空间大小取决于要执行的操作，以及ht[0]当前包含的键值对数量(也即是ht[0].used属性的值)：

* 如果执行的是扩展操作，那么ht[1]的大小为第一个大于等于ht[0].used*2的2^n。
* 如果执行的是收缩操作，那么ht[1]的大小为第一个大于等于ht[0].used的2^n。

**2.** 将保存在ht[0]中的所有键值对对rehash到ht[1]上面：rehash指的是重新计算键的哈希值和索引值，然后将键值对放置到ht[1]哈希表的指定位置上。

**3.** 将ht[0]包含的所有键值对都迁移到ht[1]之后(ht[0]变为空表)，释放ht[0]，将ht[1]设置为ht[0]，并在ht[1]新创建一个空白哈希表，为下一次rehash做准备。

**举例：**

* 1. 假设ht[0].used当前的值为4，4 * 2 =  8 = 2^3， 8恰好是第一个大于等于4的2的n次方，所以程序会将ht[1]哈希表的size设置为8。
    2. 将ht[0]上的所有键值对都rehash到ht[1]上。
    3. 释放ht[0]， 并将ht[1]设置为ht[0]，然后为ht[1]分配一个空白的哈希表

### 4.2 哈希表的扩展与收缩

**当满足下列条件中的任意一个，程序会自动开始对哈希表执行扩展操作：**

**1.** 服务器目前没有执行BGSAVE命令或者BGREWRITEAOF命令，并且哈希表的负载因子>=1。

**2.** 服务器目前正在执行BGSAVE命令或者BGREWRITEAOF命令，并且哈希表的负载因子>=5。

```c
// 负载因子 = 哈希表已保存节点数量 / 哈希表大小
load_factor = ht[0].used / ht[0].size
```

根据是否正在执行BGSAVE和BGREWRITEAOF命令，服务器执行扩展操作所需的负载因子并不相同，这是因为在执行BGSAVE或者BGREWRITEAOF的过程中，Redis需要创建当前服务器进程的子进程，而大多操作系统都采用写实复制技术来优化子进程的使用效率，所以在子进程存在期间，服务器会提高执行扩展操作所需的负载因子，从而尽可能地避免子进程存在期间进行哈希表扩展操作，这样可以避免不必要的内存写入操作，最大限度地节约内存。

**当负载因子小于0.1时，程序会自动对哈希表执行收缩操作**

## 5. 渐进式rehash
