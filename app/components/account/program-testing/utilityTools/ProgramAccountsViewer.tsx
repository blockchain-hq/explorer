'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { RefreshCw, Loader, User } from 'react-feather';
import { toast } from 'sonner';

export function ProgramAccountsViewer() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [programId, setProgramId] = useState('');
    const [accounts, setAccounts] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAccounts = async () => {
        if (!publicKey) {
            toast.error('Please connect your wallet');
            return;
        }

        setLoading(true);
        try {
            const programPubkey = new PublicKey(programId);
            const accountsInfo = await connection.getProgramAccounts(programPubkey);
            const accountKeys = accountsInfo.map(acc => acc.pubkey.toBase58());
            setAccounts(accountKeys);
            toast.success(`Found ${accountKeys.length} accounts`);
        } catch (err) {
            console.error('Error fetching accounts:', err);
            toast.error('Failed to fetch accounts. Check the program ID.');
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div className="text-center py-5 text-muted">
                <User size={48} className="mb-3 opacity-50" />
                <p>Please connect your wallet to view program accounts</p>
            </div>
        );
    }

    return (
        <div className="testing-form-section">
            <div className="mb-3">
                <label className="form-label">Program ID</label>
                <input
                    type="text"
                    className="form-control font-monospace"
                    style={{ fontSize: '0.85rem' }}
                    value={programId}
                    onChange={e => setProgramId(e.target.value)}
                    placeholder="Program address"
                />
            </div>

            <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={fetchAccounts}
                disabled={loading || !programId}
            >
                {loading ? (
                    <>
                        <Loader size={16} className="spinner-border spinner-border-sm" />
                        Fetching...
                    </>
                ) : (
                    <>
                        <RefreshCw size={16} />
                        Get Program Accounts
                    </>
                )}
            </button>

            {accounts.length > 0 && (
                <div className="mt-4">
                    <h6 className="small text-uppercase fw-semibold mb-3">Accounts ({accounts.length})</h6>
                    <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
                        {accounts.map((account, idx) => (
                            <div
                                key={idx}
                                className="p-2 rounded mb-2 font-monospace"
                                style={{
                                    fontSize: '0.75rem',
                                    wordBreak: 'break-all',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                }}
                            >
                                {account}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
