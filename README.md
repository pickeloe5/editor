# Just Sayin'

[Download](https://editor.nickmatt.dev#download)
|
[Documentation](https://editor.nickmatt.dev/doc/EditorConsole.html)

## Basic Usage

```
editorJS file-name.txt
```

You'll find only the very-most-basic operations are included by default:

 - Insert letters, numbers, symbols, and white-space
 - Backspace one character at a time
 - Move the cursor left or right, one character at a time
 - Save the file being edited (`Control+S`)

## Advanced Usage

The application looks in
[`userData`](https://www.electronjs.org/docs/latest/api/app#appgetpathname)
for a Javascript file, `script.js`, and executes it;
A global,
[`editorJSConsole`](https://editor.nickmatt.dev/doc/EditorConsole.html),
is exposed to the file, which allows the same, basic operations to be automated intelligently.

 - Linux: (`$XDG_CONFIG_HOME` or `~/.config`)`/editorJS/script.js`
 - Windows: `%APPDATA%/editorJS/script.js`
 - Mac: `~/Library/Application Support/editorJS/script.js`
