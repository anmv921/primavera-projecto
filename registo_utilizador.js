"use strict";
let urlServer = "http://localhost:3000/utilizadores";

function waitForVoltar() {
    document.getElementById("btn-voltar")
    .addEventListener("click", (event)=>{

        sessionStorage.setItem("EdicaoPerfil", "false");

        window.location.href="primavera.html";
    });
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
            document.getElementById("tela-sucesso")
            .classList.remove("hidden");
            sessionStorage.setItem("ConfirmarSubmit", "true");
        })
        .catch( erro => {
            alert(erro);
        })
}

function waitForSubmit() {
    document
    .getElementById("form-registo")
    .addEventListener("submit", (event) => {
        event.preventDefault();
        /********************
         * LIMPAR OS AVISOS *
         ********************/
        let elements = document.querySelectorAll(".p-aviso");
        for (let elemAviso of elements ) {
            elemAviso.style.display = "none";
        }
        /*************************
         * INICIALIZAR VARIÁVEIS *
         *************************/
        let boolDadosOK = true;
        /********************
         * OBTER OS VALORES *
         ********************/
        let valorNome = document.getElementById("nome").value.trim();
        let valorEmail = document.getElementById("email").value.trim();
        let valorSenha = document.getElementById("senha").value.trim();
        let valorConfirmarSenha = document
        .getElementById("confirmar-senha").value.trim();
        let valorMorada = document.getElementById("morada").value.trim();
        let valorCodigoPostal = document
        .getElementById("codigo-postal").value.trim();
        let valorPais = document.getElementById("pais").value.trim();
        /*********************
         * VALIDAR OS CAMPOS *
         *********************/
        if (!valorNome || 
            !valorEmail ||
            !valorSenha ||
            !valorConfirmarSenha ||
            !valorMorada ||
            !valorCodigoPostal ||
            !valorPais) {
                document
                .getElementById("p-av-todos")
                .style.display = "block";

                boolDadosOK = false;
            }
        /*****************
         * VALIDAR EMAIL *
         *****************/
        const reEmail = new RegExp("^\\S+@\\S+\\.\\S+$");
        if ( !reEmail.test( valorEmail ) ) {
            let el =  document.getElementById("p-av-email");
            el.innerHTML = "Email com formato incorrreto!";
            el.style.display = "block";
            boolDadosOK = false;
        }
        /*****************
         * VALIDAR SENHA *
         *****************/
        let reSpecialChar = new RegExp("[^A-Za-z0-9\\s]+");
        let reNumeros = new RegExp("\\d+");
        let reMaiusculas = new RegExp("[A-Z]+");
        let reMinusculas = new RegExp("[a-z]+");
        if (
            !reSpecialChar.test( valorSenha ) ||
            !reNumeros.test( valorSenha ) ||
            !reMaiusculas.test( valorSenha ) ||
            !reMinusculas.test( valorSenha ) ||
            valorSenha.length < 8
        ) {
            boolDadosOK = false;
            
            let elAviso = document.getElementById("p-av-formato-senha");
            
            elAviso.innerHTML = "A senha deve conter no mínimo 8 " +
            "caratéres, pelo menos um caratér especial, um número, " +
            "e uma letra!";
            elAviso.style.display = "block";
        }
        if ( !valorConfirmarSenha ) {
            document
            .getElementById("p-av-conf-senha")
            .style.display = "block";

            document
            .getElementById("p-av-conf-senha")
            .innerHTML = 
            "É obrigatório confirmar a senha atual ou alterada!";

            boolDadosOK = false;
        }
        if ( valorSenha !== valorConfirmarSenha ) {
            document
            .getElementById("p-av-conf-senha")
            .style.display = "block";

            document
            .getElementById("p-av-conf-senha")
            .innerHTML = "Os dois valores das senhas devem ser iguais!";

            boolDadosOK = false;
        }
        /*************************
         * VALIDAR CÓDIGO POSTAL *
         *************************/
        let reCodPostal = new RegExp("^\\d{4}\\s*-\\s*\\d{3}$");
        if ( !reCodPostal.test(valorCodigoPostal) ) {
            boolDadosOK = false;
            document.getElementById("p-av-cp7")
            .style.display = "block";
        }
        /***********************************************
         * VALIDAR SE EMAIL JÁ EXISTE NA BASE DE DADOS *
         ***********************************************/
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
            for ( let user of users ) {
                if ( user.email.trim() === valorEmail ) {
                    if ( 
                        (
                            // Criação de user
                            sessionStorage
                            .getItem("EdicaoPerfil") !== "true"
                        ) ||
                        (
                            // Edição de user
                            sessionStorage
                            .getItem("EdicaoPerfil") === "true" &&
                            user.id !== sessionStorage.getItem("userId")
                        )
                    ) {
                        let el =  document.getElementById("p-av-email");
                        el.innerHTML = 
                        "Já existe um utilizador com este email!";
                        el.style.display = "block";
                        boolDadosOK = false;
                        break;
                    }
                }
            } // End for users
        })
        .then( () => {
        /************
         * DADOS OK *
         ************/
        if (boolDadosOK) {
            if ( sessionStorage
                .getItem("EdicaoPerfil") === "true" ) {
                    /******************
                     * ATUALIZAR USER *
                     ******************/
                    let novosDadosUser = {
                        email: valorEmail,
                        senha: valorSenha,
                        nome: valorNome,
                        morada: valorMorada,
                        cp: valorCodigoPostal,
                        pais: valorPais,
                    };
                    patchUser(novosDadosUser);
                }
             else {
                /**************
                 * CRIAR USER *
                 **************/
                let novoUser = {
                    email: valorEmail,
                    senha: valorSenha,
                    nome: valorNome,
                    morada: valorMorada,
                    cp: valorCodigoPostal,
                    pais: valorPais,
                    contaActiva: "false"
                };
                fetch(
                    urlServer,
                    {
                        method: "POST",
                        body: JSON.stringify(novoUser),
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
                        document.getElementById("nome").value = "";
                        document.getElementById("email").value = "";
                        document.getElementById("senha").value = "";
                        document.getElementById("confirmar-senha")
                            .value = "";
                        document.getElementById("morada").value = "";
                        document.getElementById("codigo-postal")
                            .value = "";
                        document.getElementById("pais").value = "";
                        document.getElementById("tela-sucesso")
                        .classList.remove("hidden");
                        sessionStorage.setItem("ConfirmarSubmit", "true");
                    })
                    .catch( erro => {
                        alert(erro);
                    })
                } // End else - criar user
            } // End if dados ok
        }); // End then
    }); // End event listener
} // End wait for submit

function waitForFecharModalSucesso() {
    document.querySelector(".btnFechaTela")
    .addEventListener("click", (click) => {
        document.querySelector("#tela-sucesso").classList.add("hidden");
        sessionStorage.setItem("ConfirmarSubmit", "false");
    });
    document.getElementById("btnCriacaoUserOK")
    .addEventListener("click", (event) => {
        document.querySelector("#tela-sucesso")
        .classList.add("hidden");
        sessionStorage.setItem("ConfirmarSubmit", "false");

        sessionStorage.setItem("EdicaoPerfil", "false");

        window.location.href = "primavera.html";
    });
}

function validarResposta(in_response) {
    if ( in_response.ok ) {
        return in_response.json();
    }
    else {
        let erro = "";
        switch (in_response.status) {
            case 404:
                erro = 
                "Ocorreu um erro no acesso ao servidor" +
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

    document.getElementById("nome")
    .value = `${in_user.nome}`;

    document.getElementById("email")
    .value = `${in_user.email}`;

    document.getElementById("senha")
    .value = `${in_user.senha}`;

    document.getElementById("morada")
    .value += `${in_user.morada}`;

    document.getElementById("codigo-postal")
    .value += `${in_user.cp}`;

    document.getElementById("pais")
    .value += `${in_user.pais}`;
}

function getCurrentUser() {
    let currentlyLoggedInId = sessionStorage.getItem("userId");
    // Se não existe user autenticado, 
    // redirecionar para a página principal
    if ( !currentlyLoggedInId ) {
        window.location.href = "primavera.html";
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

function initForm() {
    if ( sessionStorage.getItem("ConfirmarSubmit") !== "true" ) {
        document.getElementById("tela-sucesso")
        .classList.add("hidden");
        sessionStorage.setItem("ConfirmarSubmit", "false");
    }
    if ( sessionStorage.getItem("EdicaoPerfil") === "true" ) {
        document.querySelector("#form-registo h1")
        .innerHTML = "Perfil";
        document.querySelector("#btn-submeter-registo")
        .innerHTML = "Guardar alterações";
        document.querySelector(".telaConteudo section")
        .innerHTML = "<p>User atualizado com sucesso!</p>" +
        "<p>Ao clicar OK será redireccionado para a página principal.</p>";
        getCurrentUser();
    }
    else {
        document.querySelector("#form-registo h1")
        .innerHTML = "Registo de Utilizador";
        document.querySelector("#btn-submeter-registo")
        .innerHTML = "Submeter Registo";
        document.querySelector(".telaConteudo section")
        .innerHTML = "<p>User criado com sucesso!</p>" +
        "<p>O seu perfil será validado e activado"+
        " por um administrador em breve.</p>"+
        "<p>Ao clicar OK será redireccionado para a página principal.</p>";
    }
}

initForm();
waitForVoltar();
waitForSubmit();
waitForFecharModalSucesso();