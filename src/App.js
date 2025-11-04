// Import global CSS for the app
import './App.css';

// Import the main Strudel editor component
import StrudelEditor from './components/StrudelEditor';

// Import logo image
import logo from './Assets/logo.svg'

// Main App component
function App() {
    return (

        // Root div for the entire application
        <div className="App container-fluid">

            {/* Header section with logo and title */}
            <header className="app-header">

                {/* Logo image */}
                <img src={logo} className="App-logo" alt="logo" /> 

                {/* Application title */}
                <h1 className="app-title">Strudel Web App</h1> 
            </header>

            {/* Main content section containing the Strudel editor */}
            <main className="app-main">

                {/* Strudel editor component */}
                <StrudelEditor />
            </main>
        </div>
    );
}

// Export the App component for rendering in index.js
export default App;