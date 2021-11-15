var EditorParser = (options) => {
    const NONEDITOR = options.noneditor || false
    const DEBUG = options.debug || false;

    var $inputRegex = document.querySelector('#input');
    var $editorError = document.querySelector('#editor-error');
    var $flags = document.getElementsByName('flag');

    var $iframeBtn = document.querySelector('#iframeIt');
    
    let raphaelJSONId = options.raphaelJSONId || "raphael-json";
    let regexSONId = options.regexSONId || "regex-json";

    var visualBtn = document.querySelector('#visualizeClick');
    var $loader_view = document.querySelector(`#${options.loader_view_id}`);

    var hideError = function () {
        $editorError.style.display = 'none';
    }
    var showError = function (re, err) {
        $editorError.style.display = 'block';
        var msg_re = [];
        var msg_def = [];
        if (typeof err.lastIndex === 'number') {
            msg_re.push(re);
            // msg_re.push(Kit().repeats('-', err.lastIndex) + "^");
        }
        msg_def.push("Error:" + err.message);
        msg_def.push("");
        $editorError.querySelector(".errorBox").style.setProperty("--position-error-ch", `${err.lastIndex}ch`)
        
        setInnerText($editorError.querySelector(".errorBox"), msg_re.join("\n"));
        setInnerText($editorError.querySelector(".errorDef"), msg_def.join("\n"));
    }
    var getFlags = function () {
        var fg = '';
        for (var i = 0, l = $flags.length; i < l; i++) {
            if ($flags[i].checked)
                fg += $flags[i].value;
        }
        return fg;
    }
    var setFlags = function (fg) {
        for (var i = 0, l = fg.length; i < l; i++) {
            if (~fg.indexOf($flags[i].value))
                $flags[i].checked = true;
            else
                $flags[i].checked = false;
        }
        // setInnerText(flagBox, fg);
    }

    const getReLanguage = () => {
        return document.querySelector("[name='languageRegex']:checked").value;
    };

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

    const parseSharedRegex = (regExpresion, language_selected="python") => {
        // Aqui se realiza el parseo
        var skipError = false;
        // if ( !NONEDITOR ) hideError();
        var regEXSON = null;
        try {
            var init_parse = RegexParser();
            regEXSON = init_parse(regExpresion, null, language_selected);
        } catch (e) {
            if (e instanceof init_parse.RegexSyntaxError) {
                // if (!skipError) {
                //     if ( !NONEDITOR ) showError(regExpresion, e);
                // }
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
    var getInputValue = function () {
        return trim($inputRegex.value);
    };
    var setInputValue = function (v) {
        return $inputRegex.value = trim(v);
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
        var re = getInputValue();
        var flags = getFlags();
        return "#!" + (params.debug ? "debug=true&" : "") + (params.cmd ? "cmd=" + params.cmd + "&" : "") + (params.embed ? "embed=true&" : "") + "flags=" + flags + "&re=" + encodeURIComponent(params.re = re);
    }
    const updateLocationURL = function () {
        location.hash = generateURL(params);
    }

    function initEventsListener() {
        $inputRegex.addEventListener('input', function (event) {
            // parseEvent();
            window.hasChanges = true;
            visualBtn.disabled = false;
        });

        $iframeBtn.addEventListener('click', function () {
            if (!parseRegex($inputRegex.value)) return false;

            var src = location.href;
            var i = src.indexOf('#');
            src = i > 0 ? src.slice(0, i) : src;
            var re = getInputValue();
            // window.prompt("Copy the html code:", html);

            const iframeLink = `
            <iframe frameborder="0" width="500px" height="300px"
            src="${src}#!embed=true&flags=${getFlags()}&re=${encodeURIComponent(re)}">
            </iframe>`
            ;

            const iframeLinkLiteral = escapeHTML(iframeLink);
            Swal.fire({
                title: 'Share your visual regex',
                html: `
                <div id="visualizer-iframe-copy" class="container-copy">
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
                // showCloseButton: true,
                cancelButtonText: 'Close',
            });
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
    if ( !NONEDITOR ) {
        initEventsListener();

        var params = getParams();
        if (params.embed || params.cmd == "export") {
            document.body.className += " embed";
        }

        if (params.embed || params.cmd === "export") {
            var embedFooterLink = document.getElementById("embedFooterLink");
            embedFooterLink.href = `${document.location.origin}${document.location.pathname}` + location.hash.replace(/\bembed=true\b/ig, "").replace(/\bcmd=export\b/ig, '');
        }

        if (params.flags) {
            setFlags(params.flags);
        }
        if (params.re) {
            setInputValue(params.re);
        }
    }
    

    return {
        parseSharedRegex: parseSharedRegex,
        getParams: getParams,
        trim: trim,
        parseRegex: parseRegex,
        getFlags: getFlags,
        setFlags: setFlags,
        getReLanguage: getReLanguage,
        getInputValue: getInputValue,
        _updateRaphaelItemsJSON: _updateRaphaelItemsJSON
    }
}
