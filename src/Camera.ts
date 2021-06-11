import Vector3 from "./Vector3";
import Matrix4x4 from "./Matrix4x4";
import Quaternion from "./Quaternion";
import { deg2rad } from "./MathUtils";
import Vector2 from "./Vector2";
import Ray from "./Ray";
import Transform from "./Transform";

export default class Camera {
	public dirty: boolean;
	public transform: Transform;
	public clip_matrix: Matrix4x4;
	public aspect_ratio: number;
	private rotation_matrix: Matrix4x4;
	private projection_matrix: Matrix4x4;

	constructor(aspect_ratio: number) {
		this.transform = new Transform();

		this.aspect_ratio = aspect_ratio;
	}

	public update() {
		if (this.dirty) {
			this.rotation_matrix = Matrix4x4.from_rotation(Quaternion.from_euler(this.transform.rotation));
			this.projection_matrix = Matrix4x4.perspective(deg2rad(60), this.aspect_ratio, 1, 2000);
		}
		
		const view_matrix = this.transform.getMatrix().inverse();
		
		if (!view_matrix) throw new Error("cam_matrix not invertible");
		const view_projection_matrix = Matrix4x4.multiply(this.projection_matrix, view_matrix);
		this.clip_matrix = view_projection_matrix;
	}
}
