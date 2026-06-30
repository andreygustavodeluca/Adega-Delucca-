// ====================================
// ADEGA DELUCCA V12
// Inicialização
// ====================================

const STORAGE_KEY = "adegaDelucca";

let vinhos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let filtroAtual = "todos";

function salvarDados(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vinhos));
}

function valorTotal(){
    return vinhos.reduce((t,v)=>t+(Number(v.valor||0)*Number(v.quantidade||0)),0);
}

function totalGarrafas(){
    return vinhos.reduce((t,v)=>t+Number(v.quantidade||0),0);
}

function estoqueBaixo(){
    return vinhos.filter(v=>Number(v.quantidade)<=1).length;
}

function favoritos(){
    return vinhos.filter(v=>v.favorito).length;
}
// ====================================
// DASHBOARD
// ====================================

function atualizarDashboard(){

    const g = document.getElementById("totalGarrafas");
    if(g) g.innerText = totalGarrafas();

    const v = document.getElementById("valorTotal");
    if(v) v.innerText =
        "R$ " + valorTotal().toLocaleString("pt-BR");

    const f = document.getElementById("favoritos");
    if(f) f.innerText = favoritos();

    const e = document.getElementById("estoqueBaixo");
    if(e) e.innerText = estoqueBaixo();

    const e = document.getElementById("estoqueBaixo");
if(e) e.innerText = estoqueBaixo();

const totalPaises = document.getElementById("totalPaises");
if(totalPaises){
    let paises = {};

    vinhos.forEach(v=>{
        let pais = v.pais || "Não informado";
        paises[pais] = (paises[pais] || 0) + Number(v.quantidade || 0);
    });

    totalPaises.innerHTML = Object.entries(paises)
        .map(([pais,qtd])=>`<span class="badge">${pais}: ${qtd}</span>`)
        .join(" ");
}

atualizarSugestao();

    atualizarSugestao();
}

function atualizarSugestao(){

    const div = document.getElementById("sugestaoHoje");

    if(!div) return;

    if(vinhos.length===0){

        div.innerHTML =
        "<div class='wine'><h3>Sua adega está vazia</h3><p>Cadastre seu primeiro vinho.</p></div>";

        return;
    }

    let melhor = [...vinhos]
        .sort((a,b)=>(b.nota||0)-(a.nota||0))[0];

    div.innerHTML = `
        <div class="wine">
            <h3>${melhor.nome}</h3>
            <p>${melhor.comentario || ""}</p>
            <span class="badge">
                Janela: ${melhor.janela || "-"}
            </span>
        </div>
    `;
}
// ====================================
// CATÁLOGO DELUCCA
// ====================================

function buscarNoCatalogo(){

    const nomeDigitado = document.getElementById("nome").value.toLowerCase();

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
        alert("Vinho não encontrado no catálogo.");
        return;
    }

    document.getElementById("nome").value = item.nome || "";
    document.getElementById("safra").value = item.safra || "";
    document.getElementById("pais").value = item.pais || "";
    document.getElementById("uva").value = item.uva || "";
    document.getElementById("janela").value = item.janela || "";
    document.getElementById("harmonizacao").value = item.harmonizacao || "";
    document.getElementById("comentario").value = item.comentario || "";
    document.getElementById("nota").value = item.nota || 5;
    document.getElementById("favorito").value = item.recomprar ? "true" : "false";
    document.getElementById("recompra").value = item.recomprar ? "true" : "false";

    alert("Informações carregadas do Catálogo Delucca.");
}

function gerarRecomendacoes(){

    const uva = document.getElementById("uva").value.toLowerCase();
    const pais = document.getElementById("pais").value.toLowerCase();

    let janela = "2025 a 2028";
    let harmonizacao = "Carnes, massas e queijos";
    let comentario = "Boa opção para manter na adega.";

    if(uva.includes("malbec")){
        janela = "2026 a 2030";
        harmonizacao = "Churrasco, carnes vermelhas e massas";
        comentario = "Perfil ideal para carnes e noites frias.";
    }

    if(uva.includes("blend")){
        janela = "Agora até 2029";
        harmonizacao = "Massas, carnes, queijos e jantar normal";
        comentario = "Blend versátil, equilibrado e fácil de agradar.";
    }

    if(pais.includes("portugal")){
        janela = "2025 a 2030";
        harmonizacao = "Bacalhau, carnes assadas e queijos";
        comentario = "Boa opção portuguesa para diversificar a adega.";
    }

    document.getElementById("janela").value = janela;
    document.getElementById("harmonizacao").value = harmonizacao;
    document.getElementById("comentario").value = comentario;

    alert("Recomendações geradas.");
}
// ====================================
// LISTAGEM DA ADEGA
// ====================================

function renderVinhos(){

    const lista = document.getElementById("listaVinhos");
    if(!lista) return;

    const busca = (document.getElementById("busca")?.value || "").toLowerCase();

    lista.innerHTML = "";

    vinhos
    .filter(v=>{
        const texto = `${v.nome} ${v.pais} ${v.uva}`.toLowerCase();

        const filtro =
            filtroAtual === "todos" ||
            (filtroAtual === "favoritos" && v.favorito) ||
            (filtroAtual === "baixo" && Number(v.quantidade)<=1);

        return texto.includes(busca) && filtro;
    })
    .forEach((v,i)=>{
        lista.innerHTML += `
        <div class="wine">
            <h3>${v.nome}</h3>
            <p>Safra ${v.safra || ""} · ${v.pais || ""} · ${v.uva || ""}</p>
            <p>Quantidade: ${v.quantidade || 0} · Valor: R$ ${v.valor || 0}</p>
            <p>${v.comentario || ""}</p>
            ${Number(v.quantidade)<=1 ? "<div class='alerta'>⚠️ Estoque baixo</div>" : ""}
            <button onclick="darBaixa(${i})">Dar baixa</button>
            <button onclick="editarVinho(${i})">Editar</button>
            <button onclick="excluirVinho(${i})">Excluir</button>
        </div>`;
    });
}

function setFiltro(f){
    filtroAtual = f;
    renderVinhos();
}
// ====================================
// RANKING
// ====================================

function renderRanking(){

    const lista = document.getElementById("rankingLista");
    if(!lista) return;

    lista.innerHTML = "";

    [...vinhos]
    .sort((a,b)=>(b.nota||0)-(a.nota||0))
    .forEach(v=>{
        lista.innerHTML += `
        <div class="wine">
            <h3>${v.nome}</h3>
            <p>${v.pais || ""} · ${v.uva || ""}</p>
            <p>${"⭐".repeat(v.nota || 0)}</p>
            <span class="badge">${v.recompra ? "Recomprar" : "Adega"}</span>
        </div>`;
    });
}

// ====================================
// FORMULÁRIO
// ====================================

function salvarFormulario(){

    const vinho = {
        nome: document.getElementById("nome").value,
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
        recompra: document.getElementById("recompra").value === "true"
    };

    if(!vinho.nome){
        alert("Digite o nome do vinho.");
        return;
    }

    if(!vinho.quantidade || vinho.quantidade < 1){
        alert("Informe a quantidade.");
        return;
    }

    if(!vinho.valor || vinho.valor < 1){
        alert("Informe o valor pago por garrafa.");
        return;
    }

    vinhos.push(vinho);
    salvarDados();
    limparFormulario();
    atualizarTudo();
    abrirTela("adega");
}
function limparFormulario(){
    ["nome","safra","pais","uva","quantidade","valor","janela","harmonizacao","comentario"].forEach(id=>{
        document.getElementById(id).value = "";
    });

    document.getElementById("nota").value = "5";
    document.getElementById("favorito").value = "false";
    document.getElementById("recompra").value = "false";
}

function darBaixa(i){
    if(vinhos[i].quantidade > 0){
        vinhos[i].quantidade--;
    }

    salvarDados();
    atualizarTudo();
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

    excluirVinho(i);
    abrirTela("cadastro");
}

function excluirVinho(i){
    if(confirm("Excluir este vinho?")){
        vinhos.splice(i,1);
        salvarDados();
        atualizarTudo();
    }
}

function gerarBackup(){
    const backup = document.getElementById("backup");
    if(backup){
        backup.value = JSON.stringify(vinhos,null,2);
    }
}

function atualizarIA(){
    const texto = document.getElementById("textoIA");
    if(!texto) return;

    texto.innerText =
    "Seu perfil favorece vinhos equilibrados, aromáticos e com boa recompra. Priorize Alma Negra, Luigi Bosca, Catena e Susana Balbo.";
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
