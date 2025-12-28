import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Chemin vers votre script de synchronisation
SYNC_SCRIPT = "update_portfolio.py"
# Dossiers à surveiller (doivent correspondre à vos dossiers d'export Lightroom)
WATCH_DIRECTORIES = ["images/Mariage", "images/Photo"]

class ExportHandler(FileSystemEventHandler):
    """Déclenche le script Python dès qu'un fichier est créé ou modifié."""
    def __init__(self):
        self.last_trigger = 0

    def on_modified(self, event):
        if not event.is_directory and event.src_path.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            self.trigger_sync()

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            self.trigger_sync()

    def trigger_sync(self):
        # Anti-rebond : évite de lancer le script 50 fois si on exporte 50 photos d'un coup
        current_time = time.time()
        if current_time - self.last_trigger > 2:
            print(f"\n[Lightroom] Nouvelles images détectées. Synchronisation en cours...")
            try:
                subprocess.run(["python", SYNC_SCRIPT], check=True)
                print("[Succès] Site mis à jour.")
            except Exception as e:
                print(f"[Erreur] Impossible de lancer la synchro : {e}")
            self.last_trigger = current_time

if __name__ == "__main__":
    # Vérification des dossiers
    for d in WATCH_DIRECTORIES:
        if not os.path.exists(d):
            os.makedirs(d)

    event_handler = ExportHandler()
    observer = Observer()
    
    for d in WATCH_DIRECTORIES:
        observer.schedule(event_handler, d, recursive=True)
        print(f"Surveillance activée pour : {d}")

    observer.start()
    print("En attente d'un export Lightroom... (Ctrl+C pour arrêter)")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
