const scholarly = require("scholarly");
const fs = require("fs").promises;

async function fetchAuthorId(authorName) {
    try {
        const searchQuery = await scholarly.search(authorName);

        /* Checking if find Authors */
        if (searchQuery.length === 0) { console.log("No Authors found!"); return; }

        /* Getting the first Author */
        const author = searchQuery;

        await fs.writeFile("author.json", JSON.stringify(author, null, 2));
    } catch (error) {
        console.error('Error fetching author ID:', error)
    }
}

fetchAuthorId("chris roast");