import React, { useState, useEffect, useRef } from "react";
import "../App.css"; // Import the CSS file

// --- CONFIG ---
const MAP_WIDTH = 31; // bigger map
const MAP_HEIGHT = 17; // bigger map
const VIEW_RADIUS = Math.floor(MAP_WIDTH / 2);
const ZONES = [
    {
        name: "Forest",
        tiles: ["#", ".", ".", "#", ".", "#"],
        color: "#228B22",
        reflections: [
            "The trees seem to breathe with you.",
            "The forest hums in green silence.",
            "A bird calls, then silence returns.",
        ],
    },
    {
        name: "Riverbank",
        tiles: ["~", ".", ".", "~", ".", "~"],
        color: "#1E90FF",
        reflections: [
            "You see your reflection tremble.",
            "Water flows, carrying your thoughts.",
            "The river sings a quiet hymn.",
        ],
    },
    {
        name: "Ruins",
        tiles: ["+", ".", "†", ".", "+", "."],
        color: "#A9A9A9",
        reflections: [
            "Once this place sang hymns.",
            "Only the wind prays here now.",
            "You find the ruins of a chapel.",
        ],
    },
    {
        name: "Desert",
        tiles: [".", "^", ".", ".", "^", "."],
        color: "#DEB887",
        reflections: [
            "Your footprints vanish behind you.",
            "Humming silence fills the air.",
            "Sand drifts, timeless and patient.",
        ],
    },
    {
        name: "Monastery Grounds",
        tiles: ["†", "=", ".", "=", "†", "."],
        color: "#FFD700",
        reflections: [
            "You kneel before a light unseen.",
            "Chanting echoes in the distance.",
            "A gentle peace settles here.",
        ],
    },
    {
        name: "Mountains",
        tiles: ["^", "%", ".", "^", "%", "."],
        color: "#B0C4DE",
        reflections: [
            "The higher you climb, the smaller your voice.",
            "The mountain exhales clouds.",
            "Wind howls between the peaks.",
        ],
    },
];

// --- SPECIALS ---
// Only one crypt at center, rest are other interactives
const INVENTORY_LIMIT = 10; // No inventory limit

const SPECIALS = [
    {
        char: "*",
        name: "Sanctified Icon",
        color: "#FFD700",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                enlightenment: s.enlightenment + 1,
                inventory: [...s.inventory, "Sanctified Icon"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You discover a Sanctified Icon. Enlightenment +1. It glows softly in your hands.",
            ]);
        },
        description: "A golden icon depicting a saint, said to grant wisdom to those who carry it."
    },
    {
        char: "?",
        name: "Veil of Mystery",
        color: "#FF69B4",
        effect: (state, setState, setMessages) => {
            const faithChange = Math.random() > 0.5 ? 2 : -2;
            setState(s => ({ ...s, faith: Math.max(0, s.faith + faithChange) }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                faithChange > 0
                    ? "A gentle voice whispers encouragement. Faith +2."
                    : "A shadow of doubt passes over you. Faith -2.",
            ]);
        },
        description: "A shimmering veil that tests your resolve and faith."
    },
    {
        char: "†",
        name: "Altar of Grace",
        color: "#00FFFF",
        effect: (state, setState, setMessages) => {
            setState(s => ({ ...s, faith: s.faith + 1 }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You kneel at the Altar of Grace. Faith +1. Peace fills your heart.",
            ]);
        },
        description: "A simple stone altar, worn smooth by centuries of prayer."
    },
    {
        char: "D",
        name: "Door of Forgiveness",
        color: "#FFA500",
        effect: (state, setState, setMessages) => {
            if (state.faith >= 8) {
                setMessages(msgs => [
                    ...msgs.slice(-4),
                    "The Door of Forgiveness opens. You feel a sense of peace.",
                ]);
            } else {
                setMessages(msgs => [
                    ...msgs.slice(-4),
                    "The door remains closed. You sense you must grow in faith.",
                ]);
            }
        },
        description: "An ancient wooden door, inscribed with prayers of mercy."
    },
    {
        char: "~",
        name: "Fountain of Living Water",
        color: "#1E90FF",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                health: Math.min(10, s.health + 2),
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You drink from the Fountain of Living Water. Health +2. You feel renewed.",
            ]);
        },
        description: "A clear spring bubbling from the stone, said to heal the weary."
    },
    {
        char: "+",
        name: "Reliquary Chest",
        color: "#C0C0C0",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                enlightenment: s.enlightenment + 2,
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You open a Reliquary Chest and feel a surge of enlightenment. Enlightenment +2.",
            ]);
        },
        description: "A silver chest containing relics and keys to deeper mysteries."
    },
    {
        char: "F",
        name: "Bread",
        color: "#F5DEB3",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                inventory: [...s.inventory, "Bread"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You find a loaf of bread. Eat it to restore health.",
            ]);
        },
        description: "Simple bread. Eat to restore health."
    },
    {
        char: "A",
        name: "Apple",
        color: "#FF3333",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                inventory: [...s.inventory, "Apple"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You find a fresh apple. Eat it to restore health.",
            ]);
        },
        description: "A crisp apple. Eat to restore a little health."
    },
    // --- NEW ITEMS ---
    {
        char: "P",
        name: "Potion",
        color: "#8A2BE2",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                inventory: [...s.inventory, "Potion"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You find a mysterious potion. Drink it to see what happens.",
            ]);
        },
        description: "A bubbling potion. Drinking it may heal or harm you."
    },
    {
        char: "S",
        name: "Strange Stone",
        color: "#708090",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                inventory: [...s.inventory, "Strange Stone"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You find a strange stone. Use it to test your luck.",
            ]);
        },
        description: "A stone that pulses with energy. Using it may increase or decrease your stats."
    },
    {
        char: "B",
        name: "Blessed Candle",
        color: "#FFFACD",
        effect: (state, setState, setMessages) => {
            setState(s => ({
                ...s,
                inventory: [...s.inventory, "Blessed Candle"],
            }));
            setMessages(msgs => [
                ...msgs.slice(-4),
                "You find a blessed candle. Light it to receive a blessing or a challenge.",
            ]);
        },
        description: "A candle said to bring blessings. Lighting it may help or test your faith."
    },
];

// --- SANCTUARY CONFIG ---
const SANCTUARY_REQUIREMENTS = { faith: 12, enlightenment: 7 };
const SANCTUARY_RADIUS = 5; // Sanctuary spawns within 5 tiles of player

// --- NPCS ---
const NPCS = [
    {
        char: "☉",
        name: "Wandering Monk",
        color: "#FFDAB9",
        dialogue: [
            "The path is long, but faith is longer.",
            "Humility is the key to every door.",
            "Rest when you are weary, pilgrim.",
        ],
        effect: (state, setState, setMessages) => {
            setMessages(msgs => [
                ...msgs.slice(-4),
                "The monk blesses you. Faith +1.",
            ]);
            setState(s => ({ ...s, faith: s.faith + 1 }));
        },
        description: "A gentle monk who offers wisdom and blessings."
    },
    {
        char: "☽",
        name: "Hermit",
        color: "#B0E0E6",
        dialogue: [
            "I have seen the sanctuary, but never entered.",
            "Beware the desert winds.",
            "Enlightenment comes in silence.",
        ],
        effect: (state, setState, setMessages) => {
            setMessages(msgs => [
                ...msgs.slice(-4),
                "The hermit shares a secret. Enlightenment +1.",
            ]);
            setState(s => ({ ...s, enlightenment: s.enlightenment + 1 }));
        },
        description: "A solitary hermit with stories to tell."
    },
];

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
function randomSpecial() {
    // Exclude crypt from random specials
    return SPECIALS[Math.floor(Math.random() * SPECIALS.length)];
}
function randomNPC() {
    return NPCS[Math.floor(Math.random() * NPCS.length)];
}

// --- COMPONENT ---
const podvigh = () => {
    // World state
    const [player, setPlayer] = useState({ x: 0, y: 0 });
    const [zones, setZones] = useState([
        { zone: randomZone(), origin: { x: 0, y: 0 } },
    ]);
    const [messages, setMessages] = useState([
        "You begin your walk in silence.",
    ]);
    const steps = useRef(0);

    // Game state
    const [state, setState] = useState({
        faith: 10,
        enlightenment: 3,
        health: 8,
        inventory: [],
    });
    const [gameOver, setGameOver] = useState(false);
    const [npcEncounter, setNpcEncounter] = useState(null);
    const [ending, setEnding] = useState("");
    // Track used specials by their coordinates
    const [usedSpecials, setUsedSpecials] = useState([]);

    // Place crypt at center zone (will be used for sanctuary if spawned)
    const cryptPos = useRef({ x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) });

    // Check if sanctuary should spawn
    const [sanctuarySpawned, setSanctuarySpawned] = useState(false);
    const [sanctuaryPos, setSanctuaryPos] = useState(null);

    useEffect(() => {
        if (
            !sanctuarySpawned &&
            state.faith >= SANCTUARY_REQUIREMENTS.faith &&
            state.enlightenment >= SANCTUARY_REQUIREMENTS.enlightenment
        ) {
            // Spawn sanctuary near player
            const px = player.x;
            const py = player.y;
            // Random offset within SANCTUARY_RADIUS
            const offsetX = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            const offsetY = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            setSanctuaryPos({ x: px + offsetX, y: py + offsetY });
            setSanctuarySpawned(true);
            setMessages(msgs => [
                ...msgs.slice(-4),
                "A hidden passage opens nearby. The Sanctuary of Humility is revealed!"
            ]);
        }
        // eslint-disable-next-line
    }, [state.faith, state.enlightenment, sanctuarySpawned]);

    // Generate visible map
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
        // Sanctuary only appears if requirements met and at sanctuaryPos
        if (
            sanctuarySpawned &&
            sanctuaryPos &&
            x === sanctuaryPos.x &&
            y === sanctuaryPos.y
        ) {
            return {
                char: "C",
                color: "#FF4500",
                zone: getZoneAt(x, y).zone,
                special: {
                    char: "C",
                    name: "Sanctuary of Humility",
                    color: "#FF4500",
                    effect: (state, setState, setMessages, setEnding, setGameOver) => {
                        if (state.faith >= SANCTUARY_REQUIREMENTS.faith && state.enlightenment >= SANCTUARY_REQUIREMENTS.enlightenment) {
                            setEnding("Victory: You enter the Sanctuary of Humility. In prayer and surrender, you achieve true humility and spiritual peace.");
                            setMessages(msgs => [
                                ...msgs.slice(-4),
                                "You kneel in the Sanctuary. A gentle light surrounds you. You have found true humility.",
                            ]);
                        } else if (state.faith < 5) {
                            setEnding("Tempted: You reach the sanctuary, but pride and doubt keep you from entering. The labyrinth remains your home.");
                            setMessages(msgs => [
                                ...msgs.slice(-4),
                                "You stand before the Sanctuary, but cannot enter. Humility escapes you.",
                            ]);
                        } else {
                            setEnding("Pilgrim: You reach the sanctuary, weary but faithful. You are welcomed as a humble pilgrim.");
                            setMessages(msgs => [
                                ...msgs.slice(-4),
                                "You enter as a pilgrim, welcomed by grace.",
                            ]);
                        }
                        setGameOver(true);
                    },
                    description: "The heart of the labyrinth, where only the truly humble may enter and find peace."
                }
            };
        }
        // Check if this special has already been used
        const specialKey = `${x},${y}`;
        if (usedSpecials.includes(specialKey)) {
            // Render as normal tile after use
            const { zone, origin } = getZoneAt(x, y);
            const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
            return { char: zone.tiles[idx], color: zone.color, zone };
        }

        // Randomly place specials (excluding crypt)
        const seed = Math.abs(x * 73856093 ^ y * 19349663 ^ 42);
        if (seed % 37 === 0) {
            const special = randomSpecial();
            return { char: special.char, color: special.color, zone: getZoneAt(x, y).zone, special, description: special.description, x, y };
        }
        // Place NPCs randomly (avoid overlap with specials/sanctuary)
        const npcSeed = Math.abs(x * 19349663 ^ y * 83492791 ^ 99);
        if (npcSeed % 53 === 0 && !usedSpecials.includes(`${x},${y}`) && !(sanctuarySpawned && sanctuaryPos && x === sanctuaryPos.x && y === sanctuaryPos.y)) {
            const npc = randomNPC();
            return { char: npc.char, color: npc.color, zone: getZoneAt(x, y).zone, npc, description: npc.description, x, y };
        }
        const { zone, origin } = getZoneAt(x, y);
        const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
        return { char: zone.tiles[idx], color: zone.color, zone };
    }

    // Handle zone transitions
    useEffect(() => {
        const { x, y } = player;
        const currentZone = getZoneAt(x, y);
        let newZones = [...zones];
        let added = false;
        if (x - currentZone.origin.x <= 1) {
            newZones.push({
                zone: randomZone(),
                origin: { x: currentZone.origin.x - MAP_WIDTH, y: currentZone.origin.y },
            });
            added = true;
        }
        if (x - currentZone.origin.x >= MAP_WIDTH - 2) {
            newZones.push({
                zone: randomZone(),
                origin: { x: currentZone.origin.x + MAP_WIDTH, y: currentZone.origin.y },
            });
            added = true;
        }
        if (y - currentZone.origin.y <= 1) {
            newZones.push({
                zone: randomZone(),
                origin: { x: currentZone.origin.x, y: currentZone.origin.y - MAP_HEIGHT },
            });
            added = true;
        }
        if (y - currentZone.origin.y >= MAP_HEIGHT - 2) {
            newZones.push({
                zone: randomZone(),
                origin: { x: currentZone.origin.x, y: currentZone.origin.y + MAP_HEIGHT },
            });
            added = true;
        }
        if (added) setZones(newZones);
        // eslint-disable-next-line
    }, [player]);

    // Handle movement
    const [pendingPickup, setPendingPickup] = useState(null);
    const [pendingNPC, setPendingNPC] = useState(null);

    // Helper to check if a tile is an item you can pick up
    function isPickupItem(name) {
        return [
            "Sanctified Icon",
            "Bread",
            "Apple",
            "Potion",
            "Blessed Candle"
            // "Strange Stone" removed
        ].includes(name);
    }

    useEffect(() => {
        function handleKey(e) {
            if (gameOver) return;

            // If there's a pending pickup, handle it first and block all other actions
            if (pendingPickup) {
                if (e.key === "g" || e.key === "G") {
                    pendingPickup.effect(state, setState, setMessages);
                    setUsedSpecials(prev => [...prev, `${pendingPickup.x},${pendingPickup.y}`]);
                    setPendingPickup(null);
                } else {
                    setUsedSpecials(prev => [...prev, `${pendingPickup.x},${pendingPickup.y}`]);
                    setPendingPickup(null);
                }
                return; // Block all other actions until pickup is resolved
            }

            // If there's a pending NPC, handle talk interaction
            if (pendingNPC) {
                if (e.key === "t" || e.key === "T") {
                    // Show random dialogue and apply effect
                    const line = pendingNPC.dialogue[Math.floor(Math.random() * pendingNPC.dialogue.length)];
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        `${pendingNPC.name}: "${line}"`,
                    ]);
                    pendingNPC.effect(state, setState, setMessages);
                    setUsedSpecials(prev => [...prev, `${pendingNPC.x},${pendingNPC.y}`]);
                    setPendingNPC(null);
                } else {
                    setUsedSpecials(prev => [...prev, `${pendingNPC.x},${pendingNPC.y}`]);
                    setPendingNPC(null);
                }
                return;
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
                if (tile.special && isPickupItem(tile.special.name)) {
                    setPendingPickup({ ...tile.special, x: newX, y: newY });
                } else if (tile.special) {
                    tile.special.effect(state, setState, setMessages, setEnding, setGameOver);
                    setUsedSpecials(prev => [...prev, `${newX},${newY}`]);
                } else if (tile.npc) {
                    setPendingNPC({ ...tile.npc, x: newX, y: newY });
                } else {
                    setPendingPickup(null);
                    setPendingNPC(null);
                    // --- RANDOM EVENT ---
                    if (Math.random() < 0.10) { // 10% chance
                        const events = [
                            {
                                msg: "A sudden peace falls over you. Faith +1.",
                                effect: s => ({ ...s, faith: s.faith + 1 })
                            },
                            {
                                msg: "You stumble and reflect. Enlightenment +1.",
                                effect: s => ({ ...s, enlightenment: s.enlightenment + 1 })
                            },
                            {
                                msg: "A cold wind chills you. Health -1.",
                                effect: s => ({ ...s, health: Math.max(0, s.health - 1) })
                            },
                            {
                                msg: "You find a hidden crumb of bread.",
                                effect: s => ({ ...s, inventory: [...s.inventory, "Bread"] })
                            },
                            {
                                msg: "A distant bell rings. Nothing happens.",
                                effect: s => s
                            }
                        ];
                        const event = events[Math.floor(Math.random() * events.length)];
                        setMessages(msgs => [...msgs.slice(-4), event.msg]);
                        setState(event.effect);
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
                // Every 1000 steps, show a vision
                if (steps.current % 1000 === 0) {
                    setMessages((msgs) => [
                        ...msgs.slice(-4),
                        "A vision flickers at the edge of your sight.",
                    ]);
                }
                // Health loss in desert/mountains
                const zone = getZoneAt(newX, newY).zone;
                if (
                    (zone.name === "Desert" || zone.name === "Mountains") &&
                    Math.random() < 0.12
                ) {
                    setState(s => ({
                        ...s,
                        health: Math.max(0, s.health - 1),
                    }));
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        "The harsh land drains your strength. Health -1.",
                    ]);
                }
                // Lose if health drops to zero
                if (state.health <= 1) {
                    setEnding("You have perished in the labyrinth. Game over.");
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
            // Eat bread or apple
            if (e.key === "e" || e.key === "E") {
                if (state.inventory.includes("Bread")) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        "You eat the bread. Health +3.",
                    ]);
                    setState(s => ({
                        ...s,
                        health: Math.min(10, s.health + 3),
                        inventory: s.inventory.filter(i => i !== "Bread"),
                    }));
                } else if (state.inventory.includes("Apple")) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        "You eat the apple. Health +1.",
                    ]);
                    setState(s => ({
                        ...s,
                        health: Math.min(10, s.health + 1),
                        inventory: s.inventory.filter(i => i !== "Apple"),
                    }));
                }
            }
            // Drink potion
            if (e.key === "o" || e.key === "O") {
                if (state.inventory.includes("Potion")) {
                    const effect = Math.random() > 0.5 ? 4 : -3;
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        effect > 0
                            ? "You drink the potion. Health +" + effect + "."
                            : "The potion was poisonous! Health " + effect + ".",
                    ]);
                    setState(s => ({
                        ...s,
                        health: Math.max(0, Math.min(10, s.health + effect)),
                        inventory: s.inventory.filter(i => i !== "Potion"),
                    }));
                }
            }
            // Light Blessed Candle
            if (e.key === "c" || e.key === "C") {
                if (state.inventory.includes("Blessed Candle")) {
                    const effect = Math.random() > 0.5 ? 3 : -2;
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        effect > 0
                            ? "A warm light fills you. Faith +" + effect + "."
                            : "The candle flickers and fades. Faith " + effect + ".",
                    ]);
                    setState(s => ({
                        ...s,
                        faith: Math.max(0, state.faith + effect),
                        inventory: s.inventory.filter(i => i !== "Blessed Candle"),
                    }));
                }
            }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
        // eslint-disable-next-line
    }, [player, zones, state, gameOver, pendingPickup, pendingNPC]);

    // Show item descriptions on hover in the info panel
    const [hoveredItem, setHoveredItem] = useState(null);

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
                        style={{ color: tile.color, cursor: tile.description ? "pointer" : "default" }}
                        onMouseEnter={() => tile.description && setHoveredItem(tile)}
                        onMouseLeave={() => setHoveredItem(null)}
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
        setZones([{ zone: randomZone(), origin: { x: 0, y: 0 } }]);
        setMessages(["You begin your walk in silence."]);
        setState({
            faith: 10,
            enlightenment: 3,
            health: 8,
            inventory: [],
        });
        setGameOver(false);
        setEnding("");
        steps.current = 0;
        setSanctuarySpawned(false);
        setSanctuaryPos(null);
        setUsedSpecials([]);
    };

    // Render
    return (
        <div className="podvigh-bg">
            {/* Map area */}
            <div className="podvigh-map-area">
                <h2 className="podvigh-title">The Pilgrim’s Walk</h2>
                {mapRows}
            </div>
            {/* Info panel */}
            <div className="podvigh-info-panel">
                <div className="podvigh-goal">
                    <strong>Goal:</strong> Find the Sanctuary of Humility by growing your Faith and Enlightenment. Explore, pray, and survive!
                </div>
                <div className="podvigh-stats">
                    Faith: {state.faith} &nbsp; Health: {state.health} &nbsp; Enlightenment: {state.enlightenment}
                </div>
                <div className="podvigh-inventory">
                    Inventory ({state.inventory.length}/{INVENTORY_LIMIT}): {state.inventory.length === 0 ? "Empty" : state.inventory.map((item, i) => (
                        <span
                            key={i}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => {
                                const found = SPECIALS.find(s => s.name === item);
                                if (found) setHoveredItem(found);
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {item}{i < state.inventory.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </div>
                {hoveredItem && (
                    <div className="podvigh-messages" style={{ background: "#222", color: "#FFD700", marginBottom: "1em" }}>
                        <strong>{hoveredItem.name}</strong>
                        <div style={{ fontSize: "0.95em", color: "#eee", marginTop: "0.3em" }}>
                            {hoveredItem.description}
                        </div>
                    </div>
                )}
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
                    Controls: Move (<b>WASD</b> / <b>Arrow keys</b>) | Pray (<b>P</b>) | Eat Food (<b>E</b>) | Drink Potion (<b>O</b>) | Light Candle (<b>C</b>) | Pick Up Item (<b>G</b>)
                </div>
                {gameOver && (
                    <div className="podvigh-ending">
                        <button
                            onClick={restartGame}
                            className="podvigh-restart-btn"
                        >
                            Restart
                        </button>
                    </div>
                )}
                {pendingPickup && (
                    <div className="podvigh-messages">
                        You see a {pendingPickup.name}. Press <b>g</b> to pick up, any other key to ignore.
                    </div>
                )}
                {pendingNPC && (
                    <div className="podvigh-messages">
                        You meet {pendingNPC.name}. Press <b>t</b> to talk, any other key to ignore.
                    </div>
                )}
            </div>
        </div>
    );
};

export default podvigh;