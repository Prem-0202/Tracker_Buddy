// Food calorie database (calories per 100g)
const foodDatabase = {
    // Fruits
    'apple': 52, 'banana': 89, 'orange': 47, 'grapes': 62, 'strawberry': 32,
    'mango': 60, 'pineapple': 50, 'watermelon': 30, 'avocado': 160,
    
    // Vegetables
    'broccoli': 34, 'carrot': 41, 'spinach': 23, 'tomato': 18, 'potato': 77,
    'onion': 40, 'cucumber': 16, 'lettuce': 15, 'bell pepper': 31,
    
    // Grains & Cereals
    'rice': 130, 'bread': 265, 'pasta': 131, 'oats': 389, 'quinoa': 120,
    'wheat': 327, 'corn': 86,
    
    // Proteins
    'chicken': 165, 'beef': 250, 'pork': 242, 'fish': 206, 'salmon': 208,
    'tuna': 144, 'egg': 155, 'tofu': 76,
    
    // Dairy
    'milk': 42, 'cheese': 402, 'yogurt': 59, 'butter': 717,
    
    // Nuts & Seeds
    'almonds': 579, 'peanuts': 567, 'walnuts': 654, 'cashews': 553,
    
    // Others
    'chocolate': 546, 'sugar': 387, 'honey': 304, 'oil': 884
};

// Calorie Tracker - separate tracking for each meal
let mealData = {
    breakfast: JSON.parse(localStorage.getItem('breakfast')) || [],
    lunch: JSON.parse(localStorage.getItem('lunch')) || [],
    dinner: JSON.parse(localStorage.getItem('dinner')) || [],
    snacks: JSON.parse(localStorage.getItem('snacks')) || []
};
let totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;

// Function to calculate calories
function calculateCalories(foodName, quantity) {
    const normalizedName = foodName.toLowerCase().trim();
    
    // Direct match
    if (foodDatabase[normalizedName]) {
        return Math.round((foodDatabase[normalizedName] * quantity) / 100);
    }
    
    // Partial match
    for (let food in foodDatabase) {
        if (normalizedName.includes(food) || food.includes(normalizedName)) {
            return Math.round((foodDatabase[food] * quantity) / 100);
        }
    }
    
    // Default if not found
    return Math.round(quantity * 2); // Rough estimate: 2 calories per gram
}

function updateCalorieDisplay() {
    // Update all meal tabs
    Object.keys(mealData).forEach(meal => {
        const calorieList = document.querySelector(`#${meal}-tab .calorie-list`);
        const calorieTotal = document.querySelector(`#${meal}-tab .calorie-total`);
        
        if (calorieList) {
            calorieList.innerHTML = '';
            let mealCalories = 0;
            
            mealData[meal].forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.8rem; color: var(--gray);">${item.quantity}g • ${item.time}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 600;">${item.calories} cal</span>
                        <button class="list-btn delete delete-calorie" data-meal="${meal}" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                calorieList.appendChild(li);
                mealCalories += item.calories;
            });
            
            if (calorieTotal) {
                calorieTotal.textContent = `${meal.charAt(0).toUpperCase() + meal.slice(1)} Calories: ${mealCalories}`;
            }
        }
        
        // Save to localStorage
        localStorage.setItem(meal, JSON.stringify(mealData[meal]));
    });
    
    // Calculate total calories
    totalCalories = Object.values(mealData).flat().reduce((sum, item) => sum + item.calories, 0);
    
    // Update progress
    const calorieProgress = document.getElementById('calorie-progress');
    const calorieText = document.getElementById('calorie-text');
    if (calorieProgress && calorieText) {
        const progress = Math.min((totalCalories / 2000) * 100, 100);
        calorieProgress.style.width = `${progress}%`;
        calorieText.textContent = `${totalCalories} / 2000`;
    }
    
    localStorage.setItem('totalCalories', totalCalories);
}

// Handle form submissions for all meals
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('calorie-form')) {
        e.preventDefault();
        
        const meal = e.target.getAttribute('data-meal');
        const foodName = e.target.querySelector('.food-name').value;
        const quantity = parseInt(e.target.querySelector('.food-quantity').value);
        const calculatedCalories = calculateCalories(foodName, quantity);
        const now = new Date();
        const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        mealData[meal].push({ 
            name: foodName,
            quantity: quantity,
            calories: calculatedCalories,
            time: time
        });
        
        updateCalorieDisplay();
        
        // Reset form
        e.target.reset();
        e.target.querySelector('.food-quantity').value = '100';
    }
});

// Delete calorie items
document.addEventListener('click', function(e) {
    if (e.target.closest('.delete-calorie')) {
        const btn = e.target.closest('.delete-calorie');
        const meal = btn.getAttribute('data-meal');
        const index = parseInt(btn.getAttribute('data-index'));
        
        mealData[meal].splice(index, 1);
        updateCalorieDisplay();
    }
});

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Initialize nutrition page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    updateCalorieDisplay();
});