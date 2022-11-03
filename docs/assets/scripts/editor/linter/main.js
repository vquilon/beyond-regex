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
        let errors = regexson.errors
        errors.sort((a ,b) => {
            let ai = a.indices;
            let bi = b.indices;
            // a[0] = b[0] and a[1] = b[1]
            // a .....[......]......
            // b .....[......]......
            if (ai[0] === bi[0] && ai[1] === bi[1]) return 0;

            // a[0] > b[0] and a[1] > b[1]
            // a .....[........]....
            // b ...[.....].........
            // a .........[........].
            // b .[....].............
            // a[0] = b[0] and a[1] > b[1]
            // a ....[........]....
            // b ....[.....].......
            // a[0] > b[0] and a[1] = b[1]
            // a .....[........]....
            // b ...[..........]....
            // a[0] = b[0] and a[1] = b[1]
            // a .....[......]......
            // b .....[......]......
            if (ai[0] >= bi[0] && ai[1] >= bi[1]) return 1;

            // a[0] < b[0] and a[1] < b[1]
            // a ...[.....].........
            // b .....[........]....
            // a ..[.....]..........
            // b ..........[.....]..
            // a[0] = b[0] and a[1] < b[1]
            // a ....[.....].......
            // b ....[........]....
            // a[0] < b[0] and a[1] = b[1]
            // a ...[..........]....
            // b .....[........]....
            // a[0] = b[0] and a[1] = b[1]
            // a .....[......]......
            // b .....[......]......
            if (ai[0] <= bi[0] && ai[1] <= bi[1]) return -1;
        })
        for (let error of errors) {
            // type: "UnterminatedGroup",
            // message: "Unterminated group!",
            // lastIndex: _processedStack._parentGroup.indices[0],
            // lastState: _error_lastState,
            // indices: []
            let indices = error.indices;
            indices = [indices[0], indices[1] + 1];
            // Por cada error sustituir 
            let preCorrectRegex = expandHtmlEntities(regExpresion.slice(actualChar, indices[0]));
            let errorHTML = `<span class="error" errortype="${error.type}" tooltip="${error.message}">${expandHtmlEntities(regExpresion.slice(indices[0], indices[1]))}</span>`
            actualChar = indices[1];
            linterHTML += `${preCorrectRegex}${errorHTML}`;
        }
        $editorLinter.innerHTML = linterHTML;
    }

    return {
        onRegexErrors: onErrors,
        cleanLinter: () => {$editorLinter.innerHTML=""}
    }
}

