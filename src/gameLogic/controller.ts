// src/gameLogic/controller.ts
import { Position } from './board';
import { Model } from './model';

export class Controller<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    handleMove(first: Position, second: Position): void {
        if (this.model.canMove(first, second)) {
            this.model.move(first, second);
        }
    }

    setModel(model: Model<T>): void {
        this.model = model;
    }

}
