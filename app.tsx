import React, { useState, useMemo } from "react";

type ExamType = "mid1" | "mid2" | "final";

type Question = {
  id: string;
  exam: ExamType;
  lecture: string;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

const MID1_QUESTIONS: Question[] = [
  {id:"mid11",exam:"mid1",lecture:"Introduction to Pharmacology",q:"What does pharmacokinetics (PK) refer to?",options:["What the drug does to the body","Mechanism of drug action","What the body does to the drug (Absorption, Distribution, Metabolism, Excretion)","Drug toxicity"],answer:2,explanation:"Pharmacokinetics = \"what the body does to the drug.\" It describes how the body absorbs, distributes, metabolizes, and excretes a drug (ADME). Pharmacodynamics is what the drug does to the body (mechanism of action, effects)."},
  {id:"mid12",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Pharmacodynamics deals with:",options:["Absorption","Elimination","Metabolism","Mechanism of action"],answer:3,explanation:"Pharmacodynamics (PD) = \"what the drug does to the body\" — it deals with drug mechanisms of action, receptor binding, and the resulting pharmacological effects."},
  {id:"mid13",exam:"mid1",lecture:"Introduction to Pharmacology",q:"A drug marketed under its non-proprietary name is referred to as its:",options:["Chemical name","Generic name","Brand name","Trade name"],answer:1,explanation:"Every drug has three names. The chemical name describes the molecule's structure. The generic (non-proprietary/INN) name is the official approved name used universally. The brand (proprietary/trade) name is the manufacturer's commercial name. Generic drugs must have the same active ingredient and bioequivalence as the brand."},
  {id:"mid14",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Generic drugs must have:",options:["Same active ingredient and bioequivalence","Same brand name","Same price","Same packaging"],answer:0,explanation:"By regulatory definition, a generic drug must contain the same active pharmaceutical ingredient and demonstrate bioequivalence (same rate and extent of absorption) as the branded reference product. Price and packaging may differ."},
  {id:"mid15",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Phase I clinical trials primarily assess:",options:["Marketing","Efficacy","Comparison with placebo","Safety"],answer:3,explanation:"Clinical trials progress through four phases: - Phase I: First in human — small group of healthy volunteers — assesses safety, tolerability, dosing, pharmacokinetics. - Phase II: Efficacy in small patient group. - Phase III: Large RCT comparing to standard treatment. - Phase IV: Post-marketing surveillance."},
  {id:"mid16",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Which drug category is absolutely contraindicated in ALL stages of pregnancy?",options:["Category A","Category B","Category C","Category X"],answer:3,explanation:"FDA pregnancy categories: - A: Adequate studies show no risk. - B: Animal studies show no risk; no adequate human studies. - C: Animal studies show adverse effects; no adequate human studies. - D: Evidence of human fetal risk, but benefits may outweigh risks. - X: Evidence of fetal abnormalities; risks clearly outweigh any benefit — absolutely contraindicated in all stages of pregnancy."},
  {id:"mid17",exam:"mid1",lecture:"Introduction to Pharmacology",q:"OTC (over-the-counter) drugs are:",options:["Can be obtained without a prescription","Only available by prescription","Experimental drugs","Controlled substances"],answer:0,explanation:"OTC drugs are safe and effective for use without medical supervision and can be purchased directly by the patient without a prescription. They differ from prescription-only medications which require a doctor's authorization."},
  {id:"mid18",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Which of the following is an example of a genetic factor that affects drug response?",options:["Acetylation status","Drug physical properties","Renal failure","Lipid solubility of drug"],answer:0,explanation:"Pharmacogenetics studies how genetic variation affects drug response. Acetylation status (fast vs. slow acetylators) is a classic genetic polymorphism affecting metabolism of drugs like isoniazid. Renal failure is a pathological (not genetic) factor; drug physical properties and lipid solubility are drug-related factors."},
  {id:"mid19",exam:"mid1",lecture:"Introduction to Pharmacology",q:"Which of the following is the unwanted reaction NOT related to absorption or pharmacodynamics of drugs?",options:["Pharmaceutical interaction","Pharmacodynamic interaction","Pharmacokinetic interaction","None of the above"],answer:0,explanation:"Pharmaceutical (incompatibility) interactions occur outside the body — e.g., two drugs forming a precipitate when mixed in the same IV bag. These are not related to absorption or pharmacodynamic mechanisms."},
  {id:"mid110",exam:"mid1",lecture:"Drug Dosage Forms",q:"A solid dosage form that produces a high local drug concentration in the oral cavity is:",options:["Lozenge","Tablet","Capsule","Powder"],answer:0,explanation:"A lozenge (also called troche) is a flat, round, or rectangular solid dosage form that is held in the mouth and slowly dissolved. It is designed to produce a high local drug concentration in the oral cavity and throat (e.g., antiseptics, throat lozenges)."},
  {id:"mid111",exam:"mid1",lecture:"Drug Dosage Forms",q:"Which of the following best describes a lozenge?",options:["Capsule containing powder","Flat/round/rectangular tablet held in the mouth until dissolved","Effervescent tablet dissolved in water","Sustained-release tablet"],answer:1,explanation:"Lozenges are solid dosage forms that are held in the mouth (not swallowed) and dissolve slowly to produce a local effect in the oral cavity/pharynx. They are flat, round, or rectangular in shape."},
  {id:"mid112",exam:"mid1",lecture:"Drug Dosage Forms",q:"Ointments are classified as which type of dosage form?",options:["Solid","Liquid","Semi-solid","Gaseous"],answer:2,explanation:"Semi-solid dosage forms include ointments (W/O emulsions — greasy, more occlusive), creams (O/W emulsions — less greasy), gels, pastes, and suppositories. They are applied to skin or mucous membranes."},
  {id:"mid113",exam:"mid1",lecture:"Drug Dosage Forms",q:"Enteric-coated capsules dissolve in the:",options:["Stomach","Mouth","Intestine","Blood"],answer:2,explanation:"Enteric-coated formulations have a special coating that resists the acidic environment of the stomach and only dissolves in the alkaline environment of the small intestine. This protects acid-labile drugs (e.g., omeprazole) or drugs that irritate the gastric mucosa."},
  {id:"mid114",exam:"mid1",lecture:"Drug Dosage Forms",q:"Transdermal patches are mainly used for:",options:["Immediate effect","Diagnostic purpose","Sustained systemic effect","Local GI effect"],answer:2,explanation:"Transdermal patches deliver drugs through the skin into the systemic circulation in a slow, sustained manner, avoiding first-pass metabolism. Examples include nitroglycerin (angina), scopolamine (motion sickness), and nicotine (smoking cessation)."},
  {id:"mid115",exam:"mid1",lecture:"Drug Dosage Forms",q:"To prolong the duration of action of a drug, which modification is used?",options:["Increase vascularity of absorbing area","Reduction of solubility of the drug","Administration in aqueous solution","None"],answer:1,explanation:"Reducing the solubility of a drug (e.g., using a depot/suspension formulation for IM injection, or sustained-release tablet) slows dissolution and absorption, thereby prolonging the duration of action. Increasing vascularity would actually speed up absorption."},
  {id:"mid116",exam:"mid1",lecture:"Routes of Drug Administration",q:"A patient with extensive first-pass metabolism would benefit most from which route?",options:["Oral","Sublingual","Rectal","Intramuscular"],answer:1,explanation:"The sublingual route places the drug under the tongue where it is absorbed directly into the systemic circulation via sublingual veins, bypassing the portal circulation and hepatic first-pass metabolism. Nitroglycerin is the classic example — it has >90% first-pass extraction if swallowed, but is effective sublingually."},
  {id:"mid117",exam:"mid1",lecture:"Routes of Drug Administration",q:"The main advantage of the sublingual route is:",options:["Slow absorption","Local effect only","Prolonged duration","Bypasses first-pass metabolism"],answer:3,explanation:"Sublingual absorption occurs via the rich submucosal venous network that drains directly into the superior vena cava, circumventing hepatic first-pass metabolism. Additional advantages: rapid onset, drug action can be terminated by spitting out the tablet."},
  {id:"mid118",exam:"mid1",lecture:"Routes of Drug Administration",q:"A patient with severe post-operative pain requires morphine. Which route provides 100% bioavailability and the most rapid onset?",options:["Oral","Sublingual","Intravenous (IV)","Intramuscular"],answer:2,explanation:"IV administration gives 100% bioavailability (drug is directly placed into systemic circulation). It produces the most rapid onset of action, allows precise dose titration, and is preferred for emergencies, severe pain, unconscious patients, and drugs with extensive first-pass metabolism (e.g., morphine has significant first-pass if given orally)."},
  {id:"mid119",exam:"mid1",lecture:"Routes of Drug Administration",q:"Which route of administration is most suitable in emergencies?",options:["Intravenous","Oral","Rectal","Topical"],answer:0,explanation:"IV is the route of choice in emergencies because it: - Has 100% bioavailability - Provides immediate action - Allows rapid dose titration - Can be used in unconscious patients"},
  {id:"mid120",exam:"mid1",lecture:"Routes of Drug Administration",q:"Which route to administer oxytocin if it needs to be titrated according to patient's need?",options:["IM","IV infusion","IV bolus","Subcutaneous"],answer:1,explanation:"For drugs requiring titration (dose adjusted in real-time according to patient response), IV infusion is ideal because the rate can be increased or decreased instantly, and the drug effect is immediate. Oxytocin for labor induction is a classic example where the infusion rate is adjusted based on uterine contractions."},
  {id:"mid121",exam:"mid1",lecture:"Routes of Drug Administration",q:"Intramuscular (IM) injections are contraindicated in patients receiving:",options:["Anticoagulants","Steroids","Insulin","Antibiotics"],answer:0,explanation:"IM injections are contraindicated in anticoagulated patients because the needle insertion into a highly vascular muscle can cause bleeding into the muscle tissue (hematoma). Anticoagulants (warfarin, heparin) impair clotting, making this a significant risk."},
  {id:"mid122",exam:"mid1",lecture:"Routes of Drug Administration",q:"Which of the following properties allows a drug to cross the blood-brain barrier (BBB)?",options:["Lipid-soluble (lipophilic) and unionized","Hydrophilic and ionized","High molecular weight","High plasma protein binding"],answer:0,explanation:"The BBB is formed by tight junctions between cerebral capillary endothelial cells with no fenestrations. Only drugs that are: - Lipid-soluble (lipophilic) - Unionized (non-polar) - Small molecular weight - Not highly protein-bound ...can cross it by passive diffusion. Hydrophilic and ionized drugs are excluded."},
  {id:"mid123",exam:"mid1",lecture:"Routes of Drug Administration",q:"Some antibiotics are well absorbed but are NOT effective for brain infections because they have:",options:["High lipid solubility","Low bioavailability","High plasma protein binding","Rapid absorption"],answer:2,explanation:"Drugs that are highly protein-bound cannot cross the BBB because only the free (unbound) fraction can cross biological membranes. A highly protein-bound antibiotic may have good systemic absorption but inadequate CNS penetration because the bound drug is too large to cross and the free fraction is very small."},
  {id:"mid124",exam:"mid1",lecture:"Routes of Drug Administration",q:"A drug that is lipophilic with high molecular weight is:",options:["Hydrophilic and high molecular weight","Hydrophilic and low molecular weight","Lipophilic and high molecular weight","Lipophilic and low molecular weight"],answer:0,explanation:"The placenta behaves like a lipid membrane. Drugs that easily cross the placenta are lipophilic, un-ionized, low molecular weight, and not highly protein bound. Therefore, hydrophilic + high molecular weight is the combination LEAST likely to cross and harm the fetus."},
  {id:"mid125",exam:"mid1",lecture:"Routes of Drug Administration",q:"An addict with tachycardia and tremor took one tablet of amphetamine. Amphetamine readily enters CNS and 50% is excreted unchanged. What explains the presentation?",options:["Reduced metabolism","Enhanced bioavailability","Enhanced penetration to CNS (lipophilicity)","Reduced elimination by kidney"],answer:2,explanation:"Amphetamine is highly lipophilic, allowing it to readily cross the BBB and enter the CNS. The CNS stimulation (dopamine/norepinephrine release) causes tachycardia, tremor, and agitation. The explanation is its lipophilic nature enabling enhanced CNS penetration."},
  {id:"mid126",exam:"mid1",lecture:"Pharmacodynamics",q:"Two drugs acting on the same receptor — Drug A has lower EC50 than Drug B, same Emax. Which is more potent?",options:["Drug B","Drug B","Drug A is more potent","Equal potency"],answer:2,explanation:"Potency is measured by the EC50 (the concentration producing 50% of the maximum effect). A lower EC50 = higher potency (you need less drug to produce the same effect). Both drugs have the same Emax (same efficacy). Drug A with lower EC50 is more potent."},
  {id:"mid127",exam:"mid1",lecture:"Pharmacodynamics",q:"ED50 — the dose producing 50% of the maximum effect — is a measure of:",options:["Mechanism of action","Therapeutic index","Potency","Efficacy"],answer:2,explanation:"ED50 (effective dose 50%) is the standard measure of potency. Lower ED50 = higher potency. Efficacy is measured by the Emax (maximum possible effect). The therapeutic index = TD50/ED50."},
  {id:"mid128",exam:"mid1",lecture:"Pharmacodynamics",q:"Drug A given at 5 mg decreases blood pressure the same as Drug B at 500 mg. What does this indicate?",options:["Drug A is more potent than Drug B by 100 times","Drug A is more efficacious","Drug A is less toxic"],answer:0,explanation:"Both drugs produce the same effect (same blood pressure reduction) but Drug A needs only 5 mg while Drug B needs 500 mg. Ratio = 500/5 = 100. Drug A is 100 times more potent. This says nothing about efficacy (Emax) or toxicity."},
  {id:"mid129",exam:"mid1",lecture:"Pharmacodynamics",q:"2 mg of Drug A gives the same therapeutic effect as 200 mg of Drug B. Regarding potency:",options:["Information is not enough","Drug A is more potent than Drug B","Drug B is more potent than Drug A","Same potency"],answer:1,explanation:"Drug A requires 2 mg vs Drug B's 200 mg for the same effect → Drug A is 100× more potent. The therapeutic index is not relevant here — the question specifically asks about potency based on dose required for effect."},
  {id:"mid130",exam:"mid1",lecture:"Pharmacodynamics",q:"If an agonist can produce maximal effects and has high efficacy, it is called:",options:["Antagonist","Full agonist","Competitive antagonist","Partial agonist"],answer:1,explanation:"Drug classification by receptor interaction: - Full agonist: High affinity + high intrinsic activity/efficacy → produces MAXIMUM response (Emax) - Partial agonist: Affinity + INCOMPLETE intrinsic activity → cannot produce full Emax even at maximum doses - Antagonist: Affinity + NO intrinsic activity (efficacy = 0) → blocks without activating"},
  {id:"mid131",exam:"mid1",lecture:"Pharmacodynamics",q:"A partial agonist, when given alone, acts as an agonist. When given with a full agonist, what happens?",options:["Increases the effect of the full agonist","No change","Reduces the effect (acts as partial antagonist)","Doubles the effect"],answer:2,explanation:"Partial agonists have intermediate intrinsic activity. When given alone, they produce a submaximal response (agonist effect). When given together with a full agonist, they compete for the same receptor, displacing the full agonist and reducing the net response — this is why they act as functional antagonists in the presence of a full agonist."},
  {id:"mid132",exam:"mid1",lecture:"Pharmacodynamics",q:"A drug 'R' produces no response by itself but shifts the log dose-response curve of drug 'S' to the RIGHT in a PARALLEL manner WITHOUT decreasing maximal response. Drug 'R' is a:",options:["Inverse agonist","Noncompetitive antagonist","Partial agonist","Competitive antagonist"],answer:3,explanation:"The hallmark of a competitive (pharmacological) antagonist: - Binds the same receptor as the agonist - Produces no response alone (no intrinsic activity) - Causes a parallel rightward shift of the DRC - Does NOT decrease the Emax (surmountable — can be overcome by increasing agonist dose) A non-competitive antagonist also shifts right but decreases the Emax."},
  {id:"mid133",exam:"mid1",lecture:"Pharmacodynamics",q:"Competitive antagonist effect on dose-response curve:",options:["Parallel rightward shift, same Emax","Leftward shift","Decreased Emax only","No change in curve"],answer:0,explanation:"Competitive antagonists occupy the receptor reversibly, competing with the agonist. Increasing the agonist concentration can overcome the antagonism → same maximum effect (Emax) is achievable, but more agonist is needed (rightward shift = decreased apparent potency of agonist)."},
  {id:"mid134",exam:"mid1",lecture:"Pharmacodynamics",q:"If an agonist is given in increasing doses without producing any effect, which type of antagonism is most likely?",options:["Non-competitive antagonist","Competitive antagonist","Reversible antagonist","Irreversible antagonist"],answer:0,explanation:"A non-competitive antagonist binds to a different (allosteric) site or binds irreversibly, causing a decrease in Emax — meaning no matter how much agonist is given, the maximum effect cannot be achieved. The DRC flattens rather than shifts right."},
  {id:"mid135",exam:"mid1",lecture:"Pharmacodynamics",q:"Drugs act on the same organ but different receptors and cause effects OPPOSITE to each other. This is:",options:["Physiological (functional) antagonism","Chemical antagonism","Competitive antagonism","Pharmacological antagonism"],answer:0,explanation:"Physiological/functional antagonism = two drugs act on different receptors on the same tissue/organ but produce opposing effects. Example: histamine (bronchoconstriction via H1) vs. epinephrine (bronchodilation via β2) — they produce opposite effects on airways. This is different from pharmacological antagonism where both drugs bind the SAME receptor."},
  {id:"mid136",exam:"mid1",lecture:"Pharmacodynamics",q:"Which of the following best describes the concept of half-life (t½)?",options:["Time for complete elimination","Duration required for drug concentration to decrease by half","Time to peak effectiveness","Time for absorption"],answer:1,explanation:"The half-life (t½) is the time required for the plasma concentration (or total body amount) of a drug to decrease by 50% (one half). After 4-5 half-lives, ~97% of the drug is eliminated (considered complete elimination). t½ = 0.693 × Vd / Clearance."},
  {id:"mid137",exam:"mid1",lecture:"Pharmacodynamics",q:"The half-life of a drug is 3 hours. How long until it is completely eliminated?",options:["9 hr","12 hr (4-5 half-lives)","21 hr","4 hr"],answer:1,explanation:"A drug is considered completely eliminated after 4–5 half-lives (97–100%). For t½ = 3h: 4 × 3 = 12 hours to 5 × 3 = 15 hours. The answer closest to 4 half-lives = 12 hours."},
  {id:"mid138",exam:"mid1",lecture:"Pharmacodynamics",q:"Which of the following describes TACHYPHYLAXIS?",options:["Rapidly developing tolerance (acute tolerance occurring within minutes)","A synergism between two drugs","A drug with fast response","Drug interaction between similar drugs"],answer:0,explanation:"Tachyphylaxis = rapid, acute tolerance that develops within minutes to hours after administration. It is different from regular tolerance (which develops over days/weeks). Example: ephedrine loses effectiveness after repeated doses in quick succession."},
  {id:"mid139",exam:"mid1",lecture:"Pharmacodynamics",q:"Therapeutic index (TI) formula:",options:["ED50/TD50","TD50/ED50","LD50/ED50","EC50/TD50"],answer:1,explanation:"Therapeutic Index = TD50 / ED50 (or LD50/ED50 in animal studies). - TD50 = dose that is toxic in 50% of the population - ED50 = dose that is effective in 50% of the population - Larger TI = safer drug (e.g., penicillin has large TI) - Small TI = narrow safety margin (e.g., warfarin, digoxin, phenytoin — requires monitoring)"},
  {id:"mid140",exam:"mid1",lecture:"Pharmacodynamics",q:"Which parameter is used to indicate drug safety?",options:["Bioavailability","Intrinsic activity","Therapeutic index","Potency"],answer:2,explanation:"The therapeutic index measures the margin of safety between the therapeutic dose and the toxic dose. A wide TI means a drug can be dosed without much risk of toxicity; a narrow TI means doses must be carefully monitored."},
  {id:"mid141",exam:"mid1",lecture:"Pharmacodynamics",q:"A 14-year-old girl with allergic rhinitis is treated with loratadine (H₁ blocker). Which term best describes loratadine's BINDING to the H₁ receptor?",options:["Affinity","Potency","Maximal efficacy","Intrinsic activity"],answer:0,explanation:"Affinity = the tendency/ability of a drug to bind to a receptor (measured by Kd — dissociation constant; lower Kd = higher affinity). The question specifically asks about the characteristic of binding — this is affinity. Efficacy and intrinsic activity relate to what happens AFTER binding."},
  {id:"mid142",exam:"mid1",lecture:"Pharmacodynamics",q:"Which statement explains receptor affinity?",options:["Maximum response","Concentration of ligand that causes side effect","The measure of how tightly a ligand binds to a receptor","Fraction of dose reaching circulation"],answer:2,explanation:"Affinity is the strength of the drug-receptor interaction — how tightly the ligand binds. High affinity = drug binds even at low concentrations. It is quantified by the equilibrium dissociation constant (Kd); lower Kd = higher affinity."},
  {id:"mid143",exam:"mid1",lecture:"Pharmacodynamics",q:"A 9-year-old boy with asthma uses a β2-adrenoreceptor agonist by inhalation. What type of receptor is β2?",options:["G protein-coupled receptor (GPCR)","Intracellular receptor","Enzyme-linked receptor","Ligand-gated K⁺ channels"],answer:0,explanation:"β2-adrenergic receptors belong to the G-protein coupled receptor (GPCR) family (also called 7-transmembrane receptors). They couple to Gs protein → activate adenylyl cyclase → ↑ cAMP → bronchodilation. Response time: seconds to minutes."},
  {id:"mid144",exam:"mid1",lecture:"Pharmacodynamics",q:"Which type of receptor is correctly associated with INSULIN?",options:["G protein-coupled receptor","Intracellular receptor","Enzyme-linked receptor (Receptor Tyrosine Kinase)","Ligand-gated receptor"],answer:2,explanation:"The insulin receptor is a receptor tyrosine kinase (enzyme-linked receptor). When insulin binds, the receptor undergoes autophosphorylation and activates a kinase cascade. Response time: hours. This is distinct from GPCRs (muscarinic, β-adrenergic), ligand-gated channels (nicotinic), and nuclear receptors (steroids)."},
  {id:"mid145",exam:"mid1",lecture:"Pharmacodynamics",q:"Which one of the following is NOT a receptor?",options:["G-protein coupled receptor","Intercellular receptor","Enzyme-linked receptor","Plasma protein like albumin"],answer:3,explanation:"Drug targets include receptors (GPCRs, ligand-gated channels, kinase-linked, nuclear), enzymes, ion channels, and carrier proteins. Plasma proteins like albumin are NOT receptors — they are transport/binding proteins that carry drugs in the blood. Binding to albumin inactivates the drug temporarily but produces no pharmacological effect."},
  {id:"mid146",exam:"mid1",lecture:"Pharmacodynamics",q:"An example of a G-protein coupled receptor:",options:["Nicotinic receptors (ligand-gated ion channel)","B2 adrenergic receptor","Insulin (enzyme-linked)","Steroid receptor (nuclear)"],answer:1,explanation:"The four receptor types: 1. Ligand-gated ion channels (ionotropic): Nicotinic ACh receptor — milliseconds response 2. G-protein coupled receptors (metabotropic): Muscarinic ACh, β2-adrenergic, H1 histamine — seconds response 3. Kinase-linked receptors: Insulin, growth factor receptors — hours response 4. Nuclear receptors: Steroid hormones, thyroid hormone — hours response"},
  {id:"mid147",exam:"mid1",lecture:"Pharmacodynamics",q:"A study of three drugs: Drug A decreases receptor activity, Drug B increases receptor activity, Drug C antagonizes both A and B. What is Drug A?",options:["Inverse agonist","Partial agonist","Competitive antagonist","Irreversible antagonist"],answer:0,explanation:"An inverse agonist has affinity for the receptor but produces the opposite effect to an agonist — it DECREASES baseline receptor activity below the constitutive level. Since Drug A decreases activity (opposite to Drug B which increases it) and Drug C blocks both, Drug A is an inverse agonist."},
  {id:"mid148",exam:"mid1",lecture:"Pharmacodynamics",q:"DRC graph showing four drugs — Drug D shows lower potency than Drugs A and C. Which statement is true?",options:["Drug A is less potent than C","Drug A has lower efficacy than B","Drug D shows lower potency than Drugs A and C","Drug D is best administered orally"],answer:2,explanation:"From a dose-response curve, potency is determined by the position of the curve along the x-axis (log concentration/dose). A curve that is further to the right indicates lower potency (more drug needed for same effect). Drug D being furthest right means lowest potency among A, C, and D."},
  {id:"mid149",exam:"mid1",lecture:"Pharmacodynamics",q:"What letter on the DRC graph represents PARTIAL AGONIST activity when given alone?",options:["A","B","C","D"],answer:1,explanation:"A partial agonist produces a submaximal response even at maximum concentrations — it cannot achieve the full Emax of a full agonist. On a DRC, it appears as a curve that plateaus at a lower maximum than the full agonist. Curve B reaching an intermediate plateau represents partial agonist behavior."},
  {id:"mid150",exam:"mid1",lecture:"Pharmacodynamics",q:"When two drugs bind to the same PLASMA PROTEIN binding site, what happens?",options:["Plasma concentration of displaced drug INCREASES → toxicity","Plasma concentration decreases → treatment failure","Plasma concentration increases → treatment failure","Plasma concentration decreases → toxic"],answer:0,explanation:"When two drugs compete for the same plasma protein binding site (e.g., albumin), the drug with higher affinity displaces the other. The displaced drug's free (unbound) plasma concentration suddenly increases → more drug available to act → risk of toxicity. Classic example: aspirin displaces warfarin from albumin → ↑ free warfarin → bleeding risk."},
  {id:"mid151",exam:"mid1",lecture:"Pharmacokinetics",q:"Bioavailability of a drug refers to:",options:["Ratio of oral to parenteral dose","Ratio of orally administered drug to that excreted in feces","Percentage of administered dose that reaches systemic circulation in unchanged form","Ratio of drug excreted unchanged to metabolites"],answer:2,explanation:"Bioavailability (F) = the fraction/percentage of an administered dose that reaches the systemic circulation in an unchanged (active) form. IV = 100% bioavailability. Oral bioavailability is <100% due to: incomplete absorption + first-pass metabolism."},
  {id:"mid152",exam:"mid1",lecture:"Pharmacokinetics",q:"What is the definition of bioavailability?",options:["Fraction of unchanged drug reaching systemic circulation","Proportion of drug reaching circulation in inactive form"],answer:0,explanation:"Bioavailability is specifically the fraction of unchanged (active) drug that reaches the systemic circulation. It accounts for both absorption and pre-systemic (first-pass) metabolism."},
  {id:"mid153",exam:"mid1",lecture:"Pharmacokinetics",q:"What is the expected effect of FIRST-PASS METABOLISM on bioavailability of an orally taken drug?",options:["Low bioavailability","High bioavailability","No effect","Variable"],answer:0,explanation:"After oral administration, drugs absorbed from the GI tract pass through the portal vein to the liver before reaching systemic circulation. The liver (and intestinal wall) metabolize a portion of the drug before it reaches its target — this is first-pass (presystemic) metabolism. The result is reduced bioavailability. Examples: morphine (first-pass >70%), nitroglycerin (>90%), propranolol."},
  {id:"mid154",exam:"mid1",lecture:"Pharmacokinetics",q:"A male patient with chronic liver AND renal disease is prescribed propranolol. What is the most appropriate dosing consideration?",options:["Extensive first-pass metabolism (dose must account for reduced metabolism)","Excreted by kidney — dose adjusted for kidney disease","Short half-life requiring once-daily dosing","Secreted in bile"],answer:0,explanation:"Propranolol is a drug with extensive first-pass metabolism in the liver. In a patient with chronic liver disease, first-pass metabolism is impaired → more drug reaches systemic circulation → risk of toxicity with usual oral doses. Additionally, reduced hepatic clearance prolongs its half-life. Dose reduction is required."},
  {id:"mid155",exam:"mid1",lecture:"Pharmacokinetics",q:"Majority of drugs cross biological membranes primarily by:",options:["Pinocytosis","Passive diffusion","Facilitated diffusion","Active transport"],answer:1,explanation:"Passive diffusion is the primary mechanism for most drugs to cross biological membranes. It follows a concentration gradient (high → low), requires no energy, and favors lipophilic, unionized, small molecular weight drugs. Active transport, facilitated diffusion, and pinocytosis account for a minority of drugs."},
  {id:"mid156",exam:"mid1",lecture:"Pharmacokinetics",q:"Diffusion of drugs across cell membranes is AFFECTED by:",options:["Exhibits saturation kinetics","Competitively inhibited by chemically related drugs","Dependent on metabolic activity","Affected by extent of ionization of drug molecules"],answer:3,explanation:"Passive diffusion of drugs across membranes depends on: - Lipid solubility (higher = more diffusion) - Degree of ionization (unionized form diffuses freely; ionized form cannot) - Molecular weight, concentration gradient Options A, B, C describe active transport (saturation, inhibition, energy-dependent)."},
  {id:"mid157",exam:"mid1",lecture:"Pharmacokinetics",q:"Which of the following defines DISTRIBUTION?",options:["The reversible movement of drug between blood and tissues","The irreversible elimination of drug","Drug metabolism in the liver","Excretion of unchanged drug"],answer:0,explanation:"Distribution is the reversible process by which a drug leaves the bloodstream and enters body tissues (and can return back to blood). It is quantified by the Volume of Distribution (Vd). Elimination is irreversible."},
  {id:"mid158",exam:"mid1",lecture:"Pharmacokinetics",q:"A drug with a LARGE volume of distribution (Vd) indicates:",options:["Drug stays in plasma","Excreted rapidly","Extensively distributed to tissues; low plasma concentration","Poorly absorbed"],answer:2,explanation:"Vd = Total Amount in Body / Plasma Concentration - Large Vd (e.g., >1 L/kg): Drug is extensively distributed to peripheral tissues → low plasma concentration relative to total body amount. The drug is \"hidden\" in tissues. - Small Vd: Drug stays mostly in plasma. Lipophilic drugs tend to have large Vd; drugs highly bound to plasma proteins tend to have small Vd."},
  {id:"mid159",exam:"mid1",lecture:"Pharmacokinetics",q:"Drugs that are HIGHLY BOUND to plasma proteins have:",options:["Large volume of distribution","High bioavailability","High renal clearance","Greater risk for drug interactions"],answer:3,explanation:"Highly plasma protein-bound drugs: - Have small Vd (not large — they stay in plasma) - Have low renal clearance (bound drug cannot be filtered) - Have low bioavailability is not directly related - Have greater risk for drug interactions because displacement from binding sites by another drug can suddenly increase the free (active) fraction → toxicity risk"},
  {id:"mid160",exam:"mid1",lecture:"Pharmacokinetics",q:"HIGH plasma protein binding makes a drug:",options:["Facilitate glomerular filtration","Minimize drug interaction","Long-acting (prolonged duration)","Increase Vd"],answer:2,explanation:"High protein binding: - Acts as a reservoir — bound drug is slowly released as free drug is eliminated → prolongs drug duration (longer-acting) - Bound drug is pharmacologically inactive - Bound drug cannot be filtered by the kidney → not easily excreted"},
  {id:"mid161",exam:"mid1",lecture:"Pharmacokinetics",q:"Drug A displaces Drug B from plasma proteins. What happens?",options:["Decreases effect of Drug B","Increases free fraction of Drug B → increases effect/risk of toxicity","No change","Increases protein binding of Drug B"],answer:1,explanation:"When Drug A displaces Drug B from plasma protein binding sites: - Drug B's free (unbound) fraction increases suddenly - Free drug = active drug - This can cause unexpected toxicity (e.g., aspirin displacing warfarin → ↑ free warfarin → ↑ bleeding risk)"},
  {id:"mid162",exam:"mid1",lecture:"Pharmacokinetics",q:"Which of the following is expected when warfarin (strongly protein-bound) is administered to a patient with SEVERE RENAL IMPAIRMENT?",options:["No significant change","Reduced efficacy of warfarin","Increased warfarin free level","Decreased warfarin free level"],answer:2,explanation:"In severe renal impairment: - Uremic toxins (retained waste products) accumulate in blood - These uremic compounds compete with warfarin for albumin binding sites - Warfarin is displaced from albumin → increased free (unbound) warfarin level → increased anticoagulant effect → bleeding risk"},
  {id:"mid163",exam:"mid1",lecture:"Pharmacokinetics",q:"Phase I metabolism involves:",options:["Oxidation, reduction, hydrolysis (non-synthetic reactions)","Conjugation only","Glucuronidation only","Synthesis reactions"],answer:0,explanation:"Drug metabolism occurs in two phases: - Phase I (non-synthetic): Oxidation, reduction, hydrolysis — primarily via CYP450 enzymes in the liver → makes drug more polar (water-soluble), often produces active or toxic metabolites - Phase II (synthetic): Conjugation reactions (glucuronidation, sulfation, acetylation) → produces highly polar, water-soluble, inactive metabolites ready for excretion"},
  {id:"mid164",exam:"mid1",lecture:"Pharmacokinetics",q:"What best describes BIOTRANSFORMATION?",options:["Converts lipid-soluble drug to a non-lipid-soluble (polar) metabolite — usually inactive","Converts drug to more lipid-soluble form"],answer:0,explanation:"The primary goal of biotransformation (drug metabolism) is to convert lipophilic drugs into more polar (hydrophilic) metabolites that can be renally excreted. Without this, lipophilic drugs would be reabsorbed by renal tubules endlessly and never eliminated."},
  {id:"mid165",exam:"mid1",lecture:"Pharmacokinetics",q:"Regarding drug metabolism, which statement is CORRECT?",options:["Metabolism does not occur in plasma or kidneys","Prodrugs don't become active until they are metabolized","Enzyme induction increases drug toxicity potential","Most drugs are metabolized into active metabolites"],answer:1,explanation:"Prodrugs are pharmacologically inactive compounds that must undergo metabolic conversion to become active. Examples: codeine → morphine; enalapril → enalaprilat. This is a deliberate pharmaceutical strategy to improve bioavailability or targeting."},
  {id:"mid166",exam:"mid1",lecture:"Pharmacokinetics",q:"Rifampin induces CYP450 enzymes. What is the clinical consequence for a patient taking ORAL CONTRACEPTIVES?",options:["Increased estrogen levels","Contraceptive failure","No effect","Toxicity"],answer:1,explanation:"Rifampin is a potent CYP450 inducer — it increases the production of metabolizing enzymes. This leads to: - Faster metabolism of oral contraceptives - Reduced plasma levels of estrogen/progestin - Contraceptive failure (unintended pregnancy) This is Type F ADR (Failure of efficacy). Other CYP inducers: carbamazepine, phenytoin, tobacco."},
  {id:"mid167",exam:"mid1",lecture:"Pharmacokinetics",q:"In liver failure, which change is observed?",options:["Reduced drug half-life","Reduced drug metabolism","Increased plasma protein binding","Increased microsomal enzyme activity"],answer:1,explanation:"In liver failure/cirrhosis: - Hepatic metabolism is reduced → drugs accumulate → prolonged half-life - Albumin synthesis decreases → reduced plasma protein binding → more free drug - Microsomal enzyme activity is reduced (not increased) - Hepatic blood flow may be reduced → reduced first-pass metabolism"},
  {id:"mid168",exam:"mid1",lecture:"Pharmacokinetics",q:"In liver failure, one of the following changes is observed: (Blackboard version)",options:["Microsomal enzyme activity is increased","Half-life of drug is reduced","Metabolism of drug is reduced","Increase in plasma protein binding"],answer:2,explanation:"Same as above — liver failure reduces the liver's ability to metabolize drugs → drug metabolism is reduced → drugs accumulate → toxicity risk. Half-life INCREASES (not decreases)."},
  {id:"mid169",exam:"mid1",lecture:"Pharmacokinetics",q:"Patient has hepatitis, cirrhosis, ascites — which drug must be carefully monitored?",options:["Erythromycin (hepatically metabolized)","Tobramycin (renally excreted)","Penicillin G (renally excreted)"],answer:0,explanation:"In liver disease (hepatitis + cirrhosis), hepatically metabolized drugs accumulate due to impaired hepatic clearance. Erythromycin is primarily metabolized by the liver (CYP3A4). Tobramycin and penicillin G are primarily renally excreted and don't require hepatic dose adjustment."},
  {id:"mid170",exam:"mid1",lecture:"Pharmacokinetics",q:"Zero-order kinetics:",options:["Constant AMOUNT of drug is eliminated per unit time (not dependent on concentration)","Constant fraction eliminated","Drug follows first-order kinetics","Half-life is constant"],answer:0,explanation:"Zero-order (saturation) kinetics: The elimination rate is constant regardless of concentration (enzymes are saturated). No constant t½. Drug accumulates non-linearly. Examples: phenytoin, ethanol, aspirin at high doses. First-order kinetics: Constant fraction eliminated per unit time → constant t½ → most drugs follow this."},
  {id:"mid171",exam:"mid1",lecture:"Pharmacokinetics",q:"Drug half-life increases in renal failure. What happens to renally excreted drugs?",options:["Faster elimination","No change","Renally excreted drugs accumulate → toxicity risk","Increased metabolism"],answer:2,explanation:"Renally excreted drugs depend on glomerular filtration and tubular secretion for elimination. In renal failure, filtration is impaired → reduced drug clearance → longer half-life → drug accumulation. This is especially important for drugs like digoxin, aminoglycosides, metformin (require dose reduction in renal failure)."},
  {id:"mid172",exam:"mid1",lecture:"Pharmacokinetics",q:"Which pathway is primarily used for drug elimination?",options:["Urine (renal excretion)","Sweat","Bile","Saliva"],answer:0,explanation:"The kidneys (urine) are the primary route of drug elimination. Polar/water-soluble drugs and metabolites are excreted renally. Bile excretion (fecal route) is secondary. Sweat and saliva are minor routes."},
  {id:"mid173",exam:"mid1",lecture:"Pharmacokinetics",q:"A highly polar drug given to a patient with renal failure would have:",options:["Reduced clearance","Accumulation of metabolites"],answer:0,explanation:"Polar (hydrophilic) drugs are excreted by the kidneys via glomerular filtration without significant reabsorption. In renal failure, GFR is reduced → reduced clearance of polar drugs → drug accumulates → increased risk of toxicity."},
  {id:"mid174",exam:"mid1",lecture:"Pharmacokinetics",q:"Factors modifying drug ABSORPTION do NOT include:",options:["Rate of general circulation","Hepatic metabolism","Route of administration","Dissolution rate"],answer:1,explanation:"Hepatic metabolism is a factor affecting bioavailability (first-pass effect), but it occurs AFTER absorption — it does NOT modify the absorption process itself. Factors that modify absorption include: route of administration, drug solubility/dissolution, blood flow to absorption site, surface area, GI motility, pH."},
  {id:"mid175",exam:"mid1",lecture:"Pharmacokinetics",q:"Which patient-related factor affects DISTRIBUTION?",options:["Organ size and perfusion rate","Particle size","Dissolution","Formulation"],answer:0,explanation:"Distribution of a drug to tissues depends on patient factors including: - Organ size and blood perfusion (highly perfused organs like liver, kidney, brain receive drug first) - Plasma protein binding (patient-related — albumin levels) - Body composition (fat vs. lean mass) Particle size, dissolution, and formulation are drug-related factors affecting absorption, not distribution."},
  {id:"mid176",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"ADR Type A (Augmented) is best described as:",options:["Dose-independent, unpredictable","Dose-dependent, predictable, extension of pharmacological effect","Due to immune mechanism","Occurs only after long-term use"],answer:1,explanation:"Type A (Augmented) ADR: - Dose-dependent and predictable (an exaggeration of the drug's known pharmacological effect) - Most common type (>80% of all ADRs) - Preventable by dose reduction - Examples: Warfarin → bleeding, Beta-blockers → bradycardia, Insulin → hypoglycemia"},
  {id:"mid177",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A 60-year-old diabetic patient presents with sweating, dizziness, blood sugar 65. He took insulin before an unexpected encounter. What type of ADR is this?",options:["Type A","Type B","Type C","Type E"],answer:0,explanation:"Hypoglycemia from insulin is a Type A (Augmented) ADR — it is an extension of the pharmacological effect of insulin (lowering blood sugar), dose-dependent and predictable. The patient took the correct insulin but had an unexpected encounter (didn't eat), leading to hypoglycemia."},
  {id:"mid178",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A 67-year-old takes warfarin 12 mg/day (normal 5-10 mg/day) and presents with nasal bleeding. Type of ADR?",options:["Augmented (Type A)","Bizarre (Type B)","Chronic (Type C)","Delayed (Type D)"],answer:0,explanation:"Warfarin-induced bleeding at an above-normal dose is a Type A (Augmented) ADR — it is the direct, dose-dependent pharmacological extension of warfarin's anticoagulant effect. It is predictable and preventable."},
  {id:"mid179",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"Which is an example of an AUGMENTED adverse drug reaction?",options:["Bleeding and warfarin","Cushing syndrome and corticosteroids (Type C — chronic)","Anaphylaxis and penicillin (Type B — bizarre)","Peptic ulcer and NSAIDs (Type C — chronic)"],answer:0,explanation:"Warfarin-induced bleeding = Type A (dose-dependent extension of anticoagulant effect). Cushing syndrome from long-term corticosteroids = Type C (chronic). Anaphylaxis to penicillin = Type B (bizarre/immunological). NSAIDs peptic ulcer = Type C (chronic dose+time related)."},
  {id:"mid180",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A patient with rheumatoid arthritis takes NSAIDs. After 40 days, he develops vomiting, abdominal pain, and gastric ulcer. What type of ADR?",options:["Type A","Type C (Chronic)","Type B","Type F"],answer:1,explanation:"Type C (Chronic/Continuous) ADR: - Related to cumulative dose + time of administration - Develops with long-term use - Example: NSAIDs → peptic ulcer (COX-1 inhibition reduces prostaglandin-mediated gastric protection), Corticosteroids → Cushing's syndrome, Osteoporosis After 40 days of NSAID use → this is chronic, time-related → Type C."},
  {id:"mid181",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"Patient takes NSAIDs and gets gastric ulcer. Type of ADR?",options:["Type C","Type B","Type D","Type A"],answer:0,explanation:"Same as above — NSAID-induced gastric ulcer is Type C (Chronic) — develops with prolonged use, dose and time dependent."},
  {id:"mid182",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A patient takes an antibiotic for surgery. After succinylcholine (muscle relaxant) administration, the patient has temporary/prolonged paralysis. Type of ADR?",options:["Idiosyncratic (Type B)","Pseudoallergic","Allergic","Augmented"],answer:0,explanation:"Succinylcholine-induced prolonged paralysis is a Type B (Bizarre) ADR — specifically an idiosyncratic reaction due to a genetic variation in pseudocholinesterase (butyrylcholinesterase) enzyme. Normal individuals metabolize succinylcholine rapidly; patients with pseudocholinesterase deficiency (genetic) cannot → prolonged paralysis. It is not dose-dependent, not predictable in normal population."},
  {id:"mid183",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A newborn has a birth defect of the upper limb; the mother was taking thalidomide during pregnancy. Type of ADR?",options:["Type D (Delayed — teratogenesis)","Type C","Type B","Type F"],answer:0,explanation:"Type D (Delayed) ADR: Adverse effects that occur after treatment has ended, including: - Teratogenesis (birth defects — manifest after gestation) - Carcinogenesis - Other delayed effects Thalidomide caused phocomelia (limb defects) in infants whose mothers took it in the first trimester → classic Type D (teratogen)."},
  {id:"mid184",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"What is the cause of the thalidomide-phocomelia syndrome?",options:["Teratogenicity","Pharmacological interaction","Allergic reaction","Enzyme inhibition"],answer:0,explanation:"Thalidomide interferes with limb bud development during the critical embryonic period (weeks 4-8 of gestation) via inhibition of angiogenesis and other mechanisms → teratogenicity (Category X drug). This is the reason for the strict pregnancy prevention programs with thalidomide."},
  {id:"mid185",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A drug taken in the first trimester causes limb defects. It is classified as:",options:["Category A","Category B","Teratogen (Category D or X)","Category C only"],answer:2,explanation:"A drug causing limb defects in the 1st trimester is a teratogen. Category D has evidence of fetal risk but benefits may outweigh risks in severe disease. Category X is absolutely contraindicated (risks always outweigh benefits). Either way, such a drug is a teratogen."},
  {id:"mid186",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A 27-year-old becomes pregnant. She was taking warfarin (FDA Category D) and amoxicillin (FDA Category B). As her physician, what should you do?",options:["Keep warfarin, change amoxicillin","Keep amoxicillin, change warfarin to a safer anticoagulant","Keep both drugs"],answer:1,explanation:"- Warfarin (Category D): Evidence of fetal risk — causes warfarin embryopathy (nasal hypoplasia, bone abnormalities) and fetal hemorrhage. Should be replaced with LMWH (heparin, which doesn't cross the placenta) in pregnancy. - Amoxicillin (Category B): No fetal risk in animal studies — safe to continue."},
  {id:"mid187",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"IDIOSYNCRASY is:",options:["A type of antagonism","A type B adverse effect (genetic/unusual reaction)","Normal pharmacological response","Tolerance"],answer:1,explanation:"Idiosyncrasy = a genetically-determined abnormal/unusual response to a drug. It is classified as a Type B (Bizarre) ADR. It is not dose-related, not predictable from pharmacology, and occurs in individuals with specific genetic variations (e.g., G6PD deficiency → hemolysis with primaquine; pseudocholinesterase deficiency → prolonged succinylcholine paralysis)."},
  {id:"mid188",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"An asthmatic patient is given a non-selective β-agonist to relieve bronchoconstriction. What adverse effect would you expect?",options:["Tachycardia","Bradycardia","Hypotension","Bronchoconstriction"],answer:0,explanation:"A non-selective β-agonist stimulates both: - β1 receptors (cardiac) → tachycardia and palpitations (unwanted) - β2 receptors (bronchial) → bronchodilation (desired effect) Selective β2-agonists (salbutamol) are preferred in asthma to avoid cardiac side effects."},
  {id:"mid189",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"Which of the following is a common adverse effect of AMPHETAMINES?",options:["Bradycardia","Somnolence","Constipation","Hypertension"],answer:3,explanation:"Amphetamines are sympathomimetics that release norepinephrine and dopamine. Their typical adverse effects reflect sympathetic stimulation: hypertension, tachycardia, hyperthermia, tremor, insomnia, agitation. NOT bradycardia or somnolence."},
  {id:"mid190",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"A patient with succinylcholine prolonged apnea in surgery — type of adverse reaction?",options:["Idiosyncratic (Type B)","Pseudoallergic","Allergic"],answer:0,explanation:"Same mechanism as Q82 above — pseudocholinesterase deficiency prevents succinylcholine metabolism → prolonged neuromuscular blockade/apnea. This is an idiosyncratic Type B reaction due to genetic enzyme deficiency."},
  {id:"mid191",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"Which of the following is LEAST likely to pass through the placenta and harm the fetus?",options:["Hydrophilic and high molecular weight","Hydrophilic and low molecular weight","Lipophilic and high molecular weight","Lipophilic and low molecular weight"],answer:0,explanation:"The placental barrier behaves like a lipid membrane. Drugs that cross most easily are: lipophilic, low molecular weight, un-ionized, not highly protein-bound. Conversely, hydrophilic + high molecular weight = LEAST likely to cross the placenta and harm the fetus."},
  {id:"mid192",exam:"mid1",lecture:"Factors Affecting Drug Response & Adverse Drug Reactions (ADR)",q:"Which of the following is a patient-related factor affecting distribution? (2nd version)",options:["Organ size and perfusion rate","Particle size","Dissolution","Formulation"],answer:0,explanation:"Already explained in Q75."},
  {id:"mid193",exam:"mid1",lecture:"Drug-Drug Interactions",q:"Warfarin taken with CIPROFLOXACIN causes:",options:["Hypoglycemia","No interaction","Reduced bleeding","Increased bleeding risk"],answer:3,explanation:"Ciprofloxacin is a CYP450 inhibitor (specifically CYP1A2 and partially CYP2C9). It inhibits the metabolism of warfarin → increased warfarin plasma levels → increased anticoagulant effect → bleeding risk. This is a pharmacokinetic (enzyme inhibition) drug interaction."},
  {id:"mid194",exam:"mid1",lecture:"Drug-Drug Interactions",q:"RIFAMPIN taken with ORAL CONTRACEPTIVES leads to:",options:["Increased estrogen levels","Contraceptive failure","No effect","Toxicity"],answer:1,explanation:"Already explained in Q66. Rifampin induces CYP3A4 → faster metabolism of estrogens/progestins → reduced plasma levels → contraceptive failure. This is Type F ADR (Failure of Efficacy)."},
  {id:"mid195",exam:"mid1",lecture:"Drug-Drug Interactions",q:"Patient in surgery has PROLONGED APNEA after succinylcholine. What type of reaction?",options:["Idiosyncratic (Type B)","Pseudoallergic","Allergic","Augmented"],answer:0,explanation:"Same as Q82/Q90. Genetic pseudocholinesterase deficiency → idiosyncratic Type B."},
  {id:"mid196",exam:"mid1",lecture:"Drug-Drug Interactions",q:"ANTACIDS reduce the absorption of:",options:["Insulin","Warfarin","Tetracycline","Heparin"],answer:2,explanation:"Antacids (containing Al³⁺, Mg²⁺, Ca²⁺) form insoluble chelate complexes with tetracycline, preventing its absorption from the GI tract. Tetracycline should be taken 2 hours before or 4-6 hours after antacids. This is a pharmaceutical/pharmacokinetic interaction."},
  {id:"mid197",exam:"mid1",lecture:"Drug-Drug Interactions",q:"A patient with cutaneous anthrax is prescribed ciprofloxacin. Which should he AVOID taking with ciprofloxacin?",options:["Alcohol","Grapefruit juice","Antacid"],answer:2,explanation:"Same mechanism as Q96 — antacids chelate quinolone antibiotics (ciprofloxacin) via their divalent/trivalent metal ions (Mg²⁺, Al³⁺, Ca²⁺), significantly reducing ciprofloxacin absorption. Antacids must be avoided or separated by at least 2 hours."},
  {id:"mid198",exam:"mid1",lecture:"Drug-Drug Interactions",q:"A farmer develops excessive sweating, vomiting, and salivation after work. What is the antidote?",options:["PAM (pralidoxime) and atropine","Naloxone","N-acetylcysteine","Deferoxamine"],answer:0,explanation:"The symptoms (excessive secretions, vomiting, salivation = SLUDGE) are consistent with organophosphate (cholinergic) toxidrome from pesticide exposure. Organophosphates inhibit acetylcholinesterase → ACh accumulation. Treatment: - Atropine (muscarinic antagonist) — controls hypersecretions, bradycardia - Pralidoxime (2-PAM) — reactivates AChE if given early"},
  {id:"mid199",exam:"mid1",lecture:"Drug-Drug Interactions",q:"What is the drug that has to be reduced (dose-adjusted) with allopurinol?",options:["Mercaptopurine (6-MP)"],answer:0,explanation:"Allopurinol inhibits xanthine oxidase, the enzyme responsible for metabolizing mercaptopurine (6-MP) and azathioprine. When given together, 6-MP is not metabolized → toxic accumulation → bone marrow suppression. Dose of 6-MP must be reduced to 25-33% when co-administered with allopurinol."},
  {id:"mid1100",exam:"mid1",lecture:"Drug-Drug Interactions",q:"Prolonged use of phenylephrine as a nasal decongestant results in:",options:["Epistaxis","Atrophic rhinitis (rhinitis medicamentosa)","Chronic cough","Hypertrophy of nasal mucosa"],answer:1,explanation:"Prolonged use of vasoconstrictive nasal decongestants (phenylephrine, oxymetazoline) causes rebound congestion (rhinitis medicamentosa) and with long-term use → atrophic rhinitis (thinning and atrophy of nasal mucosa). This is a Type C (chronic use) ADR."},
  {id:"mid1101",exam:"mid1",lecture:"Drug-Drug Interactions",q:"Patient has hepatitis, cirrhosis — what change related to sulfonamide use?",options:["Decreased fluid intake","Folinic acid supplement","Alkalization of urine","Increase drug concentration"],answer:2,explanation:"Sulfonamides can crystallize in urine (crystalluria) → renal tubular obstruction. Prevention: - Alkalinize the urine (sodium bicarbonate) — sulfonamides are more soluble at alkaline pH - Adequate fluid intake (hydration)"},
  {id:"mid1102",exam:"mid1",lecture:"Drug-Drug Interactions",q:"A pregnant woman is taking sulfonamide. What is the contraindication?",options:["Kernicterus"],answer:0,explanation:"Sulfonamides in pregnancy (especially near term) can cause kernicterus — sulfonamides displace bilirubin from plasma protein binding in the neonate → unconjugated bilirubin enters the brain → neurotoxicity. Sulfonamides are contraindicated in the 3rd trimester and near delivery."},
  {id:"mid1103",exam:"mid1",lecture:"Drug-Drug Interactions",q:"Doctor wants to give chloramphenicol to a neonate but is worried about gray baby syndrome. What would INCREASE the baby's risk?",options:["Decreasing conjugation in the liver","Decreasing excretion"],answer:0,explanation:"Gray baby syndrome occurs because neonates have immature hepatic glucuronyl transferase — they cannot conjugate (glucuronidate) chloramphenicol effectively. Chloramphenicol accumulates → cardiovascular collapse (gray, cyanotic, floppy baby). Decreasing conjugation (as in neonates with immature liver) further increases the risk."},
  {id:"mid1104",exam:"mid1",lecture:"Introduction to Toxicology",q:"A child swallowed iron tablets. The appropriate treatment is:",options:["Naloxone","Atropine","N-acetylcysteine","Deferoxamine (desferrioxamine) IV"],answer:3,explanation:"Antidotes by toxin: - Iron overdose → Deferoxamine (chelates free iron) - Opioids → Naloxone - Organophosphates → Atropine + Pralidoxime - Acetaminophen (paracetamol) → N-acetylcysteine - Cyanide → Hydroxocobalamin - Digoxin → Digoxin Fab antibodies - Benzodiazepines → Flumazenil"},
  {id:"mid1105",exam:"mid1",lecture:"Introduction to Toxicology",q:"A patient comes to hospital with swelling, low blood pressure, and wheezing after taking an antibiotic. What mediator is responsible?",options:["Norepinephrine","Epinephrine (this is the TREATMENT) / Histamine (the mediator)"],answer:1,explanation:"The clinical picture (urticaria/swelling, hypotension, bronchospasm/wheezing) after antibiotic = anaphylaxis (Type B ADR — allergic). Mediator responsible: histamine (and other mast cell mediators). Treatment of anaphylaxis: epinephrine (adrenaline) IM. *The question asks what is \"responsible\" — histamine is the mediator; epinephrine is the treatment.*"},
  {id:"mid1106",exam:"mid1",lecture:"Introduction to Toxicology",q:"A patient commits suicide by drinking eye drops for acute glaucoma and also administers the drug IV — excessive vomiting occurs. What is the adverse effect?",options:["Xerostomia","Salivation (excessive secretions — cholinergic toxidrome)"],answer:1,explanation:"Eye drops for acute glaucoma (closed-angle) include cholinergic drugs (pilocarpine — muscarinic agonist) that contract the ciliary muscle and open the drainage angle. Systemic absorption/overdose causes a cholinergic toxidrome: excessive salivation, lacrimation, sweating, vomiting, diarrhea (SLUDGE), bradycardia, miosis."},
  {id:"mid1107",exam:"mid1",lecture:"Introduction to Toxicology",q:"Mechanism of action of Sulfamethoxazole + Trimethoprim (Co-trimoxazole):",options:["Inhibiting folate synthesis and reduction (two sequential steps in nucleic acid synthesis)","Inhibiting RNA polymerase"],answer:0,explanation:"Co-trimoxazole works by double sequential blockade of folate pathway: - Sulfamethoxazole inhibits dihydropteroate synthase (blocks folate synthesis) - Trimethoprim inhibits dihydrofolate reductase (blocks folate reduction to active THF) Together: synergistic inhibition of bacterial nucleic acid synthesis. Humans can obtain folate from diet, bacteria must synthesize it."},
  {id:"mid1108",exam:"mid1",lecture:"IV Fluid Therapy",q:"For a patient with dehydration AND caloric requirement (NPO patient), the most appropriate IV fluid is:",options:["5% Dextrose in Water (D5W)","Normal saline","Ringer's lactate","3% NaCl"],answer:0,explanation:"D5W (5% Dextrose in Water): - Isotonic in the bag, becomes hypotonic after dextrose is metabolized - Provides 170 cal/L (caloric support for NPO patients) - Used for: dehydration, NPO maintenance, diluting drugs - NOT for: resuscitation, infants (risk of cerebral edema), patients with ↑ICP, mixing with blood"},
  {id:"mid1109",exam:"mid1",lecture:"IV Fluid Therapy",q:"Large volumes of NORMAL SALINE (0.9% NaCl) may cause:",options:["Hyponatremia","Hyperchloremic metabolic acidosis","Hypokalemia","Hypocalcemia"],answer:1,explanation:"Normal saline contains 154 mEq/L of Na⁺ AND 154 mEq/L of Cl⁻ — this is MORE chloride than plasma (104 mEq/L). Large volumes → hyperchloremic metabolic acidosis (dilutional acidosis — excess chloride drives bicarbonate down). Other complications: fluid overload."},
  {id:"mid1110",exam:"mid1",lecture:"IV Fluid Therapy",q:"HYPOTONIC fluids shift water:",options:["Into plasma","Into blood vessels","Into cells (intracellular space)","Into RBCs only"],answer:2,explanation:"Hypotonic solutions (0.45% NaCl, 0.33% NaCl, 0.2% NaCl) have osmolality lower than plasma (<280 mOsm/L). Water shifts by osmosis from the low osmolality ECF into the higher osmolality intracellular space → cells swell. This is why hypotonic fluids are: - Used for: hypernatremia, DKA, hyperosmolar states - ❌ Avoided in: ↑ICP (can worsen cerebral edema), liver disease, burns, trauma"},
  {id:"mid1111",exam:"mid1",lecture:"IV Fluid Therapy",q:"Best fluid for SEVERE SYMPTOMATIC HYPONATREMIA (coma, seizures):",options:["Ringer's lactate","D5W","3% NaCl (hypertonic saline)","5% Albumin"],answer:2,explanation:"Hypertonic saline (3% NaCl, 5% NaCl): - Osmolality ≥ 375 mOsm/L - Draws water OUT of cells into ECF → raises serum sodium rapidly - Indication: severe symptomatic hyponatremia (coma, seizures, Na⁺ <120 mEq/L) - Must be given slowly via central venous line (peripheral infusion causes thrombophlebitis) - Risk: osmotic demyelination syndrome if corrected too rapidly"},
  {id:"mid1112",exam:"mid1",lecture:"IV Fluid Therapy",q:"5% ALBUMIN works by:",options:["Providing calories","Correcting sodium","Diluting drugs","Increasing oncotic pressure"],answer:3,explanation:"5% Albumin is a colloid (not a crystalloid). It works by: - Increasing colloid oncotic pressure in the intravascular space - Draws fluid from the interstitial space into the bloodstream → expands intravascular volume - Used for: volume expansion, protein replacement in severe hypoalbuminemia, hemodynamic instability in shock - Cannot provide calories; does not directly correct sodium."},
  {id:"mid1113",exam:"mid1",lecture:"IV Fluid Therapy",q:"Normal saline is appropriate in all of the following EXCEPT:",options:["Hemorrhagic shock resuscitation","Diluting packed RBCs","Hyponatremia","Patient with hyperchloremia or metabolic acidosis (it worsens it)"],answer:3,explanation:""},
  {id:"mid1114",exam:"mid1",lecture:"IV Fluid Therapy",q:"A patient takes MORPHINE overdose and is administered NALOXONE. Respiratory depression is reversed. What is the pharmacological effect of naloxone?",options:["Competitive antagonist (at opioid receptors)","Non-pharmacological effect","Partial agonist","Agonistic effect"],answer:0,explanation:"Naloxone is a pure competitive antagonist at opioid receptors (μ, κ, δ). It displaces morphine from opioid receptors → reverses all opioid effects (respiratory depression, sedation, miosis, analgesia). It has high affinity for opioid receptors but NO intrinsic activity."},
  {id:"mid1115",exam:"mid1",lecture:"IV Fluid Therapy",q:"Biotransformation of a drug is primarily directed to:",options:["Inactivate a drug","Activate a drug","Convert lipid-soluble drug to non-lipid-soluble metabolite","Convert non-lipid-soluble drug to lipid-soluble metabolite"],answer:2,explanation:"The primary goal of drug biotransformation is to convert lipophilic (lipid-soluble) drugs into more hydrophilic (non-lipid-soluble) metabolites that can be renally excreted. This may inactivate, activate (prodrug), or create toxic metabolites — but the DIRECTION is always toward increased water solubility."},
  {id:"mid1116",exam:"mid1",lecture:"IV Fluid Therapy",q:"Which property facilitates a drug's ability to cross the blood-brain barrier?",options:["Lipophilic","Hydrophilic","High molecular weight","High plasma protein binding"],answer:0,explanation:""},
  {id:"mid1117",exam:"mid1",lecture:"IV Fluid Therapy",q:"The fraction of drug that reaches systemic circulation is:",options:["Bioavailability","First-pass metabolism","Volume of distribution"],answer:0,explanation:""},
  {id:"mid1118",exam:"mid1",lecture:"IV Fluid Therapy",q:"What does the therapeutic index INDICATE?",options:["Safety margin of a drug","Potency","Efficacy"],answer:0,explanation:""}
];
const MID2_QUESTIONS: Question[] = [];
const FINAL_QUESTIONS: Question[] = [];
const ALL_Q = [...MID1_QUESTIONS, ...MID2_QUESTIONS, ...FINAL_QUESTIONS];

type Screen = "home" | "quiz" | "score" | "review";
type Filter = "all" | "mid1" | "mid2" | "final";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LABELS: Record<Filter, { en: string; ar: string }> = {
  all:   { en: "All Questions", ar: "جميع الأسئلة" },
  mid1:  { en: "Midterm 1",     ar: "الاختبار الأول" },
  mid2:  { en: "Midterm 2",     ar: "الاختبار الثاني" },
  final: { en: "Final",         ar: "الاختبار النهائي" },
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E"] as const;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  function startQuiz(f: Filter) {
    const pool =
      f === "all"   ? ALL_Q :
      f === "mid1"  ? MID1_QUESTIONS :
      f === "mid2"  ? MID2_QUESTIONS :
                      FINAL_QUESTIONS;
    if (pool.length === 0) return;
    const qs = shuffle(pool);
    setFilter(f);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setScreen("quiz");
  }

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1] ?? null);
    } else {
      setScreen("score");
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(answers[current - 1] ?? null);
    }
  }

  const wrongQuestions = useMemo(
    () => questions.filter((q, i) => answers[i] !== q.answer),
    [questions, answers]
  );

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const counts: Record<Filter, number> = {
    all:   ALL_Q.length,
    mid1:  MID1_QUESTIONS.length,
    mid2:  MID2_QUESTIONS.length,
    final: FINAL_QUESTIONS.length,
  };

  /* ── HOME ── */
  if (screen === "home") {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Pharmacology — PH45</div>
            <h1 style={S.title}>Test Bank</h1>
            <p style={S.subtitle}>بنك الأسئلة</p>
          </div>

          <div style={S.grid}>
            {(["mid1", "mid2", "final", "all"] as Filter[]).map(f => (
              <button
                key={f}
                style={{
                  ...S.sectionBtn,
                  opacity: counts[f] === 0 ? 0.45 : 1,
                  cursor: counts[f] === 0 ? "not-allowed" : "pointer",
                }}
                onClick={() => startQuiz(f)}
                disabled={counts[f] === 0}
              >
                <span style={S.btnAr}>{LABELS[f].ar}</span>
                <span style={S.btnEn}>{LABELS[f].en}</span>
                <span style={S.btnCount}>{counts[f]} questions</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ ── */
  if (screen === "quiz") {
    const q = questions[current];
    const isAnswered = selected !== null;

    return (
      <div style={S.page}>
        <div style={S.container}>
          {/* Header */}
          <div style={S.quizHeader}>
            <button style={S.backBtn} onClick={() => setScreen("home")}>← Home</button>
            <span style={S.sectionTag}>{LABELS[filter].en}</span>
          </div>

          {/* Progress */}
          <div style={S.progressWrap}>
            <div style={S.progressBar}>
              <div
                style={{
                  ...S.progressFill,
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <span style={S.progressText}>
              {current + 1} / {questions.length}
            </span>
          </div>

          {/* Card */}
          <div style={S.card}>
            <div style={S.lectureBadge}>{q.lecture}</div>
            <p style={S.questionText} dir="ltr">{q.q}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "transparent";
                let border = "1.5px solid #334155";
                let color = "#e2e8f0";
                if (isAnswered) {
                  if (i === q.answer) {
                    bg = "#14532d44";
                    border = "1.5px solid #22c55e";
                    color = "#86efac";
                  } else if (i === selected && i !== q.answer) {
                    bg = "#7f1d1d44";
                    border = "1.5px solid #ef4444";
                    color = "#fca5a5";
                  }
                } else if (false) {
                  // hover handled via inline — skip
                }
                return (
                  <button
                    key={i}
                    style={{ ...S.optionBtn, background: bg, border, color }}
                    onClick={() => handleSelect(i)}
                    disabled={isAnswered}
                    dir="ltr"
                  >
                    <span style={S.optionLetter}>{OPTION_LETTERS[i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div style={S.explanationBox}>
                <div style={S.explanationLabel}>
                  <span>Explanation</span>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>الشرح</span>
                </div>
                <p style={{ margin: 0, lineHeight: 1.7, color: "#bfdbfe" }} dir="ltr">
                  {q.explanation || "—"}
                </p>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={S.navRow}>
            <button
              style={{ ...S.navBtn, opacity: current === 0 ? 0.35 : 1 }}
              onClick={handlePrev}
              disabled={current === 0}
            >
              ← Prev
            </button>
            {isAnswered && (
              <button style={{ ...S.navBtn, ...S.navBtnPrimary }} onClick={handleNext}>
                {current + 1 === questions.length ? "Finish ✓" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── SCORE ── */
  if (screen === "score") {
    const grade =
      pct >= 90 ? { label: "Excellent!", color: "#22c55e" } :
      pct >= 75 ? { label: "Good",       color: "#3b82f6" } :
      pct >= 60 ? { label: "Pass",       color: "#f59e0b" } :
                  { label: "Try Again",  color: "#ef4444" };

    return (
      <div style={S.page}>
        <div style={{ ...S.container, textAlign: "center" }}>
          <div style={S.card}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>
              {pct >= 75 ? "🎉" : pct >= 60 ? "👍" : "📚"}
            </div>
            <h2 style={{ margin: "0 0 4px", color: grade.color, fontSize: 28 }}>
              {grade.label}
            </h2>
            <p style={{ color: "#94a3b8", margin: "0 0 24px", fontSize: 14 }}>
              {LABELS[filter].en}
            </p>

            <div style={S.scoreBig}>{pct}%</div>
            <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>
              {score} correct out of {questions.length}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={S.actionBtn} onClick={() => startQuiz(filter)}>
                Retry
              </button>
              {wrongQuestions.length > 0 && (
                <button
                  style={{ ...S.actionBtn, background: "#1e40af" }}
                  onClick={() => { setReviewIndex(0); setScreen("review"); }}
                >
                  Review Wrong ({wrongQuestions.length})
                </button>
              )}
              <button style={{ ...S.actionBtn, background: "#1e293b" }} onClick={() => setScreen("home")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── REVIEW ── */
  if (screen === "review") {
    const q = wrongQuestions[reviewIndex];
    const userAnswer = answers[questions.indexOf(q)];

    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={S.quizHeader}>
            <button style={S.backBtn} onClick={() => setScreen("score")}>← Score</button>
            <span style={S.sectionTag}>Review Wrong Answers</span>
          </div>

          <div style={S.progressWrap}>
            <div style={S.progressBar}>
              <div
                style={{
                  ...S.progressFill,
                  width: `${((reviewIndex + 1) / wrongQuestions.length) * 100}%`,
                  background: "#ef4444",
                }}
              />
            </div>
            <span style={S.progressText}>
              {reviewIndex + 1} / {wrongQuestions.length}
            </span>
          </div>

          <div style={S.card}>
            <div style={S.lectureBadge}>{q.lecture}</div>
            <p style={S.questionText} dir="ltr">{q.q}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "transparent";
                let border = "1.5px solid #334155";
                let color = "#e2e8f0";
                if (i === q.answer) {
                  bg = "#14532d44";
                  border = "1.5px solid #22c55e";
                  color = "#86efac";
                } else if (i === userAnswer && i !== q.answer) {
                  bg = "#7f1d1d44";
                  border = "1.5px solid #ef4444";
                  color = "#fca5a5";
                }
                return (
                  <div key={i} style={{ ...S.optionBtn, background: bg, border, color }} dir="ltr">
                    <span style={S.optionLetter}>{OPTION_LETTERS[i]}</span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            <div style={S.explanationBox}>
              <div style={S.explanationLabel}>
                <span>Explanation</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>الشرح</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#bfdbfe" }} dir="ltr">
                {q.explanation || "—"}
              </p>
            </div>
          </div>

          <div style={S.navRow}>
            <button
              style={{ ...S.navBtn, opacity: reviewIndex === 0 ? 0.35 : 1 }}
              onClick={() => setReviewIndex(i => i - 1)}
              disabled={reviewIndex === 0}
            >
              ← Prev
            </button>
            <button
              style={{ ...S.navBtn, opacity: reviewIndex + 1 >= wrongQuestions.length ? 0.35 : 1 }}
              onClick={() => setReviewIndex(i => i + 1)}
              disabled={reviewIndex + 1 >= wrongQuestions.length}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Styles ── */
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "24px 16px",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    background: "#1e3a5f",
    color: "#60a5fa",
    borderRadius: 999,
    padding: "4px 14px",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800,
    color: "#f1f5f9",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 16,
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
  },
  sectionBtn: {
    background: "#1e293b",
    border: "1.5px solid #334155",
    borderRadius: 14,
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    color: "#e2e8f0",
    transition: "border-color 0.15s",
  },
  btnAr: {
    fontSize: 17,
    fontWeight: 700,
    color: "#f1f5f9",
  },
  btnEn: {
    fontSize: 13,
    color: "#94a3b8",
  },
  btnCount: {
    marginTop: 6,
    fontSize: 12,
    color: "#60a5fa",
    background: "#172554",
    borderRadius: 999,
    padding: "2px 10px",
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 13,
  },
  sectionTag: {
    fontSize: 13,
    color: "#60a5fa",
    background: "#172554",
    padding: "4px 12px",
    borderRadius: 999,
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 13,
    color: "#64748b",
    whiteSpace: "nowrap",
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  lectureBadge: {
    display: "inline-block",
    fontSize: 11,
    background: "#0f172a",
    color: "#7dd3fc",
    borderRadius: 6,
    padding: "3px 10px",
    marginBottom: 14,
    fontWeight: 600,
    letterSpacing: 0.3,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 1.65,
    marginBottom: 20,
    color: "#f1f5f9",
    margin: "0 0 20px",
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
    transition: "background 0.15s",
  },
  optionLetter: {
    minWidth: 28,
    height: 28,
    background: "#0f172a",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
    color: "#94a3b8",
    flexShrink: 0,
  },
  explanationBox: {
    marginTop: 20,
    background: "#172554",
    border: "1.5px solid #1d4ed8",
    borderRadius: 12,
    padding: "14px 18px",
  },
  explanationLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontWeight: 700,
    fontSize: 14,
    color: "#93c5fd",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  navBtn: {
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#e2e8f0",
    borderRadius: 10,
    padding: "10px 22px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  navBtnPrimary: {
    background: "#1d4ed8",
    border: "1px solid #2563eb",
    color: "#fff",
  },
  scoreBig: {
    fontSize: 72,
    fontWeight: 900,
    color: "#f1f5f9",
    lineHeight: 1,
    marginBottom: 8,
  },
  actionBtn: {
    background: "#1d4ed8",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 24px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
};
