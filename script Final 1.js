const API_BASE = window.location.origin;
let recipeChart = null;

const fallbackRecipes = [
    {
        id: 1,
        title: "Chicken Rice Bowl",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        readyInMinutes: 35,
        servings: 4
    },
    {
        id: 2,
        title: "Vegetarian Pasta",
        image: "https://spoonacular.com/recipeImages/654959-312x231.jpg",
        readyInMinutes: 25,
        servings: 3
    },
    {
        id: 3,
        title: "Fresh Garden Salad",
        image: "https://spoonacular.com/recipeImages/642539-312x231.jpg",
        readyInMinutes: 15,
        servings: 2
    }
];

function getRecipeImage(recipe) {
    return recipe.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80";
}

function recipeCardTemplate(recipe, showSaveButton = true) {
    const readyTime = recipe.readyInMinutes || recipe.ready_time || "Not listed";
    const servings = recipe.servings || "Not listed";
    const safeRecipe = encodeURIComponent(JSON.stringify(recipe));

    return `
        <article class="card">
            <img src="${getRecipeImage(recipe)}" alt="${recipe.title}">
            <div class="card-content">
                <h3>${recipe.title}</h3>
                <p><strong>Ready time:</strong> ${readyTime} minutes</p>
                <p><strong>Servings:</strong> ${servings}</p>
                ${showSaveButton ? `<button type="button" class="save-recipe-button" data-recipe="${safeRecipe}">Save Favorite</button>` : ""}
            </div>
        </article>
    `;
}

async function fetchRecipes(query = "chicken", diet = "") {
    const params = new URLSearchParams({ query, diet });
    const response = await fetch(`${API_BASE}/api/recipes?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Recipe request failed.");
    }

    const data = await response.json();
    return data.results && data.results.length ? data.results : fallbackRecipes;
}

async function displayRecipes(recipes) {
    const container = document.getElementById("recipe-list");

    if (!container) {
        return;
    }

    container.innerHTML = recipes.map((recipe) => recipeCardTemplate(recipe)).join("");

    document.querySelectorAll(".save-recipe-button").forEach((button) => {
        button.addEventListener("click", () => {
            const recipe = JSON.parse(decodeURIComponent(button.dataset.recipe));
            saveFavorite(recipe);
        });
    });

    updateRecipeChart(recipes);
}

async function loadFavorites() {
    const preview = document.getElementById("favorites-preview");

    if (!preview) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/favorites`);

        if (!response.ok) {
            throw new Error("Favorites request failed.");
        }

        const favorites = await response.json();

        if (!favorites.length) {
            preview.innerHTML = "<p>No favorites saved yet.</p>";
            return;
        }

        preview.innerHTML = favorites.slice(0, 4).map((recipe) => recipeCardTemplate(recipe, false)).join("");
    } catch (error) {
        preview.innerHTML = "<p>Favorites could not load yet.</p>";
    }
}

async function saveFavorite(recipe) {
    try {
        const response = await fetch(`${API_BASE}/api/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: recipe.title,
                image: getRecipeImage(recipe),
                readyInMinutes: recipe.readyInMinutes || recipe.ready_time || null,
                servings: recipe.servings || null
            })
        });

        if (!response.ok) {
            throw new Error("Save request failed.");
        }

        alert("Recipe saved to favorites.");
        loadFavorites();
    } catch (error) {
        alert("Recipe could not be saved. Check the backend and Supabase setup.");
    }
}

function updateRecipeChart(recipes) {
    const chartCanvas = document.getElementById("recipe-chart");

    if (!chartCanvas || typeof Chart === "undefined") {
        return;
    }

    const labels = recipes.slice(0, 6).map((recipe) => {
        return recipe.title.length > 18 ? `${recipe.title.slice(0, 18)}...` : recipe.title;
    });

    const readyTimes = recipes.slice(0, 6).map((recipe) => {
        return Number(recipe.readyInMinutes || recipe.ready_time || 0);
    });

    if (recipeChart) {
        recipeChart.destroy();
    }

    recipeChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Ready Time in Minutes",
                data: readyTimes
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setupRecipeSearch() {
    const form = document.getElementById("recipe-search-form");
    const statusMessage = document.getElementById("status-message");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = document.getElementById("recipe-query").value.trim() || "chicken";
        const diet = document.getElementById("diet-filter").value;

        try {
            statusMessage.textContent = "Loading recipes...";
            const recipes = await fetchRecipes(query, diet);
            await displayRecipes(recipes);
            statusMessage.textContent = `Showing results for ${query}.`;
        } catch (error) {
            await displayRecipes(fallbackRecipes);
            statusMessage.textContent = "The live API did not load, so sample recipes are showing for now.";
        }
    });

    form.dispatchEvent(new Event("submit"));
}

document.addEventListener("DOMContentLoaded", () => {
    setupRecipeSearch();
    loadFavorites();
});