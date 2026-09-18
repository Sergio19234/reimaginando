import { carregarTarefas } from "./api.js";

import {
  renderizarTarefas
} from "./renderizacao.js";

import {
  renderizarEstado
} from "./estados.js";


/* =========================================
   ESTADO ÚNICO
   ========================================= */

const estado = {

  tarefas: [],

  busca: "",

  status: "todos",

  prioridade: "todas",

  ordenacao: "nenhuma",

  carregamento: "carregando",

  erro: null
};


/* =========================================
   ELEMENTOS
   ========================================= */

const campoBusca =
  document.getElementById(
    "campo-busca"
  );


const campoOrdenacao =
  document.getElementById(
    "campo-ordenacao"
  );


const botaoLimpar =
  document.getElementById(
    "botao-limpar"
  );


const formFiltros =
  document.getElementById(
    "form-filtros"
  );


/* =========================================
   DERIVAÇÃO
   ========================================= */

function derivarTarefasVisiveis(
  estadoAtual
) {

  let tarefasVisiveis =
    estadoAtual.tarefas.filter(
      tarefa => {

        const titulo =
          tarefa.titulo.toLocaleLowerCase();


        const busca =
          estadoAtual.busca
            .toLocaleLowerCase()
            .trim();


        const correspondeBusca =
          titulo.includes(busca);


        const correspondeStatus =
          estadoAtual.status === "todos"
          ||
          tarefa.status ===
          estadoAtual.status;


        const correspondePrioridade =
          estadoAtual.prioridade === "todas"
          ||
          tarefa.prioridade ===
          estadoAtual.prioridade;


        return (
          correspondeBusca
          &&
          correspondeStatus
          &&
          correspondePrioridade
        );
      }
    );


  /* =====================================
     ORDENAÇÃO
     ===================================== */

  if (
    estadoAtual.ordenacao ===
    "prazo-crescente"
  ) {

    tarefasVisiveis =
      [...tarefasVisiveis].sort(
        (a, b) =>
          a.prazo.localeCompare(b.prazo)
      );
  }


  if (
    estadoAtual.ordenacao ===
    "prazo-decrescente"
  ) {

    tarefasVisiveis =
      [...tarefasVisiveis].sort(
        (a, b) =>
          b.prazo.localeCompare(a.prazo)
      );
  }


  return tarefasVisiveis;
}


/* =========================================
   RENDERIZAÇÃO ÚNICA
   ========================================= */

function renderizarAplicacao() {

  /* Carregando */

  if (
    estado.carregamento ===
    "carregando"
  ) {

    renderizarEstado(
      "carregando"
    );

    return;
  }


  /* Erro */

  if (
    estado.carregamento ===
    "erro"
  ) {

    renderizarEstado(
      "erro",
      estado.erro
    );

    return;
  }


  /* Fonte vazia */

  if (
    estado.tarefas.length === 0
  ) {

    renderizarEstado(
      "vazio"
    );

    return;
  }


  /* Derivação */

  const tarefasVisiveis =
    derivarTarefasVisiveis(
      estado
    );


  /* Nenhum resultado */

  if (
    tarefasVisiveis.length === 0
  ) {

    renderizarTarefas([]);

    renderizarEstado(
      "resultado-vazio",
      `0 de ${
        estado.tarefas.length
      } tarefas. Nenhuma tarefa corresponde aos critérios atuais.`
    );

    sincronizarControles();

    return;
  }


  /* Sucesso */

  renderizarTarefas(
    tarefasVisiveis
  );


  renderizarEstado(
    "sucesso",
    `${
      tarefasVisiveis.length
    } de ${
      estado.tarefas.length
    } tarefas.`
  );


  sincronizarControles();
}


/* =========================================
   CONTROLES
   ========================================= */

function sincronizarControles() {

  campoBusca.value =
    estado.busca;


  campoOrdenacao.value =
    estado.ordenacao;


  const radioStatus =
    document.querySelector(
      `input[name="status"][value="${estado.status}"]`
    );


  if (radioStatus) {
    radioStatus.checked = true;
  }


  const radioPrioridade =
    document.querySelector(
      `input[name="prioridade"][value="${estado.prioridade}"]`
    );


  if (radioPrioridade) {
    radioPrioridade.checked = true;
  }
}


/* =========================================
   BUSCA
   ========================================= */

campoBusca.addEventListener(
  "input",
  evento => {

    estado.busca =
      evento.target.value;

    renderizarAplicacao();
  }
);


/* =========================================
   STATUS
   ========================================= */

document
  .querySelectorAll(
    'input[name="status"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      evento => {

        estado.status =
          evento.target.value;

        renderizarAplicacao();
      }
    );
  });


/* =========================================
   PRIORIDADE
   ========================================= */

document
  .querySelectorAll(
    'input[name="prioridade"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      evento => {

        estado.prioridade =
          evento.target.value;

        renderizarAplicacao();
      }
    );
  });


/* =========================================
   ORDENAÇÃO
   ========================================= */

campoOrdenacao.addEventListener(
  "change",
  evento => {

    estado.ordenacao =
      evento.target.value;

    renderizarAplicacao();
  }
);


/* =========================================
   FORMULÁRIO
   ========================================= */

formFiltros.addEventListener(
  "submit",
  evento => {

    evento.preventDefault();

    renderizarAplicacao();
  }
);


/* =========================================
   LIMPAR
   ========================================= */

botaoLimpar.addEventListener(
  "click",
  () => {

    estado.busca = "";

    estado.status = "todos";

    estado.prioridade = "todas";

    estado.ordenacao = "nenhuma";

    sincronizarControles();

    renderizarAplicacao();
  }
);


/* =========================================
   INICIALIZAÇÃO
   ========================================= */

async function iniciarAplicacao() {

  /* Primeiro estado */

  estado.carregamento =
    "carregando";

  estado.erro = null;


  /* IMPORTANTE:
     acontece antes do await */

  renderizarAplicacao();


  try {

    const tarefas =
      await carregarTarefas();


    estado.tarefas =
      tarefas;


    estado.carregamento =
      "sucesso";


    estado.erro = null;

  } catch (erro) {

    estado.carregamento =
      "erro";


    if (
      erro.name === "TypeError"
    ) {

      estado.erro =
        "Erro de rede: não foi possível carregar as tarefas.";

    } else if (
      erro.name === "SyntaxError"
    ) {

      estado.erro =
        "Erro de formato: o arquivo JSON possui uma sintaxe inválida.";

    } else if (
      erro.name === "FormatoError"
    ) {

      estado.erro =
        "Erro de formato: os dados do JSON não possuem a estrutura esperada.";

    } else if (
      erro.name === "HttpError"
    ) {

      estado.erro =
        `Erro de protocolo: ${erro.message}.`;

    } else {

      estado.erro =
        "Erro inesperado ao carregar as tarefas.";
    }
  }


  /* Renderiza o resultado */

  renderizarAplicacao();
}


/* =========================================
   INICIALIZAÇÃO
   ========================================= */

iniciarAplicacao();
