'use client';

import { useProgramTesting } from '@/app/providers/program-testing';
import { useHotkeys } from '@mantine/hooks';
import { Idl } from '@coral-xyz/anchor';
import { useCallback, useMemo, useState } from 'react';
import { Check, ChevronDown } from 'react-feather';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/app/components/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/shared/ui/popover';

type Props = Readonly<{
    idl: Idl;
}>;

export default function InstructionSelector({ idl }: Props) {
    const { activeInstruction, setActiveInstruction } = useProgramTesting();
    const [open, setOpen] = useState(false);

    const instructions = useMemo(() => {
        return (idl.instructions || []).map(instruction => ({
            label: instruction.name,
            value: instruction.name,
        }));
    }, [idl.instructions]);

    const selectedInstruction = useMemo(() => {
        return instructions.find(i => i.value === activeInstruction);
    }, [instructions, activeInstruction]);

    const handleSelect = useCallback(
        (value: string) => {
            setActiveInstruction(value === activeInstruction ? '' : value);
            setOpen(false);
        },
        [activeInstruction, setActiveInstruction]
    );

    // Keyboard shortcut handler
    const onHotKeyPressHandler = useCallback(() => {
        setOpen(true);
    }, []);

    // Focus search on Ctrl+K
    useHotkeys([['mod+k', onHotKeyPressHandler]], ['INPUT', 'TEXTAREA']);

    return (
        <div className="mb-4">
            <label className="form-label" style={{ color: '#95aac9' }}>
                Select Instruction
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        role="combobox"
                        aria-expanded={open}
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{
                            minHeight: '45px',
                            cursor: 'pointer',
                            backgroundColor: '#1e2423',
                            borderColor: '#282d2b',
                            color: selectedInstruction ? '#fff' : '#6e84a3',
                        }}
                        onClick={() => setOpen(!open)}
                    >
                        <span>{selectedInstruction ? selectedInstruction.label : 'Search for an instruction...'}</span>
                        <ChevronDown size={16} style={{ opacity: 0.5 }} />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    style={{
                        backgroundColor: '#1e2423',
                        borderColor: '#282d2b',
                        boxShadow: '0 0.75rem 1.5rem rgba(20, 24, 22, 0.5)',
                        width: 'var(--radix-popover-trigger-width)',
                    }}
                    align="start"
                >
                    <Command
                        style={{
                            backgroundColor: '#1e2423',
                            color: '#95aac9',
                        }}
                    >
                        <CommandInput
                            placeholder="Search instructions..."
                            style={{
                                backgroundColor: '#1e2423',
                                borderColor: '#282d2b',
                                color: '#fff',
                            }}
                        />
                        <CommandList style={{ backgroundColor: '#1e2423' }}>
                            <CommandEmpty style={{ color: '#6e84a3' }}>No instruction found.</CommandEmpty>
                            <CommandGroup style={{ backgroundColor: '#1e2423' }}>
                                {instructions.map(instruction => (
                                    <CommandItem
                                        key={instruction.value}
                                        value={instruction.value}
                                        onSelect={handleSelect}
                                        style={{
                                            color: '#fff',
                                            cursor: 'pointer',
                                        }}
                                        className="instruction-item"
                                    >
                                        <Check
                                            className="mr-2 h-4 w-4"
                                            style={{
                                                opacity: instruction.value === activeInstruction ? 1 : 0,
                                                color: '#2c7be5',
                                            }}
                                        />
                                        {instruction.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedInstruction && (
                <small className="mt-2 d-block" style={{ color: '#6e84a3' }}>
                    Press{' '}
                    <kbd style={{ backgroundColor: '#12302b', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                        Ctrl+K
                    </kbd>{' '}
                    to quickly search
                </small>
            )}
        </div>
    );
}
