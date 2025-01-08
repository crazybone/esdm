import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionContainer from './SectionContainer';

const DepartmentContainer = ({ department, onSaveDepartment }) => {
  const [sections, setSections] = useState(department.sections || []);

  const handleSaveSection = (updatedSection) => {
    const updatedSections = sections.map((s) =>
      s.id === updatedSection.id ? updatedSection : s
    );
    setSections(updatedSections);

    const updatedDepartment = {
      ...department,
      sections: updatedSections,
    };
    onSaveDepartment(updatedDepartment);
  };

  const handleAddSection = () => {
    const newSectionId = sections.length + 1;
    const newSection = {
      id: newSectionId,
      name: `New Section ${newSectionId}`,
      banner: [],
    };
    setSections([...sections, newSection]);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <TextField
          label="Department Name"
          value={department.name}
          fullWidth
          style={{ marginRight: '1rem' }}
        />
      </AccordionSummary>
      <AccordionDetails>
        {sections.map((section) => (
          <SectionContainer
            key={section.id}
            section={section}
            onSaveSection={handleSaveSection}
          />
        ))}

        <Button onClick={handleAddSection} variant="contained" color="secondary" style={{ marginTop: '1rem' }}>
          Add New Section
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default DepartmentContainer;
