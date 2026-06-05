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
  { id: "inspect", name: "查看", icon: "i", use: "悬停/点击识别解剖结构" },
  { id: "scalpel", name: "手术刀", icon: "/", use: "完成颈部领式切口" },
  { id: "retractor", name: "拉钩", icon: "<", use: "打开术野并分离带状肌" },
  { id: "dissector", name: "分离器", icon: "D", use: "建立层面并显露结构" },
  { id: "nerveProbe", name: "神经探针", icon: "N", use: "确认喉返神经" },
  { id: "clip", name: "施夹器", icon: "C", use: "在腺体附近结扎命名血管" },
  { id: "harmonic", name: "超声刀", icon: "H", use: "封闭/切开小血管" },
  { id: "advancedBipolar", name: "高级双极", icon: "L", use: "双极血管封闭并注意冷却" },
  { id: "monopolar", name: "单极电钩", icon: "M", use: "仅用于浅层皮瓣分离" },
  { id: "cautery", name: "双极电凝", icon: "B", use: "精准点状凝血" },
  { id: "forceps", name: "镊钳", icon: "F", use: "牵出已游离的腺叶" },
  { id: "suture", name: "缝合", icon: "U", use: "止血后关闭切口" }
];

const toolProfiles = {
  inspect: {
    badge: "识别",
    color: "#147d8f",
    technique: "先使用它。动手前先建立解剖地图：正中气管、甲状腺被膜、后方甲状旁腺、血管以及喉返神经走行。",
    controls: [
      { key: "labelMode", label: "叠加标签", type: "toggle", on: "开", off: "关" },
      { key: "magnification", label: "放大倍数", type: "range", min: 1, max: 3, step: 1, suffix: "x" }
    ]
  },
  scalpel: {
    badge: "切开",
    color: "#4b5563",
    technique: "做浅而可控的皮肤切开。进入更深层显露步骤前，刀刃应始终停留在计划的领式切口线上。",
    controls: [
      { key: "depth", label: "刀深", type: "range", min: 1, max: 3, step: 1, suffix: " mm" },
      { key: "stroke", label: "切开长度", type: "select", options: ["短", "中", "长"] }
    ]
  },
  retractor: {
    badge: "显露",
    color: "#147d8f",
    technique: "用均衡牵拉抬起皮瓣、打开带状肌正中窗口，避免挤压精细解剖结构。",
    controls: [
      { key: "traction", label: "牵拉力度", type: "range", min: 1, max: 4, step: 1, suffix: "" },
      { key: "side", label: "方向", type: "select", options: ["双侧", "左侧", "右侧"] }
    ]
  },
  dissector: {
    badge: "层面",
    color: "#7c5c2e",
    technique: "进行钝性被膜旁分离。该器械适合显露甲状旁腺、打开组织层面，并避免能量热扩散。",
    controls: [
      { key: "pressure", label: "尖端压力", type: "range", min: 1, max: 4, step: 1, suffix: "" },
      { key: "plane", label: "层面", type: "select", options: ["被膜旁", "后方", "中央区"] }
    ]
  },
  nerveProbe: {
    badge: "信号",
    color: "#b59a00",
    technique: "处理血管前，沿气管食管沟或上极神经目标轻柔探查。",
    controls: [
      { key: "sensitivity", label: "灵敏度", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "audio", label: "信号提示", type: "toggle", on: "可视", off: "静音" }
    ]
  },
  clip: {
    badge: "结扎",
    color: "#6b7280",
    technique: "当流程要求机械封闭时，在靠近被膜处夹闭命名血管。",
    controls: [
      { key: "angle", label: "夹闭角度", type: "range", min: -45, max: 45, step: 15, suffix: "度" },
      { key: "clipSize", label: "夹子大小", type: "select", options: ["小", "中", "大"] }
    ]
  },
  harmonic: {
    badge: "超声",
    color: "#c77a1b",
    technique: "超声刀可封闭并切断小血管，但仍必须远离喉返神经、喉上神经外支和甲状旁腺。短时激发，并等待冷却。",
    controls: [
      { key: "harmonicPower", label: "功率档位", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "activation", label: "激发方式", type: "select", options: ["点按", "短时", "长时"] }
    ]
  },
  advancedBipolar: {
    badge: "封闭",
    color: "#8a4fb5",
    technique: "高级双极适合在干燥、可视的术野中封闭血管。接触关键结构前要注意冷却。",
    controls: [
      { key: "sealPower", label: "封闭功率", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "jawWidth", label: "钳口宽度", type: "select", options: ["精细", "标准", "宽"] }
    ]
  },
  monopolar: {
    badge: "射频",
    color: "#b92f37",
    technique: "单极能量是现代工具，但不能随意使用：只用于浅层皮瓣或皮缘处理，不能靠近喉返神经、甲状旁腺或上极神经。",
    controls: [
      { key: "monoPower", label: "功率", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "monoMode", label: "模式", type: "select", options: ["切开", "混切", "凝血"] }
    ]
  },
  cautery: {
    badge: "能量",
    color: "#b92f37",
    technique: "聚焦双极能量只用于出血点或血管断端。高功率更快，但靠近喉返神经或甲状旁腺时风险更高。",
    controls: [
      { key: "power", label: "功率", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "mode", label: "模式", type: "select", options: ["凝血", "封闭", "点触"] }
    ]
  },
  forceps: {
    badge: "牵引",
    color: "#287a4b",
    technique: "在完成神经定位、血管控制、贝里韧带松解和峡部分离后，用轻柔牵引取出已游离的右叶。",
    controls: [
      { key: "grip", label: "夹持力度", type: "range", min: 1, max: 5, step: 1, suffix: "" },
      { key: "tractionVector", label: "牵引方向", type: "select", options: ["外侧", "上方", "前方"] }
    ]
  },
  suture: {
    badge: "关闭",
    color: "#0e5965",
    technique: "只有在术野干燥、流程进入分层关闭后才进行缝合。",
    controls: [
      { key: "spacing", label: "针距", type: "range", min: 4, max: 12, step: 2, suffix: " mm" },
      { key: "layer", label: "层次", type: "select", options: ["皮肤", "颈阔肌", "深层"] }
    ]
  }
};

const defaultSettings = {
  labelMode: true,
  magnification: 1,
  depth: 1,
  stroke: "短",
  traction: 2,
  side: "双侧",
  pressure: 1,
  plane: "被膜旁",
  sensitivity: 3,
  audio: true,
  angle: 0,
  clipSize: "中",
  harmonicPower: 3,
  activation: "短时",
  sealPower: 3,
  jawWidth: "精细",
  monoPower: 2,
  monoMode: "混切",
  power: 2,
  mode: "凝血",
  grip: 2,
  tractionVector: "外侧",
  spacing: 8,
  layer: "皮肤"
};

const stages = [
  {
    title: "规划并查看颈部解剖",
    instruction: "使用“查看”识别喉、气管、甲状腺叶、结节、甲状旁腺、中央区淋巴结区、血管、喉上神经外支和喉返神经。",
    target: "inspect"
  },
  {
    title: "建立领式切口",
    instruction: "选择“手术刀”，沿标记的低位颈部切口线切开。避免向甲状腺或气管深切。",
    target: "incision"
  },
  {
    title: "掀起颈阔肌下皮瓣",
    instruction: "在皮瓣层面使用“单极电钩”，进行浅层能量辅助皮瓣游离。",
    target: "flaps"
  },
  {
    title: "打开带状肌正中间隙",
    instruction: "在带状肌正中窗口使用“超声刀”，进行短时、可控的能量辅助分离。拉钩可作为备用。",
    target: "strap"
  },
  {
    title: "离断甲状腺中静脉",
    instruction: "在甲状腺中静脉处使用“超声刀”或“高级双极”。若想采用传统冷器械方式，可用施夹器作为备用。",
    target: "middleVein"
  },
  {
    title: "保护喉上神经外支和上极",
    instruction: "步骤 6A：用“神经探针”点击紫色虚线的喉上神经外支。步骤 6B：在两个被膜旁虚线圈使用“超声刀”或“高级双极”；施夹器可作备用。",
    target: "superiorPole"
  },
  {
    title: "识别甲状旁腺",
    instruction: "用“分离器”点击右上、右下甲状旁腺。将其连同血供保留在甲状腺床内。",
    target: "parathyroids"
  },
  {
    title: "识别喉返神经",
    instruction: "在处理下极和贝里韧带前，用“神经探针”确认气管食管沟内的右侧喉返神经。",
    target: "rln"
  },
  {
    title: "游离下极",
    instruction: "完成喉返神经定位后，在甲状腺下动脉分支和下方静脉丛使用“高级双极”或“超声刀”，同时保护甲状旁腺血供。",
    target: "inferiorPole"
  },
  {
    title: "松解贝里韧带",
    instruction: "在喉返神经保持可见的情况下，用“分离器”处理贝里韧带，将甲状腺后内侧从气管旁松解。",
    target: "berry"
  },
  {
    title: "离断峡部",
    instruction: "在气管前方使用“超声刀”或“高级双极”离断峡部，激发时间要短，并远离气道。",
    target: "isthmus"
  },
  {
    title: "取出带结节的右叶",
    instruction: "在血管、喉返神经、贝里韧带和峡部处理完成后，用“镊钳”夹持已游离的右侧甲状腺叶。",
    target: "remove"
  },
  {
    title: "分离中央区淋巴结包块",
    instruction: "用“分离器”将喉前、气管前和右侧气管旁淋巴结包块从喉/气管平面上游离，同时保护喉返神经和甲状旁腺。",
    target: "centralNodes"
  },
  {
    title: "封闭并清扫中央区淋巴结",
    instruction: "在每个已游离的淋巴结包块上使用“超声刀”或“高级双极”，控制细小淋巴血管蒂，完成同侧中央区清扫。",
    target: "nodeClearance"
  },
  {
    title: "最终止血",
    instruction: "仅在出血点或血管断端使用“双极电凝”或“高级双极”。关闭前确认甲状腺床干燥。",
    target: "hemostasis"
  },
  {
    title: "分层关闭",
    instruction: "止血完成后，在切口处使用“缝合”。本简化模型按带状肌/颈阔肌/皮肤层次关闭。",
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
  inspect: "基础动态很重要：气管会轻微上下起伏，甲状腺因与气道相连也会随之移动。",
  incision: "皮肤切口变宽，但深部解剖仍被覆盖。甲状腺切除是逐层显露，不是直接冲向腺体。",
  flaps: "开放手术中，浅层皮瓣可用受控单极能量辅助游离，同时保护深部解剖。",
  strap: "超声刀可高效打开无血管的正中白线，但激发要短，并保持直视。",
  middleVein: "甲状腺中静脉常牵拉外侧腺叶；在内旋腺叶前，用超声刀或高级双极封闭是常见现代做法。",
  superiorPole: "靠近被膜是指在甲状腺表面旁的血管末端处理，而不是在靠近喉部的高位处理。这样可降低喉上神经外支损伤风险。",
  parathyroids: "甲状旁腺应原位保留。动画将其放在后方并高亮，帮助你看到它们与甲状腺被膜有多近。",
  rln: "处理下极和贝里韧带前先识别喉返神经，因为气管食管沟附近损伤可影响声带运动。",
  inferiorPole: "定位喉返神经后，可用高级双极或超声能量处理下极分支，同时保留甲状旁腺血供。",
  berry: "贝里韧带是高风险固定点，甲状腺组织在这里紧邻喉返神经和气管。",
  isthmus: "现代手术中可用能量器械离断峡部，但应停留在气管前方的甲状腺组织上。",
  remove: "控制被膜附着和血管后，右叶向外侧旋转并被提起取出。",
  centralNodes: "在淋巴结阳性的教学病例中，中央区清扫应按区域成包块处理：喉前、气管前和同侧气管旁包块在喉返神经和甲状旁腺血供可见的情况下游离。",
  nodeClearance: "清扫中央区时应控制细小淋巴血管蒂，而不是一颗一颗随意摘除淋巴结。",
  hemostasis: "甲状腺床干燥很重要，因为术后颈部血肿可能很危险。",
  close: "只有术野干燥后才关闭。手术结束时切口会收拢。"
};

const zones = [
  { id: "incision", type: "target", label: "计划领式切口", x: 340, y: 544, w: 400, h: 34, note: "低位横行颈部切口可进入甲状腺床。" },
  { id: "larynx", type: "critical", label: "喉与甲状软骨", x: 486, y: 106, w: 126, h: 72, note: "甲状腺位于喉下方，跨越下喉部和上段气管。" },
  { id: "cricoid", type: "critical", label: "环状软骨", x: 498, y: 164, w: 102, h: 36, note: "喉返神经通常在环甲关节附近入喉，位置就在环状软骨区域下方。" },
  { id: "trachea", type: "critical", label: "气管", x: 500, y: 174, w: 96, h: 330, note: "气管位于正中，深面贴近甲状腺峡部。" },
  { id: "esophagus", type: "landmark", label: "食管/气管食管沟", x: 458, y: 214, w: 170, h: 300, note: "喉返神经通常沿气管食管沟或其附近上行，随后入喉。" },
  { id: "leftThyroid", type: "thyroid", label: "左侧甲状腺叶", x: 352, y: 330, rx: 104, ry: 165, note: "甲状腺左右叶包绕气管前方和外侧。" },
  { id: "rightThyroid", type: "thyroid", label: "伴结节的右侧甲状腺叶", x: 650, y: 330, rx: 116, ry: 172, note: "本模拟结节位于右叶，因此是右侧腺叶切除病例。" },
  { id: "isthmus", type: "thyroid", label: "甲状腺峡部", x: 456, y: 320, w: 190, h: 74, note: "峡部横跨气管前方环状软骨下的气管环。" },
  { id: "nodule", type: "thyroid", label: "甲状腺结节", x: 684, y: 310, r: 42, note: "可疑结节是诊断性腺叶切除的常见适应证之一。" },
  { id: "delphianNodes", type: "lymph", label: "喉前淋巴结包块", x: 548, y: 236, rx: 42, ry: 28, note: "喉前淋巴结位于峡部上方的喉部正中附近，属于中央区。" },
  { id: "pretrachealNodes", type: "lymph", label: "气管前淋巴结包块", x: 548, y: 474, rx: 54, ry: 48, note: "气管前淋巴组织位于气管前平面，是第六区中央区清扫的一部分。" },
  { id: "rightParatrachealNodes", type: "lymph", label: "右侧气管旁淋巴结包块", x: 650, y: 452, rx: 52, ry: 82, note: "同侧气管旁组织在气管旁清扫，同时需保护右侧喉返神经和甲状旁腺血供。" },
  { id: "flapPlane", type: "target", label: "颈阔肌下皮瓣层面", x: 304, y: 500, w: 470, h: 88, note: "颈阔肌下皮瓣从领式切口向上、向下建立显露。" },
  { id: "strapWindow", type: "target", label: "带状肌正中窗口", x: 420, y: 150, w: 250, h: 385, note: "牵开带状肌后可显露甲状腺被膜。" },
  { id: "berryLigament", type: "landmark", label: "贝里韧带", x: 594, y: 280, w: 58, h: 104, note: "贝里韧带将甲状腺后内侧固定于气管，喉返神经在此附近风险较高。" },
  { id: "zuckerkandl", type: "landmark", label: "祖克坎德尔结节", x: 610, y: 285, r: 18, note: "甲状腺后方结节是靠近喉返神经和上甲状旁腺的重要标志。" },
  { id: "leftParaSup", type: "parathyroid", label: "左上甲状旁腺", x: 430, y: 258, r: 15, note: "上甲状旁腺通常位于甲状腺上三分之二附近的后方，常在喉返神经平面的后方。" },
  { id: "leftParaInf", type: "parathyroid", label: "左下甲状旁腺", x: 426, y: 414, r: 14, note: "下甲状旁腺位置变异更大，可更低或接近胸腺；保护依赖轻柔操作和血供保留。" },
  { id: "rightParaSup", type: "parathyroid", label: "右上甲状旁腺", x: 624, y: 258, r: 15, note: "上甲状旁腺常位于后方，接近喉返神经和甲状腺下动脉交叉处。" },
  { id: "rightParaInf", type: "parathyroid", label: "右下甲状旁腺", x: 684, y: 390, r: 14, note: "下甲状旁腺位置多变；本示意将右下腺体放在喉返神经外侧、甲状腺下动脉分支上方，以保持结构清楚。" },
  { id: "leftRLN", type: "nerve", label: "左侧喉返神经", path: [[472, 532], [458, 438], [456, 326], [474, 190]], note: "左侧喉返神经通常绕主动脉弓后，沿气管食管沟上行。" },
  { id: "rightRLN", type: "nerve", label: "右侧喉返神经", path: [[628, 532], [622, 432], [620, 330], [604, 190]], note: "右侧喉返神经通常绕锁骨下动脉，走行可更斜；少数患者存在非返性变异。" },
  { id: "rightEBSLN", type: "nerve", label: "喉上神经外支", path: [[744, 126], [724, 166], [710, 212]], note: "喉上神经外支靠近上极血管，损伤可影响高音和声音投射。" },
  { id: "leftEBSLN", type: "nerve", label: "左侧喉上神经外支", path: [[358, 126], [376, 166], [394, 216]], note: "处理上极血管时需保护喉上神经外支；损伤可影响高音和声音投射。" },
  { id: "rightSupArt", type: "artery", label: "右上甲状腺动脉", path: [[782, 146], [710, 218]], note: "上甲状腺血管走向上极；喉上神经外支风险使上极处理必须谨慎。" },
  { id: "rightInfArt", type: "artery", label: "右下甲状腺动脉分支", path: [[786, 456], [650, 418]], note: "甲状腺下动脉与喉返神经关系多变，并供应甲状旁腺分支，处理时需谨慎。" },
  { id: "rightSupVein", type: "vein", label: "右上甲状腺静脉", path: [[815, 188], [724, 256]], note: "静脉出血会遮挡神经和甲状旁腺。" },
  { id: "rightMidVein", type: "vein", label: "甲状腺中静脉", path: [[812, 332], [742, 340]], note: "游离时常需要控制并离断甲状腺中静脉。" },
  { id: "rightInfVein", type: "vein", label: "甲状腺下静脉丛", path: [[688, 514], [560, 526], [430, 514]], note: "甲状腺下静脉汇入正中静脉丛，下极操作时可能出血。" },
  { id: "rightCarotid", type: "critical", label: "右颈总动脉", path: [[850, 128], [844, 536]], note: "颈动脉鞘构成术野外侧边界。" },
  { id: "rightIJV", type: "critical", label: "右颈内静脉", path: [[902, 130], [898, 536]], note: "颈内静脉位于颈动脉鞘外侧，不属于常规被膜旁分离范围。" },
  { id: "leftCarotid", type: "critical", label: "左颈总动脉", path: [[230, 128], [236, 536]], note: "颈动脉鞘位于甲状腺叶外侧。" },
  { id: "leftIJV", type: "critical", label: "左颈内静脉", path: [[178, 130], [182, 536]], note: "颈内静脉是外侧边界，应保持在甲状腺被膜分离范围之外。" },
  { id: "bleed1", type: "bleed", label: "出血点", x: 742, y: 340, r: 18, note: "保持术野清楚并控制出血，才能安全操作。" }
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
  hemostasisScore.textContent = state.bleeding === 0 ? "稳定" : state.bleeding < 3 ? "渗血" : "出血";
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
  completionHemostasis.textContent = state.bleeding === 0 ? "稳定" : state.bleeding < 3 ? "渗血" : "出血";
}

function advance(target) {
  state.completed.add(target);
  const current = stages[state.stage];
  if (current.target === target && state.stage < stages.length - 1) {
    state.stage += 1;
    state.stageChangedAt = performance.now();
    addLog(`目标完成：${current.title}。`, "success");
    addLog(teachingNotes[target]);
  } else if (current.target === target) {
    state.stageChangedAt = performance.now();
    state.finished = true;
    addLog("模拟完成。腺叶已取出，止血已控制，切口已关闭。", "success");
    addLog(teachingNotes[target]);
  }
  renderStatus();
  renderCompletionScreen();
}

function resetSimulation() {
  state = initialState();
  feedbackLog.innerHTML = "";
  addLog("模拟已重置。请从查看主要解剖标志开始。");
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
    addLog("该位置没有关键结构。请尝试点击高亮的解剖区域。", "warning");
    return;
  }

  if (stages[state.stage].target === "superiorPole") {
    if (!state.completed.has("rightEBSLN") && state.tool !== "nerveProbe") {
      addLog("请先完成步骤 6A：选择“神经探针”，点击上极上方紫色虚线的喉上神经外支。暂时不要夹闭血管。", "warning");
      return;
    }
    const superiorEnergyTools = ["clip", "harmonic", "advancedBipolar"];
    if (state.completed.has("rightEBSLN") && !superiorEnergyTools.includes(state.tool) && !["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) {
      addLog("下一步是 6B：选择“施夹器”“超声刀”或“高级双极”，然后点击红色上极动脉和蓝色上极静脉旁的虚线圈。", "warning");
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
    penalize(14, `不安全接触：${zone.label}。游离甲状腺时必须保护神经和甲状旁腺。`);
    return;
  }

  if (zone.type === "critical" && state.tool !== "inspect") {
    penalize(12, `${zone.label}不在本模型的安全甲状腺被膜分离层面内。`);
    return;
  }

  if (state.tool === "scalpel") {
    if (zone.id === "incision") {
      const depth = state.settings.depth;
      state.incisionProgress += depth >= 3 ? 1.25 : 1;
      addLog(depth >= 3 ? "较深刀深让切口迅速打开。请勿在深部解剖附近使用这种深度。" : "领式切口已沿计划皮肤线延长。");
      if (state.incisionProgress >= 2) advance("incision");
    } else if (zone.id === "isthmus" && stages[state.stage].target === "isthmus") {
      state.completed.add("isthmus");
      addLog("右叶游离后，已在气管前方离断峡部。", "success");
      advance("isthmus");
    } else {
      const penalty = state.settings.depth >= 3 ? 13 : 8;
      penalize(penalty, "在这个简化步骤中，手术刀应停留在标记的皮肤切口线上。", zone.type === "vein" ? 1 : 0);
    }
  }

  if (state.tool === "retractor") {
    if (zone.id === "flapPlane") {
      const traction = state.settings.traction;
      state.flapProgress += traction >= 3 ? 1.1 : 0.75;
      addLog("已从领式切口掀起颈阔肌下皮瓣，建立操作显露。", "success");
      if (state.flapProgress >= 2) advance("flaps");
    } else if (zone.id === "strapWindow") {
      const traction = state.settings.traction;
      state.exposureProgress += traction >= 3 ? 1.15 : 0.8;
      if (traction >= 4) state.safety = Math.max(0, state.safety - 3);
      addLog(traction >= 4 ? "强牵拉打开了带状肌窗口，但过度牵拉会牵扯邻近组织。" : "带状肌已在正中分开，甲状腺被膜已经显露。", "success");
      if (state.exposureProgress >= 1) advance("strap");
    } else {
      addLog("先在皮瓣层面使用拉钩，然后再用于带状肌正中窗口。", "warning");
    }
  }

  if (state.tool === "monopolar") {
    if (zone.id === "flapPlane" || zone.id === "incision") {
      addLog(`单极${state.settings.monoMode}模式已在浅层使用，功率 ${state.settings.monoPower}。`, "success");
      if (zone.id === "flapPlane") {
        state.flapProgress += 1.1;
        if (state.flapProgress >= 2) advance("flaps");
      }
    } else {
      penalize(10 + state.settings.monoPower, "在本模拟中，单极能量对深部甲状腺床目标热扩散过大。请改用超声刀、高级双极、施夹器或冷分离。", 1);
    }
  }

  if (state.tool === "dissector") {
    if (zone.type === "parathyroid") {
      if (state.settings.pressure >= 4) {
        penalize(5, "分离器在甲状旁腺附近压力过大会造成失血供风险。请更轻柔。");
      }
      state.completed.add(zone.id);
      addLog(`已识别并保留${zone.label}。注意它位于后方，血供十分脆弱。`, "success");
      const found = ["rightParaSup", "rightParaInf"].every((id) => state.completed.has(id));
      if (found) advance("parathyroids");
    } else if (zone.type === "lymph") {
      if (stages[state.stage].target !== "centralNodes") {
        addLog("在本教学流程中，中央区淋巴组织应在甲状腺游离并取出标本后处理。", "warning");
      } else if (!state.removed) {
        addLog("请先取出右叶，使中央区层面清楚可见。", "warning");
      } else {
        state.nodalMobilized.add(zone.id);
        addLog(`${zone.label}已作为淋巴结包块游离。避免牵拉喉返神经，并保留甲状旁腺灌注。`, "success");
        if (["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id) => state.nodalMobilized.has(id))) {
          advance("centralNodes");
        }
      }
    } else if (zone.id === "berryLigament") {
      if (!state.completed.has("rightRLN")) {
        penalize(12, "只有在右侧喉返神经已定位并保持可见时，才应松解贝里韧带。");
      } else {
        state.completed.add("berry");
        addLog("已在保护气管食管沟内喉返神经的情况下松解贝里韧带。", "success");
        advance("berry");
      }
    } else if (zone.id === "isthmus") {
      state.completed.add("isthmus");
      addLog("已从气管前方离断峡部，使右叶与左侧甲状腺分离。", "success");
      advance("isthmus");
    } else if (zone.type === "thyroid") {
      addLog("已沿甲状腺叶周围建立被膜旁分离层面。");
    } else {
      addLog("在离断血管前，请用钝性分离显露后方小的甲状旁腺。", "warning");
    }
  }

  if (state.tool === "nerveProbe") {
    if (zone.type === "nerve") {
      if (stages[state.stage].target === "superiorPole" && zone.id !== "rightEBSLN") {
        addLog("步骤 6A 请点击右侧上极上方紫色虚线的喉上神经外支，而不是喉返神经。", "warning");
        renderStatus();
        draw();
        return;
      }
      state.completed.add(zone.id);
      addLog(`${zone.label}已在灵敏度 ${state.settings.sensitivity} 下定位。夹闭血管和牵拉前应保持可见。`, "success");
      if (zone.id === "rightEBSLN" && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
      if (zone.id === "rightRLN") advance("rln");
    } else {
      addLog("神经探针用于寻找气管食管沟内的右侧喉返神经，以及上极附近的喉上神经外支。", "warning");
    }
  }

  if (state.tool === "harmonic" || state.tool === "advancedBipolar") {
    handleEnergyDevice(zone, point);
  }

  if (state.tool === "clip") {
    if (["artery", "vein"].includes(zone.type)) {
      if (stages[state.stage].target === "superiorPole" && !["rightSupArt", "rightSupVein"].includes(zone.id)) {
        addLog("步骤 6B 只在被膜旁虚线圈处夹闭上甲状腺动脉和上甲状腺静脉。", "warning");
        renderStatus();
        draw();
        return;
      }
      if (zone.id === "rightMidVein") {
        state.vesselsClipped.add(zone.id);
        addLog("甲状腺中静脉已夹闭并离断，可将右叶由外向内游离。", "success");
        advance("middleVein");
        renderStatus();
        draw();
        return;
      }
      if (["rightInfArt", "rightInfVein"].includes(zone.id) && !state.completed.has("rightRLN")) {
        penalize(10, "在定位右侧喉返神经前放置夹子会增加神经损伤风险。", 1);
      }
      if (["rightSupArt", "rightSupVein"].includes(zone.id) && !state.completed.has("rightEBSLN")) {
        penalize(7, "未识别喉上神经外支前夹闭上极血管，可能影响音高和声音投射。", 0);
      }
      if (["rightSupArt", "rightSupVein"].includes(zone.id) && !nearSuperiorCapsule(point, zone.id)) {
        addLog("“靠近被膜”是指夹闭上极血管靠近甲状腺上极的下端，而不是高位或外侧血管起点。请点击甲状腺旁的高亮圈。", "warning");
        renderStatus();
        draw();
        return;
      }
      state.vesselsClipped.add(zone.id);
      addLog(`${zone.label}已用${state.settings.clipSize}号夹在甲状腺被膜旁夹闭，角度 ${state.settings.angle} 度。`, "success");
      if (state.completed.has("rightEBSLN") && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
      if (["rightInfArt", "rightInfVein"].every((id) => state.vesselsClipped.has(id))) advance("inferiorPole");
    } else {
      penalize(7, "施夹器用于命名血管，不用于腺体、神经、气道或甲状旁腺组织。");
    }
  }

  if (state.tool === "forceps") {
    if (zone.id === "rightThyroid" || zone.id === "nodule") {
      if (!["middleVein", "superiorPole", "parathyroids", "rln", "inferiorPole", "berry", "isthmus"].every((id) => state.completed.has(id))) {
        penalize(12, "必须完成真实的游离顺序后，才能取出腺叶。", 2);
      } else {
        if (state.settings.grip >= 5) state.safety = Math.max(0, state.safety - 4);
        state.removed = true;
        state.removedAt = performance.now();
        advance("remove");
      }
    } else {
      addLog("镊钳应夹持已游离的右侧甲状腺叶，而不是受保护结构。", "warning");
    }
  }

  if (state.tool === "cautery") {
    if (zone.type === "bleed" || ["artery", "vein"].includes(zone.type)) {
      state.bleeding = Math.max(0, state.bleeding - Math.max(1, Math.ceil(state.settings.power / 2)));
      state.cauterized.add(zone.id);
      state.heat = Math.min(5, state.heat + state.settings.power);
      addLog(`已用${state.settings.mode}能量控制出血，功率 ${state.settings.power}。`, "success");
      if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) advance("hemostasis");
      if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) addLog("术野已干燥。请用“缝合”关闭切口。", "success");
    } else if (zone.type === "nerve" || zone.type === "parathyroid") {
      penalize(12 + state.settings.power, "神经或甲状旁腺附近的热扩散很危险。请谨慎使用聚焦能量。");
    } else {
      addLog("电凝最适合用于出血点和血管断端。", "warning");
    }
  }

  if (state.tool === "suture") {
    if (stages[state.stage].target === "close" && state.bleeding === 0 && zone.id === "incision") {
      advance("close");
    } else {
      addLog("只有在取出标本并完成止血后，才沿切口线关闭。", "warning");
    }
  }

  renderStatus();
  draw();
}

function handleEnergyDevice(zone, point) {
  const isHarmonic = state.tool === "harmonic";
  const name = isHarmonic ? "超声刀" : "高级双极";
  const power = isHarmonic ? state.settings.harmonicPower : state.settings.sealPower;
  const activationRisk = isHarmonic && state.settings.activation === "长时" ? 2 : 0;

  if (["nerve", "parathyroid"].includes(zone.type)) {
    penalize(16 + power + activationRisk, `${name}激发位置离${zone.label}太近。能量器械在喉返神经和甲状旁腺附近必须保持可见安全距离并等待冷却。`);
    return;
  }

  if (zone.type === "critical") {
    penalize(14 + power, `${name}不应用于${zone.label}。能量应停留在甲状腺被膜/血管层面。`);
    return;
  }

  state.heat = Math.min(6, state.heat + power + activationRisk);

  if (state.heat > 5) {
    penalize(5, "热负荷较高。靠近神经或甲状旁腺前，请暂停并等待器械冷却。");
  }

  if (zone.id === "strapWindow") {
    state.exposureProgress += isHarmonic ? 0.9 : 0.65;
    addLog(`${name}已用短时可控激发打开无血管的带状肌正中层面。`, "success");
    if (state.exposureProgress >= 1) advance("strap");
    return;
  }

  if (zone.id === "flapPlane" && isHarmonic) {
    state.flapProgress += 0.8;
    addLog(`${name}辅助了浅层皮瓣掀起；但在本模拟中，宽阔浅层面通常使用单极电钩。`, "success");
    if (state.flapProgress >= 2) advance("flaps");
    return;
  }

  if (zone.type === "lymph") {
    if (stages[state.stage].target !== "nodeClearance") {
      addLog(`在冷分离游离淋巴结包块前，${name}不应离断中央区淋巴组织。`, "warning");
      return;
    }
    if (!state.nodalMobilized.has(zone.id)) {
      addLog(`请先用“分离器”游离${zone.label}，让淋巴血管蒂清楚可见后再激发能量。`, "warning");
      return;
    }

    state.nodalCleared.add(zone.id);
    addLog(`${name}已封闭细小淋巴血管蒂，并将${zone.label}从中央区清除。`, "success");
    if (["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id) => state.nodalCleared.has(id))) {
      advance("nodeClearance");
    }
    return;
  }

  if (["rightMidVein", "rightSupArt", "rightSupVein", "rightInfArt", "rightInfVein"].includes(zone.id)) {
    if (["rightSupArt", "rightSupVein"].includes(zone.id)) {
      if (!state.completed.has("rightEBSLN")) {
        penalize(10, `在定位喉上神经外支前，${name}靠近上极血管会增加声音相关神经损伤风险。`);
        return;
      }
      if (!nearSuperiorCapsule(point, zone.id)) {
        addLog(`${name}应在被膜旁圈处封闭上极血管，而不是在靠近喉上神经外支的高位处理。`, "warning");
        return;
      }
    }
    if (["rightInfArt", "rightInfVein"].includes(zone.id) && !state.completed.has("rightRLN")) {
      penalize(12, `在识别喉返神经前，${name}靠近下极血管会带来热性神经损伤风险。`);
      return;
    }

    state.vesselsClipped.add(zone.id);
    addLog(`${name}已封闭并离断${zone.label}。`, "success");
    if (zone.id === "rightMidVein") advance("middleVein");
    if (state.completed.has("rightEBSLN") && ["rightSupArt", "rightSupVein"].every((id) => state.vesselsClipped.has(id))) advance("superiorPole");
    if (["rightInfArt", "rightInfVein"].every((id) => state.vesselsClipped.has(id))) advance("inferiorPole");
    return;
  }

  if (zone.id === "berryLigament" || zone.id === "isthmus") {
    if (zone.id === "isthmus") {
      state.completed.add("isthmus");
      addLog(`${name}已在气管前方短时激发并离断峡部。`, "success");
      advance("isthmus");
      return;
    }
    addLog(`${name}可以使用，但在本教学模式中，贝里韧带处因喉返神经和气管很近，应采用冷分离。`, "warning");
    return;
  }

  if (zone.type === "bleed") {
    state.bleeding = Math.max(0, state.bleeding - (isHarmonic ? 1 : 2));
    addLog(`${name}已控制出血点；靠近关键解剖时激发应短。`, "success");
    if (stages[state.stage].target === "hemostasis" && state.bleeding === 0) advance("hemostasis");
    return;
  }

  addLog(`${name}最适合血管目标或无血管层面。激发能量前请先识别解剖。`, "warning");
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
    ctx.fillText("带状肌分离前覆盖甲状腺", center, 154);
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
    ctx.fillText("已牵开的带状肌", 540, 118);
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
  drawLabel("气管", 548, 164 + bodyY);
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
    drawLabel("出血", 768, 386 + bodyY, "left");
  }

  if (state.removed) {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    roundRect(586, 210, 220, 310, 60);
    ctx.fill();
    drawLabel("右叶已取出", 700, 366);
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
    drawLabel("颈动脉鞘", 186, 118);
    drawLabel("颈动脉鞘", 880, 118);
    drawLabel("食管沟", 545, 528);
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
    drawLabel("喉", 548, 102 + bodyY);
    drawLabel("环状软骨", 548, 214 + bodyY);
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
    drawLabel("贝里韧带", 670, 292 + bodyY, "left");
    drawLabel("祖克坎德尔结节", 634, 276 + bodyY, "left");
  }
  ctx.restore();
}

function drawCentralNodePackets(bodyY, motion) {
  const packets = [
    { id: "delphianNodes", x: 548, y: 236 + bodyY, rx: 42, ry: 28, label: "喉前" },
    { id: "pretrachealNodes", x: 548, y: 474 + bodyY, rx: 54, ry: 48, label: "气管前" },
    { id: "rightParatrachealNodes", x: 650, y: 452 + bodyY, rx: 52, ry: 82, label: "右气管旁" }
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
    ctx.fillText("6A：先探查紫色虚线的喉上神经外支", 664, 134 + bodyY);
    ctx.restore();
    return;
  }

  const targets = [
    { id: "rightSupArt", x: 710, y: 218 + bodyY, color: "#d83b44", label: state.vesselsClipped.has("rightSupArt") ? "动脉已夹闭" : "6B：夹闭动脉" },
    { id: "rightSupVein", x: 724, y: 256 + bodyY, color: "#3c6fc0", label: state.vesselsClipped.has("rightSupVein") ? "静脉已夹闭" : "6C：夹闭静脉" }
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
  ctx.fillText("标本", 890, 590);
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
    inspect: ["观察甲状腺随气道轻微移动。", "悬停或点击结构学习名称。"],
    incision: ["先打开皮肤。", "深部中央解剖仍受保护。"],
    flaps: ["浅层使用单极电钩。", "保持在皮瓣层面。"],
    strap: ["此处使用超声刀。", "短时激发打开正中。"],
    middleVein: ["使用超声刀或高级双极。", "内旋前先封闭。"],
    superiorPole: state.completed.has("rightEBSLN")
      ? ["6B：使用夹闭或能量器械。", "点击每个被膜旁虚线圈。"]
      : ["6A：使用神经探针。", "点击紫色虚线的喉上神经外支。"],
    parathyroids: ["保护后方黄色腺体。", "保留血供。"],
    rln: ["喉返神经沿沟上行。", "深入松解前保持可见。"],
    inferiorPole: ["使用高级双极/超声刀。", "须先完成喉返神经定位。"],
    berry: ["贝里韧带将甲状腺固定于气管。", "这是喉返神经高风险区。"],
    isthmus: ["在峡部使用能量器械。", "气管前方短时激发。"],
    remove: ["右叶向外旋出。", "结节随标本取出。"],
    centralNodes: ["用分离器处理每个淋巴结包块。", "喉返神经和甲状旁腺仍是危险层面。"],
    nodeClearance: ["封闭可见淋巴血管蒂。", "清扫包块，而不是零散摘除。"],
    hemostasis: ["先显露清楚，再控制出血。", "确认甲状腺床干燥。"],
    close: ["先保证术野干燥。", "然后分层关闭。"]
  }[target] || ["跟随高亮解剖区域。", "使用匹配的器械。"];
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundRect(44, 34, 276, 76, 8);
  ctx.fill();
  ctx.fillStyle = "#0e5965";
  ctx.font = "800 14px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("动态解剖提示", 60, 60);
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
addLog("请先使用“查看”。术前悬停或点击结构来学习解剖。");

function animationLoop(now) {
  const dt = Math.max(0, Math.min(0.05, (now - state.lastFrame) / 1000 || 0));
  state.lastFrame = now;
  state.heat = Math.max(0, state.heat - dt * 0.55);
  draw();
  requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);
