import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const DEFAULT_PAGE_LENGTH = 100;

  const [org, setOrg] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedRepo, setSelectedRepo] = useState();
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    const loadRepos = async () => {
      console.log(`[FETCH] Begin repo list for ${selectedOrg}`);

      let loadingRepos = [], page = 1;
      while (page > -1) {
        console.log(`[SUBFETCH] Fetching page ${page} for ${selectedOrg}`);
        const response = await fetch(`https://api.github.com/orgs/${selectedOrg}/repos?page=${page}&per_page=${DEFAULT_PAGE_LENGTH}`);
        const json = await response.json();

        loadingRepos = loadingRepos.concat(json);

        if (json.length < DEFAULT_PAGE_LENGTH) {
          page = -1;
        } else {
          page++;
        }
      }

      loadingRepos.sort((a, b) => (a.open_issues_count < b.open_issues_count) ? 1 : -1);
      setRepos(loadingRepos);
    };

    if (selectedOrg) { loadRepos(); }
  }, [selectedOrg, setRepos]);

  useEffect(() => {
    const loadCommits = async () => {
      console.log(`[FETCH] Begin commit list for ${selectedRepo}`);
      console.log(`[SUBFETCH] Fetching first page of commits for ${selectedRepo}`);
      const response= await fetch(`https://api.github.com/repos/${selectedOrg}/${selectedRepo}/commits?&per_page=${DEFAULT_PAGE_LENGTH}`);
      const json = await response.json();

      setCommits(json);
    };

    if (selectedRepo) { loadCommits(); }
  }, [selectedRepo, selectedOrg, setCommits]);

  const handleUpdate = (e) => setOrg(e.target.value);
  const handleSubmit = () => setSelectedOrg(org);
  const handleRepoSelect = (repo) => setSelectedRepo(repo);

  return (
    <div className="container">
      <h1>How Broke IS It?</h1>
      <div className="col input-org">
        <input
          type="text"
          onChange={handleUpdate}
          placeholder="Type your GitHub org name here..."
        />
        <button onClick={handleSubmit}>Go!</button>
        <br />
        {repos.length > 0 && (
          <small>Displaying {repos.length} respositories</small>
        )}
      </div>
      {repos.length > 0 && (
        <div className="col list-repos">
            <ul>
              {repos.map((repo) => (
                <li key={repo.id} onClick={() => handleRepoSelect(repo.name)}>
                  {repo.name}: {repo.open_issues_count} 🛠
                </li>
              ))}
            </ul>
        </div>
      )}
      {commits.length > 0 && (
        <div className="col list-commits">
          <ul>
            {commits.map((commit) => (
              <li key={commit.sha}>
               {commit.commit.message} (<a href={commit.url}>{commit.sha.substr(0, 6)}</a>)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App;
