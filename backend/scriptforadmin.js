var selectedRow = null;

window.onload = function () {
    loadFromLocalStorage();
};

function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
            saveToServer(formData); // เพิ่มบรรทัดนี้เพื่อส่งข้อมูลไปเซิร์ฟเวอร์
    }else{
            updateRecord(formData);
        resetForm();
        saveToLocalStorage();
    }
}

function readFormData() {
    var formData = {};
    formData["productName"] = document.getElementById("productName").value;
    formData["price"] = document.getElementById("price").value;
    formData["description"] = document.getElementById("description").value;

    var categories = [];
    document.querySelectorAll("input[name='category']:checked").forEach(cb => categories.push(cb.value));
    formData["category"] = categories.join(", ");
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("productList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.productName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.price;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.category;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.description;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.querySelectorAll("input[name='category']").forEach(cb => cb.checked = false);
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("productName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("price").value = selectedRow.cells[1].innerHTML;
    let cats = selectedRow.cells[2].innerHTML.split(", ");
    document.querySelectorAll("input[name='category']").forEach(cb => cb.checked = cats.includes(cb.value));
    document.getElementById("description").value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.productName;
    selectedRow.cells[1].innerHTML = formData.price;
    selectedRow.cells[2].innerHTML = formData.category;
    selectedRow.cells[3].innerHTML = formData.description;
    saveToLocalStorage();
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("productList").deleteRow(row.rowIndex);
        resetForm();
        saveToLocalStorage();
    }
}

function validate() {
    isValid = true;
    if (document.getElementById("productName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}

function saveToLocalStorage() {
    let table = document.getElementById("productList").getElementsByTagName('tbody')[0];
    let data = [];
    for (let i = 0; i < table.rows.length; i++) {
        data.push({
            productName: table.rows[i].cells[0].innerHTML,
            price: table.rows[i].cells[1].innerHTML,
            category: table.rows[i].cells[2].innerHTML,
            description: table.rows[i].cells[3].innerHTML
        });
    }
    localStorage.setItem("products", JSON.stringify(data));
}

function loadFromLocalStorage() {
    let data = localStorage.getItem("products");
    if (data) {
        JSON.parse(data).forEach(item => insertNewRecord(item));
    }
}

function saveToServer(data) {
    // เรียก API เพื่อดึงสินค้าทั้งหมด
fetch("http://localhost:4000/products")
    .then((response) => response.json())
    .then((data) => {
        console.log("Products:", data);
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });

// เพิ่มสินค้าใหม่
fetch("http://localhost:4000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer your_token" },
    body: JSON.stringify({
        id: 1,
        name: "Example Product",
        description: "This is a product description",
        category: "Category",
        price: 99.99,
        image: "image-url",
    }),
})
    .then((response) => response.json())
    .then((data) => {
        console.log("Product added:", data);
    })
    .catch((error) => {
        console.error("Error adding product:", error);
    });
}
