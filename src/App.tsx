import "./App.css";
import ScoreBoard from "./UI/ScoreBoard";

function App() {
    return (
        <div className='App'>
            <h1 data-testid='title'>Bowling Scoresheet</h1>
            <ScoreBoard />
            <button>Start Game</button>
        </div>
    );
}

export default App;
