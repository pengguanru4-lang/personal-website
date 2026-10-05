/* =============================================================
   个人主页脚本：主题切换（含记忆）· 移动端菜单 · 滚动高亮 · 年份
   ============================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 1. 深色模式：优先读取本地记忆，其次跟随系统 ---------- */
  var STORE_KEY = 'site-theme';
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* 隐私模式下忽略 */ }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));

  function setTheme(mode) {
    if (mode === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    var btn = document.getElementById('themeBtn');
    if (btn) btn.setAttribute('aria-label', mode === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  }

  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem(STORE_KEY, next); } catch (e) {}
  });

  /* ---------- 2. 移动端侧栏开关 ---------- */
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.getElementById('menuBtn');

  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = sidebar.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // 点击侧栏外的区域 / 按 Esc 关闭
  document.addEventListener('click', function (e) {
    if (!sidebar.classList.contains('is-open')) return;
    if (sidebar.contains(e.target) || menuBtn.contains(e.target)) return;
    sidebar.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });

  /* ---------- 3. 滚动时高亮当前章节 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function highlight() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) { if (sec.offsetTop <= pos) current = sec; });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { highlight(); ticking = false; });
  }, { passive: true });
  highlight();

  // 点击导航后，在小屏幕上自动收起侧栏
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- 4. 自动写入当前年份 ---------- */
  var y = String(new Date().getFullYear());
  ['year', 'year2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = y;
  });
})();
