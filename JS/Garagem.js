/**
 * Classe para gerenciar uma garagem de veículos.
 */
class Garagem {
    /**
     * Cria uma nova garagem.
     */
    constructor() {
        this.veiculos = [];
        this.veiculoSelecionado = null;
    }

    /**
     * Adiciona um veículo à garagem.
     * @param {Veiculo} veiculo O veículo a ser adicionado.
     */
    adicionarVeiculo(veiculo) {
        this.veiculos.push(veiculo);
    }

    /**
     * Seleciona um veículo na garagem.
     * @param {number} indice O índice do veículo a ser selecionado.
     */
    selecionarVeiculo(indice) {
        if (indice >= 0 && indice < this.veiculos.length) {
            this.veiculoSelecionado = this.veiculos[indice];
            console.log(`Veículo selecionado: ${this.veiculoSelecionado.modelo}`);
        } else {
            console.log("Índice de veículo inválido.");
        }
    }

    /**
     * Interage com o veículo selecionado.
     * @param {string} acao A ação a ser executada no veículo.
     */
    interagir(acao) {
        if (this.veiculoSelecionado) {
            switch (acao) {
                case "ligar":
                    this.veiculoSelecionado.ligar();
                    break;
                case "desligar":
                    this.veiculoSelecionado.desligar();
                    break;
                case "acelerar":
                    this.veiculoSelecionado.acelerar(10);
                    break;
                case "frear":
                    this.veiculoSelecionado.frear(5);
                    break;
                case "buzinar":
                    this.veiculoSelecionado.buzinar();
                    break;
                case "ativarTurbo":
                    if (this.veiculoSelecionado instanceof CarroEsportivo) {
                        this.veiculoSelecionado.ativarTurbo();
                    } else {
                        console.log("Ação inválida para este veículo.");
                        alert("Ação inválida para este veículo. Apenas carros esportivos podem ativar o turbo.");
                    }
                    break;
                case "carregar":
                    if (this.veiculoSelecionado instanceof Caminhao) {
                        this.veiculoSelecionado.carregar(100);
                    } else {
                        console.log("Ação inválida para este veículo.");
                        alert("Ação inválida para este veículo. Apenas caminhões podem ser carregados.");
                    }
                    break;
                case "descarregar":
                    if (this.veiculoSelecionado instanceof Caminhao) {
                        this.veiculoSelecionado.descarregar(50);
                    } else {
                         console.log("Ação inválida para este veículo.");
                         alert("Ação inválida para este veículo. Apenas caminhões podem ser descarregados.");
                    }
                    break;
                default:
                    console.log("Ação inválida.");
            }
            this.atualizarInformacoesVeiculo(); // Atualiza a exibição após a interação
        } else {
            console.log("Nenhum veículo selecionado.");
        }
    }
    /**
     * Atualiza as informações do veículo no HTML.
     */
    atualizarInformacoesVeiculo() {
        const informacoesVeiculoDiv = document.getElementById("informacoesVeiculo");
        if (informacoesVeiculoDiv && this.veiculoSelecionado) {
            informacoesVeiculoDiv.textContent = this.veiculoSelecionado.exibirInformacoes();
        }

         const statusVeiculo = document.getElementById("statusVeiculo");
            if (statusVeiculo && this.veiculoSelecionado) {
                statusVeiculo.textContent = this.veiculoSelecionado.ligado ? "Ligado" : "Desligado";
                statusVeiculo.style.color = this.veiculoSelecionado.ligado ? "green" : "red";
            }

        if(this.veiculoSelecionado){
            this.veiculoSelecionado.atualizarVelocidadeBarra();
        }
    }
}