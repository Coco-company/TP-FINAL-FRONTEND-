//*********** VARIABLES GLOBALES *************/
let productos = [];
let listaProductosCarritoEnStorage = cargarCarritoDeStorage();
const contenedorProductos = document.getElementById("gondola");
let totalCarrito = 0;

console.log('---INICIO---');

//función para cargar datos desde el Local Storage

function mostrarBotonesyContador() {

    let botonera = document.getElementById("Botones_carro");
    let contenedorCarro = document.getElementById("contenedor_carro");
    let estadoCarrito = document.querySelector(".carrito #estado");
    
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

//función para actualizar el contador de productos en el carrito
function actualizarContador() {

    mostrarBotonesyContador();
    //obtener el contenedor del número
    const contenedorNumero = document.querySelector(".carrito #contador");
    //verificamos si existe (el cartel de cantidad se muestra si hay productos)
    if(contenedorNumero!=null){
        //usamos la cantidad de productos de la lista
        let total = 0;
        // SUMO LAS CANTIDADES DE CADA PRODUCTO
        for(const producto of listaProductosCarritoEnStorage){
            total += parseInt(producto.cantidad);
        }
        contenedorNumero.textContent = total;
    }
}

function actualizarPrecioTotalCarrito(){
    //totalCarrito
    const contenedorPrecioTotal = document.getElementById("precio_total");
    let total = 0;
    for(const producto of listaProductosCarritoEnStorage){
        total += producto.precio * producto.cantidad;
    }

    contenedorPrecioTotal.value = total.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 });
    
}


//-------------------------------------------------------------------------
//----------------------      LOCAL STORAGE    ----------------------------
//-------------------------------------------------------------------------

function guardarCarritoEnStorage(lista) {
    const carritoJSON = JSON.stringify(lista);
    localStorage.setItem("listaCarrito", carritoJSON);

    actualizarPrecioTotalCarrito();
    actualizarContador();

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
    console.log(JSON.parse(carritoJSON));
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

    const elementoEvento = datosEvento.target.tagName;
    if (elementoEvento === "A") {
        //obtener el elemento mouseOver
        const elementoAccionado = datosEvento.target;

        //obtener la descripción del dataset
        // console.log(datosEvento.target.dataset.descripcion)
        const descripcionProducto = elementoAccionado.dataset.descripcion;
        
        //Sube en el DOM hasta encontrar la tarjeta contenedora del botón
        const articleCard = elementoAccionado.closest(".producto--bem");
        
        //obtener el div de la descripción dentro de la tarjeta
        const divDescripcion = articleCard.querySelector(".descripcion");

        if (divDescripcion.children.length == 0) {
            //creamos el elemento que vamos a insertar
            const parrafoDescripcion = document.createElement("p");
            parrafoDescripcion.textContent = descripcionProducto;

            divDescripcion.appendChild(parrafoDescripcion); 
            //cambiamos el texto del enlace
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
                
        //obtener el div de la descripción dentro de la tarjeta
        const divDescripcion = articleCard.querySelector(".descripcion");

        const anchor = elementoAccionado.parentNode.previousElementSibling;

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
function insertarProductosEnGondola(lista) {
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
        
        
        const productosArray = await respuesta.json(); // Conversión del JSON a Array asincrónico
        // console.log(productosArray);
        return productosArray;        
    } 
    
    catch (error) {
        //verificamos el error
        console.error("Fallo grave en la carga:", error);
        
        // Informar al usuario en la interfaz
        const listaUL = document.querySelector("#gondola");
        listaUL.innerHTML = '<li id="mensaje-error">❌ Error al cargar el catálogo.</li>';
                
        return []; // Devolvemos un array vacío para evitar errores posteriores
    }
}

//---------------------------------------------------------------------
//---------- SI EL PRODUCTO NO ESTA EN EL CARRITO, LO AGREGA ----------
//---------------------------------------------------------------------
function mostrarProductoEnCarro(producto) {
        
    //obtener el contenedor ul
    const listaCarrito = document.querySelector("aside.carrito #contenedor_carro");

    const liProducto = document.createElement("li");        //crear el elemento li

    //agregar el contenido
    liProducto.innerHTML = `<span class="cantidadLista">${producto.cantidad}</span>
                            <span class="nombreLista">${producto.nombre}</span>
                            <span class="precioLista">${producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>`;
    
    liProducto.className = "list-group-item";   //agregar las clases
    listaCarrito.appendChild(liProducto);     //insertar el elemento
}


//--- SI EL PRODUCTO YA ESTA EN EL CARRITO, SOLO ACTUALIZA LA CANTIDAD ---
function editarProductoEnCarro(producto,accion) {
    //const listaCarrito = document.querySelector("aside.carrito #contenedor_carro");

    const listaDeItemsCarro = document.getElementsByClassName("list-group-item")

    for (const item of listaDeItemsCarro) {

        if(item.querySelector(".nombreLista").textContent === producto.nombre){
            // Si coincide el nombre del producto, actualizamos la cantidad
            let campoCantidad = item.querySelector(".cantidadLista")
            let cantidadActual = parseInt(campoCantidad.textContent)
            if(accion==="agregar"){
                cantidadActual +=1;
                campoCantidad.textContent = cantidadActual;
                producto.cantidad = cantidadActual;
                //actualizarPrecioTotalCarrito();
            }
            // debería por lo menos tener 1 para entrar acá
            if(accion==="remover"){
                //RESTO DEL CARRITO Y DE LA LISTA DEL STORAGE
                campoCantidad.textContent = cantidadActual -= 1;
                
                producto.cantidad = parseInt(campoCantidad.textContent);

                console.log("Cantidad actual después de remover: ",cantidadActual);

                if(cantidadActual===0){
                    // Si la cantidad llega a 0, removemos el producto del carrito
                    removerDelCarrito(producto.id);
                }
            }
            guardarCarritoEnStorage(listaProductosCarritoEnStorage);
         }
    }

    console.log("Storage ",listaProductosCarritoEnStorage);

    actualizarPrecioTotalCarrito();
    actualizarContador();   //actualizar el contador de productos del carrito
//    guardarCarritoEnStorage(listaProductosCarritoEnStorage);

    console.log("DESPUES DEL F5 FALLA EL UPDATE DE CANTIDAD, DE PRECIO Y DEL STORAGE");
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


//---------------------------------------------------------------------
//------------------------   AUXILIARES   -----------------------------
//---------------------------------------------------------------------

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
    const productoEncontrado = buscarProductoPorId(idBotonCliqueado, productos);
    // Si el id no está en la lista (-1) lo agregamos
    if (idEncontrado === -1) {
        //buscar el producto en la lista de productos por el idEncontrado y lo guardamos
        
        productoEncontrado.cantidad = 1; //CREAMOS LA PROP cantidad PARA EL PRODUCTO

        //agregar el productoEncontrado a la lista del carrito
        listaProductosCarritoEnStorage.push(productoEncontrado)
        //console.log("agregar lista carrito");

        //inserta EL producto en el HTML
        mostrarProductoEnCarro(productoEncontrado);

//        actualizarContador();   //actualizar el contador de productos del carrito

        //guardarCarritoEnStorage(listaProductosCarritoEnStorage);  //agregar producto al storage
    
    }else{
        //el producto ya está en el carrito, solo actualizamos la cantidad
        editarProductoEnCarro(productoEncontrado,"agregar");
        
        //console.log("El producto ya está en el carrito");
    }

    //actualizar el contador de productos del carrito
    //actualizarContador();

    //agregar producto al storage
    actualizarContador();   //actualizar el contador de productos del carrito
    actualizarPrecioTotalCarrito();

    guardarCarritoEnStorage(listaProductosCarritoEnStorage);

    console.log("listaProductosCarritoEnStorage: ",listaProductosCarritoEnStorage);
   
}

function removerDelCarrito(idBotonCliqueado){
    //buscamos el id en la lista del carrito y guardamos el resultado
    const idEncontrado = buscarEnLista(idBotonCliqueado, listaProductosCarritoEnStorage)

    // Si el id está en la lista lo removemos
    if (idEncontrado !== -1) {

        //SI CANTIDAD >1 SOLO ACTUALIZAR CANTIDAD
        //SI CANTIDAD =1 REMOVER PRODUCTO DEL CARRITO

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

        mostrarTodosLosProductoEnCarro(listaProductosCarritoEnStorage);
        //actualizar el contador de productos del carrito
        actualizarContador();

        //agregar producto al storage
        guardarCarritoEnStorage(listaProductosCarritoEnStorage);

        actualizarPrecioTotalCarrito();
    }else{
        
        console.log("No está en el carrito");
    }
}

//DETERMINNO QUE BOTÓN DEL PRODUCTO FUE CLICKEADO
function botonProducto(datosEvento) {
    //vemos los datos del evento con el parametro "datosEvento"...
    //...que trae los datos del click [MUY MUY IMPORTANTE]

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
            
            editarProductoEnCarro(buscarProductoPorId(idCliqueado, productos),"remover");
            //removerDelCarrito(idCliqueado);       
        }
    }
}

//---------------------------------------------------------------------------

// Inicia la carga de productos y agrega Event Listeners
async function inicio() {
    
    // Guardamos en var global productos la lista obtenida del json
    productos = await cargarProductosApi();

    // Insertar los productos en la página (Gondola)
    insertarProductosEnGondola(productos);

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
    actualizarPrecioTotalCarrito();

    mostrarTodosLosProductoEnCarro(listaProductosCarritoEnStorage);
    
    // listaProductosCarritoEnStorage = borrarCarritoDeStorage();
}

inicio();


//---------------------------------------------------------------------------
//------------------           VALIDACION FORMULARIO        -----------------
//---------------------------------------------------------------------------

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const botonSubmit = document.getElementById("submitContacto");

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
email.addEventListener("focusout", validarMail);

