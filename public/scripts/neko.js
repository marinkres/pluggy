var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const NEKO_WIDTH = 32;
const NEKO_HEIGHT = 32;
const NEKO_HALF_WIDTH = NEKO_WIDTH / 2;
const NEKO_HALF_HEIGHT = NEKO_HEIGHT / 2;
const NEKO_SPEED = 10;
const FRAME_RATE = 100;
const Z_INDEX = Number.MAX_SAFE_INTEGER;
const ALERT_TIME = 3;
const IDLE_THRESHOLD = 1;
const IDLE_ANIMATION_CHANCE = 1;
const MIN_DISTANCE = 10;
const SPRITE_GAP = 1;
const BACKGROUND_TARGET_COLOR = [0, 174, 240];
const AXIS_THRESHOLD = 4;
// TODO: offset neko when dragging
export class Neko {
    constructor({ nekoName, nekoImageUrl, initialPosX, initialPosY, }) {
        this.isMouseInside = true;
        this.isMouseMoving = false;
        this.mouseMoveTimeoutId = null;
        this.dragAnimationLastTimestamp = null;
        this.currentScratchSprite = null;
        this.handleMouseMove = (event) => {
            // Check if mouse is within viewport
            if (
                event.clientX < 0 ||
                event.clientX > window.innerWidth ||
                event.clientY < 0 ||
                event.clientY > window.innerHeight
            ) {
                return; // Ignore updates if mouse is outside the viewport
            }
        
            if (this.isDragging) {
                const dx = event.clientX - this.lastMouseX;
                const dy = event.clientY - this.lastMouseY;
                const movementDistance = Math.hypot(dx, dy);
                const MOVEMENT_THRESHOLD = 2;
                if (!this.wasDragged) {
                    if (movementDistance > MOVEMENT_THRESHOLD) {
                        this.wasDragged = true;
                    } else {
                        this.setSprite("alert", 0);
                        this.render();
                        this.lastMouseX = event.clientX;
                        this.lastMouseY = event.clientY;
                        return;
                    }
                }
                this.isMouseMoving = true;
                if (this.mouseMoveTimeoutId !== null) {
                    clearTimeout(this.mouseMoveTimeoutId);
                }
                this.mouseMoveTimeoutId = window.setTimeout(() => {
                    this.isMouseMoving = false;
                    this.setSprite("alert", 0);
                    this.render();
                }, 100);
                this.posX = event.clientX;
                this.posY = event.clientY;
                this.updateDraggingSprite(dx, dy, event.timeStamp);
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
                this.render();
            } else {
                // Update mouse position only when inside viewport
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            }
        };
        
        this.handleMouseDown = (event) => {
            this.isDragging = true;
            this.wasDragged = false;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            this.idleAnimationFrame = 0;
            this.dragAnimationLastTimestamp = null;
            this.isMouseMoving = false;
            if (this.nekoElement) {
                this.nekoElement.style.cursor = "grabbing";
            }
            this.setSprite("alert", 0);
            this.render();
            event.preventDefault();
        };
        this.handleMouseUp = () => {
            this.isDragging = false;
            this.idleAnimationFrame = 0;
            this.dragAnimationLastTimestamp = null;
            this.isMouseMoving = false;
            this.currentScratchSprite = null;
            if (this.nekoElement) {
                this.nekoElement.style.cursor = "grab";
            }
            if (this.mouseMoveTimeoutId !== null) {
                clearTimeout(this.mouseMoveTimeoutId);
                this.mouseMoveTimeoutId = null;
            }
        };
        this.nekoName = nekoName;
        this.nekoImageUrl = nekoImageUrl;
        this.posX = initialPosX !== undefined ? initialPosX : window.innerWidth / 2;
        this.posY = initialPosY !== undefined ? initialPosY : window.innerHeight / 2;
        this.initialPosX = this.posX;
        this.initialPosY = this.posY;
        this.mouseX = 0;
        this.mouseY = 0;
        this.frameCount = 0;
        this.idleTime = 0;
        this.idleAnimation = null;
        this.idleAnimationFrame = 0;
        this.isFollowing = false;
        this.isReturningToOrigin = false;
        this.nekoElement = null;
        this.lastFrameTimestamp = null;
        this.animationFrameId = null;
        this.isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        this.isDragging = false;
        this.wasDragged = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.currentScratchSprite = null;
        this.spriteSets = {
            idle: [[0, 0]],
            alert: [[7, 0]],
            lickPaw: [[1, 0]],
            scratchSelf: [
                [2, 0],
                [3, 0],
            ],
            scratchWallS: [
                [0, 3],
                [1, 3],
            ],
            scratchWallE: [
                [2, 3],
                [3, 3],
            ],
            scratchWallN: [
                [4, 3],
                [5, 3],
            ],
            scratchWallW: [
                [6, 3],
                [7, 3],
            ],
            tired: [[4, 0]],
            sleeping: [
                [5, 0],
                [6, 0],
            ],
            S: [
                [0, 1],
                [1, 1],
            ],
            SE: [
                [2, 1],
                [3, 1],
            ],
            E: [
                [4, 1],
                [5, 1],
            ],
            NE: [
                [6, 1],
                [7, 1],
            ],
            N: [
                [0, 2],
                [1, 2],
            ],
            NW: [
                [2, 2],
                [3, 2],
            ],
            W: [
                [4, 2],
                [5, 2],
            ],
            SW: [
                [6, 2],
                [7, 2],
            ],
        };
    }
    init() {
        if (this.isReducedMotion)
            return;
        if (document.getElementById(this.nekoName))
            return;
        this.createNekoElement();
        this.addEventListeners();
        this.animationLoop();
    }
    static makeTransparent(imageUrl, targetColor) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = imageUrl;
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx)
                        return reject("Canvas not supported");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        if (r === targetColor[0] &&
                            g === targetColor[1] &&
                            b === targetColor[2]) {
                            data[i + 3] = 0;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                    const transparentImageUrl = canvas.toDataURL("image/png");
                    resolve(transparentImageUrl);
                };
                img.onerror = (err) => reject(err);
            });
        });
    }
    createNekoElement() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nekoElement = document.createElement("div");
            this.nekoElement.id = this.nekoName;
            this.nekoElement.ariaHidden = "true";
            this.nekoElement.style.width = `${NEKO_WIDTH}px`;
            this.nekoElement.style.height = `${NEKO_HEIGHT}px`;
            this.nekoElement.style.position = "fixed";
            this.nekoElement.style.pointerEvents = "auto";
            this.nekoElement.style.imageRendering = "pixelated";
            this.nekoElement.style.left = `${this.posX - NEKO_HALF_WIDTH}px`;
            this.nekoElement.style.top = `${this.posY - NEKO_HALF_HEIGHT}px`;
            this.nekoElement.style.zIndex = Z_INDEX.toString();
            this.nekoElement.style.backgroundImage = `url("${this.nekoImageUrl}")`;
            this.nekoElement.style.cursor = "grab";
            try {
                const transparentImageUrl = yield Neko.makeTransparent(this.nekoImageUrl, BACKGROUND_TARGET_COLOR);
                if (this.nekoElement) {
                    this.nekoElement.style.backgroundImage = `url("${transparentImageUrl}")`;
                }
                if (this.nekoElement) {
                    document.body.appendChild(this.nekoElement);
                }
                else {
                    throw new Error("Neko element is null, cannot append to document.");
                }
            }
            catch (err) {
                console.error("Failed to process the image:", err);
            }
            const idleSprite = this.spriteSets["idle"]
                ? this.spriteSets["idle"][0]
                : null;
            if (idleSprite && this.nekoElement) {
                const posX = idleSprite[0] * (NEKO_WIDTH + SPRITE_GAP);
                const posY = idleSprite[1] * (NEKO_HEIGHT + SPRITE_GAP);
                this.nekoElement.style.backgroundPosition = `-${posX}px -${posY}px`;
            }
        });
    }
    updateDraggingSprite(dx, dy, timeStamp) {
        var _a, _b, _c, _d;
        if (!this.isMouseMoving) {
            return;
        }
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        let spriteName;
        if (absDx - absDy > AXIS_THRESHOLD) {
            if (dx > 0) {
                spriteName = "scratchWallW";
            }
            else {
                spriteName = "scratchWallE";
            }
        }
        else if (absDy - absDx > AXIS_THRESHOLD) {
            if (dy > 0) {
                spriteName = "scratchWallN";
            }
            else {
                spriteName = "scratchWallS";
            }
        }
        else {
            spriteName = this.currentScratchSprite || "idle";
        }
        this.currentScratchSprite = spriteName;
        if (this.dragAnimationLastTimestamp === null) {
            this.dragAnimationLastTimestamp = timeStamp;
        }
        const timeSinceLastFrame = timeStamp - this.dragAnimationLastTimestamp;
        const DRAG_ANIMATION_FRAME_INTERVAL = 100;
        if (timeSinceLastFrame >= DRAG_ANIMATION_FRAME_INTERVAL) {
            this.idleAnimationFrame += 1;
            this.dragAnimationLastTimestamp = timeStamp;
        }
        const frameIndex = ((_b = (_a = this.spriteSets[spriteName]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0
            ? this.idleAnimationFrame % ((_d = (_c = this.spriteSets[spriteName]) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 1)
            : 0;
        this.setSprite(spriteName, frameIndex);
    }
    addEventListeners() {
        if (!this.nekoElement)
            return;
        this.nekoElement.addEventListener("click", () => {
            if (!this.wasDragged) {
                this.isFollowing = !this.isFollowing;
                if (this.isFollowing) {
                    this.isReturningToOrigin = false;
                }
                else {
                    this.isReturningToOrigin = true;
                }
            }
        });
        this.nekoElement.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousemove", this.handleMouseMove);
         // Enable following when mouse enters viewport
        document.addEventListener("mouseenter", (event) => {
            this.isFollowing = true; // Enable following
            this.mouseX = event.clientX; // Update mouse position
            this.mouseY = event.clientY;
        });

        // Disable following when mouse leaves viewport
        document.addEventListener("mouseleave", () => {
            this.isFollowing = false; // Disable following
        });
    }
    animationLoop() {
        const loop = (timestamp) => {
            if (this.lastFrameTimestamp === null) {
                this.lastFrameTimestamp = timestamp;
            }
            const delta = timestamp - this.lastFrameTimestamp;
            if (this.isDragging || delta > FRAME_RATE) {
                this.lastFrameTimestamp = timestamp;
                this.updateState();
                if (!this.isDragging) {
                    this.render();
                }
            }
            this.animationFrameId = window.requestAnimationFrame(loop);
        };
        this.animationFrameId = window.requestAnimationFrame(loop);
    }
    updateState() {
        if (this.isDragging) {
            return;
        }
        this.frameCount += 1;
        if (this.isReturningToOrigin) {
            this.moveToInitialPosition();
        }
        else if (this.isFollowing) {
            this.followMouse();
        }
        else {
            this.idleBehavior();
        }
    }
    render() {
        if (!this.nekoElement)
            return;
        this.nekoElement.style.left = `${this.posX - NEKO_HALF_WIDTH}px`;
        this.nekoElement.style.top = `${this.posY - NEKO_HALF_HEIGHT}px`;
    }
    setSprite(name, frame) {
        if (!this.nekoElement)
            return;
        const spriteSet = this.spriteSets[name];
        if (!spriteSet)
            return;
        const sprite = spriteSet[frame % spriteSet.length];
        if (sprite) {
            const posX = sprite[0] * (NEKO_WIDTH + SPRITE_GAP);
            const posY = sprite[1] * (NEKO_HEIGHT + SPRITE_GAP);
            this.nekoElement.style.backgroundPosition = `-${posX}px -${posY}px`;
        }
    }
    resetIdleAnimation() {
        this.idleAnimation = null;
        this.idleAnimationFrame = 0;
    }
    idleBehavior() {
        this.idleTime += 1;
        if (this.idleTime > IDLE_THRESHOLD &&
            Math.random() < IDLE_ANIMATION_CHANCE &&
            this.idleAnimation == null) {
            const availableIdleAnimations = [
                "sleeping",
                "scratchSelf",
                "lickPaw",
                "scratchWallW",
                "scratchWallN",
                "scratchWallE",
                "scratchWallS",
            ];
            this.idleAnimation =
                availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)] || null;
        }
        switch (this.idleAnimation) {
            case "sleeping":
                if (this.idleAnimationFrame < 8) {
                    this.setSprite("tired", 0);
                    break;
                }
                else if (this.idleAnimationFrame < 16) {
                    this.setSprite("idle", 0);
                    break;
                }
                this.setSprite("sleeping", Math.floor(this.idleAnimationFrame / 4));
                if (this.idleAnimationFrame > 192) {
                    this.resetIdleAnimation();
                }
                break;
            case "lickPaw":
                this.setSprite("lickPaw", 0);
                if (this.idleAnimationFrame > 4) {
                    this.resetIdleAnimation();
                }
                break;
            case "scratchWallN":
            case "scratchWallS":
            case "scratchWallE":
            case "scratchWallW":
            case "scratchSelf":
                this.setSprite(this.idleAnimation, this.idleAnimationFrame);
                if (this.idleAnimationFrame > 9) {
                    this.resetIdleAnimation();
                }
                break;
            default:
                this.setSprite("idle", 0);
                return;
        }
        this.idleAnimationFrame += 1;
    }
    followMouse() {
        if (!this.isMouseInside) return; // Do nothing if mouse is outside
    
        const diffX = this.posX - this.mouseX;
        const diffY = this.posY - this.mouseY;
        const distance = Math.hypot(diffX, diffY);
        const STOP_DISTANCE = 50; // Distance from cursor where the cat stops
    
        if (distance < STOP_DISTANCE) {
            if (this.idleAnimation === null) {
                this.setSprite("idle", 0); // Switch to idle animation
            }
            this.resetIdleAnimation(); // Reset any running animation
            return;
        }
    
        // Reset idle animation since the cat is actively moving
        this.idleAnimation = null;
        this.idleAnimationFrame = 0;
    
        let direction = "";
        direction += diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
    
        // Set running animation based on direction
        this.setSprite(direction, this.frameCount);
    
        // Move the cat toward the cursor but stop at STOP_DISTANCE
        const moveDistance = Math.min(NEKO_SPEED, distance - STOP_DISTANCE);
        this.posX -= (diffX / distance) * moveDistance;
        this.posY -= (diffY / distance) * moveDistance;
    
        // Ensure the cat stays within screen bounds
        this.posX = Math.min(Math.max(NEKO_HALF_WIDTH, this.posX), window.innerWidth - NEKO_HALF_WIDTH);
        this.posY = Math.min(Math.max(NEKO_HALF_HEIGHT, this.posY), window.innerHeight - NEKO_HALF_HEIGHT);
    }
    
    
    
    moveToInitialPosition() {
        const diffX = this.posX - this.initialPosX;
        const diffY = this.posY - this.initialPosY;
        const distance = Math.hypot(diffX, diffY);
        if (distance < NEKO_SPEED) {
            this.posX = this.initialPosX;
            this.posY = this.initialPosY;
            this.isReturningToOrigin = false;
            this.idleBehavior();
            return;
        }
        let direction = "";
        direction += diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        this.setSprite(direction, this.frameCount);
        this.posX -= (diffX / distance) * NEKO_SPEED;
        this.posY -= (diffY / distance) * NEKO_SPEED;
    }
    destroy() {
        if (this.nekoElement) {
            this.nekoElement.removeEventListener("mousedown", this.handleMouseDown);
            this.nekoElement.remove();
            this.nekoElement = null;
        }
        if (this.animationFrameId) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }
}
