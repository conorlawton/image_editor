import Vector3 from "./Vector3";
import Matrix4x4 from "./Matrix4x4";
import Quaternion from "./Quaternion";
import { deg2rad } from "./MathUtils";

export default class Camera {
	position: Vector3;
	up: Vector3;
	target: Vector3;
	matrix: Matrix4x4;

	constructor(aspect_ratio: number) {
		this.position = new Vector3(0, 0, 2);
		this.up = new Vector3(0, 1, 0);
		this.target = new Vector3(0, 0, 0);

		this.set_aspect_ratio(aspect_ratio);
	}

	public rotate(rotation: Quaternion) {
		this.matrix = Matrix4x4.multiply(this.matrix, rotation.to_rotation_matrix());
	}

	public set_aspect_ratio(aspect_ratio: number) {

		//const projection_matrix = Matrix4x4.perspective(deg2rad(60), aspect_ratio, 1, 2000);
		
		const projection_matrix = Matrix4x4.orthographic(-aspect_ratio, aspect_ratio, -1, 1, 0, -100);
		const cam_matrix = Matrix4x4.look_at(this.position, this.target, this.up);
		const view_matrix = cam_matrix.inverse();
		if (!view_matrix) throw new Error("cam_matrix not invertible");
		const view_projection_matrix = Matrix4x4.multiply(projection_matrix, view_matrix);

		this.matrix = view_projection_matrix;
	}
}
