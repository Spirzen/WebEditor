/**
 * Online Web Editor — HTML/CSS/JS live editor
 */

const STORAGE_KEY = 'webeditor-code';
const PANEL_RATIO_KEY = 'webeditor-panel-ratio';

const DEFAULT_CODE = {
  html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Neon Demo</title>
</head>
<body>
  <div class="hero">
    <h1 class="title">Привет, Online Web Editor!</h1>
    <p class="subtitle">Редактируй HTML, CSS и JS — результат здесь</p>
    <button class="btn" id="magic-btn">✨ Нажми меня</button>
    <div class="particles" id="particles"></div>
  </div>
</body>
</html>`,

  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  overflow: hidden;
}

.hero {
  text-align: center;
  position: relative;
  padding: 2rem;
}

.title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(90deg, #00f5ff, #ff2d95, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
}

.subtitle {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.btn {
  margin-top: 2rem;
  padding: 0.85rem 2rem;
  border: 2px solid #00f5ff;
  border-radius: 50px;
  background: transparent;
  color: #00f5ff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
}

.btn:hover {
  background: #00f5ff;
  color: #0f0c29;
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.5);
  transform: scale(1.05);
}

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  from { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  to { transform: translateY(-10vh) scale(1); opacity: 0; }
}`,

  javascript: `const btn = document.getElementById('magic-btn');
const container = document.getElementById('particles');

const colors = ['#00f5ff', '#ff2d95', '#a855f7', '#39ff14', '#ffe66d'];

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.background = colors[Math.floor(Math.random() * colors.length)];
  p.style.boxShadow = \`0 0 6px \${p.style.background}\`;
  p.style.animationDuration = (4 + Math.random() * 6) + 's';
  p.style.animationDelay = Math.random() * 2 + 's';
  container.appendChild(p);
  setTimeout(() => p.remove(), 10000);
}

btn.addEventListener('click', () => {
  for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, i * 50);
  }
  btn.textContent = '🎉 Круто!';
  setTimeout(() => { btn.textContent = '✨ Нажми меня'; }, 2000);
});

setInterval(createParticle, 800);`,
};

/* ── Custom Ace theme ── */
function defineAceTheme() {
  window.ace.define('ace/theme/neonpad', [], (_require, exports) => {
    exports.isDark = true;
    exports.cssClass = 'ace-neonpad';
    exports.cssText = `
.ace-neonpad .ace_editor { background: #0e0e18; color: #e8e8f0; }
.ace-neonpad .ace_gutter { background: #0a0a12; color: #4a4a6a; }
.ace-neonpad .ace_gutter-active-line { background: rgba(0,245,255,0.05); }
.ace-neonpad .ace_marker-layer .ace_active-line { background: rgba(0,245,255,0.04); }
.ace-neonpad .ace_cursor { color: #00f5ff; }
.ace-neonpad .ace_string { color: #39ff14; }
.ace-neonpad .ace_constant.ace_numeric { color: #ff6b35; }
.ace-neonpad .ace_constant.ace_language { color: #ff2d95; }
.ace-neonpad .ace_keyword { color: #ff2d95; }
.ace-neonpad .ace_support.ace_function { color: #00f5ff; }
.ace-neonpad .ace_entity.ace_name.ace_tag { color: #ff6b6b; }
.ace-neonpad .ace_entity.ace_name.ace_function { color: #4ecdc4; }
.ace-neonpad .ace_variable { color: #ffe66d; }
.ace-neonpad .ace_comment { color: #4a4a6a; font-style: italic; }
.ace-neonpad .ace_meta.ace_tag { color: #a855f7; }
.ace-neonpad .ace_attribute-name { color: #4ecdc4; }
.ace-neonpad .ace_paren { color: #e8e8f0; }
.ace-neonpad .ace_punctuation { color: #7a7a9a; }
.ace-neonpad .ace_selection { background: rgba(168,85,247,0.25); }
.ace-neonpad .ace_indent-guide { background: rgba(255,255,255,0.03); }
.ace-neonpad .ace_marker-layer .ace_bracket { border-color: rgba(0,245,255,0.4); }
.ace-neonpad .ace_invisible { color: rgba(255,255,255,0.08); }
`;
  });
}

/* ── State ── */
const state = {
  activeLang: 'html',
  autoRun: true,
  debounceTimer: null,
  saveTimer: null,
  editors: {},
};

const LANG_LABELS = { html: 'HTML', css: 'CSS', javascript: 'JavaScript' };

/* ── DOM refs ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const preview = $('#preview');
const autoRunToggle = $('#auto-run');
const statusLang = $('#status-lang');
const statusPosition = $('#status-position');
const statusSaved = $('#status-saved');
const toast = $('#toast');

/* ── Init editors ── */
function createEditor(id, mode) {
  const editor = window.ace.edit(id, {
    theme: 'ace/theme/neonpad',
    mode: `ace/mode/${mode}`,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    showPrintMargin: false,
    highlightActiveLine: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    useSoftTabs: true,
    wrap: true,
  });

  editor.setOptions({
    scrollPastEnd: 0.3,
  });

  return editor;
}

function initEditors() {
  if (typeof window.ace === 'undefined') {
    throw new Error('Ace Editor не загрузился. Проверьте подключение к интернету.');
  }

  window.ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.9/');
  window.ace.require('ace/ext/language_tools');

  defineAceTheme();

  state.editors = {
    html: createEditor('editor-html', 'html'),
    css: createEditor('editor-css', 'css'),
    javascript: createEditor('editor-js', 'javascript'),
  };

  const saved = loadFromStorage();
  const code = saved || DEFAULT_CODE;

  Object.entries(state.editors).forEach(([lang, editor]) => {
    editor.setValue(code[lang] || '', -1);
    editor.session.on('change', () => onCodeChange());
    editor.selection.on('changeCursor', () => updateCursorStatus(lang));
    editor.resize();
  });
}

/* ── Preview ── */
function buildDocument() {
  const html = state.editors.html.getValue();
  const css = state.editors.css.getValue();
  const js = state.editors.javascript.getValue();

  const styleBlock = css.trim() ? `<style>\n${css}\n</style>` : '';
  const scriptBlock = js.trim() ? `<script>\n${js}\n<\/script>` : '';

  if (/<!doctype/i.test(html) || /<html/i.test(html)) {
    let doc = html;
    if (css.trim() && !/<style/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `${styleBlock}\n</head>`);
    }
    if (js.trim() && !/<script/i.test(doc)) {
      doc = doc.replace(/<\/body>/i, `${scriptBlock}\n</body>`);
    }
    return doc;
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${styleBlock}
</head>
<body>
${html}
${scriptBlock}
</body>
</html>`;
}

function runPreview() {
  try {
    preview.srcdoc = buildDocument();
  } catch (err) {
    preview.srcdoc = `<html><body style="font-family:monospace;padding:1rem;color:#ff2d95;background:#0a0a12"><pre>Ошибка: ${err.message}</pre></body></html>`;
  }
}

function onCodeChange() {
  updateCursorStatus(state.activeLang);
  scheduleSave();

  if (state.autoRun) {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(runPreview, 400);
  }
}

/* ── Storage ── */
function getCodeSnapshot() {
  return {
    html: state.editors.html.getValue(),
    css: state.editors.css.getValue(),
    javascript: state.editors.javascript.getValue(),
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function scheduleSave() {
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getCodeSnapshot()));
      flashSaved();
    } catch { /* quota exceeded */ }
  }, 600);
}

function flashSaved() {
  statusSaved.classList.add('status-saved--visible');
  setTimeout(() => statusSaved.classList.remove('status-saved--visible'), 2000);
}

/* ── Tabs ── */
function switchTab(lang) {
  state.activeLang = lang;

  $$('.tab').forEach((tab) => {
    const isActive = tab.dataset.lang === lang;
    tab.classList.toggle('tab--active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });

  $$('.editor-wrap').forEach((wrap) => {
    wrap.classList.toggle('editor-wrap--active', wrap.dataset.lang === lang);
  });

  statusLang.textContent = LANG_LABELS[lang];
  requestAnimationFrame(() => {
    state.editors[lang].resize(true);
    updateCursorStatus(lang);
    state.editors[lang].focus();
  });
}

function updateCursorStatus(lang) {
  const editor = state.editors[lang];
  if (!editor) return;
  const pos = editor.getCursorPosition();
  statusPosition.textContent = `Ln ${pos.row + 1}, Col ${pos.column + 1}`;
}

/* ── Resizer ── */
function initResizer() {
  const resizer = $('#resizer');
  const editorPanel = $('#editor-panel');
  const workspace = $('.workspace');
  let dragging = false;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const applyRatio = (ratio) => {
    const clamped = Math.min(0.75, Math.max(0.25, ratio));
    if (isMobile()) {
      editorPanel.style.flex = `1 1 ${clamped * 100}%`;
    } else {
      editorPanel.style.flex = `0 0 ${clamped * 100}%`;
    }
    Object.values(state.editors).forEach((e) => e.resize());
  };

  const savedRatio = parseFloat(localStorage.getItem(PANEL_RATIO_KEY));
  if (!isNaN(savedRatio)) applyRatio(savedRatio);

  const onMove = (clientX, clientY) => {
    const rect = workspace.getBoundingClientRect();
    let ratio;
    if (isMobile()) {
      ratio = (clientY - rect.top) / rect.height;
    } else {
      ratio = (clientX - rect.left) / rect.width;
    }
    applyRatio(ratio);
    localStorage.setItem(PANEL_RATIO_KEY, ratio.toString());
  };

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragging = true;
    resizer.classList.add('resizer--dragging');
    document.body.style.cursor = isMobile() ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    onMove(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('resizer--dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  resizer.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.05;
    const current = editorPanel.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();
    let ratio = isMobile()
      ? current.height / workspaceRect.height
      : current.width / workspaceRect.width;

    if ((isMobile() && e.key === 'ArrowDown') || (!isMobile() && e.key === 'ArrowRight')) {
      ratio += step;
    } else if ((isMobile() && e.key === 'ArrowUp') || (!isMobile() && e.key === 'ArrowLeft')) {
      ratio -= step;
    } else return;

    e.preventDefault();
    applyRatio(ratio);
    localStorage.setItem(PANEL_RATIO_KEY, ratio.toString());
  });
}

/* ── Actions ── */
function downloadHtml() {
  const content = buildDocument();
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'web-editor-project.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Файл скачан');
}

function resetToDefault() {
  if (!confirm('Сбросить код к шаблону? Текущие изменения будут потеряны.')) return;

  Object.entries(DEFAULT_CODE).forEach(([lang, code]) => {
    state.editors[lang].setValue(code, -1);
  });

  localStorage.removeItem(STORAGE_KEY);
  runPreview();
  showToast('Шаблон восстановлен');
}

function togglePreviewFullscreen() {
  $('#app').classList.toggle('app--preview-fullscreen');
  setTimeout(() => Object.values(state.editors).forEach((e) => e.resize()), 300);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('toast--visible'), 2500);
}

/* ── Event bindings ── */
function bindEvents() {
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.lang));
  });

  $('#btn-run').addEventListener('click', runPreview);
  $('#btn-refresh').addEventListener('click', runPreview);
  $('#btn-download').addEventListener('click', downloadHtml);
  $('#btn-reset').addEventListener('click', resetToDefault);
  $('#btn-fullscreen').addEventListener('click', togglePreviewFullscreen);

  autoRunToggle.addEventListener('change', () => {
    state.autoRun = autoRunToggle.checked;
    if (state.autoRun) runPreview();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runPreview();
      showToast('Предпросмотр обновлён');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(getCodeSnapshot()));
        flashSaved();
        showToast('Сохранено локально');
      } catch {
        showToast('Не удалось сохранить');
      }
    }
  });

  window.addEventListener('resize', () => {
    Object.values(state.editors).forEach((e) => e.resize());
  });
}

/* ── Boot ── */
function init() {
  try {
    initEditors();
    initResizer();
    bindEvents();
    switchTab('html');
    runPreview();
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Ошибка инициализации редактора');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
