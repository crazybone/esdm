import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControl,
  Button,
  Select,
  MenuItem,
  Grid,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { readFile, saveFile } from './utils/fileUtils'; 

function App() {
  const [data, setData] = useState({ departments: [] });
  const [newDeptName, setNewDeptName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [bannerType, setBannerType] = useState(1);
  const [bannerImages, setBannerImages] = useState(['']);
  const [bannerLinks, setBannerLinks] = useState(['']);
  //const [value, setValue] = useState('');
  // const [isEditingBanner, setIsEditingBanner] = useState(false);
  // const [selectedBanner, setSelectedBanner] = useState(null);
  // const [editDeptName, setEditDeptName] = useState('');
  //const [editSectionName, setEditSectionName] = useState('');

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
                const contentTemplate = generateBannerTemplate(bannerType, bannerImages, bannerLinks);
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

  // const handleEditBanner = (banner) => {
  //   setSelectedBanner(banner);
  //   setBannerImages(banner.content.match(/<img src='(.*?)'/g).map((img) => img.replace(/<img src='|'/g, '')));
  //   setBannerLinks(banner.content.match(/<a href='(.*?)'/g).map((link) => link.replace(/<a href='|'/g, '')));
  //   setIsEditingBanner(true);
  // };

  // const handleSaveBanner = () => {
  //   setData((prevData) => {
  //     const updatedDepartments = prevData.departments.map((dept) => {
  //       return {
  //         ...dept,
  //         sections: dept.sections.map((section) => {
  //           return {
  //             ...section,
  //             banner: section.banner.map((banner) => {
  //               if (banner.bannerid === selectedBanner.bannerid) {
  //                 const contentTemplate = generateBannerTemplate(bannerType, bannerImages, bannerLinks);
  //                 return {
  //                   ...banner,
  //                   content: contentTemplate,
  //                 };
  //               }
  //               return banner;
  //             }),
  //           };
  //         }),
  //       };
  //     });
  //     return { departments: updatedDepartments };
  //   });
  //   setIsEditingBanner(false);
  //   setSelectedBanner(null);
  // };

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

  const handleSaveData = async () => {
    await saveFile('data.json', data);
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>
      {/* <FormControl sx={{ width: '100%'}} variant="standard"> */}
        {data.departments.map((dept) => (
          <Accordion key={dept.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{dept.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {dept.sections.map((section) => (
                <Accordion key={section.id} sx={{ marginTop: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{section.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Select
                      value={bannerType}
                      onChange={(e) => setBannerType(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value={1}>1 Column</MenuItem>
                      <MenuItem value={2}>2 Columns</MenuItem>
                      <MenuItem value={3}>3 Columns</MenuItem>
                    </Select>
                    
                    <Box sx={{ marginTop: 2, maxWidth: '640px', display: 'block' }}>
                      {section.banner.map((b) => (
                        <Box key={b.bannerid} dangerouslySetInnerHTML={{ __html: b.content }}  sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}/>
                      ))}      
                    </Box>

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
                  </AccordionDetails>
                </Accordion>
              ))}
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