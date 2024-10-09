import { around } from "monkey-around";
import { DataWriteOptions, Notice, Vault } from "obsidian";
import AntiAttachmentMd from "./main";

export const patchFile = (plugin: AntiAttachmentMd) => {
	const vaultPrototype = Vault.prototype;

	plugin.register(
		around(vaultPrototype, {
			create(original) {
				return function (
					path: string,
					data: string,
					options?: DataWriteOptions
				) {
					try {
						if (path.endsWith(".pdf.md")) {
							stopFunction();
						}
						return original.call(this, path, data, options);
					} catch (error) {
						handleError(error);
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
						if (path.endsWith(".pdf.md")) {
							stopFunction();
						}
						return original.call(this, path, data, options);
					} catch (error) {
						handleError(error);
					}
				};
			},
		})
	);
};

function stopFunction(): void {
	throw new Error(
		"Blocked the creation of a file with the .pdf.md extension."
	);
}

function handleError(error: unknown): void {
	if (error instanceof Error) {
		new Notice(
			"Blocked the creation of a file with the .pdf.md extension.",
			1500
		);
	} else {
		new Notice("Unknown error occurred.", 1500);
	}
}
