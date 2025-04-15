(function (a, b) {
	typeof define == "function" && define.amd
		? define(["jquery", "lodash", "backbone"], b)
		: (a.navigationPane = b(a.jQuery || a.Zepto || a.ender, a._, a.Backbone));
})(this, function (a, b, c) {
	var d, e, f;
	return (
		(function (a) {
			function l(a, b) {
				var c = b && b.split("/"),
					d = g.map,
					e = (d && d["*"]) || {},
					f,
					h,
					i,
					j,
					k,
					l,
					m;
				if (a && a.charAt(0) === "." && b) {
					(c = c.slice(0, c.length - 1)), (a = c.concat(a.split("/")));
					for (k = 0; (m = a[k]); k++)
						if (m === ".") a.splice(k, 1), (k -= 1);
						else if (m === "..") {
							if (k === 1 && (a[2] === ".." || a[0] === "..")) return !0;
							k > 0 && (a.splice(k - 1, 2), (k -= 2));
						}
					a = a.join("/");
				}
				if ((c || e) && d) {
					f = a.split("/");
					for (k = f.length; k > 0; k -= 1) {
						h = f.slice(0, k).join("/");
						if (c)
							for (l = c.length; l > 0; l -= 1) {
								i = d[c.slice(0, l).join("/")];
								if (i) {
									i = i[h];
									if (i) {
										j = i;
										break;
									}
								}
							}
						j = j || e[h];
						if (j) {
							f.splice(0, k, j), (a = f.join("/"));
							break;
						}
					}
				}
				return a;
			}
			function m(b, c) {
				return function () {
					return k.apply(a, i.call(arguments, 0).concat([b, c]));
				};
			}
			function n(a) {
				return function (b) {
					return l(b, a);
				};
			}
			function o(a) {
				return function (c) {
					b[a] = c;
				};
			}
			function p(d) {
				if (c.hasOwnProperty(d)) {
					var e = c[d];
					delete c[d], (h[d] = !0), j.apply(a, e);
				}
				if (!b.hasOwnProperty(d)) throw new Error("No " + d);
				return b[d];
			}
			function q(a, b) {
				var c,
					d,
					e = a.indexOf("!");
				return (
					e !== -1
						? ((c = l(a.slice(0, e), b)),
						  (a = a.slice(e + 1)),
						  (d = p(c)),
						  d && d.normalize ? (a = d.normalize(a, n(b))) : (a = l(a, b)))
						: (a = l(a, b)),
					{ f: c ? c + "!" + a : a, n: a, p: d }
				);
			}
			function r(a) {
				return function () {
					return (g && g.config && g.config[a]) || {};
				};
			}
			var b = {},
				c = {},
				g = {},
				h = {},
				i = [].slice,
				j,
				k;
			(j = function (d, e, f, g) {
				var i = [],
					j,
					k,
					l,
					n,
					s,
					t;
				g = g || d;
				if (typeof f == "function") {
					e = !e.length && f.length ? ["require", "exports", "module"] : e;
					for (t = 0; t < e.length; t++) {
						(s = q(e[t], g)), (l = s.f);
						if (l === "require") i[t] = m(d);
						else if (l === "exports") (i[t] = b[d] = {}), (j = !0);
						else if (l === "module")
							k = i[t] = { id: d, uri: "", exports: b[d], config: r(d) };
						else if (b.hasOwnProperty(l) || c.hasOwnProperty(l)) i[t] = p(l);
						else if (s.p) s.p.load(s.n, m(g, !0), o(l), {}), (i[t] = b[l]);
						else if (!h[l]) throw new Error(d + " missing " + l);
					}
					n = f.apply(b[d], i);
					if (d)
						if (k && k.exports !== a && k.exports !== b[d]) b[d] = k.exports;
						else if (n !== a || !j) b[d] = n;
				} else d && (b[d] = f);
			}),
				(d = e = k = function (b, c, d, e) {
					return typeof b == "string"
						? p(q(b, c).f)
						: (b.splice ||
								((g = b), c.splice ? ((b = c), (c = d), (d = null)) : (b = a)),
						  (c = c || function () {}),
						  e
								? j(a, b, c, d)
								: setTimeout(function () {
										j(a, b, c, d);
								  }, 15),
						  k);
				}),
				(k.config = function (a) {
					return (g = a), k;
				}),
				(f = function (a, b, d) {
					b.splice || ((d = b), (b = [])), (c[a] = [a, b, d]);
				}),
				(f.amd = { jQuery: !0 });
		})(),
		f("almond", function () {}),
		(function () {
			var a = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
				b = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
				c = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
				d = typeof location != "undefined" && location.href,
				g = d && location.protocol && location.protocol.replace(/\:/, ""),
				h = d && location.hostname,
				i = d && (location.port || void 0),
				j = [];
			f("core/lib/text", [], function () {
				var f, l, m;
				return (
					typeof window != "undefined" && window.navigator && window.document
						? (l = function (a, b) {
								var c = f.createXhr();
								c.open("GET", a, !0),
									(c.onreadystatechange = function () {
										c.readyState === 4 && b(c.responseText);
									}),
									c.send(null);
						  })
						: typeof process != "undefined" &&
						  process.versions &&
						  process.versions.node
						? ((m = e.nodeRequire("fs")),
						  (l = function (a, b) {
								b(m.readFileSync(a, "utf8"));
						  }))
						: typeof Packages != "undefined" &&
						  (l = function (a, b) {
								var c = new java.io.File(a),
									d = java.lang.System.getProperty("line.separator"),
									c = new java.io.BufferedReader(
										new java.io.InputStreamReader(
											new java.io.FileInputStream(c),
											"utf-8"
										)
									),
									e,
									f,
									g = "";
								try {
									(e = new java.lang.StringBuffer()),
										(f = c.readLine()) &&
											f.length() &&
											f.charAt(0) === 65279 &&
											(f = f.substring(1));
									for (e.append(f); (f = c.readLine()) !== null; )
										e.append(d), e.append(f);
									g = String(e.toString());
								} finally {
									c.close();
								}
								b(g);
						  }),
					(f = {
						version: "0.27.0",
						strip: function (a) {
							if (a) {
								var a = a.replace(b, ""),
									d = a.match(c);
								d && (a = d[1]);
							} else a = "";
							return a;
						},
						jsEscape: function (a) {
							return a
								.replace(/(['\\])/g, "\\$1")
								.replace(/[\f]/g, "\\f")
								.replace(/[\b]/g, "\\b")
								.replace(/[\n]/g, "\\n")
								.replace(/[\t]/g, "\\t")
								.replace(/[\r]/g, "\\r");
						},
						createXhr: function () {
							var b, c, d;
							if (typeof XMLHttpRequest != "undefined")
								return new XMLHttpRequest();
							for (c = 0; c < 3; c++) {
								d = a[c];
								try {
									b = new ActiveXObject(d);
								} catch (e) {}
								if (b) {
									a = [d];
									break;
								}
							}
							if (!b) throw Error("createXhr(): XMLHttpRequest not available");
							return b;
						},
						get: l,
						parseName: function (a) {
							var b = !1,
								c = a.indexOf("."),
								d = a.substring(0, c),
								a = a.substring(c + 1, a.length),
								c = a.indexOf("!");
							return (
								c !== -1 &&
									((b = a.substring(c + 1, a.length)),
									(b = b === "strip"),
									(a = a.substring(0, c))),
								{ moduleName: d, ext: a, strip: b }
							);
						},
						xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
						useXhr: function (a, b, c, d) {
							var e = f.xdRegExp.exec(a),
								g;
							return e
								? ((a = e[2]),
								  (e = e[3]),
								  (e = e.split(":")),
								  (g = e[1]),
								  (e = e[0]),
								  (!a || a === b) && (!e || e === c) && ((!g && !e) || g === d))
								: !0;
						},
						finishLoad: function (a, b, c, d, e) {
							(c = b ? f.strip(c) : c),
								e.isBuild && e.inlineText && (j[a] = c),
								d(c);
						},
						load: function (a, b, c, e) {
							var j = f.parseName(a),
								k = j.moduleName + "." + j.ext,
								l = b.toUrl(k),
								m = (e && e.text && e.text.useXhr) || f.useXhr;
							!d || m(l, g, h, i)
								? f.get(l, function (b) {
										f.finishLoad(a, j.strip, b, c, e);
								  })
								: b([k], function (a) {
										f.finishLoad(j.moduleName + "." + j.ext, j.strip, a, c, e);
								  });
						},
						write: function (a, b, c) {
							if (b in j) {
								var d = f.jsEscape(j[b]);
								c.asModule(
									a + "!" + b,
									"define(function () { return '" + d + "';});\n"
								);
							}
						},
						writeFile: function (a, b, c, d, e) {
							var b = f.parseName(b),
								g = b.moduleName + "." + b.ext,
								h = c.toUrl(b.moduleName + "." + b.ext) + ".js";
							f.load(
								g,
								c,
								function () {
									var b = function (a) {
										return d(h, a);
									};
									(b.asModule = function (a, b) {
										return d.asModule(a, h, b);
									}),
										f.write(a, g, b, e);
								},
								e
							);
						}
					})
				);
			});
		})(),
		f("core/lib/text!core/actionBar/templates/base.html", [], function () {
			return '<script type="text/template">\r\n		<!-- first-slot is reserved for either the overflow tab or regular tab -->\r\n		<div class="first-slot"></div>\r\n		<div class="bb10-tab-shadow"></div>\r\n		<!-- mid-section can contain up to 3 tabs or actions -->\r\n		<div class="mid-section">\r\n\r\n		</div>\r\n		<div class="bb10-tab-shadow-end"></div>\r\n		<!-- last-slot is usually reserved for menu, or can be left blank -->\r\n		<div class="last-slot">\r\n			<div class="overflow-action"></div>\r\n		</div>\r\n		<div class="bb10-action-bar-cover"></div>\r\n</script>\r\n';
		}),
		f("core/lib/text!core/actionBar/templates/back-btn.html", [], function () {
			return '<script type="text/template">\r\n	<div class="bb10-back-button backBtn swipeable">\r\n				<div class="bb10-action-bar-indicator"></div>\r\n				<div class="bb10-action-bar-icon bb10-action-bar-back-arrow"></div>\r\n				<div class="bb10-action-bar-back-title">Back</div>\r\n		</div>\r\n	<div class="triangle">\r\n		<svg class="neon-line" xmlns="http://www.w3.org/2000/svg"\r\n				    xmlns:xlink="http://www.w3.org/1999/xlink">\r\n			<pattern id="back-btn-svg-pattern" patternUnits="userSpaceOnUse" width="4" height="150">\r\n			 <image width="4" height="140" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAACMCAIAAADUcJ+cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYDx80kYesMwAAAEZJREFUOMtjVFJSYoABFjY2NjiHiQEJUJfD8v//f3rYMzTdNphDZzBz6BVuw8CeYZDEhnUuGS2EiHYbbg45elj+/PkD5wAAmYo0eLkm2QUAAAAASUVORK5CYII="/>\r\n	  		</pattern>\r\n				    			    	\r\n		    <polygon points="0,0 0,150 26,0" style="fill:url(#back-btn-svg-pattern)"/>\r\n			<line x1="25" y1="-1" x2="2" y2="150" stroke-width="5" style="stroke:#151515;"></line>\r\n		    <line x1="27"  y1="-1" x2="4"   y2="150" stroke-width="5" style="stroke:#0072BB;"/>\r\n		</svg>\r\n	</div>\r\n</script>';
		}),
		f(
			"core/lib/text!core/actionBar/templates/overflow-btn.html",
			[],
			function () {
				return '<script type="text/template">\r\n\r\n	<div class="bb10-overflow-button">\r\n			<div class="tab-selected-line"></div>\r\n			<div class="bb10-overflow-more"></div>\r\n	<% if(typeof route === \'object\') { %>\r\n		<div class="bb10-action-bar-icon" style="background:url(<%= route.get(\'icon\') %>)"></div>\r\n		<div class="bb10-action-bar-title"><%= route.get(\'title\') %></div>		\r\n	<% } %>\r\n	\r\n	</div>\r\n\r\n</script>';
			}
		),
		f("core/lib/text!core/actionBar/templates/action.html", [], function () {
			return '<script type="text/template">\r\n	<div class="hit-area">\r\n		<div class="tab-selected-line"></div>\r\n		<div class="bb10-action-bar-icon" style="background:url(<%= tab.get(\'icon\')%>)"></div>\r\n		<div class="bb10-action-bar-title"><%= tab.get(\'title\') %></div>\r\n	</div>\r\n</script>\r\n';
		}),
		f("core/lib/text!core/actionBar/styles/base.css", [], function () {
			return '#actionBar{\r\n	position: absolute;\r\n	bottom: 0px;\r\n	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAACMCAIAAAAhjhQsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYDwsHAPkacAAAAEFJREFUSMftkrENACAMwwrqdfn/iHxRLsjIAHJWT3a7JFVY205sV94rrGfmZz960gU/GP+JHw744QDjtnSh5z12AMbBK6P9JjSgAAAAAElFTkSuQmCC"); \r\n	left:0;\r\n	right:0;\r\n	height:138px;\r\n	box-shadow: 10px 10px 100px #111;\r\n	z-index:2;\r\n	display: -webkit-box;\r\n	-webkit-box-orient: horizontal;\r\n	text-align:left;\r\n	overflow: hidden;\r\n}\r\n\r\n#actionBar .bb10-action-bar-cover{\r\n	position:absolute;\r\n	width:100%;\r\n	left:0px;\r\n	height:100%;\r\n	opacity:0;\r\n	display:none;\r\n}\r\n\r\n#actionBar.disabled .bb10-action-bar-cover{\r\n	display:block;\r\n}\r\n\r\n/* Landscape */\r\n@media \r\nscreen and (orientation:landscape),\r\nscreen and (min-device-width:1200px),\r\nscreen and (device-height:720px) {\r\n\r\n    #actionBar{\r\n		height:100px;\r\n	}\r\n}\r\n\r\n#actionBar .first-slot{\r\n	height:100%;\r\n	display:none;\r\n}\r\n#actionBar .last-slot{\r\n	display:none;\r\n	width:110px;\r\n	height:100%;\r\n}\r\n\r\n#actionBar .mid-section{\r\n	height:100%;\r\n	display: -webkit-box;\r\n  	-webkit-box-orient: horizontal;\r\n  	-webkit-box-flex: 1;\r\n}\r\n\r\n#actionBar .mid-section > div {\r\n	-webkit-box-flex: 1;\r\n	/* hack from http://stackoverflow.com/questions/7985021/css-flexbox-issue-why-is-the-width-of-my-flexchildren-affected-by-their-content */\r\n	width:0;\r\n}\r\n';
		}),
		f("core/lib/text!core/actionBar/styles/common.css", [], function () {
			return '#actionBar .bb10-action-bar-icon\r\n{\r\n	width:81px;\r\n	height:81px;\r\n	margin:auto;\r\n}\r\n\r\n#actionBar .bb10-action-bar-back-text,\r\n#actionBar .bb10-action-bar-title\r\n{\r\n	color:white;\r\n	font-size:25px;\r\n	text-align:center;\r\n}\r\n\r\n#actionBar .bb10-action-bar-back-title{\r\n	line-height:45px;\r\n	left:5px;\r\n	position: relative;\r\n}\r\n\r\n\r\n#actionBar > .bb10-tab-shadow,\r\n#actionBar > .bb10-tab-shadow-end{\r\n	height:100%;\r\n	width:31px;\r\n	background-image: url(data:image/png;base64,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);\r\n	position:relative;\r\n	left:-1px;\r\n	display: none;\r\n}\r\n\r\n#actionBar.back-mode > .bb10-tab-shadow{\r\n	display:none;\r\n}\r\n\r\n/* back button stuff */\r\n\r\n#actionBar .bb10-back-button\r\n{\r\n	float: left;\r\n	height:138px;\r\n	font-size:20pt;\r\n	width:154px;\r\n	text-align:center;\r\n	line-height:12px;\r\n	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAACMCAIAAADUcJ+cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYDx80kYesMwAAAEZJREFUOMtjVFJSYoABFjY2NjiHiQEJUJfD8v//f3rYMzTdNphDZzBz6BVuw8CeYZDEhnUuGS2EiHYbbg45elj+/PkD5wAAmYo0eLkm2QUAAAAASUVORK5CYII=");\r\n}\r\n\r\n\r\n#actionBar .neon-line\r\n{\r\n	position: absolute;\r\n	height:100%;\r\n}\r\n\r\n#actionBar .triangle\r\n{\r\n	width:100px;\r\n	left:154px;\r\n	position:absolute;\r\n	height:100%;\r\n	overflow:hidden;\r\n}\r\n\r\n.bb10-back-button:active .bb10-action-bar-indicator{\r\n	background:#0072BB;\r\n	width:8px;\r\n	height:90px;\r\n	position:absolute;\r\n	top:25px;\r\n}\r\n\r\n#actionBar .bb10-action-bar-back-arrow\r\n{\r\n	position:relative;\r\n	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAArCAYAAACJrvP4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowQTgwMTE3NDA3MjA2ODExOEE2REEzMTAyOEY5Mzk1MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRTJDQzVDNThDOTExMUUxQTU0RjkzMUFGNjYxM0I1NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRTJDQzVDNDhDOTExMUUxQTU0RjkzMUFGNjYxM0I1NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkwMDczRkFEMUEyMDY4MTFCODQwQkE3QkZFQzg0RDU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBBODAxMTc0MDcyMDY4MTE4QTZEQTMxMDI4RjkzOTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7s4t6wAAAedJREFUeNq8mM1LAkEYhzeLoGsQdBA/g056rHtQeBAFT56CULoWHbr3H3jd2IMQRIcuQYEgdO8U+LUKQgftFASdBGGx34gbi6ztvO+MDvwY1lEfn1l3Z95dGwwGhkoLh8PS7w0ZK2wbOr9sOBzuo6sgGcRBXpBL2H9MzSaTiaESt+F0HOH4HcnMxtaRHPKGsW1t0yhA6J6RLZ/hHeRGCywA5LaD6TnzTgWjyYBE+1E1kwWJdqsCo4CqkUjkkTuNFNA9UuZe1FTQaTQadf4uaoIZBXSHnMViMYdzuzpWBcmaCdATBRSPxx3OjVgbKMiMDEokEg5niaGAqjKgRWZUUDmZTDoy/7LQqkDzZmTQbIEkbwsyywa5ZmIVfZAE9bkgd1vwjRSRscQ2YA8x/bYFlGmsIXlkJPGZEmJxzdxfWUMKyEjCsIRYXDPDY1hYlqHfVo5k2O12La4Zy1AW+N8mlWRo27bFNWMZAmhyzTiG551Ox1StYijX4UIgpbCoI3lZw3a7barWZ3WK4TyQUzKRDFutVkW18qQYXgCYUy0sKMArHZWnmNKsxJTuaikGU6nUK7psgGFPW5kbABwj11oLeAHE8SHS9Iz3kROM9bQ/mkin003RNRoNUbRv4vhzac9BPNAvv9d/BRgA+5QYPmPFbOcAAAAASUVORK5CYII=");\r\n	background-repeat: no-repeat;\r\n	background-position: 50% 50%;\r\n	margin: 0px auto 0px auto;\r\n	top:15px;\r\n}\r\n\r\n#actionBar .overflow-action {\r\n	background-position-y: 30px;\r\n	height:100%;\r\n	width:100px;\r\n	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ9JREFUeNrsm0GKgzAUQOvQA8wFxCwUXYhnmRzFk3iUzmFcCLoIeIG5gZNfbAmDtiEtQ2b6HgSkfxNe/fkxnyTLshzgMd5QgEQkIhGQiEQkIhGQiEQkIhGQiEQkvgbHGCeVJMlhnucP+9jZodafjR1tmqafsZ2BJjEeyopAK/K0FbPz1SKSdL5PJ3/u1ljfTtZED1RgjDXRSVmq8xMwgTEkOrSBMSReyLJMtjHaDuMUFXnWEotuSxbj+iP7xGvuGvN+riZKfcW6ZkYv8S8UHj77kIhEJAISkYhEJAISkRgvx1gnNo7jZo+lKAoOIHyYpkkEnnbCOs9zeiwedIEx0vmCzQ51I6woLFTnX8MExpDopHO713eWGBI9KMtSqq/+8dbJs15jbHHuTsppDwzDcO6xVFVFjyVU4k66k85UZ0AiEpGIREAiEpGIRPAi2h5L3/ebPZa6rjmA8BV46x5LbCK5x/KPJarAGGuik7JU5ydgAmNIdOAey6M0TbN7j0VibHH4YgEkIhGJSAQkIhGJSAQkIhGJSAQkIhGJL8y3AAMAQljcIHptF9sAAAAASUVORK5CYII=);\r\n	color: white;\r\n	background-repeat: no-repeat;\r\n	text-align: center;\r\n}\r\n\r\n\r\n/* Landscape */\r\n@media \r\nscreen and (orientation:landscape),\r\nscreen and (min-device-width:1200px),\r\nscreen and (device-height:720px) {\r\n\r\n    .bb10-action-bar-back-title,\r\n    .bb10-action-bar-title\r\n		{\r\n			display:none !important;\r\n		}\r\n	#actionBar .overflow-action {\r\n			background-position-y: 10px;	\r\n	   }\r\n\r\n}\r\n';
		}),
		f("core/lib/text!core/actionBar/styles/tabs.css", [], function () {
			return ".bb10-action-bar-tab {\r\n	color: white;\r\n	border-right: 1px solid #141414;\r\n	background-image: -webkit-gradient(linear, center top, center bottom, from(#252525), to(#1C1C1C));\r\n	font-size: 26px;\r\n	background-repeat: no-repeat;\r\n	text-align: center;\r\n}\r\n\r\n.bb10-action-bar-tab:last-child, .bb10-action-bar-tab .tab-selected-line{\r\n	/*border-right:none;*/\r\n}\r\n\r\n\r\n.bb10-action-bar-tab.selected {\r\nbackground:none;\r\nheight: 100%;\r\n}\r\n\r\n.tab-selected-line {\r\n	height:8px;\r\n	width:100%;\r\n	background:#333333;\r\n	top:0;\r\n	border-right: 1px solid #141414;\r\n	margin-bottom:2px;\r\n}\r\n\r\n\r\n\r\n.bb10-action-bar-tab.selected .tab-selected-line {\r\n	background:#0098f0;	\r\n}";
		}),
		f("core/lib/text!core/actionBar/styles/actions.css", [], function () {
			return "#actionBar .bb10-action-bar-action .tab-selected-line {\r\n	position:relative;\r\n	top:0px;\r\n	width:100px;\r\n	margin:auto;\r\n	border:none;\r\n	background: transparent;\r\n}\r\n\r\n#actionBar .bb10-action-bar-action .hit-area:active .tab-selected-line {\r\n	background:#0098f0;	\r\n}\r\n\r\n\r\n#actionBar.actions-mode .bb10-tab-shadow,\r\n#actionBar.actions-mode.with-actions .bb10-tab-shadow,\r\n#actionBar.tabs-mode.with-actions .bb10-tab-shadow-end,\r\n#actionBar.tabs-mode.with-actions-on-action-bar .bb10-tab-shadow\r\n{\r\n	display: block !important;\r\n}\r\n\r\n#actionBar .hit-area{\r\n	width:150px;\r\n	height:100%;\r\n	margin:auto;\r\n}\r\n";
		}),
		f("core/lib/text!core/actionBar/styles/overflow.css", [], function () {
			return ".bb10-overflow-button{\r\n	overflow:hidden;\r\n	width:153px;\r\n	height:100%;\r\n	background-image: -webkit-gradient(linear, center top, center bottom, from(#252525), to(#1C1C1C));\r\n	border-right: 1px solid #141414;\r\n	color: white;\r\n	font-size: 26px;\r\n	text-align: center;\r\n}\r\n\r\n\r\n\r\n.bb10-overflow-more{\r\n	\r\n	width:80px;\r\n	height:80px;\r\n	position:absolute;\r\n	left:40px;\r\n	top:30px;\r\n	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZxJREFUeNrs27+NgzAUx3E4ZYBbAEQBokGwShiFSRglrIKgo7FggduAsyOKFGkeju+kx/cnIZpQ+JNn/Ac53vc9In75ggBEEEEkIIIIIogERBBBBJGACCKI18hN8uM4jp/3bdvu9tbbK1NkYezVJUkySPdYY8kDDnFd17u9P7RWlfVoHWSwSjzSK98Ndz1MhCh6J9oq/FbWhd9F3L7biXJnJPGpxDRNf44XsOaYoIhHOuWI4vaJR+fnX2WM2ilOlmXhpzhXiBSRFQvLPhBBJCCCCCKIBEQQQVSdMzvb0bIsajcgiqIYpA+KNyAOwIfiwmrzPB9Cd+deee/sg3dnW7mZckRx+xhY/ml0NspNzF905075wNIFr8SyLN3I1SqsSNee9mhf2CnOFcI3FpZ9IIJIQAQRRAIiiCCCSF5y6hvLPM9qv7FUVRV+A2KaJvXnWKSQnGN5074o5DkWW4WcY/GtRM6wfKAS67rmHMuHpjicY/EdnV3GcVQ7xWmaJuw5FsKKBUQQQSQggggiiAREEEEEkYAIIoggEr/8CjAASc6KPSJwnXcAAAAASUVORK5CYII=);\r\n	-webkit-transform: translateX(0);\r\n	-webkit-transition: -webkit-transform 70ms linear;\r\n}\r\n\r\n.bb10-overflow-button > .bb10-action-bar-title,\r\n.bb10-overflow-button > .bb10-action-bar-icon{\r\n	display:none;\r\n}\r\n\r\n.bb10-overflow-button.open .tab-selected-line {\r\n	background:#0098f0;	\r\n}\r\n\r\n.bb10-overflow-button.open .bb10-overflow-more{\r\n	-webkit-transform: translateX(-95px);\r\n}\r\n\r\n.bb10-overflow-button.open > .bb10-action-bar-title,\r\n.bb10-overflow-button.open > .bb10-action-bar-icon{\r\n	display:block;\r\n}\r\n/* landscape */\r\n@media\r\nscreen and (orientation:landscape),\r\nscreen and (min-device-width:1200px) {\r\n\r\n	.bb10-overflow-button{\r\n		width:255px;\r\n	}\r\n	.bb10-overflow-more{\r\n		top:13px;\r\n		left:90px;	\r\n	}\r\n	.bb10-overflow-button.open .bb10-overflow-more {\r\n		-webkit-transform: translateX(-145px);\r\n	}\r\n\r\n}\r\n@media screen and (device-height:720px){\r\n	.bb10-overflow-more{\r\n		top:13px;\r\n	}	\r\n}\r\n\r\n";
		}),
		f("core/lib/text!core/actionBar/templates/tab.html", [], function () {
			return '<script type="text/template">\r\n	\r\n		<div class="tab-selected-line"></div>\r\n		<div class="bb10-action-bar-icon" style="background:url(<%= tab.get(\'icon\')%>)"></div>\r\n		<div class="bb10-action-bar-title"><%= tab.get(\'title\') %></div>\r\n		\r\n</script>\r\n';
		}),
		f(
			"core/actionBar/tabs",
			["./../lib/text!./templates/tab.html"],
			function (d) {
				(Tab = c.Model.extend({ defaults: { overflow: !1 } })),
					(Tabs = c.Collection.extend({
						model: Tab,
						setActive: function (a) {
							this.each(function (a) {
								a.set({ active: !1 });
							}),
								this.getByCid != undefined
									? this.getByCid(a).set({ active: !0 })
									: this.get({ cid: a }).set({ active: !0 });
						},
						open: function (a) {
							var c = b.find(this.models, function (b) {
								return b.get("url") == a.trim();
							});
							a === ""
								? this.setActive(this.at(0).cid)
								: c && this.setActive(c.cid);
						}
					})),
					(TabView = c.View.extend({
						tagName: "div",
						className: "bb10-action-bar-tab",
						events: { click: "open" },
						tabTemplate: b.template(a(d).html()),
						destructionPolicy: "never",
						initialize: function (a) {
							(this.tab = a.tab),
								this.tab.bind("change:active", this.highlight, this);
						},
						render: function () {
							return this.$el.html(this.tabTemplate({ tab: this.tab })), this;
						},
						highlight: function () {
							this.tab.get("active")
								? this.$el.addClass("selected")
								: this.$el.removeClass("selected");
						},
						open: function () {
							_UIStack.router.navigate(this.tab.get("url"), !0);
						}
					}));
			}
		),
		f(
			"core/actionBar/actions",
			["./../lib/text!./templates/action.html"],
			function (d) {
				(Action = c.Model.extend()),
					(Actions = c.Collection.extend({
						model: Action,
						open: function (a) {
							var c = b.find(this.models, function (b) {
								return b.get("url") == a.trim();
							});
						}
					})),
					(ActionView = c.View.extend({
						tagName: "div",
						className: "bb10-action-bar-action",
						events: { "click .hit-area": "open" },
						layout: b.template(a(d).html()),
						destructionPolicy: "never",
						initialize: function (a) {
							this.action = a.action;
						},
						render: function () {
							return this.$el.html(this.layout({ tab: this.action })), this;
						},
						open: function () {
							_UIStack.router.navigate(this.action.get("url"), !0),
								this.action.get("closeWhenDone")
									? window.history.go(-2)
									: window.history.back();
						}
					}));
			}
		),
		f("utils", [], function () {
			(webkitTransform = "-webkit-transform"),
				(webkitTransitionDuration = "-webkit-transition-duration"),
				(webkitTransitionDelay = "-webkit-transition-delay"),
				(webkitTransitionEasing = "-webkit-transition-timing-function"),
				(translate3d = function (a, b, c) {
					return "translate3d(" + a + "," + b + "," + c + ")";
				}),
				(slide = function (b, c, d, e, f, g, h) {
					(b = a(b)),
						f && b.css(webkitTransitionDuration, f + "ms"),
						g && b.css(webkitTransitionEasing, g),
						h && b.css(webkitTransitionDelay, h + "ms"),
						b.css(webkitTransform, translate3d(c, d, e));
				});
		}),
		f("core/lib/utils", function () {}),
		f(
			"core/actionBar/main",
			[
				"./../lib/text!./templates/base.html",
				"./../lib/text!./templates/back-btn.html",
				"./../lib/text!./templates/overflow-btn.html",
				"./../lib/text!./templates/action.html",
				"./../lib/text!./styles/base.css",
				"./../lib/text!./styles/common.css",
				"./../lib/text!./styles/tabs.css",
				"./../lib/text!./styles/actions.css",
				"./../lib/text!./styles/overflow.css",
				"./tabs",
				"./actions",
				"./../lib/utils"
			],
			function (d, e, f, g, h, i, j, k, l) {
				actionBar = c.View.extend({
					tagName: "footer",
					id: "actionBar",
					events: {
						"click .bb10-back-button": "slideOut",
						"click .bb10-overflow-button": "showOverflowMenu",
						"click .overflow-action": "openContextMenu"
					},
					baseTemplate: b.template(a(d).html()),
					backButtonTemplate: b.template(a(e).html()),
					overflowButtonTemplate: b.template(a(f).html()),
					destructionPolicy: "never",
					initialize: function (a) {
						var d = this;
						(this.routes = a.routes ? a.routes : null),
							(this.router = a.router ? a.router : null);
						if (this.routes && !this.router) {
							console.log(
								"Error: please ensure you pass the router into action bar"
							);
							return;
						}
						(this.currentTab = new Tab()),
							this.currentTab.on("change:url", this.updateRoute, this),
							this.currentTab.on("change:actions", this.updateActions, this),
							this.render(),
							(this.parentView = a.parentView ? a.parentView : null);
						if (!this.routes)
							this.renderBackButton(),
								a.view.actions &&
									((this.actions = a.view.actions),
									this.currentTab.set({ actions: this.actions }));
						else {
							this.toggleClass("tabs-mode");
							var d = this,
								e = b.find(this.routes, function (a) {
									return b.find(a.actions, function (a) {
										return a.onActionBar;
									});
								});
							e &&
								((this.tabsOverflow = !0),
								this.$el.addClass("with-actions-on-action-bar")),
								this.renderTabs(),
								this.router.bind("all", function () {
									var a = d.tabs.where({ url: c.history.fragment })[0];
									if (!a) return;
									d.currentTab.clear({ silent: !0 }),
										d.currentTab.set(a.toJSON()),
										(d.actions = a.toJSON().actions),
										d.actions || d.$el.removeClass("with-actions");
								});
						}
					},
					renderBackButton: function () {
						return (
							this.toggleClass("back-mode"),
							this.firstSlot.html(this.backButtonTemplate()),
							this.firstSlot.css("display", "block"),
							this
						);
					},
					render: function () {
						return (
							this.$el.html(this.baseTemplate()),
							this.$el.append("<style>" + h + i + k + "</style>"),
							(this.midSection = this.$el.find(".mid-section")),
							(this.firstSlot = this.$el.find(".first-slot")),
							(this.lastSlot = this.$el.find(".last-slot")),
							(this.width = window.innerWidth),
							this
						);
					},
					renderTab: function (a) {
						if (!a.get("overflow")) {
							var a = new TabView({ tab: a });
							this.midSection.append(a.render().el);
						}
					},
					renderAction: function (a) {
						var a = new ActionView({ action: a });
						this.midSection.append(a.render().el);
					},
					renderTabs: function () {
						this.$el.append("<style>" + j + "</style>");
						var a = this;
						(this.tabs = new Tabs()),
							this.tabs.bind("add", this.renderTab, this),
							this.routes.length > 3 && this.renderOverflowButton();
						for (var b = 0; b < this.routes.length; b++) {
							if (b >= 3 || this.tabsOverflow) this.routes[b].overflow = "true";
							this.tabs.add(this.routes[b]);
						}
					},
					renderOverflowButton: function () {
						this.firstSlot.html(this.overflowButtonTemplate()),
							this.firstSlot.css("display", "block"),
							this.$el.append("<style>" + l + "</style>");
					},
					slideOut: function () {
						var a = this;
						window.history.back();
					},
					setOverflowButtonTo: function (a) {
						(this.overflowButton = this.$el.find(".bb10-overflow-button")),
							a != null
								? (this.firstSlot.html(
										this.overflowButtonTemplate({ route: a })
								  ),
								  (this.overflowButton = this.$el.find(
										".bb10-overflow-button"
								  )),
								  this.overflowButton.addClass("open"))
								: this.overflowButton.removeClass("open");
					},
					updateActions: function () {
						var c = this,
							d = 0;
						this.tabsOverflow && this.midSection.children().remove();
						if (!this.currentTab.has("actions")) {
							this.lastSlot.css("display", "none");
							return;
						}
						this.lastSlot.css("display", "block"),
							a(_UIStack.contextMenu.contextMenuEl).children().remove(),
							_UIStack.contextMenu.actions.add(this.currentTab.get("actions"));
						var e = b.find(this.currentTab.get("actions"), function (a) {
							return a.onActionBar;
						});
						if (!e) {
							this.$el.addClass("with-actions"), (this.actionsOnActionBar = !0);
							return;
						}
						b.each(this.currentTab.get("actions"), function (a) {
							var b = new Tab();
							b.set(a), a.onActionBar && d < 3 && c.renderAction(b), d++;
						});
					},
					toggleClass: function (a) {
						this.$el.removeClass(), this.$el.addClass(a);
					},
					updateRoute: function () {
						this.tabs.open(c.history.fragment),
							this.currentTab && this.currentTab.get("overflow")
								? this.setOverflowButtonTo(this.currentTab)
								: this.setOverflowButtonTo(null);
					},
					disable: function () {
						this.$el.addClass("disabled");
					},
					enable: function () {
						this.$el.removeClass("disabled");
					},
					openContextMenu: function () {
						_UIStack.contextMenu.open();
					},
					showOverflowMenu: function () {
						this.overflowMenuVisible
							? (slide(this.parentView.el, 0, 0, 0, 200),
							  (this.overflowMenuVisible = !1),
							  this.currentTab.get("overflow") &&
									this.overflowButton.addClass("open"))
							: (slide(
									this.parentView.el,
									window.innerWidth - 156 + "px",
									0,
									0,
									200
							  ),
							  this.overflowButton.removeClass("open"),
							  (this.overflowMenuVisible = !0));
					}
				});
			}
		),
		f("core/lib/text!core/UIStack/template.html", [], function () {
			return '<script type="text/template" id="navigationPane">\r\n	<section id="stack"></section>\r\n	<section id="views"></section>\r\n	<section id="action-bar"></section>\r\n</script>\r\n\r\n<script type="text/template" id="stack-layout">\r\n	<section id="layer-one"></section>\r\n	<section id="layer-two"></section>\r\n	<section id="layer-three"></section>\r\n</script>\r\n\r\n<script type="text/template" id="loading-screen">\r\n	<section id="bb10-ui-stack-loading">\r\n		<div class="bb10-ui-stack-activity-large">\r\n			<div class="spinner"></div>\r\n		</div>\r\n	</section>\r\n</script>';
		}),
		f("core/lib/text!core/UIStack/style/main.css", [], function () {
			return "body,html{\r\n	position:fixed !important;\r\n	overflow:hidden !important;\r\n	left:0 !important;right:0 !important;top:0 !important;bottom:0 !important;\r\n	width: auto !important;\r\n	height: auto !important;\r\n}\r\n\r\n#stack{\r\n	width:100%;\r\n	height:100%;\r\n	left:100%;\r\n	position:absolute;\r\n}\r\n\r\n.navigation-pane{\r\n	width:100%;\r\n	height:100%;\r\n	z-index: 3 !important;\r\n	-webkit-box-shadow: black 5px 5px 25px;\r\n}\r\n\r\n.license {\r\n	padding:20px;\r\n}\r\n\r\n.bb10-ui-stack-view {\r\n	position:absolute;\r\n	top:0px;\r\n	bottom:0;\r\n	left:0;\r\n	right:0;\r\n	-webkit-transition: all 0ms linear;\r\n	background: #181818;\r\n	overflow: scroll;\r\n	-webkit-overflow-scrolling: touch;\r\n}\r\n.bb10-ui-stack-view.with-action-bar{\r\n	bottom:130px;\r\n}\r\n\r\n.bb10-ui-stack-view.loading #bb10-ui-stack-loading{\r\n	display: block;	\r\n}\r\n\r\n/* Landscape */\r\n@media \r\nscreen and (orientation:landscape),\r\nscreen and (min-device-width:1200px),\r\nscreen and (device-height:720px) {\r\n\r\n	.bb10-ui-stack-view.with-action-bar{\r\n		bottom:100px;\r\n	}\r\n\r\n}";
		}),
		f("core/lib/text!core/overflowMenu/template.html", [], function () {
			return "<script type=\"text/template\" id=\"overflow-menu-item\">\r\n		<img src=\"<%= page.get('icon') %>\"/>\r\n		<%= page.get('title') %>\r\n		<div id=\"notifications\"><%= page.has('notifications') ? page.get('notifications') : '' %></div>\r\n</script>";
		}),
		f("core/lib/text!core/overflowMenu/style.css", [], function () {
			return ".overflow-menu{\r\n	background:#111;\r\n	color:#ddd;\r\n	font-size:54px;\r\n	text-align:left;\r\n}\r\n\r\n.overflow-menu ul{\r\n	position:absolute;\r\n	top:0px;\r\n	bottom:20%;\r\n	max-height:80%;\r\n	width:100%;\r\n	padding-left:0;\r\n	list-style: none;\r\n}\r\n.overflow-menu ul li{\r\n	position: relative;\r\n	vertical-align: middle;\r\n	padding-left: 10px;\r\n	color:white;\r\n	border-bottom: solid 1px #404040;\r\n	height: 120px;\r\n	line-height: 112px;\r\n}\r\n\r\n.overflow-menu ul li:first-child{\r\n	border-top: solid 1px #404040;\r\n}\r\n\r\n.overflow-menu ul li img{\r\n	float:left;\r\n	top:15px;\r\n	margin-right:10px;\r\n	position:relative;\r\n}\r\n\r\n.overflow-menu ul li:active,.overflow-menu ul li.active{\r\n	background: #00a7de;\r\n	color:white;\r\n}\r\n\r\n.overflow-menu #notifications{\r\n	position: absolute;\r\n	bottom:3px;\r\n	background: #333;\r\n	border-radius: 30px;\r\n	padding-left:5px;\r\n	padding-right:5px;\r\n	font-size: 25px;\r\n	line-height:30px;\r\n	left:30px;\r\n}\r\n";
		}),
		f(
			"core/overflowMenu/menuItem",
			["./../lib/text!./template.html", "./menuItem"],
			function (d) {
				menuItem = c.View.extend({
					tagName: "li",
					events: { click: "open" },
					layout: b.template(a(d).html()),
					initialize: function (a) {
						(this.page = a.page),
							this.page.bind("change", this.render, this),
							this.page.bind("hookup", this.hookupCollection, this);
					},
					hookupCollection: function (a) {
						(this.model = a.model),
							(this.property = a.property),
							this.model.bind(
								"change:" + this.property,
								this.updateCounter,
								this
							);
					},
					updateCounter: function (a) {
						this.page.set({ notifications: a.get(this.property) });
					},
					render: function () {
						return (
							this.page.get("active")
								? this.$el.addClass("active")
								: this.$el.removeClass("active"),
							this.$el.html(this.layout({ page: this.page })),
							this
						);
					},
					open: function (a) {
						this.$el.addClass("active");
						var b = this.page.get("url");
						_UIStack.router.navigate(b, !0),
							c.history.fragment === b && c.history.loadUrl(c.history.fragment);
					}
				});
			}
		),
		f(
			"core/overflowMenu/main",
			[
				"./../lib/text!./template.html",
				"./../lib/text!./style.css",
				"./menuItem"
			],
			function (d, e) {
				(Pages = c.Collection.extend({
					setActive: function (a) {
						this.each(function (a) {
							a.set({ active: !1 });
						}),
							this.getByCid != undefined
								? this.getByCid(a).set({ active: !0 })
								: this.get({ cid: a }).set({ active: !0 });
					},
					hookup: function (a, b, c) {
						this.where({ url: b })[0].trigger("hookup", {
							model: a,
							property: c
						});
					}
				})),
					(overflowMenu = c.View.extend({
						tagName: "section",
						className: "view overflow-menu scroll",
						overflowMenuItem: b.template(
							a(d).filter("#overflow-menu-item").html()
						),
						initialize: function (a) {
							var b = this;
							(this.routes = a.routes),
								(this.pages = new Pages()),
								this.pages.add(this.routes),
								a.router.bind("all", function () {
									b.pages.each(function (a) {
										if (a.get("url") === c.history.fragment) {
											b.pages.setActive(a.cid);
											return;
										}
									});
								}),
								a.app.prepend(this.render().el);
						},
						hookup: function (a, b, c) {
							this.pages.hookup(a, b, c);
						},
						render: function () {
							this.$el.append("<style>" + e + "</style>");
							var b = document.createElement("ul");
							return (
								this.pages.each(function (c) {
									a(b).append(new menuItem({ page: c }).render().el);
								}),
								this.$el.append(b),
								this
							);
						}
					}));
			}
		),
		f("core/lib/text!core/UIStack/style/stackPane.css", [], function () {
			return "#layer-one, #layer-two, #layer-three{\r\n	position: absolute;\r\n	width:100%;\r\n	height:100%;\r\n}\r\n\r\n.bottom{\r\n	z-index:5;	\r\n}\r\n\r\n.middle{\r\n	z-index:6;	\r\n}\r\n\r\n.top{\r\n	z-index:7;\r\n}\r\n";
		}),
		f(
			"core/UIStack/stackPane",
			[
				"./../lib/text!./template.html",
				"./../lib/text!./style/stackPane.css",
				"./../lib/utils",
				"./../actionBar/main"
			],
			function (d, e) {
				var f = 7,
					g = 6,
					h = 5;
				stackPane = c.View.extend({
					el: "#stack",
					stackLayout: b.template(a(d).filter("#stack-layout").html()),
					initialize: function (a) {
						this.render();
					},
					pushView: function (c) {
						if (this.currentView && this.currentView.cid === c.cid) return;
						var d = this;
						c._isRendered ||
							(c.render(),
							c.$el.addClass("bb10-ui-stack-view"),
							c.$el.append(new actionBar({ parentView: this, view: c }).el),
							(c._isRendered = !0),
							(this.currentView = c)),
							a(this.layerOne).html(c.el),
							b.defer(function () {
								slide(d.layerOne, "-100%", 0, 0, 300);
							});
					},
					popView: function (b) {
						var c = this;
						slide(this.layerOne, 0, 0, 0, 300),
							a(this.layerOne).on("webkitTransitionEnd", function () {
								a(this).off(),
									c.currentView.remove(),
									c.currentView.$el.remove(),
									(c.currentView._isRendered = !1),
									(c.currentView = null),
									b && c.pushView(b);
							});
					},
					replaceView: function (a) {
						this.popView(a);
					},
					render: function () {
						return (
							this.$el.append("<style>" + e + "</style>"),
							this.$el.append(this.stackLayout),
							(this.layerOne = this.el.querySelector("#layer-one")),
							(this.layerTwo = this.el.querySelector("#layer-two")),
							(this.layerThree = this.el.querySelector("#layer-three")),
							(this.layerOne.style.zIndex = h),
							(this.layerTwo.style.zIndex = g),
							(this.layerThree.style.zIndex = f),
							this
						);
					}
				});
			}
		),
		f("core/UIStack/tabbedPane", ["./stackPane"], function () {
			tabbedPane = c.View.extend({
				tagName: "section",
				initialize: function (a) {
					(this.pages = new Array()),
						(this.app = a.app),
						this.app.find("#views").html(this.render().el),
						(this.viewsStack = new stackPane({ app: this.app }));
				},
				showTab: function (a) {
					if (this.viewsStack.currentView) {
						this.viewsStack.popView();
						return;
					}
					b.contains(this.pages, a)
						? this.showView(a)
						: (a.$el.addClass("bb10-ui-stack-view  with-action-bar"),
						  this.pages.push(a),
						  this.addView(a));
				},
				showView: function (a) {
					b.each(this.pages, function (b) {
						b === a
							? (b.el.style.display = "block")
							: (b.el.style.display = "none");
					});
				},
				pushView: function (a) {
					if (this.viewReplaced) {
						window.history.back(), (this.viewReplaced = null);
						return;
					}
					this.viewsStack.currentView
						? this.viewsStack.currentView.cid != a.cid &&
						  (this.viewsStack.replaceView(a), (this.viewReplaced = !0))
						: this.viewsStack.pushView(a);
				},
				addView: function (a) {
					this.$el.append(a.render().el);
				},
				render: function () {
					return this;
				}
			});
		}),
		f("core/lib/text!core/settings/template.html", [], function () {
			return '<script type="text/template">\r\n</script>';
		}),
		f("core/lib/text!core/settings/style.css", [], function () {
			return ".settings{\r\n	left:0;right:0;\r\n	height:140px;\r\n	background:#111;\r\n	color:#ddd;\r\n	display: -webkit-box;\r\n	-webkit-box-orient: horizontal;\r\n}\r\n\r\n.settings > div{\r\n	-webkit-box-flex: 1;\r\n	width:0;\r\n	height:100%;\r\n}\r\n\r\n.settings > div .tab-selected-line {\r\n	display:none;	\r\n}\r\n\r\n.settings > div .hit-area{\r\n	width:150px;\r\n	top:0;\r\n	bottom:0;\r\n	position:relative;\r\n	padding-top:10px;\r\n	margin:auto;\r\n}\r\n\r\n.settings .bb10-action-bar-icon\r\n{\r\n	width:81px;\r\n	height:81px;\r\n	margin:auto;\r\n}\r\n\r\n.settings .bb10-settings-bar-title\r\n{\r\n	color:white;\r\n	font-size:25px;\r\n	text-align:center;\r\n}\r\n\r\n.settings .hit-area{\r\n	width:150px;\r\n	height:100%;\r\n	margin:auto;\r\n}\r\n";
		}),
		f("core/lib/text!core/settings/templates/action.html", [], function () {
			return '<script type="text/template">\r\n	<div class="hit-area">\r\n		<div class="tab-selected-line"></div>\r\n		<div class="bb10-action-bar-icon" style="background:url(<%= tab.get(\'icon\')%>)"></div>\r\n		<div class="bb10-settings-bar-title"><%= tab.get(\'title\') %></div>\r\n	</div>\r\n</script>\r\n';
		}),
		f(
			"core/settings/actions",
			["./../lib/text!./templates/action.html"],
			function (d) {
				SettingsActionView = c.View.extend({
					tagName: "div",
					className: "bb10-settings-bar-action",
					events: { "click .hit-area": "open" },
					layout: b.template(a(d).html()),
					destructionPolicy: "never",
					initialize: function (a) {
						(this.action = a.action),
							(this.settings = a.settings ? a.settings : null);
					},
					render: function () {
						return this.$el.html(this.layout({ tab: this.action })), this;
					},
					open: function () {
						this.settings && this.settings.close(),
							_UIStack.router.navigate(this.action.get("url"), !0);
					}
				});
			}
		),
		f(
			"core/settings/main",
			[
				"./../lib/text!./template.html",
				"./../lib/text!./style.css",
				"./actions"
			],
			function (d, e) {
				(settingsCollection = c.Collection.extend()),
					(settings = c.View.extend({
						tagName: "section",
						className: "settings",
						layoutTemplate: b.template(a(d).html()),
						initialize: function (a) {
							var b = this;
							(this.app = a.app),
								this.app.parent().prepend(this.render().el),
								(this.settings = new settingsCollection()),
								this.settings.on("add", this.renderActions, this),
								this.settings.add(a.settings),
								typeof blackberry != "undefined" &&
									blackberry.event.addEventListener("swipedown", function () {
										b.open();
									});
						},
						renderActions: function (a) {
							var b = new SettingsActionView({ action: a, settings: this });
							this.$el.append(b.render().el);
						},
						open: function () {
							var a = this;
							this.app.css("-webkit-transition-duration", "200ms"),
								this.app.css("-webkit-transform", "translate3d(0,140px,0)"),
								this.app.bind("touchstart", function (b) {
									a.close(), a.unbind("touchstart");
								});
						},
						close: function () {
							this.app.css("-webkit-transform", "translate3d(0,0,0)");
						},
						render: function () {
							return (
								this.$el.append("<style>" + e + "<style>"),
								this.$el.append(this.layoutTemplate()),
								this
							);
						}
					}));
			}
		),
		f("core/lib/text!core/contextMenu/template.html", [], function () {
			return "<script type=\"text/template\">\r\n			<img src=\"<%= action.get('icon')  %>\"/>\r\n			<%= action.get('title')  %>	\r\n</script>\r\n";
		}),
		f(
			"core/contextMenu/contextMenuAction",
			["./../lib/text!./template.html"],
			function (d) {
				contextMenuAction = c.View.extend({
					tagName: "li",
					layoutTemplate: b.template(a(d).html()),
					events: { click: "open" },
					initialize: function (a) {
						(this.action = a.action), this.render();
					},
					render: function () {
						return (
							this.$el.html(this.layoutTemplate({ action: this.action })), this
						);
					},
					open: function () {
						_UIStack.router.navigate(this.action.get("url"), !0),
							_UIStack.contextMenu.close(),
							this.action.get("closeWhenDone")
								? window.history.go(-2)
								: window.history.back();
					}
				});
			}
		),
		f("core/lib/text!core/contextMenu/style.css", [], function () {
			return ".context-menu{\r\n	position: absolute;\r\n	top:0px;\r\n	bottom:0px;\r\n	left:100%;\r\n	width:100%;\r\n	z-index:999998;\r\n}\r\n\r\n.context-menu .context-menu-container{\r\n	position: absolute;\r\n	top:0px;\r\n	bottom:0px;\r\n	width:565px;\r\n	left:0;\r\n	background:#111;\r\n	color:#ddd;\r\n	font-size:44px;\r\n	box-shadow: 10px 10px 100px #111;\r\n	z-index:999999;\r\n	list-style: none;\r\n	margin:0px;padding:0px;\r\n\r\n}\r\n\r\n.context-menu .close-area{\r\n	position:absolute;\r\n    top:0px;\r\n    left:-100%;\r\n    bottom:0px;\r\n    top:0px;	\r\n    width:100%;\r\n	z-index:999998; /* 1 layer lower, so we can click on the items */\r\n	display:none;\r\n}\r\n\r\n.context-menu.preview .close-area,\r\n.context-menu.open .close-area {\r\n	display:block;\r\n}\r\n\r\n\r\n.context-menu .context-menu-container li{\r\n	vertical-align: middle;\r\n	color:white;\r\n	border-bottom: solid 1px #404040;\r\n	height: 120px;\r\n	line-height: 120px;\r\n}\r\n\r\n.context-menu .context-menu-container li:active{\r\n	background:#0072BB;\r\n	color:white;\r\n}\r\n\r\n.context-menu .context-menu-container li img{\r\n	margin:20px;\r\n	float:left;\r\n}\r\n";
		}),
		f(
			"core/contextMenu/main",
			["./contextMenuAction", "./../lib/text!./style.css", "utils"],
			function (d, e) {
				(actions = c.Collection.extend()),
					(contextMenu = c.View.extend({
						tagName: "section",
						className: "context-menu",
						layoutTemplate: b.template(a(d).html()),
						events: {
							"click .close-area": "close",
							"click .context-menu-container": "close"
						},
						initialize: function (a) {
							(this.app = a.app),
								this.app.append(this.render().el),
								(this.actions = new actions()),
								this.actions.bind("add", this.renderAction, this);
						},
						open: function (b) {
							slide(a(this.contextMenuEl), "-565px", 0, 0, 150),
								(this.closeAreaEl.style.display = "block"),
								_UIStack.actionBar.disable();
						},
						renderAction: function (a) {
							this.contextMenuEl.appendChild(
								new contextMenuAction({ action: a }).el
							);
						},
						close: function () {
							slide(a(this.contextMenuEl), 0, 0, 0, 150),
								(this.closeAreaEl.style.display = "none"),
								_UIStack.actionBar.enable();
						},
						render: function () {
							return (
								this.$el.append("<style>" + e + "</style>"),
								(this.closeAreaEl = document.createElement("div")),
								(this.contextMenuEl = document.createElement("ul")),
								this.closeAreaEl.setAttribute("class", "close-area"),
								this.contextMenuEl.setAttribute(
									"class",
									"context-menu-container"
								),
								this.el.appendChild(this.closeAreaEl),
								this.el.appendChild(this.contextMenuEl),
								this
							);
						}
					}));
			}
		),
		f(
			"core/UIStack/main",
			[
				"./../lib/text!./template.html",
				"./../lib/text!./style/main.css",
				"./../overflowMenu/main",
				"./tabbedPane",
				"utils",
				"./../actionBar/main",
				"./../settings/main",
				"./../contextMenu/main"
			],
			function (d, e) {
				UIStack = c.View.extend({
					tagName: "section",
					className: "view navigation-pane",
					layoutTemplate: b.template(a(d).filter("#navigationPane").html()),
					destructionPolicy: "always",
					initialize: function (b) {
						a("head").append("<style>" + e + "</style>"),
							(this.router = b.router),
							(this.routes = b.config.routes),
							(this.settings = b.config.settings),
							(this.app = b.app),
							this.app.append(this.render().el),
							(this.tabbedPane = new tabbedPane({ app: this.app })),
							(this.contextMenu = new contextMenu({ app: this.app })),
							(this.overflowMenu = new overflowMenu({
								app: this.app,
								routes: this.routes,
								router: this.router
							})),
							(this.settings = new settings({
								app: this.app,
								settings: this.settings
							})),
							(window._UIStack = this);
					},
					hookup: function (a, b, c) {
						this.overflowMenu.hookup(a, b, c);
					},
					render: function () {
						return (
							this.$el.append(this.layoutTemplate()),
							(this.actionBar = new actionBar({
								parentView: this,
								routes: this.routes,
								router: this.router
							})),
							this.$el.find("#action-bar").append(this.actionBar.el),
							this
						);
					},
					slideIn: function () {
						slide(this.el, 0, 0, 0, 150),
							(this.actionBar.overflowMenuVisible = !1);
					},
					slideOut: function () {
						slide(this.el, window.innerWidth - 200, 0, 0, 150),
							(this.actionBar.overflowMenuVisible = !0);
					},
					showTab: function (a) {
						this.tabbedPane.showTab(a), this.slideIn();
					},
					pushView: function (a) {
						this.tabbedPane.pushView(a);
					}
				});
			}
		),
		(function () {
			var a = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
				b = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
				c = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
				d = typeof location != "undefined" && location.href,
				g = d && location.protocol && location.protocol.replace(/\:/, ""),
				h = d && location.hostname,
				i = d && (location.port || void 0),
				j = [];
			f("controls/lib/text", [], function () {
				var f, l, m;
				return (
					typeof window != "undefined" && window.navigator && window.document
						? (l = function (a, b) {
								var c = f.createXhr();
								c.open("GET", a, !0),
									(c.onreadystatechange = function () {
										c.readyState === 4 && b(c.responseText);
									}),
									c.send(null);
						  })
						: typeof process != "undefined" &&
						  process.versions &&
						  process.versions.node
						? ((m = e.nodeRequire("fs")),
						  (l = function (a, b) {
								b(m.readFileSync(a, "utf8"));
						  }))
						: typeof Packages != "undefined" &&
						  (l = function (a, b) {
								var c = new java.io.File(a),
									d = java.lang.System.getProperty("line.separator"),
									c = new java.io.BufferedReader(
										new java.io.InputStreamReader(
											new java.io.FileInputStream(c),
											"utf-8"
										)
									),
									e,
									f,
									g = "";
								try {
									(e = new java.lang.StringBuffer()),
										(f = c.readLine()) &&
											f.length() &&
											f.charAt(0) === 65279 &&
											(f = f.substring(1));
									for (e.append(f); (f = c.readLine()) !== null; )
										e.append(d), e.append(f);
									g = String(e.toString());
								} finally {
									c.close();
								}
								b(g);
						  }),
					(f = {
						version: "0.27.0",
						strip: function (a) {
							if (a) {
								var a = a.replace(b, ""),
									d = a.match(c);
								d && (a = d[1]);
							} else a = "";
							return a;
						},
						jsEscape: function (a) {
							return a
								.replace(/(['\\])/g, "\\$1")
								.replace(/[\f]/g, "\\f")
								.replace(/[\b]/g, "\\b")
								.replace(/[\n]/g, "\\n")
								.replace(/[\t]/g, "\\t")
								.replace(/[\r]/g, "\\r");
						},
						createXhr: function () {
							var b, c, d;
							if (typeof XMLHttpRequest != "undefined")
								return new XMLHttpRequest();
							for (c = 0; c < 3; c++) {
								d = a[c];
								try {
									b = new ActiveXObject(d);
								} catch (e) {}
								if (b) {
									a = [d];
									break;
								}
							}
							if (!b) throw Error("createXhr(): XMLHttpRequest not available");
							return b;
						},
						get: l,
						parseName: function (a) {
							var b = !1,
								c = a.indexOf("."),
								d = a.substring(0, c),
								a = a.substring(c + 1, a.length),
								c = a.indexOf("!");
							return (
								c !== -1 &&
									((b = a.substring(c + 1, a.length)),
									(b = b === "strip"),
									(a = a.substring(0, c))),
								{ moduleName: d, ext: a, strip: b }
							);
						},
						xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
						useXhr: function (a, b, c, d) {
							var e = f.xdRegExp.exec(a),
								g;
							return e
								? ((a = e[2]),
								  (e = e[3]),
								  (e = e.split(":")),
								  (g = e[1]),
								  (e = e[0]),
								  (!a || a === b) && (!e || e === c) && ((!g && !e) || g === d))
								: !0;
						},
						finishLoad: function (a, b, c, d, e) {
							(c = b ? f.strip(c) : c),
								e.isBuild && e.inlineText && (j[a] = c),
								d(c);
						},
						load: function (a, b, c, e) {
							var j = f.parseName(a),
								k = j.moduleName + "." + j.ext,
								l = b.toUrl(k),
								m = (e && e.text && e.text.useXhr) || f.useXhr;
							!d || m(l, g, h, i)
								? f.get(l, function (b) {
										f.finishLoad(a, j.strip, b, c, e);
								  })
								: b([k], function (a) {
										f.finishLoad(j.moduleName + "." + j.ext, j.strip, a, c, e);
								  });
						},
						write: function (a, b, c) {
							if (b in j) {
								var d = f.jsEscape(j[b]);
								c.asModule(
									a + "!" + b,
									"define(function () { return '" + d + "';});\n"
								);
							}
						},
						writeFile: function (a, b, c, d, e) {
							var b = f.parseName(b),
								g = b.moduleName + "." + b.ext,
								h = c.toUrl(b.moduleName + "." + b.ext) + ".js";
							f.load(
								g,
								c,
								function () {
									var b = function (a) {
										return d(h, a);
									};
									(b.asModule = function (a, b) {
										return d.asModule(a, h, b);
									}),
										f.write(a, g, b, e);
								},
								e
							);
						}
					})
				);
			});
		})(),
		f("controls/lib/text!controls/listView/style.css", [], function () {
			return ".list-view > ul > li{\r\n	float:left;\r\n	height:120px;\r\n	line-height:120px;\r\n	width:100%;\r\n	background:#e3e3e3;\r\n	color:#222222;\r\n	opacity: 1;\r\n	border-bottom:1px solid #bdbdbd;\r\n	border-top:1px solid #bdbdbd;\r\n}\r\n.list-view > ul > li span{\r\n	padding-left:40px;\r\n}\r\n\r\n.list-view > ul > li:active{\r\n	background:#0098f0;\r\n	color:#eee;\r\n}\r\n\r\n.list-view {\r\n	font-size:30px;\r\n	width: 100%;\r\n	margin:auto;\r\n}\r\n\r\n.list-view > ul{\r\n	margin:0;\r\n	padding:0;\r\n}\r\n";
		}),
		f(
			"controls/lib/text!controls/listView/templates/listItem.html",
			[],
			function () {
				return '<script type="text/template">\r\n	<article class="list-item">\r\n			<span><%= listItem.get(\'title\') %></span>\r\n	</article>\r\n</script>';
			}
		),
		f(
			"controls/listView/listItemView",
			["./../lib/text!./templates/listItem.html"],
			function (d) {
				listItemView = c.View.extend({
					tagName: "li",
					events: { click: "open" },
					layoutTemplate: b.template(a(d).html()),
					initialize: function (a) {
						(this.listItem = a.data),
							this.listItem.bind("change", this.render, this);
					},
					render: function () {
						var a = this.layoutTemplate({ listItem: this.listItem });
						return this.$el.html(a), this;
					},
					open: function () {
						_UIStack.router.navigate(this.listItem.get("videourl"), !0);
					}
				});
			}
		),
		f("controls/lib/text!controls/loading/template.html", [], function () {
			return '<script type="text/template" id="loading-screen">\r\n		<div class="bb10-ui-stack-activity-large">\r\n			<div class="spinner"></div>\r\n		</div>\r\n</script>';
		}),
		f("controls/lib/text!controls/loading/style.css", [], function () {
			return '#bb10-ui-stack-loading{\r\n	position: absolute;\r\n	top:0;bottom:0;\r\n	left:0;right:0;\r\n	width:100%;\r\n	height:100%;\r\n	z-index:9999;\r\n	background:#111;\r\n	display:none;\r\n}\r\n\r\n\r\n@-webkit-keyframes activity-rotate {\r\n  from {\r\n    -webkit-transform: rotate(0deg);\r\n  }\r\n  to { \r\n    -webkit-transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n\r\n/* light \r\n.bb-activity-light\r\n{\r\n	background-image:url("data:image/png;base64,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");\r\n}\r\n*/\r\n\r\n.bb10-ui-stack-activity-large{\r\n	top:40%;\r\n	position: relative;\r\n	height: 184px;\r\n	margin: auto;\r\n	width: 184px;\r\n	background-image:url(data:image/png;base64,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);\r\n	-webkit-animation: activity-rotate 0.7 linear infinite;\r\n	-webkit-transition: -webkit-transform 300ms linear;\r\n}\r\n\r\n.bb10-ui-stack-activity-large .spinner{\r\n	height: 184px;\r\n	position: absolute;\r\n	top:0;left:0;\r\n	width: 184px;\r\n	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAAC4CAYAAABQMybHAAAO3klEQVR4Xu2dCZAVxRnHv3lvD+VYAYFVVHDxCIiCoqJBoySyKkFRUZBDgkSySFGIGBVdVJYQU6ILiAqIoqzKsaAFaNCkPCKoxCMqGkXFEBaIARGj7LLL4e57k2+gKB/rHt0937yj33+qKC39+t/dv/4x1W9m3jyHcICAxQQci+eGqYEAQXBIYDUBCG718mJyEBwOWE0Aglu9vJgcBIcDVhOA4FYvLyYHweGA1QQguNXLi8lBcDhgNQEIbvXyYnIQHA5YTQCCW728mBwEhwNWE4DgVi8vJgfB4YDVBCC41cuLyUFwOGA1AQhu9fJichAcDlhNAIJbvbyYHASHA1YTgOBWLy8mB8HhgNUEILjVy4vJQXA4YDUBCG718mJyEBwOWE0Aglu9vJgcBIcDVhOA4FYvLyYHweGA1QQguNXLi8lBcDhgNQEIbvXyYnIQHA5YTQCCW728mBwEhwNWE4DgVi8vJgfB4YDVBCC41cuLyUFwOGA1AQhu9fJichAcDlhNAIJbvbyYHASHA1YTgOBWLy8mB8HhgNUEILjVy4vJQXA4oEMgKF9cnUHo1AY1YJ0xoDZ1CIR4qEE5E+VscdGDGmzqLBlGqkPA8yUjIMk9uat1BqNSC8FVKKEmloB3Fs8KCEkN53p/xA4ILoYyrYI8wTMDmvFuya0KBA9oldIgtglR67D8PL/9gTP3SeVCcCmS6Zfjyd2MWrSQd2jnzgrO9j50+j7kB+d7SAhIIQJZlJPTTHy8FRV7ONP74/uA4L4Rpn1ADjVvLvuhc9cu7+z9vcReHIKnvZ++AYSoads2vlNqB1R9U8n/qcpvLgT3SxDtPQLNqHXr5qIo9uyJUlXVdr+ZENwvQbT3CDjUtE0uZWd5N4Hkju/c74i2epcNjQ8IbowODWsROJxatpPdqtTQbtq19Vs/pCG4H3poeyiBNm2OolCTw0WxbN+8mfOMLxlCcNHVSPewdk2obfhoUQru3u20Y4f3gdPogOBG2NCoXgK5HfIoIyx3G9+lvbR14xZT4hDclBza1U2gVascOiynnSierZv+zXlGTxpCcNGVQNh+Asd2PIlCIbmbP9G92+irr/iKiv4BwfWZoUVjBI7pdCRfOJQ7i1e7lbR9fVlj3db1/yG4CTW0aYRAlyw6nk4RxbRp3UcmeRDchBraNE6gQ9c8LmrZeKFixe7Il7RjnfbVFAiuyBdlmgS8bUp2hie5zBGJ/Jc2f75NNwyC6xJDvSqBMJ3U9SzV4kbrqt1y2vTJF43W1SqA4LrEUK9OoP1pHSkrI1e9QSOVG9a+rZsFwXWJoV6dwAld21I482T1Bo1U1tAntPGDcp08CK5DC7V6BE48MZsyW56j16iB6mjNBlq/dqtOHgTXoYVafQKdzzuXQiTzAFYNbaX1a9brDAKC69BCrT6BU8/tTKFMmZs+NTXf0Wdvr9UZBATXoYVafQJdzm9PGaFO+g3rahGppo/XvK6TBcF1aKFWn0CXn7eicHYP/Yb1tPjnqr/qZEFwHVqoNSNw+i/7mjWso1Xl7jdpw7vee1OUDgiuhAlFvgh073Up8UbcV8bBxrudv9MXr/1PNQuCq5JCnTmBs/LPo5Aj833NaPXn9P7ryldSILj5sqGlKoEzL+nOgh+vWt5gXbTmX/TBq5+oZkFwVVKoMyfQvXdnyszsYh4Q0zIa+Yb+8fIbqlkQXJUU6swJdLvsGL7Vc755wCEtt9M7K1epZkFwVVKoMyfQ8+K2FMq+yDwgpqUb/ZrWvKh8LRyCi1BHSIMEzumXS1mhfCFK2+jNFa+pZkFwVVKoMyfgCZ4dvsQ8IKZlhLbRmuWvqGZBcFVSqDMn0GVAFrV2h5oHHLJF2UdvLFukmgXBVUmhzh+BXoNu8BcQ03pV6ROqWRBclRTq/BHoPaTAX0BM61cXPaaaBcFVSaHOH4H8oTf6C4hp/crCR1WzILgqKdT5I5A/bIy/gIOt3X30yoJ5qlkQXJUU6swJ9OmTTZQrs0WJ0H/o5ZIVqoOB4KqkUGdOoM/QY/lGzzXmAbEto1voxZJlqlkQXJUU6swJ9Bl5LIWdgeYBsS3dLbRy3nOqWRBclRTqzAlcPOI4fsvVteYBMS2j0c304hPPqmZBcFVSqDMncHlBe6LwYPOAmJaus4lWzl6imgXBVUmhzpxAvxu9LzxcYB4Q0zLivkt/fvRvqlkQXJUU6swJXD22N7l0rnlA7Bk8soqWz35LNQuCq5JCnTmB/mOGkROSedOsG32Kls3arDoYCK5KCnXmBAaMH8eNW5kHxLbcN4eenf21ahYEVyWFOnMCA38/xbxxrZZLp92tkwXBdWihVp9A/5uP5lcoj9VvWGeLPVRarPWXBYILkUdMPQQGTehJIbefCB/X3UCLH1B+DsXrE4KLkEdIvQSGTBzGb5ftKkIoSu/RonuVb/JAcBHqCGmQwHV3FvJbrY4UoRSh5bT4XuVLhBBchDpC6iUwoKgVNY3eI0aoxnmEFkzeoJOHLYoOLdTqEfjNpB58B/M6vUYNVJcU3aSbBcF1iaFencD1k4bwT3r3VG/QYOV6enLSw7pZEFyXGOrVCFxe1IRyM6apFStURZ0X6MmJf1GoPKQEgusSQ70agZF/5N/mcUaoFStUuc40erzwS4VKCK4LCfUGBAruG80Xoc80aFl3k7l3jDTJwhnchBraNEygoLg1Oe79cpjcz2ju7cUmeRDchBraNExgVHE+f0VN7upJxF1Ac29Vfl1b7OAgOGSVJzB62jRynLZiwXv23kLzC3eY5EFwE2poUz+BsdN/wXcuR4shct119Mj4e03zILgpObSrm8C4R2YSublyeCKzaebNyr/oULtfCC63EkgaN+tsvrFzuyiIcOX1VHxblWkmBDclh3Y/JXDznEl89UTmyUEv3XHfpuljjK6eHBwcBIeoMgTGz+lB4TA/OSh4RN2ZNH2U8s+V1NUzBBdcj7SNuvXpphT6YQZ/c/4oOQZOJT1wwxC/eRDcL0G0J5owbxDvJ+Sue+9nyte+p44s9YsXgvslmO7tCx/PJTezRBhDJZVXjaDZYyr95kJwvwTTvX3hM/fxMydniGKI0NN037CFEpkQXIJiumYUPpPPdywniE//h+rr6IERyu8+aah/CC6+OmkSeFfpCUTR6Xz2bi47Y+clmjLY16XB2PFAcNnVSY+0oqXNyHVn8GRPFp+w41xLRQNFzt7e2CC4+AqlQWDR0jtYnb7iM3VoJU0aMFUyF4JL0kyHrMnP9uEXaWq9Pk0Ni7uLKsuvoftv2KVWr1YFwdU4ocojMOW5k/hZk1l89s4JAMh0mnjVUulcCC5N1Na8Py3j/XbGHJ5eAHK766nwCuEbRQcWAoLbKqTkvKY+346ioYVsSwBy80Bdp4DuvOwDySEfzILgQVC1KXPq83wZMJN/OtvtHNC0ltOEvpMDysYZPCiwVuROfas5OVWP81xOCWg+FeQ27UMTzhf9YBk7VpzBA1q5lI8teimHmoW9VxUHJTdRxB1LEy719ThsY5wheGOE0vH/P/xyO6p2+DVpoeDkJncZ3dJ7YtB4IXjQhFMtv/j1ThTmh53IPSK4ofN7TsL7htNNv64Irg9cRQmaberlz1jdmb8mtoA/mQUoN1VQ1BlK4y/8PB6AcAaPB+VU6OOh1f35Gzl389OBQcrtXRO8lW66cFm8kEDweJFO1n4eeieHQtG7WDyZ35JvaJ6Os5TG9LwtniggeDxpJ1tfj75zCkXdYt6SnBb40Fz6lCoqB9Ed+eWB9xXTAQSPJ+1k6mv2uwN4vz2ZtyQtgh+Wu4WcjEto1FlxldubFwQPfnWTq4dZ7x3HL8Z8kFf+vDgNrJz/IvWngh7r4tTfId1A8ERQT0Sfc98/gpzw71g2+a+Y1T+fcqqJXEmjz/40EVPGGTxR1OPd72Mf9uFfW/BeYNkhzl33o5FnrIlznziDJxJ4XPuet7YvP799I+9E+Y2v8T7c0fTbbovj3Wvt/rBFSfQKBNF/yaeD+RHUO/nS3/FBxDea6dAouv7UhMuNLUqjK5VCBU+va893CPvyHnsMjzoxYu/H5RbQ8FMXJQs5nMGTZSVMxjF/bQvKOJylpsv5LuQVJhHCbUbSsE4iL+yRGhcElyIZr5yFn3XgV6V5e+oL+Gw5PF7dNtLPTv5LNoCGnmz8ovqg5gHBgyIrlfvM+m78WmJP5gt5X92NRcqTihbJcd2dFI1eRMN+9rFInnAIBBcGqhy3vKwF7aFuh9Q70V78DPYR5EZP5ysfHZJO5p9ObhOP8Soa1DEp5caHTGUbDQtLy65gAU7n/XEv/uOdfVsaJiVfM5fW0mH0K7oqb2fyDe7HEeEMHsTqlG7kM7PzJEd3DyI+CTLnUzbdkuxy4wwehCmlZfdwbGDfEg9iyBqZfLZ2x/GWhL/xkxoHzuCS67R4o/eFgT9IRiZNlrclcdwRybzfrosVBJcy6MC25COpuCTLSZktSW1uEFzKpNIy781Mtu25d/JrkofT4I4vSGGKdw4ElyDuXS0hWiERlUQZJfxBcnwqfJBsiBkElzBqyca7+CbMFImohGd4e+0wiz0wb3XCxyIwAAguAJFKN77K+++LJKISmOFdzy6iQXn8W/P2HBBcYi1LyzZyTHLdQteblxXbEVxF0Vt09erUPYOXUKZbRFd33Kw+2dSqxBlcYr1Saw/uPfn3IGW4JTaLfXBZIbiE4KlxFeWA2Fk0M9WvjOgsGQTXodVQ7eKyD8V/8VdmbCt4XCvo2rynZOJSKwWCS61Xct3J/JilnsFn6+fT6WyND5lSMteXk8hnUVxazVIv5w+NK9Jhb626lDiDq5JSrVtSNomf/S5SLTeu84QmWrX/z+A875846iAAwYPQwtuuuM58oT05Pw9C3pajjIf60f5/h9DKqwbBlVEZFC4pu5Ki/I0e4m/0OPu/nnbwRZcHpK19OPsF9u4oruJHU79PtUdTDQgF3gSCB44YHSSSAARPJH30HTgBCB44YnSQSAIQPJH00XfgBCB44IjRQSIJQPBE0kffgROA4IEjRgeJJADBE0kffQdOAIIHjhgdJJIABE8kffQdOAEIHjhidJBIAv8HX1+p1x09OJkAAAAASUVORK5CYII=); -webkit-animation: activity-rotate 0.8s linear infinite;\r\n}\r\n';
		}),
		f(
			"controls/loading/main",
			["./../lib/text!./template.html", "./../lib/text!./style.css"],
			function (d, e) {
				loadingScreen = c.View.extend({
					id: "bb10-ui-stack-loading",
					tagName: "section",
					layout: b.template(a(d).html()),
					initialize: function (a) {
						(this.view = a.view),
							this._isRendered || this.view.append(this.render().el);
					},
					render: function () {
						return (
							this.$el.append("<style>" + e + "</style>"),
							this.$el.append(this.layout),
							(this._isRendered = !0),
							this
						);
					},
					show: function () {
						this.view.addClass("loading");
					},
					hide: function () {
						this.view.removeClass("loading");
					}
				});
			}
		),
		f(
			"controls/listView/main",
			["./../lib/text!./style.css", "./listItemView", "./../loading/main"],
			function (b) {
				listView = c.View.extend({
					tagName: "section",
					className: "list-view",
					initialize: function (a) {
						(this.list = a.data),
							(this.loading = new loadingScreen({ view: this.$el })),
							a.data.bind("reset", this.render, this);
					},
					render: function () {
						this.loading.show();
						var c = document.createElement("ul"),
							d = this;
						return (
							this.list.each(function (b) {
								a(c).append(new listItemView({ data: b }).render().el);
							}),
							this.$el.append("<style>" + b + "</style>"),
							this.$el.append(c),
							setTimeout(function () {
								d.loading.hide();
							}, 1e3),
							this
						);
					}
				});
			}
		),
		{
			UIStack: e("core/UIStack/main"),
			actionBar: e("core/actionBar/main"),
			listView: e("controls/listView/main")
		}
	);
});
