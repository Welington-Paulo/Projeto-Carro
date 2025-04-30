/**
 * Classe para carros esportivos, que herda de Carro.
 */
class CarroEsportivo extends Carro {
    /**
     * Cria um novo carro esportivo.
     * @param {string} modelo O modelo do carro esportivo.
     * @param {string} cor A cor do carro esportivo.
     */
    constructor(modelo, cor) {
        super(modelo, cor, 2); // Carros esportivos geralmente têm 2 portas
        this.turboAtivado = false;
    }

    /**
     * Ativa o turbo do carro esportivo.
     */
    ativarTurbo() {
        this.turboAtivado = true;
        console.log(`${this.modelo} turbo ativado!`);
    }

    /**
     * Desativa o turbo do carro esportivo.
     */
    desativarTurbo() {
        this.turboAtivado = false;
        console.log(`${this.modelo} turbo desativado.`);
    }

    /**
     * Sobrescreve o método exibirInformacoes() para incluir o status do turbo.
     * @returns {string} Uma string formatada com as informações do carro esportivo.
     */
    exibirInformacoes() {
        return `${super.exibirInformacoes()}, Turbo: ${this.turboAtivado ? 'Ativado' : 'Desativado'}`;
    }
}