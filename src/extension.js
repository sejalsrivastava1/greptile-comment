import * as vscode from "vscode";
import { indexRepository } from "./utils/greptile";
import { details, generateFunctionDescription, generateDescription } from "./utils/extension-utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {

  const index = vscode.commands.registerCommand("greptile-comment.indexRepository",
    async function () {
      const { owner, repoName, currentBranch }  = await details();
      const repo =   {
        remote: "github",
        branch: `${currentBranch}`,
        repository: `${owner}/${repoName}`,
      }
      await indexRepository(repo.remote, repo.repository, repo.branch);
    }
  )
  context.subscriptions.push(index);
  const functionComment = vscode.commands.registerCommand(
    "greptile-comment.addFunctionComment",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);
        
        if (selectedText) {
          const generatedDescription = await generateFunctionDescription(selectedText);
          const description = `${generatedDescription}`;

          editor.edit((editBuilder) => {
            editBuilder.insert(currSelection.start, `${description}\n`);
          });
        } else {
          vscode.window.showInformationMessage("No text selected.");
        }
      } else {
        vscode.window.showInformationMessage("No active editor found.");
      }
    }
  );

  context.subscriptions.push(functionComment);

  const comment = vscode.commands.registerCommand(
    "greptile-comment.addComment",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);

        if (selectedText) {
          const generatedDescription = await generateDescription(
            selectedText
          );
          const description = `/** ${generatedDescription} */`;

          editor.edit((editBuilder) => {
            editBuilder.insert(currSelection.start, `${description}\n`);
          });
        } else {
          vscode.window.showInformationMessage("No text selected.");
        }
      } else {
        vscode.window.showInformationMessage("No active editor found.");
      }
    }
  );

  context.subscriptions.push(comment);
}

// This method is called when your extension is deactivated
export function deactivate() {}

