// JS/Manutencao.js
class Manutencao {
    constructor(data, tipo, custo, descricao = '') {
        if (!this.validarDados(data, tipo, custo)) {
            throw new Error("Dados inválidos para criar manutenção: Data, tipo e custo são obrigatórios e o custo deve ser positivo.");
        }
        this.data = data;
        this.tipo = tipo;
        this.custo = parseFloat(custo);
        this.descricao = descricao;
    }

    formatarManutencao() {
        const dataObj = new Date(this.data + 'T00:00:00'); 
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
        return `${this.tipo} em ${dataFormatada} - R$${this.custo.toFixed(2)}${this.descricao ? ' (' + this.descricao + ')' : ''}`;
    }

    validarDados(data, tipo, custo) {
        if (!data || !tipo || custo === undefined || custo === null) {
            console.error("Manutencao.validarDados: Data, tipo e custo são obrigatórios.");
            return false;
        }
        if (isNaN(parseFloat(custo)) || parseFloat(custo) < 0) {
            console.error("Manutencao.validarDados: Custo deve ser um número positivo.");
            return false;
        }
        try {
            if (isNaN(new Date(data + 'T00:00:00').getTime())) {
                console.error("Manutencao.validarDados: Data inválida.");
                return false;
            }
        } catch (e) {
            console.error("Manutencao.validarDados: Erro ao validar data.", e);
            return false;
        }
        return true;
    }

    toJSON() {
        return {
            _class: 'Manutencao',
            data: this.data,
            tipo: this.tipo,
            custo: this.custo,
            descricao: this.descricao,
        };
    }

    static fromJSON(json) {
        if (json._class !== 'Manutencao') {
            throw new Error("Objeto JSON não é do tipo Manutencao para desserialização.");
        }
        return new Manutencao(json.data, json.tipo, json.custo, json.descricao);
    }
}