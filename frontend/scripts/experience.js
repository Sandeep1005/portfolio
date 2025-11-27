function waitForLoad() {
    const div = document.getElementById("experience-container");
    if (div) {
        console.log("experience-container found — loading experience section");
        loadExperience();
    } else {
        setTimeout(waitForLoad, 100);
    }
}

waitForLoad(); // start checking



function loadExperience() {
    fetch("/data/experience.json")
        .then(response => response.json())
        .then(data => renderExperience(data))
        .catch(error => console.error("Error loading experience data:", error));
}



function renderExperience(experiences) {
    const container = document.getElementById("experience-container");

    Object.values(experiences).forEach(exp => {
        const card = document.createElement("div");
        card.className = "exp-card";

        card.innerHTML = `
            <img src="${exp.logo}" alt="${exp.name} Logo" class="exp-logo">

            <div class="exp-details">
                <div class="exp-company">
                    <a href="${exp.link}" target="_blank">${exp.name}</a>
                </div>

                <div class="exp-role">${exp.role}</div>

                <div class="exp-dates">${exp.start} — ${exp.end || "Present"}</div>
            </div>
        `;

        container.appendChild(card);
    });
}
