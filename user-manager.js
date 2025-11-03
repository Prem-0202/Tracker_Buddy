// Global user management
class UserManager {
    static async loadUserData() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const response = await fetch('https://fitness-tracker-1-tt21.onrender.com/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(user));
                return user;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
        return null;
    }

    static getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    static updateUserHeader() {
        const user = this.getUserData();
        
        const userNameEl = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');
        const userAvatarEl = document.getElementById('user-avatar');

        if (user) {
            if (userNameEl) userNameEl.textContent = user.name;
            if (userEmailEl) userEmailEl.textContent = user.email;
            if (userAvatarEl) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                userAvatarEl.textContent = initials;
            }
        }
        
        // Add logout button if not exists
        this.addLogoutButton();
    }

    static async initPage() {
        // Check auth
        if (!localStorage.getItem('authToken')) {
            window.location.href = 'signin.html';
            return;
        }

        // Update header immediately with cached data
        this.updateUserHeader();
        
        // Load fresh user data if not cached
        let user = this.getUserData();
        if (!user) {
            user = await this.loadUserData();
            this.updateUserHeader(); // Update again with fresh data
        }
    }

    static addLogoutButton() {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && !userProfile.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.className = 'btn btn-outline logout-btn';
            logoutBtn.style.marginLeft = '1rem';
            logoutBtn.style.padding = '0.5rem';
            logoutBtn.title = 'Logout';
            logoutBtn.onclick = this.logout;
            userProfile.appendChild(logoutBtn);
        }
    }

    static logout() {
        localStorage.clear();
        window.location.href = 'signin.html';
    }
}