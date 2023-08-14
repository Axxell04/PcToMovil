const btnDirArchivos = document.querySelector('.btn-dir-archivos')
const btnCerrarServer = document.querySelector('.btn-cerrar-server')

URLServer = `${window.location.origin}/`

btnDirArchivos.addEventListener('click', () => {
    btnDirArchivos.style.display = 'none';
    abrirDirArchivos();
})

btnCerrarServer.addEventListener('click', () => {
    btnCerrarServer.style.display = 'none';
    cerrarServer();
})

const abrirDirArchivos = async () => {
    try {
        const res = await fetch(`${URLServer}abrir_dir_archivos/`)
        
    } catch (error) {
        console.log("Error al intentar abrir el directorio")
    } finally {
        btnDirArchivos.style.display = '';
    }
}

const cerrarServer = async () => {
    try {
        const res = await fetch(`${URLServer}cerrar_server/`)
    } catch (error){
        console.log("Error al intentar cerrar el servidor")
    }

}