/* ==========================
   ORTHOCARE - SCRIPT.JS
========================== */

/* ==========================
   CARROSSEL
========================== */

const slides = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  slides[index].classList.add("active");
}

function nextSlide() {
  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  showSlide(currentSlide);
}

nextBtn?.addEventListener("click", nextSlide);
prevBtn?.addEventListener("click", prevSlide);

/* Auto Play */

setInterval(() => {
  nextSlide();
}, 4000);

/* ==========================
   CONTADORES
========================== */

function animateCounter(id, target) {
  const element = document.getElementById(id);

  if (!element) return;

  let count = 0;

  const increment = target / 100;

  const timer = setInterval(() => {
    count += increment;

    if (count >= target) {
      count = target;

      clearInterval(timer);
    }

    if (id === "counter4") {
      element.innerText = Math.floor(count) + "%";
    } else {
      element.innerText = Math.floor(count);
    }
  }, 20);
}

animateCounter("counter1", 87);
animateCounter("counter2", 14);
animateCounter("counter3", 6);
animateCounter("counter4", 82);

/* ==========================
   ESCALA DE DOR
========================== */

const painRange = document.getElementById("painRange");
const painValue = document.getElementById("painValue");
const painFeedback = document.getElementById("painFeedback");

if (painRange) {
  painRange.addEventListener("input", () => {
    const value = Number(painRange.value);

    painValue.innerText = value;

    if (value <= 3) {
      painFeedback.innerText = "Baixo nível de dor";
      painFeedback.style.color = "#10B981";
    } else if (value <= 6) {
      painFeedback.innerText = "Dor moderada";
      painFeedback.style.color = "#F59E0B";
    } else {
      painFeedback.innerText = "Dor elevada";
      painFeedback.style.color = "#EF4444";
    }
  });
}

/* ==========================
   SISTEMA DE ESTRELAS
========================== */

const stars = document.querySelectorAll(".star");

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    stars.forEach((s, i) => {
      if (i <= index) {
        s.classList.remove("fa-regular");
        s.classList.add("fa-solid");
        s.classList.add("active");
      } else {
        s.classList.remove("fa-solid");
        s.classList.add("fa-regular");
        s.classList.remove("active");
      }
    });
  });
});

/* ==========================
   FORMULÁRIO
========================== */

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    alert("Sua dúvida foi enviada com sucesso!");

    form.reset();
  });
}

/* ==========================
   CONTADOR DE EXERCÍCIOS
========================== */

const startButtons = document.querySelectorAll(".start-btn");

let exercisesDone = 87;

startButtons.forEach((button) => {
  button.addEventListener("click", () => {
    exercisesDone++;

    const counter = document.getElementById("counter1");

    if (counter) {
      counter.innerText = exercisesDone;
    }

    showToast("Exercício iniciado!");
  });
});

/* ==========================
   TOAST
========================== */

function showToast(message) {
  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

/* ==========================
   NAVBAR SCROLL
========================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.padding = "12px 8%";

    navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  } else {
    navbar.style.padding = "18px 8%";

    navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
  }
});

/* ==========================
   MENU MOBILE
========================== */

const mobileBtn = document.querySelector(".menu-mobile");

const navLinks = document.querySelector(".nav-links");

if (mobileBtn) {
  mobileBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-active");
  });
}

/* ==========================
   ANIMAÇÃO AO SCROLL
========================== */

const revealElements = document.querySelectorAll(
  ".card, .exercise-card, .stat-card, .badge",
);

function revealOnScroll() {
  revealElements.forEach((el) => {
    const position = el.getBoundingClientRect().top;

    const screen = window.innerHeight - 100;

    if (position < screen) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

/* ==========================
   LOGIN SIMULADO
========================== */

const loginBtn = document.querySelector(".login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    showToast("Login em desenvolvimento");
  });
}
