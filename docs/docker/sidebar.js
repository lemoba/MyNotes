const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "Docker基础知识",
    collapsable: true,
    children: [
      { title: "安装", path: "./basic/1-install"},
      { title: "基本概念", path: "./basic/2-concept"},
      { title: "常见命令", path: "./basic/3-command"},
      { title: "构建镜像", path: "./basic/4-build-image"},
      { title: "存储", path: "./basic/5-storage"},
      { title: "网络", path: "./basic/6-network"},
      { title: "docker-compose", path: "./basic/7-docker-compose"},
      { title: "docker-swarm", path: "./basic/8-docker-swarm"},
    ]
  },   
];