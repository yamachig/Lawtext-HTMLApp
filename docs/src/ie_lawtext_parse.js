"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    (function (process) {
      "use strict";

      var parser = require("./parser");
      var fs = require('fs');

      function lex(text) {

        var lines = text.split(/\r?\n/);
        var replaced_lines = [];
        var indent_depth = 0;
        var indent_memo = {};
        var re_indent = /^(?:  |　|\t)(?!- |-$|[ 　\t]*(?:第\S+[編章節款目章則]|[附付]\s+則|別表))/;
        var re_force_dedent_parentheses = /^(?:  |　|\t)[(（][^)）]*[)）][ 　\t]*$/;
        var re_indent_in_toc = /^(?:  |　|\t)/;
        var in_toc = false;

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (line.match(/^\S*目次$/)) {
            in_toc = true;
            replaced_lines.push(line);
            continue;
          }
          if (line.match(/^\s*$/)) {
            in_toc = false;
            replaced_lines.push(line);
            continue;
          }

          var force_dedent = false;
          if (line.match(re_force_dedent_parentheses)) {
            force_dedent = true;
          }

          var indents = [];
          var pos = 0;

          if (!force_dedent) {
            while (true) {
              var match = line.slice(pos).match(in_toc ? re_indent_in_toc : re_indent);
              if (!match) break;
              var indent = match[0];
              pos += indent.length;
              indents.push(indent);
            }
          }

          var replaced_line = "";
          if (indent_depth <= indents.length) {
            for (var j = indent_depth; j < indents.length; j++) {
              var _indent = indents[j];
              replaced_line += "<INDENT str=\"" + _indent + "\">";
            }
          } else {
            for (var _j = 0; _j < indent_depth - indents.length; _j++) {
              replaced_line += "<DEDENT>";
            }
          }
          replaced_line += line.slice(pos);

          replaced_lines.push(replaced_line);

          indent_depth = indents.length;
          indent_memo[i + 1] = indent_depth;
        }
        if (0 < indent_depth) {
          var _replaced_line = "";
          for (var _j2 = 0; _j2 < indent_depth; _j2++) {
            _replaced_line += "<DEDENT>";
          }
          replaced_lines.push(_replaced_line);
        }

        var replaced_text = replaced_lines.join("\n");

        return [replaced_text, indent_memo];
      }

      function parse(text) {
        console.error("\\\\\\\\\\ parse start \\\\\\\\\\");

        var _lex = lex(text),
            _lex2 = _slicedToArray(_lex, 2),
            lexed = _lex2[0],
            indent_memo = _lex2[1];

        try {
          var parsed = parser.parse(lexed, { indent_memo: indent_memo });
          console.error("/////  parse end  /////");
        } catch (e) {
          console.error("##### parse error #####");
          if (e.location) {
            console.error(e.name + " at line " + e.location.start.line + " column " + e.location.start.column + ": " + e.message);
            // console.error(`${JSON.stringify(e, null, 4)}`);
          }
          throw e;
        }
        return parsed;
      }

      function main(argv) {

        if (argv.length >= 3) {
          fs.readFile(argv[2], 'utf-8', function (err, data) {
            if (err) {
              throw err;
            }
            var parsed = parse(data);
            console.log(JSON.stringify(parsed));
          });
        } else {
          var input = '';
          process.stdin.resume();
          process.stdin.setEncoding('utf-8');
          process.stdin.on('data', function (chunk) {
            input += chunk;
          });
          process.stdin.on('end', function () {
            var parsed = parse(input);
            console.log(JSON.stringify(parsed));
          });
        }
      }

      if (typeof require !== 'undefined' && require.main === module) {
        main(process.argv);
      }

      if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
        exports.parse = parse;
      }

      if (typeof window !== 'undefined') {
        window.Lawtext = window.Lawtext || {};
        window.Lawtext.parse = parse;
      }
    }).call(this, require('_process'));
  }, { "./parser": 2, "_process": 4, "fs": 3 }], 2: [function (require, module, exports) {
    /*
     * Generated by PEG.js 0.10.0.
     *
     * http://pegjs.org/
     */

    "use strict";

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";

      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function (expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function literal(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function _class(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function any(expectation) {
          return "any character";
        },

        end: function end(expectation) {
          return "end of input";
        },

        other: function other(expectation) {
          return expectation.description;
        }
      };

      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }

      function literalEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function classEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }

      function describeExpected(expected) {
        var descriptions = new Array(expected.length),
            i,
            j;

        for (i = 0; i < expected.length; i++) {
          descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }

        switch (descriptions.length) {
          case 1:
            return descriptions[0];

          case 2:
            return descriptions[0] + " or " + descriptions[1];

          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }

      function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
      }

      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };

    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};

      var peg$FAILED = {},
          peg$startRuleFunctions = { start: peg$parsestart },
          peg$startRuleFunction = peg$parsestart,
          peg$c0 = peg$anyExpectation(),
          peg$c1 = function peg$c1(law) {
        return law;
      },
          peg$c2 = function peg$c2(law_title, enact_statements, toc, main_provision, appdx_items) {
        var law = new EL("Law");
        var law_body = new EL("LawBody");

        if (law_title !== null) {
          if (law_title.law_num) {
            law.append(new EL("LawNum", {}, [law_title.law_num]));
          }

          if (law_title.law_title) {
            law_body.append(new EL("LawTitle", {}, [law_title.law_title]));
          }
        }

        law.append(law_body);

        law_body.extend(enact_statements);
        law_body.append(toc);
        law_body.append(main_provision);
        law_body.extend(appdx_items);

        return law;
      },
          peg$c3 = peg$otherExpectation("law_title"),
          peg$c4 = function peg$c4(law_title, law_num) {
        return {
          law_title: law_title,
          law_num: law_num.content
        };
      },
          peg$c5 = function peg$c5(law_title) {
        return {
          law_title: law_title
        };
      },
          peg$c6 = peg$otherExpectation("enact_statement"),
          peg$c7 = function peg$c7(target) {
        return new EL("EnactStatement", {}, [target]);
      },
          peg$c8 = peg$otherExpectation("toc_label"),
          peg$c9 = /^[^\r\n\u76EE]/,
          peg$c10 = peg$classExpectation(["\r", "\n", "\u76EE"], true, false),
          peg$c11 = "\u76EE\u6B21",
          peg$c12 = peg$literalExpectation("\u76EE\u6B21", false),
          peg$c13 = peg$otherExpectation("toc"),
          peg$c14 = function peg$c14(toc_label, first, target) {
        return target;
      },
          peg$c15 = function peg$c15(toc_label, first, rest) {
        var children = [first].concat(rest);

        var toc = new EL("TOC", {}, []);
        toc.append(new EL("TOCLabel", {}, [toc_label]));
        toc.extend(children);

        return toc;
      },
          peg$c16 = peg$otherExpectation("toc_item"),
          peg$c17 = function peg$c17(title, article_range, first, target) {
        return target;
      },
          peg$c18 = function peg$c18(title, article_range, first, rest) {
        return [first].concat(rest);
      },
          peg$c19 = function peg$c19(title, article_range, children) {
        var type_char = title.match(/[編章節款目章則]/)[0];
        var toc_item = new EL("TOC" + article_group_type[type_char], {}, []);
        toc_item.append(new EL(article_group_title_tag[type_char], {}, [title]));
        if (article_range !== null) {
          toc_item.append(new EL("ArticleRange", {}, [article_range]));
        }
        toc_item.extend(children || []);

        return toc_item;
      },
          peg$c20 = function peg$c20(children) {
        return new EL("MainProvision", {}, children);
      },
          peg$c21 = peg$otherExpectation("article_group_title"),
          peg$c22 = "\u7B2C",
          peg$c23 = peg$literalExpectation("\u7B2C", false),
          peg$c24 = /^[^ \u3000\t\r\n\u7DE8\u7AE0\u7BC0\u6B3E\u76EE]/,
          peg$c25 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n", "\u7DE8", "\u7AE0", "\u7BC0", "\u6B3E", "\u76EE"], true, false),
          peg$c26 = /^[\u7DE8\u7AE0\u7BC0\u6B3E\u76EE]/,
          peg$c27 = peg$classExpectation(["\u7DE8", "\u7AE0", "\u7BC0", "\u6B3E", "\u76EE"], false, false),
          peg$c28 = "\u306E",
          peg$c29 = peg$literalExpectation("\u306E", false),
          peg$c30 = /^[^ \u3000\t\r\n]/,
          peg$c31 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n"], true, false),
          peg$c32 = function peg$c32(type_char) {
        return {
          text: text(),
          type_char: type_char
        };
      },
          peg$c33 = function peg$c33(title) {
        return title;
      },
          peg$c34 = peg$otherExpectation("article_group"),
          peg$c35 = function peg$c35(article_group_title, next_title) {
        var current_level = article_group_type_chars.indexOf(article_group_title.type_char);
        var next_level = article_group_type_chars.indexOf(next_title.type_char);
        return current_level < next_level;
      },
          peg$c36 = function peg$c36(article_group_title, article_group) {
        return article_group;
      },
          peg$c37 = function peg$c37(article_group_title, children) {
        var article_group = new EL(article_group_type[article_group_title.type_char]);
        article_group.append(new EL(article_group_type[article_group_title.type_char] + "Title", {}, [article_group_title.text]));
        article_group.extend(children);
        return article_group;
      },
          peg$c38 = peg$otherExpectation("article_paragraph_caption"),
          peg$c39 = function peg$c39(article_paragraph_caption) {
        return article_paragraph_caption;
      },
          peg$c40 = peg$otherExpectation("article_title"),
          peg$c41 = /^[^ \u3000\t\r\n\u6761]/,
          peg$c42 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n", "\u6761"], true, false),
          peg$c43 = "\u6761",
          peg$c44 = peg$literalExpectation("\u6761", false),
          peg$c45 = peg$otherExpectation("article"),
          peg$c46 = function peg$c46(article_caption, article_title, target) {
        return target;
      },
          peg$c47 = function peg$c47(article_caption, article_title) {
        return [new EL("Sentence")];
      },
          peg$c48 = function peg$c48(article_caption, article_title, inline_contents, target) {
        return target;
      },
          peg$c49 = function peg$c49(article_caption, article_title, inline_contents, lists, target, _target) {
        return _target;
      },
          peg$c50 = function peg$c50(article_caption, article_title, inline_contents, lists, target, target_rest) {
        return [target].concat(target_rest);
      },
          peg$c51 = function peg$c51(article_caption, article_title, inline_contents, lists, children1, paragraphs, target, _target) {
        return _target;
      },
          peg$c52 = function peg$c52(article_caption, article_title, inline_contents, lists, children1, paragraphs, target, target_rest) {
        return [target].concat(target_rest);
      },
          peg$c53 = function peg$c53(article_caption, article_title, inline_contents, lists, children1, paragraphs, children2) {
        var article = new EL("Article");
        if (article_caption !== null) {
          article.append(new EL("ArticleCaption", {}, [article_caption]));
        }
        article.append(new EL("ArticleTitle", {}, [article_title]));

        var paragraph = new EL("Paragraph");
        article.append(paragraph);

        paragraph.append(new EL("ParagraphNum"));
        paragraph.append(new EL("ParagraphSentence", {}, inline_contents));
        paragraph.extend(lists || []);
        paragraph.extend(children1 || []);
        paragraph.extend(children2 || []);

        article.extend(paragraphs);

        return article;
      },
          peg$c54 = peg$otherExpectation("paragraph_item"),
          peg$c55 = /^[^ \u3000\t\r\n\u6761<]/,
          peg$c56 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n", "\u6761", "<"], true, false),
          peg$c57 = function peg$c57(paragraph_caption, paragraph_item_title, inline_contents, target) {
        return target;
      },
          peg$c58 = function peg$c58(paragraph_caption, paragraph_item_title, inline_contents, lists, target, _target) {
        return _target;
      },
          peg$c59 = function peg$c59(paragraph_caption, paragraph_item_title, inline_contents, lists, target, target_rest) {
        return [target].concat(target_rest);
      },
          peg$c60 = function peg$c60(paragraph_caption, paragraph_item_title, inline_contents, lists, children) {
        var lineno = location().start.line;
        var indent = indent_memo[lineno];

        if (base_indent_stack.length > 0) {
          var _base_indent_stack = _slicedToArray(base_indent_stack[base_indent_stack.length - 1], 3),
              base_indent = _base_indent_stack[0],
              is_first = _base_indent_stack[1],
              base_lineno = _base_indent_stack[2];

          if (!is_first || lineno !== base_lineno) {
            indent -= base_indent;
          }
        }

        var paragraph_item = new EL(paragraph_item_tags[indent]);
        if (paragraph_caption !== null) {
          paragraph_item.append(new EL("ParagraphCaption", {}, [paragraph_caption]));
        }
        paragraph_item.append(new EL(paragraph_item_title_tags[indent], {}, [paragraph_item_title]));
        paragraph_item.append(new EL(paragraph_item_sentence_tags[indent], {}, inline_contents));
        paragraph_item.extend(lists || []);
        paragraph_item.extend(children || []);

        return paragraph_item;
      },
          peg$c61 = peg$otherExpectation("no_name_paragraph"),
          peg$c62 = function peg$c62(inline_contents, target) {
        return target;
      },
          peg$c63 = function peg$c63(inline_contents, lists, target, _target) {
        return _target;
      },
          peg$c64 = function peg$c64(inline_contents, lists, target, target_rest) {
        return [target].concat(target_rest);
      },
          peg$c65 = function peg$c65(inline_contents, lists, children) {
        var indent = indent_memo[location().start.line];
        // console.error("paragraph_item: " + JSON.stringify(location().start.line));
        // console.error("    indent: " + indent);
        var paragraph_item = new EL(paragraph_item_tags[indent]);
        paragraph_item.append(new EL(paragraph_item_title_tags[indent]));
        paragraph_item.append(new EL(paragraph_item_sentence_tags[indent], {}, inline_contents));
        paragraph_item.extend(lists || []);
        paragraph_item.extend(children || []);

        return paragraph_item;
      },
          peg$c66 = peg$otherExpectation("paragraph_item_child"),
          peg$c67 = peg$otherExpectation("list"),
          peg$c68 = function peg$c68(columns_or_sentences) {
        var list = new EL("List");
        var list_sentence = new EL("ListSentence");
        list.append(list_sentence);

        list_sentence.extend(columns_or_sentences);

        return list;
      },
          peg$c69 = peg$otherExpectation("table_struct"),
          peg$c70 = function peg$c70(table_struct_title, remarkses1, table, remarkses2) {
        var table_struct = new EL("TableStruct");

        if (table_struct_title !== null) {
          table_struct.append(table_struct_title);
        }

        table_struct.extend(remarkses1);

        table_struct.append(table);

        table_struct.extend(remarkses2);

        return table_struct;
      },
          peg$c71 = peg$otherExpectation("table_struct_title"),
          peg$c72 = ":table-struct-title:",
          peg$c73 = peg$literalExpectation(":table-struct-title:", false),
          peg$c74 = function peg$c74(title) {
        return new EL("TableStructTitle", {}, [title]);
      },
          peg$c75 = peg$otherExpectation("table"),
          peg$c76 = "*",
          peg$c77 = peg$literalExpectation("*", false),
          peg$c78 = "  ",
          peg$c79 = peg$literalExpectation("  ", false),
          peg$c80 = "\u3000",
          peg$c81 = peg$literalExpectation("\u3000", false),
          peg$c82 = "\t",
          peg$c83 = peg$literalExpectation("\t", false),
          peg$c84 = function peg$c84(first, target) {
        return target;
      },
          peg$c85 = function peg$c85(first, rest) {
        return [first].concat(rest);
      },
          peg$c86 = function peg$c86(table_row_columns) {
        var table = new EL("Table");
        for (var i = 0; i < table_row_columns.length; i++) {
          var table_row = new EL("TableRow", {}, table_row_columns[i]);
          table.append(table_row);
        }

        return table;
      },
          peg$c87 = peg$otherExpectation("table_column"),
          peg$c88 = "-",
          peg$c89 = peg$literalExpectation("-", false),
          peg$c90 = "[",
          peg$c91 = peg$literalExpectation("[", false),
          peg$c92 = /^[^ \u3000\t\r\n\]=]/,
          peg$c93 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n", "]", "="], true, false),
          peg$c94 = "=\"",
          peg$c95 = peg$literalExpectation("=\"", false),
          peg$c96 = /^[^ \u3000\t\r\n\]"]/,
          peg$c97 = peg$classExpectation([" ", "\u3000", "\t", "\r", "\n", "]", "\""], true, false),
          peg$c98 = "\"]",
          peg$c99 = peg$literalExpectation("\"]", false),
          peg$c100 = function peg$c100(name, value) {
        return [name, value];
      },
          peg$c101 = function peg$c101(attr, first, _target) {
        return _target;
      },
          peg$c102 = function peg$c102(attr, first, target) {
        return target;
      },
          peg$c103 = function peg$c103(attr, first, rest) {
        var lines = [first || ""].concat(rest || []);

        var table_column = new EL("TableColumn");
        for (var i = 0; i < attr.length; i++) {
          var _attr$i = _slicedToArray(attr[i], 2),
              name = _attr$i[0],
              value = _attr$i[1];

          table_column.attr[name] = value;
        }
        for (var _i = 0; _i < lines.length; _i++) {
          var line = lines[_i];
          table_column.append(new EL("Sentence", {}, [line]));
        }

        return table_column;
      },
          peg$c104 = function peg$c104() {
        return new EL("TableColumn", {}, [new EL("Sentence")]);
      },
          peg$c105 = peg$otherExpectation("style_struct"),
          peg$c106 = function peg$c106(style_struct_title, remarkses1, style, remarkses2) {
        var style_struct = new EL("StyleStruct");

        if (style_struct_title !== null) {
          style_struct.append(style_struct_title);
        }

        style_struct.extend(remarkses1);

        style_struct.append(style);

        style_struct.extend(remarkses2);

        return style_struct;
      },
          peg$c107 = peg$otherExpectation("style_struct_title"),
          peg$c108 = ":style-struct-title:",
          peg$c109 = peg$literalExpectation(":style-struct-title:", false),
          peg$c110 = function peg$c110(title) {
        return new EL("StyleStructTitle", {}, [title]);
      },
          peg$c111 = peg$otherExpectation("style"),
          peg$c112 = function peg$c112(table) {
        return [table];
      },
          peg$c113 = function peg$c113(fig) {
        return [fig];
      },
          peg$c114 = function peg$c114(children) {
        return new EL("Style", {}, children);
      },
          peg$c115 = peg$otherExpectation("remarks"),
          peg$c116 = "\u5099\u8003",
          peg$c117 = peg$literalExpectation("\u5099\u8003", false),
          peg$c118 = "\u6CE8",
          peg$c119 = peg$literalExpectation("\u6CE8", false),
          peg$c120 = function peg$c120(label, _target) {
        return new EL("Sentence", {}, [_target]);
      },
          peg$c121 = "",
          peg$c122 = function peg$c122(label, first) {
        base_indent_stack.push([indent_memo[location().start.line] - 1, false, location().start.line]);return true;
      },
          peg$c123 = function peg$c123(label, first, _target) {
        base_indent_stack.pop();return true;
      },
          peg$c124 = function peg$c124(label, first, _target) {
        return _target;
      },
          peg$c125 = function peg$c125(label, first) {
        base_indent_stack.pop();return false;
      },
          peg$c126 = "DUMMY",
          peg$c127 = peg$literalExpectation("DUMMY", false),
          peg$c128 = function peg$c128(label, first, _target) {
        return new EL("Sentence", {}, [_target]);
      },
          peg$c129 = function peg$c129(label, first, target) {
        return target;
      },
          peg$c130 = function peg$c130(label, first, rest) {
        var children = rest || [];
        if (first !== null) {
          children = [].concat(first).concat(children);
        }

        var remarks = new EL("Remarks");
        remarks.append(new EL("RemarksLabel", {}, [label]));
        remarks.extend(children);

        return remarks;
      },
          peg$c131 = peg$otherExpectation("fig"),
          peg$c132 = "..",
          peg$c133 = peg$literalExpectation("..", false),
          peg$c134 = "figure",
          peg$c135 = peg$literalExpectation("figure", false),
          peg$c136 = "::",
          peg$c137 = peg$literalExpectation("::", false),
          peg$c138 = function peg$c138(src) {
        return new EL("Fig", { src: src });
      },
          peg$c139 = peg$otherExpectation("appdx_item"),
          peg$c140 = peg$otherExpectation("appdx_table_title"),
          peg$c141 = "\u5225\u8868",
          peg$c142 = peg$literalExpectation("\u5225\u8868", false),
          peg$c143 = /^[^\r\n(\uFF08]/,
          peg$c144 = peg$classExpectation(["\r", "\n", "(", "\uFF08"], true, false),
          peg$c145 = function peg$c145(title, target) {
        return target.text;
      },
          peg$c146 = function peg$c146(title, related_article_num, table_struct_title) {
        return {
          text: text(),
          title: title,
          related_article_num: related_article_num,
          table_struct_title: table_struct_title
        };
      },
          peg$c147 = function peg$c147(title_struct) {
        return title_struct;
      },
          peg$c148 = peg$otherExpectation("appdx_table"),
          peg$c149 = function peg$c149(title_struct, target) {
        return target;
      },
          peg$c150 = function peg$c150(title_struct, children) {
        var appdx_table = new EL("AppdxTable");
        if (title_struct.table_struct_title !== "") {
          console.error("### line " + location().start.line + ": Maybe irregular AppdxTableTitle!");
          appdx_table.append(new EL("AppdxTableTitle", {}, [title_struct.text]));
        } else {
          appdx_table.append(new EL("AppdxTableTitle", {}, [title_struct.title]));
          if (title_struct.related_article_num !== null) {
            appdx_table.append(new EL("RelatedArticleNum", {}, [title_struct.related_article_num]));
          }
        }
        appdx_table.extend(children || []);

        return appdx_table;
      },
          peg$c151 = peg$otherExpectation("appdx_table_children"),
          peg$c152 = function peg$c152(table_struct) {
        return [table_struct];
      },
          peg$c153 = peg$otherExpectation("appdx_style_title"),
          peg$c154 = "\u69D8\u5F0F",
          peg$c155 = peg$literalExpectation("\u69D8\u5F0F", false),
          peg$c156 = function peg$c156(title, related_article_num, style_struct_title) {
        return {
          text: text(),
          title: title,
          related_article_num: related_article_num,
          style_struct_title: style_struct_title
        };
      },
          peg$c157 = peg$otherExpectation("appdx_style"),
          peg$c158 = function peg$c158(title_struct, first, _target) {
        return _target;
      },
          peg$c159 = function peg$c159(title_struct, first, rest) {
        return [first].concat(rest);
      },
          peg$c160 = function peg$c160(title_struct, children) {
        var appdx_style = new EL("AppdxStyle");
        appdx_style.append(new EL("AppdxStyleTitle", {}, [title_struct.title]));
        if (title_struct.related_article_num !== null) {
          appdx_style.append(new EL("RelatedArticleNum", {}, [title_struct.related_article_num]));
        }
        appdx_style.extend(children || []);

        return appdx_style;
      },
          peg$c161 = peg$otherExpectation("appdx_style_children"),
          peg$c162 = peg$otherExpectation("suppl_provision_label"),
          peg$c163 = /^[\u9644\u4ED8]/,
          peg$c164 = peg$classExpectation(["\u9644", "\u4ED8"], false, false),
          peg$c165 = "\u5247",
          peg$c166 = peg$literalExpectation("\u5247", false),
          peg$c167 = function peg$c167(label, target) {
        return target.content;
      },
          peg$c168 = "\u6284",
          peg$c169 = peg$literalExpectation("\u6284", false),
          peg$c170 = function peg$c170(label, amend_law_num, extract) {
        return {
          label: label,
          amend_law_num: amend_law_num,
          extract: extract
        };
      },
          peg$c171 = peg$otherExpectation("suppl_provision"),
          peg$c172 = function peg$c172(suppl_provision_label, first, rest) {
        return [first].concat(rest);
      },
          peg$c173 = function peg$c173(suppl_provision_label, children) {
        var suppl_provision = new EL("SupplProvision");
        if (suppl_provision_label.amend_law_num !== null) {
          suppl_provision.attr["AmendLawNum"] = suppl_provision_label.amend_law_num;
        }
        if (suppl_provision_label.extract !== null) {
          suppl_provision.attr["Extract"] = "true";
        }
        suppl_provision.append(new EL("SupplProvisionLabel", {}, [suppl_provision_label.label]));
        suppl_provision.extend(children);
        return suppl_provision;
      },
          peg$c174 = peg$otherExpectation("columns_or_sentences"),
          peg$c175 = function peg$c175(inline) {
        console.error("### line " + location().start.line + ": Maybe mismatched parenthesis!");
        var sentence = new EL("Sentence", {}, [inline]);
        return [sentence];
      },
          peg$c176 = peg$otherExpectation("period_sentences"),
          peg$c177 = function peg$c177(fragments) {
        var sentences = [];
        for (var i = 0; i < fragments.length; i++) {
          var sentence_str = fragments[i];
          var sentence = new EL("Sentence", {}, [sentence_str]);
          sentences.push(sentence);
        }
        return sentences;
      },
          peg$c178 = peg$otherExpectation("columns"),
          peg$c179 = function peg$c179(first, target) {
        return target;
      },
          peg$c180 = function peg$c180(first, rest) {
        var column_inner_sets = [first].concat(rest);
        var columns = [];
        for (var i = 0; i < column_inner_sets.length; i++) {
          var column = new EL("Column", {}, column_inner_sets[i]);
          columns.push(column);
        }
        return columns;
      },
          peg$c181 = peg$otherExpectation("INLINE"),
          peg$c182 = /^[^\r\n]/,
          peg$c183 = peg$classExpectation(["\r", "\n"], true, false),
          peg$c184 = peg$otherExpectation("NEXTINLINE"),
          peg$c185 = /^[\r\n]/,
          peg$c186 = peg$classExpectation(["\r", "\n"], false, false),
          peg$c187 = function peg$c187(inline) {
        return {
          text: text(),
          inline: inline
        };
      },
          peg$c188 = peg$otherExpectation("NOT_PARENTHESIS_CHAR"),
          peg$c189 = /^[^\r\n()\uFF08\uFF09[\]\uFF3B\uFF3D{}\uFF5B\uFF5D\u300C\u300D]/,
          peg$c190 = peg$classExpectation(["\r", "\n", "(", ")", "\uFF08", "\uFF09", "[", "]", "\uFF3B", "\uFF3D", "{", "}", "\uFF5B", "\uFF5D", "\u300C", "\u300D"], true, false),
          peg$c191 = peg$otherExpectation("INLINE_FRAGMENT"),
          peg$c192 = /^[^\r\n()\uFF08\uFF09[\]\uFF3B\uFF3D{}\uFF5B\uFF5D\u300C\u300D \u3000\t]/,
          peg$c193 = peg$classExpectation(["\r", "\n", "(", ")", "\uFF08", "\uFF09", "[", "]", "\uFF3B", "\uFF3D", "{", "}", "\uFF5B", "\uFF5D", "\u300C", "\u300D", " ", "\u3000", "\t"], true, false),
          peg$c194 = peg$otherExpectation("PERIOD_SENTENCE_FRAGMENT"),
          peg$c195 = /^[^\r\n()\uFF08\uFF09[\]\uFF3B\uFF3D{}\uFF5B\uFF5D\u300C\u300D \u3000\t\u3002]/,
          peg$c196 = peg$classExpectation(["\r", "\n", "(", ")", "\uFF08", "\uFF09", "[", "]", "\uFF3B", "\uFF3D", "{", "}", "\uFF5B", "\uFF5D", "\u300C", "\u300D", " ", "\u3000", "\t", "\u3002"], true, false),
          peg$c197 = "\u3002",
          peg$c198 = peg$literalExpectation("\u3002", false),
          peg$c199 = peg$otherExpectation("OUTSIDE_PARENTHESES_INLINE"),
          peg$c200 = peg$otherExpectation("PARENTHESES_INLINE"),
          peg$c201 = peg$otherExpectation("ROUND_PARENTHESES_INLINE"),
          peg$c202 = /^[(\uFF08]/,
          peg$c203 = peg$classExpectation(["(", "\uFF08"], false, false),
          peg$c204 = /^[)\uFF09]/,
          peg$c205 = peg$classExpectation([")", "\uFF09"], false, false),
          peg$c206 = function peg$c206(content) {
        return {
          text: text(),
          content: content
        };
      },
          peg$c207 = peg$otherExpectation("SQUARE_BRACKETS_INLINE"),
          peg$c208 = /^[[\uFF3B]/,
          peg$c209 = peg$classExpectation(["[", "\uFF3B"], false, false),
          peg$c210 = /^[\]\uFF3D]/,
          peg$c211 = peg$classExpectation(["]", "\uFF3D"], false, false),
          peg$c212 = peg$otherExpectation("CURLY_BRACKETS_INLINE"),
          peg$c213 = /^[{\uFF5B]/,
          peg$c214 = peg$classExpectation(["{", "\uFF5B"], false, false),
          peg$c215 = /^[}\uFF5D]/,
          peg$c216 = peg$classExpectation(["}", "\uFF5D"], false, false),
          peg$c217 = peg$otherExpectation("SQUARE_PARENTHESES_INLINE"),
          peg$c218 = /^[\u300C]/,
          peg$c219 = peg$classExpectation(["\u300C"], false, false),
          peg$c220 = /^[^\r\n\u300C\u300D]/,
          peg$c221 = peg$classExpectation(["\r", "\n", "\u300C", "\u300D"], true, false),
          peg$c222 = /^[\u300D]/,
          peg$c223 = peg$classExpectation(["\u300D"], false, false),
          peg$c224 = peg$otherExpectation("INDENT"),
          peg$c225 = "<INDENT str=\"",
          peg$c226 = peg$literalExpectation("<INDENT str=\"", false),
          peg$c227 = /^[^"]/,
          peg$c228 = peg$classExpectation(["\""], true, false),
          peg$c229 = "\">",
          peg$c230 = peg$literalExpectation("\">", false),
          peg$c231 = function peg$c231(str) {
        return str;
      },
          peg$c232 = peg$otherExpectation("DEDENT"),
          peg$c233 = "<DEDENT>",
          peg$c234 = peg$literalExpectation("<DEDENT>", false),
          peg$c235 = /^[ \u3000\t]/,
          peg$c236 = peg$classExpectation([" ", "\u3000", "\t"], false, false),
          peg$c237 = peg$otherExpectation("WHITESPACES"),
          peg$c238 = peg$otherExpectation("NEWLINE"),
          peg$c239 = /^[\r]/,
          peg$c240 = peg$classExpectation(["\r"], false, false),
          peg$c241 = /^[\n]/,
          peg$c242 = peg$classExpectation(["\n"], false, false),
          peg$currPos = 0,
          peg$savedPos = 0,
          peg$posDetailsCache = [{ line: 1, column: 1 }],
          peg$maxFailPos = 0,
          peg$maxFailExpected = [],
          peg$silentFails = 0,
          peg$result;

      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }

      function text() {
        return input.substring(peg$savedPos, peg$currPos);
      }

      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }

      function expected(description, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
      }

      function error(message, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

        throw peg$buildSimpleError(message, location);
      }

      function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text: text, ignoreCase: ignoreCase };
      }

      function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
      }

      function peg$anyExpectation() {
        return { type: "any" };
      }

      function peg$endExpectation() {
        return { type: "end" };
      }

      function peg$otherExpectation(description) {
        return { type: "other", description: description };
      }

      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos],
            p;

        if (details) {
          return details;
        } else {
          p = pos - 1;
          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };

          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
            endPosDetails = peg$computePosDetails(endPos);

        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
      }

      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
      }

      function peg$parsestart() {
        var s0, s1, s2, s3, s4;

        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseNEWLINE();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseNEWLINE();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parselaw();
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c0);
              }
            }
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parselaw() {
        var s0, s1, s2, s3, s4, s5, s6;

        s0 = peg$currPos;
        s1 = peg$parselaw_title();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseenact_statement();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseenact_statement();
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsetoc();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsemain_provision();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseappdx_item();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseappdx_item();
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c2(s1, s2, s3, s4, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parselaw_title() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parseINLINE();
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseNEWLINE();
          if (s2 !== peg$FAILED) {
            s3 = peg$parsePARENTHESES_INLINE();
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseNEWLINE();
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parseNEWLINE();
                }
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c4(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$parseINLINE();
          if (s2 !== peg$FAILED) {
            s1 = input.substring(s1, peg$currPos);
          } else {
            s1 = s2;
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseNEWLINE();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseNEWLINE();
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c5(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c3);
          }
        }

        return s0;
      }

      function peg$parseenact_statement() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse__();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parsetoc_label();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parsearticle_title();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parseINLINE();
              if (s5 !== peg$FAILED) {
                s4 = input.substring(s4, peg$currPos);
              } else {
                s4 = s5;
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseNEWLINE();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseNEWLINE();
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        return s0;
      }

      function peg$parsetoc_label() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parseNEWLINE();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = [];
              if (peg$c9.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                if (peg$c9.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c10);
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c11) {
                  s6 = peg$c11;
                  peg$currPos += 2;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c12);
                  }
                }
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;
                peg$silentFails++;
                s6 = peg$parseNEWLINE();
                peg$silentFails--;
                if (s6 !== peg$FAILED) {
                  peg$currPos = s5;
                  s5 = void 0;
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  s1 = [s1, s2, s3, s4, s5];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }

        return s0;
      }

      function peg$parsetoc() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsetoc_label();
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseNEWLINE();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseINDENT();
            if (s3 !== peg$FAILED) {
              s4 = peg$parsetoc_item();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$currPos;
                s7 = peg$parsetoc_item();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s6;
                  s7 = peg$c14(s1, s4, s7);
                }
                s6 = s7;
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$currPos;
                  s7 = peg$parsetoc_item();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s6;
                    s7 = peg$c14(s1, s4, s7);
                  }
                  s6 = s7;
                }
                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parseNEWLINE();
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parseNEWLINE();
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseDEDENT();
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c15(s1, s4, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c13);
          }
        }

        return s0;
      }

      function peg$parsetoc_item() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parseNEWLINE();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parseOUTSIDE_PARENTHESES_INLINE();
              if (s5 !== peg$FAILED) {
                s4 = input.substring(s4, peg$currPos);
              } else {
                s4 = s5;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;
                s6 = peg$parseROUND_PARENTHESES_INLINE();
                if (s6 !== peg$FAILED) {
                  s5 = input.substring(s5, peg$currPos);
                } else {
                  s5 = s6;
                }
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseNEWLINE();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$currPos;
                    s8 = peg$parseINDENT();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsetoc_item();
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$currPos;
                        s12 = peg$parsetoc_item();
                        if (s12 !== peg$FAILED) {
                          peg$savedPos = s11;
                          s12 = peg$c17(s4, s5, s9, s12);
                        }
                        s11 = s12;
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$currPos;
                          s12 = peg$parsetoc_item();
                          if (s12 !== peg$FAILED) {
                            peg$savedPos = s11;
                            s12 = peg$c17(s4, s5, s9, s12);
                          }
                          s11 = s12;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = [];
                          s12 = peg$parseNEWLINE();
                          while (s12 !== peg$FAILED) {
                            s11.push(s12);
                            s12 = peg$parseNEWLINE();
                          }
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseDEDENT();
                            if (s12 !== peg$FAILED) {
                              peg$savedPos = s7;
                              s8 = peg$c18(s4, s5, s9, s10);
                              s7 = s8;
                            } else {
                              peg$currPos = s7;
                              s7 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s7;
                            s7 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s7;
                          s7 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c19(s4, s5, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c16);
          }
        }

        return s0;
      }

      function peg$parsemain_provision() {
        var s0, s1, s2;

        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsearticle();
        if (s2 === peg$FAILED) {
          s2 = peg$parsearticle_group();
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsearticle();
            if (s2 === peg$FAILED) {
              s2 = peg$parsearticle_group();
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c20(s1);
        }
        s0 = s1;

        return s0;
      }

      function peg$parsearticle_group_title() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse__();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 31532) {
            s3 = peg$c22;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c23);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            if (peg$c24.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c25);
              }
            }
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                if (peg$c24.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c25);
                  }
                }
              }
            } else {
              s4 = peg$FAILED;
            }
            if (s4 !== peg$FAILED) {
              if (peg$c26.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c27);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 12398) {
                  s7 = peg$c28;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c29);
                  }
                }
                if (s7 !== peg$FAILED) {
                  s8 = [];
                  if (peg$c30.test(input.charAt(peg$currPos))) {
                    s9 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s9 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c31);
                    }
                  }
                  if (s9 !== peg$FAILED) {
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      if (peg$c30.test(input.charAt(peg$currPos))) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c31);
                        }
                      }
                    }
                  } else {
                    s8 = peg$FAILED;
                  }
                  if (s8 !== peg$FAILED) {
                    s7 = [s7, s8];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
                if (s6 === peg$FAILED) {
                  s6 = null;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$currPos;
                  s8 = peg$parse__();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseINLINE();
                    if (s9 !== peg$FAILED) {
                      s8 = [s8, s9];
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c32(s5);
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseNEWLINE();
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseNEWLINE();
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c33(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c21);
          }
        }

        return s0;
      }

      function peg$parsearticle_group() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsearticle_group_title();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsearticle();
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$currPos;
            peg$silentFails++;
            s5 = peg$currPos;
            s6 = peg$parsearticle_group_title();
            if (s6 !== peg$FAILED) {
              peg$savedPos = peg$currPos;
              s7 = peg$c35(s1, s6);
              if (s7) {
                s7 = void 0;
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                s6 = [s6, s7];
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            peg$silentFails--;
            if (s5 !== peg$FAILED) {
              peg$currPos = s4;
              s4 = void 0;
            } else {
              s4 = peg$FAILED;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsearticle_group();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c36(s1, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsearticle();
              if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$currPos;
                peg$silentFails++;
                s5 = peg$currPos;
                s6 = peg$parsearticle_group_title();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = peg$currPos;
                  s7 = peg$c35(s1, s6);
                  if (s7) {
                    s7 = void 0;
                  } else {
                    s7 = peg$FAILED;
                  }
                  if (s7 !== peg$FAILED) {
                    s6 = [s6, s7];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
                peg$silentFails--;
                if (s5 !== peg$FAILED) {
                  peg$currPos = s4;
                  s4 = void 0;
                } else {
                  s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsearticle_group();
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c36(s1, s5);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c37(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c34);
          }
        }

        return s0;
      }

      function peg$parsearticle_paragraph_caption() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse__();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseROUND_PARENTHESES_INLINE();
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseNEWLINE();
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;
              if (peg$c30.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c31);
                }
              }
              peg$silentFails--;
              if (s5 !== peg$FAILED) {
                peg$currPos = s4;
                s4 = void 0;
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }

        return s0;
      }

      function peg$parsearticle_title() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 31532) {
          s1 = peg$c22;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c23);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c41.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c42);
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c41.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c42);
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 26465) {
              s3 = peg$c43;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c44);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 12398) {
                s5 = peg$c28;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c29);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                if (peg$c30.test(input.charAt(peg$currPos))) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c31);
                  }
                }
                if (s7 !== peg$FAILED) {
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    if (peg$c30.test(input.charAt(peg$currPos))) {
                      s7 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c31);
                      }
                    }
                  }
                } else {
                  s6 = peg$FAILED;
                }
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c40);
          }
        }

        return s0;
      }

      function peg$parsearticle() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsearticle_paragraph_caption();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parsearticle_title();
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecolumns_or_sentences();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c46(s1, s2, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c47(s1, s2);
              }
              s3 = s4;
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseNEWLINE();
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parseNEWLINE();
                }
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;
                s6 = peg$parseINDENT();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseINDENT();
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parselist();
                    if (s9 !== peg$FAILED) {
                      while (s9 !== peg$FAILED) {
                        s8.push(s9);
                        s9 = peg$parselist();
                      }
                    } else {
                      s8 = peg$FAILED;
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$parseNEWLINE();
                      while (s10 !== peg$FAILED) {
                        s9.push(s10);
                        s10 = peg$parseNEWLINE();
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseDEDENT();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseDEDENT();
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s5;
                            s6 = peg$c48(s1, s2, s3, s8);
                            s5 = s6;
                          } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s5;
                          s5 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$currPos;
                  s7 = peg$parseINDENT();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseparagraph_item_child();
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$currPos;
                      s11 = peg$parseparagraph_item_child();
                      if (s11 !== peg$FAILED) {
                        peg$savedPos = s10;
                        s11 = peg$c49(s1, s2, s3, s5, s8, s11);
                      }
                      s10 = s11;
                      while (s10 !== peg$FAILED) {
                        s9.push(s10);
                        s10 = peg$currPos;
                        s11 = peg$parseparagraph_item_child();
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = s10;
                          s11 = peg$c49(s1, s2, s3, s5, s8, s11);
                        }
                        s10 = s11;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$parseNEWLINE();
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$parseNEWLINE();
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseDEDENT();
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s6;
                            s7 = peg$c50(s1, s2, s3, s5, s8, s9);
                            s6 = s7;
                          } else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    s8 = peg$parseparagraph_item();
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parseparagraph_item();
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$currPos;
                      s9 = peg$parseINDENT();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseparagraph_item_child();
                        if (s10 !== peg$FAILED) {
                          s11 = [];
                          s12 = peg$currPos;
                          s13 = peg$parseparagraph_item_child();
                          if (s13 !== peg$FAILED) {
                            peg$savedPos = s12;
                            s13 = peg$c51(s1, s2, s3, s5, s6, s7, s10, s13);
                          }
                          s12 = s13;
                          while (s12 !== peg$FAILED) {
                            s11.push(s12);
                            s12 = peg$currPos;
                            s13 = peg$parseparagraph_item_child();
                            if (s13 !== peg$FAILED) {
                              peg$savedPos = s12;
                              s13 = peg$c51(s1, s2, s3, s5, s6, s7, s10, s13);
                            }
                            s12 = s13;
                          }
                          if (s11 !== peg$FAILED) {
                            s12 = [];
                            s13 = peg$parseNEWLINE();
                            while (s13 !== peg$FAILED) {
                              s12.push(s13);
                              s13 = peg$parseNEWLINE();
                            }
                            if (s12 !== peg$FAILED) {
                              s13 = peg$parseDEDENT();
                              if (s13 !== peg$FAILED) {
                                peg$savedPos = s8;
                                s9 = peg$c52(s1, s2, s3, s5, s6, s7, s10, s11);
                                s8 = s9;
                              } else {
                                peg$currPos = s8;
                                s8 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s8;
                              s8 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                      if (s8 === peg$FAILED) {
                        s8 = null;
                      }
                      if (s8 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c53(s1, s2, s3, s5, s6, s7, s8);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }

        return s0;
      }

      function peg$parseparagraph_item() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsearticle_paragraph_caption();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parsearticle_title();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$currPos;
            peg$silentFails++;
            s6 = peg$parseappdx_table_title();
            peg$silentFails--;
            if (s6 === peg$FAILED) {
              s5 = void 0;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              peg$silentFails++;
              s7 = peg$parseappdx_style_title();
              peg$silentFails--;
              if (s7 === peg$FAILED) {
                s6 = void 0;
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$currPos;
                peg$silentFails++;
                s8 = peg$parsesuppl_provision_label();
                peg$silentFails--;
                if (s8 === peg$FAILED) {
                  s7 = void 0;
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
                if (s7 !== peg$FAILED) {
                  s8 = [];
                  if (peg$c55.test(input.charAt(peg$currPos))) {
                    s9 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s9 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c56);
                    }
                  }
                  if (s9 !== peg$FAILED) {
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      if (peg$c55.test(input.charAt(peg$currPos))) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c56);
                        }
                      }
                    }
                  } else {
                    s8 = peg$FAILED;
                  }
                  if (s8 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7, s8];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parse__();
            if (s3 !== peg$FAILED) {
              s4 = peg$parsecolumns_or_sentences();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseNEWLINE();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseNEWLINE();
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$currPos;
                  s7 = peg$parseINDENT();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseINDENT();
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$parselist();
                      if (s10 !== peg$FAILED) {
                        while (s10 !== peg$FAILED) {
                          s9.push(s10);
                          s10 = peg$parselist();
                        }
                      } else {
                        s9 = peg$FAILED;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$parseNEWLINE();
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$parseNEWLINE();
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseDEDENT();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseDEDENT();
                            if (s12 !== peg$FAILED) {
                              peg$savedPos = s6;
                              s7 = peg$c57(s1, s2, s4, s9);
                              s6 = s7;
                            } else {
                              peg$currPos = s6;
                              s6 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$currPos;
                    s8 = peg$parseINDENT();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseparagraph_item_child();
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$currPos;
                        s12 = peg$parseparagraph_item_child();
                        if (s12 !== peg$FAILED) {
                          peg$savedPos = s11;
                          s12 = peg$c58(s1, s2, s4, s6, s9, s12);
                        }
                        s11 = s12;
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$currPos;
                          s12 = peg$parseparagraph_item_child();
                          if (s12 !== peg$FAILED) {
                            peg$savedPos = s11;
                            s12 = peg$c58(s1, s2, s4, s6, s9, s12);
                          }
                          s11 = s12;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = [];
                          s12 = peg$parseNEWLINE();
                          while (s12 !== peg$FAILED) {
                            s11.push(s12);
                            s12 = peg$parseNEWLINE();
                          }
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseDEDENT();
                            if (s12 !== peg$FAILED) {
                              peg$savedPos = s7;
                              s8 = peg$c59(s1, s2, s4, s6, s9, s10);
                              s7 = s8;
                            } else {
                              peg$currPos = s7;
                              s7 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s7;
                            s7 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s7;
                          s7 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c60(s1, s2, s4, s6, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c54);
          }
        }

        return s0;
      }

      function peg$parseno_name_paragraph() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsecolumns_or_sentences();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNEWLINE();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNEWLINE();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseINDENT();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseINDENT();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parselist();
                if (s7 !== peg$FAILED) {
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parselist();
                  }
                } else {
                  s6 = peg$FAILED;
                }
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parseNEWLINE();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parseNEWLINE();
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseDEDENT();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseDEDENT();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c62(s1, s6);
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parseINDENT();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseparagraph_item_child();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$currPos;
                  s9 = peg$parseparagraph_item_child();
                  if (s9 !== peg$FAILED) {
                    peg$savedPos = s8;
                    s9 = peg$c63(s1, s3, s6, s9);
                  }
                  s8 = s9;
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$currPos;
                    s9 = peg$parseparagraph_item_child();
                    if (s9 !== peg$FAILED) {
                      peg$savedPos = s8;
                      s9 = peg$c63(s1, s3, s6, s9);
                    }
                    s8 = s9;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parseNEWLINE();
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$parseNEWLINE();
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseDEDENT();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s4;
                        s5 = peg$c64(s1, s3, s6, s7);
                        s4 = s5;
                      } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s4;
                      s4 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c65(s1, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c61);
          }
        }

        return s0;
      }

      function peg$parseparagraph_item_child() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$parsetable_struct();
        if (s0 === peg$FAILED) {
          s0 = peg$parseparagraph_item();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c66);
          }
        }

        return s0;
      }

      function peg$parselist() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsecolumns_or_sentences();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNEWLINE();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNEWLINE();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c68(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c67);
          }
        }

        return s0;
      }

      function peg$parsetable_struct() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parseNEWLINE();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsetable_struct_title();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseremarks();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseremarks();
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsetable();
                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    s8 = peg$parseremarks();
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parseremarks();
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c70(s4, s5, s6, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c69);
          }
        }

        return s0;
      }

      function peg$parsetable_struct_title() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 20) === peg$c72) {
          s1 = peg$c72;
          peg$currPos += 20;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c73);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseINLINE();
            if (s4 !== peg$FAILED) {
              s3 = input.substring(s3, peg$currPos);
            } else {
              s3 = s4;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseNEWLINE();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c74(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c71);
          }
        }

        return s0;
      }

      function peg$parsetable() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 42) {
          s3 = peg$c76;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c77);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsetable_column();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c78) {
                s8 = peg$c78;
                peg$currPos += 2;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c79);
                }
              }
              if (s8 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 12288) {
                  s8 = peg$c80;
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c81);
                  }
                }
                if (s8 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 9) {
                    s8 = peg$c82;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c83);
                    }
                  }
                }
              }
              if (s8 !== peg$FAILED) {
                s9 = peg$parsetable_column();
                if (s9 !== peg$FAILED) {
                  peg$savedPos = s7;
                  s8 = peg$c84(s5, s9);
                  s7 = s8;
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
              } else {
                peg$currPos = s7;
                s7 = peg$FAILED;
              }
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c78) {
                  s8 = peg$c78;
                  peg$currPos += 2;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c79);
                  }
                }
                if (s8 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 12288) {
                    s8 = peg$c80;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c81);
                    }
                  }
                  if (s8 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 9) {
                      s8 = peg$c82;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c83);
                      }
                    }
                  }
                }
                if (s8 !== peg$FAILED) {
                  s9 = peg$parsetable_column();
                  if (s9 !== peg$FAILED) {
                    peg$savedPos = s7;
                    s8 = peg$c84(s5, s9);
                    s7 = s8;
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s7;
                  s7 = peg$FAILED;
                }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c85(s5, s6);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
              s3 = peg$c76;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c77);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse__();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsetable_column();
                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c78) {
                    s8 = peg$c78;
                    peg$currPos += 2;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c79);
                    }
                  }
                  if (s8 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 12288) {
                      s8 = peg$c80;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c81);
                      }
                    }
                    if (s8 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 9) {
                        s8 = peg$c82;
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c83);
                        }
                      }
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsetable_column();
                    if (s9 !== peg$FAILED) {
                      peg$savedPos = s7;
                      s8 = peg$c84(s5, s9);
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$FAILED;
                  }
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c78) {
                      s8 = peg$c78;
                      peg$currPos += 2;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c79);
                      }
                    }
                    if (s8 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 12288) {
                        s8 = peg$c80;
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c81);
                        }
                      }
                      if (s8 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 9) {
                          s8 = peg$c82;
                          peg$currPos++;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c83);
                          }
                        }
                      }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsetable_column();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s7;
                        s8 = peg$c84(s5, s9);
                        s7 = s8;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c85(s5, s6);
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c86(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c75);
          }
        }

        return s0;
      }

      function peg$parsetable_column() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c88;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c89);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse__();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s5 = peg$c90;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c91);
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              s7 = [];
              if (peg$c92.test(input.charAt(peg$currPos))) {
                s8 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c93);
                }
              }
              if (s8 !== peg$FAILED) {
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  if (peg$c92.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c93);
                    }
                  }
                }
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                s6 = input.substring(s6, peg$currPos);
              } else {
                s6 = s7;
              }
              if (s6 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c94) {
                  s7 = peg$c94;
                  peg$currPos += 2;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c95);
                  }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$currPos;
                  s9 = [];
                  if (peg$c96.test(input.charAt(peg$currPos))) {
                    s10 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c97);
                    }
                  }
                  if (s10 !== peg$FAILED) {
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      if (peg$c96.test(input.charAt(peg$currPos))) {
                        s10 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c97);
                        }
                      }
                    }
                  } else {
                    s9 = peg$FAILED;
                  }
                  if (s9 !== peg$FAILED) {
                    s8 = input.substring(s8, peg$currPos);
                  } else {
                    s8 = s9;
                  }
                  if (s8 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c98) {
                      s9 = peg$c98;
                      peg$currPos += 2;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c99);
                      }
                    }
                    if (s9 !== peg$FAILED) {
                      peg$savedPos = s4;
                      s5 = peg$c100(s6, s8);
                      s4 = s5;
                    } else {
                      peg$currPos = s4;
                      s4 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 91) {
                s5 = peg$c90;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c91);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                s7 = [];
                if (peg$c92.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c93);
                  }
                }
                if (s8 !== peg$FAILED) {
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    if (peg$c92.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c93);
                      }
                    }
                  }
                } else {
                  s7 = peg$FAILED;
                }
                if (s7 !== peg$FAILED) {
                  s6 = input.substring(s6, peg$currPos);
                } else {
                  s6 = s7;
                }
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c94) {
                    s7 = peg$c94;
                    peg$currPos += 2;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c95);
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$currPos;
                    s9 = [];
                    if (peg$c96.test(input.charAt(peg$currPos))) {
                      s10 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s10 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c97);
                      }
                    }
                    if (s10 !== peg$FAILED) {
                      while (s10 !== peg$FAILED) {
                        s9.push(s10);
                        if (peg$c96.test(input.charAt(peg$currPos))) {
                          s10 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s10 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c97);
                          }
                        }
                      }
                    } else {
                      s9 = peg$FAILED;
                    }
                    if (s9 !== peg$FAILED) {
                      s8 = input.substring(s8, peg$currPos);
                    } else {
                      s8 = s9;
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c98) {
                        s9 = peg$c98;
                        peg$currPos += 2;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c99);
                        }
                      }
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s4;
                        s5 = peg$c100(s6, s8);
                        s4 = s5;
                      } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s4;
                      s4 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parseINLINE();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s4 = input.substring(s4, peg$currPos);
              } else {
                s4 = s5;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseNEWLINE();
                if (s5 !== peg$FAILED) {
                  s6 = peg$currPos;
                  s7 = peg$parseINDENT();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseINDENT();
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$currPos;
                      s11 = peg$currPos;
                      s12 = peg$parseINLINE();
                      if (s12 !== peg$FAILED) {
                        s11 = input.substring(s11, peg$currPos);
                      } else {
                        s11 = s12;
                      }
                      if (s11 !== peg$FAILED) {
                        s12 = peg$parseNEWLINE();
                        if (s12 !== peg$FAILED) {
                          peg$savedPos = s10;
                          s11 = peg$c101(s3, s4, s11);
                          s10 = s11;
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s10;
                        s10 = peg$FAILED;
                      }
                      if (s10 !== peg$FAILED) {
                        while (s10 !== peg$FAILED) {
                          s9.push(s10);
                          s10 = peg$currPos;
                          s11 = peg$currPos;
                          s12 = peg$parseINLINE();
                          if (s12 !== peg$FAILED) {
                            s11 = input.substring(s11, peg$currPos);
                          } else {
                            s11 = s12;
                          }
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseNEWLINE();
                            if (s12 !== peg$FAILED) {
                              peg$savedPos = s10;
                              s11 = peg$c101(s3, s4, s11);
                              s10 = s11;
                            } else {
                              peg$currPos = s10;
                              s10 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s10;
                            s10 = peg$FAILED;
                          }
                        }
                      } else {
                        s9 = peg$FAILED;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$parseNEWLINE();
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$parseNEWLINE();
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseDEDENT();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseDEDENT();
                            if (s12 !== peg$FAILED) {
                              peg$savedPos = s6;
                              s7 = peg$c102(s3, s4, s9);
                              s6 = s7;
                            } else {
                              peg$currPos = s6;
                              s6 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c103(s3, s4, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 45) {
            s1 = peg$c88;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c89);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseNEWLINE();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c104();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c87);
          }
        }

        return s0;
      }

      function peg$parsestyle_struct() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parseNEWLINE();
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = void 0;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsestyle_struct_title();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseremarks();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseremarks();
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsestyle();
                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    s8 = peg$parseremarks();
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parseremarks();
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c106(s4, s5, s6, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c105);
          }
        }

        return s0;
      }

      function peg$parsestyle_struct_title() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 20) === peg$c108) {
          s1 = peg$c108;
          peg$currPos += 20;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c109);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseINLINE();
            if (s4 !== peg$FAILED) {
              s3 = input.substring(s3, peg$currPos);
            } else {
              s3 = s4;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseNEWLINE();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c110(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c107);
          }
        }

        return s0;
      }

      function peg$parsestyle() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsetable();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s1;
          s2 = peg$c112(s2);
        }
        s1 = s2;
        if (s1 === peg$FAILED) {
          s1 = peg$currPos;
          s2 = peg$parsefig();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s1;
            s2 = peg$c113(s2);
          }
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c114(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c111);
          }
        }

        return s0;
      }

      function peg$parseremarks() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c116) {
          s3 = peg$c116;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c117);
          }
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 27880) {
            s3 = peg$c118;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c119);
            }
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c30.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c30.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c31);
              }
            }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            s5 = peg$parseINLINE();
            if (s5 !== peg$FAILED) {
              s4 = input.substring(s4, peg$currPos);
            } else {
              s4 = s5;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c120(s1, s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseNEWLINE();
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parseINDENT();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseINDENT();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$currPos;
                  s9 = peg$currPos;
                  peg$silentFails++;
                  s10 = peg$currPos;
                  s11 = peg$c121;
                  if (s11 !== peg$FAILED) {
                    peg$savedPos = peg$currPos;
                    s12 = peg$c122(s1, s2);
                    if (s12) {
                      s12 = void 0;
                    } else {
                      s12 = peg$FAILED;
                    }
                    if (s12 !== peg$FAILED) {
                      s11 = [s11, s12];
                      s10 = s11;
                    } else {
                      peg$currPos = s10;
                      s10 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s10;
                    s10 = peg$FAILED;
                  }
                  peg$silentFails--;
                  if (s10 !== peg$FAILED) {
                    peg$currPos = s9;
                    s9 = void 0;
                  } else {
                    s9 = peg$FAILED;
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parseparagraph_item();
                    if (s10 !== peg$FAILED) {
                      s11 = peg$currPos;
                      peg$silentFails++;
                      s12 = peg$currPos;
                      s13 = peg$c121;
                      if (s13 !== peg$FAILED) {
                        peg$savedPos = peg$currPos;
                        s14 = peg$c123(s1, s2, s10);
                        if (s14) {
                          s14 = void 0;
                        } else {
                          s14 = peg$FAILED;
                        }
                        if (s14 !== peg$FAILED) {
                          s13 = [s13, s14];
                          s12 = s13;
                        } else {
                          peg$currPos = s12;
                          s12 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s12;
                        s12 = peg$FAILED;
                      }
                      peg$silentFails--;
                      if (s12 !== peg$FAILED) {
                        peg$currPos = s11;
                        s11 = void 0;
                      } else {
                        s11 = peg$FAILED;
                      }
                      if (s11 !== peg$FAILED) {
                        peg$savedPos = s8;
                        s9 = peg$c124(s1, s2, s10);
                        s8 = s9;
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s8;
                      s8 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  }
                  if (s8 === peg$FAILED) {
                    s8 = peg$currPos;
                    s9 = peg$currPos;
                    peg$silentFails++;
                    s10 = peg$currPos;
                    s11 = peg$c121;
                    if (s11 !== peg$FAILED) {
                      peg$savedPos = peg$currPos;
                      s12 = peg$c125(s1, s2);
                      if (s12) {
                        s12 = void 0;
                      } else {
                        s12 = peg$FAILED;
                      }
                      if (s12 !== peg$FAILED) {
                        s11 = [s11, s12];
                        s10 = s11;
                      } else {
                        peg$currPos = s10;
                        s10 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s10;
                      s10 = peg$FAILED;
                    }
                    peg$silentFails--;
                    if (s10 !== peg$FAILED) {
                      peg$currPos = s9;
                      s9 = void 0;
                    } else {
                      s9 = peg$FAILED;
                    }
                    if (s9 !== peg$FAILED) {
                      if (input.substr(peg$currPos, 5) === peg$c126) {
                        s10 = peg$c126;
                        peg$currPos += 5;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c127);
                        }
                      }
                      if (s10 !== peg$FAILED) {
                        s9 = [s9, s10];
                        s8 = s9;
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s8;
                      s8 = peg$FAILED;
                    }
                    if (s8 === peg$FAILED) {
                      s8 = peg$currPos;
                      s9 = peg$currPos;
                      s10 = peg$parseINLINE();
                      if (s10 !== peg$FAILED) {
                        s9 = input.substring(s9, peg$currPos);
                      } else {
                        s9 = s10;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseNEWLINE();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s8;
                          s9 = peg$c128(s1, s2, s9);
                          s8 = s9;
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$currPos;
                      s9 = peg$currPos;
                      peg$silentFails++;
                      s10 = peg$currPos;
                      s11 = peg$c121;
                      if (s11 !== peg$FAILED) {
                        peg$savedPos = peg$currPos;
                        s12 = peg$c122(s1, s2);
                        if (s12) {
                          s12 = void 0;
                        } else {
                          s12 = peg$FAILED;
                        }
                        if (s12 !== peg$FAILED) {
                          s11 = [s11, s12];
                          s10 = s11;
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s10;
                        s10 = peg$FAILED;
                      }
                      peg$silentFails--;
                      if (s10 !== peg$FAILED) {
                        peg$currPos = s9;
                        s9 = void 0;
                      } else {
                        s9 = peg$FAILED;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseparagraph_item();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$currPos;
                          peg$silentFails++;
                          s12 = peg$currPos;
                          s13 = peg$c121;
                          if (s13 !== peg$FAILED) {
                            peg$savedPos = peg$currPos;
                            s14 = peg$c123(s1, s2, s10);
                            if (s14) {
                              s14 = void 0;
                            } else {
                              s14 = peg$FAILED;
                            }
                            if (s14 !== peg$FAILED) {
                              s13 = [s13, s14];
                              s12 = s13;
                            } else {
                              peg$currPos = s12;
                              s12 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s12;
                            s12 = peg$FAILED;
                          }
                          peg$silentFails--;
                          if (s12 !== peg$FAILED) {
                            peg$currPos = s11;
                            s11 = void 0;
                          } else {
                            s11 = peg$FAILED;
                          }
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s8;
                            s9 = peg$c124(s1, s2, s10);
                            s8 = s9;
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                      if (s8 === peg$FAILED) {
                        s8 = peg$currPos;
                        s9 = peg$currPos;
                        peg$silentFails++;
                        s10 = peg$currPos;
                        s11 = peg$c121;
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = peg$currPos;
                          s12 = peg$c125(s1, s2);
                          if (s12) {
                            s12 = void 0;
                          } else {
                            s12 = peg$FAILED;
                          }
                          if (s12 !== peg$FAILED) {
                            s11 = [s11, s12];
                            s10 = s11;
                          } else {
                            peg$currPos = s10;
                            s10 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                        peg$silentFails--;
                        if (s10 !== peg$FAILED) {
                          peg$currPos = s9;
                          s9 = void 0;
                        } else {
                          s9 = peg$FAILED;
                        }
                        if (s9 !== peg$FAILED) {
                          if (input.substr(peg$currPos, 5) === peg$c126) {
                            s10 = peg$c126;
                            peg$currPos += 5;
                          } else {
                            s10 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c127);
                            }
                          }
                          if (s10 !== peg$FAILED) {
                            s9 = [s9, s10];
                            s8 = s9;
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                        if (s8 === peg$FAILED) {
                          s8 = peg$currPos;
                          s9 = peg$currPos;
                          s10 = peg$parseINLINE();
                          if (s10 !== peg$FAILED) {
                            s9 = input.substring(s9, peg$currPos);
                          } else {
                            s9 = s10;
                          }
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parseNEWLINE();
                            if (s10 !== peg$FAILED) {
                              peg$savedPos = s8;
                              s9 = peg$c128(s1, s2, s9);
                              s8 = s9;
                            } else {
                              peg$currPos = s8;
                              s8 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        }
                      }
                    }
                  } else {
                    s7 = peg$FAILED;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parseNEWLINE();
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$parseNEWLINE();
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseDEDENT();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseDEDENT();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s4;
                          s5 = peg$c129(s1, s2, s7);
                          s4 = s5;
                        } else {
                          peg$currPos = s4;
                          s4 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s4;
                      s4 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c130(s1, s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c115);
          }
        }

        return s0;
      }

      function peg$parsefig() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c132) {
          s1 = peg$c132;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c133);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse__();
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c134) {
              s3 = peg$c134;
              peg$currPos += 6;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c135);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c136) {
                  s5 = peg$c136;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c137);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$currPos;
                    s8 = peg$parseINLINE();
                    if (s8 !== peg$FAILED) {
                      s7 = input.substring(s7, peg$currPos);
                    } else {
                      s7 = s8;
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parseNEWLINE();
                      if (s8 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c138(s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c131);
          }
        }

        return s0;
      }

      function peg$parseappdx_item() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$parseappdx_table();
        if (s0 === peg$FAILED) {
          s0 = peg$parseappdx_style();
          if (s0 === peg$FAILED) {
            s0 = peg$parsesuppl_provision();
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c139);
          }
        }

        return s0;
      }

      function peg$parseappdx_table_title() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        s3 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c141) {
          s4 = peg$c141;
          peg$currPos += 2;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c142);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c143.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c144);
            }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c143.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c144);
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseROUND_PARENTHESES_INLINE();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c145(s2, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            s5 = [];
            if (peg$c143.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c144);
              }
            }
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              if (peg$c143.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c144);
                }
              }
            }
            if (s5 !== peg$FAILED) {
              s4 = input.substring(s4, peg$currPos);
            } else {
              s4 = s5;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c146(s2, s3, s4);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c147(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c140);
          }
        }

        return s0;
      }

      function peg$parseappdx_table() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseappdx_table_title();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNEWLINE();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNEWLINE();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseINDENT();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseappdx_table_children();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parseNEWLINE();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parseNEWLINE();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseDEDENT();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c149(s1, s5);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c150(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c148);
          }
        }

        return s0;
      }

      function peg$parseappdx_table_children() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsetable_struct();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c152(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = [];
          s1 = peg$parseparagraph_item();
          if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
              s0.push(s1);
              s1 = peg$parseparagraph_item();
            }
          } else {
            s0 = peg$FAILED;
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c151);
          }
        }

        return s0;
      }

      function peg$parseappdx_style_title() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        s3 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c154) {
          s4 = peg$c154;
          peg$currPos += 2;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c155);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c143.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c144);
            }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c143.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c144);
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseROUND_PARENTHESES_INLINE();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c145(s2, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            if (peg$c143.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c144);
              }
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c143.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c144);
                }
              }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c156(s2, s3, s4);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c147(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c153);
          }
        }

        return s0;
      }

      function peg$parseappdx_style() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseappdx_style_title();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNEWLINE();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNEWLINE();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseINDENT();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              s6 = peg$parsestyle_struct();
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$currPos;
                s9 = [];
                s10 = peg$parseNEWLINE();
                if (s10 !== peg$FAILED) {
                  while (s10 !== peg$FAILED) {
                    s9.push(s10);
                    s10 = peg$parseNEWLINE();
                  }
                } else {
                  s9 = peg$FAILED;
                }
                if (s9 !== peg$FAILED) {
                  s10 = peg$parsestyle_struct();
                  if (s10 !== peg$FAILED) {
                    peg$savedPos = s8;
                    s9 = peg$c158(s1, s6, s10);
                    s8 = s9;
                  } else {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s8;
                  s8 = peg$FAILED;
                }
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$currPos;
                  s9 = [];
                  s10 = peg$parseNEWLINE();
                  if (s10 !== peg$FAILED) {
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$parseNEWLINE();
                    }
                  } else {
                    s9 = peg$FAILED;
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parsestyle_struct();
                    if (s10 !== peg$FAILED) {
                      peg$savedPos = s8;
                      s9 = peg$c158(s1, s6, s10);
                      s8 = s9;
                    } else {
                      peg$currPos = s8;
                      s8 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  }
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s5;
                  s6 = peg$c159(s1, s6, s7);
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parseNEWLINE();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parseNEWLINE();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseDEDENT();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c149(s1, s5);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c160(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c157);
          }
        }

        return s0;
      }

      function peg$parseappdx_style_children() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsetable_struct();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c152(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsefig();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c113(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = [];
            s1 = peg$parseparagraph_item();
            if (s1 !== peg$FAILED) {
              while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parseparagraph_item();
              }
            } else {
              s0 = peg$FAILED;
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c161);
          }
        }

        return s0;
      }

      function peg$parsesuppl_provision_label() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse__();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$currPos;
          if (peg$c163.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c164);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 21063) {
                s6 = peg$c165;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c166);
                }
              }
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseROUND_PARENTHESES_INLINE();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c167(s2, s4);
            }
            s3 = s4;
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 25220) {
                  s6 = peg$c168;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c169);
                  }
                }
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseNEWLINE();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseNEWLINE();
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c170(s2, s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c162);
          }
        }

        return s0;
      }

      function peg$parsesuppl_provision() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsesuppl_provision_label();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsearticle();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsearticle();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = [];
            s3 = peg$parseparagraph_item();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseparagraph_item();
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 === peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parseno_name_paragraph();
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parseparagraph_item();
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parseparagraph_item();
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c172(s1, s3, s4);
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c173(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c171);
          }
        }

        return s0;
      }

      function peg$parsecolumns_or_sentences() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$parsecolumns();
        if (s0 === peg$FAILED) {
          s0 = peg$parseperiod_sentences();
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseINLINE();
            if (s2 !== peg$FAILED) {
              s1 = input.substring(s1, peg$currPos);
            } else {
              s1 = s2;
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c175(s1);
            }
            s0 = s1;
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c174);
          }
        }

        return s0;
      }

      function peg$parseperiod_sentences() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parsePERIOD_SENTENCE_FRAGMENT();
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parsePERIOD_SENTENCE_FRAGMENT();
            if (s3 !== peg$FAILED) {
              s2 = input.substring(s2, peg$currPos);
            } else {
              s2 = s3;
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c177(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c176);
          }
        }

        return s0;
      }

      function peg$parsecolumns() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseperiod_sentences();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseperiod_sentences();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c179(s1, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse__();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseperiod_sentences();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c179(s1, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c180(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c178);
          }
        }

        return s0;
      }

      function peg$parseINLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c182.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c183);
              }
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c182.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c183);
                  }
                }
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c181);
          }
        }

        return s0;
      }

      function peg$parseNEXTINLINE() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseINDENT();
        if (s2 === peg$FAILED) {
          s2 = peg$parseDEDENT();
          if (s2 === peg$FAILED) {
            if (peg$c185.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c186);
              }
            }
          }
        }
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseINDENT();
          if (s2 === peg$FAILED) {
            s2 = peg$parseDEDENT();
            if (s2 === peg$FAILED) {
              if (peg$c185.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c186);
                }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseINLINE();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c187(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c184);
          }
        }

        return s0;
      }

      function peg$parseNOT_PARENTHESIS_CHAR() {
        var s0, s1;

        peg$silentFails++;
        if (peg$c189.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c190);
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c188);
          }
        }

        return s0;
      }

      function peg$parseINLINE_FRAGMENT() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c192.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c193);
              }
            }
            if (s4 === peg$FAILED) {
              s4 = peg$parsePARENTHESES_INLINE();
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c192.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                  }
                }
                if (s4 === peg$FAILED) {
                  s4 = peg$parsePARENTHESES_INLINE();
                }
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c191);
          }
        }

        return s0;
      }

      function peg$parsePERIOD_SENTENCE_FRAGMENT() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c195.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c196);
              }
            }
            if (s4 === peg$FAILED) {
              s4 = peg$parsePARENTHESES_INLINE();
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c195.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c196);
                  }
                }
                if (s4 === peg$FAILED) {
                  s4 = peg$parsePARENTHESES_INLINE();
                }
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 12290) {
                s4 = peg$c197;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c198);
                }
              }
              if (s4 === peg$FAILED) {
                s4 = peg$currPos;
                peg$silentFails++;
                s5 = peg$parse__();
                peg$silentFails--;
                if (s5 !== peg$FAILED) {
                  peg$currPos = s4;
                  s4 = void 0;
                } else {
                  s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                  s4 = peg$currPos;
                  peg$silentFails++;
                  s5 = peg$parseNEWLINE();
                  peg$silentFails--;
                  if (s5 !== peg$FAILED) {
                    peg$currPos = s4;
                    s4 = void 0;
                  } else {
                    s4 = peg$FAILED;
                  }
                }
              }
              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 12290) {
            s0 = peg$c197;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c198);
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c194);
          }
        }

        return s0;
      }

      function peg$parseOUTSIDE_PARENTHESES_INLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parseINDENT();
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDEDENT();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseNOT_PARENTHESIS_CHAR();
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseNOT_PARENTHESIS_CHAR();
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c199);
          }
        }

        return s0;
      }

      function peg$parsePARENTHESES_INLINE() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$parseROUND_PARENTHESES_INLINE();
        if (s0 === peg$FAILED) {
          s0 = peg$parseSQUARE_BRACKETS_INLINE();
          if (s0 === peg$FAILED) {
            s0 = peg$parseCURLY_BRACKETS_INLINE();
            if (s0 === peg$FAILED) {
              s0 = peg$parseSQUARE_PARENTHESES_INLINE();
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c200);
          }
        }

        return s0;
      }

      function peg$parseROUND_PARENTHESES_INLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c202.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c203);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = peg$parseNOT_PARENTHESIS_CHAR();
          if (s4 === peg$FAILED) {
            s4 = peg$parsePARENTHESES_INLINE();
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseNOT_PARENTHESIS_CHAR();
            if (s4 === peg$FAILED) {
              s4 = peg$parsePARENTHESES_INLINE();
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            if (peg$c204.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c205);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c206(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c201);
          }
        }

        return s0;
      }

      function peg$parseSQUARE_BRACKETS_INLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c208.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c209);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = peg$parseNOT_PARENTHESIS_CHAR();
          if (s4 === peg$FAILED) {
            s4 = peg$parsePARENTHESES_INLINE();
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseNOT_PARENTHESIS_CHAR();
            if (s4 === peg$FAILED) {
              s4 = peg$parsePARENTHESES_INLINE();
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            if (peg$c210.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c211);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c206(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c207);
          }
        }

        return s0;
      }

      function peg$parseCURLY_BRACKETS_INLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c213.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c214);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = peg$parseNOT_PARENTHESIS_CHAR();
          if (s4 === peg$FAILED) {
            s4 = peg$parsePARENTHESES_INLINE();
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseNOT_PARENTHESIS_CHAR();
            if (s4 === peg$FAILED) {
              s4 = peg$parsePARENTHESES_INLINE();
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            if (peg$c215.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c216);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c206(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c212);
          }
        }

        return s0;
      }

      function peg$parseSQUARE_PARENTHESES_INLINE() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c218.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c219);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          if (peg$c220.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c221);
            }
          }
          if (s4 === peg$FAILED) {
            s4 = peg$parseSQUARE_PARENTHESES_INLINE();
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c220.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c221);
              }
            }
            if (s4 === peg$FAILED) {
              s4 = peg$parseSQUARE_PARENTHESES_INLINE();
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }
          if (s2 !== peg$FAILED) {
            if (peg$c222.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c223);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c206(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c217);
          }
        }

        return s0;
      }

      function peg$parseINDENT() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 13) === peg$c225) {
          s1 = peg$c225;
          peg$currPos += 13;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c226);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c227.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c228);
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c227.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c228);
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c229) {
              s3 = peg$c229;
              peg$currPos += 2;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c230);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c231(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c224);
          }
        }

        return s0;
      }

      function peg$parseDEDENT() {
        var s0, s1;

        peg$silentFails++;
        if (input.substr(peg$currPos, 8) === peg$c233) {
          s0 = peg$c233;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c234);
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c232);
          }
        }

        return s0;
      }

      function peg$parse_() {
        var s0, s1;

        s0 = [];
        if (peg$c235.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c236);
          }
        }
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c235.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c236);
            }
          }
        }

        return s0;
      }

      function peg$parse__() {
        var s0, s1;

        peg$silentFails++;
        s0 = [];
        if (peg$c235.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c236);
          }
        }
        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c235.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c236);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c237);
          }
        }

        return s0;
      }

      function peg$parseNEWLINE() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c239.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c240);
          }
        }
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          if (peg$c241.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c242);
            }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              peg$silentFails++;
              s6 = peg$parseNEWLINE();
              peg$silentFails--;
              if (s6 !== peg$FAILED) {
                peg$currPos = s5;
                s5 = void 0;
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c238);
          }
        }

        return s0;
      }

      var EL = function () {
        function EL(tag, attr, children) {
          _classCallCheck(this, EL);

          // if(!tag) {
          //     error(`${JSON.stringify(tag)} is invalid tag.`);
          // }
          this.tag = tag;
          this.attr = attr || {};
          this.children = children || [];
        }

        _createClass(EL, [{
          key: "append",
          value: function append(child) {
            if (child !== undefined && child !== null) {
              // if(!(child instanceof EL) && !(child instanceof String)) {
              //     error("child is not EL or String.");
              // }
              this.children.push(child);
            }
            return this;
          }
        }, {
          key: "extend",
          value: function extend(children) {
            // if(!Array.isArray(children)) {
            //     error(`${JSON.stringify(children).slice(0,100)} is not Array.`);
            // }
            // for(let i = 0; i < children.length; i++) {
            //     let child = children[i];
            //     if(!(child instanceof EL) && !(child instanceof String)) {
            //         error("child is not EL or String.");
            //     }
            // }
            this.children = this.children.concat(children);
            return this;
          }
        }]);

        return EL;
      }();

      var indent_depth = 0;

      var base_indent_stack = [];

      var paragraph_item_tags = {
        0: 'Paragraph', 1: 'Item',
        2: 'Subitem1', 3: 'Subitem2', 4: 'Subitem3',
        5: 'Subitem4', 6: 'Subitem5', 7: 'Subitem6',
        8: 'Subitem7', 9: 'Subitem8', 10: 'Subitem9',
        11: 'Subitem10'
      };
      var paragraph_item_title_tags = {
        0: 'ParagraphNum', 1: 'ItemTitle',
        2: 'Subitem1Title', 3: 'Subitem2Title', 4: 'Subitem3Title',
        5: 'Subitem4Title', 6: 'Subitem5Title', 7: 'Subitem6Title',
        8: 'Subitem7Title', 9: 'Subitem8Title', 10: 'Subitem9Title',
        11: 'Subitem10Title'
      };
      var paragraph_item_sentence_tags = {
        0: 'ParagraphSentence', 1: 'ItemSentence',
        2: 'Subitem1Sentence', 3: 'Subitem2Sentence', 4: 'Subitem3Sentence',
        5: 'Subitem4Sentence', 6: 'Subitem5Sentence', 7: 'Subitem6Sentence',
        8: 'Subitem7Sentence', 9: 'Subitem8Sentence', 10: 'Subitem9Sentence',
        11: 'Subitem10Sentence'
      };

      var indent_memo = options.indent_memo;

      var article_group_type_chars = "編章節款目";

      var article_group_type = {
        '編': 'Part', '章': 'Chapter', '節': 'Section',
        '款': 'Subsection', '目': 'Division',
        '条': 'Article', '則': 'SupplProvision'
      };

      var article_group_title_tag = {
        '編': 'PartTitle', '章': 'ChapterTitle', '節': 'SectionTitle',
        '款': 'SubsectionTitle', '目': 'DivisionTitle', '条': 'ArticleTitle',
        '則': 'SupplProvisionLabel'
      };

      peg$result = peg$startRuleFunction();

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
      }
    }

    module.exports = {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  }, {}], 3: [function (require, module, exports) {}, {}], 4: [function (require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
      return [];
    };

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
      return '/';
    };
    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
      return 0;
    };
  }, {}] }, {}, [1]);
