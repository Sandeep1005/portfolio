// Load color palette + theme
function applyTheme() {
    const toggleButton = document.getElementById("theme-toggle");
    const currTheme = toggleButton.textContent;
    const themeName = currTheme === "light" ? "dark" : "light";
    toggleButton.textContent = themeName;

    fetch("palette.json")
        .then(res => res.json())
        .then(palette => {
            const theme = palette[themeName];
            if (!theme) return;

            Object.entries(theme).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--${key}`, value);
            });
        });
}

const sections = ["intro", "work", "experience", "ask", "contact"];

async function loadAllSections() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    for (const section of sections) {
        try {
            const res = await fetch(`components/${section}.html`);
            const html = await res.text();
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            content.appendChild(wrapper);
        } catch (err) {
            console.error("Error loading component:", section, err);
        }
    }
}

function attachNavigation() {
    const links = document.querySelectorAll("nav a[data-section]");
    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const id = link.getAttribute("data-section");
            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

async function init() {
    applyTheme();
    await loadAllSections();
    attachNavigation();
}

window.addEventListener("DOMContentLoaded", init);
