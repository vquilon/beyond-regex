// Agrupar todos los elementos un elemento g
function groupRaphItems() {
    parentSVG = document.querySelectorAll("#graphCt svg");
    // Solo deberia haber uno
    parentSVG = parentSVG[0];


    let allItems = document.querySelectorAll("svg rect[class^=rect], svg text[class^=text], svg path[class^=path],  svg circle[class^=circle]");
    let allItems_noJoints = document.querySelectorAll("svg circle[class^=circle] svg rect[class^=rect], svg text[class^=text], svg path[class^='path:curve']");
    let allJoints = document.querySelectorAll("svg path[class^='path:linejoint']");

    function splitClassLineJoints(className) {
        let auxSplittedClasses = className.split('_');
        let splittedClasses = [];
        let auxJointInternalClass = "";
        let insideJoint = false;
        let countPathJoints = 0;

        for (let i = 0; i < auxSplittedClasses.length; i++) {
            let auxClass = auxSplittedClasses[i];
            if (auxClass.startsWith('path:linejoint') || auxClass.includes('path:linejoint')) {
                countPathJoints += 3 * (auxClass.match(/path:linejoint/g) || []).length;
                if (countPathJoints !== 0) {
                    if (!insideJoint) {
                        insideJoint = true;
                    }
                }
            }
            if (auxClass.endsWith('::') || auxClass.includes('::')) {
                countPathJoints -= (auxClass.match(/::/g) || []).length;;
                if (countPathJoints === 0) {
                    auxClass = `${auxJointInternalClass}_${auxClass}`;
                    auxJointInternalClass = "";
                    insideJoint = false;
                }
            }

            if (insideJoint) {
                if (auxJointInternalClass === "") {
                    auxJointInternalClass = auxClass;
                } else {
                    auxJointInternalClass += `_${auxClass}`;
                }
            } else {
                splittedClasses.push(auxClass);
            }
        }

        return splittedClasses;
    }

    function getInfoFromClassName(className) {
        let aux_className = className.split(':');
        let tagName = aux_className[0];
        className = aux_className.slice(1).join(':');

        let arrayClassName = className.split('::');
        let classType = arrayClassName[0];
        let startItems = null;
        let endItems = null;
        let _aux_classIndices = [];
        let classIndices = [];

        if (classType === "linejoint") {
            // Se trata de un joint
            className = arrayClassName.slice(1).join('::');
            let countJoints = 0;
            let startItemsIndex = 0;
            if (arrayClassName.length > 4) {
                for (let i = 0; i < className.length; i++) {
                    let ci = className[i];
                    if (ci === ':') {
                        if (className.substring(i).startsWith('::')) {
                            if (countJoints === 0) {
                                startItemsIndex = i;
                                break;
                            } else {
                                countJoints--;
                            }
                        }

                    }
                    if (ci === 'p') {
                        if (className.substring(i).startsWith('path:linejoint::')) {
                            countJoints++;
                        }

                    }
                }


                startItems = splitClassLineJoints(className.slice(0, startItemsIndex));
                endItems = splitClassLineJoints(className.slice(startItemsIndex + ('::'.length)));
            } else {
                startItems = arrayClassName[1].split('_');
                endItems = arrayClassName[2].split('_');
            }
            let _aux_item = startItems.sort(sortRaphaelItemsClass)[0];
            _aux_classIndices = _aux_item.split(':')[2].split(';');
            classIndices = [Number(_aux_classIndices[0]), Number(_aux_classIndices[1])];
        }
        else {
            // Es otro elemento
            arrayClassName = className.split(':');
            classType = arrayClassName[0];
            _aux_classIndices = arrayClassName[1].split(';');
            classIndices = [Number(_aux_classIndices[0]), Number(_aux_classIndices[1])];
        }
        return { tagName: tagName, arrayClassName: arrayClassName, classType: classType, classIndices: classIndices };
    }


    // El orden que tiene que tener es (menor a mayor):
    // - rect:5;10
    // - text:5;10
    // - rect:5;8
    // - text:5;8
    // - rect:7;8
    // - text:7;8

    function sortRaphaelItemsClass(a_className, b_className) {
        // -1 si a es menor que b
        // 1 si a es mayor que b
        // 0 si son iguales
        let a_infoClassName = getInfoFromClassName(a_className);
        let a_tagName = a_infoClassName.tagName;
        let a_arrayClassName = a_infoClassName.arrayClassName;
        let a_classType = a_infoClassName.classType;
        let a_classIndices = a_infoClassName.classIndices;

        let b_infoClassName = getInfoFromClassName(b_className);
        let b_tagName = b_infoClassName.tagName;
        let b_arrayClassName = b_infoClassName.arrayClassName;
        let b_classType = b_infoClassName.classType;
        let b_classIndices = b_infoClassName.classIndices;

        let tagOrder = {
            circle: {
                startPoint: -1,
                endPoint: Infinity
            },
            path: {
                _: 0,
                curve: 0,
                linejoint: 0
            },
            rect: {
                _: 1,
                group: 1,
                charsetgroup: 2,
                charset: 3,
                exact: 4
            },
            text: 5,
        }

        let a_tagClassOrder = tagOrder[a_tagName];
        let b_tagClassOrder = tagOrder[b_tagName];

        if (typeof a_tagClassOrder === "object") {
            if (a_tagClassOrder.hasOwnProperty(a_classType)) {
                a_tagClassOrder = a_tagClassOrder[a_classType];
            } else {
                a_tagClassOrder = a_tagClassOrder._;
            }
        }

        if (typeof b_tagClassOrder === "object") {
            if (b_tagClassOrder.hasOwnProperty(b_classType)) {
                b_tagClassOrder = b_tagClassOrder[b_classType];
            } else {
                b_tagClassOrder = b_tagClassOrder._;
            }
        }
        // Evaluacion de orden
        if (a_classIndices[0] === b_classIndices[0]) {
            if (a_classIndices[1] === b_classIndices[1]) {
                // Se ordena por el tipo de elemento
                if (a_tagClassOrder > b_tagClassOrder) {
                    // Los textos van despues, a la derecha en el array, para estar por encima del rect
                    // b: - rect:5;10
                    // a: - text:5;10
                    return 1;
                } else if (a_tagClassOrder < b_tagClassOrder) {
                    // 'a' es menor que 'b'
                    // a: - rect:5;10
                    // b: - text:5;10
                    return -1;
                } else if (a_tagClassOrder === b_tagClassOrder) {
                    // Ambos tienen el mismo tipo estan igual ordenados
                    // a: - text:5;10
                    // b: - text:5;10
                    return 0;
                }
                // TODO: Completar otras heuristicas
                else {
                    return 0;
                }
            }
            else if (a_classIndices[1] < b_classIndices[1]) {
                // El a esta dentro de b, entonces a esta a la derecha de b
                // b: - text:5;10
                // a: - rect:5;8
                return 1;
            }
            else if (a_classIndices[1] > b_classIndices[1]) {
                // El b esta dentro de a por lo que b va a la derecha de a
                // a: - text:5;10
                // b: - rect:5;8
                return -1;
            }
        }
        else if (a_classIndices[0] < b_classIndices[0]) {
            // 'a' es mas pequeño, por lo que 'a' esta a la izquierda de 'b'
            // a: - rect:5;10
            // b: - text:7;8
            return -1;
        }
        else if (a_classIndices[0] > b_classIndices[0]) {
            // 'b' es mas pequeño, por lo que 'b' esta a la izquierda de 'a'
            // b: - rect:5;10
            // a: - text:7;8
            return 1;
        }


        return 0;
    }


    let arr_allItems = Array.prototype.slice.call(allItems, 0);
    let sorted_arr_allItems = arr_allItems.sort(function (a, b) {
        // a.className.baseVal
        let a_className = a.getAttribute('class');
        // b.className.baseVal
        let b_className = b.getAttribute('class');
        return sortRaphaelItemsClass(a_className, b_className);
    });

    // splitClassLineJoints("path:curve:6;43_path:curve:6;43_text:group:6;43_rect:exact:15;16_text:exact:15;16_path:curve:15;40_path:curve:15;40_path:curve:15;40_path:curve:15;40_rect:exact:18;24_text:exact:18;24_rect:exact:27;32_text:exact:27;32_path:linejoint::path:linejoint::rect:exact:18;24_text:exact:18;24::rect:exact:27;32_text:exact:27;32::_rect:exact:18;24_text:exact:18;24::rect:exact:27;32_text:exact:27;32_path:linejoint::rect:exact:18;24_text:exact:18;24::rect:exact:27;32_text:exact:27;32_path:linejoint::rect:exact:18;24_text:exact:18;24::rect:exact:27;32_text:exact:27;32::_::_::_rect:group:17;34_text:group:17;34_path:curve:15;40_path:curve:15;40_path:curve:15;40_path:curve:15;40_rect:exact:36;37_text:exact:36;37_path:curve:36;39_path:curve:36;39_path:curve:36;39_rect:exact:38;39_text:exact:38;39_path:curve:36;39_path:curve:36;39_path:curve:36;39_rect:group:35;40_text:group:35;40_path:curve:15;40_path:curve:15;40_path:curve:15;40_path:curve:15;40_rect:group:6;43_path:linejoint::rect:exact:18;24_text:exact:18;24::rect:exact:27;32_text:exact:27;32::_text:group:6;43::");
    allItems.forEach(element => {

    });
}

