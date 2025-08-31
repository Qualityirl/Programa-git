
function formatCurrency(n){ return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }); }
function add(a,b){ return a + b; }
function sub(a,b){ return a - b; }
function percentDiscount(amount, pct){ return amount * (pct/100); }
function iva(amount, rate=19){ return amount * (rate/100); }


const productos = [
  { id: 1, nombre: "Camiseta Dev", precio: 65000, tipo: "fisico" },
  { id: 2, nombre: "Taza Debug", precio: 38000, tipo: "fisico" },
  { id: 3, nombre: "Sticker Pack", precio: 12000, tipo: "fisico" },
  { id: 4, nombre: "Curso JS (Digital)", precio: 99000, tipo: "digital" },
  { id: 5, nombre: "Ebook POO (Digital)", precio: 45000, tipo: "digital" }
];

const carrito = [];

function renderCatalogo(){
  const cont = document.getElementById('catalogo');
  cont.innerHTML = '';
  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="badge">${p.tipo}</span>
      <h3>${p.nombre}</h3>
      <div class="price">${formatCurrency(p.precio)}</div>
      <button data-id="${p.id}">Agregar</button>
    `;
    card.querySelector('button').addEventListener('click', () => addToCart(p.id));
    cont.appendChild(card);
  });
}

function addToCart(id){
  const prod = productos.find(p => p.id === id);
  const existing = carrito.find(ci => ci.id === id);
  if(existing){ existing.cantidad += 1; }
  else { carrito.push({ ...prod, cantidad: 1 }); }
  renderCart();
}

function removeFromCart(id){
  const idx = carrito.findIndex(ci => ci.id === id);
  if(idx >= 0){
    if(carrito[idx].cantidad > 1) carrito[idx].cantidad -= 1;
    else carrito.splice(idx,1);
    renderCart();
  }
}

function renderCart(){
  const cont = document.getElementById('carrito');
  cont.innerHTML = '';
  carrito.forEach(ci => {
    const row = document.createElement('div');
    row.className = 'card';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;">
        <div><strong>${ci.nombre}</strong> × ${ci.cantidad}</div>
        <div>${formatCurrency(ci.precio * ci.cantidad)}</div>
      </div>
      <div style="display:flex; gap:.5rem;">
        <button class="secondary" id="menos-${ci.id}">-</button>
        <button class="secondary" id="mas-${ci.id}">+</button>
      </div>
    `;
    row.querySelector(`#menos-${ci.id}`).addEventListener('click', () => removeFromCart(ci.id));
    row.querySelector(`#mas-${ci.id}`).addEventListener('click', () => addToCart(ci.id));
    cont.appendChild(row);
  });

  const subtotalNum = carrito.reduce((acc, ci) => acc + ci.precio * ci.cantidad, 0);
  const descuentoNum = percentDiscount(subtotalNum, 10);
  const ivaNum = iva(subtotalNum - descuentoNum, 19);
  const totalNum = subtotalNum - descuentoNum + ivaNum;

  document.getElementById('subtotal').textContent = formatCurrency(subtotalNum);
  document.getElementById('descuento').textContent = formatCurrency(descuentoNum);
  document.getElementById('iva').textContent = formatCurrency(ivaNum);
  document.getElementById('total').textContent = formatCurrency(totalNum);
}

document.getElementById('btn-vaciar').addEventListener('click', () => {
  carrito.splice(0, carrito.length);
  renderCart();
});

document.getElementById('btn-checkout').addEventListener('click', () => {
  if(carrito.length === 0){ alert('Tu carrito está vacío'); return; }
  alert('Compra realizada (demo). ¡Gracias!');
  carrito.splice(0, carrito.length);
  renderCart();
});

renderCatalogo();
renderCart();