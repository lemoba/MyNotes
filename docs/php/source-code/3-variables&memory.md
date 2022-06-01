### 1. 小而巧的zval

* 定义

```c
struct _zval_struct {		//16byte
   	zend_value value;		//8byte
    union u1;						//4byte
    union u2;						//4byte
}

typedef union _zend_value {
	zend_long         lval;				// 整型
	double            dval;				// 浮点型
	zend_refcounted  *counted;		// 引用计数
	zend_string      *str;				// 字符串
	zend_array       *arr;				// 数组
	zend_object      *obj;				// 对象
	zend_resource    *res;				// 资源类型
	zend_reference   *ref;				// 引用类型
	zend_ast_ref     *ast;				// 抽象语法树
	zval             *zv;					// 执行本身的zval
	void             *ptr;				// 指向其他类型
	zend_class_entry *ce;					// 类 
	zend_function    *func;				// 函数
	struct {
		uint32_t w1;
		uint32_t w2;
	} ww;
} zend_value;

union {
    struct {
        ZEND_ENDIAN_LOHI_4(
            zend_uchar    type,			/* active type */
            zend_uchar    type_flags,		//变量类型标记
            zend_uchar    const_flags,	//常量类型标记
            zend_uchar    reserved)	    /* call info for EX(This) */
    } v;
    uint32_t type_info;
} u1;

/*
type的值
#define IS_UNDEF					0
#define IS_NULL						1
#define IS_FALSE					2
#define IS_TRUE						3
#define IS_LONG						4
#define IS_DOUBLE					5
#define IS_STRING					6
#define IS_ARRAY					7
#define IS_OBJECT					8
#define IS_RESOURCE					9
#define IS_REFERENCE				10
*/

union {
    uint32_t     next;                 /* hash collision chain 解决哈希冲突*/
    uint32_t     cache_slot;           /* literal cache slot 运行时缓存*/
    uint32_t     lineno;               /* line number (for ast nodes) 标记行号多用于AST*/
    uint32_t     num_args;             /* arguments number for EX(This) 函数调用传入参数的个数*/
    uint32_t     fe_pos;               /* foreach position 循环时指针位置*/
    uint32_t     fe_iter_idx;          /* foreach iterator index 循环时游标索引位置*/
    uint32_t     access_flags;         /* class constant access flags 可访问标记 public private proteced*/
    uint32_t     property_guard;       /* single property guard 防止类中魔术方法循环引用 set get*/
} u2;
```

* 代码

```php
$a = 2;
echo $a;
$b = 1.1;
echo $b;
$c = null;
echo $c;
$d = true;
echo $d;
$e = false;
echo $e;
$f = "string";
echo $f;
$g = [1, 2, 3];
echo $g;
$h = new stdclass();
echo $h; //FATAL ERROR
```

* gdb

```shell
gdb php
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /usr/php/php-7.1.0/bin/php...done.

(gdb) b ZEND_ECHO_SPEC_CV_HANDLER
Breakpoint 1 at 0x8f5f9a: file /root/php/php-7.1.0/Zend/zend_vm_execute.h, line 34640.
(gdb) r zval.php
Starting program: /usr/local/php/php-7.1.0/bin/php zval.php
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib64/libthread_db.so.1".

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libxml2-2.9.1-6.el7.5.x86_64 nss-softokn-freebl-3.44.0-8.el7_7.x86_64 xz-libs-5.2.2-1.el7.x86_64 zlib-1.2.7-18.el7.x86_64
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) n
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p
The history is empty.
(gdb) p z
$1 = (zval *) 0x7ffff5e14080
(gdb) p *z
$2 = {value = {lval = 2, dval = 9.8813129168249309e-324, counted = 0x2, str = 0x2, arr = 0x2, obj = 0x2, res = 0x2, ref = 0x2, ast = 0x2, zv = 0x2, ptr = 0x2, ce = 0x2, 
    func = 0x2, ww = {w1 = 2, w2 = 0}}, u1 = {v = {type = 4 '\004', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 4}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.
2
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$3 = (zval *) 0x7ffff5e14090
(gdb) p *z
$4 = {value = {lval = 4607632778762754458, dval = 1.1000000000000001, counted = 0x3ff199999999999a, str = 0x3ff199999999999a, arr = 0x3ff199999999999a, 
    obj = 0x3ff199999999999a, res = 0x3ff199999999999a, ref = 0x3ff199999999999a, ast = 0x3ff199999999999a, zv = 0x3ff199999999999a, ptr = 0x3ff199999999999a, 
    ce = 0x3ff199999999999a, func = 0x3ff199999999999a, ww = {w1 = 2576980378, w2 = 1072798105}}, u1 = {v = {type = 5 '\005', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 5}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, 
    access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.
1.1
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) n
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$5 = (zval *) 0x7ffff5e140a0
(gdb) p *z
$6 = {value = {lval = 17775328, dval = 8.7821789083599933e-317, counted = 0x10f3ae0, str = 0x10f3ae0, arr = 0x10f3ae0, obj = 0x10f3ae0, res = 0x10f3ae0, ref = 0x10f3ae0, 
    ast = 0x10f3ae0, zv = 0x10f3ae0, ptr = 0x10f3ae0, ce = 0x10f3ae0, func = 0x10f3ae0, ww = {w1 = 17775328, w2 = 0}}, u1 = {v = {type = 1 '\001', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, 
    access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$7 = (zval *) 0x7ffff5e140b0
(gdb) p *z
$8 = {value = {lval = 17775328, dval = 8.7821789083599933e-317, counted = 0x10f3ae0, str = 0x10f3ae0, arr = 0x10f3ae0, obj = 0x10f3ae0, res = 0x10f3ae0, ref = 0x10f3ae0, 
    ast = 0x10f3ae0, zv = 0x10f3ae0, ptr = 0x10f3ae0, ce = 0x10f3ae0, func = 0x10f3ae0, ww = {w1 = 17775328, w2 = 0}}, u1 = {v = {type = 3 '\003', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 3}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, 
    access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.
1
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) n
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$9 = (zval *) 0x7ffff5e140c0
(gdb) p *z
$10 = {value = {lval = 17775328, dval = 8.7821789083599933e-317, counted = 0x10f3ae0, str = 0x10f3ae0, arr = 0x10f3ae0, obj = 0x10f3ae0, res = 0x10f3ae0, 
    ref = 0x10f3ae0, ast = 0x10f3ae0, zv = 0x10f3ae0, ptr = 0x10f3ae0, ce = 0x10f3ae0, func = 0x10f3ae0, ww = {w1 = 17775328, w2 = 0}}, u1 = {v = {type = 2 '\002', 
      type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 2}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) n
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$11 = (zval *) 0x7ffff5e140d0
(gdb) p *z
$12 = {value = {lval = 17720896, dval = 8.7552859271255625e-317, counted = 0x10e6640, str = 0x10e6640, arr = 0x10e6640, obj = 0x10e6640, res = 0x10e6640, 
    ref = 0x10e6640, ast = 0x10e6640, zv = 0x10e6640, ptr = 0x10e6640, ce = 0x10e6640, func = 0x10e6640, ww = {w1 = 17720896, w2 = 0}}, u1 = {v = {type = 6 '\006', 
      type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p $12.value.str
$13 = (zend_string *) 0x10e6640
(gdb) p *$12.value.str
$14 = {gc = {refcount = 1, u = {v = {type = 6 '\006', flags = 7 '\a', gc_info = 0}, type_info = 1798}}, h = 9223378990886268924, len = 6, val = "s"}
(gdb) p *$12.value.str.val
$15 = 115 's'
(gdb) p *$12.value.str.val@6
$16 = "string"
(gdb) c
Continuing.
string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$17 = (zval *) 0x7ffff5e140e0
(gdb) p *z
$18 = {value = {lval = 140737318847424, dval = 6.9533474330317978e-310, counted = 0x7ffff5e583c0, str = 0x7ffff5e583c0, arr = 0x7ffff5e583c0, obj = 0x7ffff5e583c0, 
    res = 0x7ffff5e583c0, ref = 0x7ffff5e583c0, ast = 0x7ffff5e583c0, zv = 0x7ffff5e583c0, ptr = 0x7ffff5e583c0, ce = 0x7ffff5e583c0, func = 0x7ffff5e583c0, ww = {
      w1 = 4125459392, w2 = 32767}}, u1 = {v = {type = 7 '\a', type_flags = 28 '\034', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 7175}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p $18.value.arr
$19 = (zend_array *) 0x7ffff5e583c0
(gdb) p *$18.value.arr
$20 = {gc = {refcount = 2, u = {v = {type = 7 '\a', flags = 0 '\000', gc_info = 0}, type_info = 7}}, u = {v = {flags = 30 '\036', nApplyCount = 0 '\000', 
      nIteratorsCount = 0 '\000', consistency = 0 '\000'}, flags = 30}, nTableMask = 4294967294, arData = 0x7ffff5e5fb48, nNumUsed = 3, nNumOfElements = 3, 
  nTableSize = 8, nInternalPointer = 0, nNextFreeElement = 3, pDestructor = 0x84d26f <_zval_ptr_dtor_wrapper>}
(gdb) c
Continuing.
Array
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$21 = (zval *) 0x7ffff5e140f0
(gdb) p *z
$22 = {value = {lval = 140737318874480, dval = 6.9533474343685418e-310, counted = 0x7ffff5e5ed70, str = 0x7ffff5e5ed70, arr = 0x7ffff5e5ed70, obj = 0x7ffff5e5ed70, 
    res = 0x7ffff5e5ed70, ref = 0x7ffff5e5ed70, ast = 0x7ffff5e5ed70, zv = 0x7ffff5e5ed70, ptr = 0x7ffff5e5ed70, ce = 0x7ffff5e5ed70, func = 0x7ffff5e5ed70, ww = {
      w1 = 4125486448, w2 = 32767}}, u1 = {v = {type = 8 '\b', type_flags = 12 '\f', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 3080}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p $22.value.obj
$23 = (zend_object *) 0x7ffff5e5ed70
(gdb) p *$22.value.obj
$24 = {gc = {refcount = 1, u = {v = {type = 8 '\b', flags = 0 '\000', gc_info = 0}, type_info = 8}}, handle = 1, ce = 0x111f080, 
  handlers = 0x10af9e0 <std_object_handlers>, properties = 0x0, properties_table = {{value = {lval = 0, dval = 0, counted = 0x0, str = 0x0, arr = 0x0, obj = 0x0, 
        res = 0x0, ref = 0x0, ast = 0x0, zv = 0x0, ptr = 0x0, ce = 0x0, func = 0x0, ww = {w1 = 0, w2 = 0}}, u1 = {v = {type = 40 '(', type_flags = 0 '\000', 
          const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 40}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, 
        access_flags = 0, property_guard = 0}}}}
```

### 2. Zend_string与写时复制

* 定义

```php
struct _zend_string {					//二进制安全
	zend_refcounted_h gc;				//引用计数
	zend_ulong        h;                /* hash value */
	size_t            len;				//长度
	char              val[1];			//柔型数组存放字符串内容
};
```

* 代码

```php
<?php
  2 //const string
  3 $c = "hello world";
  4 echo $c;
  5 
  6 $a = time()."string";
  7 echo $a;
  8 
  9 //copy on write
 10 
 11 $b = $a;
 12 echo $a;
 13 echo $b;
 14 $b = "hello";
 15 $echo $a;
 16 $echo $b;
```

* gdb

```shell
[root@localhost study]# gdb /usr/local/php/php-7.1.0/bin/php
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /usr/local/php/php-7.1.0/bin/php...done.
(gdb) b ZEND_ECHO_SPEC_HANDLER
Function "ZEND_ECHO_SPEC_HANDLER" not defined.
Make breakpoint pending on future shared library load? (y or [n]) n^Hy
(gdb) b ZEND_ECHO_SPEC_CV_HANDLER

Breakpoint 1 at 0x8f5f9a: file /root/code/php-7.1.0/Zend/zend_vm_execute.h, line 34640.
(gdb) r string.php 
Starting program: /usr/local/php/php-7.1.0/bin/php string.php
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib64/libthread_db.so.1".

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libxml2-2.9.1-6.el7.5.x86_64 nss-softokn-freebl-3.44.0-8.el7_7.x86_64 xz-libs-5.2.2-1.el7.x86_64 zlib-1.2.7-18.el7.x86_64
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p *z
$1 = {value = {lval = 140737318874480, dval = 6.9533474343685418e-310, 
    counted = 0x7ffff5e5ed70, str = 0x7ffff5e5ed70, arr = 0x7ffff5e5ed70, 
    obj = 0x7ffff5e5ed70, res = 0x7ffff5e5ed70, ref = 0x7ffff5e5ed70, 
    ast = 0x7ffff5e5ed70, zv = 0x7ffff5e5ed70, ptr = 0x7ffff5e5ed70, 
    ce = 0x7ffff5e5ed70, func = 0x7ffff5e5ed70, ww = {w1 = 4125486448, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p z
$2 = (zval *) 0x7ffff5e14080
(gdb) p *z
$3 = {value = {lval = 140737318874480, dval = 6.9533474343685418e-310, 
    counted = 0x7ffff5e5ed70, str = 0x7ffff5e5ed70, arr = 0x7ffff5e5ed70, 
    obj = 0x7ffff5e5ed70, res = 0x7ffff5e5ed70, ref = 0x7ffff5e5ed70, 
    ast = 0x7ffff5e5ed70, zv = 0x7ffff5e5ed70, ptr = 0x7ffff5e5ed70, 
    ce = 0x7ffff5e5ed70, func = 0x7ffff5e5ed70, ww = {w1 = 4125486448, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$4 = {gc = {refcount = 0, u = {v = {type = 6 '\006', flags = 2 '\002', 
        gc_info = 0}, type_info = 518}}, h = 13876786532495509697, len = 11, 
  val = "h"}
(gdb) p *z.value.str.val@11
$5 = "hello world"
(gdb) c
Continuing.
hello world
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$6 = (zval *) 0x7ffff5e14090
(gdb) p *z
$7 = {value = {lval = 140737318874640, dval = 6.9533474343764469e-310, 
    counted = 0x7ffff5e5ee10, str = 0x7ffff5e5ee10, arr = 0x7ffff5e5ee10, 
    obj = 0x7ffff5e5ee10, res = 0x7ffff5e5ee10, ref = 0x7ffff5e5ee10, 
    ast = 0x7ffff5e5ee10, zv = 0x7ffff5e5ee10, ptr = 0x7ffff5e5ee10, 
    ce = 0x7ffff5e5ee10, func = 0x7ffff5e5ee10, ww = {w1 = 4125486608, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 20 '\024', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 5126}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$8 = {gc = {refcount = 1, u = {v = {type = 6 '\006', flags = 0 '\000', 
        gc_info = 0}, type_info = 6}}, h = 0, len = 16, val = "1"}
(gdb) p *z.value.str.val@16
$9 = "1612285070string"
(gdb) c
Continuing.
1612285070string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$10 = (zval *) 0x7ffff5e14090
(gdb) p *z
$11 = {value = {lval = 140737318874640, dval = 6.9533474343764469e-310, 
    counted = 0x7ffff5e5ee10, str = 0x7ffff5e5ee10, arr = 0x7ffff5e5ee10, 
    obj = 0x7ffff5e5ee10, res = 0x7ffff5e5ee10, ref = 0x7ffff5e5ee10, 
    ast = 0x7ffff5e5ee10, zv = 0x7ffff5e5ee10, ptr = 0x7ffff5e5ee10, 
    ce = 0x7ffff5e5ee10, func = 0x7ffff5e5ee10, ww = {w1 = 4125486608, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 20 '\024', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 5126}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$12 = {gc = {refcount = 2, u = {v = {type = 6 '\006', flags = 0 '\000', 
        gc_info = 0}, type_info = 6}}, h = 0, len = 16, val = "1"}
(gdb) p *z.value.str.val@16
$13 = "1612285070string"
(gdb) c
Continuing.
1612285070string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$14 = (zval *) 0x7ffff5e140a0
(gdb) p *z
$15 = {value = {lval = 140737318874640, dval = 6.9533474343764469e-310, 
    counted = 0x7ffff5e5ee10, str = 0x7ffff5e5ee10, arr = 0x7ffff5e5ee10, 
    obj = 0x7ffff5e5ee10, res = 0x7ffff5e5ee10, ref = 0x7ffff5e5ee10, 
    ast = 0x7ffff5e5ee10, zv = 0x7ffff5e5ee10, ptr = 0x7ffff5e5ee10, 
    ce = 0x7ffff5e5ee10, func = 0x7ffff5e5ee10, ww = {w1 = 4125486608, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 20 '\024', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 5126}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str.val
$16 = 49 '1'
(gdb) p *z.value.str
$17 = {gc = {refcount = 2, u = {v = {type = 6 '\006', flags = 0 '\000', 
        gc_info = 0}, type_info = 6}}, h = 0, len = 16, val = "1"}
(gdb) p *z.value.str.val@16
$18 = "1612285070string"
(gdb) c
Continuing.
1612285070string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$19 = (zval *) 0x7ffff5e14090
(gdb) p *z
$20 = {value = {lval = 140737318874640, dval = 6.9533474343764469e-310, 
    counted = 0x7ffff5e5ee10, str = 0x7ffff5e5ee10, arr = 0x7ffff5e5ee10, 
    obj = 0x7ffff5e5ee10, res = 0x7ffff5e5ee10, ref = 0x7ffff5e5ee10, 
    ast = 0x7ffff5e5ee10, zv = 0x7ffff5e5ee10, ptr = 0x7ffff5e5ee10, 
    ce = 0x7ffff5e5ee10, func = 0x7ffff5e5ee10, ww = {w1 = 4125486608, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 20 '\024', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 5126}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$21 = {gc = {refcount = 1, u = {v = {type = 6 '\006', flags = 0 '\000', 
        gc_info = 0}, type_info = 6}}, h = 0, len = 16, val = "1"}
(gdb) c
Continuing.
1612285070string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER ()
    at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$22 = (zval *) 0x7ffff5e140a0
(gdb) p *Z
No symbol "Z" in current context.
(gdb) p *z
$23 = {value = {lval = 140737318898496, dval = 6.9533474355550899e-310, 
    counted = 0x7ffff5e64b40, str = 0x7ffff5e64b40, arr = 0x7ffff5e64b40, 
    obj = 0x7ffff5e64b40, res = 0x7ffff5e64b40, ref = 0x7ffff5e64b40, 
    ast = 0x7ffff5e64b40, zv = 0x7ffff5e64b40, ptr = 0x7ffff5e64b40, 
    ce = 0x7ffff5e64b40, func = 0x7ffff5e64b40, ww = {w1 = 4125510464, 
      w2 = 32767}}, u1 = {v = {type = 6 '\006', type_flags = 0 '\000', 
      const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {
    next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, 
    fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$24 = {gc = {refcount = 0, u = {v = {type = 6 '\006', flags = 2 '\002', 
        gc_info = 0}, type_info = 518}}, h = 9223372247569412249, len = 5, 
  val = "h"}
(gdb) p *z.value.str.va;@5
Invalid character ';' in expression.
(gdb) p *z.value.str.val@5
$25 = "hello"
(gdb)
```

### 3. 引用类型

* 定义

```c
struct _zend_reference {
	zend_refcounted_h gc;
	zval              val;
};
```

* 代码

```php
<?php
$a = "string";
$b = &$a;
echo $a;
echo $b;

$b = "hello!";
echo $a;
echo $b;

unset($b);
echo $b;
echo $a;
```

* gdb

```shell
[root@localhost study]# gdb /usr/local/php/php-7.1.0/bin/php
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /usr/local/php/php-7.1.0/bin/php...done.
(gdb) b ZEND_ECHO_SPEC_CV_HANDLER
Breakpoint 1 at 0x8f5f9a: file /root/code/php-7.1.0/Zend/zend_vm_execute.h, line 34640.
(gdb) n
The program is not being run.
(gdb) 
The program is not being run.
(gdb) r ref.php
Starting program: /usr/local/php/php-7.1.0/bin/php ref.php
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib64/libthread_db.so.1".

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libxml2-2.9.1-6.el7.5.x86_64 nss-softokn-freebl-3.44.0-8.el7_7.x86_64 xz-libs-5.2.2-1.el7.x86_64 zlib-1.2.7-18.el7.x86_64
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$1 = (zval *) 0x7ffff5e14080
(gdb) p *z
$2 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 10 '\n', type_flags = 4 '\004', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1034}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.str
$3 = {gc = {refcount = 2, u = {v = {type = 10 '\n', flags = 0 '\000', gc_info = 0}, type_info = 10}}, h = 17720896, len = 6, 
  val = "\030"}
(gdb) p *z.value.str.val@6
$4 = "\030\000\000\000\000"
(gdb) c
Continuing.
string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p *
A syntax error in expression, near `'.
(gdb) p z
$5 = (zval *) 0x7ffff5e14090
(gdb) p *z
$6 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 10 '\n', type_flags = 4 '\004', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1034}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p $6.value.ref
$7 = (zend_reference *) 0x7ffff5e020a8
(gdb) p *$6.value.ref
$8 = {gc = {refcount = 2, u = {v = {type = 10 '\n', flags = 0 '\000', gc_info = 0}, type_info = 10}}, val = {value = {
      lval = 17720896, dval = 8.7552859271255625e-317, counted = 0x10e6640, str = 0x10e6640, arr = 0x10e6640, obj = 0x10e6640, 
      res = 0x10e6640, ref = 0x10e6640, ast = 0x10e6640, zv = 0x10e6640, ptr = 0x10e6640, ce = 0x10e6640, func = 0x10e6640, ww = {
        w1 = 17720896, w2 = 0}}, u1 = {v = {type = 6 '\006', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, 
      type_info = 6}, u2 = {next = 0, cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, 
      property_guard = 0}}}
(gdb) p *$6.value.ref.val.value.str
$9 = {gc = {refcount = 1, u = {v = {type = 6 '\006', flags = 7 '\a', gc_info = 0}, type_info = 1798}}, h = 9223378990886268924, 
  len = 6, val = "s"}
(gdb) p *$6.value.ref.val.value.str.val@6
$10 = "string"
(gdb) c
Continuing.
string
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) n
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$11 = (zval *) 0x7ffff5e14080
(gdb) p *z
$12 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 10 '\n', type_flags = 4 '\004', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1034}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.ref
$13 = {gc = {refcount = 2, u = {v = {type = 10 '\n', flags = 0 '\000', gc_info = 0}, type_info = 10}}, val = {value = {
      lval = 140737318874240, dval = 6.9533474343566843e-310, counted = 0x7ffff5e5ec80, str = 0x7ffff5e5ec80, arr = 0x7ffff5e5ec80, 
      obj = 0x7ffff5e5ec80, res = 0x7ffff5e5ec80, ref = 0x7ffff5e5ec80, ast = 0x7ffff5e5ec80, zv = 0x7ffff5e5ec80, 
      ptr = 0x7ffff5e5ec80, ce = 0x7ffff5e5ec80, func = 0x7ffff5e5ec80, ww = {w1 = 4125486208, w2 = 32767}}, u1 = {v = {
        type = 6 '\006', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {next = 0, 
      cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}}
(gdb) p *z.value.ref.val.value.str.val@6
$14 = "hello!"
(gdb) c
Continuing.
hello!
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$15 = (zval *) 0x7ffff5e14090
(gdb) p *z
$16 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 10 '\n', type_flags = 4 '\004', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1034}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.ref
$17 = {gc = {refcount = 2, u = {v = {type = 10 '\n', flags = 0 '\000', gc_info = 0}, type_info = 10}}, val = {value = {
      lval = 140737318874240, dval = 6.9533474343566843e-310, counted = 0x7ffff5e5ec80, str = 0x7ffff5e5ec80, arr = 0x7ffff5e5ec80, 
      obj = 0x7ffff5e5ec80, res = 0x7ffff5e5ec80, ref = 0x7ffff5e5ec80, ast = 0x7ffff5e5ec80, zv = 0x7ffff5e5ec80, 
      ptr = 0x7ffff5e5ec80, ce = 0x7ffff5e5ec80, func = 0x7ffff5e5ec80, ww = {w1 = 4125486208, w2 = 32767}}, u1 = {v = {
        type = 6 '\006', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {next = 0, 
      cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}}
(gdb) p *z.value.ref.val.value.str
$18 = {gc = {refcount = 0, u = {v = {type = 6 '\006', flags = 2 '\002', gc_info = 0}, type_info = 518}}, h = 9223378990437778394, 
  len = 6, val = "h"}
(gdb) c
Continuing.
hello!
Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p z
$19 = (zval *) 0x7ffff5e14090
(gdb) p *z
$20 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 0 '\000', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 0}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) c
Continuing.

Breakpoint 1, ZEND_ECHO_SPEC_CV_HANDLER () at /root/code/php-7.1.0/Zend/zend_vm_execute.h:34640
34640		SAVE_OPLINE();
(gdb) n
34641		z = _get_zval_ptr_cv_undef(execute_data, opline->op1.var);
(gdb) 
34643		if (Z_TYPE_P(z) == IS_STRING) {
(gdb) p *z
$21 = {value = {lval = 140737318494376, dval = 6.953347415588909e-310, counted = 0x7ffff5e020a8, str = 0x7ffff5e020a8, 
    arr = 0x7ffff5e020a8, obj = 0x7ffff5e020a8, res = 0x7ffff5e020a8, ref = 0x7ffff5e020a8, ast = 0x7ffff5e020a8, 
    zv = 0x7ffff5e020a8, ptr = 0x7ffff5e020a8, ce = 0x7ffff5e020a8, func = 0x7ffff5e020a8, ww = {w1 = 4125106344, w2 = 32767}}, 
  u1 = {v = {type = 10 '\n', type_flags = 4 '\004', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 1034}, u2 = {next = 0, 
    cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}
(gdb) p *z.value.ref
$22 = {gc = {refcount = 1, u = {v = {type = 10 '\n', flags = 0 '\000', gc_info = 0}, type_info = 10}}, val = {value = {
      lval = 140737318874240, dval = 6.9533474343566843e-310, counted = 0x7ffff5e5ec80, str = 0x7ffff5e5ec80, arr = 0x7ffff5e5ec80, 
      obj = 0x7ffff5e5ec80, res = 0x7ffff5e5ec80, ref = 0x7ffff5e5ec80, ast = 0x7ffff5e5ec80, zv = 0x7ffff5e5ec80, 
      ptr = 0x7ffff5e5ec80, ce = 0x7ffff5e5ec80, func = 0x7ffff5e5ec80, ww = {w1 = 4125486208, w2 = 32767}}, u1 = {v = {
        type = 6 '\006', type_flags = 0 '\000', const_flags = 0 '\000', reserved = 0 '\000'}, type_info = 6}, u2 = {next = 0, 
      cache_slot = 0, lineno = 0, num_args = 0, fe_pos = 0, fe_iter_idx = 0, access_flags = 0, property_guard = 0}}}
(gdb) p *z.value.ref.value.str
There is no member named value.
(gdb) p *z.value.ref.val.value.str.val@6
$23 = "hello!"
```



### 4. 数组类型

* 定义

```c
struct _zend_array {
	zend_refcounted_h gc;
	union {
		struct {
			ZEND_ENDIAN_LOHI_4(
				zend_uchar    flags,
				zend_uchar    nApplyCount,
				zend_uchar    nIteratorsCount,
				zend_uchar    consistency)
		} v;
		uint32_t flags;
	} u;
	uint32_t          nTableMask;		//计算索引值
	Bucket           *arData;			//存储键值对
	uint32_t          nNumUsed;			//已用空间
	uint32_t          nNumOfElements;	//真正元素个数
	uint32_t          nTableSize;		//arData大小 默认为8	 扩容每次x2
	uint32_t          nInternalPointer;	//没有key时默认从nNextFreeElementnNextFreeElement中取
	dtor_func_t       pDestructor;
};
```

