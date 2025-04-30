/**
 * Classe para caminhões, que herda de Veiculo.
 */
class Caminhao extends Veiculo {
    /**
     * Cria um novo caminhão.
     * @param {string} modelo O modelo do caminhão.
     * @param {string} cor A cor do caminhão.
     * @param {number} capacidadeCarga A capacidade de carga do caminhão em kg.
     */
    constructor(modelo, cor, capacidadeCarga) {
        super(modelo, cor);
        this.capacidadeCarga = capacidadeCarga;
        this.cargaAtual = 0;
    }

    /**
     * Carrega o caminhão.
     * @param {number} quantidade A quantidade de carga a ser adicionada.
     */
    carregar(quantidade) {
        if (this.cargaAtual + quantidade <= this.capacidadeCarga) {
            this.cargaAtual += quantidade;
            console.log(`${this.modelo} carregado com ${quantidade} kg. Carga atual: ${this.cargaAtual} kg`);
        } else {
            console.log(`${this.modelo} não pode carregar essa quantidade. Capacidade máxima excedida.`);
        }
    }

    /**
     * Descarrega o caminhão.
     * @param {number} quantidade A quantidade de carga a ser removida.
     */
    descarregar(quantidade) {
        this.cargaAtual = Math.max(0, this.cargaAtual - quantidade);
        console.log(`${this.modelo} descarregado com ${quantidade} kg. Carga atual: ${this.cargaAtual} kg`);
    }

    /**
     * Sobrescreve o método exibirInformacoes() para incluir a capacidade de carga e a carga atual.
     * @returns {string} Uma string formatada com as informações do caminhão.
     */
    exibirInformacoes() {
        return `${super.exibirInformacoes()}, Capacidade de Carga: ${this.capacidadeCarga} kg, Carga Atual: ${this.cargaAtual} kg`;
    }
}