#!/usr/bin/env python3
"""
Match questions from the fixed-options file against existing JSON banks,
update options/answer/explanation where they were incomplete.
"""
import json, re, sys

FIXED_FILE = "/root/.claude/uploads/ecbf2170-d149-53ba-8918-fa278f482f46/13cc7c12-pharmacology_fixed_options.md"

OPT_RE = re.compile(r"^- ([A-E])\)\s+(.+)$")

def clean(s):
    s = re.sub(r"\*\*", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def letter_to_idx(line):
    rest = re.sub(r"\*\*Answer:?\*\*\s*", "", line, flags=re.I)
    m = re.search(r"[A-E]", rest)
    return "ABCDE".index(m.group(0)) if m else None

def parse_fixed(text):
    """Return list of dicts: {exam, q_text, options, answer, explanation}"""
    exam = None
    results = []

    # Split on '---'
    blocks = []
    cur = []
    for line in text.split("\n"):
        if line.strip() == "---":
            blocks.append(cur); cur = []
        else:
            cur.append(line)
    blocks.append(cur)

    for blk in blocks:
        # Detect file section
        for ln in blk:
            m = re.match(r"^# pharmacology_(mid1|mid2|final)_complete", ln.strip())
            if m:
                exam = m.group(1)

        # Must have a Q header
        qheader = None
        for ln in blk:
            if re.match(r"^### Q\d+", ln.strip()):
                qheader = ln.strip()
                break
        if not qheader or exam is None:
            continue

        # Collect question text (bold lines before first option)
        qlines = []
        opts = []
        ans = None
        expl_lines = []
        in_expl = False

        for ln in blk:
            s = ln.strip()
            if re.match(r"^### Q\d+", s):
                continue
            if re.match(r"^##", s):
                continue
            if OPT_RE.match(s):
                m2 = OPT_RE.match(s)
                opts.append(clean(m2.group(2)))
                continue
            if s.startswith("**Answer:**"):
                ans = letter_to_idx(s)
                continue
            if s.startswith("**Explanation:**"):
                in_expl = True
                rest = s.split("**Explanation:**", 1)[-1].strip()
                if rest:
                    expl_lines.append(rest)
                continue
            if in_expl:
                if s.startswith("---") or s.startswith("#"):
                    in_expl = False
                elif s:
                    expl_lines.append(s)
                continue
            # Question text: bold-wrapped or plain non-empty lines before options
            if s and not s.startswith(">") and not s.startswith("**Answer") and not s.startswith("**Explanation"):
                # strip bold markers
                txt = clean(s)
                if txt:
                    qlines.append(txt)

        qtext = clean(" ".join(qlines))
        expl  = clean(" ".join(expl_lines))

        if not qtext or not opts or ans is None:
            continue

        results.append({
            "exam": exam,
            "q_text": qtext,
            "options": opts,
            "answer": ans,
            "explanation": expl,
        })

    return results


def text_sim(a, b):
    """Simple word-overlap similarity (0–1)."""
    wa = set(a.lower().split())
    wb = set(b.lower().split())
    if not wa or not wb:
        return 0
    return len(wa & wb) / max(len(wa), len(wb))


def find_match(fixed_q, bank):
    """Return (index, score) of the best matching question in bank."""
    best_idx, best_score = -1, 0.0
    for i, q in enumerate(bank):
        score = text_sim(fixed_q["q_text"], q["q"])
        if score > best_score:
            best_score, best_idx = score, i
    return best_idx, best_score


def main():
    fixed_qs = parse_fixed(open(FIXED_FILE, encoding="utf-8").read())
    print(f"Parsed {len(fixed_qs)} fixed questions from file")

    banks = {
        "mid1":  json.load(open("/tmp/mid1.json",  encoding="utf-8")),
        "mid2":  json.load(open("/tmp/mid2.json",  encoding="utf-8")),
        "final": json.load(open("/tmp/final.json", encoding="utf-8")),
    }

    updated  = {"mid1": 0, "mid2": 0, "final": 0}
    no_match = []
    # Track used indices per exam to prevent double-matching
    used = {"mid1": set(), "mid2": set(), "final": set()}

    for fq in fixed_qs:
        bank = banks[fq["exam"]]
        # Find best match that hasn't been used yet
        best_idx, best_score = -1, 0.0
        for i, q in enumerate(bank):
            if i in used[fq["exam"]]:
                continue
            score = text_sim(fq["q_text"], q["q"])
            if score > best_score:
                best_score, best_idx = score, i

        if best_score < 0.35:
            no_match.append((fq["exam"], fq["q_text"][:60], best_score))
            continue

        used[fq["exam"]].add(best_idx)
        old_opts = bank[best_idx]["options"]
        old_ans  = bank[best_idx]["answer"]

        bank[best_idx]["options"] = fq["options"]
        bank[best_idx]["answer"]  = fq["answer"]
        if fq["explanation"]:
            bank[best_idx]["explanation"] = fq["explanation"]

        updated[fq["exam"]] += 1
        print(f"  [{fq['exam']}] id={bank[best_idx]['id']} score={best_score:.2f}  "
              f"opts {len(old_opts)}→{len(fq['options'])}  ans {old_ans}→{fq['answer']}")

    # Manual fix for the one no-match: mid199
    # "Which drug requires dose reduction when given concurrently with allopurinol?"
    bank = banks["mid1"]
    for q in bank:
        if q["id"] == "mid199":
            q["options"] = ["Mercaptopurine (6-MP)", "Methotrexate",
                            "Cyclophosphamide", "5-Fluorouracil"]
            q["answer"] = 0
            updated["mid1"] += 1
            print(f"  [mid1] id=mid199 MANUAL FIX  opts 1→4")

    if no_match:
        print("\nNo match found (manually handled if listed above):")
        for e, t, s in no_match:
            print(f"  [{e}] {t!r}  (best={s:.2f})")

    # Save updated banks
    for name, data in banks.items():
        json.dump(data, open(f"/tmp/{name}.json", "w", encoding="utf-8"),
                  ensure_ascii=False)

    print(f"\nUpdated: mid1={updated['mid1']} mid2={updated['mid2']} final={updated['final']}")


if __name__ == "__main__":
    main()
