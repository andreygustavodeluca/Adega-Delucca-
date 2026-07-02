const STORAGE_KEY = "adegaDelucca";
let vinhos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let filtroAtual = "todos";

function salvarDados(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vinhos));
}

function normalizarNome(nome){
  const n = String(nome || "").toLowerCase();
  if(n.includes("almanegra") || n.includes("alma negra")) return "Alma Negra Blend";
  if(n.includes("catena alta")) return "Catena Alta Malbec";
  if(n.includes("dv catena") || n.includes("d.v. catena")) return "D.V. Catena Cabernet/Malbec";
  if(n.includes("luigi bosca")) return "Luigi Bosca De Sangre Malbec";
  if(n.includes("susana balbo")) return "Susana Balbo Signature Malbec";
  if(n.includes("latitude")) return "Latitude 33 Malbec";
  if(n.includes("zuccardi")) return "Zuccardi Q Malbec";
  return nome;
}

function encontrarCatalogo(nome){
  if(typeof catalogo === "undefined") return null;
  const n = normalizarNome(nome).toLowerCase();
  return catalogo.find(c =>
    c.nome.toLowerCase().includes(n) || n.includes(c.nome.toLowerCase())
  );
}

function totalGarrafas(){
  return vinhos.reduce((t,v)=>t+Number(v.quantidade||0),0);
}

function valorTotal(){
  return vinhos.reduce((t,v)=>t+(Number(v.valor||0)*Number(v.quantidade||0)),0);
}

function estrelas(n){
  return "⭐".repeat(Number(n||0));
}

function fotoHTML(v){
  const img = v.foto || v.imagem || "";
  if(img) return `<img class="foto-mini" src="${img}">`;
  return `<div class="foto-placeholder">🍷</div>`;
}

function atualizarDashboard(){

  document.getElementById("totalGarrafas").innerText = totalGarrafas();

  document.getElementById("valorTotal").innerText =
    "R$ " + valorTotal().toLocaleString("pt-BR");

  document.getElementById("favoritos").innerText =
    vinhos.filter(v => v.favorito).length;

  document.getElementById("estoqueBaixo").innerText =
    vinhos.filter(v => Number(v.quantidade) <= 1).length;

  // Países únicos
  const paises = {};

  // Uvas únicas
  const uvas = {};

  vinhos.forEach(v => {

    const pais = v.pais || "Não informado";
    paises[pais] = (paises[pais] || 0) + Number(v.quantidade || 0);

    const uva = v.uva || "Não informada";
    uvas[uva] = true;

  });

  const totalPaises = Object.keys(paises).length;
  const totalUvas = Object.keys(uvas).length;

  const elPaisesNumero = document.getElementById("totalPaisesNumero");
  if(elPaisesNumero)
    elPaisesNumero.innerText = totalPaises;

  const elUvasNumero = document.getElementById("totalUvasNumero");
  if(elUvasNumero)
    elUvasNumero.innerText = totalUvas;

  const elPaises = document.getElementById("totalPaises");

  if(elPaises){

    elPaises.innerHTML = Object.entries(paises)
      .map(([pais,qtd]) =>
        `<span class="badge">${pais}: ${qtd} garrafas</span>`
      )
      .join(" ");

  }

  // Valor médio por garrafa
  const media =
    totalGarrafas() > 0
      ? valorTotal() / totalGarrafas()
      : 0;

  const alertas = document.getElementById("alertasHoje");

  if(alertas){

    alertas.innerHTML = `
      <p>🌎 Países representados: <b>${totalPaises}</b></p>
      <p>🍇 Uvas diferentes: <b>${totalUvas}</b></p>
      <p>💵 Valor médio por garrafa:
      <b>R$ ${media.toFixed(2)}</b></p>
    `;

  }

  atualizarSugestao();

}


  const totalPaises = Object.keys(paises).length;

  document.getElementById("totalPaises").innerHTML = `
    <p><b>Países representados:</b> ${totalPaises}</p>
    ${Object.entries(paises).map(([pais,qtd])=>`<span class="badge">${pais}: ${qtd} garrafas</span>`).join(" ")}
  `;

  atualizarSugestao();
}
function atualizarSugestao(){

  const div = document.getElementById("sugestaoHoje");

  if(!div) return;

  if(vinhos.length===0){

    div.innerHTML = `
      <div class="wine">
        <h3>Sua adega está vazia</h3>
        <p>Cadastre sua primeira garrafa.</p>
      </div>
    `;

    return;

  }

  const melhor = [...vinhos]
    .filter(v=>Number(v.quantidade)>0)
    .sort((a,b)=>Number(b.nota||0)-Number(a.nota||0))[0];

  if(!melhor) return;

  div.innerHTML = `
    <div class="wine">

      ${fotoHTML(melhor)}

      <h3>${melhor.nome}</h3>

      <p><b>Safra:</b> ${melhor.safra || "-"}</p>

      <p>🌎 ${melhor.pais || "-"}</p>

      <p>🍇 ${melhor.uva || "-"}</p>

      <p>⭐ ${estrelas(melhor.nota)}</p>

      <p>${melhor.comentario || ""}</p>

      <span class="badge">
        Janela: ${melhor.janela || melhor.janelaBase || "-"}
      </span>

      <span class="badge">
        ${melhor.harmonizacao || "Sem harmonização cadastrada"}
      </span>

      <div class="clear"></div>

    </div>
  `;

}


function buscarNoCatalogo(){
  const nome = document.getElementById("nome").value;
  const item = encontrarCatalogo(nome);

  if(!item){
    alert("Vinho não encontrado no Catálogo Delucca.");
    return;
  }

  document.getElementById("nome").value = item.nome;
  document.getElementById("pais").value = item.pais;
  document.getElementById("uva").value = item.uva;
  document.getElementById("janela").value = item.janelaBase || "";
  document.getElementById("harmonizacao").value = item.harmonizacao || "";
  document.getElementById("comentario").value = item.comentario || "";
  document.getElementById("nota").value = item.nota || 5;
  document.getElementById("favorito").value = item.naoPodeFaltar ? "true" : "false";
  document.getElementById("recompra").value = item.recompra ? "true" : "false";
  document.getElementById("fotoBase64").value = item.imagem || "";

  alert("Ficha técnica carregada. Agora informe safra, quantidade e valor pago.");
}

function gerarRecomendacoes(){
  const item = encontrarCatalogo(document.getElementById("nome").value);

  if(item){
    buscarNoCatalogo();
    return;
  }

  alert("Use o Catálogo Delucca ou preencha manualmente.");
}

function renderVinhos(){
  const lista = document.getElementById("listaVinhos");
  if(!lista) return;

  const busca = (document.getElementById("busca")?.value || "").toLowerCase();
  lista.innerHTML = "";

  vinhos
    .filter(v=>{
      const texto = `${v.nome} ${v.pais} ${v.uva} ${v.safra}`.toLowerCase();
      const filtro =
        filtroAtual === "todos" ||
        (filtroAtual === "favoritos" && v.favorito) ||
        (filtroAtual === "baixo" && Number(v.quantidade)<=1);
      return texto.includes(busca) && filtro;
    })
    .forEach((v,i)=>{
      lista.innerHTML += `
        <div class="wine">
          ${fotoHTML(v)}
          <h3>${v.nome}</h3>
          <p>Safra ${v.safra || "-"} • ${v.pais || "-"} • ${v.uva || "-"}</p>
          <p>Quantidade: ${v.quantidade || 0}</p>
          <p>Valor: R$ ${v.valor || 0}</p>
          ${Number(v.quantidade)<=1 ? "<div class='alerta'>⚠️ Estoque baixo</div>" : ""}
          <span class="badge">${v.recompra ? "Recomprar" : "Adega"}</span>
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

  detalhe.innerHTML = `
    <div class="wine">
      ${fotoHTML(v)}
      <h2>${v.nome}</h2>
      <p><b>Safra da garrafa:</b> ${v.safra || "-"}</p>
      <p><b>País:</b> ${v.pais || "-"}</p>
      <p><b>Região:</b> ${v.regiao || "-"}</p>
      <p><b>Uva:</b> ${v.uva || "-"}</p>
      <p><b>Temperatura:</b> ${v.temperatura || "-"}</p>
      <p><b>Decantação:</b> ${v.decantacao || "-"}</p>
      <p><b>Janela base:</b> ${v.janela || v.janelaBase || "-"}</p>
      <p><b>Harmonização:</b> ${v.harmonizacao || "-"}</p>
      <p><b>Quantidade:</b> ${v.quantidade || 0}</p>
      <p><b>Valor pago:</b> R$ ${v.valor || 0}</p>
      <p><b>Nota Delucca:</b> ${estrelas(v.nota)}</p>
      <p>${v.comentario || ""}</p>
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
    .sort((a,b)=>Number(b.nota||0)-Number(a.nota||0))
    .forEach(v=>{
      lista.innerHTML += `
        <div class="wine">
          ${fotoHTML(v)}
          <h3>${v.nome}</h3>
          <p>${v.pais || ""} • ${v.uva || ""}</p>
          <p>${estrelas(v.nota)}</p>
          <span class="badge">${v.recompra ? "Recomprar" : "Avaliado"}</span>
          <div class="clear"></div>
        </div>
      `;
    });
}

function salvarFormulario(){
  const nome = normalizarNome(document.getElementById("nome").value);
  const item = encontrarCatalogo(nome);

  const vinho = {
    catalogoId: item?.id || "",
    nome: item?.nome || nome,
    produtor: item?.produtor || "",
    pais: item?.pais || document.getElementById("pais").value,
    regiao: item?.regiao || "",
    uva: item?.uva || document.getElementById("uva").value,
    temperatura: item?.temperatura || "",
    decantacao: item?.decantacao || "",
    janela: item?.janelaBase || document.getElementById("janela").value,
    harmonizacao: item?.harmonizacao || document.getElementById("harmonizacao").value,
    comentario: item?.comentario || document.getElementById("comentario").value,
    nota: item?.nota || Number(document.getElementById("nota").value),
    favorito: item?.naoPodeFaltar || document.getElementById("favorito").value === "true",
    recompra: item?.recompra || document.getElementById("recompra").value === "true",
    imagem: item?.imagem || "",
    foto: document.getElementById("fotoBase64").value || "",
    safra: document.getElementById("safra").value,
    quantidade: Number(document.getElementById("quantidade").value),
    valor: Number(document.getElementById("valor").value)
  };

  if(!vinho.nome){ alert("Digite o nome do vinho."); return; }
  if(!vinho.safra){ alert("Informe a safra da garrafa."); return; }
  if(!vinho.quantidade || vinho.quantidade<1){ alert("Informe a quantidade."); return; }
  if(!vinho.valor || vinho.valor<1){ alert("Informe o valor pago."); return; }

  vinhos.push(vinho);
  salvarDados();
  limparFormulario();
  atualizarTudo();
  abrirTela("adega");
}

function limparFormulario(){
  ["nome","safra","pais","uva","quantidade","valor","janela","harmonizacao","comentario","fotoBase64"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = "";
  });
  document.getElementById("nota").value = "5";
  document.getElementById("favorito").value = "false";
  document.getElementById("recompra").value = "false";
}

function editarVinho(i){
  const v = vinhos[i];

  document.getElementById("nome").value = v.nome || "";
  document.getElementById("safra").value = v.safra || "";
  document.getElementById("pais").value = v.pais || "";
  document.getElementById("uva").value = v.uva || "";
  document.getElementById("quantidade").value = v.quantidade || "";
  document.getElementById("valor").value = v.valor || "";
  document.getElementById("janela").value = v.janela || "";
  document.getElementById("harmonizacao").value = v.harmonizacao || "";
  document.getElementById("comentario").value = v.comentario || "";
  document.getElementById("nota").value = v.nota || "5";
  document.getElementById("favorito").value = String(v.favorito);
  document.getElementById("recompra").value = String(v.recompra);

  excluirSemConfirmar(i);
  abrirTela("cadastro");
}

function darBaixa(i){
  if(Number(vinhos[i].quantidade)>0){
    vinhos[i].quantidade--;
  }
  salvarDados();
  atualizarTudo();
}

function excluirSemConfirmar(i){
  vinhos.splice(i,1);
  salvarDados();
  atualizarTudo();
}

function excluirVinho(i){
  if(confirm("Excluir este vinho?")){
    excluirSemConfirmar(i);
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
  texto.innerText = "A safra pertence à garrafa. A ficha técnica pertence ao Catálogo Mestre. Esse é o novo padrão da Adega Delucca.";
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
