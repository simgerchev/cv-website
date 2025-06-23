import React, { useState, useRef, useEffect } from "react";

// Realistic, nested filesystem
const FILESYSTEM = {
  bin: {
    "ls": null,
    "cat": null,
    "echo": null,
    "bash": null,
    "touch": null,
    "mkdir": null,
    "rm": null,
  },
  etc: {
    "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash",
    "hosts": "127.0.0.1 localhost\n192.168.1.1 router",
    "motd": "Welcome to your simulated terminal!",
    "profile": "# System-wide profile",
  },
  home: {
    user: {
      ".bashrc": "# .bashrc config\nexport PATH=$PATH:/usr/local/bin",
      ".profile": "# .profile config\n# User profile settings",
      ".gitconfig": "[user]\n\tname = User\n\temail = user@example.com",
      "about.txt": "This is the about file.",
      "resume.pdf": null,
      "contact.txt": "Email: user@example.com",
      "notes.md": "# Notes\n- Learn React\n- Build a terminal",
      "README.md": "# Welcome to your home directory!",
      "projects": {
        "cv-website": {
          "README.md": "# CV Website\nA personal CV website.",
          "src": {
            "App.js": "// React app entry point",
            "index.js": "// ReactDOM.render(...)",
          },
          "public": {
            "index.html": "<!DOCTYPE html>...",
          },
          "package.json": "{...}",
          ".gitignore": "node_modules/\nbuild/",
        },
        "portfolio-site": {
          "index.html": "<!DOCTYPE html>...",
          "styles.css": "body { ... }",
          "app.js": "// JavaScript code",
          "LICENSE": "MIT License",
        },
        "python-scripts": {
          "data_cleaner.py": "# Python script",
          "web_scraper.py": "# Another script",
          "README.md": "# Python Scripts",
        },
      },
      "skills": {
        "react.md": "React skills and experience.",
        "css.md": "CSS skills.",
        "javascript.md": "JavaScript skills.",
        "nodejs.md": "Node.js skills.",
        "python.md": "Python skills.",
      },
      "Downloads": {
        "sample.zip": null,
        "image.png": null,
        "report.pdf": null,
      },
      "Pictures": {
        "vacation.jpg": null,
        "profile.png": null,
        "screenshot.png": null,
      },
      "Documents": {
        "cv.docx": null,
        "cover_letter.docx": null,
      },
      "Music": {
        "song.mp3": null,
      },
      "Videos": {
        "demo.mp4": null,
      },
      "Desktop": {
        "todo.txt": "- Finish CV website\n- Email recruiter",
      },
    },
  },
  tmp: {},
  var: {
    log: {
      "system.log": "",
      "app.log": "",
    },
    tmp: {},
  },
  usr: {
    bin: {
      "python": null,
      "node": null,
      "npm": null,
      "git": null,
      "vim": null,
      "nano": null,
    },
    share: {
      "man": {},
      "doc": {},
    },
    local: {
      "bin": {},
      "share": {},
    },
  },
  dev: {},
  mnt: {},
  media: {},
};

// Helper: Normalize and resolve a path string to an array of path parts
function normalizePath(cwd, inputPath) {
  let path = inputPath.trim();
  if (!path) return cwd;
  if (path === "~") return "/home/user";
  let parts;
  if (path.startsWith("/")) {
    parts = path.split("/").filter(Boolean);
  } else {
    parts = cwd.split("/").filter(Boolean).concat(path.split("/").filter(Boolean));
  }
  const stack = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }
  return "/" + stack.join("/");
}

// Helper: Get the filesystem node at a given path
function getNode(fs, path) {
  if (path === "/") return fs;
  const parts = path.split("/").filter(Boolean);
  let node = fs;
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = node[part];
    } else {
      return null;
    }
  }
  return node;
}

// Command registry
const commandRegistry = [
  {
    name: "help",
    description: "List available commands",
    handler: ({ registry }) =>
      "Available commands:\n" +
      registry.map((cmd) => `${cmd.name} - ${cmd.description}`).join("\n"),
  },
  {
    name: "about",
    description: "About this terminal",
    handler: () =>
      "This is a simulated bash terminal in your browser. Type 'help' to see commands.",
  },
  {
    name: "whoami",
    description: "Show user name",
    handler: () => "user",
  },
  {
    name: "pwd",
    description: "Print working directory",
    handler: ({ cwd }) => cwd,
  },
  {
    name: "ls",
    description: "List files in current directory",
    handler: ({ cwd }) => {
      const node = getNode(FILESYSTEM, cwd);
      if (!node || typeof node !== "object") return "ls: not a directory";
      const entries = Object.keys(node);
      return entries.length ? entries.join("  ") : "";
    },
  },
  {
    name: "cd",
    description: "Change directory",
    handler: ({ args, cwd, setCwd }) => {
      const target = args[0] || "~";
      const newPath = normalizePath(cwd, target);
      const node = getNode(FILESYSTEM, newPath);
      if (node && typeof node === "object") {
        setCwd(newPath);
        return "";
      } else {
        return `cd: no such file or directory: ${target}`;
      }
    },
  },
  {
    name: "cat",
    description: "Show file contents",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "cat: missing file operand";
      const filePath = normalizePath(cwd, args[0]);
      const node = getNode(FILESYSTEM, filePath);
      if