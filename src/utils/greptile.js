import axios from 'axios';
import * as vscode from "vscode";

export async function queryGreptile(messages, repositories) {
  try {
    const response = await axios.post('https://api.greptile.com/v2/query', {
      messages: messages,
      repositories: repositories
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
        'X-GitHub-Token': `${process.env.GIT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function searchGrepTile(query, remote, branch, repository) {
  try {
    const response = await axios.post('https://api.greptile.com/v2/search', {
      query: query,
      repositories: [
        {
          remote: remote,
          branch: branch,
          repository: repository
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
        'X-GitHub-Token': process.env.GIT_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getRepositoryDetails(repositoryId) {
  try {
    const response = await axios.get(`https://api.greptile.com/v2/repositories/${repositoryId}`, {
      headers: {
        Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function indexRepository(remote, repository, branch) {
  const options = {
    method: "POST",
    url: "https://api.greptile.com/v2/repositories",
    headers: {
      Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
      "X-GitHub-Token": process.env.GIT_TOKEN,
      "Content-Type": "application/json",
    },
    data: {
      remote: remote,
      repository: repository,
      branch: branch,
      reload: true,
      notify: true,
    },
  };

  try {
    const response = await axios(options);
    console.log(response.data);
  } catch (err) {
    vscode.window.showErrorMessage("Couldn't index repository");
    console.error(err);
  }
}
