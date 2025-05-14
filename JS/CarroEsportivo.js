// JS/CarroEsportivo.js
class CarroEsportivo extends Carro {
    constructor(marca, modelo, ano, placa, cor, historicoManutencao = [], velocidadeMaximaTurbo = 300) {
        super(marca, modelo, ano, placa, cor, historicoManutencao, 2);
        this.turboAtivado = false;
        this.velocidadeMaximaBase = super.getVelocidadeMaximaPermitida();
        this.velocidadeMaximaTurbo = parseInt(velocidadeMaximaTurbo) || 300;
    }

    ativarTurbo() {
        if (!this.ligado) return `${this.modelo} precisa estar ligado para ativar o turbo.`;
        if (!this.turboAtivado) {
            this.turboAtivado = true;
            return `Turbo do ${this.modelo} ATIVADO!`;
        }
        return `Turbo do ${this.modelo} já está ativado.`;
    }

    desativarTurbo() {
        if (this.turboAtivado) {
            this.turboAtivado = false;
            if (this.velocidade > this.velocidadeMaximaBase) {
                this.velocidade = this.velocidadeMaximaBase;
                return `Turbo DESATIVADO! Velocidade ajustada para ${this.velocidade} km/h.`;
            }
            return `Turbo do ${this.modelo} DESATIVADO!`;
        }
        return `Turbo do ${this.modelo} já está desativado.`;
    }

    getVelocidadeMaximaPermitida() {
        return this.turboAtivado ? this.velocidadeMaximaTurbo : this.velocidadeMaximaBase;
    }

    exibirDetalhesCard() {
        return `${super.exibirDetalhesCard().replace(`, Motor: ${this.ligado ? 'ON' : 'OFF'}, Vel: ${this.velocidade}km/h`,'')}, Vel.Máx: ${this.getVelocidadeMaximaPermitida()} km/h, Turbo: ${this.turboAtivado ? '<span style="color:orange;">ON</span>' : 'OFF'}, Motor: ${this.ligado ? 'ON' : 'OFF'}, Vel: ${this.velocidade}km/h`;
    }

    exibirInformacoes() {
        return `
            ${super.exibirInformacoes()}<br>
            <strong>Turbo:</strong> ${this.turboAtivado ? '<span style="color:var(--cor-destaque-aviso); font-weight:bold;">ATIVADO</span>' : 'Desativado'}<br>
            <strong>Vel. Máx. Permitida (Atual):</strong> ${this.getVelocidadeMaximaPermitida()} km/h
        `;
    }

    toJSON() {
        const json = super.toJSON();
        json.velocidadeMaximaTurbo = this.velocidadeMaximaTurbo;
        json.turboAtivado = this.turboAtivado; // Salva o estado do turbo
        return json;
    }
}