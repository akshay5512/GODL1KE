"use strict";

const { exec } = require("child_process");
const fs = require("fs");

async function fetchResearcherDetails(name) {
    return new Promise((resolve, reject) => {
        exec(`python3 search.py "${name}"`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);

            fs.readFile("researcher_details.json", "utf8", (err, data) => {
                if (err) {
                    reject(`Error reading JSON file: ${err}`);
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
    });
}

if (require.main === module) {
    const [,, researcherName] = process.argv;

    if (!researcherName) {
        console.error("Usage: node index.js 'Researcher Name'");
        process.exit(1);
    }

    fetchResearcherDetails(researcherName)
        .then(details => console.log(JSON.stringify(details, null, 4)))
        .catch(error => console.error("Error:", error));
}
