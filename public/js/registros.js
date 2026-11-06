const selCategoria = document.getElementById('f-categoria');
const selPrioridade = document.getElementById('f-prioridade');
const listaEl = document.getElementById('lista');

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function barra(rotulo, valor, max, classeExtra) {
  const linha = el('div', 'barra-linha');
  linha.appendChild(el('span', 'barra-rotulo', rotulo));
  const trilho = el('div', 'barra-trilho');
  const preench = el('div', 'barra-preench ' + (classeExtra || ''));
  preench.style.width = (max > 0 ? (valor / max) * 100 : 0) + '%';
  trilho.appendChild(preench);
  linha.appendChild(trilho);
  linha.appendChild(el('span', 'barra-valor', String(valor)));
  return linha;
}

async function carregarIndicadores() {
  const resp = await fetch('/api/indicadores');
  const d = await resp.json();

  document.getElementById('kpi-total').textContent = d.total;
  document.getElementById('kpi-alta').textContent = d.porPrioridade.Alta;
  document.getElementById('kpi-alta-pct').textContent = d.percentualAlta + '% do total';

  if (d.bairroMaisAfetado) {
    document.getElementById('kpi-bairro').textContent = d.bairroMaisAfetado.nome;
    document.getElementById('kpi-bairro-qtd').textContent = d.bairroMaisAfetado.quantidade + ' ocorrência(s)';
  }

  const gc = document.getElementById('grafico-categoria');
  gc.textContent = '';
  const maxCat = Math.max(0, ...d.porCategoria.map((c) => c.quantidade));
  if (d.porCategoria.length === 0) gc.appendChild(el('p', 'vazio', 'Sem dados ainda.'));
  d.porCategoria.forEach((c) => gc.appendChild(barra(c.categoria, c.quantidade, maxCat)));

  const gp = document.getElementById('grafico-prioridade');
  gp.textContent = '';
  const maxPri = Math.max(1, ...Object.values(d.porPrioridade));
  [['Alta', 'alta'], ['Média', 'media'], ['Baixa', 'baixa']].forEach(([nome, cls]) => {
    gp.appendChild(barra(nome, d.porPrioridade[nome], maxPri, 'pri-' + cls));
  });
}

async function carregarLista() {
  const params = new URLSearchParams();
  if (selCategoria.value) params.set('categoria', selCategoria.value);
  if (selPrioridade.value) params.set('prioridade', selPrioridade.value);

  const resp = await fetch('/api/ocorrencias?' + params.toString());
  const itens = await resp.json();

  listaEl.textContent = '';
  if (!Array.isArray(itens) || itens.length === 0) {
    listaEl.appendChild(el('p', 'vazio', 'Nenhuma ocorrência encontrada.'));
    return;
  }

  itens.forEach((o) => {
    const card = el('article', 'ocorrencia');
    const topo = el('div', 'oc-topo');
    topo.appendChild(el('h3', '', o.titulo));
    const cls = o.prioridade === 'Alta' ? 'alta' : o.prioridade === 'Média' ? 'media' : 'baixa';
    topo.appendChild(el('span', 'tag tag-' + cls, 'Prioridade ' + o.prioridade));
    card.appendChild(topo);
    card.appendChild(el('p', 'oc-meta', o.categoria + ' · ' + o.bairro + ' · ' + new Date(o.criadoEm).toLocaleDateString('pt-BR')));
    card.appendChild(el('p', 'oc-desc', o.descricao));
    listaEl.appendChild(card);
  });
}

async function iniciar() {
  try {
    const resp = await fetch('/api/opcoes');
    const op = await resp.json();
    op.categorias.forEach((c) => selCategoria.appendChild(new Option(c, c)));
    op.prioridades.forEach((p) => selPrioridade.appendChild(new Option(p, p)));
    await Promise.all([carregarIndicadores(), carregarLista()]);
  } catch (e) {
    listaEl.appendChild(el('p', 'vazio', 'Erro ao carregar os dados. Verifique se o servidor e o MongoDB estão rodando.'));
  }
}

selCategoria.addEventListener('change', carregarLista);
selPrioridade.addEventListener('change', carregarLista);
iniciar();
