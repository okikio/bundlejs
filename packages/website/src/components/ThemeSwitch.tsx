import { ComponentProps, onMount } from "solid-js";
import { themeSet, themeGet, runTheme } from "../scripts/theme";

export function ThemeSwitch() {
	let ref: HTMLSelectElement;
	let html: HTMLHtmlElement;
	let onChange: ComponentProps<'select'>['onChange'] = ({ currentTarget: el }) => {
		html = html ?? document.querySelector('html');
		themeSet(el.value, html);
		el.value = themeGet(html);
	};

	onMount(() => {
		html = html ?? document.querySelector('html');
		runTheme(html);
		ref.value = themeGet(html);
	});

	return (
		<select class="theme-options" id="theme-selector" name="Theme Selector" onChange={onChange} ref={ref} custom-theme-switch>
			<option value="system" selected={true}>System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	);
}

export default ThemeSwitch;
