// src/App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { create } from './gameLogic/board';
import { Model } from './gameLogic/model';
import { Controller } from './gameLogic/controller';
import { SequenceGenerator } from './gameLogic/SequenceGenerator';

function App() {
    const [model, setModel] = useState(new Model(create(SequenceGenerator, 3, 4), SequenceGenerator));
    const [controller] = useState(new Controller(model));

    // 添加两个新状态来跟踪分数和步数
    const [score, setScore] = useState(model.getScore());
    const [moves, setMoves] = useState(model.getMoves());

    useEffect(() => {
        const observer = (updatedModel: Model<string>) => {
            // 更新分数和步数状态
            setScore(updatedModel.getScore());
            setMoves(updatedModel.getMoves());
        };
        model.addObserver(observer);
        return () => model.removeObserver(observer);
    }, [model]);

    const resetGame = useCallback(() => {
        const newModel = new Model(create(SequenceGenerator, 3, 4), SequenceGenerator);
        setModel(newModel);
        controller.setModel(newModel);
        // 重置游戏时也重置分数和步数
        setScore(newModel.getScore());
        setMoves(newModel.getMoves());
    }, [controller]);

    return (
        <div className="App">
            <h1>Match Three Game</h1>
            <div className="game-info">
                <p>Score: {score}</p>
                <p>Moves Left: {model.getMaxMoves() - moves}</p>
            </div>
            <GameBoard model={model} controller={controller} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={resetGame}>Reset Game</button>
            </div>
        </div>
    );
}

export default App;
