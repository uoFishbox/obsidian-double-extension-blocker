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
			//  The patches for create and createBinary duplicate processing because the arguments are the same, but since the arguments for additional methods to be patched in the future may not be the same, the processing will not be combined.
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
								blockFileCreation(extension);
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

function blockFileCreation(extension: string): void {
	throw new Error(
		`File creation has been blocked due to the file name containing a double extension (.${extension}.md).`
	);
}

function NotifyBlockedFileCreation(
	plugin: DoubleExtensionBlocker,
	error: unknown,
	path: string
): void {
	if (error instanceof Error && plugin.settings.noticeEnabled) {
		new Notice(error.message, 3000);
	}
}
