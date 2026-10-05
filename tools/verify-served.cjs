// 全站最终校验：内容 + 简历 PDF 链接是否可用
// 用法： node tools/verify-served.cjs [url]
//   url 省略时默认 http://127.0.0.1:8321
(async () => {
  const base = (process.argv[2] || 'http://127.0.0.1:8321').replace(/\/+$/, '');
  console.log('校验目标: ' + base + '\n');
  const html = await (await fetch(base + '/index.html')).text();
  console.log(`页面 HTTP 200 · ${html.length} 字符\n`);

  let bad = 0;
  console.log('=== 简历 PDF 链接 ===');
  const link = (html.match(/href="(assets\/[^"]*\.pdf)"/) || [])[1];
  if (!link) { bad++; console.log('MISS 页面上没有 PDF 链接'); }
  else {
    console.log('  链接:', link);
    const r = await fetch(`${base}/${encodeURI(link)}`);
    console.log(`  请求: HTTP ${r.status}  content-type=${r.headers.get('content-type')}  ${(await r.arrayBuffer()).byteLength} 字节`);
    if (r.status !== 200) bad++;
  }
  const stale = html.split('把简历PDF放这里').length - 1;
  if (stale) bad++;
  console.log(`${!stale ? 'OK  ' : 'WARN'} 旧占位文件名残留  ${stale}`);

  console.log('\n=== 关键内容 ===');
  for (const c of ['彭冠儒', '武汉理工大学', '通信工程', '湖北省大学生数学竞赛', '数字电子技术', '模拟电子技术', '3.8 / 5.0', '130 0637 6732', '371737@whut.edu.cn']) {
    const n = html.split(c).length - 1;
    if (!n) bad++;
    console.log(`${n ? 'OK  ' : 'MISS'} ${c.padEnd(24)} ${n}`);
  }

  console.log('\n=== 不应存在 ===');
  for (const c of ['占位', '示例：', '待替换', '信号与信息处理', 'publications']) {
    const n = html.split(c).length - 1;
    if (n) bad++;
    console.log(`${!n ? 'OK  ' : 'WARN'} ${c.padEnd(20)} ${n}`);
  }

  console.log('\n=== 静态资源 ===');
  for (const p of ['/assets/css/style.css', '/assets/js/main.js', '/assets/images/avatar.png']) {
    const r = await fetch(base + p);
    if (r.status !== 200) bad++;
    console.log(`${r.status === 200 ? 'OK  ' : 'FAIL'} ${p}`);
  }

  console.log('\n结果: ' + (bad === 0 ? '全部通过 ✓' : `有 ${bad} 项不符 ✗`));
})();
