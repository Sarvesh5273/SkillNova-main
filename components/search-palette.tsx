"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { Edit, Settings, HelpCircle, LogOut } from "lucide-react";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  // The useEffect hook for the keyboard shortcut has been removed.

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => onOpenChange(false)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>New Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => onOpenChange(false)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => onOpenChange(false)}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & FAQ</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Account">
           <CommandItem onSelect={() => onOpenChange(false)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}