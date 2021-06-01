#version 300 es

precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;

out vec4 outColour;

void main() {
	outColour = texture(u_texture, v_uv);
}