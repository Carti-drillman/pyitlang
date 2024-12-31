"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// PyitLang Interpreter Class
var PyitLangInterpreter = /** @class */ (function () {
    function PyitLangInterpreter() {
        this.variables = {};
    }
    // Execute PyitLang code from a string
    PyitLangInterpreter.prototype.execute = function (code) {
        var _this = this;
        var lines = code.split("\n").map(function (line) { return line.trim(); }).filter(function (line) { return line.length > 0; });
        lines.forEach(function (line) { return _this.processLine(line); });
    };
    // Process a single line of PyitLang code
    PyitLangInterpreter.prototype.processLine = function (line) {
        if (line.startsWith("thatmat")) {
            this.declareVariable(line);
        }
        else if (line.startsWith("phyay")) {
            this.assignVariable(line);
        }
        else if (line.startsWith("pya")) {
            this.printStatement(line);
        }
        else if (line.startsWith("mahsaw")) {
            this.handleCondition(line);
        }
        else if (line.startsWith("akyein")) {
            this.handleLoop(line);
        }
        else if (line.startsWith("lohp")) {
            this.handleFunction(line);
        }
        else {
            console.log("Syntax error: ".concat(line));
        }
    };
    // Declare a variable
    PyitLangInterpreter.prototype.declareVariable = function (line) {
        var regex = /^thatmat (\w+) = (.+)$/;
        var match = line.match(regex);
        if (match) {
            var _ = match[0], varName = match[1], value = match[2];
            this.variables[varName] = this.evaluateExpression(value);
            console.log("Variable '".concat(varName, "' declared with value: ").concat(this.variables[varName]));
        }
        else {
            console.log("Invalid variable declaration syntax.");
        }
    };
    // Assign a value to a variable
    PyitLangInterpreter.prototype.assignVariable = function (line) {
        var regex = /^phyay (\w+) = (.+)$/;
        var match = line.match(regex);
        if (match) {
            var _ = match[0], varName = match[1], value = match[2];
            if (this.variables.hasOwnProperty(varName)) {
                this.variables[varName] = this.evaluateExpression(value);
                console.log("Variable '".concat(varName, "' assigned new value: ").concat(this.variables[varName]));
            }
            else {
                console.log("Variable '".concat(varName, "' is not defined."));
            }
        }
        else {
            console.log("Invalid assignment syntax.");
        }
    };
    // Print a statement
    PyitLangInterpreter.prototype.printStatement = function (line) {
        var regex = /^pya (.+)$/;
        var match = line.match(regex);
        if (match) {
            var value = this.evaluateExpression(match[1]);
            console.log(value);
        }
        else {
            console.log("Invalid print syntax.");
        }
    };
    // Evaluate an expression (like variables, numbers, etc.)
    PyitLangInterpreter.prototype.evaluateExpression = function (expr) {
        expr = expr.trim();
        if (this.variables.hasOwnProperty(expr)) {
            return this.variables[expr];
        }
        else if (!isNaN(Number(expr))) {
            return Number(expr);
        }
        else {
            return expr;
        }
    };
    // Handle conditional statement
    PyitLangInterpreter.prototype.handleCondition = function (line) {
        var regex = /^mahsaw (.+) {([\s\S]+)} mahoat {([\s\S]+)}$/;
        var match = line.match(regex);
        if (match) {
            var condition = match[1].trim();
            var trueBlock = match[2].trim();
            var falseBlock = match[3].trim();
            var conditionResult = this.evaluateExpression(condition);
            if (conditionResult) {
                this.executeBlock(trueBlock);
            }
            else {
                this.executeBlock(falseBlock);
            }
        }
        else {
            console.log("Invalid conditional syntax.");
        }
    };
    // Execute block of code (i.e., contents inside curly braces)
    PyitLangInterpreter.prototype.executeBlock = function (block) {
        var _this = this;
        var lines = block.split("\n").map(function (line) { return line.trim(); }).filter(function (line) { return line.length > 0; });
        lines.forEach(function (line) { return _this.processLine(line); });
    };
    // Handle loop statement
    PyitLangInterpreter.prototype.handleLoop = function (line) {
        var regex = /^akyein (\d+) {([\s\S]+)}$/;
        var match = line.match(regex);
        if (match) {
            var times = Number(match[1]);
            var block = match[2].trim();
            for (var i = 0; i < times; i++) {
                this.executeBlock(block);
            }
        }
        else {
            console.log("Invalid loop syntax.");
        }
    };
    // Handle function definition or call
    PyitLangInterpreter.prototype.handleFunction = function (line) {
        var regex = /^lohp (\w+)\((.*)\)$/;
        var match = line.match(regex);
        if (match) {
            var funcName = match[1];
            var args_1 = match[2].split(',').map(function (arg) { return arg.trim(); });
            // Ensure the function is defined before calling
            if (this[funcName]) {
                var result = this[funcName].apply(this, args_1);
                console.log(result);
            }
            else {
                console.log("Unknown function: ".concat(funcName));
            }
        }
        else {
            console.log("Invalid function definition syntax.");
        }
    };
    // Function to load and execute a .pyit file
    PyitLangInterpreter.prototype.loadAndExecuteFile = function (filePath) {
        var _this = this;
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) {
                console.log("Error reading file: ".concat(err.message));
            }
            else {
                console.log("Executing file: ".concat(filePath));
                _this.execute(data);
            }
        });
    };
    return PyitLangInterpreter;
}());
// Command-line execution
var args = process.argv.slice(2);
var filePath = args[0];
if (!filePath) {
    console.log("Please provide a .pyit file to run.");
    process.exit(1);
}
// Create an instance of PyitLangInterpreter and run the file
var pyitInterpreter = new PyitLangInterpreter();
pyitInterpreter.loadAndExecuteFile(filePath);
