const API_URL = 'https://api.escuelajs.co/api/v1/products';

let products = [];
let currentPage = 1;
let itemsPerPage = 5;
let sortDirection = { name: 'asc', price: 'asc' };

const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const renderTable = () => {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    const filteredProducts = products
        .filter(product => product.title.toLowerCase().includes(document.querySelector('#search').value.toLowerCase()))
        .sort((a, b) => {
            if (sortDirection.name === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        })
        .sort((a, b) => {
            if (sortDirection.price === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);

    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.title}</td>
            <td><img src="${product.images[0]}" alt="${product.title}" style="width: 100px; height: auto;"></td>
            <td>${product.price}</td>
            <td>${product.description}</td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelector('#currentPage').textContent = currentPage;
    document.querySelector('#prevPage').disabled = currentPage === 1;
    document.querySelector('#nextPage').disabled = currentPage === Math.ceil(filteredProducts.length / itemsPerPage);
};

document.querySelector('#search').addEventListener('input', renderTable);
document.querySelector('#itemsPerPage').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value, 10);
    currentPage = 1;
    renderTable();
});

document.querySelector('#prevPage').addEventListener('click', () => {
    currentPage--;
    renderTable();
});

document.querySelector('#nextPage').addEventListener('click', () => {
    currentPage++;
    renderTable();
});

document.querySelector('#sortName').addEventListener('click', () => {
    sortDirection.name = sortDirection.name === 'asc' ? 'desc' : 'asc';
    renderTable();
});

document.querySelector('#sortPrice').addEventListener('click', () => {
    sortDirection.price = sortDirection.price === 'asc' ? 'desc' : 'asc';
    renderTable();
});

fetchProducts();