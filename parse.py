#!/usr/bin/env python3
"""Parse the three pharmacology markdown banks into question JSON."""
import re, json, sys

UP = "/root/.claude/uploads/ecbf2170-d149-53ba-8918-fa278f482f46/"
FILES = {
    "mid1":  UP + "3601674a-pharmacology_mid1_complete.md",
    "mid2":  UP + "da6d8e36-pharmacology_mid2_complete.md",
    "final": UP + "d4448a74-pharmacology_final_complete.md",
}

def clean(s):
    s = s.replace("✅", "").replace("⚠️", "")
    s = re.sub(r"\*\*", "", s)
    s = s.replace("`", "")
    s = s.strip()
    # collapse internal whitespace/newlines
    s = re.sub(r"\s+", " ", s)
    return s.strip()

OPT_RE = re.compile(r"^- ([A-E])\)\s?(.*)$")

def split_blocks(text):
    # blocks separated by lines that are exactly '---'
    blocks, cur = [], []
    for line in text.split("\n"):
        if line.strip() == "---":
            blocks.append(cur); cur = []
        else:
            cur.append(line)
    blocks.append(cur)
    return blocks

def parse_options(lines):
    """Return (options list, answer_index_from_checkmark or None). Handles
    duplicate A-restart by keeping the last full block."""
    opts = []
    ans = None
    for ln in lines:
        m = OPT_RE.match(ln.strip())
        if not m:
            continue
        letter, txt = m.group(1), m.group(2)
        if letter == "A" and opts:
            opts, ans = [], None  # restart (handles 'Correct version' duplicates)
        if "✅" in txt:
            ans = len(opts)
        opts.append(clean(txt))
    return opts, ans

def letter_to_idx(ans_line):
    # strip the '**Answer:**' marker first so we don't match the 'A' in "Answer"
    rest = re.sub(r"\*\*Answer:?\*\*\s*", "", ans_line, flags=re.I)
    m = re.search(r"[A-E]", rest)
    if not m:
        return None
    return "ABCDE".index(m.group(0))

def grab_explanation(lines):
    out, cap = [], False
    for ln in lines:
        s = ln.strip()
        if s.startswith("**Explanation:**") or s.startswith("**Correct version:**") and False:
            cap = True
            rest = s.split("**Explanation:**", 1)[-1]
            if rest.strip():
                out.append(rest)
            continue
        if cap:
            if s.startswith("*(Source") or s.startswith("**Answer") or s.startswith("> "):
                break
            out.append(ln)
    return clean(" ".join(out))

def parse_mid1(text):
    lecture = ""
    qs = []
    for blk in split_blocks(text):
        joined = "\n".join(blk)
        # lecture header
        for ln in blk:
            lm = re.match(r"##\s*📖\s*LECTURE\s*\d+\s*[—-]\s*(.+)", ln.strip())
            if lm:
                lecture = clean(lm.group(1))
        qm = None
        for ln in blk:
            qm = re.match(r"###\s*Q(\d+)\.\s*(.+)", ln.strip())
            if qm:
                break
        if not qm:
            continue
        qtext = clean(qm.group(2))
        opts, ans = parse_options(blk)
        expl = grab_explanation(blk)
        if len(opts) < 1 or ans is None:
            continue
        qs.append({"exam": "mid1", "lecture": lecture or "Pharmacology",
                   "q": qtext, "options": opts, "answer": ans, "explanation": expl})
    return qs

def parse_answerstyle(text, exam):
    lecture = ""
    qs = []
    for blk in split_blocks(text):
        # lecture header  '## Lecture N: title'  or '## Mixed...'
        for ln in blk:
            lm = re.match(r"##\s+(Lecture\s*\d+:?\s*.+|Mixed.*|.*Questions.*)", ln.strip())
            if lm and not ln.strip().startswith("###"):
                lecture = clean(re.sub(r"^Lecture\s*\d+:?\s*", "", lm.group(1)))
        # question
        qheader_idx = None
        for idx, ln in enumerate(blk):
            if re.match(r"###\s*Q\d+", ln.strip()):
                qheader_idx = idx
                break
        if qheader_idx is None:
            continue
        # question text = bold lines after header until first option / answer
        qlines = []
        opt_start = None
        for j in range(qheader_idx + 1, len(blk)):
            s = blk[j].strip()
            if OPT_RE.match(s) or s.startswith("**Answer"):
                opt_start = j
                break
            if s:
                qlines.append(s)
        qtext = clean(" ".join(qlines))
        opts, _ = parse_options(blk)
        ans_line = ""
        for ln in blk:
            if ln.strip().startswith("**Answer:**"):
                ans_line = ln.strip()
                break
        ans = letter_to_idx(ans_line)
        expl = grab_explanation(blk)
        if not qtext or ans is None or len(opts) < 1:
            continue
        if ans >= len(opts):
            ans = 0  # clamp (answer letter beyond captured options)
        qs.append({"exam": exam, "lecture": lecture or "Pharmacology",
                   "q": qtext, "options": opts, "answer": ans, "explanation": expl})
    return qs

def main():
    mid1 = parse_mid1(open(FILES["mid1"], encoding="utf-8").read())
    mid2 = parse_answerstyle(open(FILES["mid2"], encoding="utf-8").read(), "mid2")
    final = parse_answerstyle(open(FILES["final"], encoding="utf-8").read(), "final")
    for name, data, prefix in [("mid1", mid1, "mid1"), ("mid2", mid2, "mid2"), ("final", final, "final")]:
        for i, q in enumerate(data, 1):
            q["id"] = f"{prefix}{i}"
        json.dump(data, open(f"/tmp/{name}.json", "w", encoding="utf-8"), ensure_ascii=False)
        print(f"{name}: {len(data)} questions")

if __name__ == "__main__":
    main()
