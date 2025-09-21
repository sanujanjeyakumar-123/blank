// Recipes page functionality

let sriLankanRecipes = [];
let recipesGrid, searchInput, categoryFilter, modal, modalClose, modalBody;

// Load recipes from JSON file
async function loadRecipes() {
    try {
        const response = await fetch('data/recipes.json');
        sriLankanRecipes = await response.json();
        renderRecipes(sriLankanRecipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        // Fallback to inline data if JSON fails
        initializeWithFallbackData();
    }
}

// Fallback recipe data
function initializeWithFallbackData() {
    sriLankanRecipes = [
        {
        "id": 1,
        "title": "Rice and Curry",
        "description": "Traditional Sri Lankan rice served with multiple curries including dhal, vegetables, and meat or fish curry.",
        "category": "lunch",
        "image": "images/rice-and-curry.png",
        "ingredients": [
            "2 cups basmati rice",
            "1 cup red lentils (masoor dhal)",
            "500g chicken or fish",
            "2 cups mixed vegetables (beans, carrots, potatoes)",
            "2 onions, sliced",
            "4 cloves garlic, minced",
            "1 inch ginger, minced",
            "2 tbsp curry powder",
            "1 can coconut milk",
            "2 tbsp coconut oil",
            "Salt to taste",
            "Curry leaves",
            "Pandan leaves"
        ],
        "steps": [
            "Cook rice with pandan leaves until fluffy",
            "Prepare dhal curry by boiling lentils with turmeric",
            "Make chicken/fish curry with coconut milk and spices",
            "Prepare vegetable curry with seasonal vegetables",
            "Temper with curry leaves and serve hot",
            "Arrange rice in center with curries around"
        ],
        "nutrition": {
            "protein": "25g",
            "carbs": "65g",
            "fat": "15g",
            "fiber": "8g"
        }
    },
    {
        "id": 2,
        "title": "Hoppers (Appa)",
        "description": "Bowl-shaped pancakes made from fermented rice flour and coconut milk, perfect for breakfast.",
        "category": "breakfast",
        "image": "images/hoppers.png",
        "ingredients": [
            "2 cups rice flour",
            "1 cup coconut milk",
            "1 tsp active dry yeast",
            "1 tsp sugar",
            "1/2 tsp salt",
            "Warm water as needed",
            "Eggs (optional)",
            "Coconut oil for cooking"
        ],
        "steps": [
            "Mix yeast with sugar and warm water, let foam",
            "Combine rice flour, coconut milk, and salt",
            "Add yeast mixture and mix to smooth batter",
            "Let ferment overnight at room temperature",
            "Heat hopper pan and add oil",
            "Pour batter and swirl to form bowl shape",
            "Cover and cook until edges are crispy",
            "Add egg in center if desired"
        ],
        "nutrition": {
            "protein": "8g",
            "carbs": "45g",
            "fat": "12g",
            "fiber": "3g"
        }
    },
    {
        "id": 3,
        "title": "Kottu Roti",
        "description": "Stir-fried chopped roti bread with vegetables, egg, and meat, seasoned with curry spices.",
        "category": "dinner",
        "image": "images/kottu-roti.png",
        "ingredients": [
            "4 roti breads, chopped",
            "2 eggs, beaten",
            "200g chicken or beef, diced",
            "1 large onion, sliced",
            "2 carrots, julienned",
            "1 leek, sliced",
            "3 cloves garlic, minced",
            "2 green chilies, sliced",
            "2 tbsp soy sauce",
            "1 tbsp curry powder",
            "Salt and pepper to taste",
            "Oil for cooking"
        ],
        "steps": [
            "Heat oil in large pan or wok",
            "Cook meat until browned, set aside",
            "Scramble eggs and set aside",
            "Stir-fry onions until golden",
            "Add vegetables and cook until tender",
            "Add chopped roti and mix well",
            "Season with curry powder and soy sauce",
            "Add back meat and eggs, toss everything together",
            "Serve hot with curry sauce"
        ],
        "nutrition": {
            "protein": "22g",
            "carbs": "55g",
            "fat": "18g",
            "fiber": "6g"
        }
    },
    {
        "id": 4,
        "title": "Fish Ambul Thiyal",
        "description": "Sour fish curry from Southern Sri Lanka, cooked with goraka (garcinia) for a tangy flavor.",
        "category": "lunch",
        "image": "images/fish-ambul-thiyal.png",
        "ingredients": [
            "500g tuna or mackerel, cubed",
            "10-12 pieces goraka (dried garcinia)",
            "2 tbsp curry powder",
            "1 tsp turmeric powder",
            "1 tsp chili powder",
            "1 sprig curry leaves",
            "2 cloves garlic, minced",
            "1 inch ginger, minced",
            "1 onion, sliced",
            "2 tbsp coconut oil",
            "Salt to taste"
        ],
        "steps": [
            "Soak goraka in warm water for 30 minutes",
            "Marinate fish with turmeric and salt",
            "Heat oil and fry fish lightly, set aside",
            "In same pan, sauté onions until golden",
            "Add garlic, ginger, and curry leaves",
            "Add curry powder and chili powder",
            "Add goraka water and bring to boil",
            "Add fish back and simmer until thick",
            "Serve with rice"
        ],
        "nutrition": {
            "protein": "35g",
            "carbs": "8g",
            "fat": "12g",
            "fiber": "2g"
        }
    },
    {
        "id": 5,
        "title": "Pol Sambol",
        "description": "Fresh coconut relish mixed with chili, onions, and lime juice - a staple accompaniment.",
        "category": "snack",
        "image": "images/pol-sambol.png",
        "ingredients": [
            "1 fresh coconut, grated",
            "2-3 red chilies",
            "1 small onion, finely chopped",
            "2 tbsp lime juice",
            "1 tsp salt",
            "1 tsp Maldive fish flakes (optional)"
        ],
        "steps": [
            "Grate fresh coconut finely",
            "Grind red chilies with salt",
            "Mix coconut with ground chili paste",
            "Add chopped onions",
            "Add lime juice and mix well",
            "Add Maldive fish if using",
            "Adjust seasoning to taste",
            "Serve fresh with rice and curry"
        ],
        "nutrition": {
            "protein": "4g",
            "carbs": "8g",
            "fat": "15g",
            "fiber": "5g"
        }
    },
    {
        "id": 6,
        "title": "Wattalappam",
        "description": "Traditional Sri Lankan steamed dessert made with coconut milk, jaggery, and spices.",
        "category": "dessert",
        "image": "images/wattalappam.png",
        "ingredients": [
            "6 eggs",
            "1 cup coconut milk",
            "1 cup jaggery or brown sugar",
            "1/4 tsp cardamom powder",
            "1/4 tsp nutmeg powder",
            "Pinch of salt",
            "Cashew nuts for garnish"
        ],
        "steps": [
            "Melt jaggery with little water to make syrup",
            "Beat eggs lightly, don't create foam",
            "Mix coconut milk with egg mixture",
            "Add jaggery syrup when cooled",
            "Add cardamom, nutmeg, and salt",
            "Strain mixture to remove lumps",
            "Pour into greased mold",
            "Steam for 45 minutes until set",
            "Cool completely before unmolding",
            "Garnish with cashew nuts"
        ],
        "nutrition": {
            "protein": "8g",
            "carbs": "35g",
            "fat": "15g",
            "fiber": "1g"
        }
    }
    ];
    renderRecipes(sriLankanRecipes);
}

function renderRecipes(recipes) {
    if (!recipesGrid) return;
    
    recipesGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" data-recipe-id="${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-category">${recipe.category}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners to recipe cards
    recipesGrid.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = parseInt(card.dataset.recipeId);
            showRecipeModal(recipeId);
        });
    });
}

function filterRecipes() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';

    const filteredRecipes = sriLankanRecipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) ||
                            recipe.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    renderRecipes(filteredRecipes);
}

function showRecipeModal(recipeId) {
    const recipe = sriLankanRecipes.find(r => r.id === recipeId);
    if (!recipe || !modal || !modalBody) return;

    modalBody.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="modal-recipe-image">
        <h2 class="modal-recipe-title">${recipe.title}</h2>
        <p>${recipe.description}</p>
        
        <div class="ingredients-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        
        <div class="steps-section">
            <h3>Instructions</h3>
            <ol class="steps-list">
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
}

// Recipes page functionality
function initializeRecipesPage() {
    recipesGrid = document.getElementById('recipes-grid');
    searchInput = document.getElementById('recipe-search');
    categoryFilter = document.getElementById('category-filter');
    modal = document.getElementById('recipe-modal');
    modalClose = document.getElementById('modal-close');
    modalBody = document.getElementById('modal-body');

    if (!recipesGrid) return;

    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterRecipes);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterRecipes);
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            // Restore background scrolling
            document.body.style.overflow = '';
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Restore background scrolling
                document.body.style.overflow = '';
                modal.style.display = 'none';
            }
        });
    }

    // Load recipes
    loadRecipes();
}

// Initialize recipes page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRecipesPage);