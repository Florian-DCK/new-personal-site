'use client';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { createIcons, icons } from 'lucide';
import { useEffect } from 'react';

export default function HomePage() {
	const t = useTranslations('HomePage');
	useEffect(() => {
		createIcons({ icons });
	}, []);

	return (
		<div>
			<section className="Home h-screen w-screen flex justify-center items-center">
				<div className="flex-col text-center">
					{/* Todo : localisation */}
					<h3 className="text-center font-main mb-3">BASÉ EN BELGIQUE</h3>
					<h1
						className="font-main font-bold text-7xl text-center first-line:text-accent"
						dangerouslySetInnerHTML={{ __html: t.raw('title') }}
					/>
					{/* Todo : localisation */}
					<p className="font-main text-stone-200/70">
						Je suis un stagiaire développeur web, actuellement en alternance
					</p>
					<div className="flex items-center justify-center mt-5 space-x-5">
						{/* Todo : localisation */}
						<Link
							className={`${buttonVariants({ variant: 'outline' })} hover:bg-transparent hover:border-accent transition-all`}
							href={'#contact'}>
							Me contacter
						</Link>
						{/* Todo : localisation + download CV */}
						<a href="" className='hover:opacity-50 transition-all'>
							<div className="flex space-x-2 text-accent">
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
