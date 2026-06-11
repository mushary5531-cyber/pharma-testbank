#!/usr/bin/env python3
"""Inject parsed questions into app.tsx for the given exams (mid1/mid2/final)."""
import json, re, sys

VARS = {"mid1": "MID1_QUESTIONS", "mid2": "MID2_QUESTIONS", "final": "FINAL_QUESTIONS"}

def esc(s):
    return (s.replace("\\", "\\\\").replace('"', '\\"')
             .replace("\n", " ").replace("\r", ""))

def q_to_js(q):
    opts = ",".join(f'"{esc(o)}"' for o in q["options"])
    return ('{id:"%s",exam:"%s",lecture:"%s",q:"%s",options:[%s],answer:%d,explanation:"%s"}'
            % (q["id"], q["exam"], esc(q["lecture"]), esc(q["q"]), opts,
               q["answer"], esc(q["explanation"])))

def array_literal(name, data):
    body = ",\n  ".join(q_to_js(q) for q in data)
    return f"const {name}: Question[] = [\n  {body}\n];"

def main(exams):
    src = open("app.tsx", encoding="utf-8").read()
    for exam in exams:
        data = json.load(open(f"/tmp/{exam}.json", encoding="utf-8"))
        var = VARS[exam]
        lit = array_literal(var, data)
        # replace the existing declaration (empty or already-filled, possibly multi-line)
        pattern = re.compile(rf"const {var}: Question\[\] = \[.*?\];", re.S)
        src, n = pattern.subn(lambda m: lit, src, count=1)
        assert n == 1, f"could not find {var}"
        print(f"injected {var}: {len(data)} questions")
    open("app.tsx", "w", encoding="utf-8").write(src)

if __name__ == "__main__":
    main(sys.argv[1:] or ["mid1", "mid2", "final"])
