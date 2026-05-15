const recipeUrl = "https://api.spoonacular.com/recipes/complexSearch?query=chicken&apiKey=eae1934120374920ab863dfb3d4fef46";

async function getRecipes() {
    try {
        const response = await fetch(recipeUrl);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }

function displayRecipes(recipes) {
    const container = document.getElementById('recipe-list');
    
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="card">
                <img src="${recipe.image}" alt="${recipe.title}" width="150">
                <p>${recipe.title}</p>
            </div>
        `;
        container.innerHTML += recipeCard;
    });
}
}
getRecipes();