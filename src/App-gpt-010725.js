import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { readFile, saveFile } from './utils/fileUtils';
import './styles.css';

function App() {
  const [data, setData] = useState({ departments: [] });
  const [newDeptName, setNewDeptName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [bannerImages, setBannerImages] = useState(['']);
  const [bannerLinks, setBannerLinks] = useState(['']);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const jsonData = await readFile('data.json');
      setData((prevData) => {
        const updatedDepartments = jsonData.departments.map((dept) => ({
          ...dept,
          sections: dept.sections.map((section) => ({
            ...section,
            selectedBannerType: section.banner.length > 0 ? section.banner[0].type : null,
            displayedContent: section.banner.length > 0 ? section.banner[0].content : '',
          })),
        }));
        return { departments: updatedDepartments };
      });
    }
    fetchData();
  }, []);

  const handleAddDepartment = () => {
    const newId = data.departments.length > 0 ? data.departments[data.departments.length - 1].id + 1 : 1;
    setData((prevData) => ({
      departments: [...prevData.departments, { id: newId, name: newDeptName, sections: [] }],
    }));
    setNewDeptName('');
  };

  const handleAddSection = (deptId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          const newSectionId = dept.sections.length > 0 ? dept.sections[dept.sections.length - 1].id + 1 : 1;
          return {
            ...dept,
            sections: [...dept.sections, { id: newSectionId, name: newSectionName, banner: [], selectedBannerType: null, displayedContent: '' }],
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });
    setNewSectionName('');
  };

  const handleAddBanner = (deptId, sectionId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            sections: dept.sections.map((section) => {
              if (section.id === sectionId && section.banner.length < 3) {
                const newBannerId = section.banner.length > 0 ? section.banner[section.banner.length - 1].bannerid + 1 : 1;
                return {
                  ...section,
                  banner: [...section.banner, { bannerid: newBannerId, type: section.selectedBannerType, content: section.displayedContent }],
                };
              }
              return section;
            }),
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });
    setBannerImages(['']);
    setBannerLinks(['']);
  };

  const handleBannerTypeChange = (deptId, sectionId, newBannerType) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            sections: dept.sections.map((section) => {
              if (section.id === sectionId) {
                const selectedBanner = section.banner.find((b) => b.type === newBannerType);
                return {
                  ...section,
                  selectedBannerType: newBannerType,
                  displayedContent: selectedBanner ? selectedBanner.content : '',
                };
              }
              return section;
            }),
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });
  };

  const handleSaveData = async () => {
    await saveFile('data.json', data);
  };

  const handleToggleDisable = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>
      {data.departments.map((dept) => (
        <Accordion key={dept.id} sx={{ marginTop: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextField id={dept.name} disabled={!isDisabled} label="Department" sx={{ border: 0 }} defaultValue={dept.name} />
            <IconButton aria-label="edit" size="large" onClick={handleToggleDisable}><EditIcon /></IconButton>
          </AccordionSummary>
          <AccordionDetails>
            {dept.sections.map((section) => (
              <Accordion key={section.id} sx={{ marginTop: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <TextField key={section.name} disabled={!isDisabled} label="Section" sx={{ border: 0 }} defaultValue={section.name} />
                  <IconButton aria-label="edit" size="large" onClick={handleToggleDisable}><EditIcon /></IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  <Select
                    id={`bannerSection_${section.id}`}
                    value={section.selectedBannerType || ''}
                    onChange={(event) => handleBannerTypeChange(dept.id, section.id, event.target.value)}
                    fullWidth
                  >
                    {section.banner.map((b) => (
                      <MenuItem key={b.bannerid} value={b.type}>{`${b.type} Column`}</MenuItem>
                    ))}
                  </Select>

                  {section.displayedContent && (
                    <Box
                      id={`bannerPreview_${section.id}`}
                      dangerouslySetInnerHTML={{ __html: section.displayedContent }}
                      sx={{ marginTop: 2, maxWidth: '640px', height: '100px' }}
                    />
                  )}

                  <Button
                    sx={{ marginTop: 2 }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddBanner(dept.id, section.id)}
                  >
                    Add Banner
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}

            <Accordion sx={{ marginTop: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Add New Section</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="New Section Name"
                  variant="outlined"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  sx={{ marginTop: 2, width: '30%' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddSection(dept.id)}
                  sx={{ marginTop: 2, marginLeft: 2, padding: 2 }}
                >
                  Add
                </Button>
              </AccordionDetails>
            </Accordion>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDepartment}
            sx={{ marginTop: 2 }}
          >
            Add Department
          </Button>
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSaveData}
        sx={{ marginTop: 4 }}
      >
        Save Data
      </Button>
    </Box>
  );
}

export default App;
