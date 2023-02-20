import './App.css';
import ContactForm from './ContactForm';

function App() {
  return (
    <div className="App">
      <div class="container-fluid">
        <div class="col-12">
          <h1 class="display-3 text-center welcome-heading">Welcome, Class of 2004</h1>
          <p class="lead welcome-copy">
            Thank you for visiting this website. The purpose of this website is to serve as a class registry that enables us to maintain contact with our fellow alumni. Previously, social media platforms fulfilled this function. However, due to the diversity of platforms and the possibility that some alumni have discontinued their social media usage, we deemed this registry necessary.
          </p>
        </div>
        <hr />
        <div class="col-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;
