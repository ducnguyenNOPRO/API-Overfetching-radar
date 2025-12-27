# Project Title

A simple testing tool for checking if an API is overfetching using a proxy wrapper around your response before it's used in the frontend
Support either axios or fetching API

**Currently in Progress**

# Installation

Only need to install vite for bundle build

```bash
npm install -D vite typescript
```

# Usage

**need an .html file in the root folder (package.json, tsconfig.json, etc)**

## 1. Bundle all the file

Rename either interceptors to a .txt file depend on whether you're using either axios or fetch API for fetching
Then:
```bash
npx vite build
```

## 2. Webpage

**Right now only work for simple .html webpage for fetching data**

Add a script to your .html file

```bash
<script src="./dist/api-overfetch-inspector.umd.js"></script>
```

Navigate the app as normal and after fetching data. In the console do:

```bash
__OVERFETCH_REPORT__ ()
```

*usedPath is what field did the website used -> eg. user, user.name, user.addrress.city, etc.
*unusedPath is compared again allPaths built from the response
