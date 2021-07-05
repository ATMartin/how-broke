import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const DEFAULT_PAGE_LENGTH = 100;

  const [org, setOrg] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedRepo, setSelectedRepo] = useState();
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState({});

  const basicAuth = Buffer.from(`${process.env.REACT_APP_GH_CLIENT_ID}:${process.env.REACT_APP_GH_SECRET}`).toString('base64');
  const fetchOptions = {
    headers: new Headers({ "Authorization": `Basic ${basicAuth}` })
  };

  useEffect(() => {
    const loadRepos = async () => {
      let loadingRepos = [], page = 1;
      while (page > -1) {
        const response = await fetch(`https://api.github.com/orgs/${selectedOrg}/repos?page=${page}&per_page=${DEFAULT_PAGE_LENGTH}`, fetchOptions);
        const json = await response.json();

        if (response.status === 200) {
          loadingRepos = loadingRepos.concat(json);

          if (json.length < DEFAULT_PAGE_LENGTH) {
            page = -1;
          } else {
            page++;
          }

          setErrors([]);
        } else {
          page = -1;
          setErrors([json.message]);
        }
      }

      loadingRepos.sort((a, b) => (a.open_issues_count < b.open_issues_count) ? 1 : -1);

      setRepos(loadingRepos);
    };

    if (selectedOrg) { loadRepos(); }
  }, [selectedOrg, setRepos]);

  useEffect(() => {
    const loadCommits = async () => {
      const response= await fetch(`https://api.github.com/repos/${selectedOrg}/${selectedRepo}/commits?&per_page=${DEFAULT_PAGE_LENGTH}`, fetchOptions);
      const json = await response.json();

      if (response.status === 200) {
        setErrors([]);
        setCommits(json);
      } else {
        setErrors([json.message]);
      }
    };

    if (selectedRepo) { loadCommits(); }
  }, [selectedRepo, selectedOrg, setCommits]);

  const handleUpdate = (e) => setOrg(e.target.value);
  const handleSubmit = () => setSelectedOrg(org);
  const handleRepoSelect = (repo) => setSelectedRepo(repo);

  return (
    <div className="container">
      <div className="header">
        <h1>How Broke IS It?</h1>
        <h4><a href="#" onClick={() => alert("Coming Soon!")}>Log In With GitHub</a></h4>
      </div>
      {errors.length >= 1 && (
        <div className="errors">
          {errors.map((error) => (
            <p><em>{error}</em></p>
          ))}
        </div>
      )}
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
