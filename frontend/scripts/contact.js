function waitForContact() {
    const div = document.getElementById("contact-form");
    if (div) {
        addEventListenerForContactForm();
    } else {
        setTimeout(waitForContact, 100);
    }
}

function addEventListenerForContactForm() {
    document.getElementById("contact-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const status = document.getElementById("form-status");
        const submitBtn = document.querySelector("#contact-form button[type='submit']");

        if (!name || !email || !message) {
            status.style.color = "red";
            status.textContent = "Please fill in all fields.";
            return;
        }

        // Disable button to prevent multiple clicks
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
        submitBtn.textContent = "Sending...";

        const data = { name, email, message };

        let result;
        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            result = await response.json();

            if (response.ok) {
                status.style.color = "green";
                status.textContent = "Message sent! I will get back to you soon.";
                document.getElementById("contact-form").reset();
            } else {
                status.style.color = "red";
                status.textContent = result.error || "Something went wrong. Please try again.";
            }

        } catch (err) {
            status.style.color = "red";
            status.textContent = "Network error. Please try again later.";
        }

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.textContent = "Send Message";
    });
}

document.addEventListener("DOMContentLoaded", waitForContact);
