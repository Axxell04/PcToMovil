const body = document.querySelector("body")
const btnIpServer = document.querySelector('.btn-ip-server')
const btnDirArchivos = document.querySelector('.btn-dir-archivos')
const btnCerrarServer = document.querySelector('.btn-cerrar-server')
const qrServer = document.querySelector('#qr-server')
const contenedorQR = document.querySelector("#contenedor-qr")

URLServer = `${window.location.origin}/`

btnIpServer.addEventListener('click', () =>{
    if (contenedorQR.style.display!='none'){
        contenedorQR.style.display = 'none'
    } else {
        contenedorQR.style.display = ""
    }
})

btnDirArchivos.addEventListener('click', () => {
    btnDirArchivos.style.display = 'none';
    abrirDirArchivos();
})

btnCerrarServer.addEventListener('click', () => {
    body.style.background = "linear-gradient(to right, #6f0000, #200122)";
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