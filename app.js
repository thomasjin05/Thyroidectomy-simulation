const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");
const toolGrid = document.getElementById("toolGrid");
const feedbackLog = document.getElementById("feedbackLog");
const checklist = document.getElementById("checklist");
const stageNumber = document.getElementById("stageNumber");
const safetyScore = document.getElementById("safetyScore");
const hemostasisScore = document.getElementById("hemostasisScore");
const stageTitle = document.getElementById("stageTitle");
const stageInstruction = document.getElementById("stageInstruction");
const resetButton = document.getElementById("resetButton");
const instrumentTitle = document.getElementById("instrumentTitle");
const instrumentBadge = document.getElementById("instrumentBadge");
const instrumentTechnique = document.getElementById("instrumentTechnique");
const completionScreen = document.getElementById("completionScreen");
const completionSafety = document.getElementById("completionSafety");
const completionHemostasis = document.getElementById("completionHemostasis");
const restartButton = document.getElementById("restartButton");

const tools = [
  { id: "inspect", name: "Inspect", icon: "i", use: "Hover/click to identify anatomy" },
  { id: "scalpel", name: "Scalpel", icon: "/", use: "Create the collar incision" },
  { id: "retractor", name: "Retractor", icon: "<", use: "Open exposure and separate strap muscles" },
  { id: "dissector", name: "Dissector", icon: "D", use: "Develop planes and expose structures" },
  { id: "nerveProbe", name: "Nerve Probe", icon: "N", use: "Confirm the recurrent laryngeal nerve" },
  { id: "clip", name: "Clip Applier", icon: "C", use: "Ligate named vessels close to the gland" },
  { id: "harmonic", name: "Harmonic Focus", icon: "H", use: "Seal/divide small vessels" },
  { id: "advancedBipolar", name: "Advanced Bipolar", icon: "L", use: "Bipolar vessel sealing with cooldown awareness" },
  { id: "monopolar", name: "Monopolar Hook", icon: "M", use: "Use only for superficial flap dissection" },
  { id: "cautery", name: "Bipolar Cautery", icon: "B", use: "Precise point hemostasis" },
  { id: "forceps", name: "Forceps", icon: "F", use: "Deliver the mobilized lobe" },
  { id: "suture", name: "Suture", icon: "U", use: "Close after hemostasis" }
];

const toolProfiles = {
  inspect: {
    badge: "Identify",
    color: "#147d8f",
    technique: "Start here. Build the anatomy map before operating: midline trachea, thyroid capsule, posterior parathyroids, vessels, and recurrent laryngeal nerve course.",
    controls: [
      { key: "labelMode", label: "Labels", type: "toggle", on: "On", off: "Off" },
      { key: "magnification", label: "Magnification", type: "range", min: 1, max: 3, step: 1, suffix: "x" }
    ]
  },
  scalpel: {
    badge: "Incise",
    color: "#4b5563",
    technique: "Make a shallow, controlled skin incision. Keep the blade on the planned collar incision before deeper exposure.",
    controls: [
      { key: "depth", label: "Blade depth", type: "range", min: 1, max: 3, step: 1, suffix: " mm" },
      { key: "stroke", label: "Stroke length", type: "select", options: ["Short", "Medium", "Long"] }
    ]
  },
  retractor: {
    badge: "Expose",
    color: "#147d8f",
    technique: "Use balanced traction to lift flaps and open the strap muscle midline window without compressing delicate structures.",
    controls: [
      { key: "traction", label: "Traction force", type: "range", min: 1, max: 4, step: 1, suffix: "" },
      { key: "side", label: "Direction", type: "select", options: ["Bilateral", "Left", "Right"] }
    ]
  },
  dissector: {
    badge: "Plane",
    color: "#7c5c2e",
    technique: "Use blunt capsular dissection. This tool is best for exposing parathyroids, opening tissue planes, and avoiding thermal spread.",
    controls: [
      { key: "pressure", label: "Tip pressure", type: "range", min: 1, max: 4, step: 1, suffix: "" },
      { key: "plane", label: "Plane", type: "select", options: ["Capsular", "Posterior", "Central compartment"] }
    ]
  },
  nerveProbe: {
    badge: "Signal",
    color: "#b59a00",
    technique: "Gently probe along the tracheoesophageal groove or superior-pole nerve target before vessel control.",
    controls: [
      { key: "sensitivity", label: "Sensitivity", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "audio", label: "Signal cue", type: "toggle", on: "Visible", off: "Muted" }
    ]
  },
  clip: {
    badge: "Ligate",
    color: "#6b7280",
    technique: "When mechanical control is needed, clip named vessels close to the capsule.",
    controls: [
      { key: "angle", label: "Clip angle", type: "range", min: -45, max: 45, step: 15, suffix: " deg" },
      { key: "clipSize", label: "Clip size", type: "select", options: ["Small", "Medium", "Large"] }
    ]
  },
  harmonic: {
    badge: "Ultrasonic",
    color: "#c77a1b",
    technique: "Harmonic Focus can seal and divide small vessels, but it must stay away from the RLN, EBSLN, and parathyroids. Use short activations and allow cooldown.",
    controls: [
      { key: "harmonicPower", label: "Power level", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "activation", label: "Activation", type: "select", options: ["Tap", "Short burst", "Long activation"] }
    ]
  },
  advancedBipolar: {
    badge: "Seal",
    color: "#8a4fb5",
    technique: "Advanced bipolar works well for sealing vessels in a dry, visible field. Let the jaws cool before approaching critical structures.",
    controls: [
      { key: "sealPower", label: "Seal power", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "jawWidth", label: "Jaw width", type: "select", options: ["Fine", "Standard", "Wide"] }
    ]
  },
  monopolar: {
    badge: "RF",
    color: "#b92f37",
    technique: "Monopolar energy is a modern tool, but not a casual one: use it only for superficial flaps or skin edges, not near the RLN, parathyroids, or superior-pole nerve.",
    controls: [
      { key: "monoPower", label: "Power", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "monoMode", label: "Mode", type: "select", options: ["Incise", "Blend", "Coag"] }
    ]
  },
  cautery: {
    badge: "Energy",
    color: "#b92f37",
    technique: "Focused bipolar energy is for bleeding points or vessel ends. Higher power is faster but riskier near the RLN or parathyroids.",
    controls: [
      { key: "power", label: "Power", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "mode", label: "Mode", type: "select", options: ["Coag", "Seal", "Spot"] }
    ]
  },
  forceps: {
    badge: "Traction",
    color: "#287a4b",
    technique: "After nerve mapping, vessel control, Berry ligament release, and isthmus division, use gentle traction to deliver the mobilized right lobe.",
    controls: [
      { key: "grip", label: "Grip force", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "tractionVector", label: "Traction vector", type: "select", options: ["Lateral", "Superior", "Anterior"] }
    ]
  },
  suture: {
    badge: "Close",
    color: "#0e5965",
    technique: "Suture only after the field is dry and the workflow has reached layered closure.",
    controls: [
      { key: "spacing", label: "Bite spacing", type: "range", min: 4, max: 12, step: 2, suffix: " mm" },
      { key: "layer", label: "Layer", type: "select", options: ["Skin", "Platysma", "Deep"] }
    ]
  }
};

const defaultSettings = {
  labelMode: true,
  magnification: 1,
  depth: 1,
  stroke: "Short",
  traction: 2,
  side: "Bilateral",
  pressure: 1,
  plane: "Capsular",
  sensitivity: 3,
  audio: true,
  angle: 0,
  clipSize: "Medium",
  harmonicPower: 3,
  activation: "Short burst",
  sealPower: 3,
  jawWidth: "Fine",
  monoPower: 2,
  monoMode: "Blend",
  power: 2,
  mode: "Coag",
  grip: 2,
  tractionVector: "Lateral",
  spacing: 8,
  layer: "Skin"
};

const stages = [
  {
    title: "Plan and Inspect Neck Anatomy",
    instruction: "Use Inspect to identify the larynx, trachea, thyroid lobes, nodule, parathyroids, central node regions, vessels, EBSLN, and RLN.",
    target: "inspect"
  },
  {
    title: "Create the Collar Incision",
    instruction: "Select Scalpel and incise along the marked low cervical line. Avoid cutting deep toward the thyroid or trachea.",
    target: "incision"
  },
  {
    title: "Raise Subplatysmal Flaps",
    instruction: "Use the Monopolar Hook in the flap plane for superficial energy-assisted flap elevation.",
    target: "flaps"
  },
  {
    title: "Open the Strap Muscle Midline",
    instruction: "Use Harmonic Focus in the strap muscle midline window for short, controlled energy-assisted separation. Retractors remain available as backup.",
    target: "strap"
  },
  {
    title: "Divide the Middle Thyroid Vein",
    instruction: "Use Harmonic Focus or Advanced Bipolar on the middle thyroid vein. The clip applier remains available for a traditional cold-instrument approach.",
    target: "middleVein"
  },
  {
    title: "Protect the EBSLN and Superior Pole",
    instruction: "Step 6A: use the Nerve Probe on the purple dashed EBSLN. Step 6B: use Harmonic Focus or Advanced Bipolar on the two capsular dashed targets; clips are available as backup.",
    target: "superiorPole"
  },
  {
    title: "Identify the Parathyroids",
    instruction: "Use the Dissector on the right superior and inferior parathyroids. Leave them in the thyroid bed with their blood supply.",
    target: "parathyroids"
  },
  {
    title: "Identify the Recurrent Laryngeal Nerve",
    instruction: "Before addressing the inferior pole and Berry ligament, use the Nerve Probe to confirm the right RLN in the tracheoesophageal groove.",
    target: "rln"
  },
  {
    title: "Mobilize the Inferior Pole",
    instruction: "After RLN identification, use Advanced Bipolar or Harmonic Focus on inferior thyroid artery branches and the inferior venous plexus while preserving parathyroid blood supply.",
    target: "inferiorPole"
  },
  {
    title: "Release Berry Ligament",
    instruction: "With the RLN visible, use the Dissector at Berry ligament to release the posteromedial thyroid from the trachea.",
    target: "berry"
  },
  {
    title: "Divide the Isthmus",
    instruction: "Use Harmonic Focus or Advanced Bipolar to divide the isthmus over the anterior trachea. Keep activation short and away from the airway.",
    target: "isthmus"
  },
  {
    title: "Remove the Right Lobe with Nodule",
    instruction: "After vessels, RLN, Berry ligament, and isthmus are addressed, use Forceps to grasp the freed right thyroid lobe.",
    target: "remove"
  },
  {
    title: "Mobilize Central Node Packets",
    instruction: "Use the Dissector to mobilize prelaryngeal, pretracheal, and right paratracheal node packets from the laryngeal/tracheal plane while protecting the RLN and parathyroids.",
    target: "centralNodes"
  },
  {
    title: "Seal and Clear Central Nodes",
    instruction: "Use Harmonic Focus or Advanced Bipolar on each mobilized node packet to control small lymphovascular pedicles and complete ipsilateral central compartment clearance.",
    target: "nodeClearance"
  },
  {
    title: "Final Hemostasis",
    instruction: "Use Bipolar Cautery or Advanced Bipolar only on bleeding points or vessel ends. Confirm the thyroid bed is dry before closure.",
    target: "hemostasis"
  },
  {
    title: "Layered Closure",
    instruction: "After hemostasis is complete, use Suture at the incision. This simplified model closes strap muscle, platysma, and skin layers.",
    target: "close"
  }
];

const initialState = () => ({
  tool: "inspect",
  stage: 0,
  safety: 100,
  bleeding: 0,
  startTime: performance.now(),
  lastFrame: performance.now(),
  stageChangedAt: performance.now(),
  removedAt: null,
  pointer: null,
  settings: { ...defaultSettings },
  heat: 0,
  inspected: new Set(),
  completed: new Set(),
  cauterized: new Set(),
  vesselsClipped: new Set(),
  nodalMobilized: new Set(),
  nodalCleared: new Set(),
  removed: false,
  finished: false,
  incisionProgress: 0,
  flapProgress: 0,
  exposureProgress: 0,
  messageCount: 0
});

let state = initialState();

const teachingNotes = {
  inspect: "Basic motion matters: the trachea moves subtly with respiration, and the thyroid moves with it because it is attached to the airway.",
  incision: "The skin incision opens, but deeper anatomy remains covered. Thyroidectomy is layered exposure, not a direct dive to the gland.",
  flaps: "In open surgery, superficial flaps can be raised with controlled monopolar energy while deeper anatomy stays protected.",
  strap: "Harmonic Focus can efficiently open the avascular midline raphe, but activations should be short and under direct vision.",
  middleVein: "The middle thyroid vein often tethers the lateral lobe; sealing it with Harmonic Focus or Advanced Bipolar before medial rotation is a common modern step.",
  superiorPole: "Close to the capsule means controlling terminal vessel branches on the thyroid surface, not high near the larynx. This lowers EBSLN injury risk.",
  parathyroids: "Parathyroids should be preserved in situ. The animation places and highlights them posteriorly so you can see how close they are to the thyroid capsule.",
  rln: "Identify the RLN before the inferior pole and Berry ligament because injury near the tracheoesophageal groove can affect vocal cord motion.",
  inferiorPole: "After locating the RLN, use Advanced Bipolar or ultrasonic energy on inferior pole branches while preserving parathyroid blood supply.",
  berry: "Berry ligament is a high-risk fixation point where thyroid tissue lies close to the RLN and trachea.",
  isthmus: "Modern surgery can use energy devices to divide the isthmus, but stay on thyroid tissue over the anterior trachea.",
  remove: "After capsular attachments and vessels are controlled, the right lobe rotates laterally and lifts out.",
  centralNodes: "In a node-positive teaching case, central compartment clearance should be handled as regional packets: prelaryngeal, pretracheal, and ipsilateral paratracheal packets mobilized with the RLN and parathyroid blood supply visible.",
  nodeClearance: "During central compartment clearance, control small lymphovascular pedicles rather than plucking individual nodes at random.",
  hemostasis: "A dry thyroid bed matters because postoperative neck hematoma can be dangerous.",
  close: "Close only after the field is dry. At the end of the case, the incision comes together."
};

const zones = [
  { id: "incision", type: "target", label: "Planned collar incision", x: 340, y: 544, w: 400, h: 34, note: "A low transverse cervical incision provides access to the thyroid bed." },
  { id: "larynx", type: "critical", label: "Larynx and thyroid cartilage", x: 486, y: 106, w: 126, h: 72, note: "The thyroid sits below the larynx and spans the lower larynx and upper trachea." },
  { id: "cricoid", type: "critical", label: "Cricoid cartilage", x: 498, y: 164, w: 102, h: 36, note: "The RLN usually enters the larynx near the cricothyroid joint, just below the cricoid region." },
  { id: "trachea", type: "critical", label: "Trachea", x: 500, y: 174, w: 96, h: 330, note: "The trachea is midline and lies deep to the thyroid isthmus." },
  { id: "esophagus", type: "landmark", label: "Esophagus / tracheoesophageal groove", x: 458, y: 214, w: 170, h: 300, note: "The RLN usually ascends in or near the tracheoesophageal groove before entering the larynx." },
  { id: "leftThyroid", type: "thyroid", label: "Left thyroid lobe", x: 352, y: 330, rx: 104, ry: 165, note: "The thyroid lobes wrap around the anterior and lateral trachea." },
  { id: "rightThyroid", type: "thyroid", label: "Right thyroid lobe with nodule", x: 650, y: 330, rx: 116, ry: 172, note: "The simulated nodule is in the right lobe, making this a right lobectomy case." },
  { id: "isthmus", type: "thyroid", label: "Thyroid isthmus", x: 456, y: 320, w: 190, h: 74, note: "The isthmus crosses the anterior tracheal rings below the cricoid." },
  { id: "nodule", type: "thyroid", label: "Thyroid nodule", x: 684, y: 310, r: 42, note: "A suspicious nodule is a common indication for diagnostic lobectomy." },
  { id: "delphianNodes", type: "lymph", label: "Prelaryngeal node packet", x: 548, y: 236, rx: 42, ry: 28, note: "Prelaryngeal nodes sit above the isthmus near the laryngeal midline and belong to the central compartment." },
  { id: "pretrachealNodes", type: "lymph", label: "Pretracheal node packet", x: 548, y: 474, rx: 54, ry: 48, note: "Pretracheal lymphatic tissue lies in the pretracheal plane and is part of level VI central compartment clearance." },
  { id: "rightParatrachealNodes", type: "lymph", label: "Right paratracheal node packet", x: 650, y: 452, rx: 52, ry: 82, note: "Ipsilateral paratracheal tissue is cleared beside the trachea while protecting the right RLN and parathyroid blood supply." },
  { id: "flapPlane", type: "target", label: "Subplatysmal flap plane", x: 304, y: 500, w: 470, h: 88, note: "Subplatysmal flaps are raised superiorly and inferiorly from the collar incision." },
  { id: "strapWindow", type: "target", label: "Strap muscle midline window", x: 420, y: 150, w: 250, h: 385, note: "Retracting the strap muscles exposes the thyroid capsule." },
  { id: "berryLigament", type: "landmark", label: "Berry ligament", x: 594, y: 280, w: 58, h: 104, note: "Berry ligament anchors the posteromedial thyroid to the trachea, where the RLN is at higher risk." },
  { id: "zuckerkandl", type: "landmark", label: "Zuckerkandl tubercle", x: 610, y: 285, r: 18, note: "This posterior thyroid tubercle is an important landmark near the RLN and superior parathyroid." },
  { id: "leftParaSup", type: "parathyroid", label: "Left superior parathyroid", x: 430, y: 258, r: 15, note: "The superior parathyroid usually sits posteriorly near the upper two-thirds of the thyroid, often behind the RLN plane." },
  { id: "leftParaInf", type: "parathyroid", label: "Left inferior parathyroid", x: 426, y: 414, r: 14, note: "The inferior parathyroid is more variable and may sit lower or near the thymus; preservation depends on gentle handling and blood supply." },
  { id: "rightParaSup", type: "parathyroid", label: "Right superior parathyroid", x: 624, y: 258, r: 15, note: "The superior parathyroid often lies posteriorly near the crossing of the RLN and inferior thyroid artery." },
  { id: "rightParaInf", type: "parathyroid", label: "Right inferior parathyroid", x: 684, y: 390, r: 14, note: "Inferior parathyroid position varies; this schematic places the right inferior gland lateral to the RLN and above inferior thyroid artery branches for clarity." },
  { id: "leftRLN", type: "nerve", label: "Left recurrent laryngeal nerve", path: [[472, 532], [458, 438], [456, 326], [474, 190]], note: "The left RLN usually loops under the aortic arch and ascends in the tracheoesophageal groove." },
  { id: "rightRLN", type: "nerve", label: "Right recurrent laryngeal nerve", path: [[628, 532], [622, 432], [620, 330], [604, 190]], note: "The right RLN usually loops under the subclavian artery and may run more obliquely; rare nonrecurrent variants exist." },
  { id: "rightEBSLN", type: "nerve", label: "External branch of superior laryngeal nerve", path: [[744, 126], [724, 166], [710, 212]], note: "The EBSLN runs near superior pole vessels; injury can affect pitch and voice projection." },
  { id: "leftEBSLN", type: "nerve", label: "Left external branch of superior laryngeal nerve", path: [[358, 126], [376, 166], [394, 216]], note: "Protect the EBSLN while controlling superior pole vessels; injury can affect pitch and voice projection." },
  { id: "rightSupArt", type: "artery", label: "Right superior thyroid artery", path: [[782, 146], [710, 218]], note: "Superior thyroid vessels run to the superior pole; EBSLN risk makes superior pole control delicate." },
  { id: "rightInfArt", type: "artery", label: "Right inferior thyroid artery branches", path: [[786, 456], [650, 418]], note: "The inferior thyroid artery has variable relationships with the RLN and supplies parathyroid branches, so it requires careful handling." },
  { id: "rightSupVein", type: "vein", label: "Right superior thyroid vein", path: [[815, 188], [724, 256]], note: "Venous bleeding can obscure nerves and parathyroids." },
  { id: "rightMidVein", type: "vein", label: "Middle thyroid vein", path: [[812, 332], [742, 340]], note: "The middle thyroid vein often needs control and division during mobilization." },
  { id: "rightInfVein", type: "vein", label: "Inferior thyroid venous plexus", path: [[688, 514], [560, 526], [430, 514]], note: "Inferior thyroid veins drain into a midline venous plexus and may bleed during inferior pole work." },
  { id: "rightCarotid", type: "critical", label: "Right common carotid artery", path: [[850, 128], [844, 536]], note: "The carotid sheath forms the lateral boundary of the field." },
  { id: "rightIJV", type: "critical", label: "Right internal jugular vein", path: [[902, 130], [898, 536]], note: "The internal jugular vein lies lateral in the carotid sheath and is outside routine capsular dissection." },
  { id: "leftCarotid", type: "critical", label: "Left common carotid artery", path: [[230, 128], [236, 536]], note: "The carotid sheath lies lateral to the thyroid lobe." },
  { id: "leftIJV", type: "critical", label: "Left internal jugular vein", path: [[178, 130], [182, 536]], note: "The internal jugular vein is a lateral boundary and should remain outside capsular thyroid dissection." },
  { id: "bleed1", type: "bleed", label: "Bleeding point", x: 742, y: 340, r: 18, note: "Keep the field clear and control bleeding to operate safely." }
];

function hitZone(point) {
  const matches = [...zones].reverse().filter((zone) => contains(zone, point.x, point.y));
  if (state.tool !== "inspect") {
    const currentTargets = targetZoneIds();
    const currentMatch = matches.find((zone) => currentTargets.includes(zone.id));
    if (currentMatch) return currentMatch;
  }
  return matches[0];
}

function targetZoneIds(target = stages[state.stage].target) {
  if (target === "superiorPole") {
    if (!state.completed.has("rightEBSLN")) return ["rightEBSLN"];
    if (!state.vesselsClipped.has("rightSupArt")) return ["rightSupArt"];
    if (!state.vesselsClipped.has("rightSupVein")) return ["rightSupVein"];
    return ["rightEBSLN", "rightSupArt", "rightSupVein"];
  }

  return {
    incision: ["incision"],
    flaps: ["flapPlane"],
    strap: ["strapWindow"],
    middleVein: ["rightMidVein"],
    parathyroids: ["rightParaSup", "rightParaInf"],
    rln: ["rightRLN"],
    inferiorPole: ["rightInfArt", "rightInfVein"],
    berry: ["berryLigament", "zuckerkandl", "rightRLN"],
    isthmus: ["isthmus"],
    remove: ["rightThyroid", "nodule"],
    centralNodes: ["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"],
    nodeClearance: ["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"],
    hemostasis: ["bleed1", "rightSupArt", "rightInfArt", "rightSupVein", "rightMidVein", "rightInfVein"],
    close: ["incision"]
  }[target] || [];
}

function contains(zone, x, y) {
  if (zone.path) return distanceToPath(zone.path, x, y) < 18;
  if (zone.r) return Math.hypot(zone.x - x, zone.y - y) <= zone.r;
  if (zone.rx) return (((x - zone.x) ** 2) / (zone.rx ** 2)) + (((y - zone.y) ** 2) / (zone.ry ** 2)) <= 1;
  return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
}

function distanceToPath(path, x, y) {
  let min = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
    min = Math.min(min, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
  }
  return min;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    sx: event.clientX - rect.left,
    sy: event.clientY - rect.top
  };
}

function addLog(text, tone = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${tone}`;
  entry.textContent = text;
  feedbackLog.prepend(entry);
  state.messageCount += 1;
  while (feedbackLog.children.length > 8) feedbackLog.lastChild.remove();
}

function selectTool(id) {
  state.tool = id;
  tooltip.hidden = true;
  renderTools();
  renderInstrumentPanel();
  draw();
}

function renderTools() {
  toolGrid.innerHTML = "";
  tools.forEach((tool) => {
    const button = document.createElement("button");
    button.className = "tool-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.tool === tool.id));
    button.title = tool.use;
    button.innerHTML = `
      <span class="tool-icon">${tool.icon}</span>
      <span><span class="tool-name">${tool.name}</span><span class="tool-use">${tool.use}</span></span>
    `;
    button.addEventListener("click", () => selectTool(tool.id));
    toolGrid.appendChild(button);
  });
}

function renderInstrumentPanel() {
  const tool = tools.find((item) => item.id === state.tool);
  const profile = toolProfiles[state.tool];
  instrumentTitle.textContent = tool.name;
  instrumentBadge.textContent = profile.badge;
  instrumentBadge.style.background = profile.color;
  instrumentTechnique.textContent = profile.technique;
}

function renderStatus() {
  const stage = stages[state.stage];
  stageNumber.textContent = `${state.stage + 1} / ${stages.length}`;
  safetyScore.textContent = String(Math.max(0, state.safety));
  safetyScore.style.color = state.safety > 80 ? "var(--ok)" : state.safety > 55 ? "var(--warn)" : "var(--danger)";
  hemostasisScore.textContent = state.bleeding === 0 ? "Stable" : state.bleeding < 3 ? "Oozing" : "Bleeding";
  hemostasisScore.style.color = state.bleeding === 0 ? "var(--ok)" : state.bleeding < 3 ? "var(--warn)" : "var(--danger)";
  stageTitle.textContent = stage.title;
  stageInstruction.textContent = stage.instruction;

  checklist.innerHTML = "";
  stages.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = index < state.stage || state.completed.has(item.target) ? "done" : "";
    li.textContent = item.title;
    checklist.appendChild(li);
  });
}

function renderCompletionScreen() {
  completionScreen.hidden = !state.finished;
  if (!state.finished) return;
  completionSafety.textContent = String(Math.max(0, state.safety));
  completionHemostasis.textContent = state.bleeding === 0 ? "Stable" : state.bleeding < 3 ? "Oozing" : "Bleeding";
}

function advance(target) {
  state.completed.add(target);
  const current = stages[state.stage];
  if (current.target === target && state.stage < stages.length - 1) {
    state.stage += 1;
    state.stageChangedAt = performance.now();
    addLog(`Objective complete: ${current.title}.`, "success");
    addLog(teachingNotes[target]);
  } else if (current.target === target) {
    state.stageChangedAt = performance.now();
    state.finished = true;
    addLog("Simulation complete. The lobe is removed, hemostasis is controlled, and the incision is closed.", "success");
    addLog(teachingNotes[target]);
  }
  renderStatus();
  renderCompletionScreen();
}

function resetSimulation() {
  state = initialState();
  feedbackLog.innerHTML = "";
  addLog("Simulation reset. Start by inspecting the major anatomy landmarks.");
  renderTools();
  renderInstrumentPanel();
  renderStatus();
  renderCompletionScreen();
  draw();
}

function penalize(amount, text, extraBleeding = 0) {
  state.safety = Math.max(0, state.safety - amount);
  state.bleeding += extraBleeding;
  addLog(text, amount >= 10 ? "danger" : "warning");
  renderStatus();
}

function onAction(zone, point) {
  if (state.finished) return;

  if (!zone) {
    addLog("No key structure there. Try clicking the highlighted anatomy target.", "warning");
    return;
  }

  if (stages[state.stage].target === "superiorPole") {
    if (!state.completed.has("rightEBSLN") && state.tool !== "nerveProbe") {
      addLog("First complete step 6A: select Nerve Probe and click the purple dashed EBSLN above the superior pole. Do not clip vessels yet.", "warning");
      return;
    }
    const superiorEnergyTools = ["clip", "harmonic", "advancedBipolar"];
    if (state.completed.has("rightEBSLN") && !superiorEnergyTools.includes(state.tool) && !["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) {
      addLog("Next is 6B: select Clip Applier, Harmonic Focus, or Advanced Bipolar, then click the dashed circles beside the red superior artery and blue superior vein.", "warning");
      return;
    }
  }

  if (state.tool === "inspect") {
    state.inspected.add(zone.id);
    addLog(`${zone.label}: ${zone.note}`);
    if (state.stage === 0 && state.inspected.size >= 8) advance("inspect");
    return;
  }

  if (["nerve", "parathyroid"].includes(zone.type) && !["inspect", "nerveProbe", "dissector"].includes(state.tool)) {
    penalize(14, `Unsafe contact: ${zone.label}. Protect nerves and parathyroids during thyroid mobilization.`);
    return;
  }

  if (zone.type === "critical" && state.tool !== "inspect") {
    penalize(12, `${zone.label} is outside the safe capsular thyroid dissection plane in this model.`);
    return;
  }

  if (state.tool === "scalpel") {
    if (zone.id === "incision") {
      const depth = state.settings.depth;
      state.incisionProgress += depth >= 3 ? 1.25 : 1;
      addLog(depth >= 3 ? "A deeper blade opens the incision quickly. Do not use this depth near deeper anatomy." : "The collar incision has been extended along the planned skin line.");
      if (state.incisionProgress >= 2) advance("incision");
    } else if (zone.id === "isthmus" && stages[state.stage].target === "isthmus") {
      state.completed.add("isthmus");
      addLog("After right lobe mobilization, the isthmus is divided over the anterior trachea.", "success");
      advance("isthmus");
    } else {
      const penalty = state.settings.depth >= 3 ? 13 : 8;
      penalize(penalty, "In this simplified step, the scalpel should stay on the marked skin incision line.", zone.type === "vein" ? 1 : 0);
    }
  }

  if (state.tool === "retractor") {
    if (zone.id === "flapPlane") {
      const traction = state.settings.traction;
      state.flapProgress += traction >= 3 ? 1.1 : 0.75;
      addLog("Subplatysmal flaps have been raised from the collar incision, creating operative exposure.", "success");
      if (state.flapProgress >= 2) advance("flaps");
    } else if (zone.id === "strapWindow") {
      const traction = state.settings.traction;
      state.exposureProgress += traction >= 3 ? 1.15 : 0.8;
      if (traction >= 4) state.safety = Math.max(0, state.safety - 3);
      addLog(traction >= 4 ? "Strong traction opened the strap muscle window, but excessive traction can pull adjacent tissue." : "The strap muscles are separated in the midline and the thyroid capsule is exposed.", "success");
      if (state.exposureProgress >= 1) advance("strap");
    } else {
      addLog("Use retractors first in the flap plane, then in the strap muscle midline window.", "warning");
    }
  }

  if (state.tool === "monopolar") {
    if (zone.id === "flapPlane" || zone.id === "incision") {
      addLog(`Monopolar ${state.settings.monoMode} mode used superficially at power ${state.settings.monoPower}.`, "success");
      if (zone.id === "flapPlane") {
        state.flapProgress += 1.1;
        if (state.flapProgress >= 2) advance("flaps");
      }
    } else {
      penalize(10 + state.settings.monoPower, "In this simulation, monopolar energy spreads too much heat for deep thyroid-bed targets. Use Harmonic Focus, Advanced Bipolar, Clip Applier, or cold dissection instead.", 1);
    }
  }

  if (state.tool === "dissector") {
    if (zone.type === "parathyroid") {
      if (state.settings.pressure >= 4) {
        penalize(5, "Too much dissector pressure near a parathyroid risks devascularization. Be gentler.");
      }
      state.completed.add(zone.id);
      addLog(`${zone.label} identified and preserved. Note its posterior position and fragile blood supply.`, "success");
      const found = ["rightParaSup", "rightParaInf"].every((id) => state.completed.has(id));
      if (found) advance("parathyroids");
    } else if (zone.type === "lymph") {
      if (stages[state.stage].target !== "centralNodes") {
        addLog("In this teaching workflow, central lymphatic tissue is handled after thyroid mobilization and specimen removal.", "warning");
      } else if (!state.removed) {
        addLog("Remove the right lobe first so the central compartment plane is clearly visible.", "warning");
      } else {
        state.nodalMobilized.add(zone.id);
        addLog(`${zone.label} mobilized as a node packet. Avoid traction on the RLN and preserve parathyroid perfusion.`, "success");
        if (["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id) => state.nodalMobilized.has(id))) {
          advance("centralNodes");
        }
      }
    } else if (zone.id === "berryLigament") {
      if (!state.completed.has("rightRLN")) {
        penalize(12, "Release Berry ligament only after the right RLN has been identified and kept visible.");
      } else {
        state.completed.add("berry");
        addLog("Berry ligament released while protecting the RLN in the tracheoesophageal groove.", "success");
        advance("berry");
      }
    } else if (zone.id === "isthmus") {
      state.completed.add("isthmus");
      addLog("The isthmus is divided over the anterior trachea, separating the right lobe from the left thyroid.", "success");
      advance("isthmus");
    } else if (zone.type === "thyroid") {
      addLog("A capsular dissection plane has been developed around the thyroid lobe.");
    } else {
      addLog("Before dividing vessels, use blunt dissection to expose the small posterior parathyroids.", "warning");
    }
  }

  if (state.tool === "nerveProbe") {
    if (zone.type === "nerve") {
      if (stages[state.stage].target === "superiorPole" && zone.id !== "rightEBSLN") {
        addLog("For step 6A, click the purple dashed EBSLN above the right superior pole, not the RLN.", "warning");
        renderStatus();
        draw();
        return;
      }
      state.completed.add(zone.id);
      addLog(`${zone.label} mapped at sensitivity ${state.settings.sensitivity}. Keep it visible before clipping vessels or applying traction.`, "success");
      if (zone.id === "rightEBSLN" && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
      if (zone.id === "rightRLN") advance("rln");
    } else {
      addLog("The nerve probe is used to find the right RLN in the tracheoesophageal groove and the EBSLN near the superior pole.", "warning");
    }
  }

  if (state.tool === "harmonic" || state.tool === "advancedBipolar") {
    handleEnergyDevice(zone, point);
  }

  if (state.tool === "clip") {
    if (["artery", "vein"].includes(zone.type)) {
      if (stages[state.stage].target === "superiorPole" && !["rightSupArt", "rightSupVein"].includes(zone.id)) {
        addLog("Step 6B clips only the superior thyroid artery and vein at the capsular dashed circles.", "warning");
        renderStatus();
        draw();
        return;
      }
      if (zone.id === "rightMidVein") {
        state.vesselsClipped.add(zone.id);
        addLog("The middle thyroid vein is clipped and divided, allowing medial mobilization of the right lobe.", "success");
        advance("middleVein");
        renderStatus();
        draw();
        return;
      }
      if (["rightInfArt", "rightInfVein"].includes(zone.id) && !state.completed.has("rightRLN")) {
        penalize(10, "Placing clips before identifying the right RLN increases nerve injury risk.", 1);
      }
      if (["rightSupArt", "rightSupVein"].includes(zone.id) && !state.completed.has("rightEBSLN")) {
        penalize(7, "Clipping superior pole vessels before identifying the EBSLN may affect pitch and voice projection.", 0);
      }
      if (["rightSupArt", "rightSupVein"].includes(zone.id) && !nearSuperiorCapsule(point, zone.id)) {
        addLog("Close to the capsule means controlling superior pole vessels near the lower end of the thyroid superior pole, not high or lateral near their origin. Click the highlighted circles beside the thyroid.", "warning");
        renderStatus();
        draw();
        return;
      }
      state.vesselsClipped.add(zone.id);
      addLog(`${zone.label} clipped close to the thyroid capsule with a ${state.settings.clipSize} clip at ${state.settings.angle} degrees.`, "success");
      if (state.completed.has("rightEBSLN") && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
      if (["rightInfArt", "rightInfVein"].every((id) => state.vesselsClipped.has(id))) advance("inferiorPole");
    } else {
      penalize(7, "The clip applier is for named vessels, not gland, nerve, airway, or parathyroid tissue.");
    }
  }

  if (state.tool === "forceps") {
    if (zone.id === "rightThyroid" || zone.id === "nodule") {
      if (!["middleVein", "superiorPole", "parathyroids", "rln", "inferiorPole", "berry", "isthmus"].every((id) => state.completed.has(id))) {
        penalize(12, "You must complete the proper mobilization sequence before removing the lobe.", 2);
      } else {
        if (state.settings.grip >= 5) state.safety = Math.max(0, state.safety - 4);
        state.removed = true;
        state.removedAt = performance.now();
        advance("remove");
      }
    } else {
      addLog("Forceps should grasp the mobilized right thyroid lobe, not protected structures.", "warning");
    }
  }

  if (state.tool === "cautery") {
    if (zone.type === "bleed" || ["artery", "vein"].includes(zone.type)) {
      state.bleeding = Math.max(0, state.bleeding - Math.max(1, Math.ceil(state.settings.power / 2)));
      state.cauterized.add(zone.id);
      state.heat = Math.min(5, state.heat + state.settings.power);
      addLog(`Bleeding controlled with ${state.settings.mode} energy at power ${state.settings.power}.`, "success");
      if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) advance("hemostasis");
      if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) addLog("The field is dry. Use Suture to close the incision.", "success");
    } else if (zone.type === "nerve" || zone.type === "parathyroid") {
      penalize(12 + state.settings.power, "Thermal spread near nerves or parathyroids is dangerous. Use focused energy carefully.");
    } else {
      addLog("Cautery is best for bleeding points and vessel ends.", "warning");
    }
  }

  if (state.tool === "suture") {
    if (stages[state.stage].target === "close" && state.bleeding === 0 && zone.id === "incision") {
      advance("close");
    } else {
      addLog("Close along the incision line only after specimen removal and hemostasis.", "warning");
    }
  }

  renderStatus();
  draw();
}

function handleEnergyDevice(zone, point) {
  const isHarmonic = state.tool === "harmonic";
  const name = isHarmonic ? "Harmonic Focus" : "Advanced Bipolar";
  const power = isHarmonic ? state.settings.harmonicPower : state.settings.sealPower;
  const activationRisk = isHarmonic && state.settings.activation === "Long activation" ? 2 : 0;

  if (["nerve", "parathyroid"].includes(zone.type)) {
    penalize(16 + power + activationRisk, `${name} activation is too close to ${zone.label}. Energy devices near the RLN and parathyroids require visible safe distance and cooldown.`);
    return;
  }

  if (zone.type === "critical") {
    penalize(14 + power, `${name} should not be used on ${zone.label}. Energy should stay on the thyroid capsule or vessel plane.`);
    return;
  }

  state.heat = Math.min(6, state.heat + power + activationRisk);

  if (state.heat > 5) {
    penalize(5, "Thermal load is high. Pause and let the device cool before approaching nerves or parathyroids.");
  }

  if (zone.id === "strapWindow") {
    state.exposureProgress += isHarmonic ? 0.9 : 0.65;
    addLog(`${name} opened the avascular strap muscle midline plane with short, controlled activation.`, "success");
    if (state.exposureProgress >= 1) advance("strap");
    return;
  }

  if (zone.id === "flapPlane" && isHarmonic) {
    state.flapProgress += 0.8;
    addLog(`${name} assisted superficial flap elevation; in this simulation, broad superficial planes usually use monopolar hook.`, "success");
    if (state.flapProgress >= 2) advance("flaps");
    return;
  }

  if (zone.type === "lymph") {
    if (stages[state.stage].target !== "nodeClearance") {
      addLog(`Before cold dissection mobilizes the node packet, ${name} should not divide central compartment lymphatic tissue.`, "warning");
      return;
    }
    if (!state.nodalMobilized.has(zone.id)) {
      addLog(`First use the Dissector to mobilize ${zone.label}; activate energy only after the lymphovascular pedicle is clearly visible.`, "warning");
      return;
    }

    state.nodalCleared.add(zone.id);
    addLog(`${name} sealed small lymphovascular pedicles and cleared ${zone.label} from the central compartment.`, "success");
    if (["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id) => state.nodalCleared.has(id))) {
      advance("nodeClearance");
    }
    return;
  }

  if (["rightMidVein", "rightSupArt", "rightSupVein", "rightInfArt", "rightInfVein"].includes(zone.id)) {
    if (["rightSupArt", "rightSupVein"].includes(zone.id)) {
      if (!state.completed.has("rightEBSLN")) {
        penalize(10, `Before identifying the EBSLN, ${name} near superior pole vessels increases voice-related nerve injury risk.`);
        return;
      }
      if (!nearSuperiorCapsule(point, zone.id)) {
        addLog(`${name} should seal superior pole vessels at the capsular circles, not high near the EBSLN.`, "warning");
        return;
      }
    }
    if (["rightInfArt", "rightInfVein"].includes(zone.id) && !state.completed.has("rightRLN")) {
      penalize(12, `Before identifying the RLN, ${name} near inferior pole vessels creates thermal nerve injury risk.`);
      return;
    }

    state.vesselsClipped.add(zone.id);
    addLog(`${name} sealed and divided ${zone.label}.`, "success");
    if (zone.id === "rightMidVein") advance("middleVein");
    if (state.completed.has("rightEBSLN") && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
    if (["rightInfArt", "rightInfVein"].every((id) => state.vesselsClipped.has(id))) advance("inferiorPole");
    return;
  }

  if (zone.id === "berryLigament" || zone.id === "isthmus") {
    if (zone.id === "isthmus") {
      state.completed.add("isthmus");
      addLog(`${name} divided the isthmus with short activation over the anterior tracheal plane.`, "success");
      advance("isthmus");
      return;
    }
    addLog(`${name} can be used, but this teaching mode uses cold dissection at Berry ligament because the RLN and trachea are close.`, "warning");
    return;
  }

  if (zone.type === "bleed") {
    state.bleeding = Math.max(0, state.bleeding - (isHarmonic ? 1 : 2));
    addLog(`${name} controlled the bleeding point; use short activation near critical anatomy.`, "success");
    if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) advance("hemostasis");
    return;
  }

  addLog(`${name} is best for vessel targets or avascular planes. Identify anatomy before activating energy.`, "warning");
}

function nearSuperiorCapsule(point, vesselId) {
  if (!point) return true;
  const target = vesselId === "rightSupArt" ? { x: 710, y: 218 } : { x: 724, y: 256 };
  return Math.hypot(point.x - target.x, point.y - target.y) < 54;
}

function drawPath(path, color, width, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.setLineDash(dash);
  ctx.beginPath();
  path.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.stroke();
  ctx.restore();
}

function drawLabel(text, x, y, align = "center") {
  ctx.save();
  ctx.font = "700 16px Inter, sans-serif";
  ctx.textAlign = align;
  ctx.fillStyle = "#1c2a31";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function ease(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function phase() {
  return (performance.now() - state.startTime) / 1000;
}

function anatomyMotion() {
  const t = phase();
  const breath = Math.sin(t * 2.1) * 4;
  const pulse = (Math.sin(t * 5.6) + 1) / 2;
  const incision = ease(state.incisionProgress / 2);
  const flaps = ease(state.flapProgress / 2);
  const exposure = ease(state.exposureProgress);
  const parathyroidReveal = ease(["parathyroids", "rln", "inferiorPole", "berry", "isthmus", "remove", "centralNodes", "nodeClearance", "hemostasis", "close"].includes(stages[state.stage].target) || state.completed.has("parathyroids") ? 1 : exposure * 0.5);
  const nerveReveal = ease(state.completed.has("leftRLN") || state.completed.has("rightRLN") || state.stage >= 4 ? 1 : exposure * 0.45);
  const vesselControl = ease(state.vesselsClipped.size / 4);
  const removal = state.removed ? ease((performance.now() - state.removedAt) / 1200) : 0;
  const close = state.completed.has("close") ? ease((performance.now() - state.stageChangedAt) / 1000) : 0;
  return { t, breath, pulse, incision, flaps, exposure, parathyroidReveal, nerveReveal, vesselControl, removal, close };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const motion = anatomyMotion();
  drawBackground(motion);
  drawAnatomy(motion);
  drawStrapMuscles(motion);
  drawHighlights(motion);
  drawTeachingOverlay(motion);
  drawToolCursor(motion);
}

function drawBackground(motion) {
  ctx.fillStyle = "#f2d7cd";
  roundRect(190, 74, 700, 560, 80);
  ctx.fill();

  ctx.fillStyle = "rgba(140, 71, 62, 0.14)";
  roundRect(250, 128, 580, 452, 60);
  ctx.fill();

  ctx.strokeStyle = "#b06b63";
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 10]);
  roundRect(340, 544, 400, 34, 16);
  ctx.stroke();
  ctx.setLineDash([]);

  if (motion.incision > 0) {
    const open = 16 + motion.incision * 36 - motion.close * 34;
    const width = 110 + motion.incision * 300 - motion.close * 280;
    const x = 540 - width / 2;
    ctx.fillStyle = "#8f3c40";
    roundRect(x, 552 - open / 2, width, Math.max(4, open), 20);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 210, 190, 0.48)";
    roundRect(x + 18, 552 - open / 4, width - 36, Math.max(3, open / 2), 14);
    ctx.fill();
  }

  if (motion.flaps > 0) {
    ctx.save();
    ctx.globalAlpha = motion.flaps * 0.75;
    ctx.strokeStyle = "rgba(255, 245, 230, 0.95)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(338, 510 - motion.flaps * 120);
    ctx.quadraticCurveTo(540, 470 - motion.flaps * 72, 742, 510 - motion.flaps * 120);
    ctx.moveTo(338, 586 + motion.flaps * 54);
    ctx.quadraticCurveTo(540, 626 + motion.flaps * 24, 742, 586 + motion.flaps * 54);
    ctx.stroke();
    ctx.restore();
  }
}

function drawStrapMuscles(motion) {
  const center = 540;
  const gap = 8 + motion.exposure * 260;
  const width = 172 - motion.exposure * 45;
  const lateralSlide = motion.exposure * 110;
  const fade = 0.98 - motion.exposure * 0.62;
  ctx.save();
  ctx.globalAlpha = fade;
  const gradientLeft = ctx.createLinearGradient(center - gap - width, 128, center - gap, 538);
  gradientLeft.addColorStop(0, "#cf807b");
  gradientLeft.addColorStop(0.55, "#b96061");
  gradientLeft.addColorStop(1, "#9d4e54");
  ctx.fillStyle = gradientLeft;
  roundRect(center - gap - width - lateralSlide, 126, width, 414, 48);
  ctx.fill();

  const gradientRight = ctx.createLinearGradient(center + gap, 128, center + gap + width, 538);
  gradientRight.addColorStop(0, "#cf807b");
  gradientRight.addColorStop(0.55, "#b96061");
  gradientRight.addColorStop(1, "#9d4e54");
  ctx.fillStyle = gradientRight;
  roundRect(center + gap + lateralSlide, 126, width, 414, 48);
  ctx.fill();

  ctx.strokeStyle = "rgba(91, 37, 43, 0.38)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - gap - lateralSlide, 152);
  ctx.lineTo(center - gap - lateralSlide, 518);
  ctx.moveTo(center + gap + lateralSlide, 152);
  ctx.lineTo(center + gap + lateralSlide, 518);
  ctx.stroke();
  ctx.restore();

  if (motion.exposure < 0.25) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "rgba(255, 231, 218, 0.78)";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(center, 138);
    ctx.lineTo(center, 532);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    roundRect(404, 132, 272, 34, 8);
    ctx.fill();
    ctx.fillStyle = "#7b353d";
    ctx.font = "800 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Strap muscles cover thyroid before separation", center, 154);
    ctx.restore();
  }

  if (motion.exposure > 0.05) {
    ctx.save();
    ctx.strokeStyle = "rgba(20, 125, 143, 0.62)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(438, 236);
    ctx.lineTo(438 - motion.exposure * 82, 210);
    ctx.moveTo(642, 236);
    ctx.lineTo(642 + motion.exposure * 82, 210);
    ctx.stroke();
    ctx.fillStyle = "rgba(20, 125, 143, 0.72)";
    ctx.font = "700 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Retracted strap muscles", 540, 118);
    ctx.restore();
  }
}

function drawAnatomy(motion) {
  ctx.save();
  const bodyY = motion.breath;
  drawDeepLandmarks(bodyY, motion);
  ctx.fillStyle = "#b9d9e9";
  roundRect(500, 174 + bodyY, 96, 330, 40);
  ctx.fill();
  ctx.strokeStyle = "rgba(28, 75, 94, 0.35)";
  ctx.lineWidth = 2;
  for (let y = 202; y < 482; y += 34) {
    ctx.beginPath();
    ctx.moveTo(512, y + bodyY);
    ctx.quadraticCurveTo(548, y + 14 + bodyY, 584, y + bodyY);
    ctx.stroke();
  }
  drawLabel("Trachea", 548, 164 + bodyY);
  drawLarynx(bodyY);

  if (!state.removed || motion.removal < 1) {
    const liftX = motion.removal * 210;
    const liftY = -motion.removal * 110;
    const rotate = -0.08 + motion.removal * 0.24;
    thyroidLobe(650 + liftX, 330 + bodyY + liftY, 116, 172, "#cf6f91", rotate, 1 - motion.removal * 0.25, "right", motion);
    thyroidNodule(684 + liftX, 310 + bodyY + liftY, 42 + motion.pulse * 2, rotate, 1 - motion.removal * 0.25);
  }

  thyroidLobe(352, 330 + bodyY, 104, 165, "#d989a4", -0.08, 1, "left", motion);
  thyroidIsthmus(456, 320 + bodyY, 190, 74, motion);
  drawPosteriorThyroidLandmarks(bodyY, motion);
  drawCentralNodePackets(bodyY, motion);

  drawVessel([[782, 146], [710, 218 + bodyY]], "#d83b44", "rightSupArt", motion);
  drawVessel([[786, 456], [650, 418 + bodyY]], "#d83b44", "rightInfArt", motion);
  drawVessel([[815, 188], [724, 256 + bodyY]], "#3c6fc0", "rightSupVein", motion);
  drawVessel([[812, 332], [742, 340 + bodyY]], "#3c6fc0", "rightMidVein", motion);
  drawVessel([[688, 514 + bodyY], [560, 526 + bodyY], [430, 514 + bodyY]], "#3c6fc0", "rightInfVein", motion);
  drawCapsuleClipTargets(bodyY, motion);

  drawNerve([[472, 532 + bodyY], [458, 438 + bodyY], [456, 326 + bodyY], [474, 190 + bodyY]], "leftRLN", motion);
  drawNerve([[628, 532 + bodyY], [622, 432 + bodyY], [620, 330 + bodyY], [604, 190 + bodyY]], "rightRLN", motion);
  drawSuperiorLaryngealNerve([[744, 126 + bodyY], [724, 166 + bodyY], [710, 212 + bodyY]], "rightEBSLN", motion);
  drawSuperiorLaryngealNerve([[358, 126 + bodyY], [376, 166 + bodyY], [394, 216 + bodyY]], "leftEBSLN", motion);

  parathyroid(430, 258 + bodyY, motion, "leftParaSup");
  parathyroid(426, 414 + bodyY, motion, "leftParaInf");
  parathyroid(624, 258 + bodyY, motion, "rightParaSup");
  parathyroid(684, 390 + bodyY, motion, "rightParaInf");

  if (state.bleeding > 0) {
    ctx.fillStyle = `rgba(185, 47, 55, ${0.5 + motion.pulse * 0.35})`;
    ctx.beginPath();
    ctx.arc(742, 340 + bodyY, 14 + state.bleeding * 4 + motion.pulse * 4, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < state.bleeding; i += 1) {
      ctx.beginPath();
      ctx.arc(736 + i * 12, 356 + bodyY + Math.sin(motion.t * 4 + i) * 8, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    drawLabel("Bleeding", 768, 386 + bodyY, "left");
  }

  if (state.removed) {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    roundRect(586, 210, 220, 310, 60);
    ctx.fill();
    drawLabel("Right lobe removed", 700, 366);
    drawSpecimen(motion);
  }

  ctx.restore();
}

function drawDeepLandmarks(bodyY, motion) {
  ctx.save();
  ctx.globalAlpha = 0.45 + motion.exposure * 0.35;
  ctx.fillStyle = "rgba(130, 98, 88, 0.22)";
  roundRect(468, 214 + bodyY, 154, 300, 46);
  ctx.fill();
  ctx.fillStyle = "rgba(188, 57, 64, 0.75)";
  roundRect(224, 128, 24, 408, 12);
  ctx.fill();
  roundRect(838, 128, 24, 408, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(60, 111, 192, 0.72)";
  roundRect(172, 130, 28, 406, 14);
  ctx.fill();
  roundRect(890, 130, 28, 406, 14);
  ctx.fill();
  if (state.settings.labelMode && motion.exposure > 0.35) {
    drawLabel("Carotid sheath", 186, 118);
    drawLabel("Carotid sheath", 880, 118);
    drawLabel("Esophageal groove", 545, 528);
  }
  ctx.restore();
}

function drawLarynx(bodyY) {
  ctx.save();
  ctx.fillStyle = "#cbd5da";
  roundRect(488, 108 + bodyY, 120, 68, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(62, 80, 89, 0.36)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(516, 118 + bodyY);
  ctx.lineTo(548, 162 + bodyY);
  ctx.lineTo(580, 118 + bodyY);
  ctx.stroke();
  ctx.fillStyle = "#9fb3bd";
  roundRect(500, 166 + bodyY, 96, 30, 15);
  ctx.fill();
  if (state.settings.labelMode) {
    drawLabel("Larynx", 548, 102 + bodyY);
    drawLabel("Cricoid cartilage", 548, 214 + bodyY);
  }
  ctx.restore();
}

function drawPosteriorThyroidLandmarks(bodyY, motion) {
  ctx.save();
  ctx.globalAlpha = 0.35 + motion.exposure * 0.55;
  ctx.fillStyle = "#b15d77";
  ctx.beginPath();
  ctx.arc(610, 286 + bodyY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(139, 154, 161, 0.78)";
  roundRect(594, 280 + bodyY, 58, 104, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(35, 52, 60, 0.35)";
  ctx.stroke();
  if (state.settings.labelMode && motion.exposure > 0.3) {
    drawLabel("Berry ligament", 670, 292 + bodyY, "left");
    drawLabel("Zuckerkandl tubercle", 634, 276 + bodyY, "left");
  }
  ctx.restore();
}

function drawCentralNodePackets(bodyY, motion) {
  const packets = [
    { id: "delphianNodes", x: 548, y: 236 + bodyY, rx: 42, ry: 28, label: "Prelaryngeal" },
    { id: "pretrachealNodes", x: 548, y: 474 + bodyY, rx: 54, ry: 48, label: "Pretracheal" },
    { id: "rightParatrachealNodes", x: 650, y: 452 + bodyY, rx: 52, ry: 82, label: "Right paratracheal" }
  ];

  packets.forEach((packet, packetIndex) => {
    if (state.nodalCleared.has(packet.id)) return;
    const mobilized = state.nodalMobilized.has(packet.id);
    const reveal = packet.id === "rightParatrachealNodes" ? 0.22 + motion.exposure * 0.55 + motion.removal * 0.2 : 0.34 + motion.exposure * 0.42;
    ctx.save();
    ctx.globalAlpha = Math.min(0.95, reveal);
    ctx.fillStyle = mobilized ? "rgba(255, 248, 232, 0.92)" : "rgba(229, 205, 162, 0.72)";
    ctx.beginPath();
    ctx.ellipse(packet.x, packet.y, packet.rx, packet.ry, packet.id === "rightParatrachealNodes" ? -0.12 : 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = mobilized ? "rgba(156, 104, 38, 0.78)" : "rgba(126, 91, 47, 0.42)";
    ctx.lineWidth = mobilized ? 3 : 2;
    ctx.setLineDash(mobilized ? [5, 4] : []);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < 7; i += 1) {
      const angle = (i / 7) * Math.PI * 2 + packetIndex * 0.52;
      const radiusX = packet.rx * (0.28 + (i % 3) * 0.14);
      const radiusY = packet.ry * (0.22 + ((i + 1) % 3) * 0.12);
      ctx.fillStyle = i % 2 ? "#d9b779" : "#ecd69f";
      ctx.beginPath();
      ctx.arc(packet.x + Math.cos(angle) * radiusX, packet.y + Math.sin(angle) * radiusY, 8 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(114, 79, 39, 0.32)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    if (state.settings.labelMode && (motion.exposure > 0.25 || packet.id === "delphianNodes")) {
      drawLabel(packet.label, packet.x, packet.y + packet.ry + 20);
    }
    ctx.restore();
  });
}

function thyroidLobe(x, y, rx, ry, color, rotation = -0.08, alpha = 1, side = "right", motion = { pulse: 0 }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createRadialGradient(x - rx * 0.22, y - ry * 0.38, rx * 0.08, x, y, ry * 0.95);
  gradient.addColorStop(0, lighten(color, 30));
  gradient.addColorStop(0.52, color);
  gradient.addColorStop(1, darken(color, 16));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.clip();
  drawThyroidLobules(x, y, rx, ry, rotation, side, color);
  drawThyroidSurfaceVessels(x, y, rx, ry, rotation, side, motion);
  ctx.restore();

  ctx.strokeStyle = "rgba(95, 43, 62, 0.62)";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha * 0.62;
  ctx.strokeStyle = "rgba(255, 232, 238, 0.62)";
  ctx.lineWidth = 2.2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx - 12, ry - 14, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(95, 43, 62, 0.28)";
  ctx.lineWidth = 1.8;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-rx * 0.46, i * ry * 0.18);
    ctx.quadraticCurveTo(0, i * ry * 0.14 + Math.sin(i + motion.t) * 5, rx * 0.5, i * ry * 0.22);
    ctx.stroke();
  }
  ctx.restore();

  ctx.globalAlpha = Math.min(0.3, alpha);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.ellipse(x - rx * 0.25, y - ry * 0.35, rx * 0.26, ry * 0.42, rotation, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.82;
  ctx.fillStyle = "rgba(116, 48, 72, 0.24)";
  const pole = side === "right" ? 1 : -1;
  ctx.beginPath();
  ctx.ellipse(x + pole * rx * 0.36, y - ry * 0.72, rx * 0.22, ry * 0.12, rotation + pole * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + pole * rx * 0.28, y + ry * 0.75, rx * 0.2, ry * 0.12, rotation - pole * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function thyroidIsthmus(x, y, w, h, motion) {
  ctx.save();
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, "#e09aac");
  gradient.addColorStop(0.5, "#d17d9a");
  gradient.addColorStop(1, "#be6685");
  ctx.fillStyle = gradient;
  roundRect(x, y, w, h, 34);
  ctx.fill();

  ctx.fillStyle = "#d17d9a";
  ctx.beginPath();
  ctx.moveTo(x + w * 0.48, y + 10);
  ctx.quadraticCurveTo(x + w * 0.5, y - 48, x + w * 0.57, y - 86);
  ctx.quadraticCurveTo(x + w * 0.63, y - 42, x + w * 0.59, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(95, 43, 62, 0.38)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  roundRect(x, y, w, h, 34);
  ctx.clip();
  for (let i = 0; i < 7; i += 1) {
    ctx.strokeStyle = `rgba(123, 52, 76, ${0.12 + i * 0.01})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const px = x + 22 + i * 25;
    ctx.moveTo(px, y + 10);
    ctx.quadraticCurveTo(px + Math.sin(i) * 10, y + h / 2 + motion.pulse * 2, px + 6, y + h - 8);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(95, 43, 62, 0.55)";
  ctx.lineWidth = 3;
  roundRect(x, y, w, h, 34);
  ctx.stroke();

  ctx.restore();
}

function thyroidNodule(x, y, r, rotation, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rotation + 0.18);
  const gradient = ctx.createRadialGradient(-10, -12, 6, 0, 0, r);
  gradient.addColorStop(0, "#c77a92");
  gradient.addColorStop(0.48, "#a54e6a");
  gradient.addColorStop(1, "#73364e");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    const radius = r * (0.86 + 0.12 * Math.sin(i * 1.7) + 0.08 * Math.cos(i * 2.4));
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius * 0.92;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(91, 38, 57, 0.72)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.58;
  ctx.fillStyle = "rgba(255, 222, 228, 0.52)";
  ctx.beginPath();
  ctx.ellipse(-12, -14, r * 0.25, r * 0.18, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 225, 229, 0.38)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(-4 + i * 5, -2 + Math.sin(i) * 8, r * (0.22 + i * 0.05), 0.25, 2.8);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 242, 220, 0.86)";
  for (let i = 0; i < 5; i += 1) {
    const angle = i * 1.18;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * r * 0.36, Math.sin(angle) * r * 0.24, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(62, 22, 38, 0.42)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(2, 2, r * 0.64, -0.4, 2.6);
  ctx.stroke();
  ctx.restore();
}

function drawThyroidLobules(x, y, rx, ry, rotation, side, color) {
  const seed = side === "right" ? 11 : 29;
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      const jitter = Math.sin((row * 9 + col * 5 + seed) * 1.37);
      const px = x + col * rx * 0.25 + jitter * 8;
      const py = y + row * ry * 0.18 + Math.cos((row + seed) * 2.1) * 7;
      const inside = ((px - x) ** 2) / (rx ** 2) + ((py - y) ** 2) / (ry ** 2);
      if (inside > 0.82) continue;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rotation + jitter * 0.2);
      ctx.fillStyle = row % 2 === 0 ? "rgba(255, 210, 220, 0.16)" : "rgba(112, 45, 70, 0.1)";
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * (0.12 + Math.abs(jitter) * 0.02), ry * 0.075, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(93, 39, 61, 0.09)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawThyroidSurfaceVessels(x, y, rx, ry, rotation, side, motion) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const pole = side === "right" ? 1 : -1;
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(180, 42, 55, ${0.28 + motion.pulse * 0.08})`;
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 5; i += 1) {
    const startY = -ry * 0.72 + i * ry * 0.32;
    ctx.beginPath();
    ctx.moveTo(pole * rx * 0.72, startY);
    ctx.quadraticCurveTo(pole * rx * (0.28 + i * 0.02), startY + ry * 0.12, pole * rx * 0.12, startY + ry * 0.22);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(60, 111, 192, 0.22)";
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 4; i += 1) {
    const startY = -ry * 0.55 + i * ry * 0.34;
    ctx.beginPath();
    ctx.moveTo(pole * rx * 0.62, startY + 16);
    ctx.quadraticCurveTo(pole * rx * 0.1, startY + ry * 0.1, -pole * rx * 0.12, startY + ry * 0.16);
    ctx.stroke();
  }
  ctx.restore();
}

function lighten(hex, amount) {
  return shade(hex, amount);
}

function darken(hex, amount) {
  return shade(hex, -amount);
}

function shade(hex, amount) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (num & 255) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function parathyroid(x, y, motion, id) {
  const found = state.completed.has(id);
  ctx.save();
  ctx.globalAlpha = Math.max(0.18, motion.parathyroidReveal);
  ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  if (found) {
    ctx.shadowColor = "rgba(244, 201, 93, 0.85)";
    ctx.shadowBlur = 18 + motion.pulse * 8;
  }
  ctx.fillStyle = "#f4c95d";
  ctx.beginPath();
  ctx.arc(x, y, 13 + (found ? motion.pulse * 2 : 0), 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(116, 78, 0, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawVessel(path, color, id, motion) {
  const clipped = state.vesselsClipped.has(id);
  const width = clipped ? 5 : 8 + motion.pulse * 5;
  const alpha = clipped ? 0.42 : 0.95;
  ctx.save();
  ctx.globalAlpha = alpha;
  drawPath(path, color, width);
  ctx.restore();
  if (clipped) {
    const [x, y] = path[1];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.2);
    ctx.fillStyle = "#d4d9dc";
    roundRect(-12, -8, 24, 6, 2);
    ctx.fill();
    roundRect(-12, 4, 24, 6, 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawNerve(path, id, motion) {
  const mapped = state.completed.has(id);
  ctx.save();
  ctx.globalAlpha = Math.max(0.2, motion.nerveReveal);
  if (mapped) {
    ctx.shadowColor = "rgba(240, 220, 66, 0.85)";
    ctx.shadowBlur = 14 + motion.pulse * 12;
  }
  drawPath(path, "#f0dc42", mapped ? 9 + motion.pulse * 2 : 7);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = Math.max(0.32, motion.nerveReveal);
  drawPath(path, "rgba(82, 64, 0, 0.32)", 2);
  ctx.restore();
}

function drawSuperiorLaryngealNerve(path, id, motion) {
  const mapped = state.completed.has(id);
  ctx.save();
  ctx.globalAlpha = Math.max(0.18, motion.nerveReveal * 0.85);
  if (mapped) {
    ctx.shadowColor = "rgba(155, 122, 221, 0.85)";
    ctx.shadowBlur = 12 + motion.pulse * 8;
  }
  drawPath(path, "#9b7add", mapped ? 7 + motion.pulse * 2 : 5, [8, 5]);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = Math.max(0.28, motion.nerveReveal * 0.8);
  drawPath(path, "rgba(66, 45, 112, 0.34)", 2, [4, 6]);
  ctx.restore();
}

function drawCapsuleClipTargets(bodyY, motion) {
  if (stages[state.stage].target !== "superiorPole") return;
  ctx.save();
  if (!state.completed.has("rightEBSLN")) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    roundRect(650, 108 + bodyY, 250, 42, 8);
    ctx.fill();
    ctx.fillStyle = "#432d70";
    ctx.font = "800 13px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("6A: Probe the purple dashed EBSLN first", 664, 134 + bodyY);
    ctx.restore();
    return;
  }

  const targets = [
    { id: "rightSupArt", x: 710, y: 218 + bodyY, color: "#d83b44", label: state.vesselsClipped.has("rightSupArt") ? "Artery clipped" : "6B: Clip artery" },
    { id: "rightSupVein", x: 724, y: 256 + bodyY, color: "#3c6fc0", label: state.vesselsClipped.has("rightSupVein") ? "Vein clipped" : "6C: Clip vein" }
  ];
  targets.forEach((target, index) => {
    ctx.strokeStyle = target.color;
    ctx.globalAlpha = state.vesselsClipped.has(target.id) ? 0.38 : 1;
    ctx.lineWidth = state.vesselsClipped.has(target.id) ? 2 : 4;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(target.x, target.y, 22 + motion.pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    roundRect(target.x + 16, target.y - 16 + index * 6, 126, 24, 6);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#24333a";
    ctx.font = "700 12px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(target.label, target.x + 24, target.y + index * 6);
  });
  ctx.restore();
}

function drawSpecimen(motion) {
  ctx.save();
  const slide = ease((performance.now() - state.removedAt) / 1400);
  ctx.globalAlpha = slide;
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  roundRect(800, 480, 180, 92, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(80, 100, 110, 0.28)";
  ctx.stroke();
  ctx.fillStyle = "#cf6f91";
  ctx.beginPath();
  ctx.ellipse(870, 526, 54, 34, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a54e6a";
  ctx.beginPath();
  ctx.arc(890, 520, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2a31";
  ctx.font = "700 13px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Specimen", 890, 590);
  ctx.restore();
}

function drawHighlights(motion) {
  const target = stages[state.stage].target;
  const ids = targetZoneIds(target);

  ctx.save();
  ctx.strokeStyle = `rgba(20, 125, 143, ${0.65 + motion.pulse * 0.3})`;
  ctx.lineWidth = 4 + motion.pulse * 2;
  ctx.setLineDash([8, 8 + motion.pulse * 8]);
  zones.filter((zone) => ids.includes(zone.id)).forEach((zone) => {
    if (zone.path) drawPath(zone.path, "#147d8f", 5, [8, 8]);
    else if (zone.r) {
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.r + 10, 0, Math.PI * 2);
      ctx.stroke();
    } else if (zone.rx) {
      ctx.beginPath();
      ctx.ellipse(zone.x, zone.y, zone.rx + 10, zone.ry + 10, -0.08, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      roundRect(zone.x - 8, zone.y - 8, zone.w + 16, zone.h + 16, 16);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawTeachingOverlay(motion) {
  const target = stages[state.stage].target;
  const lines = {
    inspect: ["Watch the thyroid move subtly with the airway.", "Hover or click structures to learn names."],
    incision: ["Open the skin first.", "Deep central anatomy remains protected."],
    flaps: ["Use monopolar hook superficially.", "Stay in the flap plane."],
    strap: ["Use Harmonic Focus here.", "Short activation opens the midline."],
    middleVein: ["Use Harmonic Focus or Advanced Bipolar.", "Seal before medial rotation."],
    superiorPole: state.completed.has("rightEBSLN")
      ? ["6B: Use clips or energy.", "Click each capsular dashed circle."]
      : ["6A: Use the nerve probe.", "Click the purple dashed EBSLN."],
    parathyroids: ["Protect the posterior yellow glands.", "Preserve blood supply."],
    rln: ["The RLN ascends in the groove.", "Keep it visible before deep release."],
    inferiorPole: ["Use Advanced Bipolar / Harmonic Focus.", "Map the RLN first."],
    berry: ["Berry ligament fixes the thyroid to the trachea.", "This is a high-risk RLN zone."],
    isthmus: ["Use an energy device on the isthmus.", "Short activation over the anterior trachea."],
    remove: ["The right lobe rotates outward.", "The nodule leaves with the specimen."],
    centralNodes: ["Use the dissector on each node packet.", "The RLN and parathyroids remain danger planes."],
    nodeClearance: ["Seal visible lymphovascular pedicles.", "Clear packets, not scattered individual nodes."],
    hemostasis: ["Expose clearly, then control bleeding.", "Confirm the thyroid bed is dry."],
    close: ["Make sure the field is dry first.", "Then close in layers."]
  }[target] || ["Follow the highlighted anatomy target.", "Use the matching instrument."];
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundRect(44, 34, 276, 76, 8);
  ctx.fill();
  ctx.fillStyle = "#0e5965";
  ctx.font = "800 14px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Dynamic anatomy cue", 60, 60);
  ctx.fillStyle = "#314047";
  ctx.font = "13px Inter, sans-serif";
  ctx.fillText(lines[0], 60, 82);
  ctx.fillText(lines[1], 60, 101);
  ctx.restore();
}

function drawToolCursor(motion) {
  if (!state.pointer) return;
  const { x, y } = state.pointer;
  const profile = toolProfiles[state.tool];
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = profile.color;
  ctx.fillStyle = profile.color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (state.tool === "inspect") {
    const r = 18 + state.settings.magnification * 4 + motion.pulse * 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 0.7, r * 0.7);
    ctx.lineTo(r + 12, r + 12);
    ctx.stroke();
  }

  if (state.tool === "scalpel") {
    ctx.rotate(-0.75);
    ctx.fillStyle = "#dfe4e7";
    roundRect(-8, -42, 16, 62, 4);
    ctx.fill();
    ctx.fillStyle = profile.color;
    ctx.beginPath();
    ctx.moveTo(-9, -46);
    ctx.lineTo(12, -60);
    ctx.lineTo(8, -36);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(75, 85, 99, 0.38)";
    ctx.beginPath();
    ctx.arc(0, 0, 12 + state.settings.depth * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (state.tool === "retractor") {
    const pull = 14 + state.settings.traction * 7;
    ctx.beginPath();
    ctx.moveTo(-pull, -24);
    ctx.lineTo(0, 0);
    ctx.lineTo(pull, -24);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 34);
    ctx.stroke();
  }

  if (state.tool === "dissector") {
    ctx.rotate(-0.45);
    ctx.beginPath();
    ctx.moveTo(-6, 36);
    ctx.lineTo(0, -34);
    ctx.lineTo(11, -46);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -34, 7 + state.settings.pressure, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (state.tool === "nerveProbe") {
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(0, -30);
    ctx.stroke();
    for (let i = 0; i < state.settings.sensitivity; i += 1) {
      ctx.globalAlpha = 0.18 + i * 0.1;
      ctx.beginPath();
      ctx.arc(0, -34, 10 + i * 7 + motion.pulse * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  if (state.tool === "clip") {
    ctx.rotate((state.settings.angle * Math.PI) / 180);
    ctx.strokeStyle = "#6b7280";
    ctx.beginPath();
    ctx.moveTo(-22, -12);
    ctx.lineTo(0, 0);
    ctx.lineTo(22, -12);
    ctx.moveTo(-18, 12);
    ctx.lineTo(0, 0);
    ctx.lineTo(18, 12);
    ctx.stroke();
  }

  if (state.tool === "harmonic") {
    ctx.rotate(-0.55);
    ctx.strokeStyle = "#c77a1b";
    ctx.beginPath();
    ctx.moveTo(-8, 42);
    ctx.lineTo(-4, -24);
    ctx.moveTo(8, 42);
    ctx.lineTo(4, -24);
    ctx.moveTo(-4, -24);
    ctx.lineTo(-18, -42);
    ctx.moveTo(4, -24);
    ctx.lineTo(18, -42);
    ctx.stroke();
    ctx.fillStyle = `rgba(199, 122, 27, ${0.18 + state.settings.harmonicPower * 0.05})`;
    ctx.beginPath();
    ctx.arc(0, -38, 12 + motion.pulse * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (state.tool === "advancedBipolar") {
    ctx.rotate(-0.5);
    ctx.strokeStyle = "#8a4fb5";
    ctx.beginPath();
    ctx.moveTo(-12, 42);
    ctx.lineTo(-6, -28);
    ctx.lineTo(-18, -46);
    ctx.moveTo(12, 42);
    ctx.lineTo(6, -28);
    ctx.lineTo(18, -46);
    ctx.stroke();
    ctx.fillStyle = `rgba(138, 79, 181, ${0.16 + state.settings.sealPower * 0.04})`;
    roundRect(-22, -50, 44, 18, 5);
    ctx.fill();
  }

  if (state.tool === "monopolar") {
    ctx.rotate(-0.45);
    ctx.strokeStyle = "#b92f37";
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(0, -26);
    ctx.quadraticCurveTo(18, -42, 2, -54);
    ctx.stroke();
    ctx.fillStyle = `rgba(185, 47, 55, ${0.18 + state.settings.monoPower * 0.06})`;
    ctx.beginPath();
    ctx.arc(4, -52, 8 + motion.pulse * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (state.tool === "cautery") {
    ctx.rotate(-0.55);
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(0, -28);
    ctx.stroke();
    ctx.fillStyle = `rgba(185, 47, 55, ${0.25 + state.settings.power * 0.08})`;
    ctx.beginPath();
    ctx.arc(0, -34, 8 + state.settings.power * 3 + motion.pulse * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (state.tool === "forceps") {
    const grip = 8 + state.settings.grip * 3;
    ctx.beginPath();
    ctx.moveTo(-grip, 38);
    ctx.lineTo(-5, -14);
    ctx.lineTo(-16, -34);
    ctx.moveTo(grip, 38);
    ctx.lineTo(5, -14);
    ctx.lineTo(16, -34);
    ctx.stroke();
  }

  if (state.tool === "suture") {
    ctx.strokeStyle = "#0e5965";
    ctx.beginPath();
    ctx.arc(0, 0, 20, -1.2, 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, -12);
    ctx.quadraticCurveTo(34, -28, 50, -10);
    ctx.stroke();
    ctx.fillStyle = "#0e5965";
    ctx.beginPath();
    ctx.arc(50, -10, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

canvas.addEventListener("click", (event) => {
  const point = canvasPoint(event);
  onAction(hitZone(point), point);
});

canvas.addEventListener("mousemove", (event) => {
  const point = canvasPoint(event);
  state.pointer = { x: point.x, y: point.y };
  if (state.tool !== "inspect") {
    tooltip.hidden = true;
    return;
  }
  const zone = hitZone(point);
  if (!zone) {
    tooltip.hidden = true;
    return;
  }
  tooltip.hidden = false;
  tooltip.style.left = `${Math.min(point.sx + 14, canvas.clientWidth - 250)}px`;
  tooltip.style.top = `${Math.max(8, point.sy - 8)}px`;
  tooltip.textContent = `${zone.label}: ${zone.note}`;
});

canvas.addEventListener("mouseleave", () => {
  state.pointer = null;
  tooltip.hidden = true;
});

resetButton.addEventListener("click", resetSimulation);
restartButton.addEventListener("click", resetSimulation);

renderTools();
renderInstrumentPanel();
renderStatus();
renderCompletionScreen();
addLog("Begin with Inspect. Hover or click structures to learn the anatomy before operating.");

function animationLoop(now) {
  const dt = Math.max(0, Math.min(0.05, (now - state.lastFrame) / 1000 || 0));
  state.lastFrame = now;
  state.heat = Math.max(0, state.heat - dt * 0.55);
  draw();
  requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);
