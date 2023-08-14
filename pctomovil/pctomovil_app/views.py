from django.shortcuts import render
from django.http import JsonResponse, FileResponse, Http404
from pathlib import Path
from pctomovil.settings import ALLOWED_HOSTS
import os
import signal
import shutil
import subprocess
import pygetwindow
import threading
import time

BASE_DIR = Path(__file__).resolve().parent
path_archivos = os.path.join(BASE_DIR.parent, 'archivos')

if not os.path.exists(path_archivos):
    os.mkdir(path_archivos)


def inicio(request):
    ordenar_archivos()
    client_ip = request.META.get('REMOTE_ADDR')
    
    if client_ip == ALLOWED_HOSTS[0]:
        contexto = {
            'ip_server': client_ip
        }

        return render(request, 'server.html', contexto)

    return render(request, 'inicio.html')

def lista_archivos(request, categ):
    ordenar_archivos()
    list_arch = []
    if categ == 'todos':
        try:
            list_arch = generar_lista(path_archivos)
                
        except:
            print("Error al generar la lista")
    elif categ == 'imagenes':  
        try:
            path_dir = os.path.join(path_archivos, 'Imagenes')
            list_arch = generar_lista(path_dir)
                
        except:
            print("Error al generar la lista")
    elif categ == 'videos':  
        try:
            path_dir = os.path.join(path_archivos, 'Videos')
            list_arch = generar_lista(path_dir)
                            
        except:
            print("Error al generar la lista")
    elif categ == 'documentos':  
        try:
            path_dir = os.path.join(path_archivos, 'Documentos')
            list_arch = generar_lista(path_dir)
                            
        except:
            print("Error al generar la lista")
    elif categ == 'comprimidos':  
        try:
            path_dir = os.path.join(path_archivos, 'Comprimidos')
            list_arch = generar_lista(path_dir)

        except:
            print("Error al generar la lista")
            
    if list_arch:
        datos = {'message': "Success", 'archivos': list_arch}
    else:
        datos = {'message': "Error"}
    return JsonResponse(datos)

def subir_archivo(request):
    guardar_archivo(request.FILES['archivo'])
    datos = {'message': "Success"}
    ordenar_archivos()
    return JsonResponse(datos)

def descargar_archivo(request, path):
    nombre_archivo = path.split('/')[-1]
    if os.path.exists(path):
        response = FileResponse(open(path, 'rb'))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        return response
    else:
        raise Http404("El archivo no existe")
    
    
###########################    
##### FUNCIONALIDADES #####
###########################

list_img = ['png','jpg','jpeg','gif','bmp','tiff','tif','psd','svg','raw','webp','heic','heif']
list_vid = ['mp4','avi','mov','wmv','mkv','flv','webm','mpeg','avchd','3gp','3gp2']
list_documentos = ["txt","doc","docx","pdf","rtf","odt","xls","xlsx","csv","ppt","pptx","odp","epub","html","md"]
list_comp = ['zip','rar','7z','tar','arj']
def ordenar_archivos():
    archivos = os.listdir(path_archivos)
    for archivo in archivos:
        if (os.path.isfile(os.path.join(path_archivos, archivo))):
            extencion = archivo.split('.')[-1]
            if extencion in list_img:
                path_origen = os.path.join(path_archivos, archivo)
                path_destino = os.path.join(path_archivos, 'Imagenes', archivo)
                if not os.path.exists(os.path.dirname(path_destino)):
                    os.mkdir(os.path.dirname(path_destino))

                shutil.move(path_origen, path_destino)
            elif extencion in list_vid:
                path_origen = os.path.join(path_archivos, archivo)
                path_destino = os.path.join(path_archivos, 'Videos', archivo)
                if not os.path.exists(os.path.dirname(path_destino)):
                    os.mkdir(os.path.dirname(path_destino))

                shutil.move(path_origen, path_destino)
            elif extencion in list_comp:
                path_origen = os.path.join(path_archivos, archivo)
                path_destino = os.path.join(path_archivos, 'Comprimidos', archivo)
                if not os.path.exists(os.path.dirname(path_destino)):
                    os.mkdir(os.path.dirname(path_destino))

                shutil.move(path_origen, path_destino)
            elif extencion in list_documentos:
                path_origen = os.path.join(path_archivos, archivo)
                path_destino = os.path.join(path_archivos, 'Documentos', archivo)
                if not os.path.exists(os.path.dirname(path_destino)):
                    os.mkdir(os.path.dirname(path_destino))

                shutil.move(path_origen, path_destino)

ordenar_archivos()

def generar_lista(path_dir):
    list_arch = []
    if os.path.basename(path_dir) != 'archivos':
        archivos = os.listdir(path_dir)
            
        for archivo in archivos:
            path_archivo = os.path.join(path_dir, archivo)
            peso_archivo = os.path.getsize(path_archivo)
            nombre_archivo = archivo

            arch = {
                'nombre': nombre_archivo,
                'peso': round(peso_archivo / 1048576, 2),
                'path': path_archivo
            }
            list_arch.append(arch)
    else:
        directorios = os.listdir(path_dir)
        for dir in directorios:
                path_dir = os.path.join(path_archivos, dir)
                archivos = os.listdir(path_dir)
                for archivo in archivos:
                    path_archivo = os.path.join(path_dir, archivo)
                    peso_archivo = os.path.getsize(path_archivo)
                    nombre_archivo = archivo

                    arch = {
                        'nombre': nombre_archivo,
                        'peso': round(peso_archivo / 1048576, 2),
                        'path': path_archivo
                    }
                    list_arch.append(arch)
    return list_arch

def guardar_archivo(archivo):    
    ruta_archivo_destino = os.path.join(path_archivos, archivo.name)
    with open(ruta_archivo_destino, 'wb') as destino:
        for chunk in archivo.chunks():
            destino.write(chunk)

def abrir_dir_archivos(request):
    client_ip = request.META.get('REMOTE_ADDR')
    if client_ip == ALLOWED_HOSTS[0]:
        def focus():
            ejecucion = True
            while ejecucion:
                window = pygetwindow.getWindowsWithTitle('archivos')
                if window:
                    ejecucion = False
                    try:
                        window[0].activate()
                    except:
                        pass
                        window[0].minimize()
                        window[0].restore()
        
        window = pygetwindow.getWindowsWithTitle('archivos')
        if window:
            try:
                window[0].activate()
            except:
                window[0].minimize()
                window[0].restore()
        else:
            subproceso_1 = subprocess.Popen(['explorer', path_archivos])
            subproceso_1.wait()
            hilo_1 = threading.Thread(target=focus)
            hilo_1.run()
        
        datos = {'message': "Success"}
        time.sleep(3)
    else:
        datos = {'message': "Error"}
    return JsonResponse(datos)

def cerrar_server(request):
    os.kill(os.getpid(), signal.SIGINT)
    datos = {'message': "Error"}
    return JsonResponse(datos)
