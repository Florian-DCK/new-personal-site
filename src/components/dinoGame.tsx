'use client';

import { useRef, useEffect, useState } from 'react';

interface Obstacle {
	x: number;
	y: number;
	width: number;
	height: number;
	type: 'cactus' | 'bird';
}

export default function DinoGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [score, setScore] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		function handleResize() {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = 200;
			restartGame();
		}

		window.addEventListener('resize', handleResize);

		canvas.width = window.innerWidth;
		canvas.height = 200;

		// Game state
		let gameRunning = true;
		let frameCount = 0;
		let currentScore = 0;

		// Dino properties
		const dino = {
			x: 50,
			y: 150,
			width: 40,
			height: 40,
			velocityY: 0,
			jumping: false,
			ducking: false,
		};

		// Game physics
		const gravity = 0.6;
		const jumpPower = -12;
		const groundY = 150;

		// Obstacles
		const obstacles: Obstacle[] = [];
		let nextObstacleDistance = 0;

		// Ground
		let groundX = 0;

		// Auto-play AI
		const autoPlay = {
			enabled: true,
			lookAheadDistance: 100,
		};

		let duckFrames = 0; // Ajout en haut de useEffect

		function drawDino() {
			if (!ctx) return;

			ctx.fillStyle = '#535353';

			if (dino.ducking) {
				// Ducking dino (rectangle)
				ctx.fillRect(dino.x, dino.y + 20, dino.width, dino.height - 20);
			} else {
				// Standing dino
				ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

				// Eye
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(dino.x + 25, dino.y + 8, 6, 6);
				ctx.fillStyle = '#000000';
				ctx.fillRect(dino.x + 27, dino.y + 10, 2, 2);

				// Legs (simple animation)
				ctx.fillStyle = '#535353';
				const legOffset = Math.floor(frameCount / 6) % 2;
				ctx.fillRect(dino.x + 8 + legOffset, dino.y + 35, 8, 5);
				ctx.fillRect(dino.x + 24 - legOffset, dino.y + 35, 8, 5);
			}
		}

		function drawGround() {
			if (!ctx || !canvas) return;

			ctx.fillStyle = '#535353';
			for (let i = groundX; i < canvas.width + 20; i += 20) {
				ctx.fillRect(i, groundY + 40, 10, 2);
			}
		}

		function drawObstacles() {
			if (!ctx) return;

			obstacles.forEach((obstacle) => {
				ctx.fillStyle = '#535353';

				if (obstacle.type === 'cactus') {
					// Draw cactus
					ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					// Cactus arms
					ctx.fillRect(obstacle.x - 5, obstacle.y + 10, 8, 4);
					ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + 15, 8, 4);
				} else {
					// Draw bird
					ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					// Wings
					const wingFlap = Math.floor(frameCount / 4) % 2;
					ctx.fillRect(obstacle.x - 5, obstacle.y + wingFlap * 2, 10, 3);
					ctx.fillRect(
						obstacle.x + obstacle.width - 5,
						obstacle.y + wingFlap * 2,
						10,
						3
					);
				}
			});
		}

		function updateDino() {
			// Apply gravity
			if (dino.y < groundY || dino.velocityY <= 0) {
				dino.velocityY += gravity;
				dino.y += dino.velocityY;
				dino.jumping = true;
				if (dino.y >= groundY) {
					dino.y = groundY;
					dino.velocityY = 0;
					dino.jumping = false;
				}
			} else {
				dino.y = groundY;
				dino.velocityY = 0;
				dino.jumping = false;
			}

			// Auto-play logic
			if (autoPlay.enabled && gameRunning) {
				const nearestObstacle = obstacles.find(
					(obs) => obs.x > dino.x && obs.x < dino.x + autoPlay.lookAheadDistance
				);

				if (nearestObstacle) {
					const distanceToObstacle = nearestObstacle.x - dino.x;

					if (
						nearestObstacle.type === 'bird' &&
						nearestObstacle.y < groundY &&
						distanceToObstacle < 70 &&
						nearestObstacle.x > dino.x
					) {
						dino.ducking = true;
						duckFrames = 15; // Le dino reste duck 15 frames après le passage de l'oiseau
					} else {
						if (duckFrames > 0) {
							dino.ducking = true;
							duckFrames--;
						} else {
							dino.ducking = false;
						}
						// Jump only if dino is on the ground
						if (
							dino.y === groundY &&
							dino.velocityY === 0 &&
							((nearestObstacle.type === 'cactus' && distanceToObstacle < 60) ||
								(nearestObstacle.type === 'bird' &&
									nearestObstacle.y >= groundY &&
									distanceToObstacle < 60))
						) {
							dino.velocityY = jumpPower;
							dino.jumping = true;
						}
					}
				} else {
					if (duckFrames > 0) {
						dino.ducking = true;
						duckFrames--;
					} else {
						dino.ducking = false;
					}
				}
			}
		}

		function updateObstacles() {
			if (!canvas) return;

			// Move obstacles
			obstacles.forEach((obstacle) => {
				obstacle.x -= 4;
			});

			// Remove off-screen obstacles
			obstacles.splice(
				0,
				obstacles.length,
				...obstacles.filter((obs) => obs.x > -obs.width)
			);

			// Add new obstacles
			nextObstacleDistance--;
			if (nextObstacleDistance <= 0) {
				const obstacleType = Math.random() > 0.7 ? 'bird' : 'cactus';

				if (obstacleType === 'bird') {
					const birdY = Math.random() > 0.5 ? groundY + 15 : groundY - 10;
					obstacles.push({
						x: canvas.width,
						y: birdY,
						width: 30,
						height: 15,
						type: 'bird',
					});
				} else {
					obstacles.push({
						x: canvas.width,
						y: groundY + 10,
						width: 15,
						height: 30,
						type: 'cactus',
					});
				}

				nextObstacleDistance = Math.random() * 100 + 80;
			}
		}

		function checkCollisions() {
			const dinoRect = {
				x: dino.x + 5,
				y: dino.ducking ? dino.y + 20 : dino.y,
				width: dino.width - 10,
				height: dino.ducking ? dino.height - 20 : dino.height,
			};

			for (const obstacle of obstacles) {
				const obsRect = {
					x: obstacle.x + 5,
					y: obstacle.y,
					width: obstacle.width - 10,
					height: obstacle.height,
				};

				if (
					dinoRect.x < obsRect.x + obsRect.width &&
					dinoRect.x + dinoRect.width > obsRect.x &&
					dinoRect.y < obsRect.y + obsRect.height &&
					dinoRect.y + dinoRect.height > obsRect.y
				) {
					gameRunning = false;
					setIsGameOver(true);

					// Auto-restart after 2 seconds
					setTimeout(() => {
						restartGame();
					}, 2000);

					return;
				}
			}
		}

		function restartGame() {
			gameRunning = true;
			setIsGameOver(false);
			frameCount = 0;

			dino.y = groundY;
			dino.velocityY = 0;
			dino.jumping = false;
			dino.ducking = false;

			obstacles.length = 0;
			nextObstacleDistance = 60;
			groundX = 0;
		}

		function gameLoop() {
			if (!ctx || !canvas) return;

			if (!gameRunning) {
				requestAnimationFrame(gameLoop);
				return;
			}

			// Clear canvas (transparent)
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Update game objects
			updateDino();
			updateObstacles();
			checkCollisions();

			// Update ground
			groundX -= 2;
			if (groundX <= -20) groundX = 0;

			// Draw everything
			drawGround();
			drawDino();
			drawObstacles();

			frameCount++;
			requestAnimationFrame(gameLoop);
		}

		// Start the game automatically
		restartGame();
		gameLoop();

		// Cleanup function
		return () => {
			gameRunning = false;
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-end -z-1 pointer-events-none">
			<canvas
				ref={canvasRef}
				className=""
				style={{ imageRendering: 'pixelated' }}
			/>
			{isGameOver && (
				<p className="text-red-600 mt-2 text-sm">
					Game Over! Restarting automatically...
				</p>
			)}
		</div>
	);
}
