function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  const el = document.getElementById(pageName);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
}

function toggleDarkMode() {
  const body = document.body;
  const header = document.getElementById('header');
  const toggle = document.getElementById('darkModeToggle');
  
  body.classList.toggle('dark-mode');
  if (header) header.classList.toggle('dark-mode');
  if (toggle) toggle.classList.toggle('active');
}

// API base - ajuste conforme seu ambiente
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Funções de autenticação
async function registerUser(nome, email, senha) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return { error: "Erro ao conectar com servidor" };
  }
}

async function loginUser(email, senha) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no login:", err);
    return { error: "Erro ao conectar com servidor" };
  }
}

// Sistema de comentários (usa API)
const comentariosDiv = document.getElementById("comentarios");
const form = document.getElementById("form-coment");

async function postComment(cartaId, texto) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para comentar!');
    showPage('login');
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cartaId, texto })
    });
    return await res.json();
  } catch (err) {
    console.error('Erro ao enviar comentário:', err);
    return null;
  }
}

function renderizarComentarios() {
  const container = document.getElementById('comentarios-lista');
  if (!container) return;

  // Limpa comentários anteriores (exceto o formulário)
  const comentariosAntigos = container.querySelectorAll('.comment');
  comentariosAntigos.forEach(c => c.remove());

  const form = container.querySelector('.comment-form');
  
  comentarios.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    
    const dataRelativa = getTempoRelativo(new Date(c.data));
    const inicial = c.autor.charAt(0).toUpperCase();
    
    div.innerHTML = `
      <div class="comment-header">
        <div class="avatar">${inicial}</div>
        <div class="comment-body">
          <h4>${c.autor}</h4>
          <div class="comment-date">${dataRelativa}</div>
          <p class="comment-text">${c.texto}</p>
        </div>
      </div>
    `;
    
    if (form) {
      container.insertBefore(div, form);
    } else {
      container.appendChild(div);
    }
  });
}

function getTempoRelativo(data) {
  const agora = new Date();
  const diff = Math.floor((agora - data) / 1000);
  
  if (diff < 60) return 'Agora mesmo';
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
  if (diff < 604800) return `Há ${Math.floor(diff / 86400)} dias`;
  return `Há ${Math.floor(diff / 604800)} semanas`;
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Configurar formulário de login
  const loginPage = document.getElementById("login");
  if (loginPage) {
    const emailInput = loginPage.querySelector('input[type="email"]');
    const senhaInput = loginPage.querySelector('input[type="password"]');
    const btn = loginPage.querySelector('.btn-submit');
    
    if (btn && emailInput && senhaInput) {
      btn.onclick = async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.textContent = 'Entrando...';
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        
        if (!email || !senha) {
          alert("Preencha todos os campos!");
          btn.disabled = false;
          btn.textContent = 'Entrar';
          return;
        }
        
        const data = await loginUser(email, senha);
        btn.disabled = false;
        btn.textContent = 'Entrar';
        
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Login realizado com sucesso!");
          showPage('home');
          renderUserState();
        } else {
          alert(data.error || "Erro no login");
        }
      };
    }
  }

  // Configurar formulário de cadastro
  const cadPage = document.getElementById("cadastro");
  if (cadPage) {
    const inputs = cadPage.querySelectorAll('input');
    const nomeInput = inputs[0];
    const emailInput = inputs[1];
    const senhaInput = inputs[2];
    const senhaConf = inputs[3];
    const btn = cadPage.querySelector('.btn-submit');
    
    if (btn && nomeInput && emailInput && senhaInput && senhaConf) {
      btn.onclick = async (e) => {
        e.preventDefault();
        
        if (!nomeInput.value || !emailInput.value || !senhaInput.value) {
          alert("Preencha todos os campos!");
          return;
        }
        
        if (senhaInput.value !== senhaConf.value) {
          alert("As senhas não coincidem!");
          return;
        }
        
        btn.disabled = true;
        btn.textContent = 'Cadastrando...';
        
        const data = await registerUser(
          nomeInput.value.trim(),
          emailInput.value.trim(),
          senhaInput.value.trim()
        );
        
        btn.disabled = false;
        btn.textContent = 'Criar Conta';
        
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Cadastro realizado com sucesso!");
          showPage('home');
          renderUserState();
        } else {
          alert(data.error || "Erro no cadastro");
        }
      };
    }
  }

  // Configurar formulário de comentários
  const commentsPage = document.getElementById("comentarios");
  if (commentsPage) {
    const textarea = commentsPage.querySelector('textarea');
    const btnEnviar = commentsPage.querySelector('.comment-form .btn-submit');
    
    if (btnEnviar && textarea) {
      btnEnviar.onclick = (e) => {
        e.preventDefault();
        const texto = textarea.value.trim();
        
        if (!texto) {
          alert("Escreva um comentário!");
          return;
        }
        // Para este projeto sem banco, usamos API (postComment)
        const cartaId = null; // se quiser associar a uma carta, mudar aqui
        postComment(cartaId, texto).then(result => {
          if (result && !result.error) {
            textarea.value = '';
            alert('Comentário adicionado com sucesso!');
            // fetchComments(); SSE deve atualizar automaticamente
          } else {
            alert(result?.error || 'Erro ao enviar comentário');
          }
        });
      };
    }
  }

  // Renderizar estado inicial
  renderUserState();
  // carregar comentários iniciais e conectar SSE
  fetchComments();
  try {
    const evt = new EventSource(EVENTS_URL);
    evt.addEventListener('newComment', e => {
      try {
        const data = JSON.parse(e.data);
        // inserir novo comentário no topo
        comentarios.unshift(data);
        renderizarComentarios();
      } catch (err) { console.error('Erro no evento SSE:', err); }
    });
  } catch (err) {
    console.warn('EventSource não suportado ou falha na conexão SSE:', err);
  }

  renderizarComentarios();
  carregarCarrossel();
});

// Mostrar estado do usuário
function renderUserState() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const top = document.querySelector(".header-top");
  if (!top) return;

  // Remover botões anteriores
  const existing = document.getElementById("userBox");
  if (existing) existing.remove();

  const box = document.createElement("div");
  box.id = "userBox";
  box.style.display = "flex";
  box.style.alignItems = "center";
  box.style.gap = "10px";

  if (user) {
    const name = document.createElement("span");
    name.textContent = `Olá, ${user.nome}`;
    name.style.fontWeight = "bold";
    name.style.color = "#374151";
    
    const logout = document.createElement("button");
    logout.textContent = "Sair";
    logout.className = "btn-cadastro";
    logout.onclick = () => {
      if (confirm("Deseja realmente sair?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        renderUserState();
        showPage('home');
        alert("Você saiu da sua conta!");
      }
    };
    
    box.appendChild(name);
    box.appendChild(logout);
  } else {
    const entrar = document.createElement("button");
    entrar.textContent = "Entrar";
    entrar.className = "btn-cadastro";
    entrar.onclick = () => showPage('login');
    
    const cad = document.createElement("button");
    cad.textContent = "Cadastrar";
    cad.className = "btn-cadastro";
    cad.style.background = "#7c3aed";
    cad.onclick = () => showPage('cadastro');
    
    box.appendChild(entrar);
    box.appendChild(cad);
  }

  top.appendChild(box);
}

// Buscar cartas dos Arcanos Maiores
async function fetchCartasMaiores() {
  try {
    // servidor sem-npm expõe /api/cartas
    const res = await fetch(`${API_BASE}/cartas`);
    if (!res.ok) throw new Error('Erro ao buscar cartas');
    const data = await res.json();
    console.log("Cartas carregadas da API:", data.length, "cartas");
    // caso a API retorne objetos com campos esperados, use-os
    return data && data.length > 0 ? data : gerarCartasFallback();
  } catch (err) {
    console.error("Erro ao buscar cartas:", err);
    console.log("Usando fallback...");
    // Retorna cartas de fallback se API falhar
    return gerarCartasFallback();
  }
}


// Carregar carrossel de Arcanos Maiores
async function carregarCarrossel() {
  // Criar container do carrossel no final da página home
  const homePage = document.getElementById("home");
  if (!homePage) return;
  
  let carrossel = document.getElementById("carrossel");
  if (!carrossel) {
    carrossel = document.createElement("div");
    carrossel.id = "carrossel";
    carrossel.style.maxWidth = "800px";
    carrossel.style.margin = "50px auto";
    carrossel.style.position = "relative";
    
    // Adicionar título
    const titulo = document.createElement("h2");
    titulo.textContent = "Arcanos Maiores";
    titulo.style.textAlign = "center";
    titulo.style.fontSize = "36px";
    titulo.style.marginBottom = "30px";
    titulo.style.fontFamily = "cursive";
    
    homePage.querySelector('.container').appendChild(titulo);
    homePage.querySelector('.container').appendChild(carrossel);
  }

  const cartas = await fetchCartasMaiores();
  if (!cartas || !cartas.length) {
    carrossel.innerHTML = "<p style='text-align:center; color:#374151'>Carregando cartas...</p>";
    return;
  }

  // Limpar e criar track
  carrossel.innerHTML = "";
  const track = document.createElement("div");
  track.className = "carousel-track";
  track.style.display = "flex";
  track.style.transition = "transform 0.5s ease";
  track.style.overflow = "hidden";
  carrossel.appendChild(track);

  // Adicionar slides
  cartas.forEach(c => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.minWidth = "100%";
    slide.style.boxSizing = "border-box";
    slide.style.padding = "20px";
    slide.style.display = "flex";
    slide.style.flexDirection = "column";
    slide.style.alignItems = "center";
    
    slide.innerHTML = `
      <div style="width:300px; height:450px; border-radius:20px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,0.15)">
        <img src="${c.imagem}" alt="${c.nome}" 
             onerror="this.src='https://via.placeholder.com/300x450/7c3aed/ffffff?text=${encodeURIComponent(c.nome)}'"
             style="width:100%; height:100%; object-fit:cover;">
      </div>
      <h3 style="margin-top:20px; font-size:24px; color:#374151">${c.nome}</h3>
      <p style="font-size:12px; color:#9ca3af; margin-bottom:8px">Arcano ${c.numero}</p>
      <p style="max-width:500px; text-align:center; color:#4b5563; line-height:1.6">${c.significado}</p>
    `;
    track.appendChild(slide);
  });

  // Controles do carrossel
  const prev = document.createElement("button");
  const next = document.createElement("button");
  prev.innerHTML = "&#8249;";
  next.innerHTML = "&#8250;";
  
  [prev, next].forEach(btn => {
    btn.style.position = "absolute";
    btn.style.top = "40%";
    btn.style.transform = "translateY(-50%)";
    btn.style.background = "rgba(124, 58, 237, 0.9)";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.borderRadius = "50%";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "32px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.zIndex = "10";
    btn.style.transition = "all 0.3s";
  });
  
  prev.style.left = "10px";
  next.style.right = "10px";
  
  prev.onmouseover = () => prev.style.background = "rgba(124, 58, 237, 1)";
  prev.onmouseout = () => prev.style.background = "rgba(124, 58, 237, 0.9)";
  next.onmouseover = () => next.style.background = "rgba(124, 58, 237, 1)";
  next.onmouseout = () => next.style.background = "rgba(124, 58, 237, 0.9)";
  
  carrossel.appendChild(prev);
  carrossel.appendChild(next);

  // Indicadores
  const indicators = document.createElement("div");
  indicators.style.display = "flex";
  indicators.style.justifyContent = "center";
  indicators.style.gap = "10px";
  indicators.style.marginTop = "20px";
  carrossel.appendChild(indicators);

  cartas.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.background = i === 0 ? "#7c3aed" : "#d1d5db";
    dot.style.cursor = "pointer";
    dot.style.transition = "all 0.3s";
    dot.onclick = () => { index = i; update(); resetAuto(); };
    indicators.appendChild(dot);
  });

  // Lógica de navegação
  let index = 0;
  
  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    const dots = indicators.querySelectorAll('div');
    dots.forEach((dot, i) => {
      dot.style.background = i === index ? "#7c3aed" : "#d1d5db";
    });
  }

  prev.onclick = () => {
    index = (index - 1 + cartas.length) % cartas.length;
    update();
    resetAuto();
  };
  
  next.onclick = () => {
    index = (index + 1) % cartas.length;
    update();
    resetAuto();
  };

  // Auto play
  let timer = setInterval(() => {
    index = (index + 1) % cartas.length;
    update();
  }, 5000);

  function resetAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index + 1) % cartas.length;
      update();
    }, 5000);
  }
}

const cards = [
  {
  "numero": 0,
  "nome": "O Louco",
  "imagem": "/images/0-louco.jpg",
  "significado": "Novos começos, espontaneidade, fé no universo. Representa a liberdade e o início de uma jornada sem medo.",
  "arcano": "maior"
}, {
  "numero": 1,
  "nome": "O Mago",
  "imagem": "/images/1-mago.jpg",
  "significado": "Manifestação, poder pessoal, recursos disponíveis. Simboliza o domínio das habilidades e a capacidade de transformar ideias em realidade.",
  "arcano": "maior"
}, {
  "numero": 2,
  "nome": "A Sacerdotisa",
  "imagem": "/images/2-sacerdotisa.jpg",
  "significado": "Intuição, mistério, sabedoria interior. Representa o conhecimento oculto e a conexão com o subconsciente.",
  "arcano": "maior"
}, {
  "numero": 3,
  "nome": "A Imperatriz",
  "imagem": "/images/3-imperatriz.jpg",
  "significado": "Abundância, criatividade, maternidade. Simboliza a fertilidade, o crescimento e a conexão com a natureza.",
  "arcano": "maior"
}, {
  "numero": 4,
  "nome": "O Imperador",
  "imagem": "blublublu/public/images/4-imperador.jpg",
  "significado": "Estrutura, liderança, autoridade. Representa a ordem, a disciplina e o estabelecimento de fundações sólidas.",
  "arcano": "maior"
}, {
  "numero": 5,
  "nome": "O Hierofante",
  "imagem": "/images/5-hierofante.jpg",
  "significado": "Tradição, ensino, orientação espiritual. Simboliza as instituições, os sistemas de crença e a sabedoria dos mestres.",
  "arcano": "maior"
}, {
  "numero": 6,
  "nome": "Os Amantes",
  "imagem": "/images/6-amantes.jpg",
  "significado": "Escolhas, relacionamentos, harmonia. Representa as decisões importantes, a união e o equilíbrio entre opostos.",
  "arcano": "maior"
}, {
  "numero": 7,
  "nome": "O Carro",
  "imagem": "public/images/7-carro.jpg",
  "significado": "Vontade, conquista, determinação. Simboliza o movimento direcionado, a superação de obstáculos e a vitória.",
  "arcano": "maior"
}, {
  "numero": 8,
  "nome": "Força",
  "imagem": "public/images/8-forca.jpg",
  "significado": "Coragem, controle interior, compaixão. Representa a força gentil, o domínio dos instintos através da paciência.",
  "arcano": "maior"
}, {
  "numero": 9,
  "nome": "O Eremita",
  "imagem": "public/images/9-eremita.jpg",
  "significado": "Introspecção, busca interior, sabedoria. Simboliza a solidão necessária para o autoconhecimento e a iluminação.",
  "arcano": "maior"
}, {
  "numero": 10,
  "nome": "Roda da Fortuna",
  "imagem": "public/images/10-roda.jpg",
  "significado": "Ciclos, destino, mudanças. Representa as reviravoltas da vida, o karma e a natureza cíclica da existência.",
  "arcano": "maior"
}, {
  "numero": 11,
  "nome": "Justiça",
  "imagem": "public/images/11-justica.jpg",
  "significado": "Equilíbrio, verdade, responsabilidade. Simboliza as consequências das ações e a busca pela imparcialidade.",
  "arcano": "maior"
}, {
  "numero": 12,
  "nome": "O Enforcado",
  "imagem": "public/images/12-enforcado.jpg",
  "significado": "Sacrifício, nova perspectiva, rendição. Representa a pausa necessária e a mudança de ponto de vista.",
  "arcano": "maior"
}, {
  "numero": 13,
  "nome": "A Morte",
  "imagem": "public/images/13-morte.jpg",
  "significado": "Transformação, fim de ciclos, renovação. Simboliza as mudanças profundas e o renascimento após o término.",
  "arcano": "maior"
}, {
  "numero": 14,
  "nome": "Temperança",
  "imagem": "public/images/14-temperanca.jpg",
  "significado": "Equilíbrio, moderação, paciência. Representa a alquimia interior e a harmonização de elementos opostos.",
  "arcano": "maior"
}, {
  "numero": 15,
  "nome": "O Diabo",
  "imagem": "public/images/15-diabo.jpg",
  "significado": "Apego, sombras, limitações. Simboliza os vícios, as amarras e as ilusões que nos mantêm prisioneiros.",
  "arcano": "maior"
}, {
  "numero": 16,
  "nome": "A Torre",
  "imagem": "public/images/16-torre.jpg",
  "significado": "Ruptura, revelação, mudança súbita. Representa o colapso de estruturas falsas e a libertação através da destruição.",
  "arcano": "maior"
}, {
  "numero": 17,
  "nome": "A Estrela",
  "imagem": "public/images/17-estrela.jpg",
  "significado": "Esperança, cura, inspiração. Simboliza a renovação da fé, a orientação divina e a serenidade após a tempestade.",
  "arcano": "maior"
}, {
  "numero": 18,
  "nome": "A Lua",
  "imagem": "public/images/18-lua.jpg",
  "significado": "Ilusões, intuição, subconsciente. Representa os medos ocultos, os sonhos e as profundezas da psique.",
  "arcano": "maior"
}, {
  "numero": 19,
  "nome": "O Sol",
  "imagem": "public/images/19-sol.jpg",
  "significado": "Sucesso, alegria, vitalidade. Simboliza a claridade, o otimismo e a realização plena.",
  "arcano": "maior"
}, {
  "numero": 20,
  "nome": "O Julgamento",
  "imagem": "public/images/20-julgamento.jpg",
  "significado": "Renovação, despertar, julgamento final. Representa o chamado interior, a redenção e o renascimento espiritual.",
  "arcano": "maior"
}, {
  "numero": 21,
  "nome": "O Mundo",
  "imagem": "public/images/21-mundo.jpg",
  "significado": "Conclusão, realização, integração. Simboliza a completude, o sucesso duradouro e o fim de um grande ciclo.",
  "arcano": "maior"
}]


document.addEventListener("DOMContentLoaded", () => {

  const carousel = document.getElementById('carousel');
  const titleEl = document.getElementById('card-title');
  const meaningEl = document.getElementById('card-meaning');
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

let current = 0;
let slides = [];

const PLACEHOLDER = 'placeholder.jpg';

function buildCarousel(){
  carousel.innerHTML = '';
  dotsWrap.innerHTML = '';

  cards.forEach((card, idx) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.index = idx;

    const img = document.createElement('img');
    img.src = card.imagem; // ex: "images/0-louco.jpg"
    img.alt = card.nome;
    // trata erro de carregar imagem
    img.onerror = () => {
      console.warn('Imagem não encontrada:', img.src);
      img.src = PLACEHOLDER;
    };

    slide.appendChild(img);
    carousel.appendChild(slide);

    // dots
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = idx;
    dot.addEventListener('click', () => goTo(idx));
    dotsWrap.appendChild(dot);
  });

  slides = Array.from(document.querySelectorAll('.slide'));
  updateUI();
}

// atualiza título, significado, active slide e dots
function updateUI(){
  slides.forEach((s,i) => {
    s.classList.toggle('active', i === current);
  });
  const card = cards[current];
  titleEl.textContent = `${card.nome} (${card.numero})`;
  meaningEl.textContent = card.significado;

  const dots = Array.from(document.querySelectorAll('.dot'));
  dots.forEach((d,i)=> d.classList.toggle('active', i===current));
}

// navega para índice
function goTo(i){
  if(i < 0) i = cards.length - 1;
  if(i >= cards.length) i = 0;
  current = i;
  updateUI();
}

// handlers
prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

// autoplay
let interval = null;
function startAutoplay(){
  interval = setInterval(()=> goTo(current + 1), 4000);
}
function resetAutoplay(){
  clearInterval(interval);
  startAutoplay();
}

// inicialização
buildCarousel();
startAutoplay();

});


