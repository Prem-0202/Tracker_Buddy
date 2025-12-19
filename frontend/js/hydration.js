// Water Tracker
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
const waterGoal = 8;
let hydrationData = [];

// Fetch hydration data from API
async function fetchHydrationData() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://fitness-tracker-1-tt21.onrender.com/api/hydration/gethydra?date=${today}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                const todayData = result.data[0];
                waterCount = todayData.glasses || 0;
                hydrationData = result.data;
            }
        }
    } catch (error) {
        console.error('Error fetching hydration data:', error);
    }
}

// Save hydration data to API
async function saveHydrationData(glasses) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/hydration/addhydra', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                glasses: glasses,
                amount: glasses * 250
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save hydration data');
        }
    } catch (error) {
        console.error('Error saving hydration data:', error);
    }
}

function updateWaterDisplay() {
    const progress = (waterCount / waterGoal) * 100;
    document.getElementById('water-progress').style.width = `${progress}%`;
    document.getElementById('water-count').textContent = `Glasses: ${waterCount}/${waterGoal}`;
    
    // Update water glasses visualization
    document.querySelectorAll('.water-glass').forEach((glass, index) => {
        if (index < waterCount) {
            glass.classList.add('filled');
        } else {
            glass.classList.remove('filled');
        }
    });
    
    // Update localStorage
    localStorage.setItem('waterCount', waterCount);
}

document.getElementById('add-glass').addEventListener('click', async function() {
    if (waterCount < waterGoal) {
        waterCount++;
        updateWaterDisplay();
        await saveHydrationData(waterCount);
    }
});

document.getElementById('reset-water').addEventListener('click', async function() {
    waterCount = 0;
    updateWaterDisplay();
    await saveHydrationData(waterCount);
});

// Click on water glasses
document.querySelectorAll('.water-glass').forEach(glass => {
    glass.addEventListener('click', async function() {
        const glassNum = parseInt(this.getAttribute('data-glass'));
        waterCount = glassNum;
        updateWaterDisplay();
        await saveHydrationData(waterCount);
    });
});

// Initialize hydration chart
function initHydrationChart() {
    const ctx = document.getElementById('hydration-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Water Intake (glasses)',
                data: [6, 8, 7, 8, 6, 7, 8],
                borderColor: '#06d6a0',
                backgroundColor: 'rgba(6, 214, 160, 0.1)',
                tension: 0.4,
                fill: true
            }]
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

// Initialize hydration page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    await fetchHydrationData();
    updateWaterDisplay();
    initHydrationChart();
});