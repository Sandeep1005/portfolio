function initAskChat() {
    const chatContainer = document.getElementById("chat-container");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // If elements aren't there yet, wait and retry
    if (!chatContainer || !chatInput || !sendBtn) {
        setTimeout(initAskChat, 50);
        return;
    }

    // ---- Conversation history ----
    // Stores: { role: "user"|"ai", message: "..." }
    const history = [];

    function addMessage(text, type) {
        const msg = document.createElement("div");
        msg.classList.add("chat-message", type);

        if (type === "chat-bot") {
            msg.innerHTML = `<div class="markdown-content">${marked.parse(text)}</div>`;
        } else {
            msg.textContent = text;
        }

        chatContainer.appendChild(msg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendToBackend() {
        try {
            const payload = { conversation: history };

            const res = await fetch("https://yourbackend.com/ask", {   // <-- change URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                return "Sorry for the inconvenience, the AI agent is currently offline.";
            }

            const data = await res.json();
            return data.reply || "Sorry for the inconvenience, the AI agent is currently offline.";

        } catch (err) {
            return "Sorry for the inconvenience, the AI agent is currently offline.";
        }
    }

    sendBtn.addEventListener("click", async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message locally + to UI
        addMessage(text, "chat-user");
        history.push({ role: "user", message: text });
        chatInput.value = "";

        // Send full history to backend
        const reply = await sendToBackend();

        // Add reply to UI + store
        addMessage(reply, "chat-bot");
        history.push({ role: "ai", message: reply });
    });

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendBtn.click();
    });
}

initAskChat();
