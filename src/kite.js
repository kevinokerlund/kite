import fragment from 'Html-Fragment';
import kiteHtml from './kite.html';
import css from './kite.css';
import {getAnchor} from './utils';
import {positioner} from "./positioner";

let allKiteInstances = [];

function addOrRemoveWindowEvents() {
	let kitesShowing = allKiteInstances.filter(kite => kite.showing);
	if (kitesShowing.length) {
		window.addEventListener('click', windowClick);
	}
	else {
		window.removeEventListener('click', windowClick);
	}
}

function windowClick(e) {
	Kite.each(kite => {
		if (
			!!e.srcElement.closest('[data-kite-close]') ||
			!kite.options.stubborn &&
			!kite.anchor.contains(e.srcElement) &&
			!kite.kite.contains(e.srcElement)
		) {
			kite.hide();
		}
	});
}

class Kite {
	constructor(anchorElementOrSelector, options) {
		allKiteInstances.push(this);
		this.anchor = getAnchor(anchorElementOrSelector);
		this.options = Object.assign({
			distance: 0,
			html: '',
			instant: false,
			position: 'top',
			stubborn: false,
			tail: false,
			x: false,
		}, options);

		this.attached = false;
		this.showing = false;

		this.kite = fragment(kiteHtml).firstChild;

		this.parts = {
			x: this.kite.querySelector('.js-kite-x'),
			tail: this.kite.querySelector('.js-kite-tail'),
			content: this.kite.querySelector('.js-kite-content'),
		};

		this.parts.content.innerHTML = this.options.html;
		this.anchor.addEventListener('click', this.show.bind(this));

		if (this.options.instant) {
			this.show();
		}
	}

	show() {
		css.use();

		if (this.showing) {
			return this;
		}

		if (!this.attached) {
			document.body.appendChild(this.kite);
			this.attached = true;
		}

		this.showing = true;
		this.kite.classList.add('Kite--show');

		this._setupX();
		this._setupTail();
		this.position();
		addOrRemoveWindowEvents();
	}

	hide() {
		this.showing = false;
		this.kite.classList.remove('Kite--show');
		this.kite.style.zIndex = 'auto';
		addOrRemoveWindowEvents();
	}

	position() {
		positioner.call(this);
	}

	destroy() {

	}

	_setupX() {
		this.parts.x.style.display = (this.options.x) ? '' : 'none';
	}

	_setupTail() {
		this.parts.tail.style.display = (this.options.tail) ? '' : 'none';
	}

	static get fn() {
		return this.prototype;
	}

	static create(...args) {
		return new Kite(...args);
	}

	static each(cb) {
		allKiteInstances.forEach(cb);
	}
}

export default Kite;
