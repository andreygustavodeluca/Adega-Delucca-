// =====================================
// ADEGA DELUCCA V11
// Inicialização
// =====================================

let vinhos = JSON.parse(localStorage.getItem("adegaDelucca")) || [];

let filtroAtual = "todos";

function salvarDados(){
    localStorage.setItem("adegaDelucca",JSON.stringify(vinhos));
}

function abrirTela(id){

    document.querySelectorAll("section").forEach(sec=>{
        sec.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    atualizarTudo();

}

function atualizarTudo(){

    atualizarDashboard();

    renderVinhos();

    renderRanking();

    atualizarIA();

}

function totalGarrafas(){

    return vinhos.reduce((s,v)=>s+Number(v.quantidade||0),0);

}

function valorTotal(){

    return vinhos.reduce((s,v)=>s+(Number(v.quantidade||0)*Number(v.valor||0)),0);

}
