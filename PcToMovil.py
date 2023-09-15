import subprocess
import os
import webbrowser
import threading
import time

import socket

import qrcode

main_path = os.path.abspath(__file__,).replace('PcToMovil.py', '')

def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print(f"Error al obtener la IP local: {e}")



# Obteniendo ip local
direccion_ip = get_local_ip()

# Obtener la ruta del archivo settings.py
# ruta_settings = "./pctomovil/pctomovil/settings.py"
ruta_settings = os.path.join(main_path, "pctomovil/pctomovil/settings.py")


# Leyendo el contenido del archivo settings.py
with open(ruta_settings, 'r') as archivo:
    contenido = archivo.read()

# Buscar la línea que contiene ALLOWED_HOSTS
lineas = contenido.split('\n')
for i, linea in enumerate(lineas):
    if linea.startswith('ALLOWED_HOSTS'):
        indice = i
        break


#Comprobando y actualizando la ip del servidor local
if lineas[indice] != f"ALLOWED_HOSTS = ['{direccion_ip}']":
    lineas[indice] = f"ALLOWED_HOSTS = ['{direccion_ip}']"

    contenido_modificado = '\n'.join(lineas)
    with open(ruta_settings, 'w') as archivo:
        archivo.write(contenido_modificado)

#Abriendo el panel de administración en el navegador
def abrirNav():
    time.sleep(2)
    try:
        ip_server = f'http://{direccion_ip}:5000'
        webbrowser.open(ip_server, new=2, autoraise=True)
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.ERROR_CORRECT_L,
            box_size=10,
            border=4
        )
        qr.add_data(ip_server)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img.save("pctomovil_app/static/codigo_qr.png")
    except Exception:
        print(Exception)

hiloNav = threading.Thread(target=abrirNav)


########################################
## Comandos para arrancar el servidor ##
########################################

cmd_env = os.path.join(main_path,"pctomovil_env","Scripts","activate")
cmd_cd = f"cd {os.path.join(main_path, 'pctomovil/')}"
cmd_runserver = f'python manage.py runserver {direccion_ip}:5000'

try:
    hiloNav.run()
    subprocess.run(f'"{cmd_env}" & {cmd_cd} & {cmd_runserver}',shell=True, check=True)
    
except subprocess.CalledProcessError as e:
    print(f"Error al iniciar el servidor: {e}")
except KeyboardInterrupt:
    print("\nServidor detenido manualmente.")

