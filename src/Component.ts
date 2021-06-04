export default abstract class Component {
	enabled: boolean
	constructor(enabled?: boolean) {
		this.enabled = enabled ?? false;
	}

	abstract onInit(): void;
	abstract update(): void;
	abstract onDestroy(): void;
	abstract onPreRender(): void;
	abstract onPostRender(): void;
}