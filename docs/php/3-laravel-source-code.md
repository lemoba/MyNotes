# Laravel8源码分析

## 一、前置知识

## 1. 面向对象

[参考](https://www.runoob.com/php/php-oop.html)

### 1.1 面向对象的三个特性：

* **对象的行为**：可以对 对象施加那些操作，开灯，关灯就是行为
* **对象的形态**：当施加那些方法是对象如何响应，颜色，尺寸，外型
* **对象的表示**：对象的表示就相当于身份证，具体区分在相同的行为与状态下有什么不同

### 1.2 面向对象基本概念：

* **类** − 定义了一件事物的抽象特点，它是用于生成一个或者多个对象的代码模板
* **对象** − 对象是类的一个具体实例
* **成员变量** − 定义在类内部的变量，在实例化之后就变成类的属性了
* **继承** − 继承性是子类自动共享父类数据结构和方法的机制，这是类之间的一种关系。在定义和实现一个类的时候，可以在一个已经存在的类的基础之上来进行，把这个已经存在的类所定义的内容作为自己的内容，并加入若干新的内容
* **父类** − 一个类被其他类继承，可将该类称为父类，或基类，或超类。
* **子类** − 一个类继承其他类称为子类，也可称为派生类。
* **多态** − 多态性是指相同的函数或方法可作用于多种类型的对象上并获得不同的结果。不同的对象，收到同一消息可以产生不同的结果，这种现象称为多态性。
* **重载** − 简单说，就是函数或者方法有同样的名称，但是参数列表不相同的情形，这样的同名不同参数的函数或者方法之间，互相称之为重载函数或者方法。
* **抽象性** − 抽象性是指将具有一致的数据结构（属性）和行为（操作）的对象抽象成类。一个类就是这样一种抽象，它反映了与应用有关的重要性质，而忽略其他一些无关内容。任何类的划分都是主观的，但必须与具体的应用有关。
* **封装** − 封装是指将现实世界中存在的某个个体的属性与行为绑定在一起，并放置在一个逻辑单元内。
* **构造函数** − 主要用来在创建对象时初始化对象， 即为对象成员变量赋初始值，总与new运算符一起使用在创建对象的语句中。
* **析构函数** − 析构函数(destructor) 与构造函数相反，当对象结束其生命周期时（例如对象所在的函数已调用完毕），系统自动执行析构函数。析构函数往往用来做"清理善后" 的工作（例如在建立对象时用new开辟了一片内存空间，应在退出前在析构函数中用delete释放）。

## 2. Composer

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220328073215944.png" style="zoom:50%;" />

## 3. 依赖注入、控制反转

> 解决类与类之间的依赖关系，降低代码复杂性，从而实现了模块间的解耦。

[参考](https://blog.csdn.net/doris_crazy/article/details/18353197)

### 3.1 需要搞清楚的问题

* 参与者都有谁？
* 依赖：依赖谁？为什么需要依赖？
* 注入：谁注入谁？到底注入什么？
* 控制反转：谁控制谁？控制什么？为什么叫反转(正转)
* 依赖注入和控制反转是同一概念吗？

### 3.2 概念理解

* **参与者都有谁？**

  一般有三方参与者，一个是某个对象，一个是IOC/DI的容器，另一个是某个对象的外部资源

  * **某个对象**：任意的、普通的PHP对象
  * **IOC/DI容器**：就是指用来实现IoC/DI功能的一个框架程序
  * **对象的外部资源**：指的就是对象需要的，但是是从对象外部获取的，都统称资源，比如：对象需要的其它对象、或者是对象需要的文件资源等等

* **谁依赖谁**：某个对象依赖于IOC/DI容器

* **为什么需要依赖**：对象需要IOC/DI容器来提供对象需要的外部资源

* **谁注入谁**：某个对象依赖于IOC/DI容器

* **到底注入什么**：注入对象所需的外部资源

* **谁控制谁**：IOC/DI容器来控制对象

* **控制什么**：控制对象实例的创建

* **为何叫反转**：反转是相对于正向而言的，那么什么算是正向的呢？考虑一下常规情况下的应用程序，如果要在A里面使用C，你会怎么做呢？当然是直接去创建C的对象，也就是说，是在A类中主动去获取所需要的外部资源C，这种情况被称为正向的。那么什么是反向呢？就是A类不再主动去获取C，而是被动等待，等待IOC/DI的容器获取一个C的实例，然后反向的注入到A类中。

* **控制反转和依赖注入是同一概念吗**

  * **控制反转**： 是从容器的角度在描述：**容器控制应用程序，由容器反向的向应用程序注入应用程序所需要的外部资源**

  * **依赖注入**：是从应用程序的角度在描述：**应用程序依赖容器创建并注入它所需要的外部资源**

* **好处**：有效的分离了对象和它所需要的外部资源，使得它们松散耦合，有利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活

**正转写法**

* 代码含义：A类中的say方法需要依赖B类中的say方法，在A类构造函数中实例化B类然后调用
* 缺点：内部写死，一旦更改需要重新修改代码，不能做到灵活运用

```php
<?php declare(strict_types=1);

class SayA
{
    protected $sb;

    public function __construct()
    {
        $this->sb = new SayB();
    }

    public function say()
    {
        return $this->sb->say();
    }
}

class SayB
{
    public function __construct(){}

    public function say()
    {
        echo __CLASS__.'['.__METHOD__ .'] say hello'. PHP_EOL;
    }
}

(new sayA)->say();

```

**优化1**

```php
<?php declare(strict_types=1);

class SayA
{
    protected $sb;

    public function __construct(SayB $sb)
    {
        $this->sb = $sb;
    }

    public function say()
    {
        return $this->sb->say();
    }
}

class SayB
{
    public function __construct(){}

    public function say()
    {
        echo __CLASS__.'['.__METHOD__ .'] say hello'. PHP_EOL;
    }
}

class Ioc
{
    protected $instance = [];

    public function __construct()
    {
      	// 粗暴写法，继续优化
        $this->instance['sayB'] = new SayB();
    }

    public function make(string $abstract)
    {
        return $this->instance[$abstract];
    }
}

$ioc = new Ioc();
$sayB = $ioc->make('sayB');

(new SayA($sayB))->say();
```

**优化2 通过反射类来获取依赖**

* **PHP反射API**：在php运行时，扩展分析程序，导出或提出关于类、方法、属性、参数等的详细信息，包括注释。这种动态获取信息以及动态调用方法的功能称为反射API。

[PHP反射API](https://www.php.net/manual/zh/book.reflection.php)

```php
<?php declare(strict_types=1);

class SayA
{
    protected $sb;

    public function __construct(SayB $sb)
    {
        $this->sb = $sb;
    }

    public function say()
    {
        return $this->sb->say();
    }
}

class SayB
{
    protected $sc;
    protected $sd;

    public function __construct(SayC $sc, SayD $sd)
    {
        $this->sc = $sc;
        $this->sd = $sd;
    }

    public function say()
    {
        return $this->sc->say();
        return $this->sd->say();
    }
}

class SayC
{
    public function __construct(){}

    public function say()
    {
        echo __CLASS__.'['.__METHOD__.'] say hello'.PHP_EOL;
    }
}

class SayD
{
    public function __construct(){}

    public function say()
    {
        echo __CLASS__.'['.__METHOD__.'] say hello'.PHP_EOL;
    }
}

class Ioc
{
    protected $instance = [];

    public function __construct()
    {
    }

    public function getInstance(string $abstract)
    {
        // 获取反射信息
        $reflector = new ReflectionClass($abstract);

        // 获取构造函数信息
        $constructor = $reflector->getConstructor();

        // 获取构造函数的参数
        $denpendencies = $constructor->getParameters();

        if (!$denpendencies) {
            return new $abstract;
        }

        foreach ($denpendencies as $denpendency) {
            // 获取类
            $class = $denpendency->getClass();
          	// 获取类名
            // var_dump($class->name);
            if (!is_null($class)) {
                $params[] = $this->make($class->name); 
            }
        }
        // 从给出的参数创建一个新的类实例,并传递到类的构造函数中
        return $reflector->newInstanceArgs($params);
    }

    public function make(string $abstract)
    {
        return $this->getInstance($abstract);
    }
}

$ioc = new Ioc();
$sayA = $ioc->make('SayA');

$sayA->say();
```

## 4. 回调函数、匿名函数、闭包的关系

### 4.1 回调函函数

> **在主进程中执行的程序，根据某种条件从而去执行预先设定好的函数的函数**

举例：

> 以下是自知乎作者常溪玲的解说：
> 你到一个商店买东西，刚好你要的东西没有货，于是你在店员那里留下了你的电话，过了几天店里有货了，店员就打了你的电话，然后你接到电话后就到店里去取了货。在这个例子里，你的电话号码就叫回调函数，你把电话留给店员就叫登记回调函数，店里后来有货了叫做触发了回调关联的事件，店员给你打电话叫做调用回调函数，你到店里去取货叫做响应回调事件。

**回调函数的四种写法**

**1.函数字符串**

```php
<?php declare(strict_types=1);

function insert(int $i): bool
{
    echo "插入数据{$i}\n";
    return true;
}

function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) { // 满足条件时, 去执行回调函数
            call_user_func($function, $value); //call_user_func 把函数的第一个参数作为回调函数使用
        }
    }
}

$arr = range(0, 2000);

action($arr, 'insert');
```

**2.匿名函数**

```php
<?php declare(strict_types=1);

function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) { // 满足条件时, 去执行回调函数
            call_user_func($function, $value);
        }
    }
}

$arr = range(0, 2000);

action($arr, function ($i) {
    echo "插入数据{$i}\n";
    return true;
});

```

**3.类方法**

```php

<?php declare(strict_types=1);

function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) { // 满足条件时, 去执行回调函数
            call_user_func($function, $value);
        }
    }
}

$arr = range(0, 2000);

class A
{
    function insert(int $i): bool
    {
        echo "插入数据{$i}\n";
        return true;
    }
}

$a = new A;
action($arr, [$a, 'insert']);
```

**4. 类静态方法**

```php

<?php declare(strict_types=1);

function action(array $arr, callable $function)
{
    foreach ($arr as $value) {
        if ($value % 10 == 0) { // 满足条件时, 去执行回调函数
            call_user_func($function, $value);
        }
    }
}

$arr = range(0, 2000);

class A
{
    function static insert(int $i): bool
    {
        echo "插入数据{$i}\n";
        return true;
    }
}

action($arr, [$a, 'A::insert']);
action($arr, 'A::insert');
```

### 4.2 匿名函数

> **匿名函数（Anonymous functions），也叫闭包函数（`closures`），允许 临时创建一个没有指定名称的函数。最经常用作回调函数 [callable](https://www.php.net/manual/zh/language.types.callable.php)参数的值。当然，也有其它应用的情况。匿名函数目前是通过 [Closure](https://www.php.net/manual/zh/class.closure.php) 类来实现的。**

```php
<?php declare(strict_types=1);

$fun = function($name){
    printf("Hello %s\r\n",$name);
};
echo $fun('hello');

function a($callback){
    return $callback();
}

$a = "ranen";

a(function () use ($a){ // 匿名函数作用域仅在本函数内，不能调用外部变量，但可以使用use来引入外部变量
    echo $a."say hello\n";
    return 1;
});
```

### 4.3  闭包

> **闭包就是能够读取其他函数内部变量的函数**
>
> **闭包 = 匿名函数 + use**

```php
<?php declare(strict_types=1);

function tick($callback)
{
    while (1) {
        call_user_func($callback);
        sleep(1);
    }
}

class Love
{
    public function sayLove()
    {
        echo "I Love You!\n";
    }
}

$love = new Love();

tick(function () use ($love) {
    $love->sayLove();
});
```

## 5. serviceContainer

> 提供注册机制，通过依赖注入和反射将这个服务注册进服务容器内部，方便以后统一管理。当使用功能的时候直接通过容器实例化对象，然后直接使用。

* 作用：解决类与类之间的依赖关系

* 方法：通过依赖注入和PHP的反射类实现
* 类比成手机，而里面的app就是个服务提供者，用户需要什么能力，就可以安装不同的应用。

## 6. serviceProvider

> 指的是有能力提供服务的服务提供者。

将这些能力、服务都当做成第三方提供的，谁有能力就提供服务，不再是框架本身。比如数据库管理、图片管理等等都是一个serviceProvider
