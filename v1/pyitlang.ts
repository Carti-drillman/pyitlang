import * as fs from 'fs';

// PyitLang Interpreter Class
class PyitLangInterpreter {
  private variables: Record<string, any> = {};

  // Execute PyitLang code from a string
  public execute(code: string): void {
    const lines = code.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => this.processLine(line));
  }

  // Process a single line of PyitLang code
  private processLine(line: string): void {
    if (line.startsWith("thatmat")) {
      this.declareVariable(line);
    } else if (line.startsWith("phyay")) {
      this.assignVariable(line);
    } else if (line.startsWith("pya")) {
      this.printStatement(line);
    } else if (line.startsWith("mahsaw")) {
      this.handleCondition(line);
    } else if (line.startsWith("akyein")) {
      this.handleLoop(line);
    } else if (line.startsWith("lohp")) {
      this.handleFunction(line);
    } else {
      console.log(`Syntax error: ${line}`);
    }
  }

  // Declare a variable
  private declareVariable(line: string): void {
    const regex = /^thatmat (\w+) = (.+)$/;
    const match = line.match(regex);
    if (match) {
      const [_, varName, value] = match;
      this.variables[varName] = this.evaluateExpression(value);
      console.log(`Variable '${varName}' declared with value: ${this.variables[varName]}`);
    } else {
      console.log("Invalid variable declaration syntax.");
    }
  }

  // Assign a value to a variable
  private assignVariable(line: string): void {
    const regex = /^phyay (\w+) = (.+)$/;
    const match = line.match(regex);
    if (match) {
      const [_, varName, value] = match;
      if (this.variables.hasOwnProperty(varName)) {
        this.variables[varName] = this.evaluateExpression(value);
        console.log(`Variable '${varName}' assigned new value: ${this.variables[varName]}`);
      } else {
        console.log(`Variable '${varName}' is not defined.`);
      }
    } else {
      console.log("Invalid assignment syntax.");
    }
  }

  // Print a statement
  private printStatement(line: string): void {
    const regex = /^pya (.+)$/;
    const match = line.match(regex);
    if (match) {
      const value = this.evaluateExpression(match[1]);
      console.log(value);
    } else {
      console.log("Invalid print syntax.");
    }
  }

  // Evaluate an expression (like variables, numbers, etc.)
  private evaluateExpression(expr: string): any {
    expr = expr.trim();
    if (this.variables.hasOwnProperty(expr)) {
      return this.variables[expr];
    } else if (!isNaN(Number(expr))) {
      return Number(expr);
    } else {
      return expr;
    }
  }

  // Handle conditional statement
  private handleCondition(line: string): void {
    const regex = /^mahsaw (.+) {([\s\S]+)} mahoat {([\s\S]+)}$/;
    const match = line.match(regex);
    if (match) {
      const condition = match[1].trim();
      const trueBlock = match[2].trim();
      const falseBlock = match[3].trim();

      const conditionResult = this.evaluateExpression(condition);
      if (conditionResult) {
        this.executeBlock(trueBlock);
      } else {
        this.executeBlock(falseBlock);
      }
    } else {
      console.log("Invalid conditional syntax.");
    }
  }

  // Execute block of code (i.e., contents inside curly braces)
  private executeBlock(block: string): void {
    const lines = block.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => this.processLine(line));
  }

  // Handle loop statement
  private handleLoop(line: string): void {
    const regex = /^akyein (\d+) {([\s\S]+)}$/;
    const match = line.match(regex);
    if (match) {
      const times = Number(match[1]);
      const block = match[2].trim();

      for (let i = 0; i < times; i++) {
        this.executeBlock(block);
      }
    } else {
      console.log("Invalid loop syntax.");
    }
  }

  // Handle function definition or call
  private handleFunction(line: string): void {
    const regex = /^lohp (\w+)\((.*)\)$/;
    const match = line.match(regex);
    if (match) {
      const funcName = match[1];
      const args = match[2].split(',').map(arg => arg.trim());

      // Ensure the function is defined before calling
      if (this[funcName]) {
        const result = this[funcName](...args);
        console.log(result);
      } else {
        console.log(`Unknown function: ${funcName}`);
      }
    } else {
      console.log("Invalid function definition syntax.");
    }
  }

  // Function to load and execute a .pyit file
  public loadAndExecuteFile(filePath: string): void {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err.message}`);
      } else {
        console.log(`Executing file: ${filePath}`);
        this.execute(data);
      }
    });
  }
}

// Command-line execution
const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath) {
  console.log("Please provide a .pyit file to run.");
  process.exit(1);
}

// Create an instance of PyitLangInterpreter and run the file
const pyitInterpreter = new PyitLangInterpreter();
pyitInterpreter.loadAndExecuteFile(filePath);
