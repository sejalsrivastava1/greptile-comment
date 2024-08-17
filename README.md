# greptile-comment
## a vscode extension using greptile to write code comments for you
## how to use
- clone the repo
- make a env.js file inside the src folder
- put your greptile api key and github personal access token inside env.js
```
// env.js
export const env = {
  GREPTILE_API_KEY: "<api-key>",
  GITHUB_TOKEN: "<github-pat>",
};

```
- build the extension with npm run compile
- open debugging mode with F5 and enter the extension development host -- open the repo that you want to access

