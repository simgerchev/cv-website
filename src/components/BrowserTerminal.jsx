import React, { useState, useRef, useEffect } from "react";

const COMMANDS = {
  help: "Available commands: help, about, clear, hello, date, echo, random, whoami, ls, pwd, cd",
  about: "This is a simulated bash terminal in your browser. Type 'help' to see commands.",
  hello: "Hello, user! 👋",
  whoami: "user",
};

const FILESYSTEM = {
  "~": ["projects", "skills", "about.txt"],
  "/projects": ["cv-website", "bash-sim"],
  "/skills": ["react", "css", "javascript"],
};

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

  const processCommand = (cmd) => {
    if (cmd === "") return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    let output = "";
    if (cmd === "pwd") {
      output = cwd;
    } else if (cmd === "ls") {
      output = (FILESYSTEM[cwd] || []).join("  ");
    } else if (cmd.startsWith("cd")) {
      const arg = cmd.slice(2).trim();
      if (!arg || arg === "~") {
        setCwd("~");
        output = "";
      } else if (arg === "..") {
        if (cwd === "~") {
          output = "";
        } else {
          const parts = cwd.split("/");
          parts.pop();
          let newPath = parts.join("/");
          if (newPath === "") newPath = "~";
          setCwd(newPath);
          output = "";
        }
      } else if (arg.startsWith("/")) {
        if (FILESYSTEM[arg]) {
          setCwd(arg);
          output = "";
        } else {
          output = `cd: no such file or directory: ${arg}`;
        }
      } else {
        const newPath = cwd === "~" ? `/${arg}` : `${cwd}/${arg}`;
        if (FILESYSTEM[newPath]) {
          setCwd(newPath);
          output = "";
        } else {
          output = `cd: no such file or directory: ${arg}`;
        }
      }
    } else if (cmd.startsWith("echo ")) {
      output = cmd.slice(5);
    } else if (cmd === "date") {
      output = new Date().toString();
    } else if (cmd === "random") {
      output = "Random number: " + Math.floor(Math.random() * 10000);
    } else if (COMMANDS[cmd]) {
      output = COMMANDS[cmd];
    } else {
      output = `bash: command not found: ${cmd}`;
    }
    setLines((prev) => [...prev, `${prompt} ${cmd}`, ...(output ? [output] : [])]);
  };

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