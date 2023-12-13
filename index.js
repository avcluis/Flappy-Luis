window.onload = function () {

  let personaje, imagen, menugameover, record;

  const TOPESUPERIOR = 0;
  const TOPEINFERIOR = 520;

  let canvas; //referencia canvas html
  let ctx; //contexto canvas 
  let id, id2; //animaciones
  let posicion = 0;
  
  let menuJuego = false;

  let velocidadPersonaje = 0;
  let gravedad = 0.3;
  const gravedadNiv2=0.35
  let velocidadx = -2.5;

// Niveles --> nº de tuberias a superar
  const Niv1=8
  const Niv2=Niv1+1
  const Niv3=Niv2+20
  const Niv4=Niv3+7
  const Niv5=Niv4+1

  const aumentarVelocidadNiv1=-3.2
  

  let arrayTuberias = []; //posicion tuberias
  let arrayFondos = [];

  let gap = 140 //espacio entre tubos
  let resetActivo = false

  let contador = 0
  let tuberiaContada = false
  let estamosMuertos = false
  let masRapido=false
  
  //localizamos canvas html
  canvas = document.getElementById("miCanvas")

  //generamos su contexto
  ctx = canvas.getContext("2d")

  //Localizamos sonidos html:
  let golpeTubo = document.getElementById("golpeTubo")
  let saltoPajaro = document.getElementById("saltoPajaro")
  saltoPajaro.volume = 1
  let musicaFondo = document.getElementById("musicaFondo")
  let pasarTuberia = document.getElementById("pasarTuberia")
  pasarTuberia.volume = 0.3
  let aumentarVel = document.getElementById("aumentarVelocidad")
  aumentarVel.volume= 0.5

  //Mostramos los records al iniciar el juego:
  mostrarRecords()

  //evita el scroll al pulsar el espacio
  setupCanvasScrollPrevention(canvas)

  function Personaje() {
    //posiciones x,y iniciales (x es fija)
    this.x = 200
    this.y = 200
  }

  //guardamos las posiciones del sprite en el prototype del objeto.
  Personaje.prototype.animacionPersonaje = [
    [115, 381],
    [115, 407],
    [115, 433],
  ];

  //Movimiento del personaje con el juego en funcionamiento.
  Personaje.prototype.skinPersonaje = function () {
    
    velocidadPersonaje += gravedad
    this.y += velocidadPersonaje

    if (this.y <= TOPESUPERIOR) {
      this.y = TOPESUPERIOR
    }

    if (this.y >= TOPEINFERIOR) {
      this.y = TOPEINFERIOR
    }

    DibujarImagen(
      this.imagen,
      this.animacionPersonaje,
      posicion,
      17,
      12,
      this.x,
      this.y,
      40,
      30
    )
    
  }

  //Personaje en movimiento en el menú inicial.
  Personaje.prototype.skinPersonajeMenu = function () {
    
    DibujarImagen(
      this.imagen,
      this.animacionPersonaje,
      posicion,
      17,
      12,
      175,
      250,
      40,
      30
    )
  }

  function Fondo() {
    this.x = 400;
    this.y = 600;
    this.animacionFondo = [[292, 0]];
  }

  function MenuInicial() {
    this.imagen = imagen

    //letras inicio
    this.xInicio = 100;
    this.yInicio = 175;
    this.posicionInicio = [[295, 59]];
    this.anchoInicio = 92;
    this.altoInicio = 25;

    //boton
    this.xBotonInicio = 160;
    this.yBotonInicio = 325;
    this.posicionBotonInicio = [[354, 118]];
    this.anchoBoton = 52;
    this.altoBoton = 29;
  }

  MenuInicial.prototype.skin = function () {
    //letras Inicio
    DibujarImagen(
      this.imagen,
      this.posicionInicio,
      0,
      this.anchoInicio,
      this.altoInicio,
      this.xInicio,
      this.yInicio,
      200,
      50
    )

    //Boton
    DibujarImagen(
      this.imagen,
      this.posicionBotonInicio,
      0,
      this.anchoBoton,
      this.altoBoton,
      this.xBotonInicio,
      this.yBotonInicio,
      70,
      50
    )
  }

  function MenuGameOver() {
    this.imagen = imagen;

    //letras game over
    this.xgameOver = 100;
    this.ygameOver = 120;
    this.posicionGameOver = [[395, 59]];

    //score
    this.xScore = 60;
    this.yScore = 200;
    this.posicionScore = [[3, 259]];
  }

  MenuGameOver.prototype.skin = function () {
    //letras gameover
    DibujarImagen(
      this.imagen,
      this.posicionGameOver,
      0,
      96,
      21,
      this.xgameOver,
      this.ygameOver,
      200,
      50
    )

    //menú de score
    DibujarImagen(
      this.imagen,
      this.posicionScore,
      0,
      113,
      57,
      this.xScore,
      this.yScore,
      280,
      160
    )
  }


  function ScoreTiempoReal() {
    this.imagen = imagen;
    this.x = 5
    this.y = 5
    this.tamañoX = 12;
    this.tamañoY = 18
  }

  //Nº en orden del 0-9
  ScoreTiempoReal.prototype.animacionScore = [
    [496, 60],
    [136, 455],
    [292, 160],
    [306, 160],
    [320, 160],
    [334, 160],
    [292, 184],
    [306, 184],
    [320, 184],
    [334, 184],
  ];

  //Función común, para pintar todos los sprites del juego. (Ahorrar repetir código)
  function DibujarImagen(imagen,animacion,num,tamañoX,tamañoY,x,y,width,height) {

    let n1 = parseInt(num)

    ctx.drawImage(
      imagen,
      animacion[n1][0],
      animacion[n1][1],
      tamañoX,
      tamañoY,
      x,
      y,
      width,
      height
    )
  }

  ScoreTiempoReal.prototype.ComprobarContador = function (contador) {
    let contadorString = contador.toString();

    if (contadorString.length > 1) {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        20,
        30
      )

      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(1),
        this.tamañoX,
        this.tamañoY,
        this.x + 20,
        this.y,
        20,
        30
      )
    } else {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        20,
        30
      )
    }
  }

  //Score obtenido, mostrado dentro del menú
  function ScoreEnMenu() {
    this.imagen = imagen;
    this.x = 280;
    this.y = 247;
    this.tamañoX = 7;
    this.tamañoY = 10;
    
  }

  // Posicion de recorte numeros 0-9
  ScoreEnMenu.prototype.animacionScore = [
    [137, 306],
    [139, 477],
    [137, 489],
    [131, 501],
    [502, 0],
    [502, 12],
    [505, 26],
    [505, 42],
    [293, 242],
    [311, 206],
  ]

  ScoreEnMenu.prototype.ComprobarContador = function (contador) {
    let contadorString = contador.toString();

    if (contadorString.length > 1) {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x - 10,
        this.y,
        15,
        25
      )
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(1),
        this.tamañoX,
        this.tamañoY,
        this.x + 5,
        this.y,
        15,
        25
      )
    } else {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        contadorString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        15,
        25
      )
    }
  }

  /*Función que almacena el RECORD en el almacenamiento local.
  Es el que se muestra en el Menú cuando muere el Personaje*/
  function ScoreLocal(contador) {
    let valorLocalStorage = localStorage.getItem("Record");

    if (valorLocalStorage === null || valorLocalStorage === undefined) {
      localStorage.setItem("Record", contador);
    }

    valorLocalStorage = localStorage.getItem("Record");

    if (contador > valorLocalStorage) {
      localStorage.setItem("Record", contador);
    }
  }

  function Record() {
    this.imagen = imagen;
    this.x = 280;
    this.y = 305;
    this.tamañoX = 7;
    this.tamañoY = 10;
  }

  //Números
  Record.prototype.animacionScore = [
    [137, 306],
    [139, 477],
    [137, 489],
    [131, 501],
    [502, 0],
    [502, 12],
    [505, 26],
    [505, 42],
    [293, 242],
    [311, 206],
  ]

  Record.prototype.pintarRecord = function (record) {
    let recordString = record.toString();

    if (recordString.length > 1) {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        recordString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x - 10,
        this.y,
        15,
        25
      )
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        recordString.charAt(1),
        this.tamañoX,
        this.tamañoY,
        this.x + 5,
        this.y,
        15,
        25
      )
    } else {
      DibujarImagen(
        this.imagen,
        this.animacionScore,
        recordString.charAt(0),
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        15,
        25
      )
    }
  }

  function Medalla() {
    this.imagen = imagen;
    this.x = 92;
    this.y = 262;
    this.tamañoX = 22;
    this.tamañoY = 22;
  }

  //Orden medallas --> bronce, plata, oro
  Medalla.prototype.animacionMedallas = [
    [112, 477],
    [121, 258],
    [121, 282],
  ]

  //Al morir, mostraremos una medalla u otra en función de las tuberías que haya superado.
  Medalla.prototype.pintarMedallas = function (contador) {
    //Medalla de bronce
    if (contador >= 5) {
      DibujarImagen(
        this.imagen,
        this.animacionMedallas,
        0,
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        65,
        65
      )
    }
    //Medalla de plata
    if (contador >= 15) {
      DibujarImagen(
        this.imagen,
        this.animacionMedallas,
        1,
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        65,
        65
      )
    }
    //Medalla de oro
    if (contador >= 25) {
      DibujarImagen(
        this.imagen,
        this.animacionMedallas,
        2,
        this.tamañoX,
        this.tamañoY,
        this.x,
        this.y,
        65,
        65
      )
    }
  }

  function BotonRestart() {
    this.imagen = imagen
    this.x = 170
    this.y = 400
    this.tamañoX = 52
    this.tamañoY = 29
  }

  BotonRestart.prototype.animacionBoton = [[354, 118]]

  BotonRestart.prototype.pintarBotonRestart = function () {
    DibujarImagen(
      this.imagen,
      this.animacionBoton,
      0,
      this.tamañoX,
      this.tamañoY,
      this.x,
      this.y,
      75,
      50
    )
  }

  //Imagen Sprites
  imagen = new Image();
  imagen.src = "imagenes/spritebueno.png";

  function Fondo(x_,y_, anchoX_, altoY_){
    this.imagen=imagen
    this.x=x_
    this.y=y_
    this.anchoX=anchoX_
    this.altoY=altoY_

  }

  Fondo.prototype.animacionFondo=[[292,0]]

  let fondo1 = new Fondo(0, 550, 168, 90)
  let fondo2 = new Fondo(400, 550, 168, 90)

  Fondo.prototype.pintarFondo=function(){
    for (let i = 0; i < arrayFondos.length; i++) {
      arrayFondos[i].x += velocidadx / 2

      DibujarImagen(
        this.imagen,
        this.animacionFondo,
        0,
        arrayFondos[i].anchoX,
        arrayFondos[i].altoY,
        arrayFondos[i].x,
        arrayFondos[i].y,
        404, //tamaño que voy a pintar en el canvas
        200
      )
      
      if (arrayFondos[i].x < -399) {
        arrayFondos[i].x = 400;
      }
    }
  }

  arrayFondos.push(fondo1);

  arrayFondos.push(fondo2);

  // Funcion constructa de tuberias
  function Tuberia(x, y, anchox, altoy) {
    //this.imagen = imagen
    this.x = x; //posición de x donde voy a pintar
    this.y = y; //posición de y       ""
    //Tamaños x e y, que voy a pintar en el canvas:
    this.anchox = anchox; //grosor de la tuberia 
    this.altoy = altoy; //tamaño (largo) tuberia "" 
  }

  // Función constructura tuberia completa (tuberia de arriba y abajo)
  function TuberiaCompleta(tuberia1, tuberia2) {
    this.imagen = imagen
    this.tuberia1 = tuberia1;
    this.tuberia2 = tuberia2;
  }

  let tuberia1Arriba = new Tuberia(400, -264, 60, 400);
  let tuberia1Abajo = new Tuberia(400, 676, 60, -400);

  let tuberiaCompleta1 = new TuberiaCompleta(tuberia1Arriba, tuberia1Abajo);

  arrayTuberias.push(tuberiaCompleta1);
  
  let tuberia2Arriba = new Tuberia(650, -264, 60, 400);
  let tuberia2Abajo = new Tuberia(650, 676, 60, -400);

  let tuberiaCompleta2 = new TuberiaCompleta(tuberia2Arriba, tuberia2Abajo);

  arrayTuberias.push(tuberiaCompleta2);

  //posicion tuberias sprite en orden (1ºtb arriba, 2ºabajo)
  TuberiaCompleta.prototype.animacionTuberias=[[56,323],[84,323]]

  TuberiaCompleta.prototype.pintar=function(){
    for (let i = 0; i < arrayTuberias.length; i++) {
        
      arrayTuberias[i].tuberia1.x += velocidadx;
      arrayTuberias[i].tuberia2.x += velocidadx;

      DibujarImagen(
        this.imagen,
        this.animacionTuberias,
        0,
        26, //--> tamaño a recortar en la imagen
        160, //--> tamaño a recortar en la imagen
        arrayTuberias[i].tuberia1.x,
        arrayTuberias[i].tuberia1.y,
        arrayTuberias[i].tuberia1.anchox, //tamaño que voy a pintar
        arrayTuberias[i].tuberia1.altoy
      )
      
      DibujarImagen(
        this.imagen,
        this.animacionTuberias,
        1,
        26, //--> tamaño a recortar en la imagen
        160, //--> tamaño a recortar en la imagen
        arrayTuberias[i].tuberia2.x,
        arrayTuberias[i].tuberia2.y,
        arrayTuberias[i].tuberia2.anchox, //tamaño que voy a pintar
        arrayTuberias[i].tuberia2.altoy
      )

      if (arrayTuberias[i].tuberia1.x < -60 && arrayTuberias[i].tuberia2.x < -60) {

        arrayTuberias[i].tuberia1.x = 475;
        //calculo, para la posición de la tuberia
        arrayTuberias[i].tuberia1.y =-1 * Math.round(Math.random() * (340 - 80) + 80);
        let entradapx = 400 - -1 * arrayTuberias[i].tuberia1.y + gap;
        let entradapxabajo = 550 - entradapx;
        let longtubo = 400 - entradapxabajo;
        let tamaño = 550 + longtubo;

        arrayTuberias[i].tuberia2.x = 475;
        arrayTuberias[i].tuberia2.y = tamaño;
      }

      //pintamos el fondo encima de las tuberias
      fondo.pintarFondo()

    }
  }

  /*Funcion para ir cogiendo un sprite distinto cada vez que se pinta en el canvas.
  simular que el pájaro vuela*/
  function Aletear() {
    posicion = (posicion + 1) % 3;
  }

  //Comprobar colisiones, y cuando el pajaro ha pasado una tuberia.
  function muerto() {
    //Personaje
    const bIzq = personaje.x;
    const bDer = personaje.x + 40;
    const bUp = personaje.y + 30;
    const bDown = personaje.y;

    for (let i = 0; i < arrayTuberias.length; i++) {
      const tuberia = arrayTuberias[i];

      //Coordenadas de la tubería superior
      const nIzq = tuberia.tuberia1.x
      const nDer = tuberia.tuberia1.x + 60
      const nDown = tuberia.tuberia1.y
      const nUp = tuberia.tuberia1.y + 400

      //Verificar colisión con tubería superior
      if (bDer > nIzq && bIzq < nDer && bUp > nDown && bDown < nUp) {
        estamosMuertos = true
        golpeTubo.play()
      }

      //Coordenadas de la tubería inferior
      const nIzq1 = tuberia.tuberia2.x
      const nDer1 = tuberia.tuberia2.x + 60
      const nDown1 = tuberia.tuberia2.y - 400
      const nUp1 = tuberia.tuberia2.y

      // Verificar colisión con tubería inferior
        if (bDer > nIzq1 && bIzq < nDer1 && bUp > nDown1 && bDown < nUp1 && estamosMuertos===false) {
          /* if (estamosMuertos === false) 
        --> con este if, "soluciono" bug de sonido; ya que si 
        choco con el tubo de arriba y el personaje cae hacia abajo, cuando pasa por la posicion 
        del de abajo volvía a sonar también*/
          estamosMuertos = true;
          golpeTubo.play();
        }

      //Comprobacion de que la tuberia a sobrepasado al personaje (es decir que el personaje no ha colisionado con la tuberia)
      console.log("nDer-->"+nDer);
      console.log("bIzq-->"+bIzq)
      console.log("bDer-->"+bDer)


      // let tam2=0
      // if (nDer <= bIzq && tam2==0 ) {
      //   contador++;
      //   pasarTuberia.play();
      //   tam2 -= velocidadx;
      // }else{
      //   if(nDer>tam2){
      //     tam2=0
      //   }
      // }
    
      //Verificar si el pájaro ha pasado completamente la tubería y aún no se ha contado
      if (bDer > nDer1 && bIzq < nDer1 && !arrayTuberias[1].tuberiaContada) {
      
        contador++;

        //sonidoPasarTuberia()
        pasarTuberia.play()

        //"Niveles"
        switch(contador){
          case Niv1:
            velocidadx=velocidadx/2.35
            gravedad=gravedadNiv2
            break;
          case Niv2:
            velocidadx=aumentarVelocidadNiv1
            gap=165
            gravedad=0.3
            masRapido==true
            break;
          case Niv3:
            velocidadx=-2.5
            gap=140
            break;
          case Niv4:
            velocidadx=-2.5
            gravedad=0.3
            gap=160
            break;
          case Niv5:
            velocidadx=-3.7
            gap=180
            gravedad=0.3

        }

        // Marcar la tubería como contada
        arrayTuberias[1].tuberiaContada = true;
      } else if (personaje.x > nDer1 && arrayTuberias[1].tuberiaContada) {
        // Reiniciar tuberiaContada cuando el pájaro pasa completamente la tubería
        arrayTuberias[1].tuberiaContada = false;
      }
      
      if(contador===Niv1-1){
        musicaFondo.pause()
        aumentarVel.play()
      }
  }

    return estamosMuertos;
  }

  //Almacenar los records en Local Storage
  function almacenamientoRecords(contador) {
    let nombreUser = document.getElementById("name").value;
    let recordActual = localStorage.getItem("Record");

    /*Verificamos que el campo no esta vacio y que se ha superado el actual record*/
    if (nombreUser.trim() !== "" && contador > recordActual) {
      localStorage.setItem(nombreUser, contador);
    }
  }

  function mostrarRecords() {
    let arrayRecords = [];

    for (let i = 0; i < localStorage.length; i++) {
      let clave = localStorage.key(i);
      let valor = localStorage.getItem(clave);

      // Construir un objeto con el nombre y el número y añadirlo al array
      if (clave !== "Record") {
        //En localStorage almaceno un valor, cuya clave es Record, no me interesa que se añada al array
        let RecordsAc = {
          nombre: clave,
          numero: valor,
        }

        arrayRecords.push(RecordsAc);
      }
    }

    arrayRecords.sort(ordenarPorNum).reverse()

    tablaScore.innerHTML = "";
  
    for(let i=0; i<arrayRecords.length; i++){
      let tablaScore = document.getElementById("tablaScore")
      // Borra el contenido existente de la tabla
      let fila = document.createElement("tr")
      let col1 = document.createElement("td")
      let col2 = document.createElement("td")
    
     let nUser = document.createTextNode(arrayRecords[i].nombre)
      let scoreUser = document.createTextNode(arrayRecords[i].numero)

      col1.appendChild(nUser)
      col2.appendChild(scoreUser)

      fila.appendChild(col1)
      fila.appendChild(col2)

      tablaScore.appendChild(fila)
  }
}

  //Funcion para que el metodo sort, ordene el array tal y como nosotros le indiquemos:
  function ordenarPorNum(a, b){

    return a.numero - b.numero
    /*Si obtenemos -1 --> "a" se va a situar en un índice menor que b.
    0 --> se queda como esta
    1 --> "b" se situa en un indice menor que a */
  }

  function pintaPersonaje() {
    //borramos todo el canvas desde (0,0) hasta (400-600)
    if (menuJuego === false) {
      musicaFondo.play();
      musicaFondo.volume = 0.1;

      ctx.clearRect(0, 0, 400, 600);

      menuInicial.skin();

      fondo.pintarFondo()

      personaje.skinPersonajeMenu();
    }

    if (menuJuego === true) {
      
      ctx.clearRect(0, 0, 400, 600);

      mostrarTuberias.pintar()
      personaje.skinPersonaje();

      scoretiemporeal.ComprobarContador(contador);

      if (muerto()) {
        velocidadx = 0;
        document.removeEventListener("keydown", presionarTecla)

        clearInterval(id2);

        almacenamientoRecords(contador);
        

        //eliminamos el evento, (para)
        if (personaje.y >= TOPEINFERIOR) {
          clearInterval(id);
          mostrarRecords()
          resetActivo = true; //Solución de un pequeño bug al hacer click en el boton
          menugameover.skin();
          scoreenmenu.ComprobarContador(contador);
          ScoreLocal(contador);
          record.pintarRecord(localStorage.getItem("Record"));

          medalla.pintarMedallas(contador);
          restart.pintarBotonRestart();
          musicaFondo.pause();
          aumentarVel.pause()
        }
      }
    }
  }

  document.addEventListener("keydown", presionarTecla);

  function presionarTecla(event) {
    //TODO meter aqui el sonido cuando pulsamos
    if (event.key === "w" || event.key === " "/* || event.keyCode === 16*/) {
      //velocidad negativa --> al presionar queremos que suba
      velocidadPersonaje = -6;
      saltoPajaro.currentTime = 0;
      saltoPajaro.play();
    }
  }

  //funcion extraida de stackoverflow, con la que evitamos el scroll de la página al pulsar la tecla espacio
  function setupCanvasScrollPrevention(canvas) {
    canvas.setAttribute('tabindex', '0'); // Hacer que se pueda hacer focus en canvas
    document.addEventListener('keydown', function(event) {
        if ([' '].includes(event.key)) {
            event.preventDefault();
        }
    }, false);
}

  musicaFondo.addEventListener("ended", function () {
    musicaFondo.currentTime = 0;
    musicaFondo.play();
  })

  canvas.addEventListener("click", clickReset)
  canvas.addEventListener("click", clickIniciar)

  function clickIniciar(event) {
    let clicX
    let clicY

    //Obtenemos las posiciones del raton:
    clicX = event.clientX - canvas.getBoundingClientRect().left
    clicY = event.clientY - canvas.getBoundingClientRect().top

    if (
      clicX > menuInicial.xBotonInicio &&
      clicX < menuInicial.xBotonInicio + 75 &&
      clicY > menuInicial.yBotonInicio &&
      clicY < menuInicial.yBotonInicio + 50 && document.getElementById("name").value!==""
    ) {
      menuJuego = true;
      canvas.removeEventListener("click", clickIniciar)
    }else{
      alert("¡¡¡INTRODUCE TU NOMBRE PARA COMENZAR!!!")
    }
  }

  function clickReset(event) {
    let clicX;
    let clicY;
    //obtenemos coordenadas del raton en el canvas, al hacer click
    if (resetActivo == true) {
      clicX = event.clientX - canvas.getBoundingClientRect().left;
      clicY = event.clientY - canvas.getBoundingClientRect().top;
    }

    //Comprobamos la colision entre el raton (en la posicion que hacemos click) y el botón.
    if (
      clicX > restart.x &&
      clicX < restart.x + 75 &&
      clicY > restart.y &&
      clicY < restart.y + 50
    ) {
      resetJuego();
    }
  }

  function resetJuego() {
    resetActivo = false;
    estamosMuertos = false;
    contador = 0;
    //Pos. inicial personaje.
    personaje.y = 200;

    //Posición inicial tuberias.
    arrayTuberias[0].tuberia1.x = 400;
    arrayTuberias[0].tuberia1.y = -264;
    arrayTuberias[0].tuberia2.x = 400;
    arrayTuberias[0].tuberia2.y = 676;
    arrayTuberias[1].tuberia1.x = 650;
    arrayTuberias[1].tuberia1.y = -264;
    arrayTuberias[1].tuberia2.x = 650;
    arrayTuberias[1].tuberia2.y = 676;

    document.addEventListener("keydown", presionarTecla);

    //Volvemos a activar la velocidad.
    velocidadx = -2.5;
    gravedad=0.3
    gap=140


    velocidadPersonaje = 0;
    musicaFondo.volume = 0.2;
    musicaFondo.currentTime=0
    musicaFondo.play();

    id = setInterval(pintaPersonaje, 1000 / 60);
    id2 = setInterval(Aletear, 1000 / 8);
    aumentarVel.currentTime=0
  }

  // imagen = new Image()
  // imagen.src="sprites.png"
  Personaje.prototype.imagen = imagen;
  // Fondo.imagen = imagen;
  // MenuGameOver.imagen = imagen;
  // ScoreTiempoReal.imagen = imagen;
  // ScoreEnMenu.imagen = imagen;
  // Record.imagen = imagen;
  // Medalla.imagen = imagen;
  // BotonRestart.imagen = imagen;
  // MenuInicial.imagen = imagen;

  restart = new BotonRestart();
  record = new Record();
  menugameover = new MenuGameOver();
  menuInicial = new MenuInicial();
  fondo = new Fondo();
  personaje = new Personaje();
  scoretiemporeal = new ScoreTiempoReal();
  scoreenmenu = new ScoreEnMenu();
  medalla = new Medalla();
  mostrarTuberias = new TuberiaCompleta()

  id = setInterval(pintaPersonaje, 1000 / 60);
  id2 = setInterval(Aletear, 1000 / 8);
}

