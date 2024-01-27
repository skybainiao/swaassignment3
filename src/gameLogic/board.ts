// src/gameLogic/board.ts

// 生成器类型定义
export type Generator<T> = { next: () => T };

// 位置类型定义
export type Position = {
    row: number;
    col: number;
};

// 匹配类型定义
export type Match<T> = {
    matched: T;
    positions: Position[];
};

// 游戏板类型定义
export type Board<T> = {
    width: number;
    height: number;
    grid: T[][];
};

// 效果类型定义，包括匹配和补充新元素
export type Effect<T> = Match<T> | { kind: "Refill", board: Board<T> };

// 移动结果类型定义
export type MoveResult<T> = {
    board: Board<T>;
    effects: Effect<T>[];
};

// 创建一个新的游戏板
export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    const grid: T[][] = [];
    for (let i = 0; i < height; i++) {
        grid[i] = [];
        for (let j = 0; j < width; j++) {
            grid[i][j] = generator.next();
        }
    }
    return { width, height, grid };
}


export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if (p.row < 0 || p.row >= board.height || p.col < 0 || p.col >= board.width) {
        return undefined;
    }
    return board.grid[p.row][p.col];
}


// 检查两个位置的元素是否可以交换
export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    return Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;
}


// 执行移动
export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    // 交换元素
    [board.grid[first.row][first.col], board.grid[second.row][second.col]] =
        [board.grid[second.row][second.col], board.grid[first.row][first.col]];

    // 检查匹配并处理其他相关逻辑
    // ...

    // 假设处理逻辑完成，返回移动结果
    return {
        board,
        effects: [] // 实际应该包含匹配和其他效果
    };
}


// 查找匹配
export function findMatches<T>(board: Board<T>): Match<T>[] {
    const matches: Match<T>[] = [];

    // 查找行匹配
    for (let row = 0; row < board.height; row++) {
        for (let col = 0; col < board.width; col++) {
            if (col + 2 < board.width &&
                board.grid[row][col] === board.grid[row][col + 1] &&
                board.grid[row][col] === board.grid[row][col + 2]) {
                const matchedElement = board.grid[row][col];
                const positions: Position[] = [];
                while (col < board.width && board.grid[row][col] === matchedElement) {
                    positions.push({ row, col });
                    col++;
                }
                matches.push({ matched: matchedElement, positions });
            }
        }
    }

    // 查找列匹配
    // 这个逻辑类似于行匹配，但是遍历的方向是垂直方向

    return matches;
}


// 移除匹配
// 移除匹配
export function removeMatches<T>(board: Board<T>, matches: Match<T>[]): void {
    matches.forEach(match => {
        match.positions.forEach(({ row, col }) => {
            board.grid[row][col] = null as unknown as T; // 将匹配到的元素移除
        });
    });
}

// 补充游戏板
// 补充游戏板
export function refillBoard<T>(board: Board<T>, generator: Generator<T>): void {
    for (let col = 0; col < board.width; col++) {
        let emptyRow = -1; // 记录第一个空位置
        for (let row = board.height - 1; row >= 0; row--) {
            if (board.grid[row][col] === null) {
                emptyRow = row;
            } else if (emptyRow !== -1) {
                // 将当前元素下移
                board.grid[emptyRow][col] = board.grid[row][col];
                board.grid[row][col] = null as unknown as T;
                emptyRow--;
            }
        }

        // 在顶部补充新元素
        for (let row = emptyRow; row >= 0; row--) {
            board.grid[row][col] = generator.next();
        }
    }
}

