// CanvasRoll component to render the piano roll canvas
export default function CanvasRoll() {
    return (
        // Row container
        <div className="row">
            {/* Full width column for the canvas */}
            <div className="col-md-12">
                {/* Canvas element where piano roll will be drawn */}
                <canvas id="roll"></canvas>
            </div>
        </div>
    );
} 