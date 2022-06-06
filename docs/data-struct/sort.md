## 排序算法

### 1. 冒泡排序

```php
<?php

function BubbleSort($arr)
{
    $cnt = count($arr);
    for ($i = 0; $i < $cnt - 1; $i++)
    {
        for ($j = 0; $j < $cnt - $i - 1; $j++)
        {
            if ($arr[$j] > $arr[$j + 1])
            {
                $arr[$j] ^= $arr[$j + 1];
                $arr[$j + 1] ^= $arr[$j];
                $arr[$j] ^= $arr[$j + 1];
            }
        }
    }
    return $arr;
}
```

### 2. 选择排序

```php
<?php

function SelectionSort($arr)
{
    $cnt = count($arr);
    for ($i = 0; $i < $cnt - 1; $i++)
    {
        $minIndex = $i;
        for ($j = $i + 1; $j < $cnt; $j++)
        {
            if ($arr[$j] < $arr[$minIndex])
            {
                $minIndex = $j;
            }
        }
        $temp = $arr[$i];
        $arr[$i] = $arr[$minIndex];
        $arr[$minIndex] = $temp;
    }
    return $arr;
}
```

### 3. 归并排序

```php
<?php

function Merge(&$arr, $low, $mid, $high)
{
    $tmp = [];
    $i = $low; $j = $mid + 1; $k = 0;
    while ($i <= $mid && $j <= $high)
    {
        if ($arr[$i] <= $arr[$j])
            $tmp[$k++] = $arr[$i++];
        else
            $tmp[$k++] = $arr[$j++];
    }

    while ($i <= $mid) $tmp[$k++] = $arr[$i++];
    while ($j <= $high) $tmp[$k++] = $arr[$j++];

    $k = 0;
    for ($i = $low; $i <= $high; $i++)
        $arr[$i] = $tmp[$k++];
    unset($tmp);
}

function MergeSort(&$arr, $low, $high)
{
    if ($low >= $high) return;
    $mid = ($low + $high) >> 1;
    MergeSort($arr, $low, $mid);
    MergeSort($arr, $mid + 1, $high);
    Merge($arr, $low, $mid, $high);
}

```

### 4. 快速排序

```php
<?php

function swap(&$a, &$b)
{
    $a ^= $b;
    $b ^= $a;
    $a ^= $b;
}

function partition(&$arr, $l, $r)
{
    //swap($arr[$l], $arr[mt_rand() % ($r - $l + 1) + $l]);
    $v = $arr[$l];
    $j = $l;
    for ($i = $l + 1; $i <= $r; $i++)
    {
        if ($arr[$i] < $v)
        {
            swap($arr[++$j], $arr[$i]);
        }
    }
    swap($arr[$l], $arr[$j]);
    return $j;
}

function quickSort(&$arr, $l, $r)
{
    if ($l >= $r) return;
    $p = partition($arr, $l, $r);
    quickSort($arr, $l, $p - 1);
    quickSort($arr, $p + 1, $r);
}
```

