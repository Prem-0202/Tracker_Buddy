// Fetch progress data from API
async function fetchProgressData() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/progress', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                const latestProgress = result.data[0];
                displayProgressData(latestProgress);
                updateProgressChart(latestProgress);
            }
        }
    } catch (error) {
        console.error('Error fetching progress data:', error);
    }
}

// Display progress data
function displayProgressData(data) {
    const progressDisplay = document.getElementById('progress-data');
    const { weight, bodyFat, muscleMass, measurements, notes } = data;
    
    progressDisplay.innerHTML = `
        <div class="progress-card">
            <div class="progress-value">${weight} kg</div>
            <div class="progress-label">Weight</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${bodyFat}%</div>
            <div class="progress-label">Body Fat</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${muscleMass} kg</div>
            <div class="progress-label">Muscle Mass</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${measurements.chest} cm</div>
            <div class="progress-label">Chest</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${measurements.waist} cm</div>
            <div class="progress-label">Waist</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${measurements.hips} cm</div>
            <div class="progress-label">Hips</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${measurements.arms} cm</div>
            <div class="progress-label">Arms</div>
        </div>
        <div class="progress-card">
            <div class="progress-value">${measurements.thighs} cm</div>
            <div class="progress-label">Thighs</div>
        </div>
        ${notes ? `<div style="grid-column: 1 / -1; background: var(--darker); padding: 1rem; border-radius: 8px; font-style: italic;">${notes}</div>` : ''}
    `;
}

// Fetch progress stats for chart
async function fetchProgressStats() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/progress/stats/progress', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                updateProgressChart(result.data);
            }
        }
    } catch (error) {
        console.error('Error fetching progress stats:', error);
    }
}

// Update progress chart with historical data
function updateProgressChart(statsData) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    const dates = statsData.map(item => new Date(item.date).toLocaleDateString());
    const weights = statsData.map(item => item.weight);
    const bodyFats = statsData.map(item => item.bodyFat);
    const muscleMasses = statsData.map(item => item.muscleMass);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: weights,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Body Fat (%)',
                    data: bodyFats,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Muscle Mass (kg)',
                    data: muscleMasses,
                    borderColor: '#06d6a0',
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    tension: 0.3
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

// Show/hide progress form
document.getElementById('add-progress-btn').addEventListener('click', function() {
    document.getElementById('progress-form').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('cancel-progress').addEventListener('click', function() {
    document.getElementById('progress-form').style.display = 'none';
    document.getElementById('add-progress-btn').style.display = 'block';
});

// Submit progress form
document.getElementById('progress-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const progressData = {
        weight: parseFloat(document.getElementById('weight').value),
        bodyFat: parseFloat(document.getElementById('body-fat').value),
        muscleMass: parseFloat(document.getElementById('muscle-mass').value),
        measurements: {
            chest: parseFloat(document.getElementById('chest').value),
            waist: parseFloat(document.getElementById('waist').value),
            hips: parseFloat(document.getElementById('hips').value),
            arms: parseFloat(document.getElementById('arms').value),
            thighs: parseFloat(document.getElementById('thighs').value)
        },
        notes: document.getElementById('progress-notes').value
    };
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(progressData)
        });
        
        if (response.ok) {
            alert('Progress saved successfully!');
            this.reset();
            this.style.display = 'none';
            document.getElementById('add-progress-btn').style.display = 'block';
            fetchProgressData();
        } else {
            alert('Failed to save progress');
        }
    } catch (error) {
        console.error('Error saving progress:', error);
        alert('Error saving progress');
    }
});

// Initialize reports page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    fetchProgressData();
    fetchProgressStats();
});