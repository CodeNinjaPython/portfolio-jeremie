import time
import subprocess
import os
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# =================================================================
# CONFIGURATION
# =================================================================
# Nom du script qui génère le HTML
SYNC_SCRIPT = "update_portfolio.py"

# Dossier parent à surveiller (surveille tout dans /images)
WATCH_DIRECTORY = "images"

# Extensions d'images autorisées
VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

# Délai d'attente (secondes) après la détection pour laisser Lightroom finir d'écrire
DEBOUNCE_DELAY = 5

def run_git_automation():
    """Exécute la séquence Git : Add, Commit, Push."""
    try:
        print("[GitHub] Analyse des changements...")
        
        # 1. Ajout des fichiers (Images + HTML mis à jour)
        subprocess.run(["git", "add", "."], check=True)
        
        # 2. Vérifier s'il y a des changements à commiter
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if not status.stdout.strip():
            print("[GitHub] Aucun changement détecté. Push annulé.")
            return

        # 3. Commit avec horodatage
        commit_msg = f"Mise à jour portfolio auto : {time.strftime('%H:%M:%S')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        
        # 4. Push vers GitHub
        print("[GitHub] Envoi vers le dépôt distant...")
        subprocess.run(["git", "push"], check=True)
        
        print("[Succès] Site déployé et en ligne !")
        
    except subprocess.CalledProcessError as e:
        print(f"[Erreur Git] Échec de l'opération : {e}")
    except Exception as e:
        print(f"[Erreur] {e}")

class ExportHandler(FileSystemEventHandler):
    """Gestionnaire d'événements pour les fichiers d'images."""
    def __init__(self):
        self.last_trigger = 0

    def on_modified(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.process_sync()

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(VALID_EXTENSIONS):
            self.process_sync()

    def process_sync(self):
        current_time = time.time()
        if current_time - self.last_trigger > DEBOUNCE_DELAY:
            self.last_trigger = current_time
            print(f"\n{'='*50}")
            print(f"[Détection] Nouvelles images détectées à {time.strftime('%H:%M:%S')}")
            
            # Étape 1 : Lancer le script de mise à jour HTML
            print("[1/2] Mise à jour des fichiers HTML locaux...")
            try:
                # On utilise sys.executable pour garantir qu'on utilise le même Python
                subprocess.run([sys.executable, SYNC_SCRIPT], check=True)
                
                # Étape 2 : Envoyer sur GitHub
                print("[2/2] Synchronisation avec GitHub...")
                run_git_automation()
                
            except subprocess.CalledProcessError:
                print("[Erreur] Le script de synchronisation a échoué.")
            
            print(f"{'='*50}\nEn attente de nouveaux fichiers...")

if __name__ == "__main__":
    # S'assurer que le script travaille dans son propre répertoire
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if not os.path.exists(WATCH_DIRECTORY):
        os.makedirs(WATCH_DIRECTORY)
        print(f"Dossier '{WATCH_DIRECTORY}' créé.")

    event_handler = ExportHandler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_DIRECTORY, recursive=True)
    
    print(f"--- SYSTÈME D'AUTOMATISATION ACTIF ---")
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
