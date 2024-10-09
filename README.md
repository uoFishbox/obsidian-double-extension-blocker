# Obsidian Block Double Extension Plugin

This plugin blocks the creation of Markdown files with filenames containing undesired extensions, such as `.pdf.md`.

## Motivation

In Obsidian, when an attachment file such as a `.pdf` cannot be found in the Vault, it becomes an "unresolved link." When this link is opened, an undesired markdown file with an extension like `.pdf.md` is created.

This plugin monitors file creation and blocks the creation of files with double extensions in the format `.{extension}.md`.

## Features

- **Automatic Block**: Blocks the creation of files with the `.{extension}.md` format.
- **Customizable Extension List**: You can define the extensions you want to target.
- **Works on Both Desktop and Mobile**: The plugin is compatible with both mobile and desktop versions of Obsidian.

**Note**: If you need to create a note with a filename in the `.{extension}.md` format temporarily, you can create the note under a different name first and rename it manually afterward.