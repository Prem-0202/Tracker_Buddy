class UserManager {
    static async loadUserData() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const response = await fetch('https://fitness-tracker-x15u.onrender.com/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                localStorage.setItem('userData', JSON.stringify(user));
                return user;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
        return null;
    }

    static getUserData() {
        // Try full userData object first
        const userData = localStorage.getItem('userData');
        if (userData) {
            try { return JSON.parse(userData); } catch(e) {}
        }
        // Fallback to individual keys set during login/register
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        if (name || email) {
            return { name: name || 'User', email: email || '' };
        }
        return null;
    }

    static updateUserHeader() {
        const user = this.getUserData();

        const userNameEl  = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');
        const userAvatarEl = document.getElementById('user-avatar');

        if (user) {
            if (userNameEl)  userNameEl.textContent  = user.name  || 'User';
            if (userEmailEl) userEmailEl.textContent = user.email || '';
            if (userAvatarEl) {
                const initials = (user.name || 'U')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                userAvatarEl.textContent = initials;
            }
        }

        this.addLogoutButton();
    }

    static async initPage() {
        if (!localStorage.getItem('authToken')) {
            window.location.href = 'signin.html';
            return;
        }

        // Show cached data immediately (no flicker)
        this.updateUserHeader();

        // Always fetch fresh data in background
        const user = await this.loadUserData();
        if (user) this.updateUserHeader();
    }

    static addLogoutButton() {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && !userProfile.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.className = 'btn btn-outline logout-btn';
            logoutBtn.style.cssText = 'padding:0.45rem 0.7rem; margin-left:0.5rem;';
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
