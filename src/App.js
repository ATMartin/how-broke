import { useState } from 'react';
import './App.css';

function App() {
  const [org, setOrg] = useState();
  const [repos, setRepos] = useState([]);

  const handleUpdate = (e) => {
    setOrg(e.target.value);
  };

  const handleSubmit = () => {
    const testRepos = [
      { name: "Repo 1", issues_count: "123" },
      { name: "Repo 2", issues_count: "1" },
      { name: "Repo 3", issues_count: "34" },
      { name: "Repo 4", issues_count: "321" },
    ];

    setRepos(testRepos);
  }

  return (
    <div className="App">
      <h1>How Broke IS it?</h1>
      <div className="col input-org">
        <input onChange={handleUpdate} placeholder="Type your GitHub org name here..." />
        <button onClick={handleSubmit}>Go!</button>
      </div>
      <div className="col list-repos">
        <ul>
          {repos.map((repo) => (
            <li>{repo.name} ({repo.issues_count} issues)</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App;
