'use client';

import React, { useMemo, useCallback, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletError } from '@solana/wallet-adapter-base';
import { useCluster } from './cluster';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
    children: ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
    const { url } = useCluster();

    // Use the cluster URL from Explorer's context
    const endpoint = useMemo(() => url, [url]);

    const onError = useCallback((error: WalletError) => {
        console.error('Wallet error:', error);
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect onError={onError}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
