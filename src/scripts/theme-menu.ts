type ClientThemeOption = {
	id: string;
	familyLabel: string;
	label: string;
};

type ThemeConfig = {
	defaultDarkTheme: string;
	defaultLightTheme: string;
	themeOptions: ClientThemeOption[];
};

const fallbackThemeConfig: ThemeConfig = {
	defaultDarkTheme: "techzeph-dark",
	defaultLightTheme: "earth-green",
	themeOptions: [],
};

function isClientThemeOption(theme: unknown): theme is ClientThemeOption {
	return (
		typeof theme === "object" &&
		theme !== null &&
		"id" in theme &&
		"familyLabel" in theme &&
		"label" in theme &&
		typeof theme.id === "string" &&
		typeof theme.familyLabel === "string" &&
		typeof theme.label === "string"
	);
}

function parseThemeConfig(configText: string | null | undefined): ThemeConfig {
	if (!configText) {
		return fallbackThemeConfig;
	}

	try {
		const parsed = JSON.parse(configText) as Partial<ThemeConfig>;

		return {
			defaultDarkTheme:
				typeof parsed.defaultDarkTheme === "string"
					? parsed.defaultDarkTheme
					: fallbackThemeConfig.defaultDarkTheme,
			defaultLightTheme:
				typeof parsed.defaultLightTheme === "string"
					? parsed.defaultLightTheme
					: fallbackThemeConfig.defaultLightTheme,
			themeOptions: Array.isArray(parsed.themeOptions)
				? parsed.themeOptions.filter(isClientThemeOption)
				: [],
		};
	} catch {
		return fallbackThemeConfig;
	}
}

const themeMenu = document.querySelector("[data-theme-menu]");
const themeTrigger = document.querySelector("[data-theme-trigger]");
const themeOptionsPanel = document.querySelector("[data-theme-options]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeChoiceButtons = document.querySelectorAll("[data-theme-option]");
const themeConfigElement = document.querySelector("[data-theme-config]");
const themeConfig = parseThemeConfig(themeConfigElement?.textContent);
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const clientThemeOptions = themeConfig.themeOptions;
const themeIds = clientThemeOptions.map((theme) => theme.id);
const themeLabels = Object.fromEntries(
	clientThemeOptions.map((theme) => [theme.id, `${theme.familyLabel} ${theme.label}`]),
);

function normalizeStoredTheme(theme: unknown): string | null {
	if (typeof theme !== "string") {
		return null;
	}

	if (theme === "light") {
		return themeConfig.defaultLightTheme;
	}

	if (theme === "dark") {
		return themeConfig.defaultDarkTheme;
	}

	return themeIds.includes(theme) ? theme : null;
}

function getCurrentTheme(): string {
	const storedTheme = normalizeStoredTheme(localStorage.getItem("theme"));
	if (storedTheme) {
		return storedTheme;
	}

	return systemPrefersDark.matches ? themeConfig.defaultDarkTheme : themeConfig.defaultLightTheme;
}

function setTheme(theme: unknown) {
	const nextTheme = normalizeStoredTheme(theme) ?? themeConfig.defaultLightTheme;
	document.documentElement.dataset.theme = nextTheme;
	localStorage.setItem("theme", nextTheme);

	if (themeLabel) {
		themeLabel.textContent = themeLabels[nextTheme] ?? "Theme";
	}

	document.querySelectorAll("[data-theme-check]").forEach((check) => {
		const isSelected = check.getAttribute("data-theme-check") === nextTheme;
		check.classList.toggle("opacity-0", !isSelected);
		check.classList.toggle("opacity-100", isSelected);
	});

	document.querySelectorAll("[data-theme-selected-text]").forEach((selectedText) => {
		const isSelected = selectedText.getAttribute("data-theme-selected-text") === nextTheme;
		selectedText.textContent = isSelected ? "Selected theme" : "";
	});
}

function closeThemeMenu() {
	themeOptionsPanel?.classList.add("hidden");
	themeTrigger?.setAttribute("aria-expanded", "false");
}

function toggleThemeMenu() {
	const isOpen = themeTrigger?.getAttribute("aria-expanded") === "true";
	themeOptionsPanel?.classList.toggle("hidden", isOpen);
	themeTrigger?.setAttribute("aria-expanded", String(!isOpen));
}

if (themeTrigger) {
	themeTrigger.addEventListener("click", toggleThemeMenu);
}

themeChoiceButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const selectedTheme = button.getAttribute("data-theme-option");
		setTheme(selectedTheme);
		closeThemeMenu();
		if (themeTrigger instanceof HTMLElement) {
			themeTrigger.focus();
		}
	});
});

document.addEventListener("click", (event) => {
	if (themeMenu && event.target instanceof Node && !themeMenu.contains(event.target)) {
		closeThemeMenu();
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeThemeMenu();
		if (themeTrigger instanceof HTMLElement) {
			themeTrigger.focus();
		}
	}
});

setTheme(getCurrentTheme());
