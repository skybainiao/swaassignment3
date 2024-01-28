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

    // 检查匹配
    const matches = findMatches(board);

    // 如果有匹配的元素，移除它们
    if (matches.length > 0) {
        removeMatches(board, matches);
        refillBoard(board, generator);
    }

    // 假设处理逻辑完成，返回移动结果
    return {
        board,
        effects: matches.length > 0 ? [...matches, { kind: "Refill", board }] : []
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
                if (positions.length >= 3) {
                    matches.push({ matched: matchedElement, positions });
                }
            }
        }
    }

    // 查找列匹配
    for (let col = 0; col < board.width; col++) {
        for (let row = 0; row < board.height; row++) {
            if (row + 2 < board.height &&
                board.grid[row][col] === board.grid[row + 1][col] &&
                board.grid[row][col] === board.grid[row + 2][col]) {
                const matchedElement = board.grid[row][col];
                const positions: Position[] = [];
                while (row < board.height && board.grid[row][col] === matchedElement) {
                    positions.push({ row, col });
                    row++;
                }
                if (positions.length >= 3) {
                    matches.push({ matched: matchedElement, positions });
                }
            }
        }
    }

    return matches;
}


// 移除匹配
export function removeMatches<T>(board: Board<T>, matches: Match<T>[]): void {
    matches.forEach(match => {
        match.positions.forEach(({ row, col }) => {
            board.grid[row][col] = null as unknown as T; // 将匹配到的元素设置为 null
        });
    });
}

// 补充游戏板
export function refillBoard<T>(board: Board<T>, generator: Generator<T>): void {
    // 对于每一列
    for (let col = 0; col < board.width; col++) {
        // 从底部向上检查
        for (let row = board.height - 1; row >= 0; row--) {
            // 如果当前位置为空，则需要补充
            if (board.grid[row][col] === null) {
                // 从当前位置向上找到第一个非空位置
                let nonNullRow = row - 1;
                while (nonNullRow >= 0 && board.grid[nonNullRow][col] === null) {
                    nonNullRow--;
                }
                // 如果找到了非空位置，则将其下移
                if (nonNullRow >= 0) {
                    board.grid[row][col] = board.grid[nonNullRow][col];
                    board.grid[nonNullRow][col] = null as unknown as T;
                } else {
                    // 如果没有找到非空位置，则从顶部生成新元素
                    board.grid[row][col] = generator.next();
                }
            }
        }
    }
}
