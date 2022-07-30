function panelVisualizer(options={}) {
    const init = () => {
        let visualizePanel = RegexVisualizerPanel({
            editorParser: options.editorParser,
            loader_view_id: options.loader_view_id || "graph-loader",
            progress_bar_class: options.progress_bar_class || "progress"
        });
        return {
            visualizePanel: visualizePanel,
        };
    };
    return {
        init: init
    };
}

