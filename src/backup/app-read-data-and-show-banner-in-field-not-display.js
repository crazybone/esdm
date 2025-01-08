import React, { useState } from "react";
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Import the JSON file
import initialData from "./data.json";

const App = () => {
  const [data, setData] = useState(initialData);

  const handleFieldChange = (e, departmentIndex, sectionIndex, bannerIndex, field) => {
    const updatedData = { ...data };
    updatedData.departments[departmentIndex].sections[sectionIndex].banner[bannerIndex][field] =
      e.target.value;
    setData(updatedData);
    console.log ("updatedData: ", updatedData);
  };

  const handleAddBanner = (departmentIndex, sectionIndex, file) => {
    const updatedData = { ...data };
    const fileName = file ? file.name : "default.jpg";
    const bannerTemplate = `
      <td align='center' class='banner-1col'>
        <div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'>
          <a href='#'><img src='/${fileName}' width='100%' alt=''/></a>
        </div>
      </td>`;
    updatedData.departments[departmentIndex].sections[sectionIndex].banner.push({
      bannerid: Date.now(),
      type: 1,
      name: "",
      content: bannerTemplate,
    });
    setData(updatedData);
  };

  const handleAddSection = (departmentIndex) => {
    const updatedData = { ...data };
    updatedData.departments[departmentIndex].sections.push({
      id: Date.now(),
      name: "New Section",
      banner: [],
    });
    setData(updatedData);
  };

  const handleAddDepartment = () => {
    const updatedData = { ...data };
    updatedData.departments.push({
      id: Date.now(),
      name: "New Department",
      sections: [],
    });
    setData(updatedData);
  };

  const handleDepartmentFieldChange = (e, departmentIndex, field) => {
    const updatedData = { ...data };
    updatedData.departments[departmentIndex][field] = e.target.value;
    setData(updatedData);
  };

  const saveData = () => {
    console.log("Updated JSON:", JSON.stringify(data, null, 2));
  };

  return (
    <div>
      {data.departments.map((dept, deptIdx) => (
        <Accordion key={dept.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextField
              label="Department Name"
              value={dept.name}
              onChange={(e) => handleDepartmentFieldChange(e, deptIdx, "name")}
              fullWidth
            />
          </AccordionSummary>
          <AccordionDetails>
            {dept.sections.map((section, secIdx) => (
              <div key={section.id}>
                <TextField
                  label="Section Name"
                  value={section.name}
                  onChange={(e) => handleFieldChange(e, deptIdx, secIdx, null, "name")}
                  fullWidth
                  style={{ marginBottom: "16px" }}
                />
                {section.banner.map((banner, banIdx) => (
                  <div key={banner.bannerid} style={{ marginBottom: "16px" }}>
                    <TextField
                      label="Banner Name"
                      value={banner.name}
                      onChange={(e) =>
                        handleFieldChange(e, deptIdx, secIdx, banIdx, "name")
                      }
                      fullWidth
                      style={{ marginBottom: "8px" }}
                    />
                    <TextField
                      label="Banner Content"
                      value={banner.content}
                      onChange={(e) =>
                        handleFieldChange(e, deptIdx, secIdx, banIdx, "content")
                      }
                      fullWidth
                    />
                  </div>
                ))}
                <Button
                  variant="contained"
                  component="label"
                  color="secondary"
                  style={{ marginBottom: "16px" }}
                >
                  Upload and Add Banner
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleAddBanner(deptIdx, secIdx, e.target.files[0])
                    }
                  />
                </Button>
                <hr />
              </div>
            ))}
            <Button
              onClick={() => handleAddSection(deptIdx)}
              variant="contained"
              color="primary"
              style={{ marginTop: "16px" }}
            >
              Add Section
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        onClick={handleAddDepartment}
        variant="contained"
        color="primary"
        style={{ marginTop: "16px" }}
      >
        Add Department
      </Button>
      <Button
        onClick={saveData}
        variant="contained"
        color="primary"
        style={{ marginTop: "16px" }}
      >
        Save JSON
      </Button>
    </div>
  );
};

export default App;
