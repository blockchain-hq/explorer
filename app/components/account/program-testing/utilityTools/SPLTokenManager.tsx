'use client';

import { useCluster } from '@/app/providers/cluster';
import UseCopy from '@/app/hooks/useCopy';
import { useSPLToken } from '@/app/hooks/useSPLToken';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Plus, DollarSign, Send, RefreshCw, Loader, ExternalLink, Check, Copy, User } from 'react-feather';
import { toast } from 'sonner';
import { TransactionToast } from '../TransactionToast';
import { getExplorerUrl } from '@/app/utils/explorer-url';

type TabType = 'create' | 'mint' | 'transfer' | 'info';

interface TokenInfo {
    mint: string;
    decimals: number;
    tokenAccount?: string;
    balance?: string;
}

export function SPLTokenManager() {
    const { cluster } = useCluster();
    const { copied, handleCopy } = UseCopy();
    const { publicKey } = useWallet();
    const { createToken, mintTokens, transferTokens, getTokenInfo, loading } = useSPLToken();

    const [activeTab, setActiveTab] = useState<TabType>('create');
    const [decimals, setDecimals] = useState('9');
    const [createdMint, setCreatedMint] = useState<string | null>(null);
    const [mintAddress, setMintAddress] = useState<string>('');
    const [mintAmount, setMintAmount] = useState('');
    const [mintToAddress, setMintToAddress] = useState('');
    const [transferMint, setTransferMint] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferToAddress, setTransferToAddress] = useState('');
    const [infoMint, setInfoMint] = useState<string>('');
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

    const handleCreateToken = async () => {
        try {
            const decimalsNum = parseInt(decimals, 10);
            const mint = await createToken(decimalsNum);
            setCreatedMint(mint);
            setMintAddress(mint);
            setTransferMint(mint);
            setInfoMint(mint);
            toast.success('Token mint created successfully!');
        } catch (error) {
            console.error('Failed to create token:', error);
            toast.error('Failed to create token. Please try again.');
        }
    };

    const handleMintTokens = async () => {
        try {
            const signature = await mintTokens(mintAddress, mintToAddress, parseFloat(mintAmount));
            toast.success(
                <TransactionToast
                    signature={signature}
                    status="success"
                    message={`Successfully minted ${mintAmount} tokens!`}
                />
            );
            setMintAmount('');
        } catch (err) {
            console.error('Mint tokens error:', err);
            toast.error('Failed to mint tokens. Please check the console for details.');
        }
    };

    const handleTransferTokens = async () => {
        try {
            const signature = await transferTokens(transferMint, transferToAddress, parseFloat(transferAmount));
            toast.success(
                <TransactionToast
                    signature={signature}
                    status="success"
                    message={`Successfully transferred ${transferAmount} tokens!`}
                />
            );
            setTransferAmount('');
        } catch (err) {
            console.error('Transfer tokens error:', err);
            toast.error('Failed to transfer tokens. Please check the console for details.');
        }
    };

    const handleGetTokenInfo = async () => {
        try {
            const info = await getTokenInfo(infoMint);
            setTokenInfo(info);
            toast.success('Token information retrieved successfully!');
        } catch (err) {
            console.error('Get token info error:', err);
            toast.error('Failed to get token information. Please check the mint address.');
        }
    };

    if (!publicKey) {
        return (
            <div className="text-center py-5 text-muted">
                <User size={48} className="mb-3 opacity-50" />
                <p>Please connect your wallet to manage SPL tokens</p>
            </div>
        );
    }

    return (
        <div>
            <ul className="nav nav-pills nav-fill mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'create' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        <Plus size={14} />
                        Create
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'mint' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('mint')}
                    >
                        <DollarSign size={14} />
                        Mint
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'transfer' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('transfer')}
                    >
                        <Send size={14} />
                        Transfer
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-flex align-items-center justify-content-center gap-1 ${
                            activeTab === 'info' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('info')}
                    >
                        <RefreshCw size={14} />
                        Info
                    </button>
                </li>
            </ul>

            {/* CREATE TAB */}
            {activeTab === 'create' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Create New SPL Token</h6>
                    <div className="mb-3">
                        <label className="form-label">Decimals</label>
                        <input
                            type="number"
                            className="form-control"
                            value={decimals}
                            onChange={e => setDecimals(e.target.value)}
                            placeholder="9"
                            min="0"
                            max="9"
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleCreateToken}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="spinner-border spinner-border-sm" />
                                Creating Token...
                            </>
                        ) : (
                            <>
                                <Plus size={16} />
                                Create Token Mint
                            </>
                        )}
                    </button>

                    {createdMint && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="badge bg-success">✓ Token Created</span>
                                <a
                                    href={getExplorerUrl(createdMint, 'address', cluster)}
                                    target="_blank"
                                    className="small text-decoration-none"
                                    rel="noreferrer"
                                >
                                    View on Explorer <ExternalLink size={12} />
                                </a>
                            </div>
                            <small className="text-muted d-block mb-1">Mint Address:</small>
                            <div className="input-group input-group-sm">
                                <input
                                    type="text"
                                    className="form-control font-monospace"
                                    style={{ fontSize: '0.75rem' }}
                                    value={createdMint}
                                    readOnly
                                />
                                <button className="btn btn-outline-secondary" onClick={() => handleCopy(createdMint)}>
                                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MINT TAB */}
            {activeTab === 'mint' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Mint Tokens to Address</h6>
                    <div className="mb-3">
                        <label className="form-label">Token Mint Address</label>
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.85rem' }}
                            value={mintAddress}
                            onChange={e => setMintAddress(e.target.value)}
                            placeholder="Token mint address"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Recipient Address</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control font-monospace"
                                style={{ fontSize: '0.85rem' }}
                                value={mintToAddress}
                                onChange={e => setMintToAddress(e.target.value)}
                                placeholder="Recipient address"
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => publicKey && setMintToAddress(publicKey.toBase58())}
                            >
                                My Wallet
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={mintAmount}
                            onChange={e => setMintAmount(e.target.value)}
                            placeholder="100"
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleMintTokens}
                        disabled={loading || !mintAddress || !mintToAddress || !mintAmount}
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="spinner-border spinner-border-sm" />
                                Minting...
                            </>
                        ) : (
                            <>
                                <DollarSign size={16} />
                                Mint Tokens
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* TRANSFER TAB */}
            {activeTab === 'transfer' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Transfer Tokens</h6>
                    <div className="mb-3">
                        <label className="form-label">Token Mint Address</label>
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.85rem' }}
                            value={transferMint}
                            onChange={e => setTransferMint(e.target.value)}
                            placeholder="Token mint address"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Recipient Address</label>
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.85rem' }}
                            value={transferToAddress}
                            onChange={e => setTransferToAddress(e.target.value)}
                            placeholder="Recipient address"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={transferAmount}
                            onChange={e => setTransferAmount(e.target.value)}
                            placeholder="10"
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleTransferTokens}
                        disabled={loading || !transferMint || !transferToAddress || !transferAmount}
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="spinner-border spinner-border-sm" />
                                Transferring...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Transfer Tokens
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
                <div className="testing-form-section">
                    <h6 className="mb-3">Token Info & Balance</h6>
                    <div className="mb-3">
                        <label className="form-label">Token Mint Address</label>
                        <input
                            type="text"
                            className="form-control font-monospace"
                            style={{ fontSize: '0.85rem' }}
                            value={infoMint}
                            onChange={e => setInfoMint(e.target.value)}
                            placeholder="Token mint address"
                        />
                    </div>
                    <button
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleGetTokenInfo}
                        disabled={loading || !infoMint}
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="spinner-border spinner-border-sm" />
                                Fetching...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                Get Token Info
                            </>
                        )}
                    </button>

                    {tokenInfo && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="row">
                                <div className="col-6">
                                    <small className="text-muted d-block">Decimals:</small>
                                    <span className="fs-5 fw-semibold">{tokenInfo.decimals}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Balance:</small>
                                    <span className="fs-5 fw-semibold text-success">{tokenInfo.balance || '0'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
