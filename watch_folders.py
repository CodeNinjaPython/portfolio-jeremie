import json
import os
import subprocess
import sys
import time
from pathlib import Path

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

CONFIG_FILE = "portfolio_sync_config.json"
SYNC_SCRIPT = "update_portfolio.py"
WATCH_DIRECTORY = "images"
DEFAULT_VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
DEBOUNCE_DELAY = 5


def load_config():
    config = json.loads(Path(CONFIG_FILE).read_text(encoding="utf-8"))
    if "index_file" not in config or "categories" not in config:
        raise ValueError(f"{CONFIG_FILE} doit contenir 'index_file' et 'categories'.")
    valid_extensions = tuple(ext.lower() for ext in config.get("valid_extensions", DEFAULT_VALID_EXTENSIONS))
    tracked_paths = ["images", config["index_file"], *[category["grille_file"] for category in config["categories"]]]
    return valid_extensions, tracked_paths


VALID_EXTENSIONS, TRACKED_PATHS = load_config()


def run_git_automation():
    """Exécute la séquence Git : Add, Commit, Push."""
    try:
        print("[GitHub] Analyse des changements...")
        subprocess.run(["git", "add", *TRACKED_PATHS], check=True)

        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, check=True)
        if not status.stdout.strip():
            print("[GitHub] Aucun changement détecté. Push annulé.")
            return

        commit_msg = f"Mise à jour portfolio auto : {time.strftime('%H:%M:%S')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)

        print("[GitHub] Envoi vers le dépôt distant...")
        subprocess.run(["git", "push"], check=True)
        print("[Succès] Site déployé et en ligne !")
    except subprocess.CalledProcessError as exc:
        print(f"[Erreur Git] Échec de l'opération : {exc}")
    except Exception as exc:
        print(f"[Erreur] {exc}")


class ExportHandler(FileSystemEventHandler):
    """Gestionnaire d'événements pour les fichiers d'images."""

    def __init__(self):
        self.last_trigger = 0
        self.sync_in_progress = False
        self.pending_sync = False

    def on_modified(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.process_sync()

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.process_sync()

    def process_sync(self):
        current_time = time.time()
        if self.sync_in_progress:
            self.pending_sync = True
            return

        if current_time - self.last_trigger <= DEBOUNCE_DELAY:
            return

        self.last_trigger = current_time
        self.sync_in_progress = True

        try:
            print(f"\n{'=' * 50}")
            print(f"[Détection] Nouvelles images détectées à {time.strftime('%H:%M:%S')}")
            print("[1/2] Mise à jour des fichiers HTML locaux...")
            try:
                subprocess.run([sys.executable, SYNC_SCRIPT], check=True)
                print("[2/2] Synchronisation avec GitHub...")
                run_git_automation()
            except subprocess.CalledProcessError:
                print("[Erreur] Le script de synchronisation a échoué.")

            print(f"{'=' * 50}\nEn attente de nouveaux fichiers...")
        finally:
            self.sync_in_progress = False
            if self.pending_sync:
                self.pending_sync = False
                self.last_trigger = 0
                self.process_sync()


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent)

    if not os.path.exists(WATCH_DIRECTORY):
        os.makedirs(WATCH_DIRECTORY)
        print(f"Dossier '{WATCH_DIRECTORY}' créé.")

    event_handler = ExportHandler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_DIRECTORY, recursive=True)

    print("--- SYSTÈME D'AUTOMATISATION ACTIF ---")
    print(f"Surveillance récursive de : {os.path.abspath(WATCH_DIRECTORY)}")
    print("Action : Synchro HTML + Push GitHub automatique.")

    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nArrêt des services...")
        observer.stop()
    observer.join()
