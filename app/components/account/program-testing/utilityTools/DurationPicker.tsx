'use client';

import { useState } from 'react';

export function DurationPicker() {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalSeconds / 3600;
    const totalDays = totalSeconds / 86400;

    return (
        <div className="testing-form-section">
            <div className="row g-3 mb-4">
                <div className="col-6">
                    <label className="form-label">Days</label>
                    <input
                        type="number"
                        className="form-control"
                        value={days}
                        onChange={e => setDays(parseInt(e.target.value) || 0)}
                        min="0"
                    />
                </div>
                <div className="col-6">
                    <label className="form-label">Hours</label>
                    <input
                        type="number"
                        className="form-control"
                        value={hours}
                        onChange={e => setHours(parseInt(e.target.value) || 0)}
                        min="0"
                        max="23"
                    />
                </div>
                <div className="col-6">
                    <label className="form-label">Minutes</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minutes}
                        onChange={e => setMinutes(parseInt(e.target.value) || 0)}
                        min="0"
                        max="59"
                    />
                </div>
                <div className="col-6">
                    <label className="form-label">Seconds</label>
                    <input
                        type="number"
                        className="form-control"
                        value={seconds}
                        onChange={e => setSeconds(parseInt(e.target.value) || 0)}
                        min="0"
                        max="59"
                    />
                </div>
            </div>

            <div className="testing-form-section" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <h4 className="small text-uppercase fw-semibold mb-3">Total Duration</h4>
                <div className="row g-3">
                    <div className="col-6">
                        <small className="text-muted d-block">Seconds:</small>
                        <span className="font-monospace fw-semibold">{totalSeconds.toLocaleString()}</span>
                    </div>
                    <div className="col-6">
                        <small className="text-muted d-block">Minutes:</small>
                        <span className="font-monospace fw-semibold">{totalMinutes.toFixed(2)}</span>
                    </div>
                    <div className="col-6">
                        <small className="text-muted d-block">Hours:</small>
                        <span className="font-monospace fw-semibold">{totalHours.toFixed(2)}</span>
                    </div>
                    <div className="col-6">
                        <small className="text-muted d-block">Days:</small>
                        <span className="font-monospace fw-semibold">{totalDays.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
