import ora from 'ora';
import chalk from 'chalk';

export function showSpinner(text) {
  return ora(text).start();
}

export function showSuccess(projectName) {
  console.log(chalk.green(`\n🎉 Your project '${projectName}' is ready!`));
  console.log(chalk.blue(`\n👉 cd ${projectName} && npm install`));
  console.log(chalk.yellow(`👉 npm start`));
}
