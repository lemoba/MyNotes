## 《数据库SQL实战》题解

> 本专题为数据库SQL实战，每道题均为牛客精选，同时每道题均有考试模式和练习模式，可切换练习，支持mysql和sqlite数据库。包含数据库查找、增加、删除等知识点，可根据需求练习。
>
> 目来源：[牛客网](https://www.nowcoder.com/ta/sql)

### 😋[简单]

#### SQL1. 查找最晚入职员工的所有信息

[链接](https://www.nowcoder.com/practice/218ae58dfdcd4af195fff264e062138f?tpId=82&tqId=29753&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT * FROM employees WHERE hire_date = (SELECT max(hire_date) FROM employees)
```

#### SQL2. 查找入职员工时间排名倒数第三的员工所有信息

[链接](https://www.nowcoder.com/practice/ec1ca44c62c14ceb990c3c40def1ec6c?tpId=82&tqId=29754&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT * FROM employees ORDER BY hire_date DESC LIMIT 2, 1
```

#### SQL3. 查找所有已经分配部门的员工的last_name和first_name

[链接](https://www.nowcoder.com/practice/6d35b1cd593545ab985a68cd86f28671?tpId=82&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.last_name, e.first_name, d.dept_no
FROM employees As e
JOIN dept_emp As d
ON e.emp_no = d.emp_no
```

#### SQL4. 查找薪水涨幅超过15次的员工号emp_no以及其对应的涨幅次数t

[链接](https://www.nowcoder.com/practice/6d4a4cff1d58495182f536c548fee1ae?tpId=82&tqId=29759&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT emp_no, COUNT(salary) as t
FROM salaries
GROUP BY emp_no
HAVING t > 15;
```

#### SQL5. 找出所有员工当前具体的薪水salary情况

[链接](https://www.nowcoder.com/practice/ae51e6d057c94f6d891735a48d1c2397?tpId=82&tqId=29760&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT DISTINCT salary 
FROM salaries
ORDER BY salary DESC;
```

#### SQL6. 获取所有非manager的员工emp_no

[链接](https://www.nowcoder.com/practice/32c53d06443346f4a2f2ca733c19660c?tpId=82&tqId=29762&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT emp_no
FROM employees
WHERE emp_no
NOT IN (SELECT emp_no FROM dept_manager);
```

#### SQL7. 查找employees表所有emp_no为奇数

[链接](https://www.nowcoder.com/practice/a32669eb1d1740e785f105fa22741d5c?tpId=82&tqId=29767&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT * FROM employees
WHERE emp_no&1 AND last_name != 'Mary'
ORDER BY hire_date DESC;
```

#### SQL8. 获取当前薪水第二多的员工的emp_no以及其对应的薪水salary  

[链接](https://www.nowcoder.com/practice/8d2c290cc4e24403b98ca82ce45d04db?tpId=82&tqId=29769&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT emp_no, salary
FROM salaries
ORDER BY salary DESC
LIMIT 1, 1;
```

#### SQL9. 将employees表的所有员工的last_name和first_name拼接起来作为Name，中间以一个空格区分  

[链接](https://www.nowcoder.com/practice/6744b90bbdde40209f8ecaac0b0516fe?tpId=82&tqId=29800&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT concat_ws(' ', last_name, first_name) 
AS NAME
FROM employees;
```

#### SQL10.  批量插入数据 

[链接](https://www.nowcoder.com/practice/51c12cea6a97468da149c04b7ecf362e?tpId=82&tqId=29802&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
INSERT INTO actor(actor_id, first_name, last_name, last_update)
VALUES(1, 'PENELOPE', 'GUINESS', '2006-02-15 12:34:33'),
      (2, 'NICK', 'WAHLBERG', '2006-02-15 12:34:33');
```

#### SQL11.  删除emp_no重复的记录,只保留最小的id对应的记录

[链接](https://www.nowcoder.com/practice/3d92551a6f6d4f1ebde272d20872cf05?tpId=82&tqId=29810&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
DELETE FROM titles_test
WHERE id NOT IN (
    SELECT *
    FROM (
        SELECT MIN(id)
        FROM titles_test
        GROUP BY emp_no
) AS a);
```

#### SQL12.  将所有to_date为9999-01-01的全部更新为NULL,且 from_date更新为2001-01-01

[链接](https://www.nowcoder.com/practice/859f28f43496404886a77600ea68ef59?tpId=82&tqId=29811&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
UPDATE titles_test
SET to_date = NULL, from_date = '2001-01-01'
WHERE to_date = '9999-01-01';
```

#### SQL13.  将id=5以及emp_no=10001的行数据替换成id=5以及emp_no=10005,其他数据保持不变，使用replace实现

[链接](https://www.nowcoder.com/practice/2bec4d94f525458ca3d0ebf3bc8cd240?tpId=82&tqId=29812&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
UPDATE titles_test
SET emp_no = replace(emp_no, 10001, 10005)
WHERE id = 5
```

#### SQL14.  将titles_test表名修改为titles_2017

[链接](https://www.nowcoder.com/practice/5277d7f92aa746ab8aa42886e5d570d4?tpId=82&tqId=29813&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
RENAME TABLE titles_test TO titles_2017;
```

#### SQL15.  出现三次以上相同积分的情况

[链接](https://www.nowcoder.com/practice/c69ac94335744480aa50646864b7f24d?tpId=82&tqId=35079&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT number 
FROM grade
GROUP BY number
HAVING COUNT(number) >= 3;
```

#### SQL16.  找到每个人的任务

[链接](https://www.nowcoder.com/practice/9dd9182d029a4f1d8c1324b63fc719c9?tpId=82&tqId=35081&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT p.id, p.name, t.content
FROM task t
RIGHT JOIN person p
ON p.id = t.person_id
ORDER BY p.id;
```

#### SQL17.  牛客每个人最近的登录日期(一)

[链接](https://www.nowcoder.com/practice/ca274ebe6eac40ab9c33ced3f2223bb2?tpId=82&tqId=35084&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT user_id, MAX(date) as d
FROM login
GROUP BY user_id
ORDER BY user_id;
```

#### SQL18.  考试分数(一)

[链接](https://www.nowcoder.com/practice/f41b94b4efce4b76b27dd36433abe398?tpId=82&tqId=35492&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT job, round(avg(score), 3) as avg
FROM grade
GROUP BY job
ORDER BY avg(score) DESC
```

### 😜[中等]

#### SQL19.  查找各个部门当前领导当前薪水详情以及其对应部门编号dept_no

[链接](https://www.nowcoder.com/practice/c63c5b54d86e4c6d880e4834bfd70c3b?tpId=82&tqId=29755&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT s.*, d.dept_no
FROM salaries as s
JOIN dept_manager as d
ON s.emp_no = d.emp_no
ORDER BY s.emp_no
```

#### SQL20.  查找所有员工的last_name和first_name以及对应部门编号dept_no

[链接](https://www.nowcoder.com/practice/dbfafafb2ee2482aa390645abd4463bf?tpId=82&tqId=29757&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.last_name, e.first_name, d.dept_no
FROM employees as e
LEFT JOIN dept_emp as d
ON d.emp_no = e.emp_no
```

#### SQL21.  获取所有员工当前的manager

[链接](https://www.nowcoder.com/practice/e50d92b8673a440ebdf3a517b5b37d62?tpId=82&tqId=29763&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.emp_no, m.emp_no as manager
FROM dept_emp as e
JOIN dept_manager as m
ON e.dept_no = m.dept_no
WHERE e.emp_no <> m.emp_no
```

#### SQL22.  统计出当前各个title类型对应的员工当前薪水对应的平均工资

[链接](https://www.nowcoder.com/practice/c8652e9e5a354b879e2a244200f1eaae?tpId=82&tqId=29768&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT t.title, avg(s.salary)
FROM salaries as s
JOIN titles as t
ON t.emp_no = s.emp_no
GROUP BY t.title
ORDER BY avg(s.salary);
```

#### SQL23.  查找所有员工的last_name和first_name以及对应的dept_name

[链接](https://www.nowcoder.com/practice/5a7975fabe1146329cee4f670c27ad55?tpId=82&tqId=29771&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.last_name, e.first_name, d.dept_name
FROM employees as e
LEFT JOIN dept_emp as de ON e.emp_no = de.emp_no
LEFT JOIN departments as d ON d.dept_no = de.dept_no
```

#### SQL24.  统计各个部门的工资记录数

[链接](https://www.nowcoder.com/practice/6a62b6c0a7324350a6d9959fa7c21db3?tpId=82&tqId=29774&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT d.*, count(s.salary) as sum
FROM departments as d
JOIN dept_emp as de ON d.dept_no = de.dept_no
JOIN salaries as s ON s.emp_no = de.emp_no
GROUP BY d.dept_no
ORDER BY d.dept_no
```

#### SQL25.  使用join查询方式找出没有分类的电影id以及名称

[链接](https://www.nowcoder.com/practice/a158fa6e79274ac497832697b4b83658?tpId=82&tqId=29781&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT f.film_id, f.title
FROM film as f
LEFT JOIN film_category as fc ON fc.film_id = f.film_id
LEFT JOIN category as c ON c.category_id = fc.category_id 
WHERE fc.category_id is NULL 
```

#### SQL26.  使用子查询的方式找出属于Action分类的所有电影对应的title,description

[链接](https://www.nowcoder.com/practice/2f2e556d335d469f96b91b212c4c203e?tpId=82&tqId=29782&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT f.title, f.description
FROM film as f
WHERE f.film_id IN (
    SELECT fc.film_id 
    FROM film_category AS fc
    WHERE fc.category_id = (
        SELECT c.category_id
        FROM category as c
        WHERE c.name = 'Action'
    )
)
```

#### SQL27.  创建一个actor表，包含如下列信息

[链接](https://www.nowcoder.com/practice/ac233de508ef4849b0eeb4f38dcf09cf?tpId=82&tqId=29801&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
CREATE TABLE IF NOT EXISTS actor (
    action_id smallint(5) NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    last_update date NOT NULL ,
    PRIMARY KEY(action_id)
);
```

#### SQL28.  批量插入数据,如果数据已经存在，请忽略，不使用replace操作

[链接](https://www.nowcoder.com/practice/153c8a8e7805400ba8e384e03acc6b3e?tpId=82&tqId=29803&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
INSERT IGNORE INTO actor VALUES ('3', 'ED', 'CHASE', '2006-02-15 12:34:33')
```

#### SQL29.  创建一个actor_name表，将actor表中的所有first_name以及last_name导入改表

[链接](https://www.nowcoder.com/practice/881385f388cf4fe98b2ed9f8897846df?tpId=82&tqId=29804&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
CREATE TABLE IF NOT EXISTS actor_name (
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL
);
INSERT INTO actor_name 
SELECT first_name, last_name
FROM actor;
```

#### SQL30. 对first_name创建唯一索引uniq_idx_firstname，对last_name创建普通索引idx_lastname

[链接](https://www.nowcoder.com/practice/e1824daa0c49404aa602cf0cb34bdd75?tpId=82&tqId=29805&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
CREATE UNIQUE INDEX uniq_idx_firstname ON actor(first_name);
CREATE INDEX idx_lastname ON actor(last_name);
```

#### SQL31. 针对actor表创建视图actor_name_view

[链接](https://www.nowcoder.com/practice/b9db784b5e3d488cbd30bd78fdb2a862?tpId=82&tqId=29806&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
CREATE VIEW actor_name_view AS
SELECT first_name AS first_name_v, last_name AS last_name_v
FROM actor;
```

#### SQL32. 针对上面的salaries表emp_no字段创建索引idx_emp_no，查询emp_no为10005,

[链接](https://www.nowcoder.com/practice/f9fa9dc1a1fc4130b08e26c22c7a1e5f?tpId=82&tqId=29807&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT * FROM salaries 
FORCE INDEX (idx_emp_no) 
WHERE emp_no = 10005;
```

#### SQL33. 在last_update后面新增加一列名字为create_date

[链接](https://www.nowcoder.com/practice/119f04716d284cb7a19fba65dd876b03?tpId=82&tqId=29808&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
ALTER TABLE actor
ADD create_date datetime NOT NULL DEFAULT '2020-10-01 00:00:00';
```

#### SQL34. 构造一个触发器audit_log，在向employees表中插入一条数据的时候，触发插入相关的数据到audit中

[链接](https://www.nowcoder.com/practice/7e920bb2e1e74c4e83750f5c16033e2e?tpId=82&tqId=29809&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
CREATE TRIGGER audit_log
AFTER INSERT
ON employees_test 
FOR EACH ROW
BEGIN
INSERT INTO audit VALUES (new.id, new.name);
END
```

#### SQL35. 在audit表上创建外键约束，其emp_no对应employees_test表的主键id

[链接](https://www.nowcoder.com/practice/aeaa116185f24f209ca4fa40e226de48?tpId=82&tqId=29814&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
ALTER TABLE audit
ADD FOREIGN KEY (EMP_no)
REFERENCES employees_test(ID)
```

#### SQL36. 将所有获取奖金的员工当前的薪水增加10%

[链接](https://www.nowcoder.com/practice/d3b058dcc94147e09352eb76f93b3274?tpId=82&tqId=29816&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
UPDATE salaries as s
SET s.salary = s.salary * 1.1
WHERE s.emp_no IN (
    SELECT emp_no 
    FROM emp_bonus
) AND s.to_date = '9999-01-01';
```

#### SQL37. 将employees表中的所有员工的last_name和first_name通过(')

[链接](https://www.nowcoder.com/practice/810bf4ee3ac64949b08983aa66ec7bee?tpId=82&tqId=29818&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT concat(last_name, '''', first_name) as name
FROM employees;
```

#### SQL38. 查找字符串'10,A,B'

[链接](https://www.nowcoder.com/practice/e3870bd5d6744109a902db43c105bd50?tpId=82&tqId=29819&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT (length("10, A, B") - length(REPLACE("10, A, B", ",", ""))) AS cnt;
```

#### SQL39. 获取Employees中的first_name，查询按照first_name最后两个字母，按照升序进行排列

[链接](https://www.nowcoder.com/practice/74d90728827e44e2864cce8b26882105?tpId=82&tqId=29820&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT first_name 
FROM employees
ORDER BY SUBSTR(first_name, -2);
```

#### SQL40. 按照dept_no进行汇总，属于同一个部门的emp_no按照逗号进行连接，结果给出dept_no以及连接出的结果employees

[链接](https://www.nowcoder.com/practice/6e86365af15e49d8abe2c3d4b5126e87?tpId=82&tqId=29821&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT dept_no, GROUP_CONCAT(emp_no) as employees
FROM dept_emp
GROUP BY dept_no;
```

#### SQL41. 查找排除当前最大、最小salary之后的员工的平均工资avg_salary

[链接](https://www.nowcoder.com/practice/95078e5e1fba4438b85d9f11240bc591?tpId=82&tqId=29822&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT AVG(salary ) AS avg_salary
FROM salaries
WHERE to_date = '9999-01-01' 
AND salary != (SELECT MAX(salary) FROM salaries WHERE to_date = '9999-01-01')
AND salary != (SELECT MIN(salary) FROM salaries WHERE to_date = '9999-01-01')
```

#### SQL42. 分页查询employees表，每5行一页，返回第2页的数据

[链接](https://www.nowcoder.com/practice/f24966e0cb8a49c192b5e65339bc8c03?tpId=82&tqId=29823&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT * FROM employees
LIMIT 5, 5
```

#### SQL43. 使用含有关键字exists查找未分配具体部门的员工的所有信息

[链接](https://www.nowcoder.com/practice/c39cbfbd111a4d92b221acec1c7c1484?tpId=82&tqId=29825&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.* 
FROM employees AS e
WHERE NOT EXISTS (
    SELECT e.emp_no FROM dept_emp AS d
    WHERE e.emp_no = d.emp_no
)
```

#### SQL44. 刷题通过的题目排名

[链接](https://www.nowcoder.com/practice/cd2e10a588dc4c1db0407d0bf63394f3?tpId=82&tqId=35080&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT *, DENSE_RANK() OVER (ORDER BY number DESC) AS t_rank
FROM passing_number
ORDER BY t_rank, id;
```

#### SQL45. 考试分数(二)

[链接](https://www.nowcoder.com/practice/f456dedf88a64f169aadd648491a27c1?tpId=82&tqId=35493&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT g1.* 
FROM grade AS g1
WHERE score > (
    SELECT AVG(score)
    FROM grade AS g2
    WHERE g1.job = g2.job
    GROUP BY job
)
ORDER BY g1.id
```

### 😅[困难]

#### SQL46. 查找当前薪水排名第二多的员工编号emp_no

[链接](https://www.nowcoder.com/practice/c1472daba75d4635b7f8540b837cc719?tpId=82&tqId=29770&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.emp_no, s.salary, e.last_name, e.first_name
FROM employees AS e
JOIN salaries as s
ON e.emp_no = s.emp_no
WHERE salary = (
    SELECT MAX(salary)
    FROM salaries
    WHERE salary < (
        SELECT MAX(salary)
        FROM salaries
));
```

#### SQL497. 对所有员工的当前薪水按照salary进行按照1-N的排名

[链接](https://www.nowcoder.com/practice/b9068bfe5df74276bd015b9729eec4bf?tpId=82&tqId=29775&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT emp_no, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS t_rank
FROM salaries
ORDER BY t_rank, emp_no;

```

#### SQL48. 获取所有非manager员工当前的薪水情况

[链接](https://www.nowcoder.com/practice/8fe212a6c71b42de9c15c56ce354bebe?tpId=82&tqId=29776&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT m.dept_no, s.emp_no, s.salary
FROM employees e, dept_emp de, dept_manager m, salaries s
WHERE e.emp_no = de.emp_no
AND de.dept_no = m.dept_no
AND e.emp_no = s.emp_no
AND e.emp_no != m.emp_no
```

#### SQL49. 查找描述信息中包括robot的电影对应的分类名称以及电影数目

[链接](https://www.nowcoder.com/practice/3a303a39cc40489b99a7e1867e6507c5?tpId=82&tqId=29780&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT c.name, count(fc.film_id) AS count
FROM film f, category c, film_category fc
WHERE f.film_id = fc.film_id
AND fc.category_id = c.category_id
AND f.description LIKE '%robot%'
AND c.category_id IN (
    SELECT category_id
    FROM film_category
    GROUP BY category_id
    HAVING count(category_id) >= 5
)
```

#### SQL50. 获取有奖金的员工相关信息。

[链接](https://www.nowcoder.com/practice/5cdbf1dcbe8d4c689020b6b2743820bf?tpId=82&tqId=29827&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT e.emp_no, e.first_name, e.last_name, b.btype, s.salary,
(CASE b.btype
 WHEN 1 THEN 0.1 * salary
 WHEN 2 THEN 0.2 * salary
 ELSE 0.3 * salary
 END
) bouns
FROM employees e, emp_bonus b, salaries s
WHERE s.emp_no = e.emp_no
AND b.emp_no = e.emp_no
AND s.to_date = '9999-01-01'
```

#### SQL51. 统计salary的累计和running_total

[链接](https://www.nowcoder.com/practice/58824cd644ea47d7b2b670c506a159a6?tpId=82&tqId=29828&rp=1&ru=%2Fta%2Fsql&qru=%2Fta%2Fsql%2Fquestion-ranking&tab=answerKey)

```sql
SELECT emp_no, salary,
SUM(salary) OVER (ORDER BY emp_no) AS running_total
FROM salaries
WHERE to_date = '9999-01-01'
```

```sql
SELECT s1.emp_no, s1.salary,
(
    SELECT SUM(salary) FROM salaries s2
    WHERE s2.emp_no <= s1.emp_no
    AND s2.to_date = '9999-01-01'
)
FROM salaries s1
WHERE s1.to_date = '9999-01-01'
ORDER BY s1.emp_no
```
