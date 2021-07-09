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

	/** @param {MouseEvent} e */
	function handle_click(e) {
		e.preventDefault();

		if (open) {
			const a = details.offsetHeight;
			const b = summary.offsetHeight;

			animation = details.animate(
				{
					height: [`${a}px`, `${b}px`]
				},
				{
					duration: 30 * Math.log(Math.abs(b - a)),
					easing: 'ease-out'
				}
			);

			callback((open = false));

			animation.onfinish = () => {
				details.open = false;
			};
		} else {
			const a = details.offsetHeight;
			if (animation) animation.cancel();
			details.open = true;
			const b = details.offsetHeight;

			animation = details.animate(
				{
					height: [`${a}px`, `${b}px`]
				},
				{
					duration: 30 * Math.log(Math.abs(b - a)),
					easing: 'ease-out'
				}
			);

			callback((open = true));

			animation.onfinish = () => {
				details.open = true;
			};
		}
	}

	summary.addEventListener('click', handle_click);

	return {
		destroy() {
			summary.removeEventListener('click', handle_click);
		}
	};
}
