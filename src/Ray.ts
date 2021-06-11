import Vector3 from "./Vector3";

export default class Ray {
	origin: Vector3;
	direction: Vector3;
	length: number;

	constructor(origin: Vector3, direction: Vector3, length: number) {
		this.origin = origin;
		this.direction = direction;
		this.length = length;
	}
}