class Veiculo {
    constructor(modelo, cor) {
      this.modelo = modelo;
      this.cor = cor;
      this.ligado = false;
      this.velocidade = 0;
    }
  
    ligar() {
      this.ligado = true;
      console.log("Veículo ligado!");
    }
  
    desligar() {
      this.ligado = false;
      this.velocidade = 0;
      console.log("Veículo desligado!");
    }
  
    buzinar() {
        console.log("Buzina genérica!");
    }
  }
  
  class Carro extends Veiculo {
      constructor(modelo, cor) {
          super(modelo, cor);
      }
  
      acelerar(incremento) {
          if (this.ligado) {
              this.velocidade += incremento;
              console.log(`Acelerando. Velocidade atual: ${this.velocidade}`);
          } else {
              console.log("O carro precisa estar ligado para acelerar.");
          }
      }
  
      frear(decremento) {
          if (this.velocidade > 0) {
              this.velocidade -= decremento;
              console.log(`Freando. Velocidade atual: ${this.velocidade}`);
          } else {
              console.log("O carro já está parado.");
          }
      }
  
      buzinar() {
          console.log("Bi bi!");
      }
  }





  class CarroEsportivo extends Carro {
    constructor(modelo, cor) {
      super(modelo, cor);
      this.turboAtivado = false;
    }
  
    ativarTurbo() {
      if (this.ligado) {
        this.turboAtivado = true;
        this.velocidade += 50;
        console.log("Turbo ativado! Velocidade aumentada.");
      } else {
        console.log("O carro precisa estar ligado para ativar o turbo.");
      }
    }
  
    desativarTurbo() {
      this.turboAtivado = false;
      console.log("Turbo desativado.");
    }
  
      buzinar() {
          console.log("Vrum vrum!");
      }
  }



  class Caminhao extends Carro {
    constructor(modelo, cor, capacidadeCarga) {
      super(modelo, cor);
      this.capacidadeCarga = capacidadeCarga;
      this.cargaAtual = 0;
    }
  
    carregar(kg) {
      if (this.cargaAtual + kg <= this.capacidadeCarga) {
        this.cargaAtual += kg;
        console.log(`Carga adicionada. Carga atual: ${this.cargaAtual} kg`);
      } else {
        console.log("Carga excede a capacidade máxima.");
      }
    }
  
      buzinar() {
          console.log("Fon fon!");
      }
  }




  // Objetos
const meuCarroEsportivo = new CarroEsportivo("chevrolet corvette z06", "Amarelo");
const meuCaminhao = new Caminhao("Scania", "Vermelho", 10000);

// Funções para manipular o Carro Esportivo
function ligarCarroEsportivo() {
  meuCarroEsportivo.ligar();
  atualizarTela();
}

function desligarCarroEsportivo() {
  meuCarroEsportivo.desligar();
  atualizarTela();
}

function acelerarCarroEsportivo() {
  meuCarroEsportivo.acelerar(10);
  atualizarTela();
}

function frearCarroEsportivo() {
  meuCarroEsportivo.frear(10);
  atualizarTela();
}

function ativarTurbo() {
  meuCarroEsportivo.ativarTurbo();
  atualizarTela();
}

function desativarTurbo() {
  meuCarroEsportivo.desativarTurbo();
  atualizarTela();
}

function buzinarCarroEsportivo() {
    meuCarroEsportivo.buzinar();
}


// Funções para manipular o Caminhão
function ligarCaminhao() {
  meuCaminhao.ligar();
  atualizarTela();
}

function desligarCaminhao() {
  meuCaminhao.desligar();
  atualizarTela();
}

function acelerarCaminhao() {
  meuCaminhao.acelerar(5);
  atualizarTela();
}

function frearCaminhao() {
  meuCaminhao.frear(5);
  atualizarTela();
}

function carregarCaminhao() {
  const carga = parseFloat(document.getElementById("cargaInput").value);
  meuCaminhao.carregar(carga);
  atualizarTela();
}

function buzinarCaminhao() {
    meuCaminhao.buzinar();
}

// Função para atualizar a tela com os dados dos objetos
function atualizarTela() {
  // Carro Esportivo
  document.getElementById("carroEsportivoModelo").textContent = meuCarroEsportivo.modelo;
  document.getElementById("carroEsportivoCor").textContent = meuCarroEsportivo.cor;
  document.getElementById("carroEsportivoLigado").textContent = meuCarroEsportivo.ligado ? "Sim" : "Não";
  document.getElementById("carroEsportivoVelocidade").textContent = meuCarroEsportivo.velocidade;
  document.getElementById("carroEsportivoTurbo").textContent = meuCarroEsportivo.turboAtivado ? "Ligado" : "Desligado";

  // Caminhão
  document.getElementById("caminhaoModelo").textContent = meuCaminhao.modelo;
  document.getElementById("caminhaoCor").textContent = meuCaminhao.cor;
  document.getElementById("caminhaoLigado").textContent = meuCaminhao.ligado ? "Sim" : "Não";
  document.getElementById("caminhaoVelocidade").textContent = meuCaminhao.velocidade;
  document.getElementById("caminhaoCapacidade").textContent = meuCaminhao.capacidadeCarga;
  document.getElementById("caminhaoCargaAtual").textContent = meuCaminhao.cargaAtual;
}

// Inicialização
atualizarTela();
  