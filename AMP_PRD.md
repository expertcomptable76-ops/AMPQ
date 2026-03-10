# PRD — AMP : Attitude Mentale Positive

---

## 1. Vue d'ensemble

| Champ | Valeur |
|---|---|
| **Nom** | AMP — Attitude Mentale Positive |
| **Baseline** | *Mesure ta journée. Élève ton mental.* |
| **Problème résolu** | Aucun outil simple ne permet de suivre quotidiennement la qualité de son état mental et de ses habitudes positives avec un retour immédiat et motivant. |
| **Utilisateur cible** | Adulte 25–45 ans pratiquant le développement personnel, cherchant à ancrer des rituels journaliers. |
| **Valeur principale** | Transformer chaque journée en score objectif, visualiser sa progression et renforcer ses habitudes d'attitude positive. |

---

## 2. Fonctionnalités Core (MVP)

1. **Afficher un checklist journalière** de 10 critères fixes groupés en 6 catégories, un seul enregistrement possible par jour calendaire.
2. **Calculer et afficher un score AMP** (0–100 %) en temps réel dès qu'une réponse est cochée.
3. **Persister les entrées localement** avec historique consultable sur les 30 derniers jours.
4. **Afficher un dashboard de tendances** avec score moyen hebdomadaire sous forme de graphique linéaire.
5. **Permettre l'ajout de 3 critères personnalisés** que l'utilisateur nomme librement et qui s'intègrent au score.
6. **Envoyer une notification de rappel** une fois par jour à une heure configurable par l'utilisateur.

---

## 3. Écrans & Flux Utilisateur

### Écran 1 — Accueil / Checklist du Jour
- **URL** : `/`
- **Contenu** : Date du jour en titre, score AMP circulaire en haut (0–100 %), 6 sections dépliables (accordéon) contenant les critères sous forme de toggles Oui/Non style pill.
- **Interactions** : Basculer un toggle → recalcul instantané du score → animation du cercle de progression. Appuyer sur « Valider ma journée » → modal de confirmation → entrée sauvegardée → transition vers l'écran Résultat.
- **Règle** : Si une entrée existe déjà pour la date du jour, les toggles sont pré-remplis et le bouton affiche « Modifier ».

### Écran 2 — Résultat du Jour
- **URL** : `/result/:date`
- **Contenu** : Score AMP en grand (ex. « 80 % »), badge de niveau (voir logique métier), message motivant associé au niveau, liste des critères non cochés mis en évidence.
- **Interactions** : Bouton « Voir mon historique » → `/history`. Bouton « Retour » → `/`.

### Écran 3 — Historique
- **URL** : `/history`
- **Contenu** : Graphique linéaire (30 jours, axe Y = score 0–100 %), liste des entrées passées sous forme de cartes (date + score + badge). Filtre : 7 jours / 30 jours.
- **Interactions** : Cliquer sur une carte → `/result/:date` en lecture seule.

### Écran 4 — Paramètres
- **URL** : `/settings`
- **Contenu** : Section « Critères personnalisés » (3 champs texte libres, activables/désactivables). Section « Rappel quotidien » (heure configurable, toggle on/off).
- **Interactions** : Modifier un champ → sauvegarde automatique au blur. Activer rappel → demander permission notification navigateur.

---

## 4. Modèle de Données

```typescript
// Entrée journalière
DayEntry {
  id: string            // UUID v4
  date: string          // ISO 8601 "YYYY-MM-DD"
  responses: {
    [criterionId: string]: boolean
  }
  score: number         // 0–100, calculé
  createdAt: Date
  updatedAt: Date
}

// Critère (fixe ou personnalisé)
Criterion {
  id: string
  category: enum["wakeup", "morning", "attitude", "work", "relations", "review", "custom"]
  label: string
  isCustom: boolean
  isActive: boolean
  weight: number        // 1 par défaut, même poids pour tous
}

// Paramètres utilisateur
UserSettings {
  customCriteria: Criterion[]   // max 3
  reminderEnabled: boolean
  reminderTime: string          // "HH:MM"
}
```

---

## 5. Logique Métier

```
// Calcul du score
critères_actifs ← filtre(all_criteria, isActive = true)
réponses_positives ← compte(responses où valeur = true)
score ← (réponses_positives / count(critères_actifs)) × 100

// Attribution du badge
SI score >= 90 ALORS badge ← "🏆 Mental Champion"
SINON SI score >= 70 ALORS badge ← "⚡ Journée Solide"
SINON SI score >= 50 ALORS badge ← "🌱 En Progression"
SINON badge ← "💪 Recommence Demain"

// Entrée du jour
SI date_du_jour existe dans DayEntry ALORS
  afficher_en_mode_édition()
SINON
  créer_nouvelle_entrée()

// Critères personnalisés
SI count(customCriteria actifs) > 3 ALORS bloquer_ajout()
SINON autoriser_ajout()

// Rappel
SI reminderEnabled = true ET heure_actuelle = reminderTime ALORS
  déclencher_notification("C'est l'heure de ton bilan AMP 💪")
```

---

## 6. Stack & Contraintes Techniques

| Couche | Choix | Justification |
|---|---|---|
| **Framework** | React 18 + Vite | Léger, rapide, PWA-ready |
| **Styling** | CSS Modules + variables CSS | Zéro dépendance UI, full contrôle design |
| **Graphique** | Recharts | Léger, déclaratif, compatible React |
| **Persistence** | localStorage (JSON sérialisé) | Zéro backend, offline-first, RGPD natif |
| **Notifications** | Web Notifications API | Native, sans serveur push |
| **PWA** | vite-plugin-pwa + manifest.json | Installable sur mobile et desktop |
| **Routing** | React Router v6 | Standard, URL propres |
| **IDs** | crypto.randomUUID() | Natif navigateur, pas de lib externe |

**Contraintes** : Aucune authentification. Aucune API externe. Aucune base de données. 100 % offline.

---

## 7. Critères d'Acceptation (MVP "Done")

- [ ] La checklist du jour s'affiche avec les 10 critères fixes en 6 catégories dès `/`
- [ ] Le score se met à jour instantanément à chaque toggle sans rechargement
- [ ] Une seule entrée est possible par date calendaire (pas de doublon)
- [ ] L'historique affiche au minimum les 30 derniers jours avec graphique fonctionnel
- [ ] 3 critères personnalisés peuvent être créés, modifiés, activés/désactivés
- [ ] Les critères personnalisés actifs sont inclus dans le calcul du score
- [ ] Le badge de niveau s'affiche correctement selon les 4 paliers définis
- [ ] Le rappel déclenche une notification navigateur à l'heure configurée (si permission accordée)
- [ ] L'application fonctionne intégralement hors ligne après le premier chargement
- [ ] L'application est installable comme PWA sur Android, iOS et desktop

---

## Prompt de Démarrage

> **Instruction pour Google Antigravity :**
>
> En te basant sur le PRD ci-dessus, génère l'intégralité de l'application AMP — Attitude Mentale Positive.
> Stack : React 18 + Vite + CSS Modules + Recharts + React Router v6 + vite-plugin-pwa.
> Persistance : localStorage uniquement, aucun backend.
> Crée tous les fichiers nécessaires (composants, pages, styles, logique métier, modèle de données, configuration PWA).
> Respecte rigoureusement chaque écran décrit (Checklist, Résultat, Historique, Paramètres) et l'ensemble des règles métier.
> Le design doit être premium et moderne : dark mode par défaut, palette cohérente, animations fluides sur les toggles et le cercle de score, typographie Google Fonts (Inter).
> Aucune feature hors MVP. Aucune question. Génère directement le code complet et fonctionnel.
