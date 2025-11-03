// Authentication helper functions
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!authToken || isLoggedIn !== 'true') {
        // Only redirect if not already on signin or register page
        if (!window.location.pathname.includes('signin.html') && 
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'signin.html';
        }
        return false;
    }
    return true;
}

function logout() {
    // Clear all stored data
    localStorage.clear();
    window.location.href = 'signin.html';
}

// Add logout button to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Only check auth on protected pages
    const protectedPages = ['dashboard.html', 'profile.html', 'nutrition.html', 'fitness.html', 'hydration.html', 'reports.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!checkAuth()) return;
    }
    
    // Add logout button to user profile
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.className = 'btn btn-outline';
        logoutBtn.style.marginLeft = '1rem';
        logoutBtn.style.padding = '0.5rem';
        logoutBtn.title = 'Logout';
        logoutBtn.onclick = logout;
        userProfile.appendChild(logoutBtn);
        
        // Update user info from localStorage
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        
        if (userName) {
            const userNameEl = userProfile.querySelector('.user-name');
            if (userNameEl) userNameEl.textContent = userName;
        }
        
        if (userId) {
            const userRoleEl = userProfile.querySelector('.user-role');
            if (userRoleEl) userRoleEl.textContent = `User ID: ${userId.slice(-8)}`;
        }
    }
});