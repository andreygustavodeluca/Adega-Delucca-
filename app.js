const STORAGE_KEY="adegaDelucca";
let vinhos=JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
let filtroAtual="todos";

function salvarDados(){localStorage.setItem(STORAGE_KEY,JSON.stringify(vinhos))}
function dinheiro(v){return "R$ "+Number(v||0).toLocaleString("pt-BR")}
function estrelas(n){return "⭐".repeat(Number(n||0))}
function normalizarNome(n){
 n=String(n||"").toLowerCase();
 if(n.includes("alma"))return"Alma Negra Blend";
 if(n.includes("catena alta"))return"Catena Alta Malbec";
 if(n.includes("dv catena")||n.includes("d.v"))return"D.V. Catena Cabernet/Malbec";
 if(n.includes("luigi"))return"Luigi Bosca De Sangre Malbec";
 if(n.includes("susana"))return"Susana Balbo Signature Malbec";
 if(n.includes("latitude"))return"Latitude 33 Malbec";
 if(n.includes("zuccardi"))return"Zuccardi Q Malbec";
 return n;
}
function abrirScanner(){

    const box=document.getElementById("scannerBox");

    box.classList.remove("hidden");

    document.getElementById("scannerStatus").innerHTML=
    "⏳ Preparando câmera...";

    setTimeout(()=>{

        document.getElementById("scannerStatus").innerHTML=
        "📸 Tire uma foto da garrafa.";

        document.getElementById("fotoArquivo").click();

    },700);

}
function encontrarCatalogo(nome){
 if(typeof catalogo==="undefined")return null;
 const n=normalizarNome(nome);
 return catalogo.find(c=>c.nome.toLowerCase().includes(n)||n.includes(c.nome.toLowerCase()));
}
function totalGarrafas(){return vinhos.reduce((s,v)=>s+Number(v.quantidade||0),0)}
function valorTotal(){return vinhos.reduce((s,v)=>s+Number(v.valor||0)*Number(v.quantidade||0),0)}
function fotoHTML(v){
 const img=v.foto||v.imagem||"";
 return img?`<img class="foto-mini" src="${img}">`:`<div class="foto-placeholder">🍷</div>`;
}

function abrirTela(id){
 document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
 const tela=document.getElementById(id);
 if(tela)tela.classList.remove("hidden");
 atualizarTudo();
}

function atualizarDashboard(){
 const paises={},uvas={};
 vinhos.forEach(v=>{
  paises[v.pais||"Não informado"]=(paises[v.pais||"Não informado"]||0)+Number(v.quantidade||0);
  uvas[v.uva||"Não informada"]=true;
 });
 document.getElementById("totalGarrafas").innerText=totalGarrafas();
 document.getElementById("valorTotal").innerText=dinheiro(valorTotal());
 document.getElementById("totalPaisesNumero").innerText=Object.keys(paises).length;
 document.getElementById("totalUvasNumero").innerText=Object.keys(uvas).length;
 document.getElementById("totalPaises").innerHTML=Object.entries(paises).map(([p,q])=>`<span class="badge">${p}: ${q} garrafas</span>`).join(" ");
 const media=totalGarrafas()?valorTotal()/totalGarrafas():0;
 document.getElementById("alertasHoje").innerHTML=`
 <p>💵 Valor médio por garrafa: <b>${dinheiro(media)}</b></p>
 <p>⚠️ Estoque baixo: <b>${vinhos.filter(v=>Number(v.quantidade)<=1).length}</b></p>`;
 atualizarSugestao();
}

function atualizarSugestao(){
 const div=document.getElementById("sugestaoHoje");
 if(!div)return;
 const melhor=[...vinhos].filter(v=>Number(v.quantidade)>0).sort((a,b)=>Number(b.nota||0)-Number(a.nota||0))[0];
 if(!melhor){div.innerHTML=`<div class="wine"><h3>Sua adega está vazia</h3><p>Cadastre sua primeira garrafa.</p></div>`;return}
 div.innerHTML=`<div class="wine">${fotoHTML(melhor)}
 <h3>${melhor.nome}</h3>
 <p><b>Safra:</b> ${melhor.safra||"-"}</p>
 <p>🌎 ${melhor.pais||"-"} · 🍇 ${melhor.uva||"-"}</p>
 <p>${estrelas(melhor.nota)}</p>
 <p>${melhor.comentario||""}</p>
 <span class="badge">${melhor.janela||melhor.janelaBase||"-"}</span>
 <div class="clear"></div></div>`;
}

function buscarNoCatalogo(){
 const termo=document.getElementById("nome").value.trim().toLowerCase();
 if(!termo){alert("Digite o nome do vinho.");return}
 const resultados=catalogo.filter(c=>c.nome.toLowerCase().includes(termo)||termo.includes(c.nome.toLowerCase()));
 if(!resultados.length){alert("Vinho não encontrado no Catálogo Delucca.");return}
 const item=resultados[0];
 document.getElementById("nome").value=item.nome||"";
 document.getElementById("pais").value=item.pais||"";
 document.getElementById("uva").value=item.uva||"";
 document.getElementById("janela").value=item.janelaBase||"";
 document.getElementById("harmonizacao").value=item.harmonizacao||"";
 document.getElementById("comentario").value=item.comentario||"";
 document.getElementById("nota").value=item.nota||5;
 document.getElementById("favorito").value=item.naoPodeFaltar?"true":"false";
 document.getElementById("recompra").value=item.recompra?"true":"false";
 document.getElementById("fotoBase64").value=item.imagem||"";
 alert("Ficha carregada. Informe safra, quantidade e valor.");
}

function carregarFoto(event){
 const arq=event.target.files[0]; if(!arq)return;
 const reader=new FileReader();
 reader.onload=e=>{
  document.getElementById("fotoBase64").value=e.target.result;
  const p=document.getElementById("previewFoto");
  p.src=e.target.result;p.style.display="block";
 };
 reader.readAsDataURL(arq);
}

function salvarFormulario(){
 const nome=document.getElementById("nome").value;
 const item=encontrarCatalogo(nome);
 const vinho={
  catalogoId:item?.id||"",
  nome:item?.nome||nome,
  produtor:item?.produtor||"",
  pais:item?.pais||document.getElementById("pais").value,
  regiao:item?.regiao||"",
  uva:item?.uva||document.getElementById("uva").value,
  temperatura:item?.temperatura||"",
  decantacao:item?.decantacao||"",
  janela:item?.janelaBase||document.getElementById("janela").value,
  harmonizacao:item?.harmonizacao||document.getElementById("harmonizacao").value,
  comentario:item?.comentario||document.getElementById("comentario").value,
  nota:item?.nota||Number(document.getElementById("nota").value),
  favorito:item?.naoPodeFaltar||document.getElementById("favorito").value==="true",
  recompra:item?.recompra||document.getElementById("recompra").value==="true",
  imagem:item?.imagem||"",
  foto:document.getElementById("fotoBase64").value||"",
  safra:document.getElementById("safra").value,
  quantidade:Number(document.getElementById("quantidade").value),
  valor:Number(document.getElementById("valor").value)
 };
 if(!vinho.nome){alert("Digite o nome.");return}
 if(!vinho.safra){alert("Informe a safra.");return}
 if(!vinho.quantidade){alert("Informe a quantidade.");return}
 if(!vinho.valor){alert("Informe o valor.");return}
 vinhos.push(vinho);salvarDados();limparFormulario();abrirTela("adega");
}

function limparFormulario(){
 ["nome","safra","quantidade","valor","pais","uva","janela","harmonizacao","comentario","fotoBase64"].forEach(id=>{const e=document.getElementById(id);if(e)e.value=""});
 document.getElementById("nota").value="5";
 document.getElementById("favorito").value="false";
 document.getElementById("recompra").value="false";
 const p=document.getElementById("previewFoto"); if(p){p.src="";p.style.display="none"}
}

function renderVinhos(){
 const lista=document.getElementById("listaVinhos"); if(!lista)return;
 const busca=(document.getElementById("busca")?.value||"").toLowerCase();
 lista.innerHTML="";
 vinhos.filter(v=>{
  const txt=`${v.nome} ${v.pais} ${v.uva} ${v.safra}`.toLowerCase();
  return txt.includes(busca)&&(filtroAtual==="todos"||(filtroAtual==="favoritos"&&v.favorito)||(filtroAtual==="baixo"&&Number(v.quantidade)<=1));
 }).forEach((v,i)=>{
  lista.innerHTML+=`<div class="wine">${fotoHTML(v)}
  <h3>${v.nome}</h3>
  <p><b>Safra:</b> ${v.safra||"-"}</p>
  <p>🌎 ${v.pais||"-"} · 🍇 ${v.uva||"-"}</p>
  <p>${estrelas(v.nota)}</p>
  <p>🍾 ${v.quantidade||0} garrafa(s)</p>
  <p>💰 ${dinheiro(v.valor)}</p>
  ${Number(v.quantidade)<=1?`<div class="alerta">⚠️ Estoque baixo</div>`:""}
  ${v.recompra?`<span class="badge">❤️ Recomprar</span>`:""}
  ${v.favorito?`<span class="badge">⭐ Favorito</span>`:""}
  <div class="clear"></div>
  <button onclick="abrirDetalhe(${i})">🍷 Ver ficha</button>
  <button onclick="editarVinho(${i})">✏️ Editar</button>
  <button onclick="darBaixa(${i})">➖ Dar baixa</button>
  <button onclick="excluirVinho(${i})">🗑 Excluir</button>
  </div>`;
 });
}

function abrirDetalhe(i){
 const v=vinhos[i];
 document.getElementById("detalheVinho").innerHTML=`<div class="wine">${fotoHTML(v)}
 <h2>${v.nome}</h2>
 <p><b>Safra:</b> ${v.safra||"-"}</p>
 <p>${estrelas(v.nota)}</p>
 <span class="badge">🌎 ${v.pais||"-"}</span>
 <span class="badge">🍇 ${v.uva||"-"}</span><hr>
 <h3>🍷 Consumo</h3>
 <p><b>Janela:</b> ${v.janela||"-"}</p>
 <p><b>Temperatura:</b> ${v.temperatura||"-"}</p>
 <p><b>Decantação:</b> ${v.decantacao||"-"}</p><hr>
 <h3>🥩 Harmonização</h3><p>${v.harmonizacao||"-"}</p><hr>
 <h3>🍾 Minha Garrafa</h3>
 <p><b>Quantidade:</b> ${v.quantidade||0}</p>
 <p><b>Valor pago:</b> ${dinheiro(v.valor)}</p>
 <p><b>Status:</b> ${Number(v.quantidade)>0?"Em estoque":"Finalizada"}</p><hr>
 <h3>💬 Comentário</h3><p>${v.comentario||"Sem comentário."}</p>
 ${v.recompra?`<span class="badge">❤️ Recomprar</span>`:""}
 ${v.favorito?`<span class="badge">⭐ Favorito</span>`:""}
 <br><br><button onclick="abrirTela('adega')">← Voltar</button></div>`;
 abrirTela("detalhe");
}

function editarVinho(i){
 const v=vinhos[i];
 ["nome","safra","quantidade","valor","pais","uva","janela","harmonizacao","comentario"].forEach(id=>document.getElementById(id).value=v[id]||"");
 document.getElementById("nota").value=v.nota||5;
 document.getElementById("favorito").value=String(v.favorito);
 document.getElementById("recompra").value=String(v.recompra);
 document.getElementById("fotoBase64").value=v.foto||"";
 vinhos.splice(i,1);salvarDados();abrirTela("cadastro");
}

function darBaixa(i){if(Number(vinhos[i].quantidade)>0)vinhos[i].quantidade--;salvarDados();atualizarTudo()}
function excluirVinho(i){if(confirm("Excluir esta garrafa?")){vinhos.splice(i,1);salvarDados();atualizarTudo()}}
function setFiltro(f){filtroAtual=f;renderVinhos()}

function renderRanking(){
 const lista=document.getElementById("rankingLista"); if(!lista)return;
 lista.innerHTML="";
 [...vinhos].sort((a,b)=>Number(b.nota||0)-Number(a.nota||0)).forEach(v=>{
  lista.innerHTML+=`<div class="wine">${fotoHTML(v)}<h3>${v.nome}</h3><p>${v.pais||""} · ${v.uva||""}</p><p>${estrelas(v.nota)}</p><span class="badge">${v.recompra?"Recomprar":"Avaliado"}</span><div class="clear"></div></div>`;
 });
}

function gerarBackup(){document.getElementById("backup").value=JSON.stringify(vinhos,null,2)}
function atualizarIA(){
 const msg="A safra pertence à garrafa. A ficha técnica pertence ao Catálogo Mestre. A Adega Delucca começa a aprender seu perfil a partir das suas escolhas.";
 const t=document.getElementById("textoIA"); if(t)t.innerText=msg;
 const t2=document.getElementById("textoIA2"); if(t2)t2.innerText=msg;
}
function atualizarTudo(){atualizarDashboard();renderVinhos();renderRanking();atualizarIA()}
atualizarTudo();
