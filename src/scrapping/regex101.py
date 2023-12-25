
import json
import os
import re
import time
import traceback
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

def scrap(from_page=2):
    data = []
    total_pages = None
    back_off = 1.5
    timeout_req = 5

    url_format = "https://regex101.com/api/library/{page}/?orderBy=HIGHEST_SCORE"
    response = requests.get(url_format.format(page=1))
    data_page = response.json()
    data.extend(data_page.get("data", []))
    total_pages = data_page.get("pages", 2)
    page = from_page
    for page in tqdm(range(page, total_pages)):
        url = url_format.format(page=page)
        response = requests.get(url)
        while response.status_code != 200:
            timeout_req = max(120, back_off*timeout_req)
            time.sleep(timeout_req)
            response = requests.get(url)

        timeout_req = 5
        data_page = response.json()

        data.extend(data_page.get("data", []))
        total_pages = data_page.get("pages")

        time.sleep(1)

        # soup = BeautifulSoup(response.text, 'html.parser')
        # divs = soup.select('body > div > div > div:last-child > div:first-child > div > div')
        # if divs:
        #     for div in divs:
        #         _aux = {}
        #         time.sleep(0.4)
        #         hyps = div.select("a")
        #         if hyps:
        #             anchor_el = hyps[0]
        #             unique_regex = anchor_el.attrs.get("href")
        #             re_id = os.path.basename(unique_regex)
        #             if "?" in re_id:
        #                 re_id = re_id.split("?")[0]
        #             _url = f'https://regex101.com/api/library/details/{re_id}'
        #             _response = requests.get(_url)
        #             _aux = _response.json()
        #             data.append(_aux)
        # else:
        #     break

    return data


if __name__ == '__main__':
    try:
        data = scrap(from_page=113)
    except Exception:
        traceback.print_exc()
    finally:
        with open("regex101.json", "w") as writer:
            writer.write(json.dumps(data))
