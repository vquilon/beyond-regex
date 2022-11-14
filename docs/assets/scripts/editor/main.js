var EditorParser = (options) => {
    const NONEDITOR = options.noneditor || false
    const DEBUG = options.debug || false;

    let timeoutPanelsId = null;
    let timeoutInputId = null;
    let regexParsed = false;

    const trim = (s) => {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    const getParams = () => {
        var params = location.hash;
        if (!params || params.length < 2) {
            params = {
                reLang: "python",
                embed: false,
                re: "",
                highlight: true,
                flags: ''
            };
        } else {
            params = params.slice(2);
            params = params.split("&").reduce(function (p, indvParam) {
                let val = indvParam.substring(indvParam.indexOf("=")+1);
                let key = indvParam.substring(0, indvParam.indexOf("="));
                p[key] = val;
                return p;
            }, {});
            params.raLang = params.reLang;
            params.embed = params.embed === 'true';
            params.flags = params.flags || '';
            params.re = params.re ? trim(decodeURIComponent(params.re)) : '';
        }
        return params;
    }

    var correctParams = {
        re: "",
        reLang: "",
        flags: ""
    }
    if (NONEDITOR) {
        // ES UN SHARED
        let params = getParams();
        correctParams = {
            re: params.re,
            reLang: params.reLang,
            flags: params.flags
        }
    }
    else {
        var $containerEditor = document.querySelector(options.containerSelector);
        var $input = $containerEditor.querySelector(`#editor-input > .${options.inputClass}`);
        var $editorRegex = $input.querySelector('.editor');

        var syntaxHighlighter = EditorSyntaxis({
            $editorRegex: $editorRegex,
            $syntaxRegex: $input.querySelector('.syntax'),
        });
        EditorAdvance({
            $containerEditor: $containerEditor,
            $inputRegex: $editorRegex,
            $syntaxRegex: $input.querySelector('.syntax'),
            debugInputClass: DEBUG ? '.input-debug': undefined
        });
        var linterCalls = EditorLinter({
            $editorLinter: $input.querySelector('.linters')
        });


        var $editorTerminal = $containerEditor.querySelector('#editor-terminal');
        var $terminalStats = $containerEditor.querySelector('#editor-stats');
        var $realTimeCheck = $containerEditor.querySelector('#real-time-check');
        var $highlight_editor = $containerEditor.querySelector('#highlighted-editor')
        var $terminalError = $containerEditor.querySelector('#terminal-error');
        var $errorDef = $terminalError.querySelector("#errorDef");
        var $flags = $containerEditor.querySelectorAll('input[name="flag"]');
        var $shareBtn = $containerEditor.querySelector('#shareIt');

        // En un futuro tiene que desaparecer, cuando se puedan editar los paneles, esta interaccion de desactivarlos
        // Tiene que venir por configuracion maestra.
        // Es decir la regex el editor, en este caso uno o dos, desactiva aquellos paneles a los que este unido,
        // Por lo que el Editor debera tener unos diccionarios en los que le diga los IDs que tiene asociado este editor Regex
        var $visualBtn = document.querySelector('#visualizeClick');
        
        var raphaelJSONId = options.raphaelJSONId || "raphael-json";
        var regexSONId = options.regexSONId || "regex-json";
    }

    // De igual forma esto debera desaparecer
    var $loader_view = document.querySelector(`#${options.loader_view_id}`);

    const updateStats = function (regExpresion, regexSON) {
        let reLen = `${regExpresion.length}`;
        let reGroups = `${regexSON.groupCount}`;
        setInnerText($terminalStats.querySelector("#re-len .stat-value"), reLen);
        setInnerText($terminalStats.querySelector("#re-groups .stat-value"), reGroups);
    }
    const hideError = function () {
        setInnerText($errorDef, "");
        $terminalError.classList.add("correct-syntax");
        linterCalls.cleanLinter();
        // $editorError.style.display = 'none';
    }
    const showErrors = function (regular_exp, regexson) {
        linterCalls.onRegexErrors(regular_exp, regexson);

        let errors = regexson.errors;
        $terminalError.classList.remove("correct-syntax");
        $errorDef.innerHTML = "";
        errors.forEach((error) => {
            $terminalError.style.display = 'block';
            let msg_re = [];
            let msg_def = [];

            if (typeof error.lastIndex === 'number') {
                msg_re.push(` ${regular_exp}`);
            }
            msg_def.push(`Error [${error.lastIndex}]: ${error.message}`);
            msg_def.push("");
            appendInnerText($errorDef, msg_def.join("\n"));
        });

        const fireError = () => {
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Error: See the editor console error!',
                position: 'top-right',
                iconColor: 'white',
                customClass: {
                    popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            })
        }
        fireError();
    }
    

    const getInnerText = function (ele) {
        if (!ele)
            return '';
        var node = ele.firstChild
            , results = [];
        if (!node)
            return '';
        do {
            if (node.nodeType === document.TEXT_NODE)
                results.push(node.nodeValue);
            else
                results.push(getInnerText(node));
        } while (node = node.nextSibling); return results.join('');
    }
    const setInnerText = function (ele, s) {
        ele.innerHTML = '';
        var t = document.createTextNode('');
        t.nodeValue = s;
        ele.appendChild(t);
        return s;
    }
    const appendInnerText = function (ele, s) {
        var t = document.createTextNode('');
        t.nodeValue = s;
        ele.appendChild(t);
        return s;
    }

    const escapeHTML = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    // const clearSelect = function () {
    //     if (window.getSelection) {
    //         if (window.getSelection().empty) {
    //             // Chrome
    //             window.getSelection().empty();
    //         } else if (window.getSelection().removeAllRanges) {
    //             // Firefox
    //             window.getSelection().removeAllRanges();
    //         }
    //     } else if (document.selection) {
    //         // IE
    //         document.selection.empty();
    //     }
    // }

    const _updateJSONViewer = function ($elem, jsonData) {
        if (DEBUG && window.hasOwnProperty("JsonView")) {
            window.setTimeout(() =>{
                $elem.innerHTML = "";
                JsonView.renderJSON(jsonData, $elem);
            }, 50);
        }
    }
    const _updateRaphaelItemsJSON = (_raphaelItems) => {
        const $elemRaphael = document.querySelector(`#${raphaelJSONId}`);
        _updateJSONViewer($elemRaphael, _raphaelItems)
    }

    const _updateRegexson = (_regexTree) => {
        function escapteHTML(inHTMLtext) {
            return inHTMLtext.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        // Se obtiene sin una funcion traverse
        _regexTree = {
            raw: escapteHTML(_regexTree.raw),
            groupCount: _regexTree.groupCount,
            tree: _regexTree.tree
        }
        const $regexSON = document.querySelector(`#${regexSONId}`);
        _updateJSONViewer($regexSON, _regexTree);
    };

    const parseRegex = (regExpresion) => {
        // Aqui se realiza el parseo
        var skipError = false;
        regexParsed = false;

        // updateLocationURL();
        hideError();
        var regexson = null;
        try {
            var init_parse = RegexParser();
            var language_selected = getReLanguage();
            regexson = init_parse(regExpresion, DEBUG, language_selected);

            let errors = regexson.errors;
            if (errors.length !== 0 && !skipError) {
                showErrors(regExpresion, regexson);
            }

            updateStats(regExpresion, regexson);

            // Actualizo los valores correctos parseados
            correctParams = {
                re: regExpresion,
                reLang: language_selected,
                flags: getFlags()
            }
        }
        catch (error) {
            // Send with firebase the parser errors
            console.error(error);
        }
        if (regexson) {
            _updateRegexson(regexson);
            $containerEditor.regexson = regexson;
        }

        syntaxHighlighter.onInput(regexson, getRegex(), { target: $editorRegex });
        regexParsed = true;
    };

    const showErrorShared = (regExpresion, err) => {
        let msg_error = "";
        if (typeof err.lastIndex === 'number') {
            let previousPart = escapeHTML(regExpresion.slice(0, err.lastIndex));
            let wrongPart = escapeHTML(regExpresion[err.lastIndex]);
            let postPart = escapeHTML(regExpresion.slice(err.lastIndex + 1));
            
            let src = `${location.origin}/beyond-regex/`;
            editLink = `${src}#!flags=${getCorrectedFlags()}&re=${encodeURIComponent(getCorrectedRegex())}&reLang=${getCorrectedReLanguage()}"`
            msg_error = `
                <p style="text-align: left;">Regex Flags: <strong>${getCorrectedFlags()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${getCorrectedReLanguage()}</strong></p>    
                <p style="text-align:left; margin-top: 1em">${err.message}</p>
                <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; margin-top: 1em;">${previousPart}<strong style="
                    color: red;
                    text-decoration: underline 1px wavy;">${wrongPart}</strong>${postPart}</div>
            `;
        }
        Swal.fire({
            title: "Shared regex is wrong",
            icon: "error",
            html: `
            <style>
            a.cool-anchor {
                color: white;
                height: 1em;
                display: block;
                margin-top: 1em;
                padding: 0.5em;
                border-radius: 0.5em;
                text-decoration: none;
                line-height: 1;
                background: linear-gradient(45deg, #03a9f4, #ff0058);
            }
            </style>
            ${msg_error}<a target="_black" class="cool-anchor" href="${editLink}">Correct with the editor!</a>
            `,
            showCancelButton: true,
            showConfirmButton: false,
            showCloseButton: true,
            cancelButtonText: 'Close'
        });
    }

    const parseSharedRegex = (regExpresion, language_selected = "python") => {
        // Aqui se realiza el parseo
        var regEXSON = null;
        try {
            var init_parse = RegexParser();
            regEXSON = init_parse(regExpresion, DEBUG, language_selected);
        } catch (e) {
            if (e instanceof init_parse.RegexSyntaxError) {
                showErrorShared(regExpresion, e);
            } else {
                throw e;
            }
        }

        return regEXSON
    };

    // Getters input
    const getCorrectedRegex = () => {
        return correctParams.re;
    };
    const getRegex = () => {
        return $editorRegex.innerText.replace(/\n$/, "");
    }
    const setRegexValue = function (v) {
        $editorRegex.innerText = v;
    };

    const getFlags = function () {
        var fg = '';
        for (var i = 0, l = $flags.length; i < l; i++) {
            if ( $flags[i].checked ) fg += $flags[i].value;
        }
        return fg;
    }
    const getCorrectedFlags = () => {
        return correctParams.flags;
    }
    const setFlags = function (fg) {
        for (var i = 0; i < $flags.length; i++) {
            if (~fg.indexOf($flags[i].value))
                $flags[i].checked = true;
            else
                $flags[i].checked = false;
        }
    }

    const getReLanguage = () => {
        return document.querySelector("[name='languageRegex']:checked").value;
    };
    const getCorrectedReLanguage = () => {
        return correctParams.reLang;
    }
    const setRegexLanguage = function (v) {
        document.querySelector(`[value="${v}"]`).checked = true;
    };

    const generateURL = function (params) {
        var re = getCorrectedRegex().replace(/\n$/, "");
        var flags = getFlags();
        return "#!" + (params.debug ? "debug=true&" : "") + (params.cmd ? "cmd=" + params.cmd + "&" : "") + (params.embed ? "embed=true&" : "") + "flags=" + flags + "&re=" + encodeURIComponent(params.re = re);
    }
    const updateLocationURL = function () {
        location.hash = generateURL(params);
    }

    const processInput = () => {
        parseRegex(getRegex());
        window.hasChanges = true;
        if ($visualBtn !== null) {
            $visualBtn.disabled = false;
        }
        // Ejecucion de los paneles
        if (timeoutPanelsId) clearTimeout(timeoutPanelsId);
        if ($realTimeCheck.checked) {
            timeoutPanelsId = setTimeout( () => {
                $visualBtn.click();
            }, 300);
        }
    }

    const changeRegexQuotes = (el, i, arr) => {
        let reLang = getReLanguage();
        reLangQuotes = {
            python: [`"`, `'`, `"""`, `'''`],
            javascript6: [`/`, `'`, `"`, "`"]
        }
        reLangPrev = {
            python: "r",
            javascript6: ""
        }
        let actualQuote = el.innerText.slice(reLangPrev[reLang].length);
        let _actualIndex = reLangQuotes[reLang].indexOf(actualQuote);
        let newQuote = reLangQuotes[reLang][(_actualIndex + 1) % reLangQuotes[reLang].length];

        let otherEl = arr[(i+1) % arr.length];
        otherEl.innerText = newQuote;

        if(i === 0) newQuote = `${reLangPrev[reLang]}${newQuote}`;
        el.innerText = newQuote;
    }

    const initEventsListener = () => {
        $editorRegex.addEventListener('keydown', (event) => {
            let keyDownLabel = event.key.toLowerCase();
            if(keyDownLabel === "enter" && event.ctrlKey) {
                if ($visualBtn !== null) {
                    $visualBtn.disabled = false;
                }
                $visualBtn.click();
            }
        });

        $editorRegex.addEventListener('input', (event) => {
            processInput();
        });

        // Prevent of paste non raw elements in contenteditable
        $editorRegex.addEventListener('paste', (event) => {
            event.preventDefault();
            let clipboardData = event.clipboardData || window.clipboardData;
            let pastedData = clipboardData.getData('Text');
            document.execCommand('insertText', false, pastedData);
            processInput();
        });
    
        $shareBtn.addEventListener('click', function () {
            if (!regexParsed) return false;

            var src = location.href;
            var indexHashParams = src.indexOf('#');
            src = indexHashParams > 0 ? src.slice(0, indexHashParams) : src;
            var re = getCorrectedRegex();
            // window.prompt("Copy the html code:", html);
            const urlLink = `${src}#!embed=true&flags=${getFlags()}&re=${encodeURIComponent(re)}`;
            const iframeLink = `
            <iframe frameborder="0" width="500px" height="300px"
            src="${urlLink}">
            </iframe>`;

            const iframeLinkLiteral = escapeHTML(iframeLink);
            Swal.fire({
                title: 'Share your visual regex',
                html: `
                <div id="beyond-regex-editor-copy" class="container-copy">
                    <div class="copy-container">
                        <div class="copy-content">
                            <span>${urlLink}</span>
                        </div>
                        <div class="wrap-copy-btn">
                            <button title="Copy link" data-copy="${urlLink}" class="copy-btn">
                                <i class="far fa-copy"></i>
                                <span class="confetti-container">
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                </span>
                            </button>
                            <button title="Copy iframe" data-copy="${iframeLinkLiteral}" class="copy-btn">
                                <i class="far fa-code"></i>
                                <span class="confetti-container">
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                    <span class="confetti"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                `,
                // <div id="iframe-link">${iframeLink}</div>
                // `,
                icon: 'info',
                iconHtml: `<span class="sweetalert-icon material-icons">share</span>`,
                showCancelButton: true,
                showConfirmButton: false,
                showCloseButton: true,
                cancelButtonText: 'Close',
                didOpen: () => {
                    Swal.showLoading();

                    // Listeners button copy
                    document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(($itemBtn) =>{
                        $itemBtn.addEventListener("click", (event) => {
                            const link = $itemBtn.dataset.copy
                            navigator.clipboard.writeText(link);
                            
                            let $iconCopy = $itemBtn.querySelector("i");
                            let prevIconClass = $iconCopy.className;
                            $iconCopy.className = "fas fa-check";
                            document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied");
                            $itemBtn.classList.add("copied");
                            setTimeout(function () {
                                let $copyContainer = document.querySelector("#beyond-regex-editor-copy .copy-container");
                                if ($iconCopy && $copyContainer) {
                                    $iconCopy.className = prevIconClass;
                                    $copyContainer.classList.remove("copied");
                                    $itemBtn.classList.remove("copied");
                                }
                            }, 1000);
                        });
                    })

                    Swal.hideLoading();
                }
            });
        });

        // parseBtn.addEventListener("click", (event) => {
        //     var regExpresion = inputRegex.value;
        //     _parseRegex(regExpresion);
        // });

        document.querySelectorAll("[name='languageRegex']").forEach(el=>{
            el.addEventListener("click", event=>{
                let $quotes = Array.from($containerEditor.querySelectorAll("#editor-input .regex-quotes"));
                changeRegexQuotes($quotes[0], 0, $quotes);

                // Cambiar la regex que hay a javascript ?
                processInput();
                // Aqui deberia notificar al resto de paneles que la regex se ha parseado
                // Puede que utilizando los message de javascript y cada panel tiene un listener de escucha
                if ($loader_view !== null) {
                    if (!$loader_view.classList.contains("loading")) {
                        if ($visualBtn !== null) {
                            if ($visualBtn !== null) {
                                $visualBtn.disabled = false;
                            }
                            $visualBtn.click();
                        }
                    }
                }
            });
        });

        $highlight_editor.addEventListener("change", event => {
            if (!$highlight_editor.checked) $input.classList.add("no-highlighted");
            else $input.classList.remove("no-highlighted");
        });

        // Gestionar el uso de un escape u otro para definir la regex, o las regex quotes
        $containerEditor.querySelectorAll("#editor-input .regex-quotes").forEach((el, i, arr) => {
            el.addEventListener("click", event => {
                changeRegexQuotes(el, i, arr)
            });
        });

    }
    if (!NONEDITOR) {
        initEventsListener();

        var params = getParams();
        if (params.embed || params.cmd == "export") {
            document.body.className += " embed";
        }

        // if (params.embed || params.cmd === "export") {
        //     var embedFooterLink = document.getElementById("embedFooterLink");
        //     embedFooterLink.href = `${document.location.origin}${document.location.pathname}` + location.hash.replace(/\bembed=true\b/ig, "").replace(/\bcmd=export\b/ig, '');
        // }

        if (params.flags) {
            setFlags(params.flags);
        } else{
            setFlags("g");
        }
        if (params.re) {
            setRegexValue(`${params.re}\n`);
        }
        if (params.reLang) {
            setRegexLanguage(params.reLang);
        } else {
            setRegexLanguage("python");
        }

        parseRegex(getRegex());
    }


    return {
        parseRegex: parseRegex,
        getRegex: getRegex,
        parseSharedRegex: parseSharedRegex,
        trim: trim,
        getParams: getParams,
        getCorrectedFlags: getCorrectedFlags,
        getCorrectedReLanguage: getCorrectedReLanguage,
        getCorrectedRegex: getCorrectedRegex,
        _updateRaphaelItemsJSON: _updateRaphaelItemsJSON,
        $containerEditor: $containerEditor,
        $input: $input
    }
}
