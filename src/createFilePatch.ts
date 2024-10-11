import { around } from "monkey-around";
import { DataWriteOptions, Vault } from "obsidian";
import DoubleExtensionBlocker from "./main";

export const applyFilePatch = (plugin: DoubleExtensionBlocker) => {
	const vaultPrototype = Vault.prototype;

	// Remove "md" from the list of target extensions
	const targetExtensions = plugin.settings.targetExtensions.filter(
		(ext) => ext !== "md"
	);

	// Register to be unloaded
	plugin.register(
		around(vaultPrototype, {
			create(original) {
				return function (
					this: Vault,
					path: string,
					data: string,
					options?: DataWriteOptions
				) {
					try {
						for (const extension of targetExtensions) {
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
						// NotifyBlockedFileCreation(plugin, error);
						return Promise.reject(error);
					}
				};
			},
			createBinary(original) {
				return function (
					this: Vault,
					path: string,
					data: ArrayBuffer,
					options?: DataWriteOptions
				) {
					try {
						for (const extension of targetExtensions) {
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
						// NotifyBlockedFileCreation(plugin, error);
						return Promise.reject(error);
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

// function NotifyBlockedFileCreation(
// 	plugin: DoubleExtensionBlocker,
// 	error: unknown
// ): void {
// 	if (error instanceof Error && plugin.settings.noticeEnabled) {
// 		new Notice(error.message, 2000);
// 	}
// }
