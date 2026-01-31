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

    const keyword = document.querySelector('#search').value.toLowerCase();

    const filteredProducts = products
        .filter(product => product.title.toLowerCase().includes(keyword))
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

    paginatedProducts.forEach((product, index) => {
        const row = document.createElement('tr');

        const imagesHtml = product.images
            .map(img => `<img src="${img}" style="width:100px;margin:5px;">`)
            .join('');

        const descId = `desc-${index}`;

        row.innerHTML = `
            <td>${product.title}</td>
            <td>${imagesHtml}</td>
            <td>${product.price}</td>
            <td class="description-column">
                <button class="toggle-desc" data-id="${descId}">
                    Xem mô tả
                </button>
                <div id="${descId}" style="display:none; margin-top:6px;">
                    ${product.description || 'No description available'}
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Gắn sự kiện cho nút Xem mô tả
    document.querySelectorAll('.toggle-desc').forEach(btn => {
        btn.addEventListener('click', () => {
            const desc = document.getElementById(btn.dataset.id);
            const isHidden = desc.style.display === 'none';

            desc.style.display = isHidden ? 'block' : 'none';
            btn.textContent = isHidden ? 'Ẩn mô tả' : 'Xem mô tả';
        });
    });

    document.querySelector('#currentPage').textContent = currentPage;
    document.querySelector('#prevPage').disabled = currentPage === 1;
    document.querySelector('#nextPage').disabled =
        currentPage === Math.ceil(filteredProducts.length / itemsPerPage);
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

document.querySelector('#toggleDescription').addEventListener('click', () => {
    const descriptionCells = document.querySelectorAll('#productTable td:nth-child(4), #productTable th:nth-child(4)');
    descriptionCells.forEach(cell => {
        if (cell.style.display === 'none') {
            cell.style.display = '';
        } else {
            cell.style.display = 'none';
        }
    });
});

fetchProducts();