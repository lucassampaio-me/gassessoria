/**
 * Gomes Assessoria V2 - JavaScript
 * Menu mobile, Accordion FAQ, Tabs, Scroll suave
 */

(function() {
  'use strict';

  // ========================================
  // Mobile Menu
  // ========================================
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');

  function toggleMobileMenu() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    mobileMenu.classList.toggle('is-open', !isOpen);

    // Impedir scroll do body quando menu aberto
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Fechar menu ao clicar em um link
    mobileMenuLinks?.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Fechar menu ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }


  // ========================================
  // FAQ Accordion
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item__question');

  faqItems.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      // Fechar todas as outras perguntas
      faqItems.forEach(otherButton => {
        if (otherButton !== button) {
          otherButton.setAttribute('aria-expanded', 'false');
          const otherId = otherButton.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) {
            otherAnswer.hidden = true;
          }
        }
      });

      // Toggle da pergunta atual
      button.setAttribute('aria-expanded', !isExpanded);
      if (answer) {
        answer.hidden = isExpanded;
      }
    });
  });


  // ========================================
  // Research Tabs
  // ========================================
  const tabButtons = document.querySelectorAll('.research-tabs__btn');
  const tabPanels = document.querySelectorAll('.research-tabs__panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('aria-controls');

      // Atualizar estados dos botões
      tabButtons.forEach(btn => {
        btn.setAttribute('aria-selected', btn === button);
      });

      // Mostrar/esconder painéis
      tabPanels.forEach(panel => {
        panel.hidden = panel.id !== targetId;
      });
    });

    // Navegação por teclado
    button.addEventListener('keydown', (e) => {
      const buttons = Array.from(tabButtons);
      const currentIndex = buttons.indexOf(button);
      let newIndex;

      switch (e.key) {
        case 'ArrowLeft':
          newIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
          break;
        case 'ArrowRight':
          newIndex = currentIndex === buttons.length - 1 ? 0 : currentIndex + 1;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      buttons[newIndex].focus();
      buttons[newIndex].click();
    });
  });


  // ========================================
  // Smooth Scroll para links internos
  // ========================================
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();

        // Considerar altura do header fixo
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Mover foco para o elemento alvo (acessibilidade)
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });


  // ========================================
  // Header scroll behavior
  // ========================================
  const header = document.querySelector('.header');

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    // Adicionar sombra quando rolar
    if (currentScrollY > 10) {
      header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
  }

  if (header) {
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }


  // ========================================
  // Botão flutuante WhatsApp - mostrar após hero
  // ========================================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const heroSection = document.querySelector('.hero');

  if (whatsappFloat && heroSection) {
    // Inicialmente oculto
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.visibility = 'hidden';
    whatsappFloat.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Se o hero NÃO está visível, mostra o botão
        if (!entry.isIntersecting) {
          whatsappFloat.style.opacity = '1';
          whatsappFloat.style.visibility = 'visible';
        } else {
          whatsappFloat.style.opacity = '0';
          whatsappFloat.style.visibility = 'hidden';
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });

    heroObserver.observe(heroSection);
  }


  // ========================================
  // Tracking de cliques nos CTAs (analytics ready)
  // ========================================
  const ctaButtons = document.querySelectorAll('.btn--whatsapp');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Disparar evento para Google Analytics (se configurado)
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: 'WhatsApp Click',
          value: 1
        });
      }
    });
  });

})();
