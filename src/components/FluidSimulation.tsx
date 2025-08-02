'use client';
import { useEffect, useRef, useState } from 'react';
import SPHSimulation from '@/Fluid/SPHSimulation';
import Vector2 from '@/Fluid/Vector2';

export default function FluidSimulation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [simulation, setSimulation] = useState<SPHSimulation | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	let particleImageData: ImageData | null = null;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		function handleResize() {
			if (!canvas) return;
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			particleImageData = null;
		}

		window.addEventListener('resize', handleResize);
		handleResize();

		// Créer une instance de SPHSimulation avec le canvas
		const sim = new SPHSimulation();
		sim.canvas = canvas; // Passer le canvas à la simulation

		// Détecter si on est sur mobile
		const isMobile = window.innerWidth < 640;
		const particleCount = isMobile ? 1500 : 1500;

		// Initialiser la simulation avec moins de particules sur mobile
		sim.instantiateParticles(particleCount);
		sim.fluidHashGrid.initialize(sim.particles);

		setSimulation(sim);

		// Fonction d'animation
		const animate = (() => {
			let lastTime = 0;
			const targetFPS = 60; // Taux de rafraîchissement cible
			const frameInterval = 1000 / targetFPS;

			return (timestamp: number) => {
				if (!canvas || !ctx || !sim) return;

				const elapsed = timestamp - lastTime;
				if (elapsed > frameInterval) {
					// N'exécuter que si assez de temps s'est écoulé
					lastTime = timestamp - (elapsed % frameInterval);

					// Effacer le canvas
					ctx.clearRect(0, 0, canvas.width, canvas.height);

					// Mettre à jour et dessiner la simulation
					const dt = Math.min(0.3, elapsed / 100); // Limiter dt à une valeur raisonnable
					sim.update(dt);

					// Dessiner les particules avec une méthode optimisée
					const drawParticles = () => {
						// Pré-allocation d'un buffer d'image si nécessaire
						if (!particleImageData) {
							particleImageData = ctx.createImageData(
								canvas.width,
								canvas.height
							);
						}

						// Effacer le buffer d'image
						const data = particleImageData.data;
						data.fill(0);

						// Dessiner chaque particule dans le buffer
						for (const particle of sim.particles) {
							const x = Math.floor(particle.position.x);
							const y = Math.floor(particle.position.y);

							// Vérifier que la particule est dans les limites du canvas
							if (
								x >= 1 &&
								x < canvas.width - 1 &&
								y >= 1 &&
								y < canvas.height - 1
							) {
								const index = (y * canvas.width + x) * 4;
								data[index] = 255; // R
								data[index + 1] = 225; // G
								data[index + 2] = 225; // B
								data[index + 3] = 255; // A
							}
						}

						// Appliquer le buffer d'image au canvas
						ctx.putImageData(particleImageData, 0, 0);
					};

					drawParticles();
				}

				// Continuer l'animation
				animationFrameRef.current = requestAnimationFrame(animate);
			};
		})();

		// Démarrer l'animation
		animationFrameRef.current = requestAnimationFrame(animate);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			sim.mousePosition = new Vector2(x, y);

			// Mise à jour du flag pour indiquer si la souris est dans le canvas
			sim.mouseInCanvas =
				x >= 0 && x < canvas.width && y >= 0 && y < canvas.height;
		};

		const handleMouseEnter = (e: MouseEvent) => {
			sim.mouseInCanvas = true;
		};

		const handleMouseLeave = (e: MouseEvent) => {
			sim.mouseInCanvas = false;
		};

		const handleContextMenu = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Empêcher le menu contextuel seulement si la souris est sur le canvas
			if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
				e.preventDefault();
			}
		};

		// Utiliser document pour les événements de souris
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('contextmenu', handleContextMenu);

		// En plus nous gardons les événements sur le canvas
		canvas.addEventListener('mouseenter', handleMouseEnter);
		canvas.addEventListener('mouseleave', handleMouseLeave);

		// Nettoyage
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('contextmenu', handleContextMenu);
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			id="fluidCanvas"
			className="fluid w-full h-full -z-10 absolute pointer-events-auto"></canvas>
	);
}
