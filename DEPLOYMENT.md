# Déploiement — Tête de Mouette (sans Render, sans Emergent)

Deux chemins au choix, **tous les deux 100% gratuits à vie sans carte bancaire**.

- **Chemin A — Tout sur Vercel** (recommandé, 1 seul service à gérer)
- **Chemin B — Vercel + Koyeb** (si le A coince, backup fiable)

Dans les deux cas, la base de données est **MongoDB Atlas**, gratuite à vie.

---

## 🗄️ Étape commune — Créer la base MongoDB Atlas (10 min)

Fais ça en premier, **quel que soit le chemin que tu choisis ensuite**.

### 1. Compte gratuit
1. Va sur https://www.mongodb.com/cloud/atlas/register
2. Inscris-toi avec Google (1 clic) ou email. **Aucune carte bancaire demandée.**
3. Questions d'onboarding → réponds au hasard, puis **"Finish"**

### 2. Créer le cluster (= ton serveur de base de données)
1. Sur la page "Deploy your database", clique sur l'offre **M0 FREE** (premier cadre, à gauche)
2. **Provider** : AWS
3. **Region** : choisis la plus proche de toi (`eu-west-3` = Paris, `eu-central-1` = Francfort)
4. **Cluster name** : laisse `Cluster0`
5. Clique **"Create Deployment"** en bas

### 3. Créer l'utilisateur qui se connectera à la base
La popup "Connect to Cluster0" s'affiche :

1. **Username** : `mouette_admin`
2. **Password** : clique **"Autogenerate Secure Password"**
3. ⚠️ **COPIE CE MOT DE PASSE IMMÉDIATEMENT DANS UN BLOC-NOTES** (tu ne le reverras pas)
4. Clique **"Create Database User"**

### 4. Autoriser les connexions entrantes
Même page, plus bas :
1. Section "Add a connection IP address"
2. Clique **"Allow Access from Anywhere"** (ou tape IP = `0.0.0.0/0`)
3. Clique **"Add Entry"** puis **"Finish and Close"**

### 5. Récupérer l'URL de connexion
1. Menu de gauche → **"Database"**
2. À côté de ton cluster, clique **"Connect"**
3. Choisis **"Drivers"**
4. Driver = **Python**, version 3.6 or later
5. Copie la chaîne qui ressemble à :
   ```
   mongodb+srv://mouette_admin:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Remplace `<db_password>`** par le mot de passe copié à l'étape 3
7. Colle cette URL complète dans ton bloc-notes — on l'appellera `MONGO_URL` ci-dessous

✅ Ta base est prête. On passe au déploiement.

---

# CHEMIN A — Tout sur Vercel (recommandé)

**Avantages** : 1 seul service, 1 seul dashboard, gratuit à vie, pas besoin de Render ni Koyeb.  
**Inconvénient** : au premier visiteur après inactivité, le backend prend ~1 sec à démarrer (cold start).

Les fichiers de configuration sont **déjà dans ton projet** :
- `/vercel.json` — dit à Vercel comment tout router
- `/api/index.py` — point d'entrée du backend (il importe ton FastAPI)
- `/requirements.txt` — liste les dépendances Python pour Vercel

### A.1 Pousser le code sur GitHub
Si ce n'est pas déjà fait :
1. Compte gratuit sur https://github.com/signup
2. **New repository** (bouton vert) → nom `mouette-fivem` → **Public** → **Create repository**
3. Sur la page du nouveau repo, clique **"uploading an existing file"** (lien bleu au milieu)
4. Glisse **tout le contenu** du dossier que tu as téléchargé depuis Emergent (pas le dossier lui-même, son contenu)
5. Attends la fin de l'upload (2-5 min selon ta connexion)
6. Clique **"Commit changes"** en bas

### A.2 Déployer sur Vercel
1. https://vercel.com/signup → **"Continue with GitHub"**
2. Dashboard → **"Add New..."** → **"Project"**
3. Trouve `mouette-fivem` → **"Import"**
4. **IMPORTANT : ne change rien dans "Root Directory"** — laisse-le à la racine (`./`)
5. **Framework Preset** : tu peux laisser "Other" ou "Create React App", les deux marchent
6. **Build Command** : *laisse vide* (le `vercel.json` gère tout)
7. **Output Directory** : *laisse vide*

### A.3 Variables d'environnement (dans Vercel)
Section **"Environment Variables"** (juste en dessous) — ajoute une par une :

| Key (nom) | Value (valeur) |
|-----------|----------------|
| `MONGO_URL` | *ton URL MongoDB Atlas de l'étape 5* |
| `DB_NAME` | `mouette_db` |
| `JWT_SECRET` | *génère 64 caractères aléatoires sur https://www.random.org/strings/?num=1&len=64&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html*  |
| `CREATOR_EMAIL` | `createur@mouette.gg` *(ou ton email)* |
| `CREATOR_PASSWORD` | *un mot de passe solide (au moins 10 caractères, avec majuscule + chiffre)* |
| `ADMIN_EMAIL` | `admin@mouette.gg` |
| `ADMIN_PASSWORD` | *un autre mot de passe solide* |
| `APP_NAME` | `mouette` |
| `CORS_ORIGINS` | `*` *(on le restreindra dans 2 min)* |
| `REACT_APP_BACKEND_URL` | *laisse vide pour l'instant, on le remplira après le 1er déploiement* |

### A.4 Premier déploiement
1. Clique **"Deploy"**
2. Vercel construit tout (5-8 min)
3. À la fin : "🎉 Your project has been deployed" → tu vois ton URL, exemple : `https://mouette-fivem.vercel.app`
4. **Copie cette URL**

### A.5 Ajouter l'URL au frontend
Le frontend React doit savoir où est le backend (qui est sur le MÊME domaine Vercel, mais il faut quand même lui dire).

1. Sur Vercel, projet `mouette-fivem` → onglet **"Settings"** → **"Environment Variables"**
2. Ajoute :
   - **Key** : `REACT_APP_BACKEND_URL`
   - **Value** : l'URL copiée à l'étape A.4 (par exemple `https://mouette-fivem.vercel.app`)
3. Sauvegarde
4. Onglet **"Deployments"** → dernière ligne → bouton **"..."** à droite → **"Redeploy"**
5. Attends 3 min

### A.6 Restreindre CORS
Pour la sécurité, dis au backend qu'il ne doit accepter que ton frontend :

1. **Settings** → **Environment Variables** → modifie `CORS_ORIGINS`
2. Remplace `*` par ton URL Vercel (sans slash final), exemple :
   ```
   https://mouette-fivem.vercel.app
   ```
3. Sauvegarde → Redeploy (Deployments → "..." → Redeploy)

### A.7 Tester
1. Va sur `https://mouette-fivem.vercel.app` → ton site s'affiche 🎉
2. `/login` → connecte-toi avec `CREATOR_EMAIL` + `CREATOR_PASSWORD` (étape A.3)
3. **Admin** → tu peux créer des tutos, modérer les commentaires, gérer les utilisateurs

✅ **Tu es en prod. Total gratuit, 1 service, 0 configuration technique.**

---

# CHEMIN B — Vercel (frontend) + Koyeb (backend)

Si jamais le Chemin A ne marche pas pour une raison ou une autre, Koyeb est une excellente alternative à Render avec une UI plus simple.

### B.1 Pousser sur GitHub (pareil que A.1)

### B.2 Créer un compte Koyeb
1. https://app.koyeb.com/auth/signup
2. Connecte-toi avec **GitHub** (1 clic, pas de carte bancaire demandée)
3. Confirme ton email

### B.3 Créer le Web Service
1. Dashboard Koyeb → **"Create Web Service"** (gros bouton bleu)
2. Source : **"GitHub"**
3. Sélectionne `mouette-fivem`
4. **Branch** : `main`
5. Dans **"Work directory"** (dossier de travail) : tape `backend`
6. **Builder** : laisse "Buildpack" (Koyeb détecte Python tout seul)
7. **Build command** : *laisse vide* (auto)
8. **Run command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`

### B.4 Variables d'environnement
Descends à **"Environment variables"** → **"Add variable"** pour chacune :

Mêmes valeurs que **étape A.3** ci-dessus, sauf `REACT_APP_BACKEND_URL` (tu le mettras côté Vercel).

### B.5 Finaliser
1. **Instance type** : Free (eco)
2. **Regions** : Frankfurt (proche France)
3. **Service name** : `mouette-backend`
4. Clique **"Deploy"**
5. Attends 4-6 min, logs en live. Quand tu vois `Application startup complete` + `Seeded 12 tutorials`, c'est bon
6. En haut à droite, tu as une URL `https://<nom-random>.koyeb.app` → copie-la

### B.6 Déployer le frontend sur Vercel
1. https://vercel.com/signup → avec GitHub
2. **Add New Project** → `mouette-fivem`
3. **Root Directory** : clique **"Edit"** → sélectionne `frontend`
4. **Framework Preset** : `Create React App`
5. **Environment Variable** :
   - Key : `REACT_APP_BACKEND_URL`
   - Value : *l'URL Koyeb copiée à B.5*
6. **Deploy**
7. À la fin, copie ton URL Vercel

### B.7 Restreindre CORS
1. Retour sur Koyeb → ton service → onglet **"Settings"** → **"Environment"**
2. Modifie `CORS_ORIGINS` → mets ton URL Vercel exacte (ex: `https://mouette.vercel.app`)
3. Save → Koyeb redéploie automatiquement

✅ Site live en prod gratuit à vie.

---

## 🛠 Problèmes courants

### "Le backend prend 30 secondes au premier clic"
Normal sur les offres gratuites. Pour l'éviter gratuitement :
- Crée un compte gratuit sur https://uptimerobot.com
- Ajoute un monitor HTTPS qui ping ton URL backend toutes les 5 minutes
- Résultat : ton backend ne s'endort jamais

### "Erreur CORS dans la console du navigateur"
Vérifie que `CORS_ORIGINS` contient **exactement** ton URL Vercel, sans slash à la fin, sans espaces.

### "Mes images de thumbnail ne s'affichent pas"
L'upload d'image dépend du service Object Storage d'Emergent. **Si tu ne veux pas utiliser Emergent du tout** :
- Dis-le moi et je remets un champ "URL d'image" à côté du bouton upload dans l'éditeur admin
- Tu pourras alors utiliser Imgur gratuitement : upload sur https://imgur.com → clic droit sur l'image → "Copier l'adresse de l'image" → colle-la dans le champ URL

### "Je ne vois pas mon repo quand je clique Import sur Vercel/Koyeb"
Sur la page d'import, clique **"Adjust GitHub App Permissions"** → sélectionne ton repo → Save.

### "Les modifications ne s'affichent pas"
Après un push GitHub, Vercel et Koyeb redéploient automatiquement (3-5 min). Rafraîchis la page avec Ctrl+Shift+R.

### "Reset complet de la base de données"
MongoDB Atlas → ton cluster → **"..."** → **"Terminate"** → recrée un cluster gratuit. Le seed automatique recréera tous les tutos et utilisateurs.

---

## 💰 Coûts récapitulatifs

| Service | Gratuit à vie ? | Carte bancaire ? |
|---------|------------------|------------------|
| GitHub | ✅ | ❌ |
| MongoDB Atlas (M0) | ✅ | ❌ |
| Vercel (Hobby) | ✅ | ❌ |
| Koyeb (Free) | ✅ | ❌ |

**Total : 0 €/mois, infiniment.**

---

Si tu bloques à une étape précise : envoie-moi une capture d'écran de la page où tu es + l'erreur exacte, je te débloque en 2 min.
