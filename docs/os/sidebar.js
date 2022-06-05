const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "操作系统",
    collapsable: true,
    children: [
      { title: "进程管理", path: "./1-process.md"},
    ]
  },    
];