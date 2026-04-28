/* ============================================================
   NAVBAR — INJECTION HTML ET COMPORTEMENT
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  // Charger le Header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;
        // Si vous avez une fonction pour le menu burger, lancez-la ici
        if (typeof setupBurger === "function") setupBurger();
      });
  }

  // Charger le Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerPlaceholder.innerHTML = data;
      });
  }
});
/* ============================================================
   NAVIGATION SPA
============================================================ */

/**
 * Affiche la page demandée et met à jour l'UI (navbar, liens actifs, scroll).
 * @param {string} pageId - 'home' | 'expertise' | 'cas' | 'apropos' | 'contact'
 */
function showPage(pageId) {
  // Masquer toutes les pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Afficher la page cible
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Remonter en haut de page
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Mettre à jour les liens actifs
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active-link', link.dataset.page === pageId);
  });

  // Gestion de la classe dark-hero sur la navbar
  const navbar = document.getElementById('navbar');
  navbar.classList.add('dark-hero'); // toutes les pages ont un hero sombre
  updateNavbarStyle();

  // Déclencher les animations reveal
  setTimeout(observeReveals, 100);
}

/* ============================================================
   NAVBAR — COMPORTEMENT AU SCROLL
============================================================ */

/** Ajoute/retire la classe "scrolled" selon la position de scroll */
function updateNavbarStyle() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbarStyle, { passive: true });

/* ============================================================
   MENU MOBILE (burger)
============================================================ */

/** Ouvre/ferme le menu mobile */
function toggleMobile() {
  document.getElementById('burger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}

/** Ferme le menu mobile en cliquant à l'extérieur */
document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobileMenu');
  const burger = document.getElementById('burger');

  if (
    menu.classList.contains('open') &&
    !menu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    toggleMobile();
  }
});

/* ============================================================
   ANIMATIONS REVEAL (IntersectionObserver)
============================================================ */

/**
 * Observe les éléments .reveal de la page active et les anime
 * lorsqu'ils entrent dans le viewport.
 */
function observeReveals() {
  const reveals = document.querySelectorAll('.page.active .reveal:not(.visible)');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
}

/* ============================================================
   FORMULAIRE DE CONTACT
============================================================ */

/**
 * Valide le formulaire, puis affiche le message de succès.
 * À connecter à un vrai backend (Formspree, EmailJS, API, etc.)
 * en remplaçant le bloc "// TODO".
 */
function submitForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validation basique
  if (!firstName || !lastName || !email || !message) {
    alert('Merci de remplir tous les champs obligatoires (*).');
    return;
  }

  // Validation email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Veuillez saisir une adresse email valide.');
    return;
  }

  // Envoi via Formspree
  fetch('https://formspree.io/f/xnjgyvog', { // ← remplace par ton URL Formspree
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      message
    })
  })
    .then(response => {
      if (response.ok) {
        // Masquer le formulaire et afficher le succès
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      } else {
        alert("Erreur lors de l'envoi, merci de réessayer.");
      }
    })
    .catch(() => {
      alert("Erreur lors de l'envoi, merci de réessayer.");
    });

  // Masquer le formulaire et afficher le message de succès
  const formContent = document.getElementById('formContent');
  const formSuccess = document.getElementById('formSuccess');
  if (formContent) formContent.style.display = 'none';
  if (formSuccess) formSuccess.classList.add('show');
}

/* ============================================================
   INITIALISATION
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  injectFooters();
  updateNavbarStyle();
  observeReveals();
});
