document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('letraForm');
    const resultado = document.getElementById('letraResultado');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const artista = document.getElementById('artista').value.trim();
        const cancion = document.getElementById('cancion').value.trim();

        if (!artista || !cancion) {
            resultado.innerHTML = '<p style="color: #ff6b6b;">❗ Por favor ingresa ambos campos.</p>';
            return;
        }

        const urlLetra = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`;
        resultado.innerHTML = '<p style="color: #bb86fc;">🔎 Buscando letra...</p>';

        try {
            const responseLetra = await fetch(urlLetra);
            const dataLetra = await responseLetra.json();

            if (!responseLetra.ok || !dataLetra.lyrics) {
                resultado.innerHTML = '<p style="color: #ff6b6b;">❌ Letra no encontrada.</p>';
                return;
            }

            // Buscar audio con iTunes API
            const audioHTML = await buscarPreview(artista, cancion);

            resultado.innerHTML = `
                <h2 style="color:#bb86fc;">🎵 Letra de ${cancion} - ${artista}</h2>
                <pre>${dataLetra.lyrics}</pre>
                <br>${audioHTML}
            `;
        } catch (error) {
            resultado.innerHTML = '<p style="color: #ff6b6b;">🚫 Error al conectar con la API.</p>';
            console.error(error);
        }
    });

    // Función auxiliar para buscar audio
    async function buscarPreview(artista, cancion) {
        const query = encodeURIComponent(`${artista} ${cancion}`);
        const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const track = data.results[0];
                return `
                    <div style="margin-top:20px;">
                        <p><strong>${track.trackName}</strong> - ${track.artistName}</p>
                        <img src="${track.artworkUrl100}" alt="Portada" style="border-radius:10px; margin-top:10px;">
                        <br><audio controls src="${track.previewUrl}" style="margin-top:10px; width:100%;"></audio>
                    </div>
                `;
            } else {
                return `<p style="color:#ffb347;">🎧 Audio no encontrado.</p>`;
            }
        } catch (error) {
            console.error(error);
            return `<p style="color:#ff6b6b;">❌ Error al buscar audio.</p>`;
        }
    }
});
