import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { fileURLToPath } from "url";

/**
 * Copies a predefined template into target directory
 * Updates package.json name to project name
 * @param {string} targetPath - absolute or relative path to create project in
 * @param {string} templateName
 */
export async function useTemplate(targetPath, templateName) {
  const spinner = ora(`Setting up template: ${templateName}`).start();

  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const templatesDir = path.join(__dirname, "../templates");
    const templatePath = path.join(templatesDir, templateName);

    // Resolve targetPath to absolute
    if (!path.isAbsolute(targetPath)) {
      targetPath = path.join(process.cwd(), targetPath);
    }

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      spinner.fail(chalk.red(`Template "${templateName}" not found!`));
      process.exit(1);
    }

    // Check if target exists and is not empty
    if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
      spinner.fail(
        chalk.red(`Folder "${targetPath}" already exists and is not empty!`)
      );
      process.exit(1);
    }

    // Copy template files
    await fs.copy(templatePath, targetPath);

    // Update package.json name
    const pkgPath = path.join(targetPath, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      const projectName =
        targetPath === process.cwd() ? path.basename(process.cwd()) : path.basename(targetPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    spinner.succeed(chalk.green(`Template "${templateName}" applied successfully!`));
  } catch (err) {
    spinner.fail(chalk.red(`Failed to apply template: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Returns true if template exists in templates folder
 * @param {string} templateName
 * @returns {boolean}
 */
export function isValidTemplate(templateName) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.join(__dirname, "../templates");
  const templatePath = path.join(templatesDir, templateName);
  return fs.existsSync(templatePath);
}
