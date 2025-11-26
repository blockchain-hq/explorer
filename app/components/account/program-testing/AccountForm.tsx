import type { ModIdlAccount } from '@/app/types/idl-types';
import SignerAccountInput from './SignerAccountInput';
import { isAccountPda, getPDAStatusMessage, getPDADependencies } from '@/app/utils/program-testing/pda';
import { Key, Loader, CheckCircle, AlertCircle, Info, RefreshCw } from 'react-feather';
import type { Keypair } from '@solana/web3.js';
import { useCallback } from 'react';
import './program-testing.css';
// import { useSavedAccounts } from '@/app/context/SavedAccountsContext';

interface AccountsFormv2Props {
    accounts: ModIdlAccount[] | null;
    accountsAddressMap: Map<string, string | null>;
    onAccountChange: (accountsAddressMap: Map<string, string | null>) => void;
    signersKeypairs: Map<string, Keypair>;
    onSignerChange: (signersKeypairs: Map<string, Keypair>) => void;
    validationErrors: Record<string, string>;
    formData: Record<string, string | number>;
    derivedPDAs: Map<
        string,
        {
            address: string;
            status: 'idle' | 'deriving' | 'ready' | 'error';
            error?: string;
        }
    >;
}

const AccountsFormv2 = (props: AccountsFormv2Props) => {
    const {
        accounts,
        accountsAddressMap,
        onAccountChange,
        signersKeypairs,
        onSignerChange,
        validationErrors,
        formData,
        derivedPDAs,
    } = props;

    // const { savedAccounts } = useSavedAccounts();

    const handleAccountChange = useCallback(
        (accountName: string, address: string | null) => {
            const newMap = new Map(accountsAddressMap);
            newMap.set(accountName, address);
            onAccountChange(newMap);
        },
        [accountsAddressMap, onAccountChange]
    );

    const handleSignerChange = useCallback(
        (accountName: string, address: string | null, keypair: Keypair | null) => {
            handleAccountChange(accountName, address);
            const newSignersMap = new Map(signersKeypairs);
            if (keypair) {
                newSignersMap.set(accountName, keypair);
            } else {
                newSignersMap.delete(accountName);
            }
            onSignerChange(newSignersMap);
        },
        [signersKeypairs, onSignerChange, handleAccountChange]
    );

    const handleClearPDA = useCallback(
        (accountName: string) => {
            handleAccountChange(accountName, null);
        },
        [handleAccountChange]
    );

    const getPDABadge = (account: ModIdlAccount) => {
        if (!isAccountPda(account)) return null;

        const derivedStatus = derivedPDAs.get(account.name);

        if (derivedStatus?.status === 'deriving') {
            return (
                <span
                    className="badge badge-pda-deriving d-inline-flex align-items-center gap-1"
                    title="Calculating PDA address..."
                >
                    <Loader size={12} className="spinner-border spinner-border-sm" />
                    Deriving
                </span>
            );
        }

        if (derivedStatus?.status === 'ready') {
            return (
                <span
                    className="badge badge-pda-ready d-inline-flex align-items-center gap-1"
                    title="Address automatically derived"
                >
                    <CheckCircle size={12} />
                    Auto-PDA
                </span>
            );
        }

        if (derivedStatus?.status === 'error') {
            return (
                <span
                    className="badge badge-pda-error d-inline-flex align-items-center gap-1"
                    title={derivedStatus.error}
                >
                    <AlertCircle size={12} />
                    Error
                </span>
            );
        }

        return (
            <span
                className="badge badge-pda d-inline-flex align-items-center gap-1"
                title="Program Derived Address - will auto-calculate"
            >
                <Key size={12} />
                PDA
            </span>
        );
    };

    const getPDAStatus = (account: ModIdlAccount) => {
        if (!isAccountPda(account)) return null;

        const derivedStatus = derivedPDAs.get(account.name);
        const hasAddress = accountsAddressMap.get(account.name);

        if (derivedStatus?.status === 'ready' && hasAddress) {
            return (
                <div className="status-message status-success">
                    <CheckCircle size={14} />
                    <span>Auto-derived successfully</span>
                </div>
            );
        }

        if (derivedStatus?.status === 'deriving') {
            return (
                <div className="status-message status-warning">
                    <Loader size={14} className="spinner-border spinner-border-sm" />
                    <span>Calculating PDA address...</span>
                </div>
            );
        }

        if (derivedStatus?.status === 'error') {
            return (
                <div className="status-message status-error">
                    <AlertCircle size={14} />
                    <span>{derivedStatus.error || 'Failed to derive PDA'}</span>
                </div>
            );
        }

        if (derivedStatus?.status === 'idle' || !derivedStatus) {
            const statusMessage = getPDAStatusMessage(account, formData, accountsAddressMap);

            if (statusMessage.includes('Waiting for')) {
                const deps = getPDADependencies(account);
                const missingDeps = [
                    ...deps.args.filter(arg => !formData[arg]),
                    ...deps.accounts.filter(acc => !accountsAddressMap.get(acc)),
                ];

                return (
                    <div className="status-message status-info">
                        <Info size={14} />
                        <div>
                            <strong>Waiting for dependencies:</strong>
                            <ul className="mb-0 mt-1 ps-3">
                                {missingDeps.map(dep => (
                                    <li key={dep}>{dep}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            }
        }

        return null;
    };

    const getInputClassName = (account: ModIdlAccount) => {
        let className = 'form-control';

        if (!isAccountPda(account)) {
            if (validationErrors[account.name]) {
                className += ' is-invalid';
            }
            return className;
        }

        const derivedStatus = derivedPDAs.get(account.name);

        if (derivedStatus?.status === 'deriving') {
            className += ' pda-deriving';
        } else if (derivedStatus?.status === 'ready') {
            className += ' pda-ready';
        } else if (derivedStatus?.status === 'error' || validationErrors[account.name]) {
            className += ' pda-error';
        }

        return className;
    };

    if (!accounts) return null;

    const getDataListId = (accountName: string) => {
        return `${accountName}-suggestions`;
    };

    // const getFilteredSuggestions = (accountName: string) => {
    //     return savedAccounts
    //         .filter(savedAcc => savedAcc.accountName === accountName)
    //         .sort((a, b) => b.timestamp - a.timestamp)
    //         .slice(0, 10);
    // };

    return (
        <div className="testing-form-section">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="mb-0">{accounts.length > 0 ? `Accounts (${accounts.length})` : 'No Accounts'}</h4>

                {accounts.length > 0 && (
                    <div className="d-flex gap-2">
                        {accounts.filter(isAccountPda).length > 0 && (
                            <span className="badge bg-secondary">{accounts.filter(isAccountPda).length} PDA</span>
                        )}
                        {accounts.filter(a => a.signer).length > 0 && (
                            <span className="badge bg-secondary">{accounts.filter(a => a.signer).length} Signer</span>
                        )}
                    </div>
                )}
            </div>

            {accounts.map(account =>
                account.signer ? (
                    <SignerAccountInput
                        key={account.name}
                        account={account}
                        signerAccountAddress={accountsAddressMap.get(account.name) ?? null}
                        signerAccountKeypair={signersKeypairs.get(account.name) ?? null}
                        onChange={(address, keypair) => handleSignerChange(account.name, address, keypair)}
                    />
                ) : (
                    <div
                        key={account.name}
                        className={
                            isAccountPda(account) && derivedPDAs.get(account.name)?.status === 'ready'
                                ? 'account-row-pda-ready'
                                : 'mb-3'
                        }
                    >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <label htmlFor={account.name} className="form-label mb-0">
                                {account.name}
                            </label>

                            <div className="d-flex align-items-center gap-2">
                                {account.writable && (
                                    <span className="badge bg-secondary" title="This account will be modified">
                                        Writable
                                    </span>
                                )}
                                {getPDABadge(account)}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <input
                                id={account.name}
                                type="text"
                                value={accountsAddressMap.get(account.name) ?? ''}
                                placeholder={
                                    isAccountPda(account)
                                        ? 'Will auto-derive when ready...'
                                        : `Enter ${account.name} address`
                                }
                                onChange={e => handleAccountChange(account.name, e.target.value)}
                                className={getInputClassName(account)}
                                readOnly={isAccountPda(account) && derivedPDAs.get(account.name)?.status === 'deriving'}
                                disabled={isAccountPda(account) && derivedPDAs.get(account.name)?.status === 'deriving'}
                                list={getDataListId(account.name)}
                            />

                            <datalist id={getDataListId(account.name)}>
                                {/* {getFilteredSuggestions(account.name).map(savedAcc => (
                                    <option key={savedAcc.address} value={savedAcc.address} />
                                ))} */}
                            </datalist>

                            {isAccountPda(account) && derivedPDAs.get(account.name)?.status === 'ready' && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleClearPDA(account.name)}
                                    title="Clear and re-derive"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            )}
                        </div>

                        {getPDAStatus(account)}

                        {validationErrors[account.name] && (
                            <div className="invalid-feedback d-flex">
                                <AlertCircle size={14} />
                                <span>{validationErrors[account.name]}</span>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default AccountsFormv2;
