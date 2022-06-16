## 一、PHP

### 1. 什么是类？

​	定义了一件事物的抽象特点。类的定义包含了数据的形式以及对数据的操作。

### 2. php中的数据类型有哪些？

* Interge(整型)
* Float(浮点型)
* String(字符串型)
* Boolean(布尔型)
* Resource(资源类型)
* Object(对象)
* Array(数组)
* NULL(空值)

### 3. 重写与重载的区别？

> 方法的重写和重载是多态的不同表现

* 重载：一个类中定义了多个相同的方法名，但他们的形参数量不同或者数量相等而类型和次序不同
* 重写：子类存在的方法和父类的方法名相同，并且参数的个数与类型一样，返回值也一样

![](https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220609182443020.png)

### 4. 静态方法和属性以及为什么要用静态方法？

* 静态方法：通过static修饰过的方法，使用**类型::方法名**调用，不能使用$this
* 静态属性：在类的方法内可以使用self::属性名，访问静态变量，在类外可以使用**类名::静态变量**访问
* 从程序运行开始就实例生成，所以可以直接调用，并且在内存中只有一份，效率较高

### 5.抽象类和接口的区别？

* 抽象类：定义：abstract，使用：extend
* 接口：定义：interface，使用：implements
* 区别：
    * 抽象类不能被实例化，如果它里面至少有一个方法是被声明为抽象的，那么这个类必须被声明为抽象的，继承一个抽象类的时候，子类必须定义父类中所有的抽象方法，这些方法的访问控制必须和父类中一样(或者更为宽松)。
    * 接口只是定义某个类必须实现哪些方法，但不需要具体实现，接口所定义的方法必须是public的，而抽象类可以是其他的，在类中必须实现接口中定义的所有方法，否则会报一个致命错误。

### 6. include、include_once 和 require、require_once的区别？

> 两者处理错误的方式不一样

* include：当包含的文件不存在时会产生警告，在错误发生之后脚本会继续执行。有返回值(包含文件的返回值)
* require：当包含的文件不存在时会产生致命错误，在错误发生之后会停止执行。没有返回值
* include_once、require_once：只加载一次

### 7. 魔术方法有哪些？

> 以__开头的方法称为魔术方法

* __get： 当调用类未定义的属性时，调用此方法
* __set：当给一个未定义属性赋值时，调用此方法
* __isset：当在一个未定义属性上调用isset()函数时调用此方法 
* __unset：当在一个未定义的属性上调用unset()函数时调用此方法 
* __call：当调用一个未定义的方法时会调用此方法
* __callStatic: 当调用一个未定义的静态方法时会调用此方法
* __toString：当定义此方法就可以用echo 输出对象，将对象当做字符串来调用
* __clone：对象的复制(引用复制)，当调用clone方法时会被调用
* __autoload：**自动加载使用的类文件 该函数是在引用的页面添加,**它会在试图使用尚未被定义的类时自动调用
* __construct：构造函数，当对象被创建时会调用此方法
* __destruct：当对象被销毁(unset)的时候会调用此方法
* __sleep：serialize() 函数会首先检查是否存在一个魔术方法sleep，如果有会先执行
* __wakeup：unserialize()会检查是否存在一个wakeup方法，如果有会先执行
* __invoke：当尝试以调用函数的方式调用一个对象时，此方法会被调用

### 8 魔术常量有哪些？

> 以____开头的大写常量

* __LINE__：显示文件中的行号
* __FILE__：返回文件的完整路径和文件名，如果用在被包含文件中，则返回被包含的文件名
* __DIR__：返回文件所在的目录。如果用在被包括文件中，则返回被包括的文件所在的目录
    * 它等价于 dirname(__FILE__)。除非是根目录，否则目录中名不包括末尾的斜杠。（PHP 5.3.0中新增）
* __FUNCTION__：返回该函数被定义时的名字
* __CLASS__: 返回该类被定义时的名字(当用在 trait 方法中时，__CLASS __是调用 trait 方法的类的名字)
* __TRAIT__:  优先顺序是当前类中的方法会覆盖 trait 方法，而 trait 方法又覆盖了基类中的方法
* __METHOD__：返回该方法被定义时的名字
* __NAMESPACE__：返回当前命名空间的名称

### 9. isset empty is_null有什么区别？

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220609195731.png" style="zoom:50%;" />

### 10. echo var_dump print print_r有什么区别？

* echo：是语句，不是函数没有返回值，可以输出多个字符串
* print：是语句也可以不是用括号：print或print()
    * print只允许输出一个字符串，返回值总为1
    * echo输出速度比print快，并且可以输出多个字符串，echo没有返回值，print返回值为1
* print_r：不会输出数据类型，可以格式化打印出数组元素
* var_dump：会输出数据类型，此函数显示关于一个或多个表达式的结构信息，包括表达式的类型和值。数组将递归展开值，通过缩进显示其结构。

### 11. insteadof 和instanceof区别？

* instanceof
    * 判断一个对象是否是某个类的实例
    * 判断一个对象是否实现了某个接口
* insteadof：主要是用来解决在同一个类中同时使用多个trait，然而在使用的这些trait中方法名称冲突的问题。

### 12. CSRF和XSS攻击分别是什么？

#### CSRF

* [CSRF](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0)- 跨站请求伪造：是一种挟持用户在当前已登录的web应用程序上执行非本意的操作的方法。

  * 具体细节：简单地说，就是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并执行一些操作，由于浏览器曾经认证过,所以被访问的网站会认为是真正的用户操作而去执行。

    **简单的身份认证只能保护请求是发自某个用户的浏览器，却不能保证请求本身是用户发出的。**

* 防御措施：
  * 令牌同步模式：当用户发送请求是，服务器端应该将令牌嵌入HTML表格，并发送给客户端。客户端提交HTML表格时候，会将令牌发送到服务端，令牌的验证是由服务端实行的。这样就能确保攻击者发送请求时候，由于没有改令牌而无法通过验证。
    * 缺点：当页面过多时，服务器由于生产令牌而导致的负担也会增加。
  * 检查Referrer字段：HTTP头中有一个Referer字段，这个字段用以标明请求来源于哪个地址。在处理敏感数据请求时，通常来说，Referer字段应和请求的地址位于同一域名下。如果是CSRF攻击传来的请求，Referer字段会是包含恶意网址的地址，这样服务器就能识别出恶意的访问。
    * 缺点：由于是完全依赖浏览器发送正确的Referer字段。虽然http协议对此字段的内容有明确的规定，但并无法保证来访的浏览器的具体实现，亦无法保证浏览器没有安全漏铜影响此字段，同时也存在攻击者攻击某些浏览器，从而篡改其Referer字段的可能。
  * 添加校验token：由于CSRF的本质在于攻击者欺骗用户去访问自己设置的地址，所以如果要求在访问敏感数据请求时，要求用户浏览器提供不保存在cookie中，并且攻击者无法伪造的数据作为校验，那么攻击者就无法再执行CSRF攻击。这种数据通常是窗体中的一个数据项。服务器将其生成并附加在窗体中，其内容是一个伪随机数。当客户端通过窗体提交请求时，这个伪随机数也一并提交上去以供校验。正常的访问时，客户端浏览器能够正确得到并传回这个伪随机数，而通过CSRF传来的欺骗性攻击中，攻击者无从事先得知这个伪随机数的值，服务端就会因为校验token的值为空或者错误，拒绝这个可疑请求。

#### XSS

* [XSS](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)-跨站脚本是一种网站应用程序的安全漏铜攻击，是代码注入的一种，它允许恶意用户将代码注入到网页上，其他用户在浏览网页就会受到影响。这些恶意程序通常是javascript，但实际上也可以包括java，vbscript，ActiveX，Flash或者普通HTML。攻击成功后，攻击者可能得到更高的权限、私密网页内容、会话和cookie等各种内容。

* 防御措施：

  * 对用户所提交的内容进行过滤(htmlentities() 和 htmlspecialchars())

  * 使用http头指定类型

    ```php
    <?php
       header('Content-Type: text/javascript; charset=utf-8');
    ?>
    ```

### 13. 谈谈你对设计模式的理解

* 模式是在特定环境下解决某一问题的方案

[解析](https://ylaila.com/php/design-pattern/1-basic.html)

### 14. 谈谈你对微服务的理解

> 微服务就是一些协同工作的，小而自治的服务

* 专注做好一件事：将大的单体应用拆成独立的服务

### 15. 说说垃圾回收

* zval结构体，有refcount变量和is_ref变量

    * refcount：多少个变量共用了相同的值，这个数值就是多少
    * is_ref：当refcount大于2的时候，其中一个变量用了取地址符&的形式进行复制，它的值就变成了1

* 垃圾是如何定义的：主要看有没有变量名指向变量容器zval，如果没有则认为是垃圾，需要释放

    * 如果一个zval的refcount增加，那么此zval还在使用，不属于垃圾
    * 如果一个zval的refcount减少到0，那么此zval可以被释放掉，不属于垃圾
    * 如果zval的refcount减少后大于0，那么此zval还不能被释放，此zval可能成为一个垃圾(准则3)

    *对此zval中的每个元素进行一次refcount减1操作，操作完成之后，如果zval的refcount=0，那么这个zval就是一个垃圾*

* **三色标记**

    * 为了避免每次变量的refcount减少的时候都调用GC算法进行垃圾判断，此算法会先把所有准则3情况下的zval节点放入一个节点缓冲区中，并且将这些zval节点标记成**紫色**，同时算法必须确保每个zval节点在缓冲区中只出现一次，当缓冲区被节点塞满时，GC才开始对缓冲区的zval节点进行垃圾判断
    * 当缓冲区满了之后，算法以深度优先对每一个节点所包含的zval进行减1操作，为了确保不会对同一个zval的refcount重复执行减1操作，一旦zval的refcount减1之后会将zval标记成**灰色**。在此期间，起初节点zval本身不做减1操作，但是如果节点zval中包含的zval又指向节点zval(循环引用)，那么这个时候需要对节点zval进行减1操作
    * 算法在此以深度优先判断每一个节点包含的zval的值，如果zval的refcount等于0，那么将其标记成**白色**(代表垃圾)，如果zval的refcount大于0，那么将对此zval以及其包含的zval进行refcount进行加1操作，这个是对非垃圾的还原操作，同时将这些zval的颜色变成黑色(zval的默认颜色)
    * 遍历zval节点，将上述第三步中标记成白色的节点zval释放掉

### 16. 如何防范SQL注入

* 使用PDO预处理语句
* 使用成熟的框架

### 17. 什么是时序攻击

* 系统对于不同输入，反馈时间动态变化，利用这个特性获取机密信息的方法称之为时序攻击
* 加密扩展Hash提供了的hash_equals函数

### 18. 高并发解决方案

[解析](https://ylaila.com/php/2-other.html)

### 19. 运行模式

#### cgi协议模式

cgi模式通用网关接口(Common Gateway Interface)，它允许web服务器通过特定的协议与应用程序通信

**工作原理**

用户请求➔web服务器接受请求➔fork子进程 调用程序/执行程序➔程序返回内容/程序调用结束➔web服务器接受内容➔返回给用户

由于每次用户，请求都得fork创建进程调用一次程序，然后销毁进程，所以性能比较低

**fast-cgi协议模式**

fast-cgi是cgi模式的升级版，它想是一个常驻内存的cgi，只要开启后，就可以一直处理请求，不再需要结束进程

**工作原理**

* web服务器fast-cgi进程管理器初始化➔预先fork n个进程
* 用户请求➔web服务器接收请求➔交给fast-cgi进程管理器➔fast-cgi进程管理器接收，给其中的一个空闲fast-cgi进程处理➔处理完成，fast-cgi进程变为空闲状态，等待下次请求➔web服务器接收内容➔返回给用户

#### PHP-FPM

> PHP-FPM(FastCGI进程管理器)用于替换PHP FastCGI的大部分附加功能，对于高负载网站是非常有用的

**工作原理**

* php-fpm启动➔生成n个fast-cgi协议处理进程➔监听一个端口等待任务
* 用户请求➔web服务器接受请求➔请求转发给php-fpm➔php-fpm交给一个空闲进程处理➔进程处理完成➔php-fpm返回给web服务器➔web服务器接收数据➔返回给用户

### 20. PHP+mysql实现无限级分类

* 数据表

```sql
CREATE TABLE `reading_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `level` int(10) unsigned NOT NULL DEFAULT '1',
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

* laravel ORM

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function childCategory()
    {
        return $this->hasMany(Category::class, 'pid', 'id');
    }

    public function children()
    {
        return $this->childCategory()->with('children');
    }
}

public function getList2()
{
    return Category::with('children')->where('pid', 0)->get();
}

```

* 原始递归查询

```php
public function getList()
{
    $category = Category::all()->keyBy('id');
    return $this->buildTree($category->toArray(), 0);
}

private function findChild(array $list, int $pid)
{
    $child = [];
    foreach ($list as $item) {
      $parent = [];
      if ($item['pid'] == $pid) {
        if ($item['path']) {
          $pathArr = explode(',', $item['path']);
          foreach ($pathArr as $key) {
            $parent[] = $list[$key]['name'];
          }
          $item['parent'] = $parent;
        }
        $child[] = $item;
      }
    }
    return $child;
}

private function buildTree(array $list, int $rootId)
{
    $tree = $this->findChild($list, $rootId);
    if (empty($tree)) {
      return [];
    }
    foreach ($tree as $key => $item) {
      $child = $this->buildTree($list, $item['id']);
      if ($child) {
        $tree[$key]['children'] = $child;
      }
    }
    return $tree;
}
```

### 21. 如何现实接口幂等性

**前端**：如何防止表单重复提交，按钮置灰、隐藏、按钮不可点击等方式

**后端**：

* 防重数据表
* Redis set防重
* 数据库锁
* 业务层分布式锁
* Token机制

## 二、Laravel

### 1. 依赖注入实现原理

### 2. 生命周期

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220609231925.png" style="zoom:50%;" />

## 三、Swoole

### 1. 什么是Swoole?

`Swoole` 是一个使用 `C++` 语言编写的基于异步事件驱动和协程的并行网络通信引擎，为 `PHP` 提供[协程](https://wiki.swoole.com/#/coroutine)、[高性能](https://wiki.swoole.com/#/question/use?id=swoole性能如何)网络编程支持。提供了多种通信协议的网络服务器和客户端模块，可以方便快速的实现 `TCP/UDP服务`、`高性能Web`、`WebSocket服务`、`物联网`、`实时通讯`、`游戏`、`微服务`等，使 `PHP` 不再局限于传统的 Web 领域。

### 2. 请分别介绍进程、线程、协程的概念

**进程**：进程是资源分配的基本单位

**线程**：线程是操作系统调度的最小单位

**协程**：协程是用户态的轻量级线程，其调度完全由用户控制

*进程就行一座工厂，而线程则是工程里的车间，协程就是每个车间里面的工人*

### 3. 什么是EventLoop(事件循环)？

可以简单理解为epoll_wait，会把所有要发生事件的句柄(fd)加入到epoll_wait中，这些事件包括可读，可写，出错等。

对应的进程就阻塞在epoll_wait这个内核函数上，当发生了事件(或超时)后epoll——wait这个函数就会结束阻塞返回结果，就可以回调相应的PHP函数，例如，收到客户端发来的数据，回调OnReceive回调函数。

当有大量的fd放入到了epoll_wait中，并且同时产生了大量的事件，epoll_wait函数返回的时候就会挨个调用相应的回调函数，叫做一轮事件循环，即IO多路复用，然后再次阻塞调用epoll_wait进行下一轮事件循环。



### 4. Swoole的运行原理？

#### 4.1 Server的两种运行模式

**SWOOLE_PROCESS**

> 所有的server客户端的TCP连接都是和主进程建立的

* 优点：
    * 连接与数据请求发生是分离的，不会因为某些连接数据量大某些数据量小导致Worker进程不均衡
    * Worker进程发生致命错误时，连接并不会被切断
    * 可实现单连接并发，仅保持少了TCP连接，请求可以并发地在多个Worker进程中处理
* 缺点：存在2次IPC的开销，master进程与worker进程需要使用unixSocket进行通信

**SWOOLE_BASE**

> 就是传统的一部非阻塞Server。与Nginx和Node.js等程序是完全一致的，worker_num参数对于BASE模式仍然有效，会启动多个Worker进程

当有TCP连接请求进来的时候，所有的Worker进程去争抢这一个连接，并最终会有一个worker进程成功直接和客户端建立TCP连接，之后这个连接的所有数据收发直接和worker通讯，不经过主进程的Reactor线程转发。

* 优点：
    * 没有IPC开销，性能好
    * 代码简单，不容易出错
* 缺点：
    * TCP连接实在Woker进程中维持的，所以当某个Worker进程挂掉时，次Worker内的所有连接都将被关闭
    * 少量TCP长连接无法利用到所有Worker进程
    * 不同的Woker进程无法实现均衡
    * 如果回调函数中有阻塞操作会导致Server退化为同步模式
* 适用场景：如果客户端连接之间不需要交互，可以使用BASE模式



| <img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220609232543.png" style="zoom:55%;" /> | <img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220609232810.png" style="zoom:45%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/20220616205141.png"/>

#### 4.2 Master 进程、Reactor 线程、Worker 进程、Task 进程、Manager 进程的区别与联系

**Master 进程**

* **Master**进程是一个多线程进程，如上图所示

**Reactor线程**

* **Reactor**线程是在**Master**进程中创建的线程
* 负责维护客户端TCP连接、处理网络IO、处理协议、收发数据
* 不执行任何PHP代码
* 将TCP客户端发来的数据缓存、拼接、拆分成完整的一个请求数据包

**Worker进程**

* 接受由**Reactor**线程投递的请求数据包，并执行PHP回调函数处理数据
* 生成响应数据并发给**Reactor**线程，由**Reactor**线程发送给TCP客户端
* 可以是异步非阻塞模式，也可以是同步阻塞模式
* **Worker**以多进程的方式运行

**TaskWorker进程**

* 接受由**Worker**进程通过Swoole\Server->task/taskwait/taskCo/taskWaitMulti方法投递的任务
* 处理任务，并将结果数据返回(使用Swoole\Server->finish)给Worker进程
* 完全是**同步阻塞模式**
* **TaskWorker**以多进程的方式运行

**Manager进程**

* 负责创建/回收 **worker**/**task**进程

他们之间的关系可以理解为Reactor就是nginx，Worker就是PHP-FPM。Reactor线程异步并行地处理网络请求，然后再转发给Worker进程中去处理。Reactor和Worker间通过unixSocket进行通信。

*类比：假设Server就是一个工厂，那Reactor就是销售，接受客户订单。而Woker就是工人，当销售接到订单后，Woker去工作生产客户要的东西。而TaskWorker可以理解为行政人员，可以帮助Woker干些杂事，让Worker专心工作。*

### 5. 为什么要用Swoole？

* swoole相比php-fpm，主要节省了php框架和全局对象每次创建销毁所带来的性能开销，进程常驻内存
* 可以开发基于TCP/UDP的应用
* 有数据库连接池

### 6. Swoole如何提升性能

* 进程常驻内存
* 有数据库连接池
* 可以使用协程处理异步IO

### 7. 协程是什么？怎么用？为什么协程可以提高并发？

* 协程是在用户态通过协作而不是抢占式来进行切换，它创建和切换对内存等资源比线程小得多
* 协程可以使用swoole\coroutine和Co、go简化类型来来创建
* 协程可以异步处理任务，支持并发，并且资源消耗小

### 8. 使用swoole以后，会不会发生内存泄露？如果发生了怎么解决？

**问题**
* 对于局部变量，swoole会在回调函数结束后自动释放
* 对于全局变量(global声明)、
* 对于static声明的对象属性或者函数内的静态变量和超全局变量，swoole不会自动释放，因此可以会发生内存泄露

**解决**

* 在onClose回调函数内清理变量
* swoole提供max_request和max_task_request机制：进程完成指定数量的任务后，会自动退出，达到释放资源和内存的目的。而后manager进程会重新创建新的woker/task进程来继续处理任务
* **限制**
    * max_request只能用于同步阻塞、无状态的请求响应式服务器程序
    * 纯异步的server不应当设置mac_request
    * 使用Base模式是max_request是无效的

## 四、网络

### 1. 说说URL，越详细越好

> URL叫做统一资源定位符

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210417091949269.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NzI1MjE3Ng==,size_16,color_FFFFFF,t_70)

**组成**

* 协议：http和https
* 域名或者IP
* 端口号
* 应用上下文路径
* 服务资源
* 查询字符串

**注意**

* queryString`以键值对的方式来存储数据，每个键值对之间是以 ‘&’ 符号来间隔开的`
* 存储的字符的`长度有限`，最多是2048个字符
* 里边存储的`只能是ASCII字符`
* 而且请求的数据会暴露在地址栏中，`不安全`



## 五、Linux

### 1. 查看某一进程占用的内存

* 使用ps和top组合命令
    * 通过ps ef | grep swoole 找到进程id
    * top -p 1234
* ps -aux|grep swoole

## 六、MySQL

### 1. 说说悲观锁和乐观锁

* 悲观锁：对于数据的处理持悲观态度，总认为会发生并发冲突，获取和修改数据时，别人会修改数据。所以在整个数据处理过程中，需要将数据锁定。

    实现：排它锁：select ... for update

* 乐观锁：就是对数据的处理持乐观态度，乐观的认为数据一般情况下不会发生冲突，只有提交数据更新时，才会对数据是否冲突进行检测。乐观锁的实现不依靠数据库提供的锁机制，需要我们自已实现，实现方式一般是记录数据版本，一种是通过版本号，一种是通过时间戳。给表加一个版本号或时间戳的字段，读取数据时，将版本号一同读出，数据更新时，将版本号加1。
    当我们提交数据更新时，判断当前的版本号与第一次读取出来的版本号是否相等。如果相等，则予以更新，否则认为数据过期，拒绝更新，让用户重新操作

### 2. MyISAM和InnoDB区别

* MyISAM不支持事务，最小锁粒度为表锁，并发性比较低
* MyISAM索引和数据是分开的，每次查询都需要进行回表操作
* InnoDB支持事务，最小锁粒度为行锁，并发性比较高
* InnoDB索引既数据，数据既索引

### 3. 索引结构

**B+树**：

* B+树是个多叉树，所有数据都存放在叶子节点，非叶子节点存放主键和指针
* B+树结点中的主键值都是排好序的(从左向右递增)
* 查找数据时，通过二分搜索定位到每个页，然后再通过二分搜索定位到每个页中的page direct中的槽，然后遍历即可得到数据
* 页与页之间通过next_page_record和pre_page_record构成双向指针
* 页中的数据通过指向下一节点的指针相连

### 4. select执行过程

* 连接器：管理连接，权限验证
* 查询缓存：命中直接返回结果
* 分析器：词法、语法分析
* 优化器：执行计划生成，索引选择
* 执行器：操作引擎，返回结果

### 5. 事务隔离级别

* READ UNCOMMITTED：读未提交
* READ COMMITTED：读已提交
* REPEATABLE READ: 可重复读(默认的隔离级别)
* SERIALIZABLE：可串行化

### 6. 索引回表

> 辅助索引B+树叶子节点存储索引列和主键值，当查询的字段不在辅助索引中，就需要将主键ID带回聚集索引中查询，就个操作就称为回表

```sql
# 需要回表操作
select * from student where name = '张三';			

# 不需要回表操作
select id, name from student where name = '张三';
```

### 7. 索引失效

> lol+-*/  not null

* l(like)：以%开头索引会失效
* o(or)：两边都是索引列不会失效，当边有一个不是索引列时会失效
* l(联合查询)：如果在where条件里面并没有从联合索引首元素开始进行索引的话(最左前缀)，索引会失效
* +-*/：where条件列不能进行+-*/运算

```sql
# 索引失效
select age from student where age - 1 = 10;

# 索引不失效
select age from student where age = 10 - 1;
```

* not：!=、<>、is not 索引会失效
* null：null、is not null 可能会失效

### 8. 分库分表

* 分库：把原本存储在一个库中的数据分块存储到多个库上
* 分表：把原本存储于一个表的数据分块存储到多个表上

**为什么要分库分表？**

因为数据库中的数据量不一定是可控的，在未进行分库分表的情况下，随着时间和业务的发展，库中的表会越来越多，表中的数据量也会越来越大，相应地，数据操作的开销也会越来越大，另外，单个服务器的资源(如cpu、磁盘、内存、IO等)是有限的，最终数据库所能承载的数据量、数据处理能力都将遇到瓶颈。

**分库和分表有什么区别？**

单表数据量太大，这是会出现查询耗时长，影响正常的CRUD，解决方法就是：切分成多个更小的表，即分表。

当单库数据量太大，单库所在服务器上磁盘空间不足，I/O有限，解决方法就是，切分成更多更小的库，即分库。

**垂直划分和水平划分**

* 垂直划分：垂直划分数据库是根据业务进行划分的，例如购物场景，可以将库中涉及商品、订单、用户的表分别划分出一个库，通过降低单库的大小来提高性能。同样的，分表的情况就是将一个大表根据业务能拆分成一个个子表，例如商品基本信息和商品表述，商品基本信息一般会展示在商品列表，商品描述在商品详情页，可以将商品基本信息和商品表述拆分成两张表
* 垂直划分缺优点
    * 优点：
        * 行记录变小，数据页可以存放更多记录
        * 在查询时减少IO次数
    * 缺点：
        * 主键出现冗余，需要管理冗余列
        * 会引起表连接JOIN操作，可以通过在业务服务器上进行join来减少数据库压力
        * 依然存在单表数据量过大的问题
* 水平划分：水平划分是根据一定规则，例如时间或id序列值等进行数据的拆分，比如根据年份来拆分不同的数据库。每个数据库结构一致，但是数据得以拆分，从而提升性能
* 垂直划分优缺点：
    * 优点：
        * 单库(表)的数据量得以减少，提高性能
        * 切分出的表结构相同，程序改动较少
    * 缺点：
        * 分片事务一致性难以解决
        * 夸节点join性能差，逻辑复杂
        * 数据分片在扩容需要迁移



### 9. 如何定位一条慢的SQL

> 开启慢查询日志，分析日志，找出较慢的sql，通过explain来进行分析

* 系统变量

| 参数                | 含义                                                         |
| ------------------- | ------------------------------------------------------------ |
| slow_query_log      | 是否启用慢查询日志，ON启用，OFF没有启用，默认为OFF           |
| log_output          | 日志输出位置，默认为FILE，即保存为文件，若设置为TABLE，则将日志记录到mysql.show_log表中，支持设置多种格式 |
| slow_query_log_file | 指定慢查询日志文件的路径和名字                               |
| long_query_time     | 执行时间超过该值才记录到慢查询日志，单位为秒，默认为10       |

* 执行下面sql来查看是否启用慢查询日志

```sql
show variables like "%slow_query_log%"
```

* 配置my.cnf

```shell
# log
slow_query_log=1
slow_query_log_file=slow.log
long_query_time=3
```

* 通过mysql自动的mysqldumpslow工具

```shell
#获取返回记录最多的3个sql
mysqldumpslow -s r -t 3  /Data/mysql/data/slow.log

#获取访问次数最多的3个sql
mysqldumpslow -s c -t 3 /Data/mysql/data/slow.log

#按照时间排序，前10条包含left join查询语句的sql
mysqldumpslow -s t -t 10 -g "left join" -s r -t 3  /Data/mysql/data/slow.log
```

### 10. explain有哪些字段

> 12个关键字

| 列名          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | 在一个大的查询语句中，每个SELECT关键字都对应一个唯一的id     |
| select_type   | SELECT关键字对应的查询的类型                                 |
| table         | 表名                                                         |
| partitions    | 匹配的分区信息                                               |
| possible_keys | 可能用到的索引                                               |
| key           | 实际用到的索引                                               |
| key_len       | 实际使用的索引                                               |
| type          | 针对单表的访问方法                                           |
| ref           | 当使用索引列等值查询时，与索引列进行等值匹配的对象信息       |
| rows          | 预估的需要读取的记录条数                                     |
| filtered      | 针对预估的需要读取的记录，经过搜索条件过滤后剩余记录条数的百分比 |
| Extra         | 一些额外的信息                                               |

## 七、Redis

### 1. 数据类型

* 字符串
* 列表
* 哈希
* 集合
* 有序集合

### 2. 淘汰策略

| 策略            | **描述**                                             |
| --------------- | ---------------------------------------------------- |
| volatile-lru    | 从已设置过期时间的数据集中挑选最近最少使用的数据淘汰 |
| volatile-ttl    | 从已设置过期时间的数据集中挑选将要过期的数据淘汰     |
| volatile-random | 从已设置过期时间的数据集中任意选择数据淘汰           |
| allkeys-lru     | 从所有数据集中挑选最近最少使用的数据淘汰             |
| allkeys-random  | 从所有数据集中任意选择数据进行淘汰                   |
| noeviction      | 禁止驱逐数据                                         |

Redis4.0 引入了volatile-lfu和allkeys-lfu淘汰策略，LFU策略通过统计访问频率，将访问频率最少得键值对淘汰

### 3. 事务机制

> Redis通过MULTI、EXEC、WATCH等命令来现实事务的功能

###  4. 缓存失效
[详解](../redis/redis-45/25-exception-cache.md)
### 5. 分布式锁

### 6. 哨兵和集群