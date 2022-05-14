module.exports = {
    title: 'Ranen',
    description: '心中无女人，代码自然神!',
    head: [
      ["link", { rel: "icon", href: "/img/rust.svg" }],
    ],
    markdown: {
      lineNumbers: true,
    },
    themeConfig: {
      logo: '/img/rust.svg',
      nav: require("./nav.js"),
      sidebar: require("./sidebar.js"),
      collapsable:true,
      lastUpdated: "Last Updated",
      searchMaxSuggestoins: 10,
      serviceWorker: {
        updatePopup: {
          message: "有新的内容.",
          buttonText: "更新",
        },
      },
      repo: 'https://github.com/lemoba/lemoba.github.io',
      repoLabel: '',
      docsDir: 'docs',
      docsBranch: 'main',
      editLinks: true,
      editLinkText: "在 GitHub 上编辑此页 ！",
    },
    plugins: [
      '@vuepress/back-to-top',
      'vuepress-plugin-right-anchor',
      ['vuepress-plugin-code-copy', {
          align: 'top',
          backgroundTransition: false,
          successText: '已复制!'
        }
      ]
    ]

}