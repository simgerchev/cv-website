

import React, { useState, useRef, useEffect } from "react";
import monkAvatar from '../assets/project-pictures/monk-avatar.png';
import gameForest from '../assets/project-pictures/forest-game.png';
import fantasyForest from '../assets/project-pictures/fantasy-forest-game.png';

const LOCATIONS = {
	entrance: {
		description: "You stand at the entrance to a mysterious forest. The path ahead looks inviting.",
		image: gameForest,
		exits: { deep: "deep" },
		parent: null
	},
	deep: {
			description: "You venture deeper into the forest. The trees grow denser and the air feels magical. Two paths lie ahead: one leads to a shadowy grove, the other to a glittering cavern.",
			image: fantasyForest,
			exits: { 'shadow-grove': 'shadow-grove', 'crystal-cavern': 'crystal-cavern' },
			parent: "entrance"
	},
	'shadow-grove': {
		description: "You enter a grove where the trees are twisted and the shadows seem alive. The path ends here, and you sense you should turn back.",
		exits: {},
		parent: "deep"
	},
	'crystal-cavern': {
		description: "A cavern glittering with giant crystals. The air hums with magical energy and a faint path leads deeper.",
		exits: { 'ancient-ruins': 'ancient-ruins' },
		parent: "deep"
	},
	'ancient-ruins': {
		description: "Moss-covered ruins of a forgotten civilization. Strange symbols glow faintly on the stone walls.",
		exits: { 'sky-bridge': 'sky-bridge' },
		parent: "crystal-cavern"
	},
	'sky-bridge': {
		description: "A narrow bridge of clouds connects two floating islands high above the world. The view is breathtaking.",
		exits: {},
		parent: "ancient-ruins"
	}
};

const INITIAL_STATE = {
	location: "entrance",
	history: []
};

function getPrompt(state) {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return `m@f:${state.location}$`;
	}
	return `monk@fantasy:${state.location}$`;
}

export default function CyberMonk() {
					const [lines, setLines] = useState([
						"Welcome, CyberMonk!",
						"You hold a book containing all the movements and actions you know.",
						"Open your book with the 'help' command to see your options.",
						LOCATIONS[INITIAL_STATE.location].description,
						"Type 'cd deep' to enter the forest, 'cd ..' to go back, or 'help' to open your book."
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
								output = "You open your book. Available movements and actions:\n" +
									"- cd <location>: Change to a new location (e.g. cd deep).\n" +
									"- cd ..: Go to the previous location.\n" +
									"- ls: List available paths from your location.\n" +
									"- pwd: Show your current location.\n" +
									"- help: Open your book of movements.\n" +
									"- clear: Clear the terminal.";
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
								if (dir === "..") {
									const parent = LOCATIONS[state.location].parent;
									if (parent) {
										newState.history = [...(state.history || []), state.location];
										newState.location = parent;
										output = LOCATIONS[newState.location].description;
									} else {
										output = "No previous location.";
									}
								} else {
									const exitsObj = LOCATIONS[state.location].exits;
									if (exitsObj && exitsObj[dir]) {
										newState.history = [...(state.history || []), state.location];
										newState.location = exitsObj[dir];
										output = LOCATIONS[newState.location].description;
									} else {
										output = "No such path.";
									}
								}
								break;
							case "clear":
								setLines([]);
								return;
							default:
								output = "Unknown command. Type 'help' to open your book.";
						}
		setState(newState);
		setLines(prev => [...prev, `${getPrompt(state)} ${cmdLine}`, output]);
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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


	const inputRef = useRef(null);
		const renderInputWithCursor = () => (
			<div className="cybermonk-input-container">
				<span className="cybermonk-arrow">&gt;</span>
				<div className="cybermonk-input-measure-container" style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center'}}>
					<input
						ref={inputRef}
						type="text"
						className="cybermonk-input"
						value={input}
						onChange={handleInput}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				</div>
			</div>
		);

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
								{renderInputWithCursor()}
							</div>
						</div>
										<div className="cybermonk-side-screen">
											<img src={LOCATIONS[state.location].image} alt={state.location + " Game"} className="cybermonk-forest-img" />
											<div className="cybermonk-side-flex">
												<img src={monkAvatar} alt="Monk Avatar" className="cybermonk-monk-avatar" />
												<div>
													<h2 className="cybermonk-side-title">Monk Info</h2>
													<p>Location: <strong>{state.location}</strong></p>
													  <p>Try commands like <code>help</code>, <code>cd deep</code>, <code>cd ..</code>...</p>
												</div>
											</div>
										</div>
					</div>
				);
	}
