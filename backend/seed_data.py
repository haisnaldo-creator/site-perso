"""Seed tutorials for Tête de Mouette."""

SEED_TUTORIALS = [
    # ===== PACK GRAPHIQUE - Installation =====
    {
        "slug": "installer-pack-graphique-fivem",
        "title": "Installer un pack graphique FiveM (sans ReShade)",
        "category": "pack-graphique",
        "description": "Guide complet pour installer un pack graphique sur FiveM, de zéro, sans faire crash votre jeu. Méthode officielle Tête de Mouette.",
        "thumbnail": "https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "difficulty": "Intermédiaire",
        "duration": "15 min",
        "featured": True,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Nettoyer ton jeu (important)",
                "content": "Avant toute chose, nettoie ton jeu avec cet outil. Il va supprimer proprement tous les anciens mods/fichiers résiduels qui pourraient entrer en conflit avec ton nouveau pack.",
                "link": "https://www.gta5-mods.com/tools/gta-v-mod-remove-tool",
                "warning": "Ne saute JAMAIS cette étape. 9 crashs sur 10 viennent d'anciens fichiers mal désinstallés.",
            },
            {
                "number": 2,
                "title": "Télécharger le pack",
                "content": "Télécharge le fichier depuis Google Drive fourni par ton créateur de pack, puis dézippe-le. Tu dois obtenir deux dossiers distincts : Mods et Plugins.",
            },
            {
                "number": 3,
                "title": "Installer les fichiers",
                "content": "Ouvre FiveM. Clique droit sur FiveM puis 'Ouvrir l'emplacement du fichier'. Va dans le dossier FiveM Application Data. Glisse les dossiers Mods et Plugins à l'intérieur.",
                "tip": "Si FiveM demande de remplacer des fichiers, valide toujours.",
            },
            {
                "number": 4,
                "title": "Récupérer l'ID Addons",
                "content": "Lance FiveM. Appuie sur la touche F8 pour ouvrir la console. Vérifie que ton ID commence par [Addons]. Copie intégralement cette ligne, puis quitte FiveM.",
                "warning": "Étapes 4 et 5 uniquement si ton pack n'inclut PAS ReShade.",
            },
            {
                "number": 5,
                "title": "Modifier le fichier CitizenFX",
                "content": "Retourne dans FiveM Application Data, ouvre le fichier CitizenFX.ini avec un éditeur de texte. Colle le texte [Addons] récupéré dans F8 tout en bas du fichier.",
                "code": "[Addons]\nReShade5=ID:XXXX acknowledged that ReShade 5.x has a bug that will lead to game crashes",
            },
            {
                "number": 6,
                "title": "Finalisation",
                "content": "Sauvegarde le fichier CitizenFX.ini, ferme tout, puis relance FiveM. Ton pack graphique est maintenant actif.",
                "tip": "Lance une partie solo pour tester avant d'aller sur ton serveur.",
            },
        ],
    },

    # ===== RESHADE - Installation =====
    {
        "slug": "installer-reshade-fivem",
        "title": "Installer ReShade sur FiveM sans crash",
        "category": "reshade",
        "description": "Installe ReShade correctement sur FiveM et débloque le correctif anti-crash obligatoire. Inclut la liaison des shaders.",
        "thumbnail": "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxkYXJrJTIwZ2FtaW5nJTIwc2V0dXAlMjBuZW9ufGVufDB8fHx8MTc3NjY4NjI5NHww&ixlib=rb-4.1.0&q=85",
        "difficulty": "Intermédiaire",
        "duration": "20 min",
        "featured": True,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Ciblez le bon fichier",
                "content": "Installez ReShade en sélectionnant GTA5.exe (PAS FiveM.exe) dans votre dossier de jeu racine. Choisissez l'API DirectX 10/11/12.",
                "warning": "Sélectionner FiveM.exe fera crash le jeu à chaque lancement.",
            },
            {
                "number": 2,
                "title": "Sélectionner les effects",
                "content": "Appuyez sur 'Uncheck all' puis 'Check all' pour installer tous les effects via ReShade. Cela garantit que tous les shaders utilisés par les presets seront disponibles.",
            },
            {
                "number": 3,
                "title": "Finir l'installation",
                "content": "Appuyez sur 'Continuer' pour procéder à l'installation. Attendez la fin du téléchargement des shaders.",
            },
            {
                "number": 4,
                "title": "Correctif Anti-Crash (indispensable)",
                "content": "FiveM bloque ReShade par sécurité. Pour l'autoriser, ouvrez CitizenFX.ini dans votre Application Data et collez ceci tout en bas, en remplaçant XXXX par votre ID présent dans l'erreur F8 :",
                "code": "[Addons]\nReShade5=ID:fede75cf acknowledged that ReShade 5.x has a bug that will lead to game crashes",
                "warning": "Sans ce correctif, FiveM refusera de se lancer.",
            },
            {
                "number": 5,
                "title": "Liaison des Shaders",
                "content": "Copiez le dossier reshade-shaders de votre dossier GTA V vers votre dossier FiveM Application Data. C'est ce qui fait apparaître les filtres en jeu.",
                "tip": "La touche pour ouvrir ReShade en jeu est HOME.",
            },
        ],
    },

    # ===== RESHADE - Luminosité =====
    {
        "slug": "changer-luminosite-reshade",
        "title": "Changer la luminosité de son pack graphique avec ReShade",
        "category": "reshade",
        "description": "Pack trop sombre la nuit ou trop lumineux le jour ? Apprends à ajuster précisément la luminosité de ton preset ReShade en 2 minutes.",
        "thumbnail": "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxkYXJrJTIwZ2FtaW5nJTIwc2V0dXAlMjBuZW9ufGVufDB8fHx8MTc3NjY4NjI5NHww&ixlib=rb-4.1.0&q=85",
        "difficulty": "Débutant",
        "duration": "5 min",
        "featured": True,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Ouvrir ReShade en jeu",
                "content": "Lance FiveM, rejoins ton serveur ou lance une partie solo. Appuie sur la touche HOME de ton clavier pour faire apparaître l'interface ReShade.",
                "tip": "Si HOME ne fonctionne pas, vérifie dans les paramètres ReShade que la touche n'a pas été remappée.",
            },
            {
                "number": 2,
                "title": "Aller dans l'onglet Home",
                "content": "Dans l'interface ReShade, clique sur l'onglet 'Home'. Tu verras la liste de tous les effets actifs de ton preset (le pack que tu as installé).",
            },
            {
                "number": 3,
                "title": "Trouver l'effet Levels / Brightness",
                "content": "Cherche dans la liste un effet nommé 'Levels', 'Brightness & Contrast', 'Tonemap' ou 'Lightroom'. Clique dessus pour afficher ses paramètres dans la section inférieure.",
                "tip": "Presque tous les packs graphiques utilisent 'Levels' ou 'Tonemap' pour gérer la luminosité.",
            },
            {
                "number": 4,
                "title": "Ajuster le slider",
                "content": "Fais glisser le slider 'Brightness' (ou 'Exposure' / 'Gamma') vers la droite pour éclaircir, vers la gauche pour assombrir. Les changements sont visibles en direct dans le jeu.",
                "warning": "Évite les valeurs extrêmes : un pack bien réglé reste entre -0.2 et +0.2 de brightness.",
            },
            {
                "number": 5,
                "title": "Sauvegarder le preset",
                "content": "En haut de ReShade, clique sur 'Save' (icône disquette) à côté du nom du preset. Sinon, tes réglages seront perdus au prochain lancement.",
                "code": "Raccourci : Ctrl + S dans ReShade pour sauvegarder rapidement.",
            },
            {
                "number": 6,
                "title": "Créer ton propre profil (bonus)",
                "content": "Pour ne pas toucher au preset original, duplique-le : en haut de ReShade, clique sur '+' à côté du nom du preset, donne-lui un nom (ex: MonPack-Lumineux), puis modifie à ta guise.",
            },
        ],
    },

    # ===== PACK GRAPHIQUE - Bugs =====
    {
        "slug": "fix-bugs-pack-graphique-fivem",
        "title": "Résoudre les bugs de pack graphique FiveM",
        "category": "pack-graphique",
        "description": "Écran noir, crash au démarrage, textures manquantes, FPS en chute ? Le guide complet pour débugger ton pack graphique étape par étape.",
        "thumbnail": "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/2b1458adfd22199d17399314011143a17e2c2c845ab482a11179e0b1afe3254b.png",
        "difficulty": "Intermédiaire",
        "duration": "15 min",
        "featured": True,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Nettoyer ton jeu (important)",
                "content": "Avant toute chose, nettoie ton jeu avec cet outil officiel de gta5-mods. Il supprime les fichiers résiduels qui causent 90% des bugs graphiques.",
                "link": "https://www.gta5-mods.com/tools/gta-v-mod-remove-tool",
                "warning": "Un nettoyage complet est OBLIGATOIRE avant toute réinstallation.",
            },
            {
                "number": 2,
                "title": "Télécharger le pack",
                "content": "Télécharge le fichier depuis Google Drive. Dézippe-le : tu dois obtenir les dossiers Mods et Plugins.",
            },
            {
                "number": 3,
                "title": "Installer les fichiers",
                "content": "Ouvre FiveM. Clique droit > 'Ouvrir l'emplacement du fichier'. Va dans FiveM Application Data. Glisse les dossiers Mods et Plugins dans FiveM Application Data.",
            },
            {
                "number": 4,
                "title": "Récupérer l'ID Addons",
                "content": "Uniquement pour ceux qui n'ont PAS ReShade. Lance FiveM, appuie sur F8, vérifie que ton ID commence par [Addons], copie-le intégralement puis quitte FiveM.",
            },
            {
                "number": 5,
                "title": "Modifier le fichier CitizenFX",
                "content": "Retourne dans FiveM Application Data, ouvre CitizenFX.ini. Colle le texte [Addons] récupéré dans le F8 tout en bas du fichier.",
                "code": "[Addons]\nReShade5=ID:XXXX acknowledged that ReShade 5.x has a bug that will lead to game crashes",
            },
            {
                "number": 6,
                "title": "Finalisation",
                "content": "Sauvegarde le fichier, ferme tout. Une fois terminé, relance FiveM. Si le bug persiste, recommence au step 1 : 99% des cas sont dus à un nettoyage incomplet.",
                "tip": "Astuce pro : si crash persistant, passe en mode DirectX 11 via les paramètres FiveM.",
            },
        ],
    },

    # ===== OPTIMISATION PC =====
    {
        "slug": "nettoyage-complet-fivem",
        "title": "Nettoyage complet FiveM : booster ses FPS",
        "category": "optimisation",
        "description": "Supprime les fichiers temporaires et logs qui ralentissent FiveM. Méthode safe qui garde ta progression intacte.",
        "thumbnail": "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/95cbb8396ae3dded28c3c21838f7aa15f81cb9bfc6b88f1cb8533e65c656af13.png",
        "difficulty": "Débutant",
        "duration": "5 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Accès aux fichiers source",
                "content": "Clic droit sur FiveM > Ouvrir l'emplacement du fichier > FiveM Application Data.",
            },
            {
                "number": 2,
                "title": "Purge des logs",
                "content": "Videz les dossiers 'crashes' et 'logs' entièrement. Ces fichiers peuvent atteindre plusieurs Go et ralentir le démarrage.",
            },
            {
                "number": 3,
                "title": "Dossier Data",
                "content": "Dans le dossier 'data', supprimez absolument tout SAUF le dossier game-storage. Votre progression est préservée.",
                "warning": "Ne supprimez JAMAIS game-storage, c'est là que FiveM garde vos données utilisateur.",
            },
        ],
    },
    {
        "slug": "fix-erreur-vpn-proxy-fivem",
        "title": "Fix erreur VPN / Proxy sur FiveM",
        "category": "fivem",
        "description": "Connection rejected by server (VPN Detected) ? Voici la solution Windows complète pour désactiver le tunneling qui bloque FiveM.",
        "thumbnail": "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxkYXJrJTIwZ2FtaW5nJTIwc2V0dXAlMjBuZW9ufGVufDB8fHx8MTc3NjY4NjI5NHww&ixlib=rb-4.1.0&q=85",
        "difficulty": "Débutant",
        "duration": "3 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Paramètres Système Windows",
                "content": "Ouvre Paramètres PC > Réseau et Internet. C'est la section clé pour désactiver toutes les fonctions de tunneling qui font croire à FiveM que tu utilises un VPN.",
            },
            {
                "number": 2,
                "title": "Onglet VPN",
                "content": "Onglet VPN > Décochez toutes les options de réseaux limités ou mesurés.",
            },
            {
                "number": 3,
                "title": "Onglet Proxy",
                "content": "Onglet Proxy > Désactivez absolument 'Utiliser un serveur proxy'. Relance FiveM.",
                "tip": "Si l'erreur persiste, désactive temporairement ton antivirus (il ajoute parfois un proxy silencieux).",
            },
        ],
    },

    # ===== PACK SON =====
    {
        "slug": "installer-pack-son-fivem",
        "title": "Installer un pack son FiveM (armes & moteurs)",
        "category": "mods",
        "description": "Bruitages immersifs pour armes et moteurs. Méthode rapide qui remplace directement les fichiers sources de GTA V.",
        "thumbnail": "https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "difficulty": "Débutant",
        "duration": "5 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Chemin Audio GTA V",
                "content": "Allez dans le dossier racine de GTA V, puis suivez ce chemin : x64 > audio > sfx.",
            },
            {
                "number": 2,
                "title": "Remplacement des fichiers",
                "content": "Prenez les fichiers .rpf de votre pack son (ex: RESIDENT.rpf, WEAPONS_PLAYER.rpf) et déposez-les dans le dossier sfx. Validez le remplacement lorsque Windows le demande.",
                "warning": "Faites une sauvegarde des fichiers originaux avant de remplacer (utile si vous voulez revenir en arrière).",
            },
            {
                "number": 3,
                "title": "Lancement",
                "content": "Lancez FiveM. Les sons sont gérés directement par le moteur du jeu, aucune manipulation supplémentaire n'est requise dans FiveM.",
            },
        ],
    },

    # ===== OPTIMISATION PC WINDOWS =====
    {
        "slug": "optimiser-windows-fivem-fps",
        "title": "Optimiser Windows pour FiveM : +30 FPS",
        "category": "optimisation",
        "description": "Plan de bataille Windows : mode performance, désactivation des services inutiles, réglages NVIDIA/AMD pour gagner 20 à 30 FPS sur FiveM.",
        "thumbnail": "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/95cbb8396ae3dded28c3c21838f7aa15f81cb9bfc6b88f1cb8533e65c656af13.png",
        "difficulty": "Intermédiaire",
        "duration": "20 min",
        "featured": True,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Mode Performances élevées",
                "content": "Menu Démarrer > 'Modifier le plan d'alimentation' > 'Afficher les plans supplémentaires' > Sélectionnez 'Performances élevées'. Si absent, créez-le via 'Créer un plan'.",
                "tip": "Sur PC portable, branchez-le secteur. Le mode performance vide la batterie très vite.",
            },
            {
                "number": 2,
                "title": "Désactiver les effets visuels Windows",
                "content": "Touche Windows + R, tapez sysdm.cpl. Onglet 'Paramètres système avancés' > 'Performances' > 'Paramètres' > Cochez 'Ajuster pour obtenir les meilleures performances'.",
            },
            {
                "number": 3,
                "title": "Désactiver les applications en arrière-plan",
                "content": "Paramètres > Confidentialité > Applications en arrière-plan > Désactivez globalement. Libère de la RAM et du CPU.",
            },
            {
                "number": 4,
                "title": "Mode Jeu Windows",
                "content": "Paramètres > Jeux > Mode Jeu > Activez. Windows priorise alors les ressources CPU/GPU pour FiveM.",
            },
            {
                "number": 5,
                "title": "Panneau NVIDIA / AMD",
                "content": "Dans le panneau NVIDIA (ou Radeon Software), ajoutez FiveM.exe et GTA5.exe dans les profils. Réglez : Gestion puissance = Performances maximales, V-Sync = OFF, Mode de latence faible = Ultra.",
                "code": "NVIDIA Control Panel > Paramètres 3D > Gérer les paramètres 3D > Paramètres du programme > Ajouter FiveM.exe",
            },
            {
                "number": 6,
                "title": "Vider le TEMP",
                "content": "Windows + R, tapez %temp%, sélectionnez tout (Ctrl+A), supprimez. Refaites avec temp (sans %). Libère souvent plusieurs Go.",
            },
        ],
    },

    # ===== MODS =====
    {
        "slug": "installer-menyoo-fivem",
        "title": "Installer et utiliser Menyoo en solo",
        "category": "mods",
        "description": "Menyoo est le trainer solo le plus complet pour GTA V. Installation propre, raccourcis essentiels et précautions FiveM.",
        "thumbnail": "https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "difficulty": "Débutant",
        "duration": "10 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Prérequis",
                "content": "Menyoo nécessite ScriptHookV et ScriptHookVDotNet à jour. Téléchargez-les d'abord depuis leurs sites officiels.",
                "warning": "Menyoo est un mod SOLO. Jamais l'utiliser sur un serveur FiveM : ban immédiat.",
            },
            {
                "number": 2,
                "title": "Installation",
                "content": "Téléchargez Menyoo sur gta5-mods. Placez Menyoo.asi et le dossier MenyooStuff à la racine de GTA V (à côté de GTA5.exe).",
                "link": "https://www.gta5-mods.com/scripts/menyoo-pc-sp",
            },
            {
                "number": 3,
                "title": "Lancer le mod",
                "content": "Lancez GTA V en solo via Steam/Rockstar (PAS FiveM). Appuyez sur F8 en jeu pour ouvrir Menyoo.",
                "tip": "Tu peux changer la touche dans le fichier MenyooSettings.ini.",
            },
        ],
    },

    # ===== CROSSHAIR =====
    {
        "slug": "installer-crosshair-fivem",
        "title": "Installer un crosshair custom sur FiveM",
        "category": "crosshair",
        "description": "Remplace le crosshair vanilla de FiveM par un crosshair personnalisé (plus fin, coloré, dot). Méthode sans plugin externe.",
        "thumbnail": "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/95cbb8396ae3dded28c3c21838f7aa15f81cb9bfc6b88f1cb8533e65c656af13.png",
        "difficulty": "Débutant",
        "duration": "5 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Télécharger le pack crosshair",
                "content": "Téléchargez un pack crosshair depuis gta5-mods ou un Discord communautaire. Dézippez-le : vous obtenez un dossier 'crosshair' contenant des fichiers .ytd.",
            },
            {
                "number": 2,
                "title": "Localiser le dossier mods",
                "content": "Ouvrez FiveM Application Data > mods. Si le dossier mods n'existe pas, créez-le.",
            },
            {
                "number": 3,
                "title": "Glisser les fichiers",
                "content": "Glissez les fichiers .ytd du crosshair dans mods/update/update.rpf/x64/textures/. Utilisez OpenIV si vous travaillez avec des .rpf.",
                "warning": "Utilisez uniquement des crosshairs autorisés par votre serveur (vérifier les règles anti-cheat).",
            },
            {
                "number": 4,
                "title": "Test en jeu",
                "content": "Relancez FiveM, équipez une arme et vérifiez l'apparition du nouveau crosshair.",
            },
        ],
    },

    # ===== MANETTE =====
    {
        "slug": "configurer-manette-fivem",
        "title": "Configurer sa manette Xbox/PS sur FiveM",
        "category": "manette",
        "description": "Configure ta manette Xbox, PS4 ou PS5 sur FiveM avec les bonnes deadzones et sensibilités. Inclut la résolution des problèmes de détection.",
        "thumbnail": "https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "difficulty": "Débutant",
        "duration": "10 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Connecter la manette",
                "content": "Xbox : branche en USB ou via Bluetooth (Windows 10/11 la détecte nativement). PS4/PS5 : utilise DS4Windows (pour PS4) ou le pilote natif Windows (pour PS5 en USB).",
                "link": "https://github.com/Ryochan7/DS4Windows",
            },
            {
                "number": 2,
                "title": "Vérifier la détection",
                "content": "Panneau de configuration > 'Configurer les contrôleurs de jeu USB'. Ta manette doit apparaître. Clique dessus > Propriétés pour tester chaque bouton.",
            },
            {
                "number": 3,
                "title": "Activer les contrôles dans GTA V",
                "content": "Lance FiveM, Échap > Paramètres > Contrôles > Type d'entrée > 'Manette'. Le HUD changera automatiquement pour afficher les touches de manette.",
            },
            {
                "number": 4,
                "title": "Régler deadzones & sensibilité",
                "content": "Dans les mêmes paramètres, ajuste 'Deadzone' à 10-15% (évite le drift) et 'Sensibilité visée' à 40-60 selon ton confort.",
                "tip": "Pour un feeling FPS compétitif, utilise une sensibilité élevée (70+) et deadzone faible (5%).",
            },
            {
                "number": 5,
                "title": "Problème : manette non détectée",
                "content": "Si la manette n'est pas vue par FiveM : (1) Ferme Steam (il peut hijack la manette). (2) Redémarre DS4Windows en admin. (3) Vérifie qu'aucun 'controller input blocker' n'est actif dans FiveM.",
                "warning": "Steam Input peut créer des conflits. Désactive-le dans Steam > Paramètres > Manette > Désactiver l'entrée Steam.",
            },
        ],
    },

    # ===== FIVEM - Débuter =====
    {
        "slug": "debuter-sur-fivem",
        "title": "Débuter sur FiveM : le guide complet",
        "category": "fivem",
        "description": "Première fois sur FiveM ? De l'installation à ton premier serveur RP, tout ce qu'il faut savoir pour bien démarrer.",
        "thumbnail": "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/2b1458adfd22199d17399314011143a17e2c2c845ab482a11179e0b1afe3254b.png",
        "difficulty": "Débutant",
        "duration": "15 min",
        "featured": False,
        "published": True,
        "steps": [
            {
                "number": 1,
                "title": "Prérequis : posséder GTA V légal",
                "content": "FiveM nécessite une copie LÉGALE de GTA V sur Steam, Epic Games ou Rockstar Launcher. Les copies piratées sont bannies automatiquement.",
                "warning": "Aucune copie piratée ne fonctionnera. Investis dans GTA V, souvent en solde à -75% sur Steam.",
            },
            {
                "number": 2,
                "title": "Télécharger FiveM",
                "content": "Va sur fivem.net et télécharge l'installateur officiel. Lance-le, il créera un dossier FiveM où tu veux sur ton PC.",
                "link": "https://fivem.net/",
            },
            {
                "number": 3,
                "title": "Premier lancement",
                "content": "Lance FiveM. Il va télécharger les updates de GTA V (10-20 Go la première fois). Connecte ton compte Rockstar quand il le demande.",
            },
            {
                "number": 4,
                "title": "Choisir un serveur",
                "content": "Clique sur 'Servers' dans le menu. Filtre par 'Favorites', 'Lang: FR', et regarde les serveurs avec >100 joueurs. Pour le RP : cherche des serveurs 'whitelist' pour une expérience qualitative.",
                "tip": "Les meilleurs serveurs RP FR ont souvent une candidature à remplir sur leur Discord.",
            },
            {
                "number": 5,
                "title": "Créer son personnage",
                "content": "Une fois sur le serveur, suis le tutoriel intégré. Chaque serveur a son propre créateur de personnage, souvent très détaillé sur les serveurs RP.",
            },
        ],
    },
]
