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
  const [bannerType, setBannerType] = useState(null);
  const [bannerImages, setBannerImages] = useState(['']);
  const [bannerLinks, setBannerLinks] = useState(['']);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerContent, setBannerContent] = useState('');
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const bannerLimit = 3;
  // const [editDeptName, setEditDeptName] = useState('');
  //const [editSectionName, setEditSectionName] = useState('');
 
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
              if (section.id === sectionId && section.banner.length < 3) {
                const newBannerId = section.banner.length > 0 ? section.banner[section.banner.length - 1].bannerid + 1 : 1;
                const contentTemplate = generateBannerTemplate(bannerType, bannerImages, bannerLinks);
                return {
                  ...section,
                  banner: [
                    ...section.banner,
                    {
                      bannerid: newBannerId,
                      type: bannerType,
                      name: `${section.name} ${bannerType}`,
                      content: contentTemplate,
                    },
                  ],
                };
              } else {
                let bannerCount = section.banner.find((b) => b.content.length);
                console.log('bannerCount: ', bannerCount);
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

  const generateBannerTemplate = (type, images, links) => {
    console.log('type: ', type);
    if (type === 1) {
      return `<td align='center' class='banner-1col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href='${links[0]}'><img src='${images[0]}' width='100%' alt=''/></a></div></td>`;
    } else if (type === 2) {
      return images.map((img, idx) => `<td align='center' class='banner-2col'><div class='img-container' style='display:block;width:100%;max-width:315px;height:100%;'><a href='${links[idx]}'><img src='${img}' width='100%' alt=''/></a></div></td>`).join('');
    } else if (type === 3) {
      return images.map((img, idx) => `<td align='center' class='banner-3col'><div class='img-container' style='display:block;width:100%;max-width:208px;height:100%;'><a href='${links[idx]}'><img src='${img}' width='100%' alt=''/></a></div></td>`).join('');
    }
    return '';
  };

  const handleDisplayBanner = (deptid, sectid, type) => {
      console.log(['deptid: '+deptid,' sectid: '+sectid, ' type: '+type]);
      setBannerType(type || 1);
    if (data.departments.length > 0) {
      const showThis = data.departments[deptid - 1].sections[sectid - 1].banner[type -1].content;
      return showThis;
    }
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
  

  const checkBannerIsLimit = (banner) => {
    const bannerCount = banner.length;
    if(bannerCount >= 3) return true;
    return false;
  };

  const handleSaveData = async () => {
    await saveFile('data.json', data);
  };

  const [isDisabled, setIsDisabled] = useState(false);
  const handleToggleDisable = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>
      {/* <FormControl sx={{ width: '100%'}} variant="standard"> */}
        {data.departments.map((dept) => (
          <Accordion key={dept.id} sx={{ marginTop: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <TextField id={dept.name} disabled={!isDisabled} label="Department" sx={{border: 0}} defaultValue={dept.name} />
              <IconButton aria-label="edit" size="large" onClick={handleToggleDisable}><EditIcon /></IconButton>
            </AccordionSummary>
            <AccordionDetails>
              {dept.sections.map((section) => (
                <Accordion key={section.id} sx={{ marginTop: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <TextField key={section.name} disabled={!isDisabled} label="Section" sx={{border: 0}} defaultValue={section.name} />
                    <IconButton aria-label="edit" size="large" onClick={handleToggleDisable}><EditIcon /></IconButton>
                  </AccordionSummary>
                  <AccordionDetails key={section.banner}>
                    <Select
                      id={`bannerSection_${section.id}`}
                      value={section.selectedBannerType || ''}
                      onChange={(event) => handleBannerTypeChange(dept.id, section.id, event.target.value)}
                      fullWidth
                    >
                      {section.banner.map((b) => (
                        <MenuItem key={b.bannerid} value={b.type}>
                          {`${b.type} Column`}
                        </MenuItem>
                      ))}
                    </Select>

                    {section.displayedContent && (
                      <Box
                        id={`bannerPreview_${section.id}`}
                        dangerouslySetInnerHTML={{ __html: section.displayedContent }}
                        sx={{ marginTop: 2, maxWidth: '640px', height: '100px', display: 'inline-flex', justifyContent: 'space-between' }}
                      />
                    )}
                    
                    <Button id='editBannerId_' sx={{marginLeft: '20px', display: 'inline',}} variant="contained" color="primary">Edit Banner</Button>

                    {!checkBannerIsLimit(section.banner) && (
                      <Accordion sx={{ marginTop: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Add New Banner</Typography>
                        </AccordionSummary>
                        <AccordionDetails key={section.banner}>
                          <Box id="bannerPanel" container sx={{ marginTop: 0, padding: '20px', backgroundColor: '#f9f9f9' }}>
                          {bannerImages.map((_, index) => (
                            <Box container spacing={2} sx={{ marginTop: 2}}>
                              <Box item xs={6}>
                                <TextField
                                sx={{ marginBottom: '20px', width: '50%' }}
                                  type="file"
                                  fullWidth
                                  onChange={(e) => {
                                    const files = [...bannerImages];
                                    files[index] = e.target.value;
                                    setBannerImages(files);
                                  }}
                                />
                                <TextField
                                sx={{ marginBottom: '20px', width: '50%' }}
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
                              </Box>
                            </Box>
                          ))}
                        
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddBanner(dept.id, section.id)}
                            sx={{ marginTop: 2 }}
                          >
                            Add Banner
                          </Button>                        
                        </Box>
                        </AccordionDetails>
                      </Accordion>                      
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
                    sx={{ marginTop: 2, marginLeft: 2,padding: 2 }}
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
            <Button variant="contained" color="primary" onClick={handleAddDepartment} sx={{ marginTop: 2 }}>
              Add Department
            </Button>
          </AccordionDetails>
        </Accordion>

        <Button variant="contained" color="secondary" onClick={handleSaveData} sx={{ marginTop: 4 }}>
          Save Data
        </Button>
      {/* </FormControl> */}
    </Box>
  );
}

export default App;