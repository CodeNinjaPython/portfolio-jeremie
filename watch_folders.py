import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Chemin vers votre script de synchronisation
SYNC_SCRIPT = "update_portfolio.py"
# Dossier parent à surveiller
WATCH_DIRECTORY = "images"
# Extensions d'images autorisées
VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

class ExportHandler(FileSystemEventHandler):
    """Déclenche le script Python dès qu'un fichier est créé ou modifié dans 'images'."""
    def __init__(self):
        self.last_trigger = 0

    def on_modified(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.trigger_sync(event.src_path)

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.trigger_sync(event.src_path)

    def trigger_sync(self, file_path):
        # Anti-rebond : attend 2 secondes après la dernière modification détectée
        # Cela évite de lancer le script 50 fois pendant un export groupé Lightroom
        current_time = time.time()
        if current_time - self.last_trigger > 2:
            print(f"\n[Detection] Fichier détecté : {os.path.basename(file_path)}")
            print(f"[Lightroom] Lancement de la synchronisation globale...")
            try:
                # Utilise 'python3' ou 'python' selon votre installation
                subprocess.run(["python3", SYNC_SCRIPT], check=True)
                print("[Succès] Portfolio et Grilles mis à jour.")
            except Exception as e:
                print(f"[Erreur] Impossible de lancer {SYNC_SCRIPT} : {e}")
            self.last_trigger = current_time

if __name__ == "__main__":
    # Vérification que le dossier images existe
    if not os.path.exists(WATCH_DIRECTORY):
        os.makedirs(WATCH_DIRECTORY)
        print(f"Dossier '{WATCH_DIRECTORY}' créé.")

    event_handler = ExportHandler()
    observer = Observer()
    
    # L'option recursive=True permet de surveiller TOUS les sous-dossiers de /images
    observer.schedule(event_handler, WATCH_DIRECTORY, recursive=True)
    
    print(f"--- SURVEILLANCE ACTIVE : {os.path.abspath(WATCH_DIRECTORY)} ---")
    print("Tous les sous-dossiers sont inclus. En attente d'un export... (Ctrl+C pour arrêter)")

    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nArrêt de la surveillance...")
        observer.stop()
    observer.join()
