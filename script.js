// ============================================================
//  MUNDOS ALÉM DO HORIZONTE — script.js
// ============================================================
// Loader controlado pelo script inline no <head> do index.html

// ---- NAVBAR ----
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  highlightNav();
});

// ---- NAV TOGGLE ----
document.getElementById("navToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});
document
  .querySelectorAll(".nav-links a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.querySelector(".nav-links").classList.remove("open"),
    ),
  );

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.querySelector(anchor.getAttribute("href"));
    if (t)
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth",
      });
  });
});

// ---- ACTIVE NAV ----
function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach((s) => {
    if (window.pageYOffset >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.style.color =
      a.getAttribute("href") === `#${current}` ? "var(--text)" : "";
  });
}

// ---- PARALLAX ----
window.addEventListener("scroll", () => {
  const sy = window.scrollY;
  const o = (sel, m) => {
    const el = document.querySelector(sel);
    if (el) el.style.transform = `translateY(${sy * m}px)`;
  };
  o(".orb1", 0.15);
  o(".orb2", 0.1);
  o(".orb3", -0.08);
});

// ---- REVEAL ON SCROLL ----
const ro = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        ro.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);

function addReveal(sel, delay = 0) {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${delay + i * 0.04}s`;
    ro.observe(el);
  });
}
[
  "info-card",
  "curiosity-card",
  "food-card",
  "famous-card",
  "culture-card",
  "history-card",
  "block-title",
  "section-header",
  "animal-card",
].forEach((c) => addReveal("." + c, 0));

// ---- POP BAR ANIMATION ----
const popObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".pop-bar-fill").forEach((f) => {
          const w = f.style.width;
          f.style.width = "0";
          setTimeout(() => {
            f.style.width = w;
          }, 200);
        });
        popObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 },
);
document.querySelectorAll(".pop-card").forEach((c) => {
  c.querySelectorAll(".pop-bar-fill").forEach((f) => {
    f.style.width = "0";
  });
  popObs.observe(c);
});

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, dur = 1500) {
  const dec = String(target).includes(".");
  const start = performance.now();
  const run = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = dec ? v.toFixed(1) : Math.floor(v).toLocaleString();
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const cObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCounter(
          e.target,
          parseFloat(e.target.textContent.replace(",", ".")),
        );
        cObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 },
);
document.querySelectorAll(".pop-big").forEach((el) => cObs.observe(el));

// ---- TIMELINE STAGGER ----
const tlObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".timeline-item").forEach((item, i) => {
          item.style.cssText = `opacity:0;transform:translateX(-20px);transition:opacity .5s ${i * 0.1}s ease,transform .5s ${i * 0.1}s ease`;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              item.style.opacity = "1";
              item.style.transform = "translateX(0)";
            }),
          );
        });
        tlObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.05 },
);
document.querySelectorAll(".timeline").forEach((tl) => {
  tl.querySelectorAll(".timeline-item").forEach((i) => (i.style.opacity = "0"));
  tlObs.observe(tl);
});

// ---- FLAG CARDS → scroll to section ----
const flagMap = { "": "#africa", "": "#australia", "": "#nz" };
document.querySelectorAll(".flag-card").forEach((c) => {
  c.addEventListener("click", () => {
    const flag = c.querySelector(".flag-emoji").textContent;
    const t = document.querySelector(flagMap[flag]);
    if (t)
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth",
      });
  });
});

// ---- RIPPLE ----
document.addEventListener("click", (e) => {
  const card = e.target.closest(
    ".curiosity-card, .food-card, .culture-card, .animal-card",
  );
  if (!card) return;
  const r = card.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.08);transform:scale(0);animation:rippleAnim .5s linear;left:${e.clientX - r.left - 25}px;top:${e.clientY - r.top - 25}px;width:50px;height:50px;pointer-events:none;z-index:10`;
  card.style.position = "relative";
  card.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove());
});
const rs = document.createElement("style");
rs.textContent = "@keyframes rippleAnim{to{transform:scale(8);opacity:0}}";
document.head.appendChild(rs);

// ====================================================================
//  DATA
// ====================================================================

// Helper: build image tag with fallback emoji
function img(src, alt, cls = "") {
  return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.style.display='none';" />`;
}

// Wikipedia thumbnail helper — busca via API e proxeia pelo wsrv.nl
// wsrv.nl contorna o bloqueio 429 do Wikimedia
async function getWikiThumb(title, size = 200) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=${size}&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const page = pages[Object.keys(pages)[0]];
    if (!page.thumbnail) return null;
    return page.thumbnail.source;
  } catch {
    return null;
  }
}

// ---- FAMOUS PEOPLE DATA ----
const africaFamous = [
  {
    rank: 1,
    name: "Nelson Mandela",
    tag: "Político / Ativista",
    wiki: "Nelson Mandela",
    emoji: "",
    desc: "Passou 27 anos preso por lutar contra o apartheid. Primeiro presidente negro eleito democraticamente (1994). Nobel da Paz em 1993.",
  },
  {
    rank: 2,
    name: "Elon Musk",
    tag: "Empresário / Inovador",
    wiki: "Elon Musk",
    emoji: "",
    desc: "Nascido em Pretória. Fundou SpaceX, Tesla e Neuralink. Revolucionou a indústria automotiva elétrica e a exploração espacial privada.",
  },
  {
    rank: 3,
    name: "Desmond Tutu",
    tag: "Arcebispo / Ativista",
    wiki: "Desmond Tutu",
    emoji: "",
    desc: "Arcebispo que liderou a luta pacífica contra o apartheid. Nobel da Paz em 1984. Presidiu a Comissão da Verdade e Reconciliação.",
  },
  {
    rank: 4,
    name: "Charlize Theron",
    tag: "Atriz",
    wiki: "Charlize Theron",
    emoji: "",
    desc: 'Natural de Benoni. Primeira sul-africana a ganhar o Oscar de Melhor Atriz por "Monster" (2003). Também produtora e ativista.',
  },
  {
    rank: 5,
    name: "Christiaan Barnard",
    tag: "Cirurgião",
    wiki: "Christiaan Barnard",
    emoji: "",
    desc: "Realizou o primeiro transplante de coração humano bem-sucedido em 1967, no Groote Schuur Hospital, Cidade do Cabo.",
  },
  {
    rank: 6,
    name: "Trevor Noah",
    tag: "Comediante / Apresentador",
    wiki: "Trevor Noah",
    emoji: "",
    desc: 'Nasceu em Johannesburg. Apresentou o The Daily Show por anos. Seu livro "Born a Crime" conta sua infância durante o apartheid.',
  },
  {
    rank: 7,
    name: "Miriam Makeba",
    tag: "Cantora / Ativista",
    wiki: "Miriam Makeba",
    emoji: "",
    desc: '"Mama Africa". Exilada por décadas por se opor ao apartheid. Seu Pata Pata é um dos grandes clássicos da música africana.',
  },
  {
    rank: 8,
    name: "J.M. Coetzee",
    tag: "Escritor",
    wiki: "J. M. Coetzee",
    emoji: "",
    desc: 'Nobel de Literatura em 2003. Suas obras como "Desonra" exploram as tensões raciais e morais do pós-apartheid.',
  },
  {
    rank: 9,
    name: "Caster Semenya",
    tag: "Atleta",
    wiki: "Caster Semenya",
    emoji: "",
    desc: "Campeã olímpica de 800m (2016). Sua carreira tornou-se centro de debate global sobre gênero, identidade e regulação esportiva.",
  },
  {
    rank: 10,
    name: "Steve Biko",
    localImg: "south_africa/artistas/Steve-Biko.jpeg",
    tag: "Ativista / Filósofo",
    wiki: "Steve Biko",
    emoji: "",
    desc: "Fundador do movimento da Consciência Negra. Morto sob custódia policial em 1977. Mártir da resistência ao apartheid.",
  },
  {
    rank: 11,
    name: "Shaka Zulu",
    tag: "Rei / Guerreiro",
    wiki: "Shaka",
    emoji: "",
    desc: "Rei Zulu que criou um dos maiores impérios da África subsaariana no séc. XIX. Revolucionou as táticas de guerra africanas.",
  },
  {
    rank: 12,
    name: "Winnie Mandela",
    localImg: "south_africa/artistas/Winnie-Mandela.jpeg",
    tag: "Ativista / Política",
    wiki: "Winnie Madikizela-Mandela",
    emoji: "",
    desc: "Rosto do movimento anti-apartheid enquanto Nelson estava preso. Figura controversa e icônica da luta pela liberdade.",
  },
  {
    rank: 13,
    name: "F.W. de Klerk",
    tag: "Político",
    wiki: "F. W. de Klerk",
    emoji: "",
    desc: "Último presidente branco da África do Sul. Negociou o fim do apartheid com Mandela. Nobel da Paz em 1993 (compartilhado).",
  },
  {
    rank: 14,
    name: "Black Coffee",
    tag: "DJ / Produtor",
    wiki: "Black Coffee (musician)",
    emoji: "",
    localImg: "south_africa/artistas/Black-Coffee.jpeg",
    desc: "DJ e produtor que levou o Amapiano e o house africano para os maiores festivais do mundo. Grammy Internacional em 2022.",
  },
  {
    rank: 15,
    name: "Christiaan de Wet",
    localImg: "south_africa/artistas/Christiaan-de-Wet.jpg",
    tag: "General / Herói Bôer",
    wiki: "Christiaan de Wet",
    emoji: "",
    desc: "General Bôer lendário, nunca capturado pelos britânicos durante as guerras Anglo-Bôeres. Símbolo da resistência Afrikaner.",
  },
  {
    rank: 16,
    name: "Albert Luthuli",
    tag: "Ativista / Político",
    wiki: "Albert Luthuli",
    emoji: "",
    desc: "Primeiro africano e primeiro sul-africano a ganhar o Nobel da Paz (1960). Presidente do Congresso Nacional Africano por anos.",
  },
  {
    rank: 17,
    name: "Ladysmith Black Mambazo",
    tag: "Grupo Musical",
    wiki: "Ladysmith Black Mambazo",
    emoji: "",
    desc: "Grupo coral sul-africano de isicathamiya. Ficaram famosos após colaborar com Paul Simon no álbum Graceland (1986). 5 Grammys.",
  },
  {
    rank: 18,
    name: "Gary Player",
    tag: "Golfista",
    wiki: "Gary Player",
    emoji: "",
    desc: "Um dos maiores golfistas de todos os tempos. Único não-americano a vencer os quatro Grand Slams do golfe. Venceu 165 torneios.",
  },
  {
    rank: 19,
    name: "Rassie Erasmus",
    localImg: "south_africa/artistas/Rassie-Erasmus.jpeg",
    tag: "Técnico de Rugby",
    wiki: "Rassie Erasmus",
    emoji: "",
    desc: "Técnico dos Springboks que os levou ao tricampeonato mundial (2019 e 2023). Controverso e revolucionário na liderança esportiva.",
  },
  {
    rank: 20,
    name: "Brenda Fassie",
    localImg: "south_africa/artistas/Brenda-Fassie.jpeg",
    tag: "Cantora",
    wiki: "Brenda Fassie",
    emoji: "",
    desc: 'Conhecida como "A Madonna da África". Ícone do pop sul-africano cujas músicas ecoaram o fim do apartheid. Morreu em 2004 aos 39 anos.',
  },
];

const australiaFamous = [
  {
    rank: 1,
    name: "Cate Blanchett",
    tag: "Atriz",
    wiki: "Cate Blanchett",
    emoji: "",
    desc: "Natural de Melbourne, vencedora de dois Oscar. Conhecida por Senhor dos Anéis, Blue Jasmine e Tár.",
  },
  {
    rank: 2,
    name: "Hugh Jackman",
    tag: "Ator",
    wiki: "Hugh Jackman",
    emoji: "",
    desc: "Nascido em Sydney. Mundialmente famoso como Wolverine. Brilha também no teatro musical — apresentou os Tony Awards.",
  },
  {
    rank: 3,
    name: "Steve Irwin",
    tag: "Naturalista / Apresentador",
    wiki: "Steve Irwin",
    emoji: "",
    desc: 'O "Caçador de Crocodilos". Tornou-se símbolo da Austrália pelo amor à vida selvagem. Morreu em 2006 pela ferroada de uma arraia.',
  },
  {
    rank: 4,
    name: "Kylie Minogue",
    tag: "Cantora",
    wiki: "Kylie Minogue",
    emoji: "",
    desc: 'A "Princesa do Pop" australiana. "Can\'t Get You Out of My Head" é um dos maiores hits dos anos 2000.',
  },
  {
    rank: 5,
    name: "Nicole Kidman",
    tag: "Atriz",
    wiki: "Nicole Kidman",
    emoji: "",
    desc: 'Criada em Sydney. Oscar por "The Hours" (2003). Uma das atrizes mais versáteis de Hollywood por mais de 40 anos.',
  },
  {
    rank: 6,
    name: "Rupert Murdoch",
    tag: "Magnata da mídia",
    wiki: "Rupert Murdoch",
    emoji: "",
    desc: "Fundou o império Fox News e News Corp. Um dos homens mais influentes da mídia mundial por décadas.",
  },
  {
    rank: 7,
    name: "Geoffrey Rush",
    tag: "Ator",
    wiki: "Geoffrey Rush",
    emoji: "",
    desc: "Um dos poucos atores a ganhar Oscar, Emmy, Tony e Grammy (EGOT). Famoso por Shine, Piratas do Caribe e The King's Speech.",
  },
  {
    rank: 8,
    name: "Cathy Freeman",
    tag: "Atleta",
    wiki: "Cathy Freeman",
    emoji: "",
    desc: "Aborígene, campeã olímpica dos 400m em Sydney 2000. Acendeu a tocha olímpica e tornou-se símbolo de reconciliação nacional.",
  },
  {
    rank: 9,
    name: "Barry Marshall",
    tag: "Médico / Cientista",
    wiki: "Barry Marshall",
    emoji: "",
    desc: "Nobel de Medicina (2005). Descobriu que úlceras são causadas por bactérias — e se infectou propositalmente para provar.",
  },
  {
    rank: 10,
    name: "Peter Carey",
    tag: "Escritor",
    wiki: "Peter Carey (novelist)",
    emoji: "",
    desc: "Único australiano a vencer o Booker Prize duas vezes. Explora a identidade australiana e o mito de Ned Kelly.",
  },
  {
    rank: 11,
    name: "Ned Kelly",
    tag: "Fora-da-lei / Ícone",
    wiki: "Ned Kelly",
    emoji: "",
    desc: "O fora-da-lei mais famoso da Austrália. Usava uma armadura de aço artesanal. Enforcado em 1880. Símbolo de resistência ao poder.",
  },
  {
    rank: 12,
    name: "AC/DC",
    tag: "Banda de Rock",
    wiki: "AC/DC",
    emoji: "",
    desc: 'Banda formada em Sydney em 1973. Uma das mais vendidas de todos os tempos. "Back in Black" é o segundo álbum mais vendido da história.',
  },
  {
    rank: 13,
    name: "Olivia Newton-John",
    tag: "Cantora / Atriz",
    wiki: "Olivia Newton-John",
    emoji: "",
    desc: "Ícone dos anos 70-80. Grease foi o filme musical mais lucrativo da era. Vencedora de 4 Grammys. Dedicou a vida ao combate ao câncer.",
  },
  {
    rank: 14,
    name: "Russell Crowe",
    tag: "Ator",
    wiki: "Russell Crowe",
    emoji: "",
    desc: "Nascido na Nova Zelândia, criado na Austrália. Oscar por Gladiador (2001). Um dos atores mais intensos de sua geração.",
  },
  {
    rank: 15,
    name: "Chris Hemsworth",
    tag: "Ator",
    wiki: "Chris Hemsworth",
    emoji: "",
    desc: "Natural de Melbourne. Ficou mundialmente famoso como Thor no universo Marvel. Um dos atores mais bem pagos do mundo.",
  },
  {
    rank: 16,
    name: "Germaine Greer",
    tag: "Feminista / Escritora",
    wiki: "Germaine Greer",
    emoji: "",
    desc: 'Autora de "O Eunuco Feminino" (1970), um dos textos fundadores do feminismo moderno. Uma das vozes mais controversas e influentes do séc. XX.',
  },
  {
    rank: 17,
    name: "John Monash",
    tag: "General / Engenheiro",
    wiki: "John Monash",
    emoji: "",
    desc: "General da Primeira Guerra Mundial considerado o melhor comandante aliado do conflito. Sua imagem está na nota de 100 dólares australianos.",
  },
  {
    rank: 18,
    name: "Patrick White",
    tag: "Escritor",
    wiki: "Patrick White",
    emoji: "",
    desc: "Primeiro australiano a ganhar o Nobel de Literatura (1973). Suas obras exploram a solidão e a espiritualidade na vastidão australiana.",
  },
  {
    rank: 19,
    name: "Ian Thorpe",
    tag: "Nadador",
    wiki: "Ian Thorpe",
    emoji: "",
    desc: '"Thorpedo" — considerado o melhor nadador de todos os tempos. 5 medalhas de ouro olímpicas, 11 títulos mundiais. Aposentou-se aos 24 anos.',
  },
  {
    rank: 20,
    name: "Gough Whitlam",
    tag: "Político",
    wiki: "Gough Whitlam",
    emoji: "",
    desc: "PM que aboliu o serviço militar obrigatório, a política da Austrália Branca e introduziu saúde universal. Deposto num golpe constitucional em 1975.",
  },
];

const nzFamous = [
  {
    rank: 1,
    name: "Edmund Hillary",
    tag: "Explorador / Alpinista",
    wiki: "Edmund Hillary",
    emoji: "",
    desc: "Primeiro a conquistar o Monte Everest em 1953. Herói nacional e símbolo de aventura. Seu rosto esteve na nota de 5 dólares.",
  },
  {
    rank: 2,
    name: "Peter Jackson",
    tag: "Diretor de Cinema",
    wiki: "Peter Jackson",
    emoji: "",
    desc: "Nascido em Wellington. Triplicou o turismo neozelandês com O Senhor dos Anéis. 3 Oscar por O Retorno do Rei.",
  },
  {
    rank: 3,
    name: "Jacinda Ardern",
    tag: "Primeira-Ministra",
    wiki: "Jacinda Ardern",
    emoji: "",
    desc: "Segunda líder mundial a dar à luz no cargo. Sua resposta ao atentado de Christchurch tornou-a modelo global de liderança empática.",
  },
  {
    rank: 4,
    name: "Ernest Rutherford",
    tag: "Físico Nuclear",
    wiki: "Ernest Rutherford",
    emoji: "",
    desc: "Nascido em Nelson. Descobriu a estrutura do átomo. Nobel de Química (1908). Pai da física nuclear.",
  },
  {
    rank: 5,
    name: "Richie McCaw",
    tag: "Rugbista",
    wiki: "Richie McCaw",
    emoji: "",
    desc: "Considerado o melhor jogador de rugby de todos os tempos. Capitão dos All Blacks em dois títulos mundiais (2011 e 2015).",
  },
  {
    rank: 6,
    name: "Lorde",
    tag: "Cantora",
    wiki: "Lorde",
    emoji: "",
    desc: 'Ella Yelich-O\'Connor. Tinha 16 anos quando "Royals" chegou ao #1 global. Grammy na adolescência. Uma das vozes mais originais do pop.',
  },
  {
    rank: 7,
    name: "Sam Neill",
    tag: "Ator",
    wiki: "Sam Neill",
    emoji: "",
    desc: "Famoso por Parque dos Dinossauros, Peaky Blinders e Hunt for the Wilderpeople. É também proprietário de vinícola premiada.",
  },
  {
    rank: 8,
    name: "Katherine Mansfield",
    tag: "Escritora",
    wiki: "Katherine Mansfield",
    emoji: "",
    desc: "Uma das mais importantes escritoras de contos em língua inglesa. Morreu aos 34 anos, mas influenciou gerações de escritores.",
  },
  {
    rank: 9,
    name: "Jonah Lomu",
    tag: "Rugbista",
    wiki: "Jonah Lomu",
    emoji: "",
    desc: "O primeiro grande astro global do rugby. Sua atuação na Copa de 1995 é lendária. Morreu precocemente em 2015 aos 40 anos.",
  },
  {
    rank: 10,
    name: "Taika Waititi",
    tag: "Diretor / Ator",
    wiki: "Taika Waititi",
    emoji: "",
    desc: 'Maori. Oscar de Roteiro por "Jojo Rabbit". Dirigiu Thor: Ragnarok e What We Do in the Shadows.',
  },
  {
    rank: 11,
    name: "Kate Sheppard",
    tag: "Sufragista / Ativista",
    wiki: "Kate Sheppard",
    emoji: "",
    desc: "Liderou o movimento sufragista que garantiu o voto feminino em 1893 — a primeira vez no mundo. Seu rosto está na nota de 10 dólares.",
  },
  {
    rank: 12,
    name: "Kiri Te Kanawa",
    tag: "Soprano / Cantora Lírica",
    wiki: "Kiri Te Kanawa",
    emoji: "",
    desc: "Maori, uma das maiores sopranos do século XX. Cantou no casamento do Príncipe Charles com Lady Di em 1981, assistido por 600 milhões de pessoas.",
  },
  {
    rank: 13,
    name: "Dan Carter",
    tag: "Rugbista",
    wiki: "Dan Carter",
    emoji: "",
    desc: "Eleito três vezes o melhor jogador de rugby do mundo. Maior artilheiro da história dos All Blacks. Ícone absoluto do esporte neozelandês.",
  },
  {
    rank: 14,
    name: "Neil Finn",
    tag: "Músico",
    wiki: "Neil Finn",
    emoji: "",
    desc: "Fundador do Crowded House, autor de \"Don't Dream It's Over\" — um dos maiores hits do rock australiano/neozelandês. Ícone da música pop.",
  },
  {
    rank: 15,
    name: "Lydia Ko",
    tag: "Golfista",
    wiki: "Lydia Ko",
    emoji: "",
    desc: "A mais jovem golfista — homem ou mulher — a atingir o ranking mundial #1. Nascida na Coreia do Sul, representa a Nova Zelândia.",
  },
  {
    rank: 16,
    name: "Alan MacDiarmid",
    tag: "Cientista",
    wiki: "Alan MacDiarmid",
    emoji: "",
    desc: "Nobel de Química (2000) pela descoberta dos polímeros condutores — material base de telas OLED usadas em smartphones modernos.",
  },
  {
    rank: 17,
    name: "Hayley Westenra",
    tag: "Cantora",
    wiki: "Hayley Westenra",
    emoji: "",
    desc: "Soprano neozelandesa que se tornou a artista mais jovem a ter um álbum de estreia no topo das paradas britânicas. Voz cristalina internacionalmente reconhecida.",
  },
  {
    rank: 18,
    name: "Pita Havili",
    tag: "Rugbista / Lenda Maori",
    wiki: "Jonah Lomu",
    emoji: "",
    desc: "Figura representando o legado das lendas do rugby Maori que moldaram o estilo agressivo e técnico dos All Blacks ao longo de décadas.",
  },
  {
    rank: 19,
    name: "Jane Campion",
    tag: "Diretora de Cinema",
    wiki: "Jane Campion",
    emoji: "",
    desc: 'Primeira mulher a ganhar a Palma de Ouro em Cannes (1993, "O Piano"). Oscar de Roteiro. Pioneira do cinema de autoria feminino no mundo.',
  },
  {
    rank: 20,
    name: "Sir Apirana Ngata",
    tag: "Político / Líder Maori",
    wiki: "Āpirana Ngata",
    emoji: "",
    desc: "Primeiro Maori a se formar em uma universidade neozelandesa. Parlamentar por décadas. Lutou para preservar a cultura e língua Maori.",
  },
];

// ---- ANIMALS DATA ----
const africaAnimals = [
  {
    name: "Leão",
    emoji: "",
    wiki: "Lion",
    desc: "Rei da savana. Vive em grupos chamados alcateias. O maior predador terrestre da África.",
  },
  {
    name: "Elefante Africano",
    emoji: "",
    wiki: "African_bush_elephant",
    desc: "Maior animal terrestre do mundo. Inteligente, social e com memória prodigiosa. Ameaçado pela caça ilegal.",
  },
  {
    name: "Rinoceronte",
    emoji: "",
    wiki: "White_rhinoceros",
    desc: "Criticamente ameaçado de extinção pela caça furtiva. Seu chifre é queratina pura — o mesmo material das unhas humanas.",
  },
  {
    name: "Leopardo",
    emoji: "",
    wiki: "Leopard",
    desc: "O mais elusivo dos Big Five. Caçador noturno solitário. Carrega suas presas para o alto das árvores.",
  },
  {
    name: "Búfalo Africano",
    emoji: "",
    wiki: "African_buffalo",
    desc: "Considerado o mais perigoso dos Big Five. Nunca foi domesticado. Responsável por muitas mortes humanas na África.",
  },
  {
    name: "Girafa",
    emoji: "",
    wiki: "Giraffe",
    desc: "Animal mais alto do mundo. Seu coração deve bombear sangue 2m acima do corpo. Dorme apenas 30 minutos por dia.",
  },
];

const australiaAnimals = [
  {
    name: "Canguru",
    emoji: "",
    wiki: "Red_kangaroo",
    desc: "Símbolo nacional. O maior marsupial do mundo. Um filhote nasce do tamanho de um feijão e completa o desenvolvimento na bolsa da mãe.",
  },
  {
    name: "Coala",
    emoji: "",
    wiki: "Koala",
    desc: "Dorme até 22 horas por dia para economizar energia digerindo folhas de eucalipto — que são tóxicas para outros animais.",
  },
  {
    name: "Ornitorrinco",
    emoji: "",
    wiki: "Platypus",
    desc: "Mamífero que bota ovos, tem bico de pato, rabo de castor e é um dos poucos mamíferos venenosos do mundo.",
  },
  {
    name: "Tasmanian Devil",
    emoji: "",
    wiki: "Tasmanian_devil",
    desc: "O maior marsupial carnívoro vivo. Tem a mordida mais forte proporcional ao tamanho entre todos os mamíferos.",
  },
  {
    name: "Dingo",
    emoji: "",
    wiki: "Dingo",
    desc: "Cão selvagem australiano. Para mantê-los afastados das ovelhas, foi construída a maior cerca do mundo: 5.614 km.",
  },
  {
    name: "Emú",
    emoji: "",
    wiki: "Emu",
    desc: "Segundo maior pássaro do mundo. Em 1932, o governo australiano declarou guerra aos emus — e os pássaros venceram.",
  },
];

const nzAnimals = [
  {
    name: "Kiwi",
    emoji: "",
    wiki: "Kiwi_(bird)",
    desc: "Ave nacional. Não voa, tem narinas na ponta do bico e cheira o alimento no chão. Criticamente ameaçada de extinção.",
  },
  {
    name: "Tuatara",
    emoji: "",
    wiki: "Tuatara",
    desc: "Réptil que existe há 250 milhões de anos — praticamente inalterado desde a era dos dinossauros. Exclusivo da Nova Zelândia.",
  },
  {
    name: "Kea",
    emoji: "",
    wiki: "Kea",
    desc: "O único papagaio alpino do mundo. Extremamente inteligente e curioso. Conhecido por desmontar carros e roubar objetos de turistas.",
  },
  {
    name: "Kakapo",
    emoji: "",
    wiki: "Kakapo",
    localImg: "new_zeland/animals/kakapo.jpeg",
    desc: "O papagaio mais gordo do mundo — e incapaz de voar. Criticamente ameaçado com apenas ~250 indivíduos vivos.",
  },
  {
    name: "Baleia Franca",
    emoji: "",
    wiki: "Southern_right_whale",
    desc: "Migra anualmente para as costas da NZ para se reproduzir. O local de observação de baleias de Kaikoura é um dos melhores do mundo.",
  },
  {
    name: "Golfinho Hector",
    emoji: "",
    wiki: "Hector's_dolphin",
    localImg: "new_zeland/animals/dolphin-hector.jpeg",
    desc: "O menor e mais raro golfinho do mundo. Só existe nas águas da Nova Zelândia. Menos de 15.000 indivíduos restantes.",
  },
];

// ---- FOOD DATA ----
const africaFood = [
  {
    name: "Braai",
    emoji: "",
    bg: "#8B4513",
    desc: "O churrasco sul-africano. Mais que comida — é um ritual social. Carne assada em lenha. Existe até o Dia Nacional do Braai (24 de setembro).",
    img: "south_africa/pratos_tipicos/braai.webp",
  },
  {
    name: "Bobotie",
    emoji: "",
    bg: "#c9a227",
    desc: "Prato nacional: carne moída temperada com curry, coberta com creme de ovos e assada. Servido com arroz amarelo com passas.",
    img: "south_africa/pratos_tipicos/sul-bobtie-1200x675.webp",
  },
  {
    name: "Boerewors",
    emoji: "",
    bg: "#5c3317",
    desc: "Linguiça artesanal enrolada em espiral. Para ser chamada de boerewors, deve ter pelo menos 90% de carne bovina — protegido por lei.",
    img: "south_africa/pratos_tipicos/boerewors-1200x675.webp",
  },
  {
    name: "Chakalaka",
    emoji: "",
    bg: "#2d6a4f",
    desc: "Relish apimentado de vegetais (cebola, tomate, pimentão, feijão). Originado nas townships, hoje é clássico nacional.",
    img: "south_africa/pratos_tipicos/chakalaka-1200x675.webp",
  },
  {
    name: "Bunny Chow",
    emoji: "",
    bg: "#b5451b",
    desc: "Pão branco escavado e recheado com curry — criação da comunidade indiana de Durban nos anos 1940. Comida de rua icônica.",
    img: "south_africa/pratos_tipicos/bunny-chow-1200x675.webp",
  },
  {
    name: "Biltong",
    emoji: "",
    bg: "#6b3a2a",
    desc: 'Carne seca temperada com especiarias — o "jerky" sul-africano. Feito de carne bovina, avestruz ou caça. Snack onipresente no país.',
    img: "south_africa/pratos_tipicos/cbiltong-1200x675.webp",
  },
];

const australiaFood = [
  {
    name: "Meat Pie",
    emoji: "",
    bg: "#8B5E3C",
    desc: "O pastelão de carne com gravy é o prato nacional não oficial. Presente em todo estádio de críquete e futebol australiano.",
    img: "australia/pratos_tipicos/Meat-Pie-4x3.jpg",
  },
  {
    name: "Vegemite",
    emoji: "",
    bg: "#2b2d42",
    desc: "Pasta escura de extrato de levedura — ícone cultural. Australianos crescem comendo no café da manhã. Estrangeiros frequentemente odeiam.",
    img: "australia/pratos_tipicos/vegemite-1024x667.jpg",
  },
  {
    name: "Pavlova",
    emoji: "",
    bg: "#e9c46a",
    desc: "Merengue crocante por fora, macio por dentro, coberto com creme e frutas. A origem é disputada com a Nova Zelândia.",
    img: "australia/pratos_tipicos/PAVLOVA-25-S-01-500x500.webp",
  },
  {
    name: "Tim Tam",
    emoji: "",
    bg: "#3d1e0f",
    desc: 'Biscoito de chocolate banhado em chocolate. O "Tim Tam Slam": morder as pontas e beber café através do biscoito — ritual sagrado.',
    img: "australia/pratos_tipicos/Tim_Tams.jpg",
  },
  {
    name: "Lamington",
    emoji: "",
    bg: "#4a1f5e",
    desc: "Bolo de baunilha mergulhado em chocolate e coberto com coco ralado. Tão amado que tem seu próprio Dia Nacional (21 de julho).",
    img: "australia/pratos_tipicos/LAMINGTON-LAYER-CAKE-25-S-01-500x500.jpg",
  },
  {
    name: "Barramundi",
    emoji: "",
    bg: "#457b9d",
    desc: 'Peixe nativo, apreciado grelhado ou em fritas. Seu nome vem da língua aborígene e significa "peixe de grande escama".',
    img: "australia/pratos_tipicos/Barramundi-swimming.webp",
  },
];

const nzFood = [
  {
    name: "Hangi",
    emoji: "",
    bg: "#2b4570",
    desc: "Refeição Maori cozida em buraco na terra com pedras quentes. Frango, porco, batata-doce e vegetais cozinham horas embaixo da terra.",
    img: "new_zeland/pratos_tipicos/Hangi.jpg",
  },
  {
    name: "Pavlova (NZ reclama!)",
    emoji: "",
    bg: "#e9c46a",
    desc: "Os neozelandeses têm documentos que comprovam a criação anterior à versão australiana. Debate acalorado que dura décadas.",
    img: "new_zeland/pratos_tipicos/pavlova-de-frutas.jpg",
  },
  {
    name: "Whitebait Fritter",
    emoji: "",
    bg: "#774936",
    desc: "Omelete leve recheado com pequenos peixes brancos translúcidos. Iguaria tão apreciada que a temporada de pesca é rigorosamente controlada.",
    img: "new_zeland/pratos_tipicos/Whitebait-take.webp",
  },
  {
    name: "Kumara",
    emoji: "",
    bg: "#e76f51",
    desc: "Batata-doce roxa trazida pelos Maori da Polinésia. O vegetal mais culturalmente significativo do país — aparece em cerimônias tradicionais.",
    img: "new_zeland/pratos_tipicos/Kumara.jpg",
  },
  {
    name: "Kiwifruit",
    emoji: "",
    bg: "#588157",
    desc: 'Originalmente "gooseberry chinês", rebatizado "kiwi" pelos neozelandeses. A NZ é um dos maiores produtores mundiais.',
    img: "new_zeland/pratos_tipicos/Kiwi-fruit.webp",
  },
  {
    name: "Cordeiro Assado",
    emoji: "",
    bg: "#d62828",
    desc: "A NZ é o maior exportador de carne ovina do mundo. O lamb roast dominical é tradição familiar desde os colonizadores britânicos.",
    img: "new_zeland/pratos_tipicos/Cordeiro-Assado.jpg",
  },
];

// ---- RENDER FUNCTIONS ----

function renderAnimals(containerId, animals) {
  const container = document.getElementById(containerId);
  if (!container) return;
  animals.forEach((a) => {
    const card = document.createElement("div");
    card.className = "animal-card visible";
    card.innerHTML = `
      <div class="animal-img-placeholder">${a.emoji}</div>
      <div class="animal-info">
        <h4>${a.name}</h4>
        <p>${a.desc}</p>
      </div>
    `;
    container.appendChild(card);
    const ph = card.querySelector(".animal-img-placeholder");
    const loadImg = (src) => {
      if (!src || !ph) return;
      const imgEl = document.createElement("img");
      imgEl.className = "animal-img";
      imgEl.src = src;
      imgEl.alt = a.name;
      imgEl.loading = "lazy";
      imgEl.onerror = () => (imgEl.style.display = "none");
      ph.replaceWith(imgEl);
    };
    if (a.localImg) {
      loadImg(a.localImg);
      return;
    }
    getWikiThumb(a.wiki, 300)
      .then(loadImg)
      .catch(() => {});
  });
}

function renderFood(containerId, foods) {
  const container = document.getElementById(containerId);
  if (!container) return;
  foods.forEach((f) => {
    const card = document.createElement("div");
    card.className = "food-card visible";
    const imgHtml = f.img
      ? `<img src="${f.img}" alt="${f.name}" loading="lazy" style="width:100%;height:160px;object-fit:cover;display:block;" onerror="this.style.display='none';" />`
      : `<div class="food-img-placeholder" style="background:${f.bg}"></div>`;
    card.innerHTML = `
      <div class="food-img-wrap">${imgHtml}</div>
      <div class="food-info">
        <h4>${f.name}</h4>
        <p>${f.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderFamous(containerId, people, tagClass = "") {
  const container = document.getElementById(containerId);
  if (!container) return;
  people.forEach(async (p) => {
    const card = document.createElement("div");
    card.className = `famous-card ${tagClass} visible`;
    card.innerHTML = `
      <div class="famous-photo-wrap">
        <div class="famous-photo-placeholder" id="fph-${containerId}-${p.rank}">${p.emoji}</div>
        <div class="famous-rank-badge">${String(p.rank).padStart(2, "0")}</div>
      </div>
      <div class="famous-info">
        <h4>${p.name}</h4>
        <span class="famous-tag ${tagClass.replace("famous", "").replace("card", "").trim()}-tag">${p.tag}</span>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
    // Try Wikipedia image
    const src = await getWikiThumb(p.wiki, 200);
    if (src) {
      const ph = document.getElementById(`fph-${containerId}-${p.rank}`);
      if (ph) {
        const imgEl = document.createElement("img");
        imgEl.className = "famous-photo";
        imgEl.src = src;
        imgEl.alt = p.name;
        imgEl.loading = "lazy";
        imgEl.onerror = () => {
          imgEl.style.display = "none";
        };
        ph.replaceWith(imgEl);
      }
    }
  });
}

// Fix tag class for famous cards
function renderFamousAfrica(id) {
  const container = document.getElementById(id);
  if (!container) return;
  africaFamous.forEach((p) => {
    const card = document.createElement("div");
    card.className = "famous-card visible";
    card.innerHTML = `
      <div class="famous-photo-wrap">
        <div class="famous-photo-placeholder">${p.emoji}</div>
        <div class="famous-rank-badge">${String(p.rank).padStart(2, "0")}</div>
      </div>
      <div class="famous-info">
        <h4>${p.name}</h4>
        <span class="famous-tag">${p.tag}</span>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
    const ph = card.querySelector(".famous-photo-placeholder");
    const loadImg = (src) => {
      if (!src || !ph) return;
      const imgEl = document.createElement("img");
      imgEl.className = "famous-photo";
      imgEl.src = src;
      imgEl.alt = p.name;
      imgEl.loading = "lazy";
      imgEl.onerror = () => (imgEl.style.display = "none");
      ph.replaceWith(imgEl);
    };
    if (p.localImg) {
      loadImg(p.localImg);
      return;
    }
    getWikiThumb(p.wiki, 200)
      .then(loadImg)
      .catch(() => {});
  });
}

function renderFamousAu(id) {
  const container = document.getElementById(id);
  if (!container) return;
  australiaFamous.forEach((p) => {
    const card = document.createElement("div");
    card.className = "famous-card au-famous visible";
    card.innerHTML = `
      <div class="famous-photo-wrap">
        <div class="famous-photo-placeholder">${p.emoji}</div>
        <div class="famous-rank-badge">${String(p.rank).padStart(2, "0")}</div>
      </div>
      <div class="famous-info">
        <h4>${p.name}</h4>
        <span class="famous-tag au-tag">${p.tag}</span>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
    getWikiThumb(p.wiki, 200)
      .then((src) => {
        if (!src) return;
        const ph = card.querySelector(".famous-photo-placeholder");
        if (!ph) return;
        const imgEl = document.createElement("img");
        imgEl.className = "famous-photo";
        imgEl.src = src;
        imgEl.alt = p.name;
        imgEl.loading = "lazy";
        imgEl.onerror = () => (imgEl.style.display = "none");
        ph.replaceWith(imgEl);
      })
      .catch(() => {});
  });
}

function renderFamousNz(id) {
  const container = document.getElementById(id);
  if (!container) return;
  nzFamous.forEach((p) => {
    const card = document.createElement("div");
    card.className = "famous-card nz-famous visible";
    card.innerHTML = `
      <div class="famous-photo-wrap">
        <div class="famous-photo-placeholder">${p.emoji}</div>
        <div class="famous-rank-badge">${String(p.rank).padStart(2, "0")}</div>
      </div>
      <div class="famous-info">
        <h4>${p.name}</h4>
        <span class="famous-tag nz-tag">${p.tag}</span>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
    getWikiThumb(p.wiki, 200)
      .then((src) => {
        if (!src) return;
        const ph = card.querySelector(".famous-photo-placeholder");
        if (!ph) return;
        const imgEl = document.createElement("img");
        imgEl.className = "famous-photo";
        imgEl.src = src;
        imgEl.alt = p.name;
        imgEl.loading = "lazy";
        imgEl.onerror = () => (imgEl.style.display = "none");
        ph.replaceWith(imgEl);
      })
      .catch(() => {});
  });
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  renderAnimals("africa-animals", africaAnimals);
  renderAnimals("australia-animals", australiaAnimals);
  renderAnimals("nz-animals", nzAnimals);

  renderFood("africa-food", africaFood);
  renderFood("australia-food", australiaFood);
  renderFood("nz-food", nzFood);

  renderFamousAfrica("africa-famous");
  renderFamousAu("australia-famous");
  renderFamousNz("nz-famous");
});

console.log(" Mundos Além do Horizonte — carregado!");

// ====================================================================
//  MAPA ASCII — pins clicáveis
// ====================================================================
document.querySelectorAll('.ascii-pin').forEach(pin => {
  pin.addEventListener('click', () => {
    const target = document.querySelector(pin.dataset.target);
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Highlight tags [ZA] [AU] [NZ] inside the pre with colored spans
(function highlightMapTags() {
  const pre = document.getElementById('asciiMap');
  if (!pre) return;
  pre.innerHTML = pre.innerHTML
    .replace(/\[ZA\]/g, '<span style="color:#52b788;font-weight:700">[ZA]</span>')
    .replace(/\[AU\]/g, '<span style="color:#c05040;font-weight:700">[AU]</span>')
    .replace(/\[NZ\]/g, '<span style="color:#3a86ff;font-weight:700">[NZ]</span>');
})();

// ====================================================================
//  LIGHTBOX
// ====================================================================
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let lbImages = [];
let lbIndex = 0;

function openLightbox(images, index) {
  lbImages = images;
  lbIndex = index;
  showLbImage();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function showLbImage() {
  const { src, caption } = lbImages[lbIndex];
  lbImg.src = src;
  lbImg.alt = caption;
  lbCaption.textContent = caption;
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

lbPrev.addEventListener("click", () => {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLbImage();
});
lbNext.addEventListener("click", () => {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLbImage();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") {
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    showLbImage();
  }
  if (e.key === "ArrowRight") {
    lbIndex = (lbIndex + 1) % lbImages.length;
    showLbImage();
  }
});

// Attach lightbox to curiosity cards after DOM is ready
function attachLightbox(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;
  const cards = section.querySelectorAll(".curiosity-card");
  const imageList = [];

  cards.forEach((card) => {
    const img = card.querySelector(".curiosity-img");
    const caption = card.querySelector("h4")?.textContent || "";
    if (img && img.src && !img.src.includes("undefined")) {
      imageList.push({ src: img.src, caption });
    }
  });

  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      const img = card.querySelector(".curiosity-img");
      const caption = card.querySelector("h4")?.textContent || "";
      if (!img) return;
      const clickedSrc = img.src;
      const validImages = imageList.filter((x) => x.src);
      const idx = validImages.findIndex((x) => x.src === clickedSrc);
      openLightbox(validImages, idx >= 0 ? idx : 0);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Curiosidades lightbox (carregadas estaticamente)
  setTimeout(() => {
    attachLightbox("#africa");
    attachLightbox("#australia");
    attachLightbox("#nz");
  }, 500);

  // Animais lightbox — imagens chegam dinamicamente via Wikipedia
  // usamos MutationObserver em cada container
  ['africa-animals', 'australia-animals', 'nz-animals'].forEach(containerId => {
    const container = document.getElementById(containerId);
    if (!container) return;

    function bindCard(card) {
      if (card.dataset.lb) return; // já foi vinculado
      card.dataset.lb = '1';
      card.style.cursor = 'zoom-in';
      card.addEventListener('click', () => {
        // Coleta todas as imagens carregadas no momento do clique
        const allCards = [...container.querySelectorAll('.animal-card')];
        const imageList = allCards.reduce((acc, c) => {
          const img = c.querySelector('.animal-img');
          const name = c.querySelector('h4')?.textContent
                    || c.querySelector('.animal-name')?.textContent
                    || '';
          if (img && img.src && !img.src.includes('undefined')) {
            acc.push({ src: img.src, caption: name });
          }
          return acc;
        }, []);

        const clickedImg = card.querySelector('.animal-img');
        if (!clickedImg) return;
        const idx = imageList.findIndex(x => x.src === clickedImg.src);
        openLightbox(imageList, idx >= 0 ? idx : 0);
      });
    }

    // Bind cards já existentes
    container.querySelectorAll('.animal-card').forEach(bindCard);

    // Bind cards que ainda vão chegar (imagens carregam async)
    const obs = new MutationObserver(() => {
      container.querySelectorAll('.animal-card').forEach(bindCard);
    });
    obs.observe(container, { childList: true, subtree: true });
  });
});
