const { title } = require("../../.vuepress/config");
module.exports = [
  {
    title: "RabbitMQ实战指南",
    collapsable: true,
    children: [
      { title: "简介", path: "./rabbitmq/1-info"},
    ]
  },
];