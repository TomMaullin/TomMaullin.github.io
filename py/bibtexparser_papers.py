import bibtexparser

def bibtex_to_html(bibtex_file):
    with open(bibtex_file, encoding="utf8") as f:
        bib_database = bibtexparser.load(f)

    html_str = ""
    for entry in bib_database.entries:
        html_str += f'<div class="content">\n'
        html_str += f'  <div class="front">\n'
        html_str += f'    <img src=".{entry["img"]}">\n'
        html_str += f'  </div>\n'
        html_str += f'  <div class="back">\n'
        html_str += f'    <h2>{entry["title"]}</h2>\n'
        if 'journal' in entry:
            html_str += f'    <h4>{entry["author"]} ({entry["year"]}). {entry["journal"]}.</h4>\n'
        else:
            html_str += f'    <h4>{entry["author"]} ({entry["year"]}). {entry["booktitle"]}.</h4>\n'
        html_str += f'    <info>\n'
        html_str += f'        {entry["abstract"][:200]}... '
        if 'doi' in entry:
            html_str += f'<a href="{entry["doi"]}">(see more)</a>\n'
        else:
            html_str += f'<a href="{entry["url"]}">(see more)</a>\n'
        html_str += f'    </info>\n'
        html_str += f'    <span style="font-size: calc(0.5*40rem / 30);color: #8A8A8A; position: absolute; bottom: 0; right: 0;">\n'
        html_str += f'        (Press ESC to Exit)\n'
        html_str += f'    </span>\n'
        html_str += f'  </div>\n'
        html_str += f'</div>\n'
        print(html_str)

    with open("output.html", "w") as f:
        f.write(html_str)

bibtex_to_html(r"C:\Users\user\Documents\website_minimal\wip\bibtex\talks.bib")
