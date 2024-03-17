"use strict";

function toggleSearch() {

    document.getElementById("icone-pesquisa")
    .addEventListener("click", (event) => {

        if (document
            .querySelector(".in-campo-pesquisa-class")
            .id === "in-campo-pesquisa") {
            document.querySelector(".in-campo-pesquisa-class")
                .id = "in-campo-pesquisa-hidden";
        }
        else {
            document.querySelector(".in-campo-pesquisa-class")
                .id = "in-campo-pesquisa";
            document.querySelector(".in-campo-pesquisa-class").focus();
        }

    });
}

function abrirLogin() {
    document.getElementById("li-login")
    .addEventListener("click", (event) => {
        document.querySelector(".tela")
        .classList.remove("hidden");
    });
}

function fecharLogin() {
    document.querySelector(".btnFechaTela")
    .addEventListener("click", (e) => {

        document.querySelector(".tela")
        .classList.add("hidden");
    });
}


toggleSearch();
abrirLogin();
fecharLogin();