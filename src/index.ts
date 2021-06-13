import Vector3 from "./Vector3";
import Camera from "./Camera";
import Vector2 from "./Vector2";
import Particle from "./Particle";
import DebugDraw from "./DebugDraw";
import Cube from "./Cube";
import Input, { InputAction } from "./input/Input";

const canvas: HTMLCanvasElement = document.getElementById("draw") as HTMLCanvasElement;
const context = canvas.getContext("webgl2");

if (context === null) {
	throw new Error("WebGL2 not supported.");
}


const camera: Camera = new Camera(canvas.width / canvas.height);
camera.dirty = true;


const test = () => console.log("Wow!");
const test_action = new InputAction("w");
const input = new Input();

test_action.start = test;
input.register_action(test_action);



function resize() {
	let innerWidth = window.innerWidth;
	let innerHeight = window.innerHeight;
	canvas.setAttribute("width", innerWidth.toString());
	canvas.setAttribute("height", innerHeight.toString());
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	context.viewport(0, 0, innerWidth, innerHeight);
	camera.aspect_ratio = innerWidth / innerHeight;
	camera.dirty = true;
}

window.addEventListener("resize", resize);
resize();

let mouse_coords = new Vector2(0, 0);
document.addEventListener("mousemove", (e) => {
	mouse_coords.x = e.screenX;
	mouse_coords.y = e.screenY;
});

const update_particle = function() {
	
	const t = this.transform.position;

	const x = t.x;
	const y = t.y;
	const z = t.z;
	
	// t.x += 0.01 * 10 * (-x + y);
	// t.y += 0.01 * (-x * z + 28 * x - y);
	// t.z += 0.01 * (x * y - (8/3) * z);
	
	// Halvorsen
	const a = 1.89;
	// t.x += 0.001 * ((a * x) - (4 * y) - (4 * z) - (y * y));
	// t.y += 0.001 * ((a * y) - (4 * z) - (4 * x) - (z * z));
	// t.z += 0.001 * ((a * z) - (4 * x) - (4 * y) - (x * x));
	t.x += 0.01 * ((-a * x) + (2 * y) - (4 * z) - (y ** 2) + (3 * a + 15));
	t.y += 0.01 * ((-a * y) + (2 * z) - (4 * x) - (z ** 2) + (3 * a + 15));
	t.z += 0.01 * ((-a * z) + (2 * x) - (4 * y) - (x ** 2) + (3 * a + 15));

	// Aizawa
	// let a=0.95, b=0.7, c=0.6,d=3.5, e=0.25, f=0.1;
	// t.x += 0.2 * ((z - b) * x - d * y);
	// t.y += 0.2 * (d * x + (z - b) * y);
	// t.z += 0.2 * (c + (a * z) - ((z ** 3) / 3) - ((x ** 2) + (y ** 2)) * (1 + e * z) + ((f * z * x) ** 3));
	
	// const a=32.48, b=45.84, c=1.18,	d=0.13, e=0.57, f= 14.7;
	// t.x += 0.001 * (a * (y - x) + d * x * y );
	// t.y += 0.001 * ( b * x - x * z + f * y );
	// t.z += 0.001 * ( c * z + x * y - e * (x ** 2) );

	// const a = 2.07, b = 1.79;
	// t.x += 0.01 * ( y + a * x * y + x * z );
	// t.y += 0.01 * ( 1 - b * (x ** 2) + y * z );
	// t.z += 0.01 * ( x - (x ** 2) - (y ** 2) );

	// Rössler
	// const a = 0.2, b = 0.2, c = 5.7;
	// t.x += 0.01 * (-(y + z));
	// t.y += 0.01 * (x + a * y);
	// t.z += 0.01 * (b + z * ( x - c));

	// Rabinovich-Fabrikant
	// const a = 0.14, b = 0.10;
	// t.x += 0.001 * (y * (z - 1 + (x ** 2)) + b * x);
	// t.y += 0.001 * (x * (3 * z + 1 - (x ** 2)) + b * y);
	// t.z += 0.001 * (-2 * z * (a + x * y));

	// Four-wing
	// const a = 0.2, b = 0.01, c = -0.4;
	// t.x += 0.05 * (a * x + y *z);
	// t.y += 0.05 * (b * x + c * y - x * z);
	// t.z += 0.05 * (-z - x * y);

	// Chen
	// const a = 5, b = -10, c = 0.38;
	// t.x += 0.001 * ( a * x - y * z );
	// t.y += 0.001 * ( b * y + x * z );
	// t.z += 0.001 * ( c * z + x * y / 3 );

	// Dadras
	// const a = 3, b = 2.7, c = 1.7, d = 2, e = 9;
	// t.x += 0.01 * (y - a * x + b * y * z);
	// t.y += 0.01 * (c * y - x * z + z);
	// t.z += 0.01 * (d * x * y - e * z);
	
	// Thomas
	// const b = 0.208186;
	// t.x += 0.1 * (Math.sin(y) - b * x);
	// t.y += 0.1 * (Math.sin(z) - b * y);
	// t.z += 0.1 * (Math.sin(x) - b * z);

	// Newton-liepnik
	// const a = 0.4, b = 0.175;
	// t.x += 0.001 * (-a * x + y + 10 * y * z);
	// t.y += 0.001 * (-x - 0.4 * y + 5 * x * z);
	// t.z += 0.001 * (b * z - 5 * x * y);

	// Hadley
	// const a = 0.2, b = 4, c = 8, d = 1;
	// t.x += 0.001 * (((-y) ** 2) - (z ** 2) - a * x + a * c);
	// t.y += 0.001 * (x * y - b * x * z - y + d);
	// t.z += 0.001 * (b * x * y + x * z - z);

	this.transform.dirty = true;
}

const ps: Particle[] = [];

const v = 3;
for (let x = -v; x <= v; x++) {

	for (let y = -v; y <= v; y++) {

		for (let z = -v; z <= v; z++) {
			const c = (Math.random() / 2) + 0.5;
			const p = new Particle(context, new Vector3(c, c, c), true);
			p.transform.position.x = x + Math.random();
			p.transform.position.y = y + Math.random();
			p.transform.position.z = z + Math.random();
			p.transform.dirty = true;

			p.update = update_particle;
			
			ps.push(p);
		}	
	}	
}

const p = ps[Math.round(Math.random() * ps.length-1)];
p.colour = new Vector3(1, 0, 0);

context.viewport(0, 0, canvas.width, canvas.height);
context.clearColor(0, 0, 0, 0);
context.enable(context.DEPTH_TEST);
context.enable(context.CULL_FACE);
context.enable(context.BLEND);
context.cullFace(context.BACK);

let last = 0;
let theta = 0;
const world_origin = new Vector3();
const world_up = new Vector3(0, 1, 0);
const camera_focus_point = new Vector3(0, 0, 0);

camera.transform.position.z = 200;
camera.transform.dirty = true;

const draw = function (now: number) {

	now *= 0.001;
	const delta_time = now - last;
	last = now;

	context.bindFramebuffer(context.FRAMEBUFFER, null);

	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

	theta += 0.01;
	theta %= Math.PI * 2;

	camera.transform.position.x = 20 * Math.cos(theta);
	camera.transform.position.z = camera_focus_point.z + 20 * Math.sin(theta);
	camera.transform.look_at(camera_focus_point, world_up);
	camera.transform.dirty = true;
	camera.update();
	
	for (let i = 0; i < ps.length; i++) {
		const p = ps[i];
		if(!p) continue;
		p.update();
		p.draw(context, delta_time, camera);
		if (!Number.isFinite(p.transform.position.x) || !Number.isFinite(p.transform.position.y) || !Number.isFinite(p.transform.position.z)) {
			p.transform.position.x = Math.random() * 10;
			p.transform.position.y = Math.random() * 10;
			p.transform.position.z = Math.random() * 10;
			//console.log("Gone");
		}
	}

	requestAnimationFrame(draw);
}


const resizeEvent = window.document.createEvent("UIEvents");
resizeEvent.initEvent("resize", true, false);
window.dispatchEvent(resizeEvent);

requestAnimationFrame(draw);
