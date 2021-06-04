import Vector3 from "./Vector3";
import Matrix4x4 from "./Matrix4x4";
import Camera from "./Camera";
import Quad from "./Quad";
import Cube from "./Cube";
import Quaternion from "./Quaternion";

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



const cubes: Cube[] = [];

for (let x = -5; x < 5; x++) {

	for (let y = -5; y < 5; y++) {

		for (let z = -10; z < 0; z++) {
			const cube = new Cube(context);
			cube.transform.position = new Vector3(x / 5, y / 5, z / 5);
			cube.transform.scale = new Vector3(0.1, 0.1, 0.1);
			cubes.push(cube);
		}
	}
}

context.viewport(0, 0, canvas.width, canvas.height);
context.clearColor(0, 0, 0, 0);
context.enable(context.DEPTH_TEST);
context.enable(context.CULL_FACE);
context.cullFace(context.BACK);

let last = 0;
const draw = function (now: number) {

	now *= 0.001;
	const delta_time = now - last;
	last = now;

	context.bindFramebuffer(context.FRAMEBUFFER, null);

	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

	camera.rotate(Quaternion.from_euler(new Vector3(0, 1 * delta_time, 0)));

	for (let i = 0; i < cubes.length; i++) {
		cubes[i].draw(context, delta_time, camera);
	}

	requestAnimationFrame(draw);
}


const resizeEvent = window.document.createEvent("UIEvents");
resizeEvent.initEvent("resize", true, false);
window.dispatchEvent(resizeEvent);

requestAnimationFrame(draw);
