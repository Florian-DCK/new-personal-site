import Vector2 from './Vector2';

export default class Particle {
    constructor(position) {
        this.position = position;
        this.prevPosition = position;
        this.velocity = Vector2.Zero();
        this.color = '#ff7070';
    }
}
