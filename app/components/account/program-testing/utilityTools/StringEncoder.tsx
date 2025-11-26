'use client';

import { useState } from 'react';
import { ArrowRight } from 'react-feather';

export function StringEncoder() {
    const [text, setText] = useState('');
    const [encoded, setEncoded] = useState('');

    const encodeString = () => {
        try {
            const buffer = Buffer.from(text, 'utf-8');
            setEncoded(JSON.stringify(Array.from(buffer)));
        } catch (e) {
            setEncoded('Error encoding');
        }
    };

    const decodeString = () => {
        try {
            const parsed = JSON.parse(encoded);
            if (Array.isArray(parsed)) {
                const buffer = Buffer.from(parsed);
                setText(buffer.toString('utf-8'));
            } else {
                setText('Invalid array format');
            }
        } catch (e) {
            setText('Error decoding');
        }
    };

    return (
        <div className="testing-form-section">
            <div className="mb-3">
                <label className="form-label">Text String</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Hello Solana"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={encodeString}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Byte Array (JSON)</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control font-monospace"
                        style={{ fontSize: '0.85rem' }}
                        value={encoded}
                        onChange={e => setEncoded(e.target.value)}
                        placeholder="[72, 101, 108, 108, 111]"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={decodeString}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="text-muted small">
                <p className="mb-1">Converts between UTF-8 text and byte arrays</p>
                <p className="mb-0" style={{ fontSize: '0.75rem' }}>
                    Useful for encoding/decoding account data
                </p>
            </div>
        </div>
    );
}
