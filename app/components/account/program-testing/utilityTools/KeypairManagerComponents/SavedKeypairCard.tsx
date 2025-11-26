'use client';

import { useState } from 'react';
import UseCopy from '@/app/hooks/useCopy';
import { useCluster } from '@/app/providers/cluster';
import { getExplorerUrl } from '@/app/utils/explorer-url';
import type { SavedKeypair } from '@/app/lib/types';
import { Copy, Check, Eye, EyeOff, Trash2, ExternalLink } from 'react-feather';

interface SavedKeypairCardProps {
    savedKeypair: SavedKeypair;
    onDelete: (publicKey: string) => void;
    showSecrets: Set<string>;
    onToggleSecret: (publicKey: string) => void;
    exportAsJSON: (secretKey: string) => string;
}

export default function SavedKeypairCard({
    savedKeypair,
    onDelete,
    showSecrets,
    onToggleSecret,
    exportAsJSON,
}: SavedKeypairCardProps) {
    const { handleCopy } = UseCopy();
    const { cluster } = useCluster();
    const [copiedItem, setCopiedItem] = useState<'publicKey' | 'secretKeyBase64' | 'secretKeyJson' | null>(null);

    const handleCopyWithReset = (text: string, itemType: 'publicKey' | 'secretKeyBase64' | 'secretKeyJson') => {
        handleCopy(text);
        setCopiedItem(itemType);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const isSecretVisible = showSecrets.has(savedKeypair.publicKey);

    return (
        <div className="testing-form-section mb-3">
            <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                    <h6 className="mb-1">{savedKeypair.label}</h6>
                    <small className="text-muted">{new Date(savedKeypair.timestamp).toLocaleString()}</small>
                </div>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(savedKeypair.publicKey)}
                    title="Delete keypair"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="mb-3">
                <small className="text-muted d-block mb-1">Public Key:</small>
                <div className="input-group input-group-sm">
                    <input
                        type="text"
                        className="form-control font-monospace"
                        style={{ fontSize: '0.75rem' }}
                        value={savedKeypair.publicKey}
                        readOnly
                    />
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleCopyWithReset(savedKeypair.publicKey, 'publicKey')}
                    >
                        {copiedItem === 'publicKey' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                </div>
                <a
                    href={getExplorerUrl(savedKeypair.publicKey, 'address', cluster)}
                    target="_blank"
                    className="small text-decoration-none"
                    rel="noreferrer"
                >
                    View on Explorer <ExternalLink size={12} />
                </a>
            </div>

            <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                    <small className="text-muted">Secret Key (Base64):</small>
                    <button className="btn btn-sm btn-link p-0" onClick={() => onToggleSecret(savedKeypair.publicKey)}>
                        {isSecretVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>
                {isSecretVisible && (
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.75rem' }}
                            value={savedKeypair.secretKey}
                            readOnly
                        />
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleCopyWithReset(savedKeypair.secretKey, 'secretKeyBase64')}
                        >
                            {copiedItem === 'secretKeyBase64' ? (
                                <Check size={14} className="text-success" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div>
                <small className="text-muted d-block mb-1">Secret Key (JSON Array):</small>
                {isSecretVisible && (
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.75rem' }}
                            value={exportAsJSON(savedKeypair.secretKey)}
                            readOnly
                        />
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleCopyWithReset(exportAsJSON(savedKeypair.secretKey), 'secretKeyJson')}
                        >
                            {copiedItem === 'secretKeyJson' ? (
                                <Check size={14} className="text-success" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
