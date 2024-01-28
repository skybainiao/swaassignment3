// src/gameLogic/model.ts
import {
    Board,
    Position,
    move,
    canMove,
    Generator,
    Match,
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
    _score: number;
    _moves: number;
    private maxMoves: number; // 你可以设置一个合适的最大移动次数

    constructor(board: Board<T>, generator: Generator<T>) {
        this._board = board;
        this.generator = generator;
        this.observers = new Set();
        this.selected = [];
        this._messages = [];
        this._moves = 0;
        this._score = 0;
        this.maxMoves = 30;
    }

    // 添加一个方法来增加分数
    addScore(points: number): void {
        this._score += points;
        // 可能还需要通知观察者分数改变了
        this.notifyObservers();
    }

    // Getter 方法获取当前分数
    getScore(): number {
        return this._score;
    }

    getMoves(): number {
        return this._moves;
    }

    getMaxMoves(): number {
        return this.maxMoves;
    }

    addObserver(observer: (model: Model<T>) => void): void {
        this.observers.add(observer);
    }

    removeObserver(observer: (model: Model<T>) => void): void {
        this.observers.delete(observer);
    }

    private notifyObservers(): void {
        // 直接使用当前的模型实例通知观察者
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


    isSelected(position: Position): boolean {
        return this.selected.some(pos => pos.row === position.row && pos.col === position.col);
    }

    canMove(first: Position, second: Position): boolean {
        return canMove(this._board, first, second);
    }

    clone(): Model<T> {
        const newModel = new Model(this._board, this.generator);
        newModel._score = this.getScore();
        newModel._moves = this.getMoves();
        // 复制其他需要的状态
        return newModel;
    }


    move(first: Position, second: Position): void {
        console.log("move")
        if (this.canMove(first, second)) {
            this._moves++; // 步数增加
            let moveResult = move(this.generator, this._board, first, second);
            let matchesFound = moveResult.effects.some(effect => 'matched' in effect);

            while (matchesFound) {
                console.log("+++++")
                let matches = moveResult.effects.filter(effect => 'matched' in effect) as Match<T>[];
                if (matches.length > 0) {
                    this.addScore(10);
                }
                console.log(this.getScore())
                console.log(this.getMoves())
                console.log(this.maxMoves)
                removeMatches(this._board, matches);
                refillBoard(this._board, this.generator);
                this.notifyObservers();

                // 检查新的匹配
                moveResult = move(this.generator, this._board, first, second);
                matchesFound = moveResult.effects.some(effect => 'matched' in effect);
            }

            this._board = moveResult.board;
            this.notifyObservers();

            if (this._moves >= this.maxMoves) {
                this.addMessage('Game Over!');
                // 可以添加更多结束游戏的逻辑
            }
        }
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
