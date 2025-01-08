import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BannerManager from './BannerManager';

function SectionManager({ dept, setData }) {
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      alert("Section name cannot be empty!");
      return;
    }
    const newSectionId = dept.sections.length > 0 ? dept.sections[dept.sections.length - 1].id + 1 : 1;
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((department) => {
        if (department.id === dept.id) {
          return {
            ...department,
            sections: [
              ...department.sections,
              { id: newSectionId, name: newSectionName, banner: [] },
            ],
          };
        }
        console.log('department: ', department);
        return department;
      });
      return { ...prevData, departments: updatedDepartments };
    });
    setNewSectionName('');
  };

  return (
    <>
      {dept.sections.map((section) => (
        <Accordion key={section.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{section.name}</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Edit Section
          </Button>
          </AccordionSummary>
          <AccordionDetails>
            <BannerManager section={section} deptId={dept.id} setData={setData} />
          </AccordionDetails>
        </Accordion>
      ))}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add New Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Section Name"
            variant="outlined"
            fullWidth
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddSection} sx={{ marginTop: 2 }}>
            Add Section
          </Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default SectionManager;
