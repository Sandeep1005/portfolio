function waitForPlot() {
    const div = document.getElementById("vectorPlot");
    if (div) {
        runPlot();
    } else {
        setTimeout(waitForPlot, 100);
    }
}

waitForPlot();  // start checking

async function runPlot() {
    // Load JSON dynamically
    const response = await fetch("data/vectors.json");
    const vectorData = await response.json();

    // Convert JSON into Plotly traces
    const data = Object.values(vectorData).map(item => ({
        type: "scatter3d",
        mode: "lines+markers+text",
        showlegend: false,

        // line from origin to vector
        x: [0, item.vector.x],
        y: [0, item.vector.y],
        z: [0, item.vector.z],

        line: { width: 5 },
        marker: { size: 4 },

        // Text label appears near the endpoint
        text: [ "", item.tag ],      // show tag at endpoint only
        textposition: "top center",
        textfont: {
            size: 12,
            color: "#FFFFFF"
        },

        // Hover shows description
        hovertemplate: `<b>${item.tag}</b><br>${item.description}<extra></extra>`
    }));

    const layout = {
        showlegend: false,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",

        scene: {
            bgcolor: "rgba(0,0,0,0)",
            aspectmode: "cube",
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },

            xaxis: { visible: false, range: [-1, 1] },
            yaxis: { visible: false, range: [-1, 1] },
            zaxis: { visible: false, range: [-1, 1] }
        },

        margin: { l: 0, r: 0, b: 0, t: 0 }
    };

    // Render plot
    Plotly.newPlot("vectorPlot", data, layout, {
        displayModeBar: false
    });

    // Rotation animation
    let angle = 0;
    setInterval(() => {
        angle += 0.001;
        Plotly.relayout("vectorPlot", {
            "scene.camera.eye": {
                x: 1.5 * Math.cos(angle),
                y: 1.5 * Math.sin(angle),
                z: 1.2
            }
        });
    }, 50);
}
