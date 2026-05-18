const express = require("express");
const path = require("path");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const spoonacularKey = process.env.SPOONACULAR_API_KEY;

const hasRealSupabase =
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("your_supabase") &&
    !supabaseKey.includes("your_supabase");

const supabase = hasRealSupabase ? createClient(supabaseUrl, supabaseKey) : null;

const memoryFavorites = [];

const sampleRecipes = [
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

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "home Final 1.html"));
});

app.get("/home", (request, response) => {
    response.sendFile(path.join(__dirname, "home Final 1.html"));
});

app.get("/about", (request, response) => {
    response.sendFile(path.join(__dirname, "about final.html"));
});

app.get("/help", (request, response) => {
    response.sendFile(path.join(__dirname, "help Final 2.html"));
});

app.get("/api/recipes", async (request, response) => {
    const query = request.query.query || "chicken";
    const diet = request.query.diet || "";

    if (!spoonacularKey || spoonacularKey.includes("your_spoonacular")) {
        return response.json({
            results: sampleRecipes,
            source: "sample-data"
        });
    }

    try {
        const params = new URLSearchParams({
            query,
            diet,
            number: "9",
            addRecipeInformation: "true",
            apiKey: spoonacularKey
        });

        const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return response.status(apiResponse.status).json({
                error: "External recipe API request failed.",
                details: data
            });
        }

        response.json(data);
    } catch (error) {
        response.status(500).json({
            error: "Server could not reach the recipe provider."
        });
    }
});

app.get("/api/favorites", async (request, response) => {
    if (!supabase) {
        return response.json(memoryFavorites);
    }

    const { data, error } = await supabase
        .from("favorites")
        .select("id,title,image,ready_time,servings,created_at")
        .order("created_at", { ascending: false });

    if (error) {
        return response.status(500).json({
            error: error.message
        });
    }

    response.json(data);
});

app.post("/api/favorites", async (request, response) => {
    const { title, image, readyInMinutes, servings } = request.body;

    if (!title) {
        return response.status(400).json({
            error: "Recipe title is required."
        });
    }

    const favorite = {
        title,
        image,
        ready_time: readyInMinutes,
        servings
    };

    if (!supabase) {
        const savedFavorite = {
            id: Date.now(),
            ...favorite,
            created_at: new Date().toISOString()
        };

        memoryFavorites.unshift(savedFavorite);
        return response.status(201).json(savedFavorite);
    }

    const { data, error } = await supabase
        .from("favorites")
        .insert([favorite])
        .select()
        .single();

    if (error) {
        return response.status(500).json({
            error: error.message
        });
    }

    response.status(201).json(data);
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Food Explorer server running on http://localhost:${PORT}`);
    });
}

module.exports = app;