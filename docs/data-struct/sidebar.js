const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "数据结构",
    collapsable: true,
    children: [
      { title: "基本概念", path: "./1-基本概念.md"},
      { title: "排序", path: "./2-排序.md"},
      { title: "线性表", path: "./3-线性表.md"},
    ]
  },    
];