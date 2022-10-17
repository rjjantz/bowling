import * as React from "react";
import "./App.css";
import ScoreBoard from "./UI/ScoreBoard";
import * as Bowling from "./Logic/Calculator";

class App extends React.Component {
    state = {
        gameActive: false,
    };

    startGame = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ gameActive: true });
    };

    abortGame = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ gameActive: false });
    };

    render() {
        return (
            <div className='App'>
                <h1 data-testid='title'>Bowling Scoresheet</h1>
                <ScoreBoard />
                <button disabled={this.state.gameActive} onClick={this.startGame.bind(this)}>
                    Start Game
                </button>
                <button disabled={!this.state.gameActive} onClick={this.abortGame.bind(this)}>
                    Abort Game
                </button>
            </div>
        );
    }
}

export default App;
