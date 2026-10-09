// shadcn/ui composition patterns, adapted to locally scoped CSS instead of global Tailwind resets.
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
const buttonVariants = cva('an-button', {
  variants: {
    variant: {
      default: 'an-button-default',
      outline: 'an-button-outline',
      ghost: 'an-button-ghost',
    },
    size: { default: '', sm: 'an-button-sm', icon: 'an-button-icon' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & { asChild?: boolean }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = 'AnalyticsButton';
export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <article className={cn('an-card', className)} {...props} />;
}
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('an-badge', className)} {...props} />;
}
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const returnFocus = React.useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="an-sheet-overlay" />
        <DialogPrimitive.Content
          className="an-sheet"
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement as HTMLElement;
          }}
          onCloseAutoFocus={(event) => {
            if (returnFocus.current?.isConnected) {
              event.preventDefault();
              returnFocus.current.focus();
            }
          }}
        >
          <div className="an-sheet-heading">
            <div>
              <span className="an-overline">ANALYTICS / EXPLORE</span>
              <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close asChild>
              <Button variant="outline" size="icon" aria-label="Close analytical details">
                <X size={18} />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="an-sheet-description">
            {description}
          </DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
