/**
 * Classe que representa um carro.
 */
class Carro {
    /**
     * Cria um novo carro.
     * @param {string} modelo O modelo do carro.
     * @param {string} cor A cor do carro.
     */
    constructor(modelo, cor) {
      this.modelo = modelo;
      this.cor = cor;
      this.ligado = false;
      this.velocidade = 0;
    }
  
    /**
     * Liga o carro.
     */
    ligar() {
      this.ligado = true;
      console.log("Carro ligado!");
    }
  
    /**
     * Desliga o carro.
     */
    desligar() {
      this.ligado = false;
      this.velocidade = 0; // Zera a velocidade ao desligar
      console.log("Carro desligado!");
    }
  
    /**
     * Acelera o carro.
     * @param {number} incremento A quantidade a ser incrementada na velocidade.
     */
    acelerar(incremento) {
      if (this.ligado) {
        this.velocidade += incremento;
        console.log(`Acelerando! Velocidade atual: ${this.velocidade} km/h`);
      } else {
        console.log("O carro precisa estar ligado para acelerar!");
      }
    }
  }
  
  // Para usar a classe em outro arquivo, você pode exportá-la:
  // export { Carro };