/**
 * @file alert.js
 * @module components
 * @description Implementa um sistema de alerta estilizado.
 */

const alertElement = document.getElementById('custom-alert');
const alertMessageElement = document.getElementById('custom-alert-message');
let alertTimeout;

/**
 * Mostra um alerta estilizado na tela.
 * @param {string} message A mensagem a ser exibida no alerta.
 * @param {string} [type='error'] O tipo de alerta ('error', 'success', 'info', 'warning').
 * @param {number} [duration=4000] A duração em milissegundos que o alerta será exibido.
 */
export function mostrarAlertaEstilizado(message, type = 'error', duration = 4000) {
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