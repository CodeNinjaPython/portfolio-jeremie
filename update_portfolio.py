"""
Portfolio synchronization script.

This script automatically updates HTML files with images from specified folders.
It supports multiple categories (mariage, galerie) and updates both grid pages
and carousel sections in the index page.
"""

import os
import re
import sys
import logging
from typing import List, Tuple, Dict, Optional

# =================================================================
# LOGGING CONFIGURATION
# =================================================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('portfolio_update.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

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
        "grille_file": "Grille photo.html",
        "comment_marker": "PHOTO--GALERIE"
    }
}

INDEX_FILE = 'Index.html'
VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

def get_image_list(folder: str) -> List[Tuple[str, str]]:
    """
    Scan a folder and return a list of image files.
    
    Args:
        folder: Path to the folder to scan for images
        
    Returns:
        List of tuples containing (full_path, filename) for each image
        
    Raises:
        OSError: If there's an error accessing the folder
    """
    image_paths = []
    
    if not os.path.exists(folder):
        logger.warning(f"Le dossier {folder} n'existe pas.")
        return []
    
    try:
        for root, dirs, files in os.walk(folder):
            for file in sorted(files):
                if file.lower().endswith(VALID_EXTENSIONS):
                    # Formatage du chemin pour le web (slashs)
                    full_path = os.path.join(root, file).replace('\\', '/')
                    image_paths.append((full_path, file))
        
        # Tri alphabétique pour respecter l'ordre d'export
        return sorted(list(set(image_paths)))
    except OSError as e:
        logger.error(f"Erreur lors de la lecture du dossier {folder}: {e}")
        raise

def generate_html_content(
    image_list: List[Tuple[str, str]], 
    category_name: str, 
    content_type: str = "grille"
) -> str:
    """
    Generate HTML content for either grid pages or carousel sections.
    
    Args:
        image_list: List of tuples containing (path, filename) for each image
        category_name: Name of the category (e.g., 'mariage', 'galerie')
        content_type: Type of content to generate ('grille' or 'carousel')
        
    Returns:
        Generated HTML content as a string
        
    Raises:
        ValueError: If content_type is not 'grille' or 'carousel'
    """
    if content_type not in ('grille', 'carousel'):
        raise ValueError(f"Invalid content_type: {content_type}. Must be 'grille' or 'carousel'")
    
    if content_type == 'grille':
        return _generate_grille_html(image_list)
    else:
        return _generate_carousel_html(image_list, category_name)


def _generate_grille_html(image_list: List[Tuple[str, str]]) -> str:
    """
    Generate HTML for grid photo pages.
    
    Args:
        image_list: List of tuples containing (path, filename) for each image
        
    Returns:
        HTML string with photo cards
    """
    cards = []
    delay = 0.1
    
    for path, filename in image_list:
        clean_name = os.path.splitext(filename)[0]
        card_html = (
            f'        <div class="photo-card" style="animation-delay: {delay:.1f}s;">'
            f'<img src="{path}" alt="{clean_name}"></div>'
        )
        cards.append(card_html)
        # On augmente le délai d'apparition progressivement (max 2s)
        if delay < 2.0:
            delay += 0.1
    
    return "\n".join(cards)


def _generate_carousel_html(image_list: List[Tuple[str, str]], category_name: str) -> str:
    """
    Generate HTML for carousel sections in the index page.
    
    Args:
        image_list: List of tuples containing (path, filename) for each image
        category_name: Name of the category for alt text
        
    Returns:
        HTML string with carousel items
    """
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

def update_html_section(file_path: str, pattern: str, new_content: str) -> bool:
    """
    Inject new HTML content into target files using regex pattern matching.
    
    Args:
        file_path: Path to the HTML file to update
        pattern: Regex pattern to match the section to replace
        new_content: New HTML content to inject
        
    Returns:
        True if update was successful, False otherwise
        
    Raises:
        IOError: If there's an error reading or writing the file
    """
    if not os.path.exists(file_path):
        logger.error(f"Le fichier {file_path} est introuvable.")
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except IOError as e:
        logger.error(f"Erreur lors de la lecture du fichier {file_path}: {e}")
        raise

    if not re.search(pattern, content, flags=re.DOTALL | re.IGNORECASE):
        logger.warning(f"Le pattern n'a pas été trouvé dans {file_path}")
        return False

    try:
        # Remplacement du bloc central en conservant les balises de début et de fin
        new_html = re.sub(
            pattern, 
            f'\\1\n{new_content}\n\\3', 
            content, 
            flags=re.DOTALL | re.IGNORECASE
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        
        logger.info(f"Fichier {file_path} mis à jour avec succès.")
        return True
    except IOError as e:
        logger.error(f"Erreur lors de l'écriture du fichier {file_path}: {e}")
        raise

def main() -> int:
    """
    Main function to synchronize portfolio images with HTML files.
    
    Returns:
        0 if successful, 1 if there were errors
    """
    # Force le script à s'exécuter dans son propre dossier (Indispensable pour Automator)
    script_path = os.path.abspath(__file__)
    os.chdir(os.path.dirname(script_path))
    
    logger.info("=== SYNCHRONISATION AUTOMATIQUE DU PORTFOLIO ===")
    errors_occurred = False
    
    for cat_id, config in CATEGORIES.items():
        logger.info(f"\nTraitement de la catégorie : {cat_id.upper()}")
        
        try:
            images = get_image_list(config["folder"])
            
            if not images:
                logger.warning(
                    f"Dossier {config['folder']} vide. Aucune photo à synchroniser."
                )
                continue

            # 1. Mise à jour de la GRILLE (Grille photo Mariage.html, etc.)
            grille_pattern = r'(<main[^>]*id=["\']gallery["\'][^>]*>)(.*?)(</main>)'
            grille_content = generate_html_content(images, cat_id, 'grille')
            
            if update_html_section(config["grille_file"], grille_pattern, grille_content):
                logger.info(
                    f"Fichier '{config['grille_file']}' mis à jour ({len(images)} photos)."
                )
            else:
                logger.error(
                    f"Impossible de trouver la zone <main id=\"gallery\"> "
                    f"dans {config['grille_file']}."
                )
                errors_occurred = True

            # 2. Mise à jour de l'INDEX (Index.html)
            marker = config["comment_marker"]
            index_pattern = (
                f'(<!--\\s*.*?{marker}.*?-->)(.*?)'
                f'(</div>\\s*<div[^>]*class=["\']carousel-nav-buttons["\'])'
            )
            carousel_content = generate_html_content(images, cat_id, 'carousel')

            if update_html_section(INDEX_FILE, index_pattern, carousel_content):
                logger.info(f"Index.html ({cat_id}) mis à jour.")
            else:
                # Plan B : Recherche par structure si le commentaire a été supprimé
                fallback_pattern = (
                    f'(id=["\']{config["html_id"]}["\'][^>]*>\\s*'
                    f'<div[^>]*class=["\']carousel-track["\'][^>]*>)(.*?)'
                    f'(</div>\\s*<div[^>]*class=["\']carousel-nav-buttons["\'])'
                )
                if update_html_section(INDEX_FILE, fallback_pattern, carousel_content):
                    logger.info(f"Index.html ({cat_id}) mis à jour (via structure).")
                else:
                    logger.error(
                        f"Zone de carrousel introuvable pour {cat_id} dans {INDEX_FILE}."
                    )
                    errors_occurred = True
                    
        except Exception as e:
            logger.error(f"Erreur lors du traitement de la catégorie {cat_id}: {e}")
            errors_occurred = True

    if errors_occurred:
        logger.warning("\n=== SYNCHRONISATION TERMINÉE AVEC DES ERREURS ===")
        return 1
    else:
        logger.info("\n=== SYNCHRONISATION TERMINÉE AVEC SUCCÈS ===")
        return 0

if __name__ == "__main__":
    sys.exit(main())
