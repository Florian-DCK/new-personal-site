import { useTranslations } from 'next-intl';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { useRef } from 'react';
import RepellingText from './repellingText';

export default function Projects() {
	const t = useTranslations('HomePage');
	return (
		<main className="relative h-fit max-h-80">
			<div>
				<RepellingText
					text={t.raw('projectsTitle')}
					className="font-main font-bold text-4xl w-fit sliding-underline"
					repellingDistance={100}
					spaceBetweenWords={0}
				/>
				{/* <h1 className="font-main font-bold text-4xl w-fit sliding-underline">
					{t('projectsTitle')}
				</h1> */}
				<p className="font-main text-stone-200/70 w-1/2 mb-10">
					{t('projectsDescription')}
				</p>
				<div className="relative ">
					<div className="absolute top-1/2 -left-0.5 -translate-y-1/2 h-[calc(100%+1rem)] border border-stone-200/20 z-50"></div>
					<ScrollArea
						className="dark w-full flex-nowrap transition-all "
						orientation="horizontal">
						<div className="flex space-x-10 group">
							<Card className="ms-3 dark p-3 w-162 h-fit glass border-stone-200/20 hover:border-white/70 transition-all group-hover:opacity-50 group-hover:scale-95 hover:!opacity-100 hover:!scale-100">
								<CardHeader className="px-2 flex-row justify-between">
									<CardTitle className="font-main font-bold text-lg">
										The StoryTeller
									</CardTitle>
									<Link
										className={`${buttonVariants({
											variant: 'outline',
										})} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
										href={'https://www.adopteuncube.com/'}
										target="_blank">
										{t('projectsVisit')}
									</Link>
								</CardHeader>
								<CardContent className="ps-2 pe-0 flex space-x-2">
									<p className="text-stone-200/70 font-main">
										{t('projectsDescriptionStoryTeller')}
									</p>
									<Image
										src="/STORYTELLER_Mockup.png"
										alt="Visual of Storyteller Website"
										width={300}
										height={100}
										className=""></Image>
								</CardContent>
								<div className="flex space-x-2">
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#777bb3]">
											PHP
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8]">
											Tailwind CSS
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main text-white font-bold bg-[#00618A]">
											MySql
										</Badge>
									</BadgeTilt>
								</div>
							</Card>

							<Card className="dark p-3 w-162 h-full glass border-stone-200/20 hover:border-white/70 transition-all group-hover:opacity-50 group-hover:scale-95 hover:!opacity-100 hover:!scale-100">
								<CardHeader className="px-2 flex-row justify-between">
									<CardTitle className="font-main font-bold text-lg">
										Dreams
									</CardTitle>
									<Link
										className={`${buttonVariants({
											variant: 'outline',
										})} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
										href={'https://www.adopteuncube.com/'}
										target="_blank">
										{t('projectsVisit')}
									</Link>
								</CardHeader>
								<CardContent className="ps-2 pe-0 flex space-x-2">
									<p className="text-stone-200/70 font-main">
										{t('projectsDescriptionDreams')}
									</p>
									<Image
										src="/DREAMS_Mockup.png"
										alt="Visual of Dreams Website"
										width={300}
										height={100}
										className=""></Image>
								</CardContent>
								<div className="flex space-x-2">
									<BadgeTilt>
										<Badge className="font-main font-bold hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Next.js
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Tailwind CSS
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main text-white font-bold bg-[#00618A] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											MySql
										</Badge>
									</BadgeTilt>
								</div>
							</Card>
							<Card className="dark me-3 p-3 w-162 h-fit glass border-stone-200/20 hover:border-white/70 transition-all group-hover:opacity-50 group-hover:scale-95 hover:!opacity-100 hover:!scale-100">
								<CardHeader className="px-2 flex-row justify-between">
									<CardTitle className="font-main font-bold text-lg">
										Adopte un Cube
									</CardTitle>
									<Link
										className={`${buttonVariants({
											variant: 'outline',
										})} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
										href={'https://www.adopteuncube.com/'}
										target="_blank">
										Visiter
									</Link>
								</CardHeader>
								<CardContent className="ps-2 pe-0 flex space-x-2">
									<p className="text-stone-200/70 font-main">
										{t('projectsDescriptionAdopteUnCube')}
									</p>
									<Image
										src="/AUC_Mockup.png"
										alt="Visual of Adopte un Cube Website"
										width={300}
										height={100}
										className=""></Image>
								</CardContent>
								<div className="flex space-x-2">
									<BadgeTilt>
										<Badge className="font-main font-bold hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Next.js
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Tailwind CSS
										</Badge>
									</BadgeTilt>
								</div>
							</Card>
						</div>
					</ScrollArea>
					<div className="absolute top-1/2 -right-0.5 -translate-y-1/2 h-[calc(100%+1rem)] border border-stone-200/20 z-50"></div>
				</div>
			</div>
		</main>
	);
}

// Génère une rotation aléatoire entre -8 et 8 degrés
function getRandomRotation() {
	return Math.floor(Math.random() * 17) - 8; // [-8, 8]
}

function BadgeTilt({ children, className = '', ...props }: any) {
	const badgeRef = useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		const rotation = getRandomRotation();
		if (badgeRef.current) {
			// Augmente le scale à 1.15 et la translation à -6px
			badgeRef.current.style.transform = `scale(1.15) translateY(-6px) rotate(${rotation}deg)`;
		}
	};

	const handleMouseLeave = () => {
		if (badgeRef.current) {
			badgeRef.current.style.transform = '';
		}
	};

	return (
		<div
			ref={badgeRef}
			className={className + ' transition cursor-pointer'}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}>
			{children}
		</div>
	);
}
