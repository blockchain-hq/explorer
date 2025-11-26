'use client';

import { useState } from 'react';
import { ArrowRight } from 'react-feather';

const LAMPORTS_PER_SOL = 1_000_000_000;

export function LamportsConverter() {
    const [lamports, setLamports] = useState('');
    const [sol, setSol] = useState('');

    const convertToSol = () => {
        try {
            const lamportsNum = parseInt(lamports, 10);
            setSol((lamportsNum / LAMPORTS_PER_SOL).toString());
        } catch (e) {
            setSol('Invalid');
        }
    };

    const convertToLamports = () => {
        try {
            const solNum = parseFloat(sol);
            setLamports(Math.floor(solNum * LAMPORTS_PER_SOL).toString());
        } catch (e) {
            setLamports('Invalid');
        }
    };

    return (
        <div className="testing-form-section">
            <div className="mb-3">
                <label className="form-label">Lamports</label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        value={lamports}
                        onChange={e => setLamports(e.target.value)}
                        placeholder="1000000000"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={convertToSol}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">SOL</label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        value={sol}
                        onChange={e => setSol(e.target.value)}
                        placeholder="1.0"
                        step="0.000000001"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={convertToLamports}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="text-muted text-center small">1 SOL = {LAMPORTS_PER_SOL.toLocaleString()} Lamports</div>
        </div>
    );
}
