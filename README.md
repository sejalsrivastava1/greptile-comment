# greptile-comment
## a vscode extension using greptile to write code comments for you
## 👾 requirements
- vscode v1.80.0 or up
- npm
## 📈 current features
- add one-line comments to selected blocks of code
- add function descriptions to selected functions
## ✍️ installation and setup
- clone the repo
- make a file titled env.js inside the src folder
- put your greptile api key and github personal access token inside env.js (make sure your git token has read access to the repository you want to access; fine-grained tokens are recommended)
```
// env.js
export const env = {
  GREPTILE_API_KEY: "<api-key>",
  GITHUB_TOKEN: "<github-pat>",
};
```
- install all required packages with npm install
- build the extension with npm run compile
- while inside a .js file, open debugging mode with F5 and enter the extension development host -- open the repo that you want to access

## usage
### #1 index repo
### #2 add comment
### #3 add function description

## 🙊 caveats
- only supports github repositories at this point
- support for javascript, typescript, java, php, c, c++, python, r, ruby
- no dev support for using .env files (yet)


