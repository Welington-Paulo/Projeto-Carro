// Importa a classe Carro (se necessário, dependendo do seu ambiente)
// import { Carro } from './carro.js';

// Cria um objeto Carro
const meuCarro = new Carro("Fusca", "Azul");

// Obtém referências aos elementos HTML
const imagemCarro = document.getElementById("imagemCarro");
const modeloCarro = document.getElementById("modeloCarro");
const corCarro = document.getElementById("corCarro");
const velocidadeCarro = document.getElementById("velocidadeCarro");
const ligarBtn = document.getElementById("ligarBtn");
const desligarBtn = document.getElementById("desligarBtn");
const acelerarBtn = document.getElementById("acelerarBtn");

// Define os valores iniciais na página
modeloCarro.textContent = meuCarro.modelo;
corCarro.textContent = meuCarro.cor;

// Adiciona os event listeners aos botões
ligarBtn.addEventListener("click", function() {
  meuCarro.ligar();
});

desligarBtn.addEventListener("click", function() {
  meuCarro.desligar();
  atualizarVelocidade(); // Atualiza a velocidade na tela
});

acelerarBtn.addEventListener("click", function() {
  meuCarro.acelerar(10); // Acelera em 10 km/h
  atualizarVelocidade(); // Atualiza a velocidade na tela
});

// Função para atualizar a velocidade na tela
function atualizarVelocidade() {
  velocidadeCarro.textContent = meuCarro.velocidade;
}