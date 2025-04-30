/**
 * Classe para carros, que herda de Veiculo.
 */
class Carro extends Veiculo {
    /**
     * Cria um novo carro.
     * @param {string} modelo O modelo do carro.
     * @param {string} cor A cor do carro.
     * @param {number} numeroPortas O número de portas do carro.
     */
    constructor(modelo, cor, numeroPortas) {
        super(modelo, cor);
        this.numeroPortas = numeroPortas;
    }
}