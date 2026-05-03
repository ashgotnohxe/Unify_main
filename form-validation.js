/**
 * UNIFY - Form Validation
 * 
 * This script provides beginner-friendly validation for all forms
 * across the UNIFY website.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Prevent browser's default HTML5 validation so our custom JS alerts can run
    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => form.setAttribute('novalidate', 'true'));

    // Helper function to create/show a floating toast notification (bypasses browser alert blocking)
    function showToast(message, isError = false) {
        const toast = document.createElement("div");
        toast.textContent = message;
        
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = isError ? "#f44336" : "#4CAF50"; // Red or Green
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
        }, 3000);
    }

    // Helper function to create/show inline error message
    function showError(input, message) {
        // Find the parent group to append the error message
        const formGroup = input.parentElement;
        
        // Check if error already exists
        let errorMsg = formGroup.querySelector('.error-message');
        
        // If it doesn't exist, create it
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#FF6B6B'; // Red color
            errorMsg.style.fontSize = '0.9rem';
            errorMsg.style.marginTop = '5px';
            formGroup.appendChild(errorMsg);
        }
        
        // Set the message text and highlight input
        errorMsg.innerText = message;
        input.classList.add('input-error');
        input.style.borderColor = '#FF6B6B';
    }

    // Helper function to remove error message
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorMsg = formGroup.querySelector('.error-message');
        
        if (errorMsg) {
            errorMsg.remove();
        }
        
        input.classList.remove('input-error');
        // Reset border color to original
        input.style.borderColor = ''; 
    }

    // Helper function to validate email format using RegEx
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- 1. Login Form Validation ---
    const loginForm = document.querySelector(".scribble-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            let isValid = true;
            
            // Get inputs
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');

            // Validate Email
            const emailValue = emailInput.value.trim();
            if (emailValue === "") {
                showError(emailInput, "Email is required");
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError(emailInput, "Email must be in correct format");
                isValid = false;
            } else {
                clearError(emailInput);
            }

            // Validate Password
            const passwordValue = passwordInput.value.trim();
            if (passwordValue === "") {
                showError(passwordInput, "Password is required");
                isValid = false;
            } else if (passwordValue.length < 6) {
                showError(passwordInput, "Password must be at least 6 characters");
                isValid = false;
            } else {
                clearError(passwordInput);
            }

            // Prevent submission if invalid
            if (!isValid) {
                e.preventDefault();
            } else {
                // Prevent default form submission so we can handle login in JS
                e.preventDefault();
                
                // Safely retrieve and parse the users array from localStorage
                let usersStr = localStorage.getItem("users");
                let users = usersStr ? JSON.parse(usersStr) : [];

                // Loop through the users to find a match for both email and password
                let matchFound = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === emailValue && users[i].password === passwordValue) {
                        matchFound = true;
                        break;
                    }
                }

                // Handle the result
                if (matchFound) {
                    // Store the logged-in user's email in localStorage
                    localStorage.setItem("currentUser", emailValue);
                    showToast("Login successful!");
                    
                    // Optional: Redirect to My Space page on success
                    setTimeout(() => {
                        window.location.href = "my_page.html";
                    }, 1000);
                } else {
                    // Show an error alert if no match was found
                    showToast("Invalid email or password", true);
                }
            }
        });

        // Add real-time removal of errors when user types
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => clearError(input));
        });
    }

    // --- 2. Signup Form Validation ---
    const signupForm = document.querySelector(".paper-card form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            let isValid = true;

            const nameInput = signupForm.querySelector('#name');
            const emailInput = signupForm.querySelector('#email');
            const passwordInput = signupForm.querySelector('#password');
            const confirmPasswordInput = signupForm.querySelector('#confirm_password');

            // Validate Name
            if (nameInput) {
                if (nameInput.value.trim() === "") {
                    showError(nameInput, "Name must not be empty");
                    isValid = false;
                } else {
                    clearError(nameInput);
                }
            }

            // Validate Email
            if (emailInput) {
                const emailValue = emailInput.value.trim();
                if (emailValue === "") {
                    showError(emailInput, "Email is required");
                    isValid = false;
                } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
                    e.preventDefault(); // Stop form submission
                    showToast("Please enter a valid email address", true);
                    return; // Stop execution
                } else {
                    clearError(emailInput);
                }
            }

            // Validate Password
            if (passwordInput) {
                const passwordValue = passwordInput.value.trim();
                if (passwordValue === "") {
                    showError(passwordInput, "Password is required");
                    isValid = false;
                } else if (passwordValue.length < 6) {
                    showError(passwordInput, "Password must be at least 6 characters");
                    isValid = false;
                } else {
                    clearError(passwordInput);
                }
            }

            // Validate Confirm Password
            if (confirmPasswordInput && passwordInput) {
                if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
                    showError(confirmPasswordInput, "Confirm password must match password");
                    isValid = false;
                } else if (confirmPasswordInput.value.trim() === "") {
                    showError(confirmPasswordInput, "Please confirm your password");
                    isValid = false;
                } else {
                    clearError(confirmPasswordInput);
                }
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                e.preventDefault(); // Prevent form submission/page reload
                
                const emailValue = emailInput.value.trim();
                const passwordValue = passwordInput.value.trim();
                
                // Get additional user info
                const nameValue = nameInput ? nameInput.value.trim() : "";
                const courseInput = signupForm.querySelector('#course');
                const courseValue = courseInput ? courseInput.value.trim() : "";
                const rollInput = signupForm.querySelector('#roll');
                const rollValue = rollInput ? rollInput.value.trim() : "";

                // 3. Get existing users from localStorage
                let usersStr = localStorage.getItem("users");
                let users = usersStr ? JSON.parse(usersStr) : [];

                // 5. Check if email already exists
                let userExists = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === emailValue) {
                        userExists = true;
                        break;
                    }
                }

                if (userExists) {
                    showToast("User already exists", true);
                    return; // Stop execution
                }

                // 4. Create new user object including the new fields
                let newUser = {
                    name: nameValue,
                    roll: rollValue,
                    course: courseValue,
                    email: emailValue,
                    password: passwordValue,
                    events: []
                };

                // Add new user to the array
                users.push(newUser);

                // --- Step 6: Save and Redirect ---
                // Save the new user data into the browser's localStorage
                localStorage.setItem("users", JSON.stringify(users));
                
                // Show a success message to the user
                showToast("Registration successful! Redirecting to login...");

                // Wait for 1.5 seconds (which is 1500 milliseconds)
                setTimeout(function() {
                    // Redirect the user to the login page
                    window.location.href = "login.html";
                }, 1500);
            }
        });

        // Real-time clear
        const inputs = signupForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => clearError(input));
        });
    }

    // --- 3. Contact Form Validation ---
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        // Remove the inline onclick alert first to prevent it from bypassing validation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.removeAttribute('onclick');
        }

        contactForm.addEventListener("submit", function (e) {
            let isValid = true;

            // We use 'to' input as subject based on HTML structure
            const subjectInput = contactForm.querySelector('#to'); 
            const messageInput = contactForm.querySelector('#message');

            if (subjectInput) {
                if (subjectInput.value.trim() === "") {
                    showError(subjectInput, "Subject/To field must not be empty");
                    isValid = false;
                } else {
                    clearError(subjectInput);
                }
            }

            if (messageInput) {
                if (messageInput.value.trim().length < 10) {
                    showError(messageInput, "Message must be at least 10 characters long");
                    isValid = false;
                } else {
                    clearError(messageInput);
                }
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                // Manually trigger the success message since we removed the onclick
                alert('Message sent via Airmail! ✈️');
                console.log("Contact form is valid! Submitting...");
            }
        });

        // Real-time clear
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => clearError(input));
        });
    }

    // --- 4. Feedback Form Validation ---
    // Target the feedback form using its class name
    const feedbackForm = document.querySelector(".feedback-form");
    
    // Only run this code if the feedback form exists on the current page
    if (feedbackForm) {
        // Listen for the "submit" event when the user clicks the submit button
        feedbackForm.addEventListener("submit", function (event) {
            // STEP 1: Prevent the form from refreshing or redirecting the page
            // This stops the "405 Method Not Allowed" error!
            event.preventDefault();

            let isValid = true; // We assume the form is valid until we find an error

            // Get the input fields from the form
            const nameInput = feedbackForm.querySelector('#name');
            const emailInput = feedbackForm.querySelector('#feedback_email'); 
            const feedbackInput = feedbackForm.querySelector('#feedback');

            // STEP 2: Validate Name
            if (nameInput) {
                // Check if the name is empty after removing extra spaces
                if (nameInput.value.trim() === "") {
                    showError(nameInput, "Name must not be empty");
                    isValid = false; // Mark form as invalid
                } else {
                    clearError(nameInput); // Remove any previous error message
                }
            }

            // STEP 3: Validate Email
            if (emailInput) {
                const emailValue = emailInput.value.trim();
                if (emailValue === "") {
                    showError(emailInput, "Email is required");
                    isValid = false;
                } else if (!isValidEmail(emailValue)) {
                    showError(emailInput, "Email must be valid format");
                    isValid = false;
                } else {
                    clearError(emailInput);
                }
            }

            // STEP 4: Validate Feedback Message
            if (feedbackInput) {
                // Ensure the feedback is at least 10 characters long
                if (feedbackInput.value.trim().length < 10) {
                    showError(feedbackInput, "Feedback message must be at least 10 characters");
                    isValid = false;
                } else {
                    clearError(feedbackInput);
                }
            }

            // STEP 5: Success Action
            // If isValid is still true, it means there were no validation errors
            if (isValid) {
                // Show a success message to the user
                showToast("Thank you for your feedback!");
                
                // Clear all the fields in the form
                feedbackForm.reset();
            }
        });

        // Real-time clear: Remove error messages immediately when the user starts typing
        const inputs = feedbackForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => clearError(input));
        });
    }
});
