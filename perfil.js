"use strict";
let urlServer = "http://localhost:3000/utilizadores";

function validarResposta(in_response) {
    if ( in_response.ok ) {
        return in_response.json();
    }
    else {
        let erro = "";
        switch (in_response.status) {
            case 404:
                erro = 
                "Ocorreu um erro no acesso ao servidor"+
                " - página não encontrada!";
                break;
            case 500:
                erro = "Ocorreu um erro no acesso ao servidor!"

            default:
                erro = "Ocorreu um erro no request";
        }
        return Promise.reject(erro);
    } // End else - erro
}

function preencherDados(in_user) {

    document.getElementById("li-nome")
        .innerHTML += ` ${in_user.nome}`;

        document.getElementById("li-email")
        .innerHTML += ` ${in_user.email}`;

        const regex = new RegExp(".", "g");
        let stars = in_user.senha.replaceAll(regex, '*');

        document.getElementById("li-senha")
        .innerHTML += ` ${stars}`;

        document.getElementById("li-morada")
        .innerHTML += ` ${in_user.morada}`;

        document.getElementById("li-cod-postal")
        .innerHTML += ` ${in_user.cp}`;

        document.getElementById("li-pais")
        .innerHTML += ` ${in_user.pais}`;
}

function getCurrentUser() {
    let currentlyLoggedInId = sessionStorage.getItem("userId");
    // Se não existe user autenticado, redirecionar para a página principal
    if ( !currentlyLoggedInId ) {
        window.location.href="primavera.html";
    }
    // Obter os dados do cliente
    fetch(
        `${urlServer}/${currentlyLoggedInId}`
    )
    .then(response => {
        return validarResposta(response);
    })
    .then( user => {
        preencherDados(user);
    })
    .catch( erro => {
        alert(erro);
    });
} // End getCurrentUser

function waitForClickAlterarInfo() {
    document.getElementById("");
}

function waitForVoltar() {
    document.getElementById("btn-voltar")
    .addEventListener("click", (event)=>{
        window.location.href="primavera.html";
    });
}

function waitForEditarUser() {
    document.getElementById("btn-alterar-info")
    .addEventListener("click", (event) => {
        sessionStorage.setItem("EdicaoPerfil", "true");
        window.location.href="registo_utilizador.html";
    });
}

function initPaginaPerfil() {
    sessionStorage.setItem("EdicaoPerfil", "false");
}

initPaginaPerfil();
waitForVoltar();
getCurrentUser();
waitForEditarUser();
