import { useTranslations } from 'next-intl';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { useRef } from 'react';

export default function Projects() {
	const t = useTranslations('HomePage');
	return (
		<main>
			<div>
				<h1 className="font-main font-bold text-4xl">{t('projectsTitle')}</h1>
				<p className="font-main text-stone-200/70 w-1/2 mb-10">
					{t('projectsDescription')}
				</p>
				<div>
					<ScrollArea className="dark w-full flex-nowrap pb-3 transition-all ">
						<div className='flex space-x-10'>
							<Card className="dark p-3 w-162 h-fit glass border-stone-200/20 ">
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
										Visiter
									</Link>
								</CardHeader>
								<CardContent className="ps-2 pe-0 flex space-x-2">
									<p className="text-stone-200/70 font-main">
										Réseau social d'écriture d'histoires collaboratives, inspiré du jeu "cadavre exquis". Réalisé en tant que projet de fin d'année.
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
										<Badge className="font-main font-bold bg-[#777bb3]">PHP</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8]">Tailwind CSS</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className='font-main text-white font-bold bg-[#00618A]'>MySql</Badge>
									</BadgeTilt>
								</div>
							</Card>

							<Card className="dark p-3 w-162 h-fit glass border-stone-200/20 ">
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
										Visiter
									</Link>
								</CardHeader>
								<CardContent className="ps-2 pe-0 flex space-x-2">
									<p className="text-stone-200/70 font-main">
										Application Web pour suivre ses lectures et les noter, avec l'utilisation de l'api google books.
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
										<Badge className="font-main font-bold hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">Next.js</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Tailwind CSS
										</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className='font-main text-white font-bold bg-[#00618A] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer'>MySql</Badge>
									</BadgeTilt>
								</div>
							</Card>
							<Card className="dark p-3 w-162 h-fit glass border-stone-200/20 ">
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
										Site vitrine conçu et développé pour une communauté de joueurs, principalement axée sur Minecraft. J'ai pris en charge l'intégralité du design et de la mise en œuvre technique.
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
										<Badge className="font-main font-bold hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">Next.js</Badge>
									</BadgeTilt>
									<BadgeTilt>
										<Badge className="font-main font-bold bg-[#38bdf8] hover:scale-105 hover:translate-y-[-2px] transition cursor-pointer">
											Tailwind CSS
										</Badge>
									</BadgeTilt>
								</div>
							</Card>

						</div>
						
						<ScrollBar orientation="horizontal"></ScrollBar>
					</ScrollArea>
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
            {...props}
        >
            {children}
        </div>
    );
}
