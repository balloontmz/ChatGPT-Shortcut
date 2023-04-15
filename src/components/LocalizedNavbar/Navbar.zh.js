const zhNavbar = {
  hideOnScroll: true,
  title: "Balloon AI",
  logo: {
    alt: "ChatGPT Shortcuts",
    src: "img/logo.svg",
  },
  items: [
    // {
    //   to: "https://newzone.top/posts/2023-02-27-chatgpt_shortcuts.html",
    //   label: "ChatGPT 使用说明",
    //   position: "left",
    // },
    // {
    //   to: "https://nav.newzone.top",
    //   label: "开源工具导航",
    //   position: "left",
    // },
    // { type: "localeDropdown", position: "right" },
    {
      to: "https://ai.gap-year.top/ai-desktop",
      label: 'AI 桌面插件',
      position: 'right',
    },
    {
      href: "https://ai.gap-year.top/ai-chat",
      label: 'AI 网页助手',
      target: '_blank',
      position: 'right',
    },
    {
      href: "https://ai.gap-year.top/ai-simple",
      label: '简洁版助手',
      target: '_blank',
      position: 'right',
    },
    {
      href: "https://github.com/balloontmz",
      position: "right",
      className: "header-github-link",
    },
    // {
    //   href: "https://discord.gg/PZTQfJ4GjX",
    //   position: "right",
    //   className: "header-discord-link",
    // },
  ],
};

module.exports = zhNavbar;
