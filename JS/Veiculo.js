// JS/Veiculo.js
class Veiculo {
    constructor(marca, modelo, ano, placa, cor = "Branco", historicoManutencao = []) {
        if (!marca || !modelo || !ano || !placa) {
            throw new Error("Marca, modelo, ano e placa são obrigatórios para criar um veículo.");
        }
        this.marca = marca;
        this.modelo = modelo;
        this.ano = parseInt(ano);
        this.placa = placa.toUpperCase();
        this.cor = cor;
        this.status = "Disponível"; 

        this.ligado = false;
        this.velocidade = 0;

        this.historicoManutencao = historicoManutencao.map(m =>
            m instanceof Manutencao ? m : Manutencao.fromJSON(m)
        );
    }

    ligar() {
        if (!this.ligado) {
            this.ligado = true;
            this.status = "Ligado"; 
            return `${this.modelo} agora está ligado.`;
        }
        return `${this.modelo} já está ligado.`;
    }

    desligar() {
        if (this.ligado) {
            if (this.velocidade > 0) {
                return `${this.modelo} não pode ser desligado em movimento! (Vel: ${this.velocidade} km/h).`;
            }
            this.ligado = false;
            this.velocidade = 0;
            this.status = "Disponível"; 
            return `${this.modelo} agora está desligado.`;
        }
        return `${this.modelo} já está desligado.`;
    }

    acelerar(incremento = 10) {
        if (!this.ligado) {
            return `${this.modelo} precisa estar ligado para acelerar.`;
        }
        const velMaxima = this.getVelocidadeMaximaPermitida();
        if (this.velocidade + incremento <= velMaxima) {
            this.velocidade += incremento;
        } else {
            this.velocidade = velMaxima;
        }
        this.status = this.velocidade > 0 ? "Em Movimento" : "Ligado";
        return `${this.modelo} ${this.velocidade === velMaxima ? 'atingiu vel. máx. de' : 'acelerou para'} ${this.velocidade} km/h.`;
    }

    frear(decremento = 10) {
        if (this.velocidade - decremento >= 0) {
            this.velocidade -= decremento;
        } else {
            this.velocidade = 0;
        }
        this.status = this.velocidade > 0 ? "Em Movimento" : (this.ligado ? "Ligado" : "Disponível");
        return `${this.modelo} ${this.velocidade === 0 ? 'parou' : 'freou para ' + this.velocidade + ' km/h'}.`;
    }

    buzinar() {
        return `${this.constructor.name} ${this.modelo} buzina: Beep! Beep!`;
    }

    getVelocidadeMaximaPermitida() {
        return 180; 
    }

    exibirDetalhesBase() { 
        return `Marca: ${this.marca}, Modelo: ${this.modelo}, Ano: ${this.ano}, Placa: ${this.placa}, Cor: ${this.cor}`;
    }

    exibirInformacoes() {
        return `
            <strong>Tipo:</strong> ${this.constructor.name}<br>
            <strong>Modelo:</strong> ${this.modelo} (${this.marca}, ${this.ano})<br>
            <strong>Placa:</strong> ${this.placa}<br>
            <strong>Cor:</strong> ${this.cor}<br>
            <strong>Status Geral:</strong> ${this.status}<br>
            <strong>Motor:</strong> ${this.ligado ? 'Ligado <span style="color:var(--cor-destaque-sucesso);">⬤</span>' : 'Desligado <span style="color:var(--cor-destaque-erro);">⬤</span>'}<br>
            <strong>Velocidade:</strong> ${this.velocidade} km/h
        `;
    }

    adicionarManutencao(manutencao) {
        if (!(manutencao instanceof Manutencao)) {
            throw new Error("Objeto de manutenção inválido.");
        }
        this.historicoManutencao.push(manutencao);
        this.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    formatarHistoricoManutencao() {
        if (this.historicoManutencao.length === 0) {
            return "Nenhuma manutenção registrada.";
        }
        return this.historicoManutencao
            .map(manutencao => `<li>${manutencao.formatarManutencao()}</li>`)
            .join('');
    }

    toJSON() {
        return {
            _class: this.constructor.name,
            marca: this.marca,
            modelo: this.modelo,
            ano: this.ano,
            placa: this.placa,
            cor: this.cor,
            status: this.status,
            ligado: this.ligado,
            velocidade: this.velocidade,
            historicoManutencao: this.historicoManutencao.map(m => m.toJSON()),
        };
    }

    static fromJSON(json) {
        let veiculo;
        switch (json._class) {
            case 'Carro':
                veiculo = new Carro(json.marca, json.modelo, json.ano, json.placa, json.cor, [], json.numeroPortas);
                break;
            case 'CarroEsportivo':
                veiculo = new CarroEsportivo(json.marca, json.modelo, json.ano, json.placa, json.cor, [], json.velocidadeMaximaTurbo);
                if (json.hasOwnProperty('turboAtivado')) veiculo.turboAtivado = json.turboAtivado;
                break;
            case 'Caminhao':
                veiculo = new Caminhao(json.marca, json.modelo, json.ano, json.placa, json.cor, [], json.capacidadeCarga);
                if (json.hasOwnProperty('cargaAtual')) veiculo.cargaAtual = json.cargaAtual;
                break;
            case 'Veiculo':
                 veiculo = new Veiculo(json.marca, json.modelo, json.ano, json.placa, json.cor);
                 break;
            default:
                console.error("Veiculo.fromJSON: Tipo desconhecido:", json._class, json);
                throw new Error(`Tipo de veículo desconhecido para deserialização: ${json._class}`);
        }
        veiculo.status = json.status || "Disponível";
        veiculo.ligado = json.ligado === true; // Garante que seja booleano
        veiculo.velocidade = json.velocidade || 0;
        if (json.historicoManutencao && Array.isArray(json.historicoManutencao)) {
            veiculo.historicoManutencao = json.historicoManutencao.map(mJson => Manutencao.fromJSON(mJson));
            veiculo.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
        } else {
            veiculo.historicoManutencao = [];
        }
        return veiculo;
    }
}