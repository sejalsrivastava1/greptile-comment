import * as vscode from "vscode";
import { queryGreptile, getRepositoryDetails } from "./utils/greptile.js";
import { getGitRepoDetails } from "./utils/git.js";
import { v4 as uuidv4 } from "uuid";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  /** // Register the context menu item
  const contextMenu = vscode.commands.registerCommand(
    "grepitle-comment.showContextMenu",
    function () {
      vscode.commands.executeCommand("greptile-comment.addComment");
    }
  );

  context.subscriptions.push(contextMenu);
   */
  const disposable = vscode.commands.registerCommand(
    "greptile-comment.addComment",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);

        if (selectedText) {
          const description = `\\ ${generateDescription(selectedText)}`;

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

  context.subscriptions.push(disposable);
}

async function generateDescription(text) {
  // Simple description generation (can be replaced with a more sophisticated approach)

  const { owner, repoName, currentBranch } = await getGitRepoDetails();
  /**
    const repo = `github:${currentBranch}:${owner}/${repoName}`;
		const repoResponse = await getRepositoryDetails(repo).response;
*/
  const repoObj = [
    {
      remote: "github",
      branch: `${currentBranch}`,
      repository: `${owner}/${repoName}`,
    },
  ];

  const message = [
    {
      id: uuidv4(),
      content: `Write a clear, concise description for the following block of code. If it is a function definition, write it in the standard form for javascript functions. Code: ${text}`,
      role: "",
    },
  ];

  const answer = await queryGreptile(message, repoObj);

  const description = answer.sources.summary;

  return description;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
