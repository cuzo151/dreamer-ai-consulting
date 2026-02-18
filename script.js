/* ═══════════════════════════════════════════════════════
   DREAMER AI CONSULTING — script.js
   Spline 3D loader + Nav blur + Smooth interactions.
   ═══════════════════════════════════════════════════════ */

import { Application } from 'https://esm.sh/@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const loader = document.getElementById('loader');

if (canvas) {
    const spline = new Application(canvas);
    spline.load('https://prod.spline.design/2UNG3Ggv8Txv3ufL/scene.splinecode')
        .then(() => {
            console.log('✅ Spline 3D scene loaded');
            if (loader) loader.style.display = 'none';
            canvas.style.opacity = '1';
        })
        .catch((err) => console.warn('Spline load error:', err));

    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(window.scrollY / maxScroll, 1);
        try {
            spline.setVariable('scrollProgress', progress);
        } catch (e) { }
    });

    spline.addEventListener('mouseDown', (e) => {
        console.log('3D Object Clicked:', e.target.name);
        if (e.target.name === 'Button' || e.target.name === 'CTA') {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Nav blur on scroll
const nav = document.getElementById('nav');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (nav) {
                nav.style.background = window.scrollY > 40 ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.6)';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for section items
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.methodology__step, .expertise__item, .engagement__item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});