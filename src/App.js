import { useState, useEffect } from "react";
import "./App.css";
import validator from "validator";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [stateName, setStateName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [districtId, setDistrictId] = useState();

  useEffect(() => {
    getStates();
  }, []);

  const getStates = async () => {
    const url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json; odata=verbose" },
    });

    const resData = await response.json();

    setStates(resData);
  };

  const getDistricts = async (id) => {
    const url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json; odata=verbose" },
    });

    const resData = await response.json();

    setDistricts(resData);
    setIsSelected(true);
  };

  const handleStatesChange = (e) => {
    setStateName(e.target.value);
    const state_id = states.states.filter(
      (a) => a.state_name === e.target.value
    )[0].state_id;
    getDistricts(state_id);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!validator.isEmail(email)) {
      return alert("Please enter valida Email");
    }

    const url = `https://firestore.googleapis.com/v1/projects/vaccine-notifier-a69d9/databases/(default)/documents/users`;

    const data = {
      fields: {
        email: { stringValue: email },
        phone: { stringValue: "" },
        state: { stringValue: stateName },
        district_id: { integerValue: districtId },
      },
    };

    await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json; odata=verbose" },
      body: JSON.stringify(data),
    });

    setIsSubmitted(true);
  };

  const handleDistrictChange = (e) => {
    const district =
      districts.districts.length &&
      districts.districts.filter((el) => el.district_name === e.target.value);
    const districtId = district.length && district[0]["district_id"];

    setDistrictId(districtId);
  };

  return (
    <div className="App">
      <h2 className="head-style"> Vaccine Notifier </h2>
      <header className="App-header">
        {!isSubmitted && (
          <Form className="col-sm-3 card">
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" onChange={handleStatesChange}>
                {states.states &&
                  states.states.map((el) => <option> {el.state_name} </option>)}
              </Form.Control>
            </Form.Group>
            {isSelected && (
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>District</Form.Label>
                <Form.Control as="select" onChange={handleDistrictChange}>
                  {districts.districts &&
                    districts.districts.map((el) => (
                      <option> {el.district_name} </option>
                    ))}
                </Form.Control>
              </Form.Group>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={handleEmailChange}
                value={email}
              />
              <label className="error">
                {!validator.isEmail(email) && "Please enter valid Email "}
              </label>
            </Form.Group>
            <br />
            <Button variant="secondary" onClick={handleSubmit}>
              Notify Me
            </Button>
          </Form>
        )}

        {isSubmitted && (
          <label>
            Thanks for using this facility! You will be notified once vaccine is
            available in your area.
          </label>
        )}
      </header>
      <footer className="footer">
        Disclaimer: This site uses public APIs provided by cowin. We are not
        responsible for, any damages or any kind of legal issues arising out of
        use, reference to, or reliance on any information contained within this
        website. <br />
        <i> Developed and maintained by : </i>
        {"  "}
        <a href="https://www.linkedin.com/in/isnehalr">
          {" "}
          <strong> Snehal </strong>{" "}
        </a>
      </footer>
    </div>
  );
}

export default App;
