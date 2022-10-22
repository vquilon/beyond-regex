function EditorLinter(options = {}) {
    let $editorLinter = options.$editorLinter;

    // const errorMap = {

    // }
    // const processDefaultError = (reToken, htmlRaw) => {

    // }
    // const parseTokenError = (reToken, i, tokenStack) => {
    //     let errorHTML = "";
    //     // if (reToken.type in errorMap) {
    //     //     parsedRegexHTML += typeMap[reToken.type](reToken, i, tokenStack);
    //     // }

    //     errorHTML += `<span tooltip="${reToken.error.}"></span>`;


    //     return errorHTML;
    // }

    function escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    function expandHtmlEntities(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/ |&nbsp;/g, `<span class="space special-chars"> </span>`)
            .replace(/\n/g, `<span class="endline special-chars">\n</span>`)
            .replace(/\t/g, `<span class="tab special-chars">\t</span>`);
    }

    const onErrors = (regExpresion, regexson) => {
        $editorLinter.innerHTML = "";

        // regexson.errors;

        linterHTML = ``;
        // regexson.tree.forEach((reToken, i) => {
        //     linterHTML += parseTokenError(reToken, i, regexson.tree);
        // });
        let actualChar = 0;
        for (let error of regexson.errors) {
            // type: "UnterminatedGroup",
            // message: "Unterminated group!",
            // lastIndex: _processedStack._parentGroup.indices[0],
            // lastState: _error_lastState,
            // indices: []
            let indices = error.indices;
            if (indices[0] === indices[1]) indices = [indices[0], indices[1] + 1];
            // Por cada error sustituir 
            let preCorrectRegex = expandHtmlEntities(regExpresion.slice(actualChar, indices[0]));
            let errorHTML = `<span class="error" errortype="${error.type}" tooltip="${error.message}">${expandHtmlEntities(regExpresion.slice(indices[0], indices[1]))}</span>`
            actualChar = indices[1];
            linterHTML += `${preCorrectRegex}${errorHTML}`;
        }
        $editorLinter.innerHTML = linterHTML;
    }

    return {
        onRegexErrors: onErrors
    }
}

