'use client';

import { useProgramTesting } from '@/app/providers/program-testing';
import { useHotkeys } from '@mantine/hooks';
import { Idl } from '@coral-xyz/anchor';
import { useCallback, useMemo, useState } from 'react';
import { Check, ChevronDown } from 'react-feather';
import './program-testing.css';
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
            <label className="form-label">Select Instruction</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        role="combobox"
                        aria-expanded={open}
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{
                            minHeight: '45px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setOpen(!open)}
                    >
                        <span className={selectedInstruction ? '' : 'text-muted'}>
                            {selectedInstruction ? selectedInstruction.label : 'Search for an instruction...'}
                        </span>
                        <ChevronDown size={16} className="text-muted" />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 instruction-popover"
                    style={{
                        width: 'var(--radix-popover-trigger-width)',
                    }}
                    align="start"
                >
                    <Command className="instruction-command">
                        <CommandInput placeholder="Search instructions..." />
                        <CommandList>
                            <CommandEmpty className="text-muted">No instruction found.</CommandEmpty>
                            <CommandGroup>
                                {instructions.map(instruction => (
                                    <CommandItem
                                        key={instruction.value}
                                        value={instruction.value}
                                        onSelect={handleSelect}
                                        className="instruction-item"
                                    >
                                        <Check
                                            className="me-2"
                                            size={16}
                                            style={{
                                                opacity: instruction.value === activeInstruction ? 1 : 0,
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
                <small className="mt-2 d-block text-muted">
                    Press <kbd>Ctrl+K</kbd> to quickly search
                </small>
            )}
        </div>
    );
}
