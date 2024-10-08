const startShareButton = document.getElementById('startShare');
const stopShareButton = document.getElementById('stopShare');
let mediaStream = null;
let newWindow = null;

startShareButton.addEventListener('click', async () => {
    try {
        // Captura a tela
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        // Abre uma nova aba
        newWindow = window.open("", "_blank", "width=800,height=600");

        // Injeta HTML na nova aba
        newWindow.document.write(`
            <html>
            <head><title>Screen Sharing</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background-color:#000;">
                <video id="sharedVideo" autoplay playsinline style="width:100%; height:100%;"></video>
            </body>
            </html>
        `);

        // Aguarda a nova aba carregar completamente
        newWindow.onload = () => {
            const videoElement = newWindow.document.getElementById('sharedVideo');
            videoElement.srcObject = mediaStream;  // Injeta o stream de vídeo
        };

        // Atualiza os botões de controle
        startShareButton.disabled = true;
        stopShareButton.disabled = false;
    } catch (err) {
        console.error('Error: ' + err);
    }
});

stopShareButton.addEventListener('click', () => {
    if (mediaStream) {
        let tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());  // Encerra o stream
        mediaStream = null;

        // Fecha a aba aberta
        if (newWindow) {
            newWindow.close();
            newWindow = null;
        }

        // Atualiza os botões de controle
        startShareButton.disabled = false;
        stopShareButton.disabled = true;
    }
});
