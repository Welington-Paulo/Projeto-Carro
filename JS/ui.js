/**
 * @file ui.js
 * @description Lógica da Interface do Usuário (UI) para a aplicação Garagem Inteligente.
 */

import Veiculo from './Models/Veiculo.js';
import Carro from './Models/Carro.js';
import CarroEsportivo from './Models/CarroEsportivo.js';
import Caminhao from './Models/Caminhao.js';
import Manutencao from './Models/Manutencao';
import { mostrarAlertaEstilizado } from './components/alert.js';

// Elementos do DOM (alguns novos)
export const formAddVeiculo = document.getElementById('form-add-veiculo');
export const selectTipoVeiculo = document.getElementById('tipo-veiculo');
export const inputModelo = document.getElementById('modelo');
export const inputPlaca = document.getElementById('placa');
export const labelCor = document.getElementById('label-cor');
export const inputCor = document.getElementById('cor');
export const labelEixos = document.getElementById('label-eixos');
export const inputEixos = document.getElementById('eixos');
export const labelCapacidade = document.getElementById('label-capacidade');
export const inputCapacidade = document.getElementById('capacidade');

export const listaVeiculosDiv = document.getElementById('lista-veiculos');
export const detalhesVeiculoSection = document.getElementById('detalhes-veiculo-section');
export const listaVeiculosSection = document.getElementById('lista-veiculos-section');
export const detalhesTitulo = document.getElementById('detalhes-titulo');
export const detalhesVeiculoPlacaInput = document.getElementById('detalhes-veiculo-placa'); // Para saber qual veículo está nos detalhes
export const detalhesImagemVeiculo = document.getElementById('detalhes-imagem-veiculo');
export const infoVeiculoDiv = document.getElementById('info-veiculo'); // Para texto básico
export const detalhesStatusIndicator = document.getElementById('detalhes-status-indicator');
export const detalhesStatusTexto = document.getElementById('detalhes-status-texto');
export const detalhesVelocidadeSpan = document.getElementById('detalhes-velocidade');
export const velocimetroBarra = document.getElementById('velocimetro-barra');
export const infoCargaP = document.getElementById('info-carga');
export const detalhesCargaAtualSpan = document.getElementById('detalhes-carga-atual');
export const detalhesCargaCapacidadeSpan = document.getElementById('detalhes-carga-capacidade');

export const historicoManutencaoDiv = document.getElementById('historico-manutencao');
export const formAgendarManutencao = document.getElementById('form-agendar-manutencao');
export const manutencaoVeiculoPlacaInput = document.getElementById('manutencao-veiculo-placa'); // No form de manutenção
export const manutencaoDataInput = document.getElementById('manutencao-data');
export const manutencaoTipoInput = document.getElementById('manutencao-tipo');
export const manutencaoCustoInput = document.getElementById('manutencao-custo');
export const manutencaoDescricaoInput = document.getElementById('manutencao-descricao');
export const btnVoltarLista = document.getElementById('btn-voltar-lista');

export const agendamentosFuturosDiv = document.getElementById('lista-agendamentos-futuros');

// Botões de controle
export const btnLigarDesligar = document.getElementById('btn-ligar-desligar');
export const btnAcelerar = document.getElementById('btn-acelerar');
export const btnFrear = document.getElementById('btn-frear');
export const btnBuzinar = document.getElementById('btn-buzinar');
export const btnTurbo = document.getElementById('btn-turbo');
export const controlesCargaDiv = document.getElementById('controles-carga');
export const inputCarga = document.getElementById('input-carga');
export const btnCarregar = document.getElementById('btn-carregar');
export const btnDescarregar = document.getElementById('btn-descarregar');

// Botão de Adicionar Veículo
const adicionarVeiculoButton = document.getElementById('adicionar-veiculo-button');


/**
 * Renderiza a lista de veículos na interface.
 * @param {Garagem} garagem A instância da Garagem contendo os veículos.
 */
export function renderizarListaVeiculos(garagem) {
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

/**
 * Atualiza o painel de detalhes do veículo na interface.
 * @param {Veiculo} veiculo O veículo a ser exibido no painel de detalhes.
 */
export function atualizarPainelVeiculo(veiculo) {
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

/**
 * Exibe os detalhes de um veículo específico na interface.
 * @param {string} placa A placa do veículo cujos detalhes serão exibidos.
 */
export function mostrarDetalhesVeiculo(placa) {
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

/**
 * Volta para a lista de veículos na interface.
 */
export function voltarParaLista() {
    detalhesVeiculoSection.style.display = 'none';
    listaVeiculosSection.style.display = 'block';
    document.getElementById('adicionar-veiculo').style.display = 'block';
    document.getElementById('agendamentos-futuros-section').style.display = 'block'; // Mostra agendamentos gerais de novo

    // Limpa seleção anterior
    detalhesVeiculoPlacaInput.value = '';
    manutencaoVeiculoPlacaInput.value = '';
}

/**
 * Renderiza a lista de agendamentos futuros na interface.
 * @param {Garagem} garagem A instância da Garagem contendo os agendamentos.
 */
export function renderizarAgendamentosFuturos(garagem) {
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

/**
 * Manipula o envio do formulário para adicionar um veículo.
 * @param {Event} event O evento de envio do formulário.
 * @param {Garagem} garagem A instância da Garagem para adicionar o veículo.
 */
export function handleAddVeiculoSubmit(event, garagem) {
    // event.preventDefault();  Removi pq nao é mais um form
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

        if (garagem.adicionarVeiculo(novoVeiculo)) {
            renderizarListaVeiculos(garagem);
            formAddVeiculo.reset();
            toggleCamposEspecificos();
            mostrarAlertaEstilizado(`Veículo ${modelo} (${placa}) adicionado com sucesso!`, 'success');
        }

    } catch (error) {
        console.error("Erro ao adicionar veículo:", error);
        mostrarAlertaEstilizado(`Erro ao adicionar veículo: ${error.message}`, 'error');
    }
}

/**
 * Manipula o envio do formulário para agendar uma manutenção.
 * @param {Event} event O evento de envio do formulário.
 * @param {Garagem} garagem A instância da Garagem para agendar a manutenção.
 */
export function handleAgendarManutencaoSubmit(event, garagem) {
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
        renderizarAgendamentosFuturos(garagem);
        formAgendarManutencao.reset();

        mostrarAlertaEstilizado(`Manutenção "${tipo}" agendada/registrada para ${veiculo.modelo} em ${novaManutencao.formatarDataParaExibicao()}!`, 'success');

    } catch (error) {
        console.error("Erro ao criar ou adicionar manutenção:", error);
        mostrarAlertaEstilizado(`Erro ao registrar manutenção: ${error.message}`, 'error');
    }
}

/**
 * Confirma a remoção de um veículo da garagem.
 * @param {string} placa A placa do veículo a ser removido.
 */
export function confirmarRemocaoVeiculo(placa) {
    // Usar um confirm simples ou um modal customizado se preferir
    if (confirm(`Tem certeza que deseja remover o veículo com placa ${placa}?`)) {
        if (garagem.removerVeiculo(placa)) {
            if (detalhesVeiculoSection.style.display === 'block' && detalhesVeiculoPlacaInput.value === placa) {
                voltarParaLista();
            }
            renderizarListaVeiculos(garagem);
            renderizarAgendamentosFuturos(garagem);
            mostrarAlertaEstilizado(`Veículo ${placa} removido.`, 'info');
        } else {
            mostrarAlertaEstilizado(`Erro: Não foi possível remover o veículo ${placa}.`, 'error');
        }
    }
}

/**
 * Alterna a visibilidade dos campos específicos do tipo de veículo no formulário.
 */
export function toggleCamposEspecificos() {
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

// Event listener para o botão "Adicionar Veículo"
adicionarVeiculoButton.addEventListener('click', (event) => handleAddVeiculoSubmit(event, garagem));