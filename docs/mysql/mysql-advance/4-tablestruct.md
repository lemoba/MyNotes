### 基本SQL

> [mysql文档](https://dev.mysql.com/doc/refman/5.7/en/)

#### 1. 创建表

```sql
CREATE TABLE `wp_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_pass` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_nicename` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_url` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT '0',
  `display_name` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
```

```sql
CREATE TABLE `books` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `author` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `book_name_unique` (`name`),
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 2. 执行脚本

##### 1) 找出数据库中引擎为InnoDB的所有表

```sql
SELECT table_schema, table_name, engine, sys.format_bytes(data_length) as data_size
FROM TABLES
WHERE engine = 'InnoDB'
AND table_schema NOT IN ('mysql', 'information_schema', 'performance_schema');
```



##### 2) 找出数据库中字符集不为utf8mb4的所有表

```sql
SELECT 
    CONCAT(TABLE_SCHEMA, '.', TABLE_NAME),
    COLUMN_NAME,
    character_set_name
FROM
    information_schema.COLUMNS
WHERE
    data_type IN ('varchar' , 'char', 'longtext', 'mediumtext', 'text')
        AND character_set_name <> 'utf8mb4'
        AND table_schema NOT IN ('mysql' , 'information_schema',
        'performance_schema');
```

#### 3.分区表

| <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304100644689.png" alt="image-20220304100644689" style="zoom:40%;" /> | <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304111517708.png" alt="image-20220304111517708" style="zoom:60%;" /> | <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304100921616.png" alt="image-20220304100921616" style="zoom:40%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |





#### 4.数据库的范式

> 数据库表设计时需要遵循的一些规范

<img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304101750663.png" alt="image-20220304101750663" style="zoom: 30%;" />

* 第一范式：每个列都不可以再拆分，强调的是列的原子性。
  * 没有重复的组
  * 全部的键属性都定义了
  * 全部的属性都依赖于主键
* 第二范式：在第一范式的基础上，一个表必须有一个主键，非主键列完全依赖于主键列，而不能是依赖于主键的一部分。（解决部分依赖）
  * 是1NF
  * 🙅🏻‍♀️不包含部分依赖（属性只依赖于主键的一部分）
* 第三范式：在第二范式的基础上，非主键列只依赖于主键，而不依赖于其他非主键。（解决传递依赖）
  * 是2NF
  * 🙅🏻‍♀️不包含传递依赖 （非主属性通过另一个非键值依赖于主键）



| <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304110822226.png" alt="image-20220304110822226" style="zoom:40%;" /> | <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304110841506.png" alt="image-20220304110841506" style="zoom:40%;" /> | <img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304111056165.png" alt="image-20220304111056165" style="zoom:40%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |

* 优点
  * 更新操作通常比较快
  * 没有或只有很少重复的数据
  * 表相对比较小、容易被缓存
* 缺点：查询数据需要多次关联 



#### 5. SELECT

##### 1) order by

* DESC: 降序，默认ASC：升序

* sort_buffer_size

  > 若需要对大量非索引字段进行排序，可以适当调大sort_buffer_size参数

```sql
SELECT 
   *
FROM
    lineitem
ORDER BY l_discount DESC
LIMIT 1000;


SELECT 
   l_orderkey, l_commitDATE, l_linenumber
FROM
    lineitem
ORDER BY 3 #对第三个column进行排序(l_linenumber) (不推荐，会被打)
LIMIT 1000;


show variables like 'sort_buffer_size';
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| sort_buffer_size | 262144 |
+------------------+--------+

show status like 'sort%';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Sort_merge_passes | 0     |
| Sort_range        | 0     |
| Sort_rows         | 10000 |
| Sort_scan         | 1     |
+-------------------+-------+

flush status;
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Sort_merge_passes | 0     |
| Sort_range        | 0     |
| Sort_rows         | 0     |
| Sort_scan         | 0     |
+-------------------+-------+
```

##### 2) limit

> 分页
> limit offset

```sql
SELECT * FROM orders LIMIT 0 , 10; #取前10条
SELECT * FROM orders LIMIT 10 , 10; #取11~20条
```

##### 3)  group by

> 分组

```sql
# 1
SELECT 
    DATE_FORMAT(o_orderDATE, '%Y-%m') AS date,
    SUM(o_totalprice) AS total
FROM
    orders
GROUP BY DATE_FORMAT(o_orderDATE, '%Y-%m');


# 2
SELECT 
    o_clerk,
    COUNT(1) AS count,
    DATE_FORMAT(o_orderDATE, '%Y-%m') AS date,
    SUM(o_totalprice) AS sum,
    AVG(o_totalprice) AS avg
FROM
    orders
GROUP BY o_clerk , DATE_FORMAT(o_orderDATE, '%Y-%m');


# 优化
# 2
EXPLAIN SELECT 
    o_clerk,
    COUNT(1) AS count,
    DATE_FORMAT(o_orderDATE, '%Y-%m') AS date,
    SUM(o_totalprice) AS sum,
    AVG(o_totalprice) AS avg
FROM
    orders
GROUP BY o_clerk , DATE_FORMAT(o_orderDATE, '%Y-%m');

*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: orders
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1495809
     filtered: 100.00
        Extra: Using temporary; Using filesort
1 row in set, 1 warning (0.00 sec)

# 设置 tmp_table_size

show variables like '%tmp%';

+----------------------------------+----------+
| Variable_name                    | Value    |
+----------------------------------+----------+
| default_tmp_storage_engine       | InnoDB   |
| innodb_tmpdir                    |          |
| internal_tmp_disk_storage_engine | InnoDB   |
| max_tmp_tables                   | 32       |
| slave_load_tmpdir                | /tmp     |
| tmp_table_size                   | 16777216 |
| tmpdir                           | /tmp     |
+----------------------------------+----------+


# 3 GROUP_CONCAT：以逗号连接分组字段
SELECT 
    user_id, GROUP_CONCAT(price)
FROM
    a
GROUP BY user_id;

+---------+---------------------+
| user_id | group_concat(price) |
+---------+---------------------+
|       1 | 100,10,32           |
|       2 | 132,33              |
|       3 | 432,47              |
+---------+---------------------+


# 4 SEPARATOR：指定符号连接分组字段
SELECT 
    user_id,
    GROUP_CONCAT(price
        SEPARATOR ':')
FROM
    a
GROUP BY user_id;

+---------+-----------------------------------+
| user_id | group_concat(price separator ':') |
+---------+-----------------------------------+
|       1 | 100:10:32                         |
|       2 | 132:33                            |
|       3 | 432:47                            |
+---------+-----------------------------------+

# 5 排序
SELECT 
    user_id,
    GROUP_CONCAT(price
        ORDER BY price
        SEPARATOR ':')
FROM
    a
GROUP BY user_id;

+---------+--------------------------------------------------+
| user_id | group_concat(price order by price separator ':') |
+---------+--------------------------------------------------+
|       1 | 10:32:100                                        |
|       2 | 33:132                                           |
|       3 | 47:432                                           |
+---------+--------------------------------------------------+
```

**Tips：count(1)、count(2)、count(filed)和count(*)的区别**

* count(filed)：统计filed不为NULL的记录总数
* count(1)、count(2)、count(*)：统计所有记录总数

##### 4)  having

> 对分组的数据进行过滤

```sql
SELECT 
    o_clerk,
    COUNT(1) AS count,
    DATE_FORMAT(o_orderDATE, '%Y-%m') AS date,
    SUM(o_totalprice) AS sum,
    AVG(o_totalprice) AS avg
FROM
    orders
GROUP BY o_clerk , DATE_FORMAT(o_orderDATE, '%Y-%m')
HAVING COUNT(1) > 20;
```

##### 5) distinct

> 去重

```sql
# 1
SELECT user_id FROM a;
+---------+
| user_id |
+---------+
|       1 |
|       1 |
|       1 |
|       2 |
|       2 |
|       3 |
|       3 |
+---------+


# 2
SELECT DISTINCT user_id FROM a;
+---------+
| user_id |
+---------+
|       1 |
|       2 |
|       3 |
+---------+
```

#### 6. 子查询

> 一个查询语句嵌套在另一个查询语句内部的查询


##### 1) in

> 独立子查询

```sql
SELECT 
    *
FROM
    employees
WHERE
    emp_no IN (SELECT 
            emp_no
        FROM
            dept_emp
        WHERE
            dept_no = 'd005');
```

##### 2) exists

> 相关子查询, 需要和外部表进行关联

```sql
SELECT 
    *
FROM
    employees e
WHERE
    EXISTS( SELECT 
            *
        FROM
            dept_emp de
        WHERE
            dept_no = 'd005'
                AND de.emp_no = e.emp_no);
```

<img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220304162354707.png" alt="image-20220304162354707" style="zoom:50%;" />

##### 3) not in

> 对于子查询中的NULL值，总是返回0或NULL

```sql
# 1
SELECT 'c' NOT IN ('a' , 'b', NULL);

+-----------------------------+
| 'c' not in ('a', 'b', NULL) |
+-----------------------------+
|                        NULL |
+-----------------------------+

# 2
SELECT 'a' NOT IN ('a' , 'b', NULL);
+-----------------------------+
| 'a' not in ('a', 'b', NULL) |
+-----------------------------+
|                           0 |
+-----------------------------+
```

* **带有NULL值字段的子查询使用NOT IN 结果总是为空，需要用IS NOT NULL 来过滤**

```sql
SELECT * FROM a WHERE user_id NOT IN (SELECT y FROM b);
SELECT * FROM a WHERE user_id NOT IN (SELECT y FROM b WHERE y IS NOT NULL);

SELECT * FROM a WHERE user_id NOT EXISTS (SELECT y FROM b WHERE y = a.user_id);
```

#### 7. 分页优化

> limit 100000, 30 数值越大，性能越差

```sql
# 1
SELECT 
    *
FROM
    employees
ORDER BY birth_date
LIMIT 5;
 
# 2 只能进行上一页、下一页不能调到指定页

# 设置索引
ALTER TABLE employees ADD INDEX inx_birth_date(birth_date, emp_no);

SELECT 
    *
FROM
    employees
WHERE
    (birth_date , emp_no) > ('1952-02-02' , 222160)
ORDER BY birth_date , emp_no
LIMIT 5;

# 3 一次搜索多条数据1000条，缓存到前端。
# 4 缓存到redis
```

#### 8. INSERT

```sql
# 单条插入
INSERT INTO test VALUES (1, 2, 3);

# 多条插入
INSERT INTO test VALUES (1, 2, 3), (4, 5, 6);...

# 显示列名
INSERT INTO test SET a = 1, b = 2, c = 3;

# 批量导入数据
INSERT INTO test SELECT * FROM test1;


# 存在则执行update操作
INSERT INTO zz VALUES (2) ON DUPLICATE KEY UPDATE a = a + 10;
+----+
| a  |
+----+
|  1 |
|  3 |
| 12 |
+----+

# replace into 幂等操作
REPLACE INTO zz VALUES (2, 3);

# a 主键索引
# b 唯一键索引

# 插入2 发现重复则删除 2 2, 然后继续插入发现3也存在重复则删除1 3, 最后插入2， 3 

# before
+---+---+
| a | b |
+---+---+
| 3 | 1 |
| 2 | 2 |
| 1 | 3 |
+---+---+

# after
+---+---+
| a | b |
+---+---+
| 3 | 1 |
| 2 | 3 |
+---+---+

```

#### 9. DELETE

> 务必带上where条件

```sql
DELETE FROM a WHERE price = 47;

# 多表删除
DELETE x, y FROM x LEFT JOIN y ON x.a = y.a WHERE y.a IS NULL;
```

#### 10. UPDATE

> 务必带上where条件

```sql
# 1
UPDATE a SET price = price + 10 WHERE user_id = 3;




# 2
UPDATE y SET a = a + 1, b = a + 10 WHERE a = 0;

# before
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |   20 |
|    2 |   30 |
|    0 |   20 |
+------+------+

# after
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |   20 |
|    2 |   30 |
|    1 |   11 |
+------+------+

# 3
select @a:=@a+1, a, b from x, (select @a:=0)a;

```

#### 11. 临时表

* 临时表是基于会话的
* 数据存在于datadir下面的ibtmp1
* 表结构定义文件在tmp/目录下 #sql1b1d_5e_0.frm

```sql
# show table 不存在，但是可以进行操作
CREATE TEMPORARY TABLE cc (a INT NOT NULL);
```

#### 12. 存储过程

> 性能拉胯

<img src="/Users/lemoba/Library/Application Support/typora-user-images/image-20220307205636961.png" alt="image-20220307205636961" style="zoom:30%;" />
