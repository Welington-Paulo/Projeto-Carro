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

        // Atributos para detalhes da API simulada
        this.modeloCompleto = modelo; 
        this.tipoCombustivel = "Não especificado";
        this.consumoCidade = "N/A";
        this.consumoEstrada = "N/A";
        this.tanqueCombustivelL = null;
        this.valorFIPE = "N/A"; // Novo
        this.recalls = []; // Novo
        this.dicaManutencao = ""; // Novo
        this.recursosAdicionais = [];
        this.autonomiaEstimadaKm = null;

        this.historicoManutencao = historicoManutencao.map(m =>
            m instanceof Manutencao ? m : Manutencao.fromJSON(m)
        );
    }

    ligar() { /* ... (como antes) ... */ 
        if (!this.ligado) {
            this.ligado = true;
            this.status = "Ligado"; 
            return `${this.modelo} agora está ligado.`;
        }
        return `${this.modelo} já está ligado.`;
    }
    desligar() { /* ... (como antes) ... */ 
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
    acelerar(incremento = 10) { /* ... (como antes) ... */
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
    frear(decremento = 10) { /* ... (como antes) ... */ 
        if (this.velocidade - decremento >= 0) {
            this.velocidade -= decremento;
        } else {
            this.velocidade = 0;
        }
        this.status = this.velocidade > 0 ? "Em Movimento" : (this.ligado ? "Ligado" : "Disponível");
        return `${this.modelo} ${this.velocidade === 0 ? 'parou' : 'freou para ' + this.velocidade + ' km/h'}.`;
    }
    buzinar() { /* ... (como antes) ... */
        return `${this.constructor.name} ${this.modelo} buzina: Beep! Beep!`;
     }
    getVelocidadeMaximaPermitida() { /* ... (como antes) ... */
        return 180;
     }
    adicionarManutencao(manutencao) { /* ... (como antes) ... */ 
        if (!(manutencao instanceof Manutencao)) {
            throw new Error("Objeto de manutenção inválido.");
        }
        this.historicoManutencao.push(manutencao);
        this.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
    }
    formatarHistoricoManutencao() { /* ... (como antes) ... */
        if (!this.historicoManutencao || this.historicoManutencao.length === 0) {
            return "<li>Nenhuma manutenção registrada.</li>";
        }
        return this.historicoManutencao
            .map(manutencao => `<li>${manutencao.formatarManutencao()}</li>`)
            .join('');
    }

    exibirDetalhesBase() { 
        return `Marca: ${this.marca}, Modelo: ${this.modelo}, Ano: ${this.ano}, Placa: ${this.placa}, Cor: ${this.cor}`;
    }

    exibirInformacoes() {
        let detalhesApiHtml = ``;
        // Verifica se há *qualquer* informação da API para exibir a seção de detalhes adicionais
        if (this.tipoCombustivel !== "Não especificado" || 
            this.recursosAdicionais.length > 0 || 
            this.valorFIPE !== "N/A" || 
            (this.recalls && this.recalls.length > 0) || 
            this.dicaManutencao) {
            
            detalhesApiHtml += `
                <hr class="info-divider">
                <strong>Detalhes Adicionais:</strong><br>
                ${this.modeloCompleto && this.modeloCompleto !== this.modelo ? `<strong>Modelo Detalhado:</strong> ${this.modeloCompleto}<br>` : ''}
                ${this.tipoCombustivel !== "Não especificado" ? `<strong>Combustível:</strong> ${this.tipoCombustivel}<br>` : ''}
                ${this.consumoCidade !== "N/A" ? `<strong>Consumo Cidade:</strong> ${this.consumoCidade}<br>`: ''}
                ${this.consumoEstrada !== "N/A" ? `<strong>Consumo Estrada:</strong> ${this.consumoEstrada}<br>`: ''}
                ${this.tanqueCombustivelL ? `<strong>Tanque:</strong> ${this.tanqueCombustivelL} L<br>` : ''}
                ${this.autonomiaEstimadaKm ? `<strong>Autonomia Estimada:</strong> ${this.autonomiaEstimadaKm.toFixed(0)} km (estrada)<br>` : ''}
                ${this.valorFIPE !== "N/A" ? `<strong>Valor FIPE (Ref.):</strong> ${this.valorFIPE}<br>` : ''}
                ${this.recalls && this.recalls.length > 0 ? `<strong>Recalls:</strong> <ul style="padding-left:15px; margin-top:0;">${this.recalls.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
                ${this.dicaManutencao ? `<strong>Dica de Manutenção:</strong> ${this.dicaManutencao}<br>` : ''}
                ${this.recursosAdicionais.length > 0 ? `<strong>Recursos:</strong> ${this.recursosAdicionais.join(', ')}<br>` : ''}
            `;
        }

        return `
            <strong>Tipo:</strong> ${this.constructor.name}<br>
            <strong>Modelo:</strong> ${this.modelo} (${this.marca}, ${this.ano})<br>
            <strong>Placa:</strong> ${this.placa}<br>
            <strong>Cor:</strong> ${this.cor}<br>
            <strong>Status Geral:</strong> ${this.status}<br>
            <strong>Motor:</strong> ${this.ligado ? 'Ligado <span style="color:var(--cor-destaque-sucesso);">⬤</span>' : 'Desligado <span style="color:var(--cor-destaque-erro);">⬤</span>'}<br>
            <strong>Velocidade:</strong> ${this.velocidade} km/h
            ${detalhesApiHtml}
        `;
    }
    
    atualizarDetalhesDaApi(detalhesApi) {
        if (!detalhesApi) return;
        this.modeloCompleto = detalhesApi.modeloCompleto || this.modelo;
        this.tipoCombustivel = detalhesApi.tipoCombustivel || this.tipoCombustivel;
        this.consumoCidade = detalhesApi.consumoCidade || this.consumoCidade;
        this.consumoEstrada = detalhesApi.consumoEstrada || this.consumoEstrada;
        this.tanqueCombustivelL = detalhesApi.tanqueCombustivelL || this.tanqueCombustivelL;
        this.valorFIPE = detalhesApi.valorFIPE || this.valorFIPE;
        this.recalls = detalhesApi.recalls || this.recalls;
        this.dicaManutencao = detalhesApi.dicaManutencao || this.dicaManutencao;
        this.recursosAdicionais = detalhesApi.recursosAdicionais || this.recursosAdicionais;
        this.calcularAutonomia();
    }

    calcularAutonomia() {
        if (this.tanqueCombustivelL && this.consumoEstrada && this.consumoEstrada !== "N/A") {
            const match = this.consumoEstrada.match(/(\d+(\.\d+)?)\s*km\/l/i);
            if (match && match[1]) {
                const consumoKmPorLitro = parseFloat(match[1]);
                if (!isNaN(consumoKmPorLitro) && consumoKmPorLitro > 0) {
                    this.autonomiaEstimadaKm = this.tanqueCombustivelL * consumoKmPorLitro;
                } else { this.autonomiaEstimadaKm = null; }
            } else { this.autonomiaEstimadaKm = null; }
        } else { this.autonomiaEstimadaKm = null; }
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
            // Atributos da API simulada
            modeloCompleto: this.modeloCompleto,
            tipoCombustivel: this.tipoCombustivel,
            consumoCidade: this.consumoCidade,
            consumoEstrada: this.consumoEstrada,
            tanqueCombustivelL: this.tanqueCombustivelL,
            valorFIPE: this.valorFIPE,
            recalls: this.recalls,
            dicaManutencao: this.dicaManutencao,
            recursosAdicionais: this.recursosAdicionais,
            autonomiaEstimadaKm: this.autonomiaEstimadaKm,
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
        veiculo.ligado = json.ligado === true; 
        veiculo.velocidade = json.velocidade || 0;
        
        // Atributos da API simulada (com defaults)
        veiculo.modeloCompleto = json.modeloCompleto || veiculo.modelo;
        veiculo.tipoCombustivel = json.tipoCombustivel || "Não especificado";
        veiculo.consumoCidade = json.consumoCidade || "N/A";
        veiculo.consumoEstrada = json.consumoEstrada || "N/A";
        veiculo.tanqueCombustivelL = json.tanqueCombustivelL || null;
        veiculo.valorFIPE = json.valorFIPE || "N/A";
        veiculo.recalls = json.recalls || [];
        veiculo.dicaManutencao = json.dicaManutencao || "";
        veiculo.recursosAdicionais = json.recursosAdicionais || [];
        veiculo.autonomiaEstimadaKm = json.autonomiaEstimadaKm || null; 

        if (json.historicoManutencao && Array.isArray(json.historicoManutencao)) {
            veiculo.historicoManutencao = json.historicoManutencao.map(mJson => Manutencao.fromJSON(mJson));
            veiculo.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
        } else {
            veiculo.historicoManutencao = [];
        }
        return veiculo;
    }
}