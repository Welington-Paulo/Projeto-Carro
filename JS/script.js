// --- Alerta Estilizado ---
const alertElement = document.getElementById('custom-alert');
const alertMessageElement = document.getElementById('custom-alert-message');
let alertTimeout;

function mostrarAlertaEstilizado(message, type = 'error', duration = 4000) {
    alertElement.className = 'alert'; // Reset classes
    alertElement.classList.add(type); // Add specific type (error, success, info, warning)
    alertMessageElement.textContent = message;
    alertElement.style.display = 'block';

    // Clear previous timeout if exists
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // Auto-hide after duration
    alertTimeout = setTimeout(() => {
        alertElement.style.display = 'none';
    }, duration);
}

// --- Elementos de Áudio ---
const audioElements = {
    buzina: document.getElementById('audio-buzina'),
    acelerar: document.getElementById('audio-acelerar'),
    frear: document.getElementById('audio-frear'),
    ligar: document.getElementById('audio-ligar'),
    desligar: document.getElementById('audio-desligar'),
};
const volumeControl = document.getElementById('volume');

// Função para tocar som com controle de volume
function tocarSom(soundId) {
    const audioElement = audioElements[soundId];
    if (audioElement) {
        try {
            audioElement.volume = parseFloat(volumeControl.value); // Set volume
            audioElement.currentTime = 0; // Rewind to start
            audioElement.play().catch(e => console.warn(`Audio playback error [${soundId}]:`, e.message)); // Play and catch potential errors
        } catch (error) {
            console.error(`Error playing sound [${soundId}]:`, error);
        }
    } else {
        console.warn(`Audio element not found for id: ${soundId}`);
    }
}

// Ajustar volume de todos os áudios
volumeControl.addEventListener('input', () => {
    const volume = parseFloat(volumeControl.value);
    for (const key in audioElements) {
        if (audioElements[key]) {
            audioElements[key].volume = volume;
        }
    }
});


// --- Classe Manutencao (Sem alterações) ---
class Manutencao {
    // ... (código da classe Manutencao existente) ...
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

    // Valida se a string está no formato YYYY-MM-DD e é uma data real
    validarData(dataStr) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return false;
        const dataObj = new Date(dataStr + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
        return !isNaN(dataObj.getTime()) && dataObj.toISOString().slice(0, 10) === dataStr;
    }

    formatarDataParaExibicao(dataStr = this.data) {
         // Converte YYYY-MM-DD para DD/MM/YYYY
        try {
            const [ano, mes, dia] = dataStr.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch (e) {
            return dataStr; // Retorna original se falhar
        }
    }

    formatar() {
        const dataFormatada = this.formatarDataParaExibicao();
        let str = `${this.tipo} em ${dataFormatada} - R$ ${this.custo.toFixed(2)}`;
        if (this.descricao) {
            str += ` (${this.descricao})`;
        }
        return str;
    }

    // Método estático para validação antes de criar o objeto (útil para formulários)
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

    // Verifica se a data da manutenção é futura
    isAgendamentoFuturo() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
        const dataManutencao = new Date(this.data + 'T00:00:00');
        return dataManutencao >= hoje;
    }
}

// --- Classes de Veículo (Atualizadas) ---
class Veiculo {
    // Adiciona ligado, velocidadeAtual, velocidadeMax, imagemUrl
    constructor(modelo, placa, tipoVeiculo = 'Veiculo', velocidadeMax = 180, imagemUrl = 'images/carro.png') {
        if (!modelo || !placa) {
            throw new Error("Modelo e Placa são obrigatórios.");
        }
        this.modelo = modelo;
        this.placa = placa;
        this.status = "Disponível"; // Pode coexistir com 'ligado'
        this.historicoManutencao = [];
        this.tipoVeiculo = tipoVeiculo;

        // Novas propriedades
        this.ligado = false;
        this.velocidadeAtual = 0;
        this.velocidadeMax = velocidadeMax;
        this.imagemUrl = imagemUrl;
    }

    ligar() {
        if (this.ligado) {
            throw new Error("O veículo já está ligado.");
        }
        this.ligado = true;
        tocarSom('ligar');
        console.log(`${this.modelo} (${this.placa}) ligado.`);
    }

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

    frear(valor = 15) {
        if (this.velocidadeAtual === 0) {
            throw new Error("O veículo já está parado.");
        }
        this.velocidadeAtual = Math.max(0, this.velocidadeAtual - valor);
        tocarSom('frear');
        console.log(`${this.modelo} freou para ${this.velocidadeAtual} km/h.`);
    }

    buzinar() {
         if (!this.ligado) {
             throw new Error("Ligue o veículo para buzinar!");
         }
        tocarSom('buzina');
        console.log(`${this.modelo} (${this.placa}) buzinou!`);
    }

    // --- Métodos de Manutenção (existentes) ---
     adicionarManutencao(manutencao) {
        if (!(manutencao instanceof Manutencao)) {
            console.error("Tentativa de adicionar item inválido ao histórico:", manutencao);
            throw new Error("Item adicionado ao histórico deve ser uma instância de Manutencao.");
        }
        this.historicoManutencao.push(manutencao);
        this.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
        console.log(`Manutenção adicionada para ${this.placa}:`, manutencao.formatar());
    }

    getHistoricoFormatado() {
        if (this.historicoManutencao.length === 0) {
            return "<p>Nenhum histórico de manutenção registrado.</p>";
        }
        return this.historicoManutencao
            .map(m => `<div class="manutencao-item">${m.formatar()}</div>`)
            .join('');
    }

    getAgendamentosFuturos() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return this.historicoManutencao.filter(m => m.isAgendamentoFuturo());
    }

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


    // Método para facilitar a exibição básica (agora inclui status ligado/desligado)
    getInfoBasica(incluirVelocidade = false) {
        let info = `<strong>${this.modelo} (${this.placa})</strong>`;
         if (this.cor) info += ` - Cor: ${this.cor}`;
         if (this.numEixos) info += ` - Eixos: ${this.numEixos}`;
        // info += ` - Status: <span class="status-indicator ${this.ligado ? 'status-ligado' : 'status-desligado'}"></span> ${this.ligado ? 'Ligado' : 'Desligado'}`;
        // if(incluirVelocidade) info += ` - Vel: ${this.velocidadeAtual} km/h`;
       return info;
    }
     // Retorna dados para serialização, incluindo novos campos
     toJSON() {
        return {
            modelo: this.modelo,
            placa: this.placa,
            status: this.status,
            historicoManutencao: this.historicoManutencao, // Manutencao também precisa ser serializável ou re-hidratado
            tipoVeiculo: this.tipoVeiculo,
            ligado: this.ligado,
            velocidadeAtual: this.velocidadeAtual,
            velocidadeMax: this.velocidadeMax,
            imagemUrl: this.imagemUrl,
            // Campos específicos das subclasses
            cor: this.cor,
            numEixos: this.numEixos,
            capacidadeCarga: this.capacidadeCarga,
            cargaAtual: this.cargaAtual
        };
    }

}

class Carro extends Veiculo {
    constructor(modelo, placa, cor) {
        super(modelo, placa, 'Carro', 180, 'IMG/carro.png'); // VelMax e Imagem padrão para Carro
        this.cor = cor;
    }
     getInfoBasica(incluirVelocidade = false) {
         let info = super.getInfoBasica(incluirVelocidade);
         // info += ` - Cor: ${this.cor}`; // Já incluído na versão atualizada do getInfoBasica do pai
         return info;
     }
}

class CarroEsportivo extends Carro {
    constructor(modelo, placa, cor) {
        // Velocidade máxima maior e imagem específica
        super(modelo, placa, cor);
        this.velocidadeMax = 280; // Override
        this.imagemUrl = 'IMG/carro_esportivo.png'; // Override
        this.tipoVeiculo = 'CarroEsportivo';
    }

    ativarTurbo() {
        if (!this.ligado) {
            throw new Error("Ligue o carro esportivo para ativar o turbo!");
        }
        if (this.velocidadeAtual <= 50) {
             throw new Error("Velocidade muito baixa para ativar o turbo (precisa > 50 km/h).");
        }
        // Aumenta a velocidade máxima temporariamente ou dá um boost de aceleração
        this.acelerar(40); // Boost extra
        console.log(`TURBO ATIVADO no ${this.modelo}!`);
        mostrarAlertaEstilizado("TURBO ATIVADO!", 'info', 2000);
    }

     getInfoBasica(incluirVelocidade = false) {
         let info = super.getInfoBasica(incluirVelocidade);
         // info += ` - Vel. Máx: ${this.velocidadeMax}km/h`; // Pode adicionar se quiser destacar
         return info;
     }
}

class Caminhao extends Veiculo {
    constructor(modelo, placa, numEixos, capacidadeCarga) {
        super(modelo, placa, 'Caminhao', 120, 'IMG/caminhao.png'); // VelMax e Imagem para Caminhao
        this.numEixos = numEixos;
        this.capacidadeCarga = capacidadeCarga || 10000; // Default 10 Ton
        this.cargaAtual = 0;
    }

    carregar(peso) {
        if (this.ligado && this.velocidadeAtual > 0) {
             throw new Error("Pare o caminhão antes de carregar/descarregar.");
        }
         const pesoNum = parseFloat(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
             throw new Error("Peso inválido para carregar.");
         }
        if (this.cargaAtual + pesoNum > this.capacidadeCarga) {
            throw new Error(`Não é possível carregar ${pesoNum}kg. Capacidade máxima de ${this.capacidadeCarga}kg excedida.`);
        }
        this.cargaAtual += pesoNum;
        console.log(`Caminhão ${this.modelo} carregado com ${pesoNum}kg. Carga total: ${this.cargaAtual}kg.`);
    }

    descarregar(peso) {
         if (this.ligado && this.velocidadeAtual > 0) {
             throw new Error("Pare o caminhão antes de carregar/descarregar.");
        }
        const pesoNum = parseFloat(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
             throw new Error("Peso inválido para descarregar.");
         }
        if (pesoNum > this.cargaAtual) {
            throw new Error(`Não é possível descarregar ${pesoNum}kg. Carga atual é de apenas ${this.cargaAtual}kg.`);
        }
        this.cargaAtual -= pesoNum;
        console.log(`Caminhão ${this.modelo} descarregado ${pesoNum}kg. Carga total: ${this.cargaAtual}kg.`);
    }

     getInfoBasica(incluirVelocidade = false) {
        let info = super.getInfoBasica(incluirVelocidade);
        // info += ` - Eixos: ${this.numEixos}`; // Já incluído
        // info += ` - Carga: ${this.cargaAtual}/${this.capacidadeCarga}kg`; // Mostrado separadamente na UI
        return info;
     }
     // Sobrescreve toJSON para incluir campos específicos de Caminhao
     toJSON() {
        const data = super.toJSON(); // Pega os dados da classe pai
        return {
            ...data,
            numEixos: this.numEixos,
            capacidadeCarga: this.capacidadeCarga,
            cargaAtual: this.cargaAtual
        };
    }
}


// --- Gerenciamento da Garagem e Persistência (Atualizado) ---
class Garagem {
    constructor() {
        this.veiculos = this.carregarDoLocalStorage();
    }

     adicionarVeiculo(veiculo) {
        if (!(veiculo instanceof Veiculo)) {
            throw new Error("Apenas objetos Veiculo podem ser adicionados.");
        }
        if (this.encontrarVeiculoPorPlaca(veiculo.placa)) {
             mostrarAlertaEstilizado(`Erro: Veículo com placa ${veiculo.placa} já existe.`, 'error');
             return false;
        }
        this.veiculos.push(veiculo);
        this.salvarNoLocalStorage();
        console.log(`Veículo ${veiculo.placa} adicionado.`);
        return true;
    }

    encontrarVeiculoPorPlaca(placa) {
        return this.veiculos.find(v => v.placa === placa);
    }

    removerVeiculo(placa) {
        const index = this.veiculos.findIndex(v => v.placa === placa);
        if (index > -1) {
            this.veiculos.splice(index, 1);
            this.salvarNoLocalStorage();
            console.log(`Veículo ${placa} removido.`);
            return true;
        }
        console.warn(`Veículo com placa ${placa} não encontrado para remoção.`);
        return false;
    }


    salvarNoLocalStorage() {
        try {
            // Usar o método toJSON de cada veículo para garantir que todos os dados sejam incluídos
            const veiculosParaSalvar = this.veiculos.map(veiculo => veiculo.toJSON());
            localStorage.setItem('garagemInteligente_veiculos_v2', JSON.stringify(veiculosParaSalvar)); // Use uma nova chave para evitar conflitos com a versão antiga
            console.log('Garagem salva no LocalStorage (v2).');
        } catch (error) {
            console.error("Erro ao salvar no LocalStorage:", error);
            mostrarAlertaEstilizado("Erro ao salvar dados da garagem. Verifique o console.", 'error');
        }
    }

    carregarDoLocalStorage() {
        try {
            const veiculosData = localStorage.getItem('garagemInteligente_veiculos_v2');
            if (!veiculosData) {
                console.log('Nenhum dado (v2) encontrado no LocalStorage.');
                return [];
            }

            const veiculosPlain = JSON.parse(veiculosData);

            return veiculosPlain.map(plainVeiculo => {
                let veiculo;
                // Recria a instância correta
                switch (plainVeiculo.tipoVeiculo) {
                    case 'Carro':
                        veiculo = new Carro(plainVeiculo.modelo, plainVeiculo.placa, plainVeiculo.cor);
                        break;
                    case 'CarroEsportivo':
                        veiculo = new CarroEsportivo(plainVeiculo.modelo, plainVeiculo.placa, plainVeiculo.cor);
                         // A velocidadeMax e imagem são definidas no construtor do CarroEsportivo
                        break;
                    case 'Caminhao':
                        veiculo = new Caminhao(plainVeiculo.modelo, plainVeiculo.placa, plainVeiculo.numEixos, plainVeiculo.capacidadeCarga);
                        break;
                    default:
                         console.warn(`Tipo de veículo desconhecido durante carregamento: ${plainVeiculo.tipoVeiculo}. Usando Veiculo base.`);
                         veiculo = new Veiculo(plainVeiculo.modelo, plainVeiculo.placa);
                }

                // Restaura o estado (propriedades que não estão no construtor ou que podem mudar)
                veiculo.status = plainVeiculo.status || "Disponível";
                veiculo.ligado = plainVeiculo.ligado || false;
                veiculo.velocidadeAtual = plainVeiculo.velocidadeAtual || 0;
                veiculo.velocidadeMax = plainVeiculo.velocidadeMax || veiculo.velocidadeMax; // Usa o do objeto ou o default da classe
                veiculo.imagemUrl = plainVeiculo.imagemUrl || veiculo.imagemUrl; // Usa o do objeto ou o default da classe

                 // Restaura campos específicos que podem não estar no construtor (se aplicável)
                 if (veiculo instanceof Caminhao) {
                     veiculo.cargaAtual = plainVeiculo.cargaAtual || 0;
                     veiculo.capacidadeCarga = plainVeiculo.capacidadeCarga || veiculo.capacidadeCarga; // Restaura a capacidade salva
                 }


                // Re-hidrata o histórico de manutenção (igual a antes)
                 if (plainVeiculo.historicoManutencao && Array.isArray(plainVeiculo.historicoManutencao)) {
                    veiculo.historicoManutencao = plainVeiculo.historicoManutencao.map(plainManutencao => {
                        try {
                            return new Manutencao(
                                plainManutencao.data,
                                plainManutencao.tipo,
                                plainManutencao.custo,
                                plainManutencao.descricao
                            );
                        } catch (e) {
                            console.error("Erro ao re-hidratar manutenção:", plainManutencao, e);
                            return null;
                        }
                    }).filter(m => m !== null);
                    veiculo.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
                 } else {
                     veiculo.historicoManutencao = []; // Garante que seja um array
                 }


                return veiculo;
            });
        } catch (error) {
            console.error("Erro ao carregar do LocalStorage:", error);
            mostrarAlertaEstilizado("Erro ao carregar dados da garagem (v2). Os dados podem estar corrompidos. Verifique o console.", 'error');
            // localStorage.removeItem('garagemInteligente_veiculos_v2'); // Opcional
            return [];
        }
    }
     getTodosAgendamentosFuturos() {
        let todosAgendamentos = [];
        this.veiculos.forEach(veiculo => {
            const agendamentosVeiculo = veiculo.getAgendamentosFuturos();
            agendamentosVeiculo.forEach(ag => {
                todosAgendamentos.push({ ...ag, veiculoInfo: veiculo.getInfoBasica() }); // Passa a instância para usar formatar
            });
        });
        todosAgendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));
        return todosAgendamentos;
    }

}

// --- Lógica da Interface (UI - Atualizada) ---
const garagem = new Garagem();

// Elementos do DOM (alguns novos)
const formAddVeiculo = document.getElementById('form-add-veiculo');
const selectTipoVeiculo = document.getElementById('tipo-veiculo');
const inputModelo = document.getElementById('modelo');
const inputPlaca = document.getElementById('placa');
const labelCor = document.getElementById('label-cor');
const inputCor = document.getElementById('cor');
const labelEixos = document.getElementById('label-eixos');
const inputEixos = document.getElementById('eixos');
const labelCapacidade = document.getElementById('label-capacidade');
const inputCapacidade = document.getElementById('capacidade');

const listaVeiculosDiv = document.getElementById('lista-veiculos');
const detalhesVeiculoSection = document.getElementById('detalhes-veiculo-section');
const listaVeiculosSection = document.getElementById('lista-veiculos-section');
const detalhesTitulo = document.getElementById('detalhes-titulo');
const detalhesVeiculoPlacaInput = document.getElementById('detalhes-veiculo-placa'); // Para saber qual veículo está nos detalhes
const detalhesImagemVeiculo = document.getElementById('detalhes-imagem-veiculo');
const infoVeiculoDiv = document.getElementById('info-veiculo'); // Para texto básico
const detalhesStatusIndicator = document.getElementById('detalhes-status-indicator');
const detalhesStatusTexto = document.getElementById('detalhes-status-texto');
const detalhesVelocidadeSpan = document.getElementById('detalhes-velocidade');
const velocimetroBarra = document.getElementById('velocimetro-barra');
const infoCargaP = document.getElementById('info-carga');
const detalhesCargaAtualSpan = document.getElementById('detalhes-carga-atual');
const detalhesCargaCapacidadeSpan = document.getElementById('detalhes-carga-capacidade');

const historicoManutencaoDiv = document.getElementById('historico-manutencao');
const formAgendarManutencao = document.getElementById('form-agendar-manutencao');
const manutencaoVeiculoPlacaInput = document.getElementById('manutencao-veiculo-placa'); // No form de manutenção
const manutencaoDataInput = document.getElementById('manutencao-data');
const manutencaoTipoInput = document.getElementById('manutencao-tipo');
const manutencaoCustoInput = document.getElementById('manutencao-custo');
const manutencaoDescricaoInput = document.getElementById('manutencao-descricao');
const btnVoltarLista = document.getElementById('btn-voltar-lista');

const agendamentosFuturosDiv = document.getElementById('lista-agendamentos-futuros');

// Botões de controle
const btnLigarDesligar = document.getElementById('btn-ligar-desligar');
const btnAcelerar = document.getElementById('btn-acelerar');
const btnFrear = document.getElementById('btn-frear');
const btnBuzinar = document.getElementById('btn-buzinar');
const btnTurbo = document.getElementById('btn-turbo');
const controlesCargaDiv = document.getElementById('controles-carga');
const inputCarga = document.getElementById('input-carga');
const btnCarregar = document.getElementById('btn-carregar');
const btnDescarregar = document.getElementById('btn-descarregar');


// --- Funções de Renderização e Atualização da UI ---

function renderizarListaVeiculos() {
    listaVeiculosDiv.innerHTML = '';
    if (garagem.veiculos.length === 0) {
        listaVeiculosDiv.innerHTML = '<p>Nenhum veículo na garagem.</p>';
        return;
    }

    garagem.veiculos.forEach(veiculo => {
        const veiculoDiv = document.createElement('div');
        veiculoDiv.className = 'veiculo-item';
        veiculoDiv.innerHTML = `
            <img src="${veiculo.imagemUrl}" alt="${veiculo.tipoVeiculo}" class="veiculo-imagem-lista" onerror="this.src='images/carro.png';"> <!-- Fallback image -->
            <div class="veiculo-info">
                 <p>${veiculo.getInfoBasica()}</p> <!-- Info básica sem status/velocidade aqui -->
                 <p>Status: <span class="status-indicator ${veiculo.ligado ? 'status-ligado' : 'status-desligado'}"></span> ${veiculo.ligado ? 'Ligado' : 'Desligado'}</p>
            </div>
            <div class="veiculo-acoes">
                <button onclick="mostrarDetalhesVeiculo('${veiculo.placa}')">Detalhes/Interagir</button>
                <button onclick="confirmarRemocaoVeiculo('${veiculo.placa}')" style="background-color: #d9534f;">Remover</button>
            </div>
        `;
        listaVeiculosDiv.appendChild(veiculoDiv);
    });
}

// Atualiza apenas os elementos visuais de status e velocidade
function atualizarPainelVeiculo(veiculo) {
     if (!veiculo) return;

     // Indicador e Texto de Status
     detalhesStatusIndicator.className = `status-indicator ${veiculo.ligado ? 'status-ligado' : 'status-desligado'}`;
     detalhesStatusTexto.textContent = veiculo.ligado ? 'Ligado' : 'Desligado';

     // Velocidade e Velocímetro
     detalhesVelocidadeSpan.textContent = veiculo.velocidadeAtual;
     const percentualVelocidade = veiculo.velocidadeMax > 0 ? (veiculo.velocidadeAtual / veiculo.velocidadeMax) * 100 : 0;
     velocimetroBarra.style.width = `${Math.min(percentualVelocidade, 100)}%`; // Garante que não passe de 100% visualmente

     // Botão Ligar/Desligar texto
     btnLigarDesligar.textContent = veiculo.ligado ? 'Desligar' : 'Ligar';

      // Carga (se for Caminhão)
     if (veiculo instanceof Caminhao) {
         infoCargaP.style.display = 'block';
         detalhesCargaAtualSpan.textContent = veiculo.cargaAtual;
         detalhesCargaCapacidadeSpan.textContent = veiculo.capacidadeCarga;
     } else {
         infoCargaP.style.display = 'none';
     }
}


function mostrarDetalhesVeiculo(placa) {
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    if (!veiculo) return;

    // Armazena a placa do veículo ativo nos detalhes
    detalhesVeiculoPlacaInput.value = placa;

    // Preenche informações estáticas e iniciais
    detalhesTitulo.textContent = `Detalhes e Interação - ${veiculo.modelo} (${veiculo.placa})`;
    detalhesImagemVeiculo.src = veiculo.imagemUrl;
     detalhesImagemVeiculo.onerror = () => { detalhesImagemVeiculo.src = 'IMG/carro.png'; }; // Fallback se a imagem falhar
    infoVeiculoDiv.innerHTML = `<p>${veiculo.getInfoBasica()}</p>`; // Info básica do veículo (modelo, cor, etc.)
    historicoManutencaoDiv.innerHTML = veiculo.getHistoricoFormatado();

    // Atualiza o painel dinâmico (status, velocidade, etc.)
    atualizarPainelVeiculo(veiculo);

    // Configura o formulário de manutenção para este veículo
    manutencaoVeiculoPlacaInput.value = placa; // Garante que o form de manutenção saiba a placa
    formAgendarManutencao.reset();

    // Mostra/Esconde botões/controles específicos do tipo
    btnTurbo.style.display = (veiculo instanceof CarroEsportivo) ? 'block' : 'none';
    controlesCargaDiv.style.display = (veiculo instanceof Caminhao) ? 'block' : 'none';
     if (veiculo instanceof Caminhao) {
        inputCarga.value = ''; // Limpa input de carga
     }


    // Mostra a seção de detalhes e esconde a lista/form de add
    detalhesVeiculoSection.style.display = 'block';
    listaVeiculosSection.style.display = 'none';
    document.getElementById('adicionar-veiculo').style.display = 'none';
    document.getElementById('agendamentos-futuros-section').style.display = 'none'; // Esconde agendamentos gerais também
}

function voltarParaLista() {
     detalhesVeiculoSection.style.display = 'none';
     listaVeiculosSection.style.display = 'block';
     document.getElementById('adicionar-veiculo').style.display = 'block';
     document.getElementById('agendamentos-futuros-section').style.display = 'block'; // Mostra agendamentos gerais de novo

     // Limpa seleção anterior
     detalhesVeiculoPlacaInput.value = '';
     manutencaoVeiculoPlacaInput.value = '';
}

function renderizarAgendamentosFuturos() {
    agendamentosFuturosDiv.innerHTML = '';
    const agendamentos = garagem.getTodosAgendamentosFuturos();

    if (agendamentos.length === 0) {
        agendamentosFuturosDiv.innerHTML = '<p>Nenhum agendamento futuro encontrado.</p>';
        return;
    }

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const amanhaStr = amanha.toISOString().slice(0, 10);

    agendamentos.forEach(ag => {
        const agendamentoDiv = document.createElement('div');
        agendamentoDiv.className = 'agendamento-item';
         // Acessa o método formatar da instância Manutencao dentro do objeto 'ag'
        agendamentoDiv.innerHTML = `<strong>${ag.veiculoInfo}:</strong> ${ag.formatar()}`;
        agendamentosFuturosDiv.appendChild(agendamentoDiv);

        if (ag.data === amanhaStr) {
            // Usar alerta estilizado para lembrete
            mostrarAlertaEstilizado(`Lembrete: Manutenção "${ag.tipo}" para ${ag.veiculoInfo.split(' - ')[0]} agendada para amanhã!`, 'info', 6000);
        }
    });
}

// --- Funções de Manipulação de Eventos ---

function handleAddVeiculoSubmit(event) {
    event.preventDefault();
    const tipo = selectTipoVeiculo.value;
    const modelo = inputModelo.value.trim();
    const placa = inputPlaca.value.trim().toUpperCase();
    const cor = inputCor.value.trim();
    const eixos = inputEixos.value;
    const capacidade = inputCapacidade.value;

    if (!/^[A-Z]{3}-\d{4}$/.test(placa)) {
        mostrarAlertaEstilizado("Formato de placa inválido. Use AAA-1234.", 'error');
        return;
    }

    try {
        let novoVeiculo;
        switch (tipo) {
            case 'Carro':
                if (!cor) throw new Error("Cor é obrigatória para Carro.");
                novoVeiculo = new Carro(modelo, placa, cor);
                break;
            case 'CarroEsportivo':
                if (!cor) throw new Error("Cor é obrigatória para Carro Esportivo.");
                novoVeiculo = new CarroEsportivo(modelo, placa, cor);
                break;
            case 'Caminhao':
                const numEixos = parseInt(eixos);
                const capCarga = parseFloat(capacidade);
                if (isNaN(numEixos) || numEixos < 2) throw new Error("Número de eixos inválido para Caminhão.");
                 if (isNaN(capCarga) || capCarga <= 0) throw new Error("Capacidade de carga inválida para Caminhão.");
                novoVeiculo = new Caminhao(modelo, placa, numEixos, capCarga);
                break;
            default:
                throw new Error("Tipo de veículo inválido.");
        }

       if(garagem.adicionarVeiculo(novoVeiculo)) {
           renderizarListaVeiculos();
           formAddVeiculo.reset();
           toggleCamposEspecificos();
           mostrarAlertaEstilizado(`Veículo ${modelo} (${placa}) adicionado com sucesso!`, 'success');
       }

    } catch (error) {
        console.error("Erro ao adicionar veículo:", error);
        mostrarAlertaEstilizado(`Erro ao adicionar veículo: ${error.message}`, 'error');
    }
}

function handleAgendarManutencaoSubmit(event) {
    event.preventDefault();
    const placaVeiculo = manutencaoVeiculoPlacaInput.value; // Pega do form de manutenção
    const data = manutencaoDataInput.value;
    const tipo = manutencaoTipoInput.value.trim();
    const custo = manutencaoCustoInput.value;
    const descricao = manutencaoDescricaoInput.value.trim();

    const veiculo = garagem.encontrarVeiculoPorPlaca(placaVeiculo);
    if (!veiculo) {
        mostrarAlertaEstilizado("Erro: Veículo não encontrado para agendar manutenção.", 'error');
        return;
    }

    const errosValidacao = Manutencao.validarDados(data, tipo, custo);
    if (errosValidacao.length > 0) {
        mostrarAlertaEstilizado("Por favor, corrija os seguintes erros:\n- " + errosValidacao.join("\n- "), 'error');
        return;
    }

    try {
        const novaManutencao = new Manutencao(data, tipo, custo, descricao);
        veiculo.adicionarManutencao(novaManutencao);
        garagem.salvarNoLocalStorage();

        // Atualiza apenas o histórico na seção de detalhes e a lista geral de agendamentos
        historicoManutencaoDiv.innerHTML = veiculo.getHistoricoFormatado();
        renderizarAgendamentosFuturos();
        formAgendarManutencao.reset();

        mostrarAlertaEstilizado(`Manutenção "${tipo}" agendada/registrada para ${veiculo.modelo} em ${novaManutencao.formatarDataParaExibicao()}!`, 'success');

    } catch (error) {
        console.error("Erro ao criar ou adicionar manutenção:", error);
        mostrarAlertaEstilizado(`Erro ao registrar manutenção: ${error.message}`, 'error');
    }
}

function confirmarRemocaoVeiculo(placa) {
     // Usar um confirm simples ou um modal customizado se preferir
    if (confirm(`Tem certeza que deseja remover o veículo com placa ${placa}?`)) {
        if (garagem.removerVeiculo(placa)) {
            if (detalhesVeiculoSection.style.display === 'block' && detalhesVeiculoPlacaInput.value === placa) {
                 voltarParaLista();
            }
            renderizarListaVeiculos();
            renderizarAgendamentosFuturos();
            mostrarAlertaEstilizado(`Veículo ${placa} removido.`, 'info');
        } else {
            mostrarAlertaEstilizado(`Erro: Não foi possível remover o veículo ${placa}.`, 'error');
        }
    }
}


function toggleCamposEspecificos() {
    const tipoSelecionado = selectTipoVeiculo.value;

    const mostrarCor = (tipoSelecionado === 'Carro' || tipoSelecionado === 'CarroEsportivo');
    labelCor.style.display = mostrarCor ? 'block' : 'none';
    inputCor.style.display = mostrarCor ? 'block' : 'none';
    inputCor.required = mostrarCor;
    if (!mostrarCor) inputCor.value = ''; // Limpa se oculto

    const mostrarEixos = (tipoSelecionado === 'Caminhao');
    labelEixos.style.display = mostrarEixos ? 'block' : 'none';
    inputEixos.style.display = mostrarEixos ? 'block' : 'none';
    inputEixos.required = mostrarEixos;
     if (!mostrarEixos) inputEixos.value = '';

     const mostrarCapacidade = (tipoSelecionado === 'Caminhao');
     labelCapacidade.style.display = mostrarCapacidade ? 'block' : 'none';
     inputCapacidade.style.display = mostrarCapacidade ? 'block' : 'none';
     inputCapacidade.required = mostrarCapacidade;
      if (!mostrarCapacidade) inputCapacidade.value = '';
}

// --- Event Listeners para Controles do Veículo ---

btnLigarDesligar.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    if (!veiculo) return;
    try {
        if (veiculo.ligado) {
            veiculo.desligar();
        } else {
            veiculo.ligar();
        }
        atualizarPainelVeiculo(veiculo);
        renderizarListaVeiculos(); // Atualiza status na lista também
        garagem.salvarNoLocalStorage();
    } catch (error) {
        mostrarAlertaEstilizado(error.message, 'warning');
    }
});

btnAcelerar.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    if (!veiculo) return;
    try {
        veiculo.acelerar(10); // Acelera valor fixo
        atualizarPainelVeiculo(veiculo);
        garagem.salvarNoLocalStorage();
    } catch (error) {
        mostrarAlertaEstilizado(error.message, 'warning');
    }
});

btnFrear.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    if (!veiculo) return;
    try {
        veiculo.frear(15); // Freia valor fixo
        atualizarPainelVeiculo(veiculo);
        garagem.salvarNoLocalStorage();
    } catch (error) {
        mostrarAlertaEstilizado(error.message, 'warning');
    }
});

btnBuzinar.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
     if (!veiculo) return;
     try {
        veiculo.buzinar();
        // Não precisa atualizar painel ou salvar, só toca o som
     } catch (error) {
          mostrarAlertaEstilizado(error.message, 'warning');
     }

});

btnTurbo.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    if (veiculo instanceof CarroEsportivo) {
        try {
            veiculo.ativarTurbo();
            atualizarPainelVeiculo(veiculo); // Atualiza velocidade
            garagem.salvarNoLocalStorage();
        } catch (error) {
            mostrarAlertaEstilizado(error.message, 'warning');
        }
    } else if (veiculo) {
         mostrarAlertaEstilizado(`Veículo ${veiculo.tipoVeiculo} não possui turbo.`, 'warning');
    }
});

btnCarregar.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    const peso = inputCarga.value;

    if (veiculo instanceof Caminhao) {
        try {
            veiculo.carregar(peso);
            atualizarPainelVeiculo(veiculo); // Atualiza carga
             inputCarga.value = ''; // Limpa input
            garagem.salvarNoLocalStorage();
             mostrarAlertaEstilizado(`Carregado ${peso}kg.`, 'success', 2000);
        } catch (error) {
            mostrarAlertaEstilizado(error.message, 'warning');
        }
    } else if(veiculo) {
         mostrarAlertaEstilizado(`Não é possível carregar um ${veiculo.tipoVeiculo}.`, 'warning');
    }
});

btnDescarregar.addEventListener('click', () => {
    const placa = detalhesVeiculoPlacaInput.value;
    const veiculo = garagem.encontrarVeiculoPorPlaca(placa);
    const peso = inputCarga.value;

     if (veiculo instanceof Caminhao) {
        try {
            veiculo.descarregar(peso);
            atualizarPainelVeiculo(veiculo);
            inputCarga.value = '';
            garagem.salvarNoLocalStorage();
            mostrarAlertaEstilizado(`Descarregado ${peso}kg.`, 'success', 2000);
        } catch (error) {
            mostrarAlertaEstilizado(error.message, 'warning');
        }
    } else if (veiculo) {
         mostrarAlertaEstilizado(`Não há carga para descarregar de um ${veiculo.tipoVeiculo}.`, 'warning');
    }
});


// --- Event Listeners Gerais ---
formAddVeiculo.addEventListener('submit', handleAddVeiculoSubmit);
selectTipoVeiculo.addEventListener('change', toggleCamposEspecificos);
formAgendarManutencao.addEventListener('submit', handleAgendarManutencaoSubmit);
btnVoltarLista.addEventListener('click', voltarParaLista);


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado. Inicializando a garagem interativa...');
    toggleCamposEspecificos(); // Ajusta campos de add ao carregar
    renderizarListaVeiculos();
    renderizarAgendamentosFuturos();
    // Define volume inicial dos áudios
     const initialVolume = parseFloat(volumeControl.value);
     for (const key in audioElements) {
         if (audioElements[key]) {
             audioElements[key].volume = initialVolume;
         }
     }
    console.log('Garagem interativa inicializada.');
    // console.log('Estado inicial da garagem:', garagem.veiculos);
});