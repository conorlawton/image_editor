import Vector3 from "./Vector3";
import Material from "./Material";
import Vector4 from "./Vector";
import Matrix4x4 from "./Matrix4x4";
import Camera from "./Camera";

export default class DebugDraw {
	material: Material;
	gl: WebGL2RenderingContext;
	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		const vertex_shader_source = `#version 300 es
		precision highp float;
		in vec3 a_pos;
		uniform mat4 u_matrix;

		void main() {
			gl_Position = u_matrix * vec4(a_pos, 1);
		}
		`;

		const fragment_shader_source = `#version 300 es
		precision highp float;
		uniform vec4 u_colour;
		out vec4 col;
		void main() {
			col = u_colour;
		}
		`
		this.material = new Material(gl, vertex_shader_source, fragment_shader_source, {
			"a_pos": {data: [], size: 3}			
		});
	}

	public ray(camera: Camera, origin: Vector3, direction: Vector3, length?: number, colour?: Vector4) {
		this.material.use(this.gl);

		length = length ?? 1;
		colour = colour ?? new Vector4(0,1,0,1);

		const end: Vector3 = direction.clone().set_magnitude(length).add_vec(origin);
		const points = origin.to_array().concat(end.to_array());

		this.material.bind_attribute_data({
			"a_pos": { data: points, size: 3 }
		});

		this.material.bind_uniform_data({
			"u_colour": { data: colour.to_array() },
			"u_matrix": { data: Matrix4x4.multiply(camera.matrix, Matrix4x4.translate(origin)).to_array() }
		});

		this.gl.drawArrays(WebGL2RenderingContext.LINES, 0, 2);
	}
}