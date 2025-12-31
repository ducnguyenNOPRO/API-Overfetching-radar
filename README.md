# Project Title

A tool to help detect and analyze API overfetching by intercepting API calls and tracking used/unused fields. Support either axios or fetching API. 

It monitor the respones from GET Request, records every fields (stored as paths) that the web page used and a generate a report.

# Installation

Install the package via npm:
```bash
npm install api-overfetching-radar
```

**If you want to build and test the tool locally from the Git repository:**
```bash
git clone https://github.com/ducnguyenNOPRO/API-Overfetching-radar.git
cd API-Overfetching-radar
npm install
npm run test
```
# Usage

## In a Js/Ts project:
Import and use the functions directly (after installing via npm):
```bash
import { attachInterceptor, buildReport, clearReport } from 'api-overfetching-radar';

attachInterceptor();

// Later, e.g. on user action (button click, etc.):
const report = buildReport();
console.log(report);

// Reset if needed
clearReport();
```

## Cloned repo / Simple testing:
Put your .html in root dir
Inject a script (after npm run test)
```bash
<script src="./dist/index.global.js"></script>
```

