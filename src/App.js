import './App.css';
import StrudelEditor from './components/StrudelEditor';
import logo from './Assets/logo.svg'

function App() {
    return (
        <div className="App container-fluid">
            <h2>
                <img src={logo} alt="App Icon" style={{width:'140px'}} />
                Strudel Web App
            </h2>
            <StrudelEditor />
        </div>
    );
}

export default App;