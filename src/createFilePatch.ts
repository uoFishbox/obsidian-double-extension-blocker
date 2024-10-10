import { around } from "monkey-around";
import { DataWriteOptions, Notice, Vault } from "obsidian";
import DoubleExtensionBlocker from "./main";

export const applyFilePatch = (plugin: DoubleExtensionBlocker) => {
	const vaultPrototype = Vault.prototype;

	const targetextensions = plugin.settings.targetExtensions;

	plugin.register(
		around(vaultPrototype, {
			create(original) {
				return function (
					path: string,
					data: string,
					options?: DataWriteOptions
				) {
					let ext = "";
					try {
						for (const extension of targetextensions) {
							if (
								path
									.toLowerCase()
									.endsWith("." + extension + ".md")
							) {
								ext = extension;
								blockFileCreation(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error, ext);
					}
				};
			},
			createBinary(original) {
				return function (
					path: string,
					data: ArrayBuffer,
					options?: DataWriteOptions
				) {
					let ext = "";
					try {
						for (const extension of targetextensions) {
							if (path.endsWith("." + extension + ".md")) {
								ext = extension;
								blockFileCreation(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error, ext);
					}
				};
			},
		})
	);
};

function blockFileCreation(blockedext: string): void {
	throw new Error(
		`The creation of a file with the extension '.${blockedext}.md' is blocked`
	);
}

function NotifyBlockedFileCreation(
	plugin: DoubleExtensionBlocker,
	error: unknown,
	blockedext: string
): void {
	if (error && plugin.settings.noticeEnabled) {
		new Notice(
			`The creation of a file with the extension '.${blockedext}.md' is blocked`,
			1500
		);
	}
}
