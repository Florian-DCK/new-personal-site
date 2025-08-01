'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

function ScrollArea({
	className,
	children,
	orientation = 'vertical',
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
	orientation?: 'vertical' | 'horizontal' | 'both';
}) {
	const viewportRef = React.useRef<HTMLDivElement | null>(null);
	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const lastScrollTime = React.useRef<number>(0);

	React.useEffect(() => {
		const rootElement = rootRef.current;
		if (
			!rootElement ||
			(orientation !== 'horizontal' && orientation !== 'both')
		) {
			return;
		}

		const handleWheel = (e: WheelEvent) => {
			if (!viewportRef.current || e.deltaY === 0 || e.deltaX !== 0) return;

			const viewport = viewportRef.current;
			const buffer = 10;
			const canScrollLeft = viewport.scrollLeft > buffer;
			const canScrollRight =
				viewport.scrollLeft <
				viewport.scrollWidth - viewport.clientWidth - buffer;

			const now = Date.now();
			const timeSinceLastScroll = now - lastScrollTime.current;

			if ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight)) {
				e.preventDefault();
				e.stopPropagation();
				lastScrollTime.current = now;

				const delta = e.deltaY;
				const currPos = viewport.scrollLeft;
				const scrollWidth = viewport.scrollWidth - viewport.clientWidth;
				const newPos = Math.max(0, Math.min(scrollWidth, currPos + delta));

				viewport.scrollLeft = newPos;
			} else if (timeSinceLastScroll < 250) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		rootElement.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			rootElement.removeEventListener('wheel', handleWheel);
		};
	}, [orientation]);

	return (
		<ScrollAreaPrimitive.Root
			ref={rootRef}
			data-slot="scroll-area"
			className={cn('relative', className)}
			{...props}>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				data-slot="scroll-area-viewport"
				className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1">
				{children}
			</ScrollAreaPrimitive.Viewport>
			{(orientation === 'vertical' || orientation === 'both') && <ScrollBar />}
			{(orientation === 'horizontal' || orientation === 'both') && (
				<ScrollBar orientation="horizontal" />
			)}
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = 'vertical',
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				'flex touch-none p-px transition-colors select-none',
				orientation === 'vertical' &&
					'h-full w-2.5 border-l border-l-transparent',
				orientation === 'horizontal' &&
					'h-2.5 flex-col border-t border-t-transparent',
				className
			)}
			{...props}>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-ownAccent relative flex-1 rounded-full"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

export { ScrollArea, ScrollBar };
