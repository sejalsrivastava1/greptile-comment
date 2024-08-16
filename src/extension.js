import * as vscode from "vscode";
import { queryGreptile, indexRepository } from "./utils/greptile.js";
import { getGitRepoDetails } from "./utils/git.js";
import { v4 as uuidv4 } from "uuid";

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
  const disposable = vscode.commands.registerCommand(
    "greptile-comment.addComment",
    async function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const currSelection = editor.selection;
        const selectedText = editor.document.getText(currSelection);
        
        if (selectedText) {
          const generatedDescription = await generateDescription(selectedText);
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

  context.subscriptions.push(disposable);
}

async function details() {
  const { owner, repoName, currentBranch } = await getGitRepoDetails();
  return { owner, repoName, currentBranch };
}
async function generateDescription(text) {

  const { owner, repoName, currentBranch } = await details();

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
  console.log(answer);

  const description = answer.sources.summary;

  return description;
}

// This method is called when your extension is deactivated
export function deactivate() {}

