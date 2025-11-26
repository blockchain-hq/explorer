'use client';

import { ParsedAccountRenderer } from '@/app/components/account/ParsedAccountRenderer';
import { ProgramTestingCard } from '@/app/components/account/program-testing/ProgramTestingCard';
import { ErrorCard } from '@/app/components/common/ErrorCard';
import { ProgramTestingProvider } from '@/app/providers/program-testing';
import { WalletContextProvider } from '@/app/providers/wallet';
import { SavedAccountsProvider } from '@/app/providers/program-testing/saved-accounts';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

function ProgramTestingCardRenderer({
    account,
    onNotFound,
}: React.ComponentProps<React.ComponentProps<typeof ParsedAccountRenderer>['renderComponent']>) {
    const parsedData = account?.data?.parsed;
    if (!parsedData || parsedData?.program !== 'bpf-upgradeable-loader') {
        // only show for bpf-upgradeable-loader programs
        return onNotFound();
    }

    return (
        <ErrorBoundary fallback={<ErrorCard text="Error loading testing information" />}>
            <WalletContextProvider>
                <SavedAccountsProvider>
                    <ProgramTestingProvider>
                        <ProgramTestingCard data={parsedData} pubkey={account.pubkey} />
                    </ProgramTestingProvider>
                </SavedAccountsProvider>
            </WalletContextProvider>
        </ErrorBoundary>
    );
}

export default function TestingPageClient({ params }: Props) {
    const { address } = params;
    return <ParsedAccountRenderer address={address} renderComponent={ProgramTestingCardRenderer} />;
}
