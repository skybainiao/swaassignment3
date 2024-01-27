// src/components/GameBoard.tsx
import React from 'react';
import { Position } from '../gameLogic/board';
import { Model } from '../gameLogic/model';
import { Controller } from '../gameLogic/controller';

interface GameBoardProps {
    model: Model<string>;
    controller: Controller<string>;
}

export const GameBoard: React.FC<GameBoardProps> = ({ model, controller }) => {
    const handleClick = (position: Position) => {
        controller.click(position);
    };

    // 渲染游戏板
    const renderBoard = () => {
        return model.board.grid.map((row, rowIndex) => (
            <div key={rowIndex}>
                {row.map((cell, colIndex) => (
                    <div key={colIndex} onClick={() => handleClick({ row: rowIndex, col: colIndex })}>
                        {cell}
                    </div>
                ))}
            </div>
        ));
    };

    return <div>{renderBoard()}</div>;
};
