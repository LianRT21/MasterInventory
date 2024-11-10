document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            alert(`${productName} ha sido añadido al carrito.`);
            // Here you would typically update the cart state and UI
        });
    });

    // Simple form validation for search
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = this.querySelector('input');
        if (searchInput.value.trim() === '') {
            alert('Por favor, ingrese un término de búsqueda.');
        } else {
            alert(`Buscando: ${searchInput.value}`);
            // Here you would typically perform the search operation
        }
    });

    // Responsive menu toggle (you would need to add a menu toggle button in the HTML for mobile)
    const menuToggle = document.createElement('button');
    menuToggle.textContent = 'Menu';
    menuToggle.classList.add('menu-toggle');
    document.querySelector('nav .container').appendChild(menuToggle);

    menuToggle.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    const form = document.getElementById('editForm');
    form.addEventListener('submit', guardarCambios);

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            cerrarModal();
        }
    };
});
