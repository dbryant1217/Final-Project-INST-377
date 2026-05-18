# Developer Manual

## Project Overview

Food Explorer is a recipe search web application created for the INST377 final project. The app allows users to search for recipes, filter results, compare recipe ready times, and save favorite recipes.

The system uses a Node.js and Express backend. The front end communicates with the backend using FetchAPI. The backend connects to the Spoonacular API for recipe data and Supabase for saved favorite recipes.

## Intended Audience

This document is for future developers who may take over or continue working on this project. The reader is expected to understand general web development terms, but may not know how this specific project is organized.

## Project Structure

```text
INST377 FINAL GROUP PROJECT
│
├── home Final 1.html
├── about final.html
├── help Final 2.html
├── style Final.css
├── script Final 1.js
├── server.js
├── package.json
├── package-lock.json
├── vercel.json
├── README.md
├── .env
└── docs
    └── Developer_Manual.md