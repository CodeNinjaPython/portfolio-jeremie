import html
import json
import os
import re
from pathlib import Path

CONFIG_FILE = "portfolio_sync_config.json"
DEFAULT_VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
GRID_START_MARKER = "<!-- AUTO-GALLERY-START -->"
GRID_END_MARKER = "<!-- AUTO-GALLERY-END -->"


def normalize_web_path(path):
    """Normalise un chemin pour l'injection dans le HTML."""
    return str(path).replace("\\", "/")


def read_text(file_path):
    return Path(file_path).read_text(encoding="utf-8")


def write_text_if_changed(file_path, content):
    path = Path(file_path)
    current = path.read_text(encoding="utf-8")
    if current == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True


def build_category(raw_category):
    required_keys = {"id", "folder", "html_id", "grille_file"}
    missing_keys = required_keys - raw_category.keys()
    if missing_keys:
        missing = ", ".join(sorted(missing_keys))
        raise ValueError(f"Catégorie invalide dans {CONFIG_FILE}: clés manquantes: {missing}")

    category_id = raw_category["id"]
    return {
        "id": category_id,
        "label": raw_category.get("label", category_id),
        "folder": raw_category["folder"],
        "html_id": raw_category["html_id"],
        "grille_file": raw_category["grille_file"],
        "grid_start_marker": GRID_START_MARKER,
        "grid_end_marker": GRID_END_MARKER,
        "index_start_marker": f"<!-- AUTO-CAROUSEL-{category_id.upper()}-START -->",
        "index_end_marker": f"<!-- AUTO-CAROUSEL-{category_id.upper()}-END -->",
    }


def load_config():
    raw_config = json.loads(read_text(CONFIG_FILE))
    if "index_file" not in raw_config or "categories" not in raw_config:
        raise ValueError(f"{CONFIG_FILE} doit contenir 'index_file' et 'categories'.")
    categories = [build_category(category) for category in raw_config["categories"]]
    valid_extensions = tuple(ext.lower() for ext in raw_config.get("valid_extensions", DEFAULT_VALID_EXTENSIONS))
    return {
        "index_file": raw_config["index_file"],
        "valid_extensions": valid_extensions,
        "categories": categories,
    }


def get_optimized_path(path):
    """Construit le chemin de la miniature optimisée à partir du chemin source."""
    normalized = normalize_web_path(path)
    if normalized.startswith("images/"):
        return normalized.replace("images/", "images/optimized/", 1)
    return normalized


def get_image_list(folder, valid_extensions):
    """Parcourt un dossier et retourne la liste des images."""
    image_paths = []
    folder_path = Path(folder)
    if not folder_path.exists():
        print(f"Avertissement : Le dossier {folder} n'existe pas.")
        return []

    for path in sorted(folder_path.rglob("*")):
        if path.is_file() and path.suffix.lower() in valid_extensions:
            image_paths.append((normalize_web_path(path), path.name))

    return sorted(set(image_paths))


def generate_grille_content(image_list):
    """Génère le HTML pour les pages de grille photo."""
    cards = []
    delay = 0.1
    for path, filename in image_list:
        clean_name = html.escape(Path(filename).stem, quote=True)
        safe_path = html.escape(path, quote=True)
        safe_optimized_path = html.escape(get_optimized_path(path), quote=True)
        cards.append(
            f'        <div class="photo-card" style="animation-delay: {delay:.1f}s;">'
            f'<img src="{safe_optimized_path}" data-full="{safe_path}" loading="lazy" decoding="async" alt="{clean_name}"></div>'
        )
        if delay < 2.0:
            delay += 0.1
    return "\n".join(cards)


def generate_carousel_content(image_list, category_label):
    """Génère le HTML pour les carrousels de la page index."""
    items = []
    safe_label = html.escape(category_label, quote=True)
    for path, filename in image_list:
        clean_name = html.escape(Path(filename).stem, quote=True)
        safe_path = html.escape(path, quote=True)
        safe_optimized_path = html.escape(get_optimized_path(path), quote=True)
        items.append(
            f"""<div class="photo-item">
<a class="photo-lightbox-trigger" data-src-large="{safe_path}" href="{safe_path}">
<img alt="Photo {safe_label} - {clean_name}" decoding="async" loading="lazy" src="{safe_optimized_path}"/>
</a>
</div>"""
        )
    return "\n".join(items)


def replace_between_markers(content, start_marker, end_marker, new_content):
    """Remplace le contenu entre deux marqueurs de manière déterministe."""
    start_index = content.find(start_marker)
    if start_index == -1:
        return None

    search_from = start_index + len(start_marker)
    end_index = content.find(end_marker, search_from)
    if end_index == -1:
        return None

    return f"{content[:search_from]}\n{new_content}\n{content[end_index:]}"


def update_between_markers(file_path, start_marker, end_marker, new_content):
    """Injecte du contenu entre deux marqueurs explicites."""
    path = Path(file_path)
    if not path.exists():
        print(f"Erreur : Le fichier {file_path} est introuvable.")
        return False

    new_html = replace_between_markers(read_text(path), start_marker, end_marker, new_content)
    if new_html is None:
        return False

    write_text_if_changed(path, new_html)
    return True


def ensure_grid_markers(file_path, start_marker, end_marker):
    """Ajoute les marqueurs d'injection dans la zone <main id="gallery"> si nécessaire."""
    content = read_text(file_path)
    if start_marker in content and end_marker in content:
        return True

    pattern = r'(<main[^>]*id=["\']gallery["\'][^>]*>)(.*?)(</main>)'
    match = re.search(pattern, content, flags=re.DOTALL | re.IGNORECASE)
    if not match:
        return False

    existing_body = match.group(2).strip()
    wrapped_body = f"\n{start_marker}\n{existing_body}\n{end_marker}\n"
    updated = content[:match.start()] + match.group(1) + wrapped_body + match.group(3) + content[match.end():]
    write_text_if_changed(file_path, updated)
    return True


def ensure_index_markers(file_path, html_id, start_marker, end_marker):
    """Ajoute des marqueurs d'injection dans un carrousel si nécessaire."""
    content = read_text(file_path)
    if start_marker in content and end_marker in content:
        return True

    pattern = (
        rf'(<div class="carousel-container" id="{re.escape(html_id)}">\s*'
        rf'<div class="carousel-track">)(.*?)(</div>\s*<div class="carousel-nav-buttons">)'
    )
    match = re.search(pattern, content, flags=re.DOTALL)
    if not match:
        return False

    existing_body = match.group(2).strip()
    wrapped_body = f"\n{start_marker}\n{existing_body}\n{end_marker}\n"
    updated = content[:match.start()] + match.group(1) + wrapped_body + match.group(3) + content[match.end():]
    write_text_if_changed(file_path, updated)
    return True


def main():
    script_path = Path(__file__).resolve()
    os.chdir(script_path.parent)

    config = load_config()
    index_file = config["index_file"]
    valid_extensions = config["valid_extensions"]
    failures = []

    print("--- SYNCHRONISATION AUTOMATIQUE DU PORTFOLIO ---")

    for category in config["categories"]:
        print(f"\nTraitement de la catégorie : {category['id'].upper()}")
        images = get_image_list(category["folder"], valid_extensions)

        if not images:
            print(f"-> Dossier {category['folder']} vide. Aucune photo à synchroniser.")
            continue

        if not ensure_grid_markers(
            category["grille_file"],
            category["grid_start_marker"],
            category["grid_end_marker"],
        ):
            failures.append(f"Zone <main id=\"gallery\"> introuvable dans {category['grille_file']}")
        elif update_between_markers(
            category["grille_file"],
            category["grid_start_marker"],
            category["grid_end_marker"],
            generate_grille_content(images),
        ):
            print(f"-> Fichier '{category['grille_file']}' mis à jour ({len(images)} photos).")
        else:
            failures.append(f"Marqueurs de galerie introuvables dans {category['grille_file']}")

        if not ensure_index_markers(
            index_file,
            category["html_id"],
            category["index_start_marker"],
            category["index_end_marker"],
        ):
            failures.append(f"Zone de carrousel introuvable pour {category['id']}")
        elif update_between_markers(
            index_file,
            category["index_start_marker"],
            category["index_end_marker"],
            generate_carousel_content(images, category["label"]),
        ):
            print(f"-> {index_file} ({category['id']}) mis à jour.")
        else:
            failures.append(f"Marqueurs de carrousel introuvables pour {category['id']}")

    if failures:
        print("\n--- SYNCHRONISATION TERMINÉE AVEC ERREURS ---")
        for failure in failures:
            print(f"-> {failure}")
        return 1

    print("\n--- SYNCHRONISATION TERMINÉE AVEC SUCCÈS ---")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
