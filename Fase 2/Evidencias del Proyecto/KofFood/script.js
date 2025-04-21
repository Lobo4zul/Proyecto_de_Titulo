// script.js

let categoriaActual = '';
let carrito = [];
let clienteID = 1;

const grid = document.getElementById('productosGrid');
const titulo = document.getElementById('tituloCategoria');
const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
const modalCarrito = new bootstrap.Modal(document.getElementById('modalCarrito'));
let productoSeleccionado = null;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    categoriaActual = e.target.getAttribute('href').replace('#', '');
    mostrarProductos(categoriaActual);
  });
});

function mostrarProductos(categoria) {
  titulo.textContent = `Productos - ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
  grid.innerHTML = '';

  productos[categoria].forEach((prod, i) => {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-4';
    col.innerHTML = `
      <div class="card" data-index="${i}">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" />
        <div class="card-body text-center">
          <h5 class="card-title">${prod.nombre}</h5>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      productoSeleccionado = productos[categoria][index];
      document.getElementById('nombreProductoSeleccionado').textContent = productoSeleccionado.nombre;
      document.getElementById('cantidadSeleccionada').value = 1;
      modal.show();
    });
  });
}

document.getElementById('aceptarProducto').addEventListener('click', () => {
  const cantidad = parseInt(document.getElementById('cantidadSeleccionada').value);
  if (cantidad > 0) {
    const item = {
      ...productoSeleccionado,
      cantidad,
    };
    carrito.push(item);
    actualizarContador();
  }
  modal.hide();
});

document.getElementById('carritoBtn').addEventListener('click', () => {
  const contenedor = document.getElementById('carritoContenido');
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>No hay productos en el carrito.</p>';
    return;
  }

  carrito.forEach((item, i) => {
    contenedor.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>${item.nombre} x ${item.cantidad}</div>
        <button class="btn btn-sm btn-danger" onclick="eliminarItem(${i})">Eliminar</button>
      </div>`;
  });

  modalCarrito.show();
});

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarContador();
  document.getElementById('carritoBtn').click();
}

function actualizarContador() {
  document.getElementById('contadorCarrito').textContent = carrito.length;
}

document.getElementById('pagarBtn').addEventListener('click', () => {
  if (carrito.length === 0) return;

  const comanda = {
    cliente: clienteID,
    items: carrito,
  };

  // Guardar en localStorage
  const comandas = JSON.parse(localStorage.getItem('comandas')) || [];
  comandas.push(comanda);
  localStorage.setItem('comandas', JSON.stringify(comandas));

  // Boleta virtual
  const boleta = `
  === BOLETA VIRTUAL ===
  Cliente Nº ${clienteID}
  ----------------------
  ${carrito.map(item => `${item.nombre} x${item.cantidad}`).join('\n')}
  ----------------------
  ¡Gracias por tu compra! 🎉
  `;
  alert(boleta);

  // Reset
  carrito = [];
  actualizarContador();
  clienteID = clienteID >= 15 ? 1 : clienteID + 1;
  modalCarrito.hide();
});
