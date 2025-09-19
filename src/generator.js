import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { installDependencies } from "./dependencies.js";
import { initGit } from "./git.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateProject(answers) {
  const projectName = answers.projectName;
  let projectPath = path.join(process.cwd(), projectName);

  if (projectName === ".") {
    projectPath = process.cwd();
  }

  if (fs.existsSync(projectPath)) {
    console.error(
      chalk.red(
        `❌ The folder '${projectName}' already exists. Please choose a different name or use '.'`
      )
    );
    process.exit(1);
  }

  try {
    // 📁 Create folders
    await fs.mkdir(projectPath);
    await fs.mkdir(path.join(projectPath, "src"));
    for (const folder of answers.folders) {
      await fs.mkdir(path.join(projectPath, "src", folder));
    }

    // 📄 Database config
    const dbContent = await ejs.renderFile(
      path.join(__dirname, "../templates/db.js.ejs"),
      { database: answers.database }
    );
    await fs.outputFile(path.join(projectPath, "src/config/db.js"), dbContent.trim());

    // 👤 User model
    const userModel = await ejs.renderFile(
      path.join(__dirname, "../templates/user.model.js.ejs"),
      { database: answers.database }
    );
    await fs.outputFile(path.join(projectPath, "src/models/user.model.js"), userModel.trim());

    // 🔐 Auth
    if (answers.auth) {
      const authController = await ejs.renderFile(
        path.join(__dirname, "../templates/auth.controller.js.ejs"),
        answers
      );
      const authMiddleware = await ejs.renderFile(
        path.join(__dirname, "../templates/auth.middleware.js.ejs"),
        answers
      );
      await fs.outputFile(path.join(projectPath, "src/controllers/auth.controller.js"), authController.trim());
      await fs.outputFile(path.join(projectPath, "src/middlewares/auth.middleware.js"), authMiddleware.trim());
    }

    // 🌱 .env
    const envContent = `
PORT=3000
MONGO_URI=mongodb://localhost:27017/${answers.projectName}
JWT_SECRET=your_jwt_secret
`.trim();
    await fs.outputFile(path.join(projectPath, ".env"), envContent);

    // 🧠 app.js or app.ts
    const appFileName = answers.language === "TypeScript" ? "app.ts" : "app.js";
    const appTemplatePath = path.join(
      __dirname,
      "../templates",
      appFileName === "app.ts" ? "app.ts.ejs" : "app.js.ejs"
    );
    const renderedApp = await ejs.renderFile(appTemplatePath, {
      projectName: answers.projectName,
      middleware: answers.middleware,
      logging: answers.logging,
      linting: answers.linting,
    });
    await fs.writeFile(path.join(projectPath, "src", appFileName), renderedApp.trim());

    // 🐳 Docker setup
    const dockerfileContent = await ejs.renderFile(
      path.join(__dirname, "../templates/dockerfile.ejs"),
      {}
    );
    await fs.outputFile(path.join(projectPath, "Dockerfile"), dockerfileContent.trim());

    const dockerignoreContent = await ejs.renderFile(
      path.join(__dirname, "../templates/dockerignore.ejs"),
      {}
    );
    await fs.outputFile(path.join(projectPath, ".dockerignore"), dockerignoreContent);

    // 📦 package.json
    const pkgJsonContent = await ejs.renderFile(
      path.join(__dirname, "../templates/package.json.ejs"),
      answers
    );
    await fs.outputFile(path.join(projectPath, "package.json"), pkgJsonContent.trim());

    // Linting setup
    if (answers.linting) {
      const lintingTemplates = [".eslintrc.js", ".prettierrc"];
      for (const file of lintingTemplates) {
        const rendered = await ejs.renderFile(
          path.join(__dirname, "../templates/linting", `${file}.ejs`),
          { language: answers.language }
        );
        await fs.outputFile(path.join(projectPath, file), rendered);
      }
      await fs.outputFile(path.join(projectPath, ".eslintignore"), "node_modules\ndist\n");
      await fs.outputFile(path.join(projectPath, ".prettierignore"), "node_modules\ndist\n");
    }

    // 📦 Install dependencies
    await installDependencies(answers, projectPath);

    // 🔧 Git setup
    await initGit(projectPath);

    // 🎉 Done!
    console.log(`\n🎉 Project '${answers.projectName}' created successfully!`);
    console.log(`📁 Location: ${projectPath}`);
    console.log(`👉 Next steps:\n`);
    console.log(`   cd ${answers.projectName}`);
    console.log(`   npm start\n`);
  } catch (err) {
    console.error(chalk.red("❌ Error creating project:"), err);
  }
}
