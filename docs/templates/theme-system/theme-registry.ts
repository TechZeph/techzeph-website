export const themeOptions = [
	{
		id: "customer-slug-light",
		family: "customer-slug",
		familyLabel: "Customer Name",
		mode: "light",
		label: "Light",
	},
	{
		id: "customer-slug-dark",
		family: "customer-slug",
		familyLabel: "Customer Name",
		mode: "dark",
		label: "Dark",
	},
] as const;

export const defaultLightTheme = "customer-slug-light";
export const defaultDarkTheme = "customer-slug-dark";

export type ThemeId = (typeof themeOptions)[number]["id"];
export type ThemeMode = (typeof themeOptions)[number]["mode"];
