/**
 * @file Veiculo.js
 * @module models
 * @description Define a classe Veiculo, a classe base para todos os tipos de veículos.
 */
import Manutencao from './Manutencao.js';
import { tocarSom } from '../components/audio.js';

/**
 * Classe base para representar um veículo genérico.
 */
class Veiculo {
    /**
     * Cria uma nova instância de Veiculo.
     * @param {string} modelo O modelo do veículo.
     * @param {string} placa A placa do veículo.
     * @param {string} [tipoVeiculo='Veiculo'] O tipo do veículo (ex: 'Carro', 'Caminhao').
     * @param {number} [velocidadeMax=180] A velocidade máxima do veículo em km/h.
     * @param {string} [imagemUrl='images/carro.png'] A URL da imagem do veículo.
     * @throws {Error} Se o modelo ou a placa não forem fornecidos.
     */
    constructor(modelo, placa, tipoVeiculo = 'Veiculo', velocidadeMax = 180, imagemUrl = 'images/carro.png') {
        if (!modelo || !placa) {
            throw new Error("Modelo e Placa são obrigatórios.");
        }
        /** @type {string} */
        this.modelo = modelo;
        /** @type {string} */
        this.placa = placa;
        /** @type {string} */
        this.status = "Disponível"; // Pode coexistir com 'ligado'
        /** @type {Manutencao[]} */
        this.historicoManutencao = [];
        /** @type {string} */
        this.tipoVeiculo = tipoVeiculo;

        /** @type {boolean} */
        this.ligado = false;
        /** @type {number} */
        this.velocidadeAtual = 0;
        /** @type {number} */
        this.velocidadeMax = velocidadeMax;
        /** @type {string} */
        this.imagemUrl = imagemUrl;
    }

    /**
     * Liga o veículo.
     * @throws {Error} Se o veículo já estiver ligado.
     */
    ligar() {
        if (this.ligado) {
            throw new Error("O veículo já está ligado.");
        }
        this.ligado = true;
        tocarSom('ligar');
        console.log(`${this.modelo} (${this.placa}) ligado.`);
    }

    /**
     * Desliga o veículo.
     * @throws {Error} Se o veículo já estiver desligado ou se estiver em movimento.
     */
    desligar() {
        if (!this.ligado) {
            throw new Error("O veículo já está desligado.");
        }
        if (this.velocidadeAtual > 0) {
            throw new Error("Não é possível desligar o veículo em movimento.");
        }
        this.ligado = false;
        tocarSom('desligar');
        console.log(`${this.modelo} (${this.placa}) desligado.`);
    }

    /**
     * Acelera o veículo.
     * @param {number} [valor=10] O valor a ser incrementado na velocidade atual.
     * @throws {Error} Se o veículo estiver desligado ou se a velocidade máxima for atingida.
     */
    acelerar(valor = 10) {
        if (!this.ligado) {
            throw new Error("Não é possível acelerar um veículo desligado.");
        }
        if (this.velocidadeAtual >= this.velocidadeMax) {
             this.velocidadeAtual = this.velocidadeMax; // Garante que não ultrapasse
             throw new Error("Velocidade máxima atingida.");
        }
        this.velocidadeAtual = Math.min(this.velocidadeAtual + valor, this.velocidadeMax);
        tocarSom('acelerar');
        console.log(`${this.modelo} acelerou para ${this.velocidadeAtual} km/h.`);
    }

    /**
     * Freia o veículo.
     * @param {number} [valor=15] O valor a ser decrementado da velocidade atual.
     * @throws {Error} Se o veículo já estiver parado.
     */
    frear(valor = 15) {
        if (this.velocidadeAtual === 0) {
            throw new Error("O veículo já está parado.");
        }
        this.velocidadeAtual = Math.max(0, this.velocidadeAtual - valor);
        tocarSom('frear');
        console.log(`${this.modelo} freou para ${this.velocidadeAtual} km/h.`);
    }

    /**
     * Buzina o veículo.
     * @throws {Error} Se o veículo estiver desligado.
     */
    buzinar() {
         if (!this.ligado) {
             throw new Error("Ligue o veículo para buzinar!");
         }
        tocarSom('buzina');
        console.log(`${this.modelo} (${this.placa}) buzinou!`);
    }

    /**
     * Adiciona uma manutenção ao histórico do veículo.
     * @param {Manutencao} manutencao A manutenção a ser adicionada.
     * @throws {Error} Se o item adicionado não for uma instância de Manutencao.
     */
    adicionarManutencao(manutencao) {
        if (!(manutencao instanceof Manutencao)) {
            console.error("Tentativa de adicionar item inválido ao histórico:", manutencao);
            throw new Error("Item adicionado ao histórico deve ser uma instância de Manutencao.");
        }
        this.historicoManutencao.push(manutencao);
        this.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
        console.log(`Manutenção adicionada para ${this.placa}:`, manutencao.formatar());
    }

    /**
     * Obtém o histórico de manutenção formatado para exibição.
     * @returns {string} Uma string HTML contendo o histórico de manutenção formatado.
     */
    getHistoricoFormatado() {
        if (this.historicoManutencao.length === 0) {
            return "<p>Nenhum histórico de manutenção registrado.</p>";
        }
        return this.historicoManutencao
            .map(m => `<div class="manutencao-item">${m.formatar()}</div>`)
            .join('');
    }

    /**
     * Obtém os agendamentos futuros de manutenção.
     * @returns {Manutencao[]} Um array de objetos Manutencao representando os agendamentos futuros.
     */
    getAgendamentosFuturos() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return this.historicoManutencao.filter(m => m.isAgendamentoFuturo());
    }

    /**
     * Obtém os agendamentos futuros formatados para exibição.
     * @returns {string} Uma string HTML contendo os agendamentos futuros formatados.
     */
    getAgendamentosFuturosFormatado() {
        const agendamentos = this.getAgendamentosFuturos();
         if (agendamentos.length === 0) {
            return "<p>Nenhum agendamento futuro.</p>";
        }
        agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));
        return agendamentos
            .map(m => `<div class="agendamento-item">${m.formatar()}</div>`)
            .join('');
    }

    /**
     * Obtém informações básicas do veículo para exibição.
     * @param {boolean} [incluirVelocidade=false] Indica se a velocidade atual deve ser incluída na informação.
     * @returns {string} Uma string formatada com informações básicas do veículo.
     */
    getInfoBasica(incluirVelocidade = false) {
        let info = `<strong>${this.modelo} (${this.placa})</strong>`;
         if (this.cor) info += ` - Cor: ${this.cor}`;
         if (this.numEixos) info += ` - Eixos: ${this.numEixos}`;
        return info;
    }

     /**
      * Retorna um objeto com os dados do veículo para serialização (ex: para salvar no localStorage).
      * @returns {object} Um objeto contendo os dados do veículo.
      */
     toJSON() {
        return {
            modelo: this.modelo,
            placa: this.placa,
            status: this.status,
            historicoManutencao: this.historicoManutencao,
            tipoVeiculo: this.tipoVeiculo,
            ligado: this.ligado,
            velocidadeAtual: this.velocidadeAtual,
            velocidadeMax: this.velocidadeMax,
            imagemUrl: this.imagemUrl,
            cor: this.cor, // Adicionado para Carro
            numEixos: this.numEixos, // Adicionado para Caminhao
            capacidadeCarga: this.capacidadeCarga, // Adicionado para Caminhao
            cargaAtual: this.cargaAtual // Adicionado para Caminhao
        };
    }
}

export default Veiculo;