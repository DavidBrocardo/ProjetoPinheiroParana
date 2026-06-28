# Diretrizes de Desenvolvimento - Projeto Pinheiro do Paraná

Este arquivo define as regras de comportamento, estilo e arquitetura para os agentes de IA que auxiliam no desenvolvimento do **Projeto Pinheiro do Paraná**.

## 1. Visão Geral do Projeto
O **Projeto Pinheiro do Paraná** é um portal/sistema web dedicado à conservação da Araucária (*Araucaria angustifolia*), promovendo educação ambiental, pesquisa científica e ações de extensão.

## 2. Stack Tecnológica
*   **Front-end:** React 19 (TypeScript) + Vite
*   **Roteamento:** React Router DOM v7 (configurado em [AppRoutes.tsx](file:///c:/Users/David/Documents/Projetos/ProjetoPinheiroParana/projeto-pinheiro-do-parana/src/routes/AppRoutes.tsx))
*   **Animações:** Framer Motion (para transições dinâmicas e animações de scroll)
*   **Carrosséis / Sliders:** Swiper.js
*   **Banco de Dados & Storage:** Firebase (Firestore para notícias/galeria/equipe e Firebase Storage para uploads de imagens)
*   **Ícones:** React Icons (`react-icons/fa`, `react-icons/fi`, etc.)
*   **Estilização:** Vanilla CSS estruturado em arquivos individuais dentro de `src/styles/` (ex: `global.css`, `header.css`, `hero.css`).

## 3. Diretrizes de Arquitetura e Organização de Código
Qualquer nova funcionalidade deve respeitar a estrutura de pastas existente:
*   **Componentes:** Criar componentes reutilizáveis e modulares em `src/components/`.
*   **Páginas:** Novas telas devem ser adicionadas em `src/pages/` e registradas em `src/routes/AppRoutes.tsx`.
*   **Estilos:** Estilos específicos de componentes ou páginas devem ser adicionados na pasta `src/styles/` e importados no arquivo correspondente (ou no `main.tsx` caso sejam globais).
*   **Tipagem (TypeScript):** Todas as entidades de dados devem possuir tipos ou interfaces estritas definidos na pasta `src/types/` (ex: [Equipe.ts](file:///c:/Users/David/Documents/Projetos/ProjetoPinheiroParana/projeto-pinheiro-do-parana/src/types/Equipe.ts), [Galeria.ts](file:///c:/Users/David/Documents/Projetos/ProjetoPinheiroParana/projeto-pinheiro-do-parana/src/types/Galeria.ts), [Noticia.ts](file:///c:/Users/David/Documents/Projetos/ProjetoPinheiroParana/projeto-pinheiro-do-parana/src/types/Noticia.ts)).
*   **Serviços:** Qualquer integração externa ou regra de serviço (como consultas ao Firebase) deve residir em `src/services/` (ex: [firebase.ts](file:///c:/Users/David/Documents/Projetos/ProjetoPinheiroParana/projeto-pinheiro-do-parana/src/services/firebase.ts)).

## 4. Diretrizes de Design & Estética Premium
Para garantir um visual moderno e impactante ("WOW factor"), o agente deve seguir estas diretrizes visuais:
*   **Paleta de Cores:** Evitar cores primárias puras ou genéricas. Utilizar uma paleta inspirada na natureza e na Araucária:
    *   *Fundo Principal:* `#F8F5F0` (bege bem suave e aquecido, trazendo um tom orgânico).
    *   *Verde Araucária:* Tons de verde florestais e profundos (ex: `#1E3F20`, `#2D5A27`) para destaques e botões.
    *   *Marrom Pinhão:* Tons terrosos e elegantes (ex: `#4A3B32`, `#3E2723`) para textos secundários ou elementos de contraste.
    *   *Superfícies:* Branco puro (`#FFFFFF`) para cartões e áreas de leitura com sombras leves.
*   **Tipografia:** Manter a fonte `Inter` (definida globalmente) ou usar fontes modernas como `Outfit` e `Roboto` com pesos bem distribuídos.
*   **Visual Premium:**
    *   Utilizar bordas arredondadas e amigáveis (`border-radius: 12px` ou `16px`).
    *   Usar sombras sutis (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`) em vez de bordas duras para separar blocos.
    *   Aplicar efeitos de vidro (Glassmorphism) em cabeçalhos fixos ou modais (`backdrop-filter: blur(10px)`).
*   **Animações e Micro-interações:**
    *   Todos os botões, links de menu e cards interativos devem possuir transições suaves (`transition: all 0.3s ease`).
    *   Implementar transições suaves de entrada de elementos com `framer-motion` para dar dinamismo ao carregar a página ou ao rolar o scroll.

## 5. Práticas de SEO e Acessibilidade (a11y)
*   **Estrutura Semântica:** Cada página deve possuir apenas um cabeçalho `<h1>` principal. Usar tags semânticas como `<header>`, `<footer>`, `<main>`, `<section>`, `<article>` e `<aside>`.
*   **Imagens:** Toda imagem deve possuir um atributo `alt` descritivo.
*   **Acessibilidade:** Elementos interativos devem ter estados de `:focus` bem visíveis e suporte à navegação por teclado.
*   **Meta Tags:** Ajustar títulos e descrições das páginas dinamicamente ou preparar meta tags adequadas no `index.html` para melhorar o indexamento.

## 6. Integração com Firebase
*   **Variáveis de Ambiente:** Todas as credenciais do Firebase devem vir de variáveis de ambiente gerenciadas pelo Vite (`import.meta.env.VITE_FIREBASE_...`). Nunca salvar segredos de produção no repositório.
*   **Firestore:** Organizar e tipar os retornos das coleções (`noticias`, `galeria`, `equipe`) utilizando os tipos definidos na pasta `src/types/`.
*   **Fallback local:** Sempre que aplicável, prever dados estáticos locais ou estados de carregamento elegantes (Skeletons) caso a conexão com o Firestore falhe ou esteja lenta.

---
*Este arquivo é lido automaticamente pelo agente de IA. Mantenha-o sempre atualizado com as novas decisões arquiteturais do projeto.*
