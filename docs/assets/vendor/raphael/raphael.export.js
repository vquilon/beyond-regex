

 (function(R) {
	function escapeXML(s) {
		if ( typeof s === 'number' ) return s.toString();

		var replace = { '<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos' };

		for ( var entity in replace ) {
			s = s.replace(new RegExp(entity, 'g'), '&' + replace[entity] + ';');
		}

		return s;
	}
	function map(iterable, callback) {
		var mapped = [],
			undef = 'undefined',
			i;
		if( typeof iterable.unshift != 'undefined'){
			var l = iterable.length;
			for ( i = 0; i < l; i++ ) {
				if( typeof iterable[i] != undef ){
					var value = callback.call(this, iterable[i], i);
					if( value !== null ) mapped.push(value);
				}
			}
		} else {
			for ( i in iterable ) {
				if ( iterable.hasOwnProperty(i) ) {
					var value = callback.call(this, iterable[i], i);
					if ( value !== null ) mapped.push(value);
				}
			}
		}

		return mapped;
	}
	function reduce(iterable, callback, initial) {
		for ( var i in iterable ) {
			if ( iterable.hasOwnProperty(i) ) {
				initial = callback.call(this, initial, iterable[i], i);
			}
		}

		return initial;
	}
	function tag(name, attrs, matrix, content) {
		if ( typeof content === 'undefined' || content === null ) {
			content = '';
		}

		if ( typeof attrs === 'object' ) {
			attrs = map(attrs, function(element, name) {
				switch ( name ) {
					case 'transform':
						return;

					case 'fill':
						if ( element.match(/^hsb/) ) {
							var hsb = element.replace(/^hsb\(|\)$/g, '').split(',');

							if ( hsb.length === 3 ) {
								element = R.hsb2rgb(hsb[0], hsb[1], hsb[2]).toString();
							}
						}
				}

				return name + '="' + escapeXML(element) + '"';
			}).join(' ');
		}

		return '<' + name + ( matrix ? ' transform="matrix(' + matrix.toString().replace(/^matrix\(|\)$/g, '') + ')" ' : ' ' ) + attrs + '>' +  content + '</' + name + '>';
	}
	function extractStyle(node) {
		return {
			font: {
				family: typeof node.attrs.font === 'undefined' ? null : node.attrs.font.replace(/^.?"(\w+)".$/, '$1'),				
				size:   typeof node.attrs['font-size'] === 'undefined' ? null : parseInt( node.attrs['font-size'] ),
				style: typeof node.attrs['font-style'] === 'undefined' ? null : node.attrs['font-style'],
				weight: typeof node.attrs['font-weight'] === 'undefined' ? null : node.attrs['font-weight']
			},
			anchor: typeof node.attrs['text-anchor'] === 'undefined' ? null : node.attrs['text-anchor']
		};
	}
	function styleToString(style) {
		var norm = 'normal',
			textAnchor = 'text-anchor: ' + ( style.anchor || 'middle' ) + '; ',
			font = style.font;
		return textAnchor + [ 'font:',
		         (font.style || norm), 
		         norm, 
		         (font.weight || norm), 
		         (font.size ? font.size + 'px' : '10px') + '/normal', 
		         font.family ].join(' ');
	}
	function convertToHexColor(value) {
		
		if(/^[0-9A-F]{6}$/i.test(value)){
			value = '#' + value;
		}
		
		return value;
	}
	function computeTSpanDy(fontSize, line, lines) {
		if ( fontSize === null ) fontSize = 10;
		return fontSize * 4.5 / 13 * ( line - .2 - lines / 2 ) * 3.5;
	}

	var serializer = {
		'text': function(node) {
			var style = extractStyle(node),
				tags = new Array,
				textLines = node.attrs['text'].toString().split('\n'),
				totalLines = textLines.length;
			
			map(textLines, function(text, line) {
				var attrs = reduce(
					node.attrs,
					function(initial, value, name) {
						if ( name !== 'text' && name !== 'w' && name !== 'h' ) {
							if ( name === 'font-size') value = parseInt(value) + 'px';

							if( name === 'stroke'){
								value = convertToHexColor(value);
							}
							
							initial[name] = escapeXML(value.toString());
						}

						return initial;
					},
					{ style: styleToString(style) + ';' }
				);
				if (node.node.className.baseVal != "" && node.node.className.baseVal !== undefined) {
					attrs["class"] = node.node.className.baseVal;
				}
				
                		tags.push(tag(
					'text',
					attrs,
					node.matrix,
					tag('tspan', { dy: computeTSpanDy(style.font.size, line + 1, totalLines) }, null, text.replace(/&/g, "&amp;"))
				));
			});

			return tags;
		},
		'path' : function(node) {
			var initial = ( node.matrix.a === 1 && node.matrix.d === 1 ) ? {} : { 'transform' : node.matrix.toString() };

			return tag(
				'path',
				reduce(
					node.attrs,
					function(initial, value, name) {
						if ( name === 'path' ) name = 'd';
						
						if( name === 'stroke'){
							value = convertToHexColor(value);
						}
						
						initial[name] = value.toString();

						return initial;
					},
					{}
				),
				node.matrix
				);
		}
	};

	R.fn.toSVG = function() {
		var
			paper   = this,
			restore = { svg: R.svg, vml: R.vml },
			svg     = '<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + paper.width + '" version="1.1" height="' + paper.height + '">'
			;

		R.svg = true;
		R.vml = false;

		for ( var node = paper.bottom; node != null; node = node.next ) {
			if ( node.node.style.display === 'none' ) continue;

			var attrs = '';
			if ( typeof serializer[node.type] === 'function' ) {
				svg += serializer[node.type](node);

				continue;
			}

			switch ( node.type ) {
				case 'image':
					attrs += ' preserveAspectRatio="none"';
					break;
			}

			for ( i in node.attrs ) {
				var name = i;
				var value = '';

				switch ( i ) {
					case 'r':
						if (node.type != "rect") {
							break;
						}
						value = node.attrs.r;
						node.attrs.rx = value;
						node.attrs.ry = value;
						continue;
					
					case 'src':
						name = 'xlink:href';

						break;
					case 'transform':
						name = '';

						break;

					case 'fill':
						if(node.attrs.gradient)
							continue;
						break;
					case 'gradient':
						var id = node.id;
						var gradient = node.attrs.gradient;
						var fx = 0.5, fy=0.5;
						gradient = String(gradient).replace(R._radial_gradient, function (all, _fx, _fy) {
			                type = "radial";
			                if (_fx && _fy) {
			                    fx = parseFloat(_fx);
			                    fy = parseFloat(_fy);
			                    var dir = ((fy > .5) * 2 - 1);
			                    Math.pow(fx - .5, 2) + Math.pow(fy - .5, 2) > .25 &&
			                        (fy = Math.sqrt(.25 - Math.pow(fx - .5, 2)) * dir + .5) &&
			                        fy != .5 &&
			                        (fy = fy.toFixed(5) - 1e-5 * dir);
			                }
			                return '';
			            });
						gradient = gradient.split(/\s*\-\s*/);
						if(node.attrs.gradient.match(/^r/g)){
							var dots = R._parseDots(gradient);
							if (!dots) {
				                continue;
				            }	
							svg += '<defs>';
							svg += '	    <radialGradient id="radialgradient'+id+'" fx="'+fx+'" fy="'+fy+'" >';

							for(var di = 0; di < dots.length; di++){
								var offset = (di/(dots.length-1) * 100)+'%';
								if(dots[di].offset)							
									offset = dots[di].offset;
								svg +=  '<stop stop-color="'+dots[di].color+'" offset="'+offset+'"/>';
							}
							svg += '    </radialGradient>';
							svg += '</defs>';

							name = 'fill';
							value = 'url(#radialgradient'+id+')';

						}else{
							var angle = gradient.shift();
							angle = parseFloat(angle)*-1;
			                if (isNaN(angle)) {
			                   continue; 
			                }
							var dots = R._parseDots(gradient);
							if (!dots) {
				                continue;
				            }
				            var vector = [0, 0, Math.cos(R.rad(angle)), Math.sin(R.rad(angle))],
			                       max = 1 / (Math.max(Math.abs(vector[2]), Math.abs(vector[3])) || 1);
			                vector[2] *= max;
			                vector[3] *= max;
			                if (vector[2] < 0) {
			                    vector[0] = -vector[2];
			                    vector[2] = 0;
			                }
			                if (vector[3] < 0) {
			                    vector[1] = -vector[3];
			                    vector[3] = 0;
			                }

				            svg += '<defs>';
							svg += '	    <linearGradient id="lineargradient'+id+'" x1="'+vector[0]+'" y1="'+vector[1]+'" x2="'+vector[2]+'" y2="'+vector[3]+'">';

							for(var di = 0; di < dots.length; di++){
								var offset = (di/(dots.length-1) * 100)+'%';
								if(dots[di].offset)							
									offset = dots[di].offset;
								svg +=  '<stop stop-color="'+dots[di].color+'" offset="'+offset+'"/>';
							}
							svg += '    </linearGradient>';
							svg += '</defs>';

							name = 'fill';
							value = 'url(#lineargradient'+id+')';

						}
						break;
					case 'stroke':
						if(value){
							value = convertToHexColor(value);
						}else{
							value = convertToHexColor(node.attrs[i].toString());
						}
						break;
				}

				if ( name ) {
					if(value)
						attrs += ' ' + name + '="' + escapeXML(value) + '"';
					else
						attrs += ' ' + name + '="' + escapeXML(node.attrs[i].toString()) + '"';
				}
			}
			if (node.node.className.baseVal != "") {
				attrs += ' ' + 'class="' + node.node.className.baseVal + '"';
			}

			svg += '<' + node.type + ' transform="matrix(' + node.matrix.toString().replace(/^matrix\(|\)$/g, '') + ')"' + attrs + '></' + node.type + '>';
		}

		svg += '</svg>';

		R.svg = restore.svg;
		R.vml = restore.vml;

		return svg;
	};
})(window.Raphael);