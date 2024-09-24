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

function getAllUsers() {
    fetch(urlServer)
        .then(response => {
            if (response.ok ) {
                return response.json();
            }
            else {
                let erro = "";
                switch (response.status) {
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
            }
        })
        .then( users => {
            document.querySelector("#tabela-users")
                .innerHTML = "";
            for ( let user of users ) {
                document.querySelector("#tabela-users")
                .innerHTML +=
                `<tr>
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td>${user.morada}</td>
                <td>${user.cp}</td>
                <td>${user.pais}</td>
                <td>
                    ${user.contaActiva == "true" ? "&#x2705;" : "&#x274C;"}
                </td>
                <td><button type="button" class="btn-ativar ${
                    user.contaActiva==="false" ? "btn-green" : "btn-red"
                }" data-id="ativar_${
                    user.id}">${
                        user.contaActiva==="false" ? "Ativar" : "Desativar"}</button></td>
                <td>
                    ${user.admin=="true" ? "&#x2705;" : "&#x274C;"}
                </td>
                <td><button type="button" class="btn-admin 
                ${user.admin === "false" ? "btn-green" : "btn-red"}
                " data-id="admin_${
                    user.id}">${
                        user.admin === "false" ? "Tornar admin" : "Remover permissões"
                    }</button></td>
                </tr>`;
            }
        })
        .then(
            () => {
                waitForActivar();
            }
        )
        .then(
            () => {
                waitForMakeAdmin();
            }
        )
        .catch( erro => {
            alert(erro);
        });
}

function patchUser(in_novosDadosUser, in_id) {
    fetch(
        `${urlServer}/${in_id}`,
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
            alert("Sucesso ao atualizar o user!");
        })
        .catch( erro => {
            alert(erro);
        })
}

function waitForActivar() {
    let botoesAtivar = document.querySelectorAll(".btn-ativar");
    for (let btnAtivar of botoesAtivar ) {
        btnAtivar.addEventListener("click", (event) => {
            event.stopPropagation();
            let id = btnAtivar.getAttribute("data-id");
            let novosDadosUser = {};
            if (btnAtivar.innerHTML === "Desativar") {
                novosDadosUser = {
                    contaActiva: "false"
                };
            } else {
                novosDadosUser = {
                    contaActiva: "true"
                };
            }
            id = id.split('_')[1];
            patchUser(novosDadosUser, id);
            getAllUsers();
        });
    }
}

function waitForMakeAdmin() {
    let botoesAdmin = document.querySelectorAll(".btn-admin");
    for (let btnAdmin of botoesAdmin ) {
        btnAdmin.addEventListener("click", (event) => {
            event.stopPropagation();
            let id = btnAdmin.getAttribute("data-id");
            let novosDadosUser = {};
            if ( btnAdmin.innerHTML === "Remover permissões" ) {
                novosDadosUser = {
                    admin: "false"
                };
            }
            else {
                novosDadosUser = {
                    admin: "true"
                };
            }
            id = id.split('_')[1];
            patchUser(novosDadosUser, id);
            getAllUsers();
        });
    }
}

function waitForVoltar() {
    document.getElementById("btn-voltar")
    .addEventListener("click", (event)=>{

        sessionStorage.setItem("EdicaoPerfil", "false");

        window.location.href="primavera.html";
    });
}

getAllUsers();
waitForVoltar();
