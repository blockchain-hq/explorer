'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/shared/ui/dialog';
import { Tool, Calendar, DollarSign, Hash, Clock, Database, Key, Layers, Divide } from 'react-feather';
import './program-testing.css';
import { TimestampConverter } from './utilityTools/TimestampConverter';
import { LamportsConverter } from './utilityTools/LamportsConverter';
import { StringEncoder } from './utilityTools/StringEncoder';
import { DurationPicker } from './utilityTools/DurationPicker';
import { ProgramAccountsViewer } from './utilityTools/ProgramAccountsViewer';
import { SPLTokenManager } from './utilityTools/SPLTokenManager';
import { KeypairManager } from './utilityTools/KeypairManager';

type MainTab = 'blockchain' | 'converters';
type BlockchainSubTab = 'accounts' | 'spl-token' | 'keypair';
type ConverterSubTab = 'timestamp' | 'lamports' | 'string' | 'duration';

export function UtilityDialog() {
    const [open, setOpen] = useState(false);
    const [mainTab, setMainTab] = useState<MainTab>('blockchain');
    const [blockchainTab, setBlockchainTab] = useState<BlockchainSubTab>('accounts');
    const [converterTab, setConverterTab] = useState<ConverterSubTab>('timestamp');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px', padding: 0 }}
                    id="utility-dialog-trigger"
                >
                    <Tool size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="utility-dialog-content" style={{ maxWidth: '700px', maxHeight: '85vh' }}>
                <DialogHeader>
                    <DialogTitle className="d-flex align-items-center gap-2">
                        <Tool size={20} className="text-primary" />
                        Utility Tools
                    </DialogTitle>
                    <DialogDescription>Helpful tools for working with Solana programs</DialogDescription>
                </DialogHeader>

                {/* Main Tabs */}
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link d-flex align-items-center gap-2 ${
                                mainTab === 'blockchain' ? 'active' : ''
                            }`}
                            onClick={() => setMainTab('blockchain')}
                        >
                            <Layers size={16} />
                            Blockchain Tools
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link d-flex align-items-center gap-2 ${
                                mainTab === 'converters' ? 'active' : ''
                            }`}
                            onClick={() => setMainTab('converters')}
                        >
                            <Divide size={16} />
                            Data Converters
                        </button>
                    </li>
                </ul>

                {/* Blockchain Tools */}
                {mainTab === 'blockchain' && (
                    <div>
                        <ul className="nav nav-pills nav-fill mb-3">
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        blockchainTab === 'accounts' ? 'active' : ''
                                    }`}
                                    onClick={() => setBlockchainTab('accounts')}
                                >
                                    <Database size={14} />
                                    Accounts
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        blockchainTab === 'spl-token' ? 'active' : ''
                                    }`}
                                    onClick={() => setBlockchainTab('spl-token')}
                                >
                                    <DollarSign size={14} />
                                    SPL Token
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        blockchainTab === 'keypair' ? 'active' : ''
                                    }`}
                                    onClick={() => setBlockchainTab('keypair')}
                                >
                                    <Key size={14} />
                                    Keypair
                                </button>
                            </li>
                        </ul>
                        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            {blockchainTab === 'accounts' && <ProgramAccountsViewer />}
                            {blockchainTab === 'spl-token' && <SPLTokenManager />}
                            {blockchainTab === 'keypair' && <KeypairManager />}
                        </div>
                    </div>
                )}

                {/* Converters */}
                {mainTab === 'converters' && (
                    <div>
                        <ul className="nav nav-pills nav-fill mb-3">
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        converterTab === 'timestamp' ? 'active' : ''
                                    }`}
                                    onClick={() => setConverterTab('timestamp')}
                                >
                                    <Calendar size={14} />
                                    Timestamp
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        converterTab === 'lamports' ? 'active' : ''
                                    }`}
                                    onClick={() => setConverterTab('lamports')}
                                >
                                    <DollarSign size={14} />
                                    Lamports
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        converterTab === 'string' ? 'active' : ''
                                    }`}
                                    onClick={() => setConverterTab('string')}
                                >
                                    <Hash size={14} />
                                    String
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link d-flex align-items-center justify-content-center gap-2 ${
                                        converterTab === 'duration' ? 'active' : ''
                                    }`}
                                    onClick={() => setConverterTab('duration')}
                                >
                                    <Clock size={14} />
                                    Duration
                                </button>
                            </li>
                        </ul>
                        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            {converterTab === 'timestamp' && <TimestampConverter />}
                            {converterTab === 'lamports' && <LamportsConverter />}
                            {converterTab === 'string' && <StringEncoder />}
                            {converterTab === 'duration' && <DurationPicker />}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
