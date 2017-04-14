var wsUri = "ws://" + document.location.host + document.location.pathname + "tablero";
var websocket = new WebSocket(wsUri);
var output = document.getElementById("output");

var mensajes = document.getElementById('conversacion');
var boton = document.getElementById('btnEnviar');
var nombre = document.getElementById('usuario');
var mensaje = document.getElementById('mensaje');

websocket.onerror = function (evt) {
    onError(evt);
};

websocket.onmessage = function (evt) {
    onMessage(evt);
};

websocket.onopen = function (evt) {
    onOpen(evt);
};

boton.addEventListener('click', enviar);

function writeToScreen(message) {
    console.log(message + "<br>");
}

function onError(evt) {
    console.log(evt.data);
}

function onOpen() {
    console.log("Connected to:" + wsUri);
}

function onMessage(evt) {
    console.log('Received ==>' + evt.data);
    var obj = JSON.parse(evt.data);
    var i = 0;
    for (var key in obj) {
        console.log(' key==>' + key + ' value==>' + obj[key]);
        i += 1;
    }
    console.log(i);
    if (i === 9 || i === 11) {
        draw(evt.data);
    } else if (i === 2) {
        mensajes.innerHTML += '<div class="well well-sm"><strong>' + obj.nombre + '</strong>:' + obj.mensaje + '</div>';
    }
}

function sendText(json) {
    console.log("sending text: " + json);
    websocket.send(json);
}



function enviar() {
    var msg = {
        nombre: nombre.value,
        mensaje: mensaje.value
    };
    websocket.send(JSON.stringify(msg));
    console.log('Mensaje: Nombre: ' + msg.nombre + ' ==> Mensaje: ' + msg.mensage);
    mensajes.innerHTML += '<div class="well well-sm"><strong>' + msg.nombre + '</strong>:' + msg.mensaje + '</div>';
    mensaje.value = '';
}