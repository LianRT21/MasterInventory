let productoActual = null;
let contadorProductos = 1;

// Función para agregar un nuevo producto
function agregarProducto() {
    const catalogo = document.querySelector('.catalogo');
    const nuevoProducto = document.createElement('div');
    contadorProductos++;
    
    nuevoProducto.className = 'producto';
    nuevoProducto.dataset.id = contadorProductos;
    
    nuevoProducto.innerHTML = `
        <img src="" alt="Imagen" class="imagen">
        <div class="info">
            <div class="nombre">Nuevo Producto</div>
            <div class="descripcion">Descripción del nuevo producto</div>
            <div class="costo">$0.00</div>
            <div class="cantidad">0</div>
        </div>
        <button class="editar-btn" onclick="editarProducto(this)">Editar</button>
    `;
    
    catalogo.appendChild(nuevoProducto);
}

// Función para eliminar productos
function seleccionarProductoParaEliminar() {
    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
        producto.style.cursor = 'pointer';
        producto.addEventListener('click', eliminarProducto, { once: true });
    });
    alert('Haz clic en el producto que deseas eliminar');
}

function eliminarProducto(event) {
    const producto = event.currentTarget;
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        producto.remove();
    }
    // Restaurar cursor normal en los productos restantes
    const productos = document.querySelectorAll('.producto');
    productos.forEach(p => {
        p.style.cursor = 'default';
        p.removeEventListener('click', eliminarProducto);
    });
}

// Función para editar producto
function editarProducto(button) {
    productoActual = button.closest('.producto');
    const modal = document.getElementById('editModal');
    
    // Obtener los valores actuales
    const nombre = productoActual.querySelector('.nombre').textContent.trim();
    const descripcion = productoActual.querySelector('.descripcion').textContent.trim();
    const costo = productoActual.querySelector('.costo').textContent.replace('$', '').trim();
    const cantidad = productoActual.querySelector('.cantidad').textContent.trim();
    const imagenActual = productoActual.querySelector('.imagen').src;

    // Rellenar el formulario
    document.getElementById('nombre').value = nombre;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('costo').value = costo;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('imagenURL').value = imagenActual;

    // Mostrar imagen actual en la vista previa
    const imagePreview = document.getElementById('imagePreview');
    if (imagenActual && !imagenActual.endsWith('Imagen')) {
        imagePreview.innerHTML = `<img src="${imagenActual}" style="max-width: 100%; border-radius: 10px;">`;
    }

    modal.style.display = 'block';
}

// Función para guardar cambios
function guardarCambios(e) {
    e.preventDefault();
    
    if (!productoActual) {
        console.error('No hay producto seleccionado para editar');
        return;
    }

    // Obtener los nuevos valores
    const nuevoNombre = document.getElementById('nombre').value.trim();
    const nuevaDescripcion = document.getElementById('descripcion').value.trim();
    const nuevoCosto = document.getElementById('costo').value.trim();
    const nuevaCantidad = document.getElementById('cantidad').value.trim();
    const nuevaImagenURL = document.getElementById('imagenURL').value.trim();
    const archivoImagen = document.getElementById('imagenArchivo').files[0];

    // Validar que los campos requeridos no estén vacíos
    if (!nuevoNombre || !nuevaDescripcion || !nuevoCosto || !nuevaCantidad) {
        alert('Por favor, completa todos los campos requeridos');
        return;
    }

    try {
        // Actualizar el contenido del producto
        productoActual.querySelector('.nombre').textContent = nuevoNombre;
        productoActual.querySelector('.descripcion').textContent = nuevaDescripcion;
        productoActual.querySelector('.costo').textContent = `$${nuevoCosto}`;
        productoActual.querySelector('.cantidad').textContent = nuevaCantidad;

        // Actualizar la imagen
        if (archivoImagen) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productoActual.querySelector('.imagen').src = e.target.result;
            };
            reader.readAsDataURL(archivoImagen);
        } else if (nuevaImagenURL) {
            productoActual.querySelector('.imagen').src = nuevaImagenURL;
        }

        // Cerrar el modal y limpiar
        cerrarModal();
        alert('Producto actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un error al actualizar el producto');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosIniciales();

    // Event listener para el formulario de edición
    const form = document.getElementById('editForm');
    if (form) {
        form.addEventListener('submit', guardarCambios);
    }

    // Event listener para cerrar el modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            cerrarModal();
        }
    };
});

function cerrarModal() {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    
    modal.style.display = 'none';
    form.reset();
    document.getElementById('imagePreview').innerHTML = '';
    productoActual = null;
}

function cargarImagenDesdeArchivo() {
    const archivoInput = document.getElementById('imagenArchivo');
    const imagePreview = document.getElementById('imagePreview');
    const archivo = archivoInput.files[0];
    
    // Lista de tipos MIME permitidos
    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (archivo && tiposPermitidos.includes(archivo.type)) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '10px';
            imagePreview.appendChild(img);
        };
        
        reader.readAsDataURL(archivo);
    } else {
        alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF o WebP)');
        archivoInput.value = ''; // Limpia el input
        imagePreview.innerHTML = '';
    }
}

function cargarImagenDesdeURL() {
    const urlInput = document.getElementById('imagenURL').value;
    const imagePreview = document.getElementById('imagePreview');

    if (urlInput) {
        imagePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = urlInput;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '10px';
        img.onerror = function() {
            imagePreview.innerHTML = '<p>Error al cargar la imagen</p>';
        };
        imagePreview.appendChild(img);
    } else {
        imagePreview.innerHTML = '';
    }
}

function ordenarProductos(criterio) {
    const catalogo = document.querySelector('.catalogo');
    const productos = Array.from(catalogo.getElementsByClassName('producto'));

    productos.sort((a, b) => {
        switch (criterio) {
            case 'nombreAsc':
                return compararTextos(a, b, '.nombre');
            case 'nombreDesc':
                return compararTextos(b, a, '.nombre');
            case 'precioAsc':
                return compararPrecios(a, b);
            case 'precioDesc':
                return compararPrecios(b, a);
            default:
                return 0;
        }
    });

    // Limpiar y reordenar el catálogo
    catalogo.innerHTML = '';
    productos.forEach(producto => catalogo.appendChild(producto));
}

function compararTextos(a, b, selector) {
    const textoA = a.querySelector(selector).textContent.toLowerCase();
    const textoB = b.querySelector(selector).textContent.toLowerCase();
    return textoA.localeCompare(textoB);
}

function compararPrecios(a, b) {
    const precioA = extraerPrecio(a.querySelector('.costo').textContent);
    const precioB = extraerPrecio(b.querySelector('.costo').textContent);
    return precioA - precioB;
}

function extraerPrecio(texto) {
    // Extrae solo los números del texto del precio (elimina el símbolo $ y cualquier otro carácter)
    return parseFloat(texto.replace(/[^\d.-]/g, '')) || 0;
}

function cargarProductosIniciales() {
    const catalogo = document.querySelector('.catalogo');
    catalogo.innerHTML = ''; // Limpiar catálogo existente

    PRODUCTOS_INICIAL.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto';
        productoElement.dataset.id = producto.id;
        
        productoElement.innerHTML = `
            <img src="" alt="Imagen" class="imagen">
            <div class="info">
                <div class="nombre">${producto.nombre}</div>
                <div class="descripcion">${producto.descripcion}</div>
                <div class="costo">$${producto.precio.toLocaleString()}</div>
                <div class="cantidad">${producto.stock}</div>
            </div>
            <button class="editar-btn" onclick="editarProducto(this)">Editar</button>
        `;
        
        catalogo.appendChild(productoElement);
    });
}