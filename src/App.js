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
    if (selectedRepo.name) { dispatch(loadCommits()); }
  }, [selectedRepo, dispatch]);

  const handleUpdate = (e) => setOrg(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSelectedOrg(org));
  };

  return (
    <div className="container">
      <div className="header">
        <a href="/"><h1>How Broke IS It? 🚒</h1></a>
        <em>
          Scan GitHub orgs for projects with a high need for attention!
          <br />
          Repositories are sorted by number of open issues.
        </em>
      </div>
      {errors.length >= 1 && (
        <div className="errors">
          {errors.map((error) => (
            <p key={error}><em>{error}</em></p>
          ))}
        </div>
      )}
      <div className="col input-org">
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleUpdate}
          placeholder="Type any GitHub org name here..."
        />
        <br />
        <input type="submit" value="Go!" />
        </form>
        <br />
        {repos.length > 0 && (
          <small>Displaying {repos.length} respositories</small>
        )}
      </div>
      {repos.length > 0 && (
        <div className="col list-repos">
            <ul>
              {repos.map(({id, name, open_issues_count}) => (
                <li key={id} className={`repo ${selectedRepo.name === name ? "selected" : ""}`} onClick={() => dispatch(setSelectedRepo(name))}>
                  <div className="title">{name}</div>
                  <div className="score">
                    {open_issues_count > 0 ? `${open_issues_count} 🔥` : "✅" }
                  </div>
                </li>
              ))}
            </ul>
        </div>
      )}
      {commits.length > 0 && (
        <div className="col list-commits">
          <ul>
            {commits.map(({sha, commit, html_url}) => (
              <li key={sha} className="commit">
                <div className="message">{commit.message}</div>
                <div className="date">
                  <small>{new Date(commit.author.date).toLocaleDateString()}</small>
                </div>
                <div className="link">
                  <a href={html_url} target="_blank">
                    <small>{sha.substr(0, 6)} 🔗</small>
                  </a>
                </div>
              </li>
            ))}
            <li className="commit">
              <a href={selectedRepo.html_url} target="_blank">🕵️‍♀️ See all commits at GitHub 🔗</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default App;
