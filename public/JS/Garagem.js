// JS/Garagem.js
class Garagem {
    constructor() {
        this.veiculos = [];
        this.veiculoSelecionado = null; 
        this.historicoInteracoes = []; 
    }

    adicionarVeiculo(veiculo) {
        if (!(veiculo instanceof Veiculo)) {
            console.error("Garagem.adicionarVeiculo: Tentativa de adicionar objeto que não é Veiculo.");
            return false;
        }
        if (this.veiculos.find(v => v.placa.toUpperCase() === veiculo.placa.toUpperCase())) {
            console.warn(`Garagem.adicionarVeiculo: Veículo com placa ${veiculo.placa} já existe.`);
            return false; 
        }
        this.veiculos.push(veiculo);
        console.log(`Garagem: ${veiculo.constructor.name} ${veiculo.modelo} (Placa: ${veiculo.placa}) adicionado.`);
        if (!this.veiculoSelecionado || this.veiculos.length === 1) {
            this.selecionarVeiculoPorReferencia(veiculo);
        }
        return true;
    }

    removerVeiculo(placa) {
        const placaUpperCase = placa.toUpperCase();
        const index = this.veiculos.findIndex(v => v.placa.toUpperCase() === placaUpperCase);
        if (index > -1) {
            const removido = this.veiculos.splice(index, 1)[0];
            console.log(`Garagem: Veículo ${removido.modelo} (Placa: ${placa}) removido.`);
            if (this.veiculoSelecionado === removido) {
                this.veiculoSelecionado = this.veiculos.length > 0 ? this.veiculos[0] : null; 
                if(this.veiculoSelecionado) this.registrarInteracao(`Veículo "${this.veiculoSelecionado.modelo}" auto-selecionado após remoção.`);
                else this.registrarInteracao("Nenhum veículo selecionado após remoção.");
            }
            return true;
        }
        console.warn(`Garagem.removerVeiculo: Veículo com placa ${placa} não encontrado.`);
        return false;
    }
    
    selecionarVeiculoPorReferencia(veiculo) {
        if (veiculo instanceof Veiculo && this.veiculos.includes(veiculo)) {
            if (this.veiculoSelecionado !== veiculo) { 
                this.veiculoSelecionado = veiculo;
                this.registrarInteracao(`Veículo "${veiculo.modelo}" selecionado para interação.`);
            }
            return true;
        }
        return false;
    }
    
    selecionarVeiculoPorPlaca(placa) {
        const veiculoEncontrado = this.encontrarVeiculo(placa);
        if (veiculoEncontrado) {
            return this.selecionarVeiculoPorReferencia(veiculoEncontrado);
        }
        this.registrarInteracao(`Tentativa de selecionar veículo com placa "${placa}" não encontrado.`, "aviso");
        return false;
    }

    getVeiculoSelecionado() {
        return this.veiculoSelecionado;
    }

    interagirComSelecionado(acao, valor) {
        if (!this.veiculoSelecionado) {
            const msg = "Nenhum veículo selecionado para interagir.";
            this.registrarInteracao(msg, "aviso");
            return msg;
        }

        let resultado = `Ação "${acao}" não reconhecida ou não aplicável para ${this.veiculoSelecionado.modelo}.`;
        let tipoLog = "aviso";

        try {
            switch (acao) {
                case "ligar": resultado = this.veiculoSelecionado.ligar(); tipoLog = "info"; break;
                case "desligar": resultado = this.veiculoSelecionado.desligar(); tipoLog = "info"; break;
                case "acelerar": resultado = this.veiculoSelecionado.acelerar(valor ? parseInt(valor) : undefined); tipoLog = "info"; break;
                case "frear": resultado = this.veiculoSelecionado.frear(valor ? parseInt(valor) : undefined); tipoLog = "info"; break;
                case "buzinar": resultado = this.veiculoSelecionado.buzinar(); tipoLog = "info"; break;
                case "ativarTurbo":
                    if (this.veiculoSelecionado instanceof CarroEsportivo) { resultado = this.veiculoSelecionado.ativarTurbo(); tipoLog = "info";}
                    break;
                case "desativarTurbo":
                    if (this.veiculoSelecionado instanceof CarroEsportivo) { resultado = this.veiculoSelecionado.desativarTurbo(); tipoLog = "info";}
                    break;
                case "carregar":
                    if (this.veiculoSelecionado instanceof Caminhao) { resultado = this.veiculoSelecionado.carregar(valor ? parseFloat(valor) : 0); tipoLog = "info";}
                    break;
                case "descarregar":
                    if (this.veiculoSelecionado instanceof Caminhao) { resultado = this.veiculoSelecionado.descarregar(valor ? parseFloat(valor) : 0); tipoLog = "info";}
                    break;
                default: tipoLog = "erro";
            }
        } catch (e) {
            resultado = `Erro ao executar "${acao}": ${e.message}`;
            tipoLog = "erro";
            console.error(resultado, e);
        }
        this.registrarInteracao(resultado, tipoLog);
        return resultado;
    }

    registrarInteracao(mensagem, tipo = "info") {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        this.historicoInteracoes.unshift({ timestamp, mensagem, tipo });
        if (this.historicoInteracoes.length > 15) this.historicoInteracoes.pop();
        
        if (typeof window.atualizarLogInteracoesUI === "function") {
            window.atualizarLogInteracoesUI();
        }
    }

    getHistoricoInteracoesFormatado() {
        if (this.historicoInteracoes.length === 0) {
            return '<li>Nenhuma interação registrada ainda.</li>';
        }
        return this.historicoInteracoes.map(item =>
            `<li class="log-${item.tipo}">[${item.timestamp}] ${item.mensagem}</li>`
        ).join('');
    }

    listarVeiculosParaCards() {
        if (this.veiculos.length === 0) {
            return "<p>Sua garagem está vazia. Adicione um veículo!</p>";
        }
        let listaHtml = "<ul>";
        const veiculosOrdenados = [...this.veiculos].sort((a,b) => a.placa.localeCompare(b.placa));

        veiculosOrdenados.forEach(veiculo => {
            const isSelecionado = this.veiculoSelecionado === veiculo;
            const detalhesCard = veiculo.exibirDetalhesCard ? veiculo.exibirDetalhesCard() : veiculo.exibirDetalhesBase();
            const detalhesEspecificosCard = detalhesCard.replace(veiculo.exibirDetalhesBase() + ', ', '');


            listaHtml += `
                <li class="${isSelecionado ? 'card-selecionado' : ''}" data-placa-veiculo="${veiculo.placa}">
                    <div class="card-header">
                        <strong>${veiculo.constructor.name} - ${veiculo.modelo}</strong>
                        <span>Placa: ${veiculo.placa}</span>
                    </div>
                    <p class="card-detalhes">${detalhesEspecificosCard}</p>
                    <div class="botoes-veiculo-card">
                        <button class="btn-card-selecionar" data-placa="${veiculo.placa}">Interagir</button>
                        <button class="btn-card-agendar secondary" onclick="abrirModalAgendamento('${veiculo.placa}')">Agendar Man.</button>
                        <button class="btn-card-historico secondary" onclick="exibirHistorico('${veiculo.placa}')">Ver Histórico</button>
                        <button class="btn-card-remover danger" onclick="confirmarRemocaoVeiculo('${veiculo.placa}', '${veiculo.modelo} (${veiculo.constructor.name})')">Remover</button>
                    </div>
                    <div id="historico-${veiculo.placa}" class="historico-veiculo" style="display:none;">
                        <h4>Histórico de Manutenção:</h4>
                        <ul>${veiculo.formatarHistoricoManutencao()}</ul>
                    </div>
                </li>`;
        });
        listaHtml += "</ul>";
        return listaHtml;
    }

    encontrarVeiculo(placa) {
        const placaUpperCase = placa.toUpperCase();
        return this.veiculos.find(v => v.placa.toUpperCase() === placaUpperCase);
    }

    salvarNoLocalStorage() {
        try {
            const veiculosParaSalvar = this.veiculos.map(v => v.toJSON());
            localStorage.setItem('garagemInteligenteProConnect', JSON.stringify(veiculosParaSalvar));
            console.log("Garagem salva no LocalStorage.");
        } catch (error) {
            console.error("Erro ao salvar garagem no LocalStorage:", error);
            throw new Error("Falha ao salvar dados no LocalStorage. Verifique o console.");
        }
    }

    carregarDoLocalStorage() {
        const dadosSalvos = localStorage.getItem('garagemInteligenteProConnect');
        if (dadosSalvos) {
            try {
                const veiculosArray = JSON.parse(dadosSalvos);
                this.veiculos = veiculosArray.map(jsonVeiculo => {
                    try {
                        return Veiculo.fromJSON(jsonVeiculo);
                    } catch (e) {
                        console.error("Erro ao desserializar um veículo. Item ignorado:", jsonVeiculo, e);
                        return null;
                    }
                }).filter(v => v !== null);

                if (this.veiculos.length > 0 && !this.veiculoSelecionado) {
                    this.selecionarVeiculoPorReferencia(this.veiculos[0]);
                }
                console.log("Garagem carregada do LocalStorage.");

            } catch (error) {
                console.error("Erro crítico ao carregar garagem do LocalStorage:", error);
                this.veiculos = [];
                this.veiculoSelecionado = null;
                throw new Error("Falha ao carregar dados. Os dados podem estar corrompidos.");
            }
        } else {
            this.veiculos = [];
            this.veiculoSelecionado = null;
            console.log("Nenhum dado da garagem encontrado no LocalStorage.");
        }
    }
}