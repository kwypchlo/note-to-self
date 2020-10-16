import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "fontsource-metropolis/all.css";
import { SkynetClient, SkyFile, FileID, User, FileType } from "skynet-js";

const skynetClient = new SkynetClient();
const filename = "note.txt";
const fileID = new FileID("note-to-self", FileType.PublicUnencrypted, filename);

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [noteExists, setNoteExists] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const loadNote = async () => {
    try {
      const user = new User(username, password);
      const skyFile = await skynetClient.getFile(user, fileID);
      const value = await skyFile.file.text();

      setNote(value);
      setNoteExists(true);
    } catch (error) {
      setErrorMessage(error.message);
      setNote("");
    }
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    await loadNote();

    setAuthenticated(true);
    setLoading(false);
  };
  const handleSetNote = async () => {
    setLoading(true);

    const file = new File([note], filename, { type: "text/plain" });
    const skyfile = new SkyFile(file);
    const user = new User(username, password);
    try {
      await skynetClient.setFile(user, fileID, skyfile);
      await loadNote();

      setDisplaySuccess(true);
      setTimeout(() => setDisplaySuccess(false), 5000);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="container">
          <h1>Note To Self</h1>
          {authenticated ? (
            <div>
              {!noteExists && (
                <div className="mb-2">
                  <div className="flex empty-note">
                    You did not set a note yet, write one below.
                  </div>
                </div>
              )}
              <div className="mb-2">
                <div className="flex">
                  <textarea
                    value={note}
                    autoFocus={true}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleSetNote}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Save this note"}
                </button>
                {displaySuccess && (
                  <span className="success-message">
                    Your note has been saved!
                  </span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-2">
                <label htmlFor="input">Login</label>
                <div className="flex">
                  <input
                    id="input"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="output">Password</label>
                <div className="flex">
                  <input
                    id="output"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div>
                  {errorMessage && <p className="error">{errorMessage}</p>}
                </div>
              </div>
              <div className="mb-4">
                <button disabled={loading}>
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
          )}
          <footer>
            Read more on{" "}
            <a
              href="https://github.com/kwypchlo/skydb-example"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </footer>
        </div>
      </header>
    </div>
  );
}

export default App;
