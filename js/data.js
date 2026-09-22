/* =========================================================================
   DADOS DA VIAGEM — fonte de verdade única.
   Todos os valores monetários ficam em EUR; a conversão para BRL é feita em
   tempo real pelo app.js a partir da cotação editável pelo usuário.
   Preços não confirmados aparecem como null (renderizados como "A confirmar")
   ou como {estimativa: true, valor: N} (renderizados como "Estimativa").
   ========================================================================= */

const TRIP_META = {
  travelers: 4,
  rooms: 2,
  roomType: "Quartos duplos",
  startDate: "2026-12-19",
  endDate: "2027-01-03",
  nights: 15,
  totalDays: 16,
  style: "Confortável, sem luxo excessivo",
  currencyBase: "EUR",
  defaultRate: 6.20, // cotação inicial sugerida — 100% editável na tela de Orçamento
};

const CITIES = [
  { id: "lisboa", name: "Lisboa", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { id: "fatima", name: "Fátima", country: "Portugal", lat: 39.6167, lng: -8.6667 },
  { id: "porto", name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
  { id: "santiago", name: "Santiago de Compostela", country: "Espanha", lat: 42.8805, lng: -8.5456 },
  { id: "viena", name: "Viena", country: "Áustria", lat: 48.2082, lng: 16.3738 },
  { id: "hallstatt", name: "Hallstatt", country: "Áustria", lat: 47.5622, lng: 13.6493 },
  { id: "salzburg", name: "Salzburgo", country: "Áustria", lat: 47.8095, lng: 13.0550 },
  { id: "estrasburgo", name: "Estrasburgo", country: "França", lat: 48.5734, lng: 7.7521 },
  { id: "paris", name: "Paris", country: "França", lat: 48.8566, lng: 2.3522 },
  { id: "versailles", name: "Versailles", country: "França", lat: 48.8049, lng: 2.1204 },
];

// Ordem da rota para desenhar a polyline no mapa (Lisboa->Fátima->Porto->Santiago->Porto->Lisboa->Viena->Hallstatt->Salzburg->Estrasburgo->Paris->Versailles->Paris)
const ROUTE_ORDER = ["lisboa","fatima","porto","santiago","porto","lisboa","viena","hallstatt","salzburg","estrasburgo","paris","versailles","paris"];
// Dia da viagem em que cada ponto da rota acima é alcançado (mesmo índice de ROUTE_ORDER) — usado para animar o mapa por dia.
const ROUTE_DAY = [1, 1, 1, 3, 3, 4, 4, 8, 8, 9, 10, 15, 16];

/* ---------------------------------------------------------------------
   ROTEIRO DIA A DIA
   alertLevel por dia: null | "info" | "warning" | "danger"
--------------------------------------------------------------------- */
const DAYS = [
  {
    n: 1, date: "2026-12-19", weekday: "sábado",
    title: "Lisboa → Fátima → Porto",
    cities: ["lisboa","fatima","porto"],
    hotelCity: "porto",
    alerts: [],
    activities: [
      { time: "10:00", text: "Chegada a Lisboa (aeroporto)", place: "lisboa" },
      { time: "11:00", text: "Retirada do carro — Carro 1 (Portugal)", place: "lisboa" },
      { time: "11:15", text: "Lisboa → Fátima (carro)", place: "lisboa" },
      { time: "12:30", text: "Visita ao Santuário de Fátima: Capelinha das Aparições; Basílica de Nossa Senhora do Rosário; Basílica da Santíssima Trindade; Recinto de Oração", place: "fatima_capelinha" },
      { time: "14:30", text: "Almoço em Fátima", place: "fatima_basilica_rosario" },
      { time: "15:15", text: "Fátima → Porto (carro)", place: "fatima_basilica_trindade" },
      { time: "18:00", text: "Chegada ao Porto — check-in e jantar", place: "porto_hero" },
    ],
  },
  {
    n: 2, date: "2026-12-20", weekday: "domingo",
    title: "Porto",
    cities: ["porto"],
    hotelCity: "porto",
    alerts: [],
    activities: [
      { time: "09:00", text: "Estação de São Bento", place: "porto_sao_bento" },
      { time: "10:00", text: "Sé do Porto e centro histórico", place: "porto_se" },
      { time: "12:30", text: "Almoço", place: "porto_hero" },
      { time: "14:00", text: "Palácio da Bolsa e Igreja de São Francisco", place: "porto_bolsa" },
      { time: "17:00", text: "Gaia — visita a uma cave de vinho do Porto", place: "porto_gaia" },
    ],
  },
  {
    n: 3, date: "2026-12-21", weekday: "segunda-feira",
    title: "Santiago de Compostela (bate-volta desde Porto)",
    cities: ["porto","santiago"],
    hotelCity: "porto",
    alerts: [],
    activities: [
      { time: "07:30", text: "Porto → Santiago de Compostela (carro)", place: "porto_hero" },
      { time: "10:00", text: "Catedral de Santiago e Praza do Obradoiro", place: "santiago_catedral" },
      { time: "12:00", text: "Centro histórico", place: "santiago_catedral" },
      { time: "13:00", text: "Almoço — gastronomia galega", place: "santiago_mercado" },
      { time: "14:30", text: "Mercado de Abastos e Parque da Alameda", place: "santiago_mercado" },
      { time: "17:00", text: "Retorno a Porto", place: "porto_hero" },
    ],
  },
  {
    n: 4, date: "2026-12-22", weekday: "terça-feira",
    title: "Porto → Lisboa → Viena",
    cities: ["porto","lisboa","viena"],
    hotelCity: "viena",
    alerts: [
      { level: "warning", text: "Só reservar o voo depois de confirmar o horário de devolução do carro — manter folga de pelo menos 3h." },
    ],
    activities: [
      { time: "08:00", text: "Porto → Lisboa (carro)", place: "porto_hero" },
      { time: "11:00", text: "Devolução do carro em Lisboa — fim do Carro 1", place: "lisboa" },
      { time: "~14:00+", text: "Voo Lisboa → Viena — priorizar horário a partir das 14:00 (margem de segurança após devolução)", place: "lisboa" },
      { time: "18:00 (aprox.)", text: "Chegada a Viena", place: "viena_stephansdom" },
      { time: "—", text: "Passeio leve: Stephansplatz, Stephansdom, Graben, Kohlmarkt", place: "viena_graben" },
    ],
  },
  {
    n: 5, date: "2026-12-23", weekday: "quarta-feira",
    title: "Viena + mercados de Natal",
    cities: ["viena"],
    hotelCity: "viena",
    alerts: [],
    activities: [
      { time: "09:00", text: "Hofburg", place: "viena_hofburg" },
      { time: "—", text: "Biblioteca Nacional", place: "viena_biblioteca" },
      { time: "—", text: "Centro histórico", place: "viena_stephansdom" },
      { time: "Tarde", text: "Mercados de Natal (priorizar os que reduzem funcionamento após o Natal): Freyung, Am Hof, Spittelberg, Maria-Theresien-Platz, Rathausplatz", place: "viena_rathausplatz" },
    ],
  },
  {
    n: 6, date: "2026-12-24", weekday: "quinta-feira",
    title: "Schönbrunn + véspera de Natal",
    cities: ["viena"],
    hotelCity: "viena",
    alerts: [
      { level: "warning", text: "Jantar de Natal — RESERVA PRIORITÁRIA. Reservar com bastante antecedência." },
    ],
    activities: [
      { time: "09:00", text: "Palácio de Schönbrunn: palácio, jardins, Gloriette", place: "schonbrunn_palacio" },
      { time: "14:00", text: "Mercado de Natal de Schönbrunn", place: "schonbrunn_gloriette" },
      { time: "19:00", text: "Jantar de Natal — RESERVA PRIORITÁRIA", place: "schonbrunn_gloriette" },
    ],
  },
  {
    n: 7, date: "2026-12-25", weekday: "sexta-feira",
    title: "Viena (Natal)",
    cities: ["viena"],
    hotelCity: "viena",
    alerts: [
      { level: "info", text: "Dia mais tranquilo devido ao feriado — muitos estabelecimentos fecham ou reduzem horário." },
    ],
    activities: [
      { time: "10:00", text: "Centro histórico", place: "viena_graben" },
      { time: "—", text: "Stephansdom", place: "viena_stephansdom" },
      { time: "—", text: "Cafés tradicionais", place: "viena_graben" },
      { time: "15:00", text: "Schönbrunn / mercado de Natal, caso necessário", place: "schonbrunn_palacio" },
      { time: "—", text: "Jantar", place: "viena_stephansdom" },
    ],
  },
  {
    n: 8, date: "2026-12-26", weekday: "sábado",
    title: "Viena → Hallstatt → Salzburgo",
    cities: ["viena","hallstatt","salzburg"],
    hotelCity: "salzburg",
    alerts: [
      { level: "danger", text: "SEGURANÇA: verificar condições meteorológicas e das estradas antes do trecho Viena → Hallstatt (estrada de montanha, inverno)." },
      { level: "info", text: "PLANO B: se as condições de inverno tornarem o trecho a Hallstatt inadequado, seguir direto Viena → Salzburgo (aprox. 2h45 pela A1)." },
    ],
    activities: [
      { time: "07:30", text: "Retirada do segundo carro em Viena — Carro 2 (Áustria/França)", place: "viena_stephansdom" },
      { time: "08:00", text: "Viena → Hallstatt (aprox. 3h30, sujeito às condições de inverno)", place: "hallstatt" },
      { time: "11:30", text: "Chegada a Hallstatt: centro histórico, Marktplatz, igreja, margem do lago, mirantes, ruas históricas", place: "hallstatt" },
      { time: "13:00", text: "Almoço", place: "hallstatt" },
      { time: "14:00", text: "Continuação da visita", place: "hallstatt" },
      { time: "15:30", text: "Hallstatt → Salzburgo", place: "hallstatt" },
      { time: "17:00", text: "Chegada a Salzburgo: centro histórico, Catedral, Mozartplatz, Residenzplatz, mercado de Natal (se em funcionamento)", place: "salzburg_catedral" },
    ],
  },
  {
    n: 9, date: "2026-12-27", weekday: "domingo",
    title: "Salzburgo → Estrasburgo",
    cities: ["salzburg","estrasburgo"],
    hotelCity: "estrasburgo",
    alerts: [
      { level: "warning", text: "Trecho longo de inverno (~6h, ~500 km, sem paradas). Considerar paradas extras e verificar previsão do tempo na rota antes de partir." },
    ],
    activities: [
      { time: "08:30", text: "Jardins do Palácio de Mirabell: Pegasusbrunnen, jardins e esculturas, vista da Fortaleza de Hohensalzburg", place: "salzburg_mirabell", highlight: true },
      { time: "10:00", text: "Getreidegasse", place: "salzburg_getreidegasse" },
      { time: "11:30", text: "Catedral de Salzburgo e Mozartplatz", place: "salzburg_catedral" },
      { time: "12:30", text: "Almoço", place: "salzburg_getreidegasse" },
      { time: "13:00", text: "Salzburgo → Estrasburgo (carro, aprox. 500 km / 6h, sem paradas e sem contar condições de inverno)", place: "estrasburgo_catedral" },
      { time: "19:00 (aprox.)", text: "Chegada a Estrasburgo — check-in e jantar", place: "estrasburgo_petite_france" },
    ],
  },
  {
    n: 10, date: "2026-12-28", weekday: "segunda-feira",
    title: "Estrasburgo → Paris",
    cities: ["estrasburgo","paris"],
    hotelCity: "paris",
    alerts: [
      { level: "info", text: "A partir deste momento, NÃO usar carro dentro de Paris. Devolução do Carro 2 ao chegar." },
    ],
    activities: [
      { time: "08:30", text: "Petite France", place: "estrasburgo_petite_france" },
      { time: "09:30", text: "Catedral de Estrasburgo e centro histórico", place: "estrasburgo_catedral" },
      { time: "11:30", text: "Estrasburgo → Paris (carro, aprox. 490 km)", place: "paris_louvre" },
      { time: "17:00 (aprox.)", text: "Chegada a Paris — devolver o carro imediatamente, fim do Carro 2", place: "paris_eiffel" },
      { time: "18:00", text: "Torre Eiffel e Trocadéro, se houver tempo e condições", place: "paris_eiffel" },
    ],
  },
  {
    n: 11, date: "2026-12-29", weekday: "terça-feira",
    title: "Montmartre (troca sugerida — ver alerta)",
    cities: ["paris"],
    hotelCity: "paris",
    alerts: [
      { level: "danger", text: "CONFLITO DE HORÁRIO: o Museu do Louvre fecha às terças-feiras, e 29/12/2026 é uma terça-feira (fonte: louvre.fr, consulta set/2026). Sugestão: trocar esta visita com o dia 30/12 (Montmartre), quando o Louvre abre até 21h. RE-VERIFIQUE o horário do Louvre antes de finalizar, pois pode mudar." },
    ],
    activities: [
      { time: "09:00", text: "[Roteiro original: Museu do Louvre — FECHADO às terças, ver alerta acima. Sugestão: fazer Montmartre hoje.]", place: "paris_montmartre" },
      { time: "14:00", text: "[Roteiro original: Jardins das Tuileries e Place de la Concorde]", place: "paris_tuileries" },
      { time: "17:00", text: "[Roteiro original: Opéra e Galeries Lafayette]", place: "paris_opera" },
    ],
  },
  {
    n: 12, date: "2026-12-30", weekday: "quarta-feira",
    title: "Montmartre (roteiro original) — considerar trocar por Louvre",
    cities: ["paris"],
    hotelCity: "paris",
    alerts: [
      { level: "info", text: "O Louvre abre até 21h às quartas-feiras — dia recomendado para a visita ao museu, trocando com o Dia 11." },
    ],
    activities: [
      { time: "09:00", text: "Montmartre: Sacré-Cœur, Place du Tertre, Rue des Abbesses", place: "paris_montmartre" },
      { time: "—", text: "—", place: "paris_tertre" },
      { time: "14:00", text: "Pigalle — Moulin Rouge (visita externa, salvo espetáculo contratado)", place: "paris_moulin_rouge" },
    ],
  },
  {
    n: 13, date: "2026-12-31", weekday: "quinta-feira",
    title: "Paris + Réveillon",
    cities: ["paris"],
    hotelCity: "paris",
    alerts: [
      { level: "warning", text: "Réveillon — RESERVA DE PRIORIDADE MÁXIMA." },
    ],
    activities: [
      { time: "09:00", text: "Notre-Dame", place: "paris_notredame" },
      { time: "—", text: "Sainte-Chapelle", place: "paris_saintechapelle" },
      { time: "14:00", text: "Marais e Place des Vosges", place: "paris_marais" },
      { time: "20:00", text: "Réveillon — RESERVA DE PRIORIDADE MÁXIMA", place: "paris_sena" },
    ],
  },
  {
    n: 14, date: "2027-01-01", weekday: "sexta-feira",
    title: "Paris (dia leve)",
    cities: ["paris"],
    hotelCity: "paris",
    alerts: [
      { level: "info", text: "Dia propositalmente mais leve." },
    ],
    activities: [
      { time: "10:00", text: "Brunch", place: "paris_sena" },
      { time: "—", text: "Passeio pelo Sena", place: "paris_sena" },
      { time: "14:00", text: "Trocadéro e Torre Eiffel", place: "paris_eiffel" },
    ],
  },
  {
    n: 15, date: "2027-01-02", weekday: "sábado",
    title: "Versailles",
    cities: ["paris","versailles"],
    hotelCity: "paris",
    alerts: [],
    activities: [
      { time: "08:30", text: "Paris → Versailles", place: "versailles_palacio" },
      { time: "09:30", text: "Palácio de Versailles", place: "versailles_palacio" },
      { time: "13:00", text: "Jardins, Grand Trianon e Petit Trianon", place: "versailles_jardins" },
      { time: "17:00", text: "Retorno a Paris", place: "paris_sena" },
    ],
  },
  {
    n: 16, date: "2027-01-03", weekday: "domingo",
    title: "Paris — retorno",
    cities: ["paris"],
    hotelCity: null,
    alerts: [],
    activities: [
      { time: "09:00", text: "Compras e último passeio", place: "paris_sena" },
      { time: "Depois", text: "Aeroporto e retorno", place: "paris_eiffel" },
    ],
  },
];

/* ---------------------------------------------------------------------
   HOSPEDAGEM
--------------------------------------------------------------------- */
const HOSPEDAGEM = [
  { city: "porto", checkin: "2026-12-19", checkout: "2026-12-22", nights: 3, rooms: 2, roomType: "Duplo", hotel: null, pricePerNight: null, status: "A confirmar" },
  { city: "viena", checkin: "2026-12-22", checkout: "2026-12-26", nights: 4, rooms: 2, roomType: "Duplo", hotel: null, pricePerNight: null, status: "A confirmar" },
  { city: "salzburg", checkin: "2026-12-26", checkout: "2026-12-27", nights: 1, rooms: 2, roomType: "Duplo", hotel: null, pricePerNight: null, status: "A confirmar" },
  { city: "estrasburgo", checkin: "2026-12-27", checkout: "2026-12-28", nights: 1, rooms: 2, roomType: "Duplo", hotel: null, pricePerNight: null, status: "A confirmar" },
  { city: "paris", checkin: "2026-12-28", checkout: "2027-01-03", nights: 6, rooms: 2, roomType: "Duplo", hotel: null, pricePerNight: null, status: "A confirmar" },
];

/* ---------------------------------------------------------------------
   TRANSPORTE
--------------------------------------------------------------------- */
const TRANSPORTE = {
  carro1: {
    nome: "Carro 1 — Portugal",
    retirada: { local: "Lisboa", data: "2026-12-19" },
    devolucao: { local: "Lisboa", data: "2026-12-22" },
    trechos: ["Lisboa → Fátima", "Fátima → Porto", "Porto → Santiago de Compostela", "Santiago de Compostela → Porto", "Porto → Lisboa"],
    campos: {
      locadora: null, categoria: null, cambio: null, seguro: null, franquia: null,
      diaria: null, combustivel: null, pedagios: null, estacionamento: null, total: null,
    },
  },
  voo: {
    nome: "Voo Lisboa → Viena",
    data: "2026-12-22",
    passageiros: 4,
    prioridade: "A partir das 14:00 (margem de segurança após devolução do Carro 1)",
    campos: {
      companhia: null, numeroVoo: null, horario: null, bagagem: null,
      precoPorPessoa: null, total: null,
    },
    alerta: "Só reservar o voo depois de confirmar o horário de devolução do carro — manter folga de pelo menos 3h.",
  },
  carro2: {
    nome: "Carro 2 — Áustria / França (one-way)",
    retirada: { local: "Viena", data: "2026-12-26" },
    devolucao: { local: "Paris", data: "2026-12-28" },
    trechos: ["Viena → Hallstatt", "Hallstatt → Salzburgo", "Salzburgo → Estrasburgo", "Estrasburgo → Paris"],
    campos: {
      taxaOneWay: null, seguro: null, combustivel: null, pedagios: null,
      vinhetas: null, estacionamento: null, total: null,
    },
  },
  alertasDocumentacao: [
    "Confirmar autorização da locadora para cruzar fronteiras (Áustria → possivelmente Alemanha → França) — nem toda locadora permite one-way internacional.",
    "Verificar regras de circulação na Alemanha, se a rota passar por lá (selo ambiental / Umweltplakette obrigatório em zonas de baixa emissão).",
    "Verificar regras de circulação em Paris (zona de baixa emissão / Crit'Air) — o carro é devolvido antes de entrar na cidade, então confirmar se ainda é relevante para o trecho de chegada.",
    "Vinheta (Vignette) obrigatória nas autoestradas austríacas — adquirir antes de rodar na Áustria.",
    "Equipamentos de inverno (pneus de inverno / correntes) — obrigatoriedade varia por país em condições de neve/gelo; confirmar com a locadora em cada país.",
  ],
};

/* ---------------------------------------------------------------------
   ORÇAMENTO — todas as categorias começam zeradas / a confirmar.
   valor: número em EUR editável pelo usuário no app; estimativa:true
   apenas rotula visualmente, nunca finge ser preço real.
--------------------------------------------------------------------- */
const ORCAMENTO_CATEGORIAS = [
  { id: "voos", nome: "Voos", valor: 0, estimativa: false, obs: "Voo Lisboa → Viena (4 pax)" },
  { id: "hotel_porto", nome: "Hotel — Porto (3 noites)", valor: 0, estimativa: false, obs: "2 quartos duplos" },
  { id: "hotel_viena", nome: "Hotel — Viena (4 noites)", valor: 0, estimativa: false, obs: "2 quartos duplos" },
  { id: "hotel_salzburg", nome: "Hotel — Salzburgo (1 noite)", valor: 0, estimativa: false, obs: "2 quartos duplos" },
  { id: "hotel_estrasburgo", nome: "Hotel — Estrasburgo (1 noite)", valor: 0, estimativa: false, obs: "2 quartos duplos" },
  { id: "hotel_paris", nome: "Hotel — Paris (6 noites)", valor: 0, estimativa: false, obs: "2 quartos duplos" },
  { id: "carro1", nome: "Aluguel de carro — Carro 1 (Portugal)", valor: 0, estimativa: false, obs: "" },
  { id: "carro2", nome: "Aluguel de carro — Carro 2 (Áustria/França, one-way)", valor: 0, estimativa: false, obs: "" },
  { id: "combustivel", nome: "Combustível", valor: 0, estimativa: false, obs: "" },
  { id: "pedagios", nome: "Pedágios", valor: 0, estimativa: false, obs: "" },
  { id: "vinhetas", nome: "Vinhetas (Áustria etc.)", valor: 0, estimativa: false, obs: "" },
  { id: "estacionamento", nome: "Estacionamento", valor: 0, estimativa: false, obs: "" },
  { id: "transporte_publico", nome: "Transporte público", valor: 0, estimativa: false, obs: "Metrô/trem em Viena, Paris etc." },
  { id: "ingressos", nome: "Ingressos", valor: 0, estimativa: false, obs: "Cave do Porto, Schönbrunn, Louvre, Versailles" },
  { id: "passeios", nome: "Passeios", valor: 0, estimativa: false, obs: "Hallstatt / Salzburgo" },
  { id: "restaurantes", nome: "Restaurantes", valor: 0, estimativa: false, obs: "" },
  { id: "alimentacao", nome: "Alimentação (geral)", valor: 0, estimativa: false, obs: "" },
  { id: "reveillon", nome: "Réveillon", valor: 0, estimativa: false, obs: "Jantar 31/12 em Paris" },
  { id: "seguro_viagem", nome: "Seguro viagem", valor: 0, estimativa: false, obs: "4 adultos" },
  { id: "outros", nome: "Outros", valor: 0, estimativa: false, obs: "" },
];

/* ---------------------------------------------------------------------
   RESERVAS — status editável: pendente | pesquisando | reservado | pago | cancelado
--------------------------------------------------------------------- */
const RESERVAS = [
  { id: "voo", nome: "Voo Lisboa → Viena", status: "pendente", categoria: "Transporte" },
  { id: "hotel_porto", nome: "Hotel Porto", status: "pendente", categoria: "Hospedagem" },
  { id: "hotel_viena", nome: "Hotel Viena", status: "pendente", categoria: "Hospedagem" },
  { id: "hotel_salzburg", nome: "Hotel Salzburgo", status: "pendente", categoria: "Hospedagem" },
  { id: "hotel_estrasburgo", nome: "Hotel Estrasburgo", status: "pendente", categoria: "Hospedagem" },
  { id: "hotel_paris", nome: "Hotel Paris", status: "pendente", categoria: "Hospedagem" },
  { id: "carro1", nome: "Carro 1 (Portugal)", status: "pendente", categoria: "Transporte" },
  { id: "carro2", nome: "Carro 2 (Áustria/França)", status: "pendente", categoria: "Transporte" },
  { id: "cave_porto", nome: "Cave de vinho do Porto", status: "pendente", categoria: "Atrações" },
  { id: "schonbrunn", nome: "Palácio de Schönbrunn", status: "pendente", categoria: "Atrações" },
  { id: "jantar_natal", nome: "Jantar de Natal (24/12)", status: "pendente", categoria: "Restaurantes" },
  { id: "hallstatt", nome: "Atrações de Hallstatt", status: "pendente", categoria: "Atrações" },
  { id: "louvre", nome: "Museu do Louvre", status: "pendente", categoria: "Atrações" },
  { id: "reveillon", nome: "Réveillon (31/12)", status: "pendente", categoria: "Restaurantes" },
  { id: "versailles", nome: "Palácio de Versailles", status: "pendente", categoria: "Atrações" },
  { id: "seguro", nome: "Seguro viagem", status: "pendente", categoria: "Documentação" },
];

const RESERVA_STATUS = [
  { id: "pendente", label: "Pendente", color: "#c1443c" },
  { id: "pesquisando", label: "Pesquisando", color: "#d9a441" },
  { id: "reservado", label: "Reservado", color: "#3f7fb3" },
  { id: "pago", label: "Pago", color: "#3c8a5c" },
  { id: "cancelado", label: "Cancelado", color: "#6b6f76" },
];

/* Fontes consultadas (setembro/2026) — exibidas na seção de notas/fontes */
const FONTES = [
  { texto: "Santuário de Fátima — horários de celebrações: consultar fatima.pt/pt/schedule (sem horário fixo de inverno publicado)", url: "https://www.fatima.pt/pt/schedule" },
  { texto: "Catedral de Santiago de Compostela — basílica 7h–21h, museu 10h–20h", url: "https://catedraldesantiago.es" },
  { texto: "Palácio da Bolsa (Porto) — horário/preço não confirmados", url: "https://www.palaciodabolsa.com" },
  { texto: "Palácio de Schönbrunn — palácio 8h30–17h; jardins 6h30–17h30 (temporada nov/2026–mar/2027)", url: "https://www.schoenbrunn.at" },
  { texto: "Mercados de Natal de Viena 2026 — Christkindlmarkt, Freyung, Am Hof e Spittelberg abrem 13/11; Maria-Theresien-Platz 20/11; Schönbrunn 6/11", url: "https://www.visitingvienna.com" },
  { texto: "Christkindlmarkt de Salzburgo 2026 — abre 19/11/2026, fecha 01/01/2027; horário especial 24/12 (9h–15h) e 31/12 (10h–18h)", url: "https://www.christkindlmarkt.co.at" },
  { texto: "Museu do Louvre — fechado às terças; seg/qui/sáb/dom 9h–18h; qua/sex 9h–21h; fechado 25/12", url: "https://www.louvre.fr" },
  { texto: "Palácio de Versailles — palácio 9h–17h30 (fechado segundas); Trianon 12h–17h30 (fechado segundas); jardins 8h–18h todos os dias", url: "https://www.chateauversailles.fr" },
  { texto: "Notre-Dame de Paris — reaberta ao público; recomenda-se reserva de horário de entrada", url: "https://www.notredamedeparis.fr" },
];
