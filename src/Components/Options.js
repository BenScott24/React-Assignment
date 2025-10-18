export default function Options({ p1State, setP1State}) {
    return (
        <div>
            <h6>Preprocessing Options</h6>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={p1State === 'ON'} onChange={() => setP1State('ON')} />
                <label className="form-check-label" htmlFor="flexRadioDefault1">On</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={p1State === 'OFF'} onChange={() => setP1State('OFF')} />
                <label className="form-check-label" htmlFor="flexRadioDefault2">Off</label>
            </div>

            <hr />
            <div>
                <strong>Hotkeys:</strong>
                <ul>
                    <li><kbd>Space</kbd> Play/Pause</li>
                    <li><kbd>P</kbd> Run Preprocessing</li>
                </ul>
            </div>
        </div>
    );
}


    