import Vector3 from "./Vector3";
import Matrix4x4 from "./Matrix4x4";
import Camera from "./Camera";
import Quad from "./Quad";

const canvas: HTMLCanvasElement = document.getElementById("draw") as HTMLCanvasElement;
const context = canvas.getContext("webgl2");

if (context === null) {
	throw new Error("WebGL2 not supported.");
}


const camera: Camera = new Camera(canvas.width / canvas.height);

window.addEventListener("resize", () => {
	let innerWidth = window.innerWidth;
	let innerHeight = window.innerHeight;
	canvas.setAttribute("width", innerWidth.toString());
	canvas.setAttribute("height", innerHeight.toString());
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	context.viewport(0, 0, innerWidth, innerHeight);
	camera.set_aspect_ratio(innerWidth / innerHeight);
});


// class TexturedQuad {

// 	vertex_array: WebGLVertexArrayObject;
// 	texture: WebGLTexture;
// 	program: WebGLProgram;
// 	texture_uniform_loc: WebGLUniformLocation;
// 	frame_buffer: WebGLFramebuffer;
// 	index_buffer: WebGLBuffer;

// 	u_matrix_location: WebGLUniformLocation;

// 	constructor(gl: WebGL2RenderingContext, data?: any[]) {

// 		const vertex_shader_source = `#version 300 es
// 		in vec4 a_pos;
// 		in vec2 a_uv;

// 		out vec2 v_uv;

// 		uniform mat4 u_matrix;

// 		void main() {
// 			gl_Position = u_matrix * a_pos;
// 			//gl_Position = a_pos;
// 			v_uv = a_uv;
// 		}
// 		`;

// 		const fragment_shader_source = `#version 300 es

// 		precision highp float;

// 		in vec2 v_uv;

// 		uniform sampler2D u_texture;

// 		out vec4 outColour;

// 		void main() {
// 			outColour = texture(u_texture, v_uv);
// 		}
// 		`;

// 		this.program = create_program_from_sources(gl, vertex_shader_source, fragment_shader_source)!;

// 		const position_attrib_loc = gl.getAttribLocation(this.program, "a_pos");

// 		this.texture_uniform_loc = gl.getUniformLocation(this.program, "u_texture")!;

// 		//this.index_buffer = gl.createBuffer()!;
// 		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
// 		//gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 1, 3, 2 ]), gl.STATIC_DRAW);

// 		this.vertex_array = gl.createVertexArray()!;
// 		gl.bindVertexArray(this.vertex_array);

// 		bind_vert_property(gl, this.program, [
			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,

			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,

			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,

			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,

			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,

			// 0, 0,
			// 0, 1,
			// 1, 0,
			// 0, 1,
			// 1, 1,
			// 1, 0,
// 		], "a_uv", 2);
// 		bind_vert_property(gl, this.program, [
			// -0.5, -0.5, -0.5,
			// -0.5, 0.5, -0.5, 
			// 0.5, -0.5, -0.5,
			// -0.5, 0.5, -0.5,
			// 0.5, 0.5, -0.5,
			// 0.5, -0.5, -0.5,

			// -0.5, -0.5, 0.5,
			// 0.5, -0.5, 0.5,
			// -0.5, 0.5, 0.5,
			// -0.5, 0.5, 0.5,
			// 0.5, -0.5, 0.5,
			// 0.5, 0.5, 0.5,

			// -0.5, 0.5, -0.5,
			// -0.5, 0.5, 0.5,
			// 0.5, 0.5, -0.5,
			// -0.5, 0.5, 0.5,
			// 0.5, 0.5, 0.5,
			// 0.5, 0.5, -0.5,

			// -0.5, -0.5, -0.5,
			// 0.5, -0.5, -0.5,
			// -0.5, -0.5, 0.5,
			// -0.5, -0.5, 0.5,
			// 0.5, -0.5, -0.5,
			// 0.5, -0.5, 0.5,

			// -0.5, -0.5, -0.5,
			// -0.5, -0.5, 0.5,
			// -0.5, 0.5, -0.5,
			// -0.5, -0.5, 0.5,
			// -0.5, 0.5, 0.5,
			// -0.5, 0.5, -0.5,

			// 0.5, -0.5, -0.5,
			// 0.5, 0.5, -0.5,
			// 0.5, -0.5, 0.5,
			// 0.5, -0.5, 0.5,
			// 0.5, 0.5, -0.5,
			// 0.5, 0.5, 0.5
// 		], "a_pos", 3);

// 		const texture_options: AllocateTextureOptions = { border: 0, internal_format: gl.R8, type: gl.UNSIGNED_BYTE, format: gl.RED };
// 		this.texture = allocate_texture(gl, 3, 2, 0, new Uint8Array([128, 10, 255, 255, 128, 10]), texture_options)!;


// 		this.u_matrix_location = gl.getUniformLocation(this.program, "u_matrix")!;

// 		this.frame_buffer = attach_tex_to_frame_buffer(gl, this.texture, 0)!;
// 	}

// 	draw(gl: WebGL2RenderingContext, time: number) {
// 		gl.useProgram(this.program);
// 		gl.bindVertexArray(this.vertex_array);
// 		gl.bindTexture(gl.TEXTURE_2D, this.texture);

// 		gl.uniform1i(this.texture_uniform_loc, 0);

// 		gl.uniformMatrix4fv(this.u_matrix_location, false, camera.matrix.to_f32_array());

// 		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
// 		//gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
// 		gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
// 	}
// }

const quad1 = new Quad(context);
const quad2 = new Quad(context);
const quad3 = new Quad(context);
quad2.transform.matrix = Matrix4x4.multiply(quad1.transform.matrix, Matrix4x4.translate(new Vector3(1, 0, 0)).transposed());
quad3.transform.matrix = Matrix4x4.multiply(quad1.transform.matrix, Matrix4x4.translate(new Vector3(-1, 0, 0)).transposed());

context.viewport(0, 0, canvas.width, canvas.height);
context.clearColor(0, 0, 0, 0);
context.enable(context.DEPTH_TEST);
// context.enable(context.CULL_FACE);
// context.cullFace(context.BACK);

let last = 0;
const draw = function (now: number) {

	now *= 0.001;
	const delta_time = now - last;
	last = now;

	context.bindFramebuffer(context.FRAMEBUFFER, null);

	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

	//camera.rotate(Quaternion.from_euler(new Vector3(0, 1 * delta_time, 0)));

	quad1.draw(context, delta_time, camera);
	quad2.draw(context, delta_time, camera);
	quad3.draw(context, delta_time, camera);

	requestAnimationFrame(draw);
}


const resizeEvent = window.document.createEvent("UIEvents");
resizeEvent.initEvent("resize", true, false);
window.dispatchEvent(resizeEvent);

requestAnimationFrame(draw);
