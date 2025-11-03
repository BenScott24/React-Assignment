import './App.css';
import StrudelEditor from './components/StrudelEditor';
import logo from './Assets/logo.svg'

function App() {
    return (
        <div className="App container-fluid">
            <header className="app-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="app-title">Strudel Web App</h1>
            </header>
            <main className="app-main">
                <StrudelEditor />
            </main>
        </div>
    );
}

export default App;