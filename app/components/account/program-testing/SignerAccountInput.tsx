import { useEffect, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/shared/ui/popover';
import { Check, CheckCircle, ChevronDown, Info, PenTool, Plus, AlertTriangle, User } from 'react-feather';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/app/components/shared/ui/command';
import type { ModIdlAccount } from '@/app/types/idl-types';
import { useWallet } from '@solana/wallet-adapter-react';
import './program-testing.css';

type OptionType = 'Connected Wallet' | 'Generate New' | 'Manual Input';
const options: OptionType[] = ['Connected Wallet', 'Generate New', 'Manual Input'];

interface SignerAccountInputProps {
    account: ModIdlAccount | null;
    signerAccountAddress: string | null;
    signerAccountKeypair: Keypair | null;
    onChange: (address: string | null, keypair: Keypair | null) => void;
}

const SignerAccountInput = (props: SignerAccountInputProps) => {
    const { account, onChange, signerAccountAddress, signerAccountKeypair } = props;
    const { publicKey } = useWallet();
    const [selectedMode, setSelectedMode] = useState<OptionType>('Connected Wallet');
    const [open, setOpen] = useState(false);

    const getIconForMode = (mode: OptionType) => {
        switch (mode) {
            case 'Connected Wallet': {
                return <User size={16} />;
            }
            case 'Generate New': {
                return <Plus size={16} />;
            }
            case 'Manual Input': {
                return <PenTool size={16} />;
            }
            default: {
                return null;
            }
        }
    };

    useEffect(() => {
        if (selectedMode === 'Connected Wallet') {
            onChange(publicKey?.toBase58() ?? null, null);
        } else if (selectedMode === 'Generate New') {
            const newKeyPair = Keypair.generate();
            onChange(newKeyPair.publicKey.toBase58(), newKeyPair);
        }
        // using onChange as dependency causes infinite re-render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMode, publicKey]);

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <label htmlFor="signerAccount" className="form-label mb-0 d-flex align-items-center gap-2">
                    {account?.name}
                    <span title="This is a signer account. In most cases, it's the wallet connected to the app. You can use the dropdown for more options.">
                        <Info size={14} className="text-muted" />
                    </span>
                </label>

                <span className="badge badge-pda d-inline-flex align-items-center gap-1">
                    <PenTool size={12} />
                    Signer
                </span>
            </div>

            <div className="input-group">
                <span className="input-group-text">
                    {selectedMode === 'Manual Input' ? (
                        <span title="Since private key is required for signing transaction, just pubkey doesn't work.">
                            <AlertTriangle size={16} color="#ffc107" />
                        </span>
                    ) : selectedMode === 'Connected Wallet' && signerAccountAddress ? (
                        <CheckCircle size={16} color="#28a745" />
                    ) : selectedMode === 'Generate New' && signerAccountKeypair ? (
                        <CheckCircle size={16} color="#28a745" />
                    ) : null}
                </span>

                <input
                    id="signerAccount"
                    type="text"
                    className="form-control"
                    placeholder="Enter value for signer account"
                    value={signerAccountAddress ?? ''}
                    onChange={e => onChange(e.target.value, null)}
                />

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            role="combobox"
                            aria-expanded={open}
                            className="btn btn-outline-secondary d-flex align-items-center justify-content-between"
                            style={{ minWidth: '180px' }}
                        >
                            <span className="d-flex align-items-center gap-2">
                                {getIconForMode(selectedMode)}
                                {selectedMode ? options.find(mode => mode === selectedMode) : 'Select mode...'}
                            </span>
                            <ChevronDown size={16} className="text-muted ms-2" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 instruction-popover" style={{ width: '200px' }}>
                        <Command className="instruction-command">
                            <CommandInput placeholder="Search mode..." />
                            <CommandList>
                                <CommandEmpty>No mode found.</CommandEmpty>
                                <CommandGroup>
                                    {options.map(mode => (
                                        <CommandItem
                                            key={mode}
                                            value={mode}
                                            onSelect={currentValue => {
                                                setSelectedMode(currentValue as OptionType);
                                                setOpen(false);
                                            }}
                                            className="instruction-item"
                                        >
                                            <span className="d-flex align-items-center gap-2">
                                                {getIconForMode(mode)}
                                                {mode}
                                            </span>
                                            <Check
                                                size={16}
                                                style={{
                                                    marginLeft: 'auto',
                                                    opacity: selectedMode === mode ? 1 : 0,
                                                }}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default SignerAccountInput;
