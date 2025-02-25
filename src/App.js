import React, { useState, useEffect } from 'react';
// import FileUploader from './components/FileUploader';
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
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/AddCircleSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css';

function App() {
  const [data, setData] = useState({ departments: [] });  
  const [newDeptName, setNewDeptName] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [currentBannerDeptId, setCurrentBannerDeptId] = useState(null);
  const [currentBannerSectionId, setCurrentBannerSectionId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [addSectDialogOpen, setAddSectDialogOpen] = useState(false);
  const [newBannerDetails, setNewBannerDetails] = useState({
    type: 1,
    name: '',
    images: [''],
    links: [''],
    content: ''
  });
  const [departmentsField, setDepartmentsField] = useState([]);
  const [templatesBanner, setTemplatesBanner] = useState(['']);

  const getData=()=>{
    fetch('db.json',
    {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    )
      .then(function(response){
        //console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        //console.log(myJson);
        setData(myJson)
      });
  }

  useEffect(() => {
    getData();
    setTemplatesBanner(handleGetTemplates);
  }, []);

  const handleGetTemplates = () => {    
    const getTemplate = [
      "<td align='center' class='banner-1col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link1><img src=@img1 alt='Banner Image' /></a></div></td>",
      "<td align='center' class='banner-2col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link1><img src=@img1 alt='Banner Image' /></a></div></td><td align='center' class='banner-2col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link2><img src=@img2 alt='Banner Image' /></a></div></td>",
      "<td align='center' class='banner-3col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link1><img src=@img1 alt='Banner Image' /></a></div></td><td align='center' class='banner-3col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link2><img src=@img2 alt='Banner Image' /></a></div></td><td align='center' class='banner-3col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href=@link3><img src=@img3 alt='Banner Image' /></a></div></td>"
    ];
    //console.log('banner template: ', getTemplate);
    //return setTemplatesBanner(getTemplate);
    return getTemplate;
  }

  const handleAddDepartment = () => {
    const deptLength = data.departments.length;
    const newId = (deptLength + 1).toString();
    //const newId = data.departments.length > 0 ? data.departments[data.departments.length - 1].id + 1 : 1;
    setData((prevData) => ({
      departments: [...prevData.departments, { id: newId, departmentname: newDeptName, banners: [] }],
    }));
    handleSaveNewDepartment({ id: newId, departmentname: newDeptName, banners: [] });
    setNewDeptName('');
  };  

  const handleAddSection = (deptId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {        
        if (dept.id === deptId) {
          const bannerCount = dept.banners.length;
          const lastBannerItem = dept.banners[bannerCount - 1].bannerid;
          console.log('handleAddSection > lastBannerItem : ', lastBannerItem);
          return {
            ...dept,
            banners: [
              ...dept.banners,
              {
                bannerid: (lastBannerItem + 1),
                type: newBannerDetails.type,
                name: newBannerDetails.name,
                content: bannerFactory(newBannerDetails),
                images: newBannerDetails.images,
                links: newBannerDetails.links,
              },
            ],
          };
        }       
        return dept;
      });
      handleSaveNewBanner(updatedDepartments[deptId - 1], deptId); //
      return { departments: updatedDepartments };
    });
    //setNewBannerName('');
    setNewBannerDetails({ type: 1, name: '', images: [''], links: [''] });
    setAddSectDialogOpen(false);
  };
  const handleAddBanner = (deptId, sectionId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            banners: dept.banners.map((banner) => {
              console.log('banner.id: ', banner.id, 'sectionId: ', sectionId);
              if (banner.id === sectionId && banner.length < 3) {
                const newBannerId = banner.length > 0 ? banner[banner.length - 1].bannerid + 1 : 1;
                return {
                  ...banner,
                  //banner: [...banner, { bannerid: newBannerId, type: banner.selectedBannerType, content: banner.displayedContent }],
                  banner: [...banner, { bannerid: newBannerId, type: banner.selectedBannerType, content: '', images: [''], links: [''] }],
                };
              }
              return banner;
            }),
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });
    // setBannerImages(['']);
    // setBannerLinks(['']);
  };

  const handleToggleDisable = (deptId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            disabled: !isDisabled,
          };
        }
        document.getElementById('department_'+dept.id).attr(':disabled');
        return dept;
      });
      return { departments: updatedDepartments };
    });
  };
  
  const bannerFactory = (bannerDetail) => {
    let bannertemplate = templatesBanner[bannerDetail.type - 1];
    let bannerContent = '';
    let len = bannerDetail.images.length;
    let i;

    for(i=0; i < len; i++) {  
      let tx = '@img'+(i+1);
      let lx = '@link'+(i+1);
      bannertemplate = bannertemplate.replace(tx, bannerDetail.images[i]);
      bannertemplate = bannertemplate.replace(lx, bannerDetail.links[i]);
    }
    bannerContent = bannertemplate;
    //console.log('bannerFactory > bannerContent: ', bannerContent);
    return bannerContent;
  };

  const handleOpenEditBanner = (deptId, sectionId, banner) => {
    setCurrentBannerDeptId(deptId);
    setCurrentBannerSectionId(sectionId);
    setCurrentBanner(banner);
    setIsDialogOpen(true);//edit    
    //console.log('edit banner: ', banner.content);
  };

  const handleOpenAddSection = (deptId) => {
    setCurrentBannerDeptId(deptId);
    setAddSectDialogOpen(true);//Add section
  };

  const handleEditBanner = () => {
    if (!currentBanner || currentBannerDeptId === null || currentBannerSectionId === null) return; 
    const updatedBanner = { ...currentBanner, content: bannerFactory(currentBanner) };
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === currentBannerDeptId) {
          return {
            ...dept,
            banners: dept.banners.map((banner) => {
              if (banner.bannerid === currentBannerSectionId) {
                return updatedBanner;
              }
              return banner;
            }),
          };
        }
        return dept;
      });

      handleSaveEditBanner(updatedBanner, currentBannerDeptId, currentBannerSectionId);
      return { departments: updatedDepartments };
    });

    setIsDialogOpen(false);
    setCurrentBanner(null);
    setCurrentBannerDeptId(null);
    setCurrentBannerSectionId(null);
  };

  const handleDeleteBanner = async (deptId, sectionId) => {
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            banners: dept.banners.filter((banner) => banner.bannerid !== sectionId),
          };
        }
        return dept;
      });
      return { departments: updatedDepartments };
    });

    try {
      const response = await fetch(`http://localhost:3005/departments/${deptId}`);
      if (!response.ok) throw new Error("Failed to fetch department data.");
      const department = await response.json();
      const updatedBanners = department.banners.filter(banner => banner.bannerid !== sectionId);

      await fetch(`http://localhost:3005/departments/${deptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banners: updatedBanners }),
      });

      console.log(`Banner with ID ${sectionId} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleSaveEditBanner = async (newbanner, deptid, bannerId) => {
    try {
      const response = await fetch(`http://localhost:3005/departments/${deptid}`);
      if (!response.ok) throw new Error("Failed to fetch department data.");
      const department = await response.json();
      const updatedBanners = department.banners.map(banner =>
        banner.bannerid === bannerId
          ? { ...banner, ...newbanner } 
          : banner
      );
  
      await fetch(`http://localhost:3005/departments/${deptid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banners: updatedBanners }),
      });
  
      console.log(`Banner with ID ${bannerId} updated successfully!`);
    } catch (error) {
      console.error("Error editing banner:", error);
    }
  };

  const handleSaveNewBanner = async (newData, deptId) => {
    const pointer = 'http://localhost:3005/departments/' + (deptId);
    try {
      const response = await fetch(pointer, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Data saved successfully:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleSaveNewDepartment = async (newDeptName) => {
    try {
      const response = await fetch('http://localhost:3005/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeptName),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Data saved successfully:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  return (
    <Box className="split form-container" sx={{ maxWidth: '1000px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Email Signature Data Management
      </Typography>
      {/* <Box className="container" spacing={2} sx={{width: '100%', maxWidth: '936px', padding: '0 20px'}}>
        <Typography variant="h6" gutterBottom>
          Countries
        </Typography>
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Add New Department</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Country Name"
              variant="outlined"
              sx={{fontSize: '2.2rem'}}
              fullWidth
              value={newDeptName}
              //onChange={(e) => setNewDeptName(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>
      </Box> */}
      <Box className="container" spacing={2} sx={{width: '100%', maxWidth: '936px', padding: '0 20px'}}>
        <Typography variant="h6" gutterBottom sx={{ padding: '20px 0'}}>
          Banners
        </Typography>
        {data.departments.map((dept) => (        
          <Accordion key={dept.id} sx={{ marginTop: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>          
              <TextField disabled={!isDisabled} id={`department_${dept.id}`} label={`department ${dept.id}`} sx={{ border: 0 }} defaultValue={dept.departmentname} />
              {/* <IconButton aria-label="edit" size="large"  sx={{ width: '40px', height: '40px' }} 
              onClick={() => handleToggleDisable(dept.id)}>
                <EditIcon sx={{ width: '20px', height: '20px' }} />
              </IconButton> */}
            </AccordionSummary>
            <AccordionDetails>
              {dept.banners.map((banner) => (
                <Accordion key={banner.bannerid} sx={{ marginTop: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>                 
                    <Typography variant="button" >{banner.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{margin: '0', padding: '5px'}}>
                    <Box className="container" spacing={2} sx={{width: '100%', maxWidth: '936px', padding: '0 20px'}}>
                        <Box key={banner.name} sx={{marginBottom: 2, maxWidth: '94%', border: '1px solid #ddd', padding: 2 }}>
                          <Box
                            dangerouslySetInnerHTML={{ __html: banner.content }}
                            sx={{ marginTop: 2, maxWidth: '640px', height: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                          />
                        
                          <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditBanner(dept.id, banner.bannerid, banner)}><EditIcon /></IconButton>
                          <IconButton color="primary" aria-label="delete" onClick={() => handleDeleteBanner(dept.id, banner.bannerid)}><DeleteIcon /></IconButton>                       
                        
                        </Box>
                        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                              <Typography>Are you sure you want to delete this banner?</Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                              <Button onClick={() => handleDeleteBanner(dept.id, banner.bannerid)} color="primary" variant="contained">Delete</Button>
                            </DialogActions>
                          </Dialog>
                        {/* <div>
                          <FileUploader />
                        </div> */}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
              {dept.id > "1" &&            
              <IconButton color="primary" aria-label="edit" onClick={() => handleOpenAddSection(dept.id)}><AddIcon /></IconButton>
              }
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
              sx={{fontSize: '2.2rem'}}
              fullWidth
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDepartment}
              sx={{ marginTop: 2 }}
            >Add Department</Button>
          </AccordionDetails>
        </Accordion>      

        {/* Edit Banner Dialog */}      
        <Dialog maxWidth="sm" open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
                <Box key={currentBanner.bannerid} sx={{ display: 'flex', gap: 2, marginBottom: 2 }} >  
                  <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>       
                    {currentBanner.images.map((image, index) => (
                      <TextField
                        key={`image-${index}`}
                        label={`Image Column ${index + 1}`}
                        margin="normal"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...currentBanner.images];
                          newImages[index] = e.target.value;
                          setCurrentBanner({ ...currentBanner, images: newImages });
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ width: '50%',display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
                    {currentBanner.links.map((link, index) => (
                      <TextField
                        key={`link-${index}`}
                        label={`Link Column ${index + 1}`}
                        margin="normal"
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...currentBanner.links];
                          newLinks[index] = e.target.value;
                          setCurrentBanner({ ...currentBanner, links: newLinks });
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditBanner} color="primary" variant="contained">Update Banner</Button>
          </DialogActions>
        </Dialog>

        {/* Add New Banner Dialog */}
        <Dialog open={addSectDialogOpen} onClose={() => setAddSectDialogOpen(false)}>
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
            {Array.from({ length: newBannerDetails.type }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                <TextField
                  label={`Image URL ${index + 1}`}
                  value={newBannerDetails.images[index] || ''}
                  onChange={(e) => {
                    const newImages = [...newBannerDetails.images];
                    newImages[index] = e.target.value;
                    setNewBannerDetails((prev) => ({ ...prev, images: newImages }));
                  }}
                />
                <TextField
                  label={`Link URL ${index + 1}`}
                  value={newBannerDetails.links[index] || ''}
                  onChange={(e) => {
                    const newLinks = [...newBannerDetails.links];
                    newLinks[index] = e.target.value;
                    setNewBannerDetails((prev) => ({ ...prev, links: newLinks }));
                  }}
                />
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddSectDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleAddSection(currentBannerDeptId)} color="primary" variant="contained">Add this Banner</Button>
          </DialogActions>
        </Dialog>
      </Box>    
    </Box>
  );
}

export default App;
