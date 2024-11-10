let productos = [];
let ventas = [];

document.addEventListener('DOMContentLoaded', function() {
    productos = PRODUCTOS_INICIAL;
    actualizarSelectProductos();
    
    const clienteInput = document.getElementById('cliente');
    clienteInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 12) {
            this.value = this.value.slice(0, 12);
        }
    });

    clienteInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const texto = (e.clipboardData || window.clipboardData).getData('text');
        const numerosOnly = texto.replace(/[^0-9]/g, '');
        this.value = numerosOnly.slice(0, 12);
    });

    const selectProducto = document.getElementById('producto');
    selectProducto.addEventListener('change', actualizarInfoProducto);

    document.getElementById('cantidad').addEventListener('input', actualizarTotal);

    document.getElementById('ventaForm').addEventListener('submit', registrarVenta);
});

function actualizarInfoProducto() {
    const productoId = document.getElementById('producto').value;
    const producto = productos.find(p => p.id == productoId);
    
    if (producto) {
        document.getElementById('precioUnitario').textContent = `$${producto.precio.toLocaleString()}`;
        document.getElementById('stockDisponible').textContent = producto.stock;
        actualizarTotal();
    }
}

function actualizarTotal() {
    const productoId = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const producto = productos.find(p => p.id == productoId);
    
    if (producto && cantidad) {
        const total = producto.precio * cantidad;
        document.getElementById('totalVenta').textContent = `$${total.toLocaleString()}`;
    }
}

function registrarVenta(e) {
    e.preventDefault();

    const identificacion = document.getElementById('cliente').value;
    if (identificacion.length < 6) {
        alert('El número de identificación debe tener al menos 6 dígitos');
        return;
    }
    
    const productoId = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const metodoPago = document.getElementById('metodoPago').value;
    
    const producto = productos.find(p => p.id == productoId);
    
    // Verificar que hay suficiente stock antes de continuar
    if (cantidad > producto.stock) {
        alert('La cantidad solicitada supera el stock disponible.');
        return;
    }
    
    const venta = {
        fecha: new Date(),
        cliente: identificacion,
        producto: producto.nombre,
        cantidad: cantidad,
        total: producto.precio * cantidad,
        metodoPago: metodoPago
    };
    
    ventas.push(venta); // Agregar venta al array de ventas
    producto.stock -= cantidad; // Reducir el stock del producto

    actualizarTablaVentas(); // Actualizar el historial de ventas
    actualizarSelectProductos(); // Refrescar el select de productos

    e.target.reset(); // Limpiar el formulario
    document.getElementById('totalVenta').textContent = '$0.00';

    alert('Venta registrada exitosamente');
}

function actualizarTablaVentas() {
    const tbody = document.querySelector('#tablaVentas tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    ventas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${venta.fecha.toLocaleDateString()}</td>
            <td>${venta.cliente}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.total.toLocaleString()}</td>
            <td>${venta.metodoPago}</td>
        `;
        tbody.appendChild(tr); // Agregar la fila a la tabla
    });
}

function actualizarSelectProductos() {
    const selectProducto = document.getElementById('producto');
    selectProducto.innerHTML = '<option value="">Seleccionar producto...</option>';
    
    productos.forEach(producto => {
        if (producto.stock > 0) {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} (Stock: ${producto.stock})`;
            selectProducto.appendChild(option);
        }
    });
}
