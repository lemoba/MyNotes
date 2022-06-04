const { title } = require("../.vuepress/config");
module.exports = [
  {
    title: "计算机网络",
    collapsable: true,
    children: [
      { title: "传输层", path: "./1-tcp|udp.md"},
    ]
  },    
];