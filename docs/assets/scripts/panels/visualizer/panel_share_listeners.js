window.onload = function () {
    // OFFLINE HANDLER
    // offlineHandler();

    let editorParser = EditorParser({
        noneditor: true,
        loader_view_id: "graph-loader",
    });

    // VISUALIZER PANEL
    RegexVisualizerPanel({
        editorParser: editorParser,

        loader_view_id: "graph-loader",
        progress_bar_class: "progress"
    });
}