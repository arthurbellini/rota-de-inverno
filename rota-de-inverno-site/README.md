# Rota de Inverno 2026/2027 — Diário de Viagem

Site estático (HTML/CSS/JS puro, sem build) com o roteiro de 19/12/2026 a 03/01/2027, feito para consultar antes e durante a viagem. Funciona como app no celular (PWA) e, depois da primeira visita, sem internet.

## Publicar (GitHub Pages)

1. No repositório, **Add file → Upload files** e envie o conteúdo desta pasta (não a pasta em si): `index.html`, `sw.js`, `manifest.webmanifest`, `css/`, `js/`, `icons/`.
2. **Commit changes**. Em **Settings → Pages**, a fonte deve ser `main` / `(root)`.
3. Abra o site e atualize com Ctrl+Shift+R. No celular, o aviso "Nova versão do site disponível" aparece sozinho.

### Ao publicar uma alteração (importante)

Os arquivos têm um número de versão para o navegador não usar cópia antiga:
- em `index.html`, troque `?v=20261016` pela nova data (todas as ocorrências);
- em `sw.js`, atualize `VERSION` e a mesma data na lista `CORE`.

## Estrutura

- `index.html` — estrutura e meta tags (SEO, compartilhamento)
- `css/styles.css` — visual (claro, escuro e automático; impressão)
- `js/data.js` — **todos os dados da viagem** (roteiro, hospedagem, transporte, orçamento, reservas, checklist). É a fonte de verdade: edite aqui.
- `js/images-data.js`, `js/images-extra-data.js` — fotos de inverno (Wikimedia Commons) com autor e licença
- `js/app.js` — tema, roteiro por dia, modo "hoje", mapa animado, carrossel e lightbox
- `js/sections.js` — hospedagem, transporte, orçamento, reservas, checklist, backup, impressão
- `js/pwa.js`, `sw.js`, `manifest.webmanifest`, `icons/` — instalação e uso offline

## Dados que ficam no aparelho

Cotação, valores do orçamento, status das reservas e checklist ficam salvos no navegador (localStorage). Use **Viagem → Seus dados → Exportar backup** para guardar uma cópia e **Importar backup** para levar a outro aparelho.

## Testar datas

Acrescente à URL: `?hoje=2026-12-21` (e `&hora=15:00`) para ver o modo "hoje" em qualquer data. Em desenvolvimento local o service worker fica desligado; use `?sw=1` para testá-lo.

## Rodar localmente

Qualquer servidor estático serve (por exemplo `python -m http.server 5173` na pasta do site). Abrir `index.html` direto funciona, mas o mapa e o modo offline precisam de `http://`.

## Sobre os dados

Preços "A confirmar" ou "Estimativa" são propositais: nada foi inventado. Os valores fechados vêm da planilha `Viagem detalhe.xlsx`; pontos em conflito aparecem como alertas vermelhos e pendências em amarelo. Reconfirme horários de atrações e mercados perto da viagem.
