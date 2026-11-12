document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. HEADER, MENU MAGNÉTICO, SCROLLSPY E LUZ DINÂMICA DO HERO
     ========================================================= */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const heroSection = document.querySelector('.hero-facade');
  const mouseGlow = document.getElementById('mouse-glow');
  const pageSections = document.querySelectorAll('section[id], footer[id]');

  function setActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function updateScrollSpy() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Se o usuário chegou ao final da página, ativa "Contato" (footer)
    if (scrollPosition + windowHeight >= documentHeight - 60) {
      setActiveNavLink('contato');
      return;
    }

    // Ponto de referência no terço superior da tela para troca fluida
    const triggerPoint = scrollPosition + windowHeight * 0.35;

    pageSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (triggerPoint >= sectionTop && triggerPoint < sectionTop + sectionHeight) {
        setActiveNavLink(sectionId);
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    updateScrollSpy();
  }, { passive: true });

  // Executa ao carregar a página para garantir o estado inicial correto
  updateScrollSpy();

  if (heroSection && mouseGlow) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseGlow.style.left = `${x}px`;
      mouseGlow.style.top = `${y}px`;
      mouseGlow.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseGlow.style.opacity = '0.35';
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('mousemove', (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      link.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translate(0px, 0px)';
    });

    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');

      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-scroll').forEach(el => revealObserver.observe(el));

  /* =========================================================
     2. CONCIERGE DE AGENDAMENTO & EFEITO 3D NA IMAGEM
     ========================================================= */
  const tiltFrame = document.getElementById('tilt-frame');
  const treatmentChips = document.querySelectorAll('.treatment-chip');
  const dateScroller = document.getElementById('date-scroller');
  const timeSlots = document.querySelectorAll('.time-slot');
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-back');
  const formSteps = document.querySelectorAll('.form-step');
  const stepIndicators = document.querySelectorAll('.step-item');
  const conciergeForm = document.getElementById('concierge-form');
  const phoneInput = document.getElementById('patient-phone');

  const bookingState = {
    treatment: 'Avaliação & Check-up Digital',
    dateLabel: '',
    time: '10:30'
  };

  if (tiltFrame) {
    tiltFrame.addEventListener('mousemove', (e) => {
      const rect = tiltFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltFrame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    tiltFrame.addEventListener('mouseleave', () => {
      tiltFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  function populateNextBusinessDays() {
    if (!dateScroller) return;
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    let currentDate = new Date();
    let added = 0;

    while (added < 5) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0) {
        const dayName = daysOfWeek[currentDate.getDay()];
        const dayNum = String(currentDate.getDate()).padStart(2, '0');
        const monthName = months[currentDate.getMonth()];
        const fullLabel = `${dayName}, ${dayNum}/${monthName}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `date-card ${added === 0 ? 'selected' : ''}`;
        btn.innerHTML = `
          <span class="day-name">${dayName}</span>
          <span class="day-num">${dayNum}</span>
          <span class="month-name">${monthName}</span>
        `;

        if (added === 0) bookingState.dateLabel = fullLabel;

        btn.addEventListener('click', () => {
          document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
          btn.classList.add('selected');
          bookingState.dateLabel = fullLabel;
          updateSummary();
        });

        dateScroller.appendChild(btn);
        added++;
      }
    }
  }
  populateNextBusinessDays();

  function selectTreatmentChip(treatmentName) {
    treatmentChips.forEach(c => {
      if (c.dataset.value === treatmentName) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
    bookingState.treatment = treatmentName;
    updateSummary();
  }

  treatmentChips.forEach(chip => {
    chip.addEventListener('click', () => {
      selectTreatmentChip(chip.dataset.value);
    });
  });

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.time = slot.dataset.time;
      updateSummary();
    });
  });

  function goToStep(stepNumber) {
    formSteps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`).classList.add('active');

    stepIndicators.forEach(ind => {
      const s = Number(ind.dataset.step);
      ind.classList.toggle('active', s === Number(stepNumber));
      ind.classList.toggle('completed', s < Number(stepNumber));
    });

    updateSummary();
  }

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.next));
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.prev));
  });

  function updateSummary() {
    const sumTreatment = document.getElementById('summary-treatment');
    const sumDatetime = document.getElementById('summary-datetime');
    if (sumTreatment) sumTreatment.textContent = bookingState.treatment;
    if (sumDatetime) sumDatetime.textContent = `${bookingState.dateLabel} às ${bookingState.time}`;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
      e.target.value = v;
    });
  }

  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value.trim();
      const phone = phoneInput.value.trim();

      if (!name || phone.length < 14) {
        alert('Por favor, preencha seu nome completo e WhatsApp para confirmarmos o horário.');
        return;
      }

      const clinicWhatsApp = '5511930000000'; 
      const message = `Olá, Dra. Gabriele! Gostaria de confirmar um pré-agendamento na *Caires Clínica Odontológica*:%0A%0A` +
                      `👤 *Paciente:* ${name}%0A` +
                      `🦷 *Procedimento:* ${bookingState.treatment}%0A` +
                      `📅 *Data:* ${bookingState.dateLabel}%0A` +
                      `⏰ *Horário:* ${bookingState.time}%0A` +
                      `📱 *Contato:* ${phone}`;

      window.open(`https://wa.me/${clinicWhatsApp}?text=${message}`, '_blank');
    });
  }

  /* =========================================================
     3. TRATAMENTOS: FÍSICA 3D TILT, REFLEXO ESPECULAR E ATALHO AGENDA
     ========================================================= */
  const interactiveCards = document.querySelectorAll('.interactive-card');
  const bookTreatmentLinks = document.querySelectorAll('.book-treatment-link');

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transition = 'transform 0.1s ease-out, border-color 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease, box-shadow 0.45s ease';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  bookTreatmentLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenTreatment = btn.dataset.treatment;
      selectTreatmentChip(chosenTreatment);
      goToStep(2);

      const bookingEl = document.getElementById('agendamento');
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* =========================================================
     4. SOBRE A DOUTORA: EFEITO 3D SUAVE NO RETRATO CENTRAL
     ========================================================= */
  const doctorPortraitCard = document.getElementById('doctor-portrait-card');
  if (doctorPortraitCard) {
    doctorPortraitCard.addEventListener('mousemove', (e) => {
      const rect = doctorPortraitCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      doctorPortraitCard.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });

    doctorPortraitCard.addEventListener('mouseleave', () => {
      doctorPortraitCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* =========================================================
     5. FOOTER: ANO DINÂMICO & BOTÃO VOLTAR AO TOPO
     ========================================================= */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});