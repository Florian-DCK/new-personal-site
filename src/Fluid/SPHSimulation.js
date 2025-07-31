import Vector2 from '@/Fluid/Vector2';
import Particle from '@/Fluid/Particle';
import FluidHashGrid from '@/Fluid/FluidHashGrid';

// Fonctions utilitaires pour les vecteurs
function Scale(vector, scalar) {
	return vector.Cpy().ScaleInPlace(scalar);
}

function Sub(v1, v2) {
	return v1.Cpy().SubInPlace(v2);
}

function Add(v1, v2) {
	return v1.Cpy().AddInPlace(v2);
}

export default class SPHSimulation {
	constructor() {
		this.particles = [];

		// Référence au canvas - sera définie par le composant React
		this.canvas = null;

		this.AMOUNT_PARTICLES = 3000;
		this.VELOCITY_DAMPING = 0.97;
		this.GRAVITY = new Vector2(0, 0);
		this.REST_DENSITY = 0;
		this.K_NEAR = 10;
		this.K = 1;
		this.INTERACTION_RADIUS = 60;
		this.MAX_VELOCITY = 100;

		// viscuouse parameter
		this.beta = 0.15;
		this.sigma = 0.2;

		// Paramètres pour l'interaction avec la souris
		this.leftMouseDown = false;
		this.rightMouseDown = false;
		this.mouseInteractionRadius = 50;
		this.mouseForceStrength = 400;

		this.isFirstFrame = true;
		
		this.fluidHashGrid = new FluidHashGrid(this.INTERACTION_RADIUS);

		this.dt2 = 0;

		this.capturedParticles = new Map();
		this.prevMousePosition = new Vector2(0, 0);
		this.mousePosition = null;
		this.mouseVelocity = new Vector2(0, 0);
		this.mouseInCanvas = false;
		
		this.particleEmitters = [];
		this.frameCounter = 0;
	}

	createParticleEmitter(pos, direction, size, spawnInterval, amount, velocity) {
		let emitter = new ParticleEmitter(
			pos,
			direction,
			size,
			spawnInterval,
			amount,
			velocity
		);
		this.particleEmitters.push(emitter);
		return emitter;
	}

	instantiateParticles() {
		const canvasWidth = this.canvas.width ;
		const canvasHeight = this.canvas.height;

		
		const margin = this.INTERACTION_RADIUS;
		const effectiveWidth = canvasWidth - 2 * margin;
		const effectiveHeight = canvasHeight - 2 * margin;

		const particlesPerRow = Math.ceil(Math.sqrt(this.AMOUNT_PARTICLES * effectiveWidth / effectiveHeight));
		const particlesPerColumn = Math.ceil(this.AMOUNT_PARTICLES / particlesPerRow);
		
		const spacingX = effectiveWidth / (particlesPerRow - 1 || 1);
		const spacingY = effectiveHeight / (particlesPerColumn - 1 || 1);

		let count = 0;

		for (let y = 0; y < particlesPerColumn && count < this.AMOUNT_PARTICLES; y++) {
			for (let x = 0; x < particlesPerRow && count < this.AMOUNT_PARTICLES; x++) {
				const posX = margin + x * spacingX;
				const posY = margin + y * spacingY;
				
				let position = new Vector2(posX, posY);
				let particle = new Particle(position);
				
				// Ajouter une petite variation aléatoire pour éviter l'alignement parfait (optionnel)
				const jitter = 3;
				particle.position.x += (Math.random() - 0.5) * jitter;
				particle.position.y += (Math.random() - 0.5) * jitter;
				
				// Vitesse initiale nulle ou très faible
				particle.velocity = Scale(
					new Vector2(-0.5 + Math.random(), -0.5 + Math.random()),
					5 // Vitesse initiale très réduite
				);
				
				this.particles.push(particle);
				count++;
			}
		}
	}

	neighbourSearch() {
		// Réduire la fréquence de reconstruction complète de la grille
		if (!this.frameCounter || this.frameCounter % 3 === 0) {
			this.fluidHashGrid.clearGrid();
			this.fluidHashGrid.mapParticlesToCell();
		}
		this.frameCounter = (this.frameCounter || 0) + 1;
	}

	update(dt) {

		this.applyMouseInteraction(dt);

		this.predictPosition(dt);

		this.neighbourSearch();

		this.dt2 = Math.pow(dt, 2);
		this.doubleDensityRelaxation(dt);

		this.worldBoundary();
		if (!this.isFirstFrame) {
			this.computeNextVelocity(dt);
		}

		this.limitVelocity();

		this.isFirstFrame = false;
	}

	applyMouseInteraction(dt) {
		// Calculer la vélocité de la souris
		if (!this.mousePosition || !this.mouseInCanvas) return;

		if (this.mousePosition) {
			this.mouseVelocity = Scale(
				Sub(this.mousePosition, this.prevMousePosition),
				1 / dt
			);
			this.prevMousePosition = this.mousePosition.Cpy();
		}

		// Calculer la force en fonction de la vélocité de la souris
		let mouseSpeed = this.mouseVelocity.Length();
		let baseForce = this.mouseForceStrength;
		let velocityFactor = Math.min(mouseSpeed / 100, 2); // Limite le facteur à 1.5 pour éviter des forces trop élevées
		let dynamicForce = baseForce * velocityFactor;

		// Si la souris ne bouge pas ou très peu, appliquer une force minimale
		if (mouseSpeed < 20) {
			dynamicForce = baseForce * (mouseSpeed / 20) * 0.2; // Force réduite pour les mouvements lents
		}

		for (let particle of this.particles) {
			let toMouse = Sub(this.mousePosition, particle.position);
			let distance = toMouse.Length();

			if (distance < this.mouseInteractionRadius) {
				toMouse.Normalize();
				let force = (1 - distance / this.mouseInteractionRadius) * dynamicForce;
				particle.velocity.SubInPlace(Scale(toMouse, force * dt));
			}
		}
	}

	limitVelocity() {
		for (let particle of this.particles) {
			if (particle.velocity.Length() > this.MAX_VELOCITY) {
				particle.velocity.Normalize();
				particle.velocity.ScaleInPlace(this.MAX_VELOCITY);
			}
		}
	}

	doubleDensityRelaxation(dt) {
		for (let i = 0; i < this.particles.length; i++) {
			let density = 0;
			let densityNear = 0;
			let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
			let particleA = this.particles[i];

			for (let j = 0; j < neighbours.length; j++) {
				let particleB = neighbours[j];
				if (particleA == particleB) {
					continue;
				}

				let rij = Sub(particleB.position, particleA.position);

				let q = rij.Length() / this.INTERACTION_RADIUS;

				if (q < 1.0) {
					const oneMinusQ = 1 - q;
					density += oneMinusQ * oneMinusQ;
					densityNear += oneMinusQ * oneMinusQ * oneMinusQ;
				}
			}

			let pressure = this.K ;
			let pressureNear = this.K_NEAR * densityNear;
			let particleADisplacement = Vector2.Zero();

			for (let j = 0; j < neighbours.length; j++) {
				let particleB = neighbours[j];
				if (particleA == particleB) {
					continue;
				}

				let rij = Sub(particleB.position, particleA.position);
				let q = rij.Length() / this.INTERACTION_RADIUS;

				if (q < 1.0) {
					rij.Normalize();
					let displacementTerm =
						this.dt2 * (pressure * (1 - q) + pressureNear * (1 - q) * (1 - q));
					let D = Scale(rij, displacementTerm);

					particleADisplacement.SubInPlace(D.ScaleInPlace(0.5));
				}
			}
			particleA.position.AddInPlace(particleADisplacement);
		}
	}

	predictPosition(dt) {
		for (let particle of this.particles) {

				particle.prevPosition = particle.position.Cpy();
				let positionDelta = Scale(
					particle.velocity,
					dt * this.VELOCITY_DAMPING
				);
				particle.position.AddInPlace(positionDelta);
			
		}
	}

	computeNextVelocity(dt) {
		for (let particle of this.particles) {
			let velocity = Scale(
				Sub(particle.position, particle.prevPosition),
				1.0 / dt
			);
			particle.velocity = velocity;
		}
	}

	worldBoundary() {
		for (let particle of this.particles) {
			let pos = particle.position;

			if (pos.x < 0) {
				particle.position.x = 0;
				particle.prevPosition.x = 0;
			}
			if (pos.x > this.canvas.width) {
				particle.position.x = this.canvas.width - 1;
				particle.prevPosition.x = this.canvas.width - 1;
			}
			if (pos.y < 0) {
				particle.position.y = 0;
				particle.prevPosition.y = 0;
			}
			if (pos.y > this.canvas.height) {
				particle.position.y = this.canvas.height - 1;
				particle.prevPosition.y = this.canvas.height - 1;
			}
		}
	}
}
