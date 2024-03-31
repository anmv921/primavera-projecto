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

        document.querySelector("#li-senha span")
        .innerHTML = ` ${stars} `;

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

function waitForClickAlterarPass() {
    document.querySelector("#s-editar-pass")
    .addEventListener("click", (event) => {
        if (document.getElementById("form-alteracao-pass")
        .style.display === "block") {
            document.getElementById("form-alteracao-pass")
            .style.display = "none";

            sessionStorage.setItem("EdicaoPasse", "false");
        }
        else {
            document.getElementById("form-alteracao-pass")
            .style.display = "block";

            sessionStorage.setItem("EdicaoPasse", "true");
        }
    });
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

        // document.getElementById("p-av-formato-senha").style.display
        // = "none";
        // document.getElementById("p-av-conf-senha").style.display
        // = "none";

        sessionStorage.setItem("EdicaoPerfil", "true");
        window.location.href="registo_utilizador.html";


    });
}

function validarNovaPassword(in_password, in_confirmarPass) {
    let out_boolPassOK = true;

    document.getElementById("p-av-formato-senha").style.display
    = "none";
    document.getElementById("p-av-conf-senha").style.display
    = "none";

    let reSpecialChar = new RegExp("[^A-Za-z0-9\\s]+");
    let reNumeros = new RegExp("\\d+");
    let reMaiusculas = new RegExp("[A-Z]+");
    let reMinusculas = new RegExp("[a-z]+");
    if (
        !reSpecialChar.test( in_password ) ||
        !reNumeros.test( in_password ) ||
        !reMaiusculas.test( in_password ) ||
        !reMinusculas.test( in_password ) ||
        in_password.length < 8
    ) {
        out_boolPassOK = false;
        let elAviso = document.getElementById("p-av-formato-senha");
        elAviso.innerHTML = "A senha deve conter no mínimo 8 " +
        "caratéres, pelo menos um caratér especial, um número, " +
        "e uma letra!";
        elAviso.style.display = "block";
    }
    if ( !in_confirmarPass ) {
        document
        .getElementById("p-av-conf-senha")
        .style.display = "block";
        document
        .getElementById("p-av-conf-senha")
        .innerHTML = 
        "É obrigatório confirmar a senha atual ou alterada!";
        out_boolPassOK = false;
    }
    if ( in_password !== in_confirmarPass ) {
        document
        .getElementById("p-av-conf-senha")
        .style.display = "block";
        document
        .getElementById("p-av-conf-senha")
        .innerHTML = "Os dois valores das senhas devem ser iguais!";
        out_boolPassOK = false;
    }
    
    return out_boolPassOK;
}

function patchUser(in_novosDadosUser) {
    fetch(
        `${urlServer}/${sessionStorage.getItem("userId")}`,
        {
            method: "PATCH",
            body: JSON.stringify(in_novosDadosUser),
            headers: new Headers({
                'Content-type': 'application/json; charset=utf-8'
            })
        })
        .then( response => {
            if (response.ok) {
                console.log(response.status);
                console.log(response.statusText);
                return response.json();
            }
            else {
                return Promise.reject(
                    'Ocorreu um erro no acesso ao servidor!');
            }
        })
        .then(
        resposta => {
            alert("Sucesso ao atualizar a passe!");
        })
        .catch( erro => {
            alert(erro);
        })
}

function waitForSubmitAlterarPass() {
    document.getElementById("form-alteracao-pass")
    .addEventListener("submit", (event) => {

        event.preventDefault();

        let valorPassse = document
        .getElementById("in-pass").value;

        let valorConfirmarPass = document
        .getElementById("in-confirm-pass").value;

        let boolPassOK = 
        validarNovaPassword(valorPassse, valorConfirmarPass);

        if (boolPassOK) {

            let novosDadosUser = {
                senha: valorPassse
            };
            patchUser(novosDadosUser);
        }

    });
}

function initPaginaPerfil() {
    sessionStorage.setItem("EdicaoPerfil", "false");

    if ( sessionStorage.getItem("EdicaoPasse") === "true" ) {
        document.getElementById("form-alteracao-pass")
        .style.display = "block";

        document.getElementById("p-av-formato-senha").style.display
        = "block";
        document.getElementById("p-av-conf-senha").style.display
        = "block";
    }
    
}

initPaginaPerfil();
waitForVoltar();
getCurrentUser();
waitForEditarUser();
waitForClickAlterarPass();
waitForSubmitAlterarPass();