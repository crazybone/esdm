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
  Grid,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { readFile, saveFile } from './fileUtils'; // Utility functions for file operations

function App() {
  const [data, setData] = useState({ departments: [] });
  //const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [bannerType, setBannerType] = useState(1);
  const [bannerImages, setBannerImages] = useState(['']);
  const [bannerLinks, setBannerLinks] = useState(['']);

  useEffect(() => {
    async function fetchData() {
      const jsonData = await readFile('data.json');
      setData(jsonData);
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
            sections: [...dept.sections, { id: newSectionId, name: newSectionName, banner: [] }],
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
              if (section.id === sectionId) {
                const newBannerId = section.banner.length > 0 ? section.banner[section.banner.length - 1].bannerid + 1 : 1;
                const contentTemplate = bannerImages
                  .map((image, index) => `<a href='${bannerLinks[index]}'><img src='${image}' width='100%' alt=''/></a>`)
                  .join('');
                return {
                  ...section,
                  banner: [
                    ...section.banner,
                    {
                      bannerid: newBannerId,
                      type: bannerType,
                      name: `Banner Type ${bannerType}`,
                      content: contentTemplate,
                    },
                  ],
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

  const handleSaveData = async () => {
    await saveFile('data.json', data);
  };

  const handleBannerTypeChange = (type) => {
    setBannerType(type);
    setBannerImages(Array(type).fill(''));
    setBannerLinks(Array(type).fill(''));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>

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

      {data.departments.map((dept) => (
        <Accordion key={dept.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{dept.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="New Section Name"
              variant="outlined"
              fullWidth
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddSection(dept.id)}
              sx={{ marginTop: 2 }}
            >
              Add Section
            </Button>

            {dept.sections.map((section) => (
              <Accordion key={section.id} sx={{ marginTop: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{section.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Select
                    value={bannerType}
                    onChange={(e) => handleBannerTypeChange(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={1}>1 Column</MenuItem>
                    <MenuItem value={2}>2 Columns</MenuItem>
                    <MenuItem value={3}>3 Columns</MenuItem>
                  </Select>
                  {bannerImages.map((_, index) => (
                    <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          type="file"
                          fullWidth
                          onChange={(e) => {
                            const files = [...bannerImages];
                            files[index] = e.target.value;
                            setBannerImages(files);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="URL Link"
                          variant="outlined"
                          fullWidth
                          value={bannerLinks[index]}
                          onChange={(e) => {
                            const links = [...bannerLinks];
                            links[index] = e.target.value;
                            setBannerLinks(links);
                          }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddBanner(dept.id, section.id)}
                    sx={{ marginTop: 2 }}
                  >
                    Add Banner
                  </Button>
                  <Box sx={{ marginTop: 2 }}>
                    {section.banner.map((b) => (
                      <Box key={b.bannerid} dangerouslySetInnerHTML={{ __html: b.content }} />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <Button variant="contained" color="secondary" onClick={handleSaveData} sx={{ marginTop: 4 }}>
        Save Data
      </Button>
    </Box>
  );
}

export default App;
