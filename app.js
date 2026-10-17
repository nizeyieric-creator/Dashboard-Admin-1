/* ============================================================
   Schools Hub — Admin Dashboard logic (vanilla JS, no deps)
   ============================================================ */
'use strict';

/* ---------------- Sample data ---------------- */
const SCHOOLS = ['St. James College', 'Greenfield Academy', 'Riverdale High', 'Sunrise International', 'Lakeview School'];
const GRADES = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const DEFAULT_DATA = {
    students: [
        { id: 1,  name: 'John Steve Doe',  school: 'St. James College',     grade: 'Grade 10', status: 'Active' },
        { id: 2,  name: 'Amara Chen',      school: 'Greenfield Academy',    grade: 'Grade 9',  status: 'Active' },
        { id: 3,  name: 'Liam Osei',       school: 'Riverdale High',        grade: 'Grade 11', status: 'Pending' },
        { id: 4,  name: 'Sofia Martinez',  school: 'Sunrise International', grade: 'Grade 8',  status: 'Active' },
        { id: 5,  name: 'Noah Kim',        school: 'Lakeview School',       grade: 'Grade 12', status: 'Inactive' },
        { id: 6,  name: 'Priya Nair',      school: 'St. James College',     grade: 'Grade 9',  status: 'Active' },
        { id: 7,  name: 'Emma Wilson',     school: 'Greenfield Academy',    grade: 'Grade 10', status: 'Pending' },
        { id: 8,  name: 'Daniel Abebe',    school: 'Riverdale High',        grade: 'Grade 7',  status: 'Active' },
        { id: 9,  name: 'Mia Nguyen',      school: 'Sunrise International', grade: 'Grade 11', status: 'Active' },
        { id: 10, name: 'Lucas Moreau',    school: 'Lakeview School',       grade: 'Grade 8',  status: 'Pending' },
        { id: 11, name: 'Zara Ahmed',      school: 'St. James College',     grade: 'Grade 12', status: 'Active' },
        { id: 12, name: 'Ethan Brooks',    school: 'Greenfield Academy',    grade: 'Grade 7',  status: 'Inactive' }
    ],
    teachers: [
        { id: 1, name: 'Sarah Johnson',  subject: 'Mathematics',    school: 'St. James College',     classes: 5, students: 148 },
        { id: 2, name: 'David Okafor',   subject: 'Physics',        school: 'Greenfield Academy',    classes: 4, students: 112 },
        { id: 3, name: 'Linda Park',     subject: 'English Lit.',   school: 'Riverdale High',        classes: 6, students: 170 },
        { id: 4, name: 'Omar Haddad',    subject: 'Chemistry',      school: 'Sunrise International', classes: 4, students: 96  },
        { id: 5, name: 'Grace Muthoni',  subject: 'Biology',        school: 'Lakeview School',       classes: 5, students: 130 },
        { id: 6, name: 'James Carter',   subject: 'History',        school: 'St. James College',     classes: 3, students: 88  }
    ],
    payments: [
        { id: 1,  name: 'John Doe',       school: 'St. James College',     amount: 120,  date: '2026-10-15', status: 'Paid' },
        { id: 2,  name: 'Amara Chen',     school: 'Greenfield Academy',    amount: 340,  date: '2026-10-14', status: 'Paid' },
        { id: 3,  name: 'Liam Osei',      school: 'Riverdale High',        amount: 95,   date: '2026-10-14', status: 'Pending' },
        { id: 4,  name: 'Sofia Martinez', school: 'Sunrise International', amount: 210,  date: '2026-10-13', status: 'Paid' },
        { id: 5,  name: 'Noah Kim',       school: 'Lakeview School',       amount: 450,  date: '2026-10-12', status: 'Paid' },
        { id: 6,  name: 'Priya Nair',     school: 'St. James College',     amount: 180,  date: '2026-10-11', status: 'Overdue' },
        { id: 7,  name: 'Emma Wilson',    school: 'Greenfield Academy',    amount: 275,  date: '2026-10-10', status: 'Paid' },
        { id: 8,  name: 'Daniel Abebe',   school: 'Riverdale High',        amount: 130,  date: '2026-10-09', status: 'Paid' },
        { id: 9,  name: 'Mia Nguyen',     school: 'Sunrise International', amount: 320,  date: '2026-10-08', status: 'Pending' },
        { id: 10, name: 'Lucas Moreau',   school: 'Lakeview School',       amount: 260,  date: '2026-10-07', status: 'Paid' }
    ],
    monthlyIncome: [18500, 22100, 19800, 25400, 28900, 26200, 31200, 29800, 33500, 36800, 34200, 35000],
    notifications: [
        { id: 1, text: 'New payment of $450 from Noah Kim',        time: '2 min ago',  unread: true },
        { id: 2, text: '3 students awaiting admission approval',   time: '1 hr ago',   unread: true },
        { id: 3, text: 'Fall term fee reminders sent to 240 parents', time: '5 hr ago', unread: true },
        { id: 4, text: 'Riverdale High updated its term calendar', time: 'Yesterday',  unread: false }
    ]
};

const STORAGE_KEY = 'schoolshub.data.v1';
let state = loadState();
let studentFilter = 'all';
let sortKey = null;
let sortDir = 1;
let nextId = state.students.reduce((m, s) => Math.max(m, s.id), 0) + 1;

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted storage — fall back to defaults */ }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
}

/* ---------------- Tiny helpers ---------------- */
const $ = (sel) => document.querySelector(sel);
const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const money = (n) => '$' + Number(n).toLocaleString();
const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function toast(msg, ok = true) {
    const stack = $('#toastStack');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="t-icon">' + (ok ? '✓' : '!') + '</span>' + esc(msg);
    stack.appendChild(el);
    setTimeout(() => {
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 320);
    }, 2600);
}

/* ---------------- Navigation ---------------- */
function switchView(name) {
    document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== 'view-' + name; });
    document.querySelectorAll('.side-menu .nav-item').forEach((li) => {
        li.classList.toggle('active', li.dataset.view === name);
    });
    closeSidebar();
    if (name === 'dashboard') { renderCards(); renderCharts(); renderRecentPayments(); renderNewStudents(); }
}

document.querySelectorAll('.side-menu .nav-item').forEach((li) => {
    const go = () => switchView(li.dataset.view);
    li.addEventListener('click', go);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => switchView(btn.dataset.goto));
});

/* Sidebar (mobile) */
const sideMenu = $('#sideMenu');
const sidebarOverlay = $('#sidebarOverlay');
const menuToggle = $('#menuToggle');
function closeSidebar() {
    sideMenu.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
    menuToggle.classList.toggle('open');
});
sidebarOverlay.addEventListener('click', closeSidebar);

/* ---------------- Stat cards (animated counters) ---------------- */
const cardDefs = [
    { key: 'students', label: 'Students', icon: 'assets/read.png',   trend: '+12% this term',  chip: 'chip-green' },
    { key: 'teachers', label: 'Teachers', icon: 'assets/teach.png',  trend: '+3 this month',   chip: 'chip-green' },
    { key: 'schools',  label: 'Schools',  icon: 'assets/school.png', trend: 'All campuses',    chip: 'chip-gray' },
    { key: 'income',   label: 'Income',   icon: 'assets/income.png', trend: '+8.2% vs last mo', chip: 'chip-rose' }
];

function statValues() {
    return {
        students: state.students.length,
        teachers: state.teachers.length,
        schools: SCHOOLS.length,
        income: state.monthlyIncome.reduce((s, v) => s + v, 0)
    };
}

function animateCount(el, target, isMoney) {
    const duration = 900;
    const start = performance.now();
    function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.textContent = isMoney ? money(val) : val.toLocaleString();
        if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function renderCards() {
    const vals = statValues();
    $('#statCards').innerHTML = cardDefs.map((c) => `
        <div class="card" data-goto-card="${c.key}" role="button" tabindex="0">
            <div class="box">
                <h1 data-count="${c.key}">0</h1>
                <h3>${c.label}</h3>
                <span class="chip ${c.chip} trend">${c.trend}</span>
            </div>
            <div class="icon-case"><img src="${c.icon}" alt=""></div>
        </div>`).join('');

    cardDefs.forEach((c) => {
        const isMoney = c.key === 'income';
        animateCount($(`[data-count="${c.key}"]`), vals[c.key], isMoney);
    });

    document.querySelectorAll('[data-goto-card]').forEach((card) => {
        const map = { students: 'students', teachers: 'teachers', income: 'income', schools: 'dashboard' };
        const go = () => switchView(map[card.dataset.gotoCard] || 'dashboard');
        card.addEventListener('click', go);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    });
    $('#studentCountBadge').textContent = state.students.length;
}

/* ---------------- SVG charts (hand-rolled, no libraries) ---------------- */
function lineChart(monthly, w = 640, h = 240) {
    const pad = { t: 16, r: 14, b: 28, l: 46 };
    const max = Math.max(...monthly) * 1.1;
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pts = monthly.map((v, i) => [
        pad.l + (i / (monthly.length - 1)) * iw,
        pad.t + ih - (v / max) * ih
    ]);
    const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = path + ` L ${pts[pts.length - 1][0].toFixed(1)} ${pad.t + ih} L ${pad.l} ${pad.t + ih} Z`;
    const gridY = [0, 0.25, 0.5, 0.75, 1].map((f) => pad.t + ih - f * ih);
    const gridLines = gridY.map((y, i) => `
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="var(--border)" stroke-width="1"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--muted)">
            ${(max * i * 0.25 / 1000).toFixed(0)}k
        </text>`).join('');
    const xLabels = months.map((m, i) => `
        <text x="${pts[i][0]}" y="${h - 8}" text-anchor="middle" font-size="10" fill="var(--muted)">${m}</text>`).join('');
    const dots = pts.map((p, i) => `
        <circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="var(--primary)" stroke="var(--card)" stroke-width="2">
            <title>${months[i]}: ${money(monthly[i])}</title>
        </circle>`).join('');

    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly income chart">
        ${gridLines}${xLabels}
        <path d="${area}" fill="var(--primary)" opacity="0.12"/>
        <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        ${dots}
    </svg>`;
}

const DONUT_COLORS = ['#f05462', '#f59e0b', '#2eb87e', '#6c8cff', '#a06ee1'];
function donutChart(counts, w = 200) {
    const total = counts.reduce((s, c) => s + c.value, 0) || 1;
    const r = 70, cx = w / 2, cy = w / 2, stroke = 26;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const segments = counts.map((c, i) => {
        const frac = c.value / total;
        const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke-width="${stroke}"
            stroke-dasharray="${(frac * circ).toFixed(2)} ${circ.toFixed(2)}"
            stroke-dashoffset="${(-offset * circ).toFixed(2)}"
            transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt">
            <title>${esc(c.label)}: ${c.value}</title>
        </circle>`;
        offset += frac;
        return seg;
    }).join('');
    return `<svg viewBox="0 0 ${w} ${w}" role="img" aria-label="Students per school">
        ${segments}
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--heading)">${total}</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="var(--muted)">Students</text>
    </svg>`;
}

function renderCharts() {
    $('#incomeChart').innerHTML = lineChart(state.monthlyIncome, 640, 240);
    $('#incomeChartFull').innerHTML = lineChart(state.monthlyIncome, 900, 320);

    const counts = SCHOOLS.map((s) => ({
        label: s,
        value: state.students.filter((st) => st.school === s).length
    })).filter((c) => c.value > 0);

    $('#schoolChart').innerHTML = donutChart(counts);
    $('#schoolLegend').innerHTML = counts.map((c, i) => `
        <li>
            <span class="swatch" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>
            ${esc(c.label)}
            <span class="val">${c.value}</span>
        </li>`).join('');

    const m = state.monthlyIncome;
    const delta = (((m[m.length - 1] - m[m.length - 2]) / m[m.length - 2]) * 100).toFixed(1);
    $('#incomeDelta').textContent = (delta >= 0 ? '▲ +' : '▼ ') + delta + '% this month';
}

/* ---------------- Tables ---------------- */
function userCell(name, sub) {
    return `<div class="cell-user">
        <img src="assets/user.png" alt="">
        <div class="u-meta"><strong>${esc(name)}</strong><span>${esc(sub)}</span></div>
    </div>`;
}
function statusChip(status) {
    return `<span class="status status-${esc(status)}">${esc(status)}</span>`;
}

function renderRecentPayments() {
    const rows = state.payments.slice(0, 6).map((p) => `
        <tr>
            <td>${userCell(p.name, 'Payment ref #' + p.id)}</td>
            <td>${esc(p.school)}</td>
            <td class="amount">${money(p.amount)}</td>
            <td>${fmtDate(p.date)}</td>
            <td>${statusChip(p.status)}</td>
        </tr>`).join('');
    $('#recentPaymentsTable tbody').innerHTML = rows;
}

function renderPaymentsTable(filter = '') {
    const q = filter.trim().toLowerCase();
    const rows = state.payments
        .filter((p) => !q || p.name.toLowerCase().includes(q) || p.school.toLowerCase().includes(q))
        .map((p) => `
            <tr>
                <td>${userCell(p.name, 'Payment ref #' + p.id)}</td>
                <td>${esc(p.school)}</td>
                <td class="amount">${money(p.amount)}</td>
                <td>${fmtDate(p.date)}</td>
                <td>${statusChip(p.status)}</td>
            </tr>`).join('');
    $('#paymentsTable tbody').innerHTML = rows ||
        '<tr class="empty-row"><td colspan="5">No payments match your search.</td></tr>';
}

function renderStudents(filter = '') {
    const q = filter.trim().toLowerCase();
    let rows = state.students.filter((s) => {
        const matchesQ = !q || s.name.toLowerCase().includes(q) || s.school.toLowerCase().includes(q);
        const matchesF = studentFilter === 'all' || s.status === studentFilter;
        return matchesQ && matchesF;
    });

    if (sortKey) {
        rows = [...rows].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            return (av > bv ? 1 : av < bv ? -1 : 0) * sortDir;
        });
    }

    $('#studentsTable tbody').innerHTML = rows.map((s) => `
        <tr>
            <td>${userCell(s.name, s.grade)}</td>
            <td>${esc(s.school)}</td>
            <td>${esc(s.grade)}</td>
            <td>${statusChip(s.status)}</td>
            <td><div class="row-actions">
                <button title="Cycle status" data-act="status" data-id="${s.id}">⟳</button>
                <button title="Delete student" class="danger" data-act="delete" data-id="${s.id}">✕</button>
            </div></td>
        </tr>`).join('') ||
        '<tr class="empty-row"><td colspan="5">No students found. Try a different search or filter.</td></tr>';

    $('#studentVisibleCount').textContent = `Showing ${rows.length} of ${state.students.length}`;
    $('#studentsSummary').textContent = `${state.students.filter((s) => s.status === 'Active').length} active · ` +
        `${state.students.filter((s) => s.status === 'Pending').length} pending · ` +
        `${state.students.filter((s) => s.status === 'Inactive').length} inactive`;
    $('#studentCountBadge').textContent = state.students.length;
}

document.querySelectorAll('#studentFilters .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('#studentFilters .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        studentFilter = chip.dataset.filter;
        renderStudents($('#globalSearch').value);
    });
});

document.querySelectorAll('#studentsTable th').forEach((th, i) => {
    const keys = ['name', 'school', 'grade', 'status'];
    if (!keys[i]) return;
    th.classList.add('sortable');
    th.innerHTML += ' <span class="sort-arrow">↕</span>';
    th.addEventListener('click', () => {
        if (sortKey === keys[i]) { sortDir *= -1; } else { sortKey = keys[i]; sortDir = 1; }
        document.querySelectorAll('#studentsTable .sort-arrow').forEach((a) => { a.textContent = '↕'; });
        th.querySelector('.sort-arrow').textContent = sortDir === 1 ? '↑' : '↓';
        renderStudents($('#globalSearch').value);
    });
});

$('#studentsTable tbody').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const student = state.students.find((s) => s.id === id);
    if (!student) return;
    if (btn.dataset.act === 'delete') {
        state.students = state.students.filter((s) => s.id !== id);
        saveState();
        renderAll();
        toast(`Removed ${student.name}`);
    } else {
        const order = ['Active', 'Pending', 'Inactive'];
        student.status = order[(order.indexOf(student.status) + 1) % order.length];
        saveState();
        renderAll();
        toast(`${student.name} → ${student.status}`);
    }
});

/* ---------------- Teachers ---------------- */
function renderTeachers(filter = '') {
    const q = filter.trim().toLowerCase();
    const cards = state.teachers
        .filter((t) => !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
        .map((t) => `
            <div class="teacher-card">
                <img src="assets/user.png" alt="">
                <h4>${esc(t.name)}</h4>
                <div class="t-subject">${esc(t.subject)} · ${esc(t.school)}</div>
                <div class="t-stats">
                    <div><strong>${t.classes}</strong>classes</div>
                    <div><strong>${t.students}</strong>students</div>
                </div>
            </div>`).join('');
    $('#teacherGrid').innerHTML = cards ||
        '<p class="muted">No teachers match your search.</p>';
    $('#teachersSummary').textContent = `${state.teachers.length} teachers across ${SCHOOLS.length} schools`;
}

/* ---------------- New students list (dashboard) ---------------- */
function renderNewStudents() {
    const recent = state.students.slice(-5).reverse();
    $('#newStudentsList').innerHTML = recent.map((s, i) => `
        <li>
            <img src="assets/user.png" alt="">
            <div class="ns-meta"><strong>${esc(s.name)}</strong><span>${esc(s.school)} · ${esc(s.grade)}</span></div>
            <span class="ns-when">${i === 0 ? 'Today' : (i * 2 + 1) + ' days ago'}</span>
        </li>`).join('');
}

/* ---------------- Income mini stats ---------------- */
function renderIncomeStats() {
    const paid = state.payments.filter((p) => p.status === 'Paid');
    const total = paid.reduce((s, p) => s + p.amount, 0);
    const pending = state.payments.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
    const overdue = state.payments.filter((p) => p.status === 'Overdue').reduce((s, p) => s + p.amount, 0);
    const yearly = state.monthlyIncome.reduce((s, v) => s + v, 0);
    $('#incomeMiniStats').innerHTML = `
        <div class="mini-stat"><strong>${money(yearly)}</strong><span>Collected this year</span></div>
        <div class="mini-stat"><strong>${money(total)}</strong><span>Sample batch — paid</span></div>
        <div class="mini-stat"><strong>${money(pending)}</strong><span>Pending clearance</span></div>
        <div class="mini-stat"><strong>${money(overdue)}</strong><span>Overdue</span></div>`;
}

/* ---------------- Notifications ---------------- */
function renderNotifications() {
    const unread = state.notifications.filter((n) => n.unread).length;
    $('#notifDot').textContent = unread;
    $('#notifDot').style.display = unread ? 'grid' : 'none';
    $('#notifList').innerHTML = state.notifications.map((n) => `
        <li class="notif-item ${n.unread ? 'unread' : 'read'}" data-id="${n.id}">
            <span class="n-dot"></span>
            <div>${esc(n.text)}<time>${esc(n.time)}</time></div>
        </li>`).join('') || '<li class="dropdown-empty">You’re all caught up 🎉</li>';
}
$('#notifList').addEventListener('click', (e) => {
    const item = e.target.closest('.notif-item[data-id]');
    if (!item) return;
    const n = state.notifications.find((x) => x.id === Number(item.dataset.id));
    if (n) { n.unread = false; renderNotifications(); }
});
$('#clearNotifs').addEventListener('click', () => {
    state.notifications.forEach((n) => { n.unread = false; });
    renderNotifications();
    toast('All notifications marked as read');
});

const notifDropdown = $('#notifDropdown');
$('#notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.hidden = !notifDropdown.hidden;
});
document.addEventListener('click', (e) => {
    if (!notifDropdown.hidden && !e.target.closest('.notif-wrap')) notifDropdown.hidden = true;
});

/* ---------------- Modal (add student) ---------------- */
const backdrop = $('#modalBackdrop');
const studentForm = $('#studentForm');

function populateFormOptions() {
    $('#fSchool').innerHTML = SCHOOLS.map((s) => `<option>${esc(s)}</option>`).join('');
    $('#fGrade').innerHTML = GRADES.map((g) => `<option>${esc(g)}</option>`).join('');
}
function openModal() {
    backdrop.hidden = false;
    studentForm.reset();
    $('#nameError').classList.remove('show');
    $('#fName').classList.remove('invalid');
    setTimeout(() => $('#fName').focus(), 50);
}
function closeModal() { backdrop.hidden = true; }

$('#addNewBtn').addEventListener('click', () => { openModal(); });
$('#addStudentBtn').addEventListener('click', openModal);
$('#modalClose').addEventListener('click', closeModal);
$('#modalCancel').addEventListener('click', closeModal);
backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        notifDropdown.hidden = true;
        closeSidebar();
    }
    if (e.key === '/' && document.activeElement !== $('#globalSearch') &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        $('#globalSearch').focus();
    }
});

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#fName').value.trim();
    if (!name) {
        $('#nameError').classList.add('show');
        $('#fName').classList.add('invalid');
        return;
    }
    state.students.push({
        id: nextId++,
        name,
        school: $('#fSchool').value,
        grade: $('#fGrade').value,
        status: $('#fStatus').value
    });
    saveState();
    closeModal();
    renderAll();
    toast(`Added ${name} ✓`);
});

/* ---------------- Search ---------------- */
$('#globalSearch').addEventListener('input', (e) => {
    const q = e.target.value;
    const active = document.querySelector('.side-menu .nav-item.active').dataset.view;
    if (active === 'students') renderStudents(q);
    else if (active === 'teachers') renderTeachers(q);
    else if (active === 'income') renderPaymentsTable(q);
});

/* ---------------- Theme & settings ---------------- */
function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    $('#themeIcon').textContent = dark ? '☀️' : '🌙';
    $('#darkModeSwitch').checked = dark;
    try { localStorage.setItem('schoolshub.theme', dark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
    renderCharts();
}
const savedTheme = (() => { try { return localStorage.getItem('schoolshub.theme'); } catch (e) { return null; } })();
applyTheme(savedTheme === 'dark');

$('#themeToggle').addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));
$('#darkModeSwitch').addEventListener('change', (e) => applyTheme(e.target.checked));
$('#compactSwitch').addEventListener('change', (e) => {
    document.body.classList.toggle('compact', e.target.checked);
    toast(e.target.checked ? 'Compact tables on' : 'Compact tables off');
});
$('#resetDataBtn').addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    state = JSON.parse(JSON.stringify(DEFAULT_DATA));
    nextId = state.students.reduce((m, s) => Math.max(m, s.id), 0) + 1;
    renderAll();
    toast('Demo data restored');
});

/* ---------------- Help accordion ---------------- */
const FAQS = [
    { q: 'How do I add a new student?', a: 'Click the “+ Add New” button in the header (or the “+ Add Student” button on the Students page), fill in the form, and save. The student appears instantly in all tables and charts, and is stored in your browser.' },
    { q: 'How does the search work?', a: 'The search bar in the header filters whichever section you are currently viewing — students, teachers, or payments. Press the “/” key anywhere to jump to it.' },
    { q: 'Can I sort the students table?', a: 'Yes. Click any column header (Student, School, Grade, Status) to sort by that column. Click again to reverse the order.' },
    { q: 'Where is my data stored?', a: 'This demo keeps everything in your browser’s localStorage, so your changes survive a refresh. Use Settings → Reset to restore the original sample data.' },
    { q: 'Is this dashboard responsive?', a: 'Absolutely. On screens under 940px the sidebar collapses into a slide-in menu — open it with the ☰ button in the header.' }
];
$('#faqAccordion').innerHTML = FAQS.map((f, i) => `
    <div class="acc-item" data-i="${i}">
        <button class="acc-q" aria-expanded="false">${esc(f.q)}<span class="arrow">▾</span></button>
        <div class="acc-a"><p>${esc(f.a)}</p></div>
    </div>`).join('');
$('#faqAccordion').addEventListener('click', (e) => {
    const q = e.target.closest('.acc-q');
    if (!q) return;
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach((it) => {
        it.classList.remove('open');
        it.querySelector('.acc-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
    }
});

/* ---------------- Term select (dashboard) ---------------- */
$('#termSelect').addEventListener('change', (e) => {
    toast(`Showing data for ${e.target.options[e.target.selectedIndex].text}`);
    renderCharts();
});

/* ---------------- Dashboard date ---------------- */
$('#todayDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

/* ---------------- Boot ---------------- */
function renderAll() {
    renderCards();
    renderCharts();
    renderRecentPayments();
    renderNewStudents();
    renderStudents($('#globalSearch').value);
    renderTeachers($('#globalSearch').value);
    renderPaymentsTable($('#globalSearch').value);
    renderIncomeStats();
    renderNotifications();
}

populateFormOptions();
renderAll();
