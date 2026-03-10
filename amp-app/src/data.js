/**
 * AMP — Data Models & Business Logic
 * Persistent storage via localStorage
 */

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  ENTRIES: 'amp_entries',
  SETTINGS: 'amp_settings',
};

// ─── FIXED CRITERIA ───────────────────────────────────────────────────────────

export const FIXED_CRITERIA = [
  // Réveil
  { id: 'wakeup_1', category: 'wakeup', label: "Je me suis levé à l'heure prévue", isCustom: false, isActive: true, weight: 1 },
  { id: 'wakeup_2', category: 'wakeup', label: "Je n'ai pas utilisé plusieurs fois le bouton snooze", isCustom: false, isActive: true, weight: 1 },
  // Rituels du matin
  { id: 'morning_1', category: 'morning', label: "J'ai fait mes phrases de gratitude", isCustom: false, isActive: true, weight: 1 },
  { id: 'morning_2', category: 'morning', label: "J'ai fait ma visualisation mentale", isCustom: false, isActive: true, weight: 1 },
  { id: 'morning_3', category: 'morning', label: "J'ai préparé un petit-déjeuner équilibré", isCustom: false, isActive: true, weight: 1 },
  // Attitude
  { id: 'attitude_1', category: 'attitude', label: "J'ai souri plusieurs fois dans la journée", isCustom: false, isActive: true, weight: 1 },
  { id: 'attitude_2', category: 'attitude', label: "J'ai cultivé une attitude positive", isCustom: false, isActive: true, weight: 1 },
  // Travail
  { id: 'work_1', category: 'work', label: "J'ai accompli les tâches prévues dans mon travail", isCustom: false, isActive: true, weight: 1 },
  // Relations
  { id: 'relations_1', category: 'relations', label: "J'ai profité des personnes que j'aime", isCustom: false, isActive: true, weight: 1 },
  // Bilan
  { id: 'review_1', category: 'review', label: "Je me couche fier et satisfait de ma journée", isCustom: false, isActive: true, weight: 1 },
];

export const CATEGORIES = {
  wakeup:    { label: 'Réveil & Discipline', emoji: '⏰', color: '#fbbf24' },
  morning:   { label: 'Rituels du Matin',   emoji: '🌅', color: '#34d399' },
  attitude:  { label: 'Attitude du Jour',   emoji: '✨', color: '#7c5cfc' },
  work:      { label: 'Engagement Travail', emoji: '💼', color: '#22d3ee' },
  relations: { label: 'Relations Humaines', emoji: '❤️', color: '#f472b6' },
  review:    { label: 'Bilan de Journée',   emoji: '🌙', color: '#a78bfa' },
  custom:    { label: 'Mes Critères',       emoji: '⭐', color: '#fb923c' },
};

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  customCriteria: [
    { id: 'custom_1', category: 'custom', label: '', isCustom: true, isActive: false, weight: 1 },
    { id: 'custom_2', category: 'custom', label: '', isCustom: true, isActive: false, weight: 1 },
    { id: 'custom_3', category: 'custom', label: '', isCustom: true, isActive: false, weight: 1 },
  ],
  reminderEnabled: false,
  reminderTime: '20:00',
};

// ─── SCORE & BADGE LOGIC ──────────────────────────────────────────────────────

export function computeScore(responses, allCriteria) {
  const activeCriteria = allCriteria.filter(c => c.isActive);
  if (activeCriteria.length === 0) return 0;
  const positiveCount = activeCriteria.filter(c => responses[c.id] === true).length;
  return Math.round((positiveCount / activeCriteria.length) * 100);
}

export function getBadge(score) {
  if (score >= 90) return { label: 'Mental Champion', emoji: '🏆', class: 'badge-champion', message: "Tu es au sommet ! Une journée vécue avec excellence. Continue sur cette lancée, rien ne peut t'arrêter." };
  if (score >= 70) return { label: 'Journée Solide',   emoji: '⚡', class: 'badge-solid',    message: "Belle journée, bien jouée ! Tu avances avec intention. Quelques ajustements et tu décroches le titre demain." };
  if (score >= 50) return { label: 'En Progression',  emoji: '🌱', class: 'badge-progress', message: "Tu progresses, c'est ce qui compte. Chaque habitude ancrée est une victoire. Garde le cap !" };
  return                 { label: 'Recommence Demain', emoji: '💪', class: 'badge-retry',   message: "Demain est une nouvelle opportunité. La discipline se construit jour après jour. Tu es plus fort que tu ne le crois." };
}

// ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────

export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    // Ensure customCriteria always has 3 slots
    while (parsed.customCriteria.length < 3) {
      const idx = parsed.customCriteria.length + 1;
      parsed.customCriteria.push({ id: `custom_${idx}`, category: 'custom', label: '', isCustom: true, isActive: false, weight: 1 });
    }
    return parsed;
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ─── ENTRY HELPERS ────────────────────────────────────────────────────────────

export function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getEntryByDate(entries, date) {
  return entries.find(e => e.date === date) || null;
}

export function upsertEntry(entries, entry) {
  const idx = entries.findIndex(e => e.date === entry.date);
  if (idx >= 0) {
    const updated = [...entries];
    updated[idx] = { ...entry, updatedAt: new Date().toISOString() };
    return updated;
  }
  return [...entries, { ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
}

export function getAllCriteria(settings) {
  const active = settings.customCriteria.filter(c => c.isActive && c.label.trim() !== '');
  return [...FIXED_CRITERIA, ...active];
}

// ─── DATE FORMATTING ─────────────────────────────────────────────────────────

const FR_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const FR_MONTHS_LONG = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const FR_MONTHS_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export function formatDateLong(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${FR_DAYS[date.getDay()]} ${d} ${FR_MONTHS_LONG[m - 1]} ${y}`;
}

export function formatDateShort(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return { day: d, month: FR_MONTHS_SHORT[m - 1] };
}

export function formatDateChart(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d}/${m}`;
}

// ─── REMINDER (Web Notifications API) ────────────────────────────────────────

let reminderInterval = null;

export function startReminderCheck(settings) {
  stopReminderCheck();
  if (!settings.reminderEnabled || !settings.reminderTime) return;

  let lastFired = null;
  reminderInterval = setInterval(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const today = getTodayString();

    if (currentTime === settings.reminderTime && lastFired !== today) {
      lastFired = today;
      if (Notification.permission === 'granted') {
        new Notification('AMP — Attitude Mentale Positive', {
          body: "C'est l'heure de ton bilan AMP 💪",
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }
    }
  }, 30000); // check every 30s
}

export function stopReminderCheck() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}
