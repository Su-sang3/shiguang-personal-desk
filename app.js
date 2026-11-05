'use strict';

/* =========================================================
   拾光 · Personal Desk
   A local-first personal workspace. No build step, no backend.
   ========================================================= */

(() => {
  const STORAGE_KEY = 'shiguang.personaldesk.v1';

  const CATEGORY_COLORS = [
    '#557FE8',
    '#F0786F',
    '#63A98C',
    '#D8A049',
    '#8A7ED9',
    '#5AA6C9',
    '#D989A7',
    '#8993A3'
  ];

  const CATEGORY_ICONS = [
    'briefcase',
    'star',
    'home',
    'shoppingBag',
    'heart',
    'book',
    'coffee',
    'sparkles'
  ];

  const PRIORITIES = {
    normal: { label: '普通', className: 'normal' },
    important: { label: '重要', className: 'important' },
    urgent: { label: '紧急', className: 'urgent' }
  };

  const RECURRENCE_TYPES = {
    daily: { label: '每天', hint: '每天自动出现' },
    weekdays: { label: '每个工作日', hint: '每个工作日自动出现' },
    interval: { label: '每隔几天', hint: '按设定的天数间隔出现' },
    weekly: { label: '每周', hint: '每周同一天出现（以开始日期的星期为准）' },
    monthly: { label: '每月', hint: '每月同一天出现（以开始日期的日号为准）' }
  };

  const EXPIRY_TYPES = {
    food: { label: '食品', icon: 'package', color: '#D8A049' },
    daily: { label: '日用 / 护肤', icon: 'sparkles', color: '#63A98C' },
    medicine: { label: '药品', icon: 'pill', color: '#557FE8' },
    coupon: { label: '优惠券', icon: 'ticket', color: '#F0786F' },
    membership: { label: '会员 / 订阅', icon: 'badge', color: '#8A7ED9' },
    other: { label: '其他', icon: 'inbox', color: '#8993A3' }
  };

  const EXPIRY_FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'week', label: '7 天内' },
    { id: 'month', label: '30 天内' },
    { id: 'expired', label: '已过期' }
  ];

  const EXPIRY_SHELF_LIFE_UNITS = {
    days: { label: '天', max: 3650 },
    months: { label: '个月', max: 1200 },
    years: { label: '年', max: 100 }
  };

  const RECURRENCE_HORIZON_DAYS = 180;
  const DEFAULT_CATEGORY_TAGS = {
    工作: ['项目', '会议', '汇报'],
    学习: ['阅读', '课程', '复习'],
    生活: ['健康', '家庭', '整理'],
    购物: ['日常开销', '大额支出', '礼物']
  };

  const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const CALENDAR_WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

  const ICONS = {
    sparkles: `
      <path d="M12 3.2 13.8 8.2 18.8 10 13.8 11.8 12 16.8 10.2 11.8 5.2 10 10.2 8.2 12 3.2Z"/>
      <path d="M18.5 3.5v3M17 5h3M5.5 16v2.4M4.3 17.2h2.4"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    grid: `
      <rect x="3.5" y="3.5" width="7" height="7" rx="2"/>
      <rect x="13.5" y="3.5" width="7" height="7" rx="2"/>
      <rect x="3.5" y="13.5" width="7" height="7" rx="2"/>
      <rect x="13.5" y="13.5" width="7" height="7" rx="2"/>`,
    calendar: `
      <rect x="3.5" y="5" width="17" height="15.5" rx="3"/>
      <path d="M8 3v4M16 3v4M3.5 10h17"/>`,
    calendarDays: `
      <rect x="3.5" y="5" width="17" height="15.5" rx="3"/>
      <path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
    search: `<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.1 4.1"/>`,
    x: `<path d="M6 6l12 12M18 6 6 18"/>`,
    check: `<path d="m5 12.5 4.3 4.3L19 6.5"/>`,
    chevronLeft: `<path d="m14.5 6-6 6 6 6"/>`,
    chevronRight: `<path d="m9.5 6 6 6-6 6"/>`,
    chevronDown: `<path d="m7 9.5 5 5 5-5"/>`,
    clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>`,
    flag: `<path d="M6 21V4"/><path d="M6 4.5h10.5l-2.4 3.7 2.4 3.8H6"/>`,
    pencil: `
      <path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 15.9 4 20Z"/>
      <path d="m13.8 5.4 4.8 4.8"/>`,
    trash: `
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/>`,
    arrowRight: `<path d="M5 12h14M14 7l5 5-5 5"/>`,
    arrowUpRight: `<path d="M7 17 17 7M8 7h9v9"/>`,
    sun: `
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>`,
    moon: `<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>`,
    inbox: `
      <path d="M4.5 5.5h15l1.8 9.1V19h-18.6v-4.4L4.5 5.5Z"/>
      <path d="M2.7 14.6h5l1.5 2.2h5.6l1.5-2.2h5"/>`,
    alert: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.2M12 16.4h.01"/>`,
    info: `<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.6h.01"/>`,
    briefcase: `
      <rect x="3.5" y="7" width="17" height="13" rx="3"/>
      <path d="M9 7V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V7M3.5 11.5h17M10 11.5v2h4v-2"/>`,
    star: `<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>`,
    home: `
      <path d="m3.5 10.5 8.5-7 8.5 7"/>
      <path d="M5.5 9.4V20h13V9.4M9.5 20v-6h5v6"/>`,
    shoppingBag: `
      <path d="M5.5 8h13l1 12h-15l1-12Z"/>
      <path d="M9 8V6a3 3 0 0 1 6 0v2"/>`,
    heart: `<path d="M20.3 5.7a5 5 0 0 0-7.1 0L12 6.9l-1.2-1.2a5 5 0 0 0-7.1 7.1L12 21l8.3-8.2a5 5 0 0 0 0-7.1Z"/>`,
    book: `
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/>
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/>`,
    coffee: `
      <path d="M5 8h12v5.5A5.5 5.5 0 0 1 11.5 19h-1A5.5 5.5 0 0 1 5 13.5V8Z"/>
      <path d="M17 10h1.2A2.8 2.8 0 0 1 18 15.6H17M8 3.5v2M11.5 3.5v2M3 8h16M6 22h10"/>`,
    music: `
      <path d="M9 18V5.5l10-2v12.5"/>
      <circle cx="6.5" cy="18" r="2.5"/>
      <circle cx="16.5" cy="16" r="2.5"/>`,
    palette: `
      <path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-.9 2-1.9 0-.9-.7-1.4-.7-2.3 0-1.1.9-1.8 2-1.8H17a4 4 0 0 0 4-4C21 6.5 17.2 3 12 3Z"/>
      <path d="M7.5 10h.01M9.5 6.8h.01M14 6.3h.01M6.8 14h.01"/>`,
    plane: `<path d="m21 3-7.2 18-3.3-7.5L3 10.2 21 3Z"/><path d="m10.5 13.5 4.3-4.3"/>`,
    dumbbell: `
      <path d="M6.5 8v8M3.5 10v4M17.5 8v8M20.5 10v4M6.5 12h11"/>
      <path d="M4.5 7v2M1.5 11v2M19.5 7v2M22.5 11v2"/>`,
    listChecks: `
      <path d="m3.5 6.5 1.5 1.5 2.5-3M10.5 7h10M3.5 13l1.5 1.5 2.5-3M10.5 13.5h10M3.5 19.5 5 21l2.5-3M10.5 20h10"/>`,
    repeat: `
      <path d="M4 9a5 5 0 0 1 5-5h9"/><path d="m15 1 3 3-3 3"/>
      <path d="M20 15a5 5 0 0 1-5 5H6"/><path d="m9 23-3-3 3-3"/>`,
    hourglass: `
      <path d="M7 3h10M7 21h10"/>
      <path d="M8 3v4.1c0 1.4.7 2.7 1.9 3.4L12 12l2.1-1.5A4.1 4.1 0 0 0 16 7.1V3"/>
      <path d="M8 21v-4.1a4.1 4.1 0 0 1 1.9-3.4L12 12l2.1 1.5a4.1 4.1 0 0 1 1.9 3.4V21"/>`,
    package: `
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/>
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>`,
    ticket: `
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z"/>
      <path d="M14 5v2M14 11v2M14 17v2"/>`,
    badge: `
      <circle cx="12" cy="9" r="5"/>
      <path d="M8.7 13.3 7 21l5-2.7L17 21l-1.7-7.7"/>`,
    pill: `
      <path d="M10.2 3.8a4.5 4.5 0 0 1 6.4 6.4l-6 6a4.5 4.5 0 0 1-6.4-6.4l6-6Z"/>
      <path d="m7.5 12.5 4-4"/>`,
    target: `
      <circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>`
  };

  const ALL_ICONS = [...new Set([...CATEGORY_ICONS, 'briefcase', 'star', 'home', 'shoppingBag', 'heart', 'book', 'coffee', 'sparkles'])];

  /* ----------------------------- Utilities ----------------------------- */

  function icon(name) {
    const paths = ICONS[name] || ICONS.sparkles;
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  function hydrateStaticIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach((el) => {
      if (el.dataset.iconReady === '1') return;
      el.innerHTML = icon(el.dataset.icon);
      el.dataset.iconReady = '1';
    });
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toISO(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseISO(iso) {
    const [year, month, day] = String(iso).split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function isISODate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    const date = parseISO(value);
    return !Number.isNaN(date.getTime()) && toISO(date) === value;
  }

  function normalizeTime(value) {
    const text = String(value || '');
    return /^\d{2}:\d{2}$/.test(text) ? text : '';
  }

  function todayISO() {
    return toISO(new Date());
  }

  function dayNumber(iso) {
    const date = parseISO(iso);
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function diffDays(iso, baseISO = todayISO()) {
    return dayNumber(iso) - dayNumber(baseISO);
  }

  function shiftISO(iso, amount) {
    const date = parseISO(iso);
    date.setDate(date.getDate() + amount);
    return toISO(date);
  }

  function addMonthsClamped(iso, months) {
    const date = parseISO(iso);
    const day = date.getDate();
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(day, lastDay));
    return toISO(target);
  }

  function startOfWeekISO(iso = todayISO()) {
    const date = parseISO(iso);
    const day = (date.getDay() + 6) % 7;
    return shiftISO(iso, -day);
  }

  function weekdayName(iso) {
    return WEEKDAYS[parseISO(iso).getDay()];
  }

  function formatMonthDay(iso) {
    const date = parseISO(iso);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function formatShortNumeric(iso) {
    const date = parseISO(iso);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatWeekRange(startISO) {
    const start = parseISO(startISO);
    const end = parseISO(shiftISO(startISO, 6));
    const startText = `${start.getMonth() + 1}月${start.getDate()}日`;
    const endText = `${end.getMonth() + 1}月${end.getDate()}日`;
    if (start.getFullYear() !== end.getFullYear()) {
      return `${start.getFullYear()}年${startText} — ${end.getFullYear()}年${endText}`;
    }
    return `${startText} — ${endText}`;
  }

  function relativeDate(iso) {
    const diff = diffDays(iso);
    if (diff === 0) return '今天';
    if (diff === 1) return '明天';
    if (diff === 2) return '后天';
    if (diff === -1) return '昨天';
    if (diff === -2) return '前天';
    if (diff > 2 && diff < 7) return weekdayName(iso);
    if (diff < -2 && diff > -7) return weekdayName(iso);
    return formatMonthDay(iso);
  }

  function deadlineDayLabel(iso) {
    const diff = diffDays(iso);
    if (diff === 0) return '今天';
    if (diff === 1) return '明天';
    if (diff === 2) return '后天';
    if (diff === -1) return '昨天';
    if (diff > 2 && diff < 7) return weekdayName(iso);
    if (diff < -2 && diff > -7) return weekdayName(iso);
    const date = parseISO(iso);
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear()) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function greetingInfo() {
    const hour = new Date().getHours();
    if (hour < 6) return { text: '夜深了', icon: 'moon' };
    if (hour < 11) return { text: '早上好', icon: 'sun' };
    if (hour < 14) return { text: '中午好', icon: 'sun' };
    if (hour < 18) return { text: '下午好', icon: 'sun' };
    return { text: '晚上好', icon: 'moon' };
  }

  function safeColor(color) {
    return /^#[0-9a-f]{6}$/i.test(String(color || '')) ? color : '#557FE8';
  }

  function hexToRgb(hex) {
    const normalized = safeColor(hex).slice(1);
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function tint(hex, whiteRatio = 0.9) {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r + (255 - r) * whiteRatio);
    const ng = Math.round(g + (255 - g) * whiteRatio);
    const nb = Math.round(b + (255 - b) * whiteRatio);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  function categoryVars(category) {
    const color = safeColor(category?.color);
    return `--cat:${color};--cat-soft:${tint(color, 0.91)};--cat-line:${tint(color, 0.72)}`;
  }

  function getExpiryType(type) {
    return EXPIRY_TYPES[type] || EXPIRY_TYPES.other;
  }

  function expiryTypeVars(type) {
    const color = safeColor(getExpiryType(type).color);
    return `--cat:${color};--cat-soft:${tint(color, 0.91)};--cat-line:${tint(color, 0.72)};--expiry:${color};--expiry-soft:${tint(color, 0.91)}`;
  }

  function formatExpiryDate(iso) {
    const date = parseISO(iso);
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  }

  function getExpiryInfo(record) {
    const days = diffDays(record.expiryDate);
    if (days < 0) {
      return {
        days,
        key: 'expired',
        className: 'is-expired',
        label: `已过期 ${Math.abs(days)} 天`,
        shortLabel: '已过期'
      };
    }
    if (days === 0) {
      return { days, key: 'today', className: 'is-today', label: '今天到期', shortLabel: '今天' };
    }
    if (days <= 7) {
      return { days, key: 'week', className: 'is-soon', label: `还有 ${days} 天`, shortLabel: `${days} 天` };
    }
    if (days <= 30) {
      return { days, key: 'month', className: 'is-upcoming', label: `还有 ${days} 天`, shortLabel: `${days} 天` };
    }
    return { days, key: 'later', className: 'is-later', label: `还有 ${days} 天`, shortLabel: `${days} 天` };
  }

  function compareExpiryRecords(a, b) {
    return String(a.expiryDate).localeCompare(String(b.expiryDate)) || String(a.title).localeCompare(String(b.title));
  }

  function normalizeShelfLifeUnit(unit) {
    return EXPIRY_SHELF_LIFE_UNITS[unit] ? unit : 'days';
  }

  function getShelfLifeUnit(unit) {
    const key = normalizeShelfLifeUnit(unit);
    return { key, ...EXPIRY_SHELF_LIFE_UNITS[key] };
  }

  function normalizeShelfLifeValue(value, unit = 'days') {
    const amount = Math.trunc(Number(value));
    const meta = EXPIRY_SHELF_LIFE_UNITS[normalizeShelfLifeUnit(unit)];
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return Math.min(amount, meta.max);
  }

  function calculateExpiryDate(productionDate, shelfLifeValue, shelfLifeUnit = 'days') {
    if (!isISODate(productionDate)) return '';
    const unit = normalizeShelfLifeUnit(shelfLifeUnit);
    const amount = normalizeShelfLifeValue(shelfLifeValue, unit);
    if (!amount) return '';
    if (unit === 'days') return shiftISO(productionDate, amount);
    if (unit === 'months') return addMonthsClamped(productionDate, amount);
    if (unit === 'years') return addMonthsClamped(productionDate, amount * 12);
    return '';
  }

  function formatShelfLife(value, unit) {
    const amount = normalizeShelfLifeValue(value, unit);
    if (!amount) return '';
    return `${amount}${EXPIRY_SHELF_LIFE_UNITS[normalizeShelfLifeUnit(unit)].label}`;
  }

  function expiryOriginText(record) {
    if (!record || record.dateMode !== 'calculated' || !isISODate(record.productionDate)) return '';
    const shelfLife = formatShelfLife(record.shelfLifeValue, record.shelfLifeUnit);
    return shelfLife ? `生产 ${formatExpiryDate(record.productionDate)} · 保质期 ${shelfLife}` : '';
  }

  function expiryMatchesQuery(record, query) {
    const type = getExpiryType(record.type);
    const info = getExpiryInfo(record);
    return [
      record.title,
      record.note,
      type.label,
      info.label,
      formatExpiryDate(record.expiryDate),
      formatMonthDay(record.expiryDate),
      expiryOriginText(record)
    ].join(' ').toLowerCase().includes(query);
  }

  function uid(prefix = 'task') {
    const random = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${Date.now().toString(36)}_${random}`;
  }

  function normalizeTags(value, max = 8) {
    const list = Array.isArray(value)
      ? value
      : String(value || '').split(/[,，、\n]/);
    const seen = new Set();
    const tags = [];
    list.forEach((raw) => {
      const tag = String(raw || '').replace(/^#+/, '').trim().slice(0, 12);
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return;
      seen.add(key);
      tags.push(tag);
    });
    return tags.slice(0, max);
  }

  function defaultCategoryTags(name) {
    return [...(DEFAULT_CATEGORY_TAGS[name] || [])];
  }

  function getCategory(categoryId) {
    return data.categories.find((category) => category.id === categoryId) || {
      id: '',
      name: '未分类',
      color: '#8993A3',
      icon: 'inbox',
      tags: []
    };
  }

  function getSeries(seriesId) {
    if (!seriesId) return null;
    return data.series.find((series) => series.id === seriesId) || null;
  }

  function normalizeIntervalDays(value, fallback = 2) {
    const days = Math.trunc(Number(value));
    if (!Number.isFinite(days)) return fallback;
    return Math.max(2, Math.min(365, days));
  }

  function recurrenceLabel(type, intervalDays = 2) {
    if (type === 'interval') return `每${normalizeIntervalDays(intervalDays)}天`;
    return RECURRENCE_TYPES[type]?.label || '循环';
  }

  function seriesRecurrenceLabel(series) {
    return recurrenceLabel(series?.recurrence, series?.intervalDays);
  }

  function taskSeries(task) {
    return task?.seriesId ? getSeries(task.seriesId) : null;
  }

  function tasksForDate(iso) {
    return data.tasks
      .filter((task) => task.date === iso)
      .sort(sortTasksByTime);
  }

  function isOngoingTask(task, iso = todayISO()) {
    return Boolean(
      task &&
      !task.done &&
      task.ddlDate &&
      task.date < iso &&
      task.ddlDate >= iso
    );
  }

  function sortOngoingTasks(a, b) {
    const aDue = `${a.ddlDate} ${a.ddlTime || '23:59'}`;
    const bDue = `${b.ddlDate} ${b.ddlTime || '23:59'}`;
    return aDue.localeCompare(bDue) || a.createdAt.localeCompare(b.createdAt);
  }

  function ongoingTasksForToday() {
    const today = todayISO();
    const hasOccurrenceToday = new Set(
      data.tasks
        .filter((task) => task.seriesId && task.date === today)
        .map((task) => task.seriesId)
    );
    const standalone = [];
    const bySeries = new Map();

    data.tasks.forEach((task) => {
      if (!isOngoingTask(task, today)) return;
      if (!task.seriesId) {
        standalone.push(task);
        return;
      }
      if (hasOccurrenceToday.has(task.seriesId)) return;
      const current = bySeries.get(task.seriesId);
      if (!current || task.date > current.date) bySeries.set(task.seriesId, task);
    });

    return [...standalone, ...bySeries.values()].sort(sortOngoingTasks);
  }

  function agendaTasksForDate(iso) {
    const scheduled = tasksForDate(iso);
    if (iso !== todayISO()) return scheduled;
    return [...scheduled, ...ongoingTasksForToday()];
  }

  function sortTasksByTime(a, b) {
    const aTime = a.startTime || '00:00';
    const bTime = b.startTime || '00:00';
    if (a.done !== b.done) return a.done ? 1 : -1;
    return aTime.localeCompare(bTime) || a.createdAt.localeCompare(b.createdAt);
  }

  function getDueTimestamp(task) {
    if (!task.ddlDate) return Number.POSITIVE_INFINITY;
    const date = parseISO(task.ddlDate);
    const [hour, minute] = (task.ddlTime || '23:59').split(':').map(Number);
    date.setHours(hour || 0, minute || 0, 0, 0);
    return date.getTime();
  }

  function getDeadlineInfo(task) {
    if (!task.ddlDate) return null;
    const dueTs = getDueTimestamp(task);
    const overdue = !task.done && dueTs < Date.now();
    const soon = !task.done && !overdue && dueTs - Date.now() <= 24 * 60 * 60 * 1000;
    return {
      dueTs,
      overdue,
      soon,
      dateLabel: deadlineDayLabel(task.ddlDate),
      dateOnlyLabel: relativeDate(task.ddlDate),
      timeLabel: task.ddlTime || '',
      className: overdue ? 'is-overdue' : soon ? 'is-soon' : ''
    };
  }

  function deadlineText(task) {
    const info = getDeadlineInfo(task);
    if (!info) return '';
    return `${info.dateLabel}${info.timeLabel ? ` ${info.timeLabel}` : ''}`;
  }

  function formatTaskTime(task) {
    if (!task.startTime) return '全天';
    return `${task.startTime}${task.endTime ? ` — ${task.endTime}` : ''}`;
  }

  function pluralCount(count, unit = '项') {
    return `${count} ${unit}`;
  }

  function renderTagChips(tags, max = 2) {
    const list = normalizeTags(tags);
    if (!list.length) return '';
    const visible = list.slice(0, max)
      .map((tag) => `<span class="tag-chip" title="${esc(tag)}">${esc(tag)}</span>`)
      .join('');
    const more = list.length > max
      ? `<span class="tag-chip is-more" title="${esc(list.slice(max).join('、'))}">+${list.length - max}</span>`
      : '';
    return visible + more;
  }

  function taskRepeatBadge(task, labelOverride = '') {
    const series = taskSeries(task);
    if (!series) return '';
    const label = labelOverride || seriesRecurrenceLabel(series);
    return `<span class="repeat-badge" title="循环任务 · ${esc(label)}">${icon('repeat')}<span>${esc(label)}</span></span>`;
  }

  function taskCarriedBadge(task) {
    if (!isISODate(task?.carriedFrom) || task.carriedFrom >= task.date) return '';
    const days = Math.max(1, diffDays(task.date, task.carriedFrom));
    return `<span class="carry-badge" title="原安排 ${esc(formatMonthDay(task.carriedFrom))}，已顺延 ${days} 天">${icon('arrowRight')}<span>顺延自 ${esc(formatMonthDay(task.carriedFrom))}</span></span>`;
  }

  function taskOngoingBadge(task) {
    if (!isOngoingTask(task)) return '';
    return `<span class="ongoing-badge" title="从 ${esc(formatMonthDay(task.date))} 持续到 ${esc(formatMonthDay(task.ddlDate))}">${icon('clock')}<span>始于 ${esc(formatMonthDay(task.date))}</span></span>`;
  }

  function taskMatchesQuery(task, query) {
    const category = getCategory(task.categoryId);
    const series = taskSeries(task);
    const haystack = [
      task.title,
      task.note,
      category.name,
      task.date,
      formatMonthDay(task.date),
      task.ddlDate ? formatMonthDay(task.ddlDate) : '',
      task.carriedFrom ? `顺延 ${formatMonthDay(task.carriedFrom)}` : '',
      PRIORITIES[task.priority]?.label || '',
      normalizeTags(task.tags).join(' '),
      series ? seriesRecurrenceLabel(series) : ''
    ].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  /* ----------------------------- Seed data ----------------------------- */

  function createSeedData() {
    const now = new Date();
    const nowIso = now.toISOString();
    const categories = [
      { id: 'work', name: '工作', color: '#557FE8', icon: 'briefcase', tags: ['项目', '会议', '汇报'] },
      { id: 'study', name: '学习', color: '#8A7ED9', icon: 'book', tags: ['阅读', '课程', '复习'] },
      { id: 'life', name: '生活', color: '#63A98C', icon: 'coffee', tags: ['健康', '家庭', '整理'] },
      { id: 'shopping', name: '购物', color: '#D8A049', icon: 'shoppingBag', tags: ['日常开销', '大额支出', '礼物'] }
    ];

    const make = (id, categoryId, offset, title, options = {}) => ({
      id,
      title,
      categoryId,
      date: shiftISO(todayISO(), offset),
      startTime: options.startTime || '',
      endTime: options.endTime || '',
      ddlDate: options.ddlOffset === undefined ? '' : shiftISO(todayISO(), options.ddlOffset),
      ddlTime: options.ddlTime || '',
      priority: options.priority || 'normal',
      note: options.note || '',
      tags: options.tags || [],
      seriesId: '',
      done: Boolean(options.done),
      createdAt: nowIso,
      completedAt: options.done ? nowIso : ''
    });

    const tasks = [
      make('seed_work_1', 'work', -3, '整理项目进度与本周待办', {
        startTime: '09:30',
        endTime: '10:20',
        ddlOffset: -3,
        ddlTime: '12:00',
        done: true,
        tags: ['项目'],
        note: '把「必须做」和「可以做」分开，给重要的事留出整块时间。'
      }),
      make('seed_study_1', 'study', -2, '读完《深度工作》第三章', {
        startTime: '20:00',
        endTime: '21:00',
        done: true,
        tags: ['阅读'],
        note: '先读一章，记下三个想继续追问的问题。'
      }),
      make('seed_work_2', 'work', -1, '提交本周工作记录', {
        startTime: '17:30',
        endTime: '18:00',
        ddlOffset: -1,
        ddlTime: '18:00',
        done: true,
        tags: ['汇报']
      }),
      make('seed_today_1', 'work', 0, '梳理会议纪要，同步今日重点', {
        startTime: '09:30',
        endTime: '10:15',
        done: true,
        tags: ['会议'],
        note: '把需要跟进的事项整理成三条，发到项目群里。'
      }),
      make('seed_today_2', 'work', 0, '首页改版走查 & 设计对齐', {
        startTime: '14:00',
        endTime: '15:00',
        ddlOffset: 0,
        ddlTime: '18:00',
        priority: 'important',
        tags: ['项目', '会议'],
        note: '重点检查移动端间距、空状态和 loading；把待确认项记进会议纪要。'
      }),
      make('seed_today_3', 'study', 0, '阅读 30 分钟', {
        startTime: '19:00',
        endTime: '19:40',
        tags: ['阅读'],
        note: '把手机放远一点，只读手上的书。'
      }),
      make('seed_today_4', 'life', 0, '夜跑 5 公里 + 拉伸', {
        startTime: '21:00',
        endTime: '21:50',
        tags: ['健康'],
        note: '不追配速，舒服地跑完就好。'
      }),
      make('seed_today_5', 'shopping', 0, '整理本周购物清单', {
        ddlOffset: 0,
        ddlTime: '22:00',
        priority: 'important',
        tags: ['日常开销']
      }),
      make('seed_upcoming_1', 'study', 1, '准备下周分享提纲', {
        startTime: '12:00',
        endTime: '12:30',
        ddlOffset: 1,
        ddlTime: '12:30',
        priority: 'important',
        tags: ['阅读'],
        note: '先列三个要点，再补一个例子。'
      }),
      make('seed_upcoming_2', 'shopping', 1, '给朋友挑生日礼物', {
        ddlOffset: 4,
        ddlTime: '20:00',
        tags: ['大额支出', '礼物'],
        note: '先看看实用的小物，不用太贵。'
      }),
      make('seed_upcoming_3', 'work', 2, '整理季度复盘初稿', {
        startTime: '10:00',
        endTime: '12:00',
        ddlOffset: 2,
        ddlTime: '18:00',
        priority: 'important',
        tags: ['汇报'],
        note: '先搭结构，再补数据；不用一次写到完美。'
      }),
      make('seed_upcoming_4', 'life', 3, '预约年度体检', {
        startTime: '09:30',
        endTime: '10:00',
        tags: ['健康']
      }),
      make('seed_upcoming_5', 'shopping', 4, '补货：咖啡豆和洗衣液', {
        ddlOffset: 4,
        ddlTime: '21:00',
        tags: ['日常开销']
      }),
      make('seed_upcoming_6', 'work', 5, '提交报销单和发票', {
        startTime: '16:00',
        endTime: '17:00',
        ddlOffset: 5,
        ddlTime: '18:00',
        tags: ['项目']
      })
    ];

    const series = [
      {
        id: 'series_seed_water',
        title: '喝水 & 起身活动一下',
        categoryId: 'life',
        tags: ['健康'],
        priority: 'normal',
        note: '离开屏幕，接杯水，顺便活动肩颈。',
        startDate: todayISO(),
        endDate: '',
        startTime: '10:30',
        endTime: '10:35',
        ddlOffset: null,
        ddlTime: '',
        recurrence: 'daily',
        skipDates: [],
        active: true,
        createdAt: nowIso
      }
    ];

    return { version: 4, categories, tasks, series, expiries: [] };
  }

  function normalizeData(raw) {
    if (!raw || !Array.isArray(raw.categories) || !raw.categories.length) return null;

    const usedIds = new Set();
    const categories = raw.categories
      .filter((category) => category && String(category.name || '').trim())
      .map((category, index) => {
        let id = String(category.id || `category_${index}`);
        if (!id || usedIds.has(id)) id = uid('category');
        usedIds.add(id);
        const name = String(category.name).trim().slice(0, 10);
        return {
          id,
          name,
          color: CATEGORY_COLORS.includes(category.color) ? category.color : CATEGORY_COLORS[index % CATEGORY_COLORS.length],
          icon: CATEGORY_ICONS.includes(category.icon) ? category.icon : 'sparkles',
          tags: Array.isArray(category.tags)
            ? normalizeTags(category.tags, 12)
            : defaultCategoryTags(name)
        };
      });

    if (!categories.length) return null;
    const categoryIds = new Set(categories.map((category) => category.id));

    const seriesIds = new Set();
    const series = (Array.isArray(raw.series) ? raw.series : [])
      .filter((item) => item && String(item.title || '').trim() && isISODate(item.startDate) && RECURRENCE_TYPES[item.recurrence])
      .map((item, index) => {
        let id = String(item.id || `series_${index}`);
        if (!id || seriesIds.has(id)) id = uid('series');
        seriesIds.add(id);
        const categoryId = categoryIds.has(item.categoryId) ? item.categoryId : categories[0].id;
        const startDate = item.startDate;
        const endDate = isISODate(item.endDate) && item.endDate >= startDate ? item.endDate : '';
        let ddlOffset = null;
        if (item.ddlOffset !== null && item.ddlOffset !== undefined && item.ddlOffset !== '' && Number.isFinite(Number(item.ddlOffset))) {
          ddlOffset = Math.max(-3650, Math.min(3650, Math.trunc(Number(item.ddlOffset))));
        } else if (isISODate(item.ddlDate)) {
          ddlOffset = diffDays(item.ddlDate, startDate);
        }
        return {
          id,
          title: String(item.title).trim().slice(0, 80),
          categoryId,
          tags: normalizeTags(item.tags),
          priority: PRIORITIES[item.priority] ? item.priority : 'normal',
          note: String(item.note || '').slice(0, 300),
          startDate,
          endDate,
          startTime: normalizeTime(item.startTime),
          endTime: normalizeTime(item.endTime),
          ddlOffset,
          ddlTime: ddlOffset === null ? '' : normalizeTime(item.ddlTime),
          recurrence: item.recurrence,
          intervalDays: normalizeIntervalDays(item.intervalDays),
          skipDates: [...new Set((Array.isArray(item.skipDates) ? item.skipDates : []).filter(isISODate))],
          active: item.active !== false,
          createdAt: item.createdAt || new Date().toISOString()
        };
      });

    const tasks = (Array.isArray(raw.tasks) ? raw.tasks : [])
      .filter((task) => task && String(task.title || '').trim() && isISODate(task.date))
      .map((task) => {
        const categoryId = categoryIds.has(task.categoryId) ? task.categoryId : categories[0].id;
        const done = Boolean(task.done);
        const seriesId = seriesIds.has(task.seriesId) ? task.seriesId : '';
        const carriedFrom = !seriesId && isISODate(task.carriedFrom) && task.carriedFrom < task.date
          ? task.carriedFrom
          : '';
        return {
          id: String(task.id || uid()),
          title: String(task.title).trim().slice(0, 80),
          categoryId,
          date: task.date,
          startTime: normalizeTime(task.startTime),
          endTime: normalizeTime(task.endTime),
          ddlDate: isISODate(task.ddlDate) ? task.ddlDate : '',
          ddlTime: normalizeTime(task.ddlTime),
          priority: PRIORITIES[task.priority] ? task.priority : 'normal',
          note: String(task.note || '').slice(0, 300),
          tags: normalizeTags(task.tags),
          seriesId,
          carriedFrom,
          done,
          createdAt: task.createdAt || new Date().toISOString(),
          completedAt: done ? (task.completedAt || new Date().toISOString()) : ''
        };
      });

    const expiryIds = new Set();
    const expiries = (Array.isArray(raw.expiries) ? raw.expiries : [])
      .filter((item) => item && String(item.title || '').trim() && isISODate(item.expiryDate))
      .map((item, index) => {
        let id = String(item.id || `expiry_${index}`);
        if (!id || expiryIds.has(id)) id = uid('expiry');
        expiryIds.add(id);

        const shelfLifeUnit = normalizeShelfLifeUnit(item.shelfLifeUnit);
        const shelfLifeValue = normalizeShelfLifeValue(item.shelfLifeValue, shelfLifeUnit);
        const productionDate = isISODate(item.productionDate) ? item.productionDate : '';
        const calculatedExpiry = item.dateMode === 'calculated'
          ? calculateExpiryDate(productionDate, shelfLifeValue, shelfLifeUnit)
          : '';
        const calculated = Boolean(calculatedExpiry);

        return {
          id,
          title: String(item.title).trim().slice(0, 80),
          type: EXPIRY_TYPES[item.type] ? item.type : 'other',
          expiryDate: calculated ? calculatedExpiry : item.expiryDate,
          dateMode: calculated ? 'calculated' : 'manual',
          productionDate: calculated ? productionDate : '',
          shelfLifeValue: calculated ? shelfLifeValue : null,
          shelfLifeUnit: calculated ? shelfLifeUnit : 'days',
          note: String(item.note || '').slice(0, 300),
          createdAt: item.createdAt || new Date().toISOString()
        };
      });

    return { version: 4, categories, tasks, series, expiries };
  }

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const normalized = normalizeData(parsed);
        if (normalized) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch (error) {
            console.warn('无法迁移本地数据。', error);
          }
          return normalized;
        }
      }
    } catch (error) {
      console.warn('读取本地数据失败，将使用示例数据。', error);
    }
    const seeded = createSeedData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch (error) {
      console.warn('无法写入本地数据。', error);
    }
    return seeded;
  }

  let data = loadData();

  /* ----------------------------- Recurring series ----------------------------- */

  function seriesMatchesDate(series, iso) {
    if (!series || !isISODate(iso) || iso < series.startDate) return false;
    if (series.endDate && iso > series.endDate) return false;
    const offset = diffDays(iso, series.startDate);
    if (series.recurrence === 'daily') return true;
    if (series.recurrence === 'weekdays') {
      const day = parseISO(iso).getDay();
      return day >= 1 && day <= 5;
    }
    if (series.recurrence === 'interval') {
      return offset % normalizeIntervalDays(series.intervalDays) === 0;
    }
    if (series.recurrence === 'weekly') return offset % 7 === 0;
    if (series.recurrence === 'monthly') {
      return parseISO(iso).getDate() === parseISO(series.startDate).getDate();
    }
    return false;
  }

  function buildSeriesOccurrence(series, iso) {
    const hasDdl = series.ddlOffset !== null && series.ddlOffset !== undefined;
    return {
      id: `rec_${series.id}_${iso}`,
      seriesId: series.id,
      title: series.title,
      categoryId: series.categoryId,
      date: iso,
      startTime: series.startTime,
      endTime: series.endTime,
      ddlDate: hasDdl ? shiftISO(iso, series.ddlOffset) : '',
      ddlTime: hasDdl ? series.ddlTime : '',
      priority: series.priority,
      note: series.note,
      tags: [...normalizeTags(series.tags)],
      done: false,
      createdAt: new Date().toISOString(),
      completedAt: ''
    };
  }

  function ensureRecurringTasks(horizonDays = RECURRENCE_HORIZON_DAYS) {
    if (!data.series.length) return 0;
    const today = todayISO();
    const windowStart = shiftISO(today, -31);
    const horizon = shiftISO(today, Math.max(7, horizonDays));
    const existing = new Set();
    data.tasks.forEach((task) => {
      if (task.seriesId) existing.add(`${task.seriesId}|${task.date}`);
    });

    const additions = [];
    data.series.forEach((series) => {
      if (series.active === false) return;
      const from = series.startDate > windowStart ? series.startDate : windowStart;
      const end = series.endDate && series.endDate < horizon ? series.endDate : horizon;
      if (from > end) return;
      const skipped = new Set(series.skipDates || []);
      let cursor = from;
      let guard = 0;
      while (cursor <= end && guard < 800) {
        const key = `${series.id}|${cursor}`;
        if (!skipped.has(cursor) && seriesMatchesDate(series, cursor) && !existing.has(key)) {
          additions.push(buildSeriesOccurrence(series, cursor));
          existing.add(key);
        }
        cursor = shiftISO(cursor, 1);
        guard += 1;
      }
    });

    if (additions.length) data.tasks.push(...additions);
    return additions.length;
  }

  function carryOverUnfinishedTasks(baseDate = todayISO()) {
    let moved = 0;
    data.tasks.forEach((task) => {
      if (task.done || task.seriesId || task.ddlDate) return;
      if (!isISODate(task.date) || task.date >= baseDate) return;
      if (!isISODate(task.carriedFrom) || task.carriedFrom > task.date) {
        task.carriedFrom = task.date;
      }
      task.date = baseDate;
      moved += 1;
    });
    return moved;
  }

  /* ----------------------------- UI state ----------------------------- */

  const ui = {
    view: 'overview',
    categoryId: null,
    selectedDate: todayISO(),
    agendaFilter: 'all',
    weekAnchor: startOfWeekISO(),
    calendarCursor: (() => {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), 1);
    })(),
    categoryFilter: 'all',
    weekFilter: 'all',
    tagFilter: 'all',
    expiryFilter: 'all'
  };

  const dom = {
    viewRoot: document.getElementById('viewRoot'),
    categoryNav: document.getElementById('categoryNav'),
    categoryCount: document.getElementById('categoryCount'),
    expiryNavBadge: document.getElementById('expiryNavBadge'),
    topbarCrumb: document.getElementById('topbarCrumb'),
    topbarDate: document.getElementById('topbarDate'),
    menuBtn: document.getElementById('menuBtn'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    searchWrap: document.getElementById('searchWrap'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    taskDialog: document.getElementById('taskDialog'),
    taskForm: document.getElementById('taskForm'),
    taskDialogTitle: document.getElementById('taskDialogTitle'),
    taskDialogKicker: document.getElementById('taskDialogKicker'),
    taskId: document.getElementById('taskId'),
    taskTitle: document.getElementById('taskTitle'),
    taskDate: document.getElementById('taskDate'),
    taskStartTime: document.getElementById('taskStartTime'),
    taskEndTime: document.getElementById('taskEndTime'),
    taskDdlDate: document.getElementById('taskDdlDate'),
    taskDdlTime: document.getElementById('taskDdlTime'),
    taskNote: document.getElementById('taskNote'),
    taskCategoryChoices: document.getElementById('taskCategoryChoices'),
    taskTagChoices: document.getElementById('taskTagChoices'),
    taskTagInput: document.getElementById('taskTagInput'),
    addTaskTagBtn: document.getElementById('addTaskTagBtn'),
    taskDateLabel: document.getElementById('taskDateLabel'),
    taskSeriesNote: document.getElementById('taskSeriesNote'),
    taskCarryNote: document.getElementById('taskCarryNote'),
    taskRepeat: document.getElementById('taskRepeat'),
    taskRepeatUntil: document.getElementById('taskRepeatUntil'),
    taskIntervalField: document.getElementById('taskIntervalField'),
    taskIntervalDays: document.getElementById('taskIntervalDays'),
    repeatHint: document.getElementById('repeatHint'),
    taskFormError: document.getElementById('taskFormError'),
    deleteTaskBtn: document.getElementById('deleteTaskBtn'),
    categoryDialog: document.getElementById('categoryDialog'),
    categoryForm: document.getElementById('categoryForm'),
    categoryDialogTitle: document.getElementById('categoryDialogTitle'),
    categoryDialogKicker: document.getElementById('categoryDialogKicker'),
    categoryId: document.getElementById('categoryId'),
    categoryName: document.getElementById('categoryName'),
    categoryTags: document.getElementById('categoryTags'),
    categoryFormError: document.getElementById('categoryFormError'),
    categoryPreview: document.getElementById('categoryPreview'),
    categoryPreviewIcon: document.getElementById('categoryPreviewIcon'),
    categoryPreviewName: document.getElementById('categoryPreviewName'),
    categoryIconChoices: document.getElementById('categoryIconChoices'),
    categoryColorChoices: document.getElementById('categoryColorChoices'),
    deleteCategoryBtn: document.getElementById('deleteCategoryBtn'),
    expiryDialog: document.getElementById('expiryDialog'),
    expiryForm: document.getElementById('expiryForm'),
    expiryDialogTitle: document.getElementById('expiryDialogTitle'),
    expiryDialogKicker: document.getElementById('expiryDialogKicker'),
    expiryId: document.getElementById('expiryId'),
    expiryTitle: document.getElementById('expiryTitle'),
    expiryTypeChoices: document.getElementById('expiryTypeChoices'),
    expiryManualFields: document.getElementById('expiryManualFields'),
    expiryCalculatedFields: document.getElementById('expiryCalculatedFields'),
    expiryDate: document.getElementById('expiryDate'),
    expiryProductionDate: document.getElementById('expiryProductionDate'),
    expiryShelfLifeValue: document.getElementById('expiryShelfLifeValue'),
    expiryShelfLifeUnit: document.getElementById('expiryShelfLifeUnit'),
    expiryCalcPreview: document.getElementById('expiryCalcPreview'),
    expiryCalcDate: document.getElementById('expiryCalcDate'),
    expiryCalcHint: document.getElementById('expiryCalcHint'),
    expiryNote: document.getElementById('expiryNote'),
    expiryFormError: document.getElementById('expiryFormError'),
    deleteExpiryBtn: document.getElementById('deleteExpiryBtn'),
    confirmDialog: document.getElementById('confirmDialog'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmButton: document.getElementById('confirmButton'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmSecondary: document.getElementById('confirmSecondary'),
    confirmIcon: document.getElementById('confirmIcon'),
    assistantFab: document.getElementById('assistantFab'),
    assistantDialog: document.getElementById('assistantDialog'),
    assistantForm: document.getElementById('assistantForm'),
    assistantInput: document.getElementById('assistantInput'),
    assistantMessages: document.getElementById('assistantMessages'),
    assistantSuggestions: document.getElementById('assistantSuggestions'),
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
  };

  let confirmAction = null;
  let confirmSecondaryAction = null;
  let toastTimer = null;
  let searchTimer = null;
  let taskTagSelection = new Set();
  let taskTagExtras = [];
  let assistantStarted = false;
  let assistantLastCategoryId = '';

  /* ----------------------------- Sidebar / topbar ----------------------------- */

  function renderSidebar() {
    const pendingCounts = new Map();
    const countedSeries = new Set();
    data.tasks.forEach((task) => {
      if (task.done) return;
      if (task.seriesId) {
        if (countedSeries.has(task.seriesId)) return;
        countedSeries.add(task.seriesId);
      }
      pendingCounts.set(task.categoryId, (pendingCounts.get(task.categoryId) || 0) + 1);
    });

    dom.categoryCount.textContent = String(data.categories.length);
    dom.categoryNav.innerHTML = data.categories.map((category) => {
      const isActive = ui.view === 'category' && ui.categoryId === category.id;
      const pending = pendingCounts.get(category.id) || 0;
      return `
        <button class="category-nav-item${isActive ? ' is-active' : ''}" style="${categoryVars(category)}" data-category-nav="${esc(category.id)}" type="button" aria-current="${isActive ? 'page' : 'false'}">
          <span class="cat-icon">${icon(category.icon)}</span>
          <span class="cat-name">${esc(category.name)}</span>
          <span class="cat-count">${pending > 99 ? '99+' : pending}</span>
        </button>`;
    }).join('');

    const urgentExpiryCount = (data.expiries || []).filter((item) => getExpiryInfo(item).days <= 7).length;
    if (dom.expiryNavBadge) {
      dom.expiryNavBadge.hidden = urgentExpiryCount === 0;
      dom.expiryNavBadge.textContent = urgentExpiryCount > 99 ? '99+' : String(urgentExpiryCount);
    }

    document.querySelectorAll('[data-view]').forEach((button) => {
      const active = button.dataset.view === ui.view;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function renderTopbar() {
    const category = ui.view === 'category' ? getCategory(ui.categoryId) : null;
    const crumb = ui.view === 'week'
      ? '本周时间线'
      : ui.view === 'expiry'
        ? '期限记录'
        : ui.view === 'category'
          ? category.name
          : '总览';
    const now = new Date();

    dom.topbarCrumb.textContent = crumb;
    dom.topbarDate.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${WEEKDAYS[now.getDay()]}`;
    document.title = `${crumb} · 拾光`;
  }

  function render() {
    renderSidebar();
    renderTopbar();
    closeSearch();

    if (ui.view === 'week') {
      dom.viewRoot.innerHTML = renderWeekView();
    } else if (ui.view === 'expiry') {
      dom.viewRoot.innerHTML = renderExpiryView();
    } else if (ui.view === 'category') {
      dom.viewRoot.innerHTML = renderCategoryView();
    } else {
      dom.viewRoot.innerHTML = renderOverview();
    }

    dom.viewRoot.querySelector('.view')?.classList.add('view-animate');
    if (ui.view === 'overview') {
      const selected = parseISO(ui.selectedDate);
      ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
  }

  function renderOverview() {
    return `
      <section class="view overview-page" aria-label="总览">
        ${renderHero()}
        <div class="overview-layout">
          <div class="overview-main">
            ${renderAgenda()}
          </div>
          <aside class="overview-rail" aria-label="日程辅助信息">
            ${renderMiniCalendar()}
            ${renderDeadlineRail()}
            ${renderExpiryRail()}
            ${renderWeekRhythm()}
          </aside>
        </div>
      </section>`;
  }

  /* ----------------------------- Hero ----------------------------- */

  function renderHero() {
    const today = todayISO();
    const scheduledTasks = tasksForDate(today);
    const ongoingNow = ongoingTasksForToday();
    const tasks = [...scheduledTasks, ...ongoingNow];
    const openScheduledTasks = scheduledTasks.filter((task) => !task.done);
    const openTasks = [...openScheduledTasks, ...ongoingNow];
    const doneTasks = scheduledTasks.filter((task) => task.done);
    const dueToday = openTasks.filter((task) => task.ddlDate === today).length;
    const greeting = greetingInfo();
    const nextTask = chooseNextTask(openScheduledTasks) || ongoingNow[0] || null;
    const nextOngoing = Boolean(nextTask && ongoingNow.some((task) => task.id === nextTask.id));
    const now = new Date();
    const progress = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
    const category = nextTask ? getCategory(nextTask.categoryId) : null;

    let summary = '';
    if (!tasks.length) {
      summary = '今天还没有安排，给自己留一点空白，或者写下一件想做的事。';
    } else if (!openTasks.length) {
      summary = '今天的事项都完成了。剩下的时间，去散步、听歌，做点喜欢的事吧。';
    } else if (nextTask) {
      summary = nextOngoing
        ? `今天还有 <strong>${openTasks.length} 件待办</strong>，其中 <strong>${esc(trimText(nextTask.title, 18))}</strong> 仍在进行中。按自己的节奏收尾就好。`
        : `今天还有 <strong>${openTasks.length} 件待办</strong>，接下来是 <strong>${esc(trimText(nextTask.title, 18))}</strong>。不用赶，按自己的节奏来。`;
    }

    let nextPanel = '';
    if (nextTask) {
      nextPanel = `
        <div class="hero-next-top">
          <span class="hero-next-label">${nextOngoing ? 'IN PROGRESS · 进行中' : 'NEXT UP · 接下来'}</span>
          <span class="hero-next-fraction"><b>${doneTasks.length}</b> / ${tasks.length}</span>
        </div>
        <div class="hero-next-time">${esc(nextOngoing ? '进行中' : nextTask.startTime || '全天')}</div>
        <h2 class="hero-next-title">${esc(nextTask.title)}</h2>
        <div class="hero-next-meta">
          <span class="category-tag" style="${categoryVars(category)}"><span class="dot"></span>${esc(category.name)}</span>
          ${nextOngoing ? taskOngoingBadge(nextTask) : taskCarriedBadge(nextTask)}
          ${taskRepeatBadge(nextTask)}
          <span class="next-hint">${nextOngoing ? `截止 ${esc(formatMonthDay(nextTask.ddlDate))}` : `${esc(relativeDate(nextTask.date))}${nextTask.startTime && nextTask.endTime ? ` · ${esc(nextTask.startTime)}—${esc(nextTask.endTime)}` : ''}`}</span>
        </div>
        <div class="hero-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="今日完成度 ${progress}%"><span style="width:${progress}%"></span></div>`;
    } else if (tasks.length) {
      nextPanel = `
        <div class="hero-next-top">
          <span class="hero-next-label">ALL DONE · 今日完成</span>
          <span class="hero-next-fraction"><b>${tasks.length}</b> / ${tasks.length}</span>
        </div>
        <div class="hero-next-icon">${icon('check')}</div>
        <div class="hero-next-time is-empty">今天的安排都完成啦</div>
        <h2 class="hero-next-title">留一点时间给自己，慢慢收尾。</h2>
        <div class="hero-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-label="今日待办已全部完成"><span style="width:100%"></span></div>`;
    } else {
      nextPanel = `
        <div class="hero-next-top">
          <span class="hero-next-label">A LITTLE SPACE · 留白</span>
          <span class="hero-next-fraction"><b>0</b> / 0</span>
        </div>
        <div class="hero-next-icon">${icon('sun')}</div>
        <div class="hero-next-time is-empty">今天是一张空白画布</div>
        <h2 class="hero-next-title">添加一件小小的事，让今天有一个轻盈的开始。</h2>
        <div class="hero-progress"><span style="width:3%"></span></div>`;
    }

    return `
      <section class="hero" aria-label="今日概览">
        <div class="hero-ornament" aria-hidden="true">${icon('sparkles')}</div>
        <div class="hero-copy">
          <div class="hero-eyebrow">
            <span class="hero-sun">${icon(greeting.icon)}</span>
            <span>${WEEKDAYS[now.getDay()]} · ${now.getMonth() + 1}月${now.getDate()}日</span>
            <span class="eyebrow-dot"></span>
            <span>${greeting.text}</span>
          </div>
          <h1 class="hero-title">${greeting.text}，<br><em>把今天过得刚刚好。</em></h1>
          <p class="hero-subtitle">${summary}</p>
          <div class="hero-stats">
            <span class="hero-stat is-accent"><strong>${openTasks.length}</strong>待完成</span>
            <span class="hero-stat is-done"><strong>${doneTasks.length}/${tasks.length}</strong>已完成</span>
            ${dueToday ? `<span class="hero-stat"><strong>${dueToday}</strong>今日截止</span>` : ''}
          </div>
        </div>
        <aside class="hero-next${tasks.length && !openTasks.length ? ' is-finished' : ''}" aria-label="接下来">
          ${nextPanel}
        </aside>
      </section>`;
  }

  function trimText(text, maxLength) {
    const value = String(text || '');
    return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
  }

  function chooseNextTask(openTasks) {
    if (!openTasks.length) return null;
    const now = new Date();
    const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const upcomingTimed = openTasks
      .filter((task) => task.startTime && task.startTime >= nowTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (upcomingTimed.length) return upcomingTimed[0];
    return openTasks.find((task) => !task.startTime) || openTasks[0];
  }

  /* ----------------------------- Agenda ----------------------------- */

  function renderAgenda() {
    const today = todayISO();
    const scheduledTasks = tasksForDate(ui.selectedDate);
    const ongoingNow = ui.selectedDate === today ? ongoingTasksForToday() : [];
    const allTasks = [...scheduledTasks, ...ongoingNow];
    if (ui.agendaFilter !== 'all' && !data.categories.some((category) => category.id === ui.agendaFilter)) {
      ui.agendaFilter = 'all';
    }
    const activeFilter = ui.agendaFilter;
    const activeCategory = activeFilter === 'all' ? null : getCategory(activeFilter);
    const tasks = activeFilter === 'all'
      ? allTasks
      : allTasks.filter((task) => task.categoryId === activeFilter);
    const ongoingIds = new Set(ongoingNow.map((task) => task.id));
    const openTasks = tasks.filter((task) => !task.done);
    const doneTasks = tasks.filter((task) => task.done);
    const scheduledVisibleTasks = tasks.filter((task) => !ongoingIds.has(task.id));
    const scheduledOpenTasks = openTasks.filter((task) => !ongoingIds.has(task.id));
    const ongoingVisibleTasks = openTasks.filter((task) => ongoingIds.has(task.id));
    const isToday = ui.selectedDate === today;
    const heading = isToday ? '今日日程' : `${formatMonthDay(ui.selectedDate)} · ${weekdayName(ui.selectedDate)}`;
    const description = tasks.length
      ? `已安排 ${scheduledVisibleTasks.length} 项${ongoingVisibleTasks.length ? ` · 进行中 ${ongoingVisibleTasks.length} 项` : ''} · 完成 ${doneTasks.length} 项`
      : '给这一天留一点呼吸的空间';
    const newTaskCategory = activeFilter === 'all' ? '' : activeFilter;

    const filterCounts = data.categories
      .map((category) => ({
        category,
        count: allTasks.filter((task) => task.categoryId === category.id).length
      }))
      .filter((item) => item.count > 0);
    if (activeCategory && !filterCounts.some((item) => item.category.id === activeCategory.id)) {
      filterCounts.push({ category: activeCategory, count: 0 });
    }
    const filterHTML = allTasks.length ? `
      <div class="agenda-filter-row" role="group" aria-label="按分类筛选日程">
        <span class="agenda-filter-label">分类</span>
        <div class="filter-chips">
          <button class="filter-chip${activeFilter === 'all' ? ' is-active' : ''}" type="button" aria-pressed="${activeFilter === 'all'}" data-action="set-agenda-filter" data-filter="all">
            全部 <span class="filter-number">${allTasks.length}</span>
          </button>
          ${filterCounts.map(({ category, count }) => `
            <button class="filter-chip${activeFilter === category.id ? ' is-active' : ''}" type="button" aria-pressed="${activeFilter === category.id}" data-action="set-agenda-filter" data-filter="${esc(category.id)}" style="${categoryVars(category)}">
              <span class="filter-dot"></span>${esc(category.name)} <span class="filter-number">${count}</span>
            </button>`).join('')}
        </div>
      </div>` : '';

    const scheduledCards = scheduledOpenTasks.map((task) => renderAgendaCard(task)).join('');
    const ongoingCards = ongoingVisibleTasks.map((task) => renderAgendaCard(task, { ongoing: true })).join('');
    const doneCards = doneTasks.map((task) => renderAgendaCard(task)).join('');

    let body = '';
    if (!tasks.length) {
      const filteredEmpty = activeCategory && allTasks.length;
      body = `
        <div class="empty-card">
          <div class="empty-art">${icon(filteredEmpty ? activeCategory.icon : 'calendarDays')}</div>
          <h3 class="empty-title">${filteredEmpty ? `这一天没有「${esc(activeCategory.name)}」的安排` : '这一天还是空白'}</h3>
          <p class="empty-copy">${filteredEmpty ? `其他分类还有 ${allTasks.length} 项安排，取消分类筛选就能看到。` : '没有安排也没关系。写下第一件想做的事，给今天一个小小的锚点。'}</p>
          ${filteredEmpty
            ? `<button class="btn btn-secondary" type="button" data-action="set-agenda-filter" data-filter="all">查看全部分类</button>`
            : `<button class="btn btn-primary" type="button" data-action="new-task" data-category-id="${esc(newTaskCategory)}" data-date="${esc(ui.selectedDate)}">${icon('plus')}添加事项</button>`}
        </div>`;
    } else {
      body = `
        <div class="agenda-list">
          ${scheduledCards}
          ${ongoingVisibleTasks.length ? `<div class="agenda-group-label is-ongoing"><span>${icon('clock')} 进行中</span><span>${ongoingVisibleTasks.length}</span></div>${ongoingCards}` : ''}
          ${doneTasks.length ? `<div class="agenda-group-label"><span>${icon('check')} 已完成</span><span>${doneTasks.length}</span></div>${doneCards}` : ''}
        </div>`;
    }

    return `
      <section class="agenda" aria-label="${esc(heading)}">
        <header class="section-heading">
          <div>
            <p class="eyebrow">DAILY AGENDA</p>
            <div class="heading-line">
              <h2>${esc(heading)}</h2>
              <span class="count-pill">${openTasks.length} 待办</span>
            </div>
            <p class="section-desc">
              ${esc(description)}
              ${!isToday ? `<button class="text-btn back-today" type="button" data-action="today-date">回到今天</button>` : ''}
            </p>
          </div>
          <div class="agenda-controls">
            <div class="date-stepper" aria-label="切换日期">
              <button class="icon-btn" type="button" data-action="prev-date" aria-label="前一天">${icon('chevronLeft')}</button>
              <div class="date-stepper-label">
                <strong>${formatMonthDay(ui.selectedDate)}</strong>
                <span>${isToday ? '今天' : weekdayName(ui.selectedDate)}</span>
              </div>
              <button class="icon-btn" type="button" data-action="next-date" aria-label="后一天">${icon('chevronRight')}</button>
            </div>
          </div>
        </header>
        ${filterHTML}
        ${body}
        ${tasks.length ? `<button class="agenda-add" type="button" data-action="new-task" data-category-id="${esc(newTaskCategory)}" data-date="${esc(ui.selectedDate)}">${icon('plus')}在这一天添加事项</button>` : ''}
      </section>`;
  }

  function renderAgendaCard(task, options = {}) {
    const isOngoing = Boolean(options.ongoing);
    const category = getCategory(task.categoryId);
    const priority = PRIORITIES[task.priority] || PRIORITIES.normal;
    const deadline = getDeadlineInfo(task);
    const timeHTML = isOngoing
      ? `<strong>进行中</strong><span>至 ${esc(formatShortNumeric(task.ddlDate))}</span>`
      : task.startTime
        ? `<strong>${esc(task.startTime)}</strong>${task.endTime ? `<span>${esc(task.endTime)}</span>` : '<span>&nbsp;</span>'}`
        : '<strong>全天</strong><span></span>';
    const timeClass = isOngoing ? ' is-ongoing' : task.startTime ? '' : ' is-all-day';

    return `
      <article class="agenda-card${task.done ? ' is-done' : ''}${isOngoing ? ' is-ongoing' : ''}" style="${categoryVars(category)}">
        <div class="agenda-time${timeClass}">${timeHTML}</div>
        <button class="task-check" type="button" data-action="toggle-task" data-task-id="${esc(task.id)}" aria-label="${task.done ? '标记为未完成' : '标记为已完成'}：${esc(task.title)}" aria-pressed="${task.done}">
          ${task.done ? icon('check') : ''}
        </button>
        <div class="agenda-body">
          <div class="task-tagline">
            <span class="category-tag"><span class="dot"></span>${esc(category.name)}</span>
            ${isOngoing ? taskOngoingBadge(task) : ''}
            ${taskCarriedBadge(task)}
            ${taskRepeatBadge(task)}
            ${renderTagChips(task.tags, 2)}
            ${task.priority !== 'normal' ? `<span class="priority-badge is-${priority.className}">${priority.label}</span>` : ''}
          </div>
          <h3 class="task-title">${esc(task.title)}</h3>
          ${task.note ? `<p class="task-note">${esc(task.note)}</p>` : ''}
          ${deadline ? `
            <div class="task-meta">
              <span class="task-meta-item ${deadline.className}">${icon('flag')}DDL ${esc(deadline.dateLabel)}${deadline.timeLabel ? ` ${esc(deadline.timeLabel)}` : ''}</span>
              ${deadline.overdue ? '<span class="task-meta-item is-overdue">已逾期</span>' : ''}
            </div>` : ''}
        </div>
        <div class="task-actions">
          <button class="card-mini-btn" type="button" data-action="edit-task" data-task-id="${esc(task.id)}" aria-label="编辑：${esc(task.title)}" title="编辑">${icon('pencil')}</button>
          <button class="card-mini-btn is-danger" type="button" data-action="delete-task" data-task-id="${esc(task.id)}" aria-label="删除：${esc(task.title)}" title="删除">${icon('trash')}</button>
        </div>
      </article>`;
  }

  /* ----------------------------- Mini calendar ----------------------------- */

  function renderMiniCalendar() {
    const cursor = ui.calendarCursor;
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const leading = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(year, month, 1 - leading);
    const today = todayISO();

    const tasksByDate = new Map();
    data.tasks.forEach((task) => {
      if (!tasksByDate.has(task.date)) tasksByDate.set(task.date, []);
      tasksByDate.get(task.date).push(task);
    });

    let daysHTML = '';
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + index);
      const iso = toISO(date);
      const outside = date.getMonth() !== month;
      const tasks = tasksByDate.get(iso) || [];
      const colors = [...new Set(tasks.map((task) => safeColor(getCategory(task.categoryId).color)))].slice(0, 3);
      const isToday = iso === today;
      const isSelected = iso === ui.selectedDate;
      const classes = [
        'calendar-day',
        outside ? 'is-outside' : '',
        isToday ? 'is-today' : '',
        isSelected ? 'is-selected' : ''
      ].filter(Boolean).join(' ');
      const aria = `${date.getMonth() + 1}月${date.getDate()}日，${isToday ? '今天，' : ''}${tasks.length ? `${tasks.length} 项事项` : '没有事项'}`;

      daysHTML += `
        <button class="${classes}" type="button" data-calendar-date="${iso}" aria-label="${esc(aria)}" aria-pressed="${isSelected}">
          <span>${date.getDate()}</span>
          ${colors.length ? `<span class="calendar-dots" aria-hidden="true">${colors.map((color) => `<i style="--dot:${color}"></i>`).join('')}</span>` : ''}
        </button>`;
    }

    return `
      <section class="rail-card mini-calendar" aria-label="月历">
        <div class="calendar-head">
          <div class="calendar-month">${month + 1}月<small>${year}</small></div>
          <div class="calendar-nav">
            <button class="icon-btn" type="button" data-action="calendar-prev" aria-label="上个月">${icon('chevronLeft')}</button>
            <button class="icon-btn" type="button" data-action="calendar-next" aria-label="下个月">${icon('chevronRight')}</button>
          </div>
        </div>
        <div class="calendar-weekdays" aria-hidden="true">${CALENDAR_WEEKDAYS.map((day) => `<span>${day}</span>`).join('')}</div>
        <div class="calendar-grid">${daysHTML}</div>
        <div class="calendar-footer">
          <button class="calendar-today-btn" type="button" data-action="today-date">${icon('target')}回到今天</button>
          <button class="calendar-week-btn" type="button" data-action="go-week">查看时间线 ${icon('arrowRight')}</button>
        </div>
      </section>`;
  }

  /* ----------------------------- Deadline rail ----------------------------- */

  function renderDeadlineRail() {
    const seen = new Set();
    const deadlines = data.tasks
      .filter((task) => !task.done && task.ddlDate)
      .sort((a, b) => getDueTimestamp(a) - getDueTimestamp(b))
      .filter((task) => {
        const key = task.seriesId || task.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    const visible = deadlines.slice(0, 5);

    const items = visible.map((task) => {
      const category = getCategory(task.categoryId);
      const info = getDeadlineInfo(task);
      const rightLabel = info.overdue ? '已逾期' : info.dateLabel;
      return `
        <button class="deadline-item" type="button" data-action="edit-task" data-task-id="${esc(task.id)}" style="${categoryVars(category)}" title="${esc(task.title)}">
          <span class="deadline-dot" aria-hidden="true"></span>
          <span class="deadline-copy">
            <strong class="deadline-title">${esc(task.title)}</strong>
            <span class="deadline-meta">
              <span>${esc(category.name)}</span>
              <span class="dot"></span>
              <span>${info.timeLabel ? `截止 ${esc(info.timeLabel)}` : '今日结束前'}</span>
            </span>
          </span>
          <span class="deadline-when ${info.className}">${esc(rightLabel)}</span>
        </button>`;
    }).join('');

    return `
      <section class="rail-card deadline-card" aria-label="即将到期">
        <div class="rail-head">
          <h3 class="rail-title">${icon('flag')}即将到期</h3>
          <span class="rail-count">${deadlines.length}</span>
        </div>
        ${deadlines.length ? `
          <div class="deadline-list">${items}</div>
          ${deadlines.length > visible.length ? `
            <button class="rail-more" type="button" data-action="go-week">还有 ${deadlines.length - visible.length} 个截止事项 ${icon('arrowRight')}</button>` : ''}
        ` : `
          <div class="rail-empty">
            <span class="rail-empty-icon">${icon('check')}</span>
            <p>近期没有截止压力<br>给今天的自己一点掌声吧</p>
          </div>
        `}
      </section>`;
  }

  /* ----------------------------- Expiry rail ----------------------------- */

  function renderExpiryRail() {
    const records = data.expiries || [];
    if (!records.length) return '';

    const entries = records
      .map((record) => ({ record, info: getExpiryInfo(record) }))
      .filter((item) => item.info.days >= -30 && item.info.days <= 30)
      .sort((a, b) => {
        const aExpired = a.info.days < 0;
        const bExpired = b.info.days < 0;
        if (aExpired !== bExpired) return aExpired ? -1 : 1;
        if (aExpired) return b.info.days - a.info.days;
        return a.info.days - b.info.days;
      });
    const visible = entries.slice(0, 4);

    const items = visible.map(({ record, info }) => {
      const type = getExpiryType(record.type);
      return `
        <button class="deadline-item expiry-rail-item" type="button" data-action="edit-expiry" data-expiry-id="${esc(record.id)}" style="${expiryTypeVars(record.type)}" title="${esc(record.title)}">
          <span class="deadline-dot" aria-hidden="true"></span>
          <span class="deadline-copy">
            <strong class="deadline-title">${esc(record.title)}</strong>
            <span class="deadline-meta">
              <span>${esc(type.label)}</span>
              <span class="dot"></span>
              <span>${esc(formatMonthDay(record.expiryDate))}到期</span>
            </span>
          </span>
          <span class="deadline-when ${info.className}">${esc(info.key === 'expired' ? '已过期' : info.shortLabel)}</span>
        </button>`;
    }).join('');

    return `
      <section class="rail-card expiry-rail-card" aria-label="期限提醒">
        <div class="rail-head">
          <h3 class="rail-title">${icon('hourglass')}期限提醒</h3>
          <span class="rail-count" title="30 天内或近期已过期">${entries.length}</span>
        </div>
        ${entries.length ? `
          <div class="deadline-list">${items}</div>
        ` : `
          <div class="rail-empty">
            <span class="rail-empty-icon">${icon('check')}</span>
            <p>30 天内没有到期的记录<br>想记的时候再来写一笔</p>
          </div>
        `}
        <button class="rail-more" type="button" data-action="go-expiry">管理全部期限记录 ${icon('arrowRight')}</button>
      </section>`;
  }

  /* ----------------------------- Weekly rhythm ----------------------------- */

  function renderWeekRhythm() {
    const weekStart = startOfWeekISO(todayISO());
    const weekEnd = shiftISO(weekStart, 6);
    const weekTasks = data.tasks.filter((task) => task.date >= weekStart && task.date <= weekEnd);
    const done = weekTasks.filter((task) => task.done).length;
    const total = weekTasks.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const byCategory = data.categories.map((category) => {
      const tasks = weekTasks.filter((task) => task.categoryId === category.id);
      return {
        category,
        total: tasks.length,
        done: tasks.filter((task) => task.done).length
      };
    }).filter((item) => item.total > 0).sort((a, b) => b.total - a.total).slice(0, 4);

    return `
      <section class="rail-card rhythm-card" aria-label="本周节奏">
        <div class="rail-head">
          <h3 class="rail-title">${icon('listChecks')}本周节奏</h3>
          <span class="rail-count is-range">${formatWeekRange(weekStart)}</span>
        </div>
        <div class="week-rhythm-progress">
          <strong>${pct}<small>%</small></strong>
          <span>${done} / ${total} 项已完成</span>
        </div>
        <div class="rhythm-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
        ${byCategory.length ? `
          <div class="rhythm-list">
            ${byCategory.map((item) => {
              const width = total ? Math.round((item.total / total) * 100) : 0;
              return `
                <div class="rhythm-row" style="${categoryVars(item.category)}">
                  <span class="rhythm-label"><i></i><span>${esc(item.category.name)}</span></span>
                  <span class="rhythm-track"><span style="width:${width}%"></span></span>
                  <span class="rhythm-count">${item.done}/${item.total}</span>
                </div>`;
            }).join('')}
          </div>` : '<p class="rhythm-empty">这一周还没有安排，先放进一件期待的事吧。</p>'}
      </section>`;
  }

  /* ----------------------------- Week view ----------------------------- */

  function renderWeekView() {
    const weekStart = ui.weekAnchor;
    const weekEnd = shiftISO(weekStart, 6);
    const isCurrentWeek = weekStart === startOfWeekISO(todayISO());
    const weekTasks = data.tasks.filter((task) => task.date >= weekStart && task.date <= weekEnd);
    const filteredTasks = ui.weekFilter === 'all'
      ? weekTasks
      : weekTasks.filter((task) => task.categoryId === ui.weekFilter);
    const doneCount = weekTasks.filter((task) => task.done).length;
    const pct = weekTasks.length ? Math.round((doneCount / weekTasks.length) * 100) : 0;
    const today = todayISO();

    const categoriesWithCounts = data.categories.map((category) => ({
      category,
      count: weekTasks.filter((task) => task.categoryId === category.id).length
    }));

    const filterChips = `
      <div class="filter-chips" role="group" aria-label="按分类筛选">
        <button class="filter-chip${ui.weekFilter === 'all' ? ' is-active' : ''}" type="button" data-action="set-week-filter" data-filter="all">
          全部 <span class="filter-number">${weekTasks.length}</span>
        </button>
        ${categoriesWithCounts.filter((item) => item.count > 0).map(({ category, count }) => `
          <button class="filter-chip${ui.weekFilter === category.id ? ' is-active' : ''}" type="button" data-action="set-week-filter" data-filter="${esc(category.id)}" style="${categoryVars(category)}">
            <span class="filter-dot"></span>${esc(category.name)} <span class="filter-number">${count}</span>
          </button>`).join('')}
      </div>`;

    const daysHTML = Array.from({ length: 7 }, (_, index) => {
      const iso = shiftISO(weekStart, index);
      const allDayTasks = weekTasks.filter((task) => task.date === iso);
      const tasks = filteredTasks.filter((task) => task.date === iso).sort(sortTasksByTime);
      const isToday = iso === today;
      const isPast = iso < today;
      const weekDay = weekdayName(iso);
      const monthText = `${parseISO(iso).getMonth() + 1}月`;
      const dayNumber = parseISO(iso).getDate();
      const taskCards = tasks.map((task) => renderTimelineTask(task)).join('');
      const emptyCopy = ui.weekFilter === 'all'
        ? '这一天还没有安排，留白也很好'
        : '这一天没有该分类的事项';

      return `
        <div class="timeline-row${tasks.length ? ' has-items' : ''}${isToday ? ' is-today' : ''}">
          <div class="timeline-date">
            <span class="timeline-weekday">${weekDay}</span>
            <span class="timeline-day-number">${dayNumber}</span>
            <span class="timeline-month">${monthText}</span>
          </div>
          <div class="timeline-axis" aria-hidden="true"><span class="timeline-node"></span></div>
          <div class="timeline-content">
            <div class="timeline-day-head">
              <div class="timeline-day-title">
                <span>${formatMonthDay(iso)}</span>
                <span class="weekday-copy">${weekDay}${isPast ? ' · 已过去' : ''}</span>
                ${isToday ? '<span class="today-badge">今天</span>' : ''}
              </div>
              <div class="timeline-day-actions">
                <span class="timeline-day-count">${tasks.length} 项</span>
                <button class="timeline-day-add" type="button" data-action="new-task" data-date="${iso}" aria-label="在${formatMonthDay(iso)}添加事项" title="添加事项">${icon('plus')}</button>
              </div>
            </div>
            ${tasks.length
              ? `<div class="timeline-tasks">${taskCards}</div>`
              : `<button class="timeline-empty-day" type="button" data-action="new-task" data-date="${iso}">${icon('plus')}${emptyCopy}</button>`}
          </div>
        </div>`;
    }).join('');

    return `
      <section class="view week-view" aria-label="本周时间线">
        <header class="page-heading">
          <div class="page-heading-copy">
            <p class="eyebrow">WEEKLY TIMELINE</p>
            <h1 class="page-title">本周时间线<span class="title-mark" aria-hidden="true"></span></h1>
            <p class="page-subtitle">${formatWeekRange(weekStart)} · 把安排和截止日期放进同一条时间线${isCurrentWeek ? '，按自己的节奏向前' : ''}。</p>
          </div>
          <div class="page-actions">
            <div class="week-switcher" aria-label="切换周">
              <button class="icon-btn" type="button" data-action="prev-week" aria-label="上一周">${icon('chevronLeft')}</button>
              <button class="text-btn" type="button" data-action="this-week" aria-label="回到本周">本周</button>
              <span class="week-switcher-label">${formatWeekRange(weekStart)}</span>
              <button class="icon-btn" type="button" data-action="next-week" aria-label="下一周">${icon('chevronRight')}</button>
            </div>
            <button class="btn btn-primary" type="button" data-action="new-task" data-date="${isCurrentWeek ? today : weekStart}">${icon('plus')}添加事项</button>
          </div>
        </header>

        <section class="week-summary" aria-label="本周概要">
          <div class="week-summary-lead">
            <span class="week-summary-kicker">${isCurrentWeek ? 'THIS WEEK ·' : 'A WEEK IN REVIEW ·'} WEEK ${getWeekNumber(parseISO(weekStart))}</span>
            <h2 class="week-summary-title">${weekTasks.length ? `这一周，<em>慢慢来，也在向前。</em>` : '这一周，从一件期待的小事开始。'}</h2>
            <p class="week-summary-copy">${weekTasks.length ? `7 天里安排了 ${weekTasks.length} 件事，已完成 ${doneCount} 件。先做好眼前这一件，就已经很好。` : '还没有安排。可以是一杯咖啡、一次散步，或是一件拖了很久的小事。'}</p>
          </div>
          <div class="week-metrics">
            <div class="week-metric"><strong>${weekTasks.length}</strong><span>本周事项</span></div>
            <div class="week-metric"><strong>${doneCount}</strong><span>已经完成</span></div>
            <div class="week-metric is-accent"><strong>${Math.max(weekTasks.length - doneCount, 0)}</strong><span>还在路上</span></div>
            <div class="week-metric"><strong>${pct}<small>%</small></strong><span>完成度</span></div>
          </div>
        </section>

        <div class="week-toolbar">
          ${filterChips}
          <span class="week-toolbar-note">${isCurrentWeek ? '本周 · 按日期排列' : '非本周视图 · 可切换回本周'}</span>
        </div>

        ${weekTasks.length || ui.weekFilter !== 'all'
          ? `<div class="week-timeline">${daysHTML}</div>`
          : `<div class="week-empty-state">
              <div class="empty-art">${icon('calendarDays')}</div>
              <h3 class="empty-title">这一周还没有安排</h3>
              <p class="empty-copy">试着放下一件期待的事，让时间线多一点属于你的颜色。</p>
              <button class="btn btn-primary" type="button" data-action="new-task" data-date="${weekStart}">${icon('plus')}添加本周事项</button>
            </div>`}
      </section>`;
  }

  function renderTimelineTask(task) {
    const category = getCategory(task.categoryId);
    const deadline = getDeadlineInfo(task);
    const time = task.startTime ? `${task.startTime}${task.endTime ? `–${task.endTime}` : ''}` : '全天';
    return `
      <article class="timeline-task${task.done ? ' is-done' : ''}" style="${categoryVars(category)}">
        <button class="task-check" type="button" data-action="toggle-task" data-task-id="${esc(task.id)}" aria-label="${task.done ? '标记为未完成' : '标记为已完成'}：${esc(task.title)}" aria-pressed="${task.done}">
          ${task.done ? icon('check') : ''}
        </button>
        <div class="timeline-task-body">
          <div class="timeline-task-kicker">
            <span class="time-copy">${esc(time)}</span><span class="cat-copy">${esc(category.name)}</span>
            ${taskCarriedBadge(task)}
            ${taskRepeatBadge(task)}
            ${renderTagChips(task.tags, 1)}
          </div>
          <h3 class="timeline-task-title">${esc(task.title)}</h3>
          <div class="timeline-task-meta">
            ${deadline ? `<span class="${deadline.className}">${icon('flag')}${esc(deadlineText(task))}</span>` : '<span>没有 DDL</span>'}
            ${task.priority !== 'normal' ? `<span>${PRIORITIES[task.priority].label}</span>` : ''}
          </div>
        </div>
        <div class="timeline-task-actions">
          <button class="card-mini-btn" type="button" data-action="edit-task" data-task-id="${esc(task.id)}" aria-label="编辑：${esc(task.title)}" title="编辑">${icon('pencil')}</button>
        </div>
      </article>`;
  }

  function getWeekNumber(date) {
    const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = temp.getUTCDay() || 7;
    temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
    return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  }

  /* ----------------------------- Category view ----------------------------- */

  function buildSeriesGroup(series) {
    const today = todayISO();
    const occurrences = data.tasks
      .filter((task) => task.seriesId === series.id)
      .sort(compareTasksBySchedule);
    const todayOcc = occurrences.find((task) => task.date === today) || null;
    const next = occurrences
      .filter((task) => !task.done && task.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime || '').localeCompare(b.startTime || ''))[0] || null;
    const last = occurrences[occurrences.length - 1] || null;
    const recentStart = shiftISO(today, -6);
    const recent = occurrences.filter((task) => task.date >= recentStart && task.date <= today);
    return {
      series,
      occurrences,
      todayOcc,
      next,
      task: next || todayOcc || last,
      recent
    };
  }

  function renderSeriesCard(group, category) {
    const { series, next, todayOcc, recent } = group;
    const label = seriesRecurrenceLabel(series);
    const time = series.startTime
      ? `${series.startTime}${series.endTime ? `–${series.endTime}` : ''}`
      : '全天';
    const nextCopy = next
      ? `下次 ${relativeDate(next.date)}`
      : series.endDate
        ? '循环已结束'
        : '等待下一次';
    const todayCopy = todayOcc
      ? todayOcc.done ? '今天已完成' : '今天待完成'
      : '今天无安排';
    const recentStart = shiftISO(todayISO(), -6);
    const weekDots = Array.from({ length: 7 }, (_, index) => {
      const iso = shiftISO(recentStart, index);
      const occurrence = group.occurrences.find((task) => task.date === iso);
      const classes = [
        occurrence?.done ? 'is-done' : '',
        iso === todayISO() ? 'is-today' : ''
      ].filter(Boolean).join(' ');
      return `<i class="${classes}" title="${esc(`${formatMonthDay(iso)}${occurrence ? occurrence.done ? ' · 已完成' : ' · 待完成' : ' · 无安排'}`)}">${parseISO(iso).getDate()}</i>`;
    }).join('');
    const editor = group.task
      ? `<button class="series-edit" type="button" data-action="edit-task" data-task-id="${esc(group.task.id)}" aria-label="管理循环任务：${esc(series.title)}">${icon('pencil')}管理</button>`
      : '';
    return `
      <article class="series-card" style="${categoryVars(category)}">
        <div class="series-card-top">
          <span class="repeat-badge" title="循环任务 · ${esc(label)}">${icon('repeat')}<span>${esc(label)}</span></span>
          ${renderTagChips(series.tags, 2)}
        </div>
        <h3 class="series-card-title">${esc(series.title)}</h3>
        <div class="series-card-meta">
          <span class="tile-meta-item">${icon('clock')}${esc(time)}</span>
          <span class="tile-meta-item">${icon('calendar')}${esc(nextCopy)}</span>
          <span>${esc(todayCopy)}</span>
        </div>
        <div class="series-card-foot">
          <span class="series-week" aria-label="最近 7 天完成情况">${weekDots}</span>
          ${editor}
        </div>
      </article>`;
  }

  function renderCategoryView() {
    const category = getCategory(ui.categoryId);
    const allTasks = data.tasks
      .filter((task) => task.categoryId === category.id)
      .sort(compareTasksBySchedule);
    const plainTasks = allTasks.filter((task) => !task.seriesId);
    const allSeries = data.series
      .filter((series) => series.categoryId === category.id)
      .map(buildSeriesGroup)
      .sort((a, b) => {
        const aDate = a.next?.date || a.series.endDate || a.series.startDate;
        const bDate = b.next?.date || b.series.endDate || b.series.startDate;
        return aDate.localeCompare(bDate) || a.series.title.localeCompare(b.series.title);
      });

    const usedTags = normalizeTags([
      ...plainTasks.flatMap((task) => normalizeTags(task.tags)),
      ...allSeries.flatMap((group) => normalizeTags(group.series.tags))
    ], 12);
    let tagFilter = usedTags.includes(ui.tagFilter) ? ui.tagFilter : 'all';
    ui.tagFilter = tagFilter;

    const plainTagged = tagFilter === 'all'
      ? plainTasks
      : plainTasks.filter((task) => normalizeTags(task.tags).includes(tagFilter));
    const seriesTagged = tagFilter === 'all'
      ? allSeries
      : allSeries.filter((group) => normalizeTags(group.series.tags).includes(tagFilter));
    const pending = plainTagged.filter((task) => !task.done);
    const done = plainTagged.filter((task) => task.done);
    const filters = { all: plainTagged, pending, done };
    const activeFilter = filters[ui.categoryFilter] ? ui.categoryFilter : 'all';
    const visiblePlain = filters[activeFilter];
    const visibleSeries = activeFilter === 'done'
      ? []
      : seriesTagged.filter((group) => activeFilter === 'all' || Boolean(group.next) || Boolean(group.todayOcc && !group.todayOcc.done));

    const totalItems = plainTasks.length + allSeries.length;
    const todayPlain = plainTasks.filter((task) => task.date === todayISO());
    const todaySeries = allSeries.filter((group) => Boolean(group.todayOcc));
    const todayTotal = todayPlain.length + todaySeries.length;
    const todayDone = todayPlain.filter((task) => task.done).length + todaySeries.filter((group) => group.todayOcc?.done).length;
    const pct = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0;
    const allPending = plainTasks.filter((task) => !task.done).length + allSeries.filter((group) => Boolean(group.next)).length;

    const filterTabs = `
      <div class="filter-tabs" role="tablist" aria-label="筛选独立事项">
        <button class="filter-tab${activeFilter === 'all' ? ' is-active' : ''}" type="button" role="tab" aria-selected="${activeFilter === 'all'}" data-action="set-category-filter" data-filter="all">全部 <span>${plainTagged.length}</span></button>
        <button class="filter-tab${activeFilter === 'pending' ? ' is-active' : ''}" type="button" role="tab" aria-selected="${activeFilter === 'pending'}" data-action="set-category-filter" data-filter="pending">待办 <span>${pending.length}</span></button>
        <button class="filter-tab${activeFilter === 'done' ? ' is-active' : ''}" type="button" role="tab" aria-selected="${activeFilter === 'done'}" data-action="set-category-filter" data-filter="done">已完成 <span>${done.length}</span></button>
      </div>`;

    const tagFilterHTML = usedTags.length ? `
      <div class="tag-filter-row" role="group" aria-label="按来源标签筛选">
        <span class="tag-filter-label">来源</span>
        <button class="tag-filter-chip${tagFilter === 'all' ? ' is-active' : ''}" type="button" data-action="set-tag-filter" data-filter="all">全部标签</button>
        ${usedTags.map((tag) => `<button class="tag-filter-chip${tagFilter === tag ? ' is-active' : ''}" type="button" data-action="set-tag-filter" data-filter="${esc(tag)}">#${esc(tag)}</button>`).join('')}
      </div>` : '';

    const seriesHTML = visibleSeries.length ? `
      <section class="series-section" aria-label="循环任务">
        <div class="series-section-head">
          <h2>循环任务</h2>
          <span class="count-pill">${visibleSeries.length}</span>
          <span class="category-toolbar-note">按天完成，系列自动延续</span>
        </div>
        <div class="series-grid">${visibleSeries.map((group) => renderSeriesCard(group, category)).join('')}</div>
      </section>` : '';

    let groupsHTML = '';
    if (!visiblePlain.length && !visibleSeries.length) {
      if (tagFilter !== 'all') {
        groupsHTML = `
          <div class="category-empty">
            <div class="empty-art">${icon('search')}</div>
            <h3 class="empty-title">「${esc(tagFilter)}」下还没有事项</h3>
            <p class="empty-copy">换一个来源标签看看，或者为这个分类添加一件新事项。</p>
            <button class="btn btn-secondary" type="button" data-action="set-tag-filter" data-filter="all">查看全部来源</button>
          </div>`;
      } else {
        groupsHTML = `
          <div class="category-empty">
            <div class="empty-art">${activeFilter === 'done' ? icon('check') : icon(category.icon)}</div>
            <h3 class="empty-title">${activeFilter === 'done' ? '还没有完成的事项' : activeFilter === 'pending' ? '这里已经清空啦' : '这个分类还是空的'}</h3>
            <p class="empty-copy">${activeFilter === 'done' ? '完成一件小事之后，它会安静地出现在这里。' : activeFilter === 'pending' ? '所有事项都完成了，给自己倒一杯水吧。' : '放进第一件想在这个分类里完成的事。'}</p>
            ${activeFilter !== 'done'
              ? `<button class="btn btn-primary" type="button" data-action="new-task" data-category-id="${esc(category.id)}" data-date="${todayISO()}">${icon('plus')}添加事项</button>`
              : `<button class="btn btn-secondary" type="button" data-action="set-category-filter" data-filter="all">查看全部</button>`}
          </div>`;
      }
    } else {
      const renderGroup = (title, tasks, addTile = false) => tasks.length ? `
        <section class="category-group">
          <div class="category-group-head"><h2>${title}</h2><span class="count-pill">${tasks.length}</span></div>
          <div class="category-grid">
            ${tasks.map((task) => renderTaskTile(task)).join('')}
            ${addTile ? `
              <button class="tile-add" type="button" data-action="new-task" data-category-id="${esc(category.id)}" data-date="${todayISO()}" style="${categoryVars(category)}">
                <span class="tile-add-icon">${icon('plus')}</span>
                <span>添加一件新事项</span>
              </button>` : ''}
          </div>
        </section>` : '';

      const plainGroups = activeFilter === 'all'
        ? renderGroup('独立事项 · 待办', pending, true) + renderGroup('已完成', done, false)
        : activeFilter === 'pending'
          ? renderGroup('独立事项 · 待办', pending, true)
          : renderGroup('已完成', done, false);
      groupsHTML = seriesHTML + plainGroups;
    }

    const summaryText = totalItems
      ? `${plainTasks.length} 件独立事项${allSeries.length ? ` · ${allSeries.length} 个循环任务` : ''}${allPending ? ` · 还有 ${allPending} 件在路上` : ' · 都收好尾了'}`
      : '一个刚刚打开的新分类';

    return `
      <section class="view category-view" aria-label="${esc(category.name)}分类">
        <header class="category-hero" style="${categoryVars(category)}">
          <div class="category-hero-main">
            <div class="category-big-icon">${icon(category.icon)}</div>
            <div class="category-hero-copy">
              <p class="eyebrow">MY COLLECTION</p>
              <h1 class="category-title">${esc(category.name)}<span class="category-count">${totalItems} 项</span></h1>
              <p class="category-summary">${esc(summaryText)}</p>
            </div>
          </div>
          <div class="category-hero-side">
            <div class="category-progress-box">
              <div class="category-progress-ring" style="--pct:${pct}" aria-label="完成度 ${pct}%"><span>${pct}%</span></div>
              <div class="category-progress-copy"><span>${todayTotal ? '今日完成' : '今日无安排'}</span><strong>${todayTotal ? `${todayDone}/${todayTotal}` : '—'}</strong></div>
            </div>
            <div class="category-hero-actions">
              <button class="btn btn-secondary" type="button" data-action="edit-category" data-category-id="${esc(category.id)}">${icon('pencil')}编辑分类</button>
              <button class="btn btn-primary" type="button" data-action="new-task" data-category-id="${esc(category.id)}" data-date="${todayISO()}">${icon('plus')}新建事项</button>
            </div>
          </div>
        </header>

        <div class="category-toolbar">
          ${filterTabs}
          <span class="category-toolbar-note">上方筛选独立事项 · 循环任务按系列收拢</span>
        </div>
        ${tagFilterHTML}
        ${groupsHTML}
      </section>`;
  }

  function compareTasksBySchedule(a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const aTime = a.startTime || '00:00';
    const bTime = b.startTime || '00:00';
    return aTime.localeCompare(bTime) || a.createdAt.localeCompare(b.createdAt);
  }

  /* ----------------------------- Expiry view ----------------------------- */

  function renderExpiryView() {
    const records = [...(data.expiries || [])].sort(compareExpiryRecords);
    const entries = records.map((record) => ({ record, info: getExpiryInfo(record) }));
    const counts = {
      all: entries.length,
      week: entries.filter(({ info }) => info.days >= 0 && info.days <= 7).length,
      month: entries.filter(({ info }) => info.days >= 0 && info.days <= 30).length,
      expired: entries.filter(({ info }) => info.days < 0).length
    };
    const activeFilter = EXPIRY_FILTERS.some((item) => item.id === ui.expiryFilter) ? ui.expiryFilter : 'all';
    ui.expiryFilter = activeFilter;
    const filterLabel = activeFilter === 'all'
      ? '全部记录'
      : EXPIRY_FILTERS.find((item) => item.id === activeFilter)?.label || '全部';
    const visible = entries.filter(({ info }) => {
      if (activeFilter === 'week') return info.days >= 0 && info.days <= 7;
      if (activeFilter === 'month') return info.days >= 0 && info.days <= 30;
      if (activeFilter === 'expired') return info.days < 0;
      return true;
    });

    const filterTabs = `
      <div class="filter-tabs" role="tablist" aria-label="筛选期限记录">
        ${EXPIRY_FILTERS.map((filter) => `
          <button class="filter-tab${activeFilter === filter.id ? ' is-active' : ''}" type="button" role="tab" aria-selected="${activeFilter === filter.id}" data-action="set-expiry-filter" data-filter="${filter.id}">
            ${filter.label} <span>${counts[filter.id]}</span>
          </button>`).join('')}
      </div>`;

    const cards = visible.map(({ record, info }) => renderExpiryCard(record, info)).join('');
    let listHTML = '';
    if (!entries.length) {
      listHTML = `
        <div class="category-empty expiry-empty">
          <div class="empty-art">${icon('hourglass')}</div>
          <h2 class="empty-title">还没有期限记录</h2>
          <p class="empty-copy">食品、优惠券、会员、日用…… 把会过期的东西记在这里，需要时一眼看到还剩多少天。</p>
          <button class="btn btn-primary" type="button" data-action="new-expiry">${icon('plus')}记录第一项</button>
        </div>`;
    } else if (!visible.length) {
      listHTML = `
        <div class="category-empty expiry-empty">
          <div class="empty-art">${icon('search')}</div>
          <h2 class="empty-title">「${esc(filterLabel)}」下没有记录</h2>
          <p class="empty-copy">换一个筛选看看，或者添加一项新的期限记录。</p>
          <button class="btn btn-secondary" type="button" data-action="set-expiry-filter" data-filter="all">查看全部记录</button>
        </div>`;
    } else {
      listHTML = `
        <section class="category-group expiry-group" aria-label="${esc(filterLabel)}期限记录">
          <div class="category-group-head">
            <h2>${esc(filterLabel)}</h2>
            <span class="count-pill">${visible.length}</span>
            <span class="expiry-group-note">按到期日从近到远</span>
          </div>
          <div class="expiry-grid">${cards}</div>
        </section>`;
    }

    return `
      <section class="view expiry-view" aria-label="期限记录">
        <header class="page-heading expiry-heading">
          <div class="page-heading-copy">
            <p class="eyebrow">SHELF LIFE &amp; MEMBERSHIPS</p>
            <h1 class="page-title">期限记录<span class="title-mark"></span></h1>
            <p class="page-subtitle">把食品、券、会员和日用品的到期日记在这里。只做<strong>本地记录与视觉提醒</strong>，不会发送系统通知。</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" type="button" data-action="new-expiry">${icon('plus')}记录一项</button>
          </div>
        </header>

        <section class="expiry-summary" aria-label="期限概览">
          <div class="expiry-summary-item is-total">
            <span>全部记录</span>
            <strong>${counts.all}</strong>
          </div>
          <div class="expiry-summary-item is-week">
            <span>7 天内</span>
            <strong>${counts.week}</strong>
          </div>
          <div class="expiry-summary-item is-expired">
            <span>已过期</span>
            <strong>${counts.expired}</strong>
          </div>
          <div class="expiry-summary-note">${icon('info')}<span>到期后会保留在列表里，方便回看；不需要时再删除。</span></div>
        </section>

        <div class="expiry-toolbar">
          ${filterTabs}
          <span class="expiry-toolbar-note">30 天内共有 ${counts.month} 项</span>
        </div>
        ${listHTML}
      </section>`;
  }

  function renderExpiryCard(record, info) {
    const type = getExpiryType(record.type);
    const origin = expiryOriginText(record);
    return `
      <article class="expiry-card ${info.className}" style="${expiryTypeVars(record.type)}">
        <div class="expiry-card-top">
          <span class="expiry-type-pill">${icon(type.icon)}<span>${esc(type.label)}</span></span>
          <span class="expiry-status ${info.className}">${esc(info.label)}</span>
        </div>
        <h3 class="expiry-card-title">${esc(record.title)}</h3>
        ${record.note ? `<p class="expiry-card-note">${esc(record.note)}</p>` : ''}
        ${origin ? `<p class="expiry-origin">${icon('calendar')}<span>${esc(origin)}</span></p>` : ''}
        <div class="expiry-card-foot">
          <span class="expiry-date">${icon('calendar')}<strong>${esc(formatExpiryDate(record.expiryDate))}</strong></span>
          <div class="expiry-card-actions">
            <button class="expiry-edit-btn" type="button" data-action="edit-expiry" data-expiry-id="${esc(record.id)}" aria-label="编辑期限记录：${esc(record.title)}">${icon('pencil')}编辑</button>
            <button class="card-mini-btn is-danger" type="button" data-action="delete-expiry" data-expiry-id="${esc(record.id)}" aria-label="删除期限记录：${esc(record.title)}" title="删除">${icon('trash')}</button>
          </div>
        </div>
      </article>`;
  }

  function renderTaskTile(task) {
    const category = getCategory(task.categoryId);
    const deadline = getDeadlineInfo(task);
    const time = task.startTime ? `${task.startTime}${task.endTime ? `–${task.endTime}` : ''}` : '全天';
    const dateLabel = `${formatMonthDay(task.date)} · ${weekdayName(task.date)}`;
    return `
      <article class="task-tile${task.done ? ' is-done' : ''}" style="${categoryVars(category)}">
        <div class="tile-top">
          <div class="tile-check-row">
            <button class="task-check" type="button" data-action="toggle-task" data-task-id="${esc(task.id)}" aria-label="${task.done ? '标记为未完成' : '标记为已完成'}：${esc(task.title)}" aria-pressed="${task.done}">
              ${task.done ? icon('check') : ''}
            </button>
            <span class="tile-status">${task.done ? '已完成' : '待办'}</span>
          </div>
          <div class="tile-actions">
            <button class="card-mini-btn" type="button" data-action="edit-task" data-task-id="${esc(task.id)}" aria-label="编辑：${esc(task.title)}" title="编辑">${icon('pencil')}</button>
            <button class="card-mini-btn is-danger" type="button" data-action="delete-task" data-task-id="${esc(task.id)}" aria-label="删除：${esc(task.title)}" title="删除">${icon('trash')}</button>
          </div>
        </div>
        <h3 class="tile-title">${esc(task.title)}</h3>
        ${task.note ? `<p class="tile-note">${esc(task.note)}</p>` : ''}
        ${(normalizeTags(task.tags).length || task.seriesId || task.carriedFrom) ? `<div class="tile-tags">${taskCarriedBadge(task)}${taskRepeatBadge(task)}${renderTagChips(task.tags, 2)}</div>` : ''}
        <div class="tile-meta">
          <span class="tile-meta-item">${icon('calendar')}${esc(dateLabel)}</span>
          <span class="tile-meta-item">${icon('clock')}${esc(time)}</span>
          ${deadline ? `<span class="tile-meta-item ${deadline.className}">${icon('flag')}DDL ${esc(deadlineText(task))}</span>` : ''}
          <span class="tile-priority${task.priority !== 'normal' ? ` is-${task.priority}` : ''}">${PRIORITIES[task.priority].label}</span>
        </div>
      </article>`;
  }

  /* ----------------------------- Search results ----------------------------- */

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      closeSearch();
      return;
    }

    const seenSeries = new Set();
    const matches = data.tasks
      .filter((task) => taskMatchesQuery(task, normalized))
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return compareTasksBySchedule(a, b);
      })
      .filter((task) => {
        const key = task.seriesId || task.id;
        if (seenSeries.has(key)) return false;
        seenSeries.add(key);
        return true;
      });
    const visible = matches.slice(0, 8);
    const expiryMatches = (data.expiries || [])
      .filter((record) => expiryMatchesQuery(record, normalized))
      .sort(compareExpiryRecords);
    const visibleExpiries = expiryMatches.slice(0, 4);
    const totalCount = matches.length + expiryMatches.length;

    const items = visible.map((task) => {
      const category = getCategory(task.categoryId);
      const deadline = getDeadlineInfo(task);
      const series = taskSeries(task);
      const tags = normalizeTags(task.tags);
      return `
        <button class="search-result${task.done ? ' is-done' : ''}" type="button" data-search-task="${esc(task.id)}" style="${categoryVars(category)}">
          <span class="search-result-icon">${icon(category.icon)}</span>
          <span class="search-result-copy">
            <span class="search-result-title">${highlightMatch(task.title, normalized)}</span>
            <span class="search-result-meta">
              <span>${esc(category.name)}</span>
              <span class="dot"></span>
              <span>${formatMonthDay(task.date)} · ${esc(task.startTime || '全天')}</span>
              ${task.carriedFrom ? `<span class="dot"></span><span class="is-carried">顺延自 ${esc(formatMonthDay(task.carriedFrom))}</span>` : ''}
              ${series ? `<span class="dot"></span><span>${esc(seriesRecurrenceLabel(series))}</span>` : ''}
              ${tags.length ? `<span class="dot"></span><span>#${esc(tags[0])}${tags.length > 1 ? ` +${tags.length - 1}` : ''}</span>` : ''}
              ${deadline ? `<span class="dot"></span><span class="${deadline.className}">DDL ${esc(deadline.dateLabel)}</span>` : ''}
            </span>
          </span>
          <span class="search-result-date">${task.done ? '已完成' : relativeDate(task.date)}</span>
        </button>`;
    }).join('');

    const expiryItems = visibleExpiries.map((record) => {
      const type = getExpiryType(record.type);
      const info = getExpiryInfo(record);
      return `
        <button class="search-result expiry-search-result" type="button" data-search-expiry="${esc(record.id)}" style="${expiryTypeVars(record.type)}">
          <span class="search-result-icon">${icon(type.icon)}</span>
          <span class="search-result-copy">
            <span class="search-result-title">${highlightMatch(record.title, normalized)}</span>
            <span class="search-result-meta">
              <span>${esc(type.label)}</span>
              <span class="dot"></span>
              <span>${esc(formatMonthDay(record.expiryDate))}到期</span>
            </span>
          </span>
          <span class="search-result-date ${info.className}">${esc(info.key === 'expired' ? '已过期' : info.shortLabel)}</span>
        </button>`;
    }).join('');

    const moreNotes = [];
    if (matches.length > 8) moreNotes.push(`还有 ${matches.length - 8} 个事项`);
    if (expiryMatches.length > 4) moreNotes.push(`还有 ${expiryMatches.length - 4} 条期限记录`);

    dom.searchResults.innerHTML = `
      <div class="search-results-head"><span>${totalCount ? `找到 ${totalCount} 个结果` : '搜索结果'}</span><span><kbd>Esc</kbd> 关闭</span></div>
      ${totalCount ? `
        ${matches.length ? items : ''}
        ${expiryMatches.length ? `
          <div class="search-group-label"><span>期限记录</span><span>${expiryMatches.length}</span></div>
          ${expiryItems}` : ''}
      ` : `
        <div class="search-empty">
          <span class="search-empty-icon">${icon('search')}</span>
          没有找到「${esc(query.trim())}」<br>试试事项名称、期限记录、分类或备注里的关键词。
        </div>`}
      ${moreNotes.length ? `<div class="search-more">${moreNotes.join('，')}，换一个更准确的关键词试试。</div>` : ''}
    `;
    dom.searchResults.hidden = false;
  }

  function highlightMatch(text, query) {
    const safeText = esc(text);
    const safeQuery = esc(query);
    if (!safeQuery) return safeText;
    const pattern = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      return safeText.replace(new RegExp(`(${pattern})`, 'ig'), '<mark>$1</mark>');
    } catch (error) {
      return safeText;
    }
  }

  function closeSearch() {
    if (!dom.searchResults) return;
    dom.searchResults.hidden = true;
    dom.searchResults.innerHTML = '';
  }

  /* ----------------------------- Persistence & toast ----------------------------- */

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('本地保存失败。', error);
      showToast('本地保存失败，请检查浏览器存储空间。', 'error');
      return false;
    }
  }

  function showToast(message, type = 'success') {
    clearTimeout(toastTimer);
    dom.toast.classList.remove('is-visible', 'is-leaving', 'is-error');
    dom.toastIcon.innerHTML = icon(type === 'error' ? 'alert' : 'check');
    dom.toastMessage.textContent = message;
    if (type === 'error') dom.toast.classList.add('is-error');
    void dom.toast.offsetWidth;
    dom.toast.classList.add('is-visible');
    toastTimer = setTimeout(() => {
      dom.toast.classList.add('is-leaving');
      setTimeout(() => dom.toast.classList.remove('is-visible', 'is-leaving'), 190);
    }, 2800);
  }

  /* ----------------------------- Modal helpers ----------------------------- */

  function updateBodyLock() {
    const anyOpen = Boolean(document.querySelector('dialog[open]'));
    document.body.classList.toggle('modal-open', anyOpen);
  }

  function showDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    updateBodyLock();
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.close();
    updateBodyLock();
  }

  function clearFormError(errorElement, form) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('is-visible');
    }
    form?.querySelectorAll('.is-invalid').forEach((input) => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });
  }

  function showFormError(errorElement, form, message, field) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('is-visible');
    }
    form?.querySelectorAll('.is-invalid').forEach((input) => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });
    if (field) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.focus({ preventScroll: false });
    }
  }

  function showConfirm({
    title,
    message,
    confirmLabel = '确认删除',
    secondaryLabel = '',
    tone = 'danger',
    onConfirm,
    onSecondary = null
  }) {
    dom.confirmTitle.textContent = title;
    dom.confirmMessage.textContent = message;
    dom.confirmButton.textContent = confirmLabel;
    dom.confirmButton.className = `btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}`;
    dom.confirmSecondary.hidden = !secondaryLabel;
    dom.confirmSecondary.textContent = secondaryLabel;
    dom.confirmIcon.className = `confirm-icon${tone === 'info' ? ' is-info' : ''}`;
    dom.confirmIcon.innerHTML = icon(tone === 'danger' ? 'trash' : 'info');
    confirmAction = onConfirm;
    confirmSecondaryAction = onSecondary;
    showDialog(dom.confirmDialog);
  }

  /* ----------------------------- Task dialog ----------------------------- */

  function renderTaskTagChoices(categoryId) {
    const category = getCategory(categoryId);
    const tags = normalizeTags([
      ...(category.tags || []),
      ...taskTagExtras,
      ...taskTagSelection
    ], 24);
    if (!tags.length) {
      dom.taskTagChoices.innerHTML = '<span class="tag-empty">这个分类还没有标签预设，可以在下方新建一个。</span>';
      return;
    }
    dom.taskTagChoices.innerHTML = tags.map((tag) => `
      <label class="tag-option">
        <input type="checkbox" name="taskTags" value="${esc(tag)}" ${taskTagSelection.has(tag) ? 'checked' : ''}>
        <span>${esc(tag)}</span>
      </label>`).join('');
  }

  function addTaskTagFromInput() {
    const tag = normalizeTags(dom.taskTagInput.value, 1)[0];
    if (!tag) {
      dom.taskTagInput.focus();
      return;
    }
    const categoryId = dom.taskForm.querySelector('input[name="categoryId"]:checked')?.value || '';
    const category = getCategory(categoryId);
    if (!(category.tags || []).includes(tag) && !taskTagExtras.includes(tag)) {
      taskTagExtras.push(tag);
    }
    taskTagSelection.add(tag);
    dom.taskTagInput.value = '';
    renderTaskTagChoices(categoryId);
    dom.taskTagInput.focus();
  }

  function updateRepeatHint() {
    const repeat = dom.taskRepeat.value;
    const task = dom.taskId.value ? data.tasks.find((item) => item.id === dom.taskId.value) : null;
    const series = taskSeries(task);
    const isInterval = repeat === 'interval';
    dom.taskRepeatUntil.disabled = !repeat;
    dom.taskIntervalField.hidden = !isInterval;
    dom.taskIntervalDays.disabled = !isInterval;
    if (!repeat) {
      dom.repeatHint.textContent = series
        ? '保存后会停止循环：本次保留为独立事项，未来未完成的事项会移除。'
        : '不重复时，这是一件独立事项。';
      return;
    }
    const intervalRaw = Number(dom.taskIntervalDays.value);
    const intervalValid = Number.isInteger(intervalRaw) && intervalRaw >= 2 && intervalRaw <= 365;
    const intervalDays = normalizeIntervalDays(intervalRaw);
    const label = isInterval && !intervalValid ? '每隔几天' : recurrenceLabel(repeat, intervalDays);
    const newHint = isInterval
      ? intervalValid ? `每${intervalRaw}天出现一次` : '间隔天数请填写 2–365 之间的整数'
      : RECURRENCE_TYPES[repeat]?.hint || '自动重复';
    if (!series && isInterval && !intervalValid) {
      dom.repeatHint.textContent = `${newHint}。`;
      return;
    }
    dom.repeatHint.textContent = series
      ? `修改会同步到之后未完成的「${label}」事项；循环任务只在实际重复日出现，已完成记录会保留。`
      : `保存后会从开始日期起，${newHint}；开始/结束时间只表示当天时段，不会跨天。`;
  }

  function readTaskFormValues() {
    const categoryId = dom.taskForm.querySelector('input[name="categoryId"]:checked')?.value || '';
    const tags = normalizeTags([...dom.taskTagChoices.querySelectorAll('input[name="taskTags"]:checked')].map((input) => input.value), 8);
    return {
      title: dom.taskTitle.value.trim().slice(0, 80),
      categoryId,
      date: dom.taskDate.value,
      startTime: normalizeTime(dom.taskStartTime.value),
      endTime: normalizeTime(dom.taskEndTime.value),
      ddlDate: isISODate(dom.taskDdlDate.value) ? dom.taskDdlDate.value : '',
      ddlTime: normalizeTime(dom.taskDdlTime.value),
      priority: dom.taskForm.querySelector('input[name="priority"]:checked')?.value || 'normal',
      note: dom.taskNote.value.trim().slice(0, 300),
      tags,
      repeat: RECURRENCE_TYPES[dom.taskRepeat.value] ? dom.taskRepeat.value : '',
      intervalDays: Number(dom.taskIntervalDays.value),
      repeatUntil: isISODate(dom.taskRepeatUntil.value) ? dom.taskRepeatUntil.value : ''
    };
  }

  function rememberCategoryTags(categoryId, tags) {
    const category = getCategory(categoryId);
    if (!category.id) return;
    const merged = normalizeTags([...(category.tags || []), ...normalizeTags(tags)], 12);
    category.tags = merged;
  }

  function createSeriesFromValues(values) {
    const series = {
      id: uid('series'),
      title: values.title,
      categoryId: values.categoryId,
      tags: normalizeTags(values.tags),
      priority: values.priority,
      note: values.note,
      startDate: values.date,
      endDate: values.repeatUntil || '',
      startTime: values.startTime,
      endTime: values.endTime,
      ddlOffset: values.ddlDate ? diffDays(values.ddlDate, values.date) : null,
      ddlTime: values.ddlDate ? values.ddlTime : '',
      recurrence: values.repeat,
      intervalDays: normalizeIntervalDays(values.intervalDays),
      skipDates: [],
      active: true,
      createdAt: new Date().toISOString()
    };
    data.series.push(series);
    return series;
  }

  function applyValuesToTask(task, values, extra = {}) {
    task.title = values.title;
    task.categoryId = values.categoryId;
    task.tags = normalizeTags(values.tags);
    task.startTime = values.startTime;
    task.endTime = values.endTime;
    task.priority = values.priority;
    task.note = values.note;
    if (extra.date) task.date = extra.date;
    if (extra.seriesId !== undefined) task.seriesId = extra.seriesId;
    if (extra.ddlDate !== undefined) {
      task.ddlDate = extra.ddlDate;
      task.ddlTime = extra.ddlDate ? (extra.ddlTime || '') : '';
    } else {
      task.ddlDate = values.ddlDate;
      task.ddlTime = values.ddlDate ? values.ddlTime : '';
    }
    return task;
  }

  function ensureSeriesOccurrence(series, iso) {
    if (!seriesMatchesDate(series, iso) || (series.skipDates || []).includes(iso)) return null;
    const existing = data.tasks.find((task) => task.seriesId === series.id && task.date === iso);
    if (existing) return existing;
    const occurrence = buildSeriesOccurrence(series, iso);
    data.tasks.push(occurrence);
    return occurrence;
  }

  function updateSeriesFromTask(existing, series, values) {
    const anchorDate = existing.date;
    const nextIntervalDays = normalizeIntervalDays(values.intervalDays);
    const frequencyChanged = values.repeat !== series.recurrence;
    const intervalChanged = values.repeat === 'interval'
      && nextIntervalDays !== normalizeIntervalDays(series.intervalDays);
    const patternChanged = frequencyChanged || intervalChanged;
    series.title = values.title;
    series.categoryId = values.categoryId;
    series.tags = normalizeTags(values.tags);
    series.priority = values.priority;
    series.note = values.note;
    series.startTime = values.startTime;
    series.endTime = values.endTime;
    series.ddlOffset = values.ddlDate ? diffDays(values.ddlDate, anchorDate) : null;
    series.ddlTime = values.ddlDate ? values.ddlTime : '';
    series.recurrence = values.repeat;
    series.intervalDays = nextIntervalDays;
    series.endDate = values.repeatUntil || '';
    if (patternChanged) series.startDate = anchorDate;

    if (patternChanged) {
      data.tasks = data.tasks.filter((task) => !(task.seriesId === series.id && task.date > anchorDate && !task.done));
    } else if (series.endDate) {
      data.tasks = data.tasks.filter((task) => !(task.seriesId === series.id && task.date > series.endDate && !task.done));
    }

    data.tasks.forEach((task) => {
      if (task.seriesId !== series.id || task.date < anchorDate) return;
      if (task.done && task.id !== existing.id) return;
      applyValuesToTask(task, values, {
        date: task.date,
        ddlDate: series.ddlOffset === null ? '' : shiftISO(task.date, series.ddlOffset),
        ddlTime: series.ddlTime
      });
    });

    if (series.endDate) {
      data.tasks = data.tasks.filter((task) => !(task.seriesId === series.id && task.date > series.endDate && !task.done));
    }
    ensureSeriesOccurrence(series, anchorDate);
    ensureRecurringTasks();
  }

  function stopSeriesFromTask(existing, series, values) {
    applyValuesToTask(existing, values, { seriesId: '' });
    data.tasks = data.tasks.filter((task) => !(task.seriesId === series.id && task.date > existing.date && !task.done));
    data.tasks.forEach((task) => {
      if (task.seriesId === series.id) task.seriesId = '';
    });
    data.series = data.series.filter((item) => item.id !== series.id);
  }

  function openTaskDialog(options = {}) {
    const { taskId = '', categoryId = '', date = '' } = options;
    const task = taskId ? data.tasks.find((item) => item.id === taskId) : null;
    if (taskId && !task) {
      showToast('没有找到这个事项。', 'error');
      return;
    }
    const series = taskSeries(task);

    dom.taskForm.reset();
    clearFormError(dom.taskFormError, dom.taskForm);

    const defaultCategory = task
      ? task.categoryId
      : data.categories.some((category) => category.id === categoryId)
        ? categoryId
        : ui.view === 'category' && data.categories.some((category) => category.id === ui.categoryId)
          ? ui.categoryId
          : ui.view === 'overview' && ui.agendaFilter !== 'all' && data.categories.some((category) => category.id === ui.agendaFilter)
            ? ui.agendaFilter
            : data.categories[0].id;

    const defaultDate = series
      ? series.startDate
      : task
        ? task.date
        : isISODate(date)
          ? date
          : ui.view === 'overview'
            ? ui.selectedDate
            : todayISO();

    const taskTags = normalizeTags(task?.tags);
    const defaultCategoryTags = getCategory(defaultCategory).tags || [];
    taskTagSelection = new Set(taskTags);
    taskTagExtras = taskTags.filter((tag) => !defaultCategoryTags.includes(tag));

    dom.taskDialogKicker.textContent = task ? 'EDIT TASK' : 'NEW TASK';
    dom.taskDialogTitle.textContent = task ? '编辑事项' : '新建事项';
    dom.taskId.value = task ? task.id : '';
    dom.taskTitle.value = task ? task.title : '';
    dom.taskDate.value = defaultDate;
    dom.taskDate.disabled = Boolean(series);
    dom.taskDateLabel.innerHTML = series ? '系列开始日期' : '安排日期 <em>*</em>';
    dom.taskSeriesNote.hidden = !series;
    dom.taskSeriesNote.textContent = series
      ? `由「${seriesRecurrenceLabel(series)}」循环系列维护，从 ${formatMonthDay(series.startDate)} 开始。修改会同步到之后未完成的事项。`
      : '';
    dom.taskCarryNote.hidden = !task?.carriedFrom || Boolean(series);
    dom.taskCarryNote.textContent = task?.carriedFrom && !series
      ? `原安排 ${formatMonthDay(task.carriedFrom)}，未完成所以自动顺延；修改日期后会按新日期保存。`
      : '';
    dom.taskStartTime.value = task?.startTime || series?.startTime || '';
    dom.taskEndTime.value = task?.endTime || series?.endTime || '';
    dom.taskDdlDate.value = task?.ddlDate || '';
    dom.taskDdlTime.value = task?.ddlTime || '';
    dom.taskNote.value = task?.note || '';
    dom.taskRepeat.value = series?.recurrence || '';
    dom.taskRepeatUntil.value = series?.endDate || '';
    dom.taskIntervalDays.value = series?.intervalDays || 2;
    dom.deleteTaskBtn.hidden = !task;

    dom.taskCategoryChoices.innerHTML = data.categories.map((category) => `
      <label class="category-option" style="${categoryVars(category)}">
        <input type="radio" name="categoryId" value="${esc(category.id)}" ${category.id === defaultCategory ? 'checked' : ''}>
        <span><i></i>${esc(category.name)}</span>
      </label>`).join('');

    renderTaskTagChoices(defaultCategory);
    dom.taskTagInput.value = '';

    const priority = task?.priority || series?.priority || 'normal';
    const priorityRadio = dom.taskForm.querySelector(`input[name="priority"][value="${priority}"]`);
    if (priorityRadio) priorityRadio.checked = true;

    updateRepeatHint();
    dom.taskDialog.querySelector('.modal-body').scrollTop = 0;
    showDialog(dom.taskDialog);
    window.setTimeout(() => dom.taskTitle.focus(), 60);
  }

  function submitTaskForm() {
    clearFormError(dom.taskFormError, dom.taskForm);

    const values = readTaskFormValues();
    const existing = dom.taskId.value ? data.tasks.find((task) => task.id === dom.taskId.value) : null;
    const series = taskSeries(existing);
    const repeatAnchor = series ? existing.date : values.date;

    if (!values.title) {
      showFormError(dom.taskFormError, dom.taskForm, '先给这件事起一个名字吧。', dom.taskTitle);
      return;
    }
    if (!isISODate(values.date)) {
      showFormError(dom.taskFormError, dom.taskForm, '请选择一个有效的开始日期。', dom.taskDate);
      return;
    }
    if (values.endTime && !values.startTime) {
      showFormError(dom.taskFormError, dom.taskForm, '填写结束时间之前，也请填写开始时间。', dom.taskStartTime);
      return;
    }
    if (values.startTime && values.endTime && values.endTime < values.startTime) {
      showFormError(dom.taskFormError, dom.taskForm, '结束时间不能早于开始时间。', dom.taskEndTime);
      return;
    }
    if (!values.ddlDate && dom.taskDdlTime.value) {
      showFormError(dom.taskFormError, dom.taskForm, 'DDL 需要同时选择截止日期。', dom.taskDdlDate);
      return;
    }
    if (!values.categoryId) {
      showFormError(dom.taskFormError, dom.taskForm, '请选择一个归属分类。', dom.taskCategoryChoices);
      return;
    }
    if (values.repeat && values.repeatUntil && isISODate(repeatAnchor) && values.repeatUntil < repeatAnchor) {
      showFormError(dom.taskFormError, dom.taskForm, '重复结束日期不能早于本次事项日期。', dom.taskRepeatUntil);
      return;
    }
    if (values.repeat === 'interval') {
      const days = Number(dom.taskIntervalDays.value);
      if (!Number.isInteger(days) || days < 2 || days > 365) {
        showFormError(dom.taskFormError, dom.taskForm, '间隔天数请填写 2–365 之间的整数。', dom.taskIntervalDays);
        return;
      }
    }

    rememberCategoryTags(values.categoryId, values.tags);

    if (existing && series) {
      if (!values.repeat) {
        stopSeriesFromTask(existing, series, values);
        saveData();
        closeDialog(dom.taskDialog);
        render();
        showToast('已停止循环，本次事项保留为独立事项。');
        return;
      }
      updateSeriesFromTask(existing, series, values);
      saveData();
      closeDialog(dom.taskDialog);
      render();
      showToast('循环任务已更新。');
      return;
    }

    if (existing && values.repeat) {
      const nextSeries = createSeriesFromValues(values);
      applyValuesToTask(existing, values, { seriesId: nextSeries.id, date: values.date });
      ensureSeriesOccurrence(nextSeries, existing.date);
      ensureRecurringTasks();
      saveData();
      closeDialog(dom.taskDialog);
      render();
      showToast(`已设为「${recurrenceLabel(values.repeat, values.intervalDays)}」循环任务。`);
      return;
    }

    if (!existing && values.repeat) {
      const nextSeries = createSeriesFromValues(values);
      ensureSeriesOccurrence(nextSeries, values.date);
      ensureRecurringTasks();
      saveData();
      closeDialog(dom.taskDialog);
      render();
      showToast(`「${recurrenceLabel(values.repeat, values.intervalDays)}」循环任务已创建。`);
      return;
    }

    if (existing) {
      applyValuesToTask(existing, values, { seriesId: '', date: values.date });
      showToast('事项已更新。');
    } else {
      const task = applyValuesToTask({
        id: uid('task'),
        date: values.date,
        done: false,
        createdAt: new Date().toISOString(),
        completedAt: ''
      }, values);
      data.tasks.push(task);
      showToast('新事项已放入日程。');
    }

    saveData();
    closeDialog(dom.taskDialog);
    render();
  }

  function requestDeleteTask(taskId) {
    const task = data.tasks.find((item) => item.id === taskId);
    if (!task) return;
    const series = taskSeries(task);

    if (series) {
      showConfirm({
        title: '删除循环任务',
        message: `「${task.title}」属于「${seriesRecurrenceLabel(series)}」循环系列。可以只跳过这一次，或删除整个系列。`,
        confirmLabel: '删除整个系列',
        secondaryLabel: '仅跳过本次',
        onSecondary: () => {
          series.skipDates = [...new Set([...(series.skipDates || []), task.date])];
          data.tasks = data.tasks.filter((item) => item.id !== taskId);
          saveData();
          if (dom.taskDialog.open) closeDialog(dom.taskDialog);
          render();
          showToast('已跳过这一次，循环系列会继续。');
        },
        onConfirm: () => {
          data.series = data.series.filter((item) => item.id !== series.id);
          data.tasks = data.tasks.filter((item) => item.seriesId !== series.id);
          saveData();
          if (dom.taskDialog.open) closeDialog(dom.taskDialog);
          render();
          showToast('循环系列已删除。');
        }
      });
      return;
    }

    showConfirm({
      title: '删除这个事项？',
      message: `「${task.title}」将被永久删除，这个操作无法撤销。`,
      confirmLabel: '确认删除',
      onConfirm: () => {
        data.tasks = data.tasks.filter((item) => item.id !== taskId);
        saveData();
        if (dom.taskDialog.open) closeDialog(dom.taskDialog);
        render();
        showToast('事项已删除。');
      }
    });
  }

  /* ----------------------------- Category dialog ----------------------------- */

  const ICON_LABELS = {
    briefcase: '公文包',
    star: '星星',
    home: '房子',
    shoppingBag: '购物袋',
    heart: '爱心',
    book: '书本',
    coffee: '咖啡',
    sparkles: '闪光'
  };

  function openCategoryDialog(categoryId = '') {
    const category = categoryId ? data.categories.find((item) => item.id === categoryId) : null;
    if (categoryId && !category) {
      showToast('没有找到这个分类。', 'error');
      return;
    }

    clearFormError(dom.categoryFormError, dom.categoryForm);

    const selectedIcon = category?.icon || 'sparkles';
    const selectedColor = category?.color || CATEGORY_COLORS[data.categories.length % CATEGORY_COLORS.length];

    dom.categoryId.value = category ? category.id : '';
    dom.categoryName.value = category ? category.name : '';
    dom.categoryTags.value = category ? normalizeTags(category.tags).join('、') : '';
    dom.categoryDialogKicker.textContent = category ? 'EDIT CATEGORY' : 'NEW CATEGORY';
    dom.categoryDialogTitle.textContent = category ? '编辑分类' : '新建分类';
    dom.deleteCategoryBtn.hidden = !category;

    dom.categoryIconChoices.innerHTML = CATEGORY_ICONS.map((iconName) => `
      <label class="icon-option" title="${ICON_LABELS[iconName] || iconName}">
        <input type="radio" name="categoryIcon" value="${iconName}" aria-label="${ICON_LABELS[iconName] || iconName}" ${iconName === selectedIcon ? 'checked' : ''}>
        <span>${icon(iconName)}</span>
      </label>`).join('');

    dom.categoryColorChoices.innerHTML = CATEGORY_COLORS.map((color, index) => `
      <label class="color-option" title="${color}">
        <input type="radio" name="categoryColor" value="${color}" aria-label="颜色 ${index + 1}" ${color === selectedColor ? 'checked' : ''}>
        <span style="--swatch:${color}"></span>
      </label>`).join('');

    updateCategoryPreview();
    showDialog(dom.categoryDialog);
    window.setTimeout(() => dom.categoryName.focus(), 60);
  }

  function updateCategoryPreview() {
    const selectedIcon = dom.categoryForm.querySelector('input[name="categoryIcon"]:checked')?.value || 'sparkles';
    const selectedColor = dom.categoryForm.querySelector('input[name="categoryColor"]:checked')?.value || CATEGORY_COLORS[0];
    dom.categoryPreview.style.cssText = categoryVars({ color: selectedColor });
    dom.categoryPreviewIcon.innerHTML = icon(selectedIcon);
    dom.categoryPreviewName.textContent = dom.categoryName.value.trim() || '新分类';
  }

  function submitCategoryForm() {
    clearFormError(dom.categoryFormError, dom.categoryForm);

    const name = dom.categoryName.value.trim();
    const id = dom.categoryId.value;
    const tags = normalizeTags(dom.categoryTags.value, 12);
    const selectedIcon = dom.categoryForm.querySelector('input[name="categoryIcon"]:checked')?.value || 'sparkles';
    const selectedColor = dom.categoryForm.querySelector('input[name="categoryColor"]:checked')?.value || CATEGORY_COLORS[0];

    if (!name) {
      showFormError(dom.categoryFormError, dom.categoryForm, '给这个分类起一个名字吧。', dom.categoryName);
      return;
    }
    const duplicate = data.categories.some((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      showFormError(dom.categoryFormError, dom.categoryForm, '已经有同名分类啦，换一个名字试试。', dom.categoryName);
      return;
    }

    if (id) {
      const category = data.categories.find((item) => item.id === id);
      if (!category) return;
      category.name = name.slice(0, 10);
      category.icon = selectedIcon;
      category.color = selectedColor;
      category.tags = tags;
      closeDialog(dom.categoryDialog);
      saveData();
      render();
      showToast('分类已更新。');
    } else {
      data.categories.push({
        id: uid('category'),
        name: name.slice(0, 10),
        icon: selectedIcon,
        color: selectedColor,
        tags
      });
      closeDialog(dom.categoryDialog);
      saveData();
      render();
      showToast('新分类已添加。');
    }
  }

  function requestDeleteCategory() {
    const id = dom.categoryId.value;
    const category = data.categories.find((item) => item.id === id);
    if (!category) return;

    const remaining = data.categories.filter((item) => item.id !== id);
    if (!remaining.length) {
      showToast('至少需要保留一个分类。', 'error');
      return;
    }

    const standaloneCount = data.tasks.filter((task) => task.categoryId === id && !task.seriesId).length;
    const seriesCount = data.series.filter((series) => series.categoryId === id).length;
    const target = remaining[0];
    const contentCopy = [
      standaloneCount ? `${standaloneCount} 件独立事项` : '',
      seriesCount ? `${seriesCount} 个循环系列` : ''
    ].filter(Boolean).join('和');
    const message = contentCopy
      ? `「${category.name}」里的 ${contentCopy} 会移动到「${target.name}」，分类本身将被删除。`
      : `「${category.name}」将从这个工作台中移除。`;

    showConfirm({
      title: '删除这个分类？',
      message,
      confirmLabel: '确认删除',
      onConfirm: () => {
        data.categories = remaining;
        const movedTags = normalizeTags([
          ...data.tasks.filter((task) => task.categoryId === id).flatMap((task) => normalizeTags(task.tags)),
          ...data.series.filter((series) => series.categoryId === id).flatMap((series) => normalizeTags(series.tags))
        ], 12);
        data.tasks.forEach((task) => {
          if (task.categoryId === id) task.categoryId = target.id;
        });
        data.series.forEach((series) => {
          if (series.categoryId === id) series.categoryId = target.id;
        });
        if (movedTags.length) target.tags = normalizeTags([...(target.tags || []), ...movedTags], 12);
        if (ui.categoryId === id) {
          ui.view = 'overview';
          ui.categoryId = null;
        }
        if (ui.weekFilter === id) ui.weekFilter = 'all';
        ui.tagFilter = 'all';
        closeDialog(dom.categoryDialog);
        saveData();
        render();
        showToast(contentCopy ? `分类已删除，${contentCopy} 已移至「${target.name}」。` : '分类已删除。');
      }
    });
  }

  /* ----------------------------- Expiry actions ----------------------------- */

  function renderExpiryTypeChoices(selectedType = 'food') {
    const selected = EXPIRY_TYPES[selectedType] ? selectedType : 'food';
    dom.expiryTypeChoices.innerHTML = Object.entries(EXPIRY_TYPES).map(([key, meta]) => `
      <label class="expiry-type-option" style="${expiryTypeVars(key)}">
        <input type="radio" name="expiryType" value="${key}" ${key === selected ? 'checked' : ''}>
        <span>${icon(meta.icon)}<span>${esc(meta.label)}</span></span>
      </label>`).join('');
  }

  function getExpiryDateMode() {
    return dom.expiryForm.querySelector('input[name="expiryDateMode"]:checked')?.value === 'calculated'
      ? 'calculated'
      : 'manual';
  }

  function getCalculatedExpiryFromForm() {
    const unit = getShelfLifeUnit(dom.expiryShelfLifeUnit.value);
    const value = normalizeShelfLifeValue(dom.expiryShelfLifeValue.value, unit.key);
    return calculateExpiryDate(dom.expiryProductionDate.value, value, unit.key);
  }

  function updateExpiryCalcPreview() {
    const unit = getShelfLifeUnit(dom.expiryShelfLifeUnit.value);
    dom.expiryShelfLifeValue.max = String(unit.max);
    const calculated = getCalculatedExpiryFromForm();
    if (calculated) {
      const info = getExpiryInfo({ expiryDate: calculated });
      dom.expiryCalcDate.textContent = formatExpiryDate(calculated);
      dom.expiryCalcHint.textContent = info.label;
      dom.expiryCalcPreview.classList.add('is-ready');
    } else {
      dom.expiryCalcDate.textContent = '填写后自动计算';
      dom.expiryCalcHint.textContent = '';
      dom.expiryCalcPreview.classList.remove('is-ready');
    }
  }

  function syncExpiryDateMode(options = {}) {
    const calculatedMode = getExpiryDateMode() === 'calculated';
    dom.expiryManualFields.hidden = calculatedMode;
    dom.expiryCalculatedFields.hidden = !calculatedMode;
    if (calculatedMode) {
      updateExpiryCalcPreview();
    } else if (options.useCalculated) {
      const calculated = getCalculatedExpiryFromForm();
      if (calculated) dom.expiryDate.value = calculated;
    }
  }

  function openExpiryDialog(expiryId = '') {
    const record = expiryId ? (data.expiries || []).find((item) => item.id === expiryId) : null;
    if (expiryId && !record) {
      showToast('没有找到这条期限记录。', 'error');
      return;
    }

    clearFormError(dom.expiryFormError, dom.expiryForm);
    const dateMode = record?.dateMode === 'calculated' ? 'calculated' : 'manual';
    const modeRadio = dom.expiryForm.querySelector(`input[name="expiryDateMode"][value="${dateMode}"]`);
    if (modeRadio) modeRadio.checked = true;

    dom.expiryId.value = record ? record.id : '';
    dom.expiryTitle.value = record ? record.title : '';
    dom.expiryDate.value = record ? record.expiryDate : shiftISO(todayISO(), 7);
    dom.expiryProductionDate.value = record?.productionDate || '';
    dom.expiryShelfLifeValue.value = record?.shelfLifeValue ?? '';
    const unit = getShelfLifeUnit(record?.shelfLifeUnit || 'months');
    dom.expiryShelfLifeUnit.value = unit.key;
    dom.expiryShelfLifeValue.max = String(unit.max);
    dom.expiryNote.value = record ? record.note : '';
    dom.expiryDialogKicker.textContent = record ? 'EDIT EXPIRY' : 'NEW EXPIRY';
    dom.expiryDialogTitle.textContent = record ? '编辑期限记录' : '记录一项期限';
    dom.deleteExpiryBtn.hidden = !record;
    renderExpiryTypeChoices(record?.type || 'food');
    syncExpiryDateMode();
    showDialog(dom.expiryDialog);
    window.setTimeout(() => dom.expiryTitle.focus(), 60);
  }

  function submitExpiryForm() {
    clearFormError(dom.expiryFormError, dom.expiryForm);

    const id = dom.expiryId.value;
    const title = dom.expiryTitle.value.trim();
    const note = dom.expiryNote.value.trim();
    const type = dom.expiryForm.querySelector('input[name="expiryType"]:checked')?.value || 'food';
    const dateMode = getExpiryDateMode();
    let expiryDate = dom.expiryDate.value;
    let productionDate = '';
    let shelfLifeValue = null;
    let shelfLifeUnit = 'days';

    if (!title) {
      showFormError(dom.expiryFormError, dom.expiryForm, '写下要记录的东西吧，比如「酸奶」或「视频会员」。', dom.expiryTitle);
      return;
    }

    if (dateMode === 'calculated') {
      const unit = getShelfLifeUnit(dom.expiryShelfLifeUnit.value);
      shelfLifeUnit = unit.key;
      shelfLifeValue = normalizeShelfLifeValue(dom.expiryShelfLifeValue.value, shelfLifeUnit);
      productionDate = dom.expiryProductionDate.value;
      if (!isISODate(productionDate)) {
        showFormError(dom.expiryFormError, dom.expiryForm, '选一个有效的生产日期。', dom.expiryProductionDate);
        return;
      }
      if (!shelfLifeValue) {
        showFormError(dom.expiryFormError, dom.expiryForm, `保质期要填写 1 到 ${unit.max} 之间的数字。`, dom.expiryShelfLifeValue);
        return;
      }
      expiryDate = calculateExpiryDate(productionDate, shelfLifeValue, shelfLifeUnit);
      if (!isISODate(expiryDate)) {
        showFormError(dom.expiryFormError, dom.expiryForm, '没有算出有效的到期日，请检查生产日期和保质期。', dom.expiryShelfLifeValue);
        return;
      }
    } else if (!isISODate(expiryDate)) {
      showFormError(dom.expiryFormError, dom.expiryForm, '选一个有效的到期日。', dom.expiryDate);
      return;
    }

    if (id) {
      const record = (data.expiries || []).find((item) => item.id === id);
      if (!record) return;
      record.title = title.slice(0, 80);
      record.type = EXPIRY_TYPES[type] ? type : 'other';
      record.expiryDate = expiryDate;
      record.dateMode = dateMode;
      record.productionDate = productionDate;
      record.shelfLifeValue = shelfLifeValue;
      record.shelfLifeUnit = shelfLifeUnit;
      record.note = note.slice(0, 300);
      closeDialog(dom.expiryDialog);
      saveData();
      render();
      showToast('期限记录已更新。');
    } else {
      data.expiries.push({
        id: uid('expiry'),
        title: title.slice(0, 80),
        type: EXPIRY_TYPES[type] ? type : 'other',
        expiryDate,
        dateMode,
        productionDate,
        shelfLifeValue,
        shelfLifeUnit,
        note: note.slice(0, 300),
        createdAt: new Date().toISOString()
      });
      ui.expiryFilter = 'all';
      closeDialog(dom.expiryDialog);
      saveData();
      if (ui.view !== 'expiry') switchView('expiry');
      else render();
      const calculatedNote = dateMode === 'calculated' ? '，按保质期计算' : '';
      showToast(`已记录「${title.slice(0, 20)}」，${formatMonthDay(expiryDate)}到期${calculatedNote}。`);
    }
  }

  function requestDeleteExpiry(expiryId) {
    const record = (data.expiries || []).find((item) => item.id === expiryId);
    if (!record) return;
    showConfirm({
      title: '删除这条期限记录？',
      message: `「${record.title}」将从期限记录中移除，事项和分类不会受到影响。`,
      confirmLabel: '删除记录',
      onConfirm: () => {
        data.expiries = data.expiries.filter((item) => item.id !== expiryId);
        if (dom.expiryId.value === expiryId && dom.expiryDialog.open) closeDialog(dom.expiryDialog);
        saveData();
        render();
        showToast('期限记录已删除。');
      }
    });
  }

  /* ----------------------------- Task actions & navigation ----------------------------- */

  function toggleTask(taskId) {
    const task = data.tasks.find((item) => item.id === taskId);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : '';
    saveData();
    render();
    showToast(task.done ? '完成一件事，今天又多了一点成就感。' : '已恢复为待办。');
  }

  function switchView(view) {
    ui.view = view;
    closeSidebar();
    closeSearch();
    if (view === 'overview') {
      const selected = parseISO(ui.selectedDate);
      ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    if (view === 'week') {
      ui.weekAnchor = startOfWeekISO(todayISO());
    }
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openCategory(categoryId) {
    if (!data.categories.some((category) => category.id === categoryId)) return;
    ui.view = 'category';
    ui.categoryId = categoryId;
    ui.categoryFilter = 'all';
    ui.tagFilter = 'all';
    closeSidebar();
    closeSearch();
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function handleAction(button) {
    const action = button.dataset.action;
    const date = button.dataset.date;
    const taskId = button.dataset.taskId;
    const categoryId = button.dataset.categoryId;
    const expiryId = button.dataset.expiryId;

    switch (action) {
      case 'new-task':
        closeSidebar();
        closeSearch();
        openTaskDialog({ categoryId, date });
        break;

      case 'new-expiry':
        closeSidebar();
        closeSearch();
        openExpiryDialog();
        break;

      case 'edit-expiry':
        openExpiryDialog(expiryId);
        break;

      case 'delete-expiry':
        requestDeleteExpiry(expiryId);
        break;

      case 'set-expiry-filter':
        ui.expiryFilter = button.dataset.filter || 'all';
        render();
        break;

      case 'go-expiry':
        ui.expiryFilter = 'all';
        switchView('expiry');
        break;

      case 'new-category':
        closeSidebar();
        openCategoryDialog();
        break;

      case 'edit-category':
        openCategoryDialog(categoryId || ui.categoryId);
        break;

      case 'edit-task':
        openTaskDialog({ taskId });
        break;

      case 'delete-task':
        requestDeleteTask(taskId);
        break;

      case 'toggle-task':
        toggleTask(taskId);
        break;

      case 'prev-date': {
        ui.selectedDate = shiftISO(ui.selectedDate, -1);
        const selected = parseISO(ui.selectedDate);
        ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
        render();
        break;
      }

      case 'next-date': {
        ui.selectedDate = shiftISO(ui.selectedDate, 1);
        const selected = parseISO(ui.selectedDate);
        ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
        render();
        break;
      }

      case 'today-date': {
        ui.selectedDate = todayISO();
        const selected = parseISO(ui.selectedDate);
        ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
        render();
        break;
      }

      case 'calendar-prev':
      case 'calendar-next': {
        const delta = action === 'calendar-prev' ? -1 : 1;
        ui.calendarCursor = new Date(ui.calendarCursor.getFullYear(), ui.calendarCursor.getMonth() + delta, 1);
        render();
        break;
      }

      case 'prev-week':
        ui.weekAnchor = shiftISO(ui.weekAnchor, -7);
        render();
        break;

      case 'next-week':
        ui.weekAnchor = shiftISO(ui.weekAnchor, 7);
        render();
        break;

      case 'this-week':
        ui.weekAnchor = startOfWeekISO(todayISO());
        render();
        break;

      case 'go-week':
        ui.view = 'week';
        ui.weekAnchor = startOfWeekISO(ui.selectedDate);
        closeSidebar();
        closeSearch();
        render();
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;

      case 'set-category-filter':
        ui.categoryFilter = button.dataset.filter || 'all';
        render();
        break;

      case 'set-agenda-filter':
        ui.agendaFilter = button.dataset.filter || 'all';
        render();
        break;

      case 'set-tag-filter':
        ui.tagFilter = button.dataset.filter || 'all';
        render();
        break;

      case 'set-week-filter':
        ui.weekFilter = button.dataset.filter || 'all';
        render();
        break;

      default:
        break;
    }
  }

  function setSelectedDate(iso) {
    if (!isISODate(iso)) return;
    ui.selectedDate = iso;
    const selected = parseISO(iso);
    ui.calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    render();
  }

  /* ----------------------------- Sidebar ----------------------------- */

  function openSidebar() {
    dom.sidebar.classList.add('is-open');
    dom.sidebarBackdrop.classList.add('is-visible');
    dom.menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeSidebar() {
    if (!dom.sidebar.classList.contains('is-open')) return;
    dom.sidebar.classList.remove('is-open');
    dom.sidebarBackdrop.classList.remove('is-visible');
    dom.menuBtn.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('nav-open');
  }

  /* ----------------------------- Local assistant ----------------------------- */

  const ASSISTANT_WEEKDAY_INDEX = {
    一: 0, 二: 1, 三: 2, 四: 3, 五: 4, 六: 5, 日: 6, 天: 6,
    1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6
  };

  const ASSISTANT_GREETING = '你好，我是拾光助手。可以直接告诉我要做什么，例如：\n明天 10:00 写周报 @工作 #汇报\n每天 8:00 晨跑 @生活 #健康\n完成晨跑\n今天还有什么 / 打开本周\n\n我只在本机操作数据，不联网。';

  const ASSISTANT_HELP = '目前支持的指令：\n• 新建：明天 15:00 提交周报 @工作 #汇报\n• 循环：每天 8:00 晨跑 @生活 #健康\n• 完成：完成晨跑 / 把晨跑标记完成\n• 查询：今天还有什么 / 明天安排 / 本周事项\n• 跳转：打开本周 / 打开期限记录 / 打开工作 / 新建事项\n• 搜索：搜索 发票\n循环任务和标签会直接写进页面，和手动操作同一份数据。';

  function openAssistant() {
    if (!assistantStarted) {
      assistantStarted = true;
      addAssistantMessage('assistant', ASSISTANT_GREETING);
    }
    showDialog(dom.assistantDialog);
    window.setTimeout(() => dom.assistantInput.focus(), 80);
  }

  function addAssistantMessage(role, text) {
    const message = document.createElement('div');
    message.className = `assistant-msg${role === 'user' ? ' is-user' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    bubble.textContent = text;
    const stamp = document.createElement('span');
    stamp.className = 'assistant-stamp';
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    stamp.textContent = `${role === 'user' ? '你' : '拾光助手'} · ${time}`;
    message.append(bubble, stamp);
    dom.assistantMessages.append(message);
    dom.assistantMessages.scrollTop = dom.assistantMessages.scrollHeight;
  }

  function chineseNumber(value) {
    const text = String(value || '').trim();
    if (/^\d+$/.test(text)) return Number(text);
    const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
    if (text === '十') return 10;
    if (text.includes('十')) {
      const [left, right] = text.split('十');
      return (left ? digits[left] ?? 0 : 1) * 10 + (right ? digits[right] ?? 0 : 0);
    }
    return digits[text] ?? NaN;
  }

  function normalizeAssistantHour(hour, period) {
    if (!Number.isFinite(hour)) return NaN;
    let next = Math.max(0, Math.min(23, hour));
    if (period && ['下午', '傍晚', '晚上', '晚'].includes(period) && next < 12) next += 12;
    if (period === '中午' && next < 11) next += 12;
    return next;
  }

  function extractAssistantTime(raw) {
    let text = raw;
    let startTime = '';
    const colon = text.match(/(凌晨|早上|上午|中午|下午|傍晚|晚上|晚)?\s*(\d{1,2})[:：](\d{2})/);
    if (colon) {
      const hour = normalizeAssistantHour(Number(colon[2]), colon[1]);
      const minute = Math.max(0, Math.min(59, Number(colon[3])));
      startTime = `${pad(hour)}:${pad(minute)}`;
      text = text.replace(colon[0], ' ');
    } else {
      const point = text.match(/(凌晨|早上|上午|中午|下午|傍晚|晚上|晚)?\s*([0-9一二三四五六七八九十两]{1,3})\s*点\s*(半|([0-9一二三四五六七八九十]{1,2})\s*分?)?/);
      if (point) {
        const hour = normalizeAssistantHour(chineseNumber(point[2]), point[1]);
        let minute = 0;
        if (point[3] === '半') minute = 30;
        else if (point[4]) minute = chineseNumber(point[4]);
        if (Number.isFinite(hour)) startTime = `${pad(hour)}:${pad(Math.max(0, Math.min(59, minute)))}`;
        text = text.replace(point[0], ' ');
      }
    }
    return { startTime, text };
  }

  function nextWeekdayISO(index, nextWeek = false) {
    const today = todayISO();
    const base = startOfWeekISO(today);
    let date = shiftISO(base, index + (nextWeek ? 7 : 0));
    if (!nextWeek && date < today) date = shiftISO(date, 7);
    return date;
  }

  function nextMonthlyISO(day) {
    const today = todayISO();
    const now = parseISO(today);
    for (let index = 0; index < 24; index += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() + index, day);
      if (date.getDate() !== day) continue;
      const iso = toISO(date);
      if (iso >= today) return iso;
    }
    return today;
  }

  function extractAssistantDate(raw, recurrenceInfo) {
    let text = raw;
    let date = '';

    const isoMatch = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoMatch) {
      const candidate = `${isoMatch[1]}-${pad(Number(isoMatch[2]))}-${pad(Number(isoMatch[3]))}`;
      if (isISODate(candidate)) date = candidate;
      text = text.replace(isoMatch[0], ' ');
    }

    if (!date) {
      const monthDay = text.match(/(\d{1,2}|[一二三四五六七八九十]{1,3})月(\d{1,2}|[一二三四五六七八九十]{1,3})[日号]?/);
      if (monthDay) {
        const month = chineseNumber(monthDay[1]);
        const day = chineseNumber(monthDay[2]);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const year = new Date().getFullYear();
          const candidate = `${year}-${pad(month)}-${pad(day)}`;
          if (isISODate(candidate)) date = candidate;
        }
        text = text.replace(monthDay[0], ' ');
      }
    }

    if (!date) {
      const relative = text.match(/(大后天|后天|明天|明日|今天|今日)/);
      if (relative) {
        const offset = { 大后天: 3, 后天: 2, 明天: 1, 明日: 1, 今天: 0, 今日: 0 }[relative[1]];
        date = shiftISO(todayISO(), offset);
        text = text.replace(relative[0], ' ');
      }
    }

    if (!date) {
      const nextWeek = text.match(/下(?:个)?(?:周|星期|礼拜)([一二三四五六日天1-7])/);
      if (nextWeek) {
        date = nextWeekdayISO(ASSISTANT_WEEKDAY_INDEX[nextWeek[1]], true);
        text = text.replace(nextWeek[0], ' ');
      } else {
        const weekday = text.match(/(?:这|本)?(?:周|星期|礼拜)([一二三四五六日天1-7])/);
        if (weekday) {
          date = nextWeekdayISO(ASSISTANT_WEEKDAY_INDEX[weekday[1]], false);
          text = text.replace(weekday[0], ' ');
        }
      }
    }

    if (!date) {
      if (recurrenceInfo?.type === 'weekly' && recurrenceInfo.weekday !== null) {
        date = nextWeekdayISO(recurrenceInfo.weekday, false);
      } else if (recurrenceInfo?.type === 'monthly' && recurrenceInfo.day) {
        date = nextMonthlyISO(recurrenceInfo.day);
      } else {
        date = todayISO();
      }
    }

    return { date, text };
  }

  function extractAssistantRecurrence(raw) {
    let text = raw;
    let type = '';
    let weekday = null;
    let day = 0;
    let intervalDays = 2;

    let match = text.match(/每个工作日|工作日/);
    if (match) {
      type = 'weekdays';
      text = text.replace(match[0], ' ');
    }
    if (!type) {
      match = text.match(/每天|每日/);
      if (match) {
        type = 'daily';
        text = text.replace(match[0], ' ');
      }
    }
    if (!type) {
      match = text.match(/每(?:隔)?\s*(\d{1,3}|[一二三四五六七八九十两]{1,3})\s*天(?:一次)?/);
      if (match) {
        const days = chineseNumber(match[1]);
        if (Number.isFinite(days) && days >= 1) {
          if (days === 1) {
            type = 'daily';
          } else {
            type = 'interval';
            intervalDays = Math.min(365, Math.trunc(days));
          }
          text = text.replace(match[0], ' ');
        }
      }
    }
    if (!type) {
      match = text.match(/隔天|隔一天|一天隔一天/);
      if (match) {
        type = 'interval';
        intervalDays = 2;
        text = text.replace(match[0], ' ');
      }
    }
    if (!type) {
      match = text.match(/每(?:周|星期|礼拜)([一二三四五六日天1-7])/);
      if (match) {
        type = 'weekly';
        weekday = ASSISTANT_WEEKDAY_INDEX[match[1]];
        text = text.replace(match[0], ' ');
      }
    }
    if (!type) {
      match = text.match(/每月\s*(\d{1,2}|[一二三四五六七八九十]{1,3})\s*[日号]/);
      if (match) {
        type = 'monthly';
        day = chineseNumber(match[1]);
        text = text.replace(match[0], ' ');
      }
    }
    if (!type) {
      match = text.match(/每月/);
      if (match) {
        type = 'monthly';
        day = parseISO(todayISO()).getDate();
        text = text.replace(match[0], ' ');
      }
    }

    return { type, weekday, day, intervalDays, text };
  }

  function findAssistantCategory(name) {
    const target = String(name || '').replace(/分类$/, '').trim();
    if (!target) return null;
    return data.categories.find((category) => category.name === target)
      || data.categories.find((category) => category.name.startsWith(target) || target.startsWith(category.name))
      || null;
  }

  function parseAssistantTask(raw) {
    const original = raw.trim();
    const queryLike = /(什么|多少|哪些|吗|呢|怎么|如何|还有|安排吗)/.test(original);
    const commandPrefix = /^(帮我|请|麻烦|劳驾)?\s*(添加|新建|新增|创建|加一个|加个|安排|提醒我|记一下|记录|设置)/.test(original);
    const hasDateToken = /(今天|今日|明天|明日|后天|大后天|(?:这|本|下)?(?:周|星期|礼拜)[一二三四五六日天1-7]|\d{1,2}月\d{1,2}[日号]?|\d{4}[-/]\d{1,2}[-/]\d{1,2})/.test(original);
    let text = original;

    const recurrenceInfo = extractAssistantRecurrence(text);
    text = recurrenceInfo.text;

    const tags = [];
    text = text.replace(/#([^\s#，,。；;@]+)/g, (match, tag) => {
      tags.push(tag);
      return ' ';
    });

    let explicitCategory = null;
    text = text.replace(/@([^\s@，,。；;]+)/g, (match, name) => {
      explicitCategory = findAssistantCategory(name) || explicitCategory;
      return ' ';
    });

    let priority = 'normal';
    if (/[!！]紧急/.test(text)) {
      priority = 'urgent';
      text = text.replace(/[!！]紧急/g, ' ');
    } else if (/[!！]重要/.test(text)) {
      priority = 'important';
      text = text.replace(/[!！]重要/g, ' ');
    }

    const timeInfo = extractAssistantTime(text);
    const startTime = timeInfo.startTime;
    const dateInfo = extractAssistantDate(timeInfo.text, recurrenceInfo);
    text = dateInfo.text;

    const mentionedCategory = data.categories.find((category) => text.includes(category.name));
    const category = explicitCategory
      || mentionedCategory
      || data.categories.find((category) => category.id === assistantLastCategoryId)
      || data.categories[0];

    text = text
      .replace(/^(帮我|请|麻烦|劳驾)\s*/, '')
      .replace(/^(添加|新建|新增|创建|加一个|加个|安排|提醒我|记一下|记录|设置|在|于)\s*/, '')
      .replace(/^(一个|一件)\s*/, '')
      .replace(/[，,。；;：:、]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const hasIntent = commandPrefix
      || Boolean(recurrenceInfo.type)
      || Boolean(tags.length)
      || /@/.test(original)
      || Boolean(startTime)
      || (hasDateToken && !queryLike);
    if (!hasIntent) return null;

    const title = text && !/^(事项|任务|东西|事情)$/.test(text) ? text.slice(0, 80) : '新事项';

    return {
      values: {
        title,
        categoryId: category?.id || data.categories[0].id,
        date: dateInfo.date,
        startTime,
        endTime: '',
        ddlDate: '',
        ddlTime: '',
        priority,
        note: '',
        tags,
        repeat: recurrenceInfo.type,
        intervalDays: recurrenceInfo.intervalDays,
        repeatUntil: ''
      },
      category
    };
  }

  function assistantDateSummary(iso, label) {
    const tasks = agendaTasksForDate(iso);
    if (!tasks.length) return `${label}（${formatMonthDay(iso)} ${weekdayName(iso)}）还没有安排。可以直接说「${label === '今天' ? '今天' : formatMonthDay(iso)} 15:00 做点什么」。`;
    const pending = tasks.filter((task) => !task.done);
    const orderedTasks = [...tasks].sort((a, b) => {
      const aOngoing = isOngoingTask(a, iso);
      const bOngoing = isOngoingTask(b, iso);
      if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
      return 0;
    });
    const lines = orderedTasks.slice(0, 7).map((task) => {
      const series = taskSeries(task);
      const ongoing = isOngoingTask(task, iso);
      return `${task.done ? '✓' : '○'} ${ongoing ? '进行中' : task.startTime || '全天'} ${task.title}${series ? ` · ${seriesRecurrenceLabel(series)}` : ''}${ongoing ? ` · 截止 ${formatMonthDay(task.ddlDate)}` : ''}${task.carriedFrom ? ' · 顺延' : ''}`;
    });
    return `${label}（${formatMonthDay(iso)} ${weekdayName(iso)}）共 ${tasks.length} 项，${pending.length ? `${pending.length} 项待办` : '已经全部完成'}。\n${lines.join('\n')}${tasks.length > 7 ? `\n…还有 ${tasks.length - 7} 项` : ''}`;
  }

  function assistantWeekSummary() {
    const start = startOfWeekISO(todayISO());
    const end = shiftISO(start, 6);
    const tasks = data.tasks.filter((task) => task.date >= start && task.date <= end);
    if (!tasks.length) return `本周（${formatWeekRange(start)}）还没有安排，可以先放下一件期待的小事。`;
    const done = tasks.filter((task) => task.done).length;
    const pendingTasks = tasks.filter((task) => !task.done).sort(compareTasksBySchedule);
    const pct = Math.round((done / tasks.length) * 100);
    const lines = pendingTasks.slice(0, 5).map((task) => `○ ${formatMonthDay(task.date)} ${task.startTime || '全天'} ${task.title}${task.carriedFrom ? ' · 顺延' : ''}`);
    return `本周（${formatWeekRange(start)}）共 ${tasks.length} 项，已完成 ${done} 项，完成度 ${pct}%。${lines.length ? `\n接下来：\n${lines.join('\n')}` : '\n本周事项都完成了。'}${pendingTasks.length > 5 ? `\n…还有 ${pendingTasks.length - 5} 项待办` : ''}`;
  }

  function completeAssistantTask(task) {
    task.done = true;
    task.completedAt = new Date().toISOString();
    saveData();
    render();
    return `已完成「${task.title}」 · ${formatMonthDay(task.date)} ${weekdayName(task.date)}。`;
  }

  function assistantComplete(raw) {
    let target = raw.trim().replace(/^把\s*/, '');
    target = target.replace(/^(完成|勾掉|标记完成|做完了|搞定)\s*/, '');
    target = target.replace(/\s*(标记完成|完成|勾掉|做完了|搞定)$/, '').trim();
    if (!target) return '告诉我要完成哪一件，例如「完成晨跑」。';

    const today = todayISO();
    const todayMatches = agendaTasksForDate(today).filter((task) => task.title.includes(target));
    const todayPending = todayMatches.filter((task) => !task.done);
    if (todayPending.length === 1) return completeAssistantTask(todayPending[0]);
    if (todayPending.length > 1) {
      return `今天找到多件相关事项：\n${todayPending.map((task) => `○ ${task.startTime || '全天'} ${task.title}`).join('\n')}\n请写得更具体一些。`;
    }
    const todayDone = todayMatches.find((task) => task.done);
    if (todayDone) return `「${todayDone.title}」今天已经完成啦。`;

    const seen = new Set();
    const matches = data.tasks
      .filter((task) => !task.done && task.title.includes(target))
      .sort(compareTasksBySchedule)
      .filter((task) => {
        const key = task.seriesId || task.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    if (!matches.length) return `没有找到包含「${target}」的待办事项。`;
    const exact = matches.filter((task) => task.title === target);
    if (exact.length === 1) return completeAssistantTask(exact[0]);
    if (matches.length === 1) return completeAssistantTask(matches[0]);
    return `找到多件相关事项：\n${matches.slice(0, 5).map((task) => `○ ${formatMonthDay(task.date)} ${task.title}`).join('\n')}\n请写得更具体一些。`;
  }

  function assistantAdd(raw) {
    const parsed = parseAssistantTask(raw);
    if (!parsed) return null;
    const { values, category } = parsed;
    rememberCategoryTags(values.categoryId, values.tags);
    assistantLastCategoryId = values.categoryId;

    if (values.repeat) {
      const series = createSeriesFromValues(values);
      ensureSeriesOccurrence(series, values.date);
      ensureRecurringTasks();
      saveData();
      render();
      const dateText = `${formatMonthDay(values.date)} ${weekdayName(values.date)}`;
      return `已创建「${recurrenceLabel(values.repeat, values.intervalDays)}」循环任务：${values.title}\n从 ${dateText}${values.startTime ? ` ${values.startTime}` : ''} 开始${values.tags.length ? ` · #${values.tags.join(' #')}` : ''}。`;
    }

    const task = applyValuesToTask({
      id: uid('task'),
      date: values.date,
      done: false,
      createdAt: new Date().toISOString(),
      completedAt: ''
    }, values);
    data.tasks.push(task);
    saveData();
    render();
    return `已添加「${values.title}」\n${formatMonthDay(values.date)} ${weekdayName(values.date)}${values.startTime ? ` ${values.startTime}` : ''} · ${category?.name || getCategory(values.categoryId).name}${values.tags.length ? ` · #${values.tags.join(' #')}` : ''}。`;
  }

  function executeAssistantCommand(raw) {
    const text = raw.trim();
    if (!text) return { message: '写下你想做的事就好。' };

    if (/^(帮助|help|你能做什么|怎么用|指令|使用说明)/i.test(text)) {
      return { message: ASSISTANT_HELP };
    }

    if (/^(新建事项|新建一个事项|打开新建|新建任务)$/.test(text)) {
      return {
        close: true,
        after: () => openTaskDialog(),
        toast: '已打开新建事项。'
      };
    }

    const navMatch = text.match(/^(?:打开|去|看看|查看|切换到|切到)\s*(.+)$/);
    if (navMatch) {
      const target = navMatch[1].replace(/分类$/, '').trim();
      if (['总览', '首页', '概览'].includes(target)) {
        return { close: true, after: () => switchView('overview'), toast: '已回到总览。' };
      }
      if (['本周', '时间线', '周视图'].includes(target)) {
        return { close: true, after: () => switchView('week'), toast: '已打开本周时间线。' };
      }
      if (['期限记录', '期限', '保质期', '到期记录'].includes(target)) {
        return {
          close: true,
          after: () => {
            ui.expiryFilter = 'all';
            switchView('expiry');
          },
          toast: '已打开期限记录。'
        };
      }
      const category = findAssistantCategory(target);
      if (category) {
        return {
          close: true,
          after: () => openCategory(category.id),
          toast: `已打开「${category.name}」分类。`
        };
      }
    }

    if (/^(搜索|查找|查一下|找一下|找)\s*/.test(text)) {
      const query = text.replace(/^(搜索|查找|查一下|找一下|找)\s*/, '').trim();
      if (query) {
        return {
          close: true,
          after: () => {
            dom.searchInput.value = query;
            renderSearchResults(query);
            dom.searchInput.focus();
          },
          toast: `正在搜索「${query}」。`
        };
      }
    }

    if (/^(今天|今日)(呢|有什么|还有什么|的安排|安排|待办|事项|要做|计划|怎么安排)?$/.test(text)
      || /^(今天|今日).*(还有什么|有什么安排|待办|事项|计划)/.test(text)) {
      return { message: assistantDateSummary(todayISO(), '今天') };
    }

    if (/^(明天|明日)(呢|有什么|还有什么|的安排|安排|待办|事项|要做|计划|怎么安排)?$/.test(text)
      || /^(明天|明日).*(还有什么|有什么安排|待办|事项|计划)/.test(text)) {
      return { message: assistantDateSummary(shiftISO(todayISO(), 1), '明天') };
    }

    if (/^(本周|这周|这一周)(呢|有什么|还有什么|的安排|安排|待办|事项|计划|多少)?$/.test(text)
      || /(本周|这周|这一周).*(安排|什么|多少|待办|事项|计划)/.test(text)) {
      return { message: assistantWeekSummary() };
    }

    const completeIntent = /^(完成|勾掉|标记完成|做完了|搞定)/.test(text)
      || /^把.+?(标记完成|完成|勾掉|做完了|搞定)$/.test(text);
    if (completeIntent) {
      return { message: assistantComplete(text) };
    }

    const added = assistantAdd(text);
    if (added) return { message: added };

    return {
      message: '这个指令我还没学会。\n' + ASSISTANT_HELP
    };
  }

  function runAssistant(raw) {
    const text = String(raw || '').trim();
    if (!text) return;
    dom.assistantInput.value = '';
    dom.assistantInput.style.height = '';
    addAssistantMessage('user', text);
    const result = executeAssistantCommand(text);
    if (result.message) addAssistantMessage('assistant', result.message);
    if (result.close) {
      closeDialog(dom.assistantDialog);
      window.setTimeout(() => {
        if (typeof result.after === 'function') result.after();
        if (result.toast) showToast(result.toast);
      }, 20);
    }
  }

  /* ----------------------------- Events ----------------------------- */

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const closeTrigger = target.closest('[data-close-dialog]');
      if (closeTrigger) {
        closeDialog(document.getElementById(closeTrigger.dataset.closeDialog));
        return;
      }

      const searchTask = target.closest('[data-search-task]');
      if (searchTask) {
        const id = searchTask.dataset.searchTask;
        closeSearch();
        openTaskDialog({ taskId: id });
        return;
      }

      const searchExpiry = target.closest('[data-search-expiry]');
      if (searchExpiry) {
        const id = searchExpiry.dataset.searchExpiry;
        closeSearch();
        openExpiryDialog(id);
        return;
      }

      const navButton = target.closest('[data-view]');
      if (navButton) {
        const view = navButton.dataset.view;
        if (view === 'overview' || view === 'week' || view === 'expiry') switchView(view);
        return;
      }

      const categoryButton = target.closest('[data-category-nav]');
      if (categoryButton) {
        openCategory(categoryButton.dataset.categoryNav);
        return;
      }

      const calendarDay = target.closest('[data-calendar-date]');
      if (calendarDay) {
        setSelectedDate(calendarDay.dataset.calendarDate);
        return;
      }

      const actionButton = target.closest('[data-action]');
      if (actionButton) {
        handleAction(actionButton);
        return;
      }

      if (!dom.searchWrap.contains(target)) closeSearch();
    });

    dom.menuBtn.addEventListener('click', () => {
      if (dom.sidebar.classList.contains('is-open')) closeSidebar();
      else openSidebar();
    });

    dom.sidebarBackdrop.addEventListener('click', closeSidebar);

    dom.taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      submitTaskForm();
    });

    dom.taskCategoryChoices.addEventListener('change', (event) => {
      if (event.target.name !== 'categoryId') return;
      taskTagSelection.clear();
      taskTagExtras = [];
      renderTaskTagChoices(event.target.value);
      dom.taskTagInput.value = '';
    });

    dom.taskTagChoices.addEventListener('change', (event) => {
      if (event.target.name !== 'taskTags') return;
      if (event.target.checked) taskTagSelection.add(event.target.value);
      else taskTagSelection.delete(event.target.value);
    });

    dom.addTaskTagBtn.addEventListener('click', addTaskTagFromInput);

    dom.taskTagInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addTaskTagFromInput();
      }
    });

    dom.taskRepeat.addEventListener('change', updateRepeatHint);
    dom.taskIntervalDays.addEventListener('input', updateRepeatHint);

    dom.categoryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      submitCategoryForm();
    });

    dom.categoryForm.addEventListener('input', updateCategoryPreview);
    dom.categoryForm.addEventListener('change', updateCategoryPreview);

    dom.expiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      submitExpiryForm();
    });

    dom.expiryForm.addEventListener('change', (event) => {
      if (event.target.name === 'expiryDateMode') {
        syncExpiryDateMode({ useCalculated: true });
      } else if (event.target.id === 'expiryShelfLifeUnit') {
        updateExpiryCalcPreview();
      }
    });

    dom.expiryForm.addEventListener('input', (event) => {
      if (event.target.id === 'expiryProductionDate' || event.target.id === 'expiryShelfLifeValue') {
        updateExpiryCalcPreview();
      }
    });

    dom.expiryForm.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        submitExpiryForm();
      }
    });

    dom.deleteExpiryBtn.addEventListener('click', () => {
      if (dom.expiryId.value) requestDeleteExpiry(dom.expiryId.value);
    });

    dom.assistantFab.addEventListener('click', openAssistant);

    dom.assistantForm.addEventListener('submit', (event) => {
      event.preventDefault();
      runAssistant(dom.assistantInput.value);
    });

    dom.assistantInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        runAssistant(dom.assistantInput.value);
      }
    });

    dom.assistantInput.addEventListener('input', () => {
      dom.assistantInput.style.height = 'auto';
      dom.assistantInput.style.height = `${Math.min(dom.assistantInput.scrollHeight, 94)}px`;
    });

    dom.assistantSuggestions.addEventListener('click', (event) => {
      const button = event.target.closest('[data-assistant-prompt]');
      if (!button) return;
      runAssistant(button.dataset.assistantPrompt || '');
    });

    dom.deleteTaskBtn.addEventListener('click', () => {
      if (dom.taskId.value) requestDeleteTask(dom.taskId.value);
    });

    dom.deleteCategoryBtn.addEventListener('click', requestDeleteCategory);

    dom.confirmButton.addEventListener('click', () => {
      const action = confirmAction;
      confirmAction = null;
      confirmSecondaryAction = null;
      closeDialog(dom.confirmDialog);
      if (typeof action === 'function') action();
    });

    dom.confirmSecondary.addEventListener('click', () => {
      const action = confirmSecondaryAction;
      confirmAction = null;
      confirmSecondaryAction = null;
      closeDialog(dom.confirmDialog);
      if (typeof action === 'function') action();
    });

    dom.confirmCancel.addEventListener('click', () => {
      confirmAction = null;
      confirmSecondaryAction = null;
      closeDialog(dom.confirmDialog);
    });

    [dom.taskDialog, dom.categoryDialog, dom.expiryDialog, dom.confirmDialog, dom.assistantDialog].forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', () => {
        updateBodyLock();
        if (dialog === dom.confirmDialog) {
          confirmAction = null;
          confirmSecondaryAction = null;
        }
      });
    });

    dom.searchInput.addEventListener('input', (event) => {
      window.clearTimeout(searchTimer);
      const value = event.target.value;
      searchTimer = window.setTimeout(() => renderSearchResults(value), 60);
    });

    dom.searchInput.addEventListener('focus', () => {
      if (dom.searchInput.value.trim()) renderSearchResults(dom.searchInput.value);
    });

    dom.searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const firstResult = dom.searchResults.querySelector('[data-search-task], [data-search-expiry]');
        if (firstResult) {
          event.preventDefault();
          firstResult.click();
        }
      }
      if (event.key === 'Escape') {
        dom.searchInput.value = '';
        dom.searchInput.blur();
        closeSearch();
      }
    });

    dom.taskForm.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        submitTaskForm();
      }
    });

    document.addEventListener('keydown', (event) => {
      const activeElement = document.activeElement;
      const typing = activeElement instanceof Element && Boolean(activeElement.closest('input, textarea, select, [contenteditable="true"]'));
      const modalOpen = Boolean(document.querySelector('dialog[open]'));

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        dom.searchInput.focus();
        dom.searchInput.select();
        return;
      }

      if (event.key === '/' && !typing && !modalOpen && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        dom.searchInput.focus();
        dom.searchInput.select();
        return;
      }

      if (event.key.toLowerCase() === 'n' && !typing && !modalOpen && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        openTaskDialog();
        return;
      }

      if (event.key === 'Escape') {
        if (dom.sidebar.classList.contains('is-open')) closeSidebar();
        if (!dom.searchResults.hidden) {
          dom.searchInput.value = '';
          closeSearch();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && dom.sidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });

    dom.searchResults.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  }

  let activeDay = todayISO();

  function checkDayRollover() {
    const today = todayISO();
    if (today === activeDay) return;
    if (document.querySelector('dialog[open]')) return;

    const previousDay = activeDay;
    activeDay = today;
    const carried = carryOverUnfinishedTasks(today);
    const generated = ensureRecurringTasks();
    if (carried || generated) saveData();

    if (ui.selectedDate === previousDay) ui.selectedDate = today;
    if (ui.weekAnchor === startOfWeekISO(previousDay)) ui.weekAnchor = startOfWeekISO(today);
    const previous = parseISO(previousDay);
    if (ui.calendarCursor.getFullYear() === previous.getFullYear() && ui.calendarCursor.getMonth() === previous.getMonth()) {
      const current = parseISO(today);
      ui.calendarCursor = new Date(current.getFullYear(), current.getMonth(), 1);
    }

    render();
    if (carried) showToast(`已把 ${carried} 件没有 DDL 的未完成事项顺延到今天。`);
  }

  function init() {
    hydrateStaticIcons();
    const carried = carryOverUnfinishedTasks();
    const generated = ensureRecurringTasks();
    if (carried || generated) saveData();
    bindEvents();
    render();
    if (carried) showToast(`已把 ${carried} 件没有 DDL 的未完成事项顺延到今天。`);

    activeDay = todayISO();
    window.setInterval(checkDayRollover, 60000);
    window.addEventListener('focus', checkDayRollover);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkDayRollover();
    });
  }

  init();
})();
