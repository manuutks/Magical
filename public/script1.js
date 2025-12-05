document.addEventListener("DOMContentLoaded", () => {
    
    // Controle de páginas
    function mostrarPagina(pag) {
        document.querySelectorAll(".pagina").forEach(p => p.classList.remove("ativa"));
        document.getElementById(pag).classList.add("ativa");
    }
    window.mostrarPagina = mostrarPagina;



    // ============================
    // CARROSSEL
    // ============================

    const cartas = [
        { nome: "O Louco", imagem: "images/0-louco.jpg" },
        { nome: "A Sacerdotisa", imagem: "images/2-sacerdotisa.jpg" },
        { nome: "A Imperatriz", imagem: "images/3-imperatriz.jpg" }
        // adicione o resto aqui
    ];

    const carrossel = document.getElementById("carrossel");
    const btnVoltar = document.getElementById("voltar");
    const btnAvancar = document.getElementById("avancar");
    let indice = 0;

    function renderizarSlides() {
        carrossel.innerHTML = "";
        cartas.forEach((carta, i) => {
            const slide = document.createElement("div");
            slide.className = "slide";
            if (i === indice) slide.classList.add("ativa");
            slide.innerHTML = `<img src="${carta.imagem}" alt="${carta.nome}">`;
            carrossel.appendChild(slide);
        });
    }

    renderizarSlides();

    btnAvancar.addEventListener("click", () => {
        indice = (indice + 1) % cartas.length;
        renderizarSlides();
    });

    btnVoltar.addEventListener("click", () => {
        indice = (indice - 1 + cartas.length) % cartas.length;
        renderizarSlides();
    });



    // ============================
    // COMENTÁRIOS
    // ============================

    const formComentario = document.getElementById("form-comentario");
    const listaComentarios = document.getElementById("lista-comentarios");

    let comentarios = [];

    function atualizarComentarios() {
        listaComentarios.innerHTML = "";
        comentarios.forEach(c => {
            const div = document.createElement("div");
            div.className = "comentario";
            div.textContent = c;
            listaComentarios.appendChild(div);
        });
    }

    formComentario.addEventListener("submit", e => {
        e.preventDefault();
        const texto = document.getElementById("texto-comentario").value.trim();
        if (texto) {
            comentarios.unshift(texto);
            atualizarComentarios();
            formComentario.reset();
        }
    });



    // Iniciar na home
    mostrarPagina("inicio");
});
