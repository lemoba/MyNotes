> 一个简单示例

```php
<?php

namespace DsignPatterns\Object\CH9;


abstract class Eemplyee
{
    protected $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    abstract public function fire();
}

class Minion extends Eemplyee
{
    public function fire()
    {
        print "{$this->name}: I'll clear my dad\n";
    }
}

class CluedUp extends Eemplyee
{
    public function fire()
    {
        print "{$this->name}: I'll clear my dad\n";
    }
}

class WellConnected extends Eemplyee
{
    public function fire()
    {
        print "{$this->name}: I'll clear my dad\n";
    }
}

class NastyBoss
{
    protected $employees = [];

    public function addEmployee(string $employeeName)
    {
        $this->employees[] = new Minion($employeeName);
    }

    public function projectFails()
    {
        if (count($this->employees) > 0) {
            $emp = array_pop($this->employees);
            $emp->fire();
        }
    }
}

$boss = new NastyBoss();
$boss->addEmployee('harry');
$boss->addEmployee('bob');
$boss->addEmployee('mary');
$boss->projectFails();

/**
 * 缺点：直接在NastyBoss类中实例化Minion对象限制了程序的灵活性, 可以使用多态来改变这一问题
 */

// 改进
class NastyBoss
{
    protected $employees = [];

  	// 接受外部传参的Eemplyee类型
    public function addEmployee(Eemplyee $employee)
    {
        $this->employees[] = $employee;
    }

    public function projectFails()
    {
        if (count($this->employees) > 0) {
            $emp = array_pop($this->employees);
            $emp->fire();
        }
    }
}

$boss = new NastyBoss();
$boss->addEmployee(new Minion('harry'));
$boss->addEmployee(new Minion('bob'));
$boss->addEmployee(new Minion('mary'));
$boss->projectFails();
$boss->projectFails();
$boss->projectFails();


/**
 * 我们可以使用"委托对象实例", 将Employee对象的生成委托给一个单独的类或方法
 */
abstract class Eemplyee
{
    protected $name;
    private static $types = ['Minion', 'CluedUp', 'WellConnected'];
    
    public static function recruit(string $name)
    {
        $num = rand(1, count(static::$types) - 1);
        $class = __NAMESPACE__.'\\'.self::$types[$num];
        return new $class($name);
    }


    public function __construct(string $name)
    {
        $this->name = $name;
    }

    abstract public function fire();
}

$boss = new NastyBoss();
$boss->addEmployee(Eemplyee::recruit('harry'));
$boss->addEmployee(Eemplyee::recruit('bob'));
$boss->addEmployee(Eemplyee::recruit('mary'));
```

### 1. 单例模式

> 让应用只存在一个对象的实例，处理所有的调用。
>
> **注：单例模式可能被认为是一种"反模式"。为了获得更好的可测试性和可维护性，建议使用依赖注入。**

```php
<?php

namespace DsignPatterns\Creational\Singleton;

use Exception;

final class Singleton
{
    private static ?Singleton $instance = null;

    public static function getInstance(): Singleton
    {
        if (is_null(static::$instance)) {
            static::$instance = new static();
        }
        return static::$instance;
    }
		
    private function __construct()
    {
    }

    private function __clone()
    {
    }
	
  
  	// unserialize 的时候会调用
    public function __wakeup()
    {
        throw new Exception('Cannot unserialize Singleton');
    }
}
```

### 2. 工厂方法模式

> 面向对象的设计强调抽象类高于实现类，也就是我们尽量一般化，而不是特殊化
>
> 工厂方法模式能够解决代码关注抽象类型时如何创建对象实例的问题，用实现类负责实例化对象。

```php
<?php

namespace DsignPatterns\Creational\Factory;

abstract class ApptEncoder
{
    abstract public function encode(): string;
}

class BloggsApptEncoder extends ApptEncoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}


class MegaApptEncoder extends ApptEncoder
{
    public function encode(): string
    {
        return "Appointment data encoded in MegaCal format\n";
    }
}

abstract class CommsManager
{
   abstract public function getHeaderText(): string;
   abstract public function getApptEncoder(): ApptEncoder;
   abstract public function getFooterText(): string;
}

class BloggsCommsManager extends CommsManager
{
    public function getHeaderText(): string
    {
        return "BloggsCal header\n";
    }

    public function getApptEncoder(): ApptEncoder
    {
        return new BloggsApptEncoder();
    }
    
    public function getFooterText(): string
    {
        return "BloggsCal footer\n";
    }
}
$mgr = new BloggsCommsManager();
print $mgr->getHeaderText();
print $mgr->getApptEncoder()->encode();
print $mgr->getFooterText();
```

### 3. 抽象工厂

> 创建一系列互相关联或依赖的对象时，不指定他们具体的类。抽象工厂的客户端并不关心对象是如何创建的，而只知道它们是怎样组合的。

```php
<?php

namespace DsignPatterns\Creational\AbstractFactory;

abstract class ApptEncoder
{
    abstract public function encode(): string;
}

abstract class TtdEncoder
{
    abstract public function encode(): string;
}

abstract class ContactEncoder
{
    abstract public function encode(): string;
}

class BloggsApptEncoder extends ApptEncoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

class BloggsTtdEncoder extends TtdEncoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

class BloggsContactEncoder extends ContactEncoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

abstract class CommsManager
{
   abstract public function getHeaderText(): string;
   abstract public function getApptEncoder(): ApptEncoder;
   abstract public function getTtdEncoder(): TtdEncoder;
   abstract public function getContactEncoder(): ContactEncoder;
   abstract public function getFooterText(): string;
}

class BloggsCommsManager extends CommsManager
{
    public function getHeaderText(): string
    {
        return "BloggsCal header\n";
    }

    public function getApptEncoder(): ApptEncoder
    {
        return new BloggsApptEncoder();
    } 
    public function getTtdEncoder(): TtdEncoder
    {
        return new BloggsTtdEncoder();
    }
    public function getContactEncoder(): ContactEncoder
    {
        return new BloggsContactEncoder();
    }
    public function getFooterText(): string
    {
        return "BloggsCal footer\n";
    }
}

$mgr = new BloggsCommsManager();
print $mgr->getHeaderText();
print $mgr->getApptEncoder()->encode();
print $mgr->getFooterText();

/**
 * 缺点添加新品的时候不仅创建实现类还要修改抽象类
 */
```

```php
<?php

namespace DsignPatterns\Creational\AbstatctFactory;

interface Encoder
{
    public function encode(): string;
}

abstract class CommsManager
{
    const APPT    = 1;
    const TTD     = 2;
    const CONTACT = 3;
    abstract public function getHeaderText(): string;
    abstract public function make(int $flag): Encoder;
    abstract public function getFooterText(): string;
}

class BloggsApptEncoder implements Encoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

class BloggsTtdEncoder implements Encoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

class BloggsContactEncoder implements Encoder
{
    public function encode(): string
    {
        return "Appointment data encoded in BloggsCal format\n";
    }
}

class BloggsCommsManager extends CommsManager
{
    public function getHeaderText(): string
    {
        return "BloggsCal header\n";
    }

    public function make(int $flag): Encoder
    {
        switch ($flag) {
            case self::APPT:
                return new BloggsApptEncoder();
                break;
            case self::TTD:
                return new BloggsTtdEncoder();
                break;
            default:
                return new BloggsContactEncoder();
        }
    }

    public function getFooterText(): string
    {
        return "BloggsCal footer\n";
    }
}

$mgr = new BloggsCommsManager();
print $mgr->getHeaderText();
var_dump($mgr->make(BloggsCommsManager::TTD));
print $mgr->getFooterText();

```

### 4. 静态工厂

> 与 抽象工厂 类似，静态工厂模式用于创建一系列互相关联或依赖的对象。它与抽象工厂模式的区别在于，静态工厂模式仅使用 一个静态方法 来创建所有它可以创建的类型。通常，这个静态方法被命名为：`factory` 或 `build`。

```php
<?php

namespace DsignPatterns\Creational\StaticFactory;

interface Formatter
{
    public function format(string $input): string;
}   

class FormatterNumber implements Formatter
{
    public function format(string $input): string
    {
        return 'FormatterNumber';
    }
}

class FormatterString implements Formatter
{
    public function format(string $input): string
    {
        return 'FormatterString';
    }
}

final class StaticFactory
{
    public static function build(string $name): Formatter
    {
        switch ($name) {
            case 'number':
                return new FormatterNumber();
                break;
            default:
                return new FormatterString();
        }
    }
}
```

### 5. 简单工厂

> 它不同于静态工厂，因为它不是静态的

```php
<?php

namespace DsignPatterns\Object\CH9;


class SimpleFactory
{
    public function createBicycle(): Bicycle
    {
        return new Bicycle();
    }
}

class Bicycle
{
    public function driveTo(string $destination)
    {
    		echo 'drive';
    }
}
```

### 6. 原型模式

> 平行继承层次的出现是工厂方法模式带来的一个问题。
>
> 原型模式就是通过clone关键字来复制既存的具体产品，这样具体产品类自身会变为生成它们自己的基础。该模式允许我们用组合代替继承，提高代码运行的灵活性并减少创建的类的数量。

### 7. 依赖注入

> 依赖注入是通过构造函数、方法或直接向字段赋予组件依赖关系的地方

[参考文档](http://fabien.potencier.org/what-is-dependency-injection.html)

```php
class SessionStorage
{
    function __construct($cookieName = 'PHP_SESS_ID')
    {
      session_name($cookieName);
      session_start();
    }

    function set($key, $value)
    {
      $_SESSION[$key] = $value;
    }

    function get($key)
    {
      return $_SESSION[$key];
    }

    // ...
}

// 1. 硬编码
class User
{
    protected $storage;

    function __construct()
    {
      // 硬编码，耦合性太高
      $this->storage = new SessionStorage();
    }

    function setLanguage($language)
    {
      $this->storage->set('language', $language);
    }

    function getLanguage()
    {
      return $this->storage->get('language');
    }

    // ...
}

$user = new User();
$user->setLanguage('fr');
$user_language = $user->getLanguage();


# 2. 使用常量
define('STORAGE_SESSION_NAME', 'SESSION_ID');

class User
{
    function __construct()
    {
      $this->storage = new SessionStorage(STORAGE_SESSION_NAME);
    }

    // ...
}

class User
{
    function __construct($sessionName)
    {
      $this->storage = new SessionStorage($sessionName);
    }

    // ...
}
$user = new User('SESSION_ID');

# 3. 设置数组选项
class User
{
    function __construct($storageOptions)
    {
      $this->storage = new SessionStorage($storageOptions['session_name']);
    }

  	// ...
}

$user = new User(array('session_name' => 'SESSION_ID'));


# 4. 依赖注入, 在外部实例化对象，通过参数传入内部
class User
{
    function __construct($storage)
    {
      $this->storage = $storage;
    }

  // ...
}
$storage = new SessionStorage('SESSION_ID');
$user = new User($storage);

```

