
export interface AllocateTextureOptions {
	internal_format: number;
	border: number;
	format: number;
	type: number;
}

export function allocate_texture(gl: WebGL2RenderingContext, width: number, height: number, level: number, data?: any, options?: AllocateTextureOptions): WebGLTexture | null {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

	if (options) {
		gl.texImage2D(gl.TEXTURE_2D, level, options.internal_format, width, height, options.border, options.format, options.type, data ? data : null);
	} else {
		gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data ? data : null);
	}

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	return texture;
}

export function attach_tex_to_frame_buffer(gl: WebGL2RenderingContext, texture: WebGLTexture, level: number): WebGLFramebuffer | null {
	const frame_buffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);

	const attachment_point = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment_point, gl.TEXTURE_2D, texture, level);

	return frame_buffer;
}
