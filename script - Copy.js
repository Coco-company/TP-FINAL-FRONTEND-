//*********** VARIABLES GLOBALES *************/
let productos = [];
let listaProductosCarrito = cargarCarritoDeStorage();

//función para cargar datos desde el Local Storage
function cargarCarritoDeStorage() {
    const carritoJSON = localStorage.getItem("listaCarrito");
    if (carritoJSON) {
        //console.log("carritoJSON ",carritoJSON);
        return JSON.parse(carritoJSON);
    }
    else {
        return [];
    }
}

//función para actualizar el contador
function actualizarContador() {
    //obtener el contenedor del número

    //revisamos si el carro está vacio


    const contenedorNumero = document.querySelector(".carrito p #contador");
    //verificamos
    // console.log(contenedorNumero);
    //usamos la cantidad de productos de la lista
    contenedorNumero.textContent = listaProductosCarrito.length;
}

//función para guardar datos en Local Storage
function guardarCarritoEnStorage(lista) {
    const carritoJSON = JSON.stringify(lista);
    localStorage.setItem("listaCarrito", carritoJSON);
    // console.log("producto en Storage");
}

//función para eliminar el carrito en Local Storage
function eliminarCarritoEnStorage() {
    localStorage.removeItem("listaCarrito");
    listaProductosCarrito = [];
    actualizarContador();
    vaciarCarrito();
}

//función para vaciar el carrito en la página
function vaciarCarrito() {
    const listaCarrito = document.querySelector(".carrito #estado");
    listaCarrito.innerHTML = "<p><i>El carrito está vacío</i></p>";
}

// ´<p>Productos en el carrito: <span id="contador"></span></p>´


//-------------------------------------------------------------------------
//-----------------   CARGA PRODUCTOS EN GONDOLA   ------------------------
//-------------------------------------------------------------------------
function insertarProductos(lista) {
    // Capturo el elemento contenedor de productos
    const contenedorProductos = document.getElementById("gondola");
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
                    <p>${precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
                    <div class="contenedor--botones">
                        <button data-id="${id}">+</button>
                        <img src="/icon/carritoIco.png" alt="agregar al carrito de compras">
                        <button data-id="${id}">-</button>
                    </div>
            `;
        //Seteamos atributos al elemento a crear
        nuevoArticulo.setAttribute("id", "articulo_"+id);
        nuevoArticulo.setAttribute("class", "producto--bem");

        //insertamos el nuevo elemento en el contenedor en el HTML
        contenedorProductos.appendChild(nuevoArticulo);
    }
}

//función para mostrar la descripción del producto

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

//---------------------------------------------------------------------------

// Función asíncrona para obtener los productos del JSON
// @returns {Promise<Array<Object>>} Una promesa que resuelve en el array de productos.

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

//función para insertar producto en el html
function insertarProductoHTML(producto) {

    // console.log("IPH producto ",producto);
    //obtener el contenedor ul
    const listaCarrito = document.querySelector("aside.carrito #contenedor_carro");
    //crear el elemento li
    const liProducto = document.createElement("li");
    //agregar el contenido
    liProducto.textContent = `${producto.nombre} ${producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}`;
    //agregar las clases
    liProducto.className = "list-group-item";
    //insertar el elemento
    listaCarrito.appendChild(liProducto);
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

function removerCartelVacio(){
    // const campoCartel = 
}


//---------------------------------------------------------------------------
//función para agregar productos al carrito
function agregarAlCarrito(datosEvento) {
    //vemos los datos del evento
    //console.log(datosEvento.target.tagName," ",datosEvento.target.parentNode.tagName);

    //si el elemento clicado es un botón
    if (datosEvento.target.tagName === "BUTTON") {
    //if (datosEvento.target.tagName === "BUTTON"){
        //verificamos el data-id del botón
        // console.log(datosEvento.target.dataset);                //DOMStringMap {id: '4'}
        // console.log(datosEvento.target.dataset.id);             //4
        // console.log(typeof (datosEvento.target.dataset.id));    //string
        //guardamos el id como number
        const idProducto = parseInt(datosEvento.target.dataset.id);
        // console.log("idProducto ",idProducto," type:", typeof(idProducto));
        // console.log(listaProductosCarrito);

        //buscamos el id en la lista del carrito y guardamos el resultado
        const idEncontrado = buscarEnLista(idProducto, listaProductosCarrito)
        // console.log("encontrado:", idEncontrado);

        // Si el id no está en la lista (-1) lo agregamos
        // --- Si hay tiempo ver de agregar cantidad de cada producto ---
        if (idEncontrado === -1) {

            removerCartelVacio()
            //buscar el producto en la lista de productos por el idEncontrado
            //y lo guardamos
            const productoEncontrado = buscarProductoPorId(idProducto, productos);
            // console.log(productoEncontrado);
            
            //agregar el productoEncontrado a la lista del carrito
            listaProductosCarrito.push(productoEncontrado)
            // console.log("agregar lista carrito");
            // console.log(listaProductosCarrito);

            //insertar el producto en el HTML
            insertarProductoHTML(productoEncontrado);

            //actualizar el contador de productos del carrito
            actualizarContador();

            //agregar producto al storage
            guardarCarritoEnStorage(listaProductosCarrito);
        }
    }
}


//---------------------------------------------------------------------------

// Inicia la carga de productos y agrega Event Listeners
async function inicio() {

    /* Oculta botones "vaciar" y "comprar" si el carro está vacío*/
    /* Ver de modulizar */
    let botonera = document.getElementById("Botones_carro");
    let contenedorCarro = document.getElementById("contenedor_carro");

    // Si el carro no tiene contenido oculta los botones
    if(!contenedorCarro.childElementCount > 0){
        console.log("eee");
        botonera.style.visibility = "hidden";
    }

    // Guardamos en var global productos la lista obtenida del json
    productos = await cargarProductosApi();

    // Insertar los productos en la página
    insertarProductos(productos);

    //seleccionar el contenedor de los productos
    const contenedorProductos = document.querySelector("#gondola");
    
    // Agrega listeners para los eventos de mouse over y mouse out
    contenedorProductos.addEventListener("mouseover", mostrarDescripcion);
    contenedorProductos.addEventListener("mouseout", ocultarDescripcion);

    //agregar el listener al botón Agregar al carrito
    contenedorProductos.addEventListener("click", agregarAlCarrito);

    //agregar el listener al botón Vaciar Carrito
    const botonVaciarCarrito = document.querySelector("#Botones_carro button#vaciar");
    botonVaciarCarrito.addEventListener("click", eliminarCarritoEnStorage)

    //cargar el carrito desde local storage
    listaProductosCarrito = cargarCarritoDeStorage();
    //console.log(listaProductosCarrito);

    //si el storage no está vacío
    if (listaProductosCarrito.length != 0) {
        //insertar los productos
        for (const producto of listaProductosCarrito) {
            insertarProductoHTML(producto);
        }
        //actualizar el contador
        actualizarContador();
    }

    // //agregar el listener al botón Agregar al carrito
    // const botonVaciarMemoria = document.querySelector("#Botones_carro button#vaciarMemoria");
    // botonVaciarMemoria.addEventListener("click", agregarAlCarrito);
    // listaProductosCarrito = borrarCarritoDeStorage();
}

// Instrucciones de mi programa **************************************************************
inicio();