# 链表

> 链表提供了高效的节点重排能力，以及顺序性的节点访问方式，并且可以通过增删节点来灵活地调整链表的长度。

## 1. 在Redis中的应用

* 列表底层实现就是一个链表；
* 发布与订阅；
* 慢查询；
* 监视器等。

## 2. 链表和链表节点的实现

**每个链表节点都用一个listNode结构表示**

```c
/*
 * adlist.h/listNode
 * 双端链表节点
 */
typedef struct listNode {

    // 前置节点
    struct listNode *prev;

    // 后置节点
    struct listNode *next;

    // 节点的值
    void *value;

} listNode;
```

**为了操作起来方便，redis使用list来持有链表**

```c
/*
 * adlist.h/list
 * 双端链表结构
 */
typedef struct list {
    // 表头节点
    listNode *head;

    // 表尾节点
    listNode *tail;

    // 节点值复制函数
    void *(*dup)(void *ptr);

    // 节点值释放函数
    void (*free)(void *ptr);

    // 节点值对比函数
    int (*match)(void *ptr, void *key);

    // 链表所包含的节点数量
    unsigned long len;

} list;
```

* dup函数用于复制链表节点所保存的值；
* free函数用户释放链表节点所保存的值；
* match函数则用于对比链表节点所保存的值和另一个输入值是否相等。

## 3. Redis的链表实现特性总结

* **双端**：链表节点带有的prev和next指针，获取某个节点的前置节点和后置节点的复杂度都是O(1)。
* **无环**：表头节点的prev指针和表尾节点的next指针都指向NULL，对链表的访问以NULL为终点。
* **带表头指针和表尾指针**：通过list结构的head指针和tail指针，程序获取链表的表头节点和表尾节点的复杂度为O(1)。
* **带链表长度计数器**：使用list结构中的len属性来对list持有的链表节点进行计数，程序获取链表中节点数量的复杂度为O(1)。
* **多态**：链表节点使用void*指针来保存节点值，并且可以通过list结构的dup、free、match三个属性为节点值设置类型特定函数，所有链表可以用于保存各种不同类型的值。