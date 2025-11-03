// Dashboard functionality with API integration
async function fetchDashboardData() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/users/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        if (result.success) {
            updateDashboardStats(result.data);
        } else {
            // Fallback to localStorage
            updateDashboardStatsFromLocal();
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to localStorage
        updateDashboardStatsFromLocal();
    }
}

function updateDashboardStats(apiData) {
    if (apiData) {
        // Update from API data
        const { user, weeklyStats } = apiData;
        
        // Update user info in header
        if (user.name) {
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.fitnessGoals || 'Fitness Goal';
            document.getElementById('user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        
        // Update stats from API
        document.getElementById('dashboard-burned').textContent = weeklyStats.totalCaloriesBurned || 0;
        
        // Set daily calorie target
        const dailyTarget = user.dailyCalorieTarget || 2000;
        localStorage.setItem('dailyCalorieTarget', dailyTarget);
        
        // Update health score based on activity
        const workoutsCompleted = weeklyStats.workoutsCompleted || 0;
        const healthScore = Math.min(82 + (workoutsCompleted * 2), 100);
        document.getElementById('health-score').textContent = healthScore;
        
        // Get other stats from localStorage (nutrition, hydration)
        const totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;
        const waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
        
        document.getElementById('dashboard-calories').textContent = totalCalories;
        document.getElementById('dashboard-water').textContent = `${waterCount}/8`;
        
        // Update calorie target display
        const calorieChange = document.querySelector('#dashboard .stat-change');
        if (calorieChange) {
            calorieChange.textContent = `Target: ${dailyTarget.toLocaleString()}`;
        }
    } else {
        updateDashboardStatsFromLocal();
    }
}

function updateDashboardStatsFromLocal() {
    // Fallback: Get data from localStorage
    const totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;
    const totalBurned = parseInt(localStorage.getItem('totalBurned')) || 0;
    const waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    const healthScore = parseInt(localStorage.getItem('healthScore')) || 82;

    // Update dashboard display
    document.getElementById('dashboard-calories').textContent = totalCalories;
    document.getElementById('dashboard-burned').textContent = totalBurned;
    document.getElementById('dashboard-water').textContent = `${waterCount}/8`;
    document.getElementById('health-score').textContent = healthScore;
}

// Initialize dashboard chart
function initDashboardChart() {
    const ctx = document.getElementById('health-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Calories Consumed',
                    data: [1800, 1950, 2100, 1900, 2200, 1700, 2000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Calories Burned',
                    data: [350, 420, 380, 450, 500, 300, 400],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Simple auth check
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = 'signin.html';
        return false;
    }
    return true;
}

// Load user profile for header
async function loadUserProfile() {
    try {
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    fetchDashboardData();
    initDashboardChart();
    
    setInterval(fetchDashboardData, 30000);
});