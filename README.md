# MerriX

Historia:
Cuando empezó la cuarentena 2020 queria ver una pelicula con alguien, y solo con una aplicacion se podia hacer. 
El problema era que alguien tenia un celular viejo, por lo que esta aplicacion le resultaba muy lenta. Entonces, a falta de otras aplicaciones mas ligeras, decidi hacer la mia.
La hice lo mas simple y liviana posible, por lo que no tiene gran cantidad de cosas.

Funcionamiento:

Video:
Levanta un WebView, al cual se le inyecta js para controlarlo. Con un comando se le pasa el link de un video en one drive y la aplicacion se encarga de sacarle el ui (con un comando manual por si no funciona)
Los botones en pantalla le inyectan las funciones de play/pause, retroceder y adelantar.

Chat:
Por WebSockets se mandan los comandos que uno hace, los cuales los recibe un servidor y los devuelve a todos los usuarios al mismo tiempo.
Lo mismo para los mensajes, con la unica diferencia de que los mensajes se muestran en el chat y los comandos no.

Usuario:
Se le asigna al usuario un numero al azar, el cual se puede cambiar con un comando. 

DEMO:
https://www.youtube.com/watch?v=AtggbgNcgHo

AVISO:
Claramente el tema del webview y mandar los comandos por websockets no es lo mejor ni lo mas eficiente. Este sistema fue hecho para que la carga del video no dependa de un servidor no pago y con poca velocidad. 
Se eligió OneDrive por la simpleza para sacar la ui.
