import Vector2 from '@/Fluid/Vector2'
import Particle from '@/Fluid/Particle'
import FluidHashGrid from '@/Fluid/FluidHashGrid'

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

		this.AMOUNT_PARTICLES = 2500;
		this.VELOCITY_DAMPING = 0.97;
		this.GRAVITY = new Vector2(0, 8);
		this.REST_DENSITY = 3;
		this.K_NEAR = 10;
		this.K = 1;
		this.INTERACTION_RADIUS = 30;
		this.MAX_VELOCITY = 100;

		// viscuouse parameter
		this.beta = 0.15;
		this.sigma = 0.2;

		// Paramètres pour l'interaction avec la souris
		// this.mousePosition = new Vector2(0, 0);
		this.leftMouseDown = false;
		this.rightMouseDown = false;
		this.mouseInteractionRadius = 50;
		this.mouseForceStrength = 200;

		this.isFirstFrame = true;

		this.instantiateParticles();
		this.fluidHashGrid = new FluidHashGrid(this.INTERACTION_RADIUS);
		this.fluidHashGrid.initialize(this.particles);

		this.dt2 = 0;

		this.capturedParticles = new Map();
		this.prevMousePosition = new Vector2(0, 0);
		this.mousePosition = null
		this.mouseVelocity = new Vector2(0, 0);
		this.mouseInCanvas = false;
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
		let xParticles = Math.sqrt(this.AMOUNT_PARTICLES);
		let yParticles = xParticles;

		let offsetBetweenParticles = 8;
		let offstAllParticles = new Vector2(20, 20);

		for (let x = 0; x < xParticles; x++) {
			for (let y = 0; y < yParticles; y++) {
				let position = new Vector2(
					x * offsetBetweenParticles + offstAllParticles.x,
					y * offsetBetweenParticles + offstAllParticles.y
				);
				let particle = new Particle(position);
				// particle.velocity = Scale(
				// 	new Vector2(-0.5 + Math.random(), -0.5 + Math.random()),
				// 	200
				// );
				this.particles.push(particle);
			}
		}
	}

	neighbourSearch() {
		this.fluidHashGrid.clearGrid();
		this.fluidHashGrid.mapParticlesToCell();
	}

	update(dt) {
		// this.emitter.spawn(dt, this.particles);
		// this.emitter.rotate(0.01);

		this.applyGravity(dt);

		this.applyMouseInteraction(dt);

		// this.viscosity(dt);

		this.predictPosition(dt);

		this.neighbourSearch();

		this.dt2 = Math.pow(dt, 2);
		this.doubleDensityRelaxation(dt);

		this.worldBoundary();
		// Sauter le calcul de vélocité au premier frame
		if (!this.isFirstFrame) {
			this.computeNextVelocity(dt);
		}

		this.limitVelocity();

		this.isFirstFrame = false;
	}

	applyMouseInteraction(dt) {
		// Calculer la vélocité de la souris
		if (!this.mousePosition || !this.mouseInCanvas) return
		if (this.mousePosition) {
			this.mouseVelocity = Scale(
				Sub(this.mousePosition, this.prevMousePosition),
				1 / dt
			);
			this.prevMousePosition = this.mousePosition.Cpy();
		}

		// if (!this.leftMouseDown && !this.rightMouseDown) {
		// 	// Appliquer la vélocité de la souris aux particules relâchées
		// 	if (this.capturedParticles.size > 0) {
		// 		for (let [particle, _] of this.capturedParticles) {
		// 			particle.velocity = this.mouseVelocity.Cpy();
		// 		}
		// 	}
		// 	this.capturedParticles.clear();
		// 	return;
		// }

		// if (this.leftMouseDown) {
		// 	// Capture initiale des particules avec leur offset
		// 	if (this.capturedParticles.size === 0) {
		// 		for (let particle of this.particles) {
		// 			let toMouse = Sub(particle.position, this.mousePosition);
		// 			let distance = toMouse.Length();

		// 			if (distance < this.mouseInteractionRadius) {
		// 				// Stocker l'offset initial de la particule par rapport à la souris
		// 				this.capturedParticles.set(particle, toMouse);
		// 			}
		// 		}
		// 	}

		// 	// Déplacer les particules capturées en maintenant leur offset
		// 	for (let [particle, offset] of this.capturedParticles) {
		// 		// Calculer la nouvelle position en ajoutant l'offset à la position de la souris
		// 		let targetPos = Add(this.mousePosition, offset);
		// 		particle.position = targetPos;
		// 		particle.prevPosition = targetPos.Cpy();
		// 		particle.velocity = Vector2.Zero();
		// 	}
		// } else if (this.rightMouseDown) {
		// 	// Comportement de répulsion existant
			for (let particle of this.particles) {
				let toMouse = Sub(this.mousePosition, particle.position);
				let distance = toMouse.Length();

				if (distance < this.mouseInteractionRadius) {
					toMouse.Normalize();
					let force =
						(1 - distance / this.mouseInteractionRadius) *
						this.mouseForceStrength;
					particle.velocity.SubInPlace(Scale(toMouse, force * dt));
				}
			}
		// }
	}

	viscosity(dt) {
		for (let i = 0; i < this.particles.length; i++) {
			let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
			let particleA = this.particles[i];

			for (let j = 0; j < neighbours.length; j++) {
				let particleB = neighbours[j];
				if (particleA == particleB) {
					continue;
				}

				let rij = Sub(particleB.position, particleA.position);
				let velocityA = particleA.velocity;
				let velocityB = particleB.velocity;
				let q = rij.Length() / this.INTERACTION_RADIUS;

				if (q < 1) {
					rij.Normalize();
					let u = Sub(velocityA, velocityB).Dot(rij);

					if (u > 0) {
						let ITerm = dt * (1 - q) * (this.sigma * u + this.beta * u * u);
						let I = Scale(rij, ITerm);

						particleA.velocity.SubInPlace(I.ScaleInPlace(0.5));
						particleB.velocity.AddInPlace(I.ScaleInPlace(0.5));
					}
				}
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

			// Si c'est une particule capturée, on passe au suivant
			if (this.capturedParticles.has(particleA)) continue;

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

			let pressure = this.K * (density - this.REST_DENSITY);
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
						this.dt2 * (pressure * (1 - q) + pressureNear * Math.pow(1 - q, 2));
					let D = Scale(rij, displacementTerm);

					// N'appliquer le déplacement à particleB que si elle n'est pas capturée
					if (!this.capturedParticles.has(particleB)) {
						particleB.position.AddInPlace(D.ScaleInPlace(0.5));
					}
					particleADisplacement.SubInPlace(D.ScaleInPlace(0.5));
				}
			}
			particleA.position.AddInPlace(particleADisplacement);
		}
	}
	applyGravity(dt) {
		for (let particle of this.particles) {
			if (!this.capturedParticles.has(particle)) {
				particle.velocity.AddInPlace(Scale(this.GRAVITY, dt));
			}
		}
	}

	predictPosition(dt) {
		for (let particle of this.particles) {
			if (!this.capturedParticles.has(particle)) {
				particle.prevPosition = particle.position.Cpy();
				let positionDelta = Scale(
					particle.velocity,
					dt * this.VELOCITY_DAMPING
				);
				particle.position.AddInPlace(positionDelta);
			}
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
