window.onbeforeunload=function(e){if((window.hasChanges||!1)&(window.hasUnsavedData||!0))return(e||window.event).returnValue="You have made changes since you last saved, leaving the website will result in a permanent loss of the data."},window.onload=function(){window.enableSweetAlert2Theme=(e="dark")=>{let t=document.head.querySelector(".sweetalert-theme[rel='stylesheet']");t.rel="alternate stylesheet",document.head.querySelector(`#sweetalert-${e}`).rel="stylesheet"},window.runExampleSwalThemeSwitch=async()=>{let e=document.head.querySelector(".sweetalert-theme[rel='stylesheet']");var t=e.id.substring(e.id.indexOf("-")+1);await Swal.fire({title:"I'm dark",onBeforeOpen:()=>window.enableSweetAlert2Theme("dark")}),await Swal.fire({title:"I'm default",onBeforeOpen:()=>window.enableSweetAlert2Theme("default")}),window.enableSweetAlert2Theme(t)},offlineHandler();var e=EditorParser({debug:!1,regexSONId:"regex-json",raphaelJSONId:"raphael-json",loader_view_id:"graph-loader"});RegexVisualizerPanel({editorParser:e,loader_view_id:"graph-loader",progress_bar_class:"progress"}),document.querySelector("#close-side").addEventListener("click",e=>{document.querySelector("#container-main").classList.toggle("menu-open")}),document.querySelector("#container-main > #sidebar-overlay").addEventListener("click",e=>{document.querySelector("#container-main").classList.remove("menu-open")})};