window.onbeforeunload=function(e){if((window.hasChanges||!1)&(window.hasUnsavedData||!0)){var a="You have made changes since you last saved, leaving the website will result in a permanent loss of the data.";return(e||window.event).returnValue=a}},window.onload=function(){changeDark2LightTheme(),init_menu_listeners(),offlineHandler();var e=EditorParser({debug:!0,regexSONId:"regex-json",raphaelJSONId:"raphael-json",loader_view_id:"graph-loader"});RegexVisualizerPanel({editorParser:e,loader_view_id:"graph-loader",progress_bar_class:"progress"})};