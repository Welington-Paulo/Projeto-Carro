/**
 * Classe base para veículos.
 */
class Veiculo {
    /**
     * Cria um novo veículo.
     * @param {string} modelo O modelo do veículo.
     * @param {string} cor A cor do veículo.
     */
    constructor(modelo, cor) {
        this.modelo = modelo;
        this.cor = cor;
        this.ligado = false;
        this.velocidade = 0;
        this.historicoManutencao = [];
    }

    /**
     * Liga o veículo.
     */
    ligar() {
        if (!this.ligado) {
            this.ligado = true;
            console.log(`${this.modelo} ligado.`);
            const somLigar = document.getElementById("somLigar");
            if (somLigar) {
                somLigar.play();
            }
        } else {
            alert("O veículo já está ligado.");
        }

    }

    /**
     * Desliga o veículo.
     */
    desligar() {
       if (this.ligado) {
           this.ligado = false;
            this.velocidade = 0;
            console.log(`${this.modelo} desligado.`);
            const somDesligar = document.getElementById("somDesligar");
            if (somDesligar) {
                somDesligar.play();
            }
       } else {
           alert("O veículo já está desligado.")
       }
    }

    /**
     * Acelera o veículo.
     * @param {number} incremento A quantidade a ser incrementada na velocidade.
     */
    acelerar(incremento) {
        if (this.ligado) {
            const somAcelerar = document.getElementById("somAcelerar");
                if (somAcelerar){
                    somAcelerar.play();
                }
            this.velocidade += incremento;
            this.velocidade = Math.min(this.velocidade, 200); // Limita a velocidade máxima
            console.log(`${this.modelo} acelerando. Velocidade atual: ${this.velocidade}`);
            this.atualizarVelocidadeBarra(); // Chama a função para atualizar a barra de progresso
        } else {
            console.log(`${this.modelo} não pode acelerar, pois está desligado.`);
            alert("O veículo está desligado, não é possível acelerar.");
        }
    }

    /**
     * Freia o veículo.
     * @param {number} decremento A quantidade a ser decrementada na velocidade.
     */
    frear(decremento) {
        if (this.velocidade > 0){
             this.velocidade = Math.max(0, this.velocidade - decremento);
             console.log(`${this.modelo} freando. Velocidade atual: ${this.velocidade}`);
             const somFrear = document.getElementById("somFrear");
                if (somFrear){
                    somFrear.play();
                }
             this.atualizarVelocidadeBarra(); // Chama a função para atualizar a barra de progresso
        }else {
            alert("O veículo já está parado.")
        }


    }

    /**
     * Buzina o veículo.
     */
    buzinar() {
         const somBuzina = document.getElementById("somBuzina");
                if (somBuzina){
                    somBuzina.play();
                }
        console.log(`${this.modelo} BUZZZZ!`);
    }

    /**
     * Exibe informações básicas do veículo.
     * @returns {string} Uma string formatada com as informações do veículo.
     */
    exibirInformacoes() {
        return `Modelo: ${this.modelo}, Cor: ${this.cor}, Ligado: ${this.ligado ? 'Sim' : 'Não'}, Velocidade: ${this.velocidade}`;
    }

    /**
     * Atualiza a barra de velocidade.
     */
    atualizarVelocidadeBarra() {
            const velocidadeBarra = document.getElementById("velocidadeBarra");
            if (velocidadeBarra) {
                velocidadeBarra.value = this.velocidade;
            }
        }

    /**
     * Adiciona uma manutenção ao histórico.
     * @param {Manutencao} manutencao O objeto Manutencao a ser adicionado.
     */
    adicionarManutencao(manutencao) {
        if (manutencao.validarDados()) {
            this.historicoManutencao.push(manutencao);
            console.log(`Manutenção adicionada ao histórico de ${this.modelo}`);
        } else {
            console.log("Dados da manutenção inválidos. Não foi adicionada ao histórico.");
        }
    }

    /**
     * Retorna o histórico de manutenção formatado para exibição.
     * @returns {string[]} Um array de strings formatadas com as informações das manutenções.
     */
    getHistoricoManutencaoFormatado() {
        return this.historicoManutencao.map(manutencao => manutencao.getDescricaoFormatada());
    }
}