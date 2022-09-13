(function () {
    "use strict";
    Raphael.fn.group = function (f, g) {
        if (Raphael.svg == true) {
            this.svg = "http://www.w3.org/2000/svg";
            this.dv = document.getElementById(f);
            this.defs = this.dv.getElementsByTagName("defs")[0];
            var defs = this.defs;
            var svgHead = this.svg;
            this.svgcanv = this.dv.getElementsByTagName("svg")[0];
            this.svgcanv.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            var countGroups = this.svgcanv.getElementsByTagName("g").length;
            var createUUID = function (b, a) {
                return function () {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(b, a).toUpperCase()
                }
            }(/[xy]/g, function (b) {
                var a = 16 * Math.random() | 0;
                return ("x" == b ? a : a & 3 | 8).toString(16)
            });

            this.group.attrs = {};
            if (countGroups == 0) {
                this.masterGroup = document.createElementNS(this.svg, "g");
                this.svgcanv.appendChild(this.masterGroup)
            } else {
                this.masterGroup = this.svgcanv.getElementsByTagName("g")[0]
            }
            this.group = document.createElementNS(this.svg, "g");
            for (i = 0; i < g.length; i++) {
                this.group.appendChild(g[i].node)
            }
            this.masterGroup.appendChild(this.group);
            this.group.set = [];
            var _mg = this.masterGroup;
            this.group.getMaster = function () {
                return _mg
            };
            this.group.remove = function () {
                this.parentNode.removeChild(this)
            };
            var thisTransform = { translate: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, rotate: { x: 0, y: 0, z: 0 } };
            var transformString = function () {
                return "translate(" + thisTransform.translate.x + "," + thisTransform.translate.y + ") scale(" + thisTransform.scale.x + "," + thisTransform.scale.y + ") rotate(" + thisTransform.rotate.x + "," + thisTransform.rotate.y + "," + thisTransform.rotate.z + ")"
            };
            this.group.translate = function (c, a) {
                thisTransform.translate.x = c;
                thisTransform.translate.y = a;
                this.setAttribute("transform", transformString())
            };
            this.group.rotate = function (c, a, e) {
                thisTransform.rotate.x = c;
                thisTransform.rotate.y = a;
                thisTransform.rotate.z = e;
                this.setAttribute("transform", transformString())
            };
            this.group.scale = function (c, a) {
                thisTransform.scale.x = c;
                thisTransform.scale.y = a;
                this.setAttribute("transform", transformString())
            };
            this.group.push = function () {
                for (i = 0; i < arguments.length; i++) {
                    this.appendChild(arguments[i].node)
                }
            };
            this.group.addElement = function () {
                for (i = 0; i < arguments.length; i++) {
                    this.appendChild(arguments[i])
                }
            };
            this.group.getAttr = function (c) {
                return thisTransform[c]
            };
            this.group.copy = function (el) {
                this.copy = el.node.cloneNode(true);
                this.appendChild(this.copy)
            };
            this.group.toFront = function () {
                this.getMaster().appendChild(this);
            };
            this.group.clipPath = function (c) {
                var cp = document.createElementNS(svgHead, "clipPath");
                var cpID = createUUID();
                cp.setAttribute("id", cpID);
                cp.appendChild(c.node);
                defs.appendChild(cp);
                this.setAttribute("clip-path", "url(#" + cpID + ")")
            };

            this.group.animate = function () {
                var el = this;
                var args = arguments;
                var attrToAnimate = args[0];
                var duration = args[1];
                var callback = args[2];
                var timerx;
                if (typeof (timerx) !== 'undefined') {
                    clearInterval(timerx);
                }
                var newPosx = attrToAnimate['x'];
                var original = el.getAttr('translate').x;
                var stepLen;
                timerx = setInterval(function () { if (original > newPosx) { stepLen = (original - newPosx) / 10; moveLeft() } else { stepLen = (newPosx - original) / 10; moveRight() } }, 10);
                var currpos = original;
                function moveLeft() {
                    if (el.getAttr('translate').x - stepLen > newPosx) {
                        el.translate(el.getAttr('translate').x - stepLen, 0);
                    } else {
                        el.translate(newPosx, 0);
                        clearInterval(timerx);
                        callback()
                    }
                };
                function moveRight() {
                    if (el.getAttr('translate').x + stepLen < newPosx) {
                        el.translate(el.getAttr('translate').x + stepLen, 0);
                    } else {
                        el.translate(newPosx, 0);
                        clearInterval(timerx);
                        callback()
                    }
                }
            };

            this.group.attr = function (name, value) {
                // if (this.removed) {
                //     return this;
                // }
                // if (name == null) {
                //     var res = {};
                //     for (var a in this.attrs) if (this.attrs[has](a)) {
                //         res[a] = this.attrs[a];
                //     }
                //     res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                //     res.transform = this._.transform;
                //     return res;
                // }
                // if (value == null && (typeof name === "string")) {
                //     if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                //         return this.attrs.gradient;
                //     }
                //     var names = name.split(separator), out = {};
                //     for (var i = 0, ii = names.length; i < ii; i++) {
                //         name = names[i];
                //         if (name in this.attrs) {
                //             out[name] = this.attrs[name];
                //         } else if (R.is(this.paper.customAttributes[name], "function")) {
                //             out[name] = this.paper.customAttributes[name].def;
                //         } else {
                //             out[name] = R._availableAttrs[name];
                //         }
                //     }
                //     return ii - 1 ? out : out[names[0]];
                // }
                if (this.attrs && value == null && typeof name === "array") {
                    out = {};
                    for (i = 0, ii = name.length; i < ii; i++) {
                        out[name[i]] = this.attr(name[i]);
                    }
                    return out;
                }

                var params;
                if (value != null) {
                    params = {};
                    params[name] = value;
                }
                value == null && typeof name === "object" && (params = name);
                // for (var key in params) {
                //     eve("raphael.attr." + key + "." + this.id, this, params[key]);
                // }
                if (params) {
                    // for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                    // for (key in this.paper.customAttributes)
                    //     var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
                    //     this.attrs[key] = params[key];
                    //     for (var subkey in par) if (par[has](subkey)) {
                    //         params[subkey] = par[subkey];
                    //     }
                    // }
                    for (var key in params) {
                        this.group.attrs[key] = params[key];
                        this.group.setAttribute(key, params[key]);
                        // setFillAndStroke(this, params);
                    }
                }
                return this.group;
            }
            return this.group
        }
    };
})();

// R.fn = paperproto = Paper.prototype = R.prototype;
// R.el = elproto
(function () {
    Raphael.fn.group = function (childs) {
        if (Raphael.svg == true) {
            var defs = this.defs;
            var svgHead = this.svg;
            // var countGroups = this.svgcanv.getElementsByTagName("g").length;
            var createUUID = function (b, a) {
                return function () {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(b, a).toUpperCase()
                }
            }(/[xy]/g, function (b) {
                var a = 16 * Math.random() | 0;
                return ("x" == b ? a : a & 3 | 8).toString(16)
            });

            this.group.attrs = {};
            // Si no hay grupos
            // if(countGroups == 0) {
            // 	this.masterGroup = document.createElementNS(this.svg, "g");
            // 	this.svgcanv.appendChild(this.masterGroup)
            // // Si hay otros grupos
            // } else {
            // 	this.masterGroup = this.svgcanv.getElementsByTagName("g")[0]
            // }
            this.group = document.createElementNS(this.svg, "g");
            for (i = 0; i < childs.length; i++) {
                this.group.appendChild(childs[i].node)
            }
            this.masterGroup.appendChild(this.group);
            this.group.set = [];
            var _mg = this.masterGroup;
            this.group.getMaster = function () {
                return _mg
            };
            this.group.remove = function () {
                this.parentNode.removeChild(this)
            };
            var thisTransform = { translate: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, rotate: { x: 0, y: 0, z: 0 } };
            var transformString = function () {
                return "translate(" + thisTransform.translate.x + "," + thisTransform.translate.y + ") scale(" + thisTransform.scale.x + "," + thisTransform.scale.y + ") rotate(" + thisTransform.rotate.x + "," + thisTransform.rotate.y + "," + thisTransform.rotate.z + ")"
            };
            this.group.translate = function (c, a) {
                thisTransform.translate.x = c;
                thisTransform.translate.y = a;
                this.setAttribute("transform", transformString())
            };
            this.group.rotate = function (c, a, e) {
                thisTransform.rotate.x = c;
                thisTransform.rotate.y = a;
                thisTransform.rotate.z = e;
                this.setAttribute("transform", transformString())
            };
            this.group.scale = function (c, a) {
                thisTransform.scale.x = c;
                thisTransform.scale.y = a;
                this.setAttribute("transform", transformString())
            };
            this.group.push = function () {
                for (i = 0; i < arguments.length; i++) {
                    this.appendChild(arguments[i].node)
                }
            };
            this.group.addElement = function () {
                for (i = 0; i < arguments.length; i++) {
                    this.appendChild(arguments[i])
                }
            };
            this.group.getAttr = function (c) {
                return thisTransform[c]
            };
            this.group.copy = function (el) {
                this.copy = el.node.cloneNode(true);
                this.appendChild(this.copy)
            };
            this.group.toFront = function () {
                this.getMaster().appendChild(this);
            };
            this.group.clipPath = function (c) {
                var cp = document.createElementNS(svgHead, "clipPath");
                var cpID = createUUID();
                cp.setAttribute("id", cpID);
                cp.appendChild(c.node);
                defs.appendChild(cp);
                this.setAttribute("clip-path", "url(#" + cpID + ")")
            };
            this.group.animate = function () {
                var el = this;
                var args = arguments;
                var attrToAnimate = args[0];
                var duration = args[1];
                var callback = args[2];
                var timerx;
                if (typeof (timerx) !== 'undefined') {
                    clearInterval(timerx);
                }
                var newPosx = attrToAnimate['x'];
                var original = el.getAttr('translate').x;
                var stepLen;
                timerx = setInterval(function () { if (original > newPosx) { stepLen = (original - newPosx) / 10; moveLeft() } else { stepLen = (newPosx - original) / 10; moveRight() } }, 10);
                var currpos = original;
                function moveLeft() {
                    if (el.getAttr('translate').x - stepLen > newPosx) {
                        el.translate(el.getAttr('translate').x - stepLen, 0);
                    } else {
                        el.translate(newPosx, 0);
                        clearInterval(timerx);
                        callback()
                    }
                };
                function moveRight() {
                    if (el.getAttr('translate').x + stepLen < newPosx) {
                        el.translate(el.getAttr('translate').x + stepLen, 0);
                    } else {
                        el.translate(newPosx, 0);
                        clearInterval(timerx);
                        callback()
                    }
                }
            };
            this.group.attr = function (name, value) {
                // if (this.removed) {
                //     return this;
                // }
                // if (name == null) {
                //     var res = {};
                //     for (var a in this.attrs) if (this.attrs[has](a)) {
                //         res[a] = this.attrs[a];
                //     }
                //     res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                //     res.transform = this._.transform;
                //     return res;
                // }
                // if (value == null && (typeof name === "string")) {
                //     if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                //         return this.attrs.gradient;
                //     }
                //     var names = name.split(separator), out = {};
                //     for (var i = 0, ii = names.length; i < ii; i++) {
                //         name = names[i];
                //         if (name in this.attrs) {
                //             out[name] = this.attrs[name];
                //         } else if (R.is(this.paper.customAttributes[name], "function")) {
                //             out[name] = this.paper.customAttributes[name].def;
                //         } else {
                //             out[name] = R._availableAttrs[name];
                //         }
                //     }
                //     return ii - 1 ? out : out[names[0]];
                // }
                if (this.attrs && value == null && typeof name === "array") {
                    out = {};
                    for (i = 0, ii = name.length; i < ii; i++) {
                        out[name[i]] = this.attr(name[i]);
                    }
                    return out;
                }

                var params;
                if (value != null) {
                    params = {};
                    params[name] = value;
                }
                value == null && typeof name === "object" && (params = name);
                // for (var key in params) {
                //     eve("raphael.attr." + key + "." + this.id, this, params[key]);
                // }
                if (params) {
                    // for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                    // for (key in this.paper.customAttributes)
                    //     var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
                    //     this.attrs[key] = params[key];
                    //     for (var subkey in par) if (par[has](subkey)) {
                    //         params[subkey] = par[subkey];
                    //     }
                    // }
                    for (var key in params) {
                        this.group.attrs[key] = params[key];
                        this.group.setAttribute(key, params[key]);
                        // setFillAndStroke(this, params);
                    }
                }
                return this.group;
            }
            return this.group
        }
    };

    Raphael._availableAttrs = { ...Raphael._availableAttrs, id: "" }

    // Funcion que crea los elementos dentro del svg con un namespace (En Raphael es $)
    var getEl = function (el, attr) {
        var has = "hasOwnProperty";
        if (attr) {
            if (typeof el == "string") {
                el = getEl(el);
            }
            for (var key in attr) if (attr[has](key)) {
                if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS(xlink, key.substring(6), String(attr[key]));
                } else {
                    el.setAttribute(key, String(attr[key]));
                }
            }
        } else {
            el = Raphael._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
            el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        }
        return el;
    };


    // Element: elproto -> Raphael._engine.group
    Raphael._engine.group = function (svg, id, x, y, w, h) {
        var el = getEl("g");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Raphael.el.constructor(el, svg);
        if (id) {
            res.attrs = { id: id };
        }
        res.attrs = { ...res.attrs, x: x, y: y, width: w, height: h, fill: "none", stroke: "none" };
        res.type = "group";
        getEl(el, res.attrs);
        return res;
    };

    Raphael.fn.group = function (childs, x, y, w, h) {
        var out = Raphael._engine.group(this, x || 0, y || 0, w || 0, h || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };

    // Paper: paperproto -> Raphael.fn.group
    // paperproto.group = function (x, y, w, h, r) {
    //     var out = R._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    //     this.__set__ && this.__set__.push(out);
    //     return out;
    // };
    // normal
    // R._engine.rect = function (vml, x, y, w, h, r) {
    //     var path = R._rectPath(x, y, w, h, r),
    //         res = vml.path(path),
    //         a = res.attrs;
    //     res.X = a.x = x;
    //     res.Y = a.y = y;
    //     res.W = a.width = w;
    //     res.H = a.height = h;
    //     a.r = r;
    //     a.path = path;
    //     res.type = "rect";
    //     return res;
    // };

    Raphael.fn.addv2 = function (raphael_items) {
        var elements = { circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1, group: 1 };
        var has = "hasOwnProperty";
        function appendChildrenToNode(node, children) {
            const documentFragment = document.createDocumentFragment();
            children.forEach(child => {
                var child_el = child[0];
                if (Array.isArray(child_el)) {
                    child_el.forEach(child_el => documentFragment.appendChild(child_el))
                } else {
                    documentFragment.appendChild(child_el);
                }
            });
            node.appendChild(documentFragment);
        }
        function auxAddWithGroup(paperproto, _raphael_items) {
            var res = paperproto.set();
            var children;
            if (_raphael_items !== undefined) {
                var j, i = 0, ii = _raphael_items.length;
                for (; i < ii; i++) {
                    j = _raphael_items[i] || {};
                    var g;
                    if (j.type === "group") {
                        // Agregar el id y clase y ocultar
                        var res, children = auxAddWithGroup(paperproto, j.children);
                        // Eliminar j.children para limpiar los atributos
                        let _g_dataset;
                        if (j[has]("dataset")) {
                            _g_dataset = j.dataset;
                            delete j.dataset;
                        }
                        g = paperproto[j.type](children).attr(j);
                       
                        if (_g_dataset !== undefined) {
                            for (let attr of Object.keys(_g_dataset)) {
                                g.node.setAttribute(`data-${attr}`, _g_dataset[attr])
                            }
                        }

                        if (children !== undefined) {
                            appendChildrenToNode(g[0], children.items);
                        }
                        children = res.push(g);
                    } else {
                        if(elements[has](j.type)) {
                            let child = paperproto[j.type]().attr(j);
                            // child.node.id = j.id || "";
                            var children = res.push(child);
                        }
                    }

                }
            }
            return res, children;
        }

        if (Raphael.is(raphael_items, "array")) {
            var res, children = auxAddWithGroup(this, raphael_items);
        }
        return res;
    };
})();
//Ejemplo
// var demo = {};
// demo.r = null; // Raphael JS container
// demo.g = null; // Our SVG group
// demo.info = null;
// demo.infoContent = {
//     remove: 'Group removed from Raphael JS canvas',
//     translate: 'Group translated',
//     rotate: 'Group rotated',
//     scale: 'Group scaled',
//     push: 'Elements added to the group',
//     getAttr: '',
//     toFront: 'Group placed on top of all SVG elements',
//     clipPath: 'Created a clip path in the shape of a circle. Content outside of the circle is not visible.',
//     animate: 'Animates horizontal position. Optional callback on animation end'
// };
// demo.randomElements = function(){
//     var arrayOfElements = [];
//     for(i=0;i<5;i++){
//         var randomX = Math.random()*640,
//             randomY = Math.random()*280;
//         arrayOfElements.push(demo.r.text(randomX,randomY,'Text '+ i + '').attr({fill:'#f00','font-size':18}));
//     }
//     return arrayOfElements
// }
// var init = function(){
//     demo.r = Raphael('container',640,280);
//     demo.info = document.getElementById('info');
// };
// if(window.attachEvent){
//     window.attachEvent('onload', function load(event){
//         window.detachEvent('load', load);
//         init()
//     })
// }else{
//     window.addEventListener('load', function load(event){
//         window.removeEventListener("load", load, false);
//         init()
//     },false);
// }


// /* Available methods
//  * group.remove
//  * group.translate
//  * group.rotate
//  * group.scale
//  * group.push
//  * group.getAttr
//  * group.toFront
//  * group.clipPath
//  * group.animate
//  */

// demo.group = function(){
//     demo.r.clear();
//     var randomElements = [];
//     for(i=0;i<10;i++){
//         var randomX = 100+Math.random()*540,
//             randomY = 80+Math.random()*200,
//             randomRadius = Math.random()*15+5;
//         randomElements.push(demo.r.circle(randomX,randomY,randomRadius).attr({fill:'#a30000',stroke:'none'}));
//     }
//     demo.g = new demo.r.group('container',randomElements);
//     demo.info.innerHTML = 'Group created';
//     demo.info.style.display = 'block';
// };

// demo.remove = function(){
//     if(null==demo.g)return!1; // return false if the group doesn't exist

//     demo.g.remove();
//     demo.g = null;
//     demo.info.innerHTML = demo.infoContent['remove'];
// };

// demo.translate = function(){
//     if(null==demo.g)return!1;

//     demo.g.translate(50,75); // translate x,y
//     demo.info.innerHTML = demo.infoContent['translate'];
// };

// demo.rotate = function(){
//     if(null==demo.g)return!1;

//     demo.g.rotate(10,15,45); // rotate x,y,z
//     demo.info.innerHTML = demo.infoContent['rotate'];
// };

// demo.scale = function(){
//     if(null==demo.g)return!1;

//     demo.g.scale(.3,1.2); // scale x,y
//     demo.info.innerHTML = demo.infoContent['scale'];
// };

// demo.push = function(){
//     if(null==demo.g)return!1;

//     var randomElements = demo.randomElements();
//     demo.g.push(randomElements[0],randomElements[3]);
//     demo.info.innerHTML = demo.infoContent['push'];
// };

// demo.getAttr = function(){
//     if(null==demo.g)return!1;

//     demo.info.innerHTML = '<p>Element attributes:</p>'
//     demo.info.innerHTML += '<p>'+JSON.stringify(demo.g.getAttr('translate'))+'</p>';
//     demo.info.innerHTML += '<p>'+JSON.stringify(demo.g.getAttr('rotate'))+'</p>';
//     demo.info.innerHTML += '<p>'+JSON.stringify(demo.g.getAttr('scale'))+'</p>';
// };

// demo.toFront = function(){
//     if(null==demo.g)return!1;

//     demo.g.toFront();
//     demo.info.innerHTML = demo.infoContent['toFront'];
// };

// demo.clipPath = function(){
//     if(null==demo.g)return!1;

//     demo.g.clipPath(demo.r.circle(225,125,100));
//     demo.info.innerHTML = demo.infoContent['clipPath'];
// };

// demo.animate = function(){
//     if(null==demo.g)return!1;

//     demo.g.animate({x:60,y:120},1000,function(){
//         demo.info.innerHTML = demo.infoContent['animate'];
//     });
// };