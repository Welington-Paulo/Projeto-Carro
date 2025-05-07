// audio.js
function tocarSom(idAudio) {
    const audio = document.getElementById(idAudio);
    audio.currentTime = 0; // Reinicia o áudio para tocar desde o início
    audio.play();
}