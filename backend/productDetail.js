document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    if (isNaN(productId)) {
        document.getElementById("productDetailContainer").innerHTML = "<p>Invalid product ID.</p>";
        return;
    }

    const product = products.find(p => p.id === productId);

    console.log("Loaded product:", product); // ตรวจสอบข้อมูลสินค้า

    if (product) {
        displayProductDetail(product);
    } else {
        document.getElementById("productDetailContainer").innerHTML = "<p>Product not found.</p>";
    }
});


function displayProductDetail(products) {

    const container = document.getElementById("productDetailContainer");
    alert(`Loaded product data: ${products.id}`); // ตรวจสอบข้อมูลที่ดึงมา
    container.innerHTML = `
    <div class="page-heading header-text">
     <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h3>${products.name}</h3>
          <span class="breadcrumb"><a href="#">Home</a>  >  <a href="#">Shop</a>  >  ${products.name}</span>
        </div>
      </div>
     </div>
    </div>

  <div class="single-product section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="left-image">
            <img src="${products.image}" alt="">
          </div>
        </div>
        <div class="col-lg-6 align-self-center">
          <h4>${products.name}</h4>
          <span class="price"> $${products.price}</span>
          <p>${products.description}</p>
          <button onclick="addToCart(${products.id})"><i class="fa fa-shopping-bag"></i> ADD TO CART</button>
          <ul>
            <li><span>Game ID:</span>${products.id}</li>
            <li><span>Genre:</span> <a href="#">${products.category.join(", ")}</a></li>
          </ul>
        </div>
        <div class="col-lg-12">
          <div class="sep"></div>
        </div>
      </div>
    </div>
  </div>
    `;
}

let cart = [];
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(p => p.id === productId);

    // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าแล้วหรือไม่
    if (existingProduct) {
        // ถ้ามีอยู่แล้ว เพิ่มจำนวนให้ 1
        existingProduct.quantity += 1;
    } else {
        // ถ้ายังไม่มี เพิ่มสินค้าใหม่ไปยังตะกร้า
        cart.push({ ...product, quantity: 1 });
    }

    // บันทึกข้อมูลตะกร้าไปยังไฟล์
    saveCartToFile();
    alert("Product added to cart!");
}

function saveCartToFile() {
    fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cart) // ส่งตะกร้าทั้งหมดไปยังเซิร์ฟเวอร์
    })
    .then(response => {
        if (response.ok) {
            alert("Cart saved successfully!");
        } else {
            alert("Error saving cart.");
        }
    })
    .catch(err => console.error("Error:", err));
}

displayProductDetail();
