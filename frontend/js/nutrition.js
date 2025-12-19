// Food nutrition database (per 100g)
const foodDatabase = {
    // Fruits
    'apple': { calories: 52, protein: 0.3, fat: 0.2 },
    'banana': { calories: 89, protein: 1.1, fat: 0.3 },
    'orange': { calories: 47, protein: 0.9, fat: 0.1 },
    'grapes': { calories: 62, protein: 0.6, fat: 0.2 },
    'strawberry': { calories: 32, protein: 0.7, fat: 0.3 },
    'mango': { calories: 60, protein: 0.8, fat: 0.4 },
    'pineapple': { calories: 50, protein: 0.5, fat: 0.1 },
    'watermelon': { calories: 30, protein: 0.6, fat: 0.2 },
    'avocado': { calories: 160, protein: 2.0, fat: 14.7 },
    
    // Vegetables
    'broccoli': { calories: 34, protein: 2.8, fat: 0.4 },
    'carrot': { calories: 41, protein: 0.9, fat: 0.2 },
    'spinach': { calories: 23, protein: 2.9, fat: 0.4 },
    'tomato': { calories: 18, protein: 0.9, fat: 0.2 },
    'potato': { calories: 77, protein: 2.0, fat: 0.1 },
    'onion': { calories: 40, protein: 1.1, fat: 0.1 },
    'cucumber': { calories: 16, protein: 0.7, fat: 0.1 },
    'lettuce': { calories: 15, protein: 1.4, fat: 0.2 },
    'bell pepper': { calories: 31, protein: 1.0, fat: 0.3 },
    
    // Grains & Cereals
    'rice': { calories: 130, protein: 2.7, fat: 0.3 },
    'bread': { calories: 265, protein: 9.0, fat: 3.2 },
    'pasta': { calories: 131, protein: 5.0, fat: 1.1 },
    'oats': { calories: 389, protein: 16.9, fat: 6.9 },
    'quinoa': { calories: 120, protein: 4.4, fat: 1.9 },
    'wheat': { calories: 327, protein: 13.2, fat: 2.5 },
    'corn': { calories: 86, protein: 3.3, fat: 1.4 },
    
    // Proteins
    'chicken': { calories: 165, protein: 31.0, fat: 3.6 },
    'pork': { calories: 242, protein: 27.3, fat: 13.9 },
    'fish': { calories: 206, protein: 22.0, fat: 12.0 },
    'salmon': { calories: 208, protein: 25.4, fat: 12.4 },
    'tuna': { calories: 144, protein: 30.0, fat: 1.0 },
    'egg': { calories: 155, protein: 13.0, fat: 11.0 },
    'tofu': { calories: 76, protein: 8.0, fat: 4.8 },
    
    // Dairy
    'milk': { calories: 42, protein: 3.4, fat: 1.0 },
    'cheese': { calories: 402, protein: 25.0, fat: 33.0 },
    'yogurt': { calories: 59, protein: 10.0, fat: 0.4 },
    'butter': { calories: 717, protein: 0.9, fat: 81.0 },
    
    // Nuts & Seeds
    'almonds': { calories: 579, protein: 21.2, fat: 49.9 },
    'peanuts': { calories: 567, protein: 25.8, fat: 49.2 },
    'walnuts': { calories: 654, protein: 15.2, fat: 65.2 },
    'cashews': { calories: 553, protein: 18.2, fat: 43.9 },
    
    // Others
    'chocolate': { calories: 546, protein: 4.9, fat: 31.3 },
    'sugar': { calories: 387, protein: 0.0, fat: 0.0 },
    'honey': { calories: 304, protein: 0.3, fat: 0.0 },
    'oil': { calories: 884, protein: 0.0, fat: 100.0 }
};

// Calorie Tracker - separate tracking for each meal
let mealData = {
    breakfast: JSON.parse(localStorage.getItem('breakfast')) || [],
    lunch: JSON.parse(localStorage.getItem('lunch')) || [],
    dinner: JSON.parse(localStorage.getItem('dinner')) || [],
    snacks: JSON.parse(localStorage.getItem('snacks')) || []
};
let totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;
let totalProtein = parseFloat(localStorage.getItem('totalProtein')) || 0;
let totalFat = parseFloat(localStorage.getItem('totalFat')) || 0;

// Function to calculate nutrition values
function calculateNutrition(foodName, quantity) {
    const normalizedName = foodName.toLowerCase().trim();
    let nutritionData = null;
    
    // Direct match
    if (foodDatabase[normalizedName]) {
        nutritionData = foodDatabase[normalizedName];
    } else {
        // Partial match
        for (let food in foodDatabase) {
            if (normalizedName.includes(food) || food.includes(normalizedName)) {
                nutritionData = foodDatabase[food];
                break;
            }
        }
    }
    
    if (nutritionData) {
        return {
            calories: Math.round((nutritionData.calories * quantity) / 100),
            protein: Math.round((nutritionData.protein * quantity) / 100 * 10) / 10,
            fat: Math.round((nutritionData.fat * quantity) / 100 * 10) / 10
        };
    }
    
    // Default if not found
    return {
        calories: Math.round(quantity * 2),
        protein: Math.round(quantity * 0.1 * 10) / 10,
        fat: Math.round(quantity * 0.05 * 10) / 10
    };
}

function updateCalorieDisplay() {
    // Update all meal tabs
    Object.keys(mealData).forEach(meal => {
        const calorieList = document.querySelector(`#${meal}-tab .calorie-list`);
        const calorieTotal = document.querySelector(`#${meal}-tab .calorie-total`);
        
        if (calorieList) {
            calorieList.innerHTML = '';
            let mealCalories = 0;
            let mealProtein = 0;
            let mealFat = 0;
            
            mealData[meal].forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.8rem; color: var(--gray);">${item.quantity}g • ${item.time}</div>
                        <div style="font-size: 0.75rem; color: var(--gray);">P: ${item.protein || 0}g • F: ${item.fat || 0}g</div>
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
                mealProtein += item.protein || 0;
                mealFat += item.fat || 0;
            });
            
            if (calorieTotal) {
                calorieTotal.innerHTML = `
                    <div>${meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
                    <div style="font-size: 0.9rem; margin-top: 0.25rem;">
                        ${mealCalories} cal • ${Math.round(mealProtein * 10) / 10}g protein • ${Math.round(mealFat * 10) / 10}g fat
                    </div>
                `;
            }
        }
        
        // Save to localStorage
        localStorage.setItem(meal, JSON.stringify(mealData[meal]));
    });
    
    // Calculate totals
    const allItems = Object.values(mealData).flat();
    totalCalories = allItems.reduce((sum, item) => sum + item.calories, 0);
    totalProtein = allItems.reduce((sum, item) => sum + (item.protein || 0), 0);
    totalFat = allItems.reduce((sum, item) => sum + (item.fat || 0), 0);
    
    // Update progress bars
    const calorieProgress = document.getElementById('calorie-progress');
    const calorieText = document.getElementById('calorie-text');
    const proteinProgress = document.getElementById('protein-progress');
    const proteinText = document.querySelector('#protein-progress').parentElement.nextElementSibling;
    
    if (calorieProgress && calorieText) {
        const progress = Math.min((totalCalories / 2000) * 100, 100);
        calorieProgress.style.width = `${progress}%`;
        calorieText.textContent = `${totalCalories} / 2000`;
    }
    
    if (proteinProgress && proteinText) {
        const progress = Math.min((totalProtein / 150) * 100, 100);
        proteinProgress.style.width = `${progress}%`;
        proteinText.textContent = `${Math.round(totalProtein * 10) / 10}g / 150g`;
    }
    
    // Update fat progress (add fat progress bar)
    const fatProgress = document.getElementById('fat-progress');
    const fatText = document.querySelector('#fat-progress')?.parentElement.nextElementSibling;
    if (fatProgress && fatText) {
        const progress = Math.min((totalFat / 65) * 100, 100);
        fatProgress.style.width = `${progress}%`;
        fatText.textContent = `${Math.round(totalFat * 10) / 10}g / 65g`;
    }
    
    localStorage.setItem('totalCalories', totalCalories);
    localStorage.setItem('totalProtein', totalProtein);
    localStorage.setItem('totalFat', totalFat);
}

// Handle form submissions for all meals
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('calorie-form')) {
        e.preventDefault();
        
        const meal = e.target.getAttribute('data-meal');
        const foodName = e.target.querySelector('.food-name').value;
        const quantity = parseInt(e.target.querySelector('.food-quantity').value);
        const nutrition = calculateNutrition(foodName, quantity);
        const now = new Date();
        const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const foodItem = { 
            name: foodName,
            quantity: quantity,
            calories: nutrition.calories,
            protein: nutrition.protein,
            fat: nutrition.fat,
            time: time
        };
        
        // Save to local API
        try {
            const userId = localStorage.getItem('userId') || 'user1';
            fetch('http://localhost:3000/api/nutrition', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userId}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...foodItem,
                    meal: meal,
                    date: new Date().toISOString().split('T')[0]
                })
            }).catch(err => console.log('API save failed, using localStorage'));
        } catch (error) {
            console.log('API not available, using localStorage');
        }
        
        mealData[meal].push(foodItem);
        
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

// Fetch nutrition data from local API
async function fetchNutritionData() {
    try {
        const userId = localStorage.getItem('userId') || 'user1';
        const today = new Date().toISOString().split('T')[0];
        
        const response = await fetch(`http://localhost:3000/api/nutrition?date=${today}`, {
            headers: {
                'Authorization': `Bearer ${userId}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                // Group by meal type
                const apiData = { breakfast: [], lunch: [], dinner: [], snacks: [] };
                result.data.forEach(item => {
                    if (apiData[item.meal]) {
                        apiData[item.meal].push(item);
                    }
                });
                
                // Replace local data with API data
                Object.keys(apiData).forEach(meal => {
                    mealData[meal] = apiData[meal];
                });
            }
        }
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
    }
}

// Initialize nutrition page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    await fetchNutritionData();
    updateCalorieDisplay();
});