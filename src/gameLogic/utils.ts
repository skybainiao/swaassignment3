// src/gameLogic/utils.ts

// 随机生成游戏元素
export function generateRandomElement(elements: string[]): string {
    return elements[Math.floor(Math.random() * elements.length)];
}

// 检查数组中是否有重复元素
export function hasDuplicates(array: any[]): boolean {
    return new Set(array).size !== array.length;
}

// 格式化分数
export function formatScore(score: number): string {
    return score.toString().padStart(5, '0');
}

// 其他辅助函数...
