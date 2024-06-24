let scholars = [];

// Fetch the JSON data
fetch('staff_affiliation.json')
  .then(response => response.json())
  .then(data => {
    scholars = data;
  })
  .catch(error => {
    console.error('Error staff_affiliation.json:', error);
  });

const searchInput = document.querySelector('.search-input');
const suggestionsList = document.getElementById('suggestions-list');
const suggAndResultContainer = document.getElementById('sugg_and_result');
const resultsContainer = document.getElementById('results');

// Hide the results container initially
resultsContainer.style.display = 'none';

searchInput.addEventListener('input', function () {
  const input = this.value.toLowerCase();
  const filteredScholars = scholars.filter(scholar => scholar.name.toLowerCase().includes(input));
  
  if (input.length > 0) {
    suggAndResultContainer.style.display = 'block';
    suggestionsList.style.display = 'block';
  } else {
    suggestionsList.style.display = 'none';
    suggAndResultContainer.style.display = 'none';
    resultsContainer.style.display = 'none';  // Hide the results container if the input is cleared
  }
  
  displaySuggestions(filteredScholars);
});

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="profile-container">
          <img src="${suggestion.url_picture || 'default-profile.jpg'}" alt="${suggestion.name}'s profile picture" class="profile-image">
          <div class="profile-details">
            <strong class="resrch_name">Name: </strong> ${suggestion.name}<br>
            <span class="email"><strong>Interest: </strong> ${suggestion.interests}</span>
          </div>
        </div>`;
      listItem.addEventListener('click', function () {
        searchInput.value = suggestion.name;
        displayResults(suggestion);
        resultsContainer.style.display = 'block'; // Show the results container when a suggestion is clicked
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
    if (results.length > 0) {
      displayResults(results[0]); // Assuming we select the first result on Enter key press
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      resultsContainer.style.display = 'none';
    }
  }
});

function displayResults(result) {
  resultsContainer.innerHTML = '';

  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  resultItem.innerHTML = `
    <p><strong>Name:</strong> ${result.name}</p>
    <p><strong>Affiliation:</strong> ${result.affiliation}</p>
    <p><strong>Email:</strong> ${result.email}</p>
    <p><strong>Scholar ID:</strong> ${result.scholar_id}</p>
  `;
  resultsContainer.appendChild(resultItem);

  const approximity = document.createElement('div');
  approximity.className = 'approximity';
  approximity.innerHTML = `
    <p><strong>Approximity Graph:</strong> ${result.name}</p>
  `;
  resultsContainer.appendChild(approximity);

  if (result.publications && result.publications.length > 0) {
    const publicationsContainer = document.createElement('div');
    publicationsContainer.className = 'publications';
    publicationsContainer.innerHTML = '<p><strong>Publications:</strong></p>';
    result.publications.forEach(publication => {
      const publicationItem = document.createElement('div');
      publicationItem.innerHTML = `
        <p><strong>Title:</strong> ${publication.bib.title}</p>
        <p><strong>Year:</strong> ${publication.bib.pub_year}</p>
        <p><strong>Citation:</strong> ${publication.bib.citation}</p>
        <hr>
      `;
      publicationsContainer.appendChild(publicationItem);
    });
    resultsContainer.appendChild(publicationsContainer);
  } else {
    const noPublicationsItem = document.createElement('p');
    noPublicationsItem.textContent = 'No publications found.';
    resultsContainer.appendChild(noPublicationsItem);
  }

  resultsContainer.style.display = 'block'; // Ensure results container is visible
}
