# AcessaSP

Protótipo web desenvolvido para a **Global Solution 2026.2 – CitizenTech** (Application Development, FIAP).

## 1. Problema, público e objetivo

- **Problema:** barreiras de acessibilidade urbana (calçadas quebradas, falta de rampas, semáforos sem sinal sonoro, falta de piso tátil etc.) limitam a locomoção de muitas pessoas e raramente são registradas de forma organizada.
- **Público beneficiado:** pessoas com deficiência, com mobilidade reduzida, idosos, gestantes e famílias com carrinhos de bebê, além de coletivos e órgãos que precisam priorizar melhorias.
- **Objetivo:** permitir que a comunidade registre ocorrências e transformar esses registros em indicadores que mostrem onde agir primeiro.

## 2. ODS relacionados

- **ODS 11** – Cidades e Comunidades Sustentáveis
- **ODS 10** – Redução das Desigualdades

## 3. Tecnologias

HTML, CSS, JavaScript, Node.js, Express e MongoDB (Mongoose).

## 4. Como executar

**Pré-requisitos:** Node.js 18+ e MongoDB rodando localmente (ou uma string de conexão do MongoDB Atlas).

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o arquivo de ambiente
cp .env.example .env        # no Windows (PowerShell): copy .env.example .env

# 3. (Opcional) popular com dados de exemplo
npm run seed

# 4. Iniciar o servidor
npm start
```

Acesse: **http://localhost:3000**

Para usar o MongoDB Atlas, troque o valor de `MONGO_URI` no arquivo `.env`.

## 5. Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página com introdução e formulário |
| GET | `/registros.html` | Listagem e indicadores |
| GET | `/api/opcoes` | Categorias e prioridades do formulário |
| POST | `/api/ocorrencias` | Valida e salva uma ocorrência |
| GET | `/api/ocorrencias` | Lista ocorrências (filtros `?categoria=` e `?prioridade=`) |
| GET | `/api/indicadores` | Retorna os indicadores calculados |
| qualquer outra | — | Página 404 (ou JSON 404 para `/api`) |

## 6. Estrutura de cada registro (coleção `ocorrencias`)

`titulo`, `categoria`, `prioridade`, `bairro`, `descricao` e `criadoEm`.

Validações: título (5–80 caracteres), categoria e prioridade dentro das listas permitidas, bairro (2–60) e descrição (10–400). Erros retornam status 400 com a lista de mensagens.

## 7. Indicadores

1. **Total de registros:** contagem de todas as ocorrências cadastradas (`countDocuments`).
2. **Resumo por categoria:** agrupamento com `$group` mostrando quantas ocorrências existem em cada tipo de barreira.
3. **Resumo por prioridade:** quantidade de ocorrências Alta, Média e Baixa, com o **percentual de prioridade alta**.
4. **Bairro mais afetado:** bairro com mais ocorrências, para indicar onde concentrar a atuação.

## 8. Estrutura de arquivos

```
acessasp/
├── server.js            # servidor Express, rotas e conexão com o MongoDB
├── models/Ocorrencia.js # schema Mongoose
├── scripts/seed.js      # dados de exemplo
├── public/
│   ├── index.html       # introdução + formulário
│   ├── registros.html   # indicadores + listagem
│   ├── 404.html
│   ├── css/style.css
│   └── js/ (form.js, registros.js)
├── .env.example
└── package.json
```

## 9. Vídeo pitch

Link: https://youtu.be/Bi7siKpt3Vc?is=u3Z5gfm228uerZM2

## 10. Autoria

Manoella dos Santos Ginez - RM564469 | Leonardo de Magalhães Piassa - RM563663
