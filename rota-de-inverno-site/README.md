# Rota de Inverno 2026/2027 — Diário de Viagem

Site estático (HTML/CSS/JS puro, sem build) com o roteiro completo da viagem de 19/12/2026 a 03/01/2027.

## Como abrir

**Opção 1 — direto no navegador:** dê duplo clique em `index.html`. Funciona offline, sem instalar nada.

**Opção 2 — servidor local (opcional, só por conveniência ao editar):**
```
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Depois abra http://localhost:5173

## Como publicar (opcional)

O site é 100% estático — basta enviar esta pasta inteira para:
- **GitHub Pages**: crie um repositório, suba estes arquivos, ative Pages apontando para a branch `main` / pasta raiz.
- **Netlify** ou **Vercel**: arraste a pasta no painel de deploy (ou conecte o repositório Git). Não há passo de build.

## Estrutura

- `index.html` — estrutura da página
- `css/styles.css` — identidade visual (tema claro/escuro)
- `js/data.js` — **todos os dados da viagem** (roteiro, hospedagem, transporte, orçamento, reservas) — fonte de verdade editável
- `js/images-data.js` — fotos reais (Wikimedia Commons) com atribuição, geradas a partir de `images/manifest.json`
- `js/app.js` — interatividade (navegação, mapa, orçamento, reservas, lightbox)

## Editando os dados

- **Roteiro, hospedagem, transporte, orçamento e reservas**: edite `js/data.js` diretamente (comentado em português).
- **Cotação EUR→BRL, valores do orçamento e status das reservas**: editáveis direto na página — ficam salvos no navegador (localStorage), por dispositivo.
- Preços "A confirmar" ou "Estimativa" são propositais — não foram inventados. Atualize-os conforme forem confirmados.

## Observação sobre horários

Os horários de atrações e mercados de Natal foram verificados em setembro/2026 (fontes listadas na seção "Fontes" do site). Reconfirme perto da viagem.
