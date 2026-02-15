# Portfolio Jeremie

Portfolio web de photographie avec galeries dynamiques et formulaire de contact.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Scripts Python](#scripts-python)
- [Technologies](#technologies)
- [Maintenance](#maintenance)

## 🎯 Aperçu

Ce portfolio est un site web statique conçu pour présenter des photographies dans différentes catégories (Mariage, Galerie). Il inclut des animations de défilement, des carrousels d'images et un formulaire de contact fonctionnel.

## ✨ Fonctionnalités

- **Galeries d'images dynamiques** : Carrousels et grilles photo pour différentes catégories
- **Animations de scroll** : Les sections s'animent au défilement de la page
- **Formulaire de contact** : Validation côté client et gestion des erreurs
- **Synchronisation automatique** : Script Python pour mettre à jour automatiquement les galeries
- **Responsive design** : Interface adaptée à tous les appareils
- **Bouton retour en haut** : Navigation facilitée sur les longues pages

## 📁 Structure du projet

```
portfolio-jeremie/
├── Index.html                    # Page principale du portfolio
├── Grille photo Mariage.html     # Galerie dédiée aux photos de mariage
├── Grille photo.html             # Galerie générale de photos
├── script.js                     # Application JavaScript (classe PortfolioApp)
├── update_portfolio.py           # Script de synchronisation des images
├── watch_folders.py              # Script de surveillance des dossiers (optionnel)
├── images/                       # Dossier contenant toutes les images
│   ├── Mariage/                  # Photos de mariage
│   └── Photo/                    # Photos de la galerie générale
├── .gitignore                    # Fichiers à ignorer par Git
├── requirements.txt              # Dépendances Python
└── README.md                     # Ce fichier
```

## 🚀 Installation

### Prérequis

- Python 3.7 ou supérieur
- Un navigateur web moderne
- Git (pour cloner le repository)

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/CodeNinjaPython/portfolio-jeremie.git
   cd portfolio-jeremie
   ```

2. **Installer les dépendances Python** (optionnel, aucune dépendance externe requise)
   ```bash
   pip install -r requirements.txt
   ```

3. **Ouvrir le portfolio**
   
   Ouvrez simplement `Index.html` dans votre navigateur web préféré.

## 💻 Utilisation

### Visualiser le portfolio

Double-cliquez sur `Index.html` ou ouvrez-le avec votre navigateur.

### Ajouter des images

1. Placez vos nouvelles images dans les dossiers appropriés :
   - `images/Mariage/` pour les photos de mariage
   - `images/Photo/` pour les photos de galerie

2. Exécutez le script de synchronisation :
   ```bash
   python update_portfolio.py
   ```

Le script mettra automatiquement à jour les pages HTML avec les nouvelles images.

### Formats d'images supportés

- JPG / JPEG
- PNG
- WebP

## 🔧 Scripts Python

### `update_portfolio.py`

Script principal pour synchroniser les images avec les pages HTML.

**Fonctionnalités :**
- Scan automatique des dossiers d'images
- Génération de HTML pour les grilles et carrousels
- Gestion complète des erreurs
- Logging détaillé des opérations
- Type hints pour une meilleure maintenabilité

**Utilisation :**
```bash
python update_portfolio.py
```

**Logs :**
Les opérations sont enregistrées dans `portfolio_update.log`

**Configuration :**
Les catégories et dossiers sont configurables dans le script via la constante `CATEGORIES`.

### `watch_folders.py`

Script de surveillance optionnel pour détecter automatiquement les changements dans les dossiers d'images.

## 🛠 Technologies

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles et animations
- **JavaScript (ES6+)** : Logique interactive avec programmation orientée objet
  - Classes ES6
  - Async/Await
  - Intersection Observer API
  - Fetch API

### Backend / Scripts
- **Python 3** : Scripts de synchronisation
  - Type hints
  - Logging module
  - Regex pour le traitement HTML

### Services externes
- **Formspree** : Gestion du formulaire de contact

## 🔄 Maintenance

### Mettre à jour le contenu

1. **Images** : Ajoutez vos images dans les dossiers appropriés et lancez `update_portfolio.py`
2. **Textes** : Modifiez directement les fichiers HTML
3. **Styles** : Les styles CSS sont intégrés dans les fichiers HTML

### Bonnes pratiques

- Toujours tester localement avant de déployer
- Vérifier les logs après l'exécution du script de synchronisation
- Optimiser les images avant de les ajouter (compression, redimensionnement)
- Utiliser des noms de fichiers descriptifs sans espaces ni caractères spéciaux

### Débogage

Si les images ne s'affichent pas :
1. Vérifiez que les fichiers sont dans les bons dossiers
2. Consultez `portfolio_update.log` pour voir les erreurs
3. Vérifiez que les extensions de fichiers sont supportées
4. Assurez-vous que les chemins dans le HTML sont corrects

## 📝 Scripts de développement

### Test du script de synchronisation
```bash
python update_portfolio.py
```

### Vérifier la structure
```bash
python -c "import update_portfolio; print(update_portfolio.CATEGORIES)"
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation

## 📄 Licence

Ce projet est un portfolio personnel. Tous droits réservés.

## 👤 Auteur

**Jeremie**
- GitHub: [@CodeNinjaPython](https://github.com/CodeNinjaPython)

## 🔮 Améliorations futures possibles

- [ ] Ajouter un système de lazy loading pour les images
- [ ] Implémenter un mode sombre
- [ ] Ajouter des filtres pour les galeries
- [ ] Créer un panneau d'administration
- [ ] Optimisation automatique des images
- [ ] Support de vidéos dans les galeries
- [ ] Intégration avec un CMS

---

**Note** : Ce README est maintenu à jour. Dernière modification : Février 2026
