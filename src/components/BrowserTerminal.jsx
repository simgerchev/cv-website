import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

// Minimal game-like filesystem structure
const FILESYSTEM = {
  home: {
    user: {
      "readme.md": { content: "Welcome to your home directory!", mode: "0644", owner: "user" },
      "first-level": {
  "tasks.txt": { content: `Level 1 Tasks (Expert):\n1. Find the real flag hidden in a deeply nested folder.\n2. The file is encoded in base64. Decode it to get the flag.\n3. There are fake flags and decoy files.\n\nTip: Use find, cat, and base64 decoding.\n`, mode: "0644", owner: "user" },
        Documents: {
          "not_the_secret.txt": { content: "Just a decoy!", mode: "0644", owner: "user" },
          "fake_flag.txt": { content: "FLAG-FAKE-1", mode: "0644", owner: "user" },
        },
        Deep: {
          "deeper": {
            "even_deeper": {
              "real_flag.b64": { content: "RnVsbHkgRnVsbHkgRnVsbHkgRmxhZyBmb3VuZDogRXhwZXJ0IEV4cGVydCBFeHBlcnQgRmxhZy1FWFBFUlQ=", mode: "0644", owner: "user" }
            },
            "decoy.b64": { content: "RkxBRy1GQUtF", mode: "0644", owner: "user" }
          }
        }
      },
      "second-level": {
        "tasks.txt": { content: `Level 2 Tasks (Expert):\n1. Create a file called completed.txt in your home directory.\n2. Write 'Victory!' inside completed.txt.\n3. Change its permissions to 600 and owner to root (requires sudo).\n4. Prove you did it by showing its contents and permissions.\n5. There is a fake completed.txt in a subfolder.\n\nTip: Use echo, touch, chmod, chown, and ls -l.\n`, mode: "0644", owner: "user" },
        Hints: {
          "clue1.txt": { content: "Check file permissions with ls -l.", mode: "0644", owner: "user" },
        },
        Subfolder: {
          "completed.txt": { content: "Not the real one!", mode: "0644", owner: "user" }
        },
        // The real completed.txt starts as root-owned
        "completed.txt": { content: "", mode: "0644", owner: "root" }
      },
      // Hide sudo password in a hidden file in home directory
  ".sudo_password": { content: "hunter2", mode: "0644", owner: "user" },
      "third-level": {
        "tasks.txt": { content: `Level 3 Tasks (Expert):\n1. Find the sudo password hidden in a file with restricted permissions.\n2. Use sudo to access a locked file in Vault.\n3. The Vault contains a zip file.\n4. Unzip the file and find the flag inside.\n\nTip: Use sudo cat, unzip, and find the password first.\n`, mode: "0644", owner: "user" },
        ".hidden": {
          "password.txt": { content: "hunter2", mode: "0400", owner: "root" }
        },
        Vault: {
          "locked.zip": { content: "UEsDBBQAAAAIAAAAIQAAAAAAAAAAAAAAAABwYXlsb2FkLnR4dFBLBQYAAAAAAQABADYAAABJQ0UgRmxhZyBmb3VuZDogRmxhZy1FWFBFUlQ=", mode: "0400", owner: "root" },
          // base64-encoded zip with file payload.txt containing the flag
        },
      },
      "fourth-level": {
  "tasks.txt": { content: `Level 4 Tasks (Expert):\n1. Find and decode the base64 message in message.b64.\n2. The decoded message is a hint for another file.\n3. Use the hint to find and read the next flag.\n\nTip: Use base64 and follow the hint.\n`, mode: "0644", owner: "user" },
  "message.b64": { content: "This is the hint: hint.txt", mode: "0644", owner: "user" },
  "hint.txt": { content: "FLAG-LEVEL4-EXPERT: You followed the hint!", mode: "0644", owner: "user" },
      },
      "fifth-level": {
        "tasks.txt": { content: `Level 5 Tasks (Expert):\n1. Use grep and sort to find the hidden flag in logs.txt.\n2. The flag is surrounded by noise, fake flags, and out-of-order lines.\n3. Only the correct flag counts.\n\nTip: grep for FLAG-EXPERT and sort the results.\n`, mode: "0644", owner: "user" },
        "logs.txt": { content: "Info: All systems go\nFLAG-FAKE: Not this one\nWarning: Disk space low\nFLAG-EXPERT: Well done!\nError: Something went wrong\nFLAG-FAKE: Nope\nFLAG-EXPERT: You found another!\n", mode: "0644", owner: "user" },
      },
      "sixth-level": {
        "tasks.txt": { content: `Level 6 Tasks (Expert):\n1. Use pipes to extract the last line from data.txt.\n2. The last line contains a code, but the code is hex encoded.\n3. Decode the code and use it to unlock code.txt.\n\nTip: Use cat data.txt | tail -1, then decode hex, then cat code.txt.\n`, mode: "0644", owner: "user" },
        "data.txt": { content: "First line\nSecond line\nThird line\n434F44452D4C4556454C362D455h54504552", mode: "0644", owner: "user" },
        "code.txt": { content: "FLAG-LEVEL6-EXPERT: You unlocked the hex code!", mode: "0644", owner: "user" },
      },
      "seventh-level": {
        "tasks.txt": { content: `Level 7 Tasks (Expert):\n1. Move flag.txt to the folder called destination.\n2. Copy flag.txt to backup.txt in the same folder.\n3. Only the backup.txt contains the real flag.\n\nTip: Use mv and cp.\n`, mode: "0644", owner: "user" },
        "flag.txt": { content: "Not the real flag!", mode: "0644", owner: "user" },
        "destination": {
          "backup.txt": { content: "FLAG-LEVEL7-EXPERT: Five operations complete!", mode: "0644", owner: "user" }
        },
      },
      "eighth-level": {
  "tasks.txt": { content: `Level 8 Tasks (Expert):\n1. Find the file owned by root (rootfile.txt).\n2. Change its owner to user using sudo chown.\n3. Edit the file to add your name.\n\nTip: Use sudo chown and echo.\n`, mode: "0644", owner: "user" },
  "rootfile.txt": { content: "FLAG-LEVEL8-EXPERT: Ownership changed! Add your name here:", mode: "0644", owner: "root" },
      },
    },
  },
  tmp: {},
};

/* Helper: Normalize a path based on current working directory (cwd) */
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

/* Helper: Get a node from the filesystem by path */
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
    name: "sudo",
    description: "Run command as superuser",
    handler: ({ args, setSudoPrompt, setSudoCommand, setLines, prompt }) => {
      if (!args[0]) return "sudo: missing command operand";
      setSudoPrompt(true);
      setSudoCommand(args.join(" "));
      setLines((prev) => [...prev, `${prompt} sudo ${args.join(" ")}`, `[sudo] password for user:`]);
      return null;
    },
  },
  {
    name: "chmod",
    description: "Change file mode bits",
    handler: ({ args, cwd, sudo }) => {
      if (args.length < 2) return "chmod: missing operand";
      const mode = args[0];
      const filePath = normalizePath(cwd, args[1]);
      const parts = filePath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) return `chmod: cannot access '${args[1]}': No such file or directory`;
        node = node[parts[i]];
      }
      const file = node[parts[parts.length - 1]];
      if (!file || typeof file !== "object" || !('content' in file)) return `chmod: cannot access '${args[1]}': No such file or directory`;
      // Only owner or sudo/root can change permissions
      if (file.owner !== "user" && !sudo) {
        return `chmod: changing permissions of '${args[1]}': Permission denied`;
      }
      file.mode = mode;
      return "";
    },
  },
  {
    name: "chown",
    description: "Change file owner",
    handler: ({ args, cwd }) => {
      if (args.length < 2) return "chown: missing operand";
      const owner = args[0];
      const filePath = normalizePath(cwd, args[1]);
      const parts = filePath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) return `chown: cannot access '${args[1]}': No such file or directory`;
        node = node[parts[i]];
      }
      const file = node[parts[parts.length - 1]];
      if (!file || typeof file !== "object" || !('content' in file)) return `chown: cannot access '${args[1]}': No such file or directory`;
      file.owner = owner;
      return "";
    },
  },
  {
    name: "head",
    description: "Show first lines of a file",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "head: missing file operand";
      const filePath = normalizePath(cwd, args[0]);
      const node = getNode(FILESYSTEM, filePath);
      if (typeof node !== "string") return `head: cannot open '${args[0]}': No such file`;
      const lines = node.split("\n").slice(0, args[1] ? parseInt(args[1], 10) : 10);
      return lines.join("\n");
    },
  },
  {
    name: "tail",
    description: "Show last lines of a file",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "tail: missing file operand";
      const filePath = normalizePath(cwd, args[0]);
      const node = getNode(FILESYSTEM, filePath);
      if (typeof node !== "string") return `tail: cannot open '${args[0]}': No such file`;
      const lines = node.split("\n");
      const n = args[1] ? parseInt(args[1], 10) : 10;
      return lines.slice(-n).join("\n");
    },
  },
  {
    name: "grep",
    description: "Search for a string in a file",
    handler: ({ args, cwd }) => {
      if (args.length < 2) return "grep: missing pattern or file";
      const pattern = args[0];
      const filePath = normalizePath(cwd, args[1]);
      const node = getNode(FILESYSTEM, filePath);
      if (typeof node !== "string") return `grep: cannot open '${args[1]}': No such file`;
      return node.split("\n").filter(line => line.includes(pattern)).join("\n");
    },
  },
  {
    name: "find",
    description: "Find files and directories",
    handler: ({ args, cwd }) => {
      // Simple recursive find from cwd
      function walk(node, path, results) {
        if (typeof node === "object" && node !== null) {
          for (const key of Object.keys(node)) {
            walk(node[key], `${path}/${key}`, results);
          }
        } else {
          results.push(path);
        }
      }
      const startPath = normalizePath(cwd, args[0] || ".");
      const node = getNode(FILESYSTEM, startPath);
      if (!node) return `find: '${args[0] || '.'}': No such file or directory`;
      const results = [];
      walk(node, startPath, results);
      return results.join("\n");
    },
  },
  {
    name: "touch",
    description: "Create an empty file",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "touch: missing file operand";
      let filePath = args[0];
      if (filePath === "~") filePath = "/home/user";
      else if (filePath.startsWith("~/")) filePath = "/home/user/" + filePath.slice(2);
      else filePath = normalizePath(cwd, filePath);
      const parts = filePath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) node[parts[i]] = {};
        node = node[parts[i]];
      }
      // Only create file if parent is a directory
      if (typeof node !== "object" || ('content' in node)) {
        return `touch: cannot create file at '${args[0]}': Not a directory`;
      }
      node[parts[parts.length - 1]] = { content: "", mode: "0644", owner: "user" };
      return "";
    },
  },
  {
    name: "mkdir",
    description: "Create a directory",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "mkdir: missing operand";
      const dirPath = normalizePath(cwd, args[0]);
      const parts = dirPath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) node[parts[i]] = {};
        node = node[parts[i]];
      }
      node[parts[parts.length - 1]] = {};
      return "";
    },
  },
  {
    name: "rm",
    description: "Remove a file",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "rm: missing operand";
      const filePath = normalizePath(cwd, args[0]);
      const parts = filePath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) return `rm: cannot remove '${args[0]}': No such file or directory`;
        node = node[parts[i]];
      }
      if (node[parts[parts.length - 1]] === undefined) {
        return `rm: cannot remove '${args[0]}': No such file or directory`;
      }
      if (typeof node[parts[parts.length - 1]] === "object") {
        return `rm: cannot remove '${args[0]}': Is a directory`;
      }
      delete node[parts[parts.length - 1]];
      return "";
    },
  },
  {
    name: "rmdir",
    description: "Remove an empty directory",
    handler: ({ args, cwd }) => {
      if (!args[0]) return "rmdir: missing operand";
      const dirPath = normalizePath(cwd, args[0]);
      const parts = dirPath.split("/").filter(Boolean);
      let node = FILESYSTEM;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) return `rmdir: failed to remove '${args[0]}': No such file or directory`;
        node = node[parts[i]];
      }
      if (typeof node[parts[parts.length - 1]] !== "object") {
        return `rmdir: failed to remove '${args[0]}': Not a directory`;
      }
      if (Object.keys(node[parts[parts.length - 1]]).length > 0) {
        return `rmdir: failed to remove '${args[0]}': Directory not empty`;
      }
      delete node[parts[parts.length - 1]];
      return "";
    },
  },
  {
    name: "echo",
    description: "Echo arguments or write to file",
    handler: ({ args, cwd }) => {
      // echo "text" > file.txt or echo "text" >> file.txt
      const redirectIdx = args.findIndex(a => a === '>' || a === '>>');
      if (redirectIdx > 0 && args[redirectIdx + 1]) {
        const text = args.slice(0, redirectIdx).join(' ');
        const op = args[redirectIdx];
        const filePath = normalizePath(cwd, args[redirectIdx + 1]);
        const parts = filePath.split("/").filter(Boolean);
        let node = FILESYSTEM;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!node[parts[i]]) node[parts[i]] = {};
          node = node[parts[i]];
        }
          if (!node[parts[parts.length - 1]] || typeof node[parts[parts.length - 1]] !== "object") {
            node[parts[parts.length - 1]] = { content: "", mode: "0644", owner: "user" };
          }
          if (op === '>') {
            node[parts[parts.length - 1]].content = text;
          } else if (op === '>>') {
            node[parts[parts.length - 1]].content += (node[parts[parts.length - 1]].content ? '\n' : '') + text;
          }
        return '';
      }
      return args.join(' ');
    },
  },
  {
    name: "mv",
    description: "Move or rename a file",
    handler: ({ args, cwd }) => {
      if (args.length < 2) return "mv: missing file operand";
      const srcPath = normalizePath(cwd, args[0]);
      const destPath = normalizePath(cwd, args[1]);
      const srcParts = srcPath.split("/").filter(Boolean);
      const destParts = destPath.split("/").filter(Boolean);
      let srcNode = FILESYSTEM;
      for (let i = 0; i < srcParts.length - 1; i++) {
        if (!srcNode[srcParts[i]]) return `mv: cannot stat '${args[0]}': No such file or directory`;
        srcNode = srcNode[srcParts[i]];
      }
      let destNode = FILESYSTEM;
      for (let i = 0; i < destParts.length - 1; i++) {
        if (!destNode[destParts[i]]) destNode[destParts[i]] = {};
        destNode = destNode[destParts[i]];
      }
      if (srcNode[srcParts[srcParts.length - 1]] !== undefined) {
        destNode[destParts[destParts.length - 1]] = srcNode[srcParts[srcParts.length - 1]];
        delete srcNode[srcParts[srcParts.length - 1]];
        return '';
      } else {
        return `mv: cannot stat '${args[0]}': No such file or directory`;
      }
    },
  },
  {
    name: "cp",
    description: "Copy a file",
    handler: ({ args, cwd }) => {
      if (args.length < 2) return "cp: missing file operand";
      const srcPath = normalizePath(cwd, args[0]);
      const destPath = normalizePath(cwd, args[1]);
      const srcParts = srcPath.split("/").filter(Boolean);
      const destParts = destPath.split("/").filter(Boolean);
      let srcNode = FILESYSTEM;
      for (let i = 0; i < srcParts.length - 1; i++) {
        if (!srcNode[srcParts[i]]) return `cp: cannot stat '${args[0]}': No such file or directory`;
        srcNode = srcNode[srcParts[i]];
      }
      let destNode = FILESYSTEM;
      for (let i = 0; i < destParts.length - 1; i++) {
        if (!destNode[destParts[i]]) destNode[destParts[i]] = {};
        destNode = destNode[destParts[i]];
      }
      if (srcNode[srcParts[srcParts.length - 1]] !== undefined) {
        destNode[destParts[destParts.length - 1]] = srcNode[srcParts[srcParts.length - 1]];
        return '';
      } else {
        return `cp: cannot stat '${args[0]}': No such file or directory`;
      }
    },
  },
  {
    name: "base64",
    description: "Encode or decode base64 data",
    handler: ({ args, cwd }) => {
      if (!args.length) return "base64: missing file operand";
      let decode = false;
      let fileArg = args[0];
      if (args[0] === "-d" || args[0] === "--decode") {
        decode = true;
        fileArg = args[1];
      }
      if (!fileArg) return "base64: missing file operand";
      const filePath = normalizePath(cwd, fileArg);
      const node = getNode(FILESYSTEM, filePath);
      if (!node || typeof node !== "object" || !('content' in node)) return `base64: ${fileArg}: No such file`;
      if (decode) {
        try {
          // Decode base64
          const decoded = atob(node.content);
          return decoded;
        } catch (e) {
          return "base64: decoding failed";
        }
      } else {
        // Encode base64
        try {
          const encoded = btoa(node.content);
          return encoded;
        } catch (e) {
          return "base64: encoding failed";
        }
      }
    },
  },
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
    description: "List directory contents",
    handler: ({ cwd, args }) => {
      let targetPath = cwd;
      // If a folder/file is specified as an argument, use it
      const folderArg = args.find(a => !a.startsWith("-"));
      if (folderArg) {
        targetPath = normalizePath(cwd, folderArg);
      }
      const node = getNode(FILESYSTEM, targetPath);
      if (!node) return `ls: cannot access '${folderArg || cwd}': No such file or directory`;
      if (typeof node !== "object" || ('content' in node)) return `ls: cannot access '${folderArg || cwd}': Not a directory`;
      let showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
      let longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al");
      let entries = Object.keys(node);
      if (!showAll) entries = entries.filter(e => !e.startsWith("."));
      if (longFormat) {
        const lines = [
          "total " + entries.length,
        ];
        for (const entry of entries) {
          const file = node[entry];
          const isDir = typeof file === "object" && file !== null && !('content' in file);
          let perms;
          if (isDir) {
            perms = "drwxr-xr-x";
          } else if (typeof file === "object" && 'mode' in file) {
            // Convert mode (e.g. "777", "644") to rwx string
            const mode = file.mode || "0644";
            const rwx = (n) => {
              n = parseInt(n, 10);
              return ((n & 4) ? 'r' : '-') + ((n & 2) ? 'w' : '-') + ((n & 1) ? 'x' : '-');
            };
            let m = mode.length === 4 ? mode.slice(1) : mode;
            perms = '-' + rwx(m[0]) + rwx(m[1]) + rwx(m[2]);
          } else {
            perms = "-rw-r--r--";
          }
          let size = isDir ? 4096 : (typeof file === "object" && 'content' in file ? file.content.length : typeof file === "string" ? file.length : 0);
          let owner = (typeof file === "object" && 'owner' in file) ? file.owner : "user";
          const date = "Sep 10 12:00";
          lines.push(`${perms} 1 ${owner} ${owner} ${size} ${date} ${entry}`);
        }
        return lines.join("\n");
      }
      return entries.join("  ");
    },
  },
  {
    name: "cd",
    description: "Change directory",
    handler: ({ args, cwd, setCwd }) => {
      const target = args[0] || "~";
      const newPath = normalizePath(cwd, target);
      const node = getNode(FILESYSTEM, newPath);
      if (!node) {
        return `cd: no such file or directory: ${target}`;
      }
      // Only allow cd into directories (not files)
      if (typeof node === "object" && !('content' in node)) {
        setCwd(newPath);
        return "";
      } else {
        return `cd: not a directory: ${target}`;
      }
    },
  },
  {
    name: "cat",
    description: "Concatenate and print files",
    handler: ({ args, cwd, sudo }) => {
      if (!args[0]) return "cat: missing file operand";
      let output = [];
      for (let i = 0; i < args.length; i++) {
        const filePath = normalizePath(cwd, args[i]);
        const node = getNode(FILESYSTEM, filePath);
        if (node === null) continue;
        if (typeof node === "string") output.push(node);
        else if (typeof node === "object" && 'content' in node) {
          // Permission check: allow if sudo or owner is user
          if (node.owner && node.owner !== "user" && !sudo) {
            output.push(`cat: ${args[i]}: Permission denied`);
          } else if (node.mode && node.mode[0] === "0" && node.mode !== "0644" && node.owner !== "user" && !sudo) {
            output.push(`cat: ${args[i]}: Permission denied`);
          } else {
            output.push(node.content);
          }
        }
        else if (typeof node === "object") output.push(`cat: ${args[i]}: Is a directory`);
        else output.push(`cat: ${args[i]}: No such file or directory`);
      }
      return output.join("\n");
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
    "joe@debian",
    "--------------------------",
    "OS: Debian GNU/Linux 12 (Bookworm) x86_64",
    "Host: BrowserTerminal (React)",
    "Kernel: 6.1.0-0-amd64",
    `Uptime: ${Math.floor(Math.random()*10+1)} hours`,
    "Packages: 42 (simulated)",
    "Shell: bash (simulated)",
    "Resolution: 1280x720 (browser)",
    "Terminal: BrowserTerminal.jsx",
    "Theme: Default",
    "--------------------------",
    "Welcome to the Browser Terminal!",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/user");
  const [sudoPrompt, setSudoPrompt] = useState(false);
  const [sudoCommand, setSudoCommand] = useState("");
  const [sudoAttempts, setSudoAttempts] = useState(0);
  const [sudoMode, setSudoMode] = useState(false);
  const [sudoTimer, setSudoTimer] = useState(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (sudoMode && !sudoTimer) {
      // Sudo lasts 5 seconds
      const timer = setTimeout(() => {
        setSudoMode(false);
        setSudoTimer(null);
        setLines((prev) => [...prev, "[sudo] session expired."]);
      }, 5000);
      setSudoTimer(timer);
    }
    return () => {
      if (sudoTimer) clearTimeout(sudoTimer);
    };
  }, [sudoMode]);

  const prompt = `${sudoMode ? "root" : "user"}@site:${cwd}$`;

  const handleInput = (e) => setInput(e.target.value);

  /* Handle keydown events for the input field */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (sudoPrompt) {
        handleSudoPassword(input.trim());
        setInput("");
      } else {
        processCommand(input.trim());
        setInput("");
      }
    }
  };

  function handleSudoPassword(pw) {
    const SUDO_PASSWORD = "hunter2";
    if (pw === SUDO_PASSWORD) {
      setLines((prev) => [...prev, `[sudo] password for user: ********`, "Access granted. Running: sudo " + sudoCommand]);
      setSudoMode(true);
      setSudoPrompt(false);
      setSudoAttempts(0);
      processCommand(sudoCommand, true);
      setSudoCommand("");
    } else {
      setSudoAttempts((prev) => prev + 1);
      if (sudoAttempts + 1 >= 3) {
        setLines((prev) => [...prev, `[sudo] password for user: ********`, "sudo: 3 incorrect password attempts"]);
        setSudoPrompt(false);
        setSudoCommand("");
        setSudoAttempts(0);
      } else {
        setLines((prev) => [...prev, `[sudo] password for user: ********`, "Sorry, try again."]);
      }
    }
  }

  /* Process the command input */
  function processCommand(cmdLine, runAsRoot = false) {
    if (cmdLine === "") return;
    // Sudo command handling
    if (!sudoPrompt && cmdLine.startsWith("sudo ")) {
      const rest = cmdLine.slice(5).trim();
      if (!rest) {
        setLines((prev) => [...prev, `${prompt} ${cmdLine}`, "sudo: missing command operand"]);
        return;
      }
      setSudoPrompt(true);
      setSudoCommand(rest);
      setLines((prev) => [...prev, `${prompt} ${cmdLine}`]);
      return;
    }
    // Pipe support: split by '|', trim, process sequentially
    const pipeParts = cmdLine.split('|').map(part => part.trim());
    let pipeInput = null;
    let lastOutput = null;
    for (let i = 0; i < pipeParts.length; i++) {
      const part = pipeParts[i];
      const [cmd, ...args] = part.split(' ');
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
      // For piped commands, pass previous output as input
      let output;
      // Pass sudoMode or runAsRoot to command handlers
      if (["grep", "head", "tail"].includes(cmd) && pipeInput !== null) {
        if (cmd === "grep") {
          output = pipeInput.split("\n").filter(line => line.includes(args[0])).join("\n");
        } else if (cmd === "head") {
          const n = args[0] ? parseInt(args[0], 10) : 10;
          output = pipeInput.split("\n").slice(0, n).join("\n");
        } else if (cmd === "tail") {
          const n = args[0] ? parseInt(args[0], 10) : 10;
          const lines = pipeInput.split("\n");
          output = lines.slice(-n).join("\n");
        }
      } else {
        output = command.handler({
          args,
          cwd,
          setCwd,
          setLines,
          registry: commandRegistry,
          sudo: sudoMode || runAsRoot,
          setSudoPrompt,
          setSudoCommand,
          prompt,
        });
      }
      pipeInput = output;
      lastOutput = output;
    }
    setLines((prev) => [
      ...prev,
      `${prompt} ${cmdLine}`,
      ...(lastOutput !== null && lastOutput !== undefined && lastOutput !== ""
        ? lastOutput.split("\n")
        : []),
    ]);
  }

  return (
    <div className="browser-terminal">
      <div className="browser-terminal-lines" ref={terminalRef}>
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
        {sudoPrompt && (
          <div>
            [sudo] password for user: <input
              type="password"
              className="browser-terminal-input"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{ width: "120px" }}
            />
          </div>
        )}
      </div>
      {!sudoPrompt && (
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
      )}
    </div>
  );
}