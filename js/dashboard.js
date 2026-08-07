/* ==========================================================================
   SKYPERMONEY DASHBOARD — SCRIPT
   Modules:
   1. Data (mock)
   2. Theme (dark mode)
   3. Greeting
   4. Mobile nav
   5. Charts (Chart.js)
   6. Category cards render
   7. Transactions table render
   8. Sidebar goal ring
   9. Init
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. DATA                                                             */
  /* ------------------------------------------------------------------ */
  const THEME = {
    blue: '#2563EB',
    green: '#10B981',
    red: '#EF4444',
    amber: '#F59E0B',
    purple: '#8B5CF6',
    teal: '#14B8A6',
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income:   [62000, 65500, 70000, 68500, 74000, 77500, 79000, 81000, 78500, 83000, 85500, 82500],
    expenses: [38000, 41000, 36500, 39500, 42000, 40500, 37500, 39000, 41500, 38500, 40000, 24260],
  };

  const expenseCategories = [
    { name: 'Food', value: 8200, color: THEME.blue },
    { name: 'Shopping', value: 5100, color: THEME.green },
    { name: 'Transport', value: 3400, color: THEME.amber },
    { name: 'Entertainment', value: 2600, color: THEME.purple },
    { name: 'Bills', value: 3260, color: THEME.teal },
    { name: 'Health', value: 1700, color: THEME.red },
  ];

  const categoryIcons = {
    Food: '<path d="M6 3v7a3 3 0 0 0 6 0V3M9 3v18M18 3c-2 2-2 5-2 7a2 2 0 0 0 4 0V3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    Transport: '<path d="M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M4 17V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M6 7l1.5-4h9L18 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    Shopping: '<path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="2" fill="none"/>',
    Health: '<path d="M12 21s-7-4.35-9.5-8.5C.8 8.7 2.6 5 6.2 5c2 0 3.3 1.1 3.8 2 .5-.9 1.8-2 3.8-2 3.6 0 5.4 3.7 3.7 7.5C19 16.65 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>',
    Education: '<path d="M2 8l10-5 10 5-10 5-10-5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" stroke-width="2" fill="none"/>',
    Bills: '<rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };

  const budgetCategories = [
    { name: 'Food', budget: 10000, spent: 8200, colorKey: 'blue' },
    { name: 'Transport', budget: 4000, spent: 3400, colorKey: 'amber' },
    { name: 'Shopping', budget: 6000, spent: 5100, colorKey: 'green' },
    { name: 'Health', budget: 2500, spent: 1700, colorKey: 'red' },
    { name: 'Education', budget: 3000, spent: 3150, colorKey: 'purple' },
    { name: 'Bills', budget: 3500, spent: 3260, colorKey: 'teal' },
  ];

  const transactions = [
    { date: 'Aug 06, 2026', title: 'Freelance Payment — Client X', category: 'Income', dot: THEME.green, amount: 18500, type: 'income' },
    { date: 'Aug 05, 2026', title: 'Zomato Order', category: 'Food', dot: THEME.blue, amount: -540, type: 'expense' },
    { date: 'Aug 04, 2026', title: 'Uber Rides', category: 'Transport', dot: THEME.amber, amount: -320, type: 'expense' },
    { date: 'Aug 03, 2026', title: 'Amazon Purchase', category: 'Shopping', dot: THEME.green, amount: -2450, type: 'expense' },
    { date: 'Aug 02, 2026', title: 'Salary Credited', category: 'Income', dot: THEME.green, amount: 64000, type: 'income' },
    { date: 'Aug 01, 2026', title: 'Electricity Bill', category: 'Bills', dot: THEME.teal, amount: -1180, type: 'expense' },
    { date: 'Jul 30, 2026', title: 'Netflix Subscription', category: 'Entertainment', dot: THEME.purple, amount: -499, type: 'expense' },
    { date: 'Jul 28, 2026', title: 'Pharmacy', category: 'Health', dot: THEME.red, amount: -860, type: 'expense' },
  ];

  /* ------------------------------------------------------------------ */
  /* 2. THEME (DARK MODE)                                                 */
  /* ------------------------------------------------------------------ */
  function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById('darkModeToggle');
    const stored = localStorage.getItem('skypermoney-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');

    applyTheme(initial);

    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('skypermoney-theme', next);
      // Redraw charts so grid/tick colors match the new theme
      refreshChartsTheme();
    });

    function applyTheme(mode) {
      if (mode === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. GREETING                                                          */
  /* ------------------------------------------------------------------ */
  function setGreeting() {
    const hour = new Date().getHours();
    const textEl = document.getElementById('greetingText');
    const emojiEl = document.getElementById('greetingEmoji');

    let text, emoji;

    if (hour >= 5 && hour < 12) {
      text = 'Good Morning, Harshit';
      emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
      text = 'Good Afternoon';
      emoji = '👋';
    } else if (hour >= 17 && hour < 21) {
      text = 'Good Evening';
      emoji = '🌇';
    } else {
      text = 'Good Night';
      emoji = '🌙';
    }

    textEl.childNodes[0].nodeValue = text + ' ';
    emojiEl.textContent = emoji;
  }

  /* ------------------------------------------------------------------ */
  /* 4. MOBILE NAV                                                        */
  /* ------------------------------------------------------------------ */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const links = document.getElementById('navLinks');
    const backdrop = document.getElementById('navBackdrop');

    function closeNav() {
      links.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleNav() {
      const isOpen = links.classList.toggle('is-open');
      backdrop.classList.toggle('is-visible', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', toggleNav);
    backdrop.addEventListener('click', closeNav);
    links.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        links.querySelectorAll('.navbar__link').forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
        closeNav();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. CHARTS                                                            */
  /* ------------------------------------------------------------------ */
  let lineChart, doughnutChart;

  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function formatINR(value) {
    return '₹' + Number(value).toLocaleString('en-IN');
  }

  function buildLineChart() {
    if (typeof Chart === 'undefined') {
      console.warn('SkyperMoney: Chart.js did not load (check your internet connection / CDN access). Line chart skipped.');
      const wrap = document.querySelector('.chart-wrap--line');
      if (wrap) wrap.innerHTML = '<p style="color:var(--text-tertiary);font-size:13.5px;padding:24px 0;">Chart.js failed to load — check your connection.</p>';
      return;
    }
    const ctx = document.getElementById('incomeExpenseChart');
    const gridColor = getCSSVar('--border-color');
    const tickColor = getCSSVar('--text-tertiary');

    lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Income',
            data: monthlyData.income,
            borderColor: THEME.green,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            pointBackgroundColor: THEME.green,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
          },
          {
            label: 'Expenses',
            data: monthlyData.expenses,
            borderColor: THEME.blue,
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            pointBackgroundColor: THEME.blue,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: getCSSVar('--bg-surface'),
            titleColor: getCSSVar('--text-primary'),
            bodyColor: getCSSVar('--text-secondary'),
            borderColor: getCSSVar('--border-color'),
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            boxPadding: 6,
            callbacks: {
              label: (item) => `${item.dataset.label}: ${formatINR(item.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { family: 'Inter', size: 12 } },
          },
          y: {
            grid: { color: gridColor },
            border: { display: false },
            ticks: {
              color: tickColor,
              font: { family: 'Inter', size: 12 },
              callback: (val) => '₹' + (val / 1000) + 'k',
            },
          },
        },
      },
    });
  }

  function buildDoughnutChart() {
    if (typeof Chart === 'undefined') {
      const wrap = document.querySelector('.chart-wrap--doughnut');
      if (wrap) wrap.innerHTML = '<p style="color:var(--text-tertiary);font-size:13.5px;padding:24px 0;text-align:center;">Chart.js failed to load — check your connection.</p>';
      return;
    }
    const ctx = document.getElementById('expenseDoughnutChart');

    doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: expenseCategories.map((c) => c.name),
        datasets: [
          {
            data: expenseCategories.map((c) => c.value),
            backgroundColor: expenseCategories.map((c) => c.color),
            borderColor: getCSSVar('--bg-surface'),
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: getCSSVar('--bg-surface'),
            titleColor: getCSSVar('--text-primary'),
            bodyColor: getCSSVar('--text-secondary'),
            borderColor: getCSSVar('--border-color'),
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: (item) => `${item.label}: ${formatINR(item.parsed)}`,
            },
          },
        },
      },
    });
  }

  function refreshChartsTheme() {
    const gridColor = getCSSVar('--border-color');
    const tickColor = getCSSVar('--text-tertiary');
    const surfaceColor = getCSSVar('--bg-surface');
    const textColor = getCSSVar('--text-primary');
    const secondaryColor = getCSSVar('--text-secondary');

    if (lineChart) {
      lineChart.options.scales.x.ticks.color = tickColor;
      lineChart.options.scales.y.ticks.color = tickColor;
      lineChart.options.scales.y.grid.color = gridColor;
      lineChart.options.plugins.tooltip.backgroundColor = surfaceColor;
      lineChart.options.plugins.tooltip.titleColor = textColor;
      lineChart.options.plugins.tooltip.bodyColor = secondaryColor;
      lineChart.options.plugins.tooltip.borderColor = gridColor;
      lineChart.update('none');
    }

    if (doughnutChart) {
      doughnutChart.data.datasets[0].borderColor = surfaceColor;
      doughnutChart.options.plugins.tooltip.backgroundColor = surfaceColor;
      doughnutChart.options.plugins.tooltip.titleColor = textColor;
      doughnutChart.options.plugins.tooltip.bodyColor = secondaryColor;
      doughnutChart.options.plugins.tooltip.borderColor = gridColor;
      doughnutChart.update('none');
    }
  }

  function renderCategoryLegend() {
    const list = document.getElementById('categoryLegend');
    const total = expenseCategories.reduce((sum, c) => sum + c.value, 0);

    list.innerHTML = expenseCategories
      .map((c) => {
        const percent = ((c.value / total) * 100).toFixed(0);
        return `
          <li class="category-legend__item">
            <span class="category-legend__left">
              <i class="category-legend__dot" style="background:${c.color}"></i>
              ${c.name}
            </span>
            <span class="category-legend__percent">${percent}%</span>
          </li>
        `;
      })
      .join('');
  }

  /* ------------------------------------------------------------------ */
  /* 6. CATEGORY CARDS                                                    */
  /* ------------------------------------------------------------------ */
  function renderCategoryCards() {
    const grid = document.getElementById('categoryGrid');

    grid.innerHTML = budgetCategories
      .map((cat) => {
        const remaining = cat.budget - cat.spent;
        const percent = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
        const isOver = remaining < 0;
        const barClass = isOver ? 'is-danger' : percent > 85 ? 'is-warning' : '';
        const iconSvg = categoryIcons[cat.name] || categoryIcons.Bills;

        const softVarMap = { blue: 'primary', green: 'accent', red: 'red', amber: 'amber', purple: 'purple', teal: 'teal' };
        const softVar = `var(--color-${softVarMap[cat.colorKey] || 'primary'}-soft)`;

        return `
          <article class="category-card">
            <div class="category-card__top">
              <span class="category-card__icon" style="background:${softVar}; color:${THEME[cat.colorKey] || THEME.blue}">
                <svg width="19" height="19" viewBox="0 0 24 24">${iconSvg}</svg>
              </span>
              <div>
                <p class="category-card__name">${cat.name}</p>
                <p class="category-card__budget">Budget: ${formatINR(cat.budget)}</p>
              </div>
            </div>
            <div class="category-card__stats">
              <span>Spent</span>
              <strong>${formatINR(cat.spent)}</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-bar__fill ${barClass}" style="width:${percent}%"></div>
            </div>
            <p class="category-card__remaining ${isOver ? 'is-over' : ''}">
              ${isOver ? 'Over by' : 'Remaining'}: <strong>${formatINR(Math.abs(remaining))}</strong>
            </p>
          </article>
        `;
      })
      .join('');
  }

  /* ------------------------------------------------------------------ */
  /* 7. TRANSACTIONS TABLE                                                */
  /* ------------------------------------------------------------------ */
  function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');

    tbody.innerHTML = transactions
      .map((tx, index) => {
        const isIncome = tx.type === 'income';
        const amountClass = isIncome ? 'is-positive' : 'is-negative';
        const amountPrefix = isIncome ? '+' : '−';

        return `
          <tr data-index="${index}">
            <td>${tx.date}</td>
            <td class="tx-title">${tx.title}</td>
            <td>
              <span class="tx-category">
                <i class="tx-category__dot" style="background:${tx.dot}"></i>
                ${tx.category}
              </span>
            </td>
            <td class="tx-amount ${amountClass}">${amountPrefix}${formatINR(Math.abs(tx.amount))}</td>
            <td>
              <span class="status-badge ${isIncome ? 'status-badge--income' : 'status-badge--expense'}">
                ${isIncome ? 'Income' : 'Expense'}
              </span>
            </td>
            <td>
              <div class="tx-actions">
                <button class="tx-action-btn tx-action-btn--edit" aria-label="Edit transaction" title="Edit" type="button">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                </button>
                <button class="tx-action-btn tx-action-btn--delete" aria-label="Delete transaction" title="Delete" type="button">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    // Delete: remove from the data array (not just the DOM) so it stays gone on re-render
    tbody.querySelectorAll('.tx-action-btn--delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('tr');
        const index = Number(row.dataset.index);
        row.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(8px)';
        setTimeout(() => {
          transactions.splice(index, 1);
          renderTransactions();
          showToast('Transaction deleted');
        }, 220);
      });
    });

    // Edit: reopen the transaction modal pre-filled with this row's data
    tbody.querySelectorAll('.tx-action-btn--edit').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('tr');
        const index = Number(row.dataset.index);
        openTransactionModal({ mode: 'edit', index });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. SIDEBAR GOAL RING                                                 */
  /* ------------------------------------------------------------------ */
  function renderGoalRing() {
    const circle = document.getElementById('goalRingFill');
    const percentLabel = document.getElementById('goalPercent');
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const percent = 68;

    circle.style.strokeDasharray = String(circumference);
    // Animate on next frame so the transition is visible
    requestAnimationFrame(() => {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = String(offset);
    });
    percentLabel.textContent = percent + '%';
  }

  /* ------------------------------------------------------------------ */
  /* 9. TOASTS                                                            */
  /* ------------------------------------------------------------------ */
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  /* ------------------------------------------------------------------ */
  /* 10. MODAL (Add/Edit Transaction, Add Category)                       */
  /* ------------------------------------------------------------------ */
  const modalOverlay = () => document.getElementById('modalOverlay');
  const modalTitleEl = () => document.getElementById('modalTitle');
  const modalFormEl = () => document.getElementById('modalForm');

  function closeModal() {
    modalOverlay().classList.remove('is-open');
    modalOverlay().setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-lock');
  }

  function openModal(title) {
    modalTitleEl().textContent = title;
    modalOverlay().classList.add('is-open');
    modalOverlay().setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-lock');
    const firstField = modalFormEl().querySelector('input, select');
    if (firstField) setTimeout(() => firstField.focus(), 50);
  }

  function openTransactionModal({ mode = 'add', index = null, presetType = null } = {}) {
    const isEdit = mode === 'edit';
    const existing = isEdit ? transactions[index] : null;
    const categoryNames = Object.keys(categoryIcons);

    openModal(isEdit ? 'Edit Transaction' : 'Add Transaction');

    modalFormEl().innerHTML = `
      <div class="form-field">
        <label for="fldTitle">Title</label>
        <input type="text" id="fldTitle" required value="${existing ? existing.title : ''}" placeholder="e.g. Grocery run" />
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="fldType">Type</label>
          <select id="fldType">
            <option value="expense" ${(!isEdit && presetType !== 'income') || existing?.type === 'expense' ? 'selected' : ''}>Expense</option>
            <option value="income" ${(!isEdit && presetType === 'income') || existing?.type === 'income' ? 'selected' : ''}>Income</option>
          </select>
        </div>
        <div class="form-field">
          <label for="fldAmount">Amount (₹)</label>
          <input type="number" id="fldAmount" required min="1" step="1" value="${existing ? Math.abs(existing.amount) : ''}" placeholder="0" />
        </div>
      </div>
      <div class="form-field">
        <label for="fldCategory">Category</label>
        <select id="fldCategory">
          <option value="Income" ${existing?.category === 'Income' ? 'selected' : ''}>Income</option>
          ${categoryNames.map((c) => `<option value="${c}" ${existing?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--ghost" id="modalCancelBtn">Cancel</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Save Changes' : 'Add Transaction'}</button>
      </div>
    `;

    document.getElementById('modalCancelBtn').addEventListener('click', closeModal);

    modalFormEl().onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById('fldTitle').value.trim();
      const type = document.getElementById('fldType').value;
      const amount = Number(document.getElementById('fldAmount').value);
      const category = document.getElementById('fldCategory').value;

      if (!title || !amount || amount <= 0) return;

      const dotColors = { blue: THEME.blue, green: THEME.green, amber: THEME.amber, purple: THEME.purple, teal: THEME.teal, red: THEME.red };
      const categoryColorKey = (budgetCategories.find((c) => c.name === category) || {}).colorKey;
      const dot = type === 'income' ? THEME.green : dotColors[categoryColorKey] || THEME.blue;

      const record = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        title,
        category: type === 'income' ? 'Income' : category,
        dot,
        amount: type === 'income' ? amount : -amount,
        type,
      };

      if (isEdit) {
        transactions[index] = { ...transactions[index], ...record, date: transactions[index].date };
        showToast('Transaction updated');
      } else {
        transactions.unshift(record);
        showToast('Transaction added');
      }

      renderTransactions();
      closeModal();
    };
  }

  function openCategoryModal() {
    openModal('Add Category');

    modalFormEl().innerHTML = `
      <div class="form-field">
        <label for="fldCatName">Category Name</label>
        <input type="text" id="fldCatName" required placeholder="e.g. Travel" />
      </div>
      <div class="form-field">
        <label for="fldCatBudget">Monthly Budget (₹)</label>
        <input type="number" id="fldCatBudget" required min="1" step="1" placeholder="5000" />
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--ghost" id="modalCancelBtn">Cancel</button>
        <button type="submit" class="btn btn--primary">Add Category</button>
      </div>
    `;

    document.getElementById('modalCancelBtn').addEventListener('click', closeModal);

    modalFormEl().onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('fldCatName').value.trim();
      const budget = Number(document.getElementById('fldCatBudget').value);
      if (!name || !budget) return;

      const colorKeys = ['blue', 'green', 'amber', 'purple', 'teal', 'red'];
      const colorKey = colorKeys[budgetCategories.length % colorKeys.length];
      if (!categoryIcons[name]) categoryIcons[name] = categoryIcons.Bills;

      budgetCategories.push({ name, budget, spent: 0, colorKey });
      renderCategoryCards();
      showToast(`"${name}" category added`);
      closeModal();
    };
  }

  function initModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    modalOverlay().addEventListener('click', (e) => {
      if (e.target === modalOverlay()) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay().classList.contains('is-open')) closeModal();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 11. DROPDOWNS (Notifications & Profile)                              */
  /* ------------------------------------------------------------------ */
  const notifications = [
    { title: 'Budget alert', body: 'Education spending is over budget this month.', time: '2h ago', unread: true },
    { title: 'Payment received', body: 'Freelance payment of ₹18,500 credited.', time: '1d ago', unread: true },
    { title: 'Goal milestone', body: "You're 68% toward your savings goal.", time: '3d ago', unread: false },
  ];

  function renderNotifications() {
    const list = document.getElementById('notificationList');
    list.innerHTML = notifications
      .map(
        (n) => `
        <li class="notification-item ${n.unread ? 'is-unread' : ''}">
          <p class="notification-item__title">${n.title}</p>
          <p class="notification-item__body">${n.body}</p>
          <p class="notification-item__time">${n.time}</p>
        </li>
      `
      )
      .join('');

    const dot = document.getElementById('notificationDot');
    const hasUnread = notifications.some((n) => n.unread);
    dot.style.display = hasUnread ? 'block' : 'none';
  }

  function initDropdowns() {
    const bellBtn = document.getElementById('notificationBtn');
    const bellPanel = document.getElementById('notificationPanel');
    const profileBtn = document.getElementById('profileBtn');
    const profilePanel = document.getElementById('profilePanel');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    function closeAllDropdowns() {
      bellPanel.classList.remove('is-open');
      profilePanel.classList.remove('is-open');
      bellBtn.setAttribute('aria-expanded', 'false');
      profileBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown(btn, panel) {
      const willOpen = !panel.classList.contains('is-open');
      closeAllDropdowns();
      if (willOpen) {
        panel.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(bellBtn, bellPanel);
    });

    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(profileBtn, profilePanel);
    });

    markAllReadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifications.forEach((n) => (n.unread = false));
      renderNotifications();
      showToast('All notifications marked as read');
    });

    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    renderNotifications();
  }

  /* ------------------------------------------------------------------ */
  /* 12. EXPORTS (CSV / PDF)                                              */
  /* ------------------------------------------------------------------ */
  function downloadCSV() {
    const header = ['Date', 'Title', 'Category', 'Amount', 'Type'];
    const rows = transactions.map((tx) => [tx.date, `"${tx.title.replace(/"/g, '""')}"`, tx.category, tx.amount, tx.type]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skypermoney-transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('CSV downloaded');
  }

  function exportPDF() {
    showToast('Opening print dialog for PDF export');
    setTimeout(() => window.print(), 300);
  }

  /* ------------------------------------------------------------------ */
  /* 13. MISC INTERACTIONS (buttons wiring)                               */
  /* ------------------------------------------------------------------ */
  function initMiscInteractions() {
    document.getElementById('addTransactionBtn').addEventListener('click', () => {
      openTransactionModal({ mode: 'add' });
    });

    document.getElementById('addCategoryBtn').addEventListener('click', () => {
      openCategoryModal();
    });

    document.querySelectorAll('.quick-action-btn').forEach((btn) => {
      const label = btn.textContent.trim();
      btn.addEventListener('click', () => {
        if (label === 'Add Income') openTransactionModal({ mode: 'add', presetType: 'income' });
        else if (label === 'Add Expense') openTransactionModal({ mode: 'add', presetType: 'expense' });
        else if (label === 'Export PDF') exportPDF();
        else if (label === 'Download CSV') downloadCSV();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 10. INIT                                                             */
  /* ------------------------------------------------------------------ */
  function safeRun(label, fn) {
    try {
      fn();
    } catch (err) {
      console.error(`SkyperMoney: "${label}" failed —`, err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    safeRun('initTheme', initTheme);
    safeRun('setGreeting', setGreeting);
    safeRun('initMobileNav', initMobileNav);
    safeRun('buildLineChart', buildLineChart);
    safeRun('buildDoughnutChart', buildDoughnutChart);
    safeRun('renderCategoryLegend', renderCategoryLegend);
    safeRun('renderCategoryCards', renderCategoryCards);
    safeRun('renderTransactions', renderTransactions);
    safeRun('renderGoalRing', renderGoalRing);
    safeRun('initModal', initModal);
    safeRun('initDropdowns', initDropdowns);
    safeRun('initMiscInteractions', initMiscInteractions);
  });
})();