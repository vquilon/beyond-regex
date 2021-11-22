var EditorParser = (options) => {
    const NONEDITOR = options.noneditor || false
    const DEBUG = options.debug || false;

    var $inputRegex = document.querySelector('#input');
    
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
        var $editorTerminal = document.querySelector('#editor-terminal');
        var $terminalStats = $editorTerminal.querySelector('#terminal-stats');
        var $realTimeCheck = document.querySelector('#real-time-check');
        var $terminalError = document.querySelector('#terminal-error');
        var $errorDef = $terminalError.querySelector("#errorDef");
        var $errorBox = $terminalError.querySelector('#errorBox');
        

        var $flags = document.getElementsByName('flag');
        var $iframeBtn = document.querySelector('#iframeIt');
        var visualBtn = document.querySelector('#visualizeClick');
        
        var raphaelJSONId = options.raphaelJSONId || "raphael-json";
        var regexSONId = options.regexSONId || "regex-json";
    }

    var $loader_view = document.querySelector(`#${options.loader_view_id}`);

    var updateStats = function (regExpresion, regexSON) {
        let reLen = `${regExpresion.length}`;
        let reGroups = `${regexSON.groupCount}`;
        setInnerText($terminalStats.querySelector("#re-len .stat-value"), reLen);
        setInnerText($terminalStats.querySelector("#re-groups .stat-value"), reGroups);
    }
    var hideError = function () {
        setInnerText($errorBox, "");
        setInnerText($errorDef, "Correct syntax");
        $terminalError.classList.add("correct-syntax");
        // $editorError.style.display = 'none';
    }
    var showError = function (re, err) {
        $terminalError.classList.remove("correct-syntax");
        
        const fireError = async () => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                iconColor: 'white',
                customClass: {
                    popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            })
            await Toast.fire({
                icon: 'error',
                title: 'Error: See the editor console error!'
            });
        }
        fireError();
        $terminalError.style.display = 'block';
        var msg_re = [];
        var msg_def = [];
        if (typeof err.lastIndex === 'number') {
            msg_re.push(` ${re}`);
            // msg_re.push(Kit().repeats('-', err.lastIndex) + "^");
        }
        msg_def.push("Error:" + err.message);
        msg_def.push("");
        $errorBox.style.setProperty("--position-error-ch", `${err.lastIndex + 1}ch`)

        setInnerText($errorBox, msg_re.join("\n"));
        setInnerText($errorDef, msg_def.join("\n"));
    }
    

    var getInnerText = function (ele) {
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
    var setInnerText = function (ele, s) {
        ele.innerHTML = '';
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
    // var clearSelect = function () {
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
        if (DEBUG) {
            $elem.innerHTML = "";
            window.setTimeout(() => JsonView.renderJSON(jsonData, $elem), 50);
        }
    }
    const _updateRaphaelItemsJSON = (_raphaelItems) => {
        const $elemRaphael = document.querySelector(`#${raphaelJSONId}`);
        _updateJSONViewer($elemRaphael, _raphaelItems)
    }

    const _updateREGEXSON = (_regexTree) => {
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

        // updateLocationURL();
        hideError();
        var regEXSON = null;
        try {
            var init_parse = RegexParser();
            var language_selected = getReLanguage();
            regEXSON = init_parse(regExpresion, null, language_selected);

            updateStats(regExpresion, regEXSON);

            // Actualizo los valores correctos parseados
            correctParams = {
                re: regExpresion,
                reLang: language_selected,
                flags: getFlags()
            }
        } catch (e) {
            if (e instanceof init_parse.RegexSyntaxError) {
                if (!skipError) {
                    showError(regExpresion, e);
                }
            } else {
                throw e;
            }
            // return false;
        }
        if (regEXSON) {
            _updateREGEXSON(regEXSON);
        }

        return regEXSON
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
        var skipError = false;
        // if ( !NONEDITOR ) hideError();
        var regEXSON = null;
        try {
            var init_parse = RegexParser();
            regEXSON = init_parse(regExpresion, null, language_selected);
        } catch (e) {
            if (e instanceof init_parse.RegexSyntaxError) {
                if (!skipError) {
                    if ( NONEDITOR ) showErrorShared(regExpresion, e);
                }
            } else {
                throw e;
            }
            // return false;
        }

        return regEXSON
    };


    function trim(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }
    // Getters input
    const getCorrectedRegex = () => {
        return correctParams.re;
    };
    const getRegex = () => {
        return $inputRegex.value;
    }
    var setRegexValue = function (v) {
        $inputRegex.value = v;
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
    var setRegexLanguage = function (v) {
        document.querySelector(`[value="${v}"]`).checked = true;
    };

    function getParams() {
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
            params = params.split("&").reduce(function (p, a) {
                a = a.split("=");
                p[a[0]] = a[1];
                return p;
            }, {});
            params.raLang = params.reLang;
            params.embed = params.embed === 'true';
            params.flags = params.flags || '';
            params.re = params.re ? trim(decodeURIComponent(params.re)) : '';
        }
        return params;
    }


    const generateURL = function (params) {
        var re = getCorrectedRegex();
        var flags = getFlags();
        return "#!" + (params.debug ? "debug=true&" : "") + (params.cmd ? "cmd=" + params.cmd + "&" : "") + (params.embed ? "embed=true&" : "") + "flags=" + flags + "&re=" + encodeURIComponent(params.re = re);
    }
    const updateLocationURL = function () {
        location.hash = generateURL(params);
    }

    function initEventsListener() {
        $inputRegex.addEventListener('input', function (event) {
            if ($realTimeCheck.checked) {
                parseRegex(getRegex());
            }

            window.hasChanges = true;
            visualBtn.disabled = false;
            // hideError();
        });

        $iframeBtn.addEventListener('click', function () {
            if (!parseRegex(getRegex())) return false;

            var src = location.href;
            var indexHashParams = src.indexOf('#');
            src = indexHashParams > 0 ? src.slice(0, indexHashParams) : src;
            var re = getCorrectedRegex();
            // window.prompt("Copy the html code:", html);

            const iframeLink = `
            <iframe frameborder="0" width="500px" height="300px"
            src="${src}#!embed=true&flags=${getFlags()}&re=${encodeURIComponent(re)}">
            </iframe>`;

            const iframeLinkLiteral = escapeHTML(iframeLink);
            Swal.fire({
                title: 'Share your visual regex',
                html: `
                <div id="beyond-regex-iframe-copy" class="container-copy">
                    <div class="iframe-copier">
                        <div class="iframe-content">
                            <span>${iframeLinkLiteral}</span>
                        </div>
                        <div class="wrap-copy-iframe"><button class="copy-iframe"><i class="far fa-copy"></i></button></div>
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
                    document.querySelector("#beyond-regex-iframe-copy button.copy-iframe").addEventListener("click", function () {
                        navigator.clipboard.writeText(iframeLink);

                        document.querySelector("#beyond-regex-iframe-copy .copy-iframe>i").className = "fas fa-check";
                        document.querySelector("#beyond-regex-iframe-copy .iframe-copier").classList.add("copied");
                        setTimeout(function () {
                            let icon_copy = document.querySelector("#beyond-regex-iframe-copy .copy-iframe>i");
                            let iframe_copier = document.querySelector("#beyond-regex-iframe-copy .iframe-copier");
                            if (icon_copy && iframe_copier) {
                                icon_copy = "far fa-copy";
                                iframe_copier.classList.remove("copied");
                            }
                        }, 1000);
                    });

                    Swal.hideLoading();
                }
            });
        });

        // Scroll on terminal
        $errorBox.addEventListener("scroll", (ev) => {
            $inputRegex.scrollLeft = ev.currentTarget.scrollLeft;
        });



        // parseBtn.addEventListener("click", (event) => {
        //     var regExpresion = inputRegex.value;
        //     _parseRegex(regExpresion);
        // });

        let langs = document.querySelectorAll("[name='languageRegex']");
        for (var i = 0, max = langs.length; i < max; i++) {
            langs[i].onclick = function () {
                if (!$loader_view.classList.contains("loading")) {
                    if (visualBtn.disabled) {
                        visualBtn.disabled = false;
                    }
                }
            }
        }
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
            setRegexValue(params.re);
        } else{
            setRegexValue("^BEYOND ReGex(?P<TOOLS>builder|[bv]isualize|(?=de)bugger) Born to be a RegEx editor$");
        }
        if (params.reLang) {
            setRegexLanguage(params.reLang);
        } else {
            setRegexLanguage("python");
        }
    }


    return {
        parseSharedRegex: parseSharedRegex,
        trim: trim,
        getParams: getParams,
        parseRegex: parseRegex,
        getCorrectedFlags: getCorrectedFlags,
        getCorrectedReLanguage: getCorrectedReLanguage,
        getCorrectedRegex: getCorrectedRegex,
        _updateRaphaelItemsJSON: _updateRaphaelItemsJSON
    }
}
