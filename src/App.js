import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOrg, setSelectedRepo, loadCommits, loadRepos } from "./actions";

import './App.css';

function App() {
  const { commits, errors, repos, selectedOrg, selectedRepo } = useSelector((state) => ({
    commits: state.commits,
    errors: state.errors,
    repos: state.repos,
    selectedOrg: state.selectedOrg,
    selectedRepo: state.selectedRepo
  }));

  const dispatch = useDispatch();
  const [org, setOrg] = useState();

  useEffect(() => {
    if (selectedOrg.length > 0) { dispatch(loadRepos()); }
  }, [selectedOrg, dispatch]);

  useEffect(() => {
    if (selectedRepo.length > 0) { dispatch(loadCommits()); }
  }, [selectedRepo, dispatch]);

  const handleUpdate = (e) => setOrg(e.target.value);
  const handleSubmit = () => dispatch(setSelectedOrg(org));

  return (
    <div className="container">
      <div className="header">
        <h1>How Broke IS It?</h1>
        <h4><a href="#" onClick={() => alert("Coming Soon!")}>Log In With GitHub</a></h4>
      </div>
      {errors.length >= 1 && (
        <div className="errors">
          {errors.map((error) => (
            <p key={error}><em>{error}</em></p>
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
                <li key={repo.id} onClick={() => dispatch(setSelectedRepo(repo.name))}>
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
