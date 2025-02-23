# Obsidian Double Extension Blocker

This plugin blocks the creation of files with double extension such as `.jpg.md`.

## Motivation

In Obsidian, when an attachment file such as a `.jpg` cannot be found in the Vault, it becomes an "unresolved link." When this link is opened, an undesired markdown file with an extension like `.jpg.md` is created.

![gif of how the plugin works](https://i.gyazo.com/175ca223db9d8e703179d9d56e014e02.gif)

To prevent this, the plugin blocks the creation of markdown files when the filename ends with a double extension. It checks and blocks the filename during all markdown file creation events, not just when opening an unresolved link.

## Features

-   **Automatic Block**: Blocks the creation of files with the `.{extension}.md` format.
-   **Customizable Extension List**: You can define the extensions you want to target. (default: `["pdf", "jpg", "jpeg", "png", "webp"]`)
-   **Works on Both Desktop and Mobile**: The plugin is compatible with both mobile and desktop versions of Obsidian.

**Note**: This plugin does not modify existing files. Additionally, it is designed to ignore file extensions when renaming existing files, accommodating scenarios where notes with double extensions need to be created.

## Installation

You can use [BRAT](https://github.com/TfTHacker/obsidian42-brat) to register and install `uoFishbox/obsidian-double-extension-blocker`.
