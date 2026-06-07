import zipfile, re, os, glob

src_dir = r"c:\Users\NISA\Downloads\Branding-20260323T182118Z-1-001 (1)\Branding"
out_dir = r"c:\Users\NISA\Desktop\AFYA\scripts\branding_text"
os.makedirs(out_dir, exist_ok=True)

def docx_to_text(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
    # paragraph + break boundaries -> newlines
    xml = xml.replace("</w:p>", "\n").replace("<w:br/>", "\n").replace("<w:tab/>", "\t")
    # tables row end
    xml = xml.replace("</w:tr>", "\n")
    # strip all tags
    text = re.sub(r"<[^>]+>", "", xml)
    # unescape basic entities
    for a, b in [("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&apos;", "'")]:
        text = text.replace(a, b)
    # collapse excessive blank lines
    lines = [ln.rstrip() for ln in text.split("\n")]
    out = []
    blank = 0
    for ln in lines:
        if ln.strip() == "":
            blank += 1
            if blank <= 1:
                out.append("")
        else:
            blank = 0
            out.append(ln)
    return "\n".join(out).strip()

for f in glob.glob(os.path.join(src_dir, "*.docx")):
    name = os.path.splitext(os.path.basename(f))[0]
    try:
        txt = docx_to_text(f)
        with open(os.path.join(out_dir, name + ".txt"), "w", encoding="utf-8") as o:
            o.write(txt)
        print(f"OK  {name}  ({len(txt)} chars)")
    except Exception as e:
        print(f"ERR {name}: {e}")
