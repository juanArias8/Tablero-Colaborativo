var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var salida = document.getElementById("salida");
var colores = document.getElementById("colores");
var listaTam = document.getElementById("tamano");
var save = document.getElementById("imagen");
var figura = document.getElementById("figura");
var tipoClick = false;
var punto = 0;
var color = colores.value;
var tamano = 5;
var s = 1;
var dragging = false;
var dragStartLocation;
var fillBox = document.getElementById("fillBox");
var polygonSides = document.getElementById("polygonSides");
var polygonAngle = document.getElementById("polygonAngle");
var snapshot;
var actualPos;

context.lineCap = "round";
canvas.addEventListener('mousedown', dragStart, false);
canvas.addEventListener('mousemove', drag, false);
canvas.addEventListener('mouseup', dragStop, false);

function dragStart(event) {
    if ((figura.value === "lapiz") || (figura.value === "borrador")) {
        tipoClick = true;
        actualPos = getCanvasCoordinates(event);
    } else {
        dragging = true;
        dragStartLocation = getCanvasCoordinates(event);
        takeSnapshot();
    }
}

function drag(event) {
    if (figura.value === "lapiz") {
        if (tipoClick) {
            punto = getCanvasCoordinates(event);
            sendFigures("lapiz", punto);
            actualPos = {
                x: punto.x,
                y: punto.y
            };
        }
    } else if (figura.value === "borrador") {
        if (tipoClick) {
            punto = getCanvasCoordinates(event);
            sendFigures("borrador", punto);
            actualPos = {
                x: punto.x,
                y: punto.y
            };
        }
    } else {
        var position;
        if (dragging === true) {
            restoreSnapshot();
            position = getCanvasCoordinates(event);
            d = {"tipo": figura.value,
                "x1": position.x,
                "y1": position.y,
                "x2": dragStartLocation.x,
                "y2": dragStartLocation.y,
                "color": colores.value,
                "tamano": listaTam.value,
                "fill": fillBox.checked,
                "sides": polygonSides.value,
                "angle": polygonAngle.value * (Math.PI / 180),
                "limpiar": s};
            draw(JSON.stringify(d));
        }
    }
}


function dragStop(event) {
    if (figura.value === "lapiz") {
        tipoClick = false;
    } else if (figura.value === "borrador") {
        tipoClick = false;
    } else {
        dragging = false;
        var position = getCanvasCoordinates(event);
        sendFigures(figura.value, position);
    }
}

function draw(figura)
{
    figura = JSON.parse(figura);
    if (figura.limpiar === 0) {
        context.clearRect(0, 0, 880, 500);
    } else {
        context.lineWidth = figura.tamano;
        context.strokeStyle = figura.color;
        context.fillStyle = figura.color;
        if (figura.tipo === "lapiz") {
            drawPunto(figura);
        } else if (figura.tipo === "borrador") {
            drawPunto(figura);
        } else if (figura.tipo === "linea") {
            drawLine(figura);
        } else if (figura.tipo === "cuadro") {
            drawRect(figura);
        } else if (figura.tipo === "circulo") {
            drawCircle(figura);
        } else if (figura.tipo === "poligono") {
            drawPolygon(figura);
        }
        if (figura.fill) {
            context.fill();
        } else {
            context.stroke();
        }
    }
}

function drawLine(figura) {
    context.beginPath();
    context.moveTo(figura.x2, figura.y2);
    context.lineTo(figura.x1, figura.y1);
    context.stroke();
    context.closePath();
}

function drawCircle(position) {
    var radius = Math.sqrt(Math.pow((position.x2 - position.x1), 2) + Math.pow((position.y2 - position.y1), 2));
    context.beginPath();
    context.arc(position.x2, position.y2, radius, 0, 2 * Math.PI, false);
}

function drawRect(position) {
    context.beginPath();
    context.rect(position.x2, position.y2, position.x1 - position.x2, position.y1 - position.y2);
}

function drawPolygon(position) {
    var coordinates = [],
            radius = Math.sqrt(Math.pow((position.x2 - position.x1), 2) + Math.pow((position.y2 - position.y1), 2)),
            index = 0;

    for (index = 0; index < position.sides; index++) {
        coordinates.push({x: position.x2 + radius * Math.cos(position.angle), y: position.y2 - radius * Math.sin(position.angle)});
        position.angle += (2 * Math.PI) / position.sides;
    }
    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < position.sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }
    context.closePath();
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
            y = event.clientY - canvas.getBoundingClientRect().top;
    return {x: x, y: y};
}

function sendFigures(figura, position) {
    var d;
    if (figura === "lapiz") {
        d = {"tipo": "lapiz",
            "x": position.x,
            "y": position.y,
            "actualPosX": actualPos.x,
            "actualPosY": actualPos.y,
            "color": colores.value,
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "limpiar": s};
    } else if (figura === "borrador") {
        d = {"tipo": "borrador",
            "x": position.x,
            "y": position.y,
            "actualPosX": actualPos.x,
            "actualPosY": actualPos.y,
            "color": '#FFFFFF',
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "limpiar": s};
    } else if (figura === "linea") {
        d = {"tipo": "linea",
            "x1": position.x,
            "y1": position.y,
            "x2": dragStartLocation.x,
            "y2": dragStartLocation.y,
            "color": colores.value,
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "limpiar": s};
    } else if (figura === "cuadro") {
        d = {"tipo": "cuadro",
            "x1": position.x,
            "y1": position.y,
            "x2": dragStartLocation.x,
            "y2": dragStartLocation.y,
            "color": colores.value,
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "limpiar": s};

    } else if (figura === "circulo") {
        d = {"tipo": "circulo",
            "x1": position.x,
            "y1": position.y,
            "x2": dragStartLocation.x,
            "y2": dragStartLocation.y,
            "color": colores.value,
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "limpiar": s};

    } else if (figura === "poligono") {
        d = {"tipo": "poligono",
            "x1": position.x,
            "y1": position.y,
            "x2": dragStartLocation.x,
            "y2": dragStartLocation.y,
            "color": colores.value,
            "tamano": listaTam.value,
            "fill": fillBox.checked,
            "sides": polygonSides.value,
            "angle": polygonAngle.value * (Math.PI / 180),
            "limpiar": s};

    } else {
        d = {"limpiar": 0};
    }
    draw(JSON.stringify(d));
    sendText(JSON.stringify(d));
}

function drawPunto(figura) {
    context.beginPath();
    context.strokeStyle = figura.color;
    context.moveTo(figura.actualPosX, figura.actualPosY);
    context.lineTo(figura.x, figura.y);
    context.lineWidth = figura.tamano;
    context.fill();
    context.stroke();
    context.closePath();
}

function limpiar() {
    sendFigures("limpiar", {"x": 1, "y": 2});
}

function guardar() {
    var dataUrl = canvas.toDataURL('image/png');
    save.download = "tablero.png";
    save.href = dataUrl;
    save.click();
}
