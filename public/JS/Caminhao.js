// JS/Caminhao.js
class Caminhao extends Veiculo {
    constructor(marca, modelo, ano, placa, cor, historicoManutencao = [], capacidadeCarga = 5000) {
        super(marca, modelo, ano, placa, cor, historicoManutencao);
        this.capacidadeCarga = parseFloat(capacidadeCarga) || 5000;
        this.cargaAtual = 0;
    }

    carregar(peso) {
        peso = parseFloat(peso);
        if (isNaN(peso) || peso <= 0) return "Peso inválido para carregar.";
        if (this.cargaAtual + peso <= this.capacidadeCarga) {
            this.cargaAtual += peso;
            return `${this.modelo} carregado com ${peso.toFixed(1)} kg. Carga: ${this.cargaAtual.toFixed(1)} kg.`;
        } else {
            const espaco = this.capacidadeCarga - this.cargaAtual;
            if (espaco > 0) {
                this.cargaAtual += espaco;
                return `Capacidade excedida! Carregado com ${espaco.toFixed(1)} kg (limite). Carga: ${this.cargaAtual.toFixed(1)} kg.`;
            }
            return `Capacidade máxima (${this.capacidadeCarga.toFixed(1)} kg) já atingida.`;
        }
    }

    descarregar(peso) {
        peso = parseFloat(peso);
        if (isNaN(peso) || peso <= 0) return "Peso inválido para descarregar.";
        if (this.cargaAtual - peso >= 0) {
            this.cargaAtual -= peso;
            return `${this.modelo} descarregado em ${peso.toFixed(1)} kg. Carga: ${this.cargaAtual.toFixed(1)} kg.`;
        } else {
            const descarregado = this.cargaAtual;
            this.cargaAtual = 0;
            return `${this.modelo} descarregado (total ${descarregado.toFixed(1)} kg). Carga: 0 kg.`;
        }
    }

    getVelocidadeMaximaPermitida() {
        const velBase = 120;
        const fatorCarga = this.capacidadeCarga > 0 ? (this.cargaAtual / this.capacidadeCarga) : 0;
        return Math.max(60, Math.round(velBase * (1 - fatorCarga * 0.4))); 
    }
    
    exibirDetalhesCard() {
        return `${super.exibirDetalhesBase()}, Carga: ${this.cargaAtual.toFixed(0)}/${this.capacidadeCarga.toFixed(0)}kg, Motor: ${this.ligado ? 'ON' : 'OFF'}, Vel: ${this.velocidade}km/h`;
    }

    exibirInformacoes() {
        return `
            ${super.exibirInformacoes()}<br>
            <strong>Capacidade Carga:</strong> ${this.capacidadeCarga.toFixed(1)} kg<br>
            <strong>Carga Atual:</strong> ${this.cargaAtual.toFixed(1)} kg<br>
            <strong>Vel. Máx. Permitida (Atual):</strong> ${this.getVelocidadeMaximaPermitida().toFixed(0)} km/h
        `;
    }

    toJSON() {
        const json = super.toJSON();
        json.capacidadeCarga = this.capacidadeCarga;
        json.cargaAtual = this.cargaAtual;
        return json;
    }
}