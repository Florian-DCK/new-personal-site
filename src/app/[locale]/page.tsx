'use client';
import FluidSimulation from '@/components/FluidSimulation';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { createIcons, icons } from 'lucide';
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Stack from '@/components/stack';
import Projects from '@/components/projects';

export default function HomePage() {
	const t = useTranslations('HomePage');
	useEffect(() => {
		createIcons({ icons });
	}, []);

	return (
		<div>
			<Navbar></Navbar>
			<section className="Home h-screen w-screen flex justify-center items-center">
				<FluidSimulation></FluidSimulation>
				<div className="flex-col text-center">
					<h3 className="text-center font-main mb-3 z-10">{t('location')}</h3>
					<h1
						className="font-main font-bold text-7xl text-center first-line:text-ownAccent z-10"
						dangerouslySetInnerHTML={{ __html: t.raw('title') }}
					/>
					<p className="font-main text-stone-200/70">{t('subtitle')}</p>
					<div className="flex items-center justify-center mt-5 space-x-5">
						<Link
							className={`${buttonVariants({
								variant: 'outline',
							})} bg-transparent transition-all text-white font-main hover:text-black hover:bg-white z-10`}
							href={'#contact'}>
							{t('buttonContact')}
						</Link>
						<a
							href="/CV_DONCKERS_FLORIAN_en.pdf"
							download
							className="hover:opacity-50 transition-all z-10">
							<div className="flex space-x-2 text-ownAccent">
								<i data-lucide="download"></i>
								<p className="text-white">{t('downloadCV')}</p>
							</div>
						</a>
					</div>
				</div>
			</section>
			<section className="h-screen w-screen ps-40 pe-10 py-20 justify-between flex">
				<div className="space-y-15">
					<Stack></Stack>
					<Projects></Projects>
				</div>
			</section>
		</div>
	);
}
