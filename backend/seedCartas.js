require("dotenv").config();
const mongoose = require("mongoose");
const Carta = require("./models/Carta");

const cartas = [
  { 
    numero: 0, 
    nome: "O Louco", 
    imagem: "/public/images/0-louco.jpg", 
    significado: "Novos começos, espontaneidade, fé no universo. Representa a liberdade e o início de uma jornada sem medo." 
  },
  { 
    numero: 1, 
    nome: "O Mago", 
    imagem: "/images/1-mago.jpg", 
    significado: "Manifestação, poder pessoal, recursos disponíveis. Simboliza o domínio das habilidades e a capacidade de transformar ideias em realidade." 
  },
  { 
    numero: 2, 
    nome: "A Sacerdotisa", 
    imagem: "/images/2-sacerdotisa.jpg", 
    significado: "Intuição, mistério, sabedoria interior. Representa o conhecimento oculto e a conexão com o subconsciente." 
  },
  { 
    numero: 3, 
    nome: "A Imperatriz", 
    imagem: "/images/3-imperatriz.jpg", 
    significado: "Abundância, criatividade, maternidade. Simboliza a fertilidade, o crescimento e a conexão com a natureza." 
  },
  { 
    numero: 4, 
    nome: "O Imperador", 
    imagem: "/images/4-imperador.jpg", 
    significado: "Estrutura, liderança, autoridade. Representa a ordem, a disciplina e o estabelecimento de fundações sólidas." 
  },
  { 
    numero: 5, 
    nome: "O Hierofante", 
    imagem: "/images/5-hierofante.jpg", 
    significado: "Tradição, ensino, orientação espiritual. Simboliza as instituições, os sistemas de crença e a sabedoria dos mestres." 
  },
  { 
    numero: 6, 
    nome: "Os Amantes", 
    imagem: "/images/6-amantes.jpg", 
    significado: "Escolhas, relacionamentos, harmonia. Representa as decisões importantes, a união e o equilíbrio entre opostos." 
  },
  { 
    numero: 7, 
    nome: "O Carro", 
    imagem: "/images/7-carro.jpg", 
    significado: "Vontade, conquista, determinação. Simboliza o movimento direcionado, a superação de obstáculos e a vitória." 
  },
  { 
    numero: 8, 
    nome: "Força", 
    imagem: "/images/8-forca.jpg", 
    significado: "Coragem, controle interior, compaixão. Representa a força gentil, o domínio dos instintos através da paciência." 
  },
  { 
    numero: 9, 
    nome: "O Eremita", 
    imagem: "/images/9-eremita.jpg", 
    significado: "Introspecção, busca interior, sabedoria. Simboliza a solidão necessária para o autoconhecimento e a iluminação." 
  },
  { 
    numero: 10, 
    nome: "Roda da Fortuna", 
    imagem: "/images/10-roda.jpg", 
    significado: "Ciclos, destino, mudanças. Representa as reviravoltas da vida, o karma e a natureza cíclica da existência." 
  },
  { 
    numero: 11, 
    nome: "Justiça", 
    imagem: "/images/11-justica.jpg", 
    significado: "Equilíbrio, verdade, responsabilidade. Simboliza as consequências das ações e a busca pela imparcialidade." 
  },
  { 
    numero: 12, 
    nome: "O Enforcado", 
    imagem: "/images/12-enforcado.jpg", 
    significado: "Sacrifício, nova perspectiva, rendição. Representa a pausa necessária e a mudança de ponto de vista." 
  },
  { 
    numero: 13, 
    nome: "A Morte", 
    imagem: "/images/13-morte.jpg", 
    significado: "Transformação, fim de ciclos, renovação. Simboliza as mudanças profundas e o renascimento após o término." 
  },
  { 
    numero: 14, 
    nome: "Temperança", 
    imagem: "/images/14-temperanca.jpg", 
    significado: "Equilíbrio, moderação, paciência. Representa a alquimia interior e a harmonização de elementos opostos." 
  },
  { 
    numero: 15, 
    nome: "O Diabo", 
    imagem: "/images/15-diabo.jpg", 
    significado: "Apego, sombras, limitações. Simboliza os vícios, as amarras e as ilusões que nos mantêm prisioneiros." 
  },
  { 
    numero: 16, 
    nome: "A Torre", 
    imagem: "/images/16-torre.jpg", 
    significado: "Ruptura, revelação, mudança súbita. Representa o colapso de estruturas falsas e a libertação através da destruição." 
  },
  { 
    numero: 17, 
    nome: "A Estrela", 
    imagem: "/images/17-estrela.jpg", 
    significado: "Esperança, cura, inspiração. Simboliza a renovação da fé, a orientação divina e a serenidade após a tempestade." 
  },
  { 
    numero: 18, 
    nome: "A Lua", 
    imagem: "/images/18-lua.jpg", 
    significado: "Ilusões, intuição, subconsciente. Representa os medos ocultos, os sonhos e as profundezas da psique." 
  },
  { 
    numero: 19, 
    nome: "O Sol", 
    imagem: "/images/19-sol.jpg", 
    significado: "Sucesso, alegria, vitalidade. Simboliza a claridade, o otimismo e a realização plena." 
  },
  { 
    numero: 20, 
    nome: "O Julgamento", 
    imagem: "/images/20-julgamento.jpg", 
    significado: "Renovação, despertar, julgamento final. Representa o chamado interior, a redenção e o renascimento espiritual." 
  },
  { 
    numero: 21, 
    nome: "O Mundo", 
    imagem: "/images/21-mundo.jpg", 
    significado: "Conclusão, realização, integração. Simboliza a completude, o sucesso duradouro e o fim de um grande ciclo." 
  }
];

async function seed() {
  try {
    console.log("Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Conectado ao MongoDB");
    
    console.log("Removendo cartas antigas...");
    await Carta.deleteMany({});
    console.log("✓ Cartas antigas removidas");
    
    console.log("Inserindo novas cartas...");
    const resultado = await Carta.insertMany(cartas.map(c => ({ ...c, arcano: "maior" })));
    console.log(`✓ ${resultado.length} cartas inseridas com sucesso!`);
    
    console.log("\nCartas cadastradas:");
    resultado.forEach(c => {
      console.log(`  ${c.numero}. ${c.nome}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error("✗ Erro:", err);
    process.exit(1);
  }
}

seed();