
import json
import re
import requests
from bs4 import BeautifulSoup

def scrap():
    data = []
    page = 0
    while True:
        page+=1
        print(f"Procesando pagina: {page}")
        url = f'https://regexlib.com/Search.aspx?k=&c=-1&m=-1&ps=100&p={page}'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        tables = soup.find_all('table', {'class': 'searchResultsTable'})
        if tables:
            for table in tables:
                re_piece = {}
                rows = table.find_all('tr')

                for row in rows:
                    if row.has_attr('class') and 'title' in row['class']:
                        a_tag = row.find('a')
                        if a_tag and not a_tag.find('button'):
                            re_piece['title'] = a_tag.text.strip()
                    elif row.has_attr('class') and 'author' in row['class']:
                        a_tag = row.find('a')
                        re_piece['author'] = a_tag.text.strip().lower()
                        span_tag = row.find('span', {'class': 'rating'})
                        span_no_rating = span_tag.find('span')
                        if span_no_rating:
                            re_piece['rating'] = None
                        else:
                            img_rating = span_tag.find('img')
                            src = img_rating.attrs['src']
                            rating = re.search(r"Rating(\d)", src).group(1)
                            re_piece['rating'] = rating
                    else:
                        # cols = row.find_all('td')
                        re_piece[row.find('th').text.strip().lower()] = row.find('td').text.strip()
                
                data.append(re_piece)
        else:
            break

    return data


if __name__ == '__main__':
    data = scrap()
    with open("data.json", "w") as writer:
        writer.write(json.dumps(data))
    print(data)
