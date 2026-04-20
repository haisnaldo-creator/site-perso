# PRD — Tête de Mouette (FiveM Hub)

## Original Problem Statement
Recréer un site pro inspiré de https://mouette.vercel.app/ dans un thème sombre FiveM (tutos packs graphiques, ReShade, bugs pack graphique, optimisation PC). Le créateur est "tête de mouette". Inclure :
- Tuto luminosité ReShade
- Tuto bugs pack graphique (6 étapes)
- Panel admin avec rôle Créateur qui gère les users (create/pwd/delete)
- Admin pour CRUD tutos
- Base de données pré-configurée pour Vercel

## Personas
- **Visiteur** : lit les tutos, filtre par catégorie, copie les snippets CitizenFX.ini
- **Admin** : crée/modifie/supprime des tutos
- **Créateur (super admin)** : gère les admins (création, reset password, suppression) + tutos

## Architecture
- **Backend**: FastAPI + MongoDB (motor async), JWT (Bearer token, localStorage)
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn (dark)
- **Design**: Cyan #00E5FF sur noir #05050A, fonts Outfit + Manrope + JetBrains Mono
- **Seed**: 12 tutoriels + 2 users (créateur + admin) auto-seedés au startup

## Core Requirements (Static)
1. Tutoriels publics avec steps numérotés, code blocks, callouts (warning/tip/link)
2. Recherche + filtre par catégorie (7 catégories)
3. Auth JWT avec 2 rôles (creator, admin)
4. Créateur peut CRUD users, Admin peut seulement CRUD tutos
5. Protection route /admin avec redirection vers /login

## Implemented (Feb 2026)
- Backend API complète : /api/auth (login, me), /api/users (CRUD creator only), /api/admin/tutorials (CRUD admin+creator), /api/tutorials (public), /api/categories
- Auto-seed au démarrage : 2 users + 12 tutos (incluant ceux demandés par l'utilisateur : pack graphique install, ReShade install+anti-crash, luminosité ReShade, bugs pack graphique, optimisation Windows FPS, VPN/Proxy fix, Menyoo, Crosshair, Manette, Débuter FiveM, nettoyage, pack son)
- Frontend pages : Home, Tutoriels (liste + filtre), Détail tuto, Catégories, À propos, Login, Admin dashboard (tabs Tutoriels + Utilisateurs)
- Composants : Header glassmorphism, Footer, TutorialCard, CodeBlock (copy button), Callouts (warning/tip/link), ProtectedRoute
- Design : thème sombre cyan, grain overlay, fade-up animations, step number watermark
- Sécurité : bcrypt, protection contre suppression du dernier créateur / de soi-même
- Tests : 22/22 backend pytest + frontend flows verified (iteration 1)

## Test Credentials
- Créateur : `createur@mouette.gg` / `Mouette2026!`
- Admin : `admin@mouette.gg` / `Admin2026!`

## Deployment (Vercel)
Le projet actuel tourne sur FastAPI + MongoDB. Pour Vercel :
1. Push le dossier `/app` sur GitHub
2. Frontend : Vercel détecte `frontend/`, build auto via craco
3. Backend : 2 options
   - **Option simple (recommandée)** : déployer le backend sur Render/Railway (supporte FastAPI natif), configurer REACT_APP_BACKEND_URL côté Vercel
   - **Option Vercel 100%** : créer `api/index.py` avec handler serverless FastAPI (plus complexe)
4. MongoDB : MongoDB Atlas (gratuit M0), remplacer `MONGO_URL` par la chaîne Atlas

## Prioritized Backlog
- **P0 (done)**: Auth, CRUD tutos, CRUD users, 12 seed tutos, filtres, design
- **P1 (next)**: Commentaires publics, système de likes, upload image serveur, page tuto "par catégorie" dédiée
- **P2**: Newsletter, profil utilisateur, analytics, mode édition markdown riche pour les contenus

## Next Tasks
- Brancher upload image (Emergent object storage) pour thumbnails tutos depuis l'admin
- Commentaires publics avec modération admin
- Reset password par email (Resend / SendGrid)
- Sitemap XML + SEO metadata dynamique par tuto (OpenGraph)
