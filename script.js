// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll reveal animation using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

/**
 * Filters the menu items based on category
 * @param {string} category - The category to show
 * @param {Event} event - The click event
 */
function filterMenu(category, event) {
    const buttons = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.menu-item');
    
    // Update active button state
    buttons.forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    
    // Animate and filter items
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Opens Google Maps in a new tab
function openMap() {
    window.open('https://maps.app.goo.gl/ALEvUc21nsCSx7n49', '_blank');
}

// Mobile menu toggle logic
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const isFlex = window.getComputedStyle(navLinks).display === 'flex';
    navLinks.style.display = isFlex ? 'none' : 'flex';
    
    // If opening, ensure it styles correctly for mobile
    if (!isFlex) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem 5%';
    }
}