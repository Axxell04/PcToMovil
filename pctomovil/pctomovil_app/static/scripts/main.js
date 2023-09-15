const inputArchivos = document.querySelector('#archivos')
const formSubir = document.querySelector('.form-subir')
const btnSubir = document.querySelector('#btn-subir')

const mensaje = document.querySelector('.mensaje')

const categorias = document.querySelector('.categorias')
const catTodos = document.querySelector('.todos')
const catImagenes = document.querySelector('.imagenes')
const catVideos = document.querySelector('.videos')
const catDocumentos = document.querySelector('.documentos')
const catComprimidos = document.querySelector('.comprimidos')
const catOtros = document.querySelector('.otros')

const containerArchivos = document.querySelector('#container-archivos')
const templateArchivo = document.querySelector('.template-archivo').content

const containerImgVp = document.querySelector('.container-img-vp')
const imgVp = document.querySelector('#img-vp')

URLServer = `${window.location.origin}/`

// Configurando la altura del contenedor de archivos
let alturaVentana = window.innerHeight;
document.querySelector('body').style.maxHeight = `${alturaVentana}px`
document.querySelector('body').style.minHeight = `${alturaVentana}px`
const containerCategorias = document.querySelector('#container-superior')
console.log(containerCategorias.clientHeight)
containerArchivos.style.maxHeight = `${alturaVentana - containerCategorias.clientHeight}px`

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
    llamarOtros(e);
    
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

const llamarOtros = (e) => {
    if (e.target.classList.contains('otros')) {
        listarArchivos('otros')
    }
    e.stopPropagation(e);
}

containerArchivos.addEventListener('click', (e) => {
    obtenerArchivo(e);
    vistaPrevia(e);
})

const vistaPrevia = (e) => {
    console.log(typeof(e.target.dataset.vp))
    if (e.target.classList.contains('archivo') && e.target.dataset.vp == 'true') {
        console.log(e.target)
        imgVp.src = `${URLServer}archivo/vista_previa/${e.target.dataset.path}`;
        containerImgVp.style.display = 'flex';
    } else if (e.target.parentElement.parentElement.classList.contains('archivo') && e.target.parentElement.parentElement.dataset.vp == 'true') {
        console.log(e.target.parentElement.parentElement)
        imgVp.src = `${URLServer}archivo/vista_previa/${e.target.parentElement.parentElement.dataset.path}`;
        containerImgVp.style.display = 'flex';
    }
    e.stopPropagation(e);
}

containerImgVp.addEventListener('click', e => {
    containerImgVp.style.display = 'none';
})

const obtenerArchivo = (e) => {
    if (e.target.classList.contains('btn-descargar-archivo')) {
        let path_archivo = e.target.dataset.path;
        descargarArchivo(path_archivo);
    }

    e.stopPropagation(e);
}

btnSubir.addEventListener('click', (e) => {
    e.preventDefault()
    const archivosSeleccionados = Array.from(inputArchivos.files)
    
    archivosSeleccionados.forEach(archivo => {
        console.log(archivo)
    });

    if (archivosSeleccionados.length > 0) {
        const formData = new FormData(formSubir)
        
        subiendoArchivo(formData);
        mensaje.classList.add('mostrar')
    }
    

    // const archivoSeleccionado = inputArchivo.files[0]
    // if (archivoSeleccionado) {
    //     const formData = new FormData(formSubir)
    //     subiendoArchivo(formData);
    //     mensaje.classList.add('mostrar')
    // }
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
            inputArchivos.value = ''
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
        templateArchivo.querySelector('.archivo').dataset.path = archivo.path;
        templateArchivo.querySelector('.archivo').dataset.vp = false;
        let listExt = ['jpg','jpeg','png']
        // console.log(archivo.path.split('.').pop())
        listExt.forEach(ext => {
            if (archivo.path.split('.').pop() == ext){
                templateArchivo.querySelector('.archivo').dataset.vp = true;
            }
        });

        const clone = templateArchivo.cloneNode(true);
        fragment.appendChild(clone);
        
    });
    containerArchivos.appendChild(fragment)
}

const descargarArchivo = (path_archivo) => {
    location.href=`${URLServer}archivo/descargar/${path_archivo}`
}