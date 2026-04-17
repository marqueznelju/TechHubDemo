// Initialize "Database" in LocalStorage
if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify([]));
if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));

function showSection(section) {
    document.getElementById('shop-section').style.display = section === 'shop' ? 'block' : 'none';
    document.getElementById('sell-section').style.display = section === 'sell' ? 'block' : 'none';
    document.getElementById('cart-section').style.display = section === 'cart' ? 'block' : 'none';
    if(section === 'shop') renderProducts();
    if(section === 'cart') renderCart();
}

// Seller Logic
function handleSell() {
    const title = document.getElementById('prod-title').value;
    const price = document.getElementById('prod-price').value;
    const desc = document.getElementById('prod-desc').value;
    const imgInput = document.getElementById('prod-image');

    if (!title || !price) return alert("Please fill in title and price");

    const reader = new FileReader();
    reader.onload = function(e) {
        const products = JSON.parse(localStorage.getItem('products'));
        const newProd = {
            id: Date.now(),
            title,
            price: parseFloat(price),
            desc,
            image: e.target.result
        };
        products.push(newProd);
        localStorage.setItem('products', JSON.stringify(products));
        alert("Product listed successfully!");
        showSection('shop');
    };
    
    if (imgInput.files[0]) reader.readAsDataURL(imgInput.files[0]);
    else alert("Please upload an image");
}

// Shop Logic
function renderProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    const grid = document.getElementById('product-grid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="empty-msg">The shop is currently empty.</p>';
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="viewProduct(${p.id})">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p class="price">₱${p.price.toLocaleString()}</p>
        </div>
    `).join('');
}

function viewProduct(id) {
    // Demo: Use localStorage to pass data to product page
    window.location.href = `product.html?id=${id}`;
}

// Cart Logic
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        summary.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid #eee;">
            <div>
                <h4>${item.title}</h4>
                <p>₱${item.price.toLocaleString()}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    summary.innerHTML = `
        <div style="margin-top:2rem; border-top: 2px solid #000; padding-top:1rem;">
            <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:700;">
                <span>Total</span>
                <span>₱${total.toLocaleString()}</span>
            </div>
            <button class="primary-btn" style="margin-top:1rem;" onclick="checkout()">Checkout</button>
        </div>
    `;
    updateCartCount();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    document.getElementById('cart-count').innerText = cart.length;
}

// Checkout & Receipt
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderId = Math.floor(Math.random() * 1000000);

    let receiptHTML = `
        <h2 style="margin-bottom:1rem;">Receipt</h2>
        <p>Order ID: #${orderId}</p>
        <hr style="margin:1rem 0;">
        ${cart.map(i => `<p style="display:flex; justify-content:space-between;"><span>${i.title}</span> <span>₱${i.price}</span></p>`).join('')}
        <hr style="margin:1rem 0;">
        <h3 style="display:flex; justify-content:space-between;"><span>Total Paid</span> <span>₱${total.toLocaleString()}</span></h3>
        <p style="margin-top:1rem; color:green;">Status: Paid via PesoWallet</p>
    `;

    document.getElementById('receipt-data').innerHTML = receiptHTML;
    document.getElementById('receipt-modal').style.display = 'flex';
    localStorage.setItem('cart', JSON.stringify([])); // Clear cart
}

function closeReceipt() {
    document.getElementById('receipt-modal').style.display = 'none';
    showSection('shop');
    updateCartCount();
}

// Initial Run
renderProducts();
updateCartCount();