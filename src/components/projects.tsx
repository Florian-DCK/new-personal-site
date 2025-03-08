import { useTranslations } from 'next-intl';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

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
					<ScrollArea>
						<Card className="dark p-3 w-162 h-fit glass border-stone-200/20 ">
							<CardHeader className="px-2 flex-row justify-between">
								<CardTitle className="font-main font-bold text-lg">
									Adopte un Cube
								</CardTitle>
								<Link
									className={`${buttonVariants({
										variant: 'outline',
									})} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
									href={'https://www.adopteuncube.com/'} target='_blank'>
									Visiter
								</Link>
							</CardHeader>
							<CardContent className="ps-2 pe-0 flex space-x-2">
								<p className="text-stone-200/70 font-main">
									C'est un site vitrine pour une communauté de joueurs centrés
									principalement sur Minecraft. <br /> <br />
									J'ai entièrement designé et mis en place ce site.
								</p>
								<Image
									src="/AUC_Mockup.png"
									alt="Visual of Adopte un Cube Website"
									width={300}
									height={100}
									className=""></Image>
							</CardContent>
							<div className="flex space-x-2">
								<Badge className="font-main font-bold">Next.js</Badge>
								<Badge className="font-main font-bold bg-[#38bdf8]">
									Tailwind CSS
								</Badge>
							</div>
						</Card>
						<ScrollBar></ScrollBar>
					</ScrollArea>
				</div>
			</div>
		</main>
	);
}
