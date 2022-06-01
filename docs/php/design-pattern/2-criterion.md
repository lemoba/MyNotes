### 1. 组合与继承

> 组合、解耦、接口的力量、模式分类

**继承**：可以有效应对环境及上下文的改变，但是它也会限制灵活性，特别是类承担过多职责时

```php
<?php

declare(strict_types=1);

namespace DsignPatterns\Object;

abstract class Lesson
{
    protected $duration;
    public const FIXED = 1;
    public const TIMED = 2;
    private $costtype;

    public function __construct(int $duration, $costtype)
    {
        $this->duration = $duration;
        $this->costtype = $costtype;
    }

    public function cost(): int
    {
        switch ($this->costtype) {
            case self::FIXED:
                return (5 * $this->duration);
                break;
            case self::TIMED:
                return 30;
                break;
            default:
                $this->costtype = self::FIXED;
                return 30;
        }
    }

    public function chargeType(): string
    {
        switch ($this->costtype) {
            case self::TIMED:
                return "hourly rate";
                break;
            case self::FIXED:
                return "fixed rate";
                break;
            default:
                $this->costtype = self::FIXED;
                return "fixed rate";
        }
    }

    // Lesson的其他类
}

class Lecture extends Lesson
{

}


class Seminar extends Lesson
{

}

$lecture = new Lecture(5, Lesson::FIXED);
print "{$lecture->cost()} ({$lecture->chargeType()})\n";

$seminar = new Seminar(3, Lesson::TIMED);
print "{$seminar->cost()} ({$seminar->chargeType()})\n";

/**
 * 缺点：cost chargeType里面有重复代码 
 * 通常使用多态来代替条件语句
 */
```

**组合**: 可以使用功能策略模式来解决上述问题，策略模式用于将一组算法移到一个独立的类型中。组合的优点是各个类的职责更加集中，能使代码更加灵活，但是这也会降低代码的可读性。

```php
<?php

declare(strict_types=1);

namespace DsignPatterns\Object;


/**
 * 负责管理课程数据
 */
abstract class Lesson
{
    private $duration;
   
    private $costStrategy;

    public function __construct(int $duration, CostStrategy $strategy)
    {
        $this->duration = $duration;
        $this->costStrategy = $strategy;
    }

    public function cost(): int
    {
        return $this->costStrategy->cost($this);
    }

    public function chargeType(): string
    {
        return $this->costStrategy->chargeType();
    }

    public function getDuration(): int
    {
        return $this->duration;
    }
    // Lesson的其他类
}

// 负责计算费用
abstract class CostStrategy
{
    abstract public function cost(Lesson $lesson): int;
    abstract public function chargeType(): string;
}

class Lecture extends Lesson
{

}


class Seminar extends Lesson
{

}

class TimedCostStrategy extends CostStrategy
{
    public function cost(Lesson $lesson): int
    {
        return ($lesson->getDuration() * 5);
    }

    public function chargeType(): string
    {
        return "hourly rate";
    }
}

class FixedCostStrategy extends CostStrategy
{
    public function cost(Lesson $lesson): int
    {
        return 30;
    }

    public function chargeType(): string
    {
        return "fixed rate";
    }
}


$lessons[] = new Seminar(4, new TimedCostStrategy());
$lessons[] = new Lecture(4, new FixedCostStrategy());

foreach ($lessons as $lesson) {
    print "lesson charge {$lesson->cost()}."; // 20. hourly rate  30.fixed rate
    print "Charge type {$lesson->chargeType()}\n";
}

/**
 * 相比继承，组合对象的方式使代码更灵活， 但是会降低代码的可读性
 */
```

**解耦**：隐藏代码细节(**封装**)，对外提供统一接口。比如对于数据库驱动类，我们只需要通过数据库抽象层来应对不同的驱动，比如mysql, SQLite等

```php
// 通知
abstract class Notifier
{
    public static function getNotifier(): Notifier
    {
        if (rand(1, 2) === 1) {
            return new MailNotifier();
        } else {
            return new TextNotifier();
        }
    }
    abstract public function inform($message);
}

class MailNotifier extends Notifier
{
    public function inform($message)
    {
        print "MAIL notifiction: {$message}\n"; 
    }
}

class TextNotifier extends Notifier
{
    public function inform($message)
    {
        print "TEXT notifiction: {$message}\n";  
    }
}

// 添加注册通知
class RegistrationMgr
{
    public function register(Lesson $lesson)
    {
        // 发送通知
        $notifier = Notifier::getNotifier();
        $notifier->inform("new lesson: cost ({$lesson->cost()})");
    }
}


$lessons1 = new Seminar(4, new TimedCostStrategy());
$lessons2 = new Lecture(4, new FixedCostStrategy());
$mgr = new RegistrationMgr();
$mgr->register($lessons1);
$mgr->register($lessons2);
```

### 2. 针对接口编程， 而不是针对实现编程

> 通常使用抽象或者通用类型作为方法的参数类型更好，使用具体类型作为参数会限制代码在运行时的灵活性

### 3. 常用的模式

**用于生成对象的模式**

关注对象的实例化，如果在设计中使用了抽象父类，那么我们必须考虑从具体子类中实例化出对象的策略，因为在系统中传递的是这些对象。

** 用于组成对象和类的模式**

帮助我们组织对象的组成关系，通俗的说就是展示了如何组合对象和类。

**面向任务的模式**

描述了使用类和对象协作达成目标的机制。

**企业设计模式**

描述典型的WEB编程问题和解决方案的模式。主要来自《企业应用架构模式》和《J2EE核心模式》，适用于表现层和业务逻辑层。

**数据库模式**

帮助我们存储和读取数据，并实现对象和数据库间的映射。
