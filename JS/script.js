// JS/script.js
document.addEventListener('DOMContentLoaded', () => {
    const garagem = new Garagem();

    // --- Elementos do DOM (Cache) ---
    const formAddVeiculo = document.getElementById('form-add-veiculo');
    const garagemDisplayCards = document.getElementById('garagem-display-cards');
    const tipoVeiculoSelect = document.getElementById('tipo-veiculo');
    const camposEspecificosDivs = document.querySelectorAll('.campos-especificos');
    
    const modalAgendamento = document.getElementById('modal-agendamento');
    const formAgendarManutencao = document.getElementById('form-agendar-manutencao');
    const agendamentoPlacaVeiculoInput = document.getElementById('agendamento-placa-veiculo');
    const modalVeiculoPlacaSpan = document.getElementById('modal-veiculo-placa');
    
    const agendamentosFuturosViewDiv = document.getElementById('agendamentos-futuros-view');
    const lembretesManutencaoViewDiv = document.getElementById('lembretes-manutencao-view');
    const historicosConsolidadosViewDiv = document.getElementById('historicos-consolidados-view');
    const notificacaoArea = document.getElementById('notificacao-area');

    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const nomeVeiculoInteracaoSpan = document.getElementById('nome-veiculo-interacao');
    const divInfoVeiculoSelecionado = document.getElementById('informacoesVeiculoSelecionado');
    const divBotoesAcoesComuns = document.getElementById('botoesAcoesComuns');
    const divBotoesAcoesEspecificas = document.getElementById('botoesAcoesEspecificas');
    const ulLogInteracoes = document.getElementById('logInteracoesVeiculo');

    // Elementos do Planejador de Viagem (com IDs atualizados)
    const selectViagemVeiculo = document.getElementById('viagem-veiculo');
    const cityInputViagem = document.getElementById('cityInputViagem'); // ID ATUALIZADO
    const searchButtonViagem = document.getElementById('searchButtonViagem'); // ID ATUALIZADO
    const weatherResultDivViagem = document.getElementById('weatherResultViagem'); // ID ATUALIZADO
    const errorMessageDivViagem = document.getElementById('errorMessageViagem'); // ID ATUALIZADO


    // #############################################################################
    // # ATENÇÃO: COLOQUE SUA CHAVE DA API DO OPENWEATHERMAP AQUI                   #
    // #############################################################################
    const OPENWEATHER_API_KEY = '3038323d0c4576cb467293d23c5fad6c'; // <--- TROQUE ISSO PELA SUA CHAVE REAL
    // #############################################################################
    // # Exemplo: const API_KEY = 'abcdef1234567890abcdef1234567890';              #
    // #############################################################################


    // --- Gerenciamento de Abas ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.target).classList.add('active');
        });
    });

    // --- Sistema de Notificação (Toast) ---
    function exibirNotificacao(mensagem, tipo = 'info', duracao = 4000) {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${tipo}`;
        notificacao.textContent = mensagem;
        notificacaoArea.appendChild(notificacao);
        void notificacao.offsetWidth; 
        notificacao.classList.add('show');
        setTimeout(() => {
            notificacao.classList.remove('show');
            setTimeout(() => { if (notificacao.parentNode) notificacao.parentNode.removeChild(notificacao); }, 500);
        }, duracao);
    }

    // --- API Simulada de Detalhes Veiculares ---
    async function buscarDetalhesVeiculoApiSimulada(placa) {
        try {
            const response = await fetch('./data/api_veiculos_detalhes.json'); 
            if (!response.ok) {
                throw new Error(`Erro HTTP ao carregar API simulada: ${response.status}`);
            }
            const todosOsDetalhes = await response.json();
            return todosOsDetalhes[placa.toUpperCase()] || null;
        } catch (error) {
            console.error("Erro ao buscar detalhes na API simulada:", error);
            return null;
        }
    }

    // --- Renderização e Atualização da UI (Funções da Garagem) ---
    function renderizarTudoUI() {
        renderizarCardsVeiculosUI();
        atualizarPainelInteracaoUI(); 
        renderizarAgendamentosFuturosView();
        renderizarLembretesManutencaoView();
        renderizarHistoricosConsolidadosView();
        preencherSelectVeiculosViagem();
    }

    function renderizarCardsVeiculosUI() {
        garagemDisplayCards.innerHTML = garagem.listarVeiculosParaCards();
        document.querySelectorAll('.btn-card-selecionar').forEach(button => {
            button.addEventListener('click', (e) => {
                const placa = e.target.dataset.placa;
                if (garagem.selecionarVeiculoPorPlaca(placa)) {
                    atualizarPainelInteracaoUI(); 
                    renderizarCardsVeiculosUI(); 
                }
            });
        });
    }
    
    async function atualizarPainelInteracaoUI() {
        const veiculo = garagem.getVeiculoSelecionado();
        if (nomeVeiculoInteracaoSpan && divInfoVeiculoSelecionado) { 
            if (veiculo) {
                nomeVeiculoInteracaoSpan.textContent = `${veiculo.constructor.name} ${veiculo.modelo} (${veiculo.placa})`;
                divInfoVeiculoSelecionado.innerHTML = veiculo.exibirInformacoes(); 
                
                const carregandoDetalhesSpan = document.createElement('p');
                carregandoDetalhesSpan.id = 'loading-api-details';
                carregandoDetalhesSpan.textContent = 'Buscando detalhes adicionais...';
                carregandoDetalhesSpan.style.fontStyle = 'italic';
                carregandoDetalhesSpan.style.color = 'var(--cor-texto-secundario)';
                const hrExistente = divInfoVeiculoSelecionado.querySelector('.info-divider');
                if (hrExistente) {
                    divInfoVeiculoSelecionado.insertBefore(carregandoDetalhesSpan, hrExistente);
                } else {
                    divInfoVeiculoSelecionado.appendChild(carregandoDetalhesSpan);
                }

                const detalhesApi = await buscarDetalhesVeiculoApiSimulada(veiculo.placa);
                const loadingSpanToRemove = document.getElementById('loading-api-details');
                if (loadingSpanToRemove) loadingSpanToRemove.remove();

                if (detalhesApi) {
                    veiculo.atualizarDetalhesDaApi(detalhesApi);
                    garagem.salvarNoLocalStorage(); 
                }
                divInfoVeiculoSelecionado.innerHTML = veiculo.exibirInformacoes();

                document.querySelectorAll('.acao-especifica').forEach(el => el.style.display = 'none');
                if (veiculo instanceof CarroEsportivo) {
                    document.querySelectorAll('.carroesportivo-action').forEach(el => el.style.display = (el.classList.contains('acao-com-input') ? 'flex' : 'inline-block'));
                } else if (veiculo instanceof Caminhao) {
                    document.querySelectorAll('.caminhao-action').forEach(el => el.style.display = (el.classList.contains('acao-com-input') ? 'flex' : 'inline-block'));
                }
            } else {
                nomeVeiculoInteracaoSpan.textContent = "Nenhum";
                divInfoVeiculoSelecionado.innerHTML = "<p>Selecione um veículo na lista da garagem para interagir.</p>";
                document.querySelectorAll('.acao-especifica').forEach(el => el.style.display = 'none');
            }
        }
        window.atualizarLogInteracoesUI();
    }

    window.atualizarLogInteracoesUI = function() {
        if (ulLogInteracoes) {
            ulLogInteracoes.innerHTML = garagem.getHistoricoInteracoesFormatado();
        }
    }

    function renderizarAgendamentosFuturosView() { /* ... (como antes) ... */ 
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        let html = '<ul>';
        let encontrou = false;
        garagem.veiculos.forEach(v => {
            (v.historicoManutencao || []).forEach(m => {
                if (new Date(m.data + 'T00:00:00') >= hoje) {
                    html += `<li><strong>${v.placa} (${v.modelo}):</strong> ${m.formatarManutencao()}</li>`;
                    encontrou = true;
                }
            });
        });
        html += '</ul>';
        agendamentosFuturosViewDiv.innerHTML = encontrou ? html : '<p>Nenhum agendamento futuro.</p>';
    }
    function renderizarLembretesManutencaoView() { /* ... (como antes) ... */
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        hoje.setHours(0,0,0,0);
        amanha.setHours(0,0,0,0);
        let html = '<ul>';
        let encontrou = false;
        garagem.veiculos.forEach(v => {
            (v.historicoManutencao || []).forEach(m => {
                const dataM = new Date(m.data + 'T00:00:00');
                if (dataM.getTime() === amanha.getTime()) {
                    html += `<li class="amanha">AMANHÃ: ${m.tipo} para <strong>${v.placa} (${v.modelo})</strong>.</li>`;
                    encontrou = true;
                } else if (dataM.getTime() === hoje.getTime()) {
                    html += `<li class="hoje">HOJE: ${m.tipo} para <strong>${v.placa} (${v.modelo})</strong>.</li>`;
                    encontrou = true;
                }
            });
        });
        html += '</ul>';
        lembretesManutencaoViewDiv.innerHTML = encontrou ? html : '<p>Nenhum lembrete para hoje ou amanhã.</p>';
        verificarAlertasPopupLembretes();
     }
    function renderizarHistoricosConsolidadosView() { /* ... (como antes) ... */ 
        if (!historicosConsolidadosViewDiv) return;
        let html = '';
        let encontrouHistoricoGeral = false;

        if (garagem.veiculos.length === 0) {
            historicosConsolidadosViewDiv.innerHTML = '<p>Nenhum veículo na garagem para exibir históricos.</p>';
            return;
        }
        const veiculosOrdenados = [...garagem.veiculos].sort((a,b) => a.placa.localeCompare(b.placa));
        veiculosOrdenados.forEach(veiculo => {
            if (veiculo.historicoManutencao && veiculo.historicoManutencao.length > 0) {
                encontrouHistoricoGeral = true;
                html += `<div class="historico-consolidado-veiculo">`;
                html += `<h4>Histórico de ${veiculo.constructor.name} ${veiculo.modelo} (Placa: ${veiculo.placa})</h4>`;
                html += `<ul>${veiculo.formatarHistoricoManutencao()}</ul>`;
                html += `</div>`;
            }
        });
        historicosConsolidadosViewDiv.innerHTML = encontrouHistoricoGeral ? html : '<p>Nenhum veículo possui histórico de manutenção registrado.</p>';
    }
    function preencherSelectVeiculosViagem() { /* ... (como antes) ... */ 
        if (!selectViagemVeiculo) return;
        const veiculoSelecionadoAnteriormente = selectViagemVeiculo.value;
        selectViagemVeiculo.innerHTML = '<option value="">-- Selecione um Veículo --</option>';
        garagem.veiculos.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.placa;
            option.textContent = `${veiculo.constructor.name} ${veiculo.modelo} (${veiculo.placa})`;
            selectViagemVeiculo.appendChild(option);
        });
        if (garagem.encontrarVeiculo(veiculoSelecionadoAnteriormente)) {
            selectViagemVeiculo.value = veiculoSelecionadoAnteriormente;
        }
    }

    // --- Lógica de Adicionar Veículo ---
    tipoVeiculoSelect.addEventListener('change', () => { /* ... (como antes) ... */ 
        camposEspecificosDivs.forEach(div => div.style.display = 'none');
        const divToShow = document.getElementById(`campos-${tipoVeiculoSelect.value.toLowerCase()}`);
        if (divToShow) divToShow.style.display = 'block';
    });
    formAddVeiculo.addEventListener('submit', (e) => { /* ... (como antes, incluindo salvarNoLocalStorage e renderizarTudoUI) ... */ 
        e.preventDefault();
        const fd = new FormData(formAddVeiculo);
        const tipo = fd.get('tipo-veiculo');
        const marca = fd.get('marca').trim();
        const modelo = fd.get('modelo').trim();
        const ano = parseInt(fd.get('ano'));
        const placa = fd.get('placa').toUpperCase().trim();
        const cor = fd.get('cor').trim() || "Branco";

        if (!tipo || !marca || !modelo || !ano || !placa) {
            exibirNotificacao("Preencha todos os campos básicos do veículo.", 'erro'); return;
        }
        if (!/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/.test(placa)) {
            exibirNotificacao("Placa inválida (AAA-1234 ou AAA1B34).", 'erro'); return;
        }
        const anoAtual = new Date().getFullYear();
        if (isNaN(ano) || ano < 1900 || ano > anoAtual + 2) { 
             exibirNotificacao(`Ano inválido (1900-${anoAtual + 2}).`, 'erro'); return;
        }

        let novoVeiculo;
        try {
            switch (tipo) {
                case 'Carro':
                    novoVeiculo = new Carro(marca, modelo, ano, placa, cor, [], parseInt(fd.get('numero-portas')));
                    break;
                case 'CarroEsportivo':
                    novoVeiculo = new CarroEsportivo(marca, modelo, ano, placa, cor, [], parseInt(fd.get('velocidade-maxima-turbo')));
                    break;
                case 'Caminhao':
                    novoVeiculo = new Caminhao(marca, modelo, ano, placa, cor, [], parseFloat(fd.get('capacidade-carga')));
                    break;
                default: 
                    novoVeiculo = new Veiculo(marca, modelo, ano, placa, cor);
            }
            if (garagem.adicionarVeiculo(novoVeiculo)) {
                garagem.salvarNoLocalStorage();
                renderizarTudoUI();
                exibirNotificacao(`${tipo} ${modelo} adicionado!`, 'sucesso');
                formAddVeiculo.reset();
                document.getElementById('cor').value = "Branco"; 
                tipoVeiculoSelect.dispatchEvent(new Event('change'));
            } else {
                exibirNotificacao(`Veículo com placa ${placa} já existe.`, 'erro');
            }
        } catch (error) {
            exibirNotificacao(`Erro ao criar ${tipo}: ${error.message}`, 'erro');
            console.error(error);
        }
    });

    // --- Lógica de Interação com Veículo Selecionado ---
    const todosBotoesDeAcao = [ /* ... (como antes) ... */ 
        ...divBotoesAcoesComuns.querySelectorAll('button[data-acao]'),
        ...divBotoesAcoesEspecificas.querySelectorAll('button[data-acao]'),
        ...divBotoesAcoesEspecificas.querySelectorAll('.acao-com-input button[data-acao]')
    ];
    todosBotoesDeAcao.forEach(button => { /* ... (como antes, incluindo salvarNoLocalStorage) ... */ 
        button.addEventListener('click', () => {
            const veiculoSel = garagem.getVeiculoSelecionado();
            if (!veiculoSel) {
                exibirNotificacao("Selecione um veículo para interagir.", "aviso");
                return;
            }
            const acao = button.dataset.acao;
            let valor = null;
            if (acao === "carregar") valor = document.getElementById('input-carga').value;
            else if (acao === "descarregar") valor = document.getElementById('input-descarga').value;
            
            garagem.interagirComSelecionado(acao, valor); 
            atualizarPainelInteracaoUI(); 
            renderizarCardsVeiculosUI(); 
            garagem.salvarNoLocalStorage(); 
        });
    });

    // --- Lógica de Agendamento de Manutenção (Modal) ---
    window.abrirModalAgendamento = (placa) => { /* ... (como antes) ... */ 
        const veiculo = garagem.encontrarVeiculo(placa);
        if (veiculo) {
            agendamentoPlacaVeiculoInput.value = placa;
            modalVeiculoPlacaSpan.textContent = `${veiculo.constructor.name} ${veiculo.modelo} (${placa})`;
            formAgendarManutencao.reset();
            const hojeISO = new Date().toISOString().split('T')[0];
            document.getElementById('agendamento-data').min = hojeISO; 
            document.getElementById('agendamento-data').value = hojeISO;
            modalAgendamento.style.display = 'block';
        } else {
            exibirNotificacao("Veículo não encontrado para agendamento.", 'erro');
        }
    };
    window.fecharModalAgendamento = () => modalAgendamento.style.display = 'none';
    window.addEventListener('click', (event) => { if (event.target == modalAgendamento) fecharModalAgendamento(); });
    formAgendarManutencao.addEventListener('submit', (e) => { /* ... (como antes, incluindo salvarNoLocalStorage) ... */ 
        e.preventDefault();
        const fd = new FormData(formAgendarManutencao);
        const placa = fd.get('placa-veiculo');
        const data = fd.get('data');
        const hora = fd.get('agendamento-hora');
        const tipoServico = fd.get('tipo').trim();
        const custo = parseFloat(fd.get('custo'));
        const desc = fd.get('descricao').trim();

        if (!data || !tipoServico || isNaN(custo) || custo < 0) {
            exibirNotificacao("Preencha Data, Tipo e Custo (positivo).", 'erro'); return;
        }
        const veiculo = garagem.encontrarVeiculo(placa);
        if (veiculo) {
            try {
                const manut = new Manutencao(data, tipoServico, custo, `${desc}${hora ? ` agendado para ${hora}` : ''}`.trim());
                veiculo.adicionarManutencao(manut);
                garagem.salvarNoLocalStorage();
                renderizarTudoUI(); 
                fecharModalAgendamento();
                exibirNotificacao(`Manutenção agendada para ${placa}!`, 'sucesso');
            } catch (error) {
                exibirNotificacao(`Erro ao agendar: ${error.message}`, 'erro');
            }
        }
    });

    window.exibirHistorico = (placa) => { /* ... (como antes) ... */ 
        const divHist = document.getElementById(`historico-${placa}`);
        if (divHist) divHist.style.display = divHist.style.display === 'none' ? 'block' : 'none';
    };
    window.confirmarRemocaoVeiculo = (placa, modeloInfo) => { /* ... (como antes, incluindo salvarNoLocalStorage) ... */ 
        if (confirm(`Remover ${modeloInfo} (Placa: ${placa})? Esta ação não pode ser desfeita.`)) {
            if (garagem.removerVeiculo(placa)) {
                garagem.salvarNoLocalStorage();
                renderizarTudoUI(); 
                exibirNotificacao(`${modeloInfo} removido.`, 'sucesso');
            } else {
                exibirNotificacao(`Erro ao remover ${modeloInfo}.`, 'erro');
            }
        }
    };
    
    // --- Lógica do Planejador de Viagem (usando seu novo código para tempo ATUAL) ---
    async function fetchWeatherViagem() { // Renomeada para evitar conflito se houvesse outra fetchWeather
        const city = cityInputViagem.value.trim();
        weatherResultDivViagem.innerHTML = '<p class="placeholder">Buscando...</p>'; 
        errorMessageDivViagem.style.display = 'none'; 
        errorMessageDivViagem.textContent = '';

        if (!city) {
            displayErrorViagem('Por favor, digite o nome de uma cidade.');
            weatherResultDivViagem.innerHTML = '<p class="placeholder">Digite uma cidade para ver a previsão do tempo.</p>';
            return;
        }

        if (OPENWEATHER_API_KEY === '3038323d0c4576cb467293d23c5fad6c' || OPENWEATHER_API_KEY === '') {
            displayErrorViagem('Chave da API não configurada. Edite o arquivo JS/script.js e insira sua chave da OpenWeatherMap.');
            weatherResultDivViagem.innerHTML = '<p class="placeholder">Erro de configuração da API.</p>';
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` })); // Tenta pegar msg de erro
                throw new Error(errorData.message || `Erro ${response.status}: Não foi possível buscar os dados.`);
            }
            const data = await response.json();
            displayWeatherViagem(data);
        } catch (error) {
            console.error('Erro ao buscar dados da API de tempo:', error);
            displayErrorViagem(error.message || 'Ocorreu um erro ao tentar buscar a previsão do tempo.');
            weatherResultDivViagem.innerHTML = '<p class="placeholder">Não foi possível carregar os dados do clima.</p>';
        }
    }

    function displayWeatherViagem(data) {
        if (!data || !data.main || !data.weather || !data.weather[0]) {
            displayErrorViagem('Dados recebidos da API de tempo estão incompletos ou malformados.');
            weatherResultDivViagem.innerHTML = '<p class="placeholder">Erro ao processar dados do clima.</p>';
            return;
        }

        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;   

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        let htmlResultado = '';
        const placaVeiculoSelecionado = selectViagemVeiculo.value;
        const veiculo = garagem.encontrarVeiculo(placaVeiculoSelecionado);

        if (veiculo) {
            htmlResultado += `<h3>Viagem com ${veiculo.constructor.name} ${veiculo.modelo} (${veiculo.placa})</h3>`;
            if (veiculo.autonomiaEstimadaKm) {
                htmlResultado += `<p>Autonomia estimada: <strong>${veiculo.autonomiaEstimadaKm.toFixed(0)} km</strong>.</p>`;
            } else {
                htmlResultado += `<p>Autonomia não pôde ser calculada (verifique dados de consumo/tanque).</p>`;
            }
        } else if (placaVeiculoSelecionado) {
             htmlResultado += `<p>Veículo com placa ${placaVeiculoSelecionado} não encontrado para detalhes da viagem.</p>`;
        }
        htmlResultado += `<hr class="info-divider">`;
        
        htmlResultado += `
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="Ícone do tempo: ${description}">
            <p>Temperatura: ${temperature.toFixed(1)} °C</p>
            <p>Condição: ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p>Umidade: ${humidity}%</p>
            <p>Vento: ${(windSpeed * 3.6).toFixed(1)} km/h</p> {/* Convertido para km/h */}
        `;
        weatherResultDivViagem.innerHTML = htmlResultado;
    }

    function displayErrorViagem(message) {
        errorMessageDivViagem.textContent = message;
        errorMessageDivViagem.style.display = 'block';
    }

    if (searchButtonViagem) {
        searchButtonViagem.addEventListener('click', fetchWeatherViagem);
    }
    if (cityInputViagem) {
        cityInputViagem.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                fetchWeatherViagem();
            }
        });
    }
    // Removido listener do formPlanejarViagem, pois agora é por botão e input direto.


    function verificarAlertasPopupLembretes() { /* ... (como antes) ... */ 
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        hoje.setHours(0,0,0,0); 
        amanha.setHours(0,0,0,0);
        garagem.veiculos.forEach(v => {
            (v.historicoManutencao || []).forEach(m => {
                const dataM = new Date(m.data + 'T00:00:00');
                let msg = "", tipoNotif = "aviso";
                if (dataM.getTime() === amanha.getTime()) {
                    msg = `LEMBRETE (Amanhã): ${m.tipo} para ${v.placa}.`;
                } else if (dataM.getTime() === hoje.getTime()) {
                    msg = `ATENÇÃO (Hoje): ${m.tipo} para ${v.placa}.`;
                    tipoNotif = "erro";
                }
                if (msg) {
                    const key = `lembrete_popup_${v.placa}_${m.data}`;
                    if (!sessionStorage.getItem(key)) {
                        exibirNotificacao(msg, tipoNotif, 8000);
                        sessionStorage.setItem(key, 'true');
                    }
                }
            });
        });
    }

    function inicializarApp() {
        try {
            garagem.carregarDoLocalStorage();
        } catch (error) {
            exibirNotificacao(error.message || "Erro ao carregar dados. Verifique o console.", "erro", 10000);
        }
        renderizarTudoUI();
        tipoVeiculoSelect.dispatchEvent(new Event('change')); 
        window.atualizarLogInteracoesUI(); 
        
        window.Carro = Carro;
        window.CarroEsportivo = CarroEsportivo;
        window.Caminhao = Caminhao;
        window.Veiculo = Veiculo; 
        window.Manutencao = Manutencao;
    }

    inicializarApp();
});