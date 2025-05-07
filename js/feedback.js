// feedback.js
function atualizarStatusVeiculo(veiculo) {
    const statusIndicador = document.getElementById('status-indicador');
    if (veiculo.ligado) {
        statusIndicador.textContent = 'Ligado';
        statusIndicador.className = 'ligado'; // Remove outras classes e adiciona 'ligado'
    } else {
        statusIndicador.textContent = 'Desligado';
        statusIndicador.className = 'desligado'; // Remove outras classes e adiciona 'desligado'
    }
}
// feedback.js
function atualizarVelocidadeVisual(velocidade) {
    const velocidadeBarra = document.getElementById('velocidade-barra');
    velocidadeBarra.value = velocidade; // Assumindo que a velocidade máxima é 100
}