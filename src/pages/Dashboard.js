import React, { useEffect, useRef, useState } from "react";
import backImg from "../images/back.jpg";
import "./Dashboard.css";
import { FaSearch } from "react-icons/fa";
const Dashboard = () => {
  const [donorData, setDonorData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3500/donors");
        const data = await response.json();
        setDonorData(data);
      } catch (err) {
        console.log("error is  : " + err);
      }
    };
    fetchData();
  }, []);

  const handleClick = (id) => {
    setDonorData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isSelected: !item.isSelected }
          : { ...item, isSelected: false }
      )
    );
  };
  const handleSearchValue = (e) =>{
     const {value} = e.target;
     setSearchValue(value)
  }
  useEffect(()=>{
    const filtered = donorData.filter(item => ((item.full_name).toLowerCase().includes(searchValue.toLowerCase())) || ((item.blood_group).toLowerCase().includes(searchValue.toLowerCase())) ||((item.city).toLowerCase().includes(searchValue.toLowerCase())))
    setSearchResults(filtered)
  },[donorData, searchValue])
  return (
    <div className="dashboard" style={{ backgroundImage: `url('${backImg}')` }}>
      <div className="searchbar">
        <input 
        type="text"
        placeholder="Search by name, blood group, city"
        value={searchValue}
        onChange={handleSearchValue}
         />
        <span>
          <FaSearch />
        </span>
      </div>
      <div className="dataDiv">
        {searchResults.map((item) => (
          <div className="donorCard" key={item.id}>
            <div className="donorCardTop" onClick={() => handleClick(item.id)}>
              <span>{item.id}</span>
              <span>|</span>
              <span>{item.full_name}</span>
              <span>|</span>
              <span>{item.gender}</span>
              <span>|</span>
              <span>{item.age}</span>
              <span>|</span>
              <span>{item.blood_group}</span>
              <span>|</span>
              <span>{item.city}</span>
              <span>|</span>
              <span>{item.contact}</span>
              <span>|</span>
              <span>See more</span>
            </div>
            <div
              className={
                item.isSelected ? "donorCardBottom expand" : "donorCardBottom"
              }
            >
              <h3>Personal Details</h3>
              <ul>
                <li>Id : {item.id}</li>
                <li>full name : {item.full_name}</li>
                <li>gender : {item.gender}</li>
                <li>age : {item.age}</li>
                <li>contact : {item.contact}</li>
                <li>email : {item.email}</li>
                <li>city : {item.city}</li>
                <li>state : {item.state}</li>
                <li>country : {item.country}</li>
                <li>pincode : {item.pincode}</li>
                <li>Home address : {item.address}</li>
              </ul>
              <h3>Health and Medical Information</h3>
              <ul>
                <li>Blood group : {item.blood_group}</li>
                <li>last donation : {item.last_donation}</li>
                <li>
                  Chronic disease :{" "}
                  {item.chronicDisease === "true"
                    ? `${item.specifyDisease}`
                    : "No"}
                </li>
                <li>
                  Medication :{" "}
                  {item.medication === "true"
                    ? `${item.specifyMedication}`
                    : "No"}
                </li>
                <li>
                  allergy :{" "}
                  {item.allergy === "true" ? `${item.specifyAllergy}` : "No"}
                </li>
                <li>
                  hospitalised :{" "}
                  {item.hospitalized === "true"
                    ? `${item.specifyHospitalized}`
                    : "No"}
                </li>
                <li>tattoes : {item.tattoes === "true" ? "Yes" : "No"}</li>
                <li>healthy : {item.healthy === "true" ? "Yes" : "No"}</li>
              </ul>
              <h3>Volunteer Consent and Availability</h3>
              <ul>
                <li>Preffered Date : {item.preferredDate}</li>
                <li>Preffered City : {item.location}</li>
                <li>
                  Preffered Day :{" "}
                  {`${item.monday ? "Monday, " : ""}${
                    item.tuesday ? "Tuesday, " : ""
                  }${item.wednesday ? "Wednesday, " : ""}${
                    item.thursday ? "Thursday, " : ""
                  }${item.friday ? "Friday, " : ""}${
                    item.saturday ? "Saturday, " : ""
                  } ${item.sunday ? "Sunday" : ""} `}
                </li>
                <li>Emergency name : {item.emergencyName}</li>
                <li>Emergency contact : {item.emergencyContact}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
