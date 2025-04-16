/**
 * @file Caminhao.js
 * @module models
 * @description Define a classe Caminhao, que herda da classe Veiculo.
 */

import Veiculo from './Veiculo.js';

/**
 * Classe que representa um caminhão.
 * Herda da classe Veiculo e adiciona as propriedades 'numEixos', 'capacidadeCarga' e 'cargaAtual'.
 */
class Caminhao extends Veiculo {
    /**
     * Cria uma nova instância de Caminhao.
     * @param {string} modelo O modelo do caminhão.
     * @param {string} placa A placa do caminhão.
     * @param {number} numEixos O número de eixos do caminhão.
     * @param {number} [capacidadeCarga=10000] A capacidade de carga do caminhão em kg.
     */
    constructor(modelo, placa, numEixos, capacidadeCarga) {
        super(modelo, placa, 'Caminhao', 120, 'IMG/caminhao.png'); // VelMax e Imagem para Caminhao
        /** @type {number} */
        this.numEixos = numEixos;
        /** @type {number} */
        this.capacidadeCarga = capacidadeCarga || 10000; // Default 10 Ton
        /** @type {number} */
        this.cargaAtual = 0;
    }

    /**
     * Carrega o caminhão com um determinado peso.
     * @param {number} peso O peso a ser carregado em kg.
     * @throws {Error} Se o caminhão estiver em movimento, o peso for inválido ou a capacidade máxima for excedida.
     */
    carregar(peso) {
        if (this.ligado && this.velocidadeAtual > 0) {
             throw new Error("Pare o caminhão antes de carregar/descarregar.");
        }
         const pesoNum = parseFloat(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
             throw new Error("Peso inválido para carregar.");
         }
        if (this.cargaAtual + pesoNum > this.capacidadeCarga) {
            throw new Error(`Não é possível carregar ${pesoNum}kg. Capacidade máxima de ${this.capacidadeCarga}kg excedida.`);
        }
        this.cargaAtual += pesoNum;
        console.log(`Caminhão ${this.modelo} carregado com ${pesoNum}kg. Carga total: ${this.cargaAtual}kg.`);
    }

    /**
     * Descarrega o caminhão com um determinado peso.
     * @param {number} peso O peso a ser descarregado em kg.
     * @throws {Error} Se o caminhão estiver em movimento, o peso for inválido ou se o peso a descarregar for maior que a carga atual.
     */
    descarregar(peso) {
         if (this.ligado && this.velocidadeAtual > 0) {
             throw new Error("Pare o caminhão antes de carregar/descarregar.");
        }
        const pesoNum = parseFloat(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
             throw new Error("Peso inválido para descarregar.");
         }
        if (pesoNum > this.cargaAtual) {
            throw new Error(`Não é possível descarregar ${pesoNum}kg. Carga atual é de apenas ${this.cargaAtual}kg.`);
        }
        this.cargaAtual -= pesoNum;
        console.log(`Caminhão ${this.modelo} descarregado ${pesoNum}kg. Carga total: ${this.cargaAtual}kg.`);
    }

     /**
      * Sobrescreve o método `getInfoBasica` da classe pai para incluir informações adicionais sobre o caminhão.
      * @param {boolean} [incluirVelocidade=false] Indica se a velocidade atual deve ser incluída na informação.
      * @returns {string} Uma string formatada com informações básicas do caminhão.
      */
     getInfoBasica(incluirVelocidade = false) {
        let info = super.getInfoBasica(incluirVelocidade);
        return info;
     }

      /**
       * Retorna um objeto com os dados do caminhão para serialização, incluindo número de eixos, capacidade de carga e carga atual.
       * @returns {object} Um objeto contendo os dados do caminhão.
       */
     toJSON() {
        const data = super.toJSON(); // Pega os dados da classe pai
        return {
            ...data,
            numEixos: this.numEixos,
            capacidadeCarga: this.capacidadeCarga,
            cargaAtual: this.cargaAtual
        };
    }
}

export default Caminhao;