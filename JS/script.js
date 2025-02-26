class Carro {
    constructor(modelo, cor) {
        this.modelo = modelo;
        this.cor = cor;
        this.ligado = false;
        this.velocidade = 0;
    }

    ligar() {
        this.ligado = true;
        console.log("Carro ligado!");
        this.atualizarInfo();
    }

    desligar() {
        this.ligado = false;
        this.velocidade = 0;
        console.log("Carro desligado!");
        this.atualizarInfo();
    }

    acelerar() {
        if (this.ligado) {
            this.velocidade += 10;
            console.log("Carro acelerando! Velocidade:", this.velocidade);
            this.atualizarInfo();

            // Toca o som de aceleração
            const aceleracaoSom = document.getElementById("aceleracaoSom");
            aceleracaoSom.currentTime = 0; // Reinicia o som para tocar desde o início
            aceleracaoSom.play();

        } else {
            alert("O carro precisa estar ligado para acelerar!");
        }
    }

    atualizarInfo() {
        document.getElementById("carModel").textContent = this.modelo;
        document.getElementById("carColor").textContent = this.cor;
        document.getElementById("carEstado").textContent = this.ligado ? "Ligado" : "Desligado";
        document.getElementById("carVelocidade").textContent = this.velocidade + " km/h";
        const carImage = document.getElementById("carImage");
        if (this.ligado) {
            carImage.classList.add("ligado");
        } else {
            carImage.classList.remove("ligado");
            carImage.classList.remove("acelerando");
        }

        if (this.velocidade > 0) {
            carImage.classList.add("acelerando");
        } else {
            carImage.classList.remove("acelerando");
        }
    }
}

const meuCarro = new Carro("Fusca", "Azul");
meuCarro.atualizarInfo();

document.getElementById("ligarBtn").addEventListener("click", () => {
    meuCarro.ligar();
});

document.getElementById("desligarBtn").addEventListener("click", () => {
    meuCarro.desligar();
});

document.getElementById("acelerarBtn").addEventListener("click", () => {
    meuCarro.acelerar();
});