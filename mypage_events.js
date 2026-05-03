document.addEventListener("DOMContentLoaded", function () {
    // 1. Get current logged-in user email
    const currentUserEmail = localStorage.getItem("currentUser");

    // --- SECURITY CHECK ---
    // If no user is logged in, block access and redirect
    if (!currentUserEmail) {
        alert("Please login first to view My Space!");
        document.body.style.display = "none"; // Hide content immediately
        window.location.href = "login.html";  // Redirect to login page
        return; // Stop the rest of the script from running
    }

    // 2. Safely parse the users array from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 3. Find the matching user profile using array.find()
    const matchingUser = users.find(user => user.email === currentUserEmail);

    // 4. Display the user's details dynamically
    const emailDisplay = document.getElementById("user-email");
    const nameDisplay = document.getElementById("user-name");
    const courseDisplay = document.getElementById("user-course");
    const rollDisplay = document.getElementById("user-roll");

    if (matchingUser) {
        if (emailDisplay && matchingUser.email) emailDisplay.textContent = matchingUser.email;
        if (nameDisplay && matchingUser.name) nameDisplay.textContent = matchingUser.name;
        if (courseDisplay && matchingUser.course) courseDisplay.textContent = matchingUser.course;
        if (rollDisplay && matchingUser.roll) rollDisplay.textContent = matchingUser.roll;
    }

    // 5. Update the registered events list dynamically
    const eventList = document.getElementById("event-list");
    
    if (eventList) {
        eventList.innerHTML = ""; // Clear any placeholders

        if (matchingUser && matchingUser.events && matchingUser.events.length > 0) {
            // Loop through events and create list items
            matchingUser.events.forEach(eventName => {
                const li = document.createElement("li");
                li.textContent = eventName;
                eventList.appendChild(li);
            });
        } else {
            // Fallback message if the user has no registered events
            const li = document.createElement("li");
            li.textContent = "No registered events yet";
            eventList.appendChild(li);
        }
    }
});
