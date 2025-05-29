document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('letraForm');
    const resultado = document.getElementById('letraResultado');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const artista = document.getElementById('artista').value.trim();
        const cancion = document.getElementById('cancion').value.trim();

        if (!artista || !cancion) {
            resultado.innerHTML = '<p style="color: #ff6b6b;">Por favor ingresa ambos campos.</p>';
            return;
        }

        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`;

        resultado.innerHTML = '<p style="color: #bb86fc;">🔎 Buscando letra...</p>';

        try {
            const response = await fetch(url);

            if (!response.ok) {
                resultado.innerHTML = '<p style="color: #ff6b6b;">❌ Letra no encontrada. Verifica el nombre del artista o la canción.</p>';
                return;
            }

            const data = await response.json();

            if (data.lyrics) {
                resultado.innerHTML = `<pre>${data.lyrics}</pre>`;
            } else {
                resultado.innerHTML = '<p style="color: #ff6b6b;">⚠️ Letra no disponible.</p>';
            }

        } catch (error) {
            resultado.innerHTML = '<p style="color: #ff6b6b;">🚫 Error al conectar con la API.</p>';
            console.error(error);
        }
    });
});
