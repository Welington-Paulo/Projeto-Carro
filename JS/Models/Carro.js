/**
 * @file Carro.js
 * @module models
 * @description Define a classe Carro, que herda da classe Veiculo.
 */

import Veiculo from './Veiculo.js';

/**
 * Classe que representa um carro.
 * Herda da classe Veiculo e adiciona a propriedade 'cor'.
 */
class Carro extends Veiculo {
    /**
     * Cria uma nova instância de Carro.
     * @param {string} modelo O modelo do carro.
     * @param {string} placa A placa do carro.
     * @param {string} cor A cor do carro.
     */
    constructor(modelo, placa, cor) {
        super(modelo, placa, 'Carro', 180, 'IMG/carro.png'); // VelMax e Imagem padrão para Carro
        /** @type {string} */
        this.cor = cor;
    }

    /**
     * Sobrescreve o método `getInfoBasica` da classe pai para incluir a cor do carro.
     * @param {boolean} [incluirVelocidade=false] Indica se a velocidade atual deve ser incluída na informação.
     * @returns {string} Uma string formatada com informações básicas do carro.
     */
    getInfoBasica(incluirVelocidade = false) {
         let info = super.getInfoBasica(incluirVelocidade);
         return info;
    }

     /**
      * Retorna um objeto com os dados do carro para serialização, incluindo a cor.
      * @returns {object} Um objeto contendo os dados do carro.
      */
     toJSON() {
        const data = super.toJSON(); // Pega os dados da classe pai
        return {
            ...data,
            cor: this.cor
        };
    }
}

export default Carro;