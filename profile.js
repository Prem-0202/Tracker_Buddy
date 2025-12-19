// Auth check
if (!localStorage.getItem('authToken')) {
    window.location.href = 'signin.html';
}

// Load profile data
async function loadProfile() {
    try {
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            // Update header
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            // Update form
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('age').value = user.age;
            document.getElementById('gender').value = user.gender;
            document.getElementById('height').value = user.height;
            document.getElementById('weight').value = user.weight;
            document.getElementById('fitnessGoals').value = user.fitnessGoals;
            document.getElementById('dailyCalorieTarget').value = user.dailyCalorieTarget;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile
document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        height: parseInt(document.getElementById('height').value),
        weight: parseInt(document.getElementById('weight').value),
        fitnessGoals: document.getElementById('fitnessGoals').value
    };
    
    try {
        const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(profileData)
        });
        
        const messageDiv = document.getElementById('profile-message');
        
        if (response.ok) {
            messageDiv.innerHTML = '<div style="color: var(--success); padding: 1rem; background: rgba(6, 214, 160, 0.1); border-radius: 8px;">Profile updated successfully!</div>';
        } else {
            messageDiv.innerHTML = '<div style="color: var(--danger); padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">Failed to update profile</div>';
        }
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

// BMI Calculator
document.getElementById('calculate-bmi-btn').addEventListener('click', function() {
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!height || !weight) {
        alert('Please enter height and weight');
        return;
    }
    
    const bmi = weight / (height * height);
    const bmiRounded = bmi.toFixed(1);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    const resultDiv = document.getElementById('bmi-result');
    resultDiv.innerHTML = `
        <div style="background: rgba(37, 99, 235, 0.1); padding: 1.5rem; border-radius: 8px; text-align: center;">
            <h3 style="margin-bottom: 0.5rem;">BMI Result</h3>
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${bmiRounded}</div>
            <div style="font-size: 1.2rem; margin-top: 0.5rem;">${category}</div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray);">A healthy BMI range is 18.5 to 24.9</div>
        </div>
    `;
    resultDiv.style.display = 'block';
});

// Initialize BMI chart
function initBMIChart() {
    const ctx = document.getElementById('bmi-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'BMI',
                data: [23.2, 22.8, 23.1, 22.9, 23.4, 23.6],
                borderColor: '#06d6a0',
                backgroundColor: 'rgba(6, 214, 160, 0.1)',
                tension: 0.3,
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
                    suggestedMin: 18,
                    suggestedMax: 25,
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

// Initialize profile page
document.addEventListener('DOMContentLoaded', async function() {
    await UserManager.initPage();
    loadProfile();
    initBMIChart();
});