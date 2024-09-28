# Cegid/Primavera Academy | Projeto Web Developer

![input xlsx](https://github.com/anmv921/primavera-projecto/blob/main/Data/ZohoProcessScreenshots/05.PNG)

Site criado como o projeto final da formação front-end realizada durante o ano 2024.
Este projeto procura emular a pagina inicial do software comercial Primavera, que descreve brevemente os seguintes pontos:

- Descrição da empresa
- Missão
- Equipa
- Oferta formativa

O projeto implementa os estilos do site com html e css e javascript, utilizando técnicas como flexbox para
organizar os elementos na página.

Foi implementado um sistema simples de login, com os dados guardados num ficheiro json. 

O âmbito do projeto é front-end, e como tal, para emular uma base de dados foi utilizado o pacote **json-server**
Para instalar este pacote é necessário instalar o gerenciador de pacotes **npm** e correr o seguinte comando:

> npm install json-server

Para iniciar o servidor, corremos o comando:

> npx json-server dados/utilizadores.json

As operações CRUD efectuadas no front-end são utilizadas com javascript, utilizando a API fetch, sendo que 
existem formulários de login, registo, edição de dados de utilizador, e eliminação.
