import * as vscode from 'vscode';

export async function getGitRepoDetails() {
  // Get the Git extension
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found.');
    return;
  }

  // Get the Git API
  const git = gitExtension.getAPI(1);
  
  // Get the current repository
  const repository = git.repositories[0];
  if (!repository) {
    vscode.window.showErrorMessage('No Git repository found.');
    return;
  }

  // Get the remote URL of the repository (e.g., https://github.com/owner/repo.git)
  const remoteUrl = repository.state.remotes[0]?.fetchUrl;
  if (!remoteUrl) {
    vscode.window.showErrorMessage('No remote URL found.');
    return;
  }

  // Get the current branch
  const currentBranch = repository.state.HEAD?.name;
  if (!currentBranch) {
    vscode.window.showErrorMessage('Unable to determine the current branch.');
    return;
  }

  // Extract owner and repo name from the URL (works for GitHub-like URLs)
  const repoDetails = /github\.com[:/](.*)\/(.*)\.git/.exec(remoteUrl);
  if (repoDetails && repoDetails.length >= 3) {
    const owner = repoDetails[1];
    const repoName = repoDetails[2];
    vscode.window.showInformationMessage(`Owner: ${owner}, Repository: ${repoName}, Current Branch: ${currentBranch}`);
    return { owner, repoName, currentBranch };
  } else {
    vscode.window.showErrorMessage('Unable to extract owner and repository name from the remote URL.');
  }
}
