"use strict";
let urlServer = "http://localhost:3000/utilizadores";

function waitForVoltar() {
    document.getElementById("btn-voltar")
    .addEventListener("click", (event)=>{
        window.location.href="primavera.html";
    });
}

function waitForSubmit() {
    document
    .getElementById("form-registo")
    .addEventListener("submit", (event) => {

        event.preventDefault();

        let elements = document.querySelectorAll(".p-aviso");
        for (let elemAviso of elements ) {
            elemAviso.style.display = "none";
        }

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
        let valorPais = document.getElementById("pais");

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
                    let el =  document.getElementById("p-av-email");
                    el.innerHTML = "Já existe um utilizador com este email!";
                    el.style.display = "block";

                    boolDadosOK = false;
                    break;
                }
            }
        }) // End for users
        .catch( erro => {
            alert(erro);
        }); // End fetch

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
            .innerHTML = "O valor de campo de confirmação da " +
            "senha é diferente do valor da senha!";

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

        /************
         * DADOS OK *
         ************/
        if (boolDadosOK) {

            let novoUser = {
                email: valorEmail,
                senha: valorSenha,
                nome: valorNome,
                morada: valorMorada,
                cp: valorCodigoPostal,
                pais: valorPais,
                contaActiva: "false"};

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
                        console.log(response.status); // 201
                        console.log(response.statusText); // Created
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


                    alert("User criado com sucesso!");
                })
                .catch( erro => {
                    alert(erro);
                })


        } // End if dados ok
        
    }); // End event listener
}


waitForVoltar();
waitForSubmit();