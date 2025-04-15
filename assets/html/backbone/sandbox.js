var Sandbox = {
	
	Model: Backbone.Model.extend({
		defaults: {
			history: [],
			iframe: false,
			fallback: true
		},

		initialize: function () {
			_.bindAll(this);

			this.fetch();

			if (this.get("iframe")) {
				this.iframeSetup();
			}

			this.bind("destroy", function (model) {
				model.set({ history: [] });
			});
		},

		localStorage: new Store("SandboxConsole"),

		parse: function (data) {
			if (!_.isArray(data) || data.length < 1 || !data[0]) {
				return data;
			}
			data[0].history = _.map(data[0].history, function (command) {
				command._hidden = true;
				if (command.result) {
					delete command.result;
				}
				if (command._class) {
					delete command._class;
				}
				return command;
			});
			delete data[0].iframe;
			return data[0];
		},
		// todo : easier to type version, maybe auto complete or a list to scroll so you dont have to type these huge function names
		props : function (callback, message) {
			var callbacks = {
				getOwnEnumerables: function (obj) {
					return this._getPropertyNames(obj, true, false, this._enumerable);
				},
				getOwnNonenumerables: function (obj) {
					return this._getPropertyNames(obj, true, false, this._notEnumerable);
				},
				getOwnEnumerablesAndNonenumerables: function (obj) {
					return this._getPropertyNames( obj, true, false, this._enumerableAndNotEnumerable );
				},
				getPrototypeEnumerables: function (obj) {
					return this._getPropertyNames(obj, false, true, this._enumerable);
				},
				getPrototypeNonenumerables: function (obj) {
					return this._getPropertyNames(obj, false, true, this._notEnumerable);
				},
				getPrototypeEnumerablesAndNonenumerables: function (obj) {
					return this._getPropertyNames( obj, false, true, this._enumerableAndNotEnumerable );
				},
				getOwnAndPrototypeEnumerables: function (obj) {
					return this._getPropertyNames(obj, true, true, this._enumerable);
				},
				getOwnAndPrototypeNonenumerables: function (obj) {
					return this._getPropertyNames(obj, true, true, this._notEnumerable);
				},
				getOwnAndPrototypeEnumerablesAndNonenumerables: function (obj) {
					return this._getPropertyNames( obj, true, true, this._enumerableAndNotEnumerable );
				},
				_enumerable: function (obj, prop) {
					return obj.propertyIsEnumerable(prop);
				},
				_notEnumerable: function (obj, prop) {
					return !obj.propertyIsEnumerable(prop);
				},
				_enumerableAndNotEnumerable: function (obj, prop) {
					return true;
				},
				_getPropertyNames: function getAllPropertyNames( obj, iterateSelfBool, iteratePrototypeBool, includePropCb ) {
					var props = [];
					do {
						if (iterateSelfBool) {
							Object.getOwnPropertyNames(obj).forEach(function (prop) {
								if (props.indexOf(prop) === -1 && includePropCb(obj, prop)) {
									props.push(prop);
								}
							});
						}
						if (!iteratePrototypeBool) {
							break;
						}
						iterateSelfBool = true;
					} while ((obj = Object.getPrototypeOf(obj)));
					return props;
				}
			};
			return callbacks[callback](message);
		},
		//
		stringify: function (obj) {
			try {
				return JSON.stringify(obj);
			} catch (e) {
				return obj.toString();
			}
		},
		//todo : all standard objects
		addHistory: function (item) {
			var history = this.get("history");
			if (_.isString(item.result)) {
				item.result = '"' + item.result.toString().replace(/"/g, '\\"') + '"';
			}
			if (_.isFunction(item.result)) {
				item.result = item.result.toString().replace(/"/g, '\\"');
			}
			if (_.isObject(item.result)) {
				item.result = this.stringify(item.result).replace(/"/g, '\\"');
			}
			if (_.isUndefined(item.result)) {
				item.result = "undefined";
			}
			history.push(item);
			
			this.set({ history: history }).change();
		
			this.save();
			
			return this;
		
		},
		
		// try : setup input / output to the sandbox with message channel,
		
		iframeSetup: function () {
			this.sandboxFrame = $('<iframe width="0" height="0"/>')
				.css({ visibility: "hidden" })
				.appendTo("body")[0];
			this.sandbox = this.sandboxFrame.contentWindow;
			if (!this.sandbox.eval && this.sandbox.execScript) {
				this.sandbox.execScript("null");
			}
		},
		
		// todo : add option for sandbox to use a web worker to run eval
		
		iframeEval: function (command) {
			if (!this.sandbox) {
				this.iframeSetup();
			}
			return this.sandbox.eval
				? this.sandbox.eval(command)
				: this.get("fallback")
				? eval(command)
				: new Error(
						"Can't evaluate inside the iframe - please report this bug along with your browse" +
							"r information!"
				  );
		},
		
		// todo : tips, list loadable cors assets
		
		load: function (src) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = src;
			if (this.get("iframe")) {
				return this.sandboxFrame
					? this.sandboxFrame.contentDocument.body.appendChild(script)
					: new Error(
							"sandbox: iframe has not been created yet, cannot load " + src
					  );
			} else {
				return document.body.appendChild(script);
			}
		},
		
		evaluate: function (command) {
			if (!command) {
				return false;
			}
			var item = {
				command: command
			};
			try {
				item.result = this.get("iframe")
					? this.iframeEval(command)
					: eval.call(window, command);
				
				if (_.isUndefined(item.result)) {
					item._class = "undefined";
				}
				else if(_.isDate(item.result)){
					item._class = "date";
				}
				else if(_.isFunction(item.result)){
					item._class = "function";
				}
				else if(_.isRegExp(item.result)){
					item._class = "regexp";
				}				
				else if (_.isNumber(item.result)) {
					item._class = "number";
				}
				else if (_.isString(item.result)) {
					item._class = "string";
				}
				else if (_.isBoolean(item.result)) {
					item._class = "boolean";
				}
				else if (_.isNull(item.result)) {
					item._class = "null";
				}				
				
			} catch (error) {
				item.result = error.toString();
				item._class = "error";
			}
			return this.addHistory(item);
		}
	}),
	
	// todo : update backbone events, use listenTo(this.model, 'change', this.render); 
	
	View: Backbone.View.extend({
		initialize: function (opts) {
			_.bindAll(this);
			this.historyState = this.model.get("history").length;
			this.currentHistory = "";
			this.resultPrefix = opts.resultPrefix || "  => ";
			this.tabCharacter = opts.tabCharacter || "\t";
			this.placeholder =
				opts.placeholder ||
				"// type some javascript and hit enter (:help for info)";
			this.helpText =
				opts.helpText ||
				"type javascript commands into the console, hit enter to evaluate. \n[up/down] to" +
					" scroll through history, ':clear' to reset it. \n[alt + return/up/down] for retu" +
					"rns and multi-line editing.";
			this.model.bind("change", this.update);
			this.el.delegate("textarea", {
				keydown: this.keydown,
				keyup: this.keyup
			});
			this.el.delegate(".output", { click: this.focus });
			this.render();
		},
		template: _.template($("#tplSandbox").html()),
		format: _.template($("#tplCommand").html()),
		render: function () {
			this.el.html(this.template({ placeholder: this.placeholder }));
			this.textarea = this.el.find("textarea");
			this.output = this.el.find(".output");
			return this;
		},
		update: function () {
			this.output.html(
				_.reduce(
					this.model.get("history"),
					function (memo, command) {
						return (
							memo +
							this.format({
								_hidden: command._hidden,
								_class: command._class,
								command: this.toEscaped(command.command),
								result: this.toEscaped(command.result)
							})
						);
					},
					"",
					this
				)
			);
			this.textarea
				.val(this.currentHistory)
				.attr("rows", this.currentHistory.split("\n").length);
			this.output.scrollTop(this.output[0].scrollHeight - this.output.height());
		},
		setValue: function (command) {
			this.currentHistory = command;
			this.update();
			this.setCaret(this.textarea.val().length);
			this.textarea.focus();
			return false;
		},
		getCaret: function () {
			if (this.textarea[0].selectionStart) {
				return this.textarea[0].selectionStart;
			} else if (document.selection) {
				this.textarea[0].focus();
				var r = document.selection.createRange();
				if (r === null) {
					return 0;
				}
				var re = this.textarea[0].createTextRange(),
					rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint("EndToStart", re);
				return rc.text.length;
			}
			return 0;
		},
		setCaret: function (index) {
			this.textarea[0].selectionStart = index;
			this.textarea[0].selectionEnd = index;
		},
		toEscaped: function (string) {
			return String(string)
				.replace(/\\"/g, '"')
				.replace(/&/g, "&amp;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
		},
		focus: function (e) {
			e.preventDefault();
			this.textarea.focus();
			return false;
		},
		keydown: function (e) {
			if (_([16, 17, 18]).indexOf(e.which, true) > -1) {
				this.ctrl = true;
			}
			if (e.which === 13) {
				e.preventDefault();
				var val = this.textarea.val();
				if (this.ctrl) {
					this.currentHistory = val + "\n";
					this.update();
					return false;
				}
				this.currentHistory = "";
				if (!this.specialCommands(val)) {
					this.model.evaluate(val);
				}
				this.historyState = this.model.get("history").length;
				return false;
			}
			if (!this.ctrl && (e.which === 38 || e.which === 40)) {
				e.preventDefault();
				var history = this.model.get("history");
				var direction = e.which - 39;
				this.historyState += direction;
				if (this.historyState < 0) {
					this.historyState = 0;
				} else if (this.historyState >= history.length) {
					this.historyState = history.length;
				}
				this.currentHistory = history[this.historyState]
					? history[this.historyState].command
					: "";
				this.update();
				return false;
			}
			if (e.which === 9) {
				e.preventDefault();
				var value = this.textarea.val(),
					caret = this.getCaret(),
					parts = [value.slice(0, caret), value.slice(caret, value.length)];
				this.textarea.val(parts[0] + this.tabCharacter + parts[1]);
				this.setCaret(caret + this.tabCharacter.length);
				return false;
			}
		},
		keyup: function (e) {
			if (_([16, 17, 18]).indexOf(e.which, true) > -1) {
				this.ctrl = false;
			}
		},
		
		// these commands use localstorage as a channel between contexts
		
		specialCommands: function (command) {
			if (command === ":clear") {
				this.model.destroy();
				return true;
			} else if (command === ":help") {
				return this.model.addHistory({
					command: ":help",
					result: this.helpText
				});
			} else if (command === ":parent") {
				return this.model.addHistory({
					command: ":parent",
					result: location.href
				});
			} else if (command === ":anchor") {
				return this.model.addHistory({
					command: ":anchor",
					result: '/'
				});
			}
			
			else if (command.indexOf(":load") > -1) {
				return this.model.addHistory({
					command: command,
					result: this.model.load(command.substring(6))
				});
			}

			return false;
		}
	})
};
