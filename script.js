// Typing Animation
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
});

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        navLinks.classList.remove('nav-active'); // Close mobile menu on click
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
            
            // Trigger skill bars only when visible
            const skillBars = reveal.querySelectorAll('.fill');
            skillBars.forEach(bar => {
                bar.style.width = bar.parentElement.previousElementSibling.innerText.includes('Python') ? '90%' : 
                                  bar.parentElement.previousElementSibling.innerText.includes('SQL') ? '85%' :
                                  bar.parentElement.previousElementSibling.innerText.includes('Java') ? '70%' :
                                  bar.parentElement.previousElementSibling.innerText.includes('Clean') ? '95%' : '80%';
            });
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// Form Validation (Simple)
// const form = document.getElementById('contactForm');
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
    
//     if(name && email) {
//         alert(`Thanks ${name}! I'll get back to you at ${email} soon.`);
//         form.reset();
//     }
// });



// Handle Form Submission without leaving the page
const contactForm = document.getElementById('contactForm');
const statusMsg = document.getElementById('status-message');

contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Stop the redirect
    
    const data = new FormData(event.target);
    
    fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            statusMsg.style.display = 'block';
            statusMsg.innerHTML = "Thanks! Your message has been sent successfully.";
            statusMsg.style.color = "#00f3ff"; // Neon Cyan color
            contactForm.reset(); // Clear the form
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    statusMsg.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    statusMsg.innerHTML = "Oops! There was a problem submitting your form";
                }
                statusMsg.style.display = 'block';
                statusMsg.style.color = "red";
            })
        }
    }).catch(error => {
        statusMsg.innerHTML = "Oops! There was a problem submitting your form";
        statusMsg.style.display = 'block';
        statusMsg.style.color = "red";
    });
});