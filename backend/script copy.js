function displayProducts(productList) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = ""; // ล้างรายการสินค้าเก่า
    if (productList.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    productList.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="addToCart1(${JSON.stringify(product)})">Add to Cart1</button>
        `;
        container.appendChild(productCard);
    });
}

// ฟังก์ชันกรองสินค้าตามหมวดหมู่
function filterByCategory(category) {
    if(category === "All") {
        displayProducts(products);
        return;
    }
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// ฟังก์ชันค้นหาสินค้า
function searchProducts() {
    const keyword = document.getElementById("searchKeyword").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
    displayProducts(filteredProducts);
}

let cart = [];

// ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
                const notification = document.getElementById("notification");
        notification.textContent = `${product.name} has been added to the cart.`;
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000); // ซ่อนข้อความหลัง 3 วินาที
        } else {
        alert("Product not found!");
    }
}

// ฟังก์ชันแสดงรายการสินค้าในตะกร้า (เสริม)
function displayCart() {
    const container = document.getElementById("cartContainer");
    container.innerHTML = ""; // ล้างรายการเก่า
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Quantity:</strong> ${product.price}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;
        container.appendChild(productCard);
    });
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        alert("Product removed from the cart.");
        displayCart(); // อัปเดตรายการตะกร้าหลังจากลบ
    } else {
        alert("Product not found in the cart.");
    }
}

// ปุ่มหรือหน้าตะกร้า
const viewCartButton = document.createElement("button");
viewCartButton.textContent = "View Cart";
viewCartButton.onclick = displayCart;
document.body.appendChild(viewCartButton);

// แสดงสินค้าทั้งหมดตอนเริ่มต้น
displayProducts(products);
