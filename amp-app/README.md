# ⚡ AMP — Attitude Mentale Positive

> *Mesure ta journée. Élève ton mental.*

Application PWA de suivi quotidien de l'attitude mentale positive.

---

## 🚀 Installation & Lancement

### Prérequis

- [Node.js](https://nodejs.org/) v18+ (télécharger et installer si absent)

### Étapes

```bash
# 1. Aller dans le dossier du projet
cd amp-app

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

### Build de production

```bash
npm run build
npm run preview
```

---

## 📱 Fonctionnalités

| Feature | Description |
|---|---|
| ✅ Checklist journalière | 10 critères fixes en 6 catégories |
| 📊 Score AMP temps réel | 0–100 %, cercle animé avec gradient |
| 🏆 Badges de niveau | Champion / Solide / Progression / Demain |
| 📈 Historique 30 jours | Graphique linéaire + cartes |
| ⭐ Critères personnalisés | 3 champs libres inclus dans le score |
| 🔔 Rappel quotidien | Notification Web à l'heure configurée |
| 📲 PWA installable | Fonctionne offline, installable sur mobile/desktop |

## 🎨 Stack Technique

- **React 18** + Vite
- **CSS Modules** (design system dark mode custom)
- **Recharts** (graphiques)
- **React Router v6** (navigation)
- **vite-plugin-pwa** (PWA + service worker)
- **localStorage** (persistance, zéro backend)
