/**
 * UNIFY - Global Animations & Smooth Scrolling
 * 
 * Powered by GSAP & Lenis
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Lenis Smooth Scrolling Setup
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 2. Page Load Animations
    // ==========================================
    
    // Animate Header
    if (document.querySelector('.events-header') || document.querySelector('.header')) {
        gsap.from(".events-header, .header", {
            y: -30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    }

    // Animate Title
    if (document.querySelector('.scribble-title')) {
        gsap.from(".scribble-title", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    }

    // Animate Cards Stagger (Homepage, Events, Clubs, etc.)
    const cards = gsap.utils.toArray('.card, .event-card, .scribble-wrapper, .detail-card');
    if (cards.length > 0) {
        gsap.from(cards, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all" // Clears inline styles after animation so hover transforms work properly
        });
    }

    // ==========================================
    // 3. Background Doodles Animation
    // ==========================================
    const doodles = gsap.utils.toArray('.doodle, .background-doodles svg');
    if (doodles.length > 0) {
        doodles.forEach((doodle, i) => {
            // Randomize duration and delay for organic feel
            const randomDuration = 3 + Math.random() * 3;
            const randomDelay = Math.random() * 2;
            
            gsap.to(doodle, {
                y: "-=15", // Float up 15px
                rotation: () => Math.random() > 0.5 ? "+=5" : "-=5", // Slight random rotation
                duration: randomDuration,
                delay: randomDelay,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        });
    }

    // ==========================================
    // 4. Hover Animations (Cards)
    // ==========================================
    cards.forEach(card => {
        // Prevent GSAP from overwriting the initial state by reading current scale
        card.addEventListener("mouseenter", () => {
            gsap.to(card, {
                scale: 1.05,
                y: -10,
                rotation: () => Math.random() > 0.5 ? 1 : -1, // slight tilt
                duration: 0.4,
                ease: "power2.out",
                zIndex: 10
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                scale: 1,
                y: 0,
                rotation: 0, // Reset rotation
                duration: 0.4,
                ease: "power2.out",
                zIndex: 1
            });
        });
    });

    // ==========================================
    // 5. Hover Animations (Buttons & Links)
    // ==========================================
    const buttons = gsap.utils.toArray('.filter-tab, .register-btn, .submit-btn, .back-link, .back-arrow');
    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: "power1.out"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out"
            });
        });
    });

});
