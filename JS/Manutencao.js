/**
 * Classe para representar uma manutenção.
 */
class Manutencao {
    /**
     * Cria uma nova manutenção.
     * @param {string} data A data da manutenção (formato YYYY-MM-DD).
     * @param {string} tipo O tipo de serviço realizado.
     * @param {number} custo O custo da manutenção.
     * @param {string} [descricao] Uma descrição detalhada do serviço (opcional).
     */
    constructor(data, tipo, custo, descricao = "") {
        this.data = data;
        this.tipo = tipo;
        this.custo = custo;
        this.descricao = descricao;
    }

    /**
     * Retorna uma representação formatada da manutenção.
     * @returns {string} Uma string formatada com as informações da manutenção.
     */
    getDescricaoFormatada() {
        return `${this.tipo} em ${this.data} - R$${this.custo}`;
    }

    /**
     * Valida os dados da manutenção.
     * @returns {boolean} True se os dados são válidos, false caso contrário.
     */
    validarDados() {
        if (!this.data || !this.tipo || this.custo === undefined || this.custo === null) {
            alert("Por favor, preencha todos os campos obrigatórios da manutenção.");
            return false;
        }

        if (isNaN(new Date(this.data).getTime())) {
            alert("Data inválida. Use o formato AAAA-MM-DD.");
            return false;
        }

        if (typeof this.custo !== 'number' || this.custo <= 0) {
            alert("Custo inválido. Deve ser um número positivo.");
            return false;
        }

        return true;
    }
}