document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const weatherResultDiv = document.getElementById('weatherResult');
    const errorMessageDiv = document.getElementById('errorMessage');

    // #############################################################################
    // # ATENÇÃO: COLOQUE SUA CHAVE DA API DO OPENWEATHERMAP AQUI                   #
    // #############################################################################
    const API_KEY = 'SUA_CHAVE_API_AQUI'; // <--- TROQUE ISSO PELA SUA CHAVE REAL
    // #############################################################################
    // # Exemplo: const API_KEY = 'abcdef1234567890abcdef1234567890';              #
    // #############################################################################


    searchButton.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            fetchWeather();
        }
    });

    async function fetchWeather() {
        const city = cityInput.value.trim();
        weatherResultDiv.innerHTML = '<p class="placeholder">Buscando...</p>'; // Feedback visual
        errorMessageDiv.style.display = 'none'; // Esconde mensagens de erro anteriores
        errorMessageDiv.textContent = '';

        if (!city) {
            displayError('Por favor, digite o nome de uma cidade.');
            weatherResultDiv.innerHTML = '<p class="placeholder">Digite uma cidade para ver a previsão do tempo.</p>';
            return;
        }

        if (API_KEY === 'SUA_CHAVE_API_AQUI' || API_KEY === '') {
            displayError('Chave da API não configurada. Edite o arquivo script.js.');
            weatherResultDiv.innerHTML = '<p class="placeholder">Erro de configuração.</p>';
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status}: Não foi possível buscar os dados.`);
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            displayError(error.message || 'Ocorreu um erro ao tentar buscar a previsão do tempo.');
            weatherResultDiv.innerHTML = '<p class="placeholder">Não foi possível carregar os dados.</p>';
        }
    }

    function displayWeather(data) {
        if (!data || !data.main || !data.weather || !data.weather[0]) {
            displayError('Dados recebidos da API estão incompletos ou malformados.');
            weatherResultDiv.innerHTML = '<p class="placeholder">Erro ao processar dados.</p>';
            return;
        }

        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidity = data.main.humidity; // Umidade
        const windSpeed = data.wind.speed;   // Velocidade do vento em m/s

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherResultDiv.innerHTML = `
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="Ícone do tempo: ${description}">
            <p>Temperatura: ${temperature.toFixed(1)} °C</p>
            <p>Condição: ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p>Umidade: ${humidity}%</p>
            <p>Vento: ${windSpeed.toFixed(1)} m/s</p>
        `;
    }

    function displayError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }
});