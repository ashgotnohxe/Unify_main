/**
 * UNIFY - Persistent Event Registration System
 * This script manages "Register" buttons, saving status to localStorage
 * and ensuring buttons remain "Registered" even after a page refresh.
 */

window.UNIFY_REGISTRATION = {
    getSavedEvents: function() {
        // Fetch events specifically for the logged-in user, not globally
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) return [];
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const matchingUser = users.find(u => u.email === currentUser);
        
        return (matchingUser && matchingUser.events) ? matchingUser.events : [];
    },
    
    updateButtonState: function(button, eventName) {
        if (!eventName) return;
        
        const registeredList = this.getSavedEvents();
        
        if (registeredList.includes(eventName)) {
            button.textContent = "Registered";
            button.classList.add("registered");
            button.disabled = true;
            
            // Add visual styles directly to ensure immediate feedback
            button.style.opacity = "0.7";
            button.style.cursor = "not-allowed";
            button.style.pointerEvents = "none"; 
        } else {
            // Reset for dynamic modals
            button.textContent = "Register Now";
            button.classList.remove("registered");
            button.disabled = false;
            button.style.opacity = "1";
            button.style.cursor = "pointer";
            button.style.pointerEvents = "auto";
        }
    },
    showPopup: function(message) {
        // Create popup element dynamically so we don't need to change HTML
        const popup = document.createElement("div");
        popup.textContent = message;
        
        // Apply inline styles to avoid modifying CSS files
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        
        // Red for errors, Green for success
        const isError = message.includes("already") || message.includes("login");
        popup.style.backgroundColor = isError ? "#f44336" : "#4CAF50"; 
        
        popup.style.color = "white";
        popup.style.padding = "15px 25px";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        popup.style.zIndex = "10000";
        popup.style.fontFamily = "sans-serif";
        popup.style.fontSize = "16px";
        popup.style.fontWeight = "bold";
        popup.style.transition = "opacity 0.5s ease";
        
        document.body.appendChild(popup);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    },

    registerEvent: function(button, eventName) {
        // 1. Check if user is logged in
        const currentUserEmail = localStorage.getItem("currentUser");
        
        if (!currentUserEmail) {
            this.showPopup("Please login first to register!");
            return; 
        }

        if (!eventName) return;

        // 2. Get users array from localStorage
        let usersStr = localStorage.getItem("users");
        let users = usersStr ? JSON.parse(usersStr) : [];
        
        let matchingUser = null;
        let userIndex = -1;

        // 3. Find the current user using email
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === currentUserEmail) {
                matchingUser = users[i];
                userIndex = i;
                break;
            }
        }

        if (!matchingUser) return;

        // Ensure the events array exists for this user
        if (!matchingUser.events) {
            matchingUser.events = [];
        }

        // 4. Check ONLY inside that user's "events" array
        if (matchingUser.events.includes(eventName)) {
            this.showPopup("You have already registered for this event!");
        } else {
            // 5. Add event to THAT user's events array
            matchingUser.events.push(eventName);
            users[userIndex] = matchingUser;

            // 6. Save updated users array back to localStorage
            localStorage.setItem("users", JSON.stringify(users));

            // Update UI Button and show success popup
            this.updateButtonState(button, eventName);
            this.showPopup("You have successfully registered in the event");
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    // Initial Load for static buttons
    const registerButtons = document.querySelectorAll(".register-button");
    
    registerButtons.forEach(function (button) {
        const eventName = button.getAttribute("data-event");
        window.UNIFY_REGISTRATION.updateButtonState(button, eventName);
    });

    // Use event delegation to handle both static and dynamic/modal buttons
    document.body.addEventListener("click", function(e) {
        // Find closest element with register-button class
        const button = e.target.closest(".register-button");
        if (!button) return;
        
        if (button.tagName === 'A' && button.getAttribute('href') === '#') {
            e.preventDefault();
        }
        
        const currentEvent = button.getAttribute("data-event");
        window.UNIFY_REGISTRATION.registerEvent(button, currentEvent);
    });
});
