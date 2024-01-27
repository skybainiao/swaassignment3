// src/App.tsx
import React, { useState, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { create } from './gameLogic/board';
import { Model } from './gameLogic/model';
import { Controller } from './gameLogic/controller';
import { SequenceGenerator } from './gameLogic/SequenceGenerator';

function App() {
    const [model, setModel] = useState(new Model(create(SequenceGenerator, 8, 8), SequenceGenerator));
    const [controller] = useState(new Controller(model));

    const resetGame = useCallback(() => {
        const newModel = new Model(create(SequenceGenerator, 8, 8), SequenceGenerator);
        setModel(newModel);
        // 更新 controller 中的 model
        controller.setModel(newModel);
    }, [controller]);

    return (
        <div className="App">
            <h1>我的三消游戏</h1>
            <GameBoard model={model} controller={controller} />
            <button onClick={resetGame}>重置游戏</button>
        </div>
    );
}

export default App;
