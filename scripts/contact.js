document.getElementById("contact-form").addEventListener("submit", function(e) {
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
    
    
    status.style.color = "green";
    status.textContent = "Message sent! I will get back to you soon.";
    
    
    document.getElementById("contact-form").reset();
});