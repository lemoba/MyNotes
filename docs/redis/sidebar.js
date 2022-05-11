const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "Redis设计与实现",
    collapsable: true,
    children: [
      { title: "简单动态字符串", path: "/redis/redis-design/1-sds"},
      { title: "链表", path: "/redis/redis-design/2-linkedlist" },
    //   { title: "跳表", path: "/redis/redis-design/sds" },
    //   { title: "整数集合", path: "/redis/redis-design/sds" },
    //   { title: "压缩列表", path: "/redis/redis-design/sds" },
    //   { title: "对象", path: "/redis/redis-design/sds" },
      { title: "数据库", path: "/redis/redis-design/8-database" },
    //   { title: "RDB持久化", path: "/redis/redis-design/sds" },
    //   { title: "AOF持久化", path: "/redis/redis-design/sds" },
    //   { title: "事件", path: "/redis/redis-design/sds" },
    //   { title: "客户端", path: "/redis/redis-design/sds" },
    //   { title: "服务器", path: "/redis/redis-design/sds" },
    //   { title: "复制", path: "/redis/redis-design/sds" },
    //   { title: "哨兵", path: "/redis/redis-design/sds" },
    //   { title: "集群", path: "/redis/redis-design/sds" },
    //   { title: "发布与订阅", path: "/redis/redis-design/sds" },
    //   { title: "事务", path: "/redis/redis-design/sds" },
    //   { title: "Lua脚本", path: "/redis/redis-design/sds" },
    //   { title: "排序", path: "/redis/redis-design/sds" },
    //   { title: "二进制位数组", path: "/redis/redis-design/sds" },
    //   { title: "慢查询日志", path: "/redis/redis-design/sds" },
    //   { title: "监视器", path: "/redis/redis-design/sds" },
    ],
  },
  {
    title: "Redis开发与运维",
    collapsable: true,
    children: [
      { title: "安装", path: "/redis/redis-develop/1-install"},
      { title: "复制", path: "/redis/redis-develop/2-replication"},
      { title: "哨兵", path: "/redis/redis-develop/3-sentinel"},
    ]
  },
  {
    title: "Redis45讲",
    collapsable: true,
    children: [
      { title: "缓存异常", path: "/redis/redis-45/25-exception-cache"},
    ]
  }
];