function RegexVisualizer(regexson_tree, regex_flags, canvas_Raphael_paper, $gViewPort, $gContainer, $progress_bar, updateAddOns) {
    var _aux_Kit = Kit();

    function paintRegex(regexson_tree, regex_flags, canvasRaph) {
        let [regexBoxRect, sizeTextItem] = _prepareCanvasRaphael(canvasRaph, regex_flags);
        $progress_bar.updateProgressBar(10);

        // Generacion del grafo
        let raphael_items = _generateGraph(canvasRaph, regexson_tree, sizeTextItem, regexBoxRect);
        $progress_bar.updateProgressBar(50);

        _postCanvasRaphael();
        $progress_bar.updateProgressBar(60);

        canvasRaph.addv2(raphael_items.items);
        $progress_bar.updateProgressBar(90);

        let childNodes = Array.from(canvasRaph.canvas.childNodes);
        childNodes.forEach(el => {
            if (el !== $gViewPort) {
                $gContainer.appendChild(el);
            }
        });

        $progress_bar.updateProgressBar(100);

        return raphael_items;
    }

    function paintRegexCallbacks(regexson_tree, regex_flags, canvasRaph) {
        // const callback1 = (canvasRaph, regex_flags) => {
        //     let [regexBoxRect, sizeTextItem] = _prepareCanvasRaphael(canvasRaph, regex_flags);
        //     $progress_bar.updateProgressBar(10);

        //     return [regexBoxRect, sizeTextItem];
        // }
        const callback2 = (canvasRaph, regexson_tree, sizeTextItem, regexBoxRect) => {
            // Generacion del grafo
            let raphael_items = _generateGraph(canvasRaph, regexson_tree, sizeTextItem, regexBoxRect);
            $progress_bar.updateProgressBar(40);

            return [raphael_items, canvasRaph];
        }
        const callback3 = () => {
            _postCanvasRaphael();
            $progress_bar.updateProgressBar(60);
        }
        const callback4 = (canvasRaph, raphael_items) => {
            canvasRaph.addv2(raphael_items.items);
            $progress_bar.updateProgressBar(80);
            return canvasRaph;
        }
        const callback5 = (canvasRaph) => {
            let childNodes = Array.from(canvasRaph.canvas.childNodes);
            childNodes.forEach(el => {
                if (el !== $gViewPort) {
                    $gContainer.appendChild(el);
                }
            });
            $progress_bar.updateProgressBar(100);
        }

        let execution_plan = [
            // [['canvasRaph', 'regex_flags'], callback1, ['regexBoxRect', 'sizeTextItem']],
            [['canvasRaph', 'regexson_tree', 'sizeTextItem', 'regexBoxRect'], callback2, ['raphael_items', 'canvasRaph']],
            [[], callback3, []],
            [['canvasRaph', 'raphael_items'], callback4, ['canvasRaph']],
            [['canvasRaph'], callback5, []],
            [[], updateAddOns, []]
        ]

        class Callable {
            constructor(callback, inputs, outputs) {
                this.callback = callback;
                this.inputs = inputs;
                this.outputs = outputs;
            }
            run(runtime_vars) {
                function argsify2(fn) {
                    return function () {
                        let args_in = Array.prototype.slice.call(arguments)[0];
                        return fn.apply(0, args_in);
                    }
                }
                let input_args = []
                for (let arg_name of this.inputs.args_names) {
                    input_args.push(runtime_vars[arg_name])
                }
                let outputs = argsify2(this.callback)(input_args);
                if (this.outputs.args_names.length === 0) return runtime_vars;
                if (this.outputs.args_names.length === 1) runtime_vars[this.outputs.args_names[0]] = outputs;
                if (this.outputs.args_names.length > 1) {
                    for (let i = 0; i < this.outputs.args_names.length; i++) {
                        let arg_name = this.outputs.args_names[i];
                        runtime_vars[arg_name] = outputs[i];
                    }
                }

                return runtime_vars;
            }
        }
        class ArgNames {
            constructor(args_names) {
                for (let arg_name of args_names) {
                    this[arg_name] = undefined;
                }
                this.args_names = args_names;
            }
        }

        class Pipeline {
            constructor(execution_plan, runtime_vars) {
                this.runtime_vars = runtime_vars || {};

                this.execution_plan = this.process_plan(execution_plan)
            }

            process_plan(execution_plan_list) {
                let execution_plan_processed = [];
                for (let step of execution_plan_list) {
                    execution_plan_processed.push(
                        new Callable(step[1], new ArgNames(step[0]), new ArgNames(step[2]))
                    );
                }
                return execution_plan_processed;
            }

            run() {
                for (let callStep of this.execution_plan) {
                    this.runtime_vars = callStep.run(this.runtime_vars);
                }
            }
            run_iterative() {
                // TODO: No se puede realizar esto ya que no son tareas paralelizables una depende de la otra
                var runtime_vars = this.runtime_vars;
                for (let i = 0; i < this.execution_plan.length; i++) {
                    (function (_i, execution_plan) {
                        let milisDelayBetweenRenderDOM = 500;
                        let stepFactorMilis = 20;
                        let callStep = execution_plan[_i];
                        window.setTimeout(
                            function () {
                                runtime_vars = callStep.run(runtime_vars);
                            },
                            _i * stepFactorMilis + milisDelayBetweenRenderDOM
                        )
                    })(i, this.execution_plan);
                }
            }
            run_recursive() {
                var milisDelayBetweenRenderDOM = 500;
                var stepFactorMilis = 20;
                var that = this;
                function recursiveBatch(batchNum) {
                    return function () {
                        that.runtime_vars = that.execution_plan[batchNum].run(that.runtime_vars)
                        if (batchNum < that.execution_plan.length - 1) {
                            window.setTimeout(
                                recursiveBatch(batchNum + 1), 0  // stepFactorMilis + milisDelayBetweenRenderDOM
                            )
                        }
                    }
                }

                window.setTimeout(recursiveBatch(0), 0)
            }
        }

        let [regexBoxRect, sizeTextItem] = _prepareCanvasRaphael(canvasRaph, regex_flags);
        let childNodes = Array.from(canvasRaph.canvas.childNodes);
        childNodes.forEach(el => {
            if (el !== $gViewPort) {
                $gContainer.appendChild(el);
            }
        });
        $progress_bar.updateProgressBar(10);

        let pipeline = new Pipeline(
            execution_plan, {
            regexBoxRect: regexBoxRect, sizeTextItem: sizeTextItem,
            canvasRaph: canvasRaph, regex_flags: regex_flags, regexson_tree: regexson_tree
        }
        );
        // pipeline.run();
        pipeline.run_recursive();

        let raphael_items = pipeline.runtime_vars.raphael_items;

        return raphael_items;
    }

    // SET DE FUNCIONES PRINCIPALES DEL paintRegex
    function _prepareCanvasRaphael(canvasRaph, regex_flags) {
        // canvasRaph.clear();
        // canvasRaph.setSize(0, 0);

        // Se pintan todos los items en el canvas de Raphael
        // Obtener los elementos que hay ahora cargados
        // Verificar que ningun ID coincide con los que hay en el json de regex
        // Todos los IDs que no se actualicen se borraran del Paper de Raphael
        // En caso de actualizar todo, se eliminaran todos
        let elementsRaphael = [];
        canvasRaph.forEach(el => {
            elementsRaphael.push(el);
        });
        elementsRaphael.forEach(el => el.remove());

        let regexBoxRect = canvasRaph.rect(0, 0, 0, 0);
        regexBoxRect.attr("fill", STROKE_COLOR), regexBoxRect.attr("stroke", STROKE_COLOR);
        createTextNodeWithFontFamilySize(canvasRaph);

        let sizeTextItem = getFontSizes(GRAPH_FONTSIZE, "bold");

        // Variar el comportamiento del grafo segun los flags
        HAS_FLAG_MULTILINE = !!~regex_flags.indexOf("m");

        return [regexBoxRect, sizeTextItem];
    }
    function _generateGraph(canvasRaph, regexson_tree, sizeTextItem, regexBoxRect) {
        let max_item_width = 0;
        let max_item_height = 0;

        // Procesamiento y generacion del literal de la regex y ubicarlo en el grafo
        // let regex_text_items = _generateHihglightRegexLiteral(regexson_tree, regex_flags);
        // [max_item_width, max_item_height] = _resizeHeightWithRegexLiteral(regex_text_items, size_item_text, margin_items);


        // Se procesa el regexson para generar los items con formato json que despues procesara Raphael
        var raphael_items = generateRaphaelSVGItems([...regexson_tree.tree], 0, 0);

        max_item_height = Math.max(raphael_items.height + 3 * ITEMS_MARGIN + sizeTextItem.height, max_item_height);
        max_item_width = Math.max(raphael_items.width + 2 * ITEMS_MARGIN, max_item_width);

        // Establece el size del canvas al maximo que hay generado por las regex
        // TODO: Se puede cambiar y dejarlo fijo, ya que en un futuro tendra control zooming y panning.
        canvasRaph.setSize(max_item_width, max_item_height);
        regexBoxRect.attr("width", max_item_width);
        regexBoxRect.attr("height", max_item_height);
        addsOffset(raphael_items.items, ITEMS_MARGIN, 2 * ITEMS_MARGIN + sizeTextItem.height - raphael_items.y);

        return raphael_items;
    }
    function _postCanvasRaphael() {
        // SE BORRA EL ELEMENTO QUE ALMACENABA DE FORMA TEMPORAL EL SIZE DE LA FUENTE Y ESTILO
        AUX_FONT_STYLE_ELEMENT.remove();
    }
    //

    // FUNCIONES AUXILIARES PARA GENERAR EL TEXTO HIHGLIGHTED EN EL GRAFO
    function _generateHihglightRegexLiteral(regexson, regex_flags) {
        // Generacion del texto encima del grafo
        var regex_text_items = processRegexTextItems(regexson.tree);
        regex_text_items.unshift(createRegexTextItem("/", colors_map.delimiter));
        regex_text_items.unshift(createRegexTextItem("RegExp: "));
        regex_text_items.push(createRegexTextItem("/", colors_map.delimiter));
        regex_flags && regex_text_items.push(createRegexTextItem(regex_flags, colors_map.flags));
        return regex_text_items;
    }
    function _resizeHeightWithRegexLiteral(regex_text_items, size_item_text, margin_items) {
        var aux_margin_items = margin_items;
        var margin_height = size_item_text.height / 2 + margin_items;

        max_item_width = regex_text_items.reduce(function (t, e) {
            return e.x = t,
                e.y = margin_height,
                t + e.text.length * size_item_text.width
        }, aux_margin_items);
        max_item_width += margin_items;
        max_item_height = size_item_text.height + 2 * margin_items;
        regex_text_items = canvas_Raph.add(regex_text_items);

        // Establece la altura para el size generado por el texto de la regex
        canvas_Raph.setSize(max_item_width, size_item_text.height + 2 * margin_items);

        return [max_item_width, max_item_height]
    }
    //

    function getFontSizes(font_size, font_weight) {
        if (font_weight = font_weight || "normal", FONT_STYLE_MAP[font_size] && FONT_STYLE_MAP[font_size][font_weight])
            return FONT_STYLE_MAP[font_size][font_weight];
        AUX_FONT_STYLE_ELEMENT.attr({
            "fill": "transparent",
            "font-size": font_size,
            "font-weight": font_weight
        });
        var font_style_aux_bbox = AUX_FONT_STYLE_ELEMENT.getBBox();
        return FONT_STYLE_MAP[font_size] = FONT_STYLE_MAP[font_size] || {},
            FONT_STYLE_MAP[font_size][font_weight] = {
                width: font_style_aux_bbox.width / ((AUX_FONT_STYLE_ELEMENT.attr("text").length - 1) / 2),
                height: font_style_aux_bbox.height / 2
            }
    }
    function createTextNodeWithFontFamilySize(canvas_Raphael) {
        // Se crea este elemento vacio para determiar el tamaño que tienen los caracteres
        // dentro del grafo para un familia de fuente y tamaño, despues se cambia el 
        // estilo
        AUX_FONT_STYLE_ELEMENT = canvas_Raphael.text(-1e3, -1e3, "XgfTlM|.q\nXgfTlM|.q").attr({
            "font-family": FONT_FAMILY,
            "font-size": GRAPH_FONTSIZE
        })
    }
    function generateRaphaelSVGItems(regexsonTree, _offset_x, _offset_y) {
        regexsonTree.unshift({
            type: "startPoint"
        });
        regexsonTree.push({
            type: "endPoint"
        });

        return processRegexJSONToRaphaelSVG(regexsonTree, _offset_x, _offset_y)
    }
    // Funcion que ordena y crea los paths
    function processRegexJSONToRaphaelSVG(regexsonTree, offset_x, offset_y) {
        var processed_items_result = [];
        var raphael_items = [];
        var items_width = 0;
        var items_height = 0;
        var _offset_x = offset_x;
        var _offset_y = offset_y;
        var _actualHeight = offset_y;

        if (!regexsonTree.length) {
            return generator_Raph_map.empty(regexsonTree, offset_x, offset_y);
        }

        // Creacion de cada item
        regexsonTree.forEach(function (single_regexjson_info) {
            var raphael_element;
            if (single_regexjson_info.repeat) {
                raphael_element = generator_Raph_map.repeat(single_regexjson_info, _offset_x, offset_y);
            } else {
                raphael_element = generator_Raph_map[single_regexjson_info.type](single_regexjson_info, _offset_x, offset_y);
            }
            // Agregar un grupo que envuelva a los elementos creados por la funcion
            processed_items_result.push(raphael_element);
            _offset_x += raphael_element.width + LINE_ITEMS_GAP;
            items_width += raphael_element.width;
            _offset_y = Math.min(_offset_y, raphael_element.y);
            _actualHeight = Math.max(_actualHeight, raphael_element.y + raphael_element.height);
            raphael_items = raphael_items.concat(raphael_element.items)
        });

        // Aqui se generan los paths que unen los diferentes elementos (horizontalmente)
        items_height = _actualHeight - _offset_y;
        processed_items_result.reduce(function (firstElement, nextElement) {
            items_width += LINE_ITEMS_GAP;
            var line_path_item = createLinesPathItem(regexsonTree, firstElement.lineOutX, offset_y, nextElement.lineInX, _fromItem = firstElement, _toItem = nextElement);
            return raphael_items.push(line_path_item), nextElement;
        });
        var items_linein_x = processed_items_result[0].lineInX;
        var items_lineout_x = processed_items_result[processed_items_result.length - 1].lineOutX;
        return {
            items: raphael_items,
            width: items_width,
            height: items_height,
            x: offset_x,
            y: _offset_y,
            lineInX: items_linein_x,
            lineOutX: items_lineout_x
        }
    }
    function addsOffset(raphael_items, offset_x, offset_y) {
        raphael_items.forEach(function (raph_item) {
            raph_item._translate ? raph_item._translate(offset_x, offset_y) : (raph_item.x += offset_x, raph_item.y += offset_y);
        });
    }
    function createGroupContainerItem(regexJSONInfo, children_items, offset_x, offset_y, width, height) {
        return {
            type: "group",
            id: regexJSONInfo.id || "",
            dataset: {
                indices: [regexJSONInfo.indices[0] + 1, regexJSONInfo.indices[1] - 1].join(","),
            },
            class: `g:${regexJSONInfo.type}:${[regexJSONInfo.indices[0] + 1, regexJSONInfo.indices[1] - 1].join(';')}`,
            children: children_items,
            transform: `t${offset_x},${offset_y}`,
            x: offset_x,
            y: offset_y,
            width: width,
            height: height,
            _translate: function (offset_x, offset_y) {
                this.x += offset_x;
                this.y += offset_y;
                this.transform = `t${this.x},${this.y}`;
            }
        };
    }
    function createExactCharItem(regexJSONInfo, rawText, offset_x, offset_y, background_color, text_color) {
        rawText = _aux_Kit.toPrint(rawText);
        var size_item_text = getFontSizes(GRAPH_FONTSIZE);
        var text_item_width = rawText.length * size_item_text.width;

        var rect_item_height = size_item_text.height + 12;
        var rect_item_width = text_item_width + 12;
        var rect_item = {
            type: "rect",
            class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            x: 0,// offset_x,
            y: 0, // offset_y - rect_item_height / 2,
            width: rect_item_width,
            height: rect_item_height,
            stroke: "none",
            fill: background_color || "transparent"
        };
        var text_item = {
            type: "text",
            class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            x: rect_item_width / 2, // offset_x + text_item_width / 2,
            y: rect_item_height / 2, // offset_y,
            text: rawText,
            "font-size": GRAPH_FONTSIZE,
            "font-family": FONT_FAMILY,
            fill: text_color || "black"
        };

        var container_item = createGroupContainerItem(regexJSONInfo, [rect_item, text_item], offset_x, offset_y - rect_item_height / 2, rect_item_width, rect_item_height);

        return {
            text: text_item,
            rect: rect_item,
            items: [container_item],
            width: rect_item_width,
            height: rect_item_height,
            x: offset_x,
            y: container_item.y,
            lineInX: offset_x,
            lineOutX: offset_x + rect_item_width
        }
    }
    function createTextItemElement(regexJSONInfo, offset_x, offset_y, raw_text, background_color) {
        var text_width, text_size_attr = getFontSizes(REGEX_FONTSIZE);
        var text_splitted = raw_text.split("\n");
        var textlines_height = text_splitted.length * text_size_attr.height;
        text_width = text_splitted.length > 1 ? Math.max.apply(Math, text_splitted.map(function (t) {
            return t.length
        })) : raw_text.length,
            text_width *= text_size_attr.width;
        return {
            label: {
                type: "text",
                class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                x: offset_x,
                y: offset_y - textlines_height / 2 - 4,
                text: raw_text,
                "font-size": REGEX_FONTSIZE,
                "font-family": FONT_FAMILY,
                fill: background_color || "#444"
            },
            x: offset_x - text_width / 2,
            y: offset_y - textlines_height - 4,
            width: text_width,
            height: textlines_height + 4
        }
    }
    function createLinesPathItem(regexJSONInfo, offset_x, offset_y, offset_x_to, _fromItem = null, _toItem = null) {
        // Se generan al final todos los paths por lo que no hay informacion en los paths util
        let idInfo = "linejoint";
        if (_fromItem !== null) {
            // El filter es para comprobar que tiene la propiedad
            idInfo = `${idInfo}::${_fromItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}`;
        }
        if (_toItem !== null) {
            idInfo = `${idInfo}::${_toItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}::`;
        }

        if (regexJSONInfo.hasOwnProperty('indices')) {
            idInfo = `any:${regexJSONInfo.indices.join(';')}`;
        }
        return {
            type: "path",
            class: `path:${idInfo}`,
            x: offset_x,
            y: offset_y,
            path: ["M", offset_x, offset_y, "H", offset_x_to],
            "stroke-linecap": "butt",
            "stroke-linejoin": "round",
            stroke: "#333",
            "stroke-width": 2,
            _translate: function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x
            }
        }
    }
    function createChoicesPathItem(regexJSONInfo, offset_x, offset_y, width, height) {
        var path, _translate_path;
        var width_direction = offset_x > width ? -1 : 1;
        var height_direction = offset_y > height ? -1 : 1;

        if (Math.abs(offset_y - height) < 15) {
            path = ["M", offset_x, offset_y, "C", offset_x + Math.min(Math.abs(width - offset_x) / 2, 10) * width_direction, offset_y, width - (width - offset_x) / 2, height, width, height];
            _translate_path = function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x, path[5] += _offset_y;
                path[6] += _offset_x, path[7] += _offset_y, path[8] += _offset_x, path[9] += _offset_y;
            }
        }
        else {
            path = ["M", offset_x, offset_y, "Q", offset_x + 10 * width_direction, offset_y, offset_x + 10 * width_direction, offset_y + 10 * height_direction, "V", Math.abs(offset_y - height) < 20 ? offset_y + 10 * height_direction : height - 10 * height_direction, "Q", offset_x + 10 * width_direction, height, offset_x + 10 * width_direction * 2, height, "H", width];
            _translate_path = function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x, path[5] += _offset_y;
                path[6] += _offset_x, path[7] += _offset_y, path[9] += _offset_y, path[11] += _offset_x;
                path[12] += _offset_y, path[13] += _offset_x, path[14] += _offset_y, path[16] += _offset_x;
            };
        }
        return {
            type: "path",
            class: `path:curve:${regexJSONInfo.indices.join(';')}`,
            path: path,
            "stroke-linecap": "butt",
            "stroke-linejoin": "round",
            stroke: "#333",
            "stroke-width": 2,
            _translate: _translate_path
        }
    }
    function createCircleItem(regexJSONInfo, offset_x, offset_y, fillColor) {
        var _circle_radius = 10;
        var circle_item = {
            type: "circle",
            id: regexJSONInfo.id,
            class: `circle:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            fill: fillColor,
            cx: _circle_radius, // offset_x + _circle_radius,
            cy: 0, // offset_y,
            r: _circle_radius,
            stroke: "none",
            _translate: function (_offset_x, _offset_y) {
                this.cx += _offset_x, this.cy += _offset_y
            }
        };
        container_group = createGroupContainerItem(regexJSONInfo, [circle_item], offset_x, offset_y, _circle_radius * 2, _circle_radius * 2);
        return {
            items: [container_group],
            width: container_group.width,
            height: container_group.height,
            x: offset_x,
            y: offset_y,
            lineInX: container_group.x,
            lineOutX: container_group.x + container_group.width
        }
    }
    function checkRegexJSONInfo(regexJSONInfo) {
        if (Array.isArray(regexJSONInfo)) {
            for (var e = regexJSONInfo, r = 0; r < e.length; r++)
                if (!checkRegexJSONInfo(e[r]))
                    return !1;
            return !0
        }
        var _regex_json_info = regexJSONInfo;
        return _regex_json_info.type === EMPTY_NODE || (_regex_json_info.type === GROUP_NODE && void 0 === _regex_json_info.num ? checkRegexJSONInfo(_regex_json_info.sub) : _regex_json_info.type === CHOICE_NODE ? checkRegexJSONInfo(_regex_json_info.branches) : void 0)
    }
    function processRegexTextItems(regexson_tree) {
        var regex_items_text = [];
        return regexson_tree.forEach(function (item_regexson) {
            if (item_regexson.sub)
                regex_items_text.push(createRegexTextItem("(")),
                    item_regexson.type === ASSERT_NODE ? item_regexson.assertionType === AssertLookahead ? regex_items_text.push(createRegexTextItem("?=")) : regex_items_text.push(createRegexTextItem("?!")) : item_regexson.name !== "" ? regex_items_text.push(createRegexTextItem(`?P<${item_regexson.name}>`)) : item_regexson.nonCapture && regex_items_text.push(createRegexTextItem("?:")),
                    regex_items_text = regex_items_text.concat(processRegexTextItems(item_regexson.sub)),
                    regex_items_text.push(createRegexTextItem(")"));
            else if (item_regexson.branches)
                item_regexson.branches.map(processRegexTextItems).forEach(function (t) {
                    regex_items_text = regex_items_text.concat(t),
                        regex_items_text.push(createRegexTextItem("|"))
                }),
                    regex_items_text.pop();
            else {
                var n = colors_map[item_regexson.type] || colors_map.defaults;
                switch (item_regexson.type) {
                    case CHARSET_NODE:
                        var i = checkCharsetNotEmpty(item_regexson);
                        (!i || item_regexson.exclude) && regex_items_text.push(createRegexTextItem("[")),
                            item_regexson.exclude && regex_items_text.push(createRegexTextItem("^", colors_map.charsetExclude)),
                            item_regexson.ranges.forEach(function (t) {
                                regex_items_text.push(createRegexTextItem(escapeCharsetBrackets(t[0] + "-" + t[1]), colors_map.charsetRange))
                            }),
                            item_regexson.classes.forEach(function (t) {
                                regex_items_text.push(createRegexTextItem("\\" + t, colors_map.charsetClass))
                            }),
                            regex_items_text.push(createRegexTextItem(escapeCharsetBrackets(item_regexson.chars), colors_map.charsetChars)),
                            (!i || item_regexson.exclude) && regex_items_text.push(createRegexTextItem("]"));
                        break;
                    default:
                        var a = item_regexson.raw || "";
                        item_regexson.repeat && (a = a.slice(0, item_regexson.repeat.beginIndex)),
                            a = _aux_Kit.toPrint(a, !0),
                            regex_items_text.push(createRegexTextItem(a, n))
                }
            }
            if (item_regexson.repeat) {
                var s = item_regexson.repeat.min
                    , o = item_regexson.repeat.max;
                0 === s && o === 1 / 0 ? regex_items_text.push(createRegexTextItem("*")) : 1 === s && o === 1 / 0 ? regex_items_text.push(createRegexTextItem("+")) : 0 === s && 1 === o ? regex_items_text.push(createRegexTextItem("?")) : (regex_items_text.push(createRegexTextItem("{")),
                    regex_items_text.push(createRegexTextItem(s)),
                    s === o ? regex_items_text.push(createRegexTextItem("}")) : (regex_items_text.push(createRegexTextItem(",")),
                        isFinite(o) && regex_items_text.push(createRegexTextItem(o)),
                        regex_items_text.push(createRegexTextItem("}")))),
                    item_regexson.repeat.nonGreedy && regex_items_text.push(createRegexTextItem("?", colors_map.repeatNonGreedy))
            }
        }), regex_items_text
    }
    function escapeCharsetBrackets(e) {
        return e = _aux_Kit.toPrint(e),
            e.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
    }
    function createRegexTextItem(t, e) {
        return e = e || colors_map[t] || colors_map.defaults,
        {
            type: "text",
            "font-size": GRAPH_FONTSIZE,
            "font-family": FONT_FAMILY,
            text: t + "",
            fill: e,
            "text-anchor": "start",
            "font-weight": "bold"
        }
    }
    function checkCharsetNotEmpty(charset_item) {
        return !charset_item.chars && !charset_item.ranges.length && 1 === charset_item.classes.length
    }

    var AUX_FONT_STYLE_ELEMENT;
    var FONT_FAMILY = "DejaVu Sans Mono,monospace";
    var GRAPH_FONTSIZE = 16, REGEX_FONTSIZE = 14, LINE_ITEMS_GAP = 16;
    var STROKE_COLOR = "#e2e2e2", HAS_FLAG_MULTILINE = !1, ITEMS_MARGIN = 10, FONT_STYLE_MAP = {};
    var generator_Raph_map = {
        startPoint: function (regexJSONInfo, offset_x, offset_y) {
            return createCircleItem(
                {
                    type: "startPoint",
                    id: "startPoint",
                    indices: [-1, -1]
                }, offset_x, offset_y, colors_map.startRegex // "r(0.5,0.5)#EFE-green"
            );
        },
        endPoint: function (regexJSONInfo, offset_x, offset_y) {
            return createCircleItem(
                {
                    type: "endPoint",
                    id: "endPoint",
                    indices: [Infinity, Infinity]
                }, offset_x, offset_y, colors_map.endRegex // "r(0.5,0.5)#FFF-#000"
            );
        },
        empty: function (regexJSONInfo, offset_x, offset_y) {
            return {
                items: [createLinesPathItem(regexJSONInfo, offset_x, offset_y, offset_x + 10)],
                width: 10,
                height: 2,
                x: offset_x,
                y: offset_y,
                lineInX: offset_x,
                lineOutX: offset_x + 10
            }
        },
        exact: function (regexJSONInfo, offset_x, offset_y) {
            return createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "skyblue",)
        },
        unicode: function (regexJSONInfo, offset_x, offset_y) {
            return createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "skyblue",)
        },
        hexadecimal: function (regexJSONInfo, offset_x, offset_y) {
            return createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "skyblue",)
        },
        octal: function (regexJSONInfo, offset_x, offset_y) {
            return createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "skyblue",)
        },
        comment: function (regexJSONInfo, offset_x, offset_y) {
            let commentContent = createExactCharItem(regexJSONInfo, regexJSONInfo.comment, offset_x, offset_y, "skyblue",)
            var container_comment_item = createGroupContainerItem(
                regexJSONInfo, commentContent,
                0, 0,
                commentContent.width, commentContent.height
            )
            // Agrega un offset a la izquierda para mover todos los items a la derecha y que se centre el dashed group que lo engloba
            addsOffset([container_comment_item], 10, 0);
            var group_decorator_width = commentContent.width + 20;
            var group_decorator_height = commentContent.height + 20;

            var groupinfo_rect_item = {
                type: "rect",
                id: regexJSONInfo.id,
                indices: regexJSONInfo.indices,
                class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                x: 0,
                y: commentContent.y - 10,
                r: 6,
                width: group_decorator_width,
                height: group_decorator_height,
                "stroke-dasharray": ".",
                stroke: "silver",
                "stroke-width": 2
            };
            var groupinfo_text_item = createTextItemElement(
                regexJSONInfo,
                groupinfo_rect_item.width / 2, groupinfo_rect_item.y - 2,
                `Comment`
            );

            var max_width = Math.max(groupinfo_text_item.width, group_decorator_width);
            var offset_x_width = (max_width - group_decorator_width) / 2;

            var container_item = createGroupContainerItem(
                regexJSONInfo, [container_comment_item, groupinfo_rect_item, groupinfo_text_item.label],
                offset_x + offset_x_width, offset_y,
                max_width, group_decorator_height + groupinfo_text_item.height + 4
            );

            return {
                items: [container_item],
                width: container_item.width,
                height: container_item.height,
                x: container_item.x,
                y: container_item.y + groupinfo_text_item.y,
                lineInX: offset_x + offset_x_width + commentContent.x + 10,
                lineOutX: offset_x + offset_x_width + commentContent.x + commentContent.width + 10
            }
        },
        dot: function (regexJSONInfo, offset_x, offset_y) {
            var dot_item = createExactCharItem(regexJSONInfo, "AnyCharExceptNewLine", offset_x, offset_y, "DarkGreen", "white");

            return dot_item.rect.r = 10,
                dot_item.rect.tip = "AnyChar except CR LF",
                dot_item
        },
        backref: function (regexJSONInfo, offset_x, offset_y) {
            var backref_item = createExactCharItem(regexJSONInfo, "Backref #" + regexJSONInfo.num, offset_x, offset_y, "navy", "white");
            return backref_item.rect.r = 8,
                backref_item
        },
        repeat: function (regexJSONInfo, offset_x, offset_y) {
            function timesText(t) {
                return t + (t < 2 ? " time" : " times")
            }
            function _translateFunc(_offset_x, _offset_y) {
                var r = this.path;
                r[1] += _offset_x,
                    r[2] += _offset_y,
                    r[4] += _offset_x,
                    r[5] += _offset_y,
                    r[6] += _offset_x,
                    r[7] += _offset_y,
                    r[9] += _offset_y,
                    r[11] += _offset_x,
                    r[12] += _offset_y,
                    r[13] += _offset_x,
                    r[14] += _offset_y,
                    r[16] += _offset_x,
                    r[18] += _offset_x,
                    r[19] += _offset_y,
                    r[20] += _offset_x,
                    r[21] += _offset_y,
                    r[23] += _offset_y,
                    r[25] += _offset_x,
                    r[26] += _offset_y,
                    r[27] += _offset_x,
                    r[28] += _offset_y
            }
            if (checkRegexJSONInfo(regexJSONInfo))
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var repeat_info = regexJSONInfo.repeat
                , o = ""
                , c = [];
            if (repeat_info.min === repeat_info.max && 0 === repeat_info.min)
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var u = generator_Raph_map[regexJSONInfo.type](regexJSONInfo, offset_x, offset_y)
                , l = u.width
                , f = u.height;
            if (repeat_info.min === repeat_info.max && 1 === repeat_info.min)
                return u;
            repeat_info.min === repeat_info.max ? o += timesText(repeat_info.min) : (o += repeat_info.min,
                isFinite(repeat_info.max) ? o += (repeat_info.max - repeat_info.min > 1 ? " to " : " or ") + timesText(repeat_info.max) : o += " or more times");
            var d = 10
                , g = 0
                , x = 10
                , v = u.y + u.height - offset_y
                , y = 20 + u.width;
            l = y;
            var m;
            1 !== repeat_info.max ? (v += 10,
                f += 10,
                m = {
                    type: "path",
                    class: `path:repeat:${regexJSONInfo.indices.join(';')}`,
                    path: ["M", u.x + 10, offset_y, "Q", offset_x, offset_y, offset_x, offset_y + x, "V", offset_y + v - x, "Q", offset_x, offset_y + v, offset_x + x, offset_y + v, "H", offset_x + y - x, "Q", offset_x + y, offset_y + v, offset_x + y, offset_y + v - x, "V", offset_y + x, "Q", offset_x + y, offset_y, u.x + u.width + 10, offset_y],
                    _translate: _translateFunc,
                    stroke: "maroon",
                    "stroke-width": 2
                },
                repeat_info.nonGreedy && (m.stroke = "Brown",
                    m["stroke-dasharray"] = "-"),
                c.push(m)) : o = !1;
            var b;
            if (0 === repeat_info.min) {
                var _ = offset_y - u.y + 10
                    , w = y + 20;
                d += 10,
                    g = -12,
                    l = w,
                    f += 10,
                    b = {
                        type: "path",
                        class: `path:repeat:${regexJSONInfo.indices.join(';')}`,
                        path: ["M", offset_x, offset_y, "Q", offset_x + x, offset_y, offset_x + x, offset_y - x, "V", offset_y - _ + x, "Q", offset_x + x, offset_y - _, offset_x + 20, offset_y - _, "H", offset_x + w - 20, "Q", offset_x + w - x, offset_y - _, offset_x + w - x, offset_y - _ + x, "V", offset_y - x, "Q", offset_x + w - x, offset_y, offset_x + w, offset_y],
                        _translate: _translateFunc,
                        stroke: repeat_info.nonGreedy ? "darkgreen" : "#333",
                        "stroke-width": 2
                    },
                    m && addsOffset([m], 10, 0),
                    c.push(b)
            }
            if (o) {
                var E = createTextItemElement(regexJSONInfo, offset_x + l / 2, offset_y, o);
                addsOffset([E.label], 0, v + E.height + 4),
                    c.push(E.label),
                    f += 4 + E.height;
                var C = (Math.max(E.width, l) - l) / 2;
                C && addsOffset(c, C, 0),
                    l = Math.max(E.width, l),
                    d += C
            }
            return addsOffset(u.items, d, 0),
                c = c.concat(u.items),
            {
                items: c,
                width: l,
                height: f,
                x: offset_x,
                y: u.y + g,
                lineInX: u.lineInX + d,
                lineOutX: u.lineOutX + d
            }
        },
        choice: function (regexJSONInfo, offset_x, offset_y) {
            if (checkRegexJSONInfo(regexJSONInfo))
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var n = 0
                , i = 0
                , a = regexJSONInfo.branches.map(function (regexBranch) {
                    var branchPath = processRegexJSONToRaphaelSVG(regexBranch, offset_x, offset_y);
                    return n += branchPath.height,
                        i = Math.max(i, branchPath.width),
                        branchPath
                });
            n += 6 * (a.length - 1) + 8,
                i += 40;
            var c = offset_x + i / 2
                , h = offset_y - n / 2 + 4
                , f = offset_x + i
                , d = [];
            return a.forEach(function (t) {
                var n = c - t.width / 2;
                addsOffset(t.items, n - t.x, h - t.y),
                    d = d.concat(t.items);
                var a = offset_y + h - t.y
                    , o = createChoicesPathItem(regexJSONInfo, offset_x, offset_y, offset_x + 20, a)
                    , p = createChoicesPathItem(regexJSONInfo, f, offset_y, offset_x + i - 20, a);
                d.push(o, p),
                    offset_x + 20 !== n - t.x + t.lineInX && d.push(createLinesPathItem(regexJSONInfo, offset_x + 20, a, n - t.x + t.lineInX)),
                    t.lineOutX + n - t.x != offset_x + i - 20 && d.push(createLinesPathItem(regexJSONInfo, t.lineOutX + n - t.x, a, offset_x + i - 20)),
                    t.x = n,
                    t.y = h,
                    h += t.height + 6
            }),
            {
                items: d,
                width: i,
                height: n,
                x: offset_x,
                y: offset_y - n / 2,
                lineInX: offset_x,
                lineOutX: f
            }
        },
        charset: function (regexJSONInfo, offset_x, offset_y) {
            var n = {
                d: "Digit",
                D: "NonDigit",
                w: "Word",
                W: "NonWord",
                s: "WhiteSpace",
                S: "NonWhiteSpace"
            }
                , i = regexJSONInfo.exclude ? "Pink" : "Khaki"
                , a = regexJSONInfo.exclude ? "#C00" : "";
            if (checkCharsetNotEmpty(regexJSONInfo)) {
                var o = createExactCharItem(regexJSONInfo, n[regexJSONInfo.classes[0]], offset_x, offset_y, "Green", "white");
                if (o.rect.r = 5,
                    regexJSONInfo.exclude) {
                    var u = createTextItemElement(regexJSONInfo, o.x + o.width / 2, o.y, "None of:", a)
                        , l = o.items;
                    l.push(u.label);
                    var f = o.width
                        , p = Math.max(u.width, o.width)
                        , d = (p - f) / 2;
                    return addsOffset(l, d, 0),
                    {
                        items: l,
                        width: p,
                        height: o.height + u.height,
                        x: Math.min(u.x, o.x),
                        y: u.y,
                        lineInX: d + o.x,
                        lineOutX: d + o.x + o.width
                    }
                }
                return o
            }
            if (!regexJSONInfo.chars && !regexJSONInfo.ranges.length && !regexJSONInfo.classes.length) {
                var o = createExactCharItem(regexJSONInfo, "AnyChar", offset_x, offset_y, "green", "white");
                return o.rect.r = 5,
                    o
            }
            var g, x, y = [], p = 0, m = 0;
            regexJSONInfo.chars && (g = createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "LightSkyBlue", "black"),
                g.rect.r = 5,
                y.push(g),
                p = g.width),
                regexJSONInfo.ranges.forEach(function (t) {
                    t = t.split("").join("-");
                    var n = createExactCharItem(regexJSONInfo, t, offset_x, offset_y, "teal", "white");
                    n.rect.r = 5,
                        y.push(n),
                        p = Math.max(n.width, p)
                }),
                regexJSONInfo.classes.forEach(function (t) {
                    var i = createExactCharItem(regexJSONInfo, n[t], offset_x, offset_y, "Green", "white");
                    i.rect.r = 5,
                        y.push(i),
                        p = Math.max(i.width, p)
                }),
                x = y[0].height;
            var b = []
                , _ = [];
            y.sort(function (t, e) {
                return e.width - t.width
            }),
                y.forEach(function (t) {
                    2 * t.width + 4 > p ? b.push(t) : _.push(t)
                }),
                y = b;
            for (var w, E; _.length;) {
                if (w = _.pop(),
                    !(E = _.pop())) {
                    y.push(w);
                    break
                }
                w.width - E.width > 2 ? (y.push(w),
                    _.push(E)) : (addsOffset(E.items, w.width + 4, 0),
                        y.push({
                            items: w.items.concat(E.items),
                            width: w.width + E.width + 4,
                            height: w.height,
                            x: w.x,
                            y: w.y
                        }),
                        m -= w.height)
            }
            p += 12, m = 4 * (y.length - 1) + y.length * x + 12;
            var C = {
                type: "rect",
                class: `rect:charsetgroup:${regexJSONInfo.indices.join(';')}`,
                x: offset_x,
                y: offset_y - m / 2,
                r: 4,
                width: p,
                height: m,
                stroke: "none",
                fill: i
            }
                , k = C.y + 6
                , l = [C];
            y.forEach(function (t) {
                addsOffset(t.items, offset_x - t.x + (p - t.width) / 2, k - t.y),
                    l = l.concat(t.items),
                    k += t.height + 4
            });
            let infoCharset = { type: "charsetgroup", indices: regexJSONInfo.indices };
            var u = createTextItemElement(infoCharset, C.x + C.width / 2, C.y, (regexJSONInfo.exclude ? "None" : "One") + " of:", a);
            l.push(u.label);
            var f = p;
            p = Math.max(u.width, p);
            var d = (p - f) / 2;
            return addsOffset(l, d, 0),
            {
                items: l,
                width: p,
                height: m + u.height,
                x: Math.min(u.x, offset_x),
                y: u.y,
                lineInX: d + offset_x,
                lineOutX: d + offset_x + C.width
            }
        },
        group: function (regexJSONInfo, offset_x, offset_y) {
            if (checkRegexJSONInfo(regexJSONInfo)) {
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            }
            // Puede que haya que quitar los offset, y agregarlos al grupo g
            var subgroups_items_element = processRegexJSONToRaphaelSVG(regexJSONInfo.sub, 0, 0);
            var container_group_item = createGroupContainerItem(
                regexJSONInfo, subgroups_items_element.items,
                0, 0,
                subgroups_items_element.width, subgroups_items_element.height
            )

            // Agrega un offset a la izquierda para mover todos los items a la derecha y que se centre el dashed group que lo engloba
            addsOffset([container_group_item], 10, 0);
            var group_decorator_width = subgroups_items_element.width + 20;
            var group_decorator_height = subgroups_items_element.height + 20;
            
            if (regexJSONInfo.num) {
                var groupinfo_rect_item = {
                    type: "rect",
                    id: regexJSONInfo.id,
                    indices: regexJSONInfo.indices,
                    class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: 0,
                    y: subgroups_items_element.y - 10,
                    r: 6,
                    width: group_decorator_width,
                    height: group_decorator_height,
                    "stroke-dasharray": ".",
                    stroke: "silver",
                    "stroke-width": 2
                };
                var groupinfo_text_item = createTextItemElement(
                    regexJSONInfo,
                    groupinfo_rect_item.width / 2, groupinfo_rect_item.y - 2,
                    `Group ${regexJSONInfo.name}#${regexJSONInfo.num}`
                );
            }
            else {
                var groupinfo_rect_item = {
                    type: "rect",
                    id: regexJSONInfo.id,
                    indices: regexJSONInfo.indices,
                    class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: 0,
                    y: subgroups_items_element.y - 10,
                    r: 6,
                    width: group_decorator_width,
                    height: group_decorator_height,
                    "stroke-dasharray": ".",
                    stroke: "silver",
                    "stroke-width": 2
                };
                var groupinfo_text_item = createTextItemElement(
                    regexJSONInfo,
                    groupinfo_rect_item.width / 2, groupinfo_rect_item.y - 2,
                    `Group Non-Capturing`
                );
            }

            var max_width = Math.max(groupinfo_text_item.width, group_decorator_width);
            var offset_x_width = (max_width - group_decorator_width) / 2;

            var container_item = createGroupContainerItem(
                regexJSONInfo, [container_group_item, groupinfo_rect_item, groupinfo_text_item.label],
                offset_x + offset_x_width, offset_y,
                max_width, group_decorator_height + groupinfo_text_item.height + 4
            );

            return {
                items: [container_item],
                width: container_item.width,
                height: container_item.height,
                x: container_item.x,
                y: container_item.y + groupinfo_text_item.y,
                lineInX: offset_x + offset_x_width + subgroups_items_element.lineInX + 10,
                lineOutX: offset_x + offset_x_width + subgroups_items_element.lineOutX + 10
            }
            // addsOffset([container_group_item], offset_x, offset_y);
            // return {
            //     items: [container_group_item],
            //     width: container_group_item.width,
            //     height: container_group_item.height,
            //     x: offset_x + subgroups_items_element.x,
            //     y: offset_y + subgroups_items_element.y,
            //     lineInX: offset_x + subgroups_items_element.lineInX,
            //     lineOutX: offset_x + subgroups_items_element.lineOutX
            // };
        },
        assert: function (regexJSONInfo, offsetX, offsetY) {
            var n;
            var i = {
                AssertNonWordBoundary: {
                    bg: "maroon",
                    fg: "white"
                },
                AssertWordBoundary: {
                    bg: "purple",
                    fg: "white"
                },
                AssertEnd: {
                    bg: "Indigo",
                    fg: "white"
                },
                AssertBegin: {
                    bg: "Indigo",
                    fg: "white"
                }
            };
            var assertion_type = regexJSONInfo.assertionType;
            var raw_text = assertion_type.replace("Assert", "") + "!";
            if (n = i[assertion_type]) {
                return !HAS_FLAG_MULTILINE || "AssertBegin" !== assertion_type && "AssertEnd" !== assertion_type || (raw_text = "Line" + raw_text),
                    createExactCharItem(regexJSONInfo, raw_text, offsetX, offsetY, n.bg, n.fg);
            }
            var stroke_color, background_color;
            if (assertion_type === AssertLookahead) {
                stroke_color = "CornflowerBlue";
                background_color = "darkgreen";
                raw_text = "Followed by:";
            } else if (assertion_type === AssertNegativeLookahead) {
                stroke_color = "#F63";
                background_color = "Purple";
                raw_text = "Not followed by:";
            }
            // assertion_type === AssertLookahead ? (
            //     stroke_color = "CornflowerBlue",
            //     background_color = "darkgreen",
            //     raw_text = "Followed by:"
            //     ) : assertion_type === AssertNegativeLookahead && (
            //         stroke_color = "#F63",
            //         background_color = "Purple",
            //         raw_text = "Not followed by:");
            var group_items_result = generator_Raph_map.group(regexJSONInfo, offsetX, offsetY)
            var rect_item_height = group_items_result.height + 16;
            var rect_item_width = group_items_result.width + 16;

            var rect_item = {
                type: "rect",
                class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                x: offsetX,
                y: group_items_result.y - 8,
                r: 6,
                width: rect_item_width,
                height: rect_item_height,
                "stroke-dasharray": "-",
                stroke: stroke_color,
                "stroke-width": 2
            };
            var text_item = createTextItemElement(regexJSONInfo, rect_item.x + rect_item_width / 2, rect_item.y, raw_text, background_color);
            var max_width_items = Math.max(rect_item_width, text_item.width);
            var y = (max_width_items - rect_item_width) / 2;

            return addsOffset(group_items_result.items, y + 8, 0),
                y && addsOffset([rect_item, text_item.label], y, 0),
            {
                items: group_items_result.items.concat([rect_item, text_item.label]),
                width: max_width_items,
                height: rect_item.height + text_item.height,
                x: offsetX,
                y: text_item.y,
                lineInX: y + group_items_result.lineInX + 8,
                lineOutX: y + group_items_result.lineOutX + 8
            }
        }
    };
    var colors_map = {
        startRegex: "#03a9f4",
        endRegex: "#ff0058",
        delimiter: "Indigo",
        flags: "darkgreen",
        exact: "#334",
        dot: "darkblue",
        backref: "teal",
        $: "purple",
        "^": "purple",
        "\\b": "#F30",
        "\\B": "#F30",
        "(": "blue",
        ")": "blue",
        "?=": "darkgreen",
        "?!": "red",
        "?:": "grey",
        "[": "navy",
        "]": "navy",
        "|": "blue",
        "{": "maroon",
        ",": "maroon",
        "}": "maroon",
        "*": "maroon",
        "+": "maroon",
        "?": "maroon",
        repeatNonGreedy: "#F61",
        defaults: "black",
        charsetRange: "olive",
        charsetClass: "navy",
        charsetExclude: "red",
        charsetChars: "#534"
    };


    $progress_bar.updateProgressBar(0);

    return paintRegexCallbacks(regexson_tree, regex_flags, canvas_Raphael_paper);
}