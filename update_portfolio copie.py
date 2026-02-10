
import os
import re
import sys

# =================================================================
# CONFIGURATION DES CATÉGORIES
# =================================================================
CATEGORIES = {
    "mariage": {
        "folder": "images/Mariage",
        "html_id": "carousel-mariage",
        "grille_file": "Grille photo Mariage.html",
        "comment_marker": "PHOTO--MARIAGE"
    },
    "galerie": {
        "folder": "images/Photo",
        "html_id": "carousel-galerie",
        "grille_file": "grille photo.html",
        "comment_marker": "PHOTO--GALERIE"
    }
}

INDEX_FILE = 'index.html'
VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

def get_image_list(folder):
    """Parcourt un dossier et retourne la liste des images."""
    image_paths = []
    if not os.path.exists(folder):
        print(f"Avertissement : Le dossier {folder} n'existe pas.")
        return []
        
    for root, dirs, files in os.walk(folder):
        for file in sorted(files):
            if file.lower().endswith(VALID_EXTENSIONS):
                # Formatage du chemin pour le web (slashs)
                full_path = os.path.join(root, file).replace('\\', '/')
                image_paths.append((full_path, file))
    
    # Tri alphabétique pour respecter l'ordre d'export
    return sorted(list(set(image_paths)))

def generate_grille_content(image_list, category_name):
    """Génère le HTML pour les pages de grille photo."""
    cards = []
    delay = 0.1
    for path, filename in image_list:
        clean_name = os.path.splitext(filename)[0]
        card_html = f'        <div class="photo-card" style="animation-delay: {delay:.1f}s;"><img src="{path}" alt="{clean_name}"></div>'
        cards.append(card_html)
        # On augmente le délai d'apparition progressivement (max 2s)
        if delay < 2.0:
            delay += 0.1
    return "\n".join(cards)

def generate_carousel_content(image_list, category_name):
    """Génère le HTML pour les carrousels de la page index."""
    items = []
    for path, filename in image_list:
        clean_name = os.path.splitext(filename)[0]
        item_html = f'''<div class="photo-item">
<a class="photo-lightbox-trigger" data-src-large="{path}" href="{path}">
<img alt="Photo {category_name} - {clean_name}" src="{path}"/>
</a>
</div>'''
        items.append(item_html)
    return "\n".join(items)

def update_html_section(file_path, pattern, new_content):
    """Injecte le nouveau contenu HTML dans les fichiers cibles."""
    if not os.path.exists(file_path):
        print(f"Erreur : Le fichier {file_path} est introuvable.")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not re.search(pattern, content, flags=re.DOTALL | re.IGNORECASE):
        return False

    # Remplacement du bloc central en conservant les balises de début et de fin
    new_html = re.sub(pattern, f'\\1\n{new_content}\n\\3', content, flags=re.DOTALL | re.IGNORECASE)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    return True

def main():
    # Force le script à s'exécuter dans son propre dossier (Indispensable pour Automator)
    script_path = os.path.abspath(__file__)
    os.chdir(os.path.dirname(script_path))
    
    print("--- SYNCHRONISATION AUTOMATIQUE DU PORTFOLIO ---")
    
    for cat_id, config in CATEGORIES.items():
        print(f"\nTraitement de la catégorie : {cat_id.upper()}")
        images = get_image_list(config["folder"])
        
        if not images:
            print(f"-> Dossier {config['folder']} vide. Aucune photo à synchroniser.")
            continue

        # 1. Mise à jour de la GRILLE (Grille photo Mariage.html, etc.)
        # Recherche la balise <main id="gallery"> jusqu'à </main>
        grille_pattern = r'(<main[^>]*id=["\']gallery["\'][^>]*>)(.*?)(</main>)'
        if update_html_section(config["grille_file"], grille_pattern, generate_grille_content(images, cat_id)):
            print(f"-> Fichier '{config['grille_file']}' mis à jour ({len(images)} photos).")
        else:
            print(f"-> Erreur : Impossible de trouver la zone <main id=\"gallery\"> dans {config['grille_file']}.")

        # 2. Mise à jour de l'INDEX (index.html)
        # Recherche entre le commentaire PHOTO - ... et les boutons de navigation du carrousel
        marker = config["comment_marker"]
        index_pattern = f'(<!--\\s*.*?{marker}.*?-->)(.*?)(</div>\\s*<div[^>]*class=["\']carousel-nav-buttons["\'])'

        if update_html_section(INDEX_FILE, index_pattern, generate_carousel_content(images, cat_id)):
            print(f"-> index.html ({cat_id}) mis à jour.")
        else:
            # Plan B : Recherche par structure si le commentaire a été supprimé par erreur
            fallback_pattern = f'(id=["\']{config["html_id"]}["\'][^>]*>\\s*<div[^>]*class=["\']carousel-track["\'][^>]*>)(.*?)(</div>\\s*<div[^>]*class=["\']carousel-nav-buttons["\'])'
            if update_html_section(INDEX_FILE, fallback_pattern, generate_carousel_content(images, cat_id)):
                print(f"-> index.html ({cat_id}) mis à jour (via structure).")
            else:
                print(f"-> Erreur critique : Zone de carrousel introuvable pour {cat_id}.")

    print("\n--- SYNCHRONISATION TERMINÉE AVEC SUCCÈS ---")

if __name__ == "__main__":
    main()
