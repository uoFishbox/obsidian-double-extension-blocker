import { around } from "monkey-around";
import { DataWriteOptions, Notice, Vault } from "obsidian";
import BlockDoubleExt from "./main";

export const patchFile = (plugin: BlockDoubleExt) => {
	const vaultPrototype = Vault.prototype;

	const targetextensions = plugin.settings.extensions;

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
							if (path.endsWith("." + extension + ".md")) {
								ext = extension;
								stopFunction(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						handleError(plugin, error, ext);
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
								stopFunction(ext);
							}
						}

						return original.call(this, path, data, options);
					} catch (error) {
						handleError(plugin, error, ext);
					}
				};
			},
		})
	);
};

function stopFunction(blockedext: string): void {
	throw new Error(
		`The creation of a file with the extension '.${blockedext}.md' is blocked`
	);
}

function handleError(
	plugin: BlockDoubleExt,
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
