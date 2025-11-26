'use client';

import { useState } from 'react';
import { ArrowRight } from 'react-feather';

export function TimestampConverter() {
    const [timestamp, setTimestamp] = useState('');
    const [dateTime, setDateTime] = useState('');

    const convertToDate = () => {
        try {
            const ts = parseInt(timestamp, 10);
            const date = new Date(ts * 1000);
            setDateTime(date.toISOString());
        } catch (e) {
            setDateTime('Invalid timestamp');
        }
    };

    const convertToTimestamp = () => {
        try {
            const date = new Date(dateTime);
            setTimestamp(Math.floor(date.getTime() / 1000).toString());
        } catch (e) {
            setTimestamp('Invalid date');
        }
    };

    const setCurrentTime = () => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(now.toString());
        setDateTime(new Date(now * 1000).toISOString());
    };

    return (
        <div className="testing-form-section">
            <div className="mb-3">
                <label className="form-label">Unix Timestamp (seconds)</label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        value={timestamp}
                        onChange={e => setTimestamp(e.target.value)}
                        placeholder="1234567890"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={convertToDate}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">ISO 8601 Date</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={dateTime}
                        onChange={e => setDateTime(e.target.value)}
                        placeholder="2024-01-01T00:00:00.000Z"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={convertToTimestamp}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <button className="btn btn-secondary w-100" onClick={setCurrentTime}>
                Current Time
            </button>
        </div>
    );
}
