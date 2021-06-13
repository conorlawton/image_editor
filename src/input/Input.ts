export default class Input {

	windowFocused: boolean;

	actions: {[index: string]: InputAction}

	constructor() {
		window.addEventListener("keydown", this.keydown.bind(this));
		window.addEventListener("keyup", this.keyup.bind(this));
		window.addEventListener("blur", this.window_lose_focus.bind(this));
		window.addEventListener("focus", this.window_gain_focus.bind(this));
		this.actions = {};
	}

	keydown(event: KeyboardEvent) {
		const action = this.actions[event.key];
		if (action) {
			if (!event.repeat) {
				action.start();
			} else if (action.repeat) {
				action.start();
			}
		}
	}

	keyup(event: KeyboardEvent) {
		this.actions[event.key]?.cancel();
	}

	window_lose_focus() {
		this.windowFocused = false;
	}

	window_gain_focus() {
		this.windowFocused = true;
	}

	register_action(input_action: InputAction) {
		this.actions[input_action.key_name] = input_action;
	}

	deregister_action(key_name: string) {
		delete this.actions[key_name];
	}
}

export class InputAction {
	key_name: string;
	repeat: boolean;
	isDown: boolean;
	
	started: Function;
	cancelled: Function;
	performed: Function;

	constructor(key_name: string, repeat?: boolean) {
		this.key_name = key_name;
		this.isDown = false;
		this.repeat = repeat ?? false;
	}

	start() {
		this.isDown = true;
		this.started && this.started();
	}

	cancel() {
		this.isDown = false;
		this.cancelled && this.cancelled();
	}
}