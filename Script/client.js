/* SAMPLE DATA */
var allOrders = [
  { id: 'CC-881234', item: 'Kids Polo',  icon: '🥋', cat: 'KIDS',  qty: 1, price: 850,  status: 'delivered',  date: 'March 18, 2026' },
  { id: 'CC-774512', item: 'Hoodie',     icon: '🏋', cat: 'MEN',   qty: 1, price: 1529, status: 'shipped',    date: 'March 22, 2026' },
  { id: 'CC-662398', item: 'Crop Tee',   icon: '👕', cat: 'WOMEN', qty: 2, price: 1198, status: 'production', date: 'March 28, 2026' },
  { id: 'CC-554107', item: 'Kid Tee',    icon: '👕', cat: 'KIDS',  qty: 3, price: 1197, status: 'confirmed',  date: 'March 30, 2026' },
  { id: 'CC-448920', item: 'Polo Shirt', icon: '👔', cat: 'MEN',   qty: 1, price: 899,  status: 'delivered',  date: 'Feb 14, 2026' }
];

var cart = [];
var currentOrderFilter = 'all';

/* PAGE NAVIGATION */
function showPage(name) {
  var pages = document.querySelectorAll('.page');

  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }

  document.getElementById('page-' + name).classList.add('active');
  closeHamburger();

  if (name === 'orders') renderOrdersTable();
  if (name === 'active') renderActiveOrders();
  if (name === 'cart') renderCart();
}

/* HAMBURGER */
function toggleHamburger() {
  document.getElementById('hamburgerMenu').classList.toggle('open');
}

function closeHamburger() {
  document.getElementById('hamburgerMenu').classList.remove('open');
}

document.addEventListener('click', function (e) {
  var menu = document.getElementById('hamburgerMenu');
  var btn = document.querySelector('.hamburger-btn');

  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
  }
});

/* SIGN OUT */
function signOut() {
  showToast('Signed out successfully!', '👋');
  closeHamburger();
  window.location.href = '../index.html';
}

/* STATUS PILL */
function getPill(status) {
  var labels = {
    confirmed: 'Confirmed',
    production: 'In Production',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return '<span class="pill pill-' + status + '">' + (labels[status] || status) + '</span>';
}

/* ORDERS TABLE */
function filterOrders(status, btn) {
  currentOrderFilter = status;

  var tabs = document.querySelectorAll('.filter-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  btn.classList.add('active');
  renderOrdersTable();
}

function renderOrdersTable() {
  var tbody = document.getElementById('ordersTableBody');
  var html = '';

  for (var i = 0; i < allOrders.length; i++) {
    var o = allOrders[i];

    if (currentOrderFilter !== 'all' && o.status !== currentOrderFilter) continue;

    html += '<tr>';
    html += '<td class="order-id-cell">#' + o.id + '</td>';
    html += '<td>' + o.icon + ' ' + o.item + '</td>';
    html += '<td>' + o.cat + '</td>';
    html += '<td>' + o.qty + '</td>';
    html += '<td>₱' + o.price.toLocaleString() + '</td>';
    html += '<td>' + getPill(o.status) + '</td>';
    html += '<td style="color:#888;">' + o.date + '</td>';
    html += '<td><button class="btn-track" onclick="openTrackModal(\'' + o.id + '\')">Track</button></td>';
    html += '</tr>';
  }

  if (html === '') {
    html = '<tr><td colspan="8" style="text-align:center; padding:40px; color:#555;">No orders found.</td></tr>';
  }

  tbody.innerHTML = html;
}

/* TRACKING MODAL */
var trackSteps = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Your order has been received.' },
  { key: 'production', label: 'In Production', desc: 'Your garment is being crafted.' },
  { key: 'shipped', label: 'Shipped', desc: 'Your order is on its way.' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your custom piece!' }
];

var stepOrder = ['confirmed', 'production', 'shipped', 'delivered'];

function openTrackModal(orderId) {
  var order = null;

  for (var i = 0; i < allOrders.length; i++) {
    if (allOrders[i].id === orderId) {
      order = allOrders[i];
      break;
    }
  }

  if (!order) return;

  document.getElementById('trackModalTitle').textContent = 'Order #' + order.id;
  document.getElementById('trackModalSub').textContent = order.item + ' · ₱' + order.price.toLocaleString();

  var currentIdx = stepOrder.indexOf(order.status);
  var html = '';

  for (var j = 0; j < trackSteps.length; j++) {
    var step = trackSteps[j];
    var stepIdx = stepOrder.indexOf(step.key);
    var dotClass = 'dot-pending';
    var symbol = j + 1;
    var stepClass = '';

    if (stepIdx < currentIdx) {
      dotClass = 'dot-done';
      symbol = '✓';
      stepClass = 'done';
    } else if (stepIdx === currentIdx) {
      dotClass = 'dot-current';
      symbol = '●';
    }

    html += '<div class="track-step ' + stepClass + '">';
    html += '<div class="step-dot ' + dotClass + '">' + symbol + '</div>';
    html += '<div class="step-text">';
    html += '<h5>' + step.label + '</h5>';
    html += '<p>' + step.desc + '</p>';
    html += '</div>';
    html += '</div>';
  }

  document.getElementById('trackModalSteps').innerHTML = html;
  document.getElementById('trackModal').classList.add('open');
}

function closeTrackModal() {
  document.getElementById('trackModal').classList.remove('open');
}

document.getElementById('trackModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeTrackModal();
  }
});

/* ACTIVE ORDERS */
var progressMap = {
  confirmed: 15,
  production: 50,
  shipped: 80,
  delivered: 100
};

var progressLabelMap = {
  confirmed: 'Order received – preparing',
  production: 'Being crafted in workshop',
  shipped: 'Out for delivery',
  delivered: 'Delivered'
};

function renderActiveOrders() {
  var container = document.getElementById('activeCardsContainer');
  var html = '';
  var count = 0;

  for (var i = 0; i < allOrders.length; i++) {
    var o = allOrders[i];

    if (o.status === 'delivered' || o.status === 'cancelled') continue;

    count++;
    var pct = progressMap[o.status] || 0;
    var label = progressLabelMap[o.status] || o.status;

    html += '<div class="active-card">';
    html += '<div class="active-icon">' + o.icon + '</div>';
    html += '<div class="active-info">';
    html += '<h4>' + o.item + '</h4>';
    html += '<p>#' + o.id + ' · ' + o.cat + ' · Qty: ' + o.qty + '</p>';
    html += '<p style="margin-top:6px;">' + getPill(o.status) + '</p>';
    html += '</div>';
    html += '<div class="active-progress">';
    html += '<div class="progress-label">' + label + ' (' + pct + '%)</div>';
    html += '<div class="progress-bar-bg"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';
    html += '</div>';
    html += '<div class="active-right">';
    html += '<div class="price">₱' + o.price.toLocaleString() + '</div>';
    html += '<div class="date">' + o.date + '</div>';
    html += '<button class="btn-track" style="margin-top:10px;" onclick="openTrackModal(\'' + o.id + '\')">Track</button>';
    html += '</div>';
    html += '</div>';
  }

  if (count === 0) {
    html = '<div class="empty-msg"><div class="big">📦</div><p>No active orders right now.</p></div>';
  }

  container.innerHTML = html;
  document.getElementById('badgeActive').textContent = count;
}

/* CART */
function renderCart() {
  var container = document.getElementById('cartItemsContainer');

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-msg">' +
      '<div class="big">🛒</div>' +
      '<p>Your cart is empty.</p>' +
      '</div>';

    document.getElementById('sumSubtotal').textContent = '₱0';
    document.getElementById('sumTotal').textContent = '₱230';
    document.getElementById('cartCountLabel').textContent = '0 items in your cart';
    updateBadges();
    return;
  }

  var html = '';
  var subtotal = 0;
  var totalQty = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    subtotal += item.price * item.qty;
    totalQty += item.qty;

    html += '<div class="cart-item">';
    html += '<div class="cart-icon">' + item.icon + '</div>';
    html += '<div class="cart-item-info">';
    html += '<h4>' + item.name + '</h4>';
    html += '<p>' + item.cat + ' · Size ' + item.size + '</p>';
    html += '</div>';
    html += '<div class="cart-item-right">';
    html += '<div class="cart-item-price">₱' + (item.price * item.qty).toLocaleString() + '</div>';
    html += '<div class="qty-row">';
    html += '<button class="qty-btn" onclick="changeQty(' + i + ', -1)">−</button>';
    html += '<span class="qty-num">' + item.qty + '</span>';
    html += '<button class="qty-btn" onclick="changeQty(' + i + ', 1)">+</button>';
    html += '</div>';
    html += '<button class="remove-btn" onclick="removeItem(' + i + ')">🗑</button>';
    html += '</div>';
    html += '</div>';
  }

  document.getElementById('sumSubtotal').textContent = '₱' + subtotal.toLocaleString();
  document.getElementById('sumTotal').textContent = '₱' + (subtotal + 150 + 80).toLocaleString();
  document.getElementById('cartCountLabel').textContent = totalQty + ' item(s) in your cart';
  container.innerHTML = html;
  updateBadges();
}

function changeQty(index, delta) {
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  renderCart();
}

function removeItem(index) {
  var name = cart[index].name;
  cart.splice(index, 1);
  renderCart();
  showToast(name + ' removed.', '🗑');
}

function placeOrder() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', '⚠️');
    return;
  }

  var orderId = 'CC-' + Math.floor(100000 + Math.random() * 900000);
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }

  var newOrder = {
    id: orderId,
    item: cart[0].name + (cart.length > 1 ? ' + ' + (cart.length - 1) + ' more' : ''),
    icon: cart[0].icon,
    cat: cart[0].cat,
    qty: cart.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0),
    price: total + 150 + 80,
    status: 'confirmed',
    date: 'Today'
  };

  allOrders.unshift(newOrder);
  cart = [];

  renderCart();
  renderOrdersTable();
  renderActiveOrders();
  updateBadges();
  showPage('orders');
  showToast('Order placed! #' + orderId, '✓');
}

/* BADGES */
function updateBadges() {
  document.getElementById('badgeOrders').textContent = allOrders.length;

  var activeCount = 0;
  for (var i = 0; i < allOrders.length; i++) {
    if (allOrders[i].status !== 'delivered' && allOrders[i].status !== 'cancelled') {
      activeCount++;
    }
  }

  document.getElementById('badgeActive').textContent = activeCount;

  var cartQty = 0;
  for (var j = 0; j < cart.length; j++) {
    cartQty += cart[j].qty;
  }

  document.getElementById('badgeCart').textContent = cartQty;
}

/* ACCOUNT */
function savePersonal() {
  var first = document.getElementById('accFirst').value.trim();
  var last = document.getElementById('accLast').value.trim();

  if (first && last) {
    document.getElementById('welcomeName').textContent = (first + ' ' + last).toUpperCase();
  }

  var msg = document.getElementById('personalSaveMsg');
  msg.style.display = 'block';

  setTimeout(function () {
    msg.style.display = 'none';
  }, 2500);

  showToast('Personal info saved!', '✓');
}

function saveAddress() {
  var msg = document.getElementById('addressSaveMsg');
  msg.style.display = 'block';

  setTimeout(function () {
    msg.style.display = 'none';
  }, 2500);

  showToast('Address saved!', '📍');
}

/* TOAST */
var toastTimer;

function showToast(message, icon) {
  var toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = message;
  document.getElementById('toastIcon').textContent = icon || '✓';

  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2800);
}

/* INIT */
renderOrdersTable();
renderActiveOrders();
renderCart();
updateBadges();