

import React, { useState, useRef, useEffect } from "react";
import monkAvatar from '../assets/project-pictures/monk-avatar.png';
import gameForest from '../assets/project-pictures/forest-game.png';

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
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return `m@f:${state.location}$`;
	}
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

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function handleInput(e) {
		const value = e.target.value;
		if (isMobileDevice()) {
			setInput(value);
			return;
		}
		if (measureRef.current && inputRef.current) {
			measureRef.current.textContent = value;
			const measureWidth = measureRef.current.offsetWidth;
			const inputContainer = inputRef.current.parentElement;
			const maxWidth = inputContainer.offsetWidth;
			measureRef.current.textContent = value.slice(0, cursorPos);
			if (measureWidth < maxWidth - 16) {
				setInput(value);
			}
		} else {
			setInput(value);
		}
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleCommand(input);
			setInput("");
		}
	}


					// Custom glowing cursor logic
					const inputRef = useRef(null);
					const measureRef = useRef(null);
					const [cursorPos, setCursorPos] = useState(0);
					const [cursorLeft, setCursorLeft] = useState(0);

						useEffect(() => {
							function isMobileDevice() {
								return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
							}
							if (isMobileDevice()) {
								// On mobile, let input behave natively
								return;
							}
							if (inputRef.current) {
								const handler = () => setCursorPos(inputRef.current.selectionStart);
								inputRef.current.addEventListener('keyup', handler);
								inputRef.current.addEventListener('click', handler);
								inputRef.current.addEventListener('input', handler);
								return () => {
									if (inputRef.current) {
										inputRef.current.removeEventListener('keyup', handler);
										inputRef.current.removeEventListener('click', handler);
										inputRef.current.removeEventListener('input', handler);
									}
								};
							}
						}, [inputRef]);

					useEffect(() => {
						if (measureRef.current) {
							setCursorLeft(measureRef.current.offsetWidth);
						}
					}, [input, cursorPos]);

					// Render input with glowing cursor
							const renderInputWithCursor = () => {
								const left = input.slice(0, cursorPos);
									return (
										<div className="cybermonk-input-container">
											{/* Static arrow at the start */}
											<span className="cybermonk-arrow">&gt;</span>
											<div className="cybermonk-input-measure-container">
												{/* Hidden span to measure left part width, matching input styles exactly */}
												<span
													ref={measureRef}
													className="cybermonk-input-measure-span"
												>
													{left}
												</span>
												{/* Glowing | cursor absolutely positioned */}
												<span
													className="cybermonk-input-glow-cursor"
													style={{ left: cursorLeft }}
												>|</span>
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
							};

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
							<img src={gameForest} alt="Forest Game" className="cybermonk-forest-img" />
							<div className="cybermonk-side-flex">
								<img src={monkAvatar} alt="Monk Avatar" className="cybermonk-monk-avatar" />
								<div>
									<h2 className="cybermonk-side-title">Monk Info</h2>
									<p>Location: <strong>{state.location}</strong></p>
									<p>Try commands like <code>help</code>, <code>ls</code>, <code>cd</code>...</p>
								</div>
							</div>
						</div>
					</div>
				);
	}
