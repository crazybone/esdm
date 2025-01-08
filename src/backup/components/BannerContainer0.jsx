import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material'; // Import Material-UI components

const BannerContainer = ({ departmentId, sectionId, banners, setData }) => {
  const [bannerType, setBannerType] = useState(1); // 1-column by default
  const [bannerInputs, setBannerInputs] = useState([{ image: '', link: '' }]); // Dynamic inputs

  const handleAddBannerField = () => {
    if (bannerType > 1) {
      setBannerInputs((prev) => [...prev, { image: '', link: '' }]);
    }
  };

  const handleInputChange = (index, field, value) => {
    setBannerInputs((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, [field]: value } : input
      )
    );
  };

  const handleCreateBanner = () => {
    const content = bannerInputs
      .map((input) => `<a href="${input.link}"><img src="${input.image}" /></a>`)
      .join('');

    const newBanner = {
      bannerid: Date.now(),
      type: bannerType,
      name: `${bannerType}-column Banner`,
      content,
    };

    setData((prev) => {
      const updatedDepartments = prev.departments.map((dept) =>
        dept.id === departmentId
          ? {
              ...dept,
              sections: dept.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, banner: [...section.banner, newBanner] }
                  : section
              ),
            }
          : dept
      );
      return { ...prev, departments: updatedDepartments };
    });

    // Reset inputs
    setBannerInputs([{ image: '', link: '' }]);
  };

  return (
    <Box>
      <Typography variant="subtitle1">Banner Type</Typography>
      <TextField sx={{ Width: '120px', margin: '10px 0 6px 0'}}
        select
        value={bannerType}
        onChange={(e) => setBannerType(Number(e.target.value))}
        SelectProps={{ native: true }}
      >
        <option value={1}>1 Column</option>
        <option value={2}>2 Columns</option>
        <option value={3}>3 Columns</option>
      </TextField>

      {bannerInputs.map((input, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
          <TextField
            label={`Image ${index + 1}`}
            value={input.image}
            onChange={(e) =>
              handleInputChange(index, 'image', e.target.value)
            }
          />
          <TextField
            label={`Link ${index + 1}`}
            value={input.link}
            onChange={(e) =>
              handleInputChange(index, 'link', e.target.value)
            }
          />
        </Box>
      ))}

      <Button variant="outlined" sx={{ marginTop: 2 }} onClick={handleAddBannerField}>
        Add More Fields
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleCreateBanner}
      >
        Create Banner
      </Button>

      <Box sx={{ marginTop: 2 }}>
        {banners.map((banner) => (
          <Box key={banner.bannerid}>
            <Typography variant="subtitle2">{banner.name}</Typography>
            <div dangerouslySetInnerHTML={{ __html: banner.content }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BannerContainer;
