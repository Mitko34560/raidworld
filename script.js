const revealItems = document.querySelectorAll(".reveal");
const buyButtons = document.querySelectorAll(".buy-button");
const copyButtons = document.querySelectorAll(".copy-button");
const interactiveCards = document.querySelectorAll(".product-card, .feature-card, .step-card, .faq-card, .hero-card");
const toast = document.getElementById("toast");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

revealItems.forEach((item) => {
  if (!item.classList.contains("visible")) {
    revealObserver.observe(item);
  }
});

let toastTimer;

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const itemName = button.dataset.item || "выбранный пакет";
    showToast(`Вы выбрали: ${itemName}. Осталось только подключить реальную checkout-ссылку.`);
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue;

    if (!value) {
      showToast("Адрес для копирования не задан.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showToast(`IP адрес ${value} скопирован.`);
    } catch (error) {
      showToast(`Скопируйте вручную: ${value}`);
    }
  });
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
