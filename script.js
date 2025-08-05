function getSceneFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('scene') || "1";
}

async function loadSceneData() {
    try {
        const response = await fetch('scenes.json');
        if (!response.ok) throw new Error("Fehler beim Laden der Datei.");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fehler:", error);
        return [];
    }
}

function displayScene(sceneObj) {
    const title = document.getElementById('scene-title');
    const content = document.getElementById('scene-content');
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');

    document.title = sceneObj.title + " | Verlorene Spuren";
    title.textContent = sceneObj.title;
    content.innerHTML = sceneObj.content;
    document.getElementById("picture").src = "img/scenes/scene" + sceneObj.scene + ".png";


    if (sceneObj["option 1"]) {
        option1.textContent = sceneObj["option 1"];
        option1.onclick = () => {
            window.location.search = `?scene=${sceneObj["option 1 scene"]}`;
        };

        if (sceneObj["option 2"]) {
            option2.textContent = sceneObj["option 2"];
            option2.onclick = () => {
                window.location.search = `?scene=${sceneObj["option 2 scene"]}`;
            };
        } else {
            option2.remove();

            if (sceneObj["option 1"] === "END") {
                const div = document.createElement("div");
                div.className = "text end";
                div.innerText = "Du hast erfolgreich das Ende der Geschichte erreicht! Du bist ein wahrer Held!";
                content.insertAdjacentElement('afterend', div);
                option1.textContent = "Abschließen";
                option1.onclick = () => {
                    window.location.href = `index.html`;
                };
            }
        }
    } else {
        option1.textContent = "Neustarten";
        option1.onclick = () => {
            window.location.href = `index.html`;
        };
        option2.remove();

        const div = document.createElement("div");
        div.className = "text end";
        div.innerText = "Hier endet die Geschichte! Entscheide dich nächstes mal schlauer.";
        content.insertAdjacentElement('afterend', div);
    }

}


window.addEventListener('DOMContentLoaded', async () => {
    const currentScene = getSceneFromURL();
    const scenes = await loadSceneData();
    const sceneObj = scenes.find(s => s.scene.toString() === currentScene);

    if (sceneObj) {
        displayScene(sceneObj);
    } else {
        document.title = "Fehler | Verlorene Spuren";
        document.getElementById('scene-title').textContent = "Fehler!";
        document.getElementById('scene-content').textContent = "Hoppla! Diese Szene wurde nicht gefunden.";
        document.getElementById("picture").src = "img/error.png";
        document.getElementById("option1").remove();
        document.getElementById("option2").remove();
    }
});