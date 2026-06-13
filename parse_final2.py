#!/usr/bin/env python3
"""Parse ac8a7bda final questions and merge into /tmp/final.json"""
import json, re

SRC = "/root/.claude/uploads/ecbf2170-d149-53ba-8918-fa278f482f46/ac8a7bda-Pharma_Final_Questions_Answered.md"

LECTURE_MAP = {
    "Cell Wall Inhibitors":                  "Cell Wall Inhibitors",
    "Protein Synthesis Inhibitors":          "Protein Synthesis Inhibitors",
    "Inhibitors of Nucleic Acid Synthesis":  "Nucleic Acid Synthesis Inhibitors",
    "Antifungal Drugs":                      "Antifungal Drugs",
    "Antiparasitic Drugs":                   "Antiparasitic Drugs",
    "Antiviral Drugs":                       "Antiviral Drugs",
    "Anticancer Drugs":                      "Anticancer Drugs",
}

FIXES = {
    "hepatitis, cirrhosis, ascites":
        (["Erythromycin", "Tobramycin", "Penicillin G", "Clindamycin"], 0),
    "5-year-old boy with lyme disease":
        (["Teeth discolouration", "Ototoxicity", "Nephrotoxicity", "Hepatotoxicity"], 0),
    "ciprofloxacin resistance - most likely cause":
        (["Mutation of topoisomerase I", "Mutation of DNA gyrase",
          "Production of active efflux pump", "Plasmid-mediated resistance"], 1),
    "liposomal amphotericin b formulation":
        (["Amphotericin B is expensive",
          "To reduce amphotericin B nephrotoxicity",
          "To enhance antifungal spectrum of activity",
          "To improve oral bioavailability"], 1),
    "limited to aspergillus and candida":
        (["Amphotericin B", "Fluconazole", "Caspofungin", "Voriconazole"], 2),
    "antifungal drug used orally for fungal meningitis in aids patient":
        (["Ketoconazole", "Nystatin", "Amphotericin B", "Fluconazole"], 3),
    "indinavir (hiv protease inhibitor that characteristically causes renal stone":
        (["Saquinavir", "Ritonavir", "Indinavir", "Lopinavir"], 2),
    "amantadine - antiviral drug used prophylactically against influenza a":
        (["Acyclovir", "Ribavirin", "Oseltamivir", "Amantadine"], 3),
    "farmer develops excessive sweating, vomiting, and salivation":
        (["PAM and atropine", "Naloxone and flumazenil",
          "N-acetylcysteine", "Activated charcoal only"], 0),
    "hyperlipidemia and insulin resistance":
        (["Ketoconazole", "Trimethoprim", "Indinavir", "Zidovudine"], 2),
    "effective against severe rsv and chronic hepatitis c":
        (["Acyclovir", "Ganciclovir", "Ribavirin", "Amantadine"], 2),
    "lamivudine - inhibits reverse transcriptase, used for both hiv and hepatitis b":
        (["Zidovudine", "Lamivudine", "Didanosine", "Stavudine"], 1),
    "ganciclovir - used to treat cytomegalovirus retinitis":
        (["Acyclovir", "Foscarnet", "Ribavirin", "Ganciclovir"], 3),
    "zanamivir - effective against both type a and b influenza, not effective orally":
        (["Oseltamivir", "Amantadine", "Zanamivir", "Rimantadine"], 2),
    "saquinavir - hiv protease inhibitor":
        (["Nucleoside reverse transcriptase inhibitor",
          "Non-nucleoside reverse transcriptase inhibitor",
          "HIV protease inhibitor", "Integrase inhibitor"], 2),
    "voriconazole - broad-spectrum antifungal, orally active, penetrates cns":
        (["Fluconazole", "Voriconazole", "Ketoconazole", "Itraconazole"], 1),
    "adverse effect of bleomycin":
        (["Cardiac toxicity", "Renal toxicity", "Pulmonary toxicity", "Hepatic toxicity"], 2),
    "testicular carcinoma and can cause nephrotoxicity":
        (["Cisplatin", "Bleomycin", "Vinblastine", "Methotrexate"], 0),
}

Q_RE    = re.compile(r"^### Q\d+:\s*(.+)")
HEAD_RE = re.compile(r"^## \d+\.\s+(.+)")
OPT_RE  = re.compile(r"^[A-E]\)\s+(.+)")
NUM_RE  = re.compile(r"^[1-4]\)\s+(.+)")

def clean(s):
    s = re.sub(r"\*+", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def parse(text):
    lines = text.split("\n")
    results = []

    # Collect question start positions with their lecture
    q_starts = []
    cur_lecture = "Cell Wall Inhibitors"
    for i, ln in enumerate(lines):
        s = ln.strip()
        m = HEAD_RE.match(s)
        if m:
            heading = m.group(1).strip()
            cur_lecture = LECTURE_MAP.get(heading, heading)
        mq = Q_RE.match(s)
        if mq:
            q_starts.append((i, cur_lecture, mq.group(1).strip()))

    for k, (start, lec, q_from_header) in enumerate(q_starts):
        end = q_starts[k+1][0] if k+1 < len(q_starts) else len(lines)
        blk = lines[start+1:end]  # skip the ### line itself

        opts, ans_idx, expl_parts, in_expl = [], None, [], False

        for ln in blk:
            s = ln.strip()
            if not s or s == "---": continue
            if s.startswith("**Source:"): continue
            if s.startswith("⚠️"): continue
            if s.startswith("*Note"): continue
            if HEAD_RE.match(s): continue

            if OPT_RE.match(s):
                opts.append(clean(OPT_RE.match(s).group(1)))
                in_expl = False
                continue

            if NUM_RE.match(s) and not opts:
                opts.append(clean(NUM_RE.match(s).group(1)))
                continue

            if s.startswith("**Answer:**"):
                rest = re.sub(r"\*\*Answer:\*\*\s*", "", s)
                m2 = re.search(r"([A-E1-4])\)", rest)
                if m2:
                    raw = m2.group(1)
                    ans_idx = (int(raw)-1) if raw.isdigit() else "ABCDE".index(raw)
                in_expl = False
                continue

            if s.startswith("**Explanation:**"):
                in_expl = True
                rest = s.split("**Explanation:**", 1)[-1].strip()
                if rest: expl_parts.append(rest)
                continue

            if in_expl:
                expl_parts.append(s)

        qtext = clean(q_from_header)
        expl  = clean(" ".join(expl_parts))

        # Apply fix if needed
        qlow = qtext.lower()
        fix_key = next((k for k in FIXES if k in qlow), None)
        if fix_key:
            opts, ans_idx = FIXES[fix_key]

        if not qtext or len(opts) < 2 or ans_idx is None:
            continue

        results.append({
            "lecture": lec,
            "q": qtext,
            "options": opts[:5],
            "answer": ans_idx,
            "explanation": expl,
        })

    return results


def main():
    parsed = parse(open(SRC, encoding="utf-8").read())
    print(f"Parsed {len(parsed)} questions from new file")

    existing = json.load(open("/tmp/final.json", encoding="utf-8"))

    def key(t): return re.sub(r"\W+", " ", t.lower()).strip()[:80]
    existing_keys = {key(q["q"]) for q in existing}

    new_qs, skipped = [], 0
    start_id = len(existing) + 1
    for q in parsed:
        if key(q["q"]) in existing_keys:
            skipped += 1
            continue
        qid = f"final{start_id + len(new_qs)}"
        new_qs.append({
            "id": qid, "exam": "final",
            "lecture": q["lecture"], "q": q["q"],
            "options": q["options"], "answer": q["answer"],
            "explanation": q["explanation"],
        })

    print(f"Skipped {skipped} duplicates → adding {len(new_qs)} questions")
    combined = existing + new_qs
    json.dump(combined, open("/tmp/final.json", "w", encoding="utf-8"), ensure_ascii=False)
    print(f"Final bank now: {len(combined)} questions")

    from collections import Counter
    for lec, n in sorted(Counter(q["lecture"] for q in new_qs).items()):
        print(f"  {lec}: +{n}")

if __name__ == "__main__":
    main()
