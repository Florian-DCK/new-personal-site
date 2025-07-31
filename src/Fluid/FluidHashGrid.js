export default class FluidHashGrid {
	constructor(cellSize) {
		this.cellSize = cellSize;
		this.hashMap = new Map();
		this.hashMapSize = 10000000;
		this.prime1 = 6614058611;
		this.prime2 = 7528850467;
		this.particles = [];
	}

	initialize(particles) {
		this.particles = particles;
	}

	clearGrid() {
		this.hashMap.clear();
	}

	getGridHashFromPos(pos) {
		let x = parseInt(pos.x / this.cellSize);
		let y = parseInt(pos.y / this.cellSize);
		return this.cellIndexToHash(x, y);
	}

	cellIndexToHash(x, y) {
		return ((x * 73856093) ^ (y * 19349663)) % this.hashMapSize;
	}

	getNeighbourOfParticleIdx(i) {
		let neighbours = [];
		let pos = this.particles[i].position;

		let particleGridX = parseInt(pos.x / this.cellSize);
		let particleGridY = parseInt(pos.y / this.cellSize);

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				let gridX = particleGridX + x;
				let gridY = particleGridY + y;

				let hash = this.cellIndexToHash(gridX, gridY);
				let content = this.getContentOfCell(hash);

				neighbours.push(...content);
			}
		}

		return neighbours;
	}

	mapParticlesToCell() {
		try {
			for (let particle of this.particles) {
				let pos = particle.position;
				let hash = this.getGridHashFromPos(pos);

				let entries = this.hashMap.get(hash);
				if (entries == null) {
					let newArray = [particle];
					this.hashMap.set(hash, newArray);
				} else {
					entries.push(particle);
				}
			}
		} catch (e) {
			console.error('Erreur dans mapParticlesToCell: ' + e);
		}
	}

	getContentOfCell(id) {
		let content = this.hashMap.get(id);

		if (content == null) {
			return [];
		} else {
			return content;
		}
	}
}
