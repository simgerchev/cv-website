import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import zoneObjects from '../data/podvigh/zoneObjects.json';
import randomEvents from '../data/podvigh/randomEvents.json';
import forestInteractions from '../data/podvigh/interactions/forest.json';
import ruinsInteractions from '../data/podvigh/interactions/ruins.json';

// --- CONFIG ---
const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;
const ZONES = zoneObjects;
const SANCTUARY_REQUIREMENTS = { faith: 14 };
const SANCTUARY_RADIUS = 3;

// --- UTILS ---
function randomZone() {
    return ZONES[Math.floor(Math.random() * ZONES.length)];
}
function randomTile(zone) {
    return zone.tiles[Math.floor(Math.random() * zone.tiles.length)];
}
function randomReflection(zone) {
    return zone.reflections[Math.floor(Math.random() * zone.reflections.length)];
}
function randomSpecial(zoneName) {
    const objects = INTERACTION_OBJECTS_BY_ZONE[zoneName] || [];
    const allowed = objects.filter(obj => obj.type === "special");
    if (allowed.length === 0) return null;
    return allowed[Math.floor(Math.random() * allowed.length)];
}
function randomNPC(zoneName) {
    const objects = INTERACTION_OBJECTS_BY_ZONE[zoneName] || [];
    const allowed = objects.filter(obj => obj.type === "npc");
    if (allowed.length === 0) return null;
    return allowed[Math.floor(Math.random() * allowed.length)];
}

// --- FEATURE GENERATION HELPERS ---
function randomWalk(start, length, width, height, char) {
    // Returns array of {x, y} for the feature
    let points = [];
    let [x, y] = start;
    for (let i = 0; i < length; i++) {
        points.push({ x, y });
        // Randomly move in one direction, but mostly forward
        const dir = Math.random();
        if (dir < 0.4) x += (Math.random() < 0.5 ? 1 : -1); // horizontal
        else if (dir < 0.8) y += (Math.random() < 0.5 ? 1 : -1); // vertical
        else {
            x += (Math.random() < 0.5 ? 1 : -1);
            y += (Math.random() < 0.5 ? 1 : -1);
        }
        // Clamp to zone bounds
        x = Math.max(0, Math.min(width - 1, x));
        y = Math.max(0, Math.min(height - 1, y));
    }
    return points;
}

function generateZoneFeatures(zone) {
    // Generate only a river for this zone, using '~' as the river symbol
    const riverStart = [
        Math.floor(Math.random() * MAP_WIDTH),
        Math.floor(Math.random() * MAP_HEIGHT),
    ];
    const river = randomWalk(riverStart, Math.floor(MAP_HEIGHT * 1.2), MAP_WIDTH, MAP_HEIGHT, "~");
    return { ...zone, river };
}

// --- COMPONENT ---
const podvigh = () => {
    // World state
    const [player, setPlayer] = useState({ x: 0, y: 0 });
    const [zones, setZones] = useState([
        { zone: generateZoneFeatures(randomZone()), origin: { x: 0, y: 0 } },
    ]);
    const [messages, setMessages] = useState([
        "You begin your walk in silence.",
    ]);
    const steps = useRef(0);

    // Game state
    const [state, setState] = useState({
        faith: 5,
        health: 8,
    });
    const [gameOver, setGameOver] = useState(false);
    const [ending, setEnding] = useState("");
    const [usedSpecials, setUsedSpecials] = useState([]);
    const [pendingAction, setPendingAction] = useState(null);
    const [pendingChoice, setPendingChoice] = useState(null); // { choices, actionData, x, y }

    // Sanctuary
    const [sanctuarySpawned, setSanctuarySpawned] = useState(false);
    const [sanctuaryPos, setSanctuaryPos] = useState(null);

    useEffect(() => {
        if (
            !sanctuarySpawned &&
            state.faith >= SANCTUARY_REQUIREMENTS.faith
        ) {
            const px = player.x;
            const py = player.y;
            const offsetX = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            const offsetY = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            setSanctuaryPos({ x: px + offsetX, y: py + offsetY });
            setSanctuarySpawned(true);
            setMessages(msgs => [
                ...msgs.slice(-4),
                "A hidden passage opens nearby. The Sanctuary is revealed!"
            ]);
        }
    }, [state.faith, sanctuarySpawned, player.x, player.y]);

    function getZoneAt(x, y) {
        for (let i = zones.length - 1; i >= 0; i--) {
            const { zone, origin } = zones[i];
            if (
                x >= origin.x &&
                x < origin.x + MAP_WIDTH &&
                y >= origin.y &&
                y < origin.y + MAP_HEIGHT
            ) {
                return { zone, origin };
            }
        }
        return { zone: zones[0].zone, origin: zones[0].origin };
    }

    function getTile(x, y) {
        const { zone, origin } = getZoneAt(x, y);

        // --- RIVER OVERRIDE ---
        const zx = x - origin.x;
        const zy = y - origin.y;
        if (zone.river && zone.river.some(p => p.x === zx && p.y === zy)) {
            return { char: "~", color: "#1E90FF", zone, description: "A flowing river." };
        }

        if (
            sanctuarySpawned &&
            sanctuaryPos &&
            x === sanctuaryPos.x &&
            y === sanctuaryPos.y
        ) {
            return {
                char: "C",
                color: "#FF4500",
                zone,
                special: {
                    char: "C",
                    name: "Sanctuary",
                    color: "#FF4500",
                    effect: (state, setState, setMessages, setEnding, setGameOver) => {
                        setEnding("You enter the Sanctuary. You have found peace.");
                        setMessages(msgs => [
                            ...msgs.slice(-4),
                            "You kneel in the Sanctuary. You have found peace.",
                            "Press R to restart."
                        ]);
                        setGameOver(true);
                    },
                    description: "A place of peace and rest."
                }
            };
        }
        const specialKey = `${x},${y}`;
        if (usedSpecials.includes(specialKey)) {
            const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
            return { char: zone.tiles[idx], color: zone.color, zone };
        }
        const seed = Math.abs(x * 73856093 ^ y * 19349663 ^ 42);
        if (seed % 23 === 0) {
            const special = randomSpecial(zone.name);
            if (special) {
                return { char: special.char, color: special.color, zone, special, description: special.description, x, y };
            }
        }
        const npcSeed = Math.abs(x * 19349663 ^ y * 83492791 ^ 99);
        if (npcSeed % 41 === 0 && !usedSpecials.includes(`${x},${y}`)) {
            const npc = randomNPC(zone.name);
            if (npc) {
                return { char: npc.char, color: npc.color, zone, npc, description: npc.description, x, y };
            }
        }
        const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
        return { char: zone.tiles[idx], color: zone.color, zone };
    }

    useEffect(() => {
        const { x, y } = player;
        const currentZone = getZoneAt(x, y);
        let newZones = [...zones];
        let added = false;
        if (x - currentZone.origin.x <= 1) {
            newZones.push({
                zone: generateZoneFeatures(randomZone()),
                origin: { x: currentZone.origin.x - MAP_WIDTH, y: currentZone.origin.y },
            });
            added = true;
        }
        if (x - currentZone.origin.x >= MAP_WIDTH - 2) {
            newZones.push({
                zone: generateZoneFeatures(randomZone()),
                origin: { x: currentZone.origin.x + MAP_WIDTH, y: currentZone.origin.y },
            });
            added = true;
        }
        if (y - currentZone.origin.y <= 1) {
            newZones.push({
                zone: generateZoneFeatures(randomZone()),
                origin: { x: currentZone.origin.x, y: currentZone.origin.y - MAP_HEIGHT },
            });
            added = true;
        }
        if (y - currentZone.origin.y >= MAP_HEIGHT - 2) {
            newZones.push({
                zone: generateZoneFeatures(randomZone()),
                origin: { x: currentZone.origin.x, y: currentZone.origin.y + MAP_HEIGHT },
            });
            added = true;
        }
        if (added) setZones(newZones);
    }, [player]);

    useEffect(() => {
        function handleKey(e) {
            if (gameOver && (e.key === "r" || e.key === "R")) {
                restartGame();
                return;
            }
            if (gameOver) return;

            // --- CHOICE HANDLING: must be first! ---
            if (pendingChoice) {
                if (e.key >= "1" && e.key <= String(pendingChoice.choices.length)) {
                    const idx = Number(e.key) - 1;
                    const choice = pendingChoice.choices[idx];
                    if (choice.effect) {
                        applyEffect(choice.effect, state, setState, setMessages);
                    }
                    if (choice.message) {
                        setMessages(msgs => [...msgs.slice(-4), choice.message]);
                    }
                    if (pendingChoice.actionData.type === "special") {
                        setUsedSpecials(prev => [...prev, `${pendingChoice.x},${pendingChoice.y}`]);
                    }
                    setPendingChoice(null);
                }
                // Block all other input while a choice is pending
                return;
            }

            // --- rest of your handleKey logic (pendingAction, movement, etc) ---
            if (pendingAction) {
                // Only process if correct key is pressed
                if (
                    (pendingAction.type === "special" && (e.key === "g" || e.key === "G")) ||
                    (pendingAction.type === "npc" && (e.key === "t" || e.key === "T"))
                ) {
                    if (pendingAction.data.choices && pendingAction.data.choices.length > 0) {
                        const choicesMsg = [
                            "What do you do?",
                            ...pendingAction.data.choices.map((choice, idx) => `${idx + 1}. ${choice.label}`),
                            "(Press 1, 2, 3... to choose)"
                        ].join('\n');
                        setMessages(msgs => [...msgs.slice(-4), choicesMsg]);
                        setPendingChoice({
                            choices: pendingAction.data.choices,
                            actionData: pendingAction.data,
                            x: pendingAction.x,
                            y: pendingAction.y
                        });
                        setPendingAction(null);
                        return;
                    }
                    if (pendingAction.type === "special") {
                        if (pendingAction.data.name === "Sanctuary") {
                            setEnding("You enter the Sanctuary. You have found peace.");
                            setMessages(msgs => [
                                ...msgs.slice(-4),
                                "You kneel in the Sanctuary. You have found peace.",
                                "Press R to restart."
                            ]);
                            setGameOver(true);
                        } else {
                            applyEffect(pendingAction.data.effect, state, setState, setMessages);
                            if (pendingAction.data.message) {
                                setMessages(msgs => [
                                    ...msgs.slice(-4),
                                    pendingAction.data.message
                                ]);
                            }
                            setUsedSpecials(prev => [...prev, `${pendingAction.x},${pendingAction.y}`]);
                        }
                    } else if (pendingAction.type === "npc") {
                        const line = pendingAction.data.dialogue[Math.floor(Math.random() * pendingAction.data.dialogue.length)];
                        setMessages(msgs => [
                            ...msgs.slice(-4),
                            `${pendingAction.data.name}: "${line}"`,
                        ]);
                        pendingAction.data.effect(state, setState, setMessages);
                        setUsedSpecials(prev => [...prev, `${pendingAction.x},${pendingAction.y}`]);
                    }
                    setPendingAction(null);
                    return;
                } else {
                    // Any other key cancels the pending action and allows movement
                    setPendingAction(null);
                    return;
                }
            }

            let dx = 0, dy = 0;
            if (e.key === "ArrowUp" || e.key === "w") dy = -1;
            if (e.key === "ArrowDown" || e.key === "s") dy = 1;
            if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
            if (e.key === "ArrowRight" || e.key === "d") dx = 1;
            if (dx !== 0 || dy !== 0) {
                const newX = player.x + dx;
                const newY = player.y + dy;
                setPlayer({ x: newX, y: newY });
                steps.current += 1;
                const tile = getTile(newX, newY);
                if (tile.special) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        `You see a ${tile.special.name.toLowerCase()}.\n${tile.special.description || ""}\nPress G to interact, any other key to ignore.`
                    ]);
                    setPendingAction({
                        type: "special",
                        data: tile.special,
                        x: newX,
                        y: newY
                    });
                    return; // Stop here, wait for user to press 'g'
                } else if (tile.npc) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        `You meet ${tile.npc.name}.\n${tile.npc.description || ""}\nPress T to talk, any other key to ignore.`
                    ]);
                    setPendingAction({
                        type: "npc",
                        data: tile.npc,
                        x: newX,
                        y: newY
                    });
                    return; // Stop here, wait for user to press 't'
                } else {
                    setPendingAction(null);
                    // --- RANDOM EVENT ---
                    const { zone } = getZoneAt(newX, newY);
                    const zoneEvents = randomEvents.filter(ev =>
                        !ev.allowedZones || ev.allowedZones.includes(zone.name)
                    );
                    if (zoneEvents.length > 0 && Math.random() < 0.10) {
                        const event = zoneEvents[Math.floor(Math.random() * zoneEvents.length)];
                        setMessages(msgs => [...msgs.slice(-4), event.msg]);
                        applyEffect(event.effect, state, setState, setMessages);
                    }
                }
                // Occasionally show reflection
                if (Math.random() < 0.18) {
                    const { zone } = getZoneAt(newX, newY);
                    setMessages((msgs) => [
                        ...msgs.slice(-4),
                        randomReflection(zone),
                    ]);
                }
                // Lose if health drops to zero
                if (state.health <= 1) {
                    setEnding("You have perished in the labyrinth. Game over.");
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        "You have perished in the labyrinth. Game over.",
                        "Press R to restart."
                    ]);
                    setGameOver(true);
                }
            }
            // Pray
            if (e.key === "p" || e.key === "P") {
                setMessages(msgs => [
                    ...msgs.slice(-4),
                    "You pause and pray. Silence deepens.",
                ]);
                setState(s => ({ ...s, faith: s.faith + 1 }));
            }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [player, zones, state, gameOver, pendingAction, pendingChoice]);

    // Render map
    const mapRows = [];
    for (let y = player.y - Math.floor(MAP_HEIGHT / 2); y <= player.y + Math.floor(MAP_HEIGHT / 2); y++) {
        let row = [];
        for (let x = player.x - Math.floor(MAP_WIDTH / 2); x <= player.x + Math.floor(MAP_WIDTH / 2); x++) {
            if (x === player.x && y === player.y) {
                row.push(
                    <span key={x} style={{ color: "#fff", fontWeight: "bold" }}>
                        @
                    </span>
                );
            } else {
                const tile = getTile(x, y);
                row.push(
                    <span
                        key={x}
                        style={{ color: tile.color }}
                    >
                        {tile.char}
                    </span>
                );
            }
        }
        mapRows.push(
            <div key={y} style={{ fontFamily: "Fira Mono, monospace", lineHeight: "1.1em" }}>
                {row}
            </div>
        );
    }

    // Restart game
    const restartGame = () => {
        setPlayer({ x: 0, y: 0 });
        setZones([{ zone: generateZoneFeatures(randomZone()), origin: { x: 0, y: 0 } }]);
        setMessages(["You begin your walk in silence."]);
        setState({
            faith: 5,
            health: 8,
        });
        setGameOver(false);
        setEnding("");
        steps.current = 0;
        setSanctuarySpawned(false);
        setSanctuaryPos(null);
        setUsedSpecials([]);
    };

    function applyEffect(effect, state, setState, setMessages) {
        if (!effect) return;
        if (effect.startsWith("faith+")) {
            const val = parseInt(effect.split("+")[1], 10);
            setState(s => ({ ...s, faith: s.faith + val }));
            setMessages(msgs => [...msgs.slice(-4), `Faith +${val}.`]);
        } else if (effect.startsWith("faith-")) {
            const val = parseInt(effect.split("-")[1], 10);
            setState(s => ({ ...s, faith: Math.max(0, s.faith - val) }));
            setMessages(msgs => [...msgs.slice(-4), `Faith -${val}.`]);
        } else if (effect.startsWith("health+")) {
            const val = parseInt(effect.split("+")[1], 10);
            setState(s => ({ ...s, health: Math.min(10, s.health + val) }));
            setMessages(msgs => [...msgs.slice(-4), `Health +${val}.`]);
        } else if (effect.startsWith("health-")) {
            const val = parseInt(effect.split("-")[1], 10);
            setState(s => ({ ...s, health: Math.max(0, s.health - val) }));
            setMessages(msgs => [...msgs.slice(-4), `Health -${val}.`]);
        }
        // Add more effect types as needed
    }

    // Render
    return (
        <div className="podvigh-bg">
            {/* Map area */}
            <div className="podvigh-map-area">
                {/* <h2 className="podvigh-title">Podvigh</h2> */}
                {mapRows}
            </div>
            {/* Info panel */}
            <div className="podvigh-info-panel">
                <div className="podvigh-stats">
                    Faith: {state.faith} &nbsp; Health: {state.health}
                </div>
                <div className="podvigh-messages">
                    {messages.slice(-3).map((msg, i) => (
                        <div key={i} className="podvigh-message-line">
                            {msg}
                        </div>
                    ))}
                    {gameOver && ending && (
                        <div className="podvigh-message-line" style={{ color: "#F20505", marginTop: "1em", fontWeight: "bold" }}>
                            {ending}
                        </div>
                    )}
                </div>
                <div className="podvigh-controls">
                    Goal: Find the Sanctuary by growing your Faith. Explore, pray, and survive!
                </div>
                <div className="podvigh-controls">
                    Controls: Move (<b>WASD</b> / <b>Arrow keys</b>) | Pray (<b>P</b>) | Interact (<b>G</b>/<b>T</b>)
                </div>
                {gameOver && (
                    <div className="podvigh-ending">
                    </div>
                )}
            </div>
        </div>
    );
};

const INTERACTION_OBJECTS_BY_ZONE = {
    "Forest": forestInteractions,
    "Ruins": ruinsInteractions,
    // Add more as needed, e.g. "Mountains": mountainsInteractions
};

export default podvigh;