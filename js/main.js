/* =============================================
   城隍法脉 · 全局功能脚本
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. 移动端导航切换 =====
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // 点击链接后自动关闭菜单
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== 2. 高亮当前页导航 =====
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
    }
  });

  // ===== 3. 一键复制功能 =====
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      let text = '';
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) text = el.textContent;
      } else {
        // 找最近的 .prayer-text
        const box = btn.closest('.prayer-box');
        if (box) {
          const pt = box.querySelector('.prayer-text');
          if (pt) text = pt.textContent;
        }
      }
      if (text) {
        copyToClipboard(text, btn);
      }
    });
  });

  // ===== 4. 祈请文生成器 =====
  const genForm = document.getElementById('prayer-form');
  const genResult = document.getElementById('prayer-result');
  if (genForm && genResult) {
    genForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generatePrayer();
    });
  }

  // ===== 5. 页面加载动画 =====
  document.querySelectorAll('.section, .card-grid, .si-content').forEach(function (el) {
    el.classList.add('fade-in');
  });
});

// ===== 复制到剪贴板 =====
function copyToClipboard(text, btnEl) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showToast('✅ 已复制到剪贴板');
    }).catch(function () {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
  if (btnEl) {
    var orig = btnEl.textContent;
    btnEl.textContent = '✅ 已复制';
    btnEl.style.background = '#7a9a6d';
    btnEl.style.color = '#fff';
    setTimeout(function () {
      btnEl.textContent = orig;
      btnEl.style.background = '';
      btnEl.style.color = '';
    }, 1500);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('✅ 已复制到剪贴板');
  } catch (e) {
    showToast('❌ 复制失败，请手动复制');
  }
  document.body.removeChild(ta);
}

// ===== Toast 提示 =====
function showToast(msg) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2200);
}

// ===== 祈请文生成器核心逻辑 =====
function generatePrayer() {
  var siSelect = document.getElementById('si-select');
  var nameInput = document.getElementById('prayer-name');
  var matterInput = document.getElementById('prayer-matter');
  var resultBox = document.getElementById('prayer-result');

  var siId = parseInt(siSelect.value);
  var name = nameInput.value.trim() || '___';
  var matter = matterInput.value.trim() || '___';

  var si = SI_DATA.find(function (s) { return s.id === siId; });
  if (!si) {
    resultBox.innerHTML = '<div class="prayer-box"><p style="color:#b5412e;">请选择一个司署</p></div>';
    return;
  }

  var prayer = si.prayer
    .replace(/___/g, function (match, offset) {
      // 第一次出现替换为名字，第二次替换为事项
      return name; // 简化处理，让用户自己填写
    });

  // 更智能的替换：第一个___替换为name，第二个___替换为matter
  var parts = si.prayer.split('___');
  var filled = '';
  for (var i = 0; i < parts.length; i++) {
    filled += parts[i];
    if (i < parts.length - 1) {
      if (i === 0) filled += name || '___';
      else if (i === 1) filled += matter || '___';
      else filled += '___';
    }
  }

  // 替换年月日
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  filled = filled.replace('___ 年', year + ' 年');
  filled = filled.replace('___ 月', month + ' 月');
  filled = filled.replace('___ 日', day + ' 日');

  var html = '<div class="prayer-box">' +
    '<div class="prayer-label">『 祈请 ' + si.name + ' 』</div>' +
    '<div class="prayer-text" id="gen-prayer-text">' + filled + '</div>' +
    '<button class="copy-btn" onclick="copyPrayerResult()">📋 复制</button>' +
    '</div>';

  resultBox.innerHTML = html;
}

// ===== 复制生成结果 =====
function copyPrayerResult() {
  var el = document.getElementById('gen-prayer-text');
  if (el) {
    copyToClipboard(el.textContent);
  }
}

/* =============================================
   原版动态渲染：renderSiPage(si)
   兼容 pages/TEMPLATE.html 架构
   对应 SIXI_DATA 数据
   ============================================= */
function renderSiPage(si) {
  // 头部
  var headerEl = document.getElementById('si-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<h1 style="font-family:var(--font-serif);font-size:1.8rem;color:var(--brown-dark);letter-spacing:2px;margin-bottom:6px;">' +
      (si.icon || '☯') + ' ' + si.name + '</h1>' +
      '<p style="color:var(--brown-light);font-size:0.95rem;margin-bottom:8px;">' +
      (si.subtitle || '') + '</p>' +
      '<p style="color:var(--brown-mid);line-height:1.8;">' + si.summary + '</p>';
  }

  // 职能
  var funcsEl = document.getElementById('si-funcs');
  if (funcsEl && si.functions) {
    funcsEl.innerHTML = si.functions.map(function(f) {
      return '<li>' + f + '</li>';
    }).join('');
  }

  // 场景
  var scenesEl = document.getElementById('si-scenarios');
  if (scenesEl && si.scenarios) {
    scenesEl.innerHTML = si.scenarios.map(function(s) {
      return '<span class="tag">' + s + '</span>';
    }).join('');
  }

  // 养护
  var careEl = document.getElementById('si-care');
  if (careEl && si.care) {
    careEl.innerHTML = si.care.map(function(c) {
      return '<li>' + c + '</li>';
    }).join('');
  }

  // 祈请文
  var prayerEl = document.getElementById('si-prayer');
  if (prayerEl && si.prayer) {
    prayerEl.textContent = si.prayer;
  }

  // 复制按钮
  var copyBtn = document.getElementById('copy-prayer');
  if (copyBtn) {
    copyBtn.onclick = function() {
      if (si.prayer) copyToClipboard(si.prayer);
    };
  }

  // 返回顶部
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
