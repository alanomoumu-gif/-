# 点意空间前端

运行 `node build.mjs`，用浏览器打开 `dist/index.html`。四个栏目均有独立 HTML。构建 GitHub Pages 时，上传 `dist` 作为静态站点目录。所有导航使用相对地址，可在仓库子路径下访问。

将原站导出的可信正文 HTML 写入 content.json 对应栏目的 html 字段。案例和新闻在 items 中添加 { "slug": "原页面标识", "title": "原题", "date": "原日期", "thumbnail": "assets/图片.webp", "html": "原正文HTML" }。关于我们子栏目可用同一 items 结构。正文中的图片和附件路径按生成页面目录填写，例如详情页使用 ../../assets/文件名。将桌面封面置于 assets 并在 cover 中填入相对路径。每次构建前使用新的 dist 目录，避免保留已删除的旧页面。

当前数据文件只包含栏目名称。原站访问失败，原文、项目照片、封面和历史链接均待导入。发布前需取得完整的原站资料，并逐项核对。

## 首页交互与 GitHub Pages

可在 content.json 的 ticker 数组设置滚动文字。字幕可暂停，系统减少动态效果时静止。assets/interactions.js 实现点击反馈，style.css 定义动画时长和颜色。

把本目录文件以仓库根目录提交到 main。在 Settings → Pages → Build and deployment 中选择 GitHub Actions，随后运行 Deploy static site 工作流。
