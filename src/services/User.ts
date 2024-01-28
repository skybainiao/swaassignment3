// src/models/User.ts
export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    profile: any; // 根据需要添加更多的属性

    constructor(id: number, username: string, email: string, password: string, profile: any) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile = profile;
    }
}
