// URLs das imagens dos veículos
const carroImagemURL = "URL_DA_IMAGEM_DO_CARRO";
const carroEsportivoImagemURL = "URL_DA_IMAGEM_DO_CARRO_ESPORTIVO";
const caminhaoImagemURL = "URL_DA_IMAGEM_DO_CAMINHAO";

// Cria os veículos
const meuCarro = new Carro("Sedan", "Prata", 4);
const meuCarroEsportivo = new CarroEsportivo("Esportivo", "Vermelho");
const meuCaminhao = new Caminhao("Caminhão", "Azul", 5000);

// Cria a garagem (opcional)
let garagem = new Garagem(); // Inicializa garagem aqui
garagem.adicionarVeiculo(meuCarro);
garagem.adicionarVeiculo(meuCarroEsportivo);
garagem.adicionarVeiculo(meuCaminhao);

// Funções para selecionar o veículo e interagir
function selecionarVeiculo(indice) {
    garagem.selecionarVeiculo(indice);
    atualizarInformacoesVeiculo();

    const imagemVeiculo = document.getElementById("imagemVeiculo");
    if (imagemVeiculo && garagem.veiculoSelecionado) {
        if (garagem.veiculoSelecionado instanceof Carro) {
            imagemVeiculo.src = carroImagemURL;
        } else if (garagem.veiculoSelecionado instanceof CarroEsportivo) {
            imagemVeiculo.src = carroEsportivoImagemURL;
        } else if (garagem.veiculoSelecionado instanceof Caminhao) {
            imagemVeiculo.src = caminhaoImagemURL;
        } else {
            imagemVeiculo.src = ""; // Limpa a imagem se o tipo de veículo não for reconhecido
        }
    }

    atualizarHistoricoManutencao();
    atualizarAgendamentosFuturos();
}

function interagir(acao) {
    garagem.interagir(acao);
}

function atualizarInformacoesVeiculo() {
    garagem.atualizarInformacoesVeiculo();
}

/**
 * Salva os dados da garagem no LocalStorage.
 * @param {Garagem} garagem A instância da classe Garagem a ser salva.
 */
function salvarGaragemLocalStorage(garagem) {
    // Converte o array de veículos para JSON, convertendo os objetos Manutencao para strings.
    const garagemJSON = JSON.stringify(garagem.veiculos.map(veiculo => {
        return {
            ...veiculo, // Copia as propriedades do veículo
            historicoManutencao: veiculo.historicoManutencao.map(manutencao => JSON.stringify(manutencao)), // Converte cada manutenção para string JSON
            __proto__: Object.getPrototypeOf(veiculo) //Preserva o protótipo
        };
    }));
    localStorage.setItem('garagem', garagemJSON);
    console.log("Garagem salva no LocalStorage.");
}

/**
 * Carrega os dados da garagem do LocalStorage.
 * @returns {Garagem} Uma nova instância da classe Garagem com os dados carregados.
 */
/**
 * Carrega os dados da garagem do LocalStorage. Se não houver dados, cria uma garagem vazia e a salva.
 * @returns {Garagem} Uma nova instância da classe Garagem com os dados carregados.
 */
function carregarGaragemLocalStorage() {
    const garagemJSON = localStorage.getItem('garagem');

    if (garagemJSON) {
        const garagemData = JSON.parse(garagemJSON);
        const garagem = new Garagem();

        garagemData.forEach(veiculoData => {
            let veiculo;
            if (veiculoData.constructor.name === "Carro") {
                veiculo = new Carro(veiculoData.modelo, veiculoData.cor, veiculoData.numeroPortas);
            } else if (veiculoData.constructor.name === "CarroEsportivo") {
                veiculo = new CarroEsportivo(veiculoData.modelo, veiculoData.cor);
            } else if (veiculoData.constructor.name === "Caminhao") {
                veiculo = new Caminhao(veiculoData.modelo, veiculoData.cor, veiculoData.capacidadeCarga);
            } else {
                veiculo = new Veiculo(veiculoData.modelo, veiculoData.cor);
            }

            // Restaura as propriedades do veículo
            Object.assign(veiculo, veiculoData);

            // Converte as strings JSON de volta para objetos Manutencao
            veiculo.historicoManutencao = veiculoData.historicoManutencao.map(manutencaoJSON => {
                if(manutencaoJSON) {
                    const manutencaoData = JSON.parse(manutencaoJSON);
                    const manutencao = new Manutencao(manutencaoData.data, manutencaoData.tipo, manutencaoData.custo, manutencaoData.descricao);
                    return manutencao;
                }
                return null; // Trata casos em que manutencaoJSON é null
            }).filter(manutencao => manutencao !== null); // Remove valores null

            garagem.adicionarVeiculo(veiculo);
        });

        console.log("Garagem carregada do LocalStorage.");
        return garagem;
    } else {
        console.log("Nenhum dado de garagem encontrado no LocalStorage. Criando uma nova garagem.");
        const novaGaragem = new Garagem();
        salvarGaragemLocalStorage(novaGaragem); // Salva a nova garagem vazia no LocalStorage
        return novaGaragem;
    }
}

function agendarManutencao() {
    const data = document.getElementById("dataManutencao").value;
    const tipo = document.getElementById("tipoManutencao").value;
    const custo = parseFloat(document.getElementById("custoManutencao").value);
    const descricao = document.getElementById("descricaoManutencao").value;

    if (!garagem.veiculoSelecionado) {
        alert("Selecione um veículo para agendar a manutenção.");
        return;
    }

    const manutencao = new Manutencao(data, tipo, custo, descricao);

    garagem.veiculoSelecionado.adicionarManutencao(manutencao);

    salvarGaragemLocalStorage(garagem); // Salva no LocalStorage
    atualizarHistoricoManutencao();
    atualizarAgendamentosFuturos();
}

function atualizarHistoricoManutencao() {
    const historicoManutencaoLista = document.getElementById("historicoManutencaoLista");

    if (!garagem.veiculoSelecionado) {
        historicoManutencaoLista.innerHTML = "<li>Selecione um veículo para ver o histórico.</li>";
        return;
    }

    const historicoFormatado = garagem.veiculoSelecionado.getHistoricoManutencaoFormatado();
    historicoManutencaoLista.innerHTML = ""; // Limpa a lista

    if (historicoFormatado.length === 0) {
        historicoManutencaoLista.innerHTML = "<li>Nenhuma manutenção registrada.</li>";
    } else {
        historicoFormatado.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            historicoManutencaoLista.appendChild(li);
        });
    }
}

function atualizarAgendamentosFuturos() {
    const agendamentosFuturosLista = document.getElementById("agendamentosFuturosLista");

    if (!garagem.veiculoSelecionado) {
        agendamentosFuturosLista.innerHTML = "<li>Selecione um veículo para ver os agendamentos futuros.</li>";
        return;
    }

    const hoje = new Date();
    const agendamentosFuturos = garagem.veiculoSelecionado.historicoManutencao.filter(manutencao => new Date(manutencao.data) > hoje);
    agendamentosFuturosLista.innerHTML = ""; // Limpa a lista

    if (agendamentosFuturos.length === 0) {
        agendamentosFuturosLista.innerHTML = "<li>Nenhum agendamento futuro.</li>";
    } else {
        agendamentosFuturos.forEach(manutencao => {
            const li = document.createElement("li");
            li.textContent = manutencao.getDescricaoFormatada();
            agendamentosFuturosLista.appendChild(li);
        });
    }
}

// Define as funções no escopo global para serem acessíveis no HTML
window.selecionarVeiculo = selecionarVeiculo;
window.interagir = interagir;
window.agendarManutencao = agendarManutencao;

// Carrega a garagem e exibe as informações ao carregar a página
window.onload = () => {
    garagem = carregarGaragemLocalStorage(); // Carrega do LocalStorage
    selecionarVeiculo(0); // Exibe as informações do primeiro veículo ao carregar a página
    atualizarHistoricoManutencao();
    atualizarAgendamentosFuturos();
};