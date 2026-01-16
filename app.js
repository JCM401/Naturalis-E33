// =====================
// Variables principales
// =====================
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];

// =====================
// Funciones de usuario
// =====================
function mostrarUsuario() {
    const info = document.getElementById("usuario-info");
    if (!info) return;
    if (usuario) {
        info.innerHTML = `<p>Bienvenido, ${usuario.nombre}</p>`;
    } else {
        info.innerHTML = `<p>No has iniciado sesión</p>`;
    }
}

function iniciarSesion(nombre, email, rol="usuario") {
    usuario = { nombre, email, rol };
    localStorage.setItem("usuario", JSON.stringify(usuario));

    const volverAlCarrito = localStorage.getItem("redirigirCarrito") === "true";
    localStorage.removeItem("redirigirCarrito");
    if (volverAlCarrito) {
        window.location.href = "carrito.html";
    } else {
        window.location.href = "index.html";
    }
}

function cerrarSesion() {
    usuario = null;
    localStorage.removeItem("usuario");
    mostrarUsuario();
}

// =====================
// Funciones de carrito
// =====================
function agregarAlCarrito(producto) {
    const index = carrito.findIndex(p => p.id === producto.id);
    if (index !== -1) {
        carrito[index].cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito");
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function actualizarCantidad(id, cantidad) {
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito[index].cantidad = parseInt(cantidad);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function mostrarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    carrito.forEach(prod => {
        const div = document.createElement("div");
        div.className = "producto-carrito";
        div.innerHTML = `
            <h4>${prod.nombre}</h4>
            <p>Precio: $${prod.precio}</p>
            <p>Cantidad: <input type="number" min="1" value="${prod.cantidad}" onchange="actualizarCantidad(${prod.id}, this.value)"></p>
            <button onclick="eliminarDelCarrito(${prod.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

// =====================
// Funciones de wishlist
// =====================
function agregarAWishlist(producto) {
    if (!wishlist.some(p => p.id === producto.id)) {
        wishlist.push(producto);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Producto agregado a wishlist");
    } else {
        alert("El producto ya está en tu wishlist");
    }
}

function eliminarDeWishlist(id) {
    wishlist = wishlist.filter(p => p.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    mostrarWishlist();
}

function mostrarWishlist() {
    const contenedor = document.getElementById("contenedor-wishlist");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (wishlist.length === 0) {
        contenedor.innerHTML = "<p>Tu wishlist está vacía.</p>";
        return;
    }

    wishlist.forEach(prod => {
        const div = document.createElement("div");
        div.className = "producto-wishlist";
        div.innerHTML = `
            <h4>${prod.nombre}</h4>
            <p>Precio: $${prod.precio}</p>
            <button onclick="eliminarDeWishlist(${prod.id})">Eliminar</button>
            <button onclick='agregarAlCarrito(${JSON.stringify(prod)})'>Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

// =====================
// Funciones de reseñas (sin iniciar sesión)
// =====================
function agregarReseña(nombreUsuario, titulo, contenido, imagenURL) {
    const nuevaReseña = {
        id: Date.now(),
        usuario: nombreUsuario || "Anónimo",
        titulo,
        contenido,
        imagen: imagenURL || ""
    };

    reseñas.push(nuevaReseña);
    localStorage.setItem("reseñas", JSON.stringify(reseñas));
    mostrarReseñas();
}

function eliminarReseña(id) {
    reseñas = reseñas.filter(r => r.id !== id);
    localStorage.setItem("reseñas", JSON.stringify(reseñas));
    mostrarReseñas();
}

function mostrarReseñas() {
    const contenedor = document.getElementById("contenedor-reseñas");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (reseñas.length === 0) {
        contenedor.innerHTML = "<p>No hay reseñas aún.</p>";
        return;
    }

    reseñas.forEach(r => {
        const div = document.createElement("div");
        div.className = "reseña";
        div.innerHTML = `
            <h4>${r.titulo}</h4>
            <p class="usuario">Por: ${r.usuario}</p>
            <p>${r.contenido}</p>
            ${r.imagen ? `<img src="${r.imagen}" alt="imagen reseña">` : ""}
            <button class="btnEliminar" onclick="eliminarReseña(${r.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

// =====================
// Inicialización al cargar
// =====================
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();
    mostrarCarrito();
    mostrarWishlist();
    mostrarReseñas();

    // Formulario de reseñas
    const form = document.getElementById("formReseña");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombreUsuario = document.getElementById("usuarioNombre").value.trim();
            const titulo = document.getElementById("titulo").value.trim();
            const contenido = document.getElementById("contenido").value.trim();
            const imagenURL = document.getElementById("imagenURL").value.trim();
            if (nombreUsuario && titulo && contenido) {
                agregarReseña(nombreUsuario, titulo, contenido, imagenURL);
                form.reset();
            }
        });
    }
});
