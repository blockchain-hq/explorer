'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '@/app/components/shared/utils';
import { Dialog, DialogContent } from '@/app/components/shared/ui/dialog';
import { Search } from 'react-feather';

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            'e-flex e-h-full e-w-full e-flex-col e-overflow-hidden e-rounded-md e-bg-white e-text-neutral-950 dark:e-bg-neutral-950 dark:e-text-neutral-50',
            className
        )}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
    return (
        <Dialog {...props}>
            <DialogContent className="e-overflow-hidden e-p-0">
                <Command className="[&_[cmdk-group-heading]]:e-px-2 [&_[cmdk-group-heading]]:e-font-medium [&_[cmdk-group-heading]]:e-text-neutral-500 dark:[&_[cmdk-group-heading]]:e-text-neutral-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:e-pt-0 [&_[cmdk-group]]:e-px-2 [&_[cmdk-input-wrapper]_svg]:e-h-5 [&_[cmdk-input-wrapper]_svg]:e-w-5 [&_[cmdk-input]]:e-h-12 [&_[cmdk-item]]:e-px-2 [&_[cmdk-item]]:e-py-3 [&_[cmdk-item]_svg]:e-h-5 [&_[cmdk-item]_svg]:e-w-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
};

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="e-flex e-items-center e-border-b e-px-3" cmdk-input-wrapper="">
        <Search className="e-mr-2 e-h-4 e-w-4 e-shrink-0 e-opacity-50" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                'e-flex e-h-10 e-w-full e-rounded-md e-bg-transparent e-py-3 e-text-sm e-outline-none placeholder:e-text-neutral-500 disabled:e-cursor-not-allowed disabled:e-opacity-50 dark:placeholder:e-text-neutral-400',
                className
            )}
            {...props}
        />
    </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn('e-max-h-[300px] e-overflow-y-auto e-overflow-x-hidden', className)}
        {...props}
    />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="e-py-6 e-text-center e-text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            'e-overflow-hidden e-p-1 e-text-neutral-950 dark:e-text-neutral-50 [&_[cmdk-group-heading]]:e-px-2 [&_[cmdk-group-heading]]:e-py-1.5 [&_[cmdk-group-heading]]:e-text-xs [&_[cmdk-group-heading]]:e-font-medium [&_[cmdk-group-heading]]:e-text-neutral-500 dark:[&_[cmdk-group-heading]]:e-text-neutral-400',
            className
        )}
        {...props}
    />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn('e--mx-1 e-h-px e-bg-neutral-200 dark:e-bg-neutral-800', className)}
        {...props}
    />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            'e-relative e-flex e-cursor-default e-select-none e-items-center e-gap-2 e-rounded-sm e-px-2 e-py-1.5 e-text-sm e-outline-none data-[disabled=true]:e-pointer-events-none data-[selected=true]:e-bg-neutral-100 data-[selected=true]:e-text-neutral-900 data-[disabled=true]:e-opacity-50 dark:data-[selected=true]:e-bg-neutral-800 dark:data-[selected=true]:e-text-neutral-50 [&_svg]:e-pointer-events-none [&_svg]:e-size-4 [&_svg]:e-shrink-0',
            className
        )}
        {...props}
    />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                'e-ml-auto e-text-xs e-tracking-widest e-text-neutral-500 dark:e-text-neutral-400',
                className
            )}
            {...props}
        />
    );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};
