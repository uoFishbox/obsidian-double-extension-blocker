import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { patchFile } from "./createFilePatch";

interface Settings {
	extensions: Array<string>;
}

const DEFAULT_SETTINGS: Settings = {
	extensions: ["pdf", "jpg", "jpeg", "png", "webp"],
};

export default class BlockDoubleExt extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.patchObsidian();

		// This adds a settings tab so the user can configure various aspects of the plugin
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

class SettingTab extends PluginSettingTab {
	plugin: BlockDoubleExt;

	constructor(app: App, plugin: BlockDoubleExt) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Target extensions to block creation")
			.setDesc(
				"`. {extension}.md` file format will be blocked. Consider the list of extensions specified below."
			)
			// add newline
			.addTextArea((text) =>
				text
					// .setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.extensions.join(","))
					.onChange(async (value) => {
						this.plugin.settings.extensions = value.split(",");
						await this.plugin.saveSettings();
					})
			);
	}
}
