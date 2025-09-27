

import React, { useState, useRef, useEffect } from "react";

const LOCATIONS = {
	forest: {
		description: "You are in a mystical forest. Paths lead north and east.",
		exits: { north: "mountain", east: "lake" }
	},
	mountain: {
		description: "You stand atop a windy mountain. Paths lead south.",
		exits: { south: "forest" }
	},
	lake: {
		description: "A shimmering lake lies before you. Paths lead west.",
		exits: { west: "forest" }
	}
};

const INITIAL_STATE = {
	location: "forest"
};

function getPrompt(state) {
	return `monk@fantasy:${state.location}$`;
}

export default function CyberMonk() {
	const [lines, setLines] = useState([
		"Welcome, CyberMonk! Type 'help' for commands.",
		LOCATIONS[INITIAL_STATE.location].description
	]);
	const [input, setInput] = useState("");
	const [state, setState] = useState(INITIAL_STATE);
	const terminalRef = useRef(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [lines]);

	function handleCommand(cmdLine) {
		const [cmd, ...args] = cmdLine.trim().split(/\s+/);
		let output = "";
		let newState = { ...state };
		switch (cmd) {
			case "help":
				output = "Commands: ls, pwd, cd <direction>, help, clear";
				break;
			case "ls":
				const loc = LOCATIONS[state.location];
				const exits = Object.keys(loc.exits).map(dir => dir + "/").join("  ");
				output = exits ? `Paths: ${exits}` : "No exits here.";
				break;
			case "pwd":
				output = state.location;
				break;
			case "cd":
				const dir = args[0];
				const exitsObj = LOCATIONS[state.location].exits;
				if (exitsObj && exitsObj[dir]) {
					newState.location = exitsObj[dir];
					output = LOCATIONS[newState.location].description;
				} else {
					output = "No such path.";
				}
				break;
			case "clear":
				setLines([]);
				return;
			default:
				output = "Unknown command. Type 'help' for a list of commands.";
		}
		setState(newState);
		setLines(prev => [...prev, `${getPrompt(state)} ${cmdLine}`, output]);
	}

	function handleInput(e) {
		setInput(e.target.value);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleCommand(input);
			setInput("");
		}
	}

			return (
				<div className="cybermonk-flex-container">
					<div className="cybermonk-terminal">
						<div className="cybermonk-lines" ref={terminalRef}>
							{lines.map((line, idx) => (
								<div key={idx}>{line}</div>
							))}
						</div>
						<div className="cybermonk-input-row">
							<span className="cybermonk-prompt">{getPrompt(state)}</span>
							<input
								type="text"
								className="cybermonk-input"
								value={input}
								onChange={handleInput}
								onKeyDown={handleKeyDown}
								autoFocus
							/>
						</div>
					</div>
					<div className="cybermonk-side-screen">
						{/* You can put any content here, e.g., info, stats, artwork, etc. */}
						<h2 style={{marginTop:0}}>Monk Info</h2>
						<p>Location: <strong>{state.location}</strong></p>
						<p>Try commands like <code>help</code>, <code>ls</code>, <code>cd</code>...</p>
					</div>
				</div>
			);
	}
