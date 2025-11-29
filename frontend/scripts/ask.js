function initAskChat() {
    const chatContainer = document.getElementById("chat-container");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // If elements aren't there yet, wait and retry
    if (!chatContainer || !chatInput || !sendBtn) {
        setTimeout(initAskChat, 50);
        return;
    }

    // Dummy bot reply function
    function botReply(userText) {
        return "You said: " + userText;
    }

    function addMessage(text, type) {
        const msg = document.createElement("div");
        msg.classList.add("chat-message", type);

        if (type === "chat-bot") {
            // Render markdown
            msg.innerHTML = `<div class="markdown-content">${marked.parse(text)}</div>`;
        } else {
            // Normal user message
            msg.textContent = text;
        }
        
        chatContainer.appendChild(msg);

        // Always scroll to latest
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendBtn.addEventListener("click", () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, "chat-user");
        chatInput.value = "";

        setTimeout(() => {
            addMessage(botReply(text), "chat-bot");
        }, 500);
    });

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendBtn.click();
    });
}

// Start polling for the elements
initAskChat();
