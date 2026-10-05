# 彭冠儒 · 个人主页

一个纯静态的个人主页，版式参考学术界常用的 Academic Pages 风格：左侧固定栏放头像、姓名、身份、联系方式与导航，右侧是「关于我 / 动态 / 项目 / 技能 / 简历」五个内容区。

线上地址：<https://pengguanru4-lang.github.io/personal-website/>

## 特点

- **零依赖、零构建** —— 纯 HTML + CSS + 原生 JS，不需要 npm / webpack，双击 `index.html` 就能看
- **响应式** —— 手机上侧栏收起为抽屉，按钮在左上角
- **深色模式** —— 跟随系统偏好，并记住手动选择（localStorage）
- **滚动高亮** —— 导航自动高亮当前所在章节
- **无障碍** —— 语义化标签、跳转链接、`aria-*` 标注、`prefers-reduced-motion` 支持

## 目录结构

```
.
├── index.html              页面结构与全部文案
├── assets/
│   ├── css/style.css       配色、字体、间距（顶部集中定义 CSS 变量）
│   ├── js/main.js          主题切换 / 移动端菜单 / 滚动高亮 / 年份
│   ├── images/avatar.png   头像
│   └── 彭冠儒-简历.pdf      简历，由「下载简历 PDF」按钮直接下载
└── tools/
    ├── selfcheck.js        结构自检：标签闭合、锚点、CSS 变量、资源引用
    └── verify-served.cjs   起本地服务后校验实际输出
```

## 本地预览

直接双击 `index.html` 即可。若想用本地服务器（行为与线上一致）：

```bash
# Python
python -m http.server 8321

# 或 Node
npx serve -l 8321 .
```

然后打开 <http://127.0.0.1:8321/>。

## 自检

改完内容后可以跑一次，检查标签是否闭合、导航锚点是否对得上、CSS 变量有没有漏定义：

```bash
node tools/selfcheck.js
```

## 部署到 GitHub Pages

1. 把本仓库推到 GitHub（默认分支 `main`）
2. 仓库 **Settings → Pages**
3. **Source** 选 `Deploy from a branch`，**Branch** 选 `main` / `/ (root)`，保存
4. 等 1–2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`

无需任何构建步骤 —— 这是纯静态站点。

## 自定义

**改配色**：只改 `assets/css/style.css` 顶部的变量，全站生效。

```css
:root {
  --accent: #2563eb;   /* 主色调 */
  --side-w: 300px;     /* 侧栏宽度 */
  --max-w: 880px;      /* 内容最大宽度 */
}
```

**改内容**：所有文字都在 `index.html` 里，按区块注释查找即可。

**换头像**：覆盖 `assets/images/avatar.png`，建议 3:4 竖版、宽度 ≥ 800px。

## 许可

代码可自由使用。页面中的个人信息（姓名、联系方式、简历）版权归本人所有。
