import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { create } from './gameLogic/board';
import { Model } from './gameLogic/model';
import { Controller } from './gameLogic/controller';
import { SequenceGenerator } from './gameLogic/SequenceGenerator';
import UserService from './services/UserService';

type HighScore = {
    username: string;
    score: number;
};

function App() {
    const [model, setModel] = useState(new Model(create(SequenceGenerator, 3, 4), SequenceGenerator));
    const [controller] = useState(new Controller(model));
    const [score, setScore] = useState(model.getScore());
    const [moves, setMoves] = useState(model.getMoves());
    const [highScores, setHighScores] = useState<HighScore[]>([]);

    const userService = new UserService();

    useEffect(() => {
        const observer = (updatedModel: Model<string>) => {
            setScore(updatedModel.getScore());
            setMoves(updatedModel.getMoves());

            if (updatedModel.getMoves() >= updatedModel.getMaxMoves()) {
                // 游戏结束，提交分数并获取高分榜
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                if (userId && token) {
                    userService.submitScore(userId, updatedModel.getScore(), token)
                        .then(() => userService.getHighScores(token))
                        .then(scores => setHighScores(scores))
                        .catch(error => console.error("Error:", error));
                }
            }
        };
        model.addObserver(observer);
        return () => model.removeObserver(observer);
    }, [model, userService]);

    const resetGame = useCallback(() => {
        const newModel = new Model(create(SequenceGenerator, 3, 4), SequenceGenerator);
        setModel(newModel);
        controller.setModel(newModel);
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
            <div className="high-scores">
                <h2>High Scores</h2>
                <ul>
                    {highScores.map((score, index) => (
                        <li key={index}>{score.username}: {score.score}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
