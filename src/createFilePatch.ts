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
								blockFileCreation(extension);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error);
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
							if (
								path
									.toLowerCase()
									.endsWith("." + extension + ".md")
							) {
								blockFileCreation(extension);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						NotifyBlockedFileCreation(plugin, error);
					}
				};
			},
		})
	);
};

function blockFileCreation(extension: string): void {
	throw new Error(
		`File creation has been blocked due to the file name containing a double extension (.${extension}.md).`
	);
}

function NotifyBlockedFileCreation(
	plugin: DoubleExtensionBlocker,
	error: unknown
): void {
	if (error instanceof Error && plugin.settings.noticeEnabled) {
		new Notice(error.message, 3000);
	}
}
