let scholars = [];

// Fetch the JSON data
fetch('papers.json') // Assuming the JSON file is named 'papers.json'
  .then(response => response.json())
  .then(data => {
    console.log(data);
    scholars = data;
  })
  .catch(error => {
    console.error('Error fetching papers.json:', error);
  });

const searchInput = document.querySelector('.search-input');
const suggestionsList = document.getElementById('suggestions-list');
const searchIcon = document.getElementById('search-icon');

searchInput.addEventListener('input', function () {
  const input = this.value.toLowerCase();
  const filteredScholars = scholars.filter(scholar => scholar.name.toLowerCase().includes(input));
  displaySuggestions(filteredScholars);
});

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';

  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const listItem = document.createElement('li');
      listItem.textContent = suggestion.name;
      listItem.addEventListener('click', function () {
        searchInput.value = suggestion.name;
        suggestionsList.innerHTML = '';
      });
      suggestionsList.appendChild(listItem);
    });
  } else {
    const noResultsItem = document.createElement('li');
    noResultsItem.textContent = 'No results found';
    suggestionsList.appendChild(noResultsItem);
  }
}

searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    const input = searchInput.value.toLowerCase();
    const results = scholars.filter(scholar => scholar.name.toLowerCase().includes(input));
    displayResults(results);
    suggestionsList.innerHTML = ''; // Clear suggestions on search
  }
});

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
        <h3>${result.name}</h3>
        <p><strong>Affiliation:</strong> ${result.affiliation}</p>
        <p><strong>Email:</strong> ${result.email}</p>
        <p><strong>Scholar ID:</strong> ${result.scholar_id}</p>
        <p><strong>Publication count:</strong> ${result.publications.length}</p>
      `;
      resultItem.addEventListener('click', function () {
        displayDetailedView(result);
      });
      resultsContainer.appendChild(resultItem);
    });
  }
}

function displayDetailedView(result) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = `
    <div class="detailed-view">
      <h3>${result.name}</h3>
      <p><strong>Affiliation:</strong> ${result.affiliation}</p>
      <p><strong>Email:</strong> ${result.email}</p>
      <p><strong>Scholar ID:</strong> ${result.scholar_id}</p>
      <p><strong>Publication count:</strong> ${result.publications.length}</p>
      <h4>Publications</h4>
      <ul>
        ${result.publications.map(publication => `
          <li>
            <h4>${publication.bib.title}</h4>
            <p><strong>Publication year:</strong> ${publication.bib.pub_year}</p>
            <p><strong>Citation:</strong> ${publication.bib.citation}</p>
            <p><strong>Number of citations:</strong> ${publication.num_citations}</p>
            <a href="${publication.citedby_url}" target="_blank">View citations</a>
          </li>
        `).join('')}
      </ul>
      <button onclick="closeDetailedView()">Close</button>
    </div>
  `;
}

function closeDetailedView() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
}

// Function to toggle the search UI
function searchToggle(obj, evt) {
  const container = obj.closest('.search-wrapper');

  if (!container.classList.contains('active')) {
    container.classList.add('active');
  } else if (container.classList.contains('active') && obj.closest('.input-holder') === null) {
    container.classList.remove('active');
    container.querySelector('.search-input').value = '';
    container.querySelector('.suggestions-items').innerHTML = '';
  }
}

