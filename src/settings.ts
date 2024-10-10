import { App, PluginSettingTab, Setting } from "obsidian";
import BlockDoubleExt from "./main";
import { Settings } from "./types";

export const DEFAULT_SETTINGS: Settings = {
	extensions: ["pdf", "jpg", "jpeg", "png", "webp"],
	noticeEnabled: true,
};

export class SettingTab extends PluginSettingTab {
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
				"Blocks the creation of files with {extension}.md at the end of the filename."
			)
			// add description as markdown

			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.extensions.join(","))
					.onChange(async (value) => {
						this.plugin.settings.extensions = value.split(",");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)

			.setName("Show notification when blocking")

			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.noticeEnabled)
					.onChange(async (value) => {
						this.plugin.settings.noticeEnabled = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
