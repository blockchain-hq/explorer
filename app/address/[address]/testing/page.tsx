import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

import TestingPageClient from './page-client';

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `Testing interface for the program with address ${props.params.address} on Solana`,
        title: `Testing | ${await getReadableTitleFromAddress(props)} | Solana`,
    };
}

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export default function TestingPage(props: Props) {
    return <TestingPageClient {...props} />;
}
