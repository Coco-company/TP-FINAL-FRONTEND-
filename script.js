//*********** VARIABLES GLOBALES *************/
let productos = [];
let listaProductosCarritoEnStorage = cargarCarritoDeStorage();
const contenedorProductos = document.getElementById("gondola");

console.log('---INICIO---');

//función para cargar datos desde el Local Storage

function mostrarBotonesyContador() {

    let botonera = document.getElementById("Botones_carro");
    let contenedorCarro = document.getElementById("contenedor_carro");
    const estadoCarrito = document.querySelector(".carrito #estado");
    
    // Si el carro no tiene contenido oculta los botones y el contador
    if(contenedorCarro.childElementCount != 0){
        //console.log("carro con productos");
        botonera.style.visibility = "visible";
        estadoCarrito.innerHTML = '<p>Productos en el carrito: <span id="contador"></span></p>';
    }else{
        botonera.style.visibility = "hidden";
        estadoCarrito.innerHTML = "<p><i>El carrito está vacío</i></p>";
    }
}

//función para actualizar el contador
function actualizarContador() {

    mostrarBotonesyContador();
    //obtener el contenedor del número
    const contenedorNumero = document.querySelector(".carrito #contador");
    //verificamos si existe (el cartel de cantidad se muestra si hay productos)
    if(contenedorNumero!=null){
        //console.log(contenedorNumero);
        //usamos la cantidad de productos de la lista
        contenedorNumero.textContent = listaProductosCarritoEnStorage.length;
    }
}

//-------------------------------------------------------------------------
//----------------------      LOCAL STORAGE    ----------------------------
//-------------------------------------------------------------------------

function guardarCarritoEnStorage(lista) {
    const carritoJSON = JSON.stringify(lista);
    localStorage.setItem("listaCarrito", carritoJSON);
    // console.log("producto en Storage");
}

function eliminarCarritoEnStorage() {
    localStorage.removeItem("listaCarrito");
    listaProductosCarritoEnStorage = [];
    vaciarCarrito();
    actualizarContador();
    
}

function cargarCarritoDeStorage() {
    const carritoJSON = localStorage.getItem("listaCarrito");
    if (carritoJSON) {
        return JSON.parse(carritoJSON);
    }
    else {
        return [];
    }
}

//-------------------------------------------------------------------------
//---------------------- VACIAR CARRITO EN PÁGINA -------------------------
//-------------------------------------------------------------------------
function vaciarCarrito() {
    //VER DE CONVERTIR EN VARIABLE GLOBAL
    const contenedorCarrito = document.querySelector(".carrito #contenedor_carro");
    contenedorCarrito.innerHTML = "";

    //VER DE EXTRAER A FUNCIÓN actualizarEstadoCarrito()
    const estadoCarrito = document.querySelector(".carrito #estado");
    // RESTAURO ESTADO INICIAL DEL DIV ESTADO
    estadoCarrito.innerHTML = "<p><i>El carrito está vacío</i></p>";
}

//--------------------------------------------------------------------
//-----------  MOSTRRAR/OCULTAR DESCRIPCION DE PRODUCTO --------------
//--------------------------------------------------------------------
function mostrarDescripcion(datosEvento) {

    //console.log(datosEvento.target.tagName);

    const elementoEvento = datosEvento.target.tagName;
    if (elementoEvento === "A") {
        //obtener el elemento mouseOver
        const elementoAccionado = datosEvento.target;

        //obtener la descripción del dataset
       // console.log(datosEvento.target.dataset.descripcion)
        const descripcionProducto = elementoAccionado.dataset.descripcion;
        
        //Sube en el DOM hasta encontrar la tarjeta contenedora del botón
        const articleCard = elementoAccionado.closest(".producto--bem");
        //console.log(articleCard);
        
        //obtener el div de la descripción dentro de la tarjeta
        const divDescripcion = articleCard.querySelector(".descripcion");
        //console.log(divDescripcion);


        if (divDescripcion.children.length == 0) {
            //creamos el elemento que vamos a insertar
            const parrafoDescripcion = document.createElement("p");
            parrafoDescripcion.textContent = descripcionProducto;

            divDescripcion.appendChild(parrafoDescripcion); 
            //cambiamos el texto del enlace
            //elementoAccionado.textContent = "Ocultar descripción";
            elementoAccionado.textContent = "";
        }
        else {
            // Restauro estado 
            elementoAccionado.textContent = "Ver descripción";
            divDescripcion.innerHTML = "";
        }
    }
}

function ocultarDescripcion(datosEvento) {
    
    const elementoEvento = datosEvento.target.tagName;
    
    if (elementoEvento === "P") {
        //obtener el elemento mouseOut
        const elementoAccionado = datosEvento.target;

        const articleCard = elementoAccionado.closest(".producto--bem");
        //console.log(articleCard);
        
        //obtener el div de la descripción dentro de la tarjeta
        const divDescripcion = articleCard.querySelector(".descripcion");

        const anchor = elementoAccionado.parentNode.previousElementSibling;

        //console.log(elementoAccionado,"",);

        if (divDescripcion.children.length >= 1) {
            // Restaura estado
            anchor.textContent = "Ver descripción";
            divDescripcion.innerHTML = "";
        }
    }
}

//-------------------------------------------------------------------------
//-----------------   CARGA PRODUCTOS EN GONDOLA   ------------------------
//-------------------------------------------------------------------------
function insertarProductos(lista) {
    // Capturo el elemento contenedor de productos (PASADO A GLOBAL!)
    //const contenedorProductos = document.getElementById("gondola");

    //console.log(contenedorProductos);

    //utilizo un bucle para insertar todos los elementos de la lista
    //uso desestructuración para acceder directamente a las propiedades del objeto lista
    for (const { id, img, nombre, descripcion, precio } of lista) {
        //creamos el elemento (en memoria)
        const nuevoArticulo = document.createElement("article");
        
        //creamos el contenido del elemento
        //usamos el atributo data del botón para identificar el producto
        nuevoArticulo.innerHTML = `
                    <div class="contenedor--imagen">
                        <img src="${img}" alt="${nombre}">
                    </div>
                    <h5>${nombre}</h5>
                    <a href="#." data-descripcion="${descripcion}">
                            Ver descripción
                    </a>
                    <div class="descripcion"></div>
                    <p>${precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</p>
                    <div class="contenedor--botones">
                        <button data-id="agregar_${id}">+</button>
                        <img src="/icon/carritoIco.png" alt="agregar al carrito de compras">
                        <button data-id="remover_${id}">-</button>
                    </div>
            `;
        //Seteamos atributos al elemento a crear
        nuevoArticulo.setAttribute("id", "articulo_"+id);
        nuevoArticulo.setAttribute("class", "producto--bem");

        //insertamos el nuevo elemento en el contenedor en el HTML
        contenedorProductos.appendChild(nuevoArticulo);
    }
}

//--------------------------------------------------------------------
//--------------------- TRAER PRODUCTOS DEL API ----------------------
//--------------------------------------------------------------------
async function cargarProductosApi() {
    //Error Handle
    try {
        //petición del archivo JSON a la URL de API
        const respuesta = await fetch("./productos.json");

        //Si no está "Ok":
        if (!respuesta.ok) {
            //Lanza error Código - descrip (404 Not found)
            throw new Error(`Error al obtener los datos: ${respuesta.status} - ${respuesta.statusText}`);
        }
        
        // Conversión del JSON a Array asincrónico
        const productosArray = await respuesta.json();
        // console.log(productosArray);
        return productosArray;        
    } 
    
    catch (error) {
        //verificamos el error
        console.error("Fallo grave en la carga:", error);
        // Informar al usuario en la interfaz --------------------------------------------------- VER!!
        /*
        const listaUL = document.querySelector("#productos, .contenedorProductos");
        listaUL.innerHTML = '<li id="mensaje-error">❌ Error al cargar el catálogo.</li>';
        */
        // Devolvemos un array vacío para evitar errores posteriores
        return []; 
    }
}

//función para insertar 1 producto en el HTML del carrito
function mostrarProductoEnCarro(producto) {

    console.log('pasó por insertar producto');
    // console.log("IPH producto ",producto);
    //obtener el contenedor ul
    const listaCarrito = document.querySelector("aside.carrito #contenedor_carro");
    //crear el elemento li
    const liProducto = document.createElement("li");
    //agregar el contenido
    //liProducto.textContent = `${producto.nombre} ${producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 })}`;
    
    liProducto.innerHTML = `<span>${producto.nombre}</span><span>${producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>`;
    
    
    
    //agregar las clases
    liProducto.className = "list-group-item";
    //insertar el elemento
    listaCarrito.appendChild(liProducto);  
}

//función para insertar todos los productos en el HTML del carrito
function mostrarTodosLosProductoEnCarro(listaProductos) {
    
    //Blanqueo el contenido actual del carrito
    const listaCarrito = document.querySelector("aside.carrito #contenedor_carro");
    listaCarrito.innerHTML = "";

    //si el storage no está vacío
    if (listaProductos.length != 0) {
        //Inserta LOS productos en el HTML
        for (const producto of listaProductos) {
            mostrarProductoEnCarro(producto);
        }
        //actualizar el contador
        actualizarContador();
    }
}

function buscarEnLista(id, lista) {
    //verificamos los datos recibidos
    // console.log(id, lista);

    for (const producto of lista) {
        //si encontramos el id
        if (producto.id === id) {
            console.log("Encontrado", producto.id);
            return id;
        }
    }

    //POR ACÁ SI QUIERO AGREGAR LA FUNCIONALIDAD DE CANTIDAD DE PRODUCTOS
    //si en el bucle no se encontró el id
    return -1;
}

function buscarProductoPorId(id, lista) {
    //verificamos los datos recibidos
    // console.log(id, lista);

    for (let i = 0; i < lista.length; i++) {
        //si encontramos el id retornamos el producto
        if (lista[i].id === id) {
            // console.log(lista[i]);
            return lista[i];
        }
    }
}

//---------------------------------------------------------------------------
//---------------------- Agregar productos al carrito -----------------------
//---------------------------------------------------------------------------

function agregarAlCarrito(idBotonCliqueado){
    //buscamos el id en la lista del carrito y guardamos el resultado
    const idEncontrado = buscarEnLista(idBotonCliqueado, listaProductosCarritoEnStorage)

    // Si el id no está en la lista (-1) lo agregamos
    if (idEncontrado === -1) {
        //buscar el producto en la lista de productos por el idEncontrado
        //y lo guardamos
        const productoEncontrado = buscarProductoPorId(idBotonCliqueado, productos);
        //console.log(productoEncontrado);
        
        //agregar el productoEncontrado a la lista del carrito
        listaProductosCarritoEnStorage.push(productoEncontrado)
        //console.log("agregar lista carrito");
        //console.log(listaProductosCarritoEnStorage);

        //inserta EL producto en el HTML
        mostrarProductoEnCarro(productoEncontrado);

        //actualizar el contador de productos del carrito
        actualizarContador();

        //agregar producto al storage
        guardarCarritoEnStorage(listaProductosCarritoEnStorage);
    }else{
        // --- Si hay tiempo ver de agregar cantidad de cada producto ---
        console.log("El producto ya está en el carrito");
    }
}



function removerDelCarrito(idBotonCliqueado){
    //buscamos el id en la lista del carrito y guardamos el resultado
    const idEncontrado = buscarEnLista(idBotonCliqueado, listaProductosCarritoEnStorage)

    // Si el id está en la lista lo removemos
    if (idEncontrado !== -1) {
        //buscar el producto en la lista de productos por el idEncontrado
        //y lo guardamos
        const productoEncontrado = buscarProductoPorId(idBotonCliqueado, productos);
        //console.log("idEncontrado ",idEncontrado);
        
        //agregar el productoEncontrado a la lista del carrito
        //console.log("listaProductosCarritoEnStorage ",listaProductosCarritoEnStorage);

        //listaProductosCarritoEnStorage.push(productoEncontrado)

        let indice = -1;

        // OBTENEMOS EL INDICE QUE COINCIDA CON EL ID ENCONTRADO
        for(let i=0; i<listaProductosCarritoEnStorage.length; i++){
            if(listaProductosCarritoEnStorage[i].id === idEncontrado){
                indice = i;
                break;
            }
        }

        //Quitar el producto del array del carrito con el indice indicado
        listaProductosCarritoEnStorage.splice(indice, 1);

        console.log("producto removido lista carrito");
        //console.log(listaProductosCarritoEnStorage);

        //quitar el producto en el HTML 
        // VER DE HACER FUNCION
        //ocultarProductoEnCarro(productoEncontrado);

        //-----------------------------------------
        //--------------ACTUALIZAR CARRO???-----------
        //-----------------------------------------
        mostrarTodosLosProductoEnCarro(listaProductosCarritoEnStorage);
        //actualizar el contador de productos del carrito
        actualizarContador();

        //agregar producto al storage
        guardarCarritoEnStorage(listaProductosCarritoEnStorage);
    }else{
        
        console.log("No está en el carrito");
    }
}

//
function botonProducto(datosEvento) {
    //vemos los datos del evento con el parametro "datosEvento" que trae los datos del click [MUY MUY IMPORTANTE]

    //si el elemento clicado es un botón
    if (datosEvento.target.tagName === "BUTTON") {
        //verificamos el data-id del botón

        // Si datosEvento.target.dataset.id tiene el prefijo "agregar_" ejecutamos agregar
        let idCliqueado = datosEvento.target.dataset.id;

        idCliqueadoString = idCliqueado.toString();

        if(idCliqueadoString.slice(0, 7)=="agregar"){
            idCliqueado = parseInt(idCliqueado.replace("agregar_",""));
            //console.log("Agregar al carrito el id:",idCliqueado);
            agregarAlCarrito(idCliqueado);       
        }
        
        if(idCliqueadoString.slice(0, 7)=="remover"){
            idCliqueado = parseInt(idCliqueado.replace("remover_",""));
            console.log("quitar del carrito el id:",idCliqueado);
            removerDelCarrito(idCliqueado);       
        }

        

        // Si datosEvento.target.dataset.id tiene el prefijo "remover_" ejecutamos quitar
    }
}


//---------------------------------------------------------------------------

// Inicia la carga de productos y agrega Event Listeners
async function inicio() {

    /* Oculta botones "vaciar" y "comprar" si el carro está vacío*/
    /* Ver de modulizar */

    // Guardamos en var global productos la lista obtenida del json
    productos = await cargarProductosApi();

    // Insertar los productos en la página (Gondola)
    insertarProductos(productos);

    //seleccionar el contenedor de los productos ingresados PASADO A GLOBAL
    //const contenedorProductos = document.querySelector("#gondola");
    
    // Agrega listeners para los eventos de mouse over y mouse out
    contenedorProductos.addEventListener("mouseover", mostrarDescripcion);
    contenedorProductos.addEventListener("mouseout", ocultarDescripcion);

    //agregar el listener al botón Agregar al carrito
    contenedorProductos.addEventListener("click", botonProducto);

    //agregar el listener al botón Vaciar Carrito
    const botonVaciarCarrito = document.querySelector("#Botones_carro button#vaciar");
    botonVaciarCarrito.addEventListener("click", eliminarCarritoEnStorage)

    //cargar el carrito desde local storage
    listaProductosCarritoEnStorage = cargarCarritoDeStorage();
    //console.log(listaProductosCarritoEnStorage);

    actualizarContador();

    mostrarTodosLosProductoEnCarro(listaProductosCarritoEnStorage);

    //???
    // //agregar el listener al botón Agregar al carrito
    // const botonVaciarMemoria = document.querySelector("#Botones_carro button#vaciarMemoria");
    // botonVaciarMemoria.addEventListener("click", botonProducto);
    // listaProductosCarritoEnStorage = borrarCarritoDeStorage();
}

// Instrucciones de mi programa **************************************************************
inicio();

//---------------------------------------------------------------------------
//------------------           VALIDACION FORMULARIO        -----------------
//---------------------------------------------------------------------------

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const botonSubmit = document.getElementById("submit");

botonSubmit.disabled = true;

// Revisión de errores en el formulario cada 500ms
//setInterval(revisionValidacionError, 500);

function revisionValidacionError(params) {
    const busquedaError = document.querySelector('.input--error');
    
    if (busquedaError) {
        botonSubmit.disabled = true;
    }else{
        botonSubmit.disabled = false;
    }
}




function validarNombre(datosEvento) {   //con datosEvento hallamos el elemento que disparó el evento
    //console.log("Entro el evento");
    //console.log("datosEvento",datosEvento.srcElement);
    if(datosEvento.srcElement.value.length !== 0){  //Solo aplica si tiene contenido
        if(datosEvento.srcElement.value.length < 3 || !isNaN(datosEvento.srcElement.value)){
            //console.log("Entro el if");
            datosEvento.srcElement.classList.add("input--error");
        }else{
            datosEvento.srcElement.classList.remove("input--error");
        }
    }
    revisionValidacionError();
}

function validarMail(datosEvento) {
    //console.log("Entro el evento");
    if(datosEvento.srcElement.value.length !== 0){  //Solo aplica si tiene contenido
        if(!email.value.includes("@") || !email.value.includes(".com") || email.value.length < 5){
            console.log("Entro el if");
            email.classList.add("input--error");
        }else{
            email.classList.remove("input--error");
        }
    }
    revisionValidacionError();
}

//----------- EVENT LISTENERS VALIDACION FORMULARIO ---------------
nombre.addEventListener("focusout", validarNombre)
apellido.addEventListener("focusout", validarNombre)
email.addEventListener("focusout", validarMail)