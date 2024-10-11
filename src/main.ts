import { App, Notice, Plugin, PluginManifest } from "obsidian";
import { applyFilePatch } from "./createFilePatch";
import { DEFAULT_SETTINGS, DoubleExtensionBlockerSettingTab } from "./settings";
import { Settings } from "./types";

export default class DoubleExtensionBlocker extends Plugin {
	settings: Settings;

	constructor(app: App, plugin: PluginManifest) {
		super(app, plugin);
		this.settings = {} as Settings;
	}

	async onload() {
		await this.loadSettings();

		this.applyObsidianPatch();

		this.addSettingTab(
			new DoubleExtensionBlockerSettingTab(this.app, this)
		);
	}

	onunload() {}

	private applyObsidianPatch() {
		this.app.workspace.onLayoutReady(() => {
			applyFilePatch(this);
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.normalizeSettings(this.settings);
		if (!this.validateSettings(this.settings)) {
			return;
		}

		await this.saveData(this.settings);
	}

	validateSettings(settings: Settings): boolean {
		// list of strings that are not allowed to be included in the file name
		const forbiddenStringsSet = new Set([
			"\\",
			"/",
			":",
			"*",
			"?",
			'"',
			"<",
			">",
			"|",
		]);

		// check if `.` is in the extension
		for (const extension of settings.targetExtensions) {
			if (extension.includes(".")) {
				new Notice(
					`The extension '${extension}' contains a period. Please remove the period.`
				);
				return false;
			}

			//check if the extension included in the list of strings that are not allowed to be included in the file name
			for (const forbiddenString of forbiddenStringsSet) {
				if (extension.includes(forbiddenString)) {
					new Notice(
						`The extension '${extension}' contains the character '${forbiddenString}'. Please remove the character.`
					);
					return false;
				}
			}
		}
		return true;
	}
	async normalizeSettings(settings: Settings) {
		// convert all extensions to lowercase
		settings.targetExtensions = settings.targetExtensions.map((ext) =>
			ext.toLowerCase()
		);
		// remove duplicates
		settings.targetExtensions = [...new Set(settings.targetExtensions)];
		// remove empty strings
		settings.targetExtensions = settings.targetExtensions.filter(
			(ext) => ext !== ""
		);
	}
}
