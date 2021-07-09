/**
 * @param {HTMLDetailsElement} details
 * @param {(open: boolean) => void} callback
 */
export function toggle(details, callback) {
	/** @type {HTMLElement} */
	const summary = details.querySelector('summary');

	/** @type {Animation} */
	let animation;

	let open = details.open;

	/**
	 * @param {number} a
	 * @param {number} b
	 * @param {boolean} value
	 */
	function animate(a, b, value) {
		details.style.overflow = 'hidden';
		animation = details.animate(
			{
				height: [`${a}px`, `${b}px`]
			},
			{
				duration: 30 * Math.log(Math.abs(b - a)),
				easing: 'ease-out'
			}
		);

		callback((open = value));

		animation.onfinish = () => {
			details.open = value;
			details.style.overflow = '';
		};
	}

	/** @param {MouseEvent} e */
	function handle_click(e) {
		e.preventDefault();

		if (open) {
			const a = details.offsetHeight;
			const b = summary.offsetHeight;

			animate(a, b, false);
		} else {
			const a = details.offsetHeight;
			if (animation) animation.cancel();
			details.open = true;
			const b = details.offsetHeight;

			animate(a, b, true);
		}
	}

	summary.addEventListener('click', handle_click);

	return {
		destroy() {
			summary.removeEventListener('click', handle_click);
		}
	};
}
