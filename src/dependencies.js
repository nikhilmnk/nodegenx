import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function installDependencies(answers, projectPath) {
  const dependencies = ["express"];
  const devDependencies = [];

  if (answers.database === "MongoDB") {
    dependencies.push("mongoose");
  } else if (answers.database === "PostgreSQL") {
    dependencies.push("@prisma/client", "prisma");
  }

  if (answers.auth) {
    dependencies.push("jsonwebtoken", "bcryptjs", "dotenv");
  }
  if (answers.middleware.includes("CORS")) dependencies.push("cors");
  if (answers.middleware.includes("Helmet")) dependencies.push("helmet");
  if (answers.middleware.includes("Rate Limiting"))
    dependencies.push("express-rate-limit");

  if (answers.language === "TypeScript") {
    devDependencies.push(
      "typescript",
      "ts-node-dev",
      "@types/node",
      "@types/express"
    );
  }

  if (answers.logging) {
    dependencies.push("winston", "morgan");

    const loggerContent = await ejs.renderFile(
      path.join(__dirname, "../templates/config/logger.js.ejs")
    );
    await fs.outputFile(path.join(projectPath, "src/config/logger.js"), loggerContent.trim());
  }

  if (answers.linting) {
    if (answers.language === "TypeScript") {
      devDependencies.push(
        "eslint",
        "prettier",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "@typescript-eslint/parser",
        "@typescript-eslint/eslint-plugin"
      );
    } else {
      devDependencies.push(
        "eslint",
        "prettier",
        "eslint-config-prettier",
        "eslint-plugin-prettier"
      );
    }
  }

  const spinner = ora(`Installing dependencies: ${dependencies.join(", ")}`).start();
  try {
    execSync(`npm install ${dependencies.join(" ")}`, {
      cwd: projectPath,
      stdio: "inherit",
    });
    spinner.succeed("Dependencies installed successfully!");
  } catch (err) {
    spinner.fail("Failed to install dependencies");
    console.error(chalk.red(err));
  }

  if (devDependencies.length > 0) {
    console.log(chalk.yellow(`\n📦 Installing devDependencies...\n`));
    execSync(`npm install -D ${devDependencies.join(" ")}`, {
      cwd: projectPath,
      stdio: "inherit",
    });
  }

  if (answers.database === "PostgreSQL") {
    console.log("\n⚙️ Initializing Prisma...\n");
    execSync(`npx prisma init`, { cwd: projectPath, stdio: "inherit" });
  }

  if (answers.language === "TypeScript") {
    console.log("\n📄 Creating tsconfig.json...\n");
    const tsConfig = {
      compilerOptions: {
        target: "ES6",
        module: "CommonJS",
        rootDir: "./src",
        outDir: "./dist",
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
      },
    };
    await fs.writeJson(path.join(projectPath, "tsconfig.json"), tsConfig, { spaces: 2 });
  }
}
