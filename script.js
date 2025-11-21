// Load color palette and apply selected theme
function applyTheme() {
    toggleButton = document.getElementById("theme-toggle")
    currTheme = toggleButton.textContent
    if (currTheme == "light") {
        themeName = "dark"
        toggleButton.textContent = "dark"
    }
    else{
        themeName = "light"
        toggleButton.textContent = "light"
    }
    fetch("palette.json")
        .then(res => res.json())
        .then(palette => {
            const theme = palette[themeName];
            if (!theme) return;

            // Apply CSS variables
            document.documentElement.style.setProperty("--primary", theme.primary);
            document.documentElement.style.setProperty("--secondary", theme.secondary);
            document.documentElement.style.setProperty("--text", theme.text);
            document.documentElement.style.setProperty("--textLighter", theme.textLighter);
            document.documentElement.style.setProperty("--textLightest", theme.textLightest);
            document.documentElement.style.setProperty("--background", theme.background);
            document.documentElement.style.setProperty("--shadow", theme.shadow);
        })
        .catch(err => console.error("Failed to load palette:", err));
}

// Load all components sequentially for a scrollable single-page layout
const sections = ["intro", "work", "experience", "ask", "contact"];

function loadAllSections() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    sections.forEach(section => {
        fetch(`components/${section}.html`)
            .then(response => response.text())
            .then(html => {
                const wrapper = document.createElement("div");
                wrapper.innerHTML = html;
                content.appendChild(wrapper);
            })
            .catch(error => console.error(`Error loading ${section}:`, error));
    });
}

// Initialize page
window.addEventListener("DOMContentLoaded", () => {
    applyTheme(); // Load default theme
    loadAllSections();
});

// Smooth scroll navigation
const links = document.querySelectorAll("nav a[data-section]");

links.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const targetId = link.getAttribute("data-section");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    });
});
