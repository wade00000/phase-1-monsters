document.addEventListener("DOMContentLoaded", () => {
    const monsterContainer = document.querySelector("#monster-container");
    const form = document.querySelector("#create-monster form");
    const nameInput = document.querySelector("#name");
    const ageInput = document.querySelector("#age");
    const descInput = document.querySelector("#description");
    const backBtn = document.querySelector("#back");
    const forwardBtn = document.querySelector("#forward");

    let currentPage = 1;

    // Load first page
    loadPage(currentPage);

    // Pagination: Back
    backBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
        }
    });

    // Pagination: Forward
    forwardBtn.addEventListener("click", () => {
        currentPage++;
        loadPage(currentPage, true); // checkEmpty = true
    });

    // Form submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const monsterObj = {
            name: nameInput.value.trim(),
            age: parseInt(ageInput.value, 10),
            description: descInput.value.trim()
        };

        storeMonster(monsterObj);
        form.reset();
    });

    // Load monsters for a given page
    function loadPage(page, checkEmpty = false) {
        monsterContainer.innerHTML = "";
        fetch(`http://localhost:3000/monsters/?_sort=id&_page=${page}&_limit=10`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0 && checkEmpty) {
                    // No monsters on this page → go back
                    currentPage--;
                    return;
                }
                data.forEach(renderMonster);
            })
            .catch(console.error);
    }

    // Render a single monster
    function renderMonster(monster) {
        console.log(monster.id);
        const div = document.createElement("div");
        const h3 = document.createElement("h3");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");

        h3.textContent = `Name: ${monster.name}`;
        p2.textContent = `Age: ${monster.age}`;
        p1.textContent = `Description: ${monster.description}`;

        div.append(h3, p2, p1);
        monsterContainer.append(div);
    }

    // Store new monster on the server
    function storeMonster(monster) {
        fetch("http://localhost:3000/monsters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(monster)
        })
        .then(res => res.json())
        .then(() => loadPage(currentPage)) // Refresh current page
        .catch(console.error);
    }
});
