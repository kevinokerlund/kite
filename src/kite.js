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
	let shoudClose = !!e.srcElement.closest('[data-kite-close]');
	let anchorOrKiteElement;

	if (!shoudClose) {
		anchorOrKiteElement = allKiteInstances.find(kite => {
			return (kite.anchor.contains(e.srcElement) || kite.kite.contains(e.srcElement));
		});
	}

	Kite.each(kite => {
		if (shoudClose || (!kite.options.stubborn && kite !== anchorOrKiteElement)) {
			kite.hide();
		}
	});
}

class Kite {
	constructor(anchorElementOrSelector, options) {
		allKiteInstances.push(this);
		this.anchor = getAnchor(anchorElementOrSelector);
		this.options = Object.assign({
			closeX: true,
			html: '',
			position: 'top',
			stubborn: false,
		}, options);

		this.attached = false;
		this.kite = fragment(kiteHtml).firstChild;
		this.distance = 10;
		this.showing = false;

		this.kite.querySelector('.js-kite-content').innerHTML = this.options.html;
		this.anchor.addEventListener('click', this.show.bind(this));
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
