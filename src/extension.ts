// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';

import { readArrayLines } from './utils';
import { writeBlocks } from './writer';
var Trie = require('mnemonist/trie');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (// console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "terraform-order" is now active!');

  let disposable = vscode.commands.registerCommand('terraform-order.order', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return; // no editor
    }
    let inputText = editor.document;
    const documentText = inputText.getText();

    let fileStr = documentText
      //replace new line widows style with unix style
      .replace(/\r\n/g, '\n');

    const fileStrArr = fileStr.split('\n').filter((line) => line.trim());
    const arrResult = readArrayLines(fileStrArr);
    console.log(arrResult);

    arrResult.forEach((element) => {
      vscode.window.showInformationMessage('found elements: ' + element.line.join(' '));
    });

    //rewrite file
    const fd = fs.openSync(editor.document.fileName, 'w');
    let filePos = 0;
    console.log('writing blocks')
    writeBlocks(fd, filePos, arrResult);
    fs.closeSync(fd);

    context.subscriptions.push(disposable);
  });
}

function isEmptyStr(str: string) {
  return !str?.trim();
}

function getvarName() {}

// this method is called when your extension is deactivated
export function deactivate() {}
