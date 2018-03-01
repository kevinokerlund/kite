export function getAnchor(anchorElementOrSelector) {
	let anchor;
	if (anchorElementOrSelector.nodeType && anchorElementOrSelector.nodeType === 1) {
		anchor = anchorElementOrSelector;
	} else {
		anchor = document.querySelector(anchorElementOrSelector);
	}

	if (!anchor) {
		throw new TypeError('A valid DOM element or selector must be used to create a Kite.')
	}

	return anchor;
}

export function getElementCoordinates(referenceElement) {
	const docRect = document.documentElement.getBoundingClientRect();
	const elementRect = referenceElement.getBoundingClientRect();

	return {
		top: elementRect.top - docRect.top,
		left: elementRect.left - docRect.left
	};
}

export function highestZIndex() {
	const elems = document.querySelectorAll('*');
	let highest = 0;
	for (let i = 0; i < elems.length; i++) {
		const zIndex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index");
		if ((zIndex > highest) && (zIndex !== 'auto')) {
			highest = zIndex;
		}
	}
	return parseInt(highest);
}


class Bouncer {
	constructor(callback) {
		this.callback = callback;
		this.ticking = false;
	}

	update(args) {
		this.callback && this.callback(...args);
		this.ticking = false;
	}

	requestTick(args) {
		if (!this.ticking) {
			this.ticking = true;
			window.requestAnimationFrame(this.update.bind(this, args));
		}
	}

	handle(...args) {
		this.requestTick(args);
	}
}

export function RafBounce(callback) {
	const instance = new Bouncer(callback);
	return instance.handle.bind(instance);
}
