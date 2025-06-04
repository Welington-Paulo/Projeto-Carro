// JS/Carro.js
class Carro extends Veiculo {
    constructor(marca, modelo, ano, placa, cor, historicoManutencao = [], numeroPortas = 4) {
        super(marca, modelo, ano, placa, cor, historicoManutencao);
        this.numeroPortas = parseInt(numeroPortas) || 4;
    }

    exibirDetalhesCard() { 
        return `${super.exibirDetalhesBase()}, Portas: ${this.numeroPortas}, Motor: ${this.ligado ? 'ON' : 'OFF'}, Vel: ${this.velocidade}km/h`;
    }
    
    exibirInformacoes() { 
        return `
            ${super.exibirInformacoes()}<br>
            <strong>Portas:</strong> ${this.numeroPortas}
        `;
    }

    getVelocidadeMaximaPermitida() {
        return 200;
    }

    toJSON() {
        const json = super.toJSON();
        json.numeroPortas = this.numeroPortas;
        return json;
    }
}