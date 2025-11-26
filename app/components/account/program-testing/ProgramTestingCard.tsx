'use client';

import { useAnchorProgram } from '@/app/providers/anchor';
import { useCluster } from '@/app/providers/cluster';
import { useProgramTesting } from '@/app/providers/program-testing';
import { UpgradeableLoaderAccountData } from '@providers/accounts';
import { PublicKey } from '@solana/web3.js';
import InstructionSelector from './InstructionSelector';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import InstructionForm from './InstructionForm';

export function ProgramTestingCard({ data, pubkey }: { data: UpgradeableLoaderAccountData; pubkey: PublicKey }) {
    const { url, cluster } = useCluster();
    const { idl, program } = useAnchorProgram(pubkey.toString(), url, cluster);

    const { activeInstruction, getInstructionState } = useProgramTesting();

    if (!idl) {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-header-title mb-0">Program Testing</h3>
                </div>
                <div className="card-body text-center">
                    <p>No IDL found for this program. Testing requires an Anchor IDL.</p>
                    <small className="text-muted">
                        The program must have an IDL uploaded on-chain using Anchor's IDL deployment.
                    </small>
                </div>
            </div>
        );
    }

    const instructions = idl.instructions || [];
    const currentState = getInstructionState(activeInstruction || instructions[0].name) || null;
    const currentInstruction = instructions.find(instruction => instruction.name === activeInstruction) || null;

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 className="card-header-title mb-0">Program Testing</h3>
                        <small className="text-muted">
                            {idl.metadata?.name || 'Anchor Program'}{' '}
                            {idl.metadata?.version && `v${idl.metadata.version}`}
                        </small>
                    </div>
                    <WalletMultiButton />
                </div>
            </div>
            <div className="card-body">
                <InstructionSelector idl={idl} />

                {currentInstruction && <InstructionForm instruction={currentInstruction} idl={idl} />}
            </div>
        </div>
    );
}
