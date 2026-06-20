# PlaneJAI - Resumo do projeto

## O que o projeto faz

PlaneJAI é uma aplicação web simples para simular metas financeiras pessoais. O usuário informa renda, custos fixos, dívidas, nome da meta, valor e prazo; o app calcula a economia mensal disponível e usa um serviço de IA para gerar um diagnóstico, sugestões práticas e ideias de renda/investimento.

## Como executar a aplicação

1. Instale as dependências:

```bash
pnpm install
```

2. Rode em modo de desenvolvimento:

```bash
pnpm dev
```

3. Abra no navegador em `http://localhost:5173`.

Para gerar uma build de produção:

```bash
pnpm build
pnpm preview
```

## Tecnologias usadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- PNPM
- Lucide (ícones)
- ESLint + Prettier

## Qual melhoria você implementou

- Estruturei o prompt para o serviço de IA em `src/data/aiPrompt.ts` para forçar um retorno JSON com esquema fixo (facilita parsing seguro).
- Adicionei/organizei utilitários para parse/format de moeda (`src/utils/currency.ts`) e cálculo de economia mensal (`src/utils/simulation.ts`).

## Como testar o fluxo principal

1. Inicie a aplicação com `pnpm dev`.
2. Acesse a página de simulação.
3. Preencha o formulário com valores de exemplo:

- Renda: `5.000,00`
- Custos fixos: `2.000,00`
- Dívidas: `500,00`
- Nome da meta: `Viagem para o Japão`
- Custo da meta: `15.000,00`
- Prazo: `12` meses

4. Clique em "Gerar simulação" e verifique o diagnóstico gerado pela IA, as sugestões e a mensagem motivacional.

## O que aprendi durante o desafio

- Como estruturar prompts para obter JSON consistente de modelos de IA.
- Tratamento correto de valores monetários em `pt-BR` para cálculos confiáveis.
- Organização de formulários em passos e separação de responsabilidades no frontend.

---
