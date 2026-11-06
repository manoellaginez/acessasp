const form = document.getElementById('form-ocorrencia');
const caixaMsg = document.getElementById('mensagem');
const btn = document.getElementById('btn-enviar');
const descricao = document.getElementById('descricao');
const contador = document.getElementById('contador');

function mostrarMensagem(tipo, titulo, lista) {
  caixaMsg.className = 'mensagem ' + tipo;
  caixaMsg.textContent = '';
  const strong = document.createElement('strong');
  strong.textContent = titulo;
  caixaMsg.appendChild(strong);
  if (lista && lista.length) {
    const ul = document.createElement('ul');
    lista.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    caixaMsg.appendChild(ul);
  }
  caixaMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function preencherSelect(id, valores) {
  const select = document.getElementById(id);
  valores.forEach((v) => {
    const op = document.createElement('option');
    op.value = v;
    op.textContent = v;
    select.appendChild(op);
  });
}

async function carregarOpcoes() {
  try {
    const resp = await fetch('/api/opcoes');
    const dados = await resp.json();
    preencherSelect('categoria', dados.categorias);
    preencherSelect('prioridade', dados.prioridades);
  } catch (e) {
    mostrarMensagem('erro', 'Não foi possível carregar as opções do formulário.');
  }
}

descricao.addEventListener('input', () => {
  contador.textContent = descricao.value.length + '/400';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const resp = await fetch('/api/ocorrencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const json = await resp.json();

    if (resp.ok && json.ok) {
      mostrarMensagem('sucesso', json.mensagem);
      form.reset();
      contador.textContent = '0/400';
    } else {
      mostrarMensagem('erro', 'Corrija os campos abaixo:', json.erros || ['Erro desconhecido.']);
    }
  } catch (err) {
    mostrarMensagem('erro', 'Falha de conexão com o servidor.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Registrar ocorrência';
  }
});

carregarOpcoes();
