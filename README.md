# MMA Live - Combats MMA en Direct

Site web complet pour fans de MMA qui référence tous les combats diffusés légalement en streaming direct.

## 🥊 Fonctionnalités

- **Page d'accueil** - Combats en direct et à venir avec filtrage par organisation
- **Calendrier** - Vue calendrier des événements à venir
- **Page Événement** - Détails complets avec carte des combats et liens de diffusion
- **Page Fighter** - Profil du combattant avec historique des combats
- **Page Organisations** - Liste des organisations (UFC, Bellator, ONE, PFL, etc.)
- **Alertes personnalisées** - Notifications email ou Telegram avant les combats
- **Export calendrier** - Export Google Calendar et iCal
- **Détection fuseau horaire** - Horaires automatiquement adaptés

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 (App Router) avec TypeScript
- **Styling**: Tailwind CSS (thème sombre)
- **Base de données**: PostgreSQL avec Prisma ORM
- **API**: Next.js API Routes
- **Déploiement**: Vercel-ready

## 📁 Structure du Projet

```
/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── calendrier/         # Calendrier des événements
│   ├── evenement/[slug]/   # Détail événement
│   ├── fighter/[slug]/     # Profil combattant
│   ├── organisations/      # Liste des organisations
│   └── api/                # Routes API
├── components/
│   ├── ui/                 # Composants UI de base
│   ├── FightCard.tsx       # Carte de combat
│   ├── EventCard.tsx       # Carte d'événement
│   ├── CountdownTimer.tsx  # Compte à rebours
│   ├── FilterBar.tsx       # Filtres
│   ├── Navbar.tsx          # Navigation
│   └── Footer.tsx          # Pied de page
├── lib/
│   ├── db.ts               # Connexion Prisma
│   ├── utils.ts            # Utilitaires
│   ├── timezone.ts         # Gestion fuseaux horaires
│   └── seo.ts              # Utilitaires SEO
├── prisma/
│   ├── schema.prisma       # Schéma base de données
│   └── seed.ts             # Données de démonstration
└── types/
    └── index.ts            # Types TypeScript
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL
- npm ou yarn

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <repo-url>
   cd mma-live
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Modifier `.env` avec votre URL de base de données PostgreSQL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mmalive"
   ```

4. **Initialiser la base de données**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir [http://localhost:3000](http://localhost:3000)**

## 📦 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:push` | Applique le schéma à la base de données |
| `npm run db:seed` | Remplit la base avec des données de démo |
| `npm run db:studio` | Ouvre Prisma Studio |

## 🗄️ Base de Données

### Tables

- **organizations** - UFC, Bellator, ONE, PFL, etc.
- **events** - Événements MMA
- **fighters** - Combattants
- **fights** - Combats
- **broadcasters** - Plateformes de diffusion
- **event_broadcasts** - Liens événement/diffuseur
- **user_alerts** - Alertes utilisateurs
- **user_favorites** - Favoris utilisateurs

## 🎨 Design

- **Thème sombre** avec accents rouge/orange
- **Cards glassmorphism** pour les combats
- **Animations** pour les statuts LIVE
- **Mobile-first** responsive design

## 🔒 SEO

- Métadonnées optimisées pour chaque page
- Open Graph et Twitter Cards
- Structure sémantique avec balises H1, H2
- Textes descriptifs en français

## 📝 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/events` | GET | Liste des événements |
| `/api/fights` | GET | Liste des combats |
| `/api/alerts` | GET/POST | Gestion des alertes |
| `/api/calendar/[eventId]` | GET | Export iCal |

## 🚀 Déploiement Vercel

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement:
   - `DATABASE_URL` - URL PostgreSQL (Vercel Postgres, Supabase, etc.)
3. Déployer

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
