// 可以在一个单独的文件中定义，比如 src/redux/types.ts
export interface Action<T = any> {
    type: string;
    payload?: T;
}
