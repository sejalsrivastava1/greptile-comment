import * as vscode from "vscode";
import { indexRepository } from "./utils/greptile";
import {
  generateFunctionDescription,
  generateDescription,
} from "./utils/extension-utils";
import { getGitRepoDetails } from "./utils/git";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
  const index = vscode.commands.registerCommand(
    "greptile-comment.indexRepository",
    async function () {
      const { owner, repoName, currentBranch } = await getGitRepoDetails();
      const repo = {
        remote: "github",
        branch: `${currentBranch}`,
        repository: `${owner}/${repoName}`,
      };
      await indexRepository(repo.remote, repo.repository, repo.branch);
    }
  );

  context.subscriptions.push(index);

  const functionComment = vscode.commands.registerCommand(
    "greptile-comment.addFunctionComment",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);

        if (selectedText) {
          const generatedDescription = await generateFunctionDescription(
            selectedText
          );
          const description = `${generatedDescription}\n`;

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
    "greptile-comment.addComment1",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);

        if (selectedText) {
          const generatedDescription = await generateDescription(selectedText);
          const description = `${generatedDescription}`;

          editor.edit((editBuilder) => {
            editBuilder.insert(
              currSelection.start,
              `/**\n${description}\n*/\n`
            );
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

  const commentTwo = vscode.commands.registerCommand(
    "greptile-comment.addComment2",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);

        if (selectedText) {
          const generatedDescription = await generateDescription(selectedText);
          const description = `${generatedDescription}`;

          editor.edit((editBuilder) => {
            editBuilder.insert(currSelection.start, `# ${description}\n `);
          });
        } else {
          vscode.window.showInformationMessage("No text selected.");
        }
      } else {
        vscode.window.showInformationMessage("No active editor found.");
      }
    }
  );

  context.subscriptions.push(commentTwo);
}

// This method is called when your extension is deactivated
export function deactivate() {}
