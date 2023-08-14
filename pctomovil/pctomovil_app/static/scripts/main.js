const inputArchivo = document.querySelector('#archivo')
const formSubir = document.querySelector('.form-subir')
const btnSubir = document.querySelector('#btn-subir')

const mensaje = document.querySelector('.mensaje')

const categorias = document.querySelector('.categorias')
const catTodos = document.querySelector('.todos')
const catImagenes = document.querySelector('.imagenes')
const catVideos = document.querySelector('.videos')
const catDocumentos = document.querySelector('.documentos')
const catComprimidos = document.querySelector('.comprimidos')

const containerArchivos = document.querySelector('#container-archivos')
const templateArchivo = document.querySelector('.template-archivo').content

URLServer = `${window.location.origin}/`

document.addEventListener('DOMContentLoaded', () =>{
    
    listarArchivos('todos');
})

categorias.addEventListener('click', (e) => {
    e.preventDefault();
    llamarTodos(e);
    llamarImagenes(e);
    llamarVideos(e);
    llamarDocumentos(e);
    llamarComprimidos(e);
})

const llamarTodos = (e) => {
    if (e.target.classList.contains('todos')) {
        listarArchivos('todos');
    }
    e.stopPropagation(e);
}

const llamarImagenes = (e) => {
    if (e.target.classList.contains('imagenes')) {
        listarArchivos('imagenes');
    }
    e.stopPropagation(e);
}

const llamarVideos = (e) => {
    if (e.target.classList.contains('videos')) {
        listarArchivos('videos');
    }
    e.stopPropagation(e);
}

const llamarDocumentos = (e) => {
    if (e.target.classList.contains('documentos')) {
        listarArchivos('documentos');
    }
    e.stopPropagation(e);
}

const llamarComprimidos = (e) => {
    if (e.target.classList.contains('comprimidos')) {
        listarArchivos('comprimidos');
    }
    e.stopPropagation(e);
}

containerArchivos.addEventListener('click', (e) => {
    obtenerArchivo(e);
})

const obtenerArchivo = (e) => {
    if (e.target.classList.contains('btn-descargar-archivo')) {
        let path_archivo = e.target.dataset.path;
        descargarArchivo(path_archivo);
    }

    e.stopPropagation(e);
}

btnSubir.addEventListener('click', (e) => {
    
    const archivoSeleccionado = inputArchivo.files[0]
    if (archivoSeleccionado) {
        const formData = new FormData(formSubir)
        subiendoArchivo(formData);
        mensaje.classList.add('mostrar')
    }
    e.preventDefault()
})

const subiendoArchivo = async (formData) => {
    try {
        const res = await fetch(`${URLServer}archivo/subir/`, {
            method:'POST',
            body: formData,
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN
            }

        });

        if (res.ok) {
            inputArchivo.value = ''
            mensaje.classList.remove('mostrar')
            listarArchivos('todos');
        } else {
            alert('Error al subir el archivo')
        }

    } catch (error) {
        console.log("Error al subir el archivo")
    }
}

const listarArchivos = async (categoria) => {
    try {
        const res = await fetch(`${URLServer}archivo/lista/${categoria}`)
        const data = await res.json();
        if (data.message === 'Success') {
            pintarArchivos(data.archivos);
        }
    } catch (error) {
        console.log("Error al listar los archivos")
    }

}

const fragment = document.createDocumentFragment()

const pintarArchivos = (data) => {
    containerArchivos.innerHTML = ''

    data.forEach(archivo => {
    
        if (archivo.nombre.includes('_')){
            while (archivo.nombre.includes('_')) {
                archivo.nombre = archivo.nombre.replace('_', '-')
            }
        }
        templateArchivo.querySelector('.nombre-archivo').textContent = archivo.nombre
        templateArchivo.querySelector('.peso-archivo').textContent = archivo.peso + 'MB';
        templateArchivo.querySelector('.btn-descargar-archivo').dataset.path = archivo.path;
        templateArchivo.querySelector('.btn-descargar-archivo').dataset.nombre = archivo.nombre;

        const clone = templateArchivo.cloneNode(true);
        fragment.appendChild(clone);
    });
    containerArchivos.appendChild(fragment)
}

const descargarArchivo = (path_archivo) => {
    location.href=`${URLServer}archivo/descargar/${path_archivo}`
}