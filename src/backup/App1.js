import React, { useState, useEffect } from "react";

import {
    Button,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DepartmentForm from "./components/DepartmentForm";
import SectionForm from "./components/SectionForm";
import BannerForm from "./components/BannerForm";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  const saveData = async () => {
    const response = await fetch("/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) alert("Data saved successfully!");
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Department Management</h1>
      {data.departments.map((dept, deptIndex) => (
        <DepartmentForm
          key={dept.id}
          department={dept}
          departmentIndex={deptIndex}
          data={data}
          setData={setData}
        />
      ))}
      <button onClick={saveData}>Save Data</button>
    </div>
  );
};

export default App;
