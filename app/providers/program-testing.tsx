'use client';

import type { Keypair } from '@solana/web3.js';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type InstructionFormData = Record<string, any>;

export type InstructionState = {
    formData: InstructionFormData;
    accountsAddresses: Map<string, string | null>;
    signersKeypairs: Map<string, Keypair>;
    lastUpdated?: Date;
};

export type GlobalInstructionsState = Record<string, InstructionState>;

type ProgramTestingContextType = {
    instructionsState: GlobalInstructionsState;
    activeInstruction: string | null;
    setActiveInstruction: (name: string) => void;
    updateInstructionState: (name: string, updates: Partial<InstructionState>) => void;
    getInstructionState: (name: string) => InstructionState;
    clearInstructionState: (name: string) => void;
    clearAllState: () => void;
};

const ProgramTestingContext = createContext<ProgramTestingContextType | null>(null);

export function ProgramTestingProvider({ children }: { children: ReactNode }) {
    const [instructionsState, setInstructionsState] = useState<GlobalInstructionsState>({});
    const [activeInstruction, setActiveInstruction] = useState<string | null>(null);

    const updateInstructionState = useCallback((name: string, updates: Partial<InstructionState>) => {
        setInstructionsState(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                ...updates,
                lastUpdated: new Date(),
            },
        }));
    }, []);

    const getInstructionState = useCallback(
        (name: string): InstructionState => {
            return (
                instructionsState[name] || {
                    accountsAddresses: new Map<string, string | null>(),
                    formData: {},
                    signersKeypairs: new Map<string, Keypair>(),
                }
            );
        },
        [instructionsState]
    );

    const clearInstructionState = useCallback((name: string) => {
        setInstructionsState(prev => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    }, []);

    const clearAllState = useCallback(() => {
        setInstructionsState({});
        setActiveInstruction(null);
    }, []);

    return (
        <ProgramTestingContext.Provider
            value={{
                activeInstruction,
                clearAllState,
                clearInstructionState,
                getInstructionState,
                instructionsState,
                setActiveInstruction,
                updateInstructionState,
            }}
        >
            {children}
        </ProgramTestingContext.Provider>
    );
}

export function useProgramTesting() {
    const context = useContext(ProgramTestingContext);
    if (!context) {
        throw new Error('useProgramTesting must be used within ProgramTestingProvider');
    }
    return context;
}
