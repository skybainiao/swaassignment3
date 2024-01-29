// UserAccount.tsx
import React, { useState } from 'react';

import UserService from '../services/UserService';

interface UserAccountProps {
    onLogin: () => void; // 添加这个属性
}

export default function UserAccount({ onLogin }: UserAccountProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileData, setProfileData] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const userService = new UserService();

    // 处理登录
    const handleLogin = async () => {
        try {
            const data = await userService.login(username, password);
            setIsAuthenticated(true);
            onLogin(); // 调用传入的 onLogin 函数
            // ...其他逻辑，如跳转到主页等
        } catch (error) {
            console.error(error);
            // ...错误处理
        }
    };

    // 处理注册
    const handleRegister = async () => {
        try {
            const data = await userService.register(username, password);
            // ...注册成功后的逻辑
        } catch (error) {
            console.error(error);
            // ...错误处理
        }
    };

    // 处理资料更新
    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token'); // 确保在登录后保存了token
        const userId = localStorage.getItem('userId'); // 确保在登录后保存了userId
        if (token && userId) {
            try {
                const data = await userService.updateProfile(userId, profileData, token);
                // ...更新成功后的逻辑
            } catch (error) {
                console.error(error);
                // ...错误处理
            }
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    {/* 用户资料更新表单 */}
                    <input
                        type="text"
                        placeholder="New profile data"
                        onChange={(e) => setProfileData({ ...profileData, newData: e.target.value })}
                    />
                    <button onClick={handleProfileUpdate}>更新资料</button>
                </div>
            ) : (
                <div>
                    {/* 登录和注册表单 */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>登录</button>
                    <button onClick={handleRegister}>注册</button>
                    {errorMessage && <div className="error">{errorMessage}</div>}
                </div>
            )}
        </div>
    );
}
