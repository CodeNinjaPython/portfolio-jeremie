document.addEventListener('DOMContentLoaded', () => {
  // Script pour l'animation de scroll (Intersection Observer)
  const sections = document.querySelectorAll('section');

  const observerOptions = {
    root: null, /* viewport */
    rootMargin: '0px',
    threshold: 0.1 /* 10% de la section visible */
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Pour les sections, la classe 'is-visible' est ajoutée pour les animations
      // mais elles sont visibles par défaut via CSS pour éviter le contenu manquant.
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // observer.unobserve(entry.target); // Optionnel: pour une animation qui ne se déclenche qu'une fois
      } else {
        // Optionnel: Supprimer la classe si la section sort du viewport pour réinitialiser l'animation
        // entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Script pour le bouton "Retour en haut"
  const backToTopButton = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Affiche le bouton après 300px de défilement
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Script pour la soumission du formulaire de contact
  const contactForm = document.querySelector('.contact-form form');
  const successMessage = document.getElementById('successMessage');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const formData = new FormData(contactForm);
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json' // Important pour que Formspree renvoie du JSON
        }
      });

      if (response.ok) {
        contactForm.reset(); // Vide le formulaire
        successMessage.classList.remove('hidden');
        successMessage.classList.add('show');
        // Cache le message après quelques secondes
        setTimeout(() => {
          successMessage.classList.remove('show');
          successMessage.classList.add('hidden');
        }, 5000); // Message visible pendant 5 secondes
      } else {
        // Gérer les erreurs (par exemple, afficher un message d'erreur)
        console.error('Échec de la soumission du formulaire.');
        // Vous pouvez afficher un message d'erreur personnalisé ici si vous le souhaitez
        // Par exemple: alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur réseau ou autre:', error);
      // Gérer les erreurs réseau
      // Par exemple: alert('Impossible de se connecter au service d\'envoi. Vérifiez votre connexion.');
    }
  });

  // Script pour la section contact collapsible
  const contactSectionTitle = document.querySelector('#contact h2');
  const contactContent = document.getElementById('contactContent');
  const contactToggleIcon = document.getElementById('contactToggleIcon');

  // Au clic sur le titre, bascule l'état ouvert/fermé
  contactSectionTitle.addEventListener('click', () => {
      contactContent.classList.toggle('expanded');
      contactToggleIcon.classList.toggle('rotated');
  });
});
