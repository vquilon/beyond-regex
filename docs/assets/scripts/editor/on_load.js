function Editor(options={}) {
    const init = () => {
        let editorParser = EditorParser({
            containerSelector: ".container-editor",
            debug: options.debug || true,
            regexSONId: options.regexSONId || "regex-json",
            raphaelJSONId: options.raphaelJSONId || "raphael-json",
            loader_view_id: options.loader_view_id || "graph-loader",
        });
        return {
            editorParser: editorParser,
        };
    };
    return {
        init: init
    };
}