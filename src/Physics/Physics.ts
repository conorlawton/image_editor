import Vector3 from "../Vector3";

export default class Physics {
	ray_aabb(): boolean {
		return false;
	}

	ray_tri(origin: Vector3, direction: Vector3, v0: Vector3, v1: Vector3, v2: Vector3, outIntersectionPoint: Vector3): boolean {

		const epsilon = 0.0000001;

		const edge1 = Vector3.sub(v0, v1);
		const edge2 = Vector3.sub(v1, v2);

		const h = Vector3.cross(direction, edge2);
		const a = Vector3.dot(edge1, h);

		if (a > -epsilon && a < epsilon) {
			return false;
		}

		const f = 1 / a;
		const s = Vector3.sub(origin, v0);
		const u = Vector3.dot(s, h) * f;
		
		if (u < 0 || u > 1) {
			return false;
		}

		const q = Vector3.cross(s, edge1);
		const v = Vector3.dot(s, h) * f;

		if (v < 0.0 || u + v > 1) {
			return false;
		}

		const t = f * Vector3.dot(edge2, q);
		if (t > epsilon) {
			// Possible optimization to set the values directly
			Object.assign(outIntersectionPoint, Vector3.add_vec(origin, direction).scale_number(t));
			return true;
		}

		return false;
	}
}