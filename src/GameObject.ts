import Component from "./Component";
import Transform from "./Transform";

export default class GameObject {
	id: number;
	components: Component[];
	transform: Transform;
}