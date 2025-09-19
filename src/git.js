import { execSync } from "child_process";
import fs from "fs-extra";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initGit(projectPath) {
  const gitignoreContent = await ejs.renderFile(
    path.join(__dirname, "../templates/gitignore.ejs"),
    {}
  );
  await fs.outputFile(path.join(projectPath, ".gitignore"), gitignoreContent);

  console.log("\n🔧 Initializing Git repository...\n");
  try {
    execSync(`git init`, { cwd: projectPath, stdio: "inherit" });
    execSync(`git add .`, { cwd: projectPath, stdio: "inherit" });
    execSync(`git commit -m "Initial commit"`, { cwd: projectPath, stdio: "inherit" });
    console.log("✅ Git repo initialized!");
  } catch (err) {
    console.error("⚠️ Failed to initialize Git:", err.message);
  }
}
