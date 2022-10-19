function EditorSyntaxis(options = {}) {
    let $editor = options.$editorRegex;
    let $syntax = options.$syntaxRegex;
    let synxtaxHighlighter = RegexHighlighter($editor, $syntax);
    let debug = false;

    // Main Function
    // Hihglight the editor
    // synxtaxHighlighter.onInput($containerEditor.regexson, { target: $editor });

    return {
        onInput: synxtaxHighlighter.onInput
    }
}