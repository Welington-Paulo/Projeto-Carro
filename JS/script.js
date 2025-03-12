window.onload = function() {
    // Simulando o tempo de carregamento (por exemplo, 3 segundos)
    setTimeout(function() {
        // Oculta a tela de loading
        document.getElementById("loadingScreen").style.display = "none";
        
        // Exibe o conteúdo da página
        document.querySelector(".content").style.display = "block";
    }, 3000);  // 3000 milissegundos = 3 segundos
};