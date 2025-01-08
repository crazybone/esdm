import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
} from '@mui/material'; // Import Material-UI components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import expand icon
import BannerContainer from './BannerContainer'; // Import BannerContainer

const SectionContainer = ({ departmentId, sections, setData }) => {
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      name: 'New Section',
      banner: [],
    };
    setData((prev) => {
      const updatedDepartments = prev.departments.map((dept) =>
        dept.id === departmentId
          ? { ...dept, sections: [...dept.sections, newSection] }
          : dept
      );
      return { ...prev, departments: updatedDepartments };
    });
  };

  const handleEditSection = (sectionId, newName) => {
    setData((prev) => {
      const updatedDepartments = prev.departments.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              sections: dept.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, name: newName }
                  : section
              ),
            }
          : dept
      );
      return { ...prev, departments: updatedDepartments };
    });
  };

  return (
    <Box>
      {sections.map((section) => (
        <Accordion key={section.id} sx={{padding: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextField
              label="Section Name"
              variant="outlined"
              value={section.name}
              onChange={(e) => handleEditSection(section.id, e.target.value)}
            />
          </AccordionSummary>
          <AccordionDetails>
            <BannerContainer
              departmentId={departmentId}
              sectionId={section.id}
              banners={section.banner}
              setData={setData}
            />
          </AccordionDetails>
        </Accordion>
      ))}
      <Button variant="contained" sx={{ marginTop: 2 }} onClick={handleAddSection}>
        Add New Section
      </Button>
    </Box>
  );
};

export default SectionContainer;
