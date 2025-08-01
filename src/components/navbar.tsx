import { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
	const [isEnglish, setIsEnglish] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Détecter la langue actuelle basée sur l'URL
		if (pathname) {
			setIsEnglish(!pathname.startsWith('/fr'));
		}
	}, [pathname]);

	const toggleLanguage = () => {
		const newIsEnglish = !isEnglish;
		setIsEnglish(newIsEnglish);

		if (newIsEnglish) {
			router.replace(`/en`);
		} else {
			router.replace(`/fr`);
		}
	};

	return (
		<div className="w-screen h-20 fixed flex items-center px-4 justify-between z-10 bg-gradient-to-b from-ownBackground to-transparent ">
			<button
				className="font-main font-bold text-3xl text-ownAccent text-center z-10"
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					F
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					l
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					o
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					r
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					i
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					a
				</span>
				<span className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-100 ease-in-out cursor-default">
					n
				</span>
				<span className="text-white">
					{' '}
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						D
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						o
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						n
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						c
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						k
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						e
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						r
					</span>
					<span className="inline-block hover:rotate-12 hover:text-ownAccent transition-all duration-100 ease-in-out cursor-default">
						s
					</span>
				</span>
			</button>

			<div className="flex items-center gap-2 cursor-pointer">
				<Label
					htmlFor="language-switch"
					className="text-sm font-medium cursor-pointer">
					{isEnglish ? 'EN' : 'FR'}
				</Label>
				<Switch
					id="language-switch"
					checked={isEnglish}
					onCheckedChange={toggleLanguage}
					className=" cursor-pointer"
				/>
			</div>
		</div>
	);
}
