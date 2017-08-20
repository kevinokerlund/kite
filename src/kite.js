import fragment from 'Html-Fragment';
import kiteHtml from './kite.html';
import css from './kite.css';
import {getAnchor} from './utils';
import {positioner} from "./positioner";

let noCSS = true;

class Kite {
	constructor(anchorElementOrSelector, options) {
		this.anchor = getAnchor(anchorElementOrSelector);
		this.attached = false;
		this.kite = fragment(kiteHtml).firstChild;
		this.distance = 10;

		this.options = Object.assign({
			position: 'top',
			closeX: true
		}, options);
	}

	show() {
		document.body.appendChild(this.kite);
		if (noCSS) {
			css.use();
			noCSS = false;
		}

		if (!this.attached) {
			this.attached = true;
		}

		this.position();
	}

	hide() {

	}

	position() {
		positioner.call(this);
	}

	destroy() {

	}

	static get fn() {
		return this.prototype;
	}

	static create(...args) {
		return new Kite(...args);
	}
}

export default Kite;
