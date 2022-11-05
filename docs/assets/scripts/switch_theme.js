const changeDark2LightTheme = () => {
    const THEME_NAME = "beyond-theme"
    const THEMES = {
        light: "light",
        dark: "dark"
    }
    const SWEETALERT_THEMES = {
        light: "default",
        dark: "dark"
    }

    window.enableSweetAlert2Theme = (theme = SWEETALERT_THEMES[THEMES.light]) => {
        // deactivate actual
        let $activateLinkTheme = document.head.querySelector(".sweetalert-theme[rel='stylesheet']");
        $activateLinkTheme.rel = "alternate stylesheet";
        // Now activate the requested
        document.head.querySelector(`#sweetalert-${theme}`).rel = "stylesheet";
    }
    window.runExampleSwalThemeSwitch = async () => {
        let $actualLink = document.head.querySelector(".sweetalert-theme[rel='stylesheet']");
        let actualTheme = $actualLink.id.substring($actualLink.id.indexOf("-") + 1);
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

    const themeSwitcherHTML = 
    `<div class="switchElement">
        <input id="switch-theme" type="checkbox" name="status" />
        <label for="switch-theme"></label>
    </div>`;
    let $themeSwitch = document.createElement("div");
    $themeSwitch.id = "theme-switch";
    $themeSwitch.innerHTML += themeSwitcherHTML;
    document.body.appendChild($themeSwitch);

    var toggleSwitch = document.querySelector(
        '#theme-switch input[type="checkbox"]'
    );

    let currentTheme = THEMES.light;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = THEMES.dark;
    }
    
    if (localStorage.hasOwnProperty(THEME_NAME)) {
        currentTheme = localStorage.getItem(THEME_NAME);
    }

    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        toggleSwitch.checked = true;
    }

    const switchTheme = (e) => {
        if (toggleSwitch.checked) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem(THEME_NAME, "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem(THEME_NAME, "light");
        }
    };

    toggleSwitch.addEventListener("change", switchTheme, false);
}