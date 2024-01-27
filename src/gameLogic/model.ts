// src/gameLogic/model.ts
import {
    Board,
    Position,
    move,
    canMove,
    Generator,
    Match,
    MoveResult,
    findMatches,
    removeMatches,
    refillBoard,
    create
} from './board';

export class Model<T> {
    private observers: Set<((model: Model<T>) => void)>;
    private _board: Board<T>;
    private selected: Position[] = [];
    private _messages: string[] = [];
    private generator: Generator<T>;

    constructor(board: Board<T>, generator: Generator<T>) {
        this._board = board;
        this.generator = generator;
        this.observers = new Set();
    }

    addObserver(observer: (model: Model<T>) => void): void {
        this.observers.add(observer);
    }

    private notifyObservers(): void {
        this.observers.forEach(observer => observer(this));
    }

    get board(): Board<T> {
        return this._board;
    }

    select(position: Position): void {
        if (!this.isSelected(position)) {
            this.selected.push(position);
            this.notifyObservers();
        }
    }

    unselect(position: Position): void {
        this.selected = this.selected.filter(pos => pos.row !== position.row || pos.col !== position.col);
        this.notifyObservers();
    }

    isSelected(position: Position): boolean {
        return this.selected.some(pos => pos.row === position.row && pos.col === position.col);
    }

    canMove(first: Position, second: Position): boolean {
        return canMove(this._board, first, second);
    }

    move(first: Position, second: Position): void {
        if (this.canMove(first, second)) {
            const moveResult: MoveResult<T> = move(this.generator, this._board, first, second);
            this._board = moveResult.board;
            this.handleMoveResult(moveResult);
            this.notifyObservers();
        }
    }

    private handleMoveResult(moveResult: MoveResult<T>): void {
        // 这里处理移动结果，比如更新分数、匹配等
        moveResult.effects.forEach(effect => {
            if ('matched' in effect) {
                // 处理匹配
                // ...
            }
        });

        // 如果需要，可以在这里处理游戏结束逻辑
    }

    addMessage(message: string): void {
        this._messages.push(message);
        this.notifyObservers();
    }

    get messages(): string[] {
        return [...this._messages];
    }

    get selection(): Position[] {
        return [...this.selected];
    }

    // 重置游戏状态
    reset(): void {
        this._board = create(this.generator, this._board.width, this._board.height);
        this.selected = [];
        this._messages = [];
        this.notifyObservers();
    }
}
