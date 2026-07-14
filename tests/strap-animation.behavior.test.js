const fs = require("fs");
const assert = require("assert");
const vm = require("vm");

let now = 1000;
let animationFrameRequests = 0;

function createElement(id = "") {
  const children = [];
  const element = {
    id,
    children,
    childNodes: [{}, { nodeValue: "" }],
    style: {},
    hidden: false,
    textContent: "",
    clientWidth: 1080,
    listeners: {},
    setAttribute() {},
    addEventListener(type, listener) {
      (this.listeners[type] ||= []).push(listener);
    },
    appendChild(child) { child.__parentChildren = children; children.push(child); },
    prepend(child) { child.__parentChildren = children; children.unshift(child); },
    remove() {
      const index = this.__parentChildren?.indexOf(this) ?? -1;
      if (index >= 0) this.__parentChildren.splice(index, 1);
    },
    getBoundingClientRect() { return { left: 0, top: 0, width: 1080, height: 720 }; }
  };
  Object.defineProperty(element, "lastChild", { get: () => children.at(-1) });
  Object.defineProperty(element, "innerHTML", {
    get: () => "",
    set(value) { if (value === "") children.length = 0; }
  });
  return element;
}

const gradient = { addColorStop() {} };
const context2d = new Proxy({}, {
  get(target, property) {
    if (property === "createLinearGradient" || property === "createRadialGradient") return () => gradient;
    if (!(property in target)) target[property] = () => {};
    return target[property];
  },
  set(target, property, value) {
    target[property] = value;
    return true;
  }
});

const elements = new Map();
const getElement = (id) => {
  if (!elements.has(id)) elements.set(id, createElement(id));
  return elements.get(id);
};
getElement("simCanvas").getContext = () => context2d;

const sandbox = {
  console,
  URL,
  URLSearchParams,
  location: { search: "", href: "http://localhost/" },
  history: { replaceState() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  performance: { now: () => now },
  requestAnimationFrame() { animationFrameRequests += 1; },
  document: {
    documentElement: {},
    title: "",
    getElementById: getElement,
    createElement,
    querySelector: () => createElement(),
    querySelectorAll: () => []
  }
};

const projectRoot = new URL("../", `file://${__dirname}/`);
const appPath = new URL(process.env.APP_PATH || "app.js", projectRoot);
const indexPath = new URL(process.env.INDEX_PATH || "index.html", projectRoot);
const stylePath = new URL(process.env.STYLE_PATH || "styles.css", projectRoot);
const source = fs.readFileSync(appPath, "utf8");
const html = fs.readFileSync(indexPath, "utf8");
const css = fs.readFileSync(stylePath, "utf8");
const root = new URL("./", appPath);
const instrumentAssets = ["inspect", "scalpel", "retractor", "nanocarbon", "dissector", "nerveProbe", "clip", "harmonic", "advancedBipolar", "monopolar", "cautery", "forceps", "suture"];
instrumentAssets.forEach((name) => {
  assert(fs.existsSync(new URL(`assets/instruments/${name}.png`, root)), `local image should exist for ${name}`);
});
assert(fs.existsSync(new URL("assets/instruments/SOURCES.md", root)), "instrument source manifest should exist");
assert(fs.existsSync(new URL("assets/instruments/inspect.svg", root)), "the Observe magnifying-glass sprite should exist");
assert(fs.existsSync(new URL("assets/instruments/source/harmonic-focus-supplied.png", root)), "the supplied HARMONIC FOCUS photo should be retained");
assert(fs.existsSync(new URL("assets/instruments/harmonic-tip-topdown.png", root)), "the overhead HARMONIC FOCUS working-end sprite should exist");
assert(fs.existsSync(new URL("assets/instruments/advanced-bipolar-tip-topdown.png", root)), "the overhead Advanced Bipolar working-end sprite should exist");
assert(fs.existsSync(new URL("assets/instruments/source/ligasure-supplied.png", root)), "the supplied LigaSure photo should be retained");

vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const structure = vm.runInContext(`({
  txEn: TX.en.length,
  txZh: TX.zh.length,
  uiEn: Object.keys(UI.en).sort().join("|"),
  uiZh: Object.keys(UI.zh).sort().join("|"),
  stageCount: stages.length,
  uniqueStageTargets: new Set(stages.map((stage) => stage.target)).size,
  missingStepTools: stages.filter((stage) => !stepTools[stage.target]).map((stage) => stage.target),
  unknownTools: [...new Set(Object.values(stepTools).flat().filter((id) => !tools.some((tool) => tool.id === id)))],
  toolsWithoutTipAnchors: tools.filter((tool) => !spritePoses[tool.id]?.tip).map((tool) => tool.id),
  duplicateZones: zones.map((zone) => zone.id).filter((id, index, ids) => ids.indexOf(id) !== index)
})`, sandbox);

assert.equal(structure.txEn, structure.txZh, "English and Chinese translation arrays should stay aligned");
assert.equal(structure.uiEn, structure.uiZh, "English and Chinese UI dictionaries should expose the same keys");
assert.equal(structure.stageCount, 16, "the workflow should contain 16 stages");
assert.equal(structure.uniqueStageTargets, structure.stageCount, "stage targets should be unique");
assert.deepEqual(structure.missingStepTools, [], "every stage should define allowed instruments");
assert.deepEqual(structure.unknownTools, [], "stage instrument IDs should exist in the tool registry");
assert.deepEqual(structure.toolsWithoutTipAnchors, [], "every instrument should define a working-tip anchor");
assert.deepEqual(structure.duplicateZones, [], "anatomy zone IDs should be unique");

const protectedHits = vm.runInContext(`(() => {
  resetSimulation();
  state.stage = 2;
  state.tool = "harmonic";
  const coveredNerve = hitZone({ x: 620, y: 330 }).id;
  state.completed.add("strap");
  state.stage = 3;
  const exposedNerve = hitZone({ x: 620, y: 330 }).id;
  state.stage = 5;
  state.tool = "nanocarbon";
  const parathyroid = hitZone({ x: 624, y: 258 }).id;
  return { coveredNerve, exposedNerve, parathyroid };
})()`, sandbox);
assert.equal(protectedHits.coveredNerve, "strapWindow", "the covered RLN must not block strap-muscle cutting");
assert.equal(protectedHits.exposedNerve, "rightRLN", "the RLN should become protected after strap separation");
assert.equal(protectedHits.parathyroid, "rightParaSup", "the thyroid target must not mask a parathyroid");

const intendedHits = vm.runInContext(`(() => {
  resetSimulation();
  state.tool = "harmonic";
  state.stage = 2;
  const strap = hitZone({ x: 540, y: 330 }).id;
  state.stage = 3;
  const middleVein = hitZone({ x: 742, y: 340 }).id;
  state.stage = 10;
  const isthmus = hitZone({ x: 548, y: 350 }).id;
  state.tool = "dissector";
  state.stage = 12;
  const nodeMobilization = hitZone({ x: 548, y: 474 }).id;
  state.tool = "advancedBipolar";
  state.stage = 13;
  const nodeClearance = hitZone({ x: 548, y: 474 }).id;
  return { strap, middleVein, isthmus, nodeMobilization, nodeClearance };
})()`, sandbox);
assert.deepEqual(intendedHits, {
  strap: "strapWindow",
  middleVein: "rightMidVein",
  isthmus: "isthmus",
  nodeMobilization: "pretrachealNodes",
  nodeClearance: "pretrachealNodes"
}, "the current step's intended target should win over overlapping trachea or nerve zones");

const focusStepClick = vm.runInContext(`(() => {
  resetSimulation();
  state.stage = 3;
  state.tool = "harmonic";
  const point = { x: 742, y: 340 };
  onAction(hitZone(point), point);
  return { safety: state.safety, targetId: state.action?.targetId };
})()`, sandbox);
assert.deepEqual(focusStepClick, { safety: 100, targetId: "rightMidVein" }, "the Step 4 Focus target should start vessel sealing without a nerve penalty");

const nerveExposureClicks = vm.runInContext(`(() => {
  const point = { x: 620, y: 330 };
  resetSimulation();
  state.stage = 2;
  state.tool = "harmonic";
  onAction(hitZone(point), point);
  const covered = { safety: state.safety, targetId: state.action?.targetId };
  resetSimulation();
  state.completed.add("strap");
  state.stage = 3;
  state.tool = "harmonic";
  onAction(hitZone(point), point);
  return { covered, exposed: { safety: state.safety, targetId: state.action?.targetId || null } };
})()`, sandbox);
assert.deepEqual(nerveExposureClicks, {
  covered: { safety: 100, targetId: "strapWindow" },
  exposed: { safety: 86, targetId: null }
}, "RLN safety should begin only after the strap muscles expose it");

const dissectorNerveContact = vm.runInContext(`(() => {
  resetSimulation();
  state.stage = 9;
  state.tool = "dissector";
  onAction(zones.find((zone) => zone.id === "rightRLN"), { x: 620, y: 330 });
  return { safety: state.safety, active: Boolean(state.action) };
})()`, sandbox);
assert.equal(dissectorNerveContact.safety, 86, "blunt dissection directly on a nerve should reduce safety");
assert.equal(dissectorNerveContact.active, false, "unsafe nerve contact should not start a procedure animation");

const highestTranslationIndex = Math.max(...[...source.matchAll(/\btr\((\d+)\)/g)].map((match) => Number(match[1])));
assert(highestTranslationIndex < structure.txEn, "all numeric translation references should exist in both languages");

const boundIds = [...source.matchAll(/getElementById\("([^"]+)"\)/g)].map((match) => match[1]);
boundIds.forEach((id) => assert(html.includes(`id="${id}"`), `index.html should provide #${id}`));

assert(html.includes('id="stageNumber">1 / 16'), "the static stage count should match the 16-stage workflow");
assert(html.includes('tabindex="0"'), "the interactive canvas should be keyboard focusable");
assert(html.includes('aria-keyshortcuts="Enter Space"'), "the canvas should expose its activation keys");
assert(/id="feedbackLog"[^>]*aria-live="polite"/.test(html), "procedure feedback should be announced to assistive technology");
assert(html.includes('id="instrumentImage"'), "the selected instrument should expose a local product image");
assert(!html.includes('id="instrumentSource"'), "the selected instrument should not expose source provenance text");
assert(source.includes("const toolPhoto="), "the selected instrument should support supplied product photos");
assert(source.includes('id==="inspect"?"assets/instruments/inspect.svg"'), "Observe should use a magnifying-glass sprite");
assert(source.includes("drawInstrumentSprite(state.tool"), "the cursor should use the selected instrument image sprite");
assert(source.includes("function drawSeparatedVessel"), "sealed vessels should render as separated segments");
const isthmusRenderer = source.slice(source.indexOf("function thyroidIsthmus"), source.indexOf("function thyroidNodule"));
assert(isthmusRenderer.includes('state.completed.has("isthmus")'), "the divided isthmus should retain a visible physical gap");
assert(source.includes("function drawSparks"), "energy actions should render a spark effect");
assert(source.includes("function drawElectricalGlow"), "monopolar cutting should render an electrical glow");
assert(source.includes("monopolar: 1700"), "monopolar animation should be slower");
assert(source.includes("return 2500"), "energy devices should dwell longer on vessels");
assert(source.includes("cutStart={x:540, y:462}"), "strap-muscle cutting should begin at the lower edge");
assert(source.includes("function vesselCutTarget"), "vessel actions should target the rendered division point");
assert(source.includes("function drawOverheadCutTip"), "energy cuts should use an overhead working-end close-up");
assert(source.includes("actionImages.harmonicTip"), "HARMONIC cuts should use the dedicated overhead working-end sprite");
assert(source.includes("actionImages.advancedBipolarTip"), "Advanced Bipolar cuts should use the dedicated overhead working-end sprite");
assert(source.includes("linearProgress"), "cut timing should retain a linear progress value");
assert(source.includes("(linear-0.3)/0.7"), "muscle and isthmus cuts should use equal-time passes");
assert(source.includes('const cutSteps=zone.id==="isthmus"?2:3'), "isthmus cutting should use two equal passes");
assert(source.includes("(progress-i/steps)/0.16"), "cut marks should be evenly staged");
assert(source.includes("const vesselCut=advancedBipolar&&[\"artery\", \"vein\"].includes(zone.type)"), "Advanced Bipolar vessel work should use the vessel-cut animation");
assert(source.includes("Math.sin(cutProgress*Math.PI)"), "Advanced Bipolar should use one sustained activation pulse");
assert(!source.includes("cutProgress*Math.PI*3"), "Advanced Bipolar should not repeat vessel sparks");
assert(source.includes("drawOverheadCutTip(action.tool, contact, approach);"), "all energy-device actions should use the overhead working-end view");
assert(!source.includes("const overheadCut="), "energy-device actions should not fall back to the angled sprite");
assert(source.includes("linear/(vesselEnergy?0.22:0.28)"), "vessel energy should reach the contact point before the extended dwell");
assert(source.includes("{x:374, y:510}"), "the monopolar flap cut should start on a straight horizontal path");
assert(source.includes("{x:704, y:510}"), "the monopolar flap cut should end on the same horizontal path");
assert(source.includes("const isIncision=zone.id===\"incision\""), "monopolar should use a dedicated collar-incision path");
assert(source.includes("(linear-0.32)/0.68"), "monopolar cutting should wait until after its approach phase");
assert(source.includes("const mobilized=state.completed.has(id)"), "parathyroids should track dissector mobilization separately");
const parathyroidRenderer = source.slice(source.indexOf("function parathyroid"), source.indexOf("function drawVessel"));
assert(parathyroidRenderer.includes('ctx.fillStyle="#f0d85a"'), "parathyroids should remain solid yellow throughout");
assert(!parathyroidRenderer.includes("#c94b4b"), "mobilized parathyroids should not develop a red center");
assert(parathyroidRenderer.includes("if(mobilized){"), "mobilized parathyroids should receive a persistent highlight");
const highlightRenderer = source.slice(source.indexOf("function drawHighlights"), source.indexOf("function drawTeachingOverlay"));
assert(highlightRenderer.includes('zone.type!=="parathyroid"||state.completed.has(zone.id)'), "unmobilized parathyroids should not receive a target highlight");
assert(!source.includes("parathyroid glands stand out in red"), "English nanocarbon guidance should describe yellow parathyroids");
assert(!source.includes("甲状旁腺以红色对比显示"), "Chinese nanocarbon guidance should describe yellow parathyroids");
assert(source.includes("Math.sin(progress*Math.PI*2)*0.16"), "blunt dissection should use a controlled, limited twist");
assert(source.includes("if(activation>0&&!harmonic)"), "HARMONIC activation should not render electrical sparks");
assert(source.includes("function drawBluntSeparation"), "blunt dissection should animate tissue separation without guide lines");
assert(!css.includes(".stage-card p: last-child"), "the desktop objective selector should be valid");
assert(css.includes(".stage-card p:last-child"), "the desktop objective alignment rule should remain present");
assert(css.includes("prefers-reduced-motion"), "the UI should provide a reduced-motion mode");
assert(!source.includes("function phase()"), "unused phase helper should be removed");
assert(!/if\(zone\.id==="flapPlane"\)\{\s*const traction=state\.settings\.traction;/.test(source), "unused flap traction variable should be removed");
assert(!/function drawThyroidLobules\([^)]*color\)/.test(source), "unused thyroid lobule color parameter should be removed");

const vesselAlignment = vm.runInContext(`(() => {
  const zone = zones.find((item) => item.id === "rightMidVein");
  const seamStart = zone.path.at(-2);
  const seamEnd = zone.path.at(-1);
  return { target: vesselCutTarget(zone), seam: { x: (seamStart[0] + seamEnd[0]) / 2, y: (seamStart[1] + seamEnd[1]) / 2 } };
})()`, sandbox);
assert.deepEqual(vesselAlignment.target, vesselAlignment.seam, "vessel energy should target the rendered separation seam");

const originalDrawImage = context2d.drawImage;
const overheadDraws = [];
context2d.drawImage = (...args) => overheadDraws.push(args);
sandbox.__advancedBipolarTip = { complete: true, naturalWidth: 887, naturalHeight: 1774 };
vm.runInContext(`
  actionImages.advancedBipolarTip = __advancedBipolarTip;
  drawOverheadCutTip("advancedBipolar", { x: 540, y: 350 }, 1);
`, sandbox);
context2d.drawImage = originalDrawImage;
const overheadImageDraw = overheadDraws.at(-1);
assert.equal(overheadImageDraw[3] / overheadImageDraw[4], 887 / 1774, "Advanced Bipolar overhead imagery should preserve its native aspect ratio");

const timing = vm.runInContext(`({
  vessel: actionDuration("harmonic", zones.find((item) => item.id === "rightMidVein")),
  muscle: actionDuration("harmonic", zones.find((item) => item.id === "strapWindow")),
  isthmus: actionDuration("advancedBipolar", zones.find((item) => item.id === "isthmus")),
  monopolar: actionDuration("monopolar", zones.find((item) => item.id === "flapPlane")),
  bluntTwist: drawBluntSeparation({x: 540, y: 360}, 0.25)
})`, sandbox);
assert.equal(timing.vessel, 2500, "energy should dwell longer at a vessel contact");
assert.equal(timing.muscle, 1900, "muscle energy should use the longer cut duration");
assert.equal(timing.isthmus, 1900, "isthmus energy should use the longer cut duration");
assert.equal(timing.monopolar, 1700, "monopolar timing should use the slower duration");
assert(Math.abs(timing.bluntTwist) <= 0.16, "blunt dissector twist should remain controlled");

now = 2000;
const actionProgress = vm.runInContext(`(() => {
  state.action = { tool: "harmonic", targetId: "strapWindow", startedAt: 1000, duration: 2000 };
  const action = anatomyMotion().action;
  state.action = null;
  return { linear: action.linearProgress, eased: action.progress };
})()`, sandbox);
assert.equal(actionProgress.linear, 0.5, "energy cut passes should be timed from linear elapsed time");
assert.equal(actionProgress.eased, 0.5, "visual motion should remain eased independently");

now = 1750;
const forcepsRemoval = vm.runInContext(`(() => {
  state.removed = false;
  state.action = { tool: "forceps", targetId: "rightThyroid", startedAt: 1000, duration: 1000 };
  const removal = anatomyMotion().removal;
  state.action = null;
  return removal;
})()`, sandbox);
assert(forcepsRemoval > 0 && forcepsRemoval < 1, "the real thyroid specimen should move during the forceps action");
const forcepsRenderer = source.slice(source.indexOf('if(action.tool==="forceps")'), source.indexOf('if(action.tool==="suture")'));
assert(!forcepsRenderer.includes("ctx.ellipse"), "forceps removal should not draw a duplicate placeholder specimen");

const canvas = getElement("simCanvas");
assert.equal(typeof canvas.listeners.keydown?.[0], "function", "canvas should register a keyboard action handler");
vm.runInContext('resetSimulation(); state.tool = "scalpel"', sandbox);
let prevented = false;
canvas.listeners.keydown[0]({ key: "Enter", preventDefault() { prevented = true; } });
assert.equal(prevented, true, "keyboard activation should prevent page scrolling");
assert.equal(vm.runInContext("state.stage", sandbox), 0, "Enter should wait for the procedure animation");
assert.equal(vm.runInContext("state.action.targetId", sandbox), "incision", "keyboard activation should queue the current highlighted target");
vm.runInContext("finishAction()", sandbox);
assert.equal(vm.runInContext("state.stage", sandbox), 1, "Enter should commit after the procedure animation");

vm.runInContext('resetSimulation(); state.tool = "monopolar"; onAction(zones.find((zone) => zone.id === "incision"), { x: 540, y: 552 }); finishAction()', sandbox);
assert.equal(vm.runInContext("state.stage", sandbox), 1, "Monopolar Hook should complete the skin-incision step");
assert.equal(vm.runInContext("state.incisionProgress", sandbox), 2, "Monopolar Hook should open the skin layer");

now = 2000;
vm.runInContext(`
  state.stage = 2;
  state.tool = "harmonic";
  state.exposureProgress = 0;
  onAction(zones.find((zone) => zone.id === "strapWindow"), { x: 540, y: 330 });
`, sandbox);

const readState = () => vm.runInContext(`({
  stage: state.stage,
  completed: state.completed.has("strap"),
  activeTarget: state.action?.targetId,
  exposure: anatomyMotion().exposure
})`, sandbox);

const initial = readState();
assert.equal(initial.stage, 2, "one click should not advance before the animation finishes");
assert.equal(initial.completed, false, "strap should remain incomplete during the action animation");
assert.equal(initial.activeTarget, "strapWindow", "the selected action should stay queued during animation");
assert.equal(initial.exposure, 0, "muscles should remain closed before retraction commits");

now = 3200;
vm.runInContext("finishAction()", sandbox);
const committed = readState();
assert.equal(committed.stage, 3, "the stage should advance after the animation finishes");
assert.equal(committed.completed, true, "strap should complete after its animation");
assert(committed.exposure >= 0.04 && committed.exposure < 0.1, "muscles should begin retracting when the action commits");

now = 3750;
const midpoint = readState();
assert(midpoint.exposure > 0.4 && midpoint.exposure < 0.6, "muscles should be midway through separation after 550 ms");

now = 4400;
const final = readState();
assert.equal(final.exposure, 1, "muscles should be fully retracted after 1.1 seconds");

const act = (tool, zoneId, x, y) => {
  sandbox.__tool = tool;
  sandbox.__zoneId = zoneId;
  sandbox.__point = { x, y };
  vm.runInContext(`
    state.tool = __tool;
    if (state.tool === "harmonic" || state.tool === "advancedBipolar") state.heat = 0;
    onAction(zones.find((zone) => zone.id === __zoneId), __point);
    if (state.action) finishAction();
  `, sandbox);
};

vm.runInContext("resetSimulation()", sandbox);
act("retractor", "strapWindow", 540, 330);
assert.equal(vm.runInContext("state.stage", sandbox), 0, "wrong-step actions should not skip exposure stages");

act("scalpel", "rightRLN", 620, 330);
assert.equal(vm.runInContext("state.safety", sandbox), 86, "unsafe nerve contact should reduce safety before gating");
assert.equal(vm.runInContext("state.stage", sandbox), 0, "unsafe contact should not advance the workflow");

vm.runInContext(`
  resetSimulation();
  state.tool = "scalpel";
  onAction(zones.find((zone) => zone.id === "incision"), { x: 540, y: 560 });
  const firstAction = state.action;
  onAction(zones.find((zone) => zone.id === "incision"), { x: 540, y: 560 });
  globalThis.__sameAction = state.action === firstAction;
`, sandbox);
assert.equal(vm.runInContext("__sameAction", sandbox), true, "repeated clicks should not queue duplicate actions");
assert.equal(vm.runInContext("state.stage", sandbox), 0, "repeated clicks should not advance during animation");
vm.runInContext("finishAction()", sandbox);
assert.equal(vm.runInContext("state.stage", sandbox), 1, "one queued action should commit once");

vm.runInContext(`
  resetSimulation();
  state.tool = "scalpel";
  onAction(zones.find((zone) => zone.id === "incision"), { x: 540, y: 560 });
  resetSimulation();
`, sandbox);
assert.equal(vm.runInContext("state.action", sandbox), null, "reset should cancel an active procedure animation");
assert.equal(vm.runInContext("state.stage", sandbox), 0, "reset should restore the first stage");

vm.runInContext(`
  prefersReducedMotion = true;
  resetSimulation();
  state.tool = "scalpel";
  onAction(zones.find((zone) => zone.id === "incision"), { x: 540, y: 560 });
`, sandbox);
assert.equal(vm.runInContext("state.action", sandbox), null, "reduced motion should not leave an action queued");
assert.equal(vm.runInContext("state.stage", sandbox), 1, "reduced motion should still complete valid actions");
vm.runInContext("prefersReducedMotion = false", sandbox);

now = 5000;
const reducedAnatomyMotion = vm.runInContext(`(() => {
  prefersReducedMotion = true;
  state.startTime = 0;
  return anatomyMotion();
})()`, sandbox);
assert.equal(reducedAnatomyMotion.t, 0, "reduced motion should freeze continuous anatomy movement");
assert.equal(reducedAnatomyMotion.breath, 0, "reduced motion should stop breathing drift");
assert.equal(reducedAnatomyMotion.pulse, 0.5, "reduced motion should hold the pulse at its neutral frame");
const framesBeforeReducedLoop = animationFrameRequests;
vm.runInContext("animationLoop(performance.now())", sandbox);
assert.equal(animationFrameRequests, framesBeforeReducedLoop, "reduced motion should not perpetually reschedule canvas frames");

now = 6000;
const reducedTransitions = vm.runInContext(`(() => {
  state.skinOpenedAt = performance.now();
  state.fatClearedAt = performance.now();
  state.strapSeparatedAt = performance.now();
  state.removed = true;
  state.removedAt = performance.now();
  state.completed.add("close");
  state.stageChangedAt = performance.now();
  const motion = anatomyMotion();
  return { skinOpen: motion.skinOpen, fatClear: motion.fatClear, exposure: motion.exposure, removal: motion.removal, close: motion.close };
})()`, sandbox);
assert.deepEqual(reducedTransitions, { skinOpen: 1, fatClear: 1, exposure: 1, removal: 1, close: 1 }, "reduced motion should resolve staged anatomy transitions immediately");

let reducedPointerDraws = 0;
const originalClearRect = context2d.clearRect;
context2d.clearRect = () => { reducedPointerDraws += 1; };
canvas.listeners.mousemove[0]({ clientX: 540, clientY: 330 });
context2d.clearRect = originalClearRect;
assert.equal(reducedPointerDraws, 1, "reduced motion should redraw the instrument cursor when the pointer moves");

now = 12000;
const cooledHeat = vm.runInContext(`(() => {
  state.finished = false;
  state.action = null;
  state.lastFrame = 6000;
  state.heat = 5;
  state.tool = "inspect";
  onAction(zones[0], { x: 540, y: 330 });
  return state.heat;
})()`, sandbox);
assert(cooledHeat < 5, "reduced motion should cool accumulated heat before the next action");
vm.runInContext("prefersReducedMotion = false", sandbox);

vm.runInContext("resetSimulation()", sandbox);
act("scalpel", "incision", 540, 560);
act("monopolar", "flapPlane", 540, 540);
act("harmonic", "strapWindow", 540, 330);

const stageBeforeLanguageSwitch = vm.runInContext("state.stage", sandbox);
vm.runInContext("switchLanguage()", sandbox);
assert.equal(vm.runInContext("currentLang", sandbox), "zh", "language should switch to Chinese");
assert.equal(vm.runInContext("state.stage", sandbox), stageBeforeLanguageSwitch, "language switching should preserve the current stage");
assert.equal(vm.runInContext("state.completed.has('strap')", sandbox), true, "language switching should preserve completed steps");
vm.runInContext("switchLanguage()", sandbox);

act("advancedBipolar", "rightMidVein", 742, 340);
act("nerveProbe", "rightEBSLN", 710, 212);
act("advancedBipolar", "rightSupArt", 710, 218);
act("advancedBipolar", "rightSupVein", 724, 256);
act("nanocarbon", "rightThyroid", 650, 330);
act("dissector", "rightParaSup", 624, 258);
act("dissector", "rightParaInf", 684, 390);
act("nerveProbe", "rightRLN", 620, 330);
act("advancedBipolar", "rightInfArt", 650, 418);
act("advancedBipolar", "rightInfVein", 560, 526);
act("dissector", "berryLigament", 620, 330);
act("advancedBipolar", "isthmus", 548, 350);
act("forceps", "rightThyroid", 650, 330);
act("dissector", "delphianNodes", 548, 236);
act("dissector", "pretrachealNodes", 548, 474);
act("dissector", "rightParatrachealNodes", 650, 452);
act("advancedBipolar", "delphianNodes", 548, 236);
act("advancedBipolar", "pretrachealNodes", 548, 474);
act("advancedBipolar", "rightParatrachealNodes", 650, 452);
act("cautery", "bleed1", 742, 340);
act("suture", "incision", 540, 560);

assert.equal(vm.runInContext("state.finished", sandbox), true, "the complete valid workflow should reach the finish screen");
assert.equal(vm.runInContext("state.completed.has('close')", sandbox), true, "layered closure should be recorded as complete");
assert.equal(vm.runInContext("state.stage", sandbox), 15, "completion should remain on the final stage");

console.log("strap animation and full workflow behavior passed");
