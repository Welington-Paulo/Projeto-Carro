/**
 * @file utils.js
 * @module components
 * @description Funções utilitárias para a aplicação.
 */

/**
 * Formata um número para moeda brasileira.
 * @param {number} numero O número a ser formatado.
 * @returns {string} O número formatado como moeda brasileira.
 */
export function formatarMoeda(numero) {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }