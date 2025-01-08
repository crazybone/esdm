import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
} from '@mui/material'; // Import all Material-UI components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the expand icon
import styles from './DepartmentContainer.module.css';
import SectionContainer from './SectionContainer'; // Ensure you have SectionContainer defined in the correct path


const DepartmentContainer = ({ data, setData }) => {
  const handleAddDepartment = () => {
    const newDepartment = {
      id: Date.now(),
      name: 'New Department',
      sections: [],
    };
    setData((prev) => ({ ...prev, departments: [...prev.departments, newDepartment] }));
  };

  const handleEditDepartment = (id, newName) => {
    const updatedDepartments = data.departments.map((dept) =>
      dept.id === id ? { ...dept, name: newName } : dept
    );
    console.log('updatedDepartments: ',updatedDepartments);
    setData((prev) => ({ ...prev, departments: updatedDepartments }));
  };

  return (
    <Box>
      {data.departments.map((department) => (
        <Accordion key={department.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextField
              className={styles.deptname}
              label="Department Name"
              variant="outlined"
              value={department.name}
              onChange={(e) => handleEditDepartment(department.id, e.target.value)}
            />
          </AccordionSummary>
          <AccordionDetails>
            <SectionContainer
              departmentId={department.id}
              sections={department.sections}
              setData={setData}
            />
          </AccordionDetails>
        </Accordion>
      ))}
      <Button variant="contained" sx={{ marginTop: 2 }} onClick={handleAddDepartment}>
        Add New Department
      </Button>
    </Box>
  );
};

export default DepartmentContainer;
