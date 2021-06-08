import Transform from "./Transform";
import Material from "./Material";
import * as Texture from "./TextureUtils";
import Camera from "./Camera";
import Matrix4x4 from "./Matrix4x4";
import Quaternion from "./Quaternion";
import Vector3 from "./Vector3";

export default class Quad {
	public readonly mesh = [
		-0.5, -0.5,
		0.5, -0.5,
		-0.5, 0.5,
		0.5, 0.5
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
	public material: Material;
	public frame_buffer: WebGLFramebuffer;
	public index_buffer: WebGLBuffer;
	public transform: Transform;

	constructor(gl: WebGL2RenderingContext) {

		const vertex_shader_source = `#version 300 es
		in vec4 a_pos;
		in vec2 a_uv;

		out vec2 v_uv;

		uniform mat4 u_matrix;

		void main() {
			gl_Position = u_matrix * a_pos;
			//gl_Position = a_pos;
			v_uv = a_uv;
		}
		`;

		const fragment_shader_source = `#version 300 es

		precision highp float;

		in vec2 v_uv;

		uniform sampler2D u_texture;

		out vec4 outColour;

		void main() {
			outColour = texture(u_texture, v_uv);
		}
		`;

		const texture_options: Texture.AllocateTextureOptions = { border: 0, internal_format: gl.RGB8, type: gl.UNSIGNED_BYTE, format: gl.RGB };
		this.texture = Texture.allocate_texture(gl, 2, 1, 0, new Uint8Array([128, 10, 255, 255, 128, 10]), texture_options)!;
		this.frame_buffer = Texture.attach_tex_to_frame_buffer(gl, this.texture, 0)!;

		this.index_buffer = gl.createBuffer()!;
		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), gl.STATIC_DRAW);

		this.transform = new Transform();

		this.material = new Material(
			gl,
			vertex_shader_source,
			fragment_shader_source,
			{
				"a_pos": {data: this.mesh, size: 2},
				"a_uv": {data: this.UVs, size: 2}
			}
		);
	}

	public draw(gl: WebGL2RenderingContext, delta_time: number, camera: Camera) {
		
		this.material.use(gl);
		
		this.material.bind_attribute_data(
			{
				"a_pos": { data: this.mesh, size: 2 },
				"a_uv": { data: this.UVs, size: 2}
			}
		);
		this.material.bind_uniform_data(
			{
				"u_matrix": { data: (Matrix4x4.multiply(camera.matrix, this.transform.getMatrix()).to_array()) },
				"u_texture": { data: [0] }
			}
		);

		gl.activeTexture(WebGL2RenderingContext.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.drawElements(WebGL2RenderingContext.TRIANGLES, 6, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
		// gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 6);
	}
}