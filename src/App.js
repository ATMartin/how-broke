import { useState } from 'react';
import './App.css';

function App() {
  const DEFAULT_PAGE_LENGTH = 100;

  const [org, setOrg] = useState();
  const [selectedRepo, setSelectedRepo] = useState();
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);

  const handleUpdate = (e) => {
    setOrg(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`[FETCH] Begin repo list for ${org}`);

    let loadingRepos = [], page = 1;

    while (page > -1) {
      console.log(`[SUBFETCH] Fetching page ${page} for ${org}`);
      let json = await fetch(`https://api.github.com/orgs/${org}/repos?page=${page}&per_page=${DEFAULT_PAGE_LENGTH}`)
                       .then((data) => data.json())
                       .catch(console.log);

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

  const handleRepoSelect = async (repo) => {
    console.log(`[FETCH] Begin commit list for ${repo}`);

      console.log(`[SUBFETCH] Fetching first page of commits for ${repo}`);
      let json = await fetch(`https://api.github.com/repos/${org}/${repo}/commits?&per_page=${DEFAULT_PAGE_LENGTH}`)
                       .then((data) => data.json())
                       .catch(console.log);

      setSelectedRepo(repo);
      setCommits(json);
  }

  return (
    <div className="container">
      <h1>How Broke IS it?</h1>
      <div className="col input-org">
        <input onChange={handleUpdate} onBlur={handleSubmit} placeholder="Type your GitHub org name here..." />
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
