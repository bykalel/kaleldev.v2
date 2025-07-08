import "../style.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { renderSocialIcons } from "../components/socialIcon.js";
AOS.init();

// Inicializa tooltips do Bootstrap em todo o documento
const initTooltips = () => {
  const tooltipTriggerList = [
    ...document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  ];
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
};

const loadPage = async (page) => {
  const path = `/src/routes/${page}.html`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Página não encontrada");
    const html = await res.text();
    document.getElementById("app").innerHTML = html;

    // Inicializa tooltips no conteúdo carregado
    initTooltips();

    // Refresca animações AOS
    AOS.refresh();
  } catch (err) {
    document.getElementById("app").innerHTML = "<h2>Página não encontrada</h2>";
  }
};

const updateActiveLink = () => {
  const current = window.location.hash || "#home";
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

// Função para calcular a idade decimal a partir da data de nascimento (sem arredondar)
const calcularIdadeDecimal = (dataNascimento) => {
  const nascimento = new Date(dataNascimento);
  const agora = new Date();

  const diffMs = agora - nascimento;
  const anoMs = 365.25 * 24 * 60 * 60 * 1000;

  const idade = diffMs / anoMs;

  return idade;
};

let intervalId = null; // armazena o id do setInterval para limpar depois

const startIdadeLiveUpdate = (dataNascimento) => {
  const pIdade = document.getElementById("idade-decimal");
  if (!pIdade) return;

  // Limpa intervalo anterior se existir
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Atualiza a idade e mostra com 9 casas decimais
  const atualizarIdade = () => {
    const idade = calcularIdadeDecimal(dataNascimento);
    pIdade.textContent = `I'm ${idade.toFixed(9)} years old`;
  };

  atualizarIdade(); // executa na hora

  intervalId = setInterval(atualizarIdade, 100); // atualiza a cada 100ms
};
const renderArtGallery = () => {
  const container = document.getElementById("art-gallery");
  if (!container) return;

  let current = 0;
  const total = 14; // ou quantas imagens tiver
  const batchSize = 6;

  const loadImages = () => {
    for (let i = total - current; i > total - current - batchSize && i >= 1; i--) {
      const div = document.createElement("div");
      div.className = "masonry-item";
      div.setAttribute("data-aos", "fade-up");

      const img = document.createElement("img");
      img.src = `/images/projects/${i}.png`;
      img.alt = `Artwork ${i}`;

      div.appendChild(img);
      container.appendChild(div);
    }

    current += batchSize;
    AOS.refresh();
  };

  loadImages();

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
      current < total
    ) {
      loadImages();
    }
  });
};

const router = async () => {
  const page = window.location.hash.replace("#", "") || "home";
  await loadPage(page);
  updateActiveLink();

  // Limpa timer se mudar de página
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (page === "home") {
    renderSocialIcons();
    startIdadeLiveUpdate("2007-01-19");
  } else if (page === "about") {
    startIdadeLiveUpdate("2007-01-19");
  } else if (page === "art") {
    renderArtGallery();
  }
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

const setupThemeToggle = () => {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const isDark = theme === "dark";
    const moonIcon = document.getElementById("icon-moon");
    const sunIcon = document.getElementById("icon-sun");

    if (moonIcon && sunIcon) {
      moonIcon.style.display = isDark ? "block" : "none";
      sunIcon.style.display = isDark ? "none" : "block";
    }
  };

  const toggleTheme = () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  };

  // Carrega tema salvo ou define padrão
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // Evento no botão
  document.addEventListener("click", (e) => {
    if (e.target.closest("#theme-toggle")) {
      toggleTheme();
    }
  });
};

const loadComponent = async (id, path) => {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Erro ao carregar ${path}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;

    if (id === "header") {
      setupThemeToggle();
    }
  } catch (err) {
    console.error(err);
    document.getElementById(
      id
    ).innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
};

loadComponent("header", "/src/components/header.html");
