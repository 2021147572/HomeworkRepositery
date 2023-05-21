let products = [];
let displayedProducts = [];
let lastIndex = 0;

// Fetch data from the JSON file
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(products);
    });

// Display products and implement infinite scroll
function displayProducts(products) {
    const productContainer = document.querySelector('#product-container');
    products.forEach(product => {
        const productElement = createProductElement(product);
        productContainer.appendChild(productElement);
    });
    displayedProducts = [...displayedProducts, ...products];
    lastIndex += products.length;
}

function createProductElement(product) {
    const el = document.createElement('div');
    el.classList.add('product');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.classList.add('product-image');

    const name = document.createElement('h2');
    name.textContent = product.name;
    name.classList.add('product-name');

    el.appendChild(img);
    el.appendChild(name);
    el.addEventListener('click', () => displayProductDescription(product));

    return el;
}

// Implement infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        displayProducts(products.slice(lastIndex, lastIndex + 10));  // Display 10 more products each time
    }
});

// Keyword search function
const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keyup', (event) => {
    const keyword = event.target.value;
    const filteredProducts = products.filter(product => product.name.includes(keyword));
    clearProducts();
    displayProducts(filteredProducts);
});

// Category filtering
const categoryInput = document.querySelector('#category-input');
categoryInput.addEventListener('change', (event) => {
    const category = event.target.value;
    const filteredProducts = products.filter(product => product.category === category);
    clearProducts();
    displayProducts(filteredProducts);
});

// Sort function
const sortInput = document.querySelector('#sort-input');
sortInput.addEventListener('change', (event) => {
    const sortBy = event.target.value;
    let sortedProducts = [...products];
    if (sortBy === 'price') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'name') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    clearProducts();
    displayProducts(sortedProducts);
});

function clearProducts() {
    const productContainer = document.querySelector('#product-container');
    productContainer.innerHTML = '';
    displayedProducts = [];
    lastIndex = 0;
}

// Display product description when a product is clicked
function displayProductDescription(event) {
    const productId = event.currentTarget.dataset.id;
    const product = displayedProducts.find(product => product.id == productId);
    const productDescriptionContainer = document.querySelector('#product-description');
    productDescriptionContainer.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p>${product.price}</p>
    `;
}
