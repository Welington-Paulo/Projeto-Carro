// Classe Base: Veiculo
class Veiculo {
    constructor(modelo, cor, imagem) {
        this.modelo = modelo;
        this.cor = cor;
        this.ligado = false;
        this.velocidade = 0;
        this.combustivel = 100;
        this.imagem = imagem; // Adicionada a propriedade imagem
    }

    ligar() {
        if (this.combustivel > 0) {
            this.ligado = true;
            console.log(`${this.modelo} ligado.`);
        } else {
            console.log(`${this.modelo} sem combustível. Abasteça!`);
        }
    }

    desligar() {
        this.ligado = false;
        this.velocidade = 0;
        console.log(`${this.modelo} desligado.`);
    }

    acelerar(incremento) {
        if (this.ligado && this.combustivel > 0) {
            this.velocidade += incremento;
            this.combustivel -= 1;
            console.log(`${this.modelo} acelerando. Velocidade: ${this.velocidade}, Combustível: ${this.combustivel}`);
            this.verificarCombustivel();
        } else if (!this.ligado) {
            console.log(`${this.modelo} precisa estar ligado para acelerar.`);
        } else {
            console.log(`${this.modelo} sem combustível. Abasteça!`);
        }
    }

    frear(decremento) {
        this.velocidade = Math.max(0, this.velocidade - decremento);
        console.log(`${this.modelo} freando. Velocidade: ${this.velocidade}`);
    }

    buzinar() {
        console.log("Beep beep!");
    }

    exibirInformacoes() {
        return `Modelo: ${this.modelo}, Cor: ${this.cor}, Ligado: ${this.ligado ? 'Sim' : 'Não'}, Velocidade: ${this.velocidade}, Combustível: ${this.combustivel}`;
    }

    verificarCombustivel() {
        if (this.combustivel <= 0) {
            this.desligar();
            console.log(`${this.modelo} ficou sem combustível!`);
        }
    }

    abastecer(quantidade) {
        this.combustivel += quantidade;
        console.log(`${this.modelo} abastecido. Combustível atual: ${this.combustivel}`);
    }
}

// Classe Derivada: Carro
class Carro extends Veiculo {
    constructor(modelo, cor, numeroPortas, imagem) {
        super(modelo, cor, imagem);
        this.numeroPortas = numeroPortas;
    }

    exibirInformacoes() {
        return `${super.exibirInformacoes()}, Numero de Portas: ${this.numeroPortas}`;
    }
}

// Classe Derivada: CarroEsportivo
class CarroEsportivo extends Carro {
    constructor(modelo, cor, imagem) {
        super(modelo, cor, 2, imagem);
        this.turboAtivado = false;
    }

    ativarTurbo() {
        if (this.ligado && this.combustivel > 0) {
            this.turboAtivado = true;
            this.combustivel -= 5;
            console.log("Turbo ativado! Combustível: " + this.combustivel);
            this.verificarCombustivel();
        } else {
            console.log("Ligue o carro e verifique o combustível antes de ativar o turbo.");
        }
    }

    desativarTurbo() {
        this.turboAtivado = false;
        console.log("Turbo desativado.");
    }

    exibirInformacoes() {
        return `${super.exibirInformacoes()}, Turbo: ${this.turboAtivado ? 'Ativado' : 'Desativado'}`;
    }
}

// Classe Derivada: Caminhao
class Caminhao extends Veiculo {
    constructor(modelo, cor, capacidadeCarga, imagem) {
        super(modelo, cor, imagem);
        this.capacidadeCarga = capacidadeCarga;
        this.cargaAtual = 0;
    }

    carregar(quantidade) {
        if (this.cargaAtual + quantidade <= this.capacidadeCarga) {
            this.cargaAtual += quantidade;
            console.log(`Caminhão carregado. Carga atual: ${this.cargaAtual}`);
        } else {
            console.log("Capacidade de carga excedida.");
        }
    }

    descargar(quantidade) {
        this.cargaAtual = Math.max(0, this.cargaAtual - quantidade);
        console.log(`Caminhão descarregado. Carga atual: ${this.cargaAtual}`);
    }

    exibirInformacoes() {
        return `${super.exibirInformacoes()}, Capacidade de Carga: ${this.capacidadeCarga}, Carga Atual: ${this.cargaAtual}`;
    }
}

// Nova Classe Derivada: Moto
class Moto extends Veiculo {
    constructor(modelo, cor, imagem) {
        super(modelo, cor, imagem);
    }

    empinar() {
        if (this.ligado && this.velocidade > 10) {
            console.log("Moto empinando!");
        } else {
            console.log("A moto precisa estar ligada e a uma velocidade maior que 10 para empinar.");
        }
    }

    exibirInformacoes() {
        return `${super.exibirInformacoes()}`;
    }
}

// Classe Garagem
class Garagem {
    constructor() {
        this.veiculos = [];
        this.veiculoSelecionado = null;
    }

    adicionarVeiculo(veiculo) {
        this.veiculos.push(veiculo);
    }

    selecionarVeiculo(tipo) {
        switch (tipo) {
            case 'Carro':
                this.veiculoSelecionado = this.veiculos[0];
                break;
            case 'CarroEsportivo':
                this.veiculoSelecionado = this.veiculos[1];
                break;
            case 'Caminhao':
                this.veiculoSelecionado = this.veiculos[2];
                break;
            case 'Moto':
                this.veiculoSelecionado = this.veiculos[3];
                break;
            default:
                this.veiculoSelecionado = null;
                console.log('Veículo não encontrado.');
        }
        this.atualizarInformacoes();
    }

    interagir(acao) {
        if (!this.veiculoSelecionado) {
            console.log('Selecione um veículo primeiro.');
            return;
        }

        switch (acao) {
            case 'ligar':
                this.veiculoSelecionado.ligar();
                break;
            case 'desligar':
                this.veiculoSelecionado.desligar();
                break;
            case 'acelerar':
                this.veiculoSelecionado.acelerar(10);
                break;
            case 'frear':
                this.veiculoSelecionado.frear(5);
                break;
            case 'buzinar':
                this.veiculoSelecionado.buzinar();
                break;
            case 'ativarTurbo':
                if (this.veiculoSelecionado instanceof CarroEsportivo) {
                    this.veiculoSelecionado.ativarTurbo();
                } else {
                    console.log("Esta ação não se aplica a este veículo.");
                }
                break;
            case 'desativarTurbo':
                if (this.veiculoSelecionado instanceof CarroEsportivo) {
                    this.veiculoSelecionado.desativarTurbo();
                } else {
                    console.log("Esta ação não se aplica a este veículo.");
                }
                break;
            case 'carregar':
                if (this.veiculoSelecionado instanceof Caminhao) {
                    this.veiculoSelecionado.carregar(500);
                } else {
                    console.log("Esta ação não se aplica a este veículo.");
                }
                break;
            case 'descargar':
                if (this.veiculoSelecionado instanceof Caminhao) {
                    this.veiculoSelecionado.descargar(200);
                } else {
                    console.log("Esta ação não se aplica a este veículo.");
                }
                break;
            case 'pintar':
                this.veiculoSelecionado.cor = "Branco";
                break;
            case 'empinar':
                if (this.veiculoSelecionado instanceof Moto) {
                    this.veiculoSelecionado.empinar();
                } else {
                    console.log("Esta ação não se aplica a este veículo.");
                }
                break;
            case 'abastecer':
                this.veiculoSelecionado.abastecer(50);
                break;
            default:
                console.log('Ação inválida.');
        }
        this.atualizarInformacoes();
    }

    atualizarInformacoes() {
        const informacoesDiv = document.getElementById('informacoesVeiculo');
        const imagemElement = document.getElementById('imagemVeiculo'); // Obtém o elemento da imagem

        if (this.veiculoSelecionado) {
            informacoesDiv.textContent = this.veiculoSelecionado.exibirInformacoes();
            imagemElement.src = this.veiculoSelecionado.imagem; // Define o atributo src da imagem
            imagemElement.alt = `Imagem do ${this.veiculoSelecionado.modelo}`; // Define o atributo alt
        } else {
            informacoesDiv.textContent = 'Nenhum veículo selecionado.';
            imagemElement.src = ""; // Limpa a imagem
            imagemElement.alt = "";
        }
    }
}

// Criação dos objetos (adicione os caminhos das imagens)
const meuCarro = new Carro("Sedan", "Azul", 4, "IMG/Audi-Car-PNG-Picture.png");
const meuCarroEsportivo = new CarroEsportivo("Superveloz", "Amarelo", "IMG/purepng.com-yellow-chevrolet-corvette-z06-c7-carcarvehicletransportchevroletchevy-961524653293drbwe.png");
const meuCaminhao = new Caminhao("Carga Pesada", "Branco", 10000, "IMG/pngtree-red-truck-transport-png-image_14569283.png");
const minhaMoto = new Moto("CG Titan", "Preta", "IMG/sports-motorbike-sports-bike-sports-motorbike-transparent-background-ai-generated-free-png.webp");

// Criação da Garagem
const garagem = new Garagem();
garagem.adicionarVeiculo(meuCarro);
garagem.adicionarVeiculo(meuCarroEsportivo);
garagem.adicionarVeiculo(meuCaminhao);
garagem.adicionarVeiculo(minhaMoto);

// Event Listeners
document.getElementById('selecionarCarro').addEventListener('click', () => garagem.selecionarVeiculo('Carro'));
document.getElementById('selecionarCarroEsportivo').addEventListener('click', () => garagem.selecionarVeiculo('CarroEsportivo'));
document.getElementById('selecionarCaminhao').addEventListener('click', () => garagem.selecionarVeiculo('Caminhao'));
document.getElementById('selecionarMoto').addEventListener('click', () => garagem.selecionarVeiculo('Moto'));

document.getElementById('ligar').addEventListener('click', () => garagem.interagir('ligar'));
document.getElementById('desligar').addEventListener('click', () => garagem.interagir('desligar'));
document.getElementById('acelerar').addEventListener('click', () => garagem.interagir('acelerar'));
document.getElementById('frear').addEventListener('click', () => garagem.interagir('frear'));
document.getElementById('buzinar').addEventListener('click', () => garagem.interagir('buzinar'));
document.getElementById('ativarTurbo').addEventListener('click', () => garagem.interagir('ativarTurbo'));
document.getElementById('desativarTurbo').addEventListener('click', () => garagem.interagir('desativarTurbo'));
document.getElementById('carregar').addEventListener('click', () => garagem.interagir('carregar'));
document.getElementById('descargar').addEventListener('click', () => garagem.interagir('descargar'));
document.getElementById('pintar').addEventListener('click', () => garagem.interagir('pintar'));
document.getElementById('empinar').addEventListener('click', () => garagem.interagir('empinar'));
document.getElementById('abastecer').addEventListener('click', () => garagem.interagir('abastecer'));