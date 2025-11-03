// Workout Tracker with API integration
let workoutItems = [];
let totalBurned = 0;

// Fetch workouts from API
async function fetchWorkouts() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/workouts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        if (result.success && result.data) {
            workoutItems = result.data;
            updateWorkoutDisplay();
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
        workoutItems = JSON.parse(localStorage.getItem('workoutItems')) || [];
        updateWorkoutDisplay();
    }
}

function updateWorkoutDisplay() {
    const workoutList = document.getElementById('workout-list');
    workoutList.innerHTML = '';
    
    totalBurned = 0;
    
    workoutItems.forEach((item, index) => {
        const li = document.createElement('li');
        const calories = item.caloriesBurned || item.calories || 0;
        totalBurned += calories;
        
        // Format date
        const date = item.date ? new Date(item.date).toLocaleDateString() : item.time || 'Today';
        
        // Create exercises summary
        let exercisesSummary = '';
        if (item.exercises && item.exercises.length > 0) {
            exercisesSummary = item.exercises.map(ex => `${ex.name} (${ex.sets}x${ex.reps})`).join(', ');
        }
        
        li.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: 600;">${item.name || item.exercise || 'Workout'}</div>
                <div style="font-size: 0.8rem; color: var(--gray);">
                    ${item.type || 'workout'} • ${item.duration} min • ${item.intensity || 'moderate'} • ${date}
                </div>
                ${exercisesSummary ? `<div style="font-size: 0.75rem; color: var(--gray); margin-top: 0.25rem;">${exercisesSummary}</div>` : ''}
                ${item.notes ? `<div style="font-size: 0.75rem; color: var(--gray); margin-top: 0.25rem; font-style: italic;">${item.notes}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: 600; color: var(--success);">${calories} cal</span>
                <button class="list-btn delete delete-workout" data-id="${item._id || item.id}" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        workoutList.appendChild(li);
    });
    
    document.getElementById('workout-total').textContent = `Total Calories Burned: ${totalBurned}`;
    
    localStorage.setItem('workoutItems', JSON.stringify(workoutItems));
    localStorage.setItem('totalBurned', totalBurned);
}

// Add exercise functionality
document.getElementById('add-exercise').addEventListener('click', function() {
    const container = document.getElementById('exercises-container');
    const exerciseRow = document.createElement('div');
    exerciseRow.className = 'exercise-row';
    exerciseRow.innerHTML = `
        <input type="text" placeholder="Exercise name" class="exercise-name" required>
        <input type="number" placeholder="Sets" class="exercise-sets" min="1" required>
        <input type="number" placeholder="Reps" class="exercise-reps" min="1" required>
        <input type="number" placeholder="Weight (kg)" class="exercise-weight" min="0" step="0.5">
        <button type="button" class="btn btn-outline remove-exercise"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(exerciseRow);
    
    // Show remove buttons
    document.querySelectorAll('.remove-exercise').forEach(btn => btn.style.display = 'inline-block');
});

// Remove exercise functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-exercise')) {
        const exerciseRow = e.target.closest('.exercise-row');
        exerciseRow.remove();
        
        // Hide remove button if only one exercise left
        const exerciseRows = document.querySelectorAll('.exercise-row');
        if (exerciseRows.length === 1) {
            exerciseRows[0].querySelector('.remove-exercise').style.display = 'none';
        }
    }
});

document.getElementById('workout-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const workoutName = document.getElementById('workout-name').value;
    const workoutType = document.getElementById('workout-type').value;
    const workoutDuration = parseInt(document.getElementById('workout-duration').value);
    const workoutIntensity = document.getElementById('workout-intensity').value;
    const caloriesBurned = parseInt(document.getElementById('calories-burned').value);
    const workoutNotes = document.getElementById('workout-notes').value;
    
    // Collect exercises
    const exercises = [];
    document.querySelectorAll('.exercise-row').forEach(row => {
        const name = row.querySelector('.exercise-name').value;
        const sets = parseInt(row.querySelector('.exercise-sets').value);
        const reps = parseInt(row.querySelector('.exercise-reps').value);
        const weight = parseFloat(row.querySelector('.exercise-weight').value) || 0;
        
        if (name && sets && reps) {
            exercises.push({ name, sets, reps, weight });
        }
    });
    
    const workoutData = {
        name: workoutName,
        type: workoutType,
        duration: workoutDuration,
        caloriesBurned: caloriesBurned,
        intensity: workoutIntensity,
        exercises: exercises,
        notes: workoutNotes
    };
    
    try {
        const token = localStorage.getItem('authToken');
        const submitBtn = document.querySelector('#workout-form button[type="submit"]');
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging...';
        submitBtn.disabled = true;
        
        if (token) {
            // Post to API
            const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/workouts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutData)
            });
            
            const data = await response.json();
            if (data.success) {
                // Refresh workouts from API
                await fetchWorkouts();
            } else {
                throw new Error(data.message || 'Failed to save workout');
            }
        } else {
            // Fallback to localStorage
            const now = new Date();
            workoutItems.push({ 
                type: workoutType, 
                duration: workoutDuration,
                intensity: workoutIntensity,
                calories: caloriesBurned,
                time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
            updateWorkoutDisplay();
        }
        
        // Reset form
        document.getElementById('workout-form').reset();
        
        // Reset exercises to single row
        const container = document.getElementById('exercises-container');
        container.innerHTML = `
            <div class="exercise-row">
                <input type="text" placeholder="Exercise name" class="exercise-name" required>
                <input type="number" placeholder="Sets" class="exercise-sets" min="1" required>
                <input type="number" placeholder="Reps" class="exercise-reps" min="1" required>
                <input type="number" placeholder="Weight (kg)" class="exercise-weight" min="0" step="0.5">
                <button type="button" class="btn btn-outline remove-exercise" style="display: none;"><i class="fas fa-minus"></i></button>
            </div>
        `;
        
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('Failed to save workout. Please try again.');
    } finally {
        // Reset button
        const submitBtn = document.querySelector('#workout-form button[type="submit"]');
        submitBtn.innerHTML = 'Log Workout';
        submitBtn.disabled = false;
    }
});

// Delete workout items
document.addEventListener('click', async function(e) {
    if (e.target.closest('.delete-workout')) {
        const btn = e.target.closest('.delete-workout');
        const workoutId = btn.getAttribute('data-id');
        const index = parseInt(btn.getAttribute('data-index'));
        
        if (!confirm('Are you sure you want to delete this workout?')) return;
        
        try {
            const token = localStorage.getItem('authToken');
            
            if (token && workoutId && workoutId !== 'undefined') {
                // Delete from API
                const response = await fetch(`https://fitness-tracker-1-tt21.onrender.com/api/workouts/${workoutId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                if (data.success) {
                    // Refresh workouts from API
                    await fetchWorkouts();
                } else {
                    throw new Error(data.message || 'Failed to delete workout');
                }
            } else {
                // Fallback to localStorage
                totalBurned -= workoutItems[index].calories || 0;
                workoutItems.splice(index, 1);
                updateWorkoutDisplay();
            }
        } catch (error) {
            console.error('Error deleting workout:', error);
            alert('Failed to delete workout. Please try again.');
        }
    }
});

// Initialize activity chart
function initActivityChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cardio', 'Strength', 'Flexibility', 'Rest'],
            datasets: [{
                data: [30, 25, 15, 30],
                backgroundColor: ['#2563eb', '#06d6a0', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
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

// Add logout button
function addLogoutButton() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.className = 'btn btn-outline';
        logoutBtn.style.marginLeft = '1rem';
        logoutBtn.style.padding = '0.5rem';
        logoutBtn.title = 'Logout';
        logoutBtn.onclick = function() {
            localStorage.clear();
            window.location.href = 'signin.html';
        };
        userProfile.appendChild(logoutBtn);
        
        // Update user info
        const userName = localStorage.getItem('userName');
        if (userName) {
            const userNameEl = userProfile.querySelector('.user-name');
            if (userNameEl) userNameEl.textContent = userName;
        }
    }
}

// Initialize fitness page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    fetchWorkouts();
    initActivityChart();
});