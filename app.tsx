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
const MID2_QUESTIONS: Question[] = [
  {id:"mid21",exam:"mid2",lecture:"Cholinergic Agonists",q:"A 10-year-old boy accidentally ingested a medication. He presents with signs of excessive nicotinic AND muscarinic stimulation WITHOUT central nervous system effects. Which drug is most likely?",options:["Pilocarpine","Rivastigmine","Pyridostigmine","Physostigmine"],answer:2,explanation:"Pyridostigmine is a quaternary amine AChE inhibitor — does not cross BBB (no CNS effects), stimulates both nicotinic and muscarinic receptors peripherally."},
  {id:"mid22",exam:"mid2",lecture:"Cholinergic Agonists",q:"A girl from the countryside is brought to the ER with pale face, cool & wet skin. What is the most appropriate treatment?",options:["Atropine + pralidoxime","Pralidoxime + physostigmine","Atropine + physostigmine","Pralidoxime + physostigmine"],answer:0,explanation:"Classic organophosphate poisoning (cholinergic crisis). Atropine blocks muscarinic effects; pralidoxime (PAM) regenerates AChE if given early."},
  {id:"mid23",exam:"mid2",lecture:"Cholinergic Agonists",q:"If a person is exposed to organophosphorus compounds and is not treated, what is the most likely cause of death?",options:["Respiratory failure","Cardiac arrest","Glaucoma","Hypertension"],answer:0,explanation:"Organophosphates cause irreversible AChE inhibition → excess ACh → bronchoconstriction + bronchospasm + respiratory muscle paralysis → respiratory failure."},
  {id:"mid24",exam:"mid2",lecture:"Cholinergic Agonists",q:"A farmer develops excessive sweating, vomiting, and salivation after work. Which of the following is the antidote?",options:["Pralidoxime (PAM) and atropine"],answer:0,explanation:"Organophosphate (pesticide) poisoning. Treat with atropine (muscarinic blocker) + pralidoxime (reactivates AChE before aging occurs)."},
  {id:"mid25",exam:"mid2",lecture:"Cholinergic Agonists",q:"A 40-year-old male with myasthenia gravis is treated with neostigmine. He develops bradycardia and diarrhea. Which drug manages these symptoms?",options:["Atropine sulfate","Vitamin K","Protamine sulfate"],answer:0,explanation:"Neostigmine increases ACh → excess muscarinic effects (bradycardia, diarrhea). Atropine blocks these muscarinic side effects."},
  {id:"mid26",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following increases parasympathomimetic activity?",options:["Isoflurophate","Cyclopentolate","Atropine","Scopolamine"],answer:0,explanation:"Isoflurophate is an irreversible organophosphate AChE inhibitor → increases ACh → increased parasympathetic activity."},
  {id:"mid27",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which receptor increases salivation when activated in parasympathetic conditions?",options:["M3","M2","M1","Nn"],answer:0,explanation:"M3 receptors mediate exocrine gland secretion including salivary glands (also sweat glands)."},
  {id:"mid28",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following is an action of a parasympathomimetic (cholinergic agonist)?",options:["Contraction of bladder wall","Contraction of skeletal muscle blood vessels"],answer:0,explanation:"Muscarinic (M3) stimulation contracts the detrusor muscle (bladder wall) and relaxes the sphincter → promotes urination."},
  {id:"mid29",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following actions is brought out by parasympathomimetics?",options:["Vasoconstriction of skeletal muscle blood vessels","Slowing of the heart","Relaxation of the urinary bladder wall","Dilatation of the eye pupil"],answer:1,explanation:"Parasympathetic stimulation slows the heart via M2 receptors on the SA/AV node."},
  {id:"mid210",exam:"mid2",lecture:"Cholinergic Agonists",q:"What is the mode of action of pirenzepine?",options:["M1 cholinergic antagonist"],answer:0,explanation:"Pirenzepine (and dicyclomine) are selective M1 blockers → reduce gastric HCl secretion (M1 on gastric parietal cells)."},
  {id:"mid211",exam:"mid2",lecture:"Cholinergic Agonists",q:"A cholinergic agonist drug can be used to treat which condition?",options:["Increased stomach acidity","Urine incontinence","Intestinal colic (postoperative ileus / urinary retention)"],answer:2,explanation:"Bethanechol (M3 agonist) contracts bladder and GI smooth muscle → used for urinary retention and postoperative ileus. Answer key says C but this may refer to urinary retention context."},
  {id:"mid212",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following will present in a patient taking Atropine?",options:["Constipation","Sweating","Bradycardia"],answer:0,explanation:"Atropine blocks M3 in GI → reduces peristalsis → constipation. Also causes dry mouth, tachycardia, urinary retention, mydriasis."},
  {id:"mid213",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following is a characteristic of parasympathetic stimulation?",options:["Inhibition of bronchial secretion","Contraction of the pupil","Contraction of sphincter of urinary bladder","Decrease in intestinal motility"],answer:1,explanation:"Parasympathetic (M3) constricts the pupil via contraction of the constrictor pupillae muscle (miosis)."},
  {id:"mid214",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following can be used to treat an accidental overdose of Pilocarpine?",options:["Atropine","Physostigmine","Bethanechol","Carbachol"],answer:0,explanation:"Pilocarpine is a muscarinic agonist. Overdose → excess muscarinic effects. Atropine (competitive muscarinic antagonist) reverses these effects."},
  {id:"mid215",exam:"mid2",lecture:"Cholinergic Agonists",q:"A patient took a large dose of pilocarpine. What other complications could appear beyond vomiting?",options:["Bradycardia","Decreased salivation (Xerostomia)"],answer:0,explanation:"Pilocarpine overdose → massive muscarinic stimulation → bradycardia (M2), excess salivation, bronchospasm, sweating, miosis."},
  {id:"mid216",exam:"mid2",lecture:"Cholinergic Agonists",q:"Which of the following drugs would increase the parasympathetic activity?",options:["Tropicamide","Hyoscine","Atropine","Neostigmine"],answer:3,explanation:"Neostigmine is an AChE inhibitor → ↑ ACh → ↑ parasympathetic activity. All others are antimuscarinic drugs."},
  {id:"mid217",exam:"mid2",lecture:"Cholinergic Antagonists",q:"What is the most appropriate treatment for a 3-year-old who accidentally ingested atropine eye drops and presents with hyperthermia, dry mouth, dilated pupils, tachycardia, and hallucinations?",options:["Pralidoxime","Physostigmine","Atropine","Neostigmine"],answer:1,explanation:"Atropine toxicity → physostigmine (tertiary amine AChE inhibitor) crosses BBB and reverses both central and peripheral atropine effects. Neostigmine is quaternary — doesn't cross BBB."},
  {id:"mid218",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A 48-year-old man presents with dilated pupils, dry mucous membranes, tachycardia, urinary retention, absent bowel sounds, hallucinations. What is the diagnosis?",options:["Organophosphate poisoning","Opioid overdose","Atropine toxicity","Beta-blocker overdose"],answer:2,explanation:"Classic \"anticholinergic toxidrome\": Blind as a bat (mydriasis), Dry as a bone, Hot as a hare, Red as a beet, Mad as a hatter, tachycardia."},
  {id:"mid219",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A woman prescribed an anticholinergic for motion sickness later experiences vivid dreams and hallucinations. Which drug was most likely used?",options:["Atropine","Glycopyrrolate","Scopolamine","Dicyclomine"],answer:2,explanation:"Scopolamine (hyoscine) has greater CNS penetration than atropine → used for motion sickness but can cause CNS excitation, vivid dreams, hallucinations, especially in females pre-anesthetically."},
  {id:"mid220",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient is planning to travel by sea and has a history of severe nausea and vomiting during travel. Which drug is most likely prescribed?",options:["Scopolamine","Salbutamol","Propranolol","Fluoxetine"],answer:0,explanation:"Scopolamine (hyoscine) is the preferred antiemetic for motion sickness — more effective than atropine for this indication (blocks vestibular M1 receptors)."},
  {id:"mid221",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A child with acute iridocyclitis is prescribed a mydriatic-cycloplegic. Which drug is preferred due to its shorter duration of action?",options:["Atropine","Tropicamide","Scopolamine","Glycopyrrolate"],answer:1,explanation:"Tropicamide produces mydriasis for ~6 hours; cyclopentolate ~24 hours. Atropine lasts up to 7 days. Shorter-acting preferred (easier to reverse) except in children requiring cycloplegia."},
  {id:"mid222",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Which of the following is not an indication for antimuscarinic drugs?",options:["Motion sickness","Parkinson's disease","Bladder spasms","Narrow angle glaucoma"],answer:3,explanation:"Narrow angle glaucoma is a CONTRAINDICATION — antimuscarinics cause mydriasis → ↑ IOP → worsening of narrow-angle glaucoma."},
  {id:"mid223",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Which of the following in unaccepted (NOT a therapeutic indication) of antimuscarinic drugs?",options:["Atrial fibrillation","Postoperative bladder spasm","Motion sickness","Parkinson's disease"],answer:0,explanation:"AF is not an indication for antimuscarinics. Atropine is used for bradycardia. Antimuscarinics are used for: motion sickness, bladder spasms, Parkinson's, preanesthesia, intestinal colic."},
  {id:"mid224",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Parasympatholytics should not be used in which conditions?",options:["Pre-anesthetic","Intestinal colic","Bronchospasm","Prostate enlargement"],answer:3,explanation:"Antimuscarinics relax bladder wall and contract sphincter → urinary retention → contraindicated in enlarged prostate (BPH)."},
  {id:"mid225",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A medical student evaluating atropine doses. At a steady-state dose of 0.5 mg, what effect is expected?",options:["Coma","Skin dryness","Bradykinesia","Hallucinations"],answer:1,explanation:"At 0.5 mg atropine → initial paradoxical bradycardia (vagal M1 block), dry mouth/skin. Higher doses → tachycardia → mydriasis → hallucinations/CNS effects. The dose-dependent table: 0.5mg = mild dryness; 1mg = dry mouth + ↑HR; 2mg = mydriasis; 5mg+ = hallucinations/delirium."},
  {id:"mid226",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Which of the following adverse effects is expected after administration of anticholinergic (atropine)?",options:["Urinary incontinence","Cycloplegia","Diarrhea","Salivation"],answer:1,explanation:"Atropine blocks M3 in ciliary muscle → paralysis of accommodation (cycloplegia) and mydriasis. It causes urinary RETENTION (not incontinence), constipation, and dry mouth."},
  {id:"mid227",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient with BPH is about to undergo prostatectomy. Which of the following is absolutely contraindicated?",options:["Scopolamine","Propranolol","Labetalol"],answer:0,explanation:"Scopolamine (antimuscarinic) → urinary retention → absolutely contraindicated in BPH patients, especially pre-surgery."},
  {id:"mid228",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Why is ipratropium bromide preferred over scopolamine in treating chronic pulmonary obstruction?",options:["Better bioavailability by inhalation","Minor effects on the central nervous system","No effects on bronchial secretions","More potent than scopolamine"],answer:1,explanation:"Ipratropium is a quaternary amine → does not cross BBB → fewer CNS side effects. Inhaled route also limits systemic effects. Used in asthma and COPD."},
  {id:"mid229",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient with COPD prescribed an inhaled anticholinergic. After prolonged use, he does NOT develop tolerance. Which drug?",options:["Tiotropium","Ipratropium","Succinylcholine","Benztropine"],answer:0,explanation:"Tiotropium is selective M3 blocker → does not block presynaptic M2 → no ↑ ACh → no tolerance. Also longer acting (once daily, for COPD maintenance)."},
  {id:"mid230",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A 60-year-old male with urinary urgency/incontinence is prescribed a selective M3 antagonist. Which is most appropriate?",options:["Ipratropium","Scopolamine","Solifenacin","Pancuronium"],answer:2,explanation:"Solifenacin, darifenacin, oxybutynin are uroselective M3 blockers → relax bladder wall → used for urge incontinence and nocturnal enuresis."},
  {id:"mid231",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A 70-year-old with Parkinson's experiencing excessive salivation and tremors. Which drug is most appropriate?",options:["Glycopyrrolate","Benztropine","Ipratropium","Oxybutynin"],answer:1,explanation:"Benztropine (and biperiden, benzhexol) are antiparkinsonian antimuscarinics that cross BBB → reduce tremors and sialorrhea in Parkinson's / drug-induced parkinsonism."},
  {id:"mid232",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A colonoscopy patient receives an intramuscular anticholinergic to relax the intestine. What other adverse effect could occur?",options:["Urinary incontinence","Cycloplegia","Diarrhea","Salivation"],answer:1,explanation:"Antimuscarinics → block M3 in ciliary muscle → cycloplegia (blurred vision). Also cause dry mouth, urinary retention, tachycardia — not incontinence or diarrhea."},
  {id:"mid233",exam:"mid2",lecture:"Cholinergic Antagonists",q:"Which of the following drugs antagonizes the action of tubocurarine?",options:["Halothane","Neostigmine","Gentamicin","Diltiazem"],answer:1,explanation:"Tubocurarine is a non-depolarizing (competitive) NMB. Neostigmine (AChE inhibitor) ↑ ACh in synaptic cleft → competes with tubocurarine → reverses blockade. Aminoglycosides and halothane POTENTIATE the block."},
  {id:"mid234",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient is given a neuromuscular blocker. An initial phase of muscle fasciculations is followed by paralysis. Which drug?",options:["Pancuronium","Succinylcholine","Rocuronium","Vecuronium"],answer:1,explanation:"Succinylcholine is the ONLY depolarizing NMB — acts as ACh agonist → initial fasciculations → sustained depolarization → paralysis. Non-depolarizing agents (pancuronium, rocuronium, vecuronium) cause NO fasciculations."},
  {id:"mid235",exam:"mid2",lecture:"Cholinergic Antagonists",q:"After surgery, anesthesiologist gives neostigmine to reverse neuromuscular blockade. Which drug was used initially?",options:["Succinylcholine","Pancuronium","Atropine","Tiotropium"],answer:1,explanation:"Only non-depolarizing NMBs (pancuronium, rocuronium, vecuronium) are reversible with neostigmine. Succinylcholine is NOT reversed by AChE inhibitors (it is depolarizing)."},
  {id:"mid236",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient is given a NMB that causes histamine release, ganglionic blockade, and prolonged apnea in pseudocholinesterase deficiency. Which drug?",options:["Rocuronium","Succinylcholine","Pancuronium","Vecuronium"],answer:1,explanation:"Succinylcholine: hydrolyzed by plasma pseudocholinesterase (genetic deficiency → prolonged apnea), weak histamine release, and ganglionic block at high doses."},
  {id:"mid237",exam:"mid2",lecture:"Cholinergic Antagonists",q:"A patient develops malignant hyperthermia (severe muscle rigidity, hyperthermia) after a NMB. Which drug?",options:["Succinylcholine","Atracurium","Rocuronium","Vecuronium"],answer:0,explanation:"Succinylcholine (depolarizing) can trigger malignant hyperthermia in genetically susceptible patients → treat with dantrolene."},
  {id:"mid238",exam:"mid2",lecture:"Cholinergic Antagonists",q:"An ICU patient with liver cirrhosis needs a competitive NMB for ventilator management. Which is the best choice?",options:["Suxamethonium","Pancuronium","Vecuronium","Rocuronium"],answer:1,explanation:"Atracurium/cisatracurium are actually preferred in liver disease (Hofmann elimination, not liver-dependent). Answer key says B (pancuronium) which is partially hepatically excreted. Accept B per answer key."},
  {id:"mid239",exam:"mid2",lecture:"Adrenergic Agonists",q:"A 17-year-old girl is brought to the ER 15 minutes after being stung by a bee. She has shortness of breath, face swelling, low blood pressure, and bilateral wheezing. Which drug is most appropriate?",options:["Norepinephrine","Dopamine","Epinephrine","Dobutamine"],answer:2,explanation:"Anaphylactic shock → epinephrine is drug of choice. α1 effect → vasoconstriction (raises BP); β2 effect → bronchodilation; β1 → ↑HR. Also stabilizes mast cells."},
  {id:"mid240",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following is a non-selective beta agonist?",options:["Isoproterenol","Dobutamine","Phenylephrine","Epinephrine"],answer:0,explanation:"Isoproterenol stimulates both β1 and β2 equally (non-selective). Dobutamine is selective β1; phenylephrine is pure α1; epinephrine is α1+α2+β1+β2."},
  {id:"mid241",exam:"mid2",lecture:"Adrenergic Agonists",q:"A patient with septic shock is treated with a drug that decreases total peripheral resistance at low doses and increases it at high doses. Which drug?",options:["Dopamine","Norepinephrine"],answer:0,explanation:"Dopamine: low dose → D1 receptors → vasodilation (↓TPR, ↑renal flow); intermediate dose → β1 → ↑cardiac output; high dose → α1 → vasoconstriction (↑TPR)."},
  {id:"mid242",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which adrenergic agonist is primarily used as a vasopressor for septic shock?",options:["Epinephrine","Norepinephrine","Dobutamine","Dopamine"],answer:1,explanation:"Norepinephrine is the vasopressor of choice for septic shock — potent α1+α2 → strong vasoconstriction → ↑BP. Mainly α effects, minimal β2."},
  {id:"mid243",exam:"mid2",lecture:"Adrenergic Agonists",q:"Phenylephrine acts primarily through which mechanism?",options:["Alpha-1 agonist","Alpha-2 antagonist","Beta-1 agonist","Beta-2 agonist"],answer:0,explanation:"Phenylephrine is a pure α1 agonist → vasoconstriction → ↑BP, nasal decongestant (topical), reflex bradycardia when used IV."},
  {id:"mid244",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following is a selective β1 agonist?",options:["Dobutamine","Dopamine"],answer:0,explanation:"Dobutamine is selective β1 → ↑myocardial contractility (inotropic effect) → used in acute heart failure. Dopamine is non-selective at various doses."},
  {id:"mid245",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following is a mixed adrenergic agonist?",options:["Propranolol","Ephedrine"],answer:1,explanation:"Ephedrine has both direct (α and β receptor activation) and indirect (↑NE release) effects → \"mixed\" adrenergic agonist. Propranolol is a β blocker."},
  {id:"mid246",exam:"mid2",lecture:"Adrenergic Agonists",q:"An asthmatic patient given a non-selective β agonist to relieve bronchoconstriction. What adverse effect is expected?",options:["Tachycardia","Bradycardia","Hypotension","Bronchoconstriction"],answer:0,explanation:"Non-selective β agonist → β1 stimulation → tachycardia and palpitations (while β2 provides bronchodilation). Selective β2 agonists (salbutamol) preferred in asthma to minimize this."},
  {id:"mid247",exam:"mid2",lecture:"Adrenergic Agonists",q:"An 8-year-old girl with bronchial asthma (started therapy 2 weeks ago) presents with tremors, muscle cramps, palpitations. Which drug is responsible?",options:["Propranolol","Albuterol","Prazosin","Dobutamine"],answer:1,explanation:"Albuterol (salbutamol) is a β2 agonist. At higher doses/systemic absorption → β1-mediated tachycardia/palpitations + β2-mediated skeletal muscle tremors and cramps."},
  {id:"mid248",exam:"mid2",lecture:"Adrenergic Agonists",q:"A second-trimester pregnant woman in labor was given a medication to relax the uterus and delay delivery. What adverse effect could occur?",options:["Tachycardia","Hypotension"],answer:0,explanation:"Tocolytics (β2 agonists like terbutaline, ritodrine) relax uterine smooth muscle (β2). β1 stimulation → tachycardia is the main adverse effect."},
  {id:"mid249",exam:"mid2",lecture:"Adrenergic Agonists",q:"The following drug can relax the pregnant uterus:",options:["Noradrenaline","Acetylcholine","Terbutaline","Propranolol"],answer:2,explanation:"Terbutaline is a β2 agonist → relaxes uterine smooth muscle → used as tocolytic (delays premature labor)."},
  {id:"mid250",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following drugs is used to treat nasal congestion?",options:["An alpha-1 agonist"],answer:0,explanation:"α1 agonists (phenylephrine, oxymetazoline) → vasoconstrict nasal mucosal blood vessels → decongestant. Prolonged use → atrophic rhinitis (rebound congestion)."},
  {id:"mid251",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following is a result of prolonged use of phenylephrine as a nasal decongestant?",options:["Epistaxis","Atrophic rhinitis","Chronic cough","Hypertrophy of nasal mucosa"],answer:1,explanation:"Prolonged α1 agonist nasal decongestant → receptor downregulation → rebound congestion → atrophic rhinitis (rhinitis medicamentosa)."},
  {id:"mid252",exam:"mid2",lecture:"Adrenergic Agonists",q:"A patient taking MAO inhibitors ingests tyramine-rich food (red wine, aged cheese). Which acute response is most likely?",options:["No response","Stimulation of NE release","Inhibition of ACh release","Inhibition of NE release"],answer:1,explanation:"MAOIs block MAO → tyramine not metabolized → enters nerve terminals → massive NE release → hypertensive crisis (\"cheese reaction\")."},
  {id:"mid253",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following is a common adverse effect of amphetamines?",options:["Bradycardia","Somnolence","Constipation","Hypertension"],answer:3,explanation:"Amphetamines → indirect sympathomimetics → massive NE/DA release → hypertension, tachycardia, insomnia, anorexia."},
  {id:"mid254",exam:"mid2",lecture:"Adrenergic Agonists",q:"Which of the following drugs can be used to treat hypertension?",options:["Norepinephrine","Phenylephrine","Alpha methyldopa","Tyramine"],answer:2,explanation:"Alpha-methyldopa is a central α2 agonist → ↓ sympathetic outflow → ↓ BP. Preferred in pregnancy-induced hypertension."},
  {id:"mid255",exam:"mid2",lecture:"Adrenergic Agonists",q:"A doctor administered norepinephrine IV for septic shock; it caused tissue necrosis at the injection site. What is the best antidote?",options:["Phentolamine","Timolol","Terazosin"],answer:0,explanation:"NE extravasation → intense α1-mediated vasoconstriction → tissue necrosis. Phentolamine (non-selective α blocker) injected locally reverses vasoconstriction."},
  {id:"mid256",exam:"mid2",lecture:"Adrenergic Agonists",q:"Using epinephrine with local anesthetic will:",options:["Prolong duration of action","Shorten onset of action","Rapid onset of action"],answer:0,explanation:"Epinephrine + local anesthetic: α1-mediated local vasoconstriction → ↓ absorption of local anesthetic → prolonged duration of action + reduced systemic toxicity."},
  {id:"mid257",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A 58-year-old man with hypertension is started on a drug that selectively blocks α1 receptors. Which effect is most likely?",options:["Increased heart rate","Vasoconstriction","Decreased peripheral resistance","Bronchoconstriction"],answer:2,explanation:"α1 blockade → vasodilation → ↓ peripheral resistance → ↓ BP. Used for hypertension and BPH."},
  {id:"mid258",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient with BPH without hypertension is prescribed a drug to improve urinary symptoms. Which is most appropriate?",options:["Tamsulosin","Dobutamine","Clonidine","Propranolol"],answer:0,explanation:"Tamsulosin is a selective α1A blocker (uroselective) → relaxes smooth muscle of prostate/bladder neck → improves urinary flow in BPH without significant BP drop."},
  {id:"mid259",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A 60-year-old asthmatic man with hypertension and slightly enlarged prostate. Which medication treats both conditions?",options:["Prazosin","Tamsulosin","Labetalol"],answer:0,explanation:"Prazosin (α1 blocker) lowers BP and helps BPH. Tamsulosin (selective α1A) helps BPH. Either works; some keys accept both A and B. Labetalol is CI in asthma."},
  {id:"mid260",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient taking an α-blocker complains of dizziness when standing. What is the most likely mechanism?",options:["Increased vagal tone","Reduced venous return due to vasodilation","Increased cardiac output","Bronchospasm"],answer:1,explanation:"α1 blockade → vasodilation (venodilation) → ↓ venous return → orthostatic (postural) hypotension, especially with first dose (\"first-dose effect\" of prazosin)."},
  {id:"mid261",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following best describes the effect of α1 blockade on blood vessels?",options:["Vasoconstriction","Vasodilation","No change","Increased contractility"],answer:1,explanation:"α1 receptor activation → vasoconstriction. Blocking α1 → removes vasoconstrictor tone → vasodilation."},
  {id:"mid262",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which is most likely to cause reflex tachycardia?",options:["Prazosin","Propranolol","Timolol","Metoprolol"],answer:0,explanation:"Prazosin (α1 blocker) → vasodilation → ↓ BP → baroreceptor reflex → ↑ sympathetic activity → reflex tachycardia (compensatory)."},
  {id:"mid263",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following drugs blocks both α and β receptors?",options:["Propranolol","Labetalol","Metoprolol","Tamsulosin"],answer:1,explanation:"Labetalol blocks both α1 and β receptors → combined vasodilation + reduced cardiac output → useful in hypertensive emergencies, pregnancy-induced HTN."},
  {id:"mid264",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is the primary mechanism of β-blockers in hypertension?",options:["Increased peripheral resistance","Increased cardiac output","Decreased cardiac output and renin release","Increased sodium retention"],answer:2,explanation:"β-blockers: β1 blockade → ↓ HR and contractility → ↓ CO; ↓ renin release from kidney (β1) → ↓ angiotensin II → ↓ BP."},
  {id:"mid265",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following drugs is a non-selective β-blocker?",options:["Metoprolol","Atenolol","Propranolol","Nebivolol"],answer:2,explanation:"Propranolol is non-selective (β1+β2). Metoprolol, atenolol, nebivolol are selective β1 (cardioselective) blockers."},
  {id:"mid266",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A nonselective β-blocker is given to a patient with asthma. What is the most likely adverse effect?",options:["Bronchodilation","Bronchospasm","Increased mucus secretion","Vasodilation"],answer:1,explanation:"β2 blockade in lungs → bronchoconstriction → dangerous in asthma/COPD. Only cardioselective β1 blockers (metoprolol) are used with caution if needed."},
  {id:"mid267",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which β-blocker is safest in a patient with asthma?",options:["Propranolol","Timolol","Metoprolol","Nadolol"],answer:2,explanation:"Metoprolol is cardioselective (β1 > β2) → less bronchospasm risk. Propranolol, timolol, nadolol are non-selective → contraindicated in asthma."},
  {id:"mid268",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient with hypertension and asthma was given an adrenergic blocker, after which asthma worsened. What is the best alternative?",options:["Propranolol","Metoprolol"],answer:1,explanation:"Switch to cardioselective β1 blocker (metoprolol, atenolol) → less β2 blockade → fewer respiratory effects."},
  {id:"mid269",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient taking a β-blocker develops fatigue and bradycardia. Which receptor is primarily responsible?",options:["α1","β1","β2","M3"],answer:1,explanation:"β1 blockade in heart → ↓ HR (bradycardia) and ↓ contractility → fatigue."},
  {id:"mid270",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A diabetic patient taking a nonselective β-blocker. Which symptom of hypoglycemia may be masked?",options:["Sweating","Tachycardia","Confusion","Hunger"],answer:1,explanation:"β-blockers mask adrenergic signs of hypoglycemia (tachycardia, palpitations, tremor). Sweating is cholinergic → NOT masked. Confusion and hunger are central signs → not masked."},
  {id:"mid271",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which symptoms of hypoglycemia are masked by beta blockers?",options:["Sweating only","Tremor and tachycardia","Confusion only","Polyuria"],answer:1,explanation:"β-blockers mask β-adrenergic signs: tachycardia + tremor. Sweating (cholinergic) and CNS symptoms (confusion) are NOT masked."},
  {id:"mid272",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient on chronic β-blocker therapy suddenly stops the medication. What is the expected outcome?",options:["Hypotension","Bradycardia","Rebound tachycardia","Bronchodilation"],answer:2,explanation:"Abrupt withdrawal → upregulation of β receptors → rebound sympathetic stimulation → tachycardia, angina, hypertension. Must taper gradually."},
  {id:"mid273",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which receptor blockade is responsible for decreased aqueous humor production in glaucoma?",options:["α1","α2","β1","β2"],answer:3,explanation:"β2 blockade in ciliary epithelium → ↓ aqueous humor production → ↓ IOP. Example: timolol eye drops for glaucoma."},
  {id:"mid274",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient with glaucoma is treated with a β-blocker eye drop. What is the main mechanism?",options:["Increased aqueous humor outflow","Decreased aqueous humor production","Increased pupil size","Increased ciliary contraction"],answer:1,explanation:"Timolol (β1+β2 blocker) eye drop → ↓ aqueous humor secretion by ciliary body → ↓ IOP. Does not affect pupil size (unlike miotics or mydratics)."},
  {id:"mid275",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which β-blocker is a beta-receptor antagonist primarily used for glaucoma?",options:["Nadolol","Pilocarpine","Timolol","Propranolol"],answer:2,explanation:"Timolol (non-selective β-blocker) topical → ↓ aqueous humor → glaucoma treatment."},
  {id:"mid276",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which receptor blockade reduces renin release from the kidney?",options:["α1","α2","β1","β2"],answer:2,explanation:"β1 receptors in juxtaglomerular cells regulate renin release. β1 blockade → ↓ renin → ↓ angiotensin II → ↓ aldosterone → ↓ BP."},
  {id:"mid277",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient develops cold extremities while taking a β-blocker. What is the cause?",options:["Increased vasodilation","Reduced peripheral blood flow","Increased cardiac output","Bronchodilation"],answer:1,explanation:"β2 blockade in peripheral vasculature → removes vasodilatory tone → reduced peripheral blood flow → cold extremities. More pronounced with non-selective β-blockers."},
  {id:"mid278",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A patient with pheochromocytoma is treated with a β-blocker BEFORE an α-blocker. What complication may occur?",options:["Severe hypotension","Bronchodilation","Hypertensive crisis","Hypoglycemia"],answer:2,explanation:"Pheo → excess NE/Epi. If β-blocker given first → unopposed α1 stimulation → severe hypertensive crisis. MUST give α-blocker (phenoxybenzamine) FIRST, then add β-blocker."},
  {id:"mid279",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is an irreversible alpha receptor antagonist?",options:["Tolazoline","Prazosin","Phenoxybenzamine","Labetalol"],answer:2,explanation:"Phenoxybenzamine is an irreversible (covalent bond), non-selective α-blocker (α1+α2). Prazosin and tolazoline are reversible. Used for pheochromocytoma preoperatively."},
  {id:"mid280",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is a non-selective alpha blocker?",options:["Phenoxybenzamine","Prazosin","Tamsulosin","Ephedrine"],answer:0,explanation:"Phenoxybenzamine is non-selective (α1+α2) and irreversible. Prazosin and tamsulosin are selective α1 blockers."},
  {id:"mid281",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is a reversible β-blocker with α1 blocking actions used to treat hypertension?",options:["Propranolol","Labetalol","Prazosin","Phentolamine"],answer:1,explanation:"Labetalol blocks both β and α1 (reversibly) → combined mechanism → used in hypertension, hypertensive emergencies, pregnancy."},
  {id:"mid282",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is a beta-adrenergic receptor antagonist that also blocks alpha receptors?",options:["Esmolol","Labetalol","Propranolol","Timolol"],answer:1,explanation:"Labetalol = combined α1+β blocker. Useful in hypertensive emergencies and pregnancy-related HTN."},
  {id:"mid283",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"A hypertensive patient accidentally given an α2-agonist instead of an α1-blocker. Which is correct?",options:["α2-agonists ↑ NE release from sympathetic terminals","α2-agonists can reduce BP","α2-agonist can increase BP","No effect on BP"],answer:1,explanation:"α2 agonists (clonidine, methyldopa) → act on presynaptic α2 → ↓ NE release → central sympathoinhibition → ↓ BP. So the patient would still get BP reduction, similar goal."},
  {id:"mid284",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following drugs is used in performance anxiety?",options:["Propranolol","Phenylephrine","Pilocarpine","Bethanechol"],answer:0,explanation:"Propranolol (β-blocker) blunts somatic signs of anxiety (tachycardia, tremor, palpitations) → used for situational/performance anxiety."},
  {id:"mid285",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is correct regarding α-adrenergic blockers?",options:["Used in treatment of hypotension in anaphylactic shock","Used in treatment of BPH","Used in treatment of asthma","Reduce frequency of urination"],answer:1,explanation:"α1 blockers (prazosin, tamsulosin, doxazosin) relax prostatic smooth muscle → improve urine flow in BPH. They do NOT treat anaphylaxis (epinephrine does) and do NOT treat asthma."},
  {id:"mid286",exam:"mid2",lecture:"Adrenergic Receptors & Blockers",q:"Which of the following is correct regarding beta blockers?",options:["Treatment with β-blockers should not be stopped abruptly","Propranolol is a cardioselective β-blocker","β-blockers may cause orthostatic hypotension","Cardioselective β-blockers worsen asthma","β-blockers decrease peripheral resistance by vasorelaxation"],answer:0,explanation:"Abrupt β-blocker withdrawal → rebound tachycardia/angina. Propranolol is NON-selective. Cardioselective blockers are safer (but not safe) in asthma. β-blockers do NOT primarily decrease peripheral resistance."},
  {id:"mid287",exam:"mid2",lecture:"Autocoids (Histamine & Serotonin)",q:"Which of the following is best for seasonal allergic rhinitis?",options:["Loratadine","Cyclizine","Diphenhydramine","Chlorpheniramine"],answer:0,explanation:"Loratadine is a 2nd-generation H1 antihistamine → non-sedating, no anticholinergic effects → preferred for allergic rhinitis. 1st-gen agents (cyclizine, diphenhydramine, chlorphenamine) are sedating."},
  {id:"mid288",exam:"mid2",lecture:"Autocoids (Histamine & Serotonin)",q:"A cancer patient undergoing chemotherapy is given a drug to prevent nausea and vomiting. Which is most likely used?",options:["Metoclopramide","Ondansetron","Domperidone","Prochlorperazine"],answer:1,explanation:"Ondansetron is a 5-HT3 antagonist → highly effective for chemotherapy-induced nausea/vomiting (CINV). Adverse effect: QT prolongation."},
  {id:"mid289",exam:"mid2",lecture:"Autocoids (Histamine & Serotonin)",q:"A patient on warfarin starts cimetidine. Two weeks later, clotting time is prolonged. What is the cause?",options:["Increased renal excretion of warfarin","Decreased hepatic cytochrome P450 activity","Increased hepatic cytochrome P450 activity","Decreased plasma protein binding"],answer:1,explanation:"Cimetidine (H2 blocker) is a potent CYP450 inhibitor → ↓ warfarin metabolism → ↑ warfarin levels → ↑ bleeding risk. Famotidine does NOT inhibit CYP450."},
  {id:"mid290",exam:"mid2",lecture:"Eicosanoids & Kinins",q:"Which of the following causes vasodilation and decreases platelet aggregation?",options:["PGI₂","PGD₂","PGF₂α","PGE₂"],answer:0,explanation:"PGI₂ (prostacyclin, from endothelium): vasodilation + ↓ platelet aggregation. Opposes TXA2 (from platelets: vasoconstriction + ↑ aggregation)."},
  {id:"mid291",exam:"mid2",lecture:"Eicosanoids & Kinins",q:"Which leukotriene is responsible for neutrophil chemotaxis and inflammation?",options:["LTB4","LTD4","LTE4","LTF4"],answer:0,explanation:"LTB4 is a potent neutrophil chemoattractant. LTC4, LTD4, LTE4 (cysteinyl leukotrienes) cause bronchoconstriction and are blocked by montelukast."},
  {id:"mid292",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"NSAIDs exert their therapeutic effect by inhibiting which enzyme?",options:["Phospholipase A2","Cyclooxygenase (COX)","Lipoxygenase","Thromboxane synthase"],answer:1,explanation:"NSAIDs inhibit COX-1 and/or COX-2 → ↓ prostaglandin and thromboxane synthesis → anti-inflammatory, analgesic, antipyretic effects."},
  {id:"mid293",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"A patient with myocardial infarction is given aspirin to prevent thrombus formation. What is the appropriate dose?",options:["81 mg once daily","4 g per day","8 g per day","650 mg every 6 hours"],answer:0,explanation:"Aspirin at low dose (75-150 mg/day): irreversibly inhibits platelet COX-1 → ↓ TXA2 → antiplatelet effect. Higher doses needed for anti-inflammatory (4-8g/day). Low dose preferred for cardiovascular prophylaxis."},
  {id:"mid294",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"Which of the following is a reversible inhibitor of platelet cyclooxygenase?",options:["Leukotrienes","Ibuprofen","Aspirin"],answer:1,explanation:"Ibuprofen reversibly inhibits COX. Aspirin is IRREVERSIBLE (acetylation). Platelets have no nucleus → cannot synthesize new COX → aspirin effect lasts platelet lifetime (7-10 days)."},
  {id:"mid295",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"Celecoxib contraindication:",options:["Peptic ulcer","Gout","Myocardial infarction"],answer:2,explanation:"Celecoxib (COX-2 selective): reduced GI toxicity but ↑ cardiovascular risk (thrombotic events, MI). Contraindicated in patients with history of MI or cardiovascular disease."},
  {id:"mid296",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"Which of the following patient characteristics is the most compelling reason for avoiding celecoxib?",options:["History of alcohol abuse","History of gout","History of myocardial infarction","History of osteoporosis","History of peptic ulcer disease"],answer:2,explanation:"The most compelling CI for celecoxib is cardiovascular disease (MI, stroke risk) due to ↑ thrombosis risk from unopposed PGI2 inhibition."},
  {id:"mid297",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"A 16-year-old girl with aspirin overdose. Which syndrome is most likely?",options:["Bone marrow suppression and aplastic anemia","Fever, hepatic dysfunction, encephalopathy (Reye's)","Hyperthermia, metabolic acidosis, and coma (salicylism)","Rapid, fulminant hepatic failure","Rash, interstitial nephritis, and acute renal failure"],answer:2,explanation:"Salicylate (aspirin) overdose → salicylism: tinnitus, nausea; severe: hyperthermia, metabolic acidosis, respiratory alkalosis (CNS stimulation then depression), coma. Treatment: alkalinize urine (NaHCO3) + renal excretion."},
  {id:"mid298",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"A patient takes an NSAID and develops a gastric ulcer. What type of ADR is this?",options:["Type C","Type B","Type D","Type A"],answer:3,explanation:"Type A (Augmented) ADR = predictable, dose-related, based on drug's pharmacological action. NSAID → gastric ulcer from COX-1 inhibition (↓ protective prostaglandins) is Type A. Anaphylaxis to penicillin = Type B (bizarre/unpredictable)."},
  {id:"mid299",exam:"mid2",lecture:"NSAIDs & Paracetamol",q:"Which of the following is an example of an augmented (Type A) adverse drug reaction?",options:["Cushing syndrome with corticosteroids","Anaphylaxis with penicillin","Bleeding with warfarin","Peptic ulcer with NSAIDs"],answer:2,explanation:"Type A reactions are dose-dependent and predictable. Bleeding with warfarin = predictable extension of pharmacological effect = Type A. Cushing's with corticosteroids = also Type A. Anaphylaxis = Type B. Answer key lists C."},
  {id:"mid2100",exam:"mid2",lecture:"Gout",q:"What is the first-line treatment of acute gout?",options:["Allopurinol","Indomethacin","Probenecid","Colchicine (prophylaxis)"],answer:1,explanation:"NSAIDs (especially indomethacin) are first-line for acute gout attacks. Allopurinol and probenecid are for chronic urate-lowering therapy (NOT given during acute attack). Colchicine is second-line."},
  {id:"mid2101",exam:"mid2",lecture:"Gout",q:"A patient with a history of MI is switched to another xanthine oxidase inhibitor. What adverse effect should be monitored?",options:["Stevens-Johnson syndrome","Nephrolithiasis","Neuropathy","Increased risk of cardiovascular events"],answer:3,explanation:"Febuxostat (xanthine oxidase inhibitor, alternative to allopurinol) → ↑ cardiovascular mortality risk in patients with established CV disease. Allopurinol carries risk of SJS/hypersensitivity rash."},
  {id:"mid2102",exam:"mid2",lecture:"Gout",q:"Which of the following drugs if given with allopurinol must be reduced by 25%?",options:["Mercaptopurine","Mechlorethamine","Methotrexate"],answer:0,explanation:"Allopurinol inhibits xanthine oxidase → ↓ metabolism of 6-mercaptopurine (antineoplastic) and azathioprine → ↑ toxicity. Dose of 6-MP must be reduced by 75% (to 25% of original) when used with allopurinol."},
  {id:"mid2103",exam:"mid2",lecture:"DMARDs",q:"What is the first-line treatment of rheumatoid arthritis?",options:["Methotrexate","Ibuprofen","Prednisolone","Hydroxychloroquine"],answer:0,explanation:"Methotrexate is the anchor drug / first-line csDMARD for RA. Given once weekly, requires folic acid supplementation."},
  {id:"mid2104",exam:"mid2",lecture:"DMARDs",q:"Which drug is associated with retinal toxicity and is used in autoimmune diseases?",options:["Methotrexate","Hydroxychloroquine","Sulfasalazine","Leflunomide"],answer:1,explanation:"Hydroxychloroquine deposits in melanin-containing tissues → retinal toxicity (maculopathy). Requires ophthalmologic exam every 6-12 months. Used for SLE, RA."},
  {id:"mid2105",exam:"mid2",lecture:"DMARDs",q:"A patient with severe active RA is started on a targeted synthetic DMARD that inhibits the JAK-STAT signaling pathway. Which adverse effect carries a \"black box\" warning?",options:["Hypothyroidism","Hypoglycemia","Thromboembolic events","Nephrotoxicity"],answer:2,explanation:"JAK inhibitors (tofacitinib, baricitinib) → black box warning for: thromboembolism, serious infections, malignancies, and cardiovascular events. Thrombosis is the key boxed warning."},
  {id:"mid2106",exam:"mid2",lecture:"DMARDs",q:"A woman on methotrexate becomes pregnant. What is the right protocol?",options:["Continue treatment but increase folic acid intake","Immediately stop treatment because the drug will decrease DNA synthesis in baby causing birth defects","Use leflunomide because it has less effect in pregnancy"],answer:1,explanation:"Methotrexate is teratogenic (Category X) — folic acid antagonist → neural tube defects, craniofacial abnormalities. Must stop and use contraception. Leflunomide is ALSO teratogenic (even worse — very long half-life, requires cholestyramine washout)."},
  {id:"mid2107",exam:"mid2",lecture:"DMARDs",q:"Which of the following drugs contains both an anti-inflammatory and antimicrobial component?",options:["Sulfasalazine"],answer:0,explanation:"Sulfasalazine is cleaved in the colon into 5-aminosalicylate (anti-inflammatory) + sulfapyridine (antimicrobial sulfonamide). Used in RA and inflammatory bowel disease."},
  {id:"mid2108",exam:"mid2",lecture:"DMARDs",q:"Sulfasalazine is combined with what?",options:["5-aminosalicylate"],answer:0,explanation:"Sulfasalazine = sulfapyridine + 5-aminosalicylic acid (mesalazine). The 5-ASA component provides local anti-inflammatory action in the gut."},
  {id:"mid2109",exam:"mid2",lecture:"Mixed / Other Questions",q:"Which drug is used for testicular carcinoma and can cause nephrotoxicity?",options:["Cisplatin","Bleomycin","Vinblastine"],answer:0,explanation:"Cisplatin → nephrotoxicity (platinum compound, alkylating-like). Bleomycin → pulmonary fibrosis. Vinblastine → neurotoxicity."},
  {id:"mid2110",exam:"mid2",lecture:"Mixed / Other Questions",q:"Which drug would most likely cause cardiac problems?",options:["Doxorubicin"],answer:0,explanation:"Doxorubicin (anthracycline) → cardiotoxicity (dilated cardiomyopathy) via free radical damage. Cumulative dose-dependent."},
  {id:"mid2111",exam:"mid2",lecture:"Mixed / Other Questions",q:"What is the mechanism of action of methotrexate (antineoplastic context)?",options:["Inhibiting dihydrofolate reductase (DHFR)"],answer:0,explanation:"Methotrexate inhibits DHFR → ↓ tetrahydrofolate → ↓ thymidylate synthesis → ↓ DNA synthesis. At low doses for RA also ↑ adenosine (anti-inflammatory)."},
  {id:"mid2112",exam:"mid2",lecture:"Mixed / Other Questions",q:"Which of the following treatments needs leucovorin to increase its efficiency?",options:["5-Fluorouracil"],answer:0,explanation:"5-FU + leucovorin (folinic acid): leucovorin stabilizes the 5-FU–thymidylate synthase complex → ↑ cytotoxicity. Used in colorectal cancer."},
  {id:"mid2113",exam:"mid2",lecture:"Mixed / Other Questions",q:"What is the mechanism of action of 5-fluorouracil?",options:["Thymidylate synthase inhibition"],answer:0,explanation:"5-FU (as FdUMP) inhibits thymidylate synthase → ↓ dTMP synthesis → ↓ DNA synthesis. Pyrimidine antimetabolite."},
  {id:"mid2114",exam:"mid2",lecture:"Mixed / Other Questions",q:"The first-line treatment for breast cancer with positive receptor:",options:["Interferons","Tamoxifen","Trastuzumab"],answer:1,explanation:"ER-positive breast cancer → tamoxifen (selective estrogen receptor modulator, SERM). HER2-positive → trastuzumab (monoclonal antibody)."},
  {id:"mid2115",exam:"mid2",lecture:"Mixed / Other Questions",q:"Administration of filgrastim (G-CSF) is mainly to do what?",options:["Minimize systemic infection"],answer:0,explanation:"G-CSF (filgrastim) stimulates neutrophil production → used to prevent infection in chemotherapy-induced neutropenia (febrile neutropenia prophylaxis)."},
  {id:"mid2116",exam:"mid2",lecture:"Mixed / Other Questions",q:"The half-life of a drug is 3 hours. How much time will it take for this drug to be completely eliminated?",options:["9 hours","12 hours","21 hours","4 hours"],answer:1,explanation:"Drug elimination takes ~4-5 half-lives to reach >97% elimination. 5 × 3h = 15h (some say 4 × 3h = 12h for practical purposes). Answer key says 12h."},
  {id:"mid2117",exam:"mid2",lecture:"Mixed / Other Questions",q:"Which enzyme is the main target of zidovudine?",options:["RNA synthesis","Protease inhibitor","Nucleoside reverse transcriptase inhibitors","Non-nucleoside reverse transcriptase inhibitors"],answer:2,explanation:"Zidovudine (AZT) is an NRTI — inhibits HIV reverse transcriptase (nucleoside analog chain terminator)."},
  {id:"mid2118",exam:"mid2",lecture:"Mixed / Other Questions",q:"A female patient with cryptococcal meningitis refused IV medication. What is the best drug?",options:["Fluconazole","Amphotericin B","Ketoconazole"],answer:0,explanation:"Fluconazole — oral bioavailability ~90%, penetrates CNS well, used for cryptococcal meningitis maintenance therapy (or when IV amphotericin B not possible)."},
  {id:"mid2119",exam:"mid2",lecture:"Mixed / Other Questions",q:"A patient has recurrent UTIs and ciprofloxacin resistance. What is the most likely cause?",options:["Mutation of topoisomerase I","Mutation of DNA gyrase","Production of an active efflux pump"],answer:1,explanation:"Fluoroquinolone resistance: primarily via mutations in DNA gyrase (topoisomerase II) or topoisomerase IV. Efflux pumps are also a mechanism."},
  {id:"mid2120",exam:"mid2",lecture:"Mixed / Other Questions",q:"A patient with S. pneumoniae infection and penicillin allergy (bronchospasm). Which is the best treatment?",options:["Ciprofloxacin","Cefaclor","Ampicillin","Erythromycin"],answer:3,explanation:"Penicillin allergy (anaphylaxis/bronchospasm) → avoid penicillins AND cephalosporins (cross-reactivity). Erythromycin (macrolide) or azithromycin are alternatives for S. pneumoniae in penicillin-allergic patients."},
  {id:"mid2121",exam:"mid2",lecture:"Mixed / Other Questions",q:"What is the main role of clavulanic acid in Augmentin?",options:["Enables it to pass through the BBB","Protect from beta-lactamase"],answer:1,explanation:"Clavulanic acid is a β-lactamase inhibitor (suicide inhibitor) → binds and inactivates bacterial β-lactamase → protects amoxicillin from enzymatic degradation."},
  {id:"mid2122",exam:"mid2",lecture:"Mixed / Other Questions",q:"A boy has pneumonia and was treated with an antibiotic, but it didn't affect him. What is the next antibiotic?",options:["Amoxicillin","Ampicillin","Fluoxetine","Vancomycin"],answer:3,explanation:"If standard antibiotics fail for pneumonia (resistant Streptococcus or MRSA) → vancomycin is the drug of last resort for resistant gram-positive organisms."},
  {id:"mid2123",exam:"mid2",lecture:"Mixed / Other Questions",q:"What is the mechanism of action of terbinafine?",options:["Accumulation of squalene"],answer:0,explanation:"Terbinafine inhibits squalene epoxidase → ↑ squalene accumulation (toxic to fungi) + ↓ ergosterol synthesis. Used for dermatophyte fungal infections (nails, skin)."},
  {id:"mid2124",exam:"mid2",lecture:"Mixed / Other Questions",q:"A doctor wanted to give a neonate chloramphenicol but was worried about gray baby syndrome. What would increase the baby's risk?",options:["Decreased conjugation in the liver","Decreased excretion"],answer:0,explanation:"Neonates have immature UDP-glucuronosyltransferase (UGT) → can't conjugate chloramphenicol → accumulation → gray baby syndrome (cardiovascular collapse, ashen color, abdominal distension)."},
  {id:"mid2125",exam:"mid2",lecture:"Mixed / Other Questions",q:"Which of the following binds reversibly to the 50S ribosomal subunit and inhibits the peptidyl transferase reaction?",options:["Chloramphenicol","Linezolid"],answer:0,explanation:"Chloramphenicol binds 50S → inhibits peptidyl transferase → bacteriostatic. Linezolid also binds 23S rRNA of 50S but different mechanism (prevents 70S initiation complex formation)."},
  {id:"mid2126",exam:"mid2",lecture:"Mixed / Other Questions",q:"A 21-year-old with cutaneous anthrax is prescribed ciprofloxacin. Which should he avoid taking with ciprofloxacin?",options:["Alcohol","Grapefruit juice","Antacid"],answer:2,explanation:"Antacids (containing Ca²⁺, Mg²⁺, Al³⁺) chelate fluoroquinolones → ↓ absorption by up to 90%. Must be taken 2 hours apart from antacids, dairy products, iron supplements."},
  {id:"mid2127",exam:"mid2",lecture:"Mixed / Other Questions",q:"A patient is given a drug targeting dihydropteroate synthase. What is the most common adverse effect?",options:["Skin rash","Kernicterus in neonates"],answer:1,explanation:"Sulfonamides (dihydropteroate synthase inhibitors): most common AE = skin rash. In neonates: kernicterus (displace bilirubin from albumin). Key says B but A (skin rash) is classically the most common adverse effect overall."},
  {id:"mid2128",exam:"mid2",lecture:"Mixed / Other Questions",q:"A drug made of sulfamethoxazole and trimethoprim. Mechanism of action?",options:["Inhibiting folate synthesis and reduction","Inhibiting two sequential steps in nucleic acid synthesis"],answer:1,explanation:"Co-trimoxazole (SMX+TMP): SMX inhibits dihydropteroate synthase (step 1); TMP inhibits DHFR (step 2) → sequential blockade of folate pathway → ↓ DNA synthesis. Synergistic bactericidal effect."},
  {id:"mid2129",exam:"mid2",lecture:"Mixed / Other Questions",q:"Drug A at 5 mg produces the same BP decrease as Drug B at 500 mg. What does this indicate?",options:["Drug A is more potent than Drug B by 100 times","Drug A is more efficacious than Drug B","Drug A is less toxic than Drug B"],answer:0,explanation:"Potency = dose required to produce a given effect. Drug A needs 100x less drug = 100x more potent. Efficacy = maximum effect achievable (not determined here)."},
  {id:"mid2130",exam:"mid2",lecture:"Mixed / Other Questions",q:"What drug is used to prepare a patient for colon surgery?",options:["Neomycin"],answer:0,explanation:"Neomycin (non-absorbable aminoglycoside) given orally before GI surgery → reduces intestinal bacterial flora → decreases infection risk."},
  {id:"mid2131",exam:"mid2",lecture:"Mixed / Other Questions",q:"Drug that increases intraocular pressure and causes cycloplegia?",options:["Cyclopentolate"],answer:0,explanation:"Cyclopentolate is a synthetic antimuscarinic (mydriatic-cycloplegic) → mydriasis + cycloplegia → used for refraction. Can cause ↑ IOP, contraindicated in narrow-angle glaucoma."},
  {id:"mid2132",exam:"mid2",lecture:"Mixed / Other Questions",q:"If a male patient takes a drug that causes breast enlargement (gynecomastia), what is the drug?",options:["Ketoconazole"],answer:0,explanation:"Ketoconazole inhibits CYP enzymes → ↓ testosterone synthesis → gynecomastia. Cimetidine (H2 blocker) is also a classic cause via antiandrogen effect."},
  {id:"mid2133",exam:"mid2",lecture:"Mixed / Other Questions",q:"What is the best scenario for treating a patient with rimantadine?",options:["Pregnant woman","With hallucinations"],answer:0,explanation:"Rimantadine (M2 inhibitor, influenza A) has fewer CNS side effects than amantadine → safer in patients prone to neuropsychiatric effects. Safer also considered in pregnancy vs amantadine."}
];
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
