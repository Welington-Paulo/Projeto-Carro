/**
 * @file CarroEsportivo.js
 * @module models
 * @description Define a classe CarroEsportivo, que herda da classe Carro.
 */

import Carro from './Carro.js';
import { mostrarAlertaEstilizado } from '../components/alert.js';

/**
 * Classe que representa um carro esportivo.
 * Herda da classe Carro e adiciona a funcionalidade de turbo.
 */
class CarroEsportivo extends Carro {
    /**
     * Cria uma nova instância de CarroEsportivo.
     * @param {string} modelo O modelo do carro esportivo.
     * @param {string} placa A placa do carro esportivo.
     * @param {string} cor A cor do carro esportivo.
     */
    constructor(modelo, placa, cor) {
        // Velocidade máxima maior e imagem específica
        super(modelo, placa, cor);
        /** @type {number} */
        this.velocidadeMax = 280; // Override
        /** @type {string} */
        this.imagemUrl = 'IMG/carro_esportivo.png'; // Override
        /** @type {string} */
        this.tipoVeiculo = 'CarroEsportivo';
    }

    /**
     * Ativa o turbo do carro esportivo, aumentando a velocidade.
     * @throws {Error} Se o carro esportivo estiver desligado ou se a velocidade atual for muito baixa.
     */
    ativarTurbo() {
        if (!this.ligado) {
            throw new Error("Ligue o carro esportivo para ativar o turbo!");
        }
        if (this.velocidadeAtual <= 50) {
             throw new Error("Velocidade muito baixa para ativar o turbo (precisa > 50 km/h).");
        }
        // Aumenta a velocidade máxima temporariamente ou dá um boost de aceleração
        this.acelerar(40); // Boost extra
        console.log(`TURBO ATIVADO no ${this.modelo}!`);
        mostrarAlertaEstilizado("TURBO ATIVADO!", 'info', 2000);
    }

     /**
      * Sobrescreve o método `getInfoBasica` da classe pai para incluir informações adicionais sobre o carro esportivo.
      * @param {boolean} [incluirVelocidade=false] Indica se a velocidade atual deve ser incluída na informação.
      * @returns {string} Uma string formatada com informações básicas do carro esportivo.
      */
     getInfoBasica(incluirVelocidade = false) {
         let info = super.getInfoBasica(incluirVelocidade);
         return info;
     }
}

export default CarroEsportivo;