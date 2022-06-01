const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "PHP源码分析",
    collapsable: true,
    children: [
      { title: "前置知识", path: "./source-code/1-basic"},
      { title: "php7新特性", path: "./source-code/2-features"},
      { title: "基本变量与内存管理机制", path: "./source-code/3-variables&memory.md"},
    ]
  }, 
  {
    title: "设计模式",
    collapsable: true,
    children: [
      { title: "概述", path: "./design-pattern/1-basic"},
      { title: "一些模式原则", path: "./design-pattern/2-criterion"},
      { title: "生成对象", path: "./design-pattern/3-build-object"},
    ]
  },   
];