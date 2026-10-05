// 结构自检：逐行统计 HTML 标签开合是否平衡，并检查 JS 依赖的 id / 选择器是否存在
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\71930\\dsh\\personal-website';
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const lines = html.split(/\r?\n/);

const voidTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);
const stack = [];
const problems = [];

lines.forEach((line, i) => {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(line))) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const selfClose = m[3] === '/' || voidTags.has(tag);
    if (selfClose) continue;
    if (!closing) {
      stack.push({ tag, line: i + 1 });
    } else {
      const top = stack.pop();
      if (!top) problems.push(`line ${i + 1}: stray </${tag}>`);
      else if (top.tag !== tag) problems.push(`line ${i + 1}: </${tag}> closes <${top.tag}> opened at line ${top.line}`);
    }
  }
});
stack.forEach(s => problems.push(`unclosed <${s.tag}> opened at line ${s.line}`));

console.log('=== 结构检查 ===');
console.log(problems.length ? problems.join('\n') : 'HTML 标签完全平衡 ✓');

// 统计
const count = (re) => (html.match(re) || []).length;
console.log('\n=== 内容统计 ===');
console.log('章节 section :', count(/<section\b/g));
console.log('卡片 card    :', count(/class="[^"]*\bcard\b/g));
console.log('论文条目     :', count(/<article class="pub/g));
console.log('项目条目     :', count(/<article class="card project"/g));
console.log('外链         :', count(/href="https?:/g));
console.log('占位符出现   :', count(/你的名字|某某/g));

// JS 依赖检查
const js = fs.readFileSync(path.join(dir, 'assets', 'js', 'main.js'), 'utf8');
console.log('\n=== JS 依赖检查 ===');
for (const id of ['themeBtn', 'sidebar', 'menuBtn', 'year', 'year2']) {
  const inJs = js.includes(`'${id}'`) || js.includes(`"${id}"`);
  const inHtml = html.includes(`id="${id}"`);
  console.log(`${inHtml && inJs ? 'OK ' : 'ERR'} #${id}  html:${inHtml}  js:${inJs}`);
}
const navHrefs = [...html.matchAll(/class="nav__link[^"]*" href="#([\w-]+)"/g)].map(m => m[1]);
console.log('导航锚点:', navHrefs.join(', '));
for (const h of navHrefs) {
  if (!html.includes(`id="${h}"`)) console.log(`ERR 缺少锚点目标 #${h}`);
}

// CSS 花括号平衡
const css = fs.readFileSync(path.join(dir, 'assets', 'css', 'style.css'), 'utf8');
const open = (css.match(/{/g) || []).length, close = (css.match(/}/g) || []).length;
console.log(`\n=== CSS 检查 ===\n花括号: { =${open}  } =${close}  ${open === close ? '平衡 ✓' : '不平衡 ✗'}`);
const varsUsed = new Set([...css.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]));
const varsDef = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
const missing = [...varsUsed].filter(v => !varsDef.has(v));
console.log('未定义的 CSS 变量:', missing.length ? missing.join(', ') : '无 ✓');

// 资源文件是否存在
console.log('\n=== 资源引用 ===');
for (const m of html.matchAll(/(?:src|href)="((?!http|mailto|#)[^"]+)"/g)) {
  const p = path.join(dir, decodeURIComponent(m[1]));
  console.log((fs.existsSync(p) ? 'OK  ' : 'MISS') + ' ' + m[1]);
}
