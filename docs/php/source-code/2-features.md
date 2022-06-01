### 1. 太空船操作符

* 太空船操作符用于比较两个表达式
* 例如，当$a小于、等于、大于$b时分别返回-1， 0， 1

```c
echo 1 <=> 1; // 0
echo 1 <=> 2; //-1
echo 2 <=> 1; //1
```

### 2. 类型声明

* declare(strict_types=1); //strict_types=1表示开启严格模式
* 例如

```php
function sumOfInts(int...$ints): int {
    return array_sum($ints);
}
```

### 3. null合并操作符

```php
$page = isset($_GET['page']) ? $_GET['page'] : 0;
$page = isset($GET['page']) ?? 0
```

### 4. 常量数组

```php
define('ANIMALS', ['dog', 'cat', 'bird']);
```

### 5. NameSpace批量导入

```php
use Space\{ClassA, ClassB, ClassC as C}
```

### 6. throwable接口

```php
try {
	undefindfunc();
}catch (Error $e){
	var_dump($e);
}

set_exception_handler ({
    function($e) {
        var_dump($e);
});
undefindfunc();
```

### 7. Closure::call()

> [kləʊʒə(r)]	

```php
class Test {
    private $num = 1;
}

$f = function() {
    return $this->num + 1;
};

echo $f->call(new Test);
```

### 8. intdiv函数

```php
intdiv(10, 3)
```

### 9. list的方括号写法

```php
//before
$arr = [1, 2, 3];
list($a, $b, $c) = $arr;

//now
$arr = [1, 2, 3];
[$a, $b, $c] = $arr;
```

### 10. 抽象语法树(AST)

```php
($a)['b'] = 1;
```

