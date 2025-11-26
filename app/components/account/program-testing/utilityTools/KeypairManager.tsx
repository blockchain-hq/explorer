'use client';

import { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import UseCopy from '@/app/hooks/useCopy';
import { Key, Download, Upload, Plus, Copy, Check, AlertTriangle } from 'react-feather';
import { useCluster } from '@/app/providers/cluster';
import { getExplorerUrl } from '@/app/utils/explorer-url';
import { type SavedKeypair } from '@/app/lib/types';
import SavedKeypairCard from './KeypairManagerComponents/SavedKeypairCard';

type TabType = 'generate' | 'import' | 'saved';

export function KeypairManager() {
    const { handleCopy } = UseCopy();
    const { cluster } = useCluster();
    const [copiedItem, setCopiedItem] = useState<'publicKey' | 'secretKeyBase64' | 'secretKeyJson' | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('generate');
    const [newKeypair, setNewKeypair] = useState<Keypair | null>(null);
    const [keypairLabel, setKeypairLabel] = useState('');
    const [importSecret, setImportSecret] = useState('');
    const [importedKeypair, setImportedKeypair] = useState<Keypair | null>(null);
    const [savedKeypairs, setSavedKeypairs] = useState<SavedKeypair[]>(() => {
        try {
            const saved = localStorage.getItem('testship_saved_keypairs');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());

    const handleCopyWithReset = (text: string, itemType: 'publicKey' | 'secretKeyBase64' | 'secretKeyJson') => {
        handleCopy(text);
        setCopiedItem(itemType);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const handleGenerateKeypair = () => {
        const kp = Keypair.generate();
        setNewKeypair(kp);
        setKeypairLabel('');
    };

    const handleSaveKeypair = (keypair: Keypair, label: string) => {
        const savedKp: SavedKeypair = {
            label: label || `Keypair ${savedKeypairs.length + 1}`,
            publicKey: keypair.publicKey.toBase58(),
            secretKey: Buffer.from(keypair.secretKey).toString('base64'),
            timestamp: Date.now(),
        };
        const updated = [...savedKeypairs, savedKp];
        setSavedKeypairs(updated);
        localStorage.setItem('testship_saved_keypairs', JSON.stringify(updated));
        setNewKeypair(null);
        setKeypairLabel('');
    };

    const handleImportKeypair = () => {
        try {
            let secretKey: Uint8Array;
            try {
                const parsed = JSON.parse(importSecret);
                if (Array.isArray(parsed)) {
                    secretKey = Uint8Array.from(parsed);
                } else {
                    throw new Error('Not an array');
                }
            } catch {
                try {
                    secretKey = Uint8Array.from(Buffer.from(importSecret, 'base64'));
                } catch {
                    throw new Error('Invalid secret key format');
                }
            }
            const kp = Keypair.fromSecretKey(secretKey);
            setImportedKeypair(kp);
        } catch (error) {
            alert(`Failed to import keypair: ${error}`);
        }
    };

    const handleDeleteKeypair = (publicKey: string) => {
        const updated = savedKeypairs.filter(kp => kp.publicKey !== publicKey);
        setSavedKeypairs(updated);
        localStorage.setItem('testship_saved_keypairs', JSON.stringify(updated));
    };

    const toggleShowSecret = (publicKey: string) => {
        const newSet = new Set(showSecrets);
        if (newSet.has(publicKey)) {
            newSet.delete(publicKey);
        } else {
            newSet.add(publicKey);
        }
        setShowSecrets(newSet);
    };

    const exportAsJSON = (secretKey: string) => {
        const buffer = Buffer.from(secretKey, 'base64');
        return JSON.stringify(Array.from(buffer));
    };

    return (
        <div>
            <ul className="nav nav-pills nav-fill mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'generate' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('generate')}
                    >
                        <Plus size={14} />
                        Generate
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'import' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('import')}
                    >
                        <Upload size={14} />
                        Import
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'saved' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('saved')}
                    >
                        <Key size={14} />
                        Saved ({savedKeypairs.length})
                    </button>
                </li>
            </ul>

            {/* GENERATE TAB */}
            {activeTab === 'generate' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Generate New Keypair</h6>
                    <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleGenerateKeypair}
                    >
                        <Plus size={16} />
                        Generate Random Keypair
                    </button>

                    {newKeypair && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">Public Key:</small>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="text"
                                        className="form-control font-monospace"
                                        style={{ fontSize: '0.75rem' }}
                                        value={newKeypair.publicKey.toBase58()}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            handleCopyWithReset(newKeypair.publicKey.toBase58(), 'publicKey')
                                        }
                                    >
                                        {copiedItem === 'publicKey' ? (
                                            <Check size={14} className="text-success" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                                <a
                                    href={getExplorerUrl(newKeypair.publicKey.toBase58(), 'address', cluster)}
                                    target="_blank"
                                    className="small text-decoration-none"
                                    rel="noreferrer"
                                >
                                    View on Explorer →
                                </a>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">Secret Key (Base64):</small>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="password"
                                        className="form-control font-monospace"
                                        style={{ fontSize: '0.75rem' }}
                                        value={Buffer.from(newKeypair.secretKey).toString('base64')}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            handleCopyWithReset(
                                                Buffer.from(newKeypair.secretKey).toString('base64'),
                                                'secretKeyBase64'
                                            )
                                        }
                                    >
                                        {copiedItem === 'secretKeyBase64' ? (
                                            <Check size={14} className="text-success" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">Secret Key (JSON Array):</small>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="password"
                                        className="form-control font-monospace"
                                        style={{ fontSize: '0.75rem' }}
                                        value={JSON.stringify(Array.from(newKeypair.secretKey))}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            handleCopyWithReset(
                                                JSON.stringify(Array.from(newKeypair.secretKey)),
                                                'secretKeyJson'
                                            )
                                        }
                                    >
                                        {copiedItem === 'secretKeyJson' ? (
                                            <Check size={14} className="text-success" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Label (optional):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keypairLabel}
                                    onChange={e => setKeypairLabel(e.target.value)}
                                    placeholder="e.g., AMM ID, Test Account"
                                />
                            </div>

                            <div className="alert alert-warning d-flex align-items-center gap-2 py-2" role="alert">
                                <AlertTriangle size={16} />
                                <small>Private keys stored in browser. Only use for testing purposes!</small>
                            </div>

                            <button
                                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => handleSaveKeypair(newKeypair, keypairLabel)}
                            >
                                <Download size={16} />
                                Save Keypair
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* IMPORT TAB */}
            {activeTab === 'import' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Import Existing Keypair</h6>
                    <div className="mb-3">
                        <label className="form-label">Secret Key (Base64 or JSON Array):</label>
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.85rem' }}
                            value={importSecret}
                            onChange={e => setImportSecret(e.target.value)}
                            placeholder="Paste secret key here..."
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleImportKeypair}
                        disabled={!importSecret}
                    >
                        <Upload size={16} />
                        Import Keypair
                    </button>

                    {importedKeypair && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <span className="badge bg-success mb-2">✓ Successfully Imported</span>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">Public Key:</small>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="text"
                                        className="form-control font-monospace"
                                        style={{ fontSize: '0.75rem' }}
                                        value={importedKeypair.publicKey.toBase58()}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            handleCopyWithReset(importedKeypair.publicKey.toBase58(), 'publicKey')
                                        }
                                    >
                                        {copiedItem === 'publicKey' ? (
                                            <Check size={14} className="text-success" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Label (optional):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keypairLabel}
                                    onChange={e => setKeypairLabel(e.target.value)}
                                    placeholder="e.g., Imported Account"
                                />
                            </div>

                            <button
                                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => handleSaveKeypair(importedKeypair, keypairLabel)}
                            >
                                <Download size={16} />
                                Save Keypair
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SAVED TAB */}
            {activeTab === 'saved' && (
                <div>
                    {savedKeypairs.length === 0 ? (
                        <div className="testing-form-section text-center py-5 text-muted">
                            <Key size={48} className="mb-3 opacity-50" />
                            <p>No saved keypairs yet</p>
                            <small>Generate or import a keypair to save it</small>
                        </div>
                    ) : (
                        savedKeypairs.map(kp => (
                            <SavedKeypairCard
                                key={kp.publicKey}
                                savedKeypair={kp}
                                onDelete={handleDeleteKeypair}
                                showSecrets={showSecrets}
                                onToggleSecret={toggleShowSecret}
                                exportAsJSON={exportAsJSON}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
