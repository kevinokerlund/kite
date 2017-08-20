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
	let anchorOrKiteElement = allKiteInstances.find(kite => {
		return (kite.anchor.contains(e.target) || kite.kite.contains(e.target))
	});

	Kite.each(kite => {
		if (kite !== anchorOrKiteElement) {
			kite.hide();
		}
	});
}

class Kite {
	constructor(anchorElementOrSelector, options) {
		allKiteInstances.push(this);
		this.anchor = getAnchor(anchorElementOrSelector);
		this.options = Object.assign({
			position: 'top',
			closeX: true,
			html: ''
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
		document.body.appendChild(this.kite);

		this.showing = true;
		this.attached = true;

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
