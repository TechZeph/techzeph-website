export const themeOptions = [
	{
		id: "earth-green-light",
		family: "earth-green",
		familyLabel: "Earth Green",
		mode: "light",
		label: "Light",
	},
	{
		id: "earth-green-dark",
		family: "earth-green",
		familyLabel: "Earth Green",
		mode: "dark",
		label: "Dark",
	},
] as const;

export const defaultLightTheme = "earth-green-light";
export const defaultDarkTheme = "earth-green-dark";

export type ThemeId = (typeof themeOptions)[number]["id"];
export type ThemeMode = (typeof themeOptions)[number]["mode"];
