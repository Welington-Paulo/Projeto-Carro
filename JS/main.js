/**
 * @file main.js
 * @description Ponto de entrada principal para a aplicação Garagem Inteligente.
 */

import Garagem from './Garagem.js';
import {
    formAddVeiculo,
    selectTipoVeiculo,
    inputModelo,
    inputPlaca,
    labelCor,
    inputCor,
    labelEixos,
    inputEixos,
    labelCapacidade,
    inputCapacidade,
    listaVeiculosDiv,
    detalhesVeiculoSection,
    listaVeiculosSection,
    detalhesTitulo,
    detalhesVeiculoPlacaInput,
    detalhesImagemVeiculo,
    infoVeiculoDiv,
    detalhesStatusIndicator,
    detalhesStatusTexto,
    detalhesVelocidadeSpan,
    velocimetroBarra,
    infoCargaP,
    detalhesCargaAtualSpan,
    detalhesCargaCapacidadeSpan,
    historicoManutencaoDiv,
    formAgendarManutencao,
    manutencaoVeiculoPlacaInput,
    manutencaoDataInput,
    manutencaoTipoInput,
    manutencaoCustoInput,
    manutencaoDescricaoInput,
    btnVoltarLista,
    agendamentosFuturosDiv,
    btnLigarDesligar,
    btnAcelerar,
    btnFrear,
    btnBuzinar,
    btnTurbo,
    controlesCargaDiv,
    inputCarga,
    btnCarregar,
    btnDescarregar
} from './ui.js'; // Importa elementos do DOM
import { toggleCamposEspecificos } from './ui.js'; // Importa funções de manipulação de eventos
import { renderizarListaVeiculos, atualizarPainelVeiculo, mostrarDetalhesVeiculo, voltarParaLista, renderizarAgendamentosFuturos } from './ui.js'; // Importa funções de renderização
import { mostrarAlertaEstilizado } from './components/alert.js';
// Instancia a Garagem
const garagem = new Garagem();

// Adiciona Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado. Inicializando a garagem interativa...');
    toggleCamposEspecificos(); // Ajusta campos de add ao carregar
    renderizarListaVeiculos(garagem);
    renderizarAgendamentosFuturos(garagem);
    // Define volume inicial dos áudios
    const volumeControl = document.getElementById('volume');
    const audioElements = {
        buzina: document.getElementById('audio-buzina'),
        acelerar: document.getElementById('audio-acelerar'),
        frear: document.getElementById('audio-frear'),
        ligar: document.getElementById('audio-ligar'),
        desligar: document.getElementById('audio-desligar'),
    };
    const initialVolume = parseFloat(volumeControl.value);
    for (const key in audioElements) {
        if (audioElements[key]) {
            audioElements[key].volume = initialVolume;
        }
    }
    console.log('Garagem interativa inicializada.');
    // console.log('Estado inicial da garagem:', garagem.veiculos);
});

//selectTipoVeiculo.addEventListener('change', toggleCamposEspecificos);
formAgendarManutencao.addEventListener('submit', (event) => handleAgendarManutencaoSubmit(event, garagem));
btnVoltarLista.addEventListener('click', voltarParaLista);

// Event Listeners para Controles do Veículo
const detalhesVeiculoPlacaInput = document.getElementById('detalhes-veiculo-placa');
const btnLigarDesligar = document.getElementById('btn-ligar-desligar');
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
        renderizarListaVeiculos(garagem); // Atualiza status na lista também
        garagem.salvarNoLocalStorage();
    } catch (error) {
        mostrarAlertaEstilizado(error.message, 'warning');
    }
});

const btnAcelerar = document.getElementById('btn-acelerar');
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

const btnFrear = document.getElementById('btn-frear');
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

const btnBuzinar = document.getElementById('btn-buzinar');
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

const btnTurbo = document.getElementById('btn-turbo');
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

const btnCarregar = document.getElementById('btn-carregar');
const inputCarga = document.getElementById('input-carga');
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
    } else if (veiculo) {
        mostrarAlertaEstilizado(`Não é possível carregar um ${veiculo.tipoVeiculo}.`, 'warning');
    }
});

const btnDescarregar = document.getElementById('btn-descarregar');
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