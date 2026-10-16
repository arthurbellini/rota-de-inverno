/* =========================================================================
   DADOS DA VIAGEM — fonte de verdade única.
   Fontes: planilha "Viagem detalhe.xlsx" (abas Ajustes, Passagens, Locadora,
   Hospedagem) + roteiro original. Valores da planilha estão em R$ (BRL).
   Orçamento: cada linha tem moeda própria; a conversão usa a cotação editável.
   Nada aqui é inventado: o que não consta na planilha fica null / "A confirmar".
   ========================================================================= */

const DATA_VERSION = 2; // incrementar quando os padrões de orçamento/reservas mudarem

const TRIP_META = {
  travelers: 4,
  rooms: 2,
  roomType: "Quartos duplos",
  startDate: "2026-12-19",
  endDate: "2027-01-03",
  nights: 15,
  totalDays: 16,
  defaultRate: 6.20, // cotação inicial sugerida — 100% editável na tela de Orçamento
  travelerNames: ["Arthur", "Melliza", "Lyvia", "Junior"],
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
  { id: "orbey", name: "Orbey (região de Colmar)", country: "França", lat: 48.1231, lng: 7.1797 },
  { id: "paris", name: "Paris", country: "França", lat: 48.8566, lng: 2.3522 },
  { id: "versailles", name: "Versailles", country: "França", lat: 48.8049, lng: 2.1204 },
];

// Ordem da rota no mapa e dia em que cada ponto é alcançado (mesmo índice).
const ROUTE_ORDER = ["lisboa","fatima","porto","santiago","lisboa","viena","hallstatt","salzburg","estrasburgo","orbey","paris","versailles","paris"];
const ROUTE_DAY   = [1,        1,       1,      3,         3,       4,      8,          8,         9,            10,     11,     15,          16];

/* ---------------------------------------------------------------------
   ROTEIRO DIA A DIA
   alerts[].level: "danger" (conflito/risco) | "warning" (pendência) | "info"
--------------------------------------------------------------------- */
const DAYS = [
  {
    n: 1, date: "2026-12-19", weekday: "sábado",
    title: "Lisboa → Fátima → Porto",
    cities: ["lisboa","fatima","porto"],
    hotelCity: "porto",
    alerts: [
      { level: "info", text: "Junior chega a Lisboa neste dia às 10:05 (Azul 8752). Hotel: Memorial Porto — check-in a partir das 15:00." },
      { level: "warning", text: "Arthur, Melliza e Lyvia têm passagem TAP com chegada ao Porto em 16/12 (ver Transporte). Confirmar como chegam a Lisboa para retirar o Carro 1 hoje às 11:00." },
    ],
    activities: [
      { time: "10:00", text: "Chegada a Lisboa (aeroporto)", place: "lisboa" },
      { time: "11:00", text: "Retirada do Carro 1 (Mercedes C-Class Estate, Drive on Holidays) no aeroporto de Lisboa", place: "lisboa" },
      { time: "11:15", text: "Lisboa → Fátima (carro)", place: "lisboa" },
      { time: "12:30", text: "Visita ao Santuário de Fátima: Capelinha das Aparições; Basílica de Nossa Senhora do Rosário; Basílica da Santíssima Trindade; Recinto de Oração", place: "fatima_capelinha" },
      { time: "14:30", text: "Almoço em Fátima", place: "fatima_basilica_rosario" },
      { time: "15:15", text: "Fátima → Porto (carro)", place: "fatima_basilica_trindade" },
      { time: "18:00", text: "Chegada ao Porto — check-in no Memorial Porto FLP Hotels e jantar", place: "porto_hero" },
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
    title: "Porto → Santiago de Compostela → Lisboa",
    cities: ["porto","santiago","lisboa"],
    hotelCity: "lisboa",
    alerts: [
      { level: "danger", text: "Trecho longo de inverno: Santiago → Lisboa leva cerca de 6h (aprox.). Saindo às 14:30, a chegada às 20:00 (check-in previsto na planilha) fica sem folga. Verificar previsão do tempo e considerar partir mais cedo." },
      { level: "info", text: "Plano ajustado pela planilha: o Mercado de Abastos e o Parque da Alameda saíram do dia. Check-out do Memorial Porto até 11:00 (saída às 07:30 com as malas). Hotel em Lisboa: Holiday Inn Express Lisbon Airport (Rua Guiné 18, Prior Velho, Loures)." },
    ],
    activities: [
      { time: "07:30", text: "Porto → Santiago de Compostela (carro)", place: "porto_hero" },
      { time: "10:00", text: "Catedral de Santiago e Praza do Obradoiro", place: "santiago_catedral" },
      { time: "12:00", text: "Centro histórico", place: "santiago_catedral" },
      { time: "13:00", text: "Almoço — gastronomia galega", place: "santiago_catedral" },
      { time: "14:30", text: "Retorno a Lisboa (carro, aprox. 6h)", place: "lisboa" },
      { time: "20:00", text: "Check-in no Holiday Inn Express Lisbon Airport", place: "lisboa" },
    ],
  },
  {
    n: 4, date: "2026-12-22", weekday: "terça-feira",
    title: "Lisboa → Viena",
    cities: ["lisboa","viena"],
    hotelCity: "viena",
    alerts: [
      { level: "danger", text: "Conflito na devolução do Carro 1: a reserva (Drive on Holidays) informa devolução em 22/12 às 10:00, mas o plano exige devolver às 04:30 (voo às 07:00). Confirmar com a locadora a devolução antecipada fora do horário." },
      { level: "warning", text: "A planilha 'Ajustes' indica voo às 06:30; a passagem TAP TP1270 informa decolagem às 07:00. Conferir o horário no aplicativo da TAP." },
      { level: "info", text: "Voo já reservado (TAP TP1270, reserva XTZ7MR). Check-out do Holiday Inn até 11:00; check-in no 25hours Hotel a partir das 15:00." },
    ],
    activities: [
      { time: "04:30", text: "Devolução do Carro 1 — aeroporto de Lisboa (fim do Carro 1)", place: "lisboa" },
      { time: "07:00", text: "Voo TAP TP1270 Lisboa → Viena", place: "lisboa" },
      { time: "11:35", text: "Chegada a Viena", place: "viena_stephansdom" },
      { time: "15:00", text: "Check-in no 25hours Hotel beim MuseumsQuartier (Lerchenfelder Straße 1-3)", place: "viena_stephansdom" },
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
      { time: "19:00", text: "Jantar de Natal — RESERVA PRIORITÁRIA", place: "viena_spittelberg" },
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
      { level: "info", text: "Horários ajustados: a retirada do Carro 2 (Sixt, Volvo V60 Estate) é às 08:00 em Viena West (Felberstr. 1) — antes o plano previa 07:30. Check-out do 25hours às 12:00; check-in no Leonardo Hotel Salzburg Airport (Wals) a partir das 15:00." },
    ],
    activities: [
      { time: "08:00", text: "Retirada do Carro 2 (Sixt) — Viena West Estação Ferroviária, Felberstr. 1", place: "viena_stephansdom" },
      { time: "~08:30", text: "Viena → Hallstatt (aprox. 3h30, sujeito às condições de inverno)", place: "hallstatt" },
      { time: "~12:00", text: "Chegada a Hallstatt: centro histórico, Marktplatz, igreja, margem do lago, mirantes, ruas históricas", place: "hallstatt" },
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
      { level: "danger", text: "Trecho longo de inverno (~6h, ~500 km, sem paradas). Considerar paradas extras e verificar previsão do tempo na rota antes de partir." },
      { level: "info", text: "Check-out do Leonardo Hotel Salzburg Airport até 11:00. Hotel em Estrasburgo: Château de Pourtaès (161 Rue Mélanie) — check-in a partir das 15:00." },
    ],
    activities: [
      { time: "08:30", text: "Jardins do Palácio de Mirabell: Pegasusbrunnen, jardins e esculturas, vista da Fortaleza de Hohensalzburg", place: "salzburg_mirabell", highlight: true },
      { time: "10:00", text: "Getreidegasse", place: "salzburg_getreidegasse" },
      { time: "11:30", text: "Catedral de Salzburgo e Mozartplatz", place: "salzburg_catedral" },
      { time: "12:30", text: "Almoço", place: "salzburg_getreidegasse" },
      { time: "13:00", text: "Salzburgo → Estrasburgo (carro, aprox. 500 km / 6h, sem paradas e sem contar condições de inverno)", place: "estrasburgo_catedral" },
      { time: "19:00 (aprox.)", text: "Chegada a Estrasburgo — check-in no Château de Pourtaès e jantar", place: "estrasburgo_petite_france" },
    ],
  },
  {
    n: 10, date: "2026-12-28", weekday: "segunda-feira",
    title: "Estrasburgo → Orbey (Colmar)",
    cities: ["estrasburgo","orbey"],
    hotelCity: "orbey",
    alerts: [
      { level: "info", text: "Roteiro ajustado pela hospedagem: a noite de 28/12 é em Orbey (região de Colmar), e não mais em Paris. Hotel: Logis Hostellerie Motel Au Bois Le Sire (20 Rue Général de Gaulle) — janela de check-in 14:30 às 18:30." },
      { level: "warning", text: "Atividades em Colmar/Orbey não constam na planilha: definir o que fazer na tarde e noite deste dia." },
    ],
    activities: [
      { time: "08:30", text: "Petite France", place: "estrasburgo_petite_france" },
      { time: "09:30", text: "Catedral de Estrasburgo e centro histórico (check-out do Château de Pourtaès até 11:00)", place: "estrasburgo_catedral" },
      { time: "11:30", text: "Estrasburgo → Orbey / Colmar (carro, aprox. 1h30)", place: "estrasburgo_catedral" },
      { time: "14:30–18:30", text: "Check-in no Logis Au Bois Le Sire (Orbey)", place: "estrasburgo_petite_france" },
    ],
  },
  {
    n: 11, date: "2026-12-29", weekday: "terça-feira",
    title: "Orbey → Paris",
    cities: ["orbey","paris"],
    hotelCity: "paris",
    alerts: [
      { level: "danger", text: "CONFLITO: a reserva do Carro 2 (Sixt) informa devolução em Paris em 29/12 às 08:00, mas o check-out em Orbey é às 11:00 e o trajeto Orbey → Paris leva cerca de 5h. Ajustar o horário de devolução com a Sixt antes de viajar." },
      { level: "danger", text: "A agência de devolução fica no 6º arrondissement (6 Rue des Quatre Vents), dentro de Paris: verificar exigência de Crit'Air / zona de baixa emissão para o trecho final." },
      { level: "info", text: "O Louvre fecha às terças-feiras (29/12/2026 é terça): a visita foi movida para o Dia 12. Airbnb: check-in a partir das 12:00 (endereço ainda não informado na planilha)." },
    ],
    activities: [
      { time: "11:00", text: "Check-out do Logis Au Bois Le Sire (Orbey)", place: "paris_eiffel" },
      { time: "~11:00", text: "Orbey → Paris (carro, aprox. 5h)", place: "paris_eiffel" },
      { time: "—", text: "Devolução do Carro 2 — Sixt Paris Saint-Germain-des-Prés, 6 Rue des Quatre Vents (reserva indica 08:00: horário a corrigir)", place: "paris_sena" },
      { time: "12:00+", text: "Check-in no Airbnb em Paris", place: "paris_sena" },
      { time: "18:00", text: "Torre Eiffel e Trocadéro, se houver tempo e condições", place: "paris_eiffel" },
    ],
  },
  {
    n: 12, date: "2026-12-30", weekday: "quarta-feira",
    title: "Louvre + Tuileries + Opéra",
    cities: ["paris"],
    hotelCity: "paris",
    alerts: [
      { level: "info", text: "Quarta-feira: o Louvre abre até 21h (fonte: louvre.fr, consulta set/2026) — dia adequado para a visita, que saiu de 29/12 (terça, fechado). Reconfirmar o horário antes da viagem." },
    ],
    activities: [
      { time: "09:00", text: "Museu do Louvre", place: "paris_louvre" },
      { time: "14:00", text: "Jardins das Tuileries e Place de la Concorde", place: "paris_tuileries" },
      { time: "17:00", text: "Opéra e Galeries Lafayette", place: "paris_opera" },
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
      { level: "warning", text: "Montmartre e Pigalle (antes no Dia 12) ficaram sem dia definido depois que a chegada a Paris passou para 29/12. A sugestão abaixo precisa de uma decisão." },
    ],
    activities: [
      { time: "10:00", text: "Brunch", place: "paris_sena" },
      { time: "—", text: "Passeio pelo Sena", place: "paris_sena" },
      { time: "14:00", text: "Trocadéro e Torre Eiffel", place: "paris_eiffel" },
      { time: "—", text: "SUGESTÃO a decidir: Montmartre (Sacré-Cœur, Place du Tertre, Rue des Abbesses) e Pigalle — Moulin Rouge (visita externa)", place: "paris_montmartre" },
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
    alerts: [
      { level: "warning", text: "Check-out do Airbnb: a planilha traz 02/01/2026 às 13:00 (ano claramente errado). Assumido 03/01/2027 — confirmar. O voo de volta ao Brasil (planilha: 'PORTO x GRU') não tem data nem horário: confirmar origem, data e hora." },
      { level: "info", text: "É em Paris, na saída da União Europeia, que se carimba o Tax Free de todas as compras da viagem." },
    ],
    activities: [
      { time: "09:00", text: "Compras e último passeio", place: "paris_sena" },
      { time: "até 13:00", text: "Check-out do Airbnb (conferir data na reserva)", place: "paris_sena" },
      { time: "Depois", text: "Aeroporto e retorno", place: "paris_eiffel" },
    ],
  },
];

/* ---------------------------------------------------------------------
   HOSPEDAGEM (planilha, aba Hospedagem) — valores em R$
--------------------------------------------------------------------- */
const HOSPEDAGEM = [
  { id: "hotel_porto", city: "porto", nome: "Memorial Porto FLP Hotels",
    endereco: "Rua de São Francisco 2, União de Freguesias do Centro, 4050-253 Porto",
    checkin: "2026-12-19", checkinHora: "15:00", checkout: "2026-12-21", checkoutHora: "11:00", nights: 2,
    canal: "APP Booking", valorBRL: 913, status: "reservado" },
  { id: "hotel_lisboa", city: "lisboa", nome: "Holiday Inn Express Lisbon Airport by IHG",
    endereco: "Rua Guiné 18, Prior Velho, Loures, 2685-334",
    checkin: "2026-12-21", checkinHora: "15:00", checkout: "2026-12-22", checkoutHora: "11:00", nights: 1,
    canal: "APP Booking", valorBRL: 909, status: "reservado" },
  { id: "hotel_viena", city: "viena", nome: "25hours Hotel beim MuseumsQuartier",
    endereco: "Lerchenfelder Straße 1-3, 07. Neubau, 1070 Viena",
    checkin: "2026-12-22", checkinHora: "15:00", checkout: "2026-12-26", checkoutHora: "12:00", nights: 4,
    canal: "APP Booking", valorBRL: 10775, status: "reservado" },
  { id: "hotel_salzburg", city: "salzburg", nome: "Leonardo Hotel Salzburg Airport",
    endereco: "Franz-Brotzner-Straße 15, Wals, 5071",
    checkin: "2026-12-26", checkinHora: "15:00", checkout: "2026-12-27", checkoutHora: "11:00", nights: 1,
    canal: "APP Booking", valorBRL: 1998, status: "reservado" },
  { id: "hotel_estrasburgo", city: "estrasburgo", nome: "Château de Pourtaès",
    endereco: "161 Rue Mélanie, 67000 Estrasburgo",
    checkin: "2026-12-27", checkinHora: "15:00", checkout: "2026-12-28", checkoutHora: "11:00", nights: 1,
    canal: "APP Booking", valorBRL: 1991, status: "reservado" },
  { id: "hotel_colmar", city: "orbey", nome: "Logis Hostellerie Motel Au Bois Le Sire",
    endereco: "20 Rue Général de Gaulle, 68370 Orbey (região de Colmar)",
    checkin: "2026-12-28", checkinHora: "14:30–18:30", checkout: "2026-12-29", checkoutHora: "11:00", nights: 1,
    canal: "APP Booking", valorBRL: 995, status: "reservado" },
  { id: "hotel_paris", city: "paris", nome: "Airbnb em Paris",
    endereco: null,
    checkin: "2026-12-29", checkinHora: "12:00", checkout: "2027-01-03", checkoutHora: "13:00", nights: 5,
    canal: "Airbnb", valorBRL: 10302.79, status: "reservado",
    nota: "A planilha traz check-out 02/01/2026 (ano errado); assumido 03/01/2027 — confirmar. Endereço ainda não informado." },
];

/* ---------------------------------------------------------------------
   TRANSPORTE (planilha, abas Passagens e Locadora) — valores em R$
--------------------------------------------------------------------- */
const TRANSPORTE = {
  voos: [
    {
      id: "voo_ida", titulo: "GRU ⇄ Porto", cia: "TAP", voo: "TP94 e TP1929", reserva: "ZBINNY",
      canal: "Site da TAP", rota: "GRU → Porto · Porto → GRU",
      saida: { data: "2026-12-16", hora: "00:05" }, chegada: { data: "2026-12-16", hora: "15:30" },
      passageiros: [
        { nome: "Melliza", valorBRL: 3281.55 },
        { nome: "Lyvia", valorBRL: 3281.55 },
        { nome: "Arthur", valorBRL: 3281.55 },
      ],
      alerts: [
        { level: "danger", text: "A passagem sai/chega em 16/12/2026, três dias antes do início do roteiro (19/12) e dos hotéis. A rota inclui 'Porto → GRU', sem data de volta, enquanto o roteiro termina em Paris. Confirmar datas e trechos." },
      ],
    },
    {
      id: "voo_junior", titulo: "NAVEG → Campinas → Lisboa", cia: "Azul", voo: "4630 e 8752", reserva: "NPWRKN",
      canal: "Site da Azul", rota: "NAVEG → Campinas · Campinas → Lisboa",
      saida: { data: "2026-12-18", hora: "16:05" }, chegada: { data: "2026-12-19", hora: "10:05" },
      passageiros: [ { nome: "Junior", valorBRL: 6420.90 } ],
      alerts: [],
    },
    {
      id: "voo_lis_vie", titulo: "Lisboa → Viena", cia: "TAP", voo: "TP1270", reserva: "XTZ7MR",
      canal: "Site da TAP", rota: "Lisboa → Viena",
      saida: { data: "2026-12-22", hora: "07:00" }, chegada: { data: "2026-12-22", hora: "11:35" },
      passageiros: [
        { nome: "Junior", valorBRL: 587.38 },
        { nome: "Melliza", valorBRL: 587.38 },
        { nome: "Lyvia", valorBRL: 587.38 },
        { nome: "Arthur", valorBRL: 587.38 },
      ],
      alerts: [
        { level: "warning", text: "A planilha 'Ajustes' cita voo às 06:30; a passagem diz 07:00. Confirmar no app da TAP." },
      ],
    },
  ],
  carros: [
    {
      id: "carro1", nome: "Carro 1 — Portugal",
      locadora: "Drive on Holidays", veiculo: "Mercedes C-Class Estate", reserva: "740397691", canal: "APP Booking", valorBRL: 953,
      retirada: { data: "2026-12-19", hora: "11:00", local: "Aeroporto de Lisboa" },
      devolucao: { data: "2026-12-22", hora: "10:00", local: "Aeroporto de Lisboa" },
      trechos: ["Lisboa → Fátima", "Fátima → Porto", "Porto → Santiago de Compostela", "Santiago de Compostela → Lisboa"],
      alerts: [
        { level: "danger", text: "Reserva: devolução às 10:00 de 22/12. O plano (aba Ajustes) exige devolver às 04:30, antes do voo das 07:00. Confirmar devolução antecipada com a locadora." },
      ],
    },
    {
      id: "carro2", nome: "Carro 2 — Áustria / França (one-way)",
      locadora: "Sixt", veiculo: "Volvo V60 Estate", reserva: "752558830", canal: "APP Booking", valorBRL: 9852,
      retirada: { data: "2026-12-26", hora: "08:00", local: "Viena West Estação Ferroviária — Felberstr. 1, Wien, Áustria, 1150" },
      devolucao: { data: "2026-12-29", hora: "08:00", local: "Paris – 06 Saint-Germain-des-Prés — 6 Rue des Quatre Vents, Paris, França, 75006" },
      trechos: ["Viena → Hallstatt", "Hallstatt → Salzburgo", "Salzburgo → Estrasburgo", "Estrasburgo → Orbey (Colmar)", "Orbey → Paris"],
      alerts: [
        { level: "danger", text: "Devolução em Paris marcada para 29/12 às 08:00, mas o trajeto sai de Orbey (check-out às 11:00, ~5h de estrada). Ajustar o horário com a Sixt." },
        { level: "danger", text: "A agência de devolução fica dentro de Paris (6º arrondissement): verificar Crit'Air / zona de baixa emissão." },
      ],
    },
  ],
  pendencias: ["Seguro e franquia", "Combustível", "Pedágios", "Vinheta austríaca", "Estacionamento", "Taxa one-way (conferir se inclusa no valor da Sixt)"],
  alertasDocumentacao: [
    "Confirmar autorização da locadora para cruzar fronteiras (Áustria → Alemanha, se a rota passar por lá → França) — nem toda locadora permite one-way internacional.",
    "Verificar regras de circulação na Alemanha, se a rota passar por lá (selo ambiental / Umweltplakette em zonas de baixa emissão).",
    "Verificar regras de circulação em Paris (zona de baixa emissão / Crit'Air): a devolução do Carro 2 é na região central da cidade.",
    "Vinheta (Vignette) obrigatória nas autoestradas austríacas — adquirir antes de rodar na Áustria.",
    "Equipamentos de inverno (pneus de inverno / correntes) — obrigatoriedade varia por país em condições de neve/gelo; confirmar com a locadora em cada país.",
  ],
};

/* ---------------------------------------------------------------------
   ORÇAMENTO — cada linha tem moeda própria (BRL ou EUR).
   Valores da planilha em R$; o que não consta fica em 0 (a confirmar).
--------------------------------------------------------------------- */
const ORCAMENTO_CATEGORIAS = [
  { id: "voos", nome: "Voos", valor: 18615.07, moeda: "BRL", estimativa: false, obs: "TAP GRU⇄Porto (3 × 3.281,55) + Azul Junior (6.420,90) + TAP Lisboa→Viena (4 × 587,38)" },
  { id: "hotel_porto", nome: "Hotel — Porto (2 noites)", valor: 913, moeda: "BRL", estimativa: false, obs: "Memorial Porto FLP" },
  { id: "hotel_lisboa", nome: "Hotel — Lisboa (1 noite)", valor: 909, moeda: "BRL", estimativa: false, obs: "Holiday Inn Express Airport" },
  { id: "hotel_viena", nome: "Hotel — Viena (4 noites)", valor: 10775, moeda: "BRL", estimativa: false, obs: "25hours MuseumsQuartier" },
  { id: "hotel_salzburg", nome: "Hotel — Salzburgo (1 noite)", valor: 1998, moeda: "BRL", estimativa: false, obs: "Leonardo Salzburg Airport" },
  { id: "hotel_estrasburgo", nome: "Hotel — Estrasburgo (1 noite)", valor: 1991, moeda: "BRL", estimativa: false, obs: "Château de Pourtaès" },
  { id: "hotel_colmar", nome: "Hotel — Orbey/Colmar (1 noite)", valor: 995, moeda: "BRL", estimativa: false, obs: "Au Bois Le Sire" },
  { id: "hotel_paris", nome: "Airbnb — Paris (5 noites)", valor: 10302.79, moeda: "BRL", estimativa: false, obs: "Não incluído no total da planilha (R$ 47.001,07)" },
  { id: "carro1", nome: "Aluguel de carro — Carro 1 (Portugal)", valor: 953, moeda: "BRL", estimativa: false, obs: "Drive on Holidays" },
  { id: "carro2", nome: "Aluguel de carro — Carro 2 (Áustria/França, one-way)", valor: 9852, moeda: "BRL", estimativa: false, obs: "Sixt" },
  { id: "combustivel", nome: "Combustível", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "pedagios", nome: "Pedágios", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "vinhetas", nome: "Vinhetas (Áustria etc.)", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "estacionamento", nome: "Estacionamento", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "transporte_publico", nome: "Transporte público", valor: 0, moeda: "EUR", estimativa: false, obs: "Metrô/trem em Viena, Paris etc." },
  { id: "ingressos", nome: "Ingressos", valor: 0, moeda: "EUR", estimativa: false, obs: "Cave do Porto, Schönbrunn, Louvre, Versailles" },
  { id: "passeios", nome: "Passeios", valor: 0, moeda: "EUR", estimativa: false, obs: "Hallstatt / Salzburgo" },
  { id: "restaurantes", nome: "Restaurantes", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "alimentacao", nome: "Alimentação (geral)", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
  { id: "reveillon", nome: "Réveillon", valor: 0, moeda: "EUR", estimativa: false, obs: "Jantar 31/12 em Paris" },
  { id: "seguro_viagem", nome: "Seguro viagem", valor: 0, moeda: "BRL", estimativa: false, obs: "4 adultos" },
  { id: "outros", nome: "Outros", valor: 0, moeda: "EUR", estimativa: false, obs: "" },
];

/* ---------------------------------------------------------------------
   RESERVAS — status: pendente | pesquisando | reservado | pago | cancelado
   "reservado" = tem código de reserva na planilha (pagamento não informado).
--------------------------------------------------------------------- */
const RESERVAS = [
  { id: "voo_ida", nome: "Voos TAP GRU ⇄ Porto (Arthur, Melliza, Lyvia)", categoria: "Voos", status: "reservado", codigo: "ZBINNY", canal: "Site da TAP" },
  { id: "voo_junior", nome: "Voos Azul NAVEG → Campinas → Lisboa (Junior)", categoria: "Voos", status: "reservado", codigo: "NPWRKN", canal: "Site da Azul" },
  { id: "voo_lis_vie", nome: "Voo TAP Lisboa → Viena (4 passageiros)", categoria: "Voos", status: "reservado", codigo: "XTZ7MR", canal: "Site da TAP" },
  { id: "hotel_porto", nome: "Hotel Porto — Memorial Porto FLP", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_lisboa", nome: "Hotel Lisboa — Holiday Inn Express Airport", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_viena", nome: "Hotel Viena — 25hours MuseumsQuartier", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_salzburg", nome: "Hotel Salzburgo — Leonardo Airport", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_estrasburgo", nome: "Hotel Estrasburgo — Château de Pourtaès", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_colmar", nome: "Hotel Orbey/Colmar — Au Bois Le Sire", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "APP Booking" },
  { id: "hotel_paris", nome: "Airbnb Paris", categoria: "Hospedagem", status: "reservado", codigo: null, canal: "Airbnb" },
  { id: "carro1", nome: "Carro 1 — Mercedes C-Class (Drive on Holidays)", categoria: "Transporte", status: "reservado", codigo: "740397691", canal: "APP Booking" },
  { id: "carro2", nome: "Carro 2 — Volvo V60 (Sixt)", categoria: "Transporte", status: "reservado", codigo: "752558830", canal: "APP Booking" },
  { id: "cave_porto", nome: "Cave de vinho do Porto", categoria: "Atrações", status: "pendente", codigo: null, canal: null },
  { id: "schonbrunn", nome: "Palácio de Schönbrunn", categoria: "Atrações", status: "pendente", codigo: null, canal: null },
  { id: "jantar_natal", nome: "Jantar de Natal (24/12)", categoria: "Restaurantes", status: "pendente", codigo: null, canal: null },
  { id: "hallstatt", nome: "Atrações de Hallstatt", categoria: "Atrações", status: "pendente", codigo: null, canal: null },
  { id: "louvre", nome: "Museu do Louvre (30/12)", categoria: "Atrações", status: "pendente", codigo: null, canal: null },
  { id: "reveillon", nome: "Réveillon (31/12)", categoria: "Restaurantes", status: "pendente", codigo: null, canal: null },
  { id: "versailles", nome: "Palácio de Versailles (02/01)", categoria: "Atrações", status: "pendente", codigo: null, canal: null },
  { id: "seguro", nome: "Seguro viagem", categoria: "Documentação", status: "pendente", codigo: null, canal: null },
];

const RESERVA_STATUS = [
  { id: "pendente", label: "Pendente", color: "var(--warning)" },
  { id: "pesquisando", label: "Pesquisando", color: "var(--info)" },
  { id: "reservado", label: "Reservado", color: "var(--success)" },
  { id: "pago", label: "Pago", color: "var(--pine)" },
  { id: "cancelado", label: "Cancelado", color: "var(--ink-faint)" },
];

/* ---------------------------------------------------------------------
   CHECKLIST (itens genéricos de viagem — marque o que já providenciou)
--------------------------------------------------------------------- */
const CHECKLIST = [
  { grupo: "Documentos", itens: [
    { id: "ck_passaporte", texto: "Passaportes de todos, com validade conforme exigência do espaço Schengen" },
    { id: "ck_etias", texto: "Verificar se a autorização europeia ETIAS já é exigida na data da viagem" },
    { id: "ck_seguro", texto: "Apólice do seguro viagem (cópia no celular e impressa)" },
    { id: "ck_cnh", texto: "CNH e, se exigida, Permissão Internacional para Dirigir (conferir cada locadora)" },
    { id: "ck_voucher", texto: "Códigos de reserva de voos, hotéis e carros (estão na aba Reservas)" },
    { id: "ck_cartao_caucao", texto: "Cartão de crédito em nome do motorista para a caução dos carros" },
  ]},
  { grupo: "Dinheiro e comunicação", itens: [
    { id: "ck_cartoes", texto: "Avisar o banco da viagem e levar cartões internacionais" },
    { id: "ck_euros", texto: "Euros em espécie para pequenas despesas" },
    { id: "ck_chip", texto: "Chip internacional ou eSIM com dados na Europa" },
    { id: "ck_powerbank", texto: "Power bank e carregadores" },
    { id: "ck_adaptador", texto: "Adaptador de tomada para padrão europeu" },
  ]},
  { grupo: "Carro e estrada", itens: [
    { id: "ck_vinheta", texto: "Comprar a vinheta das autoestradas austríacas antes de rodar" },
    { id: "ck_inverno", texto: "Confirmar pneus de inverno e correntes com a locadora" },
    { id: "ck_critair", texto: "Verificar Crit'Air / zona de baixa emissão para a devolução em Paris" },
    { id: "ck_fronteira", texto: "Confirmar autorização de fronteira e one-way da Sixt" },
  ]},
  { grupo: "Mala de inverno", itens: [
    { id: "ck_roupas", texto: "Roupas em camadas, casaco impermeável, gorro e luvas" },
    { id: "ck_calcado", texto: "Calçado impermeável e com solado antiderrapante" },
    { id: "ck_remedios", texto: "Remédios de uso pessoal e kit básico de saúde" },
  ]},
];

const EMERGENCIA = [
  { titulo: "Emergência (Portugal, Espanha, Áustria e França)", valor: "112", tel: "112" },
];

/* Fontes consultadas — exibidas na seção de notas/fontes */
const FONTES = [
  { texto: "Planilha 'Viagem detalhe.xlsx' (Ajustes, Passagens, Locadora, Hospedagem) — fonte de voos, carros, hotéis e ajustes dos Dias 3 e 4", url: null },
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
