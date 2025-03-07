'use client';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { createIcons, icons } from 'lucide';
import { useEffect } from 'react';
import Navbar from '@/components/navbar'

export default function HomePage() {
	const t = useTranslations('HomePage');
	useEffect(() => {
		createIcons({ icons });
	}, []);

	return (
		<div>
			<Navbar></Navbar>
			<section className="Home h-screen w-screen flex justify-center items-center">
				<div className="flex-col text-center">
					{/* Todo : localisation */}
					<h3 className="text-center font-main mb-3">BASÉ EN BELGIQUE</h3>
					<h1
						className="font-main font-bold text-7xl text-center first-line:text-ownAccent"
						dangerouslySetInnerHTML={{ __html: t.raw('title') }}
					/>
					{/* Todo : localisation */}
					<p className="font-main text-stone-200/70">
						Je suis un stagiaire développeur web, actuellement en alternance
					</p>
					<div className="flex items-center justify-center mt-5 space-x-5">
						{/* Todo : localisation */}
						<Link
							className={`${buttonVariants({ variant: 'outline' })} bg-transparent transition-all text-white font-main hover:text-black hover:bg-white`}
							href={'#contact'}>
							Me contacter
						</Link>
						{/* Todo : localisation + download CV */}
						<a href="" className='hover:opacity-50 transition-all'>
							<div className="flex space-x-2 text-ownAccent">
								<i data-lucide="download"></i>
								<p className='text-white'>Télécharger mon CV</p>
							</div>
						</a>
					</div>
				</div>
			</section>
			<section className="h-screen w-screen"></section>
		</div>
	);
}
