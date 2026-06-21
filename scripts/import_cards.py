#!/usr/bin/env python3
"""One-off importer: upload PSA card photos + create listings via the prod API."""
import json, os, time, random, string, mimetypes, urllib.request, urllib.error

API = "https://merenguevault.vercel.app"
TOKEN = os.environ["ADMIN_TOKEN"]
BASE = "/Users/antoniodelgiudice/Downloads/PSA_cards/in_collezione"

CARDS = [
    {"dir": "carta2",  "front": "PSA-69774540-front.jpg",  "back": "PSA-69774540-back.jpg",
     "player": "Sergio Ramos", "year": "2004", "set_brand": "Mundicromo Liga", "variant": None,
     "grade": "PSA 8", "serial": None, "badges": []},
    {"dir": "carta3",  "front": "PSA-107876768-front.jpg", "back": "PSA-107876768-back.jpg",
     "player": "Eduardo Camavinga", "year": "2023-24", "set_brand": "Topps UCL Final", "variant": "Orange",
     "grade": "PSA 9 / Auto 10", "serial": "/25", "badges": ["AUTO"]},
    {"dir": "carta4",  "front": "PSA-129390989-front.jpg", "back": "PSA-129390989-back.jpg",
     "player": "Vinícius Jr.", "year": "2021-22", "set_brand": "Mosaic La Liga", "variant": "Scripts Mosaic",
     "grade": "PSA 10 / Auto 10", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta7",  "front": "PSA-87124338-front.jpg",  "back": "PSA-87124338-back.jpg",
     "player": "Eduardo Camavinga", "year": "2022-23", "set_brand": "Donruss Elite FIFA", "variant": "Black Disco",
     "grade": "PSA 10", "serial": "1/1", "badges": ["1/1"]},
    {"dir": "carta8",  "front": "PSA-128390236-front.jpg", "back": "PSA-128390236-back.jpg",
     "player": "Cristiano Ronaldo", "year": "2022-23", "set_brand": "Topps Stadium Club Chrome UCC",
     "variant": "Goal Force-Prism Refractor", "grade": "PSA 10", "serial": None, "badges": []},
    {"dir": "carta9",  "front": "PSA-141341176-front.jpg", "back": "PSA-141341176-back.jpg",
     "player": "Iván Zamorano", "year": "2020-21", "set_brand": "Mosaic La Liga", "variant": "Scripts",
     "grade": "PSA 8", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta10", "front": "PSA-141341177-front.jpg", "back": "PSA-141341177-back.jpg",
     "player": "Roberto Carlos", "year": "2020-21", "set_brand": "Mosaic La Liga", "variant": "Scripts",
     "grade": "PSA 10", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta11", "front": "PSA-141341178-front.jpg", "back": "PSA-141341178-back.jpg",
     "player": "Xabi Alonso", "year": "2021-22", "set_brand": "Mosaic La Liga", "variant": "Scripts Mosaic",
     "grade": "PSA 9", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta12", "front": "PSA-141341179-front.jpg", "back": "PSA-141341179-back.jpg",
     "player": "Eduardo Camavinga", "year": "2024-25", "set_brand": "Topps Chrome UCC",
     "variant": "Chrome Auto-Red Refractor", "grade": "PSA 10", "serial": "/5", "badges": ["AUTO"]},
    {"dir": "carta13", "front": "PSA-71009790-front.jpg",  "back": "PSA-71009790-back.jpg",
     "player": "Karim Benzema", "year": "2018", "set_brand": "Panini Donruss", "variant": None,
     "grade": "PSA 10", "serial": None, "badges": []},
    {"dir": "carta14", "front": "PSA-81783054-front.jpg",  "back": "PSA-81783054-back.jpg",
     "player": "Eduardo Camavinga", "year": "2022-23", "set_brand": "Score FIFA", "variant": "Black Lasers",
     "grade": "PSA 10", "serial": "1/1", "badges": ["1/1"]},
    {"dir": "carta15", "front": "PSA-98170822-front.jpg",  "back": "PSA-98170822-back.jpg",
     "player": "Cristiano Ronaldo", "year": "2016", "set_brand": "Panini Donruss", "variant": "Dominator",
     "grade": "PSA 8", "serial": None, "badges": []},
    {"dir": "carta16", "front": "PSA-106152810-front.jpg", "back": "PSA-106152810-back.jpg",
     "player": "Antonio Rüdiger", "year": "2023-24", "set_brand": "Topps UCL Final",
     "variant": "Story of the Season-Orange", "grade": "PSA 10", "serial": "/25", "badges": []},
    {"dir": "carta17", "front": "PSA-131449430-front.jpg", "back": "PSA-131449430-back.jpg",
     "player": "Eden Hazard", "year": "2021-22", "set_brand": "Mosaic La Liga",
     "variant": "Au.Mosaic-Fusion Red Chc.", "grade": "PSA 10", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta18", "front": "PSA-137199817-front.jpg", "back": "PSA-137199817-back.jpg",
     "player": "Pikachu", "year": "2025", "set_brand": "Pokemon M-P JP", "variant": "McDonald's",
     "grade": "PSA 10", "serial": None, "badges": []},
    {"dir": "carta19", "front": "PSA-140194288-front.jpg", "back": "PSA-140194288-back.jpg",
     "player": "Zé Roberto", "year": "2024-25", "set_brand": "Topps", "variant": "Lost Rookie Card-Red",
     "grade": "PSA 10", "serial": "/10", "badges": ["ROOKIE"]},
    {"dir": "carta20", "front": "PSA-99239442-front(1).jpg", "back": "PSA-99239442-back(1).jpg",
     "player": "Cristiano Ronaldo", "year": "2022-23", "set_brand": "Topps Chrome Sapphire UCC", "variant": "SP",
     "grade": "PSA 9", "serial": None, "badges": []},
    {"dir": "carta21", "front": "PSA-138418231-front.jpg", "back": "PSA-138418231-back.jpg",
     "player": "Hugo Sánchez", "year": "2020-21", "set_brand": "Mosaic La Liga", "variant": "Autographs",
     "grade": "PSA 10 / Auto 10", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta22", "front": "PSA-138418232-front.jpg", "back": "PSA-138418232-back.jpg",
     "player": "Raúl", "year": "2021-22", "set_brand": "Mosaic La Liga", "variant": "Scripts Mosaic",
     "grade": "PSA 10 / Auto 10", "serial": None, "badges": ["AUTO"]},
    {"dir": "carta23", "front": "PSA-138418233-front.jpg", "back": "PSA-138418233-back.jpg",
     "player": "Jude Bellingham", "year": "2024-25", "set_brand": "Topps Chrome UCC", "variant": "Chr Au-Toppsfractor",
     "grade": "PSA 9 / Auto 10", "serial": "/52", "badges": ["AUTO"]},
]


def rand(n=11):
    return "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(n))


def upload_photo(filepath, prefix):
    ext = filepath.rsplit(".", 1)[-1].lower()
    path = f"{prefix}-{int(time.time()*1000)}-{rand()}.{ext}"
    req = urllib.request.Request(
        f"{API}/api/upload-url",
        data=json.dumps({"path": path}).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"},
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        body = json.load(r)
    signed_url, public_url = body["signedUrl"], body["publicUrl"]
    ctype = mimetypes.guess_type(filepath)[0] or "image/jpeg"
    with open(filepath, "rb") as f:
        data = f.read()
    put = urllib.request.Request(signed_url, data=data, headers={"Content-Type": ctype}, method="PUT")
    with urllib.request.urlopen(put) as r:
        if r.status not in (200, 201):
            raise RuntimeError(f"upload failed {r.status}")
    return public_url


def create_card(row):
    req = urllib.request.Request(
        f"{API}/api/cards",
        data=json.dumps(row).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"},
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def main():
    for c in CARDS:
        d = os.path.join(BASE, c["dir"])
        front_url = upload_photo(os.path.join(d, c["front"]), "front")
        back_url = upload_photo(os.path.join(d, c["back"]), "back")
        row = {
            "player": c["player"], "year": c["year"], "set_brand": c["set_brand"],
            "variant": c["variant"], "grade": c["grade"], "serial": c["serial"],
            "photo_url": front_url, "photo_url_back": back_url,
            "badges": c["badges"], "status": "collection", "is_grail": False,
            "price": None, "notes": None, "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
        }
        created = create_card(row)
        print(f"OK {c['dir']:8s} -> {c['player']} ({created.get('id','?')[:8]})")


if __name__ == "__main__":
    main()
