const changeDark2LightTheme = () => {
    window.enableSweetAlert2Theme = (theme="dark") => {
        // deactivate actual
        let $activateLinkTheme = document.head.querySelector(".sweetalert-theme[rel='stylesheet']");
        $activateLinkTheme.rel = "alternate stylesheet";
        // Now activate the requested
        document.head.querySelector(`#sweetalert-${theme}`).rel = "stylesheet";
    }
    window.runExampleSwalThemeSwitch = async () => {
        let $actualLink = document.head.querySelector(".sweetalert-theme[rel='stylesheet']");
        let actualTheme = $actualLink.id.substring($actualLink.id.indexOf("-")+1);
        await Swal.fire({
            title: `I'm dark`,
            onBeforeOpen: () => window.enableSweetAlert2Theme('dark')
        })

        await Swal.fire({
            title: `I'm default`,
            onBeforeOpen: () => window.enableSweetAlert2Theme('default')
        })
        window.enableSweetAlert2Theme(actualTheme);
    }
}