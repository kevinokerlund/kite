import {getElementCoordinates, highestZIndex} from './utils';

export function positioner() {
	let anchorCoords = getElementCoordinates(this.anchor);
	let anchorRect = this.anchor.getBoundingClientRect();
	let kiteRect = this.kite.getBoundingClientRect();
	let top;
	let left;
	let zIndex = highestZIndex() + 10;

	const position = this.options.position;

	if (position === 'top' || position === 'bottom') {
		left = (anchorCoords.left - ((kiteRect.width - anchorRect.width) / 2)) + 'px';
		if (position === 'top') {
			top = (anchorCoords.top - kiteRect.height - this.distance) + 'px';
		}
		else {
			top = (anchorCoords.top + anchorRect.height + this.distance) + 'px';
		}
	}
	else {
		top = (anchorCoords.top - ((kiteRect.height - anchorRect.height) / 2)) + 'px';
		if (position === 'right') {
			left = (anchorCoords.left + anchorRect.width + this.distance) + 'px';
		}
		else {
			left = (anchorCoords.left - kiteRect.width - this.distance) + 'px';
		}
	}

	this.kite.classList.add(`Kite--${position}`);

	Object.assign(this.kite.style, {
		top,
		left,
		zIndex
	});
}
