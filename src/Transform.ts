import Vector3 from "./Vector3";
import Quaternion from "./Quaternion";
import Matrix4x4 from "./Matrix4x4";

type forEachChildCallback = (child: Transform, index: number, array: Transform[]) => void;

export default class Transform {
	public position: Vector3;
	public rotation: Vector3;
	public scale: Vector3;
	public dirty: boolean;
	private children: Transform[];
	private parent: Transform | null;
	private matrix: Matrix4x4;

	constructor() {
		this.position = new Vector3();
		this.rotation = new Vector3();
		this.scale = new Vector3(1, 1, 1);
		this.dirty = true;
	}

	public setParent(newParent: Transform) {
		this.parent = newParent;
	}

	public getParent(): Transform | null {
		return this.parent;
	}

	public forEachChild(callbackFn: forEachChildCallback, thisArg?: object) {
		let _this = thisArg ?? this;
		for (let i = 0; i < this.children.length; i++) {
			callbackFn.apply(_this, [this.children[i], i, this.children]);
		}
	}

	public getMatrix(): Matrix4x4 {
		if (this.dirty) {
			let m = Matrix4x4.identity();
			let q = Quaternion.from_euler(this.rotation);
			let r = Matrix4x4.from_rotation(q);
			let s = Matrix4x4.scale(this.scale);
			let p = Matrix4x4.translate(this.position);
	
			m = Matrix4x4.multiply(m, p);
			m = Matrix4x4.multiply(m, r);
			m = Matrix4x4.multiply(m, s);

			this.matrix = m;
			this.dirty = false;
		}

		return this.matrix;
	}
}
