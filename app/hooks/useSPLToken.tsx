'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { useState } from 'react';

// Helper to get associated token address
function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): PublicKey {
    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return address;
}

// Helper to create associated token account instruction
function createAssociatedTokenAccountInstruction(
    payer: PublicKey,
    associatedToken: PublicKey,
    owner: PublicKey,
    mint: PublicKey
): TransactionInstruction {
    return new TransactionInstruction({
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: associatedToken, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: false, isWritable: false },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.alloc(0),
    });
}

export function useSPLToken() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);

    const createToken = async (decimals: number): Promise<string> => {
        if (!publicKey) throw new Error('Wallet not connected');
        setLoading(true);
        try {
            const mintKeypair = Keypair.generate();
            const lamports = await connection.getMinimumBalanceForRentExemption(MintLayout.span);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: MintLayout.span,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mintKeypair.publicKey, decimals, publicKey, publicKey)
            );

            const signature = await sendTransaction(transaction, connection, {
                signers: [mintKeypair],
            });
            await connection.confirmTransaction(signature, 'confirmed');

            return mintKeypair.publicKey.toBase58();
        } finally {
            setLoading(false);
        }
    };

    const mintTokens = async (mintAddress: string, toAddress: string, amount: number): Promise<string> => {
        if (!publicKey) throw new Error('Wallet not connected');
        setLoading(true);
        try {
            const mint = new PublicKey(mintAddress);
            const recipient = new PublicKey(toAddress);

            // Get mint info to know decimals
            const mintAccountInfo = await connection.getAccountInfo(mint);
            if (!mintAccountInfo) throw new Error('Mint account not found');
            const mintData = MintLayout.decode(mintAccountInfo.data);
            const decimals = mintData.decimals;

            // Get associated token address for recipient
            const recipientAta = getAssociatedTokenAddress(mint, recipient);

            const transaction = new Transaction();

            // Check if ATA exists, if not create it
            const ataInfo = await connection.getAccountInfo(recipientAta);
            if (!ataInfo) {
                transaction.add(createAssociatedTokenAccountInstruction(publicKey, recipientAta, recipient, mint));
            }

            // Add mint instruction
            transaction.add(
                Token.createMintToInstruction(
                    TOKEN_PROGRAM_ID,
                    mint,
                    recipientAta,
                    publicKey,
                    [],
                    amount * Math.pow(10, decimals)
                )
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            return signature;
        } finally {
            setLoading(false);
        }
    };

    const transferTokens = async (mintAddress: string, toAddress: string, amount: number): Promise<string> => {
        if (!publicKey) throw new Error('Wallet not connected');
        setLoading(true);
        try {
            const mint = new PublicKey(mintAddress);
            const recipient = new PublicKey(toAddress);

            // Get mint info to know decimals
            const mintAccountInfo = await connection.getAccountInfo(mint);
            if (!mintAccountInfo) throw new Error('Mint account not found');
            const mintData = MintLayout.decode(mintAccountInfo.data);
            const decimals = mintData.decimals;

            // Get associated token addresses
            const fromAta = getAssociatedTokenAddress(mint, publicKey);
            const toAta = getAssociatedTokenAddress(mint, recipient);

            const transaction = new Transaction();

            // Check if recipient ATA exists, if not create it
            const toAtaInfo = await connection.getAccountInfo(toAta);
            if (!toAtaInfo) {
                transaction.add(createAssociatedTokenAccountInstruction(publicKey, toAta, recipient, mint));
            }

            // Add transfer instruction
            transaction.add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    fromAta,
                    toAta,
                    publicKey,
                    [],
                    amount * Math.pow(10, decimals)
                )
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            return signature;
        } finally {
            setLoading(false);
        }
    };

    const getTokenInfo = async (
        mintAddress: string
    ): Promise<{ mint: string; decimals: number; tokenAccount?: string; balance?: string }> => {
        if (!publicKey) throw new Error('Wallet not connected');
        setLoading(true);
        try {
            const mint = new PublicKey(mintAddress);

            // Get mint info
            const mintAccountInfo = await connection.getAccountInfo(mint);
            if (!mintAccountInfo) throw new Error('Mint account not found');
            const mintData = MintLayout.decode(mintAccountInfo.data);
            const decimals = mintData.decimals;

            // Get associated token address
            const ata = getAssociatedTokenAddress(mint, publicKey);

            let tokenAccount: string | undefined;
            let balance: string | undefined;

            try {
                const ataInfo = await connection.getAccountInfo(ata);
                if (ataInfo) {
                    tokenAccount = ata.toBase58();
                    const accountData = AccountLayout.decode(ataInfo.data);
                    const rawAmount = accountData.amount;
                    // Handle both BigInt and number
                    const amountNum = typeof rawAmount === 'bigint' ? Number(rawAmount) : rawAmount;
                    balance = (amountNum / Math.pow(10, decimals)).toString();
                } else {
                    balance = '0';
                }
            } catch (e) {
                balance = '0';
            }

            return {
                mint: mintAddress,
                decimals,
                tokenAccount,
                balance,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        createToken,
        mintTokens,
        transferTokens,
        getTokenInfo,
        loading,
    };
}
