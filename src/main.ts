import { Plugin } from "obsidian";
import { patchFile } from "./createFilePatch";
import { DEFAULT_SETTINGS, SettingTab } from "./settings";
import { Settings } from "./types";

export default class BlockDoubleExt extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.patchObsidian();

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	private patchObsidian() {
		this.app.workspace.onLayoutReady(() => {
			patchFile(this);
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
