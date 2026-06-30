// ADEGA DELUCCA V11 - PARTE 1

let filtroAtual = "todos";

let vinhos = JSON.parse(localStorage.getItem("adegaDelucca")) || JSON.parse(localStorage.getItem("vinhosAdega")) || [
  {
    nome:"D.V. Catena Cabernet/Malbec",
    safra:"2023",
    pais:"Argentina",
    uva:"Cabernet/Malbec",
    quantidade:2,
    valor:190,
    favorito:true,
    recompra:true,
    nota:5,
    janela:"2026 a 2032",
    harmonizacao:"Carnes, massas, cordeiro e churrasco premium",
    comentario:"Não pode faltar.",
    foto:""
  },
  {
    nome:"Luigi Bosca Insignia Malbec",
    safra:"2024",
    pais:"Argentina",
    uva:"Malbec",
    quantidade:2,
    valor:180,
    favorito:true,
    recompra:true,
    nota:5,
    janela:"2026 a 2030",
    harmonizacao:"Churrasco e carnes vermelhas",
    comentario:"Muito bom, suave, recomprar.",
    foto:""
  },
  {
    nome:"Alma Negra Blend",
    safra:"2021",
    pais:"Argentina",
    uva:"Blend",
    quantidade:3,
    valor:160,
    favorito:true,
    recompra:true,
    nota:5,
    janela:"Agora até 2029",
    harmonizacao:"Jantar normal, carnes, queijos e massas",
    comentario:"Suave, leve, espetacular.",
    foto:""
  }
];

function salvarDados(){
  localStorage.setItem("adegaDelucca", JSON.stringify(vinhos));
}

function estrelas(n){
  return "⭐".repeat(Number(n || 0));
}

function totalGarrafas(){
  return vinhos.reduce((s,v)=>s + Number(v.quantidade || 0), 0);
}

function valorTotal(){
  return vinhos.reduce((s,v)=>s + (Number(v.quantidade || 0) * Number(v.valor || 0)), 0);
}

function fotoHTML(v){
  if(v.foto){
    return `<img class="foto-mini" src="${v.foto}">`;
  }
  if(v.imagem){
    return `<img class="foto-mini" src="${v.imagem}">`;
  }
  return `<div class="foto-placeholder">🍷</div>`;
}

function normalizarNome(nome){
  let n = String(nome || "").toLowerCase().trim();

  if(n.includes("almanegra") || n.includes("alma negra")) return "Alma Negra Blend";
  if(n.includes("dv catena") || n.includes("d.v. catena")) return "D.V. Catena Cabernet/Malbec";
  if(n.includes("luigi bosca")) return "Luigi Bosca Insignia Malbec";
  if(n.includes("susana balbo")) return "Susana Balbo Signature";
  if(n.includes("latitude 33")) return "Latitude 33";
  if(n.includes("catena alta")) return "Catena Alta Malbec";
  if(n.includes("zuccardi")) return "Zuccardi Q Malbec";

  return nome;
}

function carregarFoto(event){
  let file = event.target.files[0];
  if(!file) return;

  let reader = new FileReader();

  reader.onload = function(e){
    document.getElementById("fotoBase64").value = e.target.result;
    let preview = document.getElementById("fotoPreview");
    preview.src = e.target.result;
    preview.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
    function atualizarDashboard(){

  document.getElementById("totalGarrafas").innerText = totalGarrafas();

  document.getElementById("valorTotal").innerText =
      "R$ " + valorTotal().toLocaleString("pt-BR");

  document.getElementById("favoritos").innerText =
      vinhos.filter(v=>v.favorito).length;

  document.getElementById("estoqueBaixo").innerText =
      vinhos.filter(v=>Number(v.quantidade)<=1).length;

  let paises={};

  vinhos.forEach(v=>{

      if(!paises[v.pais]) paises[v.pais]=0;

      paises[v.pais]+=Number(v.quantidade);

  });

  let html="";

  Object.keys(paises).forEach(p=>{

      html+=`<div class="badge">${p} (${paises[p]})</div> `;

  });

  document.getElementById("totalPaises").innerHTML=html;

  let sugestao=[...vinhos]
      .filter(v=>Number(v.quantidade)>0)
      .sort((a,b)=>b.nota-a.nota)[0];

  if(sugestao){

      document.getElementById("sugestaoHoje").innerHTML=`

      ${fotoHTML(sugestao)}

      <h3>${sugestao.nome}</h3>

      <p>${sugestao.comentario}</p>

      <span class="badge">Abrir hoje</span>

      <div class="clear"></div>

      `;

  }

}

function atualizarIA(){

document.getElementById("textoIA").innerHTML=

"Seu perfil mostra preferência por vinhos elegantes, aromáticos e equilibrados. " +

"Priorize Alma Negra, Luigi Bosca, Catena Alta e D.V. Catena. " +

"Evite deixar o estoque destes rótulos abaixo de 2 garrafas.";

}

function abrirTela(id){

document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));

document.getElementById(id).classList.remove("hidden");

atualizarTudo();

}

function atualizarTudo(){

atualizarDashboard();

renderVinhos();

renderRanking();

atualizarIA();

}
    
    
}
function buscarNoCatalogo(){
  let nomeDigitado = normalizarNome(document.getElementById("nome").value).toLowerCase();

  if(!nomeDigitado){
    alert("Digite o nome do vinho para buscar no catálogo.");
    return;
  }

  let item = catalogo.find(c =>
    c.nome.toLowerCase().includes(nomeDigitado) ||
    nomeDigitado.includes(c.nome.toLowerCase())
  );

  if(!item){
    alert("Vinho ainda não encontrado no Catálogo Delucca.");
    return;
  }

  document.getElementById("nome").value = item.nome;
  document.getElementById("safra").value = item.safra || "";
  document.getElementById("pais").value = item.pais || "";
  document.getElementById("uva").value = item.uva || "";
  document.getElementById("janela").value = item.janela || "";
  document.getElementById("harmonizacao").value = item.harmonizacao || "";
  document.getElementById("comentario").value = item.comentario || "";
  document.getElementById("nota").value = item.nota || 5;
  document.getElementById("favorito").value = "true";
  document.getElementById("recompra").value = String(item.recomprar || false);

  if(item.imagem){
    document.getElementById("fotoBase64").value = item.imagem;
    let preview = document.getElementById("fotoPreview");
    preview.src = item.imagem;
    preview.classList.remove("hidden");
  }

  alert("Informações preenchidas pelo Catálogo Delucca.");
}

function gerarRecomendacoes(){
  document.getElementById("nome").value = normalizarNome(document.getElementById("nome").value);

  let nome = document.getElementById("nome").value.toLowerCase();
  let pais = document.getElementById("pais").value.toLowerCase();
  let uva = document.getElementById("uva").value.toLowerCase();

  let janela = "2025 a 2028";
  let harmonizacao = "Carnes, massas e queijos";
  let comentario = "Boa opção para manter na adega.";
  let nota = "4";
  let favorito = "false";
  let recompra = "false";

  if(uva.includes("malbec")){
    janela = "2026 a 2030";
    harmonizacao = "Churrasco, carnes vermelhas, massas com molho e queijos curados";
    comentario = "Perfil frutado e encorpado, bom para carnes.";
  }

  if(uva.includes("cabernet")){
    janela = "2027 a 2033";
    harmonizacao = "Carnes intensas, cordeiro e queijos fortes";
    comentario = "Boa estrutura e potencial de guarda.";
  }

  if(uva.includes("blend")){
    janela = "Agora até 2029";
    harmonizacao = "Jantares variados, massas, carnes e queijos";
    comentario = "Blend versátil, equilibrado e fácil de agradar.";
  }

  if(pais.includes("portugal")){
    janela = "2025 a 2030";
    harmonizacao = "Bacalhau, carnes assadas e pratos mediterrâneos";
    comentario = "Boa opção portuguesa para diversificar.";
  }

  if(nome.includes("catena") || nome.includes("luigi") || nome.includes("alma negra") || nome.includes("susana")){
    nota = "5";
    favorito = "true";
    recompra = "true";
    comentario = "Rótulo alinhado ao perfil Delucca: elegante, aromático e com alta chance de recompra.";
  }

  document.getElementById("janela").value = janela;
  document.getElementById("harmonizacao").value = harmonizacao;
  document.getElementById("comentario").value = comentario;
  document.getElementById("nota").value = nota;
  document.getElementById("favorito").value = favorito;
  document.getElementById("recompra").value = recompra;

  alert("Recomendações geradas.");
}

function setFiltro(f){
  filtroAtual = f;

  ["fTodos","fFavoritos","fBaixo"].forEach(id=>{
    document.getElementById(id).classList.remove("ativo");
  });

  if(f === "todos") document.getElementById("fTodos").classList.add("ativo");
  if(f === "favoritos") document.getElementById("fFavoritos").classList.add("ativo");
  if(f === "baixo") document.getElementById("fBaixo").classList.add("ativo");

  renderVinhos();
    function renderVinhos(){
  let busca = (document.getElementById("busca")?.value || "").toLowerCase();
  let lista = document.getElementById("listaVinhos");
  lista.innerHTML = "";

  vinhos
  .filter(v=>{
    let okBusca =
      (v.nome || "").toLowerCase().includes(busca) ||
      (v.pais || "").toLowerCase().includes(busca) ||
      (v.uva || "").toLowerCase().includes(busca);

    let okFiltro =
      filtroAtual === "todos" ||
      (filtroAtual === "favoritos" && v.favorito) ||
      (filtroAtual === "baixo" && Number(v.quantidade) <= 1);

    return okBusca && okFiltro;
  })
  .forEach((v,i)=>{
    lista.innerHTML += `
      <div class="wine">
        ${fotoHTML(v)}
        <h3>${v.nome}</h3>
        <p>Safra ${v.safra || ""} · ${v.pais || ""} · ${v.uva || ""}</p>
        <p>Qtd: ${v.quantidade} · R$ ${v.valor} · <span class="stars">${estrelas(v.nota)}</span></p>
        ${Number(v.quantidade)<=1 ? '<div class="alerta">⚠️ Estoque baixo</div>' : ''}
        <p>${v.comentario || ""}</p>
        <span class="badge">${v.favorito ? "Não pode faltar" : "Adega"}</span>
        ${v.recompra ? '<span class="badge">Recomprar</span>' : ''}
        <br><br>
        <button onclick="abrirDetalhe(${i})">Ver ficha</button>
        <button onclick="darBaixa(${i})">Dar baixa</button>
        <button onclick="editarVinho(${i})">Editar</button>
        <button onclick="excluirVinho(${i})">Excluir</button>
        <div class="clear"></div>
      </div>
    `;
  });
}

function renderRanking(){
  let lista = document.getElementById("rankingLista");
  lista.innerHTML = "";

  [...vinhos]
  .sort((a,b)=>Number(b.nota || 0) - Number(a.nota || 0))
  .forEach(v=>{
    lista.innerHTML += `
      <div class="wine">
        ${fotoHTML(v)}
        <h3>${v.nome}</h3>
        <p>${v.pais || ""} · ${v.uva || ""}</p>
        <p class="stars">${estrelas(v.nota)}</p>
        <span class="badge">${v.favorito ? "Não pode faltar" : "Avaliado"}</span>
        <div class="clear"></div>
      </div>
    `;
  });
}

function abrirDetalhe(i){
  let v = vinhos[i];

  document.getElementById("detalheVinho").innerHTML = `
    <div class="box">
      ${fotoHTML(v)}
      <h2>${v.nome}</h2>
      <p class="stars">${estrelas(v.nota)}</p>
      <p><b>Safra:</b> ${v.safra || ""}</p>
      <p><b>País:</b> ${v.pais || ""}</p>
      <p><b>Uva:</b> ${v.uva || ""}</p>
      <p><b>Quantidade:</b> ${v.quantidade || 0}</p>
      <p><b>Valor pago:</b> R$ ${v.valor || 0}</p>
      <p><b>Janela ideal:</b> ${v.janela || "Não informada"}</p>
      <p><b>Harmonização:</b> ${v.harmonizacao || "Não informada"}</p>
      <p><b>Comentário:</b> ${v.comentario || "Sem comentário"}</p>
      <span class="badge">${v.favorito ? "Não pode faltar" : "Adega"}</span>
      ${v.recompra ? '<span class="badge">Recomprar</span>' : ''}
      <br><br>
      <button onclick="darBaixa(${i})">Dar baixa</button>
      <button onclick="editarVinho(${i})">Editar</button>
      <div class="clear"></div>
    </div>
  `;

  abrirTela("detalhe");
    function salvarFormulario(){
  let i = document.getElementById("editIndex").value;
  let nome = normalizarNome(document.getElementById("nome").value);
  let quantidade = Number(document.getElementById("quantidade").value);
  let valor = Number(document.getElementById("valor").value);

  if(!nome){ alert("Digite o nome do vinho."); return; }
  if(!quantidade || quantidade < 1){ alert("Informe a quantidade."); return; }
  if(!valor || valor < 1){ alert("Informe o valor pago por garrafa."); return; }

  let vinho = {
    nome:nome,
    safra:document.getElementById("safra").value,
    pais:document.getElementById("pais").value,
    uva:document.getElementById("uva").value,
    quantidade:quantidade,
    valor:valor,
    janela:document.getElementById("janela").value,
    harmonizacao:document.getElementById("harmonizacao").value,
    comentario:document.getElementById("comentario").value,
    nota:Number(document.getElementById("nota").value),
    favorito:document.getElementById("favorito").value === "true",
    recompra:document.getElementById("recompra").value === "true",
    foto:document.getElementById("fotoBase64").value
  };

  if(i === "") vinhos.push(vinho);
  else vinhos[Number(i)] = vinho;

  salvarDados();
  limparFormulario();
  atualizarTudo();
  abrirTela("adega");
}

function editarVinho(i){
  let v = vinhos[i];

  document.getElementById("editIndex").value = i;
  document.getElementById("tituloForm").innerText = "Editar Vinho";

  ["nome","safra","pais","uva","quantidade","valor","janela","harmonizacao","comentario","nota"].forEach(c=>{
    document.getElementById(c).value = v[c] || "";
  });

  document.getElementById("favorito").value = String(v.favorito);
  document.getElementById("recompra").value = String(v.recompra);
  document.getElementById("fotoBase64").value = v.foto || v.imagem || "";

  let preview = document.getElementById("fotoPreview");
  if(v.foto || v.imagem){
    preview.src = v.foto || v.imagem;
    preview.classList.remove("hidden");
  }else{
    preview.classList.add("hidden");
  }

  abrirTela("cadastro");
}

function limparFormulario(){
  document.getElementById("editIndex").value = "";
  document.getElementById("tituloForm").innerText = "Adicionar Vinho";

  ["nome","safra","pais","uva","quantidade","valor","janela","harmonizacao","comentario","fotoBase64"].forEach(c=>{
    document.getElementById(c).value = "";
  });

  document.getElementById("nota").value = "5";
  document.getElementById("favorito").value = "false";
  document.getElementById("recompra").value = "false";
  document.getElementById("fotoPreview").classList.add("hidden");
  document.getElementById("fotoInput").value = "";
}

function darBaixa(i){
  if(Number(vinhos[i].quantidade) > 0){
    vinhos[i].quantidade--;
  }
  salvarDados();
  atualizarTudo();
  abrirTela("adega");
}

function excluirVinho(i){
  if(confirm("Excluir este vinho?")){
    vinhos.splice(i,1);
    salvarDados();
    atualizarTudo();
    abrirTela("adega");
  }
}

function gerarBackup(){
  document.getElementById("backup").value = JSON.stringify(vinhos,null,2);
}

atualizarTudo();
    
}
    
}
