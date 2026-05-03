// Wait for the HTML document to fully load before running our script
document.addEventListener("DOMContentLoaded", () => {
    
    // FAIL-SAFE: Check if GSAP loaded successfully from the CDN
    if (typeof gsap === 'undefined') {
        console.warn("GSAP library not found! Custom cursor is disabled, falling back to default cursor.");
        return; // Exit the script gracefully so the default cursor remains visible
    }

    // =========================================
    // 1. SETUP: Create the cursor elements
    // =========================================
    
    // Create the main cursor div
    const mainCursor = document.createElement("div");
    mainCursor.classList.add("custom-cursor");
    
    // Create the smaller trailing effect div
    const trailingCursor = document.createElement("div");
    trailingCursor.classList.add("custom-cursor-trail");
    
    // Add both elements to the webpage's body
    document.body.appendChild(mainCursor);
    document.body.appendChild(trailingCursor);
    
    // SUCCESS: Now that we know JS and GSAP work, we can safely hide the default cursor!
    document.body.classList.add("custom-cursor-active");
    
    // =========================================
    // 2. GSAP ANIMATION SETUP
    // =========================================
    
    // gsap.quickTo is highly optimized for things that update frequently like mouse movement
    const xToMain = gsap.quickTo(mainCursor, "x", {duration: 0.15, ease: "power3"});
    const yToMain = gsap.quickTo(mainCursor, "y", {duration: 0.15, ease: "power3"});
    
    const xToTrail = gsap.quickTo(trailingCursor, "x", {duration: 0.4, ease: "power3"});
    const yToTrail = gsap.quickTo(trailingCursor, "y", {duration: 0.4, ease: "power3"});
    
    // =========================================
    // 3. EVENTS: Listen for mouse movement
    // =========================================
    
    // Initialize cursors at center before first move
    gsap.set([mainCursor, trailingCursor], { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener("mousemove", (e) => {
        // Send mouse coordinates directly to GSAP quick setters
        xToMain(e.clientX);
        yToMain(e.clientY);
        xToTrail(e.clientX);
        yToTrail(e.clientY);
    });
    
    // =========================================
    // 4. INTERACTIONS: Hover and Click Effects using GSAP
    // =========================================
    
    let isHovering = false;

    // Use Event Delegation to handle dynamic elements efficiently without MutationObserver
    const interactiveSelector = "a, button, .card, .event-card, .register-button, .filter-tab, .back-link, .scribble-wrapper, .profile-card, .feedback-card, .accordion-header, .accordion, .accordion-item-list li, input, textarea, [onclick]";

    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest(interactiveSelector);
        
        // Ensure we only trigger if moving from outside the interactive element
        if (target && !target.contains(e.relatedTarget)) {
            isHovering = true;
            gsap.to(mainCursor, {
                scale: 1.8,
                backgroundColor: "rgba(156, 219, 201, 0.6)", // Soft mint hover color
                duration: 0.35, 
                ease: "power2.out",
                overwrite: "auto" 
            });
        }
    });

    document.addEventListener("mouseout", (e) => {
        const target = e.target.closest(interactiveSelector);
        
        // Only trigger if we are actually leaving the element entirely (not just moving to a child)
        if (target && !target.contains(e.relatedTarget)) {
            isHovering = false;
            gsap.to(mainCursor, {
                scale: 1, 
                backgroundColor: "rgba(155, 150, 199, 0.6)", // Pastel lavender original color
                duration: 0.35, 
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });

    // Global click effect: when mouse button is pressed down
    document.addEventListener("mousedown", () => {
        gsap.to(mainCursor, {
            scale: 0.6,
            backgroundColor: "rgba(237, 186, 161, 0.8)", // Blush peach
            duration: 0.1,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
    
    // When mouse button is released
    document.addEventListener("mouseup", () => {
        gsap.to(mainCursor, {
            scale: isHovering ? 1.8 : 1, // Return to either hover scale or base scale
            backgroundColor: isHovering ? "rgba(156, 219, 201, 0.6)" : "rgba(155, 150, 199, 0.6)",
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
});
