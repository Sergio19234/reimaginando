const statusMap = {

  "a-fazer":
    "status-afazer-heading",

  "em-andamento":
    "status-andamento-heading",

  "em-revisao":
    "status-revisao-heading",

  "concluida":
    "status-concluida-heading"
};


const nomesPrioridade = {

  baixa: "Baixa",

  media: "Média",

  alta: "Alta"
};


export function renderizarTarefas(tarefas) {

  limparQuadro();


  tarefas.forEach(tarefa => {

    const cartao =
      criarCartao(tarefa);

    const coluna =
      encontrarColuna(tarefa.status);


    if (coluna) {
      coluna.appendChild(cartao);
    }
  });
}


function limparQuadro() {

  Object.values(statusMap)
    .forEach(idCabecalho => {

      const cabecalho =
        document.getElementById(
          idCabecalho
        );


      if (!cabecalho) {
        return;
      }


      const coluna =
        cabecalho.parentElement;


      const lista =
        coluna.querySelector("ul");


      if (lista) {
        lista.replaceChildren();
      }
    });
}


function encontrarColuna(status) {

  const idCabecalho =
    statusMap[status];


  if (!idCabecalho) {
    return null;
  }


  const cabecalho =
    document.getElementById(
      idCabecalho
    );


  if (!cabecalho) {
    return null;
  }


  return cabecalho
    .parentElement
    .querySelector("ul");
}


function criarCartao(tarefa) {

  const item =
    document.createElement("li");


  const artigo =
    document.createElement("article");


  /* Título */

  const titulo =
    document.createElement("h4");

  titulo.textContent =
    tarefa.titulo;


  /* Projeto */

  const projeto =
    document.createElement("p");


  const projetoStrong =
    document.createElement("strong");

  projetoStrong.textContent =
    "PROJECT::";


  projeto.appendChild(
    projetoStrong
  );

  projeto.appendChild(
    document.createTextNode(
      " Tarefa acadêmica"
    )
  );


  /* Responsável */

  const responsavel =
    document.createElement("p");


  const responsavelStrong =
    document.createElement("strong");

  responsavelStrong.textContent =
    "OWNER::";


  responsavel.appendChild(
    responsavelStrong
  );

  responsavel.appendChild(
    document.createTextNode(
      " Equipe acadêmica"
    )
  );


  /* Prazo */

  const prazo =
    document.createElement("p");


  const prazoStrong =
    document.createElement("strong");

  prazoStrong.textContent =
    "DEADLINE::";


  const data =
    document.createElement("time");

  data.dateTime =
    tarefa.prazo;

  data.textContent =
    formatarData(tarefa.prazo);


  prazo.appendChild(
    prazoStrong
  );

  prazo.appendChild(
    document.createTextNode(" ")
  );

  prazo.appendChild(data);


  /* Prioridade */

  const prioridade =
    document.createElement("p");


  const prioridadeStrong =
    document.createElement("strong");

  prioridadeStrong.textContent =
    "PRIORITY::";


  prioridade.appendChild(
    prioridadeStrong
  );

  prioridade.appendChild(
    document.createTextNode(
      ` ${
        nomesPrioridade[tarefa.prioridade]
        || tarefa.prioridade
      }`
    )
  );


  /* Montagem */

  artigo.appendChild(titulo);

  artigo.appendChild(projeto);

  artigo.appendChild(responsavel);

  artigo.appendChild(prazo);

  artigo.appendChild(prioridade);


  item.appendChild(artigo);


  return item;
}


function formatarData(dataString) {

  const partes =
    dataString.split("-");


  if (partes.length !== 3) {
    return dataString;
  }


  const [
    ano,
    mes,
    dia
  ] = partes;


  return `${dia}/${mes}/${ano}`;
}