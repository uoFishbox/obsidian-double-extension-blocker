import { around } from "monkey-around";
import { DataWriteOptions, Notice, Vault } from "obsidian";
import DoubleExtensionBlocker from "./main";

export const applyFilePatch = (plugin: DoubleExtensionBlocker) => {
	const vaultPrototype = Vault.prototype;

	// Remove "md" from the list of target extensions
	const targetextensions = plugin.settings.targetExtensions.filter(
		(ext) => ext !== "md"
	);

	plugin.register(
		around(vaultPrototype, {
			create(original) {
				return function (
					path: string,
					data: string,
					options?: DataWriteOptions
				) {
					try {
						for (const extension of targetextensions) {
							if (
								path
									.toLowerCase()
									.endsWith("." + extension + ".md")
							) {
								const ext = extension;
								blockFileCreation(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error, path);
					}
				};
			},
			createBinary(original) {
				return function (
					path: string,
					data: ArrayBuffer,
					options?: DataWriteOptions
				) {
					try {
						for (const extension of targetextensions) {
							if (path.endsWith("." + extension + ".md")) {
								const ext = extension;
								blockFileCreation(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error, path);
					}
				};
			},
		})
	);
};

function blockFileCreation(path: string): void {
	throw new Error(
		`The creation of a markdown file with the double extension '${path}' was blocked.`
	);
}

function NotifyBlockedFileCreation(
	plugin: DoubleExtensionBlocker,
	error: unknown,
	path: string
): void {
	if (error && plugin.settings.noticeEnabled) {
		new Notice(
			`The creation of a markdown file with the double extension '${path}' was blocked.`,
			2500
		);
	}
}
