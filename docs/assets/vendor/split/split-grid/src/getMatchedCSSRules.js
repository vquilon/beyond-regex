export default el =>
    []
        .concat(
            ...Array.from(el.ownerDocument.styleSheets).map(s => {
                let rules = []

                try {
                    rules = Array.from(s.cssRules || [])
                } catch (e) {
                }

                return rules
            }),
        )
        .filter(r => {
            let matches = false
            try {
                matches = el.matches(r.selectorText)
            } catch (e) {
            }

            return matches
        })
