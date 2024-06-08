import sys
import json
from scholarly import scholarly

def fetch_researcher_details(name):
    search_query = scholarly.search_author(name)
    author = next(search_query, None)
    if not author:
        return {"error": "No researchers found."}
    
    author = scholarly.fill(author)
    details = {
        "name": author.get('name'),
        "affiliation": author.get('affiliation'),
        "email": author.get('email_domain'),
        "interests": author.get('interests'),
        "publications": [
            {"title": pub.get('bib', {}).get('title'), "year": pub.get('bib', {}).get('pub_year')}
            for pub in author.get('publications', [])
        ]
    }
    return author

# Save the output to a file in JSON format
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python search.py <researcher_name>")
        sys.exit(1)
    
    name = sys.argv[1]
    details = fetch_researcher_details(name)
    with open("researcher_details.json", "w") as f:
        json.dump(details, f)
    print("Details saved to researcher_details.json")