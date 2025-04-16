/**
 * @file Manutencao.js
 * @module models
 * @description  Define a classe Manutencao para representar um registro de manutenção de um veículo.
 */

/**
 * Classe que representa uma manutenção realizada ou agendada para um veículo.
 */
class Manutencao {
    /**
     * Cria uma nova instância de Manutencao.
     * @param {string} data A data da manutenção no formato 'YYYY-MM-DD'.
     * @param {string} tipo O tipo de serviço realizado (ex: 'Troca de óleo', 'Revisão').
     * @param {number} custo O custo da manutenção.
     * @param {string} [descricao=''] Uma descrição opcional da manutenção.
     * @throws {Error} Se a data for inválida, o tipo for vazio ou o custo for um número negativo.
     */
    constructor(data, tipo, custo, descricao = '') {
        if (!this.validarData(data)) {
            throw new Error("Data da manutenção inválida.");
        }
        if (typeof tipo !== 'string' || tipo.trim() === '') {
            throw new Error("Tipo de serviço é obrigatório.");
        }
        const custoNum = parseFloat(custo);
        if (isNaN(custoNum) || custoNum < 0) {
            throw new Error("Custo da manutenção deve ser um número positivo ou zero.");
        }

        this.data = data; // Armazenar como string YYYY-MM-DD
        this.tipo = tipo.trim();
        this.custo = custoNum;
        this.descricao = descricao.trim();
    }

    /**
     * Valida se a string está no formato YYYY-MM-DD e é uma data real.
     * @param {string} dataStr A string da data a ser validada.
     * @returns {boolean} True se a data é válida, false caso contrário.
     */
    validarData(dataStr) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return false;
        const dataObj = new Date(dataStr + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
        return !isNaN(dataObj.getTime()) && dataObj.toISOString().slice(0, 10) === dataStr;
    }

    /**
     * Formata a data no formato YYYY-MM-DD para exibição no formato DD/MM/YYYY.
     * @param {string} [dataStr=this.data] A data a ser formatada. Se omitido, usa a data da instância.
     * @returns {string} A data formatada no formato DD/MM/YYYY.
     */
    formatarDataParaExibicao(dataStr = this.data) {
        // Converte YYYY-MM-DD para DD/MM/YYYY
        try {
            const [ano, mes, dia] = dataStr.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch (e) {
            return dataStr; // Retorna original se falhar
        }
    }

    /**
     * Formata a informação completa da manutenção para exibição.
     * @returns {string} Uma string formatada com o tipo, data e custo da manutenção.
     */
    formatar() {
        const dataFormatada = this.formatarDataParaExibicao();
        let str = `${this.tipo} em ${dataFormatada} - R$ ${this.custo.toFixed(2)}`;
        if (this.descricao) {
            str += ` (${this.descricao})`;
        }
        return str;
    }

    /**
     * Método estático para validar os dados antes de criar o objeto Manutencao.
     * @param {string} data A data da manutenção no formato 'YYYY-MM-DD'.
     * @param {string} tipo O tipo de serviço realizado.
     * @param {number} custo O custo da manutenção.
     * @returns {string[]} Um array de strings contendo os erros de validação, ou um array vazio se não houver erros.
     */
    static validarDados(data, tipo, custo) {
        const erros = [];
        const manutencaoTemp = new Manutencao('2000-01-01', 'teste', 0); // Objeto temporário para acessar validarData

        if (!manutencaoTemp.validarData(data)) {
            erros.push("Data inválida ou formato incorreto (use AAAA-MM-DD).");
        }
        if (typeof tipo !== 'string' || tipo.trim() === '') {
            erros.push("Tipo de serviço é obrigatório.");
        }
        const custoNum = parseFloat(custo);
        if (isNaN(custoNum) || custoNum < 0) {
            erros.push("Custo deve ser um número positivo ou zero.");
        }
        return erros;
    }

    /**
     * Verifica se a data da manutenção é futura.
     * @returns {boolean} True se a manutenção está agendada para o futuro, false caso contrário.
     */
    isAgendamentoFuturo() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
        const dataManutencao = new Date(this.data + 'T00:00:00');
        return dataManutencao >= hoje;
    }
}

export default Manutencao;