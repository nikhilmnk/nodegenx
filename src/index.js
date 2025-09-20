import path from "path";
import fs from "fs-extra";
import { promptUser } from "./prompts.js";
import { generateProject } from "./generator.js";
import { showSuccess } from "./utils.js";
import { useTemplate, isValidTemplate } from "./templateManager.js";
import chalk from "chalk";

/**
 * Main entry
 * @param {Object} options
 * @param {string|null} options.projectName - Project name or folder name
 * @param {string|null} options.template - Template name if provided
 */
export default async function run({ projectName, template } = {}) {
  console.log(chalk.cyanBright("🚀 Welcome to Create Node Backend CLI!\n"));
  try {
    // --- Determine target path and project name ---
    let targetPath;
    if (!projectName || projectName === ".") {
      targetPath = process.cwd();
      projectName = path.basename(targetPath);
    } else {
      targetPath = path.join(process.cwd(), projectName);
      if (fs.existsSync(targetPath)) {
        console.error(
          chalk.red(`❌ Folder "${projectName}" already exists!`)
        );
        process.exit(1);
      }
    }

    // --- Template mode ---
    if (template) {
      if (!isValidTemplate(template)) {
        console.error(chalk.red(`❌ Unknown template: "${template}"`));
        console.log(chalk.yellow("Available templates: ecommerce, blog, api, js-jwt-rest"));
        process.exit(1);
      }

      console.log(
        chalk.green(
          `📦 Creating project "${projectName}" using template "${template}"...`
        )
      );
      await useTemplate(targetPath, template);
      showSuccess(projectName);
      return;
    }

    // --- Interactive/manual project generation ---
    const answers = await promptUser({ projectName });
    // Override answers.projectName to ensure correct folder if user passed "."
    // answers.projectName = projectName;
    await generateProject(answers);
    showSuccess(projectName);
  } catch (err) {
    console.error("❌ Something went wrong:", err.message);
    process.exit(1);
  }
}
