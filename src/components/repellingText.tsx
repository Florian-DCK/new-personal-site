import React, { useRef, useEffect } from 'react';

interface RepellingTextProps {
	text: string;
	className?: string;
	wordClassName?: string;
	color?: string;
}

const RepellingText = ({
	text,
	className,
	wordClassName,
	color = 'inherit',
}: RepellingTextProps) => {
	const containerRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const spans = containerRef.current.querySelectorAll('span');
			spans.forEach((span) => {
				const rect = span.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;
				const dx = e.clientX - centerX;
				const dy = e.clientY - centerY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const maxDist = 300;

				if (distance < maxDist) {
					const angle = Math.atan2(dy, dx);
					const move = (maxDist - distance) / 12;

					// Rotation proportionnelle à la distance comme le mouvement
					const rotationFactor = (maxDist - distance) / maxDist;
					const rotate = ((dy * 0.3 - dx * 0.3) * rotationFactor) / 6;

					span.style.transform = `
                translate(${-Math.cos(angle) * move}px, ${
						-Math.sin(angle) * move
					}px)
                rotate(${rotate}deg)
              `;
				} else {
					span.style.transform = '';
				}
			});
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	return (
		<p
			ref={containerRef}
			className={`space-x-4 ${className}`}
			style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
			{text.split(' ').map((word, index) => (
				<span
					key={index}
					className={wordClassName}
					style={{
						display: 'inline-block',
						transition: 'transform 0.1s ease',
						...(wordClassName ? {} : { color: color }),
					}}>
					{word}
				</span>
			))}
		</p>
	);
};

export default RepellingText;
