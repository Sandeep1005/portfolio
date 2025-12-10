// Tracks readiness of other JS files
window.scriptStatus = {};
window.sectionReady = function(section) {
    window.scriptStatus[section] = true;
};

// Helper: wait until all expected scripts complete
function waitForScripts(expectedSections) {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            const allReady = expectedSections.every(s => window.scriptStatus[s]);
            if (allReady) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 50);
    });
}

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

// ---------------- LOADER ---------------- //

function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 500);  // after fade out
}

// ------------- LOAD SECTIONS ------------ //

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

// -------------- NAVIGATION -------------- //

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

// ------------------ INIT ---------------- //

async function init() {
    showLoader();

    applyTheme();
    await loadAllSections();

    // Wait for other JS files to finish initialization
    await waitForScripts(["intro", "ask", "experience", "contact"]);
    
    attachNavigation();

    hideLoader();   // <- hide only after everything is ready
}

window.addEventListener("DOMContentLoaded", init);
