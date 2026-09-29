# Rhode – Application e-commerce full-stack

Application e-commerce complète inspirée du site de la marque de soins **rhode**, réalisée comme projet personnel pour apprendre le développement web full-stack.

> ⚠️ Projet à but **éducatif** uniquement. Il n'est pas affilié à la marque rhode. Les images et noms de produits appartiennent à leurs propriétaires.

---

## Fonctionnalités

- **Catalogue dynamique** : produits chargés depuis l'API, filtres par catégorie et tri
- **Page produit** avec choix de la quantité
- **Panier** (tiroir latéral) sauvegardé dans le navigateur, barre de livraison gratuite
- **Authentification** : inscription et connexion, mots de passe hachés avec **bcrypt**, sessions avec **JWT**
- **Passage de commande** enregistré avec une **transaction SQL** (prix et stock vérifiés côté serveur)
- **Espace client** : profil et historique des commandes
- **Tableau de bord administrateur** (rôle `admin`) : ajouter / modifier / supprimer des produits, changer le statut des commandes
- **Recommandations par IA** : section « vous aimerez aussi » calculée avec **KNN** (Python, scikit-learn)
- **Docker** : base de données, API et phpMyAdmin lancés en une seule commande

---

## Technologies

| Partie | Technologies |
|---|---|
| Front-end | HTML, Tailwind CSS, JavaScript (modules ES), Vite |
| Back-end | Node.js, Express, API REST |
| Base de données | MySQL / MariaDB, requêtes paramétrées, transactions, clés étrangères |
| Sécurité | bcrypt, JWT, rôles (client / admin) |
| IA | Python, pandas, scikit-learn (TF-IDF + KNN), Jupyter |
| Outils | Docker, Docker Compose, phpMyAdmin, Git, GitHub |

---

## Architecture

```
Navigateur (Vite – port 5173)
        │  fetch (JSON)
        ▼
API Node.js / Express (port 3000)   ── conteneur Docker
        │  requêtes SQL
        ▼
Base de données MariaDB             ── conteneur Docker
        ▲
        │  recommandations pré-calculées
Notebook Python (KNN)

phpMyAdmin (port 8081)              ── conteneur Docker
```

---

## Lancer le projet

**Prérequis :** Docker Desktop et Node.js.

1. Créer un fichier `.env` à la racine :
   ```
   DB_PASSWORD=choisir_un_mot_de_passe
   JWT_SECRET=choisir_une_longue_cle_secrete
   ```

2. Lancer la base de données, l'API et phpMyAdmin :
   ```
   docker compose up -d
   ```

3. Lancer le front-end :
   ```
   npm install
   npm run dev
   ```

4. Ouvrir :
   - Site : http://localhost:5173
   - API : http://localhost:3000/api/health
   - phpMyAdmin : http://localhost:8081

---

## Principales routes de l'API

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| POST | `/api/register` | public | Créer un compte |
| POST | `/api/login` | public | Se connecter (renvoie un JWT) |
| GET | `/api/me` | connecté | Profil de l'utilisateur |
| GET | `/api/products` | public | Liste des produits |
| GET | `/api/products/:id` | public | Détail d'un produit |
| GET | `/api/products/:id/recommendations` | public | Produits similaires (IA) |
| POST | `/api/orders` | connecté | Passer une commande |
| GET | `/api/orders/mine` | connecté | Mes commandes |
| POST / PUT / DELETE | `/api/products` | admin | Gérer les produits |
| GET | `/api/admin/orders` | admin | Toutes les commandes |
| PUT | `/api/admin/orders/:id/status` | admin | Changer le statut |

---

## Système de recommandation

Le notebook `ai/` calcule, pour chaque produit, les 3 produits les plus similaires :

1. Le texte du produit (nom, catégorie, description) est transformé en nombres avec **TF-IDF**
2. Le **prix** est ajouté, mis à l'échelle entre 0 et 1
3. **KNN** (`NearestNeighbors`) trouve les plus proches voisins
4. Les résultats sont enregistrés dans la table `product_recommendations`, puis servis par l'API

---

## Prochaines étapes

- Déploiement en ligne
- Intégration continue avec GitHub Actions

---

Réalisé par **Aya Zgolli**, étudiante en 3ème année de Licence en Informatique (ISI Kef).
