const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "MySQL必会知识",
    collapsable: true,
    children: [
      { title: "SQL语法", path: "./basic/1-sql.md"},
    ]
  },
  {
    title: "MySQL45讲",
    collapsable: true,
    children: [
      { title: "SQL是如何执行的", path: "./mysql-45/1-sql-execute.md"},
    ]
  },
  {
    title: "MySQL入门到进阶",
    collapsable: true,
    children: [
      { title: "安装", path: "./mysql-advance/1-install.md"},
      { title: "权限管理", path: "./mysql-advance/2-authority.md"},
      { title: "数据类型", path: "./mysql-advance/3-datatype.md"},
      { title: "表结构、范式、分区表", path: "./mysql-advance/4-tablestruct.md"},
      { title: "多连接", path: "./mysql-advance/5-joinsql.md"},
      { title: "存储过程", path: "./mysql-advance/6-procedure.md"},
      { title: "索引", path: "./mysql-advance/7-index.md"},
      { title: "Join算法", path: "./mysql-advance/8-joinalgorithm.md"},
      { title: "InnoDB存储引擎", path: "./mysql-advance/13-InnoDB.md"},
      { title: "事务", path: "./mysql-advance/14-transaction.md"},
      { title: "锁", path: "./mysql-advance/15-lock.md"},
    ]
  },
];