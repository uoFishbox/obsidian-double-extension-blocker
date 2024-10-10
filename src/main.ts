import { Plugin } from "obsidian";
import { applyFilePatch } from "./createFilePatch";
import { DEFAULT_SETTINGS, DoubleExtensionSettingTab } from "./settings";
import { Settings } from "./types";

export default class DoubleExtensionBlocker extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.applyObsidianPatch();

		this.addSettingTab(new DoubleExtensionSettingTab(this.app, this));
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
		await this.saveData(this.settings);
	}
}
