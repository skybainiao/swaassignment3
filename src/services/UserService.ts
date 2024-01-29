// UserService.ts

export default class UserService {

    async login(username: string, password: string) {
        const response = await fetch('http://localhost:9090/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // 保存token和userId到localStorage或者状态管理库中
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            return data;
        } else {
            throw new Error('Login failed');
        }
    }

    // 注销
    async logout(token: string) {
        const response = await fetch(`http://localhost:9090/logout?token=${encodeURIComponent(token)}`, {
            method: 'POST', // 或者是GET，取决于你的后端API
        });

        if (response.ok) {
            // 清除localStorage或者状态管理库中的token和userId
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            return true;
        } else {
            throw new Error('Logout failed');
        }
    }

    async submitScore(userId: string, score: number, token: string) {
        const response = await fetch('http://localhost:9090/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, score }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error submitting score:", errorData.message || 'Failed to submit score');
            throw new Error(errorData.message || 'Failed to submit score');
        }
    }



    async register(username: string, password: string) {
        const response = await fetch('http://localhost:9090/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("ok")
            return data;
        } else {
            const errorData = await response.json(); // 获取更详细的错误信息
            throw new Error(errorData.message || 'Registration failed');
        }
    }


    // 更新用户资料
    async updateProfile(userId: string, profileData: object, token: string) {
        const response = await fetch(`http://localhost:9090/users/${userId}?token=${encodeURIComponent(token)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Update profile failed');
        }
    }

    // 获取高分榜
    async getHighScores(token: string) {
        const response = await fetch('http://localhost:9090/games?token=' + encodeURIComponent(token));

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch high scores');
        }
    }
}
