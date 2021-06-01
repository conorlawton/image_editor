import Vector2 from "./Vector2";
import Vector3 from "./Vector3";
import Quaternion from "./Quaternion";
import Matrix4x4 from "./Matrix4x4";

export default class Transform {
	public position: Vector3;
	public rotation: Quaternion;
	public scale: Vector3;
	public matrix: Matrix4x4;

	constructor() {
		this.position = new Vector3();
		this.rotation = new Quaternion();
		this.scale = new Vector3();
		this.matrix = Matrix4x4.identity();
	}
}
