import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BloodDonationForm.css";
import mainImage from "../images/2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeartbeat,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

const BloodDonationForm = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start from Step 0 (First Page)
  const [snackbar, setSnackbar] = useState({ message: "", show: false });
  const [transition, setTransition] = useState(""); // For animation
  const containrRef = useRef(null)
  const submittedRef = useRef(null)
  // State for form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    gender: "",
    contact: "",
    age: "",
    pincode: "",
    state: "",
    city: "",
    country: "",
    home_address: "",
    last_donation: "",
    blood_group: "",
    chronicDisease: "",
    specifyDisease: "",
    medication: "",
    specifyMedication: "",
    allergy: "",
    specifyAllergy: "",
    hospitalized: "",
    specifyHospitalized: "",
    tattoes: "",
    healthy: "",
    preferredDate: "",
    location: "",
    emergencyName: "",
    emergencyContact: "",
    consent: false,
    isSelected: false
  });

  const handleSnackbar = (message) => {
    setSnackbar({ message, show: true });
    setTimeout(() => setSnackbar({ message: "", show: false }), 3000);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const { full_name, age, gender, contact, email } = formData;
      if (!full_name || !age || !gender || !contact || !email) {
        handleSnackbar("Please complete all fields in Step 1.");
        return false;
      }
      if (parseInt(age) < 18) {
        handleSnackbar("Age must be 18 or older.");
        return false;
      }
    } else if (currentStep === 2) {
      const {
        last_donation,
        chronicDisease,
        specifyDisease,
        medication,
        specifyMedication,
        healthy,
        blood_group,
        allergy,
        specifyAllergy,
        hospitalized,
        specifyHospitalized,
      } = formData;
      if (!last_donation || !chronicDisease || !healthy || !blood_group) {
        handleSnackbar("Please complete all fields in Step 2.");
        return false;
      }
      if (chronicDisease === "Yes" && !specifyDisease) {
        handleSnackbar("Please specify your chronic disease.");
        return false;
      }
      if (medication === "Yes" && !specifyMedication) {
        handleSnackbar("Please specify your medication.");
        return false;
      }
      if (healthy === "No") {
        handleSnackbar("You must be healthy and fit to donate blood.");
        return false;
      }
      if (allergy === "Yes" && !specifyAllergy) {
        handleSnackbar("Please specify your allergy.");
        return false;
      }
      if (hospitalized === "Yes" && !specifyHospitalized) {
        handleSnackbar("Please specify when and why you were hospitalized.");
        return false;
      }
    } else if (currentStep === 3) {
      const {
        preferredDate,
        location,
        emergencyName,
        emergencyContact,
        consent,
      } = formData;
      if (
        !preferredDate ||
        !location ||
        !emergencyName ||
        !emergencyContact ||
        !consent
      ) {
        handleSnackbar("Please complete all fields in Step 3.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 3) {
      setTransition("slide-out-left");
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setTransition("slide-in-right");
      }, 300);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setTransition("slide-out-right");
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setTransition("slide-in-left");
      }, 300);
    }
  };

  const goToStep = (step) => {
    if (step !== currentStep) {
      const direction =
        step > currentStep ? "slide-out-left" : "slide-out-right";
      setTransition(direction);
      setTimeout(() => {
        setCurrentStep(step);
        const inDirection =
          step > currentStep ? "slide-in-right" : "slide-in-left";
        setTransition(inDirection);
      }, 300);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h1 className="text-center text-danger mb-4">
              Be a Hero, Donate Blood!
            </h1>
            <div className="d-flex justify-content-center logos">
              <p className="backCircle text-center">
                <img
                  className="homeImage"
                  src={mainImage}
                  alt="Blood Donation"
                />
              </p>
            </div>
            <p className="text-center mt-4 heading">
              Be a part of our small initiative for change today!
            </p>
            <div className="d-flex justify-content-center mt-4">
              <button className="btn button clickRegister" onClick={nextStep}>
                <span className="box">Register Now!</span>
              </button>
            </div>
            <p className="text-center heading">
              <b>Feel Good Tip:</b> Donate with a buddy — save lives and share
              cookies together! 🍪❤️
            </p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-center text-danger mb-4 headingmain">
              Personal and Contact Information
            </h3>
            <div className="row">
              <div className="col-md-6 mb-3 form-floating">
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
                <label htmlFor="full_name">Full Name</label>
              </div>
              <div className="col-md-6 mb-3 form-floating">
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  placeholder="Age (18+)"
                  value={formData.age}
                  onChange={handleChange}
                />
                <label htmlFor="age">Age (18+)</label>
              </div>
              <div className="heading spacebelow">Gender:</div>
              <div className="col-md-12 mb-3">
                <div className="radio-wrapper">
                  <input
                    className="gender-radio-buttons"
                    id="male"
                    name="gender"
                    type="radio"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  <label className="genderlabel malebutton" htmlFor="male">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 50 90"
                      className="smallsvg malesmallsvg"
                    >
                      <circle
                        strokeWidth={6}
                        stroke="#76E3FE"
                        r={22}
                        cy={25}
                        cx={25}
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#76E3FE"
                        d="M25 47L25 87"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#76E3FE"
                        d="M25 86.6958L38.6958 73"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#76E3FE"
                        d="M11 73L24.6958 86.6958"
                      />
                    </svg>
                    Male
                  </label>
                  <input
                    className="gender-radio-buttons"
                    id="female"
                    name="gender"
                    type="radio"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  <label className="genderlabel femalebutton" htmlFor="female">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 50 90"
                      className="smallsvg"
                    >
                      <circle
                        strokeWidth={6}
                        stroke="#F57CB3"
                        r={22}
                        cy={25}
                        cx={25}
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#F57CB3"
                        d="M25 47L25 87"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#F57CB3"
                        d="M12 73H38"
                      />
                    </svg>
                    Female
                  </label>
                  <input
                    className="gender-radio-buttons"
                    id="other"
                    name="gender"
                    type="radio"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                  />
                  <label className="genderlabel otherbutton" htmlFor="other">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 78 75"
                      className="smallsvg other-gender"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M73.4657 16.6983L48.2159 16.6984L19.9816 58.0001L2.99911 58"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M73.1641 16.698L59.4705 2.99992"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M59.4648 30.696L73.1629 17.0024"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M74.022 57.8121L51.1697 57.8121L19.9997 16.9999L3 17"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M73.748 57.8123L61.3547 71.51"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth={6}
                        stroke="#9B4AED"
                        d="M61.3496 43.8147L73.747 57.5079"
                      />
                    </svg>
                    Other
                  </label>
                </div>
              </div>
              <div className="col-md-6 mb-3 form-floating">
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  className="form-control"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                />
                <label htmlFor="contact">Contact Number</label>
              </div>
              <div className="col-md-6 mb-3 form-floating">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email Address</label>
              </div>
              <div className="col-md-12 mb-3 form-floating displayDisabled">
                <textarea
                  id="address"
                  name="home_address"
                  className="form-control"
                  rows="3"
                  placeholder="Address"
                  value={formData.home_address}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="address">Address</label>
              </div>
              <div className="col-md-6 mb-3 form-floating displayEnabled">
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  className="form-control"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <label htmlFor="pincode">Pincode</label>
              </div>
              <div className="col-md-6 mb-3 form-floating displayEnabled">
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-control"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                />
                <label htmlFor="state">State</label>
              </div>
              <div className="col-md-6 mb-3 form-floating displayEnabled">
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-control"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <label htmlFor="city">City</label>
              </div>
              <div className="col-md-6 mb-3 form-floating displayEnabled">
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-control"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
                <label htmlFor="country">Country</label>
              </div>
              <div className="col-md-12 mb-3 form-floating displayEnabled">
                <textarea
                  id="address"
                  name="address"
                  className="form-control "
                  rows="3"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="address">Home Address</label>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-center text-danger mb-4 headingmain">
              Health and Medical Information
            </h3>
            <div className="row">
              <div className="col-6 mb-3 form-floating">
                <input
                  type="date"
                  id="last_donation"
                  name="last_donation"
                  className="form-control"
                  placeholder="Last Donation Date"
                  value={formData.last_donation}
                  onChange={handleChange}
                />
                <label htmlFor="last_donation">Last Donation Date</label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="blood_group"
                  name="blood_group"
                  className="form-control"
                  value={formData.blood_group}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <label htmlFor="blood_group">Blood Group</label>
              </div>
              <hr></hr>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="chronicDisease"
                  name="chronicDisease"
                  className="form-control"
                  value={formData.chronicDisease}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="chronicDisease">
                  Do you have any chronic diseases?
                </label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <input
                  type="text"
                  id="specifyDisease"
                  name="specifyDisease"
                  className="form-control"
                  placeholder="If Yes, specify disease"
                  value={formData.specifyDisease}
                  onChange={handleChange}
                />
                <label htmlFor="specifyDisease">If Yes, specify disease</label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="medication"
                  name="medication"
                  className="form-control"
                  value={formData.medication}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="medication">
                  Are you currently on medication?
                </label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <input
                  type="text"
                  id="specifyMedication"
                  name="specifyMedication"
                  className="form-control"
                  placeholder="If Yes, specify medication"
                  value={formData.specifyMedication}
                  onChange={handleChange}
                />
                <label htmlFor="specifyMedication">
                  If Yes, specify medication
                </label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="allergy"
                  name="allergy"
                  className="form-control"
                  value={formData.allergy}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="allergy">Do you have any allergies?</label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <input
                  type="text"
                  id="specifyAllergy"
                  name="specifyAllergy"
                  className="form-control"
                  placeholder="If Yes, specify allergy"
                  value={formData.specifyAllergy}
                  onChange={handleChange}
                />
                <label htmlFor="specifyAllergy">If Yes, specify allergy</label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="hospitalized"
                  name="hospitalized"
                  className="form-control"
                  value={formData.hospitalized}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="hospitalized">
                  Have you been hospitalized recently?
                </label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <input
                  type="text"
                  id="specify"
                  name="specifyHospitalized"
                  className="form-control"
                  placeholder="If Yes, specify when and why"
                  value={formData.specifyHospitalized}
                  onChange={handleChange}
                />
                <label htmlFor="specify">If Yes, specify when and why.</label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="healthy"
                  name="healthy"
                  className="form-control"
                  value={formData.healthy}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="healthy">
                  Are you feeling healthy and fit today?
                </label>
              </div>
              <div className="col-6 mb-3 form-floating">
                <select
                  id="tattoes"
                  name="tattoes"
                  className="form-control"
                  value={formData.tattoes}
                  onChange={handleChange}
                >
                  <option value="">Select an Option</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <label htmlFor="tattoes">
                  Do you have any tattoes or piercings?
                </label>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-center text-danger mb-4 headingmain">
              Volunteer Consent and Availability
            </h3>
            <div className="row">
              <div className="col-md-12 mb-3 form-floating">
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  className="form-control"
                  placeholder="Preferred Donation Date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                />
                <label htmlFor="preferredDate">Preferred Donation Date</label>
              </div>
              <div className="col-md-12 mb-3 form-floating">
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  placeholder="Preferred Donation Center Location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <label htmlFor="location">
                  Preferred Donation Center Location
                </label>
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label heading">
                  Preferred choice of days for Blood Donation:
                </label>
                <br></br>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="monday"
                    name="monday"
                    checked={formData.monday}
                    onChange={handleChange}
                  />
                  <label className="form-check-label heading" htmlFor="monday">
                    Monday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="tuesday"
                    name="tuesday"
                    checked={formData.tuesday}
                    onChange={handleChange}
                  />
                  <label className="form-check-label heading" htmlFor="tuesday">
                    Tuesday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="wednesday"
                    name="wednesday"
                    checked={formData.wednesday}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label heading"
                    htmlFor="wednesday"
                  >
                    Wednesday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="thursday"
                    name="thursday"
                    checked={formData.thursday}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label heading"
                    htmlFor="thursday"
                  >
                    Thursday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="friday"
                    name="friday"
                    checked={formData.friday}
                    onChange={handleChange}
                  />
                  <label className="form-check-label heading" htmlFor="friday">
                    Friday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="saturday"
                    name="saturday"
                    checked={formData.saturday}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label heading"
                    htmlFor="saturday"
                  >
                    Saturday
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sunday"
                    name="sunday"
                    checked={formData.sunday}
                    onChange={handleChange}
                  />
                  <label className="form-check-label heading" htmlFor="sunday">
                    Sunday
                  </label>
                </div>
              </div>
              <div className="col-md-12 mb-3 form-floating">
                <input
                  type="text"
                  id="emergencyName"
                  name="emergencyName"
                  className="form-control"
                  placeholder="Emergency Contact Name"
                  value={formData.emergencyName}
                  onChange={handleChange}
                />
                <label htmlFor="emergencyName">Emergency Contact Name</label>
              </div>
              <div className="col-md-12 mb-3 form-floating">
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  className="form-control"
                  placeholder="Emergency Contact Number"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
                <label htmlFor="emergencyContact">
                  Emergency Contact Number
                </label>
              </div>
              <br></br>
              <div className="col-md-12 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <label className="form-check-label heading" htmlFor="consent">
                    I confirm that the above details are correct and I wish to
                    volunteer as a blood donor.
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };
  const [fetchdata, setFetchdata] = useState(null);
  const handlesubmit = async () => {
    try{
        const submission = {
            id: fetchdata.length ? (Number(fetchdata[fetchdata.length - 1].id) + 1).toString() : "1",
            ...formData
        } 
        const response = await fetch("http://localhost:3500/donors", {
            method : "POST",
            headers: {
                "content-type" : 'application/json',
            },
            body: JSON.stringify(submission)
        })
        containrRef.current.style.display = "none";
        submittedRef.current.style.display = "block";
    }
    catch (err) {
        console.log("error : " + err);
      }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3500/donors");
        const data = await response.json();
        setFetchdata(data);
      } catch (err) {
        console.log("error : " + err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-vh-100 mainBody">
      <div className="container" ref={containrRef}>
        {currentStep > 0 && (
          <div className="d-flex justify-content-center mb-4">
            <div
              className={`step-icon ${currentStep === 1 ? "active" : ""}`}
              onClick={() => validateStep() && goToStep(1)}
            >
              <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
            <div
              className={`step-icon ${currentStep === 2 ? "active" : ""}`}
              onClick={() => validateStep() && goToStep(2)}
            >
              <FontAwesomeIcon icon={faHeartbeat} size="2x" />
            </div>
            <div
              className={`step-icon ${currentStep === 3 ? "active" : ""}`}
              onClick={() => validateStep() && goToStep(3)}
            >
              <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
            </div>
          </div>
        )}

        <div className={`form-content ${transition}`}>
          {renderStepContent()}
        </div>

        <div className="d-flex justify-content-between buttons">
          {currentStep > 0 && (
            <button className="btn back" onClick={previousStep}>
              &larr;
            </button>
          )}
          {currentStep > 0 && currentStep < 3 && (
            <button className="btn next" onClick={nextStep}>
              &rarr;
            </button>
          )}
          {currentStep === 3 && (
            <button className="btn submit" onClick={handlesubmit}>
              Submit
            </button>
          )}
        </div>

        {/* Snackbar */}
        {snackbar.show && (
          <div className="alert alert-danger mt-3 text-center">
            {snackbar.message}
          </div>
        )}
      </div>
      <div className="submitted" ref={submittedRef}>
        
      </div>
    </div>
  );
};

export default BloodDonationForm;
