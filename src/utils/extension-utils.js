import { queryGreptile } from "./greptile.js";
import { getGitRepoDetails } from "./git.js";
import { v4 as uuidv4 } from "uuid";

export async function details() {
  const { owner, repoName, currentBranch } = await getGitRepoDetails();
  return { owner, repoName, currentBranch };
}

export async function generateFunctionDescription(text) {
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
      content: `Describe this function in standard function description syntax. Do not add a language tag. Only output the function description in the correct syntax. There should be no other words. Code: ${text}`,
      role: "author",
    },
  ];

  const answer = await queryGreptile(message, repoObj);
  console.log(answer);

  const description = answer;

  return description;
}

export async function generateDescription(text) {
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
      content: `Describe this code in one short line less than 10 words. Code: ${text}`,
      role: "author",
    },
  ];

  const answer = await queryGreptile(message, repoObj);
  console.log(answer);

  const description = answer;

  return description;
}
