# Guide d'Accès aux Tableaux de Bord FEGAMOD

Ce document fournit les coordonnées d'accès à chaque panneau (tableau de bord) du système d'administration de la Fédération Gabonaise de la Mode (FEGAMOD). Chaque panneau est protégé par une authentification et un contrôle d'accès basé sur le rôle de l'utilisateur.

## Chemins d'Accès aux Panneaux

Voici les URLs pour accéder à chaque tableau de bord :

- **Présidente** : `/admin/president-dashboard`
  - Rôle requis : Présidente
  - Fonctionnalités : Vue d'ensemble complète, rapports généraux.

- **Secrétaire Général** : `/admin/secretary-dashboard`
  - Rôle requis : Secrétaire Général
  - Fonctionnalités : Gestion des événements et communications.

- **Relations Publiques** : `/admin/relations-dashboard`
  - Rôle requis : Relations Publiques
  - Fonctionnalités : Gestion des partenaires et médias.

- **Trésorerie** : `/admin/treasurer-dashboard`
  - Rôle requis : Trésorerie
  - Fonctionnalités : Rapports financiers et statistiques de revenus.

- **Admin (Général)** : `/admin`
  - Rôle requis : Admin
  - Fonctionnalités : Accès complet à toutes les fonctionnalités système.

## Identifiants de Connexion

Pour tester ou accéder aux panneaux, utilisez les identifiants par défaut (à personnaliser en production) :

- **Email** : `admin@fegamod.ga`
- **Mot de passe** : `password`

**Note** : Après connexion, l'utilisateur sera redirigé vers le panneau correspondant à son rôle (si configuré dans le système).

## Instructions d'Accès

1. **Connexion** : Accédez à `/admin/login` pour vous connecter.
2. **Navigation** : Une fois authentifié, utilisez le menu latéral ou tapez l'URL directement dans le navigateur.
3. **Vérification des Permissions** : Le système vérifiera automatiquement le rôle de l'utilisateur. Si le rôle ne correspond pas, un message "Accès refusé" sera affiché.
4. **Gestion des Utilisateurs** : Pour ajouter ou modifier des utilisateurs et leurs rôles, utilisez la page `/admin/users`.

## Configuration Supplémentaire

- **Base de Données** : Les données sont gérées via Convex. Assurez-vous que `npx convex dev` est exécuté pour générer les fichiers API.
- **Sécurité** : En production, changez les mots de passe par défaut et configurez les rôles via la page d'administration.
- **Déploiement** : Les panneaux sont déployés avec le site principal via Vercel ou votre hébergeur.

Pour toute modification ou ajout, contactez l'administrateur système.

---
Document généré automatiquement pour FEGAMOD.
