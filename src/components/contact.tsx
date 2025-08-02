import { createIcons, icons } from 'lucide';

export default function Contact() {
	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
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

	async function handleInput(event, minWidth = 100, spacePerChar = 8) {
		event.target.style.width =
			Math.max(minWidth, event.target.value.length * spacePerChar + 5) + 'px';
	}

	return (
		<article className="pt-20 pb-60 px-40 flex justify-center" id="contact">
			<div>
				<h1 className="font-main font-bold text-4xl sliding-underline w-fit">
					Contact Me
				</h1>
				<p className="font-main text-stone-200/70 w-1/2 mb-5">
					If you have any questions, offer, feedback or just want to say hello,
					feel free to reach out!
				</p>
				<ul>
					<li className="flex items-center mb-2">
						<i data-lucide="mail" className="me-2 text-ownAccent"></i>
						<a
							className="font-main text-stone-200/70 sliding-underline w-fit"
							href="mailto:fdonckersf@gmail.com"
							target="_blank">
							fdonckersf@gmail.com
						</a>
					</li>
					<li className="flex items-center mb-2">
						<i data-lucide="github" className="me-2 text-ownAccent"></i>
						<a
							href="https://github.com/Florian-DCK"
							className="font-main text-stone-200/70 sliding-underline w-fit"
							target="_blank">
							Florian-DCK
						</a>
					</li>
					<li className="flex items-center mb-2">
						<i data-lucide="linkedin" className="me-2 text-ownAccent"></i>
						<a
							href="https://www.linkedin.com/in/florian-donckers-b60a08200/"
							className="font-main text-stone-200/70 sliding-underline w-fit"
							target="_blank">
							Florian Donckers
						</a>
					</li>
				</ul>
			</div>
			<form
				action=""
				className="[&_*]:not-[input]:not-[button]:not-[div]:not-[textarea]:text-2xl [&_*]:font-bold items-center max-w-1/2"
				onSubmit={handleSubmit}>
				<span>My name is </span>
				<input
					type="text"
					name="name"
					className="contact-input w-[100px]"
					placeholder="Your Name"
					onInput={handleInput}
					style={{ minWidth: '100px' }}
				/>
				<span className="ms-2">and my email is </span>
				<input
					type="email"
					name="email"
					className="contact-input w-[80px]"
					placeholder="Your Email"
					onInput={(event) => handleInput(event, 80, 9)}
					style={{ minWidth: '80px' }}
				/>
				<span className="ms-2">
					,<br /> I have a{' '}
				</span>
				<input
					type="text"
					name="subject"
					className="contact-input w-[150px]"
					placeholder="Question, Offer etc"
					onInput={(event) => handleInput(event, 100, 8)}
					style={{ minWidth: '100px' }}
				/>
				<span className="ms-2">
					. I would like to add :<br />
				</span>
				<div className="glass relative mt-2">
					<textarea
						name="message"
						id="message"
						className="contact-textarea px-2 mt-2 w-full overflow-hidden focus:outline-none text-md pb-12"
						placeholder="Your Message"
						onInput={(event) => {
							event.target.style.height = 'auto';
							event.target.style.height =
								Math.max(80, event.target.scrollHeight) + 'px';
						}}
						style={{ minHeight: '80px', resize: 'none' }}></textarea>
					<button
						className={`flex absolute bottom-2 right-2 px-2 py-1 cursor-pointer rounded bg-transparent transition-all text-white font-main hover:text-black hover:bg-white z-10 text-md`}
						type="submit">
						Send
						<i data-lucide="send" className="ms-2 size-5"></i>
					</button>
				</div>
			</form>
		</article>
	);
}
