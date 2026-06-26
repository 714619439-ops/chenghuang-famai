/**
 * 城隍法脉 · 二十一司护法系统 · 主脚本
 * 导航切换、手风琴展开（事件委托）、复制反馈、回到顶部、祈请文生成器
 */

document.addEventListener('DOMContentLoaded', function () {
  // ===== 导航切换 =====
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    // 点击导航链接后自动收起菜单（移动端）
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== 回到顶部 =====
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // ===== 手风琴（事件委托，支持动态生成的内容） =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.accordion');
    if (!btn) return;

    var panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains('accordion-panel')) return;

    var isOpen = panel.classList.contains('open');

    // 关闭所有
    document.querySelectorAll('.accordion-panel.open').forEach(function (p) {
      p.classList.remove('open');
    });
    document.querySelectorAll('.accordion.active').forEach(function (b) {
      b.classList.remove('active');
    });

    // 打开当前
    if (!isOpen) {
      panel.classList.add('open');
      btn.classList.add('active');

      // 展开后滚动到可视区域
      setTimeout(function () {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });

  // ===== 手风琴键盘支持（Enter/Space） =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var btn = e.target.closest('.accordion');
      if (btn) {
        e.preventDefault();
        btn.click();
      }
    }
  });

  // ===== 复制按钮（事件委托） =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var targetId = btn.getAttribute('data-target');
    if (!targetId) return;
    var textEl = document.getElementById(targetId);
    if (!textEl) return;

    var text = textEl.textContent || textEl.innerText;
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      var orig = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
      }, 2000);
    } catch (e) {
      // fallback
    }
    document.body.removeChild(textarea);
  });

  // ===== 祈请文生成器 =====
  var generateBtn = document.getElementById('generate-btn');
  var nameInput = document.getElementById('prayer-name');
  var dharmaInput = document.getElementById('prayer-dharma');
  var siSelect = document.getElementById('prayer-si');
  var resultBox = document.getElementById('prayer-result');
  var resultContent = document.getElementById('prayer-content');

  // 填充司署下拉
  if (siSelect && typeof SIXI_DATA !== 'undefined') {
    SIXI_DATA.forEach(function (si) {
      var opt = document.createElement('option');
      opt.value = si.id;
      opt.textContent = si.nameFull + ' · ' + si.name;
      siSelect.appendChild(opt);
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', function () {
      var name = nameInput ? nameInput.value.trim() : '';
      var dharma = dharmaInput ? dharmaInput.value.trim() : '';
      var siId = siSelect ? parseInt(siSelect.value) : 0;

      if (!name) { alert('请输入您的姓名'); nameInput.focus(); return; }
      if (!siId) { alert('请选择司署'); siSelect.focus(); return; }

      var si = SIXI_DATA[siId - 1];
      if (!si) { alert('司署数据未找到'); return; }

      var prayer = si.prayer;
      var namePart = name;
      if (dharma) namePart += '（法号' + dharma + '）';
      prayer = prayer.replace(/弟子〇〇〇（法号〇〇〇）/g, '弟子' + namePart);
      prayer = prayer.replace(/弟子〇〇〇/g, '弟子' + name);

      if (resultContent) {
        resultContent.textContent = prayer;
        // 通知屏幕阅读器
        resultContent.setAttribute('aria-live', 'polite');
      }
      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // 更新复制按钮的 data-target
      var copyBtn = resultBox.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.setAttribute('data-target', 'prayer-content');
      }
    });

    // Enter 键触发生成
    var inputs = [nameInput, dharmaInput, siSelect];
    inputs.forEach(function (el) {
      if (el) {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') generateBtn.click();
        });
      }
    });
  }

  // ===== 首页心六宫格 =====
  var heartGrid = document.getElementById('heart-six-grid');
  if (heartGrid && typeof SIXI_DATA !== 'undefined') {
    var heartIds = [5, 6, 2, 7, 1, 20];
    var h = '';
    heartIds.forEach(function (id) {
      var si = SIXI_DATA[id - 1];
      if (!si) return;
      h += '<div class="card card-gold fade-in">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-sm)">' +
          '<div><span class="si-num">第' + (id < 10 ? '0' : '') + id + '司</span>' +
          '<h3 style="margin:0.2rem 0;font-size:1.1rem;color:var(--gold-light)">' + si.name + '</h3></div>' +
          '<span class="tag tag-youth">护佑青少年</span>' +
        '</div>' +
        '<p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:var(--space-sm)">' + si.gods + '</p>' +
        '<p style="font-size:0.88rem;line-height:1.8;color:var(--text-secondary)">' + si.desc + '</p>' +
        '<a href="all-si.html#' + si.name + '" style="color:var(--gold);text-decoration:none;font-size:0.8rem;display:inline-block;margin-top:var(--space-sm)">查看详情 →</a>' +
      '</div>';
    });
    heartGrid.innerHTML = h;
  }

  // ===== 护青公益：心育六司卡片渲染 =====
  var heartSixGrid = document.getElementById('heart-six-grid-detail');
  if (heartSixGrid && typeof SIXI_DATA !== 'undefined') {
    var html = '';
    var HEART_SIX_IDS = [5, 6, 2, 7, 1, 20];
    var topicMap = {
      5: '对应：焦虑、抑郁、情绪不稳定',
      6: '对应：失眠、噩梦、神经衰弱',
      2: '对应：流感、传染病、免疫力低下',
      7: '对应：久病不愈、药效不佳、慢性病',
      1: '对应：感冒、过敏、体质虚弱',
      20: '对应：家庭氛围、家宅安宁、居住环境'
    };
    HEART_SIX_IDS.forEach(function (id) {
      var si = SIXI_DATA[id - 1];
      if (!si) return;
      html += '<div class="card card-gold fade-in">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">' +
          '<div><span class="si-num">第' + (id < 10 ? '0' : '') + id + '司</span>' +
          '<h3 style="margin:0.3rem 0 0;font-size:1.2rem;color:var(--gold-light)">' + si.name + '</h3></div>' +
        '</div>' +
        '<p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:var(--space-sm)">主司：' + si.gods + '</p>' +
        '<p style="font-size:0.88rem;line-height:1.9;color:var(--text-secondary)">' + si.desc + '</p>' +
        '<p style="font-size:0.82rem;line-height:1.8;color:var(--gold);margin-top:var(--space-sm)">' + (topicMap[id] || '') + '</p>' +
        '<a href="all-si.html#' + si.name + '" style="color:var(--gold);text-decoration:none;font-size:0.8rem;display:inline-block;margin-top:var(--space-sm)">查看详情 →</a>' +
      '</div>';
    });
    heartSixGrid.innerHTML = html;
  }
});
