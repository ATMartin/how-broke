import { useState } from 'react';
import './App.css';

function App() {
  const DEFAULT_PAGE_LENGTH = 100;

  const [org, setOrg] = useState();
  const [repos, setRepos] = useState([]);

  const handleUpdate = (e) => {
    setOrg(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`[FETCH] Begin repo list for ${org}`);

    let loadingRepos = [], page = 1;

    while (page > -1) {
      console.log(`[SUBFETCH] Fetching page ${page} for ${org}`);
      let data = await fetch(`https://api.github.com/orgs/${org}/repos?page=${page}&per_page=${DEFAULT_PAGE_LENGTH}`),
          json = await data.json();

      loadingRepos = loadingRepos.concat(json);

      if (json.length < DEFAULT_PAGE_LENGTH) {
        page = -1;
      } else {
        page++;
      }
    }

    loadingRepos.sort((a, b) => (a.open_issues_count < b.open_issues_count) ? 1 : -1);

    setRepos(loadingRepos);
  }

  return (
    <div className="App">
      <h1>How Broke IS it?</h1>
      <div className="col input-org">
        <input onChange={handleUpdate} placeholder="Type your GitHub org name here..." />
        <button onClick={handleSubmit}>Go!</button>
      </div>
      <div className="col list-repos">
        {repos.length > 0 && (
          <>
            <small>Displaying {repos.length} respositories:</small>
            <ul>
              {repos.map((repo) => (
                <li key={repo.id}>{repo.name} ({repo.open_issues_count} issues)</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default App;
