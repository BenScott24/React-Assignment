import './App.css';
import StrudelEditor from './components/StrudelEditor';
import icon from './Assets/icon.png';

function App() {
    return (
        <div className="App container-fluid">
            <h2>
                <img src={icon} alt="App Icon" style={{width:'60px', marginRight: '10px'}} />
                Strudel Web App
            </h2>
            <StrudelEditor />
        </div>
    );
}

export default App;