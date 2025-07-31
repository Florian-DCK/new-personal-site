export default class Playground {
	constructor(Simulation) {
		this.simulation = Simulation;
		this.mousePos = Vector2.Zero();
	}

	update(dt) {
		this.simulation.update(0.2);
	}


	draw() {
		this.simulation.drawParticles();
	}

	onMouseMove(mousePosition) {
		// Convertir la position de la souris en Vector2
		this.simulation.mousePosition = mousePosition;
	}

	onMouseDown(button) {
		// 0 = clic gauche, 2 = clic droit
		if (button === 0) {
			this.simulation.leftMouseDown = true;
		} else if (button === 2) {
			this.simulation.rightMouseDown = true;
		}
	}

	onMouseUp(button) {
		if (button === 0) {
			this.simulation.leftMouseDown = false;
		} else if (button === 2) {
			this.simulation.rightMouseDown = false;
		}
	}
}
