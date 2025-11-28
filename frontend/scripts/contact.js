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
        
        
        if (!name || !email || !message) {
        status.style.color = "red";
        status.textContent = "Please fill in all fields.";
        return;
        }
        
    
        // Calling upon backend
        var data = {
            "name": name,
            "email": email,
            "message": message
        }
    
        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    
        const result = await response.json();
        console.log(result);
    
        
        status.style.color = "green";
        status.textContent = "Message sent! I will get back to you soon.";
        
        document.getElementById("contact-form").reset();
    });
}


document.addEventListener("DOMContentLoaded", waitForContact);
