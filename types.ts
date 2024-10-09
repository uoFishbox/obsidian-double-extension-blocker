export interface Settings {
	extensions: Array<string>;
	enableNotice: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	extensions: ["pdf", "jpg", "jpeg", "png", "webp"],
	enableNotice: true,
};
