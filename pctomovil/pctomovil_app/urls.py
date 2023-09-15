from django.urls import path
from django.contrib.staticfiles.urls import static
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('archivo/subir/', views.subir_archivo, name='subir_archivo'),
    path('archivo/lista/<str:categ>', views.lista_archivos, name='listar_archivos'),
    path('archivo/descargar/<path:path>', views.descargar_archivo, name='descargar_archivo'),
    path('archivo/vista_previa/<path:path>', views.vista_previa, name="vista_previa"),
    path('abrir_dir_archivos/', views.abrir_dir_archivos, name='abrir_dir_archivos'),
    path('cerrar_server/', views.cerrar_server, name='cerrar_server')
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

