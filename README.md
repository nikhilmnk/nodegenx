# Nodegenx

Nodegenx is a CLI tool designed to generate a complete Node.js backend project structure quickly and efficiently. It provides ready-made templates with organized folder and file structures, helping developers save time and start building right away.

---

## 📦 Package Information
- **Name**: nodegenx  
- **Version**: 1.0.2  
- **Repository**: [GitHub](https://github.com/nikhilmnk/nodegenx)  
- **Author**: M Nikhil Kumar  
- **License**: MIT

---

## 🚀 Installation
You can use **npx** to run Nodegenx without installing it globally:

npx nodegenx


---

## ⚙️ Requirements

* **Node.js**: v16 or higher

---

## 📂 Templates

Currently, Nodegenx provides **one template** with a pre-defined folder and file structure. More templates will be added in the future.

### Available Template(s)

* **--template** *(default)*

#### Example Structure:

```bash
my-node-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── tests/
├── package.json
├── .gitignore
└── README.md
```

---

### 1. **ecommerce**

```base
ecommerce/
│   .env
│   .eslintrc.js
│   .prettierrc
│   package.json
└───src
    │   app.js
    ├───config
    │       db.js
    ├───controllers
    │       auth.controller.js
    ├───middlewares
    │       auth.middleware.js
    ├───models
    │       user.model.js
    └───routes
            auth.routes.js
```

---

### 2. **js-jwt-rest**

```
js-jwt-rest/
│   .env
│   .eslintrc.js
│   .prettierrc
│   package.json
└───src
    │   app.js
    ├───config
    │       db.js
    ├───controllers
    │       auth.controller.js
    ├───middlewares
    │       auth.middleware.js
    ├───models
    │       user.model.js
    └───routes
            auth.routes.js
```

---

### 3. **js-rest-swagger**

```
js-rest-swagger/
│   .env
│   .eslintrc.js
│   package.json
└───src
    │   app.js
    ├───config
    │       db.js
    └───swagger
            swagger.js
```

---

### 4. **linting**

```
linting/
│   .eslintrc.js.ejs
│   .prettierrc.ejs
```

---

### 5. **node-oauth-rest**

```
node-oauth-rest/
│   .env
│   .eslintrc.js
│   .prettierrc
│   package.json
└───src
    │   app.js
    ├───config
    │       db.js
    ├───controllers
    │       auth.controller.js
    ├───middlewares
    │       auth.middleware.js
    ├───models
    │       user.model.js
    └───routes
            auth.routes.js
```

---

### 6. **node-prisma-rest**

```
node-prisma-rest/
│   .env
│   .eslintrc.js
│   package.json
├───prisma
│       schema.prisma
└───src
    │   app.js
    ├───config
    │       db.js
    ├───controllers
    │       example.controller.js
    ├───middlewares
    │       example.middleware.js
    ├───models
    │       example.model.js
    └───routes
            example.routes.js
```

---

### 7. **node-serverless-template**

```
node-serverless-template/
│   .env
│   package.json
│   serverless.yml
└───src
    ├───functions
    │       auth.js
    ├───middlewares
    │       authMiddleware.js
    ├───models
    │       user.js
    └───utils
            response.js
```

---

### 8. **ts-event-driven**

```
ts-event-driven/
│   .env
│   .eslintrc.js
│   package.json
│   tsconfig.json
└───src
    │   app.ts
    ├───config
    │       db.ts
    ├───controllers
    │       sampleController.ts
    ├───events
    │   ├───consumers
    │   │       sampleConsumer.ts
    │   └───producers
    │           sampleProducer.ts
    └───middlewares
            loggerMiddleware.ts
```

---

### 9. **ts-jwt-graphql**

```
ts-jwt-graphql/
│   .env
│   .eslintrc.js
│   .prettierrc
│   package.json
│   tsconfig.json
└───src
    │   app.ts
    ├───config
    │       db.ts
    ├───graphql
    │   │   schema.ts
    │   └───resolvers
    │           user.resolver.ts
    ├───middlewares
    │       auth.middleware.ts
    └───models
            user.model.ts
```

---

### 10. **ts-microservice-template**

```
ts-microservice-template/
│   .env
│   .eslintrc.js
│   package.json
│   tsconfig.json
└───src
    │   app.ts
    ├───controllers
    │       user.controller.ts
    ├───middlewares
    │       auth.middleware.ts
    ├───routes
    │       user.routes.ts
    └───services
            authService.ts
            userService.ts
```

> Each template will come with its own detailed description and file/folder tree.

---

## 🛠️ Usage

You can generate a project with or without specifying a template:

### Default usage or custom template design

```bash
npx nodegenx
```

### With template option

```bash
npx nodegenx --template <template-name>
```

> Replace `<template-name>` with any available template name.

---

## 📖 Examples

Generate a project using the default template:

```bash
npx nodegenx
```

Generate a project using a specific template:

```bash
npx nodegenx --template basic-express
```

---

## 📌 Roadmap

* Add more templates (Express, GraphQL, REST API, etc.)
* Auto-install Node modules (optional)
* Docker and Git configuration options
* Contributing guidelines



---

## ✨ Philosophy

Nodegenx aims to be **friendly, clear, and developer-focused**, with an emphasis on a **quick start** experience.

---

## 📄 License

This project is licensed under the MIT License.



