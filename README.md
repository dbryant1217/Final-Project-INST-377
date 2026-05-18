# Food Explorer

## Description

Food Explorer is a recipe search web application that helps users find meal ideas, view basic recipe details, compare recipe ready times, and save favorite recipes. The app is designed for users who want a simple way to search for recipes based on ingredients or diet preferences.

The project uses a front end built with HTML, CSS, and JavaScript. It also uses a Node.js and Express backend so the front end can access data through backend API routes. Recipe data comes from the Spoonacular API, and saved favorites are stored using Supabase.

## Target Browsers

Food Explorer is designed to work on current desktop browsers, including:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

The site is also designed to be responsive for mobile browsers, including:

- iOS Safari
- Android Chrome

## Link to Developer Manual

The Developer Manual is located here:

[Developer Manual](docs/Developer_Manual.md)

## Project Pages

This project includes three main pages:

1. Home Page
2. About Page
3. Help Page / Recipe Finder Page

The Help Page is the main functionality page because it allows users to search for recipes, filter results, view recipe cards, compare recipe ready times using a chart, and save favorite recipes.

## JavaScript Libraries Used

This project uses:

1. Chart.js  
   Used to display recipe ready times in a bar chart.

2. FetchAPI  
   Used to load data from the backend API routes.

## Backend API Routes

The backend includes three main API endpoints:

1. `GET /api/recipes`  
   Gets recipe data from the external Spoonacular API.

2. `GET /api/favorites`  
   Retrieves saved favorite recipes from Supabase.

3. `POST /api/favorites`  
   Saves a selected favorite recipe to Supabase.

## How to Run the Project

First, install Node.js. Then open the project folder in VS Code and run:

```bash
npm install