import kaplay from "kaplay";

const k = kaplay({
    width: 800,
    height: 600,
    background: [135, 206, 235],
    pixelArt: true,
    stretch: false,
});

const CROP_TYPES = {
    wheat: {
        name: "Wheat",
        cost: 10,
        sell: 25,
        growTime: 10,
        colors: ["#8B6914", "#6B8E23", "#9ACD32", "#DAA520"],
    },
    carrot: {
        name: "Carrot",
        cost: 15,
        sell: 40,
        growTime: 16,
        colors: ["#8B6914", "#6B8E23", "#7CCD7C", "#FF8C00"],
    },
    tomato: {
        name: "Tomato",
        cost: 20,
        sell: 60,
        growTime: 22,
        colors: ["#8B6914", "#6B8E23", "#90EE90", "#DC143C"],
    },
};

const GRID_COLS = 6;
const GRID_ROWS = 4;
const CELL = 64;
const GX = (800 - GRID_COLS * CELL) / 2;
const GY = 170;

function makeSprite(name, w, h, fn) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    fn(c.getContext("2d"));
    k.loadSprite(name, c);
}

makeSprite("farmer", 16, 24, (ctx) => {
    ctx.fillStyle = "#6B3E26";
    ctx.fillRect(2, 0, 12, 3);
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(4, 0, 8, 5);
    ctx.fillStyle = "#F5D0A9";
    ctx.fillRect(4, 5, 8, 8);
    ctx.fillStyle = "#222";
    ctx.fillRect(5, 7, 2, 2);
    ctx.fillRect(9, 7, 2, 2);
    ctx.fillStyle = "#4A90D9";
    ctx.fillRect(4, 13, 8, 7);
    ctx.fillRect(1, 14, 3, 5);
    ctx.fillRect(12, 14, 3, 5);
    ctx.fillStyle = "#5B3A1E";
    ctx.fillRect(4, 20, 4, 4);
    ctx.fillRect(8, 20, 4, 4);
});

makeSprite("farmer_left", 16, 24, (ctx) => {
    ctx.fillStyle = "#6B3E26";
    ctx.fillRect(2, 0, 12, 3);
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(4, 0, 8, 5);
    ctx.fillStyle = "#F5D0A9";
    ctx.fillRect(4, 5, 8, 8);
    ctx.fillStyle = "#222";
    ctx.fillRect(5, 7, 2, 2);
    ctx.fillRect(9, 7, 2, 2);
    ctx.fillStyle = "#4A90D9";
    ctx.fillRect(4, 13, 8, 7);
    ctx.fillRect(12, 14, 3, 5);
    ctx.fillRect(1, 14, 3, 5);
    ctx.fillStyle = "#5B3A1E";
    ctx.fillRect(8, 20, 4, 4);
    ctx.fillRect(4, 20, 4, 4);
});

makeSprite("plot", 16, 16, (ctx) => {
    ctx.fillStyle = "#8BC34A";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = "#7CB342";
    ctx.fillRect(0, 0, 16, 2);
    ctx.fillRect(0, 8, 16, 1);
});

makeSprite("tilled", 16, 16, (ctx) => {
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = "#4E342E";
    ctx.fillRect(0, 4, 16, 2);
    ctx.fillRect(0, 10, 16, 1);
    ctx.fillStyle = "#6D4C41";
    ctx.fillRect(2, 1, 3, 2);
    ctx.fillRect(10, 6, 4, 1);
});

for (const [type, info] of Object.entries(CROP_TYPES)) {
    for (let s = 0; s < 4; s++) {
        makeSprite(`${type}_${s}`, 16, 16, (ctx) => {
            ctx.fillStyle = "#5D4037";
            ctx.fillRect(0, 10, 16, 6);
            const col = info.colors[s];
            ctx.fillStyle = col;
            const h = 4 + s * 3;
            const oy = 12 - h;
            ctx.fillRect(6, oy, 4, h);
            if (s >= 1) {
                ctx.fillRect(4, oy + 2, 8, 2);
            }
            if (s >= 2) {
                ctx.fillRect(3, oy + 1, 3, 2);
                ctx.fillRect(10, oy + 1, 3, 2);
            }
            if (s >= 3) {
                ctx.fillRect(5, oy - 1, 6, 3);
                ctx.fillRect(2, oy + 3, 3, 2);
                ctx.fillRect(11, oy + 3, 3, 2);
            }
        });
    }
}

makeSprite("tree", 32, 48, (ctx) => {
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(12, 28, 8, 20);
    ctx.fillStyle = "#2E7D32";
    ctx.fillRect(6, 8, 20, 24);
    ctx.fillStyle = "#388E3C";
    ctx.fillRect(4, 16, 24, 16);
    ctx.fillStyle = "#1B5E20";
    ctx.fillRect(10, 4, 12, 12);
});

makeSprite("cloud", 48, 24, (ctx) => {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(4, 8, 40, 12);
    ctx.fillRect(12, 2, 24, 18);
    ctx.fillRect(20, 0, 10, 20);
});

makeSprite("sign", 24, 24, (ctx) => {
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(10, 16, 4, 8);
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(2, 2, 20, 16);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(4, 4, 16, 12);
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(6, 6, 4, 4);
    ctx.fillRect(12, 6, 4, 4);
    ctx.fillStyle = "#388E3C";
    ctx.fillRect(6, 11, 10, 4);
});

let coins = 100;
let selectedCrop = "wheat";
let plotData = [];
let plotVisuals = [];
let farmer;
let shopOpen = false;
let shopUI = [];
let selectedSeedUI;

function showMessage(text, color) {
    const msg = k.add([
        k.text(text, { size: 14 }),
        k.pos(k.center().x, k.height() - 30),
        k.anchor("center"),
        k.color(color || [255, 255, 255]),
        k.z(300),
    ]);
    k.wait(1.5, () => {
        if (msg.exists()) k.destroy(msg);
    });
}

function updateHUD() {
    const crop = CROP_TYPES[selectedCrop];
    if (selectedSeedUI) {
        selectedSeedUI.text = `Seed: ${crop.name} (${crop.cost}c)`;
    }
}

function findNearestPlot() {
    let nearest = -1;
    let minDist = 48;
    for (let i = 0; i < plotData.length; i++) {
        const v = plotVisuals[i];
        if (!v.exists()) continue;
        const d = farmer.pos.dist(v.pos);
        if (d < minDist) {
            minDist = d;
            nearest = i;
        }
    }
    return nearest;
}

function buildShop() {
    shopOpen = true;
    const bx = 200, by = 140, bw = 400, bh = 320;

    const bg = k.add([k.rect(bw, bh), k.pos(bx, by), k.color(30, 30, 30), k.opacity(0.92), k.z(100), k.outline(3, k.Color.fromArray([100, 100, 100]))]);
    shopUI.push(bg);

    const title = k.add([k.text("SEED SHOP", { size: 20 }), k.pos(400, by + 30), k.anchor("center"), k.z(101)]);
    shopUI.push(title);

    const closeBtn = k.add([k.text("[B] CLOSE", { size: 12 }), k.pos(400, by + bh - 20), k.anchor("center"), k.z(101)]);
    shopUI.push(closeBtn);

    const cropKeys = Object.keys(CROP_TYPES);
    for (let i = 0; i < cropKeys.length; i++) {
        const key = cropKeys[i];
        const crop = CROP_TYPES[key];
        const y = by + 70 + i * 60;

        const isSelected = key === selectedCrop;
        const btnColor = isSelected ? [70, 130, 70] : [60, 60, 60];

        const btn = k.add([
            k.rect(340, 48),
            k.pos(bx + 30, y),
            k.color(btnColor[0], btnColor[1], btnColor[2]),
            k.z(101),
            k.area(),
            k.outline(2, k.Color.fromArray(isSelected ? [100, 200, 100] : [80, 80, 80])),
            "shop-btn",
        ]);
        shopUI.push(btn);

        const label = k.add([
            k.text(`${crop.name}  |  Cost: ${crop.cost}c  |  Sells for: ${crop.sell}c`, { size: 12 }),
            k.pos(bx + 200, y + 14),
            k.anchor("center"),
            k.z(102),
        ]);
        shopUI.push(label);

        if (coins >= crop.cost) {
            const stockLabel = k.add([
                k.text("IN STOCK", { size: 10 }),
                k.pos(bx + 340, y + 14),
                k.anchor("center"),
                k.z(102),
                k.color(100, 200, 100),
            ]);
            shopUI.push(stockLabel);
        }

        btn.onClick(() => {
            if (coins >= crop.cost) {
                selectedCrop = key;
                updateHUD();
                showMessage(`Selected ${crop.name} seeds`, [100, 255, 100]);
                closeShop();
            } else {
                showMessage("Not enough coins!", [255, 100, 100]);
            }
        });
    }
}

function closeShop() {
    shopOpen = false;
    shopUI.forEach(obj => {
        if (obj.exists()) k.destroy(obj);
    });
    shopUI = [];
}

k.scene("farm", () => {
    shopOpen = false;
    shopUI = [];
    plotData = [];
    plotVisuals = [];

    k.add([k.rect(800, 600), k.color(135, 206, 235), k.z(-10)]);

    const grassY = GY + GRID_ROWS * CELL + 20;
    k.add([k.rect(800, 600 - grassY + 10), k.pos(0, grassY), k.color(76, 175, 80), k.z(-5)]);
    k.add([k.rect(800, 4), k.pos(0, grassY - 2), k.color(56, 142, 60), k.z(-4)]);

    for (let i = 0; i < 3; i++) {
        k.add([
            k.sprite("cloud"),
            k.pos(k.rand(50, 700), k.rand(10, 50)),
            k.move(k.LEFT, k.rand(5, 15)),
            k.z(-3),
            "cloud",
        ]);
    }

    k.onUpdate("cloud", (c) => {
        if (c.pos.x < -60) c.pos.x = 860;
    });

    k.add([k.sprite("tree"), k.pos(30, grassY - 35), k.scale(0.8), k.z(0)]);
    k.add([k.sprite("tree"), k.pos(740, grassY - 35), k.scale(0.8), k.z(0)]);

    k.add([k.sprite("sign"), k.pos(380, grassY - 18), k.scale(1.2), k.z(0)]);

    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            const x = GX + c * CELL + CELL / 2;
            const y = GY + r * CELL + CELL / 2;
            plotData.push({
                row: r,
                col: c,
                state: "empty",
                cropType: null,
                stage: 0,
                timer: 0,
            });
            const visual = k.add([
                k.sprite("plot"),
                k.pos(x, y),
                k.anchor("center"),
                k.z(1),
            ]);
            plotVisuals.push(visual);
        }
    }

    farmer = k.add([
        k.sprite("farmer"),
        k.pos(400, 120),
        k.anchor("center"),
        k.area(),
        k.z(5),
        k.scale(1.5),
        "farmer",
    ]);

    const SPEED = 200;

    k.onKeyDown("w", () => {
        farmer.move(0, -SPEED);
        farmer.use(k.sprite("farmer"));
    });
    k.onKeyDown("s", () => {
        farmer.move(0, SPEED);
        farmer.use(k.sprite("farmer"));
    });
    k.onKeyDown("a", () => {
        farmer.move(-SPEED, 0);
        farmer.use(k.sprite("farmer_left"));
    });
    k.onKeyDown("d", () => {
        farmer.move(SPEED, 0);
        farmer.use(k.sprite("farmer"));
    });
    k.onKeyDown("up", () => {
        farmer.move(0, -SPEED);
        farmer.use(k.sprite("farmer"));
    });
    k.onKeyDown("down", () => {
        farmer.move(0, SPEED);
        farmer.use(k.sprite("farmer"));
    });
    k.onKeyDown("left", () => {
        farmer.move(-SPEED, 0);
        farmer.use(k.sprite("farmer_left"));
    });
    k.onKeyDown("right", () => {
        farmer.move(SPEED, 0);
        farmer.use(k.sprite("farmer"));
    });

    farmer.onUpdate(() => {
        farmer.pos.x = Math.max(20, Math.min(780, farmer.pos.x));
        farmer.pos.y = Math.max(40, Math.min(grassY - 5, farmer.pos.y));
    });

    k.onKeyPress("space", () => {
        if (shopOpen) return;
        const idx = findNearestPlot();
        if (idx === -1) {
            showMessage("Move closer to a plot", [200, 200, 200]);
            return;
        }
        const p = plotData[idx];
        const v = plotVisuals[idx];

        if (p.state === "empty") {
            p.state = "tilled";
            v.use(k.sprite("tilled"));
            showMessage("Tilled the soil!", [150, 255, 150]);
        } else if (p.state === "tilled") {
            const crop = CROP_TYPES[selectedCrop];
            if (coins >= crop.cost) {
                coins -= crop.cost;
                p.state = "growing";
                p.cropType = selectedCrop;
                p.stage = 0;
                p.timer = 0;
                v.use(k.sprite(`${selectedCrop}_0`));
                showMessage(`Planted ${crop.name}!`, [150, 255, 150]);
                updateHUD();
            } else {
                showMessage(`Need ${crop.cost}c for ${crop.name} seeds`, [255, 150, 100]);
            }
        } else if (p.state === "growing") {
            showMessage("Still growing... be patient!", [255, 255, 150]);
        } else if (p.state === "harvestable") {
            const crop = CROP_TYPES[p.cropType];
            coins += crop.sell;
            p.state = "empty";
            p.cropType = null;
            p.stage = 0;
            p.timer = 0;
            v.use(k.sprite("plot"));
            showMessage(`Harvested! +${crop.sell} coins`, [255, 215, 0]);
            updateHUD();
        }
    });

    k.onKeyPress("1", () => {
        const keys = Object.keys(CROP_TYPES);
        selectedCrop = keys[0];
        updateHUD();
        showMessage(`Selected ${CROP_TYPES[selectedCrop].name}`, [200, 200, 255]);
    });
    k.onKeyPress("2", () => {
        const keys = Object.keys(CROP_TYPES);
        selectedCrop = keys[1];
        updateHUD();
        showMessage(`Selected ${CROP_TYPES[selectedCrop].name}`, [200, 200, 255]);
    });
    k.onKeyPress("3", () => {
        const keys = Object.keys(CROP_TYPES);
        selectedCrop = keys[2];
        updateHUD();
        showMessage(`Selected ${CROP_TYPES[selectedCrop].name}`, [200, 200, 255]);
    });

    k.onKeyPress("b", () => {
        if (shopOpen) {
            closeShop();
        } else {
            buildShop();
        }
    });

    const hudBg = k.add([
        k.rect(300, 65),
        k.pos(10, 10),
        k.color(0, 0, 0),
        k.opacity(0.6),
        k.z(50),
    ]);

    const coinLabel = k.add([
        k.text(`Coins: ${coins}`, { size: 16 }),
        k.pos(20, 18),
        k.z(51),
    ]);

    selectedSeedUI = k.add([
        k.text("", { size: 12 }),
        k.pos(20, 42),
        k.z(51),
        k.color(200, 200, 255),
    ]);
    updateHUD();

    const controlsBg = k.add([
        k.rect(260, 55),
        k.pos(530, 10),
        k.color(0, 0, 0),
        k.opacity(0.6),
        k.z(50),
    ]);

    k.add([
        k.text("WASD: Move | SPACE: Interact", { size: 11 }),
        k.pos(540, 18),
        k.z(51),
    ]);
    k.add([
        k.text("1/2/3: Seeds | B: Shop", { size: 11 }),
        k.pos(540, 38),
        k.z(51),
    ]);

    k.onUpdate(() => {
        const dt = k.dt();
        let coinsChanged = false;

        for (let i = 0; i < plotData.length; i++) {
            const p = plotData[i];
            if (p.state === "growing") {
                p.timer += dt;
                const crop = CROP_TYPES[p.cropType];
                const stageDur = crop.growTime / 4;
                const newStage = Math.min(3, Math.floor(p.timer / stageDur));
                if (newStage !== p.stage) {
                    p.stage = newStage;
                    if (plotVisuals[i].exists()) {
                        plotVisuals[i].use(k.sprite(`${p.cropType}_${newStage}`));
                    }
                }
                if (p.stage === 3 && p.timer >= crop.growTime) {
                    p.state = "harvestable";
                }
            }

            if (p.state === "harvestable") {
                const v = plotVisuals[i];
                if (v.exists()) {
                    const dist = farmer.pos.dist(v.pos);
                    if (dist < 36) {
                        const crop = CROP_TYPES[p.cropType];
                        coins += crop.sell;
                        coinsChanged = true;
                        showMessage(`Harvested ${crop.name}! +${crop.sell}c`, [255, 215, 0]);
                        p.state = "empty";
                        p.cropType = null;
                        p.stage = 0;
                        p.timer = 0;
                        v.use(k.sprite("plot"));
                    }
                }
            }
        }

        if (coinsChanged) {
            updateHUD();
        }

        coinLabel.text = `Coins: ${coins}`;
    });
});

k.go("farm");
