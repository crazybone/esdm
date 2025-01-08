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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [currentBannerDeptId, setCurrentBannerDeptId] = useState(null);
  const [currentBannerSectionId, setCurrentBannerSectionId] = useState(null);
  const [newBannerDetails, setNewBannerDetails] = useState({
    type: 1,
    name: '',
    content: '',
    url: '',
  });

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
            sections: [...dept.sections, { id: newSectionId, name: newSectionName, banner: [], selectedBannerType: 1, displayedContent: '' }],
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });
    setNewSectionName('');
  };

  const handleAddBanner = () => {
    if (!currentBannerDeptId || !currentBannerSectionId) return;

    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === currentBannerDeptId) {
          return {
            ...dept,
            sections: dept.sections.map((section) => {
              if (section.id === currentBannerSectionId) {
                const newBannerId = section.banner.length > 0 ? section.banner[section.banner.length - 1].bannerid + 1 : 1;
                return {
                  ...section,
                  banner: [
                    ...section.banner,
                    {
                      bannerid: newBannerId,
                      type: newBannerDetails.type,
                      name: newBannerDetails.name,
                      content: newBannerDetails.content,
                      url: newBannerDetails.url,
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

    setNewBannerDetails({ type: 1, name: '', content: '', url: '' });
    setIsAddDialogOpen(false);
  };

  const handleOpenAddBanner = (deptId, sectionId) => {
    setCurrentBannerDeptId(deptId);
    setCurrentBannerSectionId(sectionId);
    setIsAddDialogOpen(true);
  };

  const handleSaveData = async () => {
    await saveFile('data.json', data);
  };

  const handleToggleDisable = () => {
    setIsDisabled(!isDisabled);
  };

  const handleOpenEditBanner = (deptId, sectionId, banner) => {
    setCurrentBannerDeptId(deptId);
    setCurrentBannerSectionId(sectionId);
    setCurrentBanner(banner);
    setIsDialogOpen(true);
  };

  const handleSaveBanner = () => {
    if (!currentBanner || currentBannerDeptId === null || currentBannerSectionId === null) return;

    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === currentBannerDeptId) {
          return {
            ...dept,
            sections: dept.sections.map((section) => {
              if (section.id === currentBannerSectionId) {
                return {
                  ...section,
                  banner: section.banner.map((b) => (b.bannerid === currentBanner.bannerid ? currentBanner : b)),
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

    setIsDialogOpen(false);
    setCurrentBanner(null);
    setCurrentBannerDeptId(null);
    setCurrentBannerSectionId(null);
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
                  {section.banner.length === 0 ? (
                    <Button
                      sx={{ marginTop: 2 }}
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenAddBanner(dept.id, section.id)}
                    >
                      Add New Banner
                    </Button>
                  ) : (
                    <>
                      <Select
                        id={`bannerSection_${section.id}`}
                        value={section.selectedBannerType || ''}
                        // onChange={(event) => {
                        //   const newType = event.target.value;
                        //   handleBannerTypeChange(dept.id, section.id, newType);
                        // }}
                        fullWidth
                      >
                        {[1, 2, 3].map((type) => (
                          <MenuItem key={type} value={type}>{`${type} Column`}</MenuItem>
                        ))}
                      </Select>

                      {section.displayedContent && (
                        <Box id={`bannerPreview_${section.id}`} container spacing={2} sx={{ marginTop: 2 }}>
                          <Typography>{section.banner.find((b) => b.type === section.selectedBannerType)?.name || 'No Banner Selected'}</Typography>
                          <Box
                            dangerouslySetInnerHTML={{ __html: section.displayedContent }}
                            sx={{ marginTop: 2, maxWidth: '640px', height: '100px', display: 'inline-flex', justifyContent: 'space-between' }}
                          />
                        </Box>
                      )}
                    </>
                  )}
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

      {/* Add New Banner Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Banner</DialogTitle>
        <DialogContent>
          <TextField
            label="Banner Name"
            fullWidth
            margin="normal"
            value={newBannerDetails.name}
            onChange={(e) => setNewBannerDetails({ ...newBannerDetails, name: e.target.value })}
          />
          <Select
            label="Column Type"
            fullWidth
            value={newBannerDetails.type}
            onChange={(e) => setNewBannerDetails({ ...newBannerDetails, type: e.target.value })}
            sx={{ marginBottom: 2 }}
          >
            {[1, 2, 3].map((type) => (
              <MenuItem key={type} value={type}>{`${type} Column`}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Banner Image URL"
            fullWidth
            margin="normal"
            value={newBannerDetails.content}
            onChange={(e) => setNewBannerDetails({ ...newBannerDetails, content: e.target.value })}
          />
          <TextField
            label="Banner URL"
            fullWidth
            margin="normal"
            value={newBannerDetails.url}
            onChange={(e) => setNewBannerDetails({ ...newBannerDetails, url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddBanner} color="primary" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          {currentBanner && (
            <>
              <TextField
                label="Banner Name"
                fullWidth
                margin="normal"
                value={currentBanner.name}
                onChange={(e) => setCurrentBanner({ ...currentBanner, name: e.target.value })}
              />
              <TextField
                label="Banner Image URL"
                fullWidth
                margin="normal"
                value={currentBanner.content}
                onChange={(e) => setCurrentBanner({ ...currentBanner, content: e.target.value })}
              />
              <TextField
                label="Banner URL"
                fullWidth
                margin="normal"
                value={currentBanner.url || ''}
                onChange={(e) => setCurrentBanner({ ...currentBanner, url: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveBanner} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
