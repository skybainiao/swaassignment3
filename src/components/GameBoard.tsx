// src/components/GameBoard.tsx
import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import { Position, create, canMove, move as performMove } from '../gameLogic/board';
import { Model } from '../gameLogic/model';
import { Controller } from '../gameLogic/controller';
import { SequenceGenerator } from '../gameLogic/SequenceGenerator';

interface GameBoardProps {
    model: Model<string>;
    controller: Controller<string>;
}

export const GameBoard: React.FC<GameBoardProps> = ({ model, controller }) => {
    const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);

    useEffect(() => {
        const observer = () => {
            // Re-render the component on model update
            setSelectedPositions([]); // Clear selections on update
        };
        model.addObserver(observer);
        return () => model.removeObserver(observer);
    }, [model]);

    const handleClick = (position: Position) => {
        if (selectedPositions.length === 0) {
            setSelectedPositions([position]);
        } else if (selectedPositions.length === 1) {
            controller.handleMove(selectedPositions[0], position);
            setSelectedPositions([]); // 清空选中的位置
        }
    };

    const renderBoard = () => {
        return model.board.grid.map((row, rowIndex) => (
            <div className="game-row" key={rowIndex}>
                {row.map((cell, colIndex) => {
                    const position = { row: rowIndex, col: colIndex };
                    const isSelected = selectedPositions.some(pos => pos.row === position.row && pos.col === position.col);
                    return (
                        <div
                            className={`game-cell ${isSelected ? 'selected' : ''}`}
                            key={colIndex}
                            onClick={() => handleClick(position)}
                        >
                            {cell}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return <div className="game-board">{renderBoard()}</div>;
};
