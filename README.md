# Obsidian Prevent Double Extension Plugin

This plugin prevents the creation of files with double extensions such as `.jpg.md`. 

## Motivation

In Obsidian, when an attachment file such as a `.jpg` cannot be found in the Vault, it becomes an "unresolved link." When this link is opened, an undesired markdown file with an extension like `.jpg.md` is created.

![gif of how the plugin works](https://i.gyazo.com/175ca223db9d8e703179d9d56e014e02.gif)

**This plugin monitors file creation and blocks the creation of files with double extension in the format `.{extension}.md`.**
Also, the creation of accidental double extension files by core and community plugins can be prevented as well.

## Features

- **Automatic Block**: Blocks the creation of files with the `.{extension}.md` format.
- **Customizable Extension List**: You can define the extensions you want to target.
- **Works on Both Desktop and Mobile**: The plugin is compatible with both mobile and desktop versions of Obsidian.

**Note**: Renaming or moving files from outside the vault is not covered by the file monitor. If you need to create a note with a filename in the `.{extension}.md` format temporarily, you can create the note under a different name first and rename it manually afterward.
