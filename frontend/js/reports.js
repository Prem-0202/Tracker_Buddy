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

// Generate report functionality
async function generateReport() {
    const reportPeriod = document.getElementById('report-period').value;
    const reportType = document.getElementById('report-type').value;
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please log in to generate reports');
            return;
        }
        
        let apiEndpoint = '';
        let reportData = null;
        
        // Determine API endpoint based on report type
        switch (reportType) {
            case 'fitness':
                apiEndpoint = 'https://fitness-tracker-1-tt21.onrender.com/api/workouts';
                break;
            case 'nutrition':
                apiEndpoint = 'https://fitness-tracker-1-tt21.onrender.com/api/nutrition';
                break;
            case 'hydration':
                apiEndpoint = 'https://fitness-tracker-1-tt21.onrender.com/api/hydration';
                break;
            case 'summary':
            default:
                // For summary, we'll fetch all data types
                await generateSummaryReport(reportPeriod);
                return;
        }
        
        // Fetch data from API
        const response = await fetch(apiEndpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                reportData = result.data;
                displayReport(reportType, reportData, reportPeriod);
            } else {
                alert('No data available for the selected report type');
            }
        } else {
            alert('Failed to fetch report data');
        }
        
    } catch (error) {
        console.error('Error generating report:', error);
        alert('Error generating report. Please try again.');
    }
}

// Generate summary report with all data types
async function generateSummaryReport(period) {
    const token = localStorage.getItem('authToken');
    const endpoints = [
        { type: 'fitness', url: 'https://fitness-tracker-1-tt21.onrender.com/api/workouts' },
        { type: 'nutrition', url: 'https://fitness-tracker-1-tt21.onrender.com/api/nutrition' },
        { type: 'hydration', url: 'https://fitness-tracker-1-tt21.onrender.com/api/hydration' },
        { type: 'progress', url: 'https://fitness-tracker-1-tt21.onrender.com/api/progress' }
    ];
    
    const summaryData = {};
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint.url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    summaryData[endpoint.type] = result.data;
                }
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint.type} data:`, error);
        }
    }
    
    displaySummaryReport(summaryData, period);
}

// Display generated report
function displayReport(type, data, period) {
    const reportContainer = document.createElement('div');
    reportContainer.className = 'card';
    reportContainer.style.marginTop = '1rem';
    
    let reportContent = '';
    const periodText = getPeriodText(period);
    
    switch (type) {
        case 'fitness':
            reportContent = generateFitnessReport(data, periodText);
            break;
        case 'nutrition':
            reportContent = generateNutritionReport(data, periodText);
            break;
        case 'hydration':
            reportContent = generateHydrationReport(data, periodText);
            break;
    }
    
    reportContainer.innerHTML = `
        <div class="card-header">
            <div class="card-title">${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${periodText}</div>
            <div class="card-actions">
                <button class="btn" onclick="printReport()"><i class="fas fa-print"></i> Print</button>
                <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()"><i class="fas fa-times"></i> Close</button>
            </div>
        </div>
        <div class="card-body">
            ${reportContent}
        </div>
    `;
    
    // Insert report after the generate report card
    const generateCard = document.querySelector('.card');
    generateCard.parentNode.insertBefore(reportContainer, generateCard.nextSibling);
}

// Display summary report
function displaySummaryReport(data, period) {
    const reportContainer = document.createElement('div');
    reportContainer.className = 'card';
    reportContainer.style.marginTop = '1rem';
    
    const periodText = getPeriodText(period);
    let summaryContent = `<h3>Health Summary - ${periodText}</h3>`;
    
    // Fitness summary
    if (data.fitness && data.fitness.length > 0) {
        const totalWorkouts = data.fitness.length;
        const totalCalories = data.fitness.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
        const avgDuration = data.fitness.reduce((sum, workout) => sum + (workout.duration || 0), 0) / totalWorkouts;
        
        summaryContent += `
            <div class="report-section">
                <h4><i class="fas fa-running"></i> Fitness Summary</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${totalWorkouts}</span>
                        <span class="stat-label">Total Workouts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${totalCalories}</span>
                        <span class="stat-label">Calories Burned</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${Math.round(avgDuration)}</span>
                        <span class="stat-label">Avg Duration (min)</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Progress summary
    if (data.progress && data.progress.length > 0) {
        const latest = data.progress[0];
        summaryContent += `
            <div class="report-section">
                <h4><i class="fas fa-chart-line"></i> Progress Summary</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${latest.weight} kg</span>
                        <span class="stat-label">Current Weight</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${latest.bodyFat}%</span>
                        <span class="stat-label">Body Fat</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${latest.muscleMass} kg</span>
                        <span class="stat-label">Muscle Mass</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    reportContainer.innerHTML = `
        <div class="card-header">
            <div class="card-title">Health Summary Report - ${periodText}</div>
            <div class="card-actions">
                <button class="btn" onclick="printReport()"><i class="fas fa-print"></i> Print</button>
                <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()"><i class="fas fa-times"></i> Close</button>
            </div>
        </div>
        <div class="card-body">
            ${summaryContent}
        </div>
    `;
    
    // Insert report after the generate report card
    const generateCard = document.querySelector('.card');
    generateCard.parentNode.insertBefore(reportContainer, generateCard.nextSibling);
}

// Generate fitness report content
function generateFitnessReport(data, period) {
    if (!data || data.length === 0) {
        return '<p>No fitness data available for the selected period.</p>';
    }
    
    const totalWorkouts = data.length;
    const totalCalories = data.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
    const totalDuration = data.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const avgDuration = totalDuration / totalWorkouts;
    
    // Group by workout type
    const workoutTypes = {};
    data.forEach(workout => {
        const type = workout.type || 'Other';
        if (!workoutTypes[type]) {
            workoutTypes[type] = { count: 0, calories: 0, duration: 0 };
        }
        workoutTypes[type].count++;
        workoutTypes[type].calories += workout.caloriesBurned || 0;
        workoutTypes[type].duration += workout.duration || 0;
    });
    
    let content = `
        <div class="report-section">
            <h4>Fitness Overview</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${totalWorkouts}</span>
                    <span class="stat-label">Total Workouts</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${totalCalories}</span>
                    <span class="stat-label">Calories Burned</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.round(avgDuration)}</span>
                    <span class="stat-label">Avg Duration (min)</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.round(totalDuration / 60)}</span>
                    <span class="stat-label">Total Hours</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Workout Types Breakdown</h4>
            <div class="workout-types">
    `;
    
    Object.entries(workoutTypes).forEach(([type, stats]) => {
        content += `
            <div class="workout-type-item">
                <strong>${type}</strong>: ${stats.count} workouts, ${stats.calories} calories, ${Math.round(stats.duration)} minutes
            </div>
        `;
    });
    
    content += '</div></div>';
    
    return content;
}

// Generate nutrition report content
function generateNutritionReport(data, period) {
    if (!data || data.length === 0) {
        return '<p>No nutrition data available for the selected period.</p>';
    }
    
    const totalEntries = data.length;
    const totalCalories = data.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const avgCalories = totalCalories / totalEntries;
    
    return `
        <div class="report-section">
            <h4>Nutrition Overview</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${totalEntries}</span>
                    <span class="stat-label">Total Entries</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${totalCalories}</span>
                    <span class="stat-label">Total Calories</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.round(avgCalories)}</span>
                    <span class="stat-label">Avg Daily Calories</span>
                </div>
            </div>
        </div>
    `;
}

// Generate hydration report content
function generateHydrationReport(data, period) {
    if (!data || data.length === 0) {
        return '<p>No hydration data available for the selected period.</p>';
    }
    
    const totalEntries = data.length;
    const totalWater = data.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const avgWater = totalWater / totalEntries;
    
    return `
        <div class="report-section">
            <h4>Hydration Overview</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${totalEntries}</span>
                    <span class="stat-label">Total Entries</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${totalWater}ml</span>
                    <span class="stat-label">Total Water</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.round(avgWater)}ml</span>
                    <span class="stat-label">Avg Daily Water</span>
                </div>
            </div>
        </div>
    `;
}

// Helper function to get period text
function getPeriodText(period) {
    switch (period) {
        case 'week': return 'Last 7 Days';
        case 'month': return 'Last 30 Days';
        case 'quarter': return 'Last 3 Months';
        default: return 'Selected Period';
    }
}

// Print report function
function printReport() {
    window.print();
}

// Initialize reports page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    fetchProgressData();
    fetchProgressStats();
    
    // Add event listener to generate report button
    const generateReportBtn = document.querySelector('.btn[style*="align-self: flex-end"]');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
});