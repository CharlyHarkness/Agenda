//======================================
//      AGENDA ESCOLAR
//======================================

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const titulo = document.getElementById("titulo");
const materia = document.getElementById("materia");
const descripcion = document.getElementById("descripcion");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");

const lista = document.getElementById("listaTareas");

const guardar = document.getElementById("guardar");

const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");
const vencidas = document.getElementById("vencidas");

const recordatorios = document.getElementById("recordatorios");

//======================================

guardar.addEventListener("click", agregarTarea);

//======================================

function agregarTarea(){

    if(
        titulo.value.trim()=="" ||
        materia.value=="" ||
        fecha.value=="" ||
        hora.value==""
    ){

        alert("Completa todos los campos.");

        return;

    }

    const tarea={

        id:Date.now(),

        titulo:titulo.value,

        materia:materia.value,

        descripcion:descripcion.value,

        fecha:fecha.value,

        hora:hora.value,

        completada:false

    };

    tareas.push(tarea);

    guardarLocal();

    limpiarFormulario();

    mostrarTareas();

}

//======================================

function limpiarFormulario(){

    titulo.value="";

    materia.value="";

    descripcion.value="";

    fecha.value="";

    hora.value="";

}

//======================================

function guardarLocal(){

    localStorage.setItem(
        "tareas",
        JSON.stringify(tareas)
    );

}

//======================================

function mostrarTareas(){

    lista.innerHTML="";

    ordenarTareas();

    tareas.forEach(tarea=>{

        crearTarjeta(tarea);

    });

    actualizarEstadisticas();

    mostrarRecordatorios();

}

//======================================

function ordenarTareas(){

    tareas.sort((a,b)=>{

        let A=new Date(a.fecha+"T"+a.hora);

        let B=new Date(b.fecha+"T"+b.hora);

        return A-B;

    });

}

//======================================

function crearTarjeta(tarea){

    const card=document.createElement("div");

    card.className="tarea";

    if(tarea.completada){

        card.classList.add("completada");

    }

    let restante=calcularTiempo(tarea);

    if(restante.vencida){

        card.classList.add("vencida");

    }

    card.innerHTML=`

<h3>${tarea.titulo}</h3>

<div class="materia">
${tarea.materia}
</div>

<p>${tarea.descripcion}</p>

<p class="fechaEntrega">

📅 ${tarea.fecha}

🕒 ${tarea.hora}

</p>

<p class="contador">

${restante.texto}

</p>

<div class="botones">

<button
class="completar"
onclick="completar(${tarea.id})">

${tarea.completada ? "Deshacer" : "Completar"}

</button>

<button
class="editar"
onclick="editar(${tarea.id})">

Editar

</button>

<button
class="eliminar"
onclick="eliminar(${tarea.id})">

Eliminar

</button>

</div>

`;

    lista.appendChild(card);

}

//======================================

function calcularTiempo(tarea){

    let entrega=new Date(

        tarea.fecha+"T"+tarea.hora

    );

    let ahora=new Date();

    let diferencia=entrega-ahora;

    if(diferencia<=0){

        return{

            vencida:true,

            texto:"❌ Tarea vencida"

        };

    }

    let dias=Math.floor(

        diferencia/

        (1000*60*60*24)

    );

    let horas=Math.floor(

        (diferencia%

        (1000*60*60*24))

        /(1000*60*60)

    );

    let minutos=Math.floor(

        (diferencia%

        (1000*60*60))

        /(1000*60)

    );

    return{

        vencida:false,

        texto:

        "⏳ "+dias+

        " días "

        +horas+

        " horas "

        +minutos+

        " minutos"

    };

}

//======================================

function completar(id){

    tareas=tareas.map(t=>{

        if(t.id==id){

            t.completada=!t.completada;

        }

        return t;

    });

    guardarLocal();

    mostrarTareas();

}

//======================================

function eliminar(id){

    if(!confirm("¿Eliminar esta tarea?"))

    return;

    tareas=tareas.filter(

        t=>t.id!=id

    );

    guardarLocal();

    mostrarTareas();

}
//======================================
//          EDITAR TAREA
//======================================

function editar(id){

    let tarea=tareas.find(t=>t.id==id);

    if(!tarea) return;

    titulo.value=tarea.titulo;
    materia.value=tarea.materia;
    descripcion.value=tarea.descripcion;
    fecha.value=tarea.fecha;
    hora.value=tarea.hora;

    eliminar(id);

}

//======================================
//     ACTUALIZAR ESTADÍSTICAS
//======================================

function actualizarEstadisticas(){

    let p=0;
    let c=0;
    let v=0;

    tareas.forEach(t=>{

        let entrega=new Date(
            t.fecha+"T"+t.hora
        );

        if(t.completada){

            c++;

        }else{

            if(entrega<new Date()){

                v++;

            }else{

                p++;

            }

        }

    });

    pendientes.textContent=p;
    completadas.textContent=c;
    vencidas.textContent=v;

}

//======================================
//       RECORDATORIOS
//======================================

function mostrarRecordatorios(){

    recordatorios.innerHTML="";

    let ahora=new Date();

    tareas.forEach(t=>{

        if(t.completada) return;

        let entrega=new Date(
            t.fecha+"T"+t.hora
        );

        let diferencia=entrega-ahora;

        let horas=diferencia/(1000*60*60);

        if(horas<=24 && horas>0){

            crearRecordatorio(
                "⚠️ Entrega próxima",
                t
            );

        }

        if(horas<=1 && horas>0){

            crearRecordatorioUrgente(
                "🚨 ¡Entrega en menos de una hora!",
                t
            );

        }

        if(horas<=0){

            crearRecordatorioVencido(
                "❌ Tarea vencida",
                t
            );

        }

    });

}

//======================================

function crearRecordatorio(tituloAlerta,t){

    const div=document.createElement("div");

    div.className="alerta";

    div.innerHTML=`

<h3>${tituloAlerta}</h3>

<p><strong>${t.titulo}</strong></p>

<p>${t.materia}</p>

<p>${t.fecha}</p>

<p>${t.hora}</p>

`;

    recordatorios.appendChild(div);

}

//======================================

function crearRecordatorioUrgente(tituloAlerta,t){

    const div=document.createElement("div");

    div.className="alerta alertaHoy";

    div.innerHTML=`

<h3>${tituloAlerta}</h3>

<p><strong>${t.titulo}</strong></p>

<p>${t.materia}</p>

<p>${t.fecha}</p>

<p>${t.hora}</p>

`;

    recordatorios.appendChild(div);

}

//======================================

function crearRecordatorioVencido(tituloAlerta,t){

    const div=document.createElement("div");

    div.className="alerta alertaVencida";

    div.innerHTML=`

<h3>${tituloAlerta}</h3>

<p><strong>${t.titulo}</strong></p>

<p>${t.materia}</p>

<p>${t.fecha}</p>

<p>${t.hora}</p>

`;

    recordatorios.appendChild(div);

}

//======================================
//      ACTUALIZAR CADA MINUTO
//======================================

setInterval(()=>{

    mostrarTareas();

},60000);

//======================================
//       COLORES MATERIAS
//======================================

function obtenerClaseMateria(nombre){

    nombre=nombre.toLowerCase();

    if(nombre.includes("android")) return "android";

    if(nombre.includes("ios")) return "ios";

    if(nombre.includes("humanismo")) return "humanismo";

    if(nombre.includes("humanidades")) return "humanidades";

    if(nombre.includes("organismos")) return "organismos";

    if(nombre.includes("matemáticas")) return "matematicas";

    if(nombre.includes("matematicas")) return "matematicas";

    if(nombre.includes("histórica")) return "historia";

    if(nombre.includes("historica")) return "historia";

    if(nombre.includes("orientación")) return "orientacion";

    if(nombre.includes("orientacion")) return "orientacion";

    return "";

}

//======================================
//     APLICAR COLOR A MATERIA
//======================================

function pintarMaterias(){

    document.querySelectorAll(".materia").forEach(div=>{

        let clase=obtenerClaseMateria(
            div.textContent
        );

        if(clase!=""){

            div.classList.add(clase);

        }

    });

}

//======================================

const observer=new MutationObserver(()=>{

    pintarMaterias();

});

observer.observe(lista,{

    childList:true

});
//======================================
//      RESALTAR CLASE ACTUAL
//======================================

function resaltarClaseActual(){

    const dias=[1,2,3,4,5]; // Lunes-Viernes

    const hoy=new Date();

    if(!dias.includes(hoy.getDay())) return;

    const horaActual=hoy.getHours()*60+hoy.getMinutes();

    const horarios=[
        [13,10,14,0],
        [14,0,14,50],
        [14,50,15,40],
        [15,40,16,30],
        [16,50,17,40],
        [17,40,18,30],
        [18,30,19,20]
    ];

    document
    .querySelectorAll("tbody td")
    .forEach(td=>td.classList.remove("claseActual"));

    let fila=-1;

    horarios.forEach((h,i)=>{

        let inicio=h[0]*60+h[1];
        let fin=h[2]*60+h[3];

        if(horaActual>=inicio && horaActual<fin){

            fila=i;

        }

    });

    if(fila==-1) return;

    const tabla=document.querySelector("tbody");

    const filas=tabla.querySelectorAll("tr");

    const columna=hoy.getDay();

    if(filas[fila]){

        const celdas=filas[fila].querySelectorAll("td");

        if(celdas[columna]){

            celdas[columna].classList.add("claseActual");

        }

    }

}

//======================================
//      BARRA DE PROGRESO
//======================================

function crearBarraProgreso(){

    if(document.getElementById("barraProgreso")) return;

    const contenedor=document.createElement("div");

    contenedor.style.margin="20px auto";
    contenedor.style.width="92%";
    contenedor.style.maxWidth="1200px";

    contenedor.innerHTML=`

<h2>Progreso del semestre</h2>

<div style="
width:100%;
height:28px;
background:rgba(255,255,255,.15);
border-radius:30px;
overflow:hidden;
">

<div id="barraProgreso"

style="
height:100%;
width:0%;
background:linear-gradient(90deg,#9333ea,#2563eb);
transition:.5s;
">

</div>

</div>

<p id="textoProgreso"
style="
margin-top:10px;
font-weight:bold;
">
0%
</p>

`;

    document
    .querySelector(".estadisticas")
    .after(contenedor);

}

//======================================

function actualizarBarra(){

    const total=tareas.length;

    if(total==0){

        document.getElementById("barraProgreso").style.width="0%";
        document.getElementById("textoProgreso").textContent="0%";

        return;

    }

    let hechas=tareas.filter(t=>t.completada).length;

    let porcentaje=Math.round(
        hechas/total*100
    );

    document.getElementById("barraProgreso").style.width=porcentaje+"%";

    document.getElementById("textoProgreso").textContent=

    porcentaje+"% completado";

}

//======================================
//      BUSCADOR
//======================================

function crearBuscador(){

    if(document.getElementById("busqueda")) return;

    const buscador=document.createElement("input");

    buscador.type="text";

    buscador.placeholder="🔍 Buscar tarea...";

    buscador.id="busqueda";

    buscador.style.marginBottom="20px";

    document
    .querySelector(".lista")
    .insertBefore(
        buscador,
        lista
    );

    buscador.addEventListener("keyup",()=>{

        let texto=buscador.value.toLowerCase();

        document
        .querySelectorAll(".tarea")
        .forEach(card=>{

            card.style.display=

            card.textContent.toLowerCase().includes(texto)

            ? "block"

            : "none";

        });

    });

}

//======================================
//      NOTIFICACIONES
//======================================

if("Notification" in window){

    Notification.requestPermission();

}

function revisarNotificaciones(){

    if(Notification.permission!="granted") return;

    let ahora=new Date();

    tareas.forEach(t=>{

        if(t.completada) return;

        let entrega=new Date(
            t.fecha+"T"+t.hora
        );

        let diferencia=entrega-ahora;

        let minutos=Math.floor(

            diferencia/(1000*60)

        );

        if(minutos===60){

            new Notification(

                "📚 Agenda Escolar",

                {

                    body:

                    "La tarea '"+

                    t.titulo+

                    "' vence en una hora."

                }

            );

        }

    });

}

//======================================
//      INICIO
//======================================

crearBarraProgreso();

crearBuscador();

mostrarTareas();

actualizarBarra();

resaltarClaseActual();

revisarNotificaciones();

setInterval(()=>{

    mostrarTareas();

    actualizarBarra();

    resaltarClaseActual();

    revisarNotificaciones();

},60000);


const Camera = {
    stream: null,
    video: document.getElementById('camera'),
    canvas: document.getElementById('canvas'),
    photo: document.getElementById('photo'),

    async startCamera() {
        try {
            // Pide permiso para usar la cámara
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // 'user' = frontal, 'environment' = trasera
                audio: false
            });
            this.video.srcObject = this.stream;
            console.log('Cámara iniciada');
        } catch (err) {
            alert('Error al abrir cámara: ' + err.message);
        }
    },

    takePhoto() {
        if (!this.stream) {
            alert('Primero abre la cámara');
            return;
        }
        
        // Captura el frame actual
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas.getContext('2d').drawImage(this.video, 0, 0);
        
        // Convierte a imagen
        const imageData = this.canvas.toDataURL('image/png');
        this.photo.src = imageData;
        
        // Vibración al tomar foto
        if (navigator.vibrate) navigator.vibrate(50);
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.stream = null;
            console.log('Cámara cerrada');
        }
    }
};




