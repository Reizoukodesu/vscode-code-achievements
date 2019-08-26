import * as vscode from 'vscode';

import { notify } from './notifiy';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "code-achievements" is now active!');

    let channel = vscode.window.createOutputChannel('achievements');
    // vscode.workspace.onDidChangeTextDocument(e =>  channel.append(e.contentChanges.map(x => x.text).join("\n")));
    onOpenTextDocument(context, channel);
    onChangeFocusedDocument(context, channel);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.codeAchievement', () => {
        channel.show();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function onChangeFocusedDocument(context: vscode.ExtensionContext, channel: vscode.OutputChannel) {
    const focusedMap: Record<string, number[]> = {};
    const onChangeFocusedDocumentHandler = (e: vscode.TextEditor | undefined) => {
        if (!!e) {
            const file = e.document.uri.toString();
            const lastFocuses = focusedMap[file] || [];
            lastFocuses.push(+new Date());
            focusedMap[file] = lastFocuses.filter(ts => ts >= +new Date() - 10000);
            channel.appendLine(
                `[onChangeFocusedDocument] ${file} has been focused ${
                    focusedMap[file].length
                } times in the past 10 seconds`,
            );

            if (focusedMap[file].length >= 10) {
                notify({
                    title: 'Bored or comparing?',
                    message: 'You focused the same file 10 times within 10 seconds.',
                    sound: vscode.workspace.getConfiguration('codeAchievement').get('playSound', true),
                });
                vscode.window.showInformationMessage('Focusing are?');
                listener.dispose();
            }
        }
    };

    channel.appendLine(`[onChangeFocusedDocument] Registering event`);
    const listener = vscode.window.onDidChangeActiveTextEditor(onChangeFocusedDocumentHandler);
}
function onOpenTextDocument(context: vscode.ExtensionContext, channel: vscode.OutputChannel) {
    const openedDocumentMap: Record<string, number> = {};

    vscode.workspace.onDidOpenTextDocument(e => {
        openedDocumentMap[e.fileName] = (openedDocumentMap[e.fileName] || 0) + 1;
        channel.appendLine(`[onOpenTextDocument] ${e.fileName} has been opened ${openedDocumentMap[e.fileName]} times`);
    });
}
