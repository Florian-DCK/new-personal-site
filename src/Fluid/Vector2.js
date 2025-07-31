export default class Vector2 {
	constructor(x, y) {
		try {
			if (typeof x !== 'number' || typeof y !== 'number') {
				throw new Error('Les coordonnées doivent être des nombres');
			}
			this.x = x;
			this.y = y;
		} catch (error) {
			console.error('Erreur dans le constructeur:', error);
			this.x = 0;
			this.y = 0;
		}
	}

	Normalize() {
		try {
			let length = this.Length();
			if (length === 0) {
				// throw new Error('Impossible de normaliser un vecteur nul');
				return;
			}
			this.x /= length;
			this.y /= length;
		} catch (error) {
			console.error('Erreur lors de la normalisation:', error);
		}
	}

	Length() {
		try {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		} catch (error) {
			console.error('Erreur lors du calcul de la longueur:', error);
			return 0;
		}
	}
	Length2() {
		try {
			return this.x * this.x + this.y * this.y;
		} catch (error) {
			console.error('Erreur lors du calcul de la longueur:', error);
			return 0;
		}
	}

	GetNormal() {
		try {
			return new Vector2(this.y, -this.x);
		} catch (error) {
			console.error('Erreur lors du calcul de la normale:', error);
			return Vector2.Zero();
		}
	}

	Dot(vec) {
		try {
			if (!(vec instanceof Vector2)) {
				throw new Error('Le paramètre doit être un Vector2');
			}
			return this.x * vec.x + this.y * vec.y;
		} catch (error) {
			console.error('Erreur lors du produit scalaire:', error);
			return 0;
		}
	}

	Log() {
		try {
			console.log('Vector2: ', this.x, this.y);
		} catch (error) {
			console.error("Erreur lors de l'affichage:", error);
		}
	}

	Cpy() {
		try {
			return new Vector2(this.x, this.y);
		} catch (error) {
			console.error('Erreur lors de la copie:', error);
			return Vector2.Zero();
		}
	}

	AddInPlace(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	SubInPlace(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	ScaleInPlace(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	static Zero() {
		try {
			return new Vector2(0, 0);
		} catch (error) {
			console.error('Erreur lors de la création du vecteur nul:', error);
			return null;
		}
	}
}

function Add(vecA, vecB) {
	try {
		if (!(vecA instanceof Vector2) || !(vecB instanceof Vector2)) {
			throw new Error('Les paramètres doivent être des Vector2');
		}
		return new Vector2(vecA.x + vecB.x, vecA.y + vecB.y);
	} catch (error) {
		console.error("Erreur lors de l'addition:", error);
		return Vector2.Zero();
	}
}

function Sub(vecA, vecB) {
	try {
		if (!(vecA instanceof Vector2) || !(vecB instanceof Vector2)) {
			throw new Error('Les paramètres doivent être des Vector2');
		}
		return new Vector2(vecA.x - vecB.x, vecA.y - vecB.y);
	} catch (error) {
		// console.error('Erreur lors de la soustraction:', error);
		return Vector2.Zero();
	}
}

function Scale(vec, scalar) {
	try {
		if (!(vec instanceof Vector2) || typeof scalar !== 'number') {
			throw new Error('Paramètres invalides');
		}
		return new Vector2(vec.x * scalar, vec.y * scalar);
	} catch (error) {
		console.error("Erreur lors de la mise à l'échelle:", error);
		return Vector2.Zero();
	}
}
