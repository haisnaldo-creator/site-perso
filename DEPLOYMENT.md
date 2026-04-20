# Déploiement — Tête de Mouette

Guide pas-à-pas **ultra détaillé** pour mettre ton site en ligne sans rien coder, avec :
- **Frontend** sur Vercel (gratuit, déploiement auto depuis GitHub)
- **Backend** sur Render (gratuit, FastAPI natif, déploiement auto depuis GitHub)
- **Base de données** MongoDB Atlas (gratuit, 512 Mo, aucune carte bancaire requise)

Temps estimé : **25–30 minutes** la première fois.

---

## 1️⃣ Préparer GitHub (5 min)

### 1.1 Créer un compte GitHub
1. Va sur https://github.com/signup
2. Crée un compte avec ton email
3. Valide ton email (ils envoient un code à 6 chiffres)

### 1.2 Télécharger ton code depuis Emergent
1. Sur Emergent, clique sur **"Download Code"** (ou **"Export"**) dans le menu du projet
2. Tu obtiens un fichier `.zip`
3. Dézippe-le sur ton PC (clic droit → Extraire)

### 1.3 Pousser le code sur GitHub
1. Sur https://github.com, clique sur **"New repository"** (bouton vert en haut à droite)
2. Nom : `mouette-fivem` (ou ce que tu veux)
3. Laisse "Public" coché
4. Clique **"Create repository"**
5. GitHub te montre une page avec des commandes — **ignore-les** et fais ça :
   - Clique sur **"uploading an existing file"** (lien au milieu de la page)
   - Glisse TOUT le contenu du dossier dézippé dans la zone
   - Attends que l'upload finisse (peut prendre 2-5 min)
   - Clique **"Commit changes"**

✅ Ton code est maintenant sur GitHub.

---

## 2️⃣ Créer la base de données MongoDB Atlas (10 min)

MongoDB Atlas est **gratuit à vie** sur son offre M0 (512 Mo). C'est amplement suffisant pour des milliers de tutoriels, commentaires et images.

### 2.1 Créer un compte
1. Va sur https://www.mongodb.com/cloud/atlas/register
2. Inscris-toi avec Google ou email (pas besoin de carte bancaire)
3. Une fois connecté, ils te posent 3 questions :
   - **What is your goal?** → coche n'importe quoi, par exemple "Learn MongoDB"
   - **What type of app?** → "Other"
   - **Preferred language?** → "Python"
   - Clique **"Finish"**

### 2.2 Créer un cluster (le serveur)
1. Tu arrives sur "Deploy your database"
2. Choisis **"M0 FREE"** (le premier choix, 0$/mois)
3. **Provider** : AWS
4. **Region** : choisis celle la plus proche de toi (ex : `eu-west-3` Paris, ou `eu-central-1` Francfort)
5. **Cluster name** : laisse `Cluster0`
6. Clique **"Create Deployment"**

### 2.3 Créer l'utilisateur de la base
Une popup apparaît : "Connect to Cluster0"

1. **Username** : `mouette_admin`
2. **Password** : clique sur **"Autogenerate Secure Password"** → **COPIE ce mot de passe dans un bloc-notes, tu ne le reverras pas !**
3. Clique **"Create Database User"**

### 2.4 Autoriser les connexions depuis Render
1. Plus bas sur la même page, section "Add a connection IP address"
2. Clique **"Allow Access from Anywhere"** (c'est OK pour un petit site ; Render utilise des IP dynamiques)
3. Si on te demande : IP = `0.0.0.0/0`
4. Clique **"Add Entry"** puis **"Finish and Close"**

### 2.5 Récupérer la chaîne de connexion
1. Sur la page principale (Database), tu vois ton cluster. Clique sur **"Connect"**
2. Choisis **"Drivers"**
3. Driver : **Python** · Version : **3.6 or later**
4. Copie la ligne qui ressemble à :
   ```
   mongodb+srv://mouette_admin:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT** : remplace `<db_password>` par le mot de passe que tu as copié au point 2.3
6. Colle cette chaîne complète dans ton bloc-notes — on l'utilise dans 3 minutes

✅ Ta base MongoDB est prête.

---

## 3️⃣ Déployer le backend sur Render (8 min)

Render est le plus simple pour FastAPI. Gratuit à vie (le serveur s'endort après 15 min d'inactivité, se réveille en ~30 secondes au premier visiteur).

### 3.1 Créer un compte Render
1. Va sur https://render.com/register
2. Clique **"GitHub"** pour te connecter avec ton compte GitHub (le plus simple)
3. Autorise Render à accéder à tes repos

### 3.2 Créer le Web Service
1. Dashboard Render → clique **"New +"** → **"Web Service"**
2. Section "Connect a repository" → trouve `mouette-fivem` dans la liste → clique **"Connect"**
3. Formulaire de configuration :
   - **Name** : `mouette-backend`
   - **Region** : choisis la plus proche de toi (Frankfurt EU pour la France)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type** : **Free**

### 3.3 Variables d'environnement
Fais défiler jusqu'à **"Environment Variables"** puis clique **"Add Environment Variable"** pour chacune :

| Key | Value |
|-----|-------|
| `MONGO_URL` | *(colle la chaîne complète de MongoDB Atlas étape 2.5, avec le mot de passe remplacé)* |
| `DB_NAME` | `mouette_db` |
| `JWT_SECRET` | *(génère une chaîne aléatoire de 64 caractères — va sur https://www.random.org/strings/ et prends-en une)* |
| `CREATOR_EMAIL` | `createur@mouette.gg` *(ou ton email)* |
| `CREATOR_PASSWORD` | *(choisis un mot de passe solide — c'est celui du super admin)* |
| `ADMIN_EMAIL` | `admin@mouette.gg` |
| `ADMIN_PASSWORD` | *(un autre mot de passe solide)* |
| `EMERGENT_LLM_KEY` | *(laisse vide pour l'instant — les uploads ne marcheront pas mais le site fonctionne)* |
| `APP_NAME` | `mouette` |
| `CORS_ORIGINS` | `*` *(on le changera après Vercel)* |

### 3.4 Déployer
1. Clique **"Create Web Service"** tout en bas
2. Render construit ton backend (5–8 min la première fois)
3. Regarde les logs — quand tu vois :
   ```
   Application startup complete
   Seeded creator: createur@mouette.gg
   Seeded admin: admin@mouette.gg
   Seeded 12 tutorials
   ```
   ✅ Ton backend tourne !
4. En haut de la page, tu as l'URL : `https://mouette-backend.onrender.com` → **copie-la**

### 3.5 Tester
Dans une nouvelle fenêtre, va sur `https://mouette-backend.onrender.com/api/` — tu dois voir :
```json
{"app": "Tête de Mouette", "status": "online"}
```

---

## 4️⃣ Déployer le frontend sur Vercel (5 min)

### 4.1 Créer un compte Vercel
1. Va sur https://vercel.com/signup
2. Clique **"Continue with GitHub"**

### 4.2 Importer le projet
1. Dashboard → **"Add New..."** → **"Project"**
2. Trouve `mouette-fivem` → **"Import"**
3. Formulaire :
   - **Project Name** : `mouette` (ou ce que tu veux)
   - **Framework Preset** : `Create React App`
   - **Root Directory** : clique **"Edit"** → sélectionne `frontend` → **"Continue"**
   - **Build Command** : `yarn build`
   - **Output Directory** : `build`
   - **Install Command** : `yarn install`

### 4.3 Variable d'environnement
Section **"Environment Variables"** :
- **Key** : `REACT_APP_BACKEND_URL`
- **Value** : l'URL Render copiée au point 3.4, par exemple `https://mouette-backend.onrender.com`

### 4.4 Déployer
1. Clique **"Deploy"**
2. Vercel build (3-5 min)
3. À la fin, tu vois ton site live ! L'URL est du type `https://mouette.vercel.app`

---

## 5️⃣ Finaliser (2 min)

### 5.1 Restreindre le CORS backend
Pour la sécurité, retourne sur Render :
1. `mouette-backend` → onglet **"Environment"**
2. Modifie `CORS_ORIGINS` : remplace `*` par ton URL Vercel, par exemple :
   ```
   https://mouette.vercel.app
   ```
3. Sauvegarde → Render redéploie automatiquement (2 min)

### 5.2 Première connexion admin
1. Va sur `https://mouette.vercel.app/login`
2. Connecte-toi avec `CREATOR_EMAIL` + `CREATOR_PASSWORD` (ceux que tu as mis étape 3.3)
3. Vas dans **"Admin"** → tu peux créer des admins, tutos, modérer les commentaires

---

## 🛠 Problèmes courants

### Le backend met 30s à répondre au premier clic
Normal : l'offre gratuite Render endort le serveur après 15 min. Pour garder le backend toujours actif :
- Upgrade à **Starter ($7/mois)** sur Render, OU
- Utilise un "keep-alive" gratuit : https://uptimerobot.com (ping ton URL toutes les 5 min)

### Je vois une erreur "CORS" dans la console
Vérifie que `CORS_ORIGINS` sur Render contient **exactement** ton URL Vercel, sans slash final.

### Les images uploadées ne s'affichent pas
Normal si tu n'as pas mis `EMERGENT_LLM_KEY` — l'upload des thumbnails nécessite cette clé.  
**Alternative gratuite** : utilise directement une URL d'image depuis Imgur (upload sur https://imgur.com, clique droit sur l'image → "Copier l'adresse de l'image") et colle-la dans le champ URL du tuto (je peux réactiver le champ URL optionnel si tu veux).

### Mes modifications ne s'affichent pas après push GitHub
Render et Vercel redéploient automatiquement à chaque push sur la branche `main`. Patiente 3–5 min et rafraîchis.

### Réinitialiser la base (repartir de zéro)
Sur MongoDB Atlas → ton cluster → **"..."** → **"Terminate"** → recrée-en un (le seed automatique reviendra).

---

## 💰 Coûts

| Service | Offre utilisée | Coût |
|---------|----------------|------|
| GitHub | Public repo | **Gratuit à vie** |
| MongoDB Atlas | M0 (512 Mo) | **Gratuit à vie** |
| Render | Free tier (dort après 15 min) | **Gratuit à vie** |
| Vercel | Hobby | **Gratuit à vie** |

**Total : 0 €/mois** tant que tu restes sur ces offres gratuites.

Si le trafic explose ou si tu veux un backend toujours actif : Render Starter (7$/mois) suffit largement.

---

Si quelque chose coince, envoie-moi un message avec **une capture d'écran de l'erreur** et l'étape où tu es bloqué, je te débloque en 2 min.
