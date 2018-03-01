import fragment from 'Html-Fragment';
import kiteHtml from './kite.html';
import './kite.css';
import {RafBounce, getAnchor} from './utils';
import {positioner} from "./positioner";

const noop = Function.prototype;

let allKiteInstances = [];

const rafBouncedReposition = RafBounce(() => Kite.each(kite => kite.position()));

function addOrRemoveWindowEvents() {
	let kitesShowing = allKiteInstances.filter(kite => kite.showing);
	if (kitesShowing.length) {
		window.addEventListener('click', windowClick);
		window.addEventListener('resize', rafBouncedReposition);
		window.addEventListener('scroll', rafBouncedReposition);
	}
	else {
		window.removeEventListener('click', windowClick);
		window.removeEventListener('resize', rafBouncedReposition);
		window.removeEventListener('scroll', rafBouncedReposition);
	}
}

function windowClick(e) {
	Kite.each(kite => {
		if (
			!!e.target.closest('[data-kite-close]') ||
			!kite.options.stubborn &&
			!kite.anchor.contains(e.target) &&
			!kite.kite.contains(e.target) &&
			kite.showing
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

			// lifecycle callbacks
			afterCreation: noop,
			afterAttachment: noop,
			afterShow: noop,
			afterHide: noop,
		}, options);

		this.options.afterShow = [this.options.afterShow];
		this.options.afterHide = [this.options.afterHide];

		this.attached = false;
		this.showing = false;
		this.destroyed = false;

		this.kite = fragment(kiteHtml).firstChild;

		this.parts = {
			x: this.kite.querySelector('.js-kite-x'),
			tail: this.kite.querySelector('.js-kite-tail'),
			content: this.kite.querySelector('.js-kite-content'),
		};

		this.parts.content.innerHTML = this.options.html;
		this.anchor.addEventListener('click', ::this.show);

		this.options.afterCreation(this);

		if (this.options.instant) {
			this.show();
		}
	}

	show() {
		if (this.showing) {
			return this;
		}

		if (!this.attached) {
			document.body.appendChild(this.kite);
			this.attached = true;
			this.options.afterAttachment(this);
		}

		this.showing = true;
		this.kite.classList.add('Kite--show');

		this._setupX();
		this._setupTail();
		this.position();

		this.options.afterShow.forEach(cb => cb(this));

		addOrRemoveWindowEvents();
	}

	hide() {
		this.showing = false;
		this.kite.classList.remove('Kite--show');
		this.kite.style.zIndex = 'auto';

		this.options.afterHide.forEach(cb => cb(this));

		addOrRemoveWindowEvents();
	}

	position() {
		if (this.showing) {
			positioner.call(this);
		}
	}

	destroy() {
		if (this.attached) {
			this.kite.parentNode.removeChild(this.kite);
		}

		this.anchor.removeEventListener('click', this._boundShow);

		allKiteInstances = allKiteInstances.filter(kite => kite !== this);

		Object.keys(this).forEach(key => {
			delete this[key];
		});

		this.destroyed = true;

		addOrRemoveWindowEvents();
	}

	onShow(cb) {
		if (cb instanceof Function) {
			this.options.afterShow.push(cb);
		}
	}

	onHide(cb) {
		if (cb instanceof Function) {
			this.options.afterHide.push(cb);
		}
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
