const canvas=document.getElementById("simCanvas");
const ctx=canvas.getContext("2d");
const tooltip=document.getElementById("tooltip");
const toolGrid=document.getElementById("toolGrid");
const feedbackLog=document.getElementById("feedbackLog");
const checklist=document.getElementById("checklist");
const stageNumber=document.getElementById("stageNumber");
const safetyScore=document.getElementById("safetyScore");
const hemostasisScore=document.getElementById("hemostasisScore");
const stageTitle=document.getElementById("stageTitle");
const stageInstruction=document.getElementById("stageInstruction");
const stageStepBadge=document.getElementById("stageStepBadge");
const resetButton=document.getElementById("resetButton");
const instrumentTitle=document.getElementById("instrumentTitle");
const instrumentBadge=document.getElementById("instrumentBadge");
const instrumentTechnique=document.getElementById("instrumentTechnique");
const instrumentImage=document.getElementById("instrumentImage");
const completionScreen=document.getElementById("completionScreen");
const completionSafety=document.getElementById("completionSafety");
const completionHemostasis=document.getElementById("completionHemostasis");
const restartButton=document.getElementById("restartButton");
const langToggle=document.getElementById("langToggle");
const requestedLang=new URLSearchParams(location.search).get("lang");
function storedLang(){
  try{
    return localStorage.getItem("thyroidSimLang")
  }
  catch{
    return null
  }
}
function saveLang(value){
  try{
    localStorage.setItem("thyroidSimLang", value)
  }
  catch{
  }
}
const savedLang=storedLang();
let currentLang=requestedLang==="zh"||(!requestedLang&&savedLang==="zh")?"zh": "en";
const TX={
  "en": [
    "Inspect",
    "Hover/click to identify anatomy",
    "Scalpel",
    "Create the collar incision",
    "Retractor",
    "Open exposure and separate strap muscles",
    "Dissector",
    "Develop planes and expose structures",
    "Nerve Probe",
    "Confirm the recurrent laryngeal nerve",
    "Clip Applier",
    "Ligate named vessels close to the gland",
    "Harmonic Focus",
    "Seal/divide small vessels",
    "Advanced Bipolar",
    "Bipolar vessel sealing with cooldown awareness",
    "Monopolar Hook",
    "Use for collar skin incision or superficial flap dissection",
    "Bipolar Cautery",
    "Precise point hemostasis",
    "Forceps",
    "Deliver the mobilized lobe",
    "Suture",
    "Close after hemostasis",
    "Identify",
    "Start here. Build the anatomy map before operating: midline trachea, thyroid capsule, posterior parathyroids, vessels, and recurrent laryngeal nerve course.",
    "Incise",
    "Make a shallow, controlled skin incision. Keep the active tip on the planned collar incision before deeper exposure.",
    "Expose",
    "Use balanced traction to lift flaps and open the strap muscle midline window without compressing delicate structures.",
    "Plane",
    "Use blunt capsular dissection. This tool is best for exposing parathyroids, opening tissue planes, and avoiding thermal spread.",
    "Signal",
    "Gently probe along the tracheoesophageal groove or superior-pole nerve target before vessel control.",
    "Ligate",
    "When mechanical control is needed, clip named vessels close to the capsule.",
    "Ultrasonic",
    "Harmonic Focus can seal and divide small vessels, but it must stay away from the RLN, EBSLN, and parathyroids. Use short activations and allow cooldown.",
    "Seal",
    "Advanced bipolar works well for sealing vessels in a dry, visible field. Let the jaws cool before approaching critical structures.",
    "RF",
    "Monopolar energy is a modern tool, but not a casual one: use it only for superficial flaps or skin edges, not near the RLN, parathyroids, or superior-pole nerve.",
    "Energy",
    "Focused bipolar energy is for bleeding points or vessel ends. Higher power is faster but riskier near the RLN or parathyroids.",
    "Traction",
    "After nerve mapping, vessel control, Berry ligament release, and isthmus division, use gentle traction to deliver the mobilized right lobe.",
    "Close",
    "Suture only after the field is dry and the workflow has reached layered closure.",
    "Medium",
    "Short burst",
    "Blend",
    "Coag",
    "Plan and Inspect Neck Anatomy",
    "Use Inspect to identify the larynx, trachea, thyroid lobes, nodule, parathyroids, central node regions, vessels, EBSLN, and RLN.",
    "Create the Collar Incision",
    "Select Scalpel or Monopolar Hook and click once on the marked skin line. This opens the opaque textured skin layer and reveals the superficial fat layer underneath.",
    "Clear Superficial Fat and Raise Flaps",
    "Select Monopolar Hook and click once on the yellow highlighted superficial fat/flap plane. The hook clears this layer so the strap muscles and thyroid field become easier to see.",
    "Open the Strap Muscle Midline",
    "Use Harmonic Focus or Advanced Bipolar in the strap muscle midline window for short, controlled energy-assisted separation. Retractors remain available as backup.",
    "Divide the Middle Thyroid Vein",
    "Use Harmonic Focus or Advanced Bipolar on the middle thyroid vein. The clip applier remains available for a traditional cold-instrument approach.",
    "Identify the EBSLN",
    "Use the Nerve Probe on the purple dashed EBSLN above the superior pole. Confirm the nerve before controlling any nearby vessels.",
    "Identify the Parathyroids",
    "Use the Dissector on the right superior and inferior parathyroids. Leave them in the thyroid bed with their blood supply.",
    "Identify the Recurrent Laryngeal Nerve",
    "Before addressing the inferior pole and Berry ligament, use the Nerve Probe to confirm the right RLN in the tracheoesophageal groove.",
    "Mobilize the Inferior Pole",
    "After RLN identification, use Advanced Bipolar or Harmonic Focus on inferior thyroid artery branches and the inferior venous plexus while preserving parathyroid blood supply.",
    "Release Berry Ligament",
    "With the RLN visible, use the Dissector at Berry ligament to release the posteromedial thyroid from the trachea.",
    "Divide the Isthmus",
    "Use Harmonic Focus or Advanced Bipolar to divide the isthmus over the anterior trachea. Keep activation short and away from the airway.",
    "Remove the Right Lobe with Nodule",
    "After vessels, RLN, Berry ligament, and isthmus are addressed, use Forceps to grasp the freed right thyroid lobe.",
    "Mobilize Central Node Packets",
    "Use the Dissector to mobilize prelaryngeal, pretracheal, and right paratracheal node packets from the laryngeal/tracheal plane while protecting the RLN and parathyroids.",
    "Seal and Clear Central Nodes",
    "Use Harmonic Focus or Advanced Bipolar on each mobilized node packet to control small lymphovascular pedicles and complete ipsilateral central compartment clearance.",
    "Final Hemostasis",
    "Use Bipolar Cautery, Harmonic Focus, or Advanced Bipolar on the highlighted bleeding vessel stump. Confirm the thyroid bed is dry before closure.",
    "Layered Closure",
    "After hemostasis is complete, use Suture at the incision. This simplified model closes strap muscle, platysma, and skin layers.",
    "Basic motion matters: the trachea moves subtly with respiration, and the thyroid moves with it because it is attached to the airway.",
    "The skin layer opens first; the yellow superficial fat/platysma-side layer still needs controlled monopolar dissection before deeper exposure.",
    "Monopolar hook work belongs in the superficial yellow layer. Once it is cleared, the flap animation exposes the strap-muscle window and thyroid field.",
    "Harmonic Focus can efficiently open the avascular midline raphe, but activations should be short and under direct vision.",
    "The middle thyroid vein often tethers the lateral lobe; sealing it with Harmonic Focus or Advanced Bipolar before medial rotation is a common modern step.",
    "Close to the capsule means controlling terminal vessel branches on the thyroid surface, not high near the larynx. This lowers EBSLN injury risk.",
    "Parathyroids should be preserved in situ. The animation places and highlights them posteriorly so you can see how close they are to the thyroid capsule.",
    "Identify the RLN before the inferior pole and Berry ligament because injury near the tracheoesophageal groove can affect vocal cord motion.",
    "After locating the RLN, use Advanced Bipolar or ultrasonic energy on inferior pole branches while preserving parathyroid blood supply.",
    "Berry ligament is a high-risk fixation point where thyroid tissue lies close to the RLN and trachea.",
    "Modern surgery can use energy devices to divide the isthmus, but stay on thyroid tissue over the anterior trachea.",
    "After capsular attachments and vessels are controlled, the right lobe rotates laterally and lifts out.",
    "In a node-positive teaching case, central compartment clearance should be handled as regional packets: prelaryngeal, pretracheal, and ipsilateral paratracheal packets mobilized with the RLN and parathyroid blood supply visible.",
    "During central compartment clearance, control small lymphovascular pedicles rather than plucking individual nodes at random.",
    "A dry thyroid bed matters because postoperative neck hematoma can be dangerous.",
    "Close only after the field is dry. At the end of the case, the incision comes together.",
    "Planned collar incision",
    "A low transverse cervical incision provides access to the thyroid bed.",
    "Larynx and thyroid cartilage",
    "The thyroid sits below the larynx and spans the lower larynx and upper trachea.",
    "Cricoid cartilage",
    "The RLN usually enters the larynx near the cricothyroid joint, just below the cricoid region.",
    "Trachea",
    "The trachea is midline and lies deep to the thyroid isthmus.",
    "Esophagus / tracheoesophageal groove",
    "The RLN usually ascends in or near the tracheoesophageal groove before entering the larynx.",
    "Left thyroid lobe",
    "The thyroid lobes wrap around the anterior and lateral trachea.",
    "Right thyroid lobe with nodule",
    "The simulated nodule is in the right lobe, making this a right lobectomy case.",
    "Thyroid isthmus",
    "The isthmus crosses the anterior tracheal rings below the cricoid.",
    "Thyroid nodule",
    "A suspicious nodule is a common indication for diagnostic lobectomy.",
    "Prelaryngeal node packet",
    "Prelaryngeal nodes sit above the isthmus near the laryngeal midline and belong to the central compartment.",
    "Pretracheal node packet",
    "Pretracheal lymphatic tissue lies in the pretracheal plane and is part of level VI central compartment clearance.",
    "Right paratracheal node packet",
    "Ipsilateral paratracheal tissue is cleared beside the trachea while protecting the right RLN and parathyroid blood supply.",
    "Subplatysmal flap plane",
    "Subplatysmal flaps are raised superiorly and inferiorly from the collar incision.",
    "Strap muscle midline window",
    "Retracting the strap muscles exposes the thyroid capsule.",
    "Berry ligament",
    "Berry ligament anchors the posteromedial thyroid to the trachea, where the RLN is at higher risk.",
    "Zuckerkandl tubercle",
    "This posterior thyroid tubercle is an important landmark near the RLN and superior parathyroid.",
    "Left superior parathyroid",
    "The superior parathyroid usually sits posteriorly near the upper two-thirds of the thyroid, often behind the RLN plane.",
    "Left inferior parathyroid",
    "The inferior parathyroid is more variable and may sit lower or near the thymus; preservation depends on gentle handling and blood supply.",
    "Right superior parathyroid",
    "The superior parathyroid often lies posteriorly near the crossing of the RLN and inferior thyroid artery.",
    "Right inferior parathyroid",
    "Inferior parathyroid position varies; this schematic places the right inferior gland lateral to the RLN and above inferior thyroid artery branches for clarity.",
    "Left recurrent laryngeal nerve",
    "The left RLN usually loops under the aortic arch and ascends in the tracheoesophageal groove.",
    "Right recurrent laryngeal nerve",
    "The right RLN usually loops under the subclavian artery and may run more obliquely; rare nonrecurrent variants exist.",
    "External branch of superior laryngeal nerve",
    "The EBSLN runs near superior pole vessels; injury can affect pitch and voice projection.",
    "Left external branch of superior laryngeal nerve",
    "Protect the EBSLN while controlling superior pole vessels; injury can affect pitch and voice projection.",
    "Right superior thyroid artery",
    "Superior thyroid vessels run to the superior pole; EBSLN risk makes superior pole control delicate.",
    "Right inferior thyroid artery branches",
    "The inferior thyroid artery has variable relationships with the RLN and supplies parathyroid branches, so it requires careful handling.",
    "Right superior thyroid vein",
    "Venous bleeding can obscure nerves and parathyroids.",
    "Middle thyroid vein",
    "The middle thyroid vein often needs control and division during mobilization.",
    "Inferior thyroid venous plexus",
    "Inferior thyroid veins drain into a midline venous plexus and may bleed during inferior pole work.",
    "Right common carotid artery",
    "The carotid sheath forms the lateral boundary of the field.",
    "Right internal jugular vein",
    "The internal jugular vein lies lateral in the carotid sheath and is outside routine capsular dissection.",
    "Left common carotid artery",
    "The carotid sheath lies lateral to the thyroid lobe.",
    "Left internal jugular vein",
    "The internal jugular vein is a lateral boundary and should remain outside capsular thyroid dissection.",
    "Bleeding point",
    "Keep the field clear and control bleeding to operate safely.",
    "Stable",
    "Oozing",
    "Bleeding",
    "Stable",
    "Oozing",
    "Bleeding",
    "Objective complete: {0}.",
    "Simulation complete. The lobe is removed, hemostasis is controlled, and the incision is closed.",
    "Simulation reset. Start with the collar incision. Use Inspect any time to review anatomy without advancing the workflow.",
    "No key structure there. Try clicking the highlighted anatomy target.",
    "First select Nerve Probe and click the purple dashed EBSLN above the superior pole. Do not clip vessels yet.",
    "Next select Clip Applier, Harmonic Focus, or Advanced Bipolar, then click the dashed circles beside the red superior artery and blue superior vein.",
    "Unsafe contact: {0}. Protect nerves and parathyroids during thyroid mobilization.",
    "{0} is outside the safe capsular thyroid dissection plane in this model.",
    "A deeper blade opens the incision quickly. Do not use this depth near deeper anatomy.",
    "The collar incision has been extended along the planned skin line.",
    "After right lobe mobilization, the isthmus is divided over the anterior trachea.",
    "In this simplified step, use Scalpel or Monopolar Hook only along the marked skin incision line.",
    "The yellow superficial layer has been cleared and subplatysmal flaps are raised, creating operative exposure.",
    "Strong traction opened the strap muscle window, but excessive traction can pull adjacent tissue.",
    "The strap muscles are separated in the midline and the thyroid capsule is exposed.",
    "Use the Monopolar Hook for the yellow superficial layer; use retractors after that in the strap muscle midline window.",
    "Monopolar {0} mode used superficially at power {1}.",
    "In this simulation, monopolar energy spreads too much heat for deep thyroid-bed targets. Use Harmonic Focus, Advanced Bipolar, Clip Applier, or cold dissection instead.",
    "Too much dissector pressure near a parathyroid risks devascularization. Be gentler.",
    "{0} identified and preserved. Note its posterior position and fragile blood supply.",
    "In this teaching workflow, central lymphatic tissue is handled after thyroid mobilization and specimen removal.",
    "Remove the right lobe first so the central compartment plane is clearly visible.",
    "{0} mobilized as a node packet. Avoid traction on the RLN and preserve parathyroid perfusion.",
    "Release Berry ligament only after the right RLN has been identified and kept visible.",
    "Berry ligament released while protecting the RLN in the tracheoesophageal groove.",
    "The isthmus is divided over the anterior trachea, separating the right lobe from the left thyroid.",
    "A capsular dissection plane has been developed around the thyroid lobe.",
    "Before dividing vessels, use blunt dissection to expose the small posterior parathyroids.",
    "For this nerve-safety step, click the purple dashed EBSLN above the right superior pole, not the RLN.",
    "{0} mapped at sensitivity {1}. Keep it visible before clipping vessels or applying traction.",
    "The nerve probe is used to find the right RLN in the tracheoesophageal groove and the EBSLN near the superior pole.",
    "This vessel-control step treats only the superior thyroid artery and vein at the capsular dashed circles.",
    "The middle thyroid vein is clipped and divided, allowing medial mobilization of the right lobe.",
    "Placing clips before identifying the right RLN increases nerve injury risk.",
    "Clipping superior pole vessels before identifying the EBSLN may affect pitch and voice projection.",
    "Close to the capsule means controlling superior pole vessels near the lower end of the thyroid superior pole, not high or lateral near their origin. Click the highlighted circles beside the thyroid.",
    "{0} clipped close to the thyroid capsule with a {1} clip at {2} degrees.",
    "The clip applier is for named vessels, not gland, nerve, airway, or parathyroid tissue.",
    "You must complete the proper mobilization sequence before removing the lobe.",
    "Forceps should grasp the mobilized right thyroid lobe, not protected structures.",
    "Bleeding controlled with {0} energy at power {1}.",
    "The field is dry. Use Suture to close the incision.",
    "Thermal spread near nerves or parathyroids is dangerous. Use focused energy carefully.",
    "Cautery is best for bleeding points and vessel ends.",
    "Close along the incision line only after specimen removal and hemostasis.",
    "Harmonic Focus",
    "Advanced Bipolar",
    "Long activation",
    "{0} activation is too close to {1}. Energy devices near the RLN and parathyroids require visible safe distance and cooldown.",
    "{0} should not be used on {1}. Energy should stay on the thyroid capsule or vessel plane.",
    "Thermal load is high. Pause and let the device cool before approaching nerves or parathyroids.",
    "{0} opened the avascular strap muscle midline plane with short, controlled activation.",
    "{0} assisted superficial flap elevation; in this simulation, broad superficial planes usually use monopolar hook.",
    "Before cold dissection mobilizes the node packet, {0} should not divide central compartment lymphatic tissue.",
    "First use the Dissector to mobilize {0}; activate energy only after the lymphovascular pedicle is clearly visible.",
    "{0} sealed small lymphovascular pedicles and cleared {1} from the central compartment.",
    "Before identifying the EBSLN, {0} near superior pole vessels increases voice-related nerve injury risk.",
    "{0} should seal superior pole vessels at the capsular circles, not high near the EBSLN.",
    "Before identifying the RLN, {0} near inferior pole vessels creates thermal nerve injury risk.",
    "{0} sealed and divided {1}.",
    "{0} divided the isthmus with short activation over the anterior tracheal plane.",
    "{0} can be used, but this teaching mode uses cold dissection at Berry ligament because the RLN and trachea are close.",
    "{0} controlled the bleeding point; use short activation near critical anatomy.",
    "{0} is best for vessel targets or avascular planes. Identify anatomy before activating energy.",
    "Strap muscles cover thyroid before separation",
    "Retracted strap muscles",
    "Trachea",
    "Bleeding",
    "Right lobe removed",
    "Carotid sheath",
    "Carotid sheath",
    "Esophageal groove",
    "Larynx",
    "Cricoid cartilage",
    "Berry ligament",
    "Zuckerkandl tubercle",
    "Prelaryngeal",
    "Pretracheal",
    "Right paratracheal",
    "Probe the purple dashed EBSLN first",
    "Artery clipped",
    "Treat artery",
    "Vein clipped",
    "Treat vein",
    "Specimen",
    "Watch the thyroid move subtly with the airway.",
    "Hover or click structures to learn names.",
    "Opaque textured skin covers the field first.",
    "Use Scalpel or Monopolar Hook once on the skin line.",
    "Yellow superficial fat is now visible.",
    "Use Monopolar Hook once on the highlighted layer.",
    "Use Harmonic Focus here.",
    "Short activation opens the midline.",
    "Use Harmonic Focus or Advanced Bipolar.",
    "Seal before medial rotation.",
    "Use clips or energy.",
    "Click each capsular dashed circle.",
    "Use the nerve probe first.",
    "Click the purple dashed EBSLN.",
    "Protect the posterior yellow glands.",
    "Preserve blood supply.",
    "The RLN ascends in the groove.",
    "Keep it visible before deep release.",
    "Use Advanced Bipolar / Harmonic Focus.",
    "Map the RLN first.",
    "Berry ligament fixes the thyroid to the trachea.",
    "This is a high-risk RLN zone.",
    "Use an energy device on the isthmus.",
    "Short activation over the anterior trachea.",
    "The right lobe rotates outward.",
    "The nodule leaves with the specimen.",
    "Use the dissector on each node packet.",
    "The RLN and parathyroids remain danger planes.",
    "Seal visible lymphovascular pedicles.",
    "Clear packets, not scattered individual nodes.",
    "Expose clearly, then control bleeding.",
    "Confirm the thyroid bed is dry.",
    "Make sure the field is dry first.",
    "Then close in layers.",
    "Follow the highlighted anatomy target.",
    "Use the matching instrument.",
    "Dynamic anatomy cue",
    "Start at the highlighted incision. Use Inspect any time to review anatomy without advancing the workflow.",
    "Nanocarbon",
    "Apply carbon nanoparticle contrast",
    "Contrast",
    "Apply nanocarbon to the exposed thyroid tissue/lymphatic field. This teaching model darkens that field while the parathyroid glands remain yellow before mobilization and develop a red center afterward.",
    "Apply Nanocarbon Contrast",
    "Use Nanocarbon on the exposed right thyroid lobe before dissecting the parathyroids. Real carbon nanoparticles stain lymphatic or thyroid-draining tissue black and help protect parathyroids by contrast.",
    "Carbon nanoparticle contrast helps identify lymph nodes and protect parathyroids by contrast. Do not apply it directly onto a parathyroid gland.",
    "Nanocarbon applied. The thyroid/lymphatic field now darkens while the parathyroids remain yellow until mobilized, when their centers are shown in red.",
    "Do not inject or paint nanocarbon directly onto a parathyroid gland. Apply it to thyroid tissue or the lymphatic field.",
    "Apply nanocarbon contrast before dissecting the parathyroids.",
    "Apply nanocarbon here.",
    "Click the thyroid lobe, not the gland.",
    "Wrong step. Finish \"{0}\" first: use {1} on the highlighted target.",
    "Opaque textured skin layer",
    "Yellow superficial fat layer",
    "Control the Superior Pole Vessels",
    "After identifying the EBSLN, use Clip Applier, Harmonic Focus, or Advanced Bipolar on the two capsular dashed vessel targets. Control both the artery and vein close to the thyroid capsule."
  ],
  "zh": [
    "观察",
    "移动鼠标或点击结构，可查看解剖名称和说明",
    "手术刀",
    "沿低位横行颈部切口切开皮肤",
    "拉钩",
    "牵开皮瓣和颈前带状肌，扩大术野",
    "钝性分离器",
    "进入正确层面，显露关键结构",
    "神经探针",
    "定位并确认喉返神经",
    "施夹器",
    "靠近腺体被膜处理明确血管",
    "超声刀",
    "封闭并离断小血管",
    "高级双极",
    "双极血管封闭，注意冷却时间",
    "单极电钩",
    "可用于低位横切口或浅表皮瓣层面",
    "双极电凝",
    "用于精准点状止血",
    "组织镊",
    "轻柔夹持已游离的腺叶",
    "缝合",
    "确认止血后分层关闭",
    "识别",
    "先从这里开始。动手前先建立空间概念：正中是气管，甲状腺包绕气管前外侧，甲状旁腺多在后方，血管和喉返神经贴近被膜走行。",
    "切开",
    "做浅、稳、可控的皮肤切口。进入深层前，器械工作端始终沿低位横行切口线前进。",
    "显露",
    "均匀牵开皮瓣和带状肌，扩大术野，同时避免挤压神经、甲状旁腺和血管。",
    "层面",
    "沿被膜旁做钝性分离。它适合找甲状旁腺、打开安全层面，也能避免不必要的热损伤。",
    "信号",
    "处理血管前，先沿气管食管沟或上极附近轻柔探查神经走行。",
    "结扎",
    "需要机械性封闭时，在靠近甲状腺被膜的位置夹闭已经明确的血管。",
    "超声",
    "超声刀可以封闭并离断小血管，但不要靠近喉返神经、喉上神经外支或甲状旁腺。每次激发要短，之后给器械冷却时间。",
    "封闭",
    "高级双极适合在干燥、看得清的术野中封闭血管。靠近关键结构前，先确认钳口已经冷却。",
    "射频",
    "单极电钩可以用于现代开放手术的浅层皮瓣处理，但不要带到甲状腺床深处，更不能靠近喉返神经、甲状旁腺或上极神经。",
    "能量",
    "双极电凝用于小出血点或血管断端。功率越高越快，但靠近神经或甲状旁腺时风险也更高。",
    "牵引",
    "在完成神经定位、血管控制、贝里韧带松解和峡部处理后，再轻柔牵引并取出右叶。",
    "关闭",
    "只有在甲状腺床干燥、流程进入关闭阶段后，才开始分层缝合。",
    "中",
    "短时",
    "混切",
    "凝血",
    "先观察颈部解剖",
    "使用“观察”识别喉、气管、双侧甲状腺叶、结节、甲状旁腺、中央区淋巴结、血管、喉上神经外支和喉返神经。",
    "做低位横行颈部切口",
    "选择“手术刀”或“单极电钩”，在标记的皮肤切口线上点击一次。皮肤层打开后，会露出下方的浅层脂肪层。",
    "清理浅层脂肪并掀起皮瓣",
    "选择“单极电钩”，在高亮的浅层脂肪/皮瓣层面点击一次。清理这一层后，带状肌和甲状腺术野会更清楚。",
    "打开颈前带状肌正中间隙",
    "在带状肌正中间隙使用“超声刀”或“高级双极”，短时、可控地分开无血管层面。必要时可用拉钩辅助显露。",
    "处理甲状腺中静脉",
    "在甲状腺中静脉处使用“超声刀”或“高级双极”。如果走传统冷器械路线，也可以用施夹器。",
    "确认喉上神经外支",
    "使用“神经探针”点击上极上方紫色虚线标出的喉上神经外支。确认神经后，再处理附近血管。",
    "识别并保留甲状旁腺",
    "用“钝性分离器”点击右上、右下甲状旁腺。目标是原位保留，同时尽量保住血供。",
    "识别喉返神经",
    "处理下极和贝里韧带之前，先用“神经探针”确认气管食管沟内的右侧喉返神经。",
    "游离甲状腺下极",
    "确认喉返神经后，再用“高级双极”或“超声刀”处理甲状腺下动脉分支和下方静脉丛，同时保护甲状旁腺血供。",
    "松解贝里韧带",
    "在喉返神经清楚可见的前提下，用“钝性分离器”松解贝里韧带，将甲状腺后内侧从气管旁分离出来。",
    "离断甲状腺峡部",
    "在气管前方用“超声刀”或“高级双极”离断峡部。激发要短，位置要离气道远一点。",
    "取出带结节的右叶",
    "血管、喉返神经、贝里韧带和峡部都处理完成后，用“组织镊”夹持已游离的右侧甲状腺叶。",
    "游离中央区淋巴结组织",
    "用“钝性分离器”将喉前、气管前和右侧气管旁淋巴脂肪组织从喉/气管平面上游离，同时保护喉返神经和甲状旁腺血供。",
    "封闭并清扫中央区淋巴结",
    "对每个已游离的淋巴结组织包块使用“超声刀”或“高级双极”，控制细小淋巴血管蒂，完成同侧中央区清扫。",
    "最终检查止血",
    "在高亮的出血血管断端使用“双极电凝”“超声刀”或“高级双极”。关闭前要确认甲状腺床是干的。",
    "分层关闭切口",
    "止血完成后，在切口处使用“缝合”。本简化模型按带状肌、颈阔肌、皮肤分层关闭。",
    "注意基础动态：气管会随呼吸轻微移动，甲状腺附着在气道上，也会跟着一起动。",
    "皮肤层先打开；浅层脂肪/颈阔肌旁层仍需用单极电钩受控分离，之后才能进入更深层显露。",
    "单极电钩应只用于浅层组织。清理后，皮瓣动画会显露带状肌窗口和甲状腺术野。",
    "超声刀可以快速打开无血管的正中层面，但每次激发都要短，并且必须在直视下进行。",
    "甲状腺中静脉常把外侧腺叶固定住；在把腺叶向内侧翻转前，先用超声刀或高级双极处理它，是很常见的现代做法。",
    "“靠近被膜”是指在甲状腺表面处理血管末梢，而不是在喉部附近高位处理。这样可以降低喉上神经外支损伤风险。",
    "甲状旁腺应尽量原位保留。动画把它们放在后方并高亮，是为了让你看清它们离甲状腺被膜有多近。",
    "处理下极和贝里韧带前先找喉返神经，因为气管食管沟附近的损伤会影响声带运动。",
    "确认喉返神经后，可以用高级双极或超声能量处理下极小分支，但要保护甲状旁腺血供。",
    "贝里韧带是高风险固定点，甲状腺在这里贴近气管和喉返神经。",
    "现代手术可用能量器械离断峡部，但操作应停留在气管前方的甲状腺组织上。",
    "被膜附着和血管都处理好后，右叶会向外旋出并被取出。",
    "在这个有可疑淋巴结的教学病例中，中央区清扫按区域成块处理：喉前、气管前和同侧气管旁组织都要在喉返神经和甲状旁腺血供可见的情况下游离。",
    "中央区清扫要控制细小淋巴血管蒂，不要像摘散点一样随意一颗颗取。",
    "甲状腺床必须干燥。术后颈部血肿可能压迫气道，是危险并发症。",
    "确认术野干燥后再关闭。病例结束时，切口会分层合拢。",
    "预定低位横切口",
    "低位横行颈部切口可以进入甲状腺床。",
    "喉与甲状软骨",
    "甲状腺位于喉的下方，覆盖下喉部和上段气管前外侧。",
    "环状软骨",
    "喉返神经通常在环甲关节附近入喉，位置接近环状软骨下方。",
    "气管",
    "气管位于正中，甲状腺峡部横跨其前方。",
    "食管/气管食管沟",
    "喉返神经通常沿气管食管沟或其附近上行，随后进入喉部。",
    "左侧甲状腺叶",
    "甲状腺左右叶包绕气管前方和外侧。",
    "伴结节的右侧甲状腺叶",
    "本模拟把结节放在右叶，因此流程设计为右侧腺叶切除。",
    "甲状腺峡部",
    "峡部横跨环状软骨下方的气管环前方。",
    "甲状腺结节",
    "可疑甲状腺结节是诊断性腺叶切除的常见原因之一。",
    "喉前淋巴结组织",
    "喉前淋巴结位于峡部上方、喉部正中附近，属于中央区。",
    "气管前淋巴结组织",
    "气管前淋巴脂肪组织位于气管前平面，是 VI 区中央区清扫的一部分。",
    "右侧气管旁淋巴结组织",
    "清扫同侧气管旁组织时，要同时保护右侧喉返神经和甲状旁腺血供。",
    "颈阔肌下皮瓣层面",
    "从低位横切口向上、向下掀起颈阔肌下皮瓣，以建立显露。",
    "带状肌正中间隙",
    "沿正中分开并牵开带状肌后，甲状腺被膜才会充分显露。",
    "贝里韧带",
    "贝里韧带把甲状腺后内侧固定在气管旁，喉返神经在这里尤其容易受影响。",
    "Zuckerkandl 结节",
    "这是甲状腺后方突起，是寻找喉返神经和上甲状旁腺时的重要标志。",
    "左上甲状旁腺",
    "上甲状旁腺通常位于甲状腺上三分之二附近的后方，常在喉返神经平面的后方。",
    "左下甲状旁腺",
    "下甲状旁腺位置变异更大，可更低或接近胸腺；保护依赖轻柔操作和血供保留。",
    "右上甲状旁腺",
    "上甲状旁腺常位于后方，接近喉返神经和甲状腺下动脉交叉处。",
    "右下甲状旁腺",
    "下甲状旁腺位置变化较大；为便于观察，本示意把右下腺体放在喉返神经外侧、下动脉分支上方。",
    "左侧喉返神经",
    "左侧喉返神经通常绕主动脉弓后，沿气管食管沟上行。",
    "右侧喉返神经",
    "右侧喉返神经通常绕锁骨下动脉，走行可更斜；少数患者存在非返性变异。",
    "喉上神经外支",
    "喉上神经外支贴近上极血管，损伤后可能影响高音和发声力度。",
    "左侧喉上神经外支",
    "处理上极血管时要保护喉上神经外支；损伤后可能影响高音和发声力度。",
    "右上甲状腺动脉",
    "上甲状腺血管进入上极，因喉上神经外支邻近，处理时要靠近被膜并保持谨慎。",
    "右下甲状腺动脉分支",
    "甲状腺下动脉与喉返神经关系多变，还给甲状旁腺供血，因此处理时要特别小心。",
    "右上甲状腺静脉",
    "静脉出血会遮挡神经和甲状旁腺，让术野变得不安全。",
    "甲状腺中静脉",
    "游离外侧腺叶时，甲状腺中静脉常需要先控制再离断。",
    "甲状腺下静脉丛",
    "甲状腺下静脉汇入正中静脉丛，下极操作时容易出血。",
    "右颈总动脉",
    "颈动脉鞘是术野外侧边界。",
    "右颈内静脉",
    "颈内静脉位于颈动脉鞘内偏外侧，不属于常规被膜旁分离范围。",
    "左颈总动脉",
    "颈动脉鞘位于甲状腺叶外侧，是重要边界。",
    "左颈内静脉",
    "颈内静脉是外侧边界，应保持在甲状腺被膜分离范围之外。",
    "出血点",
    "保持术野清楚并及时止血，才能安全继续。",
    "稳定",
    "渗血",
    "出血",
    "稳定",
    "渗血",
    "出血",
    "已完成：{0}",
    "模拟结束：腺叶已取出，止血已完成，切口已关闭。",
    "模拟已重置。请从低位横切口开始；需要复习解剖时，可随时使用“观察”，但它不会推进流程。",
    "这里没有关键结构。请点击高亮的目标区域。",
    "请先选择“神经探针”，点击上极上方紫色虚线标出的喉上神经外支。先不要处理血管。",
    "接下来选择“施夹器”“超声刀”或“高级双极”，点击红色上极动脉和蓝色上极静脉旁的虚线圈。",
    "危险接触：{0}。游离甲状腺时要保护神经和甲状旁腺。",
    "{0}不在本模型的安全被膜旁分离层面内。",
    "较深的刀深能让切口更快打开，但不要在深部解剖附近这样使用。",
    "低位横切口已沿标记线延长。",
    "右叶游离后，已在气管前方离断峡部。",
    "在这个简化步骤中，手术刀或单极电钩只应沿标记的皮肤切口线操作。",
    "浅层组织已清理，颈阔肌下皮瓣已掀起，术野开始显露。",
    "强牵拉打开了带状肌窗口，但过度牵拉会带动邻近组织。",
    "带状肌已从正中分开，甲状腺被膜已经显露。",
    "浅层组织先用单极电钩处理；完成后，再用拉钩进入带状肌正中间隙。",
    "单极{0}模式已用于浅层，功率 {1}。",
    "在本模拟中，单极能量对深部甲状腺床热扩散过大。请改用超声刀、高级双极、施夹器或冷分离。",
    "在甲状旁腺附近用分离器太用力，可能影响血供。请更轻。",
    "已识别并保留{0}。注意它位于后方，血供很脆弱。",
    "在本教学流程中，中央区淋巴组织应在甲状腺游离并取出标本后处理。",
    "请先取出右叶，这样中央区层面会更清楚。",
    "{0}已作为淋巴结组织包块游离。避免牵拉喉返神经，并保留甲状旁腺血供。",
    "只有在右侧喉返神经已定位并保持可见时，才处理贝里韧带。",
    "贝里韧带已松解，同时保护了气管食管沟内的喉返神经。",
    "峡部已在气管前方离断，右叶与左叶分离。",
    "已沿甲状腺叶建立被膜旁分离层面。",
    "离断血管前，先用钝性分离显露后方小甲状旁腺。",
    "这个神经安全步骤要点击右侧上极上方紫色虚线的喉上神经外支，不是喉返神经。",
    "{0}已定位，灵敏度 {1}。夹闭血管或牵拉前要保持它可见。",
    "神经探针用于寻找气管食管沟内的右侧喉返神经，以及上极附近的喉上神经外支。",
    "这个血管处理步骤只处理被膜旁虚线圈处的上甲状腺动脉和上甲状腺静脉。",
    "甲状腺中静脉已控制并离断，可以继续将右叶向内侧翻转。",
    "在确认右侧喉返神经前就放置血管夹，会增加神经损伤风险。",
    "未确认喉上神经外支前处理上极血管，可能影响高音和发声力度。",
    "“靠近被膜”是指在甲状腺上极表面附近处理血管末梢，不是在高位或外侧血管起点处理。请点击甲状腺旁的高亮圈。",
    "{0}已用 {1} 号夹在被膜旁夹闭，角度 {2} 度。",
    "施夹器用于明确血管，不用于夹腺体、神经、气道或甲状旁腺。",
    "请先完成正确的游离顺序，再取出腺叶。",
    "组织镊应夹持已游离的右侧甲状腺叶，不要夹受保护结构。",
    "已用{0}能量控制出血，功率 {1}。",
    "术野已干燥。现在可以缝合关闭切口。",
    "神经或甲状旁腺附近的热扩散很危险。能量器械要短时、精准使用。",
    "电凝最适合处理出血点和血管断端。",
    "只有在标本取出并完成止血后，才沿切口线关闭。",
    "超声刀",
    "高级双极",
    "长时激发",
    "{0}激发点离{1}太近。靠近喉返神经或甲状旁腺时，必须保持可见安全距离，并等待器械冷却。",
    "{0}不应作用在{1}上。能量应停留在甲状腺被膜旁或血管层面。",
    "热负荷偏高。靠近神经或甲状旁腺前，请暂停并让器械冷却。",
    "{0}已用短时、可控激发打开无血管的带状肌正中层面。",
    "{0}已辅助掀起浅层皮瓣；在本模拟中，较宽的浅层面通常使用单极电钩。",
    "在用冷分离游离淋巴结组织前，{0}不应用来离断中央区淋巴组织。",
    "请先用“钝性分离器”游离{0}，看清淋巴血管蒂后再使用能量。",
    "{0}已封闭细小淋巴血管蒂，并清除{1}。",
    "确认喉上神经外支前，{0}靠近上极血管会增加发声相关神经损伤风险。",
    "{0}应在被膜旁虚线圈处处理上极血管，不要在靠近喉上神经外支的高位处理。",
    "确认喉返神经前，{0}靠近下极血管会带来热性神经损伤风险。",
    "{0}已封闭并离断{1}。",
    "{0}已在气管前方短时激发，完成峡部离断。",
    "{0}理论上可用，但本教学模式在贝里韧带处采用冷分离，因为这里离喉返神经和气管太近。",
    "{0}已控制出血点；靠近关键解剖时要短时激发。",
    "{0}更适合血管目标或无血管层面。激发前先确认解剖。",
    "带状肌仍覆盖甲状腺",
    "带状肌已牵开",
    "气管",
    "出血",
    "右叶已取出",
    "颈动脉鞘",
    "颈动脉鞘",
    "食管沟",
    "喉",
    "环状软骨",
    "贝里韧带",
    "祖克坎德尔结节",
    "喉前",
    "气管前",
    "右气管旁",
    "先探查紫色虚线标出的喉上神经外支",
    "动脉已夹闭",
    "处理动脉",
    "静脉已夹闭",
    "处理静脉",
    "标本",
    "观察甲状腺如何随气道轻微移动。",
    "把鼠标移到结构上或点击，可查看名称。",
    "皮肤层先覆盖术野。",
    "用手术刀或单极电钩在皮肤切口线上点击一次。",
    "浅层脂肪层已经显露。",
    "用单极电钩点击一次高亮层面。",
    "这里使用超声刀。",
    "短时激发，打开正中层面。",
    "使用超声刀或高级双极。",
    "向内侧翻转前先处理血管。",
    "使用血管夹或能量器械。",
    "点击每个被膜旁虚线圈。",
    "先用神经探针。",
    "点击紫色虚线标出的喉上神经外支。",
    "保护后方黄色小腺体。",
    "尽量保住血供。",
    "喉返神经沿沟内上行。",
    "深部松解前保持可见。",
    "用高级双极或超声刀。",
    "先完成喉返神经定位。",
    "贝里韧带把甲状腺固定在气管旁。",
    "这里是喉返神经高风险区。",
    "峡部可使用能量器械。",
    "在气管前方短时激发。",
    "右叶向外旋出。",
    "结节随标本一起取出。",
    "用钝性分离器处理各区淋巴结组织。",
    "喉返神经和甲状旁腺仍是危险边界。",
    "封闭看得见的淋巴血管蒂。",
    "成块清扫，不要零散摘除。",
    "先看清，再止血。",
    "确认甲状腺床干燥。",
    "先确认术野干燥。",
    "然后分层关闭。",
    "跟随高亮目标。",
    "选择匹配的器械。",
    "动态解剖提示",
    "请从高亮切口开始；需要复习解剖时，可随时使用“观察”，它不会推进流程。",
    "纳米碳",
    "应用碳纳米颗粒示踪",
    "示踪",
    "把纳米碳用于已显露的甲状腺组织/淋巴引流区域。本教学模型会让该区域变暗；甲状旁腺在游离前保持黄色，游离后中央显示为红色。",
    "应用纳米碳示踪",
    "在分离甲状旁腺前，先用“纳米碳”点击已显露的右侧甲状腺叶。真实手术中，碳纳米颗粒主要使淋巴或甲状腺引流组织变黑，从而通过对比保护甲状旁腺。",
    "碳纳米颗粒可帮助识别淋巴结，并通过对比帮助保护甲状旁腺。不要直接涂在甲状旁腺上。",
    "纳米碳已应用。甲状腺/淋巴引流区域变暗；甲状旁腺在游离前保持黄色，游离后中央显示为红色。",
    "不要把纳米碳直接注入或涂到甲状旁腺上。应作用于甲状腺组织或淋巴引流区域。",
    "先应用纳米碳示踪，再分离甲状旁腺。",
    "这里应用纳米碳。",
    "点击甲状腺叶，不要点击腺体。",
    "步骤不对。请先完成“{0}”：选择{1}，点击高亮目标。",
    "皮肤层",
    "浅层脂肪层",
    "处理上极血管",
    "确认喉上神经外支后，使用“施夹器”“超声刀”或“高级双极”处理两个被膜旁虚线血管目标。靠近甲状腺被膜分别控制动脉和静脉。"
  ]
};
const UI={
  "en": {
    "lang": "en",
    "title": "Thyroidectomy Surgery Simulator",
    "topEyebrow": "Educational anatomy simulator",
    "h1": "Thyroidectomy Surgery Simulator",
    "stageLabel": "Stage",
    "safetyLabel": "Safety",
    "hemostasisLabel": "Hemostasis",
    "tools": "Tools",
    "reset": "Reset",
    "selectedInstrument": "Selected instrument",
    "caseTitle": "Case",
    "caseText": "Open right thyroid cancer teaching case with suspicious ipsilateral central-compartment lymph nodes. Complete a careful lobectomy and level VI node clearance while preserving parathyroid and recurrent laryngeal nerve function.",
    "legend": "Anatomy Legend",
    "thyroid": "Thyroid tissue and nodule",
    "trachea": "Trachea",
    "lymph": "Central compartment node packets",
    "parathyroid": "Parathyroid glands",
    "nerve": "Recurrent laryngeal nerve",
    "sln": "External branch of superior laryngeal nerve",
    "artery": "Arteries",
    "vein": "Veins",
    "landmark": "Key landmarks",
    "currentObjective": "Current objective",
    "stepBadge": "Step {0} / {1}",
    "stepComplete": "Step complete",
    "canvasLabel": "Interactive thyroidectomy anatomy simulation",
    "completeEyebrow": "Case complete",
    "completeTitle": "Surgery Simulation Finished",
    "completeText": "Right lobectomy, ipsilateral central compartment node clearance, hemostasis check, and layered closure are complete.",
    "finalStatus": "Final simulation status",
    "finalSafety": "Final safety",
    "restart": "Restart",
    "feedback": "Feedback",
    "checklist": "Procedure Checklist",
    "feedbackAria": "Feedback and anatomy notes",
    "toolsAria": "Surgical instruments",
    "statusAria": "Simulation status",
    "note": "This is a detailed educational schematic. Real thyroid anatomy varies by patient, including parathyroid position, recurrent laryngeal nerve branching, vessel-nerve relationships, and lymph node disease extent. Central compartment dissection depends on indication. This simulation is not surgical training, clinical advice, or a patient-care guide.",
    "toggle": "中文",
    "toggleAria": "Switch language to Chinese"
  },
  "zh": {
    "lang": "zh-CN",
    "title": "甲状腺切除术模拟器",
    "topEyebrow": "教学解剖模拟",
    "h1": "甲状腺切除术模拟器",
    "stageLabel": "步骤",
    "safetyLabel": "安全分",
    "hemostasisLabel": "止血状态",
    "tools": "手术器械",
    "reset": "重置",
    "selectedInstrument": "当前器械",
    "caseTitle": "病例",
    "caseText": "开放性右侧甲状腺癌教学病例：右叶可疑结节，伴同侧中央区可疑淋巴结。请按步骤完成右侧腺叶切除和 VI 区清扫，并尽量保留甲状旁腺血供和喉返神经功能。",
    "legend": "解剖图例",
    "thyroid": "甲状腺和结节",
    "trachea": "气管",
    "lymph": "中央区淋巴结组织",
    "parathyroid": "甲状旁腺",
    "nerve": "喉返神经",
    "sln": "喉上神经外支",
    "artery": "动脉",
    "vein": "静脉",
    "landmark": "关键标志",
    "currentObjective": "当前步骤",
    "stepBadge": "第 {0} 步 / 共 {1} 步",
    "stepComplete": "步骤完成",
    "canvasLabel": "交互式甲状腺切除术解剖模拟",
    "completeEyebrow": "病例完成",
    "completeTitle": "手术模拟结束",
    "completeText": "右侧腺叶切除、同侧中央区清扫、止血检查和分层关闭均已完成。",
    "finalStatus": "最终状态",
    "finalSafety": "最终安全分",
    "restart": "重新开始",
    "feedback": "反馈",
    "checklist": "手术步骤",
    "feedbackAria": "反馈与解剖说明",
    "toolsAria": "手术器械",
    "statusAria": "模拟状态",
    "note": "这是用于学习的高细节示意图。真实甲状腺解剖会因人而异，包括甲状旁腺位置、喉返神经分支、血管与神经关系以及淋巴结病变范围。是否进行中央区清扫取决于具体适应证。本模拟不属于手术培训、临床建议或患者治疗指南。",
    "toggle": "English",
    "toggleAria": "切换为英文"
  }
};
function tr(i){
  return TX[
    currentLang
  ][
    i
  ]??TX.en[
    i
  ]
}
function fmt(i, a){
  return tr(i).replace(/\{(\d+)\}/g, (_, n)=>a[n]??"")
}
function setText(selector, text){
  const el=document.querySelector(selector);
  if(el)el.textContent=text
}
function setAttr(selector, name, value){
  const el=document.querySelector(selector);
  if(el)el.setAttribute(name, value)
}
function ui(k){
  return UI[
    currentLang
  ][
    k
  ]
}
function uiFmt(k, args){
  return ui(k).replace(/\{(\d+)\}/g, (_, n)=>args[n]??"")
}
function escapeHtml(text){
  return String(text).replace(/[&<>"']/g, (char)=>({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]))
}
function escapeRegExp(text){
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
function highlightInstructionTools(text){
  let html=escapeHtml(text);
  const names=tools.map((tool)=>tool.name).filter(Boolean).sort((a, b)=>b.length-a.length);
  names.forEach((name)=>{
    const escaped=escapeHtml(name);
    html=html.replace(new RegExp(escapeRegExp(escaped), "g"), `<strong class="instruction-tool">${escaped}</strong>`);
  });
  return html
}
function localizeStatic(){
  document.documentElement.lang=ui("lang");
  document.title=ui("title");
  setAttr(".topbar", "aria-label", ui("statusAria"));
  setText(".topbar .eyebrow", ui("topEyebrow"));
  setText(".topbar h1", ui("h1"));
  document.querySelectorAll(".status-strip .stat-label").forEach((el, i)=>el.textContent=[ui("stageLabel"), ui("safetyLabel"), ui("hemostasisLabel")][i]);
setAttr(".tools-panel", "aria-label", ui("toolsAria"));
setText(".tools-panel .panel-head h2", ui("tools"));
if(resetButton)resetButton.textContent=ui("reset");
setText(".instrument-head .eyebrow", ui("selectedInstrument"));
setText(".case-card h2", ui("caseTitle"));
setText(".case-card p", ui("caseText"));
setText(".legend h2", ui("legend"));
document.querySelectorAll(".legend div").forEach((el, i)=>{
  el.childNodes[1].nodeValue=[ui("thyroid"), ui("trachea"), ui("lymph"), ui("parathyroid"), ui("nerve"), ui("sln"), ui("artery"), ui("vein"), ui("landmark")][i]
});
setText(".stage-card .eyebrow", ui("currentObjective"));
setAttr("#simCanvas", "aria-label", ui("canvasLabel"));
setText("#completionScreen .eyebrow", ui("completeEyebrow"));
setText("#completionScreen h2", ui("completeTitle"));
setText("#completionScreen p:not(.eyebrow)", ui("completeText"));
setAttr(".completion-stats", "aria-label", ui("finalStatus"));
document.querySelectorAll(".completion-stats .stat-label").forEach((el, i)=>el.textContent=[ui("finalSafety"), ui("hemostasisLabel")][i]);
if(restartButton)restartButton.textContent=ui("restart");
setAttr(".feedback-panel", "aria-label", ui("feedbackAria"));
document.querySelectorAll(".feedback-panel>h2").forEach((el, i)=>el.textContent=[ui("feedback"), ui("checklist")][i]);
setText(".note", ui("note"));
if(langToggle){
  langToggle.textContent=ui("toggle");
  langToggle.setAttribute("aria-label", ui("toggleAria"))
}
}
function refreshLanguageData(){
  const toolText=[
    [
      "inspect",
      0,
      1
    ],
    [
      "scalpel",
      2,
      3
    ],
    [
      "retractor",
      4,
      5
    ],
    [
      "nanocarbon",
      297,
      298
    ],
    [
      "dissector",
      6,
      7
    ],
    [
      "nerveProbe",
      8,
      9
    ],
    [
      "clip",
      10,
      11
    ],
    [
      "harmonic",
      12,
      13
    ],
    [
      "advancedBipolar",
      14,
      15
    ],
    [
      "monopolar",
      16,
      17
    ],
    [
      "cautery",
      18,
      19
    ],
    [
      "forceps",
      20,
      21
    ],
    [
      "suture",
      22,
      23
    ]
  ];
  toolText.forEach(([id, name, use])=>{
  const tool=tools.find((item)=>item.id===id);
  if(tool){
    tool.name=tr(name);
    tool.use=tr(use)
  }
});
const profileText={
  inspect: [
    24,
    25
  ],
  scalpel: [
    26,
    27
  ],
  retractor: [
    28,
    29
  ],
  nanocarbon: [
    299,
    300
  ],
  dissector: [
    30,
    31
  ],
  nerveProbe: [
    32,
    33
  ],
  clip: [
    34,
    35
  ],
  harmonic: [
    36,
    37
  ],
  advancedBipolar: [
    38,
    39
  ],
  monopolar: [
    40,
    41
  ],
  cautery: [
    42,
    43
  ],
  forceps: [
    44,
    45
  ],
  suture: [
    46,
    47
  ]
};
Object.entries(profileText).forEach(([id, [badge, technique]])=>{
  if(toolProfiles[id]){
  toolProfiles[id].badge=tr(badge);
toolProfiles[id].technique=tr(technique)
}
});
Object.assign(defaultSettings, {
  clipSize: tr(48), activation: tr(49), monoMode: tr(50), mode: tr(51)
});
Object.assign(state.settings, {
  clipSize: tr(48), activation: tr(49), monoMode: tr(50), mode: tr(51)
});
const stageText=[
  [
    54,
    55
  ],
  [
    56,
    57
  ],
  [
    58,
    59
  ],
  [
    60,
    61
  ],
  [
    62,
    63
  ],
  [
    312,
    313
  ],
  [
    301,
    302
  ],
  [
    64,
    65
  ],
  [
    66,
    67
  ],
  [
    68,
    69
  ],
  [
    70,
    71
  ],
  [
    72,
    73
  ],
  [
    74,
    75
  ],
  [
    76,
    77
  ],
  [
    78,
    79
  ],
  [
    80,
    81
  ],
  [
    82,
    83
  ]
];
stages.forEach((stage, index)=>{
  const pair=stageText[index];
if(pair){
  stage.title=tr(pair[0]);
stage.instruction=tr(pair[1])
}
});
const noteText={
  inspect: 84,
  incision: 85,
  flaps: 86,
  strap: 87,
  middleVein: 88,
  ebsln: 145,
  superiorPole: 89,
  nanocarbon: 303,
  parathyroids: 90,
  rln: 91,
  inferiorPole: 92,
  berry: 93,
  isthmus: 94,
  remove: 95,
  centralNodes: 96,
  nodeClearance: 97,
  hemostasis: 98,
  close: 99
};
Object.entries(noteText).forEach(([key, index])=>{
  teachingNotes[key]=tr(index)
});
const zoneText={
  incision: [
    100,
    101
  ],
  larynx: [
    102,
    103
  ],
  cricoid: [
    104,
    105
  ],
  trachea: [
    106,
    107
  ],
  esophagus: [
    108,
    109
  ],
  leftThyroid: [
    110,
    111
  ],
  rightThyroid: [
    112,
    113
  ],
  isthmus: [
    114,
    115
  ],
  nodule: [
    116,
    117
  ],
  delphianNodes: [
    118,
    119
  ],
  pretrachealNodes: [
    120,
    121
  ],
  rightParatrachealNodes: [
    122,
    123
  ],
  flapPlane: [
    124,
    125
  ],
  strapWindow: [
    126,
    127
  ],
  berryLigament: [
    128,
    129
  ],
  zuckerkandl: [
    130,
    131
  ],
  leftParaSup: [
    132,
    133
  ],
  leftParaInf: [
    134,
    135
  ],
  rightParaSup: [
    136,
    137
  ],
  rightParaInf: [
    138,
    139
  ],
  leftRLN: [
    140,
    141
  ],
  rightRLN: [
    142,
    143
  ],
  rightEBSLN: [
    144,
    145
  ],
  leftEBSLN: [
    146,
    147
  ],
  rightSupArt: [
    148,
    149
  ],
  rightInfArt: [
    150,
    151
  ],
  rightSupVein: [
    152,
    153
  ],
  rightMidVein: [
    154,
    155
  ],
  rightInfVein: [
    156,
    157
  ],
  rightCarotid: [
    158,
    159
  ],
  rightIJV: [
    160,
    161
  ],
  leftCarotid: [
    162,
    163
  ],
  leftIJV: [
    164,
    165
  ],
  bleed1: [
    166,
    167
  ]
};
zones.forEach((zone)=>{
  const pair=zoneText[zone.id];
if(pair){
  zone.label=tr(pair[0]);
zone.note=tr(pair[1])
}
})
}
function resolveFeedbackArg(arg){
  if(arg&&typeof arg==="object"){
    if(arg.zoneId){
      const zone=zones.find((item)=>item.id===arg.zoneId);
      return zone?zone.label: ""
    }
    if(arg.stageTarget){
      const stage=stages.find((item)=>item.target===arg.stageTarget);
      return stage?stage.title: ""
    }
    if(Number.isInteger(arg.trIndex))return tr(arg.trIndex);
    if(arg.toolIds)return toolNames(arg.toolIds);
    if(arg.setting)return state.settings[
      arg.setting
    ]??defaultSettings[
      arg.setting
    ]??""
  }
  return arg
}
function feedbackText(source){
  if(!source)return null;
  if(source.kind==="tr")return tr(source.index);
  if(source.kind==="fmt")return fmt(source.index, source.args.map(resolveFeedbackArg));
  if(source.kind==="note")return teachingNotes[
    source.target
  ];
  if(source.kind==="zone"){
    const zone=zones.find((item)=>item.id===source.zoneId);
    return zone?`${zone.label}: ${zone.note}`: ""
  }
  return null
}
function inferFeedbackSource(text){
  const index=TX[
    currentLang
  ].findIndex((item)=>item===text);
  return index>=0?{
    kind: "tr",
    index
  }: null
}
function refreshFeedbackLanguage(){
  [
    ...feedbackLog.children
  ].forEach((entry)=>{
    const text=feedbackText(entry.feedbackSource);
    if(text)entry.textContent=text
  })
}
function switchLanguage(){
  const next=currentLang==="zh"?"en": "zh";
  currentLang=next;
  saveLang(next);
  const url=new URL(location.href);
  if(next==="zh")url.searchParams.set("lang", "zh");
  else url.searchParams.delete("lang");
  try{
    history.replaceState(null, "", url)
  }
  catch{
  }
  refreshLanguageData();
  localizeStatic();
  renderTools();
  renderInstrumentPanel();
  renderStatus();
  renderCompletionScreen();
  refreshFeedbackLanguage();
  tooltip.hidden=true;
  draw()
};
const toolAsset=(id)=>id==="inspect"?"assets/instruments/inspect.svg":`assets/instruments/${id}.png`;
const toolPhoto=(id)=>({
  harmonic:"assets/instruments/source/harmonic-focus-supplied.png",
  advancedBipolar:"assets/instruments/source/ligasure-supplied.png"
}[id]||toolAsset(id));
const instrumentImages={};
const actionImages={};
function preloadInstrumentImages(){
  if(typeof Image==="undefined")return;
  tools.forEach(({id})=>{
    const image=new Image();
    image.src=toolAsset(id);
    instrumentImages[id]=image;
  });
  const harmonicTip=new Image();
  harmonicTip.src="assets/instruments/harmonic-tip-topdown.png";
  actionImages.harmonicTip=harmonicTip;
  const advancedBipolarTip=new Image();
  advancedBipolarTip.src="assets/instruments/advanced-bipolar-tip-topdown.png";
  actionImages.advancedBipolarTip=advancedBipolarTip;
}
const tools=[
  {
    id: "inspect",
    name: tr(0),
    icon: "i",
    use: tr(1)
  },
  {
    id: "scalpel",
    name: tr(2),
    icon: "/",
    use: tr(3)
  },
  {
    id: "retractor",
    name: tr(4),
    icon: "<",
    use: tr(5)
  },
  {
    id: "nanocarbon",
    name: tr(297),
    icon: "K",
    use: tr(298)
  },
  {
    id: "dissector",
    name: tr(6),
    icon: "D",
    use: tr(7)
  },
  {
    id: "nerveProbe",
    name: tr(8),
    icon: "N",
    use: tr(9)
  },
  {
    id: "clip",
    name: tr(10),
    icon: "C",
    use: tr(11)
  },
  {
    id: "harmonic",
    name: tr(12),
    icon: "H",
    use: tr(13)
  },
  {
    id: "advancedBipolar",
    name: tr(14),
    icon: "L",
    use: tr(15)
  },
  {
    id: "monopolar",
    name: tr(16),
    icon: "M",
    use: tr(17)
  },
  {
    id: "cautery",
    name: tr(18),
    icon: "B",
    use: tr(19)
  },
  {
    id: "forceps",
    name: tr(20),
    icon: "F",
    use: tr(21)
  },
  {
    id: "suture",
    name: tr(22),
    icon: "U",
    use: tr(23)
  }
];
const toolProfiles={
  inspect: {
    badge: tr(24),
    color: "#147d8f",
    technique: tr(25)
  },
  scalpel: {
    badge: tr(26),
    color: "#4b5563",
    technique: tr(27)
  },
  retractor: {
    badge: tr(28),
    color: "#147d8f",
    technique: tr(29)
  },
  nanocarbon: {
    badge: tr(299),
    color: "#202124",
    technique: tr(300)
  },
  dissector: {
    badge: tr(30),
    color: "#7c5c2e",
    technique: tr(31)
  },
  nerveProbe: {
    badge: tr(32),
    color: "#b59a00",
    technique: tr(33)
  },
  clip: {
    badge: tr(34),
    color: "#6b7280",
    technique: tr(35)
  },
  harmonic: {
    badge: tr(36),
    color: "#c77a1b",
    technique: tr(37)
  },
  advancedBipolar: {
    badge: tr(38),
    color: "#8a4fb5",
    technique: tr(39)
  },
  monopolar: {
    badge: tr(40),
    color: "#b92f37",
    technique: tr(41)
  },
  cautery: {
    badge: tr(42),
    color: "#b92f37",
    technique: tr(43)
  },
  forceps: {
    badge: tr(44),
    color: "#287a4b",
    technique: tr(45)
  },
  suture: {
    badge: tr(46),
    color: "#0e5965",
    technique: tr(47)
  }
};
const defaultSettings={
  labelMode: true,
  magnification: 1,
  depth: 1,
  traction: 2,
  pressure: 1,
  sensitivity: 3,
  angle: 0,
  clipSize: tr(48),
  harmonicPower: 3,
  activation: tr(49),
  sealPower: 3,
  monoPower: 2,
  monoMode: tr(50),
  power: 2,
  mode: tr(51),
  grip: 2,
};
const stages=[
  {
    title: tr(54),
    instruction: tr(55),
    target: "incision"
  },
  {
    title: tr(56),
    instruction: tr(57),
    target: "flaps"
  },
  {
    title: tr(58),
    instruction: tr(59),
    target: "strap"
  },
  {
    title: tr(60),
    instruction: tr(61),
    target: "middleVein"
  },
  {
    title: tr(62),
    instruction: tr(63),
    target: "ebsln"
  },
  {
    title: tr(312),
    instruction: tr(313),
    target: "superiorPole"
  },
  {
    title: tr(301),
    instruction: tr(302),
    target: "nanocarbon"
  },
  {
    title: tr(64),
    instruction: tr(65),
    target: "parathyroids"
  },
  {
    title: tr(66),
    instruction: tr(67),
    target: "rln"
  },
  {
    title: tr(68),
    instruction: tr(69),
    target: "inferiorPole"
  },
  {
    title: tr(70),
    instruction: tr(71),
    target: "berry"
  },
  {
    title: tr(72),
    instruction: tr(73),
    target: "isthmus"
  },
  {
    title: tr(74),
    instruction: tr(75),
    target: "remove"
  },
  {
    title: tr(76),
    instruction: tr(77),
    target: "centralNodes"
  },
  {
    title: tr(78),
    instruction: tr(79),
    target: "nodeClearance"
  },
  {
    title: tr(80),
    instruction: tr(81),
    target: "hemostasis"
  },
  {
    title: tr(82),
    instruction: tr(83),
    target: "close"
  }
];
const initialState=()=>({
  tool: "inspect", stage: 0, safety: 100, bleeding: 0, startTime: performance.now(), lastFrame: performance.now(), stageChangedAt: performance.now(), removedAt: null, skinOpenedAt: null, fatClearedAt: null, strapSeparatedAt: null, stepFlashAt: null, stepFlashTarget: null, pointer: null, action: null, inspectFocus: null, settings: {
    ...defaultSettings
  }, heat: 0, inspected: new Set(), completed: new Set(), vesselsClipped: new Set(), vesselDevices: new Map(), nodalMobilized: new Set(), nodalCleared: new Set(), removed: false, finished: false, incisionProgress: 0, flapProgress: 0, exposureProgress: 0
});
let state=initialState();
const teachingNotes={
  incision: tr(85),
  flaps: tr(86),
  strap: tr(87),
  middleVein: tr(88),
  ebsln: tr(145),
  superiorPole: tr(89),
  nanocarbon: tr(303),
  parathyroids: tr(90),
  rln: tr(91),
  inferiorPole: tr(92),
  berry: tr(93),
  isthmus: tr(94),
  remove: tr(95),
  centralNodes: tr(96),
  nodeClearance: tr(97),
  hemostasis: tr(98),
  close: tr(99)
};
const zones=[
  {
    id: "incision",
    type: "target",
    label: tr(100),
    x: 340,
    y: 544,
    w: 400,
    h: 34,
    note: tr(101)
  },
  {
    id: "larynx",
    type: "critical",
    label: tr(102),
    x: 486,
    y: 106,
    w: 126,
    h: 72,
    note: tr(103)
  },
  {
    id: "cricoid",
    type: "critical",
    label: tr(104),
    x: 498,
    y: 164,
    w: 102,
    h: 36,
    note: tr(105)
  },
  {
    id: "trachea",
    type: "critical",
    label: tr(106),
    x: 500,
    y: 174,
    w: 96,
    h: 330,
    note: tr(107)
  },
  {
    id: "esophagus",
    type: "landmark",
    label: tr(108),
    x: 458,
    y: 214,
    w: 170,
    h: 300,
    note: tr(109)
  },
  {
    id: "leftThyroid",
    type: "thyroid",
    label: tr(110),
    x: 352,
    y: 330,
    rx: 104,
    ry: 165,
    note: tr(111)
  },
  {
    id: "rightThyroid",
    type: "thyroid",
    label: tr(112),
    x: 650,
    y: 330,
    rx: 116,
    ry: 172,
    note: tr(113)
  },
  {
    id: "isthmus",
    type: "thyroid",
    label: tr(114),
    x: 456,
    y: 320,
    w: 190,
    h: 74,
    note: tr(115)
  },
  {
    id: "nodule",
    type: "thyroid",
    label: tr(116),
    x: 684,
    y: 310,
    r: 42,
    note: tr(117)
  },
  {
    id: "delphianNodes",
    type: "lymph",
    label: tr(118),
    x: 548,
    y: 236,
    rx: 42,
    ry: 28,
    note: tr(119)
  },
  {
    id: "pretrachealNodes",
    type: "lymph",
    label: tr(120),
    x: 548,
    y: 474,
    rx: 54,
    ry: 48,
    note: tr(121)
  },
  {
    id: "rightParatrachealNodes",
    type: "lymph",
    label: tr(122),
    x: 650,
    y: 452,
    rx: 52,
    ry: 82,
    note: tr(123)
  },
  {
    id: "flapPlane",
    type: "target",
    label: tr(124),
    x: 304,
    y: 500,
    w: 470,
    h: 88,
    note: tr(125)
  },
  {
    id: "strapWindow",
    type: "target",
    label: tr(126),
    x: 420,
    y: 150,
    w: 250,
    h: 385,
    note: tr(127)
  },
  {
    id: "berryLigament",
    type: "landmark",
    label: tr(128),
    x: 594,
    y: 280,
    w: 58,
    h: 104,
    note: tr(129)
  },
  {
    id: "zuckerkandl",
    type: "landmark",
    label: tr(130),
    x: 610,
    y: 285,
    r: 18,
    note: tr(131)
  },
  {
    id: "leftParaSup",
    type: "parathyroid",
    label: tr(132),
    x: 430,
    y: 258,
    r: 15,
    note: tr(133)
  },
  {
    id: "leftParaInf",
    type: "parathyroid",
    label: tr(134),
    x: 426,
    y: 414,
    r: 14,
    note: tr(135)
  },
  {
    id: "rightParaSup",
    type: "parathyroid",
    label: tr(136),
    x: 624,
    y: 258,
    r: 15,
    note: tr(137)
  },
  {
    id: "rightParaInf",
    type: "parathyroid",
    label: tr(138),
    x: 684,
    y: 390,
    r: 14,
    note: tr(139)
  },
  {
    id: "leftRLN",
    type: "nerve",
    label: tr(140),
    path: [
      [
        472,
        532
      ],
      [
        458,
        438
      ],
      [
        456,
        326
      ],
      [
        474,
        190
      ]
    ],
    note: tr(141)
  },
  {
    id: "rightRLN",
    type: "nerve",
    label: tr(142),
    path: [
      [
        628,
        532
      ],
      [
        622,
        432
      ],
      [
        620,
        330
      ],
      [
        604,
        190
      ]
    ],
    note: tr(143)
  },
  {
    id: "rightEBSLN",
    type: "nerve",
    label: tr(144),
    path: [
      [
        744,
        126
      ],
      [
        724,
        166
      ],
      [
        710,
        212
      ]
    ],
    note: tr(145)
  },
  {
    id: "leftEBSLN",
    type: "nerve",
    label: tr(146),
    path: [
      [
        358,
        126
      ],
      [
        376,
        166
      ],
      [
        394,
        216
      ]
    ],
    note: tr(147)
  },
  {
    id: "rightSupArt",
    type: "artery",
    label: tr(148),
    path: [
      [
        782,
        146
      ],
      [
        710,
        218
      ]
    ],
    note: tr(149)
  },
  {
    id: "rightInfArt",
    type: "artery",
    label: tr(150),
    path: [
      [
        786,
        456
      ],
      [
        650,
        418
      ]
    ],
    note: tr(151)
  },
  {
    id: "rightSupVein",
    type: "vein",
    label: tr(152),
    path: [
      [
        815,
        188
      ],
      [
        724,
        256
      ]
    ],
    note: tr(153)
  },
  {
    id: "rightMidVein",
    type: "vein",
    label: tr(154),
    path: [
      [
        812,
        332
      ],
      [
        742,
        340
      ]
    ],
    note: tr(155)
  },
  {
    id: "rightInfVein",
    type: "vein",
    label: tr(156),
    path: [
      [
        688,
        514
      ],
      [
        560,
        526
      ],
      [
        430,
        514
      ]
    ],
    note: tr(157)
  },
  {
    id: "rightCarotid",
    type: "critical",
    label: tr(158),
    path: [
      [
        850,
        128
      ],
      [
        844,
        536
      ]
    ],
    note: tr(159)
  },
  {
    id: "rightIJV",
    type: "critical",
    label: tr(160),
    path: [
      [
        902,
        130
      ],
      [
        898,
        536
      ]
    ],
    note: tr(161)
  },
  {
    id: "leftCarotid",
    type: "critical",
    label: tr(162),
    path: [
      [
        230,
        128
      ],
      [
        236,
        536
      ]
    ],
    note: tr(163)
  },
  {
    id: "leftIJV",
    type: "critical",
    label: tr(164),
    path: [
      [
        178,
        130
      ],
      [
        182,
        536
      ]
    ],
    note: tr(165)
  },
  {
    id: "bleed1",
    type: "bleed",
    label: tr(166),
    x: 742,
    y: 340,
    r: 18,
    note: tr(167)
  }
];
function hitZone(point){
  const matches=[
    ...zones
  ].reverse().filter((zone)=>{
    if(state.removed&&["rightThyroid", "nodule", "berryLigament", "zuckerkandl"].includes(zone.id))return false;
    if(zone.type==="bleed"&&state.bleeding===0)return false;
    if(zone.type==="nerve"&&!state.completed.has("strap"))return false;
    return contains(zone, point.x, point.y);
  });
  if(state.tool!=="inspect"){
    const currentTargets=targetZoneIds();
    const currentMatch=matches.find((zone)=>currentTargets.includes(zone.id));
    const broadCurrent=currentMatch&&["strapWindow", "rightThyroid", "nodule"].includes(currentMatch.id);
    if(currentMatch&&!broadCurrent)return currentMatch;
    const protectedMatch=matches.find((zone)=>zone.type==="parathyroid")||matches.find((zone)=>zone.type==="nerve");
    if(protectedMatch)return protectedMatch;
    if(currentMatch)return currentMatch;
  }
  return matches[
    0
  ];
}
function targetZoneIds(target=stages[state.stage].target){
  if(target==="superiorPole"){
    return[
      "rightSupArt",
      "rightSupVein"
    ].filter((id)=>!state.vesselsClipped.has(id));
  }
  return{
    incision: [
      "incision"
    ],
    flaps: [
      "flapPlane"
    ],
    strap: [
      "strapWindow"
    ],
    middleVein: [
      "rightMidVein"
    ],
    ebsln: [
      "rightEBSLN"
    ],
    nanocarbon: [
      "rightThyroid",
      "nodule",
      "isthmus"
    ],
    parathyroids: [
      "rightParaSup",
      "rightParaInf"
    ],
    rln: [
      "rightRLN"
    ],
    inferiorPole: [
      "rightInfArt",
      "rightInfVein"
    ],
    berry: [
      "berryLigament"
    ],
    isthmus: [
      "isthmus"
    ],
    remove: [
      "rightThyroid",
      "nodule"
    ],
    centralNodes: [
      "delphianNodes",
      "pretrachealNodes",
      "rightParatrachealNodes"
    ],
    nodeClearance: [
      "delphianNodes",
      "pretrachealNodes",
      "rightParatrachealNodes"
    ],
    hemostasis: state.bleeding>0?["bleed1"]: [],
    close: [
      "incision"
    ]
  }
  [
    target
  ]||[
];
}
const stepTools={
  incision: ["scalpel", "monopolar"],
  flaps: ["monopolar"],
  strap: ["retractor", "harmonic", "advancedBipolar"],
  middleVein: ["clip", "harmonic", "advancedBipolar"],
  ebsln: ["nerveProbe"],
  superiorPole: ["clip", "harmonic", "advancedBipolar"],
  nanocarbon: ["nanocarbon"],
  parathyroids: ["dissector"],
  rln: ["nerveProbe"],
  inferiorPole: ["clip", "harmonic", "advancedBipolar"],
  berry: ["dissector"],
  isthmus: ["harmonic", "advancedBipolar"],
  remove: ["forceps"],
  centralNodes: ["dissector"],
  nodeClearance: ["harmonic", "advancedBipolar"],
  hemostasis: ["cautery", "harmonic", "advancedBipolar"],
  close: ["suture"]
};
function allowedToolIdsForTarget(target=stages[state.stage].target){
  return stepTools[target]||[];
}
function toolNames(ids){
  const separator=currentLang==="zh"?"、":", ";
  return ids.map((id)=>{
    const tool=tools.find((item)=>item.id===id);
    return tool?tool.name:id;
  }).join(separator);
}
function isCurrentStepAction(zone){
  if(!zone)return false;
  const target=stages[state.stage].target;
  return targetZoneIds(target).includes(zone.id)&&allowedToolIdsForTarget(target).includes(state.tool);
}
function logStepGate(){
  const current=stages[state.stage];
  const toolIds=allowedToolIdsForTarget(current.target);
  addLog(fmt(309, [current.title, toolNames(toolIds)]), "warning", {
    kind: "fmt", index: 309, args: [{
      stageTarget: current.target
    }, {
      toolIds
    }]
  });
}
function contains(zone, x, y){
  if(zone.path)return distanceToPath(zone.path, x, y)<18;
  if(zone.r)return Math.hypot(zone.x-x, zone.y-y)<=zone.r;
  if(zone.rx)return(((x-zone.x)**2)/(zone.rx**2))+(((y-zone.y)**2)/(zone.ry**2))<=1;
  return x>=zone.x&&x<=zone.x+zone.w&&y>=zone.y&&y<=zone.y+zone.h;
}
function distanceToPath(path, x, y){
  let min=Infinity;
  for(let i=0; i<path.length-1; i++){
    const[
      x1,
      y1
    ]=path[
      i
    ];
    const[
      x2,
      y2
    ]=path[
      i+1
    ];
    const dx=x2-x1;
    const dy=y2-y1;
    const t=Math.max(0, Math.min(1, ((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)));
    min=Math.min(min, Math.hypot(x-(x1+t*dx), y-(y1+t*dy)));
  }
  return min;
}
function canvasPoint(event){
  const rect=canvas.getBoundingClientRect();
  return{
    x: ((event.clientX-rect.left)/rect.width)*canvas.width,
    y: ((event.clientY-rect.top)/rect.height)*canvas.height,
    sx: event.clientX-rect.left,
    sy: event.clientY-rect.top
  };
}
function addLog(text, tone="info", source=null){
  const entry=document.createElement("div");
  entry.className=`log-entry ${tone}`;
  entry.feedbackSource=source||inferFeedbackSource(text);
  entry.textContent=feedbackText(entry.feedbackSource)||text;
  feedbackLog.prepend(entry);
  while(feedbackLog.children.length>8)feedbackLog.lastChild.remove();
}
function selectTool(id){
  if(state.action)return;
  state.tool=id;
  tooltip.hidden=true;
  renderTools();
  renderInstrumentPanel();
  draw();
}
function renderTools(){
  toolGrid.innerHTML="";
  const allowedToolIds=allowedToolIdsForTarget();
  tools.forEach((tool)=>{
    const button=document.createElement("button");
    const allowed=allowedToolIds.includes(tool.id);
    button.className=`tool-button${allowed?" is-step-allowed":""}`;
    button.type="button";
    button.setAttribute("aria-pressed", String(state.tool===tool.id));
    button.setAttribute("aria-label", allowed?`${tool.name} — ${currentLang==="zh"?"当前步骤可用":"available for this step"}`:tool.name);
    button.title=allowed?(currentLang==="zh"?`当前步骤可用：${tool.use}`:`Available for this step: ${tool.use}`):tool.use;
    button.innerHTML=`
      <span class="tool-icon"><span>${tool.icon}</span><img src="${toolAsset(tool.id)}" alt="" aria-hidden="true"></span>
      <span class="tool-name">${tool.name}</span>
    `;
    button.addEventListener("click", ()=>selectTool(tool.id));
    toolGrid.appendChild(button);
  });
}
function renderInstrumentPanel(){
  const tool=tools.find((item)=>item.id===state.tool);
  const profile=toolProfiles[
    state.tool
  ];
  instrumentTitle.textContent=tool.name;
  instrumentBadge.textContent=profile.badge;
  instrumentBadge.style.background=profile.color;
  instrumentTechnique.textContent=profile.technique;
  if(instrumentImage){
    instrumentImage.hidden=false;
    instrumentImage.src=toolPhoto(tool.id);
    instrumentImage.alt=currentLang==="zh"?`${tool.name}器械照片`:`${tool.name} instrument photo`;
    instrumentImage.onerror=()=>{instrumentImage.hidden=true;};
  }
}
function renderStatus(){
  const stage=stages[
    state.stage
  ];
  stageNumber.textContent=`${state.stage + 1} / ${stages.length}`;
  if(stageStepBadge)stageStepBadge.textContent=uiFmt("stepBadge", [state.stage + 1, stages.length]);
  safetyScore.textContent=String(Math.max(0, state.safety));
  safetyScore.style.color=state.safety>80?"var(--ok)": state.safety>55?"var(--warn)": "var(--danger)";
  hemostasisScore.textContent=state.bleeding===0?tr(168): state.bleeding<3?tr(169): tr(170);
  hemostasisScore.style.color=state.bleeding===0?"var(--ok)": state.bleeding<3?"var(--warn)": "var(--danger)";
  stageTitle.textContent=stage.title;
  stageInstruction.innerHTML=highlightInstructionTools(stage.instruction);
  checklist.innerHTML="";
  stages.forEach((item, index)=>{
    const li=document.createElement("li");
    li.className=index<state.stage||state.completed.has(item.target)?"done": "";
    li.textContent=item.title;
    checklist.appendChild(li);
  });
}
function renderCompletionScreen(){
  completionScreen.hidden=!state.finished;
  if(!state.finished)return;
  completionSafety.textContent=String(Math.max(0, state.safety));
  completionHemostasis.textContent=state.bleeding===0?tr(171): state.bleeding<3?tr(172): tr(173);
}
function advance(target){
  const current=stages[
    state.stage
  ];
  if(!current||current.target!==target){
    if(current)logStepGate();
    renderStatus();
    renderCompletionScreen();
    return false;
  }
  state.completed.add(target);
  if(target==="nodeClearance")state.bleeding=Math.max(1, state.bleeding);
  state.stepFlashAt=performance.now();
  state.stepFlashTarget=current.target;
  if(state.stage<stages.length-1){
    state.stage+=1;
    state.stageChangedAt=performance.now();
    addLog(fmt(174, [current.title]), "success", {
      kind: "fmt", index: 174, args: [{
        stageTarget: current.target
      }]
    });
    addLog(teachingNotes[target], "info", {
      kind: "note", target
    });
  }
  else{
    state.stageChangedAt=performance.now();
    state.finished=true;
    addLog(tr(175), "success", {
      kind: "tr", index: 175
    });
    addLog(teachingNotes[target], "info", {
      kind: "note", target
    });
  }
  renderTools();
  renderStatus();
  renderCompletionScreen();
  return true;
}
function resetSimulation(){
  state=initialState();
  feedbackLog.innerHTML="";
  addLog(tr(176), "info", {
    kind: "tr", index: 176
  });
  localizeStatic();
  renderTools();
  renderInstrumentPanel();
  renderStatus();
  renderCompletionScreen();
  draw();
}
function penalize(amount, text, extraBleeding=0, source=null){
  state.safety=Math.max(0, state.safety-amount);
  state.bleeding+=extraBleeding;
  addLog(text, amount>=10?"danger": "warning", source);
  renderStatus();
}
let prefersReducedMotion=typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function actionDuration(tool, zone){
  if(prefersReducedMotion)return 0;
  if(tool==="advancedBipolar"&&zone?.type==="lymph")return 2500;
  if(["harmonic", "advancedBipolar"].includes(tool)&&["artery", "vein"].includes(zone?.type))return 2500;
  if(["harmonic", "advancedBipolar"].includes(tool)&&["strapWindow", "isthmus"].includes(zone?.id))return 1900;
  return ({
    scalpel: 1300,
    retractor: 1300,
    nanocarbon: 1100,
    dissector: 1100,
    nerveProbe: 1000,
    clip: 1000,
    harmonic: 1400,
    advancedBipolar: 1400,
    monopolar: 1700,
    cautery: 1000,
    forceps: 1400,
    suture: 1700
  }[tool]||1000);
}
function startAction(zone, point){
  state.action={
    tool: state.tool,
    targetId: zone.id,
    point: {x: point.x, y: point.y},
    startedAt: performance.now(),
    duration: actionDuration(state.tool, zone)
  };
  if(state.action.duration===0)finishAction();
  else draw();
}
function finishAction(){
  const action=state.action;
  if(!action)return;
  state.action=null;
  const zone=zones.find((item)=>item.id===action.targetId);
  if(zone)applyAction(zone, action.point);
}
function onAction(zone, point){
  if(state.finished||state.action)return;
  if(prefersReducedMotion){
    const now=performance.now();
    state.heat=Math.max(0, state.heat-Math.max(0, (now-state.lastFrame)/1000)*0.55);
    state.lastFrame=now;
  }
  if(!zone){
    addLog(tr(177), "warning");
    return;
  }
  if(state.tool==="inspect"){
    state.inspected.add(zone.id);
    state.inspectFocus={zoneId: zone.id, startedAt: performance.now()};
    addLog(`${zone.label}: ${zone.note}`, "info", {
      kind: "zone", zoneId: zone.id
    });
    draw();
    return;
  }
  if(state.tool==="nanocarbon"&&zone.type==="parathyroid"){
    addLog(tr(305), "warning", {kind: "tr", index: 305});
    return;
  }
  if(state.tool==="dissector"&&zone.type==="parathyroid"&&!state.completed.has("nanocarbon")){
    addLog(tr(306), "warning", {kind: "tr", index: 306});
    return;
  }
  if(zone.type==="nerve"&&state.tool!=="nerveProbe"){
    penalize(14, fmt(180, [zone.label]), 0, {kind: "fmt", index: 180, args: [{zoneId: zone.id}]});
    draw();
    return;
  }
  if(zone.type==="parathyroid"&&!["nerveProbe", "dissector"].includes(state.tool)){
    penalize(14, fmt(180, [zone.label]), 0, {kind: "fmt", index: 180, args: [{zoneId: zone.id}]});
    draw();
    return;
  }
  if(zone.type==="critical"){
    penalize(12, fmt(181, [zone.label]), 0, {kind: "fmt", index: 181, args: [{zoneId: zone.id}]});
    draw();
    return;
  }
  if(!isCurrentStepAction(zone)){
    logStepGate();
    renderStatus();
    draw();
    return;
  }
  startAction(zone, point);
}
function applyAction(zone, point){
  if(state.finished)return;
  if(!zone){
    addLog(tr(177), "warning");
    return;
  }
  if(state.tool==="inspect"){
    state.inspected.add(zone.id);
    addLog(`${zone.label}: ${zone.note}`, "info", {
      kind: "zone", zoneId: zone.id
    });
    return;
  }
  if(state.tool==="nanocarbon"&&zone.type==="parathyroid"){
    addLog(tr(305), "warning", {
      kind: "tr",
      index: 305
    });
    renderStatus();
    draw();
    return;
  }
  if(state.tool==="dissector"&&zone.type==="parathyroid"&&!state.completed.has("nanocarbon")){
    addLog(tr(306), "warning", {
      kind: "tr",
      index: 306
    });
    renderStatus();
    draw();
    return;
  }
  if(zone.type==="nerve"&&state.tool!=="nerveProbe"){
    penalize(14, fmt(180, [zone.label]), 0, {
      kind: "fmt", index: 180, args: [{
        zoneId: zone.id
      }]
    });
    draw();
    return;
  }
  if(zone.type==="parathyroid"&&!["nerveProbe", "dissector"].includes(state.tool)){
    penalize(14, fmt(180, [zone.label]), 0, {
      kind: "fmt", index: 180, args: [{
        zoneId: zone.id
      }]
    });
    draw();
    return;
  }
  if(zone.type==="critical"&&state.tool!=="inspect"){
    penalize(12, fmt(181, [zone.label]), 0, {
      kind: "fmt", index: 181, args: [{
        zoneId: zone.id
      }]
    });
    draw();
    return;
  }
  if(!isCurrentStepAction(zone)){
    logStepGate();
    renderStatus();
    draw();
    return;
  }
  if(state.tool==="nanocarbon"){
  if(stages[state.stage].target==="nanocarbon"&&["rightThyroid", "nodule", "isthmus"].includes(zone.id)){
    advance("nanocarbon");
    addLog(tr(304), "success", {
      kind: "tr",
      index: 304
    });
  }
  else{
    addLog(tr(306), "warning", {
      kind: "tr",
      index: 306
    });
  }
  renderStatus();
  draw();
  return;
}
if(state.tool==="scalpel"){
  if(zone.id==="incision"){
    const depth=state.settings.depth;
    state.incisionProgress=2;
    state.skinOpenedAt=performance.now();
    addLog(depth>=3?tr(182): tr(183), "success");
    advance("incision");
  }
  else if(zone.id==="isthmus"&&stages[state.stage].target==="isthmus"){
  state.completed.add("isthmus");
  addLog(tr(184), "success");
  advance("isthmus");
}
else{
  const penalty=state.settings.depth>=3?13: 8;
  penalize(penalty, tr(185), zone.type==="vein"?1: 0);
}
}
if(state.tool==="retractor"){
  if(zone.id==="flapPlane"){
    state.flapProgress=2;
    addLog(tr(186), "success");
    advance("flaps");
  }
  else if(zone.id==="strapWindow"){
    const traction=state.settings.traction;
    state.exposureProgress=1;
    state.strapSeparatedAt=performance.now();
    if(traction>=4)state.safety=Math.max(0, state.safety-3);
    addLog(traction>=4?tr(187): tr(188), "success");
    advance("strap");
  }
  else{
    addLog(tr(189), "warning");
  }
}
if(state.tool==="monopolar"){
  if(zone.id==="flapPlane"||zone.id==="incision"){
    addLog(fmt(190, [state.settings.monoMode, state.settings.monoPower]), "success", {
    kind: "fmt", index: 190, args: [{
      setting: "monoMode"
    }, state.settings.monoPower]
});
if(zone.id==="flapPlane"){
  state.flapProgress=2;
  state.fatClearedAt=performance.now();
  advance("flaps");
}
else{
  state.incisionProgress=2;
  state.skinOpenedAt=performance.now();
  advance("incision");
}
}
else{
  penalize(10+state.settings.monoPower, tr(191), 1);
}
}
if(state.tool==="dissector"){
  if(zone.type==="parathyroid"){
    if(state.settings.pressure>=4){
      penalize(5, tr(192));
    }
    state.completed.add(zone.id);
    addLog(fmt(193, [zone.label]), "success", {
    kind: "fmt", index: 193, args: [{
      zoneId: zone.id
    }]
});
const found=[
  "rightParaSup",
  "rightParaInf"
].every((id)=>state.completed.has(id));
if(found)advance("parathyroids");
}
else if(zone.type==="lymph"){
  if(stages[state.stage].target!=="centralNodes"){
  addLog(tr(194), "warning");
}
else if(!state.removed){
  addLog(tr(195), "warning");
}
else{
  state.nodalMobilized.add(zone.id);
  addLog(fmt(196, [zone.label]), "success", {
  kind: "fmt", index: 196, args: [{
    zoneId: zone.id
  }]
});
if(["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id)=>state.nodalMobilized.has(id))){
  advance("centralNodes");
}
}
}
else if(zone.id==="berryLigament"){
  if(!state.completed.has("rightRLN")){
    penalize(12, tr(197));
  }
  else{
    state.completed.add("berry");
    addLog(tr(198), "success");
    advance("berry");
  }
}
else if(zone.id==="isthmus"){
  state.completed.add("isthmus");
  addLog(tr(199), "success");
  advance("isthmus");
}
else if(zone.type==="thyroid"){
  addLog(tr(200));
}
else{
  addLog(tr(201), "warning");
}
}
if(state.tool==="nerveProbe"){
  if(zone.type==="nerve"){
    if(stages[state.stage].target==="ebsln"&&zone.id!=="rightEBSLN"){
    addLog(tr(202), "warning");
    renderStatus();
    draw();
    return;
  }
  state.completed.add(zone.id);
  addLog(fmt(203, [zone.label, state.settings.sensitivity]), "success", {
  kind: "fmt", index: 203, args: [{
    zoneId: zone.id
  }, state.settings.sensitivity]
});
if(zone.id==="rightEBSLN")advance("ebsln");
if(zone.id==="rightRLN")advance("rln");
}
else{
  addLog(tr(204), "warning");
}
}
if(state.tool==="harmonic"||state.tool==="advancedBipolar"){
  handleEnergyDevice(zone, point);
}
if(state.tool==="clip"){
  if(["artery", "vein"].includes(zone.type)){
  if(stages[state.stage].target==="superiorPole"&&!["rightSupArt", "rightSupVein"].includes(zone.id)){
  addLog(tr(205), "warning");
  renderStatus();
  draw();
  return;
}
if(zone.id==="rightMidVein"){
  state.vesselsClipped.add(zone.id);
  state.vesselDevices.set(zone.id, "clip");
  addLog(tr(206), "success");
  advance("middleVein");
  renderStatus();
  draw();
  return;
}
if(["rightInfArt", "rightInfVein"].includes(zone.id)&&!state.completed.has("rightRLN")){
  penalize(10, tr(207), 1);
}
if(["rightSupArt", "rightSupVein"].includes(zone.id)&&!state.completed.has("rightEBSLN")){
  penalize(7, tr(208), 0);
}
if(["rightSupArt", "rightSupVein"].includes(zone.id)&&!nearSuperiorCapsule(point, zone.id)){
  addLog(tr(209), "warning");
  renderStatus();
  draw();
  return;
}
state.vesselsClipped.add(zone.id);
state.vesselDevices.set(zone.id, "clip");
addLog(fmt(210, [zone.label, state.settings.clipSize, state.settings.angle]), "success", {
  kind: "fmt", index: 210, args: [{
    zoneId: zone.id
  }, {
    setting: "clipSize"
  }, state.settings.angle]
});
if(state.completed.has("rightEBSLN")&&["rightSupArt", "rightSupVein"].every((id)=>state.vesselsClipped.has(id)))advance("superiorPole");
if(["rightInfArt", "rightInfVein"].every((id)=>state.vesselsClipped.has(id)))advance("inferiorPole");
}
else{
  penalize(7, tr(211));
}
}
if(state.tool==="forceps"){
  if(zone.id==="rightThyroid"||zone.id==="nodule"){
    if(!["middleVein", "superiorPole", "nanocarbon", "parathyroids", "rln", "inferiorPole", "berry", "isthmus"].every((id)=>state.completed.has(id))){
    penalize(12, tr(212), 2);
  }
  else{
    if(state.settings.grip>=5)state.safety=Math.max(0, state.safety-4);
    state.removed=true;
    state.removedAt=performance.now()-1200;
    advance("remove");
  }
}
else{
  addLog(tr(213), "warning");
}
}
if(state.tool==="cautery"){
  if(zone.type==="bleed"||["artery", "vein"].includes(zone.type)){
  state.bleeding=Math.max(0, state.bleeding-Math.max(1, Math.ceil(state.settings.power/2)));
  state.heat=Math.min(5, state.heat+state.settings.power);
  addLog(fmt(214, [state.settings.mode, state.settings.power]), "success", {
  kind: "fmt", index: 214, args: [{
    setting: "mode"
  }, state.settings.power]
});
if(stages[state.stage].target==="hemostasis"&&state.bleeding===0){
  advance("hemostasis");
  addLog(tr(215), "success", {kind: "tr", index: 215});
}
}
else if(zone.type==="nerve"||zone.type==="parathyroid"){
  penalize(12+state.settings.power, tr(216));
}
else{
  addLog(tr(217), "warning");
}
}
if(state.tool==="suture"){
  if(stages[state.stage].target==="close"&&state.bleeding===0&&zone.id==="incision"){
  advance("close");
}
else{
  addLog(tr(218), "warning");
}
}
renderStatus();
draw();
}
function handleEnergyDevice(zone, point){
  const isHarmonic=state.tool==="harmonic";
  const name=isHarmonic?tr(219): tr(220);
  const power=isHarmonic?state.settings.harmonicPower: state.settings.sealPower;
  const activationRisk=isHarmonic&&state.settings.activation===tr(221)?2: 0;
  if(["nerve", "parathyroid"].includes(zone.type)){
  penalize(16+power+activationRisk, fmt(222, [name, zone.label]), 0, {
  kind: "fmt", index: 222, args: [{
    trIndex: isHarmonic?219: 220
  }, {
    zoneId: zone.id
  }]
});
return;
}
if(zone.type==="critical"){
  penalize(14+power, fmt(223, [name, zone.label]), 0, {
  kind: "fmt", index: 223, args: [{
    trIndex: isHarmonic?219: 220
  }, {
    zoneId: zone.id
  }]
});
return;
}
state.heat=Math.min(6, state.heat+power+activationRisk);
if(state.heat>5){
  penalize(5, tr(224));
}
if(zone.id==="strapWindow"){
  state.exposureProgress=1;
  state.strapSeparatedAt=performance.now();
  addLog(fmt(225, [name]), "success", {
  kind: "fmt", index: 225, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
advance("strap");
return;
}
if(zone.id==="flapPlane"&&isHarmonic){
  state.flapProgress=2;
  addLog(fmt(226, [name]), "success", {
  kind: "fmt", index: 226, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
advance("flaps");
return;
}
if(zone.type==="lymph"){
  if(stages[state.stage].target!=="nodeClearance"){
  addLog(fmt(227, [name]), "warning", {
  kind: "fmt", index: 227, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
return;
}
if(!state.nodalMobilized.has(zone.id)){
  addLog(fmt(228, [zone.label]), "warning", {
  kind: "fmt", index: 228, args: [{
    zoneId: zone.id
  }]
});
return;
}
state.nodalCleared.add(zone.id);
addLog(fmt(229, [name, zone.label]), "success", {
  kind: "fmt", index: 229, args: [{
    trIndex: isHarmonic?219: 220
  }, {
    zoneId: zone.id
  }]
});
if(["delphianNodes", "pretrachealNodes", "rightParatrachealNodes"].every((id)=>state.nodalCleared.has(id))){
  advance("nodeClearance");
}
return;
}
if(["rightMidVein", "rightSupArt", "rightSupVein", "rightInfArt", "rightInfVein"].includes(zone.id)){
  if(stages[state.stage].target==="hemostasis"){
    state.bleeding=Math.max(0, state.bleeding-(isHarmonic?1: 2));
    addLog(fmt(236, [name]), "success", {
      kind: "fmt", index: 236, args: [{
        trIndex: isHarmonic?219: 220
      }]
    });
    if(state.bleeding===0)advance("hemostasis");
    return;
  }
  if(["rightSupArt", "rightSupVein"].includes(zone.id)){
  if(!state.completed.has("rightEBSLN")){
    penalize(10, fmt(230, [name]), 0, {
    kind: "fmt", index: 230, args: [{
      trIndex: isHarmonic?219: 220
    }]
});
return;
}
if(!nearSuperiorCapsule(point, zone.id)){
  addLog(fmt(231, [name]), "warning", {
  kind: "fmt", index: 231, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
return;
}
}
if(["rightInfArt", "rightInfVein"].includes(zone.id)&&!state.completed.has("rightRLN")){
  penalize(12, fmt(232, [name]), 0, {
  kind: "fmt", index: 232, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
return;
}
state.vesselsClipped.add(zone.id);
state.vesselDevices.set(zone.id, state.tool);
addLog(fmt(233, [name, zone.label]), "success", {
  kind: "fmt", index: 233, args: [{
    trIndex: isHarmonic?219: 220
  }, {
    zoneId: zone.id
  }]
});
if(zone.id==="rightMidVein")advance("middleVein");
if(state.completed.has("rightEBSLN")&&["rightSupArt", "rightSupVein"].every((id)=>state.vesselsClipped.has(id)))advance("superiorPole");
if(["rightInfArt", "rightInfVein"].every((id)=>state.vesselsClipped.has(id)))advance("inferiorPole");
return;
}
if(zone.id==="berryLigament"||zone.id==="isthmus"){
  if(zone.id==="isthmus"){
    state.completed.add("isthmus");
    addLog(fmt(234, [name]), "success", {
    kind: "fmt", index: 234, args: [{
      trIndex: isHarmonic?219: 220
    }]
});
advance("isthmus");
return;
}
addLog(fmt(235, [name]), "warning", {
  kind: "fmt", index: 235, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
return;
}
if(zone.type==="bleed"){
  state.bleeding=Math.max(0, state.bleeding-(isHarmonic?1: 2));
  addLog(fmt(236, [name]), "success", {
  kind: "fmt", index: 236, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
if(stages[state.stage].target==="hemostasis"&&state.bleeding===0){
  advance("hemostasis");
  addLog(tr(215), "success", {kind: "tr", index: 215});
}
return;
}
addLog(fmt(237, [name]), "warning", {
  kind: "fmt", index: 237, args: [{
    trIndex: isHarmonic?219: 220
  }]
});
}
function nearSuperiorCapsule(point, vesselId){
  if(!point)return true;
  const target=vesselId==="rightSupArt"?{
    x: 710,
    y: 218
  }: {
    x: 724,
    y: 256
  };
  return Math.hypot(point.x-target.x, point.y-target.y)<54;
}
function drawPath(path, color, width, dash=[]){
  ctx.save();
  ctx.strokeStyle=color;
  ctx.lineWidth=width;
  ctx.lineCap="round";
  ctx.setLineDash(dash);
  ctx.beginPath();
  path.forEach(([x, y], index)=>index?ctx.lineTo(x, y): ctx.moveTo(x, y));
ctx.stroke();
ctx.restore();
}
function drawLabel(text, x, y, align="center"){
  ctx.save();
  ctx.font="700 16px Inter, sans-serif";
  ctx.textAlign=align;
  ctx.fillStyle="#1c2a31";
  ctx.fillText(text, x, y);
  ctx.restore();
}
function ease(value){
  const t=Math.max(0, Math.min(1, value));
  return t*t*(3-2*t);
}
function anatomyMotion(){
  const now=performance.now();
  const t=prefersReducedMotion?0:(now-state.startTime)/1000;
  const breath=Math.sin(t*2.1)*4;
  const pulse=(Math.sin(t*5.6)+1)/2;
  const incision=ease(state.incisionProgress/2);
  const flaps=ease(state.flapProgress/2);
  const skinOpen=state.skinOpenedAt?(prefersReducedMotion?1:Math.max(0.08, ease((now-state.skinOpenedAt)/900))):incision;
  const fatClear=state.fatClearedAt?(prefersReducedMotion?1:Math.max(0.08, ease((now-state.fatClearedAt)/900))):flaps;
  const skin=state.incisionProgress>0?Math.max(0, 1-skinOpen):1;
  const fat=state.incisionProgress>0?Math.max(0, skinOpen*(1-fatClear)):0;
  const stepFlashAge=state.stepFlashAt?now-state.stepFlashAt:Infinity;
  const stepFlash=prefersReducedMotion?0:state.stepFlashAt?(stepFlashAge<=1000?1:Math.max(0, 1-(stepFlashAge-1000)/700)):0;
  const exposure=state.strapSeparatedAt?(prefersReducedMotion?1:Math.max(0.04, ease((now-state.strapSeparatedAt)/1100))):ease(state.exposureProgress);
const parathyroidReveal=ease(["nanocarbon", "parathyroids", "rln", "inferiorPole", "berry", "isthmus", "remove", "centralNodes", "nodeClearance", "hemostasis", "close"].includes(stages[state.stage].target)||state.completed.has("parathyroids")?1: exposure*0.5);
const nerveReveal=ease(state.completed.has("leftRLN")||state.completed.has("rightRLN")||state.stage>=4?1: exposure*0.45);
const linearProgress=state.action?Math.min(1, (now-state.action.startedAt)/state.action.duration):0;
const action=state.action?{
  ...state.action,
  linearProgress,
  progress: ease(linearProgress)
}:null;
const removal=state.removed?(prefersReducedMotion?1:ease((now-state.removedAt)/1200)):action?.tool==="forceps"?ease((action.linearProgress-0.5)/0.5):0;
const close=state.completed.has("close")?(prefersReducedMotion?1:ease((now-state.stageChangedAt)/1000)):0;
const inspectFocus=state.inspectFocus?Math.max(0, 1-(now-state.inspectFocus.startedAt)/700):0;
return{
  t,
  breath,
  pulse,
  incision,
  flaps,
  skin,
  skinOpen,
  fat,
  fatClear,
  stepFlash,
  exposure,
  parathyroidReveal,
  nerveReveal,
  removal,
  close,
  action,
  inspectFocus
};
}
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const motion=anatomyMotion();
  drawBackground(motion);
  drawAnatomy(motion);
  drawStrapMuscles(motion);
  drawSurfaceLayers(motion);
  drawHighlights(motion);
  drawInspectFocus(motion);
  drawTeachingOverlay(motion);
  drawActiveAction(motion);
  drawStepFlash(motion);
  drawToolCursor(motion);
}
function drawBackground(motion){
  ctx.fillStyle="#f2d7cd";
  roundRect(190, 74, 700, 560, 80);
  ctx.fill();
  ctx.fillStyle="rgba(140, 71, 62, 0.14)";
  roundRect(250, 128, 580, 452, 60);
  ctx.fill();
  ctx.strokeStyle="#b06b63";
  ctx.lineWidth=3;
  ctx.setLineDash([16, 10]);
roundRect(340, 544, 400, 34, 16);
ctx.stroke();
ctx.setLineDash([]);
if(motion.incision>0){
  const open=16+motion.incision*36-motion.close*34;
  const width=110+motion.incision*300-motion.close*280;
  const x=540-width/2;
  ctx.fillStyle="#8f3c40";
  roundRect(x, 552-open/2, width, Math.max(4, open), 20);
  ctx.fill();
  ctx.fillStyle="rgba(255, 210, 190, 0.48)";
  roundRect(x+18, 552-open/4, width-36, Math.max(3, open/2), 14);
  ctx.fill();
}
if(motion.flaps>0){
  ctx.save();
  ctx.globalAlpha=motion.flaps*0.75;
  ctx.strokeStyle="rgba(255, 245, 230, 0.95)";
  ctx.lineWidth=18;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(338, 510-motion.flaps*120);
  ctx.quadraticCurveTo(540, 470-motion.flaps*72, 742, 510-motion.flaps*120);
  ctx.moveTo(338, 586+motion.flaps*54);
  ctx.quadraticCurveTo(540, 626+motion.flaps*24, 742, 586+motion.flaps*54);
  ctx.stroke();
  ctx.restore();
}
}
function drawSurfaceLayers(motion){
  if(motion.fat>0.02||motion.fatClear>0.02){
    ctx.save();
    const clear=Math.min(1, motion.fatClear);
    if(motion.fat>0.02){
      ctx.save();
      ctx.globalAlpha=0.72*motion.fat;
      const fatGradient=ctx.createLinearGradient(256, 132, 824, 574);
      fatGradient.addColorStop(0, "#ffe8a8");
      fatGradient.addColorStop(0.54, "#f0c45b");
      fatGradient.addColorStop(1, "#d5a13a");
      ctx.fillStyle=fatGradient;
      roundRect(250, 128, 580, 452, 60);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha=0.92*motion.fat;
      for(let i=0;i<92;i+=1){
        const x=278+(i*47)%526;
        const y=152+((i*73)%390);
        const r=6+(i%5)*2;
        const drift=(x<540?-1:1)*clear*34;
        const lift=((i%2)?1:-1)*clear*8;
        ctx.fillStyle=i%2?"rgba(255, 242, 185, 0.58)":"rgba(218, 157, 36, 0.28)";
        ctx.beginPath();
        ctx.ellipse(x+drift, y+lift, r*1.35, r, (i%7)*0.18, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle="rgba(128, 91, 30, 0.16)";
        ctx.lineWidth=1;
        ctx.stroke();
      }
      ctx.strokeStyle="rgba(143, 93, 24, 0.28)";
      ctx.lineWidth=2;
      for(let i=0;i<10;i+=1){
        const y=166+i*35;
        ctx.beginPath();
        ctx.moveTo(300, y);
        ctx.bezierCurveTo(390, y-20, 500, y+20, 612, y-8);
        ctx.bezierCurveTo(690, y-26, 752, y+16, 792, y-6);
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.globalAlpha=0.95*motion.fat;
      ctx.strokeStyle="rgba(185, 47, 55, 0.68)";
      ctx.lineWidth=4;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.moveTo(338, 510);
      ctx.quadraticCurveTo(540, 468, 742, 510);
      ctx.moveTo(338, 586);
      ctx.quadraticCurveTo(540, 626, 742, 586);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      if(state.settings.labelMode&&motion.fat>0.1){
        ctx.save();
        ctx.globalAlpha=Math.min(0.9, motion.fat+0.1);
        ctx.fillStyle="rgba(255, 255, 255, 0.86)";
        roundRect(390, 184, 300, 30, 8);
        ctx.fill();
        ctx.fillStyle="#7b4f0d";
        ctx.font="800 13px Inter, sans-serif";
        ctx.textAlign="center";
        ctx.fillText(tr(311), 540, 204);
        ctx.restore();
      }
    }
    if(clear>0.02){
      ctx.save();
      ctx.globalAlpha=0.42*clear;
      ctx.fillStyle="#efc867";
      roundRect(214-clear*20, 214, 92, 258, 34);
      ctx.fill();
      roundRect(774+clear*20, 214, 92, 258, 34);
      ctx.fill();
      ctx.globalAlpha=0.32*clear;
      ctx.fillStyle="#fff0b8";
      for(let i=0;i<28;i+=1){
        const left=i%2===0;
        const x=left?232+(i*19)%58:792+(i*23)%58;
        const y=236+((i*41)%214);
        ctx.beginPath();
        ctx.ellipse(x, y, 12+(i%3)*3, 9+(i%2)*2, 0.2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  if(motion.skin>0.02||motion.skinOpen>0.02){
    ctx.save();
    const open=Math.min(1, motion.skinOpen);
    const skinGradient=ctx.createLinearGradient(190, 74, 890, 634);
    skinGradient.addColorStop(0, "#f7d1c5");
    skinGradient.addColorStop(0.55, "#edb7aa");
    skinGradient.addColorStop(1, "#d8958c");
    const sheetAlpha=Math.max(0, 1-open*0.98);
    if(sheetAlpha>0.02){
      ctx.save();
      ctx.globalAlpha=sheetAlpha;
      ctx.fillStyle=skinGradient;
      ctx.beginPath();
      ctx.rect(190, 74, 700, 280);
      ctx.clip();
      ctx.translate(0, -open*132);
      roundRect(190, 74, 700, 560, 80);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha=sheetAlpha;
      ctx.fillStyle=skinGradient;
      ctx.beginPath();
      ctx.rect(190, 354, 700, 280);
      ctx.clip();
      ctx.translate(0, open*132);
      roundRect(190, 74, 700, 560, 80);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha=0.18*(1-open);
      ctx.fillStyle="rgba(116, 61, 55, 0.34)";
      for(let i=0;i<64;i+=1){
        const x=222+(i*53)%636;
        const y=102+((i*89)%500);
        ctx.beginPath();
        ctx.arc(x, y, 1.1+(i%3)*0.35, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.strokeStyle="rgba(124, 72, 65, 0.12)";
      ctx.lineWidth=1.4;
      for(let i=0;i<12;i+=1){
        const y=122+i*38;
        ctx.beginPath();
        ctx.moveTo(228, y);
        ctx.bezierCurveTo(360, y-16, 490, y+18, 630, y-6);
        ctx.bezierCurveTo(724, y-22, 798, y+12, 856, y-2);
        ctx.stroke();
      }
      ctx.restore();
    }
    if(open>0.02){
      ctx.save();
      ctx.globalAlpha=0.58+open*0.24;
      ctx.fillStyle=skinGradient;
      roundRect(220, 78-open*28, 640, 56, 28);
      ctx.fill();
      roundRect(220, 586+open*18, 640, 56, 28);
      ctx.fill();
      ctx.strokeStyle="rgba(126, 64, 58, 0.28)";
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(248, 106-open*28);
      ctx.bezierCurveTo(390, 82-open*26, 642, 128-open*34, 832, 96-open*28);
      ctx.moveTo(248, 614+open*18);
      ctx.bezierCurveTo(390, 640+open*14, 642, 592+open*22, 832, 624+open*18);
      ctx.stroke();
      ctx.restore();
    }
    if(state.settings.labelMode&&motion.skin>0.08){
      ctx.globalAlpha=0.82*motion.skin;
      ctx.fillStyle="rgba(255, 255, 255, 0.78)";
      roundRect(412, 184, 256, 30, 8);
      ctx.fill();
      ctx.fillStyle="#7b3e38";
      ctx.font="800 13px Inter, sans-serif";
      ctx.textAlign="center";
      ctx.fillText(tr(310), 540, 204);
    }
    ctx.restore();
  }
}
function drawStrapMuscles(motion){
  const center=540;
  const split=ease(Math.min(1, motion.exposure*1.35));
  const retract=ease(Math.max(0, (motion.exposure-0.18)/0.82));
  const gap=8+split*48+retract*212;
  const width=172-retract*45;
  const lateralSlide=retract*110;
  const fade=0.98-retract*0.62;
  ctx.save();
  ctx.globalAlpha=fade;
  const gradientLeft=ctx.createLinearGradient(center-gap-width, 128, center-gap, 538);
  gradientLeft.addColorStop(0, "#cf807b");
  gradientLeft.addColorStop(0.55, "#b96061");
  gradientLeft.addColorStop(1, "#9d4e54");
  ctx.fillStyle=gradientLeft;
  roundRect(center-gap-width-lateralSlide, 126, width, 414, 48);
  ctx.fill();
  const gradientRight=ctx.createLinearGradient(center+gap, 128, center+gap+width, 538);
  gradientRight.addColorStop(0, "#cf807b");
  gradientRight.addColorStop(0.55, "#b96061");
  gradientRight.addColorStop(1, "#9d4e54");
  ctx.fillStyle=gradientRight;
  roundRect(center+gap+lateralSlide, 126, width, 414, 48);
  ctx.fill();
  ctx.strokeStyle="rgba(91, 37, 43, 0.38)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(center-gap-lateralSlide, 152);
  ctx.lineTo(center-gap-lateralSlide, 518);
  ctx.moveTo(center+gap+lateralSlide, 152);
  ctx.lineTo(center+gap+lateralSlide, 518);
  ctx.stroke();
  ctx.restore();
  if(motion.exposure<0.25){
    ctx.save();
    ctx.globalAlpha=0.72;
    ctx.strokeStyle="rgba(255, 231, 218, 0.78)";
    ctx.lineWidth=4;
    ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(center, 138);
  ctx.lineTo(center, 532);
  ctx.stroke();
  ctx.setLineDash([]);
ctx.fillStyle="rgba(255, 255, 255, 0.82)";
roundRect(404, 132, 272, 34, 8);
ctx.fill();
ctx.fillStyle="#7b353d";
ctx.font="800 13px Inter, sans-serif";
ctx.textAlign="center";
ctx.fillText(tr(238), center, 154);
ctx.restore();
}
if(motion.exposure>0.05){
  ctx.save();
  ctx.strokeStyle="rgba(20, 125, 143, 0.62)";
  ctx.lineWidth=5;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(438, 236);
  ctx.lineTo(438-motion.exposure*82, 210);
  ctx.moveTo(642, 236);
  ctx.lineTo(642+motion.exposure*82, 210);
  ctx.stroke();
  ctx.fillStyle="rgba(20, 125, 143, 0.72)";
  ctx.font="700 13px Inter, sans-serif";
  ctx.textAlign="center";
  ctx.fillText(tr(239), 540, 118);
  ctx.restore();
}
}
function drawAnatomy(motion){
  ctx.save();
  const bodyY=motion.breath;
  drawDeepLandmarks(bodyY, motion);
  ctx.fillStyle="#b9d9e9";
  roundRect(500, 174+bodyY, 96, 330, 40);
  ctx.fill();
  ctx.strokeStyle="rgba(28, 75, 94, 0.35)";
  ctx.lineWidth=2;
  for(let y=202; y<482; y+=34){
    ctx.beginPath();
    ctx.moveTo(512, y+bodyY);
    ctx.quadraticCurveTo(548, y+14+bodyY, 584, y+bodyY);
    ctx.stroke();
  }
  drawLabel(tr(240), 548, 164+bodyY);
  drawLarynx(bodyY);
  if(!state.removed||motion.removal<1){
    const liftX=motion.removal*210;
    const liftY=-motion.removal*110;
    const rotate=-0.08+motion.removal*0.24;
    thyroidLobe(650+liftX, 330+bodyY+liftY, 116, 172, "#cf6f91", rotate, 1-motion.removal*0.25, "right", motion);
    thyroidNodule(684+liftX, 310+bodyY+liftY, 42+motion.pulse*2, rotate, 1-motion.removal*0.25);
  }
  thyroidLobe(352, 330+bodyY, 104, 165, "#d989a4", -0.08, 1, "left", motion);
  thyroidIsthmus(456, 320+bodyY, 190, 74, motion);
  drawPosteriorThyroidLandmarks(bodyY, motion);
  drawCentralNodePackets(bodyY, motion);
  drawNanocarbonStain(bodyY, motion);
  drawVessel([[782, 146], [710, 218+bodyY]], "#d83b44", "rightSupArt", motion);
drawVessel([[786, 456], [650, 418+bodyY]], "#d83b44", "rightInfArt", motion);
drawVessel([[815, 188], [724, 256+bodyY]], "#3c6fc0", "rightSupVein", motion);
drawVessel([[812, 332], [742, 340+bodyY]], "#3c6fc0", "rightMidVein", motion);
drawVessel([[688, 514+bodyY], [560, 526+bodyY], [430, 514+bodyY]], "#3c6fc0", "rightInfVein", motion);
drawCapsuleClipTargets(bodyY, motion);
drawNerve([[472, 532+bodyY], [458, 438+bodyY], [456, 326+bodyY], [474, 190+bodyY]], "leftRLN", motion);
drawNerve([[628, 532+bodyY], [622, 432+bodyY], [620, 330+bodyY], [604, 190+bodyY]], "rightRLN", motion);
drawSuperiorLaryngealNerve([[744, 126+bodyY], [724, 166+bodyY], [710, 212+bodyY]], "rightEBSLN", motion);
drawSuperiorLaryngealNerve([[358, 126+bodyY], [376, 166+bodyY], [394, 216+bodyY]], "leftEBSLN", motion);
parathyroid(430, 258+bodyY, motion, "leftParaSup");
parathyroid(426, 414+bodyY, motion, "leftParaInf");
parathyroid(624, 258+bodyY, motion, "rightParaSup");
parathyroid(684, 390+bodyY, motion, "rightParaInf");
if(state.bleeding>0){
  ctx.fillStyle=`rgba(185, 47, 55, ${0.5 + motion.pulse * 0.35})`;
  ctx.beginPath();
  ctx.arc(742, 340+bodyY, 14+state.bleeding*4+motion.pulse*4, 0, Math.PI*2);
  ctx.fill();
  for(let i=0; i<state.bleeding; i+=1){
    ctx.beginPath();
    ctx.arc(736+i*12, 356+bodyY+Math.sin(motion.t*4+i)*8, 5, 0, Math.PI*2);
    ctx.fill();
  }
  drawLabel(tr(241), 768, 386+bodyY, "left");
}
ctx.restore();
}
function drawDeepLandmarks(bodyY, motion){
  ctx.save();
  ctx.globalAlpha=0.45+motion.exposure*0.35;
  ctx.fillStyle="rgba(130, 98, 88, 0.22)";
  roundRect(468, 214+bodyY, 154, 300, 46);
  ctx.fill();
  ctx.fillStyle="rgba(188, 57, 64, 0.75)";
  roundRect(224, 128, 24, 408, 12);
  ctx.fill();
  roundRect(838, 128, 24, 408, 12);
  ctx.fill();
  ctx.fillStyle="rgba(60, 111, 192, 0.72)";
  roundRect(172, 130, 28, 406, 14);
  ctx.fill();
  roundRect(890, 130, 28, 406, 14);
  ctx.fill();
  if(state.settings.labelMode&&motion.exposure>0.35){
    drawLabel(tr(243), 186, 118);
    drawLabel(tr(244), 880, 118);
  }
  ctx.restore();
}
function drawLarynx(bodyY){
  ctx.save();
  ctx.fillStyle="#cbd5da";
  roundRect(488, 108+bodyY, 120, 68, 26);
  ctx.fill();
  ctx.strokeStyle="rgba(62, 80, 89, 0.36)";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(516, 118+bodyY);
  ctx.lineTo(548, 162+bodyY);
  ctx.lineTo(580, 118+bodyY);
  ctx.stroke();
  ctx.fillStyle="#9fb3bd";
  roundRect(500, 166+bodyY, 96, 30, 15);
  ctx.fill();
  if(state.settings.labelMode){
    drawLabel(tr(246), 548, 102+bodyY);
  }
  ctx.restore();
}
function drawPosteriorThyroidLandmarks(bodyY, motion){
  if(state.removed)return;
  ctx.save();
  ctx.globalAlpha=0.35+motion.exposure*0.55;
  ctx.fillStyle="#b15d77";
  ctx.beginPath();
  ctx.arc(610, 286+bodyY, 18, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="rgba(139, 154, 161, 0.78)";
  roundRect(594, 280+bodyY, 58, 104, 18);
  ctx.fill();
  ctx.strokeStyle="rgba(35, 52, 60, 0.35)";
  ctx.stroke();
  if(state.settings.labelMode&&motion.exposure>0.3){
    drawLabel(tr(248), 670, 292+bodyY, "left");
    drawLabel(tr(249), 634, 276+bodyY, "left");
  }
  ctx.restore();
}
function drawCentralNodePackets(bodyY, motion){
  const packets=[
    {
      id: "delphianNodes",
      x: 548,
      y: 236+bodyY,
      rx: 42,
      ry: 28
    },
    {
      id: "pretrachealNodes",
      x: 548,
      y: 474+bodyY,
      rx: 54,
      ry: 48
    },
    {
      id: "rightParatrachealNodes",
      x: 650,
      y: 452+bodyY,
      rx: 52,
      ry: 82
    }
  ];
  packets.forEach((packet, packetIndex)=>{
    if(state.nodalCleared.has(packet.id))return;
    const mobilized=state.nodalMobilized.has(packet.id);
    const reveal=packet.id==="rightParatrachealNodes"?0.22+motion.exposure*0.55+motion.removal*0.2: 0.34+motion.exposure*0.42;
    ctx.save();
    ctx.globalAlpha=Math.min(0.95, reveal);
    ctx.fillStyle=mobilized?"rgba(255, 248, 232, 0.92)": "rgba(229, 205, 162, 0.72)";
    ctx.beginPath();
    ctx.ellipse(packet.x, packet.y, packet.rx, packet.ry, packet.id==="rightParatrachealNodes"?-0.12: 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle=mobilized?"rgba(156, 104, 38, 0.78)": "rgba(126, 91, 47, 0.42)";
    ctx.lineWidth=mobilized?3: 2;
    ctx.setLineDash(mobilized?[5, 4]: []);
ctx.stroke();
ctx.setLineDash([]);
for(let i=0; i<7; i+=1){
  const angle=(i/7)*Math.PI*2+packetIndex*0.52;
  const radiusX=packet.rx*(0.28+(i%3)*0.14);
  const radiusY=packet.ry*(0.22+((i+1)%3)*0.12);
  ctx.fillStyle=i%2?"#d9b779": "#ecd69f";
  ctx.beginPath();
  ctx.arc(packet.x+Math.cos(angle)*radiusX, packet.y+Math.sin(angle)*radiusY, 8+(i%2), 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle="rgba(114, 79, 39, 0.32)";
  ctx.lineWidth=1.3;
  ctx.stroke();
}
ctx.restore();
});
}
function drawNanocarbonStain(bodyY, motion){
  if(!state.completed.has("nanocarbon"))return;
  ctx.save();
  ctx.fillStyle="rgba(12, 15, 16, 0.72)";
  if(!state.removed||motion.removal<1){
    const liftX=motion.removal*210;
    const liftY=-motion.removal*110;
    const specimenAlpha=0.62*(1-motion.removal*0.25);
    ctx.globalAlpha=specimenAlpha;
    ctx.beginPath();
    ctx.ellipse(650+liftX, 330+bodyY+liftY, 118, 172, -0.08+motion.removal*0.24, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(684+liftX, 310+bodyY+liftY, 44+motion.pulse*1.5, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=state.completed.has("isthmus")?0.26:0.54;
  roundRect(456, 320+bodyY, 190, 74, 34);
  ctx.fill();
  if(!state.removed){
    ctx.globalAlpha=0.9;
    ctx.strokeStyle="rgba(15, 18, 20, 0.72)";
    ctx.lineWidth=3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(648, 330+bodyY, 134, 190, -0.08, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}
function thyroidLobe(x, y, rx, ry, color, rotation=-0.08, alpha=1, side="right", motion={
  pulse: 0
}){
  ctx.save();
  ctx.globalAlpha=alpha;
  const gradient=ctx.createRadialGradient(x-rx*0.22, y-ry*0.38, rx*0.08, x, y, ry*0.95);
  gradient.addColorStop(0, lighten(color, 30));
  gradient.addColorStop(0.52, color);
  gradient.addColorStop(1, darken(color, 16));
  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI*2);
  ctx.fill();
  ctx.save();
  ctx.clip();
  drawThyroidLobules(x, y, rx, ry, rotation, side);
  drawThyroidSurfaceVessels(x, y, rx, ry, rotation, side, motion);
  ctx.restore();
  ctx.strokeStyle="rgba(95, 43, 62, 0.62)";
  ctx.lineWidth=4;
  ctx.stroke();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha=alpha*0.62;
  ctx.strokeStyle="rgba(255, 232, 238, 0.62)";
  ctx.lineWidth=2.2;
  ctx.setLineDash([10, 8]);
ctx.beginPath();
ctx.ellipse(0, 0, rx-12, ry-14, 0, 0, Math.PI*2);
ctx.stroke();
ctx.setLineDash([]);
ctx.strokeStyle="rgba(95, 43, 62, 0.28)";
ctx.lineWidth=1.8;
for(let i=-2; i<=2; i+=1){
  ctx.beginPath();
  ctx.moveTo(-rx*0.46, i*ry*0.18);
  ctx.quadraticCurveTo(0, i*ry*0.14+Math.sin(i+motion.t)*5, rx*0.5, i*ry*0.22);
  ctx.stroke();
}
ctx.restore();
ctx.globalAlpha=Math.min(0.3, alpha);
ctx.fillStyle="rgba(255,255,255,0.85)";
ctx.beginPath();
ctx.ellipse(x-rx*0.25, y-ry*0.35, rx*0.26, ry*0.42, rotation, 0, Math.PI*2);
ctx.fill();
ctx.globalAlpha=alpha*0.82;
ctx.fillStyle="rgba(116, 48, 72, 0.24)";
const pole=side==="right"?1: -1;
ctx.beginPath();
ctx.ellipse(x+pole*rx*0.36, y-ry*0.72, rx*0.22, ry*0.12, rotation+pole*0.36, 0, Math.PI*2);
ctx.fill();
ctx.beginPath();
ctx.ellipse(x+pole*rx*0.28, y+ry*0.75, rx*0.2, ry*0.12, rotation-pole*0.22, 0, Math.PI*2);
ctx.fill();
ctx.restore();
}
function thyroidIsthmus(x, y, w, h, motion){
  ctx.save();
  if(state.completed.has("isthmus")){
    ctx.beginPath();
    ctx.rect(x-2, y-90, w/2-5, h+100);
    ctx.rect(x+w/2+5, y-90, w/2-3, h+100);
    ctx.clip();
  }
  const gradient=ctx.createLinearGradient(x, y, x+w, y+h);
  gradient.addColorStop(0, "#e09aac");
  gradient.addColorStop(0.5, "#d17d9a");
  gradient.addColorStop(1, "#be6685");
  ctx.fillStyle=gradient;
  roundRect(x, y, w, h, 34);
  ctx.fill();
  ctx.save();
  roundRect(x, y, w, h, 34);
  ctx.clip();
  for(let i=0; i<7; i+=1){
    ctx.strokeStyle=`rgba(123, 52, 76, ${0.12 + i * 0.01})`;
    ctx.lineWidth=2;
    ctx.beginPath();
    const px=x+22+i*25;
    ctx.moveTo(px, y+10);
    ctx.quadraticCurveTo(px+Math.sin(i)*10, y+h/2+motion.pulse*2, px+6, y+h-8);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle="rgba(95, 43, 62, 0.55)";
  ctx.lineWidth=3;
  roundRect(x, y, w, h, 34);
  ctx.stroke();
  ctx.restore();
}
function thyroidNodule(x, y, r, rotation, alpha=1){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.translate(x, y);
  ctx.rotate(rotation+0.18);
  const gradient=ctx.createRadialGradient(-10, -12, 6, 0, 0, r);
  gradient.addColorStop(0, "#c77a92");
  gradient.addColorStop(0.48, "#a54e6a");
  gradient.addColorStop(1, "#73364e");
  ctx.fillStyle=gradient;
  ctx.beginPath();
  for(let i=0; i<18; i+=1){
    const angle=(i/18)*Math.PI*2;
    const radius=r*(0.86+0.12*Math.sin(i*1.7)+0.08*Math.cos(i*2.4));
    const px=Math.cos(angle)*radius;
    const py=Math.sin(angle)*radius*0.92;
    i===0?ctx.moveTo(px, py): ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle="rgba(91, 38, 57, 0.72)";
  ctx.lineWidth=3;
  ctx.stroke();
  ctx.globalAlpha=alpha*0.58;
  ctx.fillStyle="rgba(255, 222, 228, 0.52)";
  ctx.beginPath();
  ctx.ellipse(-12, -14, r*0.25, r*0.18, -0.5, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle="rgba(255, 225, 229, 0.38)";
  ctx.lineWidth=2;
  for(let i=0; i<4; i+=1){
    ctx.beginPath();
    ctx.arc(-4+i*5, -2+Math.sin(i)*8, r*(0.22+i*0.05), 0.25, 2.8);
    ctx.stroke();
  }
  ctx.fillStyle="rgba(255, 242, 220, 0.86)";
  for(let i=0; i<5; i+=1){
    const angle=i*1.18;
    ctx.beginPath();
    ctx.arc(Math.cos(angle)*r*0.36, Math.sin(angle)*r*0.24, 2.3, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.strokeStyle="rgba(62, 22, 38, 0.42)";
  ctx.lineWidth=1.6;
  ctx.beginPath();
  ctx.arc(2, 2, r*0.64, -0.4, 2.6);
  ctx.stroke();
  ctx.restore();
}
function drawThyroidLobules(x, y, rx, ry, rotation, side){
  const seed=side==="right"?11: 29;
  for(let row=-2; row<=2; row+=1){
    for(let col=-2; col<=2; col+=1){
      const jitter=Math.sin((row*9+col*5+seed)*1.37);
      const px=x+col*rx*0.25+jitter*8;
      const py=y+row*ry*0.18+Math.cos((row+seed)*2.1)*7;
      const inside=((px-x)**2)/(rx**2)+((py-y)**2)/(ry**2);
      if(inside>0.82)continue;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rotation+jitter*0.2);
      ctx.fillStyle=row%2===0?"rgba(255, 210, 220, 0.16)": "rgba(112, 45, 70, 0.1)";
      ctx.beginPath();
      ctx.ellipse(0, 0, rx*(0.12+Math.abs(jitter)*0.02), ry*0.075, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle="rgba(93, 39, 61, 0.09)";
      ctx.lineWidth=1.4;
      ctx.stroke();
      ctx.restore();
    }
  }
}
function drawThyroidSurfaceVessels(x, y, rx, ry, rotation, side, motion){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const pole=side==="right"?1: -1;
  ctx.lineCap="round";
  ctx.strokeStyle=`rgba(180, 42, 55, ${0.28 + motion.pulse * 0.08})`;
  ctx.lineWidth=2.2;
  for(let i=0; i<5; i+=1){
    const startY=-ry*0.72+i*ry*0.32;
    ctx.beginPath();
    ctx.moveTo(pole*rx*0.72, startY);
    ctx.quadraticCurveTo(pole*rx*(0.28+i*0.02), startY+ry*0.12, pole*rx*0.12, startY+ry*0.22);
    ctx.stroke();
  }
  ctx.strokeStyle="rgba(60, 111, 192, 0.22)";
  ctx.lineWidth=1.8;
  for(let i=0; i<4; i+=1){
    const startY=-ry*0.55+i*ry*0.34;
    ctx.beginPath();
    ctx.moveTo(pole*rx*0.62, startY+16);
    ctx.quadraticCurveTo(pole*rx*0.1, startY+ry*0.1, -pole*rx*0.12, startY+ry*0.16);
    ctx.stroke();
  }
  ctx.restore();
}
function lighten(hex, amount){
  return shade(hex, amount);
}
function darken(hex, amount){
  return shade(hex, -amount);
}
function shade(hex, amount){
  const clean=hex.replace("#", "");
  const num=parseInt(clean, 16);
  const r=Math.max(0, Math.min(255, (num>>16)+amount));
  const g=Math.max(0, Math.min(255, ((num>>8)&255)+amount));
  const b=Math.max(0, Math.min(255, (num&255)+amount));
  return`rgb(${r}, ${g}, ${b})`;
}
function parathyroid(x, y, motion, id){
  const mobilized=state.completed.has(id);
  const contrast=state.completed.has("nanocarbon");
  ctx.save();
  ctx.globalAlpha=Math.max(0.18, motion.parathyroidReveal);
  ctx.fillStyle=mobilized?(contrast?"rgba(255, 235, 235, 0.82)":"rgba(255, 235, 235, 0.72)"):"#f0d85a";
  ctx.beginPath();
  ctx.arc(x, y, 21, 0, Math.PI*2);
  ctx.fill();
  if(mobilized||contrast){
    ctx.shadowColor="rgba(244, 201, 93, 0.85)";
    ctx.shadowBlur=(mobilized?18:10)+motion.pulse*8;
  }
  if(mobilized){
    ctx.fillStyle="#c94b4b";
    ctx.beginPath();
    ctx.arc(x, y, 13+motion.pulse*2, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.shadowBlur=0;
  ctx.strokeStyle=mobilized?(contrast?"rgba(255, 222, 100, 0.78)":"rgba(118, 32, 32, 0.48)"):"rgba(157, 119, 20, 0.82)";
  ctx.lineWidth=mobilized&&contrast?3:2;
  ctx.stroke();
  ctx.restore();
}
function drawVessel(path, color, id, motion){
  const clipped=state.vesselsClipped.has(id);
  const activeEnergy=motion.action&&motion.action.targetId===id&&["harmonic", "advancedBipolar"].includes(motion.action.tool);
  const separation=clipped?1:activeEnergy?ease(Math.max(0, (motion.action.progress-0.62)/0.3)):0;
  const width=clipped?5: 8+motion.pulse*5;
  const alpha=clipped?0.42: 0.95;
  ctx.save();
  ctx.globalAlpha=alpha;
  if(separation>0)drawSeparatedVessel(path, color, width, separation);
  else drawPath(path, color, width);
  ctx.restore();
  if(clipped&&state.vesselDevices.get(id)==="clip"){
    const [x, y]=path[path.length-1];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.2);
    ctx.fillStyle="#d4d9dc";
    roundRect(-12, -8, 24, 6, 2);
    ctx.fill();
    roundRect(-12, 4, 24, 6, 2);
    ctx.fill();
    ctx.restore();
  }
}
function drawSeparatedVessel(path, color, width, separation){
  const index=path.length-2;
  const [ax, ay]=path[index];
  const [bx, by]=path[index+1];
  const gap=0.12*separation;
  const left=[lerp(ax, bx, 0.5-gap), lerp(ay, by, 0.5-gap)];
  const right=[lerp(ax, bx, 0.5+gap), lerp(ay, by, 0.5+gap)];
  drawPath([...path.slice(0, index+1), left], color, width);
  drawPath([right, ...path.slice(index+1)], color, width);
  ctx.save();
  ctx.fillStyle="#7c3037";
  ctx.strokeStyle="rgba(255, 220, 192, 0.65)";
  ctx.lineWidth=1.5;
  [left, right].forEach(([x, y])=>{
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3, width*0.65), 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}
function drawNerve(path, id, motion){
  const mapped=state.completed.has(id);
  ctx.save();
  ctx.globalAlpha=Math.max(0.2, motion.nerveReveal);
  if(mapped){
    ctx.shadowColor="rgba(240, 220, 66, 0.85)";
    ctx.shadowBlur=14+motion.pulse*12;
  }
  drawPath(path, "#f0dc42", mapped?9+motion.pulse*2: 7);
  ctx.shadowBlur=0;
  ctx.globalAlpha=Math.max(0.32, motion.nerveReveal);
  drawPath(path, "rgba(82, 64, 0, 0.32)", 2);
  ctx.restore();
}
function drawSuperiorLaryngealNerve(path, id, motion){
  const mapped=state.completed.has(id);
  ctx.save();
  ctx.globalAlpha=Math.max(0.18, motion.nerveReveal*0.85);
  if(mapped){
    ctx.shadowColor="rgba(155, 122, 221, 0.85)";
    ctx.shadowBlur=12+motion.pulse*8;
  }
  drawPath(path, "#9b7add", mapped?7+motion.pulse*2: 5, [8, 5]);
ctx.shadowBlur=0;
ctx.globalAlpha=Math.max(0.28, motion.nerveReveal*0.8);
drawPath(path, "rgba(66, 45, 112, 0.34)", 2, [4, 6]);
ctx.restore();
}
function drawCapsuleClipTargets(bodyY, motion){
  if(stages[state.stage].target!=="superiorPole")return;
ctx.save();
if(!state.completed.has("rightEBSLN")){
  ctx.fillStyle="rgba(255, 255, 255, 0.9)";
  roundRect(650, 108+bodyY, 250, 42, 8);
  ctx.fill();
  ctx.fillStyle="#432d70";
  ctx.font="800 13px Inter, sans-serif";
  ctx.textAlign="left";
  ctx.fillText(tr(253), 664, 134+bodyY);
  ctx.restore();
  return;
}
const targets=[
  {
    id: "rightSupArt",
    x: 710,
    y: 218+bodyY,
    color: "#d83b44",
    label: state.vesselsClipped.has("rightSupArt")?tr(254): tr(255)
  },
  {
    id: "rightSupVein",
    x: 724,
    y: 256+bodyY,
    color: "#3c6fc0",
    label: state.vesselsClipped.has("rightSupVein")?tr(256): tr(257)
  }
];
targets.forEach((target, index)=>{
  ctx.strokeStyle=target.color;
  ctx.globalAlpha=state.vesselsClipped.has(target.id)?0.38: 1;
  ctx.lineWidth=state.vesselsClipped.has(target.id)?2: 4;
  ctx.setLineDash([6, 5]);
ctx.beginPath();
ctx.arc(target.x, target.y, 22+motion.pulse*4, 0, Math.PI*2);
ctx.stroke();
ctx.setLineDash([]);
ctx.fillStyle="rgba(255, 255, 255, 0.86)";
roundRect(target.x+16, target.y-16+index*6, 126, 24, 6);
ctx.fill();
ctx.globalAlpha=1;
ctx.fillStyle="#24333a";
ctx.font="700 12px Inter, sans-serif";
ctx.textAlign="left";
ctx.fillText(target.label, target.x+24, target.y+index*6);
});
ctx.restore();
}
function drawHighlights(motion){
  const target=stages[
    state.stage
  ].target;
  const ids=targetZoneIds(target);
  const guideColor=`rgba(254, 243, 199, ${0.72 + motion.pulse * 0.22})`;
  ctx.save();
  ctx.strokeStyle=guideColor;
  ctx.lineWidth=4+motion.pulse*2;
  ctx.shadowColor="rgba(80, 45, 10, 0.46)";
  ctx.shadowBlur=5;
  ctx.setLineDash([8, 8+motion.pulse*8]);
zones.filter((zone)=>ids.includes(zone.id)).forEach((zone)=>{
  if(zone.path){
    drawPath(zone.path, "rgba(80, 45, 10, 0.58)", 8, [8, 8]);
    drawPath(zone.path, guideColor, 5, [8, 8]);
  }
else if(zone.r){
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.r+10, 0, Math.PI*2);
  ctx.stroke();
}
else if(zone.rx){
  ctx.beginPath();
  ctx.ellipse(zone.x, zone.y, zone.rx+10, zone.ry+10, -0.08, 0, Math.PI*2);
  ctx.stroke();
}
else{
  roundRect(zone.x-8, zone.y-8, zone.w+16, zone.h+16, 16);
  ctx.stroke();
}
});
ctx.restore();
}
function drawTeachingOverlay(motion){
  const target=stages[
    state.stage
  ].target;
  const lines={
    incision: [
      tr(261),
      tr(262)
    ],
    flaps: [
      tr(263),
      tr(264)
    ],
    strap: [
      tr(265),
      tr(266)
    ],
    middleVein: [
      tr(267),
      tr(268)
    ],
    ebsln: [
      tr(271),
      tr(272)
    ],
    superiorPole: [
      tr(269),
      tr(270)
    ],
    nanocarbon: [
      tr(307),
      tr(308)
    ],
    parathyroids: [
      tr(273),
      tr(274)
    ],
    rln: [
      tr(275),
      tr(276)
    ],
    inferiorPole: [
      tr(277),
      tr(278)
    ],
    berry: [
      tr(279),
      tr(280)
    ],
    isthmus: [
      tr(281),
      tr(282)
    ],
    remove: [
      tr(283),
      tr(284)
    ],
    centralNodes: [
      tr(285),
      tr(286)
    ],
    nodeClearance: [
      tr(287),
      tr(288)
    ],
    hemostasis: [
      tr(289),
      tr(290)
    ],
    close: [
      tr(291),
      tr(292)
    ]
  }
  [
    target
  ]||[
    tr(293),
    tr(294)
  ];
  ctx.save();
  ctx.globalAlpha=0.9;
  ctx.fillStyle="rgba(255, 255, 255, 0.82)";
  roundRect(44, 34, 276, 76, 8);
  ctx.fill();
  ctx.fillStyle="#0e5965";
  ctx.font="800 14px Inter, sans-serif";
  ctx.textAlign="left";
  ctx.fillText(tr(295), 60, 60);
  ctx.fillStyle="#314047";
  ctx.font="13px Inter, sans-serif";
  ctx.fillText(lines[0], 60, 82);
ctx.fillText(lines[1], 60, 101);
ctx.restore();
}
function actionTarget(zone){
  if(zone.path){
    const middle=zone.path[Math.floor(zone.path.length/2)];
    return{x: middle[0], y: middle[1]};
  }
  if(zone.r||zone.rx)return{x: zone.x, y: zone.y};
  return{x: zone.x+zone.w/2, y: zone.y+zone.h/2};
}
function vesselCutTarget(zone){
  if(!zone.path)return actionTarget(zone);
  const index=zone.path.length-2;
  const [ax, ay]=zone.path[index];
  const [bx, by]=zone.path[index+1];
  return{x:lerp(ax, bx, 0.5), y:lerp(ay, by, 0.5)};
}
function lerp(from, to, progress){
  return from+(to-from)*progress;
}
const spritePoses={
  inspect:{scale:0.52, rotation:0, tip:{x:0.5, y:0.5}, cursorScale:0.23},
  scalpel:{scale:0.88, rotation:2.35, tip:{x:0.06, y:0.94}, cursorScale:0.32},
  retractor:{scale:0.7, rotation:-0.67, tip:{x:0.85, y:0.05}, cursorScale:0.28},
  nanocarbon:{scale:0.7, rotation:2.35, tip:{x:0.05, y:0.92}, cursorScale:0.28},
  dissector:{scale:0.76, rotation:-0.67, tip:{x:0.92, y:0.07}, cursorScale:0.29},
  nerveProbe:{scale:0.76, rotation:2.35, tip:{x:0.05, y:0.95}, cursorScale:0.29},
  clip:{scale:0.74, rotation:2.35, tip:{x:0.06, y:0.96}, cursorScale:0.28},
  harmonic:{scale:1.85, rotation:Math.PI/2, tip:{x:0.08, y:0.52}, cursorScale:0.42},
  advancedBipolar:{scale:1.7, rotation:0.72, tip:{x:0.04, y:0.03}, cursorScale:0.42},
  monopolar:{scale:0.86, rotation:2.35, tip:{x:0.05, y:0.94}, cursorScale:0.32},
  cautery:{scale:0.86, rotation:2.35, tip:{x:0.05, y:0.95}, cursorScale:0.32},
  forceps:{scale:0.78, rotation:2.35, tip:{x:0.05, y:0.95}, cursorScale:0.3},
  suture:{scale:0.74, rotation:2.35, tip:{x:0.05, y:0.95}, cursorScale:0.28}
};
function drawInstrumentSprite(tool, x, y, scale=0.42, rotation=0, alpha=1){
  const image=instrumentImages[tool];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha=alpha;
  if(image&&image.complete&&image.naturalWidth){
    const size=313*scale;
    ctx.drawImage(image, -size/2, -size/2, size, size);
  }
  ctx.restore();
}
function drawToolAtTarget(tool, target, approach=1, scaleMultiplier=1, alpha=1, tremor=0){
  const pose=spritePoses[tool]||spritePoses.dissector;
  const scale=pose.scale*scaleMultiplier;
  const size=313*scale;
  const rotation=pose.rotation+tremor;
  const nativeTip={x:(pose.tip.x-0.5)*size, y:(pose.tip.y-0.5)*size};
  const tipOffset={
    x:nativeTip.x*Math.cos(rotation)-nativeTip.y*Math.sin(rotation),
    y:nativeTip.x*Math.sin(rotation)+nativeTip.y*Math.cos(rotation)
  };
  const travel=1-approach;
  const tip={x:target.x+travel*160, y:target.y+travel*120};
  drawInstrumentSprite(tool, tip.x-tipOffset.x, tip.y-tipOffset.y, scale, rotation, alpha);
}
function drawOverheadCutTip(tool, target, approach){
  const image=actionImages[`${tool}Tip`];
  if(!image||!image.complete||!image.naturalWidth){
    drawToolAtTarget(tool, target, approach, 0.62);
    return;
  }
  const height=300;
  const width=height*(image.naturalWidth/image.naturalHeight);
  const nativeTip={x:0, y:(0.047-0.5)*height};
  const travel=1-approach;
  const tip={x:target.x+travel*110, y:target.y+travel*120};
  ctx.save();
  ctx.translate(tip.x-nativeTip.x, tip.y-nativeTip.y);
  ctx.drawImage(image, -width/2, -height/2, width, height);
  ctx.restore();
}
function drawContact(target, color, radius, alpha=1){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(target.x, target.y, radius, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}
function drawCutLine(start, end, progress, color, width){
  const cut={x:lerp(start.x, end.x, progress), y:lerp(start.y, end.y, progress)};
  ctx.save();
  ctx.strokeStyle="rgba(255, 220, 205, 0.76)";
  ctx.lineWidth=width+3;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(cut.x, cut.y);
  ctx.stroke();
  ctx.strokeStyle=color;
  ctx.lineWidth=width;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(cut.x, cut.y);
  ctx.stroke();
  ctx.restore();
}
function drawSteppedCutSites(start, end, progress, color, steps=3){
  for(let i=0;i<steps;i+=1){
    const visible=Math.max(0, Math.min(1, (progress-i/steps)/0.16));
    if(visible<=0)continue;
    const point={x:lerp(start.x, end.x, i/(steps-1)), y:lerp(start.y, end.y, i/(steps-1))};
    ctx.save();
    ctx.globalAlpha=0.42+visible*0.4;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, 7, 14, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle="rgba(255, 221, 205, 0.7)";
    ctx.beginPath();
    ctx.ellipse(point.x-1, point.y-3, 2.5, 7, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}
function drawSparks(target, activation, color="#fff0ad"){
  if(activation<=0)return;
  ctx.save();
  ctx.strokeStyle=color;
  ctx.lineWidth=2.2;
  ctx.lineCap="round";
  ctx.globalAlpha=activation;
  for(let i=0;i<6;i+=1){
    const angle=i*Math.PI/3+0.2;
    const length=10+activation*14+(i%2)*5;
    ctx.beginPath();
    ctx.moveTo(target.x+Math.cos(angle)*4, target.y+Math.sin(angle)*4);
    ctx.lineTo(target.x+Math.cos(angle)*length, target.y+Math.sin(angle)*length);
    ctx.stroke();
  }
  ctx.restore();
}
function drawSmoke(target, opacity, color="210, 208, 197", drift=0){
  if(opacity<=0)return;
  ctx.save();
  ctx.filter="blur(1.25px)";
  for(let i=0;i<4;i+=1){
    const rise=10+i*13+drift*44;
    ctx.globalAlpha=opacity*(0.86-i*0.13);
    ctx.fillStyle=`rgb(${color})`;
    ctx.beginPath();
    ctx.ellipse(target.x+Math.sin(i*4+drift*8)*13, target.y-rise, 7+i*3+drift*4, 4+i*2+drift*2, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
function drawElectricalGlow(target, activation){
  if(activation<=0)return;
  const glow=ctx.createRadialGradient(target.x, target.y, 1, target.x, target.y, 26+activation*16);
  glow.addColorStop(0, "rgba(255, 255, 228, 0.9)");
  glow.addColorStop(0.3, "rgba(137, 201, 255, 0.58)");
  glow.addColorStop(1, "rgba(104, 156, 255, 0)");
  ctx.save();
  ctx.globalAlpha=activation;
  ctx.fillStyle=glow;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 26+activation*16, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle="#c5e6ff";
  ctx.lineWidth=1.8;
  for(let i=0;i<3;i+=1){
    const x=target.x-8+i*8;
    ctx.beginPath();
    ctx.moveTo(x, target.y-12);
    ctx.lineTo(x+4, target.y-2);
    ctx.lineTo(x-2, target.y+9);
    ctx.stroke();
  }
  ctx.restore();
}
function drawAblationBed(target, activation, color){
  if(activation<=0)return;
  const gradient=ctx.createRadialGradient(target.x-4, target.y-4, 1, target.x, target.y, 28+activation*12);
  gradient.addColorStop(0, "rgba(255, 244, 190, 0.9)");
  gradient.addColorStop(0.34, color);
  gradient.addColorStop(1, "rgba(91, 42, 35, 0)");
  ctx.save();
  ctx.globalAlpha=0.56+activation*0.3;
  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.ellipse(target.x, target.y, 22+activation*11, 14+activation*7, -0.35, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}
function drawBluntSeparation(target, progress){
  const twist=Math.sin(progress*Math.PI*2)*0.16;
  const spread=8+ease(Math.max(0, (progress-0.25)/0.75))*20;
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.rotate(twist);
  ctx.globalAlpha=0.34;
  ctx.fillStyle="#f0d8c2";
  ctx.beginPath();
  ctx.ellipse(-spread, 0, 18, 10, -0.32, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(spread, 0, 18, 10, 0.32, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  return twist;
}
function drawInspectFocus(motion){
  if(!state.inspectFocus||motion.inspectFocus<=0)return;
  const zone=zones.find((item)=>item.id===state.inspectFocus.zoneId);
  if(!zone)return;
  const target=actionTarget(zone);
  const radius=28+(1-motion.inspectFocus)*38;
  ctx.save();
  ctx.globalAlpha=motion.inspectFocus;
  ctx.strokeStyle="#147d8f";
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.arc(target.x, target.y, radius, 0, Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(target.x+radius*0.7, target.y+radius*0.7);
  ctx.lineTo(target.x+radius+22, target.y+radius+22);
  ctx.stroke();
  ctx.restore();
}
function drawActiveAction(motion){
  const action=motion.action;
  if(!action)return;
  const zone=zones.find((item)=>item.id===action.targetId);
  if(!zone)return;
  const target=["artery", "vein"].includes(zone.type)?vesselCutTarget(zone):actionTarget(zone);
  const p=action.progress;
  const linear=action.linearProgress??p;
  const vesselEnergy=["harmonic", "advancedBipolar"].includes(action.tool)&&["artery", "vein"].includes(zone.type);
  const approach=ease(Math.min(1, linear/(vesselEnergy?0.22:0.28)));
  const energyActivation=p>0.48&&p<0.78?Math.sin(((p-0.48)/0.3)*Math.PI):0;
  if(action.tool==="scalpel"){
    const isIncision=zone.id==="incision";
    const start=isIncision?{x:340,y:552}:{x:target.x-54,y:target.y};
    const end=isIncision?{x:740,y:552}:{x:target.x+54,y:target.y};
    const blade={x:lerp(start.x,end.x,p), y:lerp(start.y,end.y,p)};
    drawToolAtTarget("scalpel", blade, 1, 0.86);
    drawCutLine(start, end, p, "rgba(122, 39, 42, 0.92)", isIncision?7:5);
    return;
  }
  if(action.tool==="retractor"){
    const spread=ease(Math.max(0, (p-0.4)/0.6))*42;
    drawToolAtTarget("retractor", target, approach, 0.78);
    ctx.save();
    ctx.strokeStyle="rgba(255, 245, 230, 0.84)";
    ctx.lineWidth=12;
    ctx.lineCap="round";
    ctx.beginPath();
    ctx.moveTo(target.x-22-spread, target.y-18);
    ctx.lineTo(target.x-68-spread, target.y-68);
    ctx.moveTo(target.x+22+spread, target.y+18);
    ctx.lineTo(target.x+68+spread, target.y+68);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if(action.tool==="nanocarbon"){
    drawToolAtTarget("nanocarbon", target, approach, 0.8);
    if(p>0.42){
      const stain=ease((p-0.42)/0.58);
      drawContact(target, "rgba(15, 18, 20, 0.72)", 12+stain*46, 0.18+stain*0.32);
    }
    return;
  }
  if(action.tool==="nerveProbe"){
    drawToolAtTarget("nerveProbe", target, approach, 0.8);
    if(p>0.38){
      const ring=ease((p-0.38)/0.62);
      ctx.save();
      ctx.strokeStyle="rgba(240, 220, 66, 0.85)";
      ctx.lineWidth=3;
      for(let i=0;i<3;i+=1){
        ctx.globalAlpha=0.72-i*0.2;
        ctx.beginPath();
        ctx.arc(target.x, target.y, 12+ring*52+i*12, 0, Math.PI*2);
        ctx.stroke();
      }
      ctx.restore();
    }
    return;
  }
  if(action.tool==="dissector"){
    const twist=drawBluntSeparation(target, p);
    drawToolAtTarget("dissector", target, approach, 0.8, 1, twist);
    return;
  }
  if(["harmonic", "advancedBipolar"].includes(action.tool)){
    const harmonic=action.tool==="harmonic";
    const advancedBipolar=action.tool==="advancedBipolar";
    const vesselCut=advancedBipolar&&["artery", "vein"].includes(zone.type);
    const color=harmonic?"rgba(232, 136, 35, 0.9)":"rgba(141, 93, 192, 0.9)";
    let contact=target;
    let cutStart=null;
    let cutEnd=null;
    let cutProgress=0;
    const cutSteps=zone.id==="isthmus"?2:3;
    if((harmonic||advancedBipolar)&&zone.id==="strapWindow"){
      cutStart={x:540, y:462};
      cutEnd={x:540, y:224};
      cutProgress=Math.max(0, Math.min(1, (linear-0.3)/0.7));
      const cut=Math.min(cutSteps-1, Math.floor(Math.min(cutProgress, 0.999)*cutSteps));
      contact={x:540, y:lerp(cutStart.y, cutEnd.y, cut/(cutSteps-1))};
    }
    else if((harmonic||advancedBipolar)&&zone.id==="isthmus"){
      cutStart={x:540, y:372};
      cutEnd={x:540, y:286};
      cutProgress=Math.max(0, Math.min(1, (linear-0.3)/0.7));
      const cut=Math.min(cutSteps-1, Math.floor(Math.min(cutProgress, 0.999)*cutSteps));
      contact={x:540, y:lerp(cutStart.y, cutEnd.y, cut/(cutSteps-1))};
    }
    else if(vesselCut)cutProgress=Math.max(0, Math.min(1, (linear-0.26)/0.74));
    const activation=advancedBipolar&&(cutStart||vesselCut)?Math.sin(cutProgress*Math.PI):energyActivation;
    drawOverheadCutTip(action.tool, contact, approach);
    if(cutStart)drawSteppedCutSites(cutStart, cutEnd, cutProgress, "rgba(116, 51, 52, 0.9)", cutSteps);
    if(activation>0&&!harmonic){
      drawAblationBed(contact, activation, color);
      drawSparks(contact, activation*0.65, "#f2e7ff");
    }
    if(harmonic&&cutStart&&cutProgress>0.04){
      drawSmoke(contact, 0.9-cutProgress*0.32, "166, 160, 153", cutProgress*1.25);
    }
    else if(harmonic&&linear>0.22){
      drawSmoke(contact, Math.max(0, 0.78-(linear-0.22)*0.26), "166, 160, 153", (linear-0.22)*1.5);
    }
    else if(!harmonic&&activation>0)drawSmoke(contact, activation*0.35, "205, 199, 219", p);
    return;
  }
  if(action.tool==="clip"){
    drawToolAtTarget("clip", target, approach, 0.84);
    if(p>0.56){
      ctx.save();
      ctx.strokeStyle="#d4d9dc";
      ctx.lineWidth=6;
      ctx.beginPath();
      ctx.arc(target.x-10, target.y, 10, -1.2, 1.2);
      ctx.arc(target.x+12, target.y, 10, -1.2, 1.2);
      ctx.stroke();
      ctx.restore();
    }
    return;
  }
  if(action.tool==="monopolar"){
    const isIncision=zone.id==="incision";
    const start=isIncision?{x:340, y:552}:zone.id==="flapPlane"?{x:374, y:510}:{x:target.x-54, y:target.y};
    const end=isIncision?{x:740, y:552}:zone.id==="flapPlane"?{x:704, y:510}:{x:target.x+54, y:target.y};
    const cutProgress=Math.max(0, Math.min(1, (linear-0.32)/0.68));
    const contact={x:lerp(start.x, end.x, cutProgress), y:lerp(start.y, end.y, cutProgress)};
    const activation=cutProgress>0&&cutProgress<0.9?Math.sin((cutProgress/0.9)*Math.PI):0;
    drawToolAtTarget("monopolar", contact, approach, 0.88, 1, activation*0.03);
    drawCutLine(start, end, cutProgress, "rgba(146, 50, 43, 0.86)", isIncision?6:4);
    drawElectricalGlow(contact, activation);
    drawSparks(contact, activation, "#ffd988");
    if(cutProgress>0)drawSmoke(contact, Math.max(0, activation*0.6+(0.94-cutProgress)*0.16), "190, 190, 181", cutProgress*1.4);
    return;
  }
  if(action.tool==="cautery"){
    drawToolAtTarget("cautery", target, approach, 0.88, 1, energyActivation*0.035);
    if(energyActivation>0){
      drawAblationBed(target, energyActivation, "rgba(182, 47, 55, 0.92)");
      drawSparks(target, energyActivation, "#fff1ad");
      drawSmoke(target, energyActivation*0.76, "190, 186, 176");
    }
    return;
  }
  if(action.tool==="forceps"){
    drawToolAtTarget("forceps", target, approach, 0.82);
    return;
  }
  if(action.tool==="suture"){
    drawToolAtTarget("suture", target, approach, 0.82);
    ctx.save();
    ctx.strokeStyle="#0e5965";
    ctx.lineWidth=2.5;
    for(let i=0;i<3;i+=1){
      const stitch=Math.max(0, Math.min(1, (p-i*0.22)/0.34));
      const sx=target.x-58+i*48;
      ctx.beginPath();
      ctx.moveTo(sx, target.y-16);
      ctx.quadraticCurveTo(sx+18, target.y+28*stitch, sx+34, target.y-16);
      ctx.stroke();
    }
    ctx.restore();
  }
}
function drawStepFlash(motion){
  if(motion.stepFlash<=0)return;
  const show=ease(Math.min(1, motion.stepFlash));
  const y=120-(1-show)*12;
  ctx.save();
  ctx.globalAlpha=show;
  ctx.fillStyle="rgba(239, 250, 243, 0.96)";
  ctx.strokeStyle="rgba(40, 122, 75, 0.55)";
  ctx.lineWidth=2;
  roundRect(414, y, 252, 46, 8);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle="#287a4b";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.arc(444, y+23, 12, 0, Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(438, y+23);
  ctx.lineTo(443, y+28);
  ctx.lineTo(452, y+18);
  ctx.stroke();
  ctx.fillStyle="#1f5e3c";
  ctx.font="800 15px Inter, sans-serif";
  ctx.textAlign="left";
  ctx.fillText(ui("stepComplete"), 466, y+29);
  ctx.restore();
}
function drawToolCursor(){
  if(!state.pointer||state.action)return;
  const pose=spritePoses[state.tool]||spritePoses.dissector;
  const size=313*pose.cursorScale;
  const nativeTip={x:(pose.tip.x-0.5)*size, y:(pose.tip.y-0.5)*size};
  const tipOffset={
    x:nativeTip.x*Math.cos(pose.rotation)-nativeTip.y*Math.sin(pose.rotation),
    y:nativeTip.x*Math.sin(pose.rotation)+nativeTip.y*Math.cos(pose.rotation)
  };
  drawInstrumentSprite(state.tool, state.pointer.x-tipOffset.x, state.pointer.y-tipOffset.y, pose.cursorScale, pose.rotation);
}
function roundRect(x, y, w, h, r){
  const radius=Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+radius, y);
  ctx.arcTo(x+w, y, x+w, y+h, radius);
  ctx.arcTo(x+w, y+h, x, y+h, radius);
  ctx.arcTo(x, y+h, x, y, radius);
  ctx.arcTo(x, y, x+w, y, radius);
  ctx.closePath();
}
canvas.addEventListener("click", (event)=>{
  const point=canvasPoint(event);
  onAction(hitZone(point), point);
});
canvas.addEventListener("keydown", (event)=>{
  if(event.key!=="Enter"&&event.key!==" ")return;
  event.preventDefault();
  const target=stages[state.stage].target;
  const ids=targetZoneIds();
  const completed=target==="centralNodes"?state.nodalMobilized:target==="nodeClearance"?state.nodalCleared:["middleVein", "superiorPole", "inferiorPole"].includes(target)?state.vesselsClipped:["parathyroids", "rln"].includes(target)?state.completed:null;
  const zone=zones.find((item)=>ids.includes(item.id)&&!completed?.has(item.id))||zones.find((item)=>ids.includes(item.id));
  if(!zone)return;
  const point=zone.path?{
    x: zone.path.at(-1)[0], y: zone.path.at(-1)[1]
  }: {
    x: zone.x+(zone.w||0)/2, y: zone.y+(zone.h||0)/2
  };
  onAction(zone, point);
});
canvas.addEventListener("mousemove", (event)=>{
  const point=canvasPoint(event);
  state.pointer={
    x: point.x, y: point.y
  };
  if(prefersReducedMotion)draw();
  if(state.tool!=="inspect"){
    tooltip.hidden=true;
    return;
  }
  const zone=hitZone(point);
  if(!zone){
    tooltip.hidden=true;
    return;
  }
  tooltip.hidden=false;
  tooltip.style.left=`${Math.min(point.sx + 14, canvas.clientWidth - 250)}px`;
  tooltip.style.top=`${Math.max(8, point.sy - 8)}px`;
  tooltip.textContent=`${zone.label}: ${zone.note}`;
});
canvas.addEventListener("mouseleave", ()=>{
  state.pointer=null;
  tooltip.hidden=true;
  if(prefersReducedMotion)draw();
});
resetButton.addEventListener("click", resetSimulation);
restartButton.addEventListener("click", resetSimulation);
if(langToggle)langToggle.addEventListener("click", switchLanguage);
preloadInstrumentImages();
localizeStatic();
renderTools();
renderInstrumentPanel();
renderStatus();
renderCompletionScreen();
addLog(tr(296), "info", {
  kind: "tr", index: 296
});
function animationLoop(now){
  const dt=Math.max(0, Math.min(0.05, (now-state.lastFrame)/1000||0));
  state.lastFrame=now;
  if(!state.action)state.heat=Math.max(0, state.heat-dt*0.55);
  if(state.action&&now-state.action.startedAt>=state.action.duration)finishAction();
  draw();
  if(!prefersReducedMotion)requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);
