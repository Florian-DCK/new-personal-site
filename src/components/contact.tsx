import { createIcons, icons } from 'lucide';
import { useTranslations } from 'next-intl';
import RepellingText from './repellingText';

export default function Contact({
	className = '',
	horizontal = true,
	anchor = 'none',
}: {
	className?: string;
	horizontal?: boolean;
	anchor?: string;
}) {
	const t = useTranslations('Contact');

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());
		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			// Handle success
		} else {
			// Handle error
		}
	}

	async function handleInput(
		event: React.FormEvent<HTMLInputElement>,
		minWidth = 100,
		spacePerChar = 8
	) {
		const target = event.target as HTMLInputElement;
		target.style.width =
			Math.max(minWidth, target.value.length * spacePerChar + 5) + 'px';
	}

	return (
		<article
			className={`px-4 flex flex-col lg:flex-row justify-center w-fit ${className}`}
			id={anchor}>
			<div
				className={`flex items-center justify-center glass ${
					horizontal ? 'flex-row' : 'flex-col space-y-2'
				}`}>
				<a
					className={`font-main flex bg-ownAccent px-3 py-2 rounded-l-full text-ownBackground border-2 border-ownAccent h-13 items-center z-10 ${
						horizontal ? 'flex-row' : 'flex-col'
					}`}
					href="mailto:fdonckersf@gmail.com">
					<i data-lucide="mail" className="md:me-2 text-ownBackground"></i>
					<span
						className={`hidden md:block ${horizontal ? '' : 'vertical-text'}`}>
						fdonckersf@gmail.com
					</span>
				</a>
				<ul
					className={`flex border-2 border-ownAccent rounded-full px-3 ps-15 py-2 -ms-13 h-13 space-x-5 ${
						horizontal ? 'flex-row' : 'flex-col'
					}`}>
					<li className={`flex items-center`}>
						<a
							href="https://github.com/Florian-DCK"
							className={`font-main text-stone-200/70 sliding-underline w-fit flex ${
								horizontal ? 'flex-row' : 'flex-col'
							}`}
							target="_blank">
							<i
								data-lucide="github"
								className="ms-2 md:me-2 text-ownAccent"></i>
							<span
								className={`hidden md:block ${
									horizontal ? '' : 'vertical-text'
								}`}>
								Florian-DCK
							</span>
						</a>
					</li>
					<li>
						<div className="w-1 border-l-2 border-ownAccent h-8 mx-1"></div>
					</li>
					<li
						className={`flex items-center ${
							horizontal ? 'flex-row' : 'flex-col'
						}`}>
						<i data-lucide="linkedin" className="me-2 text-ownAccent"></i>
						<a
							href="https://www.linkedin.com/in/florian-donckers-b60a08200/"
							className="font-main text-stone-200/70 sliding-underline w-fit"
							target="_blank">
							<span className="hidden md:block">Florian Donckers</span>
						</a>
					</li>
				</ul>
			</div>
			{/* <form
				action=""
				className="[&_*]:not-[input]:not-[button]:not-[div]:not-[textarea]:text-2xl [&_*]:font-bold items-center w-full max-w-lg"
				onSubmit={handleSubmit}>
				<span>
					{t('formHello')}
					<br />
				</span>
				<span>{t('formName')} </span>
				<input
					type="text"
					name="name"
					id="name"
					required
					className="contact-input w-[100px]"
					placeholder={t('formNamePlaceholder')}
					onInput={handleInput}
					style={{ minWidth: '100px' }}
				/>
				<span className="ms-2">{t('formEmail')} </span>
				<input
					type="email"
					name="email"
					id="email"
					required
					className="contact-input w-[90px]"
					placeholder={t('formEmailPlaceholder')}
					onInput={(event) => handleInput(event, 90, 9)}
					style={{ minWidth: '90px' }}
				/>
				<span className="ms-2">
					,<br /> {t('formSubject')}{' '}
				</span>
				<input
					type="text"
					name="subject"
					id="subject"
					required
					className="contact-input w-[150px]"
					placeholder={t('formSubjectPlaceholder')}
					onInput={(event) => handleInput(event, 100, 8)}
					style={{ minWidth: '100px' }}
				/>
				<span className="ms-2">
					. {t('formMessage')}
					<br />
				</span>
				<div className="glass relative mt-2">
					<textarea
						name="message"
						id="message"
						className="contact-textarea px-2 mt-2 w-full overflow-hidden focus:outline-none text-md pb-12"
						placeholder={t('formMessagePlaceholder')}
						onInput={(event) => {
							const target = event.target as HTMLTextAreaElement;
							target.style.height = 'auto';
							target.style.height = Math.max(80, target.scrollHeight) + 'px';
						}}
						style={{ minHeight: '80px', resize: 'none' }}></textarea>
					<button
						className={`flex absolute bottom-2 right-2 px-2 py-1 cursor-pointer rounded bg-transparent transition-all text-white font-main hover:text-black hover:bg-white z-10 text-md`}
						type="submit">
						{t('formSubmit')}
						<i data-lucide="send" className="ms-2 size-5"></i>
					</button>
				</div>
			</form> */}
		</article>
	);
}
