import inquirer from "inquirer";

/**
 * Prompt user for project configuration if no template is provided
 */
export async function promptUser({ template }) {
  // If template is provided (like --template ecommerce), 
  // skip manual prompts and return pre-defined config
  if (template) {
    return getTemplateConfig(template);
  }

  // Otherwise, ask interactively
  return inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      default: "my-node-backend",
    },
    {
      type: "list",
      name: "language",
      message: "Which language do you want to use?",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "list",
      name: "database",
      message: "Which database do you want to use?",
      choices: ["MongoDB", "PostgreSQL", "None"],
    },
    {
      type: "confirm",
      name: "auth",
      message: "Do you want to include JWT authentication?",
      default: true,
    },
    {
      type: "checkbox",
      name: "middleware",
      message: "Which middleware do you want to include?",
      choices: ["CORS", "Helmet", "Rate Limiting"],
    },
    {
      type: "confirm",
      name: "logging",
      message: "Do you want to include logging setup (winston/morgan)?",
      default: true,
    },
    {
      type: "checkbox",
      name: "folders",
      message: "Select which folders to include in your project structure:",
      choices: [
        { name: "controllers", checked: true },
        { name: "routes", checked: true },
        { name: "middlewares", checked: true },
        { name: "models", checked: true },
        { name: "config", checked: true },
      ],
    },
    {
      type: "confirm",
      name: "linting",
      message: "Do you want to add ESLint and Prettier setup?",
      default: true,
    },
    {
      type: "confirm",
      name: "docker",
      message: "Do you want to include Docker setup?",
      default: false,
    },
    {
      type: "confirm",
      name: "git",
      message: "Do you want to initialize a Git repository?",
      default: false,
    },
    {
      type: "confirm",
      name: "installDependencies",
      message: "Do you want to install Node modules automatically?",
      default: false,
    },
    {
      type: "input",
      name: "port",
      message: "Which port should the server run on?",
      default: 3000,
      validate: (value) => {
        const port = parseInt(value, 10);
        return port > 0 && port < 65536 ? true : "Please enter a valid port number (1-65535)";
      },
    },
    {
      type: "input",
      name: "author",
      message: "Author name:",
      default: "",
    },
    {
      type: "input",
      name: "version",
      message: "Project version:",
      default: "1.0.0",
    },
    {
      type: "input",
      name: "description",
      message: "Project description:",
      default: "",
    },
  ]);
}

/**
 * Predefined template configs
 */
function getTemplateConfig(template) {
  const templates = {
    ecommerce: {
      projectName: "my-ecommerce-app",
      language: "JavaScript",
      database: "MongoDB",
      auth: true,
      middleware: ["CORS", "Helmet", "Rate Limiting"],
      logging: true,
      folders: ["controllers", "routes", "middlewares", "models", "config"],
      linting: true,
    },
    blog: {
      projectName: "my-blog-app",
      language: "TypeScript",
      database: "PostgreSQL",
      auth: false,
      middleware: ["CORS", "Helmet"],
      logging: true,
      folders: ["controllers", "routes", "middlewares", "models", "config"],
      linting: true,
    },
    api: {
      projectName: "my-api-service",
      language: "JavaScript",
      database: "None",
      auth: false,
      middleware: ["CORS"],
      logging: false,
      folders: ["controllers", "routes"],
      linting: false,
    },
  };

  if (!templates[template]) {
    throw new Error(
      `Unknown template: ${template}. Available templates: ${Object.keys(
        templates
      ).join(", ")}`
    );
  }

  return templates[template];
}
