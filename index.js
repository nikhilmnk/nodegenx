#!/usr/bin/env node

// --------------------
// 🛠️ Imports & Setup
// --------------------
const { default: inquirer } = require("inquirer");
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const { default: ora } = require("ora");

console.log(chalk.cyanBright("🚀 Welcome to Create Node Backend CLI!\n"));

// --------------------
// 🔍 Prompt User
// --------------------
inquirer.prompt([
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter your project name:',
        default: 'my-node-backend',
    },
    {
        type: 'list',
        name: 'language',
        message: 'Which language do you want to use?',
        choices: ['JavaScript', 'TypeScript'],
    },
    {
        type: 'list',
        name: 'database',
        message: 'Which database do you want to use?',
        choices: ['MongoDB', 'PostgreSQL', 'None'],
    },
    {
        type: 'confirm',
        name: 'auth',
        message: 'Do you want to include JWT authentication?',
        default: true,
    },
    {
        type: 'checkbox',
        name: 'middleware',
        message: 'Which middleware do you want to include?',
        choices: ['CORS', 'Helmet', 'Rate Limiting'],
    },
    {
        type: 'confirm',
        name: 'logging',
        message: 'Do you want to include logging setup (winston/morgan)?',
        default: true,
    },
    {
        type: 'checkbox',
        name: 'folders',
        message: 'Select which folders to include in your project structure:',
        choices: [
            { name: 'controllers', checked: true },
            { name: 'routes', checked: true },
            { name: 'middlewares', checked: true },
            { name: 'models', checked: true },
            { name: 'config', checked: true }
        ],
    },
    {
        type: 'confirm',
        name: 'linting',
        message: 'Do you want to add ESLint and Prettier setup?',
        default: true
    }
]).then(async (answers) => {
    // const projectPath = path.join(process.cwd(), answers.projectName);
    const projectName = answers.projectName;
    let projectPath = path.join(process.cwd(), projectName);

    // Check if the user entered '.' (current directory)
    if (projectName === '.') {
        projectPath = process.cwd(); // Use the current directory as the project path
    }

    // Check if the project folder already exists
    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`❌ The folder '${projectName}' already exists. Please choose a different name or use '.' for the current directory.`));
        process.exit(1); // Exit the process with an error code
    }

    // try {
    //     // Create the project folder
    //     await fs.mkdir(projectPath);

    //     // Continue with creating subfolders and files...
    // } catch (error) {
    //     console.error(chalk.red(`❌ Error creating project folder: ${error.message}`));
    //     process.exit(1); // Exit if an error occurs
    // }


    try {
        // --------------------
        // 📁 Create Folder Structure
        // --------------------
        // await fs.mkdirp(path.join(projectPath, 'src', 'controllers'));
        // await fs.mkdirp(path.join(projectPath, 'src', 'routes'));
        // await fs.mkdirp(path.join(projectPath, 'src', 'middlewares'));
        // await fs.mkdirp(path.join(projectPath, 'src', 'models'));
        // await fs.mkdirp(path.join(projectPath, 'src', 'config'));

        // Create project folder
        await fs.mkdir(projectPath);
        // Create src and subfolders
        await fs.mkdir(path.join(projectPath, 'src'));
        for (const folder of answers.folders) {
            await fs.mkdir(path.join(projectPath, 'src', folder));
        }

        // --------------------
        // 📄 Render Database Config
        // --------------------
        const dbContent = await ejs.renderFile(
            path.join(__dirname, 'templates', 'db.js.ejs'),
            { database: answers.database }
        );
        await fs.outputFile(path.join(projectPath, 'src', 'config', 'db.js'), dbContent.trim());

        // --------------------
        // 👤 Render User Model
        // --------------------
        const userModel = await ejs.renderFile(
            path.join(__dirname, 'templates', 'user.model.js.ejs'),
            { database: answers.database }
        );
        await fs.outputFile(path.join(projectPath, 'src', 'models', 'user.model.js'), userModel.trim());

        // --------------------
        // 🔐 Add Auth if selected
        // --------------------
        if (answers.auth) {
            const authController = await ejs.renderFile(
                path.join(__dirname, 'templates', 'auth.controller.js.ejs'),
                answers
            );
            const authMiddleware = await ejs.renderFile(
                path.join(__dirname, 'templates', 'auth.middleware.js.ejs'),
                answers
            );

            await fs.outputFile(path.join(projectPath, 'src', 'controllers', 'auth.controller.js'), authController.trim());
            await fs.outputFile(path.join(projectPath, 'src', 'middlewares', 'auth.middleware.js'), authMiddleware.trim());
        }

        // --------------------
        // 🌱 Generate .env file
        // --------------------
        const envContent = `
PORT=3000
MONGO_URI=mongodb://localhost:27017/${answers.projectName}
JWT_SECRET=your_jwt_secret
`.trim();

        await fs.outputFile(path.join(projectPath, '.env'), envContent);

        // --------------------
        // 🧠 Generate app.js or app.ts
        // --------------------
        const appFileName = answers.language === 'TypeScript' ? 'app.ts' : 'app.js';
        const appTemplatePath = path.join(__dirname, 'templates', appFileName === 'app.ts' ? 'app.ts.ejs' : 'app.js.ejs');

        const templateData = {
            projectName: answers.projectName,
            middleware: answers.middleware,
            logging: answers.logging,
            linting: answers.linting
        };

        const renderedApp = await ejs.renderFile(appTemplatePath, templateData);
        await fs.writeFile(path.join(projectPath, 'src', appFileName), renderedApp.trim());

        // Docker setup
        // Write the Dockerfile to the project folder
        // await fs.outputFile(path.join(projectPath, 'Dockerfile'), dockerfileContent);
        // console.log('🐳 Dockerfile created successfully!');
        // Render Dockerfile using EJS template
        const dockerfileContent = await ejs.renderFile(
            path.join(__dirname, 'templates', 'dockerfile.ejs'), // path to the Dockerfile EJS template
            {} // You can pass any dynamic data if needed in the template
        );

        // Write the Dockerfile to the project folder
        await fs.outputFile(path.join(projectPath, 'Dockerfile'), dockerfileContent.trim());
        console.log('🐳 Dockerfile created successfully!');

        const dockerignoreContent = await ejs.renderFile(
            path.join(__dirname, 'templates', 'dockerignore.ejs'), // path to the Dockerfile EJS template
            {} // You can pass any dynamic data if needed in the template
        );
        // Write the .dockerignore file to the project folder
        await fs.outputFile(path.join(projectPath, '.dockerignore'), dockerignoreContent);
        console.log('🐳 .dockerignore created successfully!');


        // --------------------
        // 📦 Generate package.json from template
        // --------------------
        console.log('\n🛠️ Initializing package.json...\n');
        const pkgJsonContent = await ejs.renderFile(
            path.join(__dirname, 'templates', 'package.json.ejs'),
            answers
        );
        await fs.outputFile(path.join(projectPath, 'package.json'), pkgJsonContent.trim());

        if (answers.linting) {
            const lintingTemplates = ['.eslintrc.js', '.prettierrc'];
            for (const file of lintingTemplates) {
                const rendered = await ejs.renderFile(
                    path.join(__dirname, 'templates', 'linting', `${file}.ejs`),
                    { language: answers.language }
                );
                await fs.outputFile(path.join(projectPath, file), rendered);
            }

            await fs.outputFile(path.join(projectPath, '.eslintignore'), 'node_modules\ndist\n');
            await fs.outputFile(path.join(projectPath, '.prettierignore'), 'node_modules\ndist\n');
        }

        // --------------------
        // 📦 Install Dependencies
        // --------------------
        const dependencies = ['express'];
        const devDependencies = [];

        if (answers.database === 'MongoDB') {
            dependencies.push('mongoose');
        } else if (answers.database === 'PostgreSQL') {
            dependencies.push('@prisma/client', 'prisma');
        }

        if (answers.auth) {
            dependencies.push('jsonwebtoken', 'bcryptjs', 'dotenv');
        }

        if (answers.middleware.includes('CORS')) {
            dependencies.push('cors');
        }
        if (answers.middleware.includes('Helmet')) {
            dependencies.push('helmet');
        }
        if (answers.middleware.includes('Rate Limiting')) {
            dependencies.push('express-rate-limit');
        }

        if (answers.language === 'TypeScript') {
            devDependencies.push('typescript', 'ts-node-dev', '@types/node', '@types/express');
        }

        if (answers.logging) {
            dependencies.push('winston', 'morgan');
        }

        if (answers.logging) {
            const loggerContent = await ejs.renderFile(
                path.join(__dirname, 'templates', 'config', 'logger.js.ejs')
            );
            await fs.outputFile(path.join(projectPath, 'src', 'config', 'logger.js'), loggerContent.trim());
        }
        if (answers.linting) {
            if (answers.language === 'TypeScript') {
                devDependencies.push(
                    'eslint',
                    'prettier',
                    'eslint-config-prettier',
                    'eslint-plugin-prettier',
                    '@typescript-eslint/parser',
                    '@typescript-eslint/eslint-plugin',
                    'typescript'
                );
            } else {
                devDependencies.push(
                    'eslint',
                    'prettier',
                    'eslint-config-prettier',
                    'eslint-plugin-prettier'
                );
            }
        }

        //    console.log(chalk.yellow(`\n📦 Installing dependencies: ${dependencies.join(', ')}\n`));
        const spinner = ora(`Installing dependencies: ${dependencies.join(', ')}`).start();
        try {
            execSync(`npm install ${dependencies.join(' ')}`, {
                cwd: projectPath,
                stdio: 'inherit'
            });
            spinner.succeed('Dependencies installed successfully!');
        } catch (installError) {
            spinner.fail('Failed to install dependencies');
            console.error(chalk.red(installError));
        }
        if (devDependencies.length > 0) {
            console.log(chalk.yellow(`\n📦 Installing dependencies: ${dependencies.join(', ')}\n`));
            execSync(`npm install -D ${devDependencies.join(' ')}`, {
                cwd: projectPath,
                stdio: 'inherit'
            });
        }

        // --------------------
        // 🔧 Initialize Prisma if PostgreSQL
        // --------------------
        if (answers.database === 'PostgreSQL') {
            console.log('\n⚙️ Initializing Prisma...\n');
            execSync(`npx prisma init`, {
                cwd: projectPath,
                stdio: 'inherit'
            });
        }

        // --------------------
        // 📄 Create tsconfig.json if TypeScript
        // --------------------
        if (answers.language === 'TypeScript') {
            console.log('\n📄 Creating tsconfig.json...\n');

            const tsConfig = {
                "compilerOptions": {
                    "target": "ES6",
                    "module": "CommonJS",
                    "rootDir": "./src",
                    "outDir": "./dist",
                    "esModuleInterop": true,
                    "forceConsistentCasingInFileNames": true,
                    "strict": true,
                    "skipLibCheck": true
                }
            };

            await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
        }

        // --------------------
        // 🧬 Initialize Git
        // --------------------
        const gitignoreContent = await ejs.renderFile(
            path.join(__dirname, 'templates', 'gitignore.ejs'), // path to the Dockerfile EJS template
            {} // You can pass any dynamic data if needed in the template
        );
        await fs.outputFile(path.join(projectPath, '.gitignore'), gitignoreContent);
        console.log('\n🔧 Initializing Git repository...\n');
        try {
            execSync(`git init`, { cwd: projectPath, stdio: 'inherit' });
            execSync(`git add .`, { cwd: projectPath, stdio: 'inherit' });
            execSync(`git commit -m "Initial commit"`, { cwd: projectPath, stdio: 'inherit' });
            console.log('✅ Git repo initialized!');
        } catch (gitError) {
            console.error('⚠️ Failed to initialize Git:', gitError.message);
        }

        // --------------------
        // 🎉 Done!
        // --------------------
        console.log(`\n🎉 Project '${answers.projectName}' created and setup complete!`);
        console.log(`📁 Location: ${projectPath}`);
        console.log(`👉 Start coding:\n`);
        console.log(`   cd ${answers.projectName}`);
        console.log(`   npm start\n`);

        // Docker build & run instructions
        console.log(`🐳 Docker instructions:`);
        console.log(`   To build the Docker image:`);
        console.log(`   docker build -t ${answers.projectName} .`);
        console.log(`   To run the Docker container:`);
        console.log(`   docker run -p 3000:3000 ${answers.projectName}`);

    } catch (error) {
        console.error(chalk.red('❌ Error creating project:', error));
    }
});
