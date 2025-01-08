import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionManager from './SectionManager';

function DepartmentManager({ data, setData }) {
  const [newDeptName, setNewDeptName] = useState('');

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) {
      alert("Department name cannot be empty!");
      return;
    }
    const newId = data.departments.length > 0 ? data.departments[data.departments.length - 1].id + 1 : 1;
    setData((prevData) => ({
      ...prevData,
      departments: [...prevData.departments, { id: newId, name: newDeptName, sections: [] }],
    }));
    setNewDeptName('');
  };

  return (
    <>
      {data.departments.map((dept) => (
        <Accordion key={dept.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{dept.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SectionManager dept={dept} setData={setData} />
          </AccordionDetails>
        </Accordion>
      ))}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add New Department</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Department Name"
            variant="outlined"
            fullWidth
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddDepartment} sx={{ marginTop: 2 }}>
            Add Department
          </Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default DepartmentManager;
