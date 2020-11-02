import React, { useState } from "react";
import { SkynetClient, keyPairFromSeed } from "skynet-js";
import logo from "./logo.svg";
import "./App.css";
import "fontsource-metropolis/all.css";

const skynetClient = new SkynetClient();
const filename = "data.json";

function App() {
  const [secret, setSecret] = useState("");
  const [note, setNote] = useState("");
  const [revision, setRevision] = useState(0);
  const [noteExists, setNoteExists] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const loadNote = async () => {
    try {
      const { publicKey } = keyPairFromSeed(secret);
      const entry = await skynetClient.db.getJSON(publicKey, filename);

      if (entry) {
        setNote(entry.data?.note ?? "");
        setRevision(entry.revision);
        setNoteExists(true);
      }
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

    const { privateKey } = keyPairFromSeed(secret);
    try {
      await skynetClient.db.setJSON(
        privateKey,
        filename,
        { note },
        revision + 1
      );

      setRevision(revision + 1);
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
                  <span className="success-message">Note saved!</span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-2">
                <label htmlFor="output">Secret</label>
                <div className="flex">
                  <input
                    id="output"
                    type="secret"
                    placeholder="Your very secret passphrase"
                    value={secret}
                    onChange={(event) => setSecret(event.target.value)}
                  />
                </div>
                <div>
                  {errorMessage && <p className="error">{errorMessage}</p>}
                </div>
              </div>
              <div className="mb-4">
                <button disabled={loading}>
                  {loading ? "Loading..." : "Load"}
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
