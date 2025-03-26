// Classes
class Veiculo {
    constructor(modelo, velocidadeMaxima, capacidadeCombustivel) {
        this.modelo = modelo;
        this.velocidade = 0;
        this.velocidadeMaxima = velocidadeMaxima;
        this.ligado = false;
        this.combustivel = capacidadeCombustivel; // Capacidade total de combustível
        this.consumoPorSegundo = 1; // Unidade de combustível consumida por segundo
        this.capacidadeCombustivel = capacidadeCombustivel; // Capacidade total
    }

    ligar() {
        if (!this.ligado) {
            if (this.combustivel > 0) {
                this.ligado = true;
                this.exibirAlerta("sucesso", "Veículo ligado!");
                this.tocarSom('ligar');
                this.iniciarConsumoCombustivel();
            } else {
                this.exibirAlerta("erro", "Sem combustível para ligar!");
            }
        } else {
            this.exibirAlerta("erro", "O veículo já está ligado.");
        }
        this.atualizarStatusVisual();
    }

    desligar() {
        if (this.ligado) {
            this.ligado = false;
            this.velocidade = 0;
            this.exibirAlerta("sucesso", "Veículo desligado!");
            this.tocarSom('desligar');
            this.pararConsumoCombustivel();
        } else {
            this.exibirAlerta("erro", "O veículo já está desligado.");
        }
        this.atualizarStatusVisual();
        this.atualizarVelocidadeVisual();
    }

    acelerar() {
        if (this.ligado) {
            if (this.combustivel > 0) {
                if (this.velocidade < this.velocidadeMaxima) {
                    this.velocidade += 10;
                    if (this.velocidade > this.velocidadeMaxima) {
                        this.velocidade = this.velocidadeMaxima;
                    }
                    this.exibirAlerta("sucesso", "Acelerando...");
                    this.tocarSom('acelerar');
                } else {
                    this.exibirAlerta("erro", "Velocidade máxima atingida.");
                }
            } else {
                this.exibirAlerta("erro", "Sem combustível para acelerar.");
                this.desligar();
            }
        } else {
            this.exibirAlerta("erro", "Ligue o veículo para acelerar.");
        }
        this.atualizarVelocidadeVisual();
    }

    frear() {
        if (this.ligado) {
            if (this.velocidade > 0) {
                this.velocidade -= 15;
                if (this.velocidade < 0) {
                    this.velocidade = 0;
                }
                this.exibirAlerta("sucesso", "Freando...");
                this.tocarSom('frear');
            } else {
                this.exibirAlerta("erro", "O veículo já está parado.");
            }
            this.atualizarVelocidadeVisual();
        } else {
            this.exibirAlerta("erro", "Ligue o veículo para frear.");
        }
    }

    buzinar() {
        if (this.ligado && this.combustivel > 0) {
            this.tocarSom('buzina');
        } else {
            this.exibirAlerta("erro", "Sem combustível ou veículo desligado para buzinar.");
        }
    }

    reabastecer() {
        const quantidade = parseInt(prompt("Quanto combustível deseja adicionar?"));
        if (!isNaN(quantidade) && quantidade > 0) {
            if (this.combustivel + quantidade <= this.capacidadeCombustivel) {
                this.combustivel += quantidade;
                this.exibirAlerta("sucesso", `Abastecido com ${quantidade} unidades de combustível.`);
            } else {
                this.combustivel = this.capacidadeCombustivel;
                this.exibirAlerta("sucesso", "Tanque cheio!");
            }
            this.atualizarInformacoesVeiculo();
        } else {
            this.exibirAlerta("erro", "Por favor, insira uma quantidade válida para reabastecer.");
        }
    }

    exibirInformacoes() {
        return `<p>Modelo: ${this.modelo}</p>
                <p>Velocidade Máxima: ${this.velocidadeMaxima} km/h</p>
                <p>Combustível: ${this.combustivel.toFixed(2)} / ${this.capacidadeCombustivel} unidades</p>`; // Exibe o combustivel
    }

    // Métodos de Feedback (Visual e Sonoro)
    tocarSom(acao) {
        const audio = document.getElementById(`som-${acao}`);
        if (audio) {
            audio.currentTime = 0; // Reinicia o som
            audio.play();
        }
    }

    atualizarStatusVisual() {
        const statusTexto = document.getElementById('status-texto');
        const statusIcone = document.getElementById('status-icone');

        if (this.ligado) {
            statusTexto.textContent = 'Ligado';
            statusIcone.className = 'ligado';
        } else {
            statusTexto.textContent = 'Desligado';
            statusIcone.className = 'desligado';
        }
    }

    atualizarVelocidadeVisual() {
        const velocidadeValor = document.getElementById('velocidade-valor');
        const velocidadeBarra = document.getElementById('velocidade-barra');
        const porcentagemVelocidade = (this.velocidade / this.velocidadeMaxima) * 100;

        velocidadeValor.textContent = this.velocidade;
        velocidadeBarra.style.setProperty('--largura', porcentagemVelocidade + '%');

        // Cria e injeta o estilo diretamente no pseudo-elemento
        const style = document.createElement('style');
        style.innerHTML = `#velocidade-barra::after { width: ${porcentagemVelocidade}%; }`;
        document.head.appendChild(style);
    }

    exibirAlerta(tipo, mensagem) {
        const alertasContainer = document.getElementById('alertas-container');
        const alerta = document.createElement('div');
        alerta.classList.add('alerta', tipo);
        alerta.textContent = mensagem;
        alertasContainer.appendChild(alerta);

        // Remover o alerta após a animação
        alerta.addEventListener('animationend', () => {
            alerta.remove();
        });
    }

    // Métodos de Combustível
    iniciarConsumoCombustivel() {
        this.consumoInterval = setInterval(() => {
            this.combustivel -= this.consumoPorSegundo;
            if (this.combustivel <= 0) {
                this.combustivel = 0;
                this.desligar();
                this.exibirAlerta("erro", "Sem combustível! O veículo desligou.");
            }
            this.atualizarInformacoesVeiculo(); // Atualiza as informações de combustível
        }, 1000); // Atualiza a cada 1 segundo
    }

    pararConsumoCombustivel() {
        clearInterval(this.consumoInterval);
    }
    atualizarInformacoesVeiculo() {
        if (veiculoSelecionado) {
            veiculoInfo.innerHTML = veiculoSelecionado.exibirInformacoes();
        }
    }
}

class Carro extends Veiculo {
    constructor(modelo) {
        super(modelo, 180, 100); // Velocidade máxima e capacidade de combustível
    }

    exibirInformacoes() {
        return super.exibirInformacoes() + `<p>Tipo: Carro</p>`;
    }
}

class CarroEsportivo extends Veiculo {
    constructor(modelo) {
        super(modelo, 250, 80); // Velocidade máxima e capacidade de combustível
    }

    ativarTurbo() {
        if (this.ligado && this.combustivel > 0) {
            this.velocidade = this.velocidadeMaxima;
            this.exibirAlerta("sucesso", "Turbo ativado!");
            this.atualizarVelocidadeVisual();
        } else {
            this.exibirAlerta("erro", "Ligue o carro e tenha combustível para ativar o turbo.");
        }
    }

    exibirInformacoes() {
        return super.exibirInformacoes() + `<p>Tipo: Carro Esportivo</p>`;
    }
}

class Caminhao extends Veiculo {
    constructor(modelo) {
        super(modelo, 120, 200); // Velocidade máxima e capacidade de combustível
        this.capacidadeCarga = 5000; // kg
        this.cargaAtual = 0;
    }

    carregar(quantidade) {
        if (this.ligado) {
            if (this.combustivel > 0) {
                if (this.cargaAtual + quantidade <= this.capacidadeCarga) {
                    this.cargaAtual += quantidade;
                    this.exibirAlerta("sucesso", `Caminhão carregado com ${quantidade} kg.`);
                } else {
                    this.exibirAlerta("erro", "Capacidade máxima de carga excedida.");
                }
            } else {
                this.exibirAlerta("erro", "Sem combustível para carregar.");
                this.desligar();
            }
        } else {
            this.exibirAlerta("erro", "Ligue o caminhão para carregar.");
        }
    }

    exibirInformacoes() {
        return super.exibirInformacoes() + `<p>Tipo: Caminhão</p>
                <p>Capacidade de Carga: ${this.capacidadeCarga} kg</p>
                <p>Carga Atual: ${this.cargaAtual} kg</p>`;
    }
}

class Moto extends Veiculo {
    constructor(modelo) {
        super(modelo, 150, 30); // Velocidade máxima e capacidade de combustível
    }

    empinar() {
        if (this.ligado && this.combustivel > 0) {
            this.exibirAlerta("sucesso", "Moto empinando!");
        } else {
            this.exibirAlerta("erro", "Ligue a moto e tenha combustível para empinar.");
        }
    }

    exibirInformacoes() {
        return super.exibirInformacoes() + `<p>Tipo: Moto</p>`;
    }
}

// Instâncias dos veículos
let carro = new Carro("Sedan");
let carroEsportivo = new CarroEsportivo("Superveloz");
let caminhao = new Caminhao("CargaMax");
let moto = new Moto("CG-Titan");
let veiculoSelecionado = null;

// Elementos HTML
const veiculoTitulo = document.getElementById('veiculo-titulo');
const veiculoImagem = document.getElementById('veiculo-imagem');
const veiculoInfo = document.getElementById('veiculo-info');
const btnLigar = document.getElementById('ligar');
const btnDesligar = document.getElementById('desligar');
const btnAcelerar = document.getElementById('acelerar');
const btnFrear = document.getElementById('frear');
const btnBuzinar = document.getElementById('buzinar');
const btnTurbo = document.getElementById('turbo');
const btnCarregar = document.getElementById('carregar');
const btnEmpinar = document.createElement('button'); // Botão para empinar a moto
btnEmpinar.textContent = "Empinar";
btnEmpinar.id = "empinar";
btnEmpinar.style.display = 'none'; // Inicialmente escondido
document.getElementById('controles').appendChild(btnEmpinar); // Adiciona ao HTML
const btnReabastecer = document.createElement('button'); // Botão para reabastecer
btnReabastecer.textContent = "Reabastecer";
btnReabastecer.id = "reabastecer";
document.getElementById('controles').appendChild(btnReabastecer); // Adiciona ao HTML

// Funções de manipulação
function selecionarVeiculo(tipo) {
    switch (tipo) {
        case 'carro':
            veiculoSelecionado = carro;
            veiculoImagem.src = 'img/carro.png';
            break;
        case 'carro_esportivo':
            veiculoSelecionado = carroEsportivo;
            veiculoImagem.src = 'img/carro_esportivo.png';
            break;
        case 'caminhao':
            veiculoSelecionado = caminhao;
            veiculoImagem.src = 'img/caminhao.png';
            break;
        case 'moto':
            veiculoSelecionado = moto;
            veiculoImagem.src = 'img/moto.png';
            break;
        default:
            veiculoSelecionado = null;
            veiculoImagem.src = '';
            break;
    }

    if (veiculoSelecionado) {
        veiculoTitulo.textContent = `Veículo: ${veiculoSelecionado.modelo}`;
        veiculoInfo.innerHTML = veiculoSelecionado.exibirInformacoes();
        veiculoSelecionado.atualizarStatusVisual();
        veiculoSelecionado.atualizarVelocidadeVisual();
    } else {
        veiculoTitulo.textContent = 'Selecione um veículo';
        veiculoInfo.innerHTML = '';
    }

    // Mostra/Esconde botões específicos
    btnTurbo.style.display = tipo === 'carro_esportivo' ? 'inline-block' : 'none';
    btnCarregar.style.display = tipo === 'caminhao' ? 'inline-block' : 'none';
    btnEmpinar.style.display = tipo === 'moto' ? 'inline-block' : 'none';
}

// Eventos dos botões de seleção
document.querySelectorAll('#selecao-veiculo button').forEach(button => {
    button.addEventListener('click', function() {
        const tipoVeiculo = this.dataset.veiculo;
        selecionarVeiculo(tipoVeiculo);
    });
});

// Eventos dos botões de controle
btnLigar.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.ligar();
    }
});

btnDesligar.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.desligar();
    }
});

btnAcelerar.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.acelerar();
    }
});

btnFrear.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.frear();
    }
});

btnBuzinar.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.buzinar();
    }
});

btnTurbo.addEventListener('click', () => {
    if (veiculoSelecionado instanceof CarroEsportivo) {
        veiculoSelecionado.ativarTurbo();
    } else {
        exibirAlerta("erro", "Turbo disponível apenas para carros esportivos.");
    }
});

btnCarregar.addEventListener('click', () => {
    if (veiculoSelecionado instanceof Caminhao) {
        const carga = parseInt(prompt("Quantidade de carga a adicionar (kg):"));
        if (!isNaN(carga)) {
            veiculoSelecionado.carregar(carga);
            veiculoInfo.innerHTML = veiculoSelecionado.exibirInformacoes(); // Atualiza a exibição da carga
        } else {
            exibirAlerta("erro", "Por favor, insira uma quantidade válida.");
        }
    } else {
        exibirAlerta("erro", "Carregar disponível apenas para caminhões.");
    }
});

btnEmpinar.addEventListener('click', () => {
    if (veiculoSelecionado instanceof Moto) {
        veiculoSelecionado.empinar();
    } else {
        exibirAlerta("erro", "Empinar disponível apenas para motos.");
    }
});

btnReabastecer.addEventListener('click', () => {
    if (veiculoSelecionado) {
        veiculoSelecionado.reabastecer();
    }
});

// Função para exibir alertas estilizados
function exibirAlerta(tipo, mensagem) {
    const alertasContainer = document.getElementById('alertas-container');
    const alerta = document.createElement('div');
    alerta.classList.add('alerta', tipo);
    alerta.textContent = mensagem;
    alertasContainer.appendChild(alerta);

    // Remover o alerta após a animação
    alerta.addEventListener('animationend', () => {
        alerta.remove();
    });
}









