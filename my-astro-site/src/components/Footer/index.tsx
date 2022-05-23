import Styles from './styles.module.scss';

export function Footer() {
	return (
		<footer class="footer my-6">
			<div class="container flex flex-wrap gap-2 flex-col sm:flex-row">
				<div class="flex flex-grow">
					<div class="lt-sm:space-y-2">
						<label for="pet-select">Change Theme:</label>
						<select class="theme-options" name="Theme Selector">
							<option value="system" selected="selected">System</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
						<span class="ml-2"></span>
						<button class="btn btn-highlight" id="reset-cache" type="button" title="Clear Cache / Force Reload Site">
							<svg class="icon" viewbox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
								<path d="M12 4.5a7.5 7.5 0 1 0 7.419 6.392c-.067-.454.265-.892.724-.892.37 0 .696.256.752.623A9 9 0 1 1 18 5.292V4.25a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h1.35a7.474 7.474 0 0 0-5.1-2Z" fill="currentColor" />
							</svg>
						</button>
					</div>
					<div class="flex-grow text-right">
						<div class="px-4 py-2 inline-block">(c) 2022 <a href="https://okikio.dev" target="_blank" rel="noopener">Okiki Ojo</a> </div>
					</div>
				</div>
				<div class="flex-grow"></div>
				<div class="flex flex-wrap gap-2 justify-end">
					<p class="bg-gray-200 dark:bg-quaternary inline-block px-4 py-2 rounded-md">
						<span> Made by </span>
						<a href="https://github.com/okikio" target="_blank" rel="noopener">@okikio</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
export default Footer;
