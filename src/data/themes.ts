export const themeOptions = [
	{
		id: "earth-green-light",
		label: "Earth Green Light",
	},
	{
		id: "earth-green-dark",
		label: "Earth Green Dark",
	},
] as const;

export const defaultLightTheme = "earth-green-light";
export const defaultDarkTheme = "earth-green-dark";

export type ThemeId = (typeof themeOptions)[number]["id"];
