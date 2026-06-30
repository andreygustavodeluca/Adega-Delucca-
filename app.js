// ADEGA DELUCCA V13.1

const STORAGE_KEY = "adegaDelucca";

let vinhos =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
  JSON.parse(localStorage.getItem("vinhosAdega")) ||
  [];

let filtroAtual = "todos";

function salvarDados(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vinhos));
}

function totalGarrafas(){
  return vinhos.reduce((t,v)=>t+Number(v.quantidade||0),0);
}

function valorTotal(){
  return vinhos.reduce((t,v)=>t+(Number(v.valor||0)*Number(v.quantidade||0)),0);
}

function estoqueBaixo(){
  return vinhos.filter(v=>Number(v.quantidade||0)<=1).length;
}

function favoritos(){
  return vinhos.filter(v=>v.favorito).length;
}

function estrelas(n){
  return "⭐".repeat(Number(n||0));
}

function imagemVinho(v){
  return v.foto || v.imagem || "";
}

function fotoHTML(v){
  const img = imagemVinho(v);
  if(img) return `<img class="foto-mini" src="${img}" onerror="this.style.display='none'">`;
  return `<div class="foto-placeholder">🍷</div>`;
}

function normalizarNome(nome){
  const n = String(nome||"").toLowerCase();
  if(n.includes("almanegra") || n.includes("alma negra")) return "Alma Negra Blend";
  if(n.includes("pinto finale")) return "Pinto Finale";
  if(n.includes("catena alta")) return "Catena Alta Malbec";
  if(n.includes("dv catena") || n.includes("d.v. catena")) return "D.V. Catena Cabernet/Malbec";
  if(n.includes("luigi bosca")) return "Luigi Bosca Insignia Malbec";
  if(n.includes("susana balbo")) return "Susana Balbo Signature";
  if(n.includes("latitude")) return "Latitude 33";
  if(n.includes("zuccardi")) return "Zuccardi Q Malbec";
  return nome;
}

function atualizarDashboard(){
  const g = document.getElementById("totalGarrafas");
  if(g) g.innerText = totalGarrafas();

  const v = document.getElementById("valorTotal");
  if(v) v.innerText = "R$ " + valorTotal().toLocaleString("pt-BR");

  const f = document.getElementById("favoritos");
  if(f) f.innerText = favoritos();

  const e = document.getElementById("estoqueBaixo");
  if(e) e.innerText = estoqueBaixo();

  const totalPaises = document.getElementById("totalPaises");
  if(totalPaises){
    let paises = {};
    vinhos.forEach(v=>{
      let pais = v.pais || "Não informado";
      paises[pais] = (paises[pais] || 0) + Number(v.quantidade||0);
    });

    totalPaises.innerHTML = Object.entries(paises)
      .map(([pais,qtd])=>`<span class="badge">${pais}: ${qtd}</span>`)
      .join(" ");
  }

  atualizarSugestao();
}

function atualizarSugestao(){
  const div = document.getElementById("sugestaoHoje");
  if(!div) return;

  if(vinhos.length===0){
    div.innerHTML = `<div class="wine"><h3>Sua adega está vazia</h3><p>Cadastre seu primeiro vinho.</p></div>`;
    return;
  }

  const melhor = [...vinhos]
    .filter(v=>Number(v.quantidade||0)>0)
    .sort((a,b)=>(Number(b.nota||0)-Number(a.nota||0)))[0];

  if(!melhor){
    div.innerHTML = `<div class="wine"><h3>Nenhum vinho em estoque</h3></div>`;
    return;
  }

  div.innerHTML = `
    <div class="wine">
      ${fotoHTML(melhor)}
      <h3>${melhor.nome}</h3>
      <p>${melhor.comentario || ""}</p>
      <span class="badge">Janela: ${melhor.janela || "-"}</span>
      <div class="clear"></div>
    </div>
  `;
}

function buscarNoCatalogo(){
  const nomeCampo = document.getElementById("nome");
  const nomeDigitado = normalizarNome(nomeCampo.value).toLowerCase();

  if(!nomeDigitado){
    alert("Digite o nome do vinho.");
    return;
  }

  if(typeof catalogo === "undefined"){
    alert("Catálogo ainda não carregado.");
    return;
  }

  const item = catalogo.find(v =>
    v.nome.toLowerCase().includes(nomeDigitado) ||
    nomeDigitado.includes(v.nome.toLowerCase())
  );

  if(!item){
    alert("Vinho não encontrado no Catálogo Delucca.");
    return;
  }

  document.getElementById("nome").value = item.nome || "";
  document.getElementById("safra").value = item.safra || "";
  document.getElementById("pais").value = item.pais || "";
  document.getElementById("uva").value = item.uva || "";
  document.getElementById("janela").value = item.janela || "";
  document.getElementById("harmonizacao").value = item.harmonizacao || "";
  document.getElementById("comentario").value = item.comentario || "";
  document.getElementById("nota").value = item.nota || item.notaDelucca || 5;
  document.getElementById("favorito").value = item.naoPodeFaltar ? "true" : "false";
  document.getElementById("recompra").value = item.recompra ? "true" : "false";

  if(item.imagem || item.foto){
    document.getElementById("fotoBase64").value = item.imagem || item.foto;
  }

  alert("Informações carregadas do Catálogo Delucca.");
}

function gerarRecomendacoes(){
  document.getElementById("nome").value = normalizarNome(document.getElementById("nome").value);

  const nome = document.getElementById("nome").value.toLowerCase();
  const uva = document.getElementById("uva").value.toLowerCase();
  const pais = document.getElementById("pais").value.toLowerCase();

  let janela = "2025 a 2028";
  let harmonizacao = "Carnes, massas e queijos";
  let comentario = "Boa opção para manter na adega.";
  let nota = 4;
  let favorito = false;
  let recompra = false;

  if(uva.includes("malbec")){
    janela = "2026 a 2030";
    harmonizacao = "Churrasco, carnes vermelhas e massas";
    comentario = "Perfil ideal para carnes e noites frias.";
  }

  if(uva.includes("blend") || uva.includes("mistura")){
    janela = "Agora até 2029";
    harmonizacao = "Massas, carnes, queijos e jantar normal";
    comentario = "Blend versátil, equilibrado e fácil de agradar.";
  }

  if(pais.includes("portugal")){
    janela = "2025 a 2030";
    harmonizacao = "Bacalhau, carnes assadas e queijos";
    comentario = "Boa opção portuguesa para diversificar a adega.";
  }

  if(nome.includes("catena") || nome.includes("luigi") || nome.includes("alma negra") || nome.includes("susana")){
    nota = 5;
    favorito = true;
    recompra = true;
    comentario = "Rótulo alinhado ao perfil Delucca: elegante, aromático e com alta chance de recompra.";
  }

  document.getElementById("janela").value = janela;
  document.getElementById("harmonizacao").value = harmonizacao;
  document.getElementById("comentario").value = comentario;
  document.getElementById("nota").value = nota;
  document.getElementById("favorito").value = String(favorito);
  document.getElementById("recompra").value = String(recompra);

  alert("Recomendações geradas.");
}

function renderVinhos(){
  const lista = document.getElementById("listaVinhos");
  if(!lista) return;

  const busca = (document.getElementById("busca")?.value || "").toLowerCase();
  lista.innerHTML = "";

  vinhos
    .filter(v=>{
      const texto = `${v.nome} ${v.pais} ${v.uva}`.toLowerCase();
      const okFiltro =
        filtroAtual==="todos" ||
        (filtroAtual==="favoritos" && v.favorito) ||
        (filtroAtual==="baixo" && Number(v.quantidade)<=1);
      return texto.includes(busca) && okFiltro;
    })
    .forEach((v,i)=>{
      lista.innerHTML += `
        <div class="wine">
          ${fotoHTML(v)}
          <h3>${v.nome}</h3>
          <p>Safra ${v.safra || "-"} · ${v.pais || "-"} · ${v.uva || "-"}</p>
          <p>Quantidade: ${v.quantidade || 0} · Valor: R$ ${v.valor || 0}</p>
          <p>${v.comentario || ""}</p>
          ${Number(v.quantidade)<=1 ? "<div class='alerta'>⚠️ Estoque baixo</div>" : ""}
          <span class="badge">${v.favorito ? "Não pode faltar" : "Adega"}</span>
          ${v.recompra ? "<span class='badge'>Recomprar</span>" : ""}
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

function abrirDetalhe(i){
  const v = vinhos[i];
  const detalhe = document.getElementById("detalheVinho");
  if(!detalhe) return;

  detalhe.innerHTML = `
    <div class="wine">
      ${fotoHTML(v)}
      <h2>${v.nome}</h2>
      <p><b>Nota Delucca:</b> ${estrelas(v.nota)}</p>
      <p><b>Safra:</b> ${v.safra || "-"}</p>
      <p><b>País:</b> ${v.pais || "-"}</p>
      <p><b>Região:</b> ${v.regiao || "Não informada"}</p>
      <p><b>Uva:</b> ${v.uva || "-"}</p>
      <p><b>Quantidade:</b> ${v.quantidade || 0}</p>
      <p><b>Valor pago:</b> R$ ${v.valor || 0}</p>
      <p><b>Janela ideal:</b> ${v.janela || "Não informada"}</p>
      <p><b>Temperatura:</b> ${v.temperatura || "16–18°C"}</p>
      <p><b>Decantação:</b> ${v.decantacao || "20 a 30 minutos"}</p>
      <p><b>Harmonização:</b> ${v.harmonizacao || "Não informada"}</p>
      <p><b>Comentário:</b> ${v.comentario || "Sem comentário"}</p>
      <span class="badge">${v.recompra ? "Recomprar" : "Adega"}</span>
      <br><br>
      <button onclick="abrirTela('adega')">Voltar</button>
    </div>
  `;

  abrirTela("detalhe");
}

function renderRanking(){
  const lista = document.getElementById("rankingLista");
  if(!lista) return;

  lista.innerHTML = "";

  [...vinhos]
    .sort((a,b)=>(Number(b.nota||0)-Number(a.nota||0)))
    .forEach(v=>{
      lista.innerHTML += `
        <div class="wine">
          ${fotoHTML(v)}
          <h3>${v.nome}</h3>
          <p>${v.pais || ""} · ${v.uva || ""}</p>
          <p>${estrelas(v.nota)}</p>
          <span class="badge">${v.recompra ? "Recomprar" : "Adega"}</span>
          <div class="clear"></div>
        </div>
      `;
    });
}

function salvarFormulario(){
  const i = document.getElementById("editIndex")?.value || "";

  const vinho = {
    nome: normalizarNome(document.getElementById("nome").value),
    safra: document.getElementById("safra").value,
    pais: document.getElementById("pais").value,
    uva: document.getElementById("uva").value,
    quantidade: Number(document.getElementById("quantidade").value),
    valor: Number(document.getElementById("valor").value),
    janela: document.getElementById("janela").value,
    harmonizacao: document.getElementById("harmonizacao").value,
    comentario: document.getElementById("comentario").value,
    nota: Number(document.getElementById("nota").value),
    favorito: document.getElementById("favorito").value === "true",
    recompra: document.getElementById("recompra").value === "true",
    foto: document.getElementById("fotoBase64")?.value || ""
  };

  if(!vinho.nome){ alert("Digite o nome do vinho."); return; }
  if(!vinho.quantidade || vinho.quantidade<1){ alert("Informe a quantidade."); return; }
  if(!vinho.valor || vinho.valor<1){ alert("Informe o valor pago por garrafa."); return; }

  if(i === "") vinhos.push(vinho);
  else vinhos[Number(i)] = vinho;

  salvarDados();
  limparFormulario();
  atualizarTudo();
  abrirTela("adega");
}

function editarVinho(i){
  const v = vinhos[i];

  document.getElementById("editIndex").value = i;
  document.getElementById("nome").value = v.nome || "";
  document.getElementById("safra").value = v.safra || "";
  document.getElementById("pais").value = v.pais || "";
  document.getElementById("uva").value = v.uva || "";
  document.getElementById("quantidade").value = v.quantidade || "";
  document.getElementById("valor").value = v.valor || "";
  document.getElementById("janela").value = v.janela || "";
  document.getElementById("harmonizacao").value = v.harmonizacao || "";
  document.getElementById("comentario").value = v.comentario || "";
  document.getElementById("nota").value = v.nota || 5;
  document.getElementById("favorito").value = String(v.favorito);
  document.getElementById("recompra").value = String(v.recompra);
  document.getElementById("fotoBase64").value = v.foto || "";

  abrirTela("cadastro");
}

function limparFormulario(){
  ["editIndex","nome","safra","pais","uva","quantidade","valor","janela","harmonizacao","comentario","fotoBase64"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = "";
  });

  if(document.getElementById("nota")) document.getElementById("nota").value = "5";
  if(document.getElementById("favorito")) document.getElementById("favorito").value = "false";
  if(document.getElementById("recompra")) document.getElementById("recompra").value = "false";
}

function darBaixa(i){
  if(vinhos[i].quantidade > 0) vinhos[i].quantidade--;
  salvarDados();
  atualizarTudo();
}

function excluirVinho(i){
  if(confirm("Excluir este vinho?")){
    vinhos.splice(i,1);
    salvarDados();
    atualizarTudo();
  }
}

function setFiltro(f){
  filtroAtual = f;
  renderVinhos();
}

function gerarBackup(){
  const backup = document.getElementById("backup");
  if(backup) backup.value = JSON.stringify(vinhos,null,2);
}

function atualizarIA(){
  const texto = document.getElementById("textoIA");
  if(!texto) return;

  texto.innerText =
    "Seu perfil favorece vinhos elegantes, aromáticos e equilibrados. Priorize Alma Negra, Catena, Luigi Bosca e Susana Balbo. Mantenha ao menos 2 garrafas dos rótulos favoritos.";
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

atualizarTudo();
