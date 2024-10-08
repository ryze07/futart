const startShareButton = document.getElementById('startShare');
const stopShareButton = document.getElementById('stopShare');
let mediaStream = null;
let newTab = null;

startShareButton.addEventListener('click', async () => {
    try {
        // Captura a tela
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        // Abre uma nova aba (não uma janela pop-up)
        newTab = window.open("about:blank", "_blank");  // Usa "_blank" para abrir uma nova aba no navegador

        // Verifica se a aba foi aberta corretamente
        if (newTab) {
            // Cria o conteúdo da nova aba sem usar document.write
            const doc = newTab.document;
            doc.title = "Screen Sharing";

            // Estilos para o corpo da nova aba
            doc.body.style.margin = '0';
            doc.body.style.display = 'flex';
            doc.body.style.justifyContent = 'center';
            doc.body.style.alignItems = 'center';
            doc.body.style.height = '100vh';
            doc.body.style.backgroundColor = '#000';

            // Cria o elemento de vídeo na nova aba
            const videoElement = doc.createElement('video');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.autoplay = true;
            videoElement.playsInline = true;

            // Adiciona o vídeo à nova aba
            doc.body.appendChild(videoElement);

            // Injeta o stream de mídia no vídeo da nova aba
            videoElement.srcObject = mediaStream;

            // Atualiza os botões de controle
            startShareButton.disabled = true;
            stopShareButton.disabled = false;
        } else {
            console.error("Não foi possível abrir uma nova aba. Verifique as configurações do navegador.");
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
