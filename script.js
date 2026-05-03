/**
 * UNIFY - Global Animations & Smooth Scrolling
 * 
 * Powered by GSAP & Lenis
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. Dynamic Greeting System
    // ==========================================
    let greetingElement = document.getElementById("greeting");
    
    // Check if we are currently on the homepage (index.html)
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    // Create it dynamically ONLY on the homepage if it doesn't exist
    if (!greetingElement && isHomePage) {
        const header = document.querySelector('.header') || document.querySelector('.events-header') || document.querySelector('.card-header');
        if (header) {
            greetingElement = document.createElement("p");
            greetingElement.id = "greeting";
            greetingElement.style.fontFamily = "'Patrick Hand', cursive";
            greetingElement.style.fontSize = "1.5rem";
            greetingElement.style.textAlign = "center";
            greetingElement.style.marginTop = "10px";
            greetingElement.style.color = "#2e2e2e";
            header.appendChild(greetingElement);
        }
    }
    
    if (greetingElement) {
        // Safely check if "currentUser" exists in localStorage
        const currentUserEmail = localStorage.getItem("currentUser");
        
        // Display appropriate greeting based on login status
        if (currentUserEmail) {
            // Look up the user's name from the database
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const matchedUser = users.find(user => user.email === currentUserEmail);
            
            // Use their actual name if available, otherwise fallback to their email
            const displayName = (matchedUser && matchedUser.name) ? matchedUser.name : currentUserEmail;
            
            greetingElement.textContent = "Hi " + displayName;
        } else {
            greetingElement.textContent = "Hi Guest";
        }
    }

    // ==========================================
    // 0.1 Global Toast Helper (Bypasses Alert Blocker)
    // ==========================================
    function showGlobalToast(message, isError = false) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = isError ? "#f44336" : "#4CAF50"; 
        toast.style.color = "white";
        toast.style.padding = "15px 25px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        toast.style.zIndex = "10000";
        toast.style.fontFamily = "sans-serif";
        toast.style.fontSize = "16px";
        toast.style.fontWeight = "bold";
        toast.style.transition = "opacity 0.5s ease";
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // ==========================================
    // 0.2 My Space Link Protector
    // ==========================================
    const mySpaceCard = document.querySelector('.card-myspace');
    if (mySpaceCard) {
        // Remove the inline onclick so we can control it safely
        mySpaceCard.removeAttribute('onclick');
        
        mySpaceCard.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = localStorage.getItem("currentUser");
            
            if (!currentUser) {
                // Instantly block and show beautiful error on the CURRENT page
                showGlobalToast("Please login first to view My Space!", true);
                // Optionally redirect them to login after they see the message
                setTimeout(() => window.location.href = "login.html", 1500);
            } else {
                // Authorized! Safe to navigate
                window.location.href = "my_page.html";
            }
        });
    }

    // ==========================================
    // 0.5 Dynamic Logout System
    // ==========================================
    let logoutBtn = document.getElementById("logout-btn");

    // Dynamically create the logout button if it doesn't exist (avoids modifying HTML)
    if (!logoutBtn) {
        const nav = document.querySelector('.footer-nav') || document.body;
        if (nav) {
            logoutBtn = document.createElement("a");
            logoutBtn.id = "logout-btn";
            logoutBtn.href = "#";
            logoutBtn.textContent = "Logout";
            logoutBtn.style.cursor = "pointer";
            
            // If it's placed in the body fallback, give it some decent positioning
            if (nav === document.body) {
                logoutBtn.style.position = "absolute";
                logoutBtn.style.top = "20px";
                logoutBtn.style.right = "20px";
                logoutBtn.style.fontFamily = "'Patrick Hand', cursive";
                logoutBtn.style.fontSize = "1.5rem";
                logoutBtn.style.color = "#f44336"; // Red to indicate action
                logoutBtn.style.textDecoration = "none";
                logoutBtn.style.zIndex = "100";
            }
            
            nav.appendChild(logoutBtn);
        }
    }

    if (logoutBtn) {
        const currentUser = localStorage.getItem("currentUser");
        
        if (!currentUser) {
            logoutBtn.style.display = "none";
        } else {
            logoutBtn.style.display = "inline-block"; 
        }
        
        // Handle Logout Click
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault(); 
            
            localStorage.removeItem("currentUser");
            showGlobalToast("Logged out successfully");
            
            // Wait for the user to read the message, then reload
            setTimeout(() => window.location.reload(), 1500);
        });
    }

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
