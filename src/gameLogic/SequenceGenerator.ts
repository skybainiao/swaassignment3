// src/gameLogic/SequenceGenerator.ts
export const SequenceGenerator = {
    sequence: "ABCD",
    index: 0,
    next: function () {
        const result = this.sequence[this.index];
        this.index = (this.index + 1) % this.sequence.length;
        return result;
    }
};
