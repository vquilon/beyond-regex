function RegexHighlighter($editor, $syntax) {
    let lastRegex = undefined;
    // Reglas sintaxis
    // const rules = [
    //     {
    //         name: "Greater",
    //         pattern: />/g,
    //         replacement: "&gt;",
    //         replacement_editor: "&gt;"
    //     },
    //     {
    //         name: "Lower",
    //         pattern: /</g,
    //         replacement: "&lt;",
    //         replacement_editor: "&lt;"
    //     },
    //     {
    //         name: "Spaces",
    //         pattern: / /g,
    //         replacement: "<span class=\"space special-chars\"> </span>",
    //         replacement_editor: "<span class=\"space special-chars\"> </span>"
    //     },
    //     {
    //         name: "parenthesis",
    //         pattern: /((?<!\\)[()])/gm,
    //         replacement: "<span class=\"parenthesis\">$1</span>",
    //         replacement_editor: "<span class=\"parenthesis\">$1</span>",
    //     },
    //     {
    //         name: "Line breaks",
    //         pattern: /\n/g,
    //         replacement: "<span class=\"endline special-chars\">\n</span>",
    //         pattern_editor: /\n/g,
    //         replacement_editor: "<span class=\"endline special-chars\">\n</span>"
    //     },
    //     {
    //         name: "Tabs",
    //         pattern: /\t/g,
    //         replacement: "<span class=\"tab special-chars\">\t</span>",
    //         replacement_editor: "<span class=\"tab special-chars\">\t</span>"
    //     },

    //     // Block quote al principio para no sustituir los > de las etiquetas
    //     // {
    //     //   name: "Block quote",
    //     //   pattern: /(?<![\w'"^])(> ?)([^\n<]*)(?=\n|(?=<\/span>))/gm,
    //     //   replacement: "<span class='quote'>$2</span>",
    //     //   replacement_editor: "<span class='quote'>$1$2</span>",
    //     //   while: true
    //     // },
    //     // Replaces que no agregan espacio
    //     // {
    //     //   name: "Links",
    //     //   pattern: /(?<!\!)\[([^\]]+)\]\(( *)((?:[^\)](?! \")|\(\)+)+)( *)\)/g,
    //     //   replacement: `<a target="_blank" href="$3">$1</a>`,
    //     //   replaceHandler: function(m, raw, prev_link, link, post_link) {
    //     //     return `<a target="_blank" href="${encodeURI(link)}">${raw}</a>`
    //     //   },
    //     //   replaceEditorHandler: function(m, raw, prev_link, link, post_link) {
    //     //     return `[${raw}](${prev_link}<a target="_blank" href="${encodeURI(link)}">${link}</a>)`
    //     //   }
    //     // },

    //     // {
    //     //   name: "Code block",
    //     //   // replaceStart: function(m, code_lang) {
    //     //   //   let res = `<pre class="code-block"><code>`,
    //     //   //       if (code_lang) {
    //     //   //         code_lang = code_lang.replaceAll(/ /, '');
    //     //   //         res = `<pre class="code-block code-${code_lang}"><code>`;
    //     //   //       }
    //     //   //   return res;
    //     //   // },
    //     //   // replaceEnd: function(m, code_lang) {
    //     //   //   return `</code></pre>`
    //     //   // },
    //     //   pattern: /(?:\n{2})?(`{3})( *)([\w ]*)(\n)((?:(?=\n`{3} *\n|$)|(?:[^`]|`))+?)(\n`{3} *\n|$)(?:\n)?/ig,
    //     //   // pattern_start: /^`{3}([\w ]+)?\n/gim,
    //     //   // pattern_end: /^`{3} *\n/gm,
    //     //   replacement: "<pre class='code-block code-$2'><code>$3</code></pre>",
    //     //   replaceHandler: function(m, pre_quotes, pre_code_lang, code_lang, pre_code_block, code_block, post_quotes) {
    //     //     let pre_tags = `<pre class="code-block"><code>`;
    //     //     if (code_lang) {
    //     //       code_lang = code_lang.replaceAll(/ /g, '');
    //     //       pre_tags = `<pre class="code-block code-${code_lang}"><code>`;
    //     //     }
    //     //     return `${pre_tags}${code_block}</code></pre>`;
    //     //   },
    //     //   replaceEditorHandler: function(m, pre_quotes, pre_code_lang, code_lang, pre_code_block, code_block, post_quotes) {
    //     //     let pre_tags = `<pre class="code-block"><code>`;
    //     //     if (code_lang) {
    //     //       code_lang = code_lang.replaceAll(/ /g, '');
    //     //       pre_tags = `<pre class="code-block code-${code_lang}"><code>`;
    //     //     }
    //     //     return `${pre_tags}${pre_quotes}${pre_code_lang}${code_lang}${pre_code_block}${code_block}${post_quotes}</code></pre>`;
    //     //   }
    //     // },
    // ];

    const escapeHTMLChars = (raw) => {
        return raw
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function expandHtmlEntities(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/ |&nbsp;/g, `<span class="space special-chars"> </span>`)
            .replace(/\n/g, `<span class="endline special-chars">\n</span>`)
            .replace(/\t/g, `<span class="tab special-chars">\t</span>`);
    }
    function cleanSpecialChars(str) {
        return str
            .replace(/&nbsp;/g, `<span class="space special-chars"> </span>`)
            .replace(/\n/g, `<span class="endline special-chars">\n</span>`)
            .replace(/\t/g, `<span class="tab special-chars">\t</span>`);
    }

    // Conversion de texto plano a estructuras HTML + CSS
    // const replaceWithStartEnd = (_rule, _text) => {
    //     let m;
    //     let matches = [];
    //     while ((m = _rule.pattern_start.exec(_text)) !== null) {
    //         // This is necessary to avoid infinite loops with zero-width matches
    //         if (m.index === _rule.pattern_start.lastIndex) {
    //             _rule.pattern_start.lastIndex++;
    //         }
    //         matches.push(m);
    //     }
    //     while ((m = _rule.pattern_end.exec(_text)) !== null) {
    //         // This is necessary to avoid infinite loops with zero-width matches
    //         if (m.index === _rule.pattern_end.lastIndex) {
    //             _rule.pattern_end.lastIndex++;
    //         }
    //         matches.push(m);
    //     }

    //     // Se ordena por el indice en el texto
    //     matches.sort(function (m1, m2) {
    //         return m1.index - m2.index;
    //     });
    //     // The result can be accessed through the `m`-variable.
    //     // m.forEach((match, groupIndex) => {
    //     //   console.log(`Found match, group ${groupIndex}: ${match}`);
    //     // });
    //     let start_flag = true;
    //     let offset_chars = 0;
    //     for (let i = 0; i < matches.length; i++) {
    //         m = matches[i];
    //         if (start_flag) {
    //             start_flag = false;
    //             // Se reemplaza el match por el callback correspondiente
    //             // agregando un offset de lo que se ha cambiado, para tenerlo en cuenta despues
    //             // ya que el indice del match se obtuvo anteriormente
    //             const start_match = m.index + offset_chars;
    //             const new_replace = _rule.replaceStart(...m);
    //             _text = `${_text.slice(0, start_match)}${new_replace}${_text.slice(start_match + m[0].length)}`;
    //             // Calculo el offset nuevo sumando el texto nuevo menos lo que se ha reemplazado
    //             offset_chars = offset_chars + new_replace.length - m[0].length;
    //         }
    //         else {
    //             // Primero compruebo si el end es valido
    //             if (m[0].match(rule.pattern_end)) {
    //                 start_flag = true;
    //                 const start_match = m.index + offset_chars;
    //                 const new_replace = _rule.replaceEnd(...m);
    //                 _text = `${_text.slice(0, start_match)}${new_replace}${_text.slice(start_match + m[0].length)}`;
    //                 // Calculo el offset nuevo sumando el texto nuevo menos lo que se ha reemplazado
    //                 offset_chars = offset_chars + new_replace.length - m[0].length;
    //             }
    //         }
    //     }
    //     if (start_flag) {
    //         // Se agrega esta parte para que cierre la etiqueta
    //         // hasta el final si es necesario
    //         if (_rule && 'replaceEnd' in _rule) {
    //             // No hace falta pasar argumentos porque unicamente cierra la etiqueta que quedo abierta
    //             _text += _rule.replaceEnd(...m);
    //         }
    //     }

    //     return _text;
    // };
    // const convertRawToHTMLResult = (rawText, textarea = false) => {
    //     // Metodo antiguo
    //     let rule;
    //     for (let i = 0; i < rules.length; i++) {
    //         rule = rules[i];
    //         if ('while' in rule & rule.while) {
    //             while (rawText.match(rule.pattern) !== null) {
    //                 rawText = rawText.replace(rule.pattern, rule.replacement);
    //             }
    //         }
    //         else if ('pattern_start' in rule && 'replaceStart' in rule) {
    //             terawTextxt = replaceWithStartEnd(rule, rawText);
    //         }
    //         else if ('replaceHandler' in rule) {
    //             rawText = rawText.replace(rule.pattern, rule.replaceHandler);
    //         }
    //         else {
    //             rawText = rawText.replace(rule.pattern, rule.replacement);
    //         }
    //     }

    //     // end line al final para corregir que no se genere en el contenteditable, y para que el textarea tenga la linea minima 1.
    //     if (textarea) rawText += `<span class="endline no-color special-chars"</span>`
    //     return rawText;
    // };

    // Parser Regex to JSON Object

    const _parseDefault = (reToken, htmlRaw, {extraClass = "", extraAttributes = "", closeTag = true}) => {
        let classes = [reToken.type];
        if (extraClass !== "") classes.push(extraClass);
        let regexTag = `<span class="${classes.join(' ')}" tokenId="${reToken.id}" tokenIndices="${reToken.indices.join(',')}" ${extraAttributes}>${htmlRaw}`;
        if (closeTag) regexTag += `</span>`;

        return regexTag;
    }
    const _auxParseQuantifier = (reToken, i, tokenStack) => {
        quant = "";
        if (!reToken.commentRepeatId) quant = `<i greedy="${!reToken.repeat.nonGreedy}">${reToken.repeat.raw}</i>`;
        else {
            let commentToken = tokenStack.filter(el => el.id === reToken.commentRepeatId)[0];
            commentToken.repeatComment = reToken.repeat.raw;
            commentToken.repeatTokenId = reToken.id;
        }
        return quant;
    }
    const _parseAssert = (reToken, i, tokenStack) => {
        let assertMap = {
            "AssertBegin": [reToken.raw, ""],
            "AssertLookahead": [
                `<span class="parenthesis">(</span>?=`, `<span class="parenthesis">)</span>`
            ],
            "AssertNegativeLookahead": [
                `<span class="parenthesis">(</span>?!`, `<span class="parenthesis">)</span>`
            ],
            "AssertNonWordBoundary": ["\\B", ""],
            "AssertWordBoundary": ["\\b", ""],
            "AssertEnd": [reToken.raw, ""],
        };
        let subTokens = "";
        if ("sub" in reToken) {
            reToken.sub.forEach((subToken, isub) => {
                subTokens += _parseRegexSON(subToken, isub, reToken.sub);
            });
        }

        let assertHTML = `${assertMap[reToken.assertionType][0]}${subTokens}`;

        if (reToken.raw.slice(reToken.endParenIndex - reToken.indices[0]).startsWith(")")) {
            assertHTML += assertMap[reToken.assertionType][1]
        }

        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            assertHTML += quant;
        }

        return _parseDefault(reToken, assertHTML, {extraClass: reToken.assertionType});
    }
    const _parseGroup = (reToken, i, tokenStack) => {
        let subTokens = "";
        reToken.sub.forEach((subToken, isub) => {
            subTokens += _parseRegexSON(subToken, isub, reToken.sub);
        });
        let groupAttributes = `non-capture="${reToken.nonCapture || 'false'}" group-number="${reToken.num || ''}" group-name="${reToken.name || ''}"`;

        let groupMod = reToken.nonCapture ? "?:" : "";
        let groupNameMap = {
            "(?P": `?P<${reToken.name}>`,
            "(?<": `?<${reToken.name}>`,
            "(?'": `?'${reToken.name}'`,
        }
        if (reToken.raw.slice(0, 3) in groupNameMap) {
            groupMod = reToken.name ? groupNameMap[reToken.raw.slice(0, 3)] : '';
            groupMod = expandHtmlEntities(groupMod);
        }
        let endParen = `<span class="parenthesis">)</span>`;

        if (! reToken.raw.slice(reToken.endParenIndex - reToken.indices[0]).startsWith(")")) {
            endParen = "";
        }

        let groupHTML = `<span class="parenthesis">(</span>${groupMod}${subTokens}${endParen}`;
        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            groupHTML += quant;
        }

        return _parseDefault(reToken, groupHTML, {extraAttributes: groupAttributes});
    }
    const _parseComment = (reToken, i, tokenStack) => {
        let groupMod = "?#";
        let endParen = `<span class="parenthesis">)</span>`;
        if (reToken.errors) {
            if (reToken.errors.some(e => e.type === 'UnterminatedGroup')) {
                endParen = "";
            }
        }
        let repeatLen = 0;
        if (reToken.repeatComment)repeatLen = reToken.repeatComment.length;
        if (!reToken.raw.substr(0, reToken.raw.length - repeatLen).endsWith(")")){
            endParen = "";
        }
        let groupHTML = `<span class="parenthesis">(</span>${groupMod}${reToken.comment}${endParen}`;
        if (reToken.repeatComment) {
            let quant = `<i data-repeattokenid="${reToken.repeatTokenId}">${reToken.repeatComment}</i>`;
            groupHTML += quant;
        }

        return _parseDefault(reToken, groupHTML, {});
    }
    const _parseChoice = (reToken, i, tokenStack) => {
        let branches = "";
        reToken.branches.forEach((subBranch, idx, arr) => {
            let parsedBranch = "";
            subBranch.forEach((subToken, isub) => {
                parsedBranch += _parseRegexSON(subToken, isub, subBranch);
            });
            branches += `<span class="branch">${parsedBranch}</span>`;
            if (idx !== (arr.length - 1)) {
                branches += `<span class="or">|</span>`
            }

        });
        
        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            branches += quant;
        }

        let regexChoiceTag = _parseDefault(reToken, branches, {});

        return regexChoiceTag;
    }
    const _parseCharset = (reToken, i, tokenStack) => {
        // clases
        // [d, D, w, W, s, S]
        // ranges
        // 0, 1, lastIndex
        // chars
        // "acd"

        // let charset = expandHtmlEntities(
        //   reToken.raw.replace(new RegExp(`[\\\\${reToken.classes.join("\\\\")}]`))
        // );
        let charsetHTML = expandHtmlEntities(reToken.raw);
        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            charsetHTML = expandHtmlEntities(reToken.raw.slice(0, reToken.repeat.beginIndex));
            charsetHTML += quant;
        }
        return _parseDefault(reToken, charsetHTML, {});
    }
    const _parseExact = (reToken, i, tokenStack) => {
        let exactHTML = expandHtmlEntities(reToken.raw);
        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            exactHTML = expandHtmlEntities(reToken.raw.slice(0, reToken.repeat.beginIndex));
            exactHTML += quant;
        }
        return _parseDefault(reToken, exactHTML, {});
    }
    const _parseDot = (reToken, i, tokenStack) => {
        let quant = "";
        if (reToken.repeat) quant = _auxParseQuantifier(reToken, i, tokenStack);
        return _parseDefault(reToken, `.${quant}`, {extraClass: "dot"});
    }
    const _parseEscapeChars = (reToken, i, tokenStack) => {
        let escapeCharHTML = expandHtmlEntities(reToken.raw);
        if (reToken.repeat) {
            let quant = _auxParseQuantifier(reToken, i, tokenStack);
            escapeCharHTML = expandHtmlEntities(reToken.raw.slice(0, reToken.repeat.beginIndex));
            escapeCharHTML += quant;
        }
        return _parseDefault(reToken, escapeCharHTML, {extraAttributes: `chars="${reToken.chars}"`});
    }

    const typeMap = {
        "assert": _parseAssert,
        "group": _parseGroup,
        "choice": _parseChoice,
        "charset": _parseCharset,
        "exact": _parseExact,
        "dot": _parseDot,
        "hexadecimal": _parseEscapeChars,
        "unicode": _parseEscapeChars,
        "octal": _parseEscapeChars,
        "comment": _parseComment,
    };
    const _parseRegexSON = (_reToken, _i, _tokenStack) => {
        let _parsedRegexHTML = "";
        if (_reToken.type in typeMap) {
            _parsedRegexHTML += typeMap[_reToken.type](_reToken, _i, _tokenStack);
        }

        return _parsedRegexHTML;
    };

    const parseRegexToHTML = (regexson, regexRaw) => {
        let htmlParsed = "";

        if (regexson === undefined) {
            htmlParsed = `<span>${escapeHTMLChars(regexRaw)}</span>`;
        }
        else {
            regexson.tree.forEach((reToken, i) => {
                htmlParsed += _parseRegexSON(reToken, i, regexson.tree);
            });
        }

        // Tests if its generated well
        let $testDiv = document.createElement("div");
        $testDiv.innerHTML = htmlParsed
        
        
        if ($testDiv.innerText !== regexRaw) {
            if ($testDiv.innerText.length < regexRaw.length && regexRaw.startsWith($testDiv.innerText)) {
                // showErrorsParser("Cannot render well that regex!");
                let noParsed = regexRaw.slice($testDiv.innerText.length);
                htmlParsed = `<span>${htmlParsed}</span><span>${expandHtmlEntities(noParsed)}</span>`;
            }
            else {
                // showErrorsParser("Cannot render well that regex!");
                htmlParsed = `<span>${expandHtmlEntities(regexRaw)}</span>`;
            }
        }

        return htmlParsed;
    }

    // Event Input Listener
    const onInput = (regexson, regexraw, { target: $elm }) => {
        // Parse Content
        // Size Change
        if ($elm.nodeName === 'TEXTAREA') {
            if (lastRegex === $elm.value) {
                lastRegex = $elm.value;
            }
            else {
                // var syntaxHTML = convertRawToHTMLResult($elm.value);
                // var syntaxHTML = RegexColorizer.colorizeText($elm.value);
                var syntaxHTML = parseRegexToHTML(regexson, $elm.value);

                const changeTextareaSize = ($textarea) => {
                    const getScrollHeight = ($txtNode) => {
                        let savedValue = $txtNode.value;
                        $txtNode.value = '';
                        $txtNode._baseScrollHeight = $txtNode.scrollHeight;
                        $txtNode._baseHeight = $txtNode.getBoundingClientRect().height;
                        $txtNode.value = savedValue;
                    }
                    // Make sure the input event originated from a textarea and it's desired to be auto-expandable
                    let minRows = $textarea.getAttribute('data-min-rows');
                    !$textarea._baseScrollHeight && getScrollHeight($textarea);

                    $textarea.rows = minRows;
                    let rows = Math.round($textarea.scrollHeight / $textarea._baseScrollHeight);
                    $textarea.rows = rows >= minRows ? rows : minRows;
                };
                changeTextareaSize($elm);
            }
        }
        else {
            if (lastRegex === regexraw) {
                lastRegex = regexraw;
            }
            else {
                // var syntaxHTML = convertRawToHTMLResult(regexraw);
                // var syntaxHTML = RegexColorizer.colorizeText(regexraw);
                var syntaxHTML = parseRegexToHTML(regexson, regexraw);
            }
        }

        $syntax.innerHTML = syntaxHTML;


    };
    return {
        onInput: onInput
    }
}