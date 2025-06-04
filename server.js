// server.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path'
// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
// A porta para o servidor backend. Certifique-se de que é diferente da porta do seu frontend
// se você estiver usando algo como live-server para o frontend.
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3001; // Porta para o servidor backend
const API_KEY = process.env.OPENWEATHER_API_KEY;
app.use(express.static(path.join(__dirname, "public")))

// Middleware CORS - Essencial para permitir que seu frontend chame este backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Para desenvolvimento. Em produção, restrinja!
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

/**
 * Endpoint para buscar a previsão do tempo DETALHADA (5 dias / 3 horas).
 * O frontend chamará: GET http://localhost:3001/api/forecast/NOME_DA_CIDADE
 */
app.get('/api/forecast/:city', async (req, res) => {
    const { city } = req.params; // Pega o nome da cidade da URL

    console.log(`[BACKEND] Requisição recebida para /api/forecast/${city}`);

    if (!API_KEY) {
        console.error("[BACKEND] ERRO FATAL: Chave da API OpenWeatherMap não está configurada no servidor (verifique o arquivo .env).");
        return res.status(500).json({ error: 'Configuração do servidor incompleta (API Key ausente).' });
    }
    if (!city) {
        return res.status(400).json({ error: 'O nome da cidade é obrigatório.' });
    }

    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        console.log(`[BACKEND] Buscando previsão detalhada para "${city}" na OpenWeatherMap (${openWeatherUrl.replace(API_KEY, "CHAVE_OCULTA_NO_LOG")})...`);
        const responseFromOpenWeather = await axios.get(openWeatherUrl);
        
        console.log(`[BACKEND] Dados para "${city}" (forecast) recebidos com sucesso.`);
        // Envia os dados recebidos da OpenWeatherMap diretamente para o frontend
        res.json(responseFromOpenWeather.data); 

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Erro desconhecido no servidor ao buscar previsão detalhada.';
        
        console.error(`[BACKEND] Erro ao buscar previsão para "${city}" (forecast): Status ${status}, Mensagem: ${message}`);
        if (error.response && error.response.data) {
            console.error("[BACKEND] Detalhes do erro da API externa:", JSON.stringify(error.response.data));
        }
        res.status(status).json({ error: `Falha ao obter previsão: ${message}` });
    }
});

/**
 * Endpoint para buscar o clima ATUAL.
 * O frontend chamará: GET http://localhost:3001/api/weather/NOME_DA_CIDADE
 */
app.get('/api/weather/:city', async (req, res) => {
    const { city } = req.params;

    console.log(`[BACKEND] Requisição recebida para /api/weather/${city}`);

    if (!API_KEY) {
        console.error("[BACKEND] ERRO FATAL: Chave da API OpenWeatherMap não está configurada no servidor (verifique o arquivo .env).");
        return res.status(500).json({ error: 'Configuração do servidor incompleta (API Key ausente).' });
    }
    if (!city) {
        return res.status(400).json({ error: 'O nome da cidade é obrigatório.' });
    }

    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        console.log(`[BACKEND] Buscando clima atual para "${city}" na OpenWeatherMap (${openWeatherUrl.replace(API_KEY, "CHAVE_OCULTA_NO_LOG")})...`);
        const responseFromOpenWeather = await axios.get(openWeatherUrl);
        
        console.log(`[BACKEND] Dados para "${city}" (weather) recebidos com sucesso.`);
        res.json(responseFromOpenWeather.data);

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Erro desconhecido no servidor ao buscar clima atual.';
        
        console.error(`[BACKEND] Erro ao buscar clima para "${city}" (weather): Status ${status}, Mensagem: ${message}`);
         if (error.response && error.response.data) {
            console.error("[BACKEND] Detalhes do erro da API externa:", JSON.stringify(error.response.data));
        }
        res.status(status).json({ error: `Falha ao obter clima atual: ${message}` });
    }
});


// Rota raiz para um teste rápido do servidor
app.get('/', (req, res) => {
    res.send('Servidor Backend da Garagem Inteligente está funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor backend da Garagem Inteligente rodando em http://localhost:${PORT}`);
    if (!API_KEY) {
        console.warn('[BACKEND] ATENÇÃO: OPENWEATHER_API_KEY não foi carregada do .env. As chamadas de clima falharão.');
    } else {
        console.log('[BACKEND] Chave da API OpenWeatherMap carregada.');
    }
});