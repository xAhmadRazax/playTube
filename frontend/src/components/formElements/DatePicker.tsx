import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  value,
  onChange,
  name = '',
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  name: string;
}) {
  return (
    <div className="relative flex items-center">
      <label htmlFor="dob" className="absolute ps-2">
        <CalendarIcon className="text-zinc-200" />
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            id="dob"
            data-empty={!value}
            className={cn(
              'w-full rounded ps-10 py-1 border border-zinc-600 bg-transparent text-zinc-100 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 justify-start font-normal hover:bg-inherit hover:text-zinc-500 hover:cursor-text',
              !value && 'text-muted-foreground',
            )}
          >
            {value ? (
              format(value, 'PPP')
            ) : (
              <span className="text-zinc-400">Date of Birth</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto scale-90 p-0 bg-zinc-900">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            className="text-zinc-100 border border-zinc-600 rounded-md"
            captionLayout="dropdown"
            classNames={{
              years_dropdown: 'bg-zinc-900 text-zinc-100',
              months_dropdown: 'bg-zinc-900 text-zinc-100',
            }}
          />
        </PopoverContent>

        {/* Invisible but validatable input */}
        <input
          type="text"
          name={name}
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={() => {}} // needed for React controlled input
          required
          className="sr-only w-full h-full" // screen-reader only, still part of validation
        />
      </Popover>
    </div>
  );
}
