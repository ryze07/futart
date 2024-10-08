const startShareButton = document.getElementById('startShare');
const stopShareButton = document.getElementById('stopShare');
let mediaStream = null;
let newTab = null;

startShareButton.addEventListener('click', async () => {
    try {
        // Captura a tela inteira ou janela específica
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        // Abre uma nova aba (página `display.html`)
        newTab = window.open("display.html", "_blank");

        // Verifica se a nova aba foi aberta corretamente
        if (newTab) {
            // Quando a aba estiver carregada, envie o stream de vídeo
            newTab.onload = () => {
                // Usa uma URL de objeto de mídia para transferir o stream
                const videoStreamURL = URL.createObjectURL(mediaStream);
                newTab.postMessage({ type: 'stream', streamURL: videoStreamURL }, '*');
            };

            // Atualiza os botões de controle
            startShareButton.disabled = true;
            stopShareButton.disabled = false;
        } else {
            console.error("Não foi possível abrir uma nova aba.");
        }
    } catch (err) {
        console.error('Erro ao tentar compartilhar a tela: ', err);
    }
});

stopShareButton.addEventListener('click', () => {
    if (mediaStream) {
        let tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());  // Para o stream
        mediaStream = null;

        // Fecha a aba aberta
        if (newTab) {
            newTab.close();
            newTab = null;
        }

        // Atualiza os botões de controle
        startShareButton.disabled = false;
        stopShareButton.disabled = true;
    }
});
