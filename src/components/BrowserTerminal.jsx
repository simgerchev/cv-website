import React, { useState, useRef, useEffect } from "react";

const FILESYSTEM = {
  home: {
    user: {
      "about.txt": "This is the about file.",
      "resume.pdf": null,
      "contact.txt": "Email: user@example.com",
      projects: {
        "cv-website": {
          "README.md": "# CV Website\nA personal CV website.",
          "src": {},
          "public": {},
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
    },
  },
  etc: {
    "config.json": "{...}",
  },
  var: {
    log: {
      "system.log": "",
    },
  },
};

// Command registry for scalability
const commandRegistry = [
  {
    name: "help",
    description: "List available commands",
    handler: ({ registry }) =>
      "Available commands: " + registry.map((cmd) => cmd.name).join(", "),
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
    handler: () => "user", // can be replaced with a dynamic username
  },
  {
    name: "pwd",
    description: "Print working directory",
    handler: ({ cwd }) => cwd,
  },
  {
    name: "ls",
    description: "List files in current directory",
    handler: ({ cwd }) => (FILESYSTEM[cwd] || []).join("  "),
  },
  {
    name: "cd",
    description: "Change directory",
    handler: ({ args, cwd, setCwd }) => {
      const arg = args[0];
      if (!arg || arg === "~") {
        setCwd("~");
        return "";
      } else if (arg === "..") {
        if (cwd === "~") return "";
        const parts = cwd.split("/");
        parts.pop();
        let newPath = parts.join("/");
        if (newPath === "") newPath = "~";
        setCwd(newPath);
        return "";
      } else if (arg.startsWith("/")) {
        if (FILESYSTEM[arg]) {
          setCwd(arg);
          return "";
        } else {
          return `cd: no such file or directory: ${arg}`;
        }
      } else {
        const newPath = cwd === "~" ? `/${arg}` : `${cwd}/${arg}`;
        if (FILESYSTEM[newPath]) {
          setCwd(newPath);
          return "";
        } else {
          return `cd: no such file or directory: ${arg}`;
        }
      }
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
  const [cwd, setCwd] = useState("~");
  const terminalRef = useRef(null);

  useEffect(() => {
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  const prompt = `user@site:${cwd}$`;

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand(input.trim());
      setInput("");
    }
  };

  function processCommand(cmdLine) {
    if (cmdLine === "") return;
    const [cmd, ...args] = cmdLine.split(" ");

    // Check if the command is in the registry
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

    // For commands that may need state
    const output = command.handler({
      args,
      cwd,
      setCwd,
      setLines,
      registry: commandRegistry,
    });

    // If the output is null, we don't want to add a new line
    setLines((prev) => [
      ...prev,
      `${prompt} ${cmdLine}`,
      ...(output ? [output] : []),
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