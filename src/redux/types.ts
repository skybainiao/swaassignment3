// 可以在一个单独的文件中定义，比如 src/redux/types.ts
export interface Action<T = any> {
    type: string;
    payload?: T;
}

type User = {
    id: string;
    username: string;
    // 其他用户信息字段
};

type CreateUserDto = {
    username: string;
    password: string;
    // 其他注册信息
};

type UpdateUserDto = {
    email?: string;
    password?: string;
    // 其他可以更新的信息
};

type Score = {
    userId: string;
    score: number;
    // 其他分数相关字段
};
