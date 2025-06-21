import React, { useState, useRef, useEffect } from "react";

// Realistic, nested filesystem
const FILESYSTEM = {
  bin: {
    "ls": null,
    "cat": null,
    "echo": null,
    "bash": null,
  },
  etc: {
    "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash",
    "hosts": "127.0.0.1 localhost\n192.168.1.1 router",
    "motd": "Welcome to your simulated terminal!",
  },
  home: {
    user: {
      ".bashrc": "# .bashrc config",
      ".profile": "# .profile config",
      "about.txt": "This is the about file.",
      "resume.pdf": null,
      "contact.txt": "Email: user@example.com",
      "notes.md": "# Notes\n- Learn React\n- Build a terminal",
      projects: {
        "cv-website": {
          "README.md": "# CV Website\nA personal CV website.",
          src: {},
          public: {},
          "package.json": "{...}",
        },
        "portfolio-site": {
          "index.html": "<!DOCTYPE html>...",
          "styles.css": "body { ... }",
          "app.js": "// JavaScript code",
        },
        "python-scripts": {
          "data_cleaner.py": "# Python script",
          "web_scraper.py": "# Another script",
        },
      },
      skills: {
        "react.md": "React skills and experience.",
        "css.md": "CSS skills.",
        "javascript.md": "JavaScript skills.",
        "nodejs.md": "Node.js skills.",
        "python.md": "Python skills.",
      },
      Downloads: {
        "sample.zip": null,
        "image.png": null,
      },
      Pictures: {
        "vacation.jpg": null,
        "profile.png": null,
      },
    },
  },
  tmp: {},
  var: {
    log: {
      "system.log": "",
      "app.log": "",
    },
  },
  usr: {
    bin: {
      "python": null,
      "node": null,
      "npm": null,
    },
    share: {},
  },
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
      if (node === null) return ""; // empty file
      if (typeof node === "string") return node;
      if (typeof node === "object") return `cat: ${args[0]}: Is a directory`;
      return `cat: ${args[0]}: No such file`;
    },
  },
  {
    name: "echo",
    description: "Echo arguments",
    handler: ({ args }) => args.join(" "),
  },
  {
    name: "date",
    description: "Show current date/time",
    handler: () => new Date().toString(),
  },
  {
    name: "random",
    description: "Show a random number",
    handler: () => "Random number: " + Math.floor(Math.random() * 10000),
  },
  {
    name: "clear",
    description: "Clear the terminal",
    handler: ({ setLines }) => {
      setLines([]);
      return null;
    },
  },
];

export default function BrowserTerminal() {
  const [lines, setLines] = useState([
    "Welcome to the Browser Terminal!",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/user");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const prompt = `user@site:${cwd}$`;

  const handleInput = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand(input.trim());
      setInput("");
    }
  };

  function processCommand(cmdLine) {
    if (cmdLine === "") return;
    const [cmd, ...args] = cmdLine.split(" ");
    const command = commandRegistry.find((c) => c.name === cmd);

    if (!command) {
      setLines((prev) => [
        ...prev,
        `${prompt} ${cmdLine}`,
        `bash: command not found: ${cmd}`,
      ]);
      return;
    }

    // Special handling for clear (it resets lines)
    if (cmd === "clear") {
      command.handler({ setLines });
      return;
    }

    const output = command.handler({
      args,
      cwd,
      setCwd,
      setLines,
      registry: commandRegistry,
    });

    setLines((prev) => [
      ...prev,
      `${prompt} ${cmdLine}`,
      ...(output !== null && output !== undefined && output !== "" ? [output] : []),
    ]);
  }

  return (
    <div className="browser-terminal">
      <div className="browser-terminal-lines" ref={terminalRef}>
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <div className="browser-terminal-input-row">
        <span className="browser-terminal-prompt">{prompt}</span>
        <input
          type="text"
          className="browser-terminal-input"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}