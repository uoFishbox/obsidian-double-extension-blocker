import { App, PluginSettingTab, Setting } from "obsidian";
import DoubleExtensionBlocker from "./main";
import { Settings } from "./types";

export const DEFAULT_SETTINGS: Settings = {
	targetExtensions: ["pdf", "jpg", "jpeg", "png", "webp"],
};

export class DoubleExtensionBlockerSettingTab extends PluginSettingTab {
	plugin: DoubleExtensionBlocker;

	constructor(app: App, plugin: DoubleExtensionBlocker) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			// !todo: rewrite following description
			.setName("Target extensions to block creation")
			.setDesc(
				"Blocks the creation of files with {extension}.md at the end of the filename."
			)
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.targetExtensions.join(","))
					.onChange(async (value) => {
						this.plugin.settings.targetExtensions =
							value.split(",");
						await this.plugin.saveSettings();
					})
			);
	}
}
