import { App, PluginSettingTab, Setting } from "obsidian";
import BlockDoubleExt from "./main";

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
				"`. {extension}.md` file format will be blocked. Consider the list of extensions specified below."
			)
			// add description as markdown

			.addTextArea((text) =>
				text
					// .setPlaceholder("Enter your secret")
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
					.setValue(this.plugin.settings.enableNotice)
					.onChange(async (value) => {
						this.plugin.settings.enableNotice = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
