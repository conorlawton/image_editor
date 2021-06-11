import Transform from "./Transform";
import Material from "./Material";
import Camera from "./Camera";
import Matrix4x4 from "./Matrix4x4";
import Vector3 from "./Vector3";

export default class Particle {
	public readonly mesh = [
		-0.1, -0.1,
		0.1, -0.1,
		-0.1, 0.1,
		0.1, 0.1
	];

	public readonly triangles = [
		0, 1, 2,
		2, 1, 3
	];

	public readonly UVs = [
		0, 0,
		1, 0,
		0, 1,
		1, 1
	];

	public texture: WebGLTexture;
	public particle_mat: Material;
	public frame_buffer: WebGLFramebuffer;
	public index_buffer: WebGLBuffer;
	public transform: Transform;
	public colour: Vector3;
	public trail_buffer: number[];
	public trail_mat: Material;
	public trails: boolean;
	public trail_buffer_length: number;
	constructor(gl: WebGL2RenderingContext, colour: Vector3, trails?: boolean, trail_buffer_length?: number) {
		this.trails = trails ?? false;
		this.colour = colour;
		this.trail_buffer_length = trail_buffer_length ?? 100;
		const particle_vertex_shader_source = `#version 300 es
		in vec4 a_pos;
		in vec2 a_uv;

		out vec2 v_uv;

		uniform mat4 u_matrix;

		void main() {
			gl_Position = u_matrix * a_pos;
			
			v_uv = a_uv;
		}
		`;

		const particle_fragment_shader_source = `#version 300 es

		precision highp float;

		in vec2 v_uv;

		out vec4 outColour;

		uniform vec3 u_col;

		void main() {
			float d = distance(v_uv, vec2(.5, .5));
			if (d < 0.5) {
				outColour = vec4(u_col, 1);
			} else {
				
				outColour = vec4(0,0,0,0);
			}
		}
		`;
		
		this.index_buffer = gl.createBuffer()!;
		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), gl.STATIC_DRAW);

		this.transform = new Transform();

		this.particle_mat = new Material(
			gl,
			particle_vertex_shader_source,
			particle_fragment_shader_source,
			{
				"a_pos": {data: this.mesh, size: 2},
				"a_uv": {data: this.UVs, size: 2}
			}
		);


		const trail_vertex_shader_source = `#version 300 es
		in vec4 a_pos;

		uniform mat4 u_matrix;

		void main() {
			gl_Position = u_matrix * a_pos;
		}
		`;
		const trail_fragment_shader_source = `#version 300 es

		precision highp float;

		out vec4 outColour;

		uniform vec3 u_col;

		void main() {
			outColour = vec4(u_col,1);
		}
		`;

		this.trail_mat = new Material(
			gl,
			trail_vertex_shader_source,
			trail_fragment_shader_source,
			{
				"a_pos": {data: this.mesh, size: 3}
			}
		);

		this.trail_buffer = [];
	}

	public update: Function;

	public draw(gl: WebGL2RenderingContext, delta_time: number, camera: Camera) {

		this.particle_mat.use(gl);
		
		this.particle_mat.bind_attribute_data(
			{
				"a_pos": { data: this.mesh, size: 2 },
				"a_uv": { data: this.UVs, size: 2}
			}
		);
		this.particle_mat.bind_uniform_data(
			{
				"u_matrix": { data: (Matrix4x4.multiply(camera.clip_matrix, this.transform.getMatrix()).to_array()) },
				"u_col": { data: this.colour.to_array() }
			}
		);

		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.drawElements(WebGL2RenderingContext.TRIANGLES, 6, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
		//gl.drawArrays(WebGL2RenderingContext.POINTS, 0, 1);

		if (this.trails) {
			if (this.trail_buffer.length > this.trail_buffer_length * 3) {
				this.trail_buffer.shift();
				this.trail_buffer.shift();
				this.trail_buffer.shift();
			}

			this.trail_buffer = this.trail_buffer.concat(this.transform.position.to_array());

			this.trail_mat.use(gl);
			this.trail_mat.bind_attribute_data(
				{
					"a_pos": { data: this.trail_buffer, size: 3 }
				}
			);
			this.trail_mat.bind_uniform_data(
				{
					"u_matrix": { data: camera.clip_matrix.to_array() },
					"u_col": { data: this.colour.to_array() }
				}
			)

			gl.drawArrays(WebGL2RenderingContext.LINE_STRIP, 0, this.trail_buffer.length / 3);
		}
	}
}