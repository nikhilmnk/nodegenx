#!/usr/bin/env node
import { Command } from "commander";
import run from "../src/index.js";

const program = new Command();

program
  .name("nodegenx")
  .description("CLI to generate Node.js backend project with templates")
  .argument("[projectName]", "Project name or folder (use . for current directory)", "my-node-backend")
  .option(
    "-t, --template <template>",
    "Use a predefined template (e.g., ecommerce, blog, api, js-jwt-rest)"
  )
  .action(async (projectName, options) => {
    // Handle `.` for current directory
    const isCurrentDir = projectName === ".";
    await run({
      projectName: isCurrentDir ? "." : projectName,
      template: options.template || null,
    });
  });

program.parse(process.argv);
