"use strict";
let urlServer = "http://localhost:3000/utilizadores";

function waitToggleSearch() {

    document.getElementById("icone-pesquisa")
    .addEventListener("click", (event) => {

        if (document
            .querySelector(".in-campo-pesquisa-class")
            .id === "in-campo-pesquisa") {
            document.querySelector(".in-campo-pesquisa-class")
                .id = "in-campo-pesquisa-hidden";

                document.querySelector("#p-msg-bem-vindo")
                .style.display = "inherit";
        }
        else {
            document.querySelector(".in-campo-pesquisa-class")
                .id = "in-campo-pesquisa";
            document.querySelector(".in-campo-pesquisa-class").focus();
        }

    });
}

function waitAbrirLogin() {
    document.getElementById("li-login")
    .addEventListener("click", (event) => {

        document.getElementById("avisos")
        .innerHTML = "";

        document.querySelector("#tela-controlo")
        .classList.remove("hidden");

        document.body.classList.add("disable-scroll");

        document.getElementById("in-modal-email").focus();
    });
}

function waitFecharModal() {
    document.querySelector(".btnFechaTela")
    .addEventListener("click", (e) => {
        fecharLogin();
    });
}

function fecharLogin() {
        document.querySelector("#tela-controlo")
        .classList.add("hidden");

        document.body.classList.remove("disable-scroll");
}

function toggleIconesLoginAtivo() {
    document.querySelector("#li-perfil")
    .classList.remove("hidden");

    document.querySelector("#li-logout")
    .classList.remove("hidden");

    document.getElementById("li-registo")
    .classList.add("hidden");

    document.getElementById("li-login")
    .classList.add("hidden");

    if ( sessionStorage.getItem("userIsAdmin") === "true" ) {
        document.getElementById("li-area-admin")
        .classList.remove("hidden");
    }
    else {
        document.getElementById("li-area-admin")
        .classList.add("hidden");
    }
}

function toggleIconesLogOut() {
    document.querySelector("#li-perfil")
    .classList.add("hidden");

    document.querySelector("#li-logout")
    .classList.add("hidden");

    document.getElementById("li-registo")
    .classList.remove("hidden");

    document.getElementById("li-login")
    .classList.remove("hidden");

    document.getElementById("li-area-admin")
    .classList.add("hidden");
}

function toggleWelcomeMessage(in_username) {
    if (in_username) {
        document.getElementById("p-msg-bem-vindo")
        .innerHTML = `Bem-vindo(a), ${in_username}`;
    }
    else {
        document.getElementById("p-msg-bem-vindo")
        .innerHTML = "";
    }
}

function getUserById(in_loggedInUserId) {
    fetch(
        `${urlServer}/${in_loggedInUserId}`
    )
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
    .then( user => {
        toggleWelcomeMessage(user.nome);
    })
    .catch( erro => {
        alert(erro);
    });
}

function waitForSubmit() {
    // Submit é no form, não no botão que tem o evento submit!
    document.getElementById("formControloAcessos")
    .addEventListener( "submit", async event => {
        event.preventDefault();
        document.getElementById("avisos")
            .innerHTML = "";
        let valEmail = document
        .getElementById("in-modal-email").value.trim();
        let valSenha = document
        .getElementById("in-modal-senha").value.trim();
        /*****************
        * VALIDAR DADOS *
        *****************/
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
            // Tem que ser tudo feito dentro do request
            // porque as funções são assíncronas
            // e não esperam por fim de execução umas das outras...
            let boolDadosOK = true;
            const reEmail = new RegExp("^\\S+@\\S+\\.\\S+$");
            
            if (valEmail === "" || valSenha === "" ) {
                    document.getElementById("avisos")
                    .innerHTML += 
                    "<p>Os dois campos são de preenchimento obrigatório!</p>";
                    boolDadosOK = false;
            }
            else if ( !reEmail.test( valEmail ) ) {
                    document.getElementById("avisos")
                    .innerHTML += 
                    "<p>O e-mail tem um formato incorreto!</p>";
                    boolDadosOK = false;
            }
            let boolUserEncontrado = false;
            for ( let user of users ) {
                if ( 
                    user.email.trim() === valEmail.trim() &&
                    user.senha.trim() === valSenha.trim()
                ) {
                    boolUserEncontrado = true;
                    // User encontrado
                    // Conta inativa
                    if( !JSON.parse(user.contaActiva) ) {
                        document.getElementById("avisos")
                        .innerHTML += 
                        "<p>Conta não activa!</p>";
                        boolDadosOK = false;
                    } // End if conta inativa
                    else { 
                        // User ok
                        sessionStorage.setItem( "userId", user.id );
                    }
                    break; // Sair do loop
                } // End if - user encontrado
            } // End for

            if ( !boolUserEncontrado ) {
                document.getElementById("avisos")
                .innerHTML += 
                "<p>Utilizador inexistente!</p>";
                boolDadosOK = false;
            }

            if (boolDadosOK) {
                document.getElementById("avisos")
                .innerHTML = "";

                fecharLogin();

                let loggedInUserId = sessionStorage.getItem("userId");

                /******************
                 * GET USER BY ID *
                 ******************/
                fetch(
                    `${urlServer}/${loggedInUserId}`
                )
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
                .then( user => {
                    toggleWelcomeMessage(user.nome);

                    if (user.admin === "true" ) {
                        sessionStorage
                        .setItem("userIsAdmin", "true");
                    }
                    else {
                        sessionStorage
                        .setItem("userIsAdmin", "false");
                    }

                    toggleIconesLoginAtivo();
                })
                .catch( erro => {
                    alert(erro);
                });
                /*************************
                 * END OF GET USER BY ID *
                 ************************/
                
            } // End if dados OK
        })
        .catch( erro => {
            alert(erro);
        });
    }); // End event listener
} // End wait for submit

function waitForLogout() {
    document.getElementById("li-logout")
    .addEventListener("click", (event) =>{
        toggleWelcomeMessage("");
        toggleIconesLogOut();
        sessionStorage.removeItem( "userId" );
    });
}

function waitClickHamburger() {
    document
    .getElementById("li-hamburguer")
    .addEventListener("click", (event) => {

        if (
            document.querySelector(".menu").style
            .getPropertyValue("display") === "flex"
        ) {
            document.querySelector(".menu")
            .style.setProperty("display", "none");
        }
        else {
            document.querySelector(".menu")
            .style.setProperty("display", "flex");
        }
    });
}

function waitForResize() {
    addEventListener("resize", (event) => {
        if(window.innerWidth > 800) {
            document.querySelector(".menu")
            .style.setProperty("display", "flex");

            document.querySelector(".menu")
            .style.setProperty("flex-direction", "row");
        }
        else {
            document.querySelector(".menu")
            .style.setProperty("display", "none");

            document.querySelector(".menu")
            .style.setProperty("flex-direction", "column");
        }
    });
}

function sliderLoop() {
    let contador = 1;
    let arr_titleColors = [ 
        "#f27d29",
        "#153c85",
        "#ebc711",
        "#153c85",
        "#ff701e"
    ];
    let arr_titles = [
        "PRIMAVERA Academy",
        "Online Seminar",
        "RE_Start",
        "Marketing Digital",
        "Programa SCORE"
    ];
    let arr_subtitles = [
        "Juntos seremos mais fortes!",
        "Legislação Laboral de A a Z",
        "CODE Learning Academy",
        "Aproveite Desconto 20%",
        "Online | Virtual Classroom"
    ];
    let arr_sliderTextos = [
        "Aposte em novas competências",
        "Atualize os seus conhecimentos",
        "Juntos desenvolvemos o teu percurso de sucesso como Developer",
        "Virtual Classroom (Online)",
        "Certifique-se como Profissional PRIMAVERA"
    ];

    setInterval(
        () => {
            let background = 
            `url("imagens/slider${contador}.jpg")`;

            document.getElementById("slider")
            .style.backgroundImage = background;

            document.getElementById("slider-title")
            .style.color = arr_titleColors[contador - 1];

            document.getElementById("slider-title")
            .innerHTML = arr_titles[contador - 1];

            document.getElementById("slider-sub-titulo")
            .innerHTML = arr_subtitles[contador - 1];

            document.getElementById("slider-texto")
            .innerHTML = arr_sliderTextos[contador - 1];

            if ( contador === 1 ) {
                document.getElementById("slider-sub-titulo")
                .style.color = "#153c85";

                document.getElementById("slider-texto")
                .style.color = "#153c85";

            }
            else {
                document.getElementById("slider-sub-titulo")
                .style.color = "white";

                document.getElementById("slider-texto")
                .style.color = "white";
            }

            contador ++;
            if (contador > 5) {
                contador = 1;
            }
        }, 
    5000);
}

function waitForAcceptCookies() {

    if ( localStorage.getItem("CookiesAccepted")==="true")  {
        document.querySelector(".tela-cookies")
            .style.setProperty("display", "none");
    } else {
        document.querySelector("#btn-aceitar-cookies")
        .addEventListener("click", (event) =>{

            localStorage.setItem("CookiesAccepted", "true");

            document.querySelector(".tela-cookies")
            .style.setProperty("display", "none");
        });
    }
}

function waitForAbrirRegisto() {
    document.querySelector("#li-registo")
    .addEventListener("click", (event)=> {
        sessionStorage.setItem("EdicaoPerfil", "false");
        window.location.href = "registo_utilizador.html";
    });
}

function waitForClickPerfil() {
    document.getElementById("li-perfil")
    .addEventListener( "click", (event) => {
        window.location.href = "perfil.html";
    });
}

function waitForClickAdminArea() {
    document.getElementById("li-area-admin")
    .addEventListener("click", (click) => {
        window.location.href = "admin_utilizadores.html";
    });
}

function initSite() {
    if ( sessionStorage.getItem("userId") ) {
        toggleIconesLoginAtivo();
        getUserById( sessionStorage.getItem("userId") );
    }
    
    else {
        toggleIconesLogOut();
    }

    if ( localStorage.getItem("CookiesAccepted")==="true")  {
        document.querySelector(".tela-cookies")
            .style.setProperty("display", "none");
    }
    else {
        document.querySelector(".tela-cookies")
            .style.setProperty("display", "flex");
    }
}

initSite();
waitToggleSearch();
waitAbrirLogin();
waitFecharModal();
waitForSubmit();
waitForLogout();
waitClickHamburger();
waitForResize();
sliderLoop();
waitForAcceptCookies();
waitForAbrirRegisto();
waitForClickPerfil();
waitForClickAdminArea();