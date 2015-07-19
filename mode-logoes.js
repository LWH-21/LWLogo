﻿define("ace/mode/logoes_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var logoespHighlightRules = function() {


    var keywordMapper = this.createKeywordMapper({
        "variable.language": "",
        "keyword": 
            " alto amarillo avanza av azar azul" +
            " bajalapiz bl blanco borrapantalla bp "+
            " centro cian cierto cos coseno cuenta cuentarepite " +
            " devuelve dev diferencia division " +
            " ejecuta elegir elemento entero espera " +
            " falso fr frase " +
            " gd giraderecha gi giraizquierda gris " +
            " hasta haz hazlocal " +
            " igual? iguales? init! invierte " +
            "  " +
            " " +
            " limpia lista lista? local log10 " +
            " mayor? mayorque? magenta marron md menor? menorque? menos menosprimero menosultimo mezcla mientras mp muestra muestratortuga mt " +
            " negro no noigual? numero? " +
            " o ocultatortuga ot "+
            " palabra palabra? para pared& poncl poncolorlapiz pong pongrosor ponpos ponprimero ponrumbo ponultimo ponx ponxy pony pos potencia pp pri primero producto pu "+
            " quita " +
            " raizcuadrada rc re redondea rellena repite repitepara resto retrocede ro rojo rotula rumbo " +
            " si sen seno sisino sl subelapiz suma " +
            "  "+
            " ul ultimo " +
            " valor vacio? verdadero verde" +
            " " +
            " y " +
            " " +
            " " +
            " " +
            " " +
            " " +
            " " +
            " ",
        "constant.language": 
            "PARA FIN VERDADERAO FALSO",
        "support.type": 
            "",
        "keyword.operator":
            "redondea COS diferencia LOG10 MENOS PI potencia divid raizcuadrada SIN multi "
    }, "text", true, " ");

    var compoundKeywords = "WITH\\W+(?:HEADER\\W+LINE|FRAME|KEY)|NO\\W+STANDARD\\W+PAGE\\W+HEADING|"+
        "EXIT\\W+FROM\\W+STEP\\W+LOOP|BEGIN\\W+OF\\W+(?:BLOCK|LINE)|BEGIN\\W+OF|"+
        "END\\W+OF\\W+(?:BLOCK|LINE)|END\\W+OF|NO\\W+INTERVALS|"+
        "RESPECTING\\W+BLANKS|SEPARATED\\W+BY|USING\\W+(?:EDIT\\W+MASK)|"+
        "WHERE\\W+(?:LINE)|RADIOBUTTON\\W+GROUP|REF\\W+TO|"+
        "(?:PUBLIC|PRIVATE|PROTECTED)(?:\\W+SECTION)?|DELETING\\W+(?:TRAILING|LEADING)"+
        "(?:ALL\\W+OCCURRENCES)|(?:FIRST|LAST)\\W+OCCURRENCE|INHERITING\\W+FROM|"+
        "LINE-COUNT|ADD-CORRESPONDING|AUTHORITY-CHECK|BREAK-POINT|CLASS-DATA|CLASS-METHODS|"+
        "CLASS-METHOD|DIVIDE-CORRESPONDING|EDITOR-CALL|END-OF-DEFINITION|END-OF-PAGE|END-OF-SELECTION|"+
        "FIELD-GROUPS|FIELD-SYMBOLS|FUNCTION-POOL|MOVE-CORRESPONDING|MULTIPLY-CORRESPONDING|NEW-LINE|"+
        "NEW-PAGE|NEW-SECTION|PRINT-CONTROL|RP-PROVIDE-FROM-LAST|SELECT-OPTIONS|SELECTION-SCREEN|"+
        "START-OF-SELECTION|SUBTRACT-CORRESPONDING|SYNTAX-CHECK|SYNTAX-TRACE|TOP-OF-PAGE|TYPE-POOL|"+
        "TYPE-POOLS|LINE-SIZE|LINE-COUNT|MESSAGE-ID|DISPLAY-MODE|READ(?:-ONLY)?|"+
        "IS\\W+(?:NOT\\W+)?(?:ASSIGNED|BOUND|INITIAL|SUPPLIED)";
     
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "[;|#]",
                next : "singleLineComment"
            },            
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            },
            {token : "constant.language.boolean", regex : /(?:VRAI|FAUX)\b/},
            {token : "constant.numeric", regex: "[+-]?\\d+\\b"},
            {token : "constant.string", regex: "\"\\w+\\b"},
            {token : "variable.parameter", regex : "\:\\w*"},
            {token : keywordMapper, regex : "\\b\\w+\\.?\\w+\\b\\??"},
            {caseInsensitive: true}
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "singleLineComment" : [
            {
                token : "comment",
                regex : /\\$/,
                next : "singleLineComment"
            }, {
                token : "comment",
                regex : /$/,
                next : "start"
            }, {
                defaultToken: "comment"
            }
        ]
    };
};
oop.inherits(logoespHighlightRules, TextHighlightRules);

exports.logoespHighlightRules = logoespHighlightRules;
});


define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var range = this.indentationBlock(session, row);
        if (range)
            return range;

        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1 || line[startLevel] != "#")
            return;

        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            line = session.getLine(row);
            var level = line.search(re);

            if (level == -1)
                continue;

            if (line[level] != "#")
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var indent = line.search(/\S/);
        var next = session.getLine(row + 1);
        var prev = session.getLine(row - 1);
        var prevIndent = prev.search(/\S/);
        var nextIndent = next.search(/\S/);

        if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
            return "";
        }
        if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                session.foldWidgets[row - 1] = "";
                session.foldWidgets[row + 1] = "";
                return "start";
            }
        } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
                session.foldWidgets[row - 1] = "start";
                session.foldWidgets[row + 1] = "";
                return "";
            }
        }

        if (prevIndent!= -1 && prevIndent < indent)
            session.foldWidgets[row - 1] = "start";
        else
            session.foldWidgets[row - 1] = "";

        if (indent < nextIndent)
            return "start";
        else
            return "";
    };

}).call(FoldMode.prototype);

});

define("ace/mode/logoes",["require","exports","module","ace/mode/logoes_highlight_rules","ace/mode/folding/coffee","ace/range","ace/mode/text","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Rules = require("./logoes_highlight_rules").logoespHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;
var Range = require("../range").Range;
var TextMode = require("./text").Mode;
var oop = require("../lib/oop");

function Mode() {
    this.HighlightRules = Rules;
    this.foldingRules = new FoldMode();
}

oop.inherits(Mode, TextMode);

(function() {
    
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        return indent;
    };
    
    this.toggleCommentLines = function(state, doc, startRow, endRow){
        var range = new Range(0, 0, 0, 0);
        for (var i = startRow; i <= endRow; ++i) {
            var line = doc.getLine(i);
            if (hereComment.test(line))
                continue;
                
            if (commentLine.test(line))
                line = line.replace(commentLine, '$1');
            else
                line = line.replace(indentation, '$&#');
    
            range.end.row = range.start.row = i;
            range.end.column = line.length + 1;
            doc.replace(range, line);
        }
    };
    
    this.$id = "ace/mode/logoes";
}).call(Mode.prototype);

exports.Mode = Mode;

});
