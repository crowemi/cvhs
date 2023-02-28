import './App.css';
import JoinRegistry from './JoinRegistry';

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="col-12">
          <h1 className="display-3 text-center welcome-heading">Welcome, Class of 2004</h1>
          <p className="lead welcome-copy">
            Thank you for visiting this website. The purpose of this website is to serve as a class registry that enables us to maintain contact with our fellow alumni. Previously, social media platforms fulfilled this function. However, due to the diversity of platforms and the possibility that some alumni have discontinued their social media usage, we deemed this registry necessary.
          </p>
        </div>
        <hr />
        <div className="col-12">
          <JoinRegistry />
        </div>
      </div>
    </div>
  );
}

export default App;
