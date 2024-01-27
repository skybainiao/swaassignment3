// src/gameLogic/controller.ts
import { Position } from './board';
import { Model } from './model';

export class Controller<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // 重置游戏
    resetGame() {
        this.model.reset();
    }

    setModel(model: Model<T>): void {
        this.model = model;
    }

    // 玩家点击一个元素时触发
    click(p: Position) {
        // 判断点击的位置是否已被选中
        if (this.model.isSelected(p)) {
            // 如果已选中，则取消选中
            this.model.unselect(p);
        } else {
            // 如果未选中，则选中该位置
            this.model.select(p);

            // 如果已有两个元素被选中，尝试移动
            if (this.model.selection.length === 2) {
                const [first, second] = this.model.selection;
                if (this.model.canMove(first, second)) {
                    // 如果可以移动，则执行移动
                    this.model.move(first, second);
                } else {
                    // 如果不可以移动，则显示提示信息
                    this.model.addMessage("Can't move");
                }
                // 不管是否移动成功，都取消所有选中
                this.model.unselect(first);
                this.model.unselect(second);
            }
        }
    }

    // ...可能还会有其他方法，如用于重置游戏的方法等
}
