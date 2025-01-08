import React, { useState } from 'react';
import { Select, MenuItem, TextField, Button, Grid } from '@mui/material';

function BannerManager({ section, setData }) {
  const [bannerType, setBannerType] = useState(1);
  const [bannerImages, setBannerImages] = useState(['']);
  const [bannerLinks, setBannerLinks] = useState(['']);

  const handleAddBanner = () => {
    const newBannerId = section.banner.length > 0 ? section.banner[section.banner.length - 1].bannerid + 1 : 1;
    const contentTemplate = generateBannerTemplate(bannerType, bannerImages, bannerLinks);
    setData((prevData) => {
      const updatedDepartments = prevData.departments.map((dept) => {
        return {
          ...dept,
          sections: dept.sections.map((sec) => {
            if (sec.id === section.id) {
              return {
                ...sec,
                banner: [
                  ...sec.banner,
                  {
                    bannerid: newBannerId,
                    type: bannerType,
                    name: `Banner Type ${bannerType}`,
                    content: contentTemplate,
                  },
                ],
              };
            }
            return sec;
          }),
        };
      });
      return { departments: updatedDepartments };
    });
    setBannerImages(['']);
    setBannerLinks(['']);
  };

  const generateBannerTemplate = (type, images, links) => {
    if (type === 1) {
      return `<td align='center' class='banner-1col'><div class='img-container' style='display:block;width:100%;max-width:640px;height:100%;'><a href='${links[0]}'><img src='${images[0]}' width='100%' alt=''/></a></div></td>`;
    } else if (type === 2) {
      return images.map((img, idx) => `<td align='center' class='banner-2col'><div class='img-container' style='display:block;width:100%;max-width:315px;height:100%;'><a href='${links[idx]}'><img src='${img}' width='100%' alt=''/></a></div></td>`).join('');
    } else if (type === 3) {
      return images.map((img, idx) => `<td align='center' class='banner-3col'><div class='img-container' style='display:block;width:100%;max-width:208px;height:100%;'><a href='${links[idx]}'><img src='${img}' width='100%' alt=''/></a></div></td>`).join('');
    }
    return '';
  };

  return (
    <>
      <Select value={bannerType} onChange={(e) => setBannerType(e.target.value)} fullWidth>
        <MenuItem value={1}>1 Column</MenuItem>
        <MenuItem value={2}>2 Columns</MenuItem>
        <MenuItem value={3}>3 Columns</MenuItem>
      </Select>

      {bannerImages.map((_, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label={`Image ${index + 1}`}
              variant="outlined"
              fullWidth
              value={bannerImages[index]}
              onChange={(e) =>
                setBannerImages((prev) => {
                  const updated = [...prev];
                  updated[index] = e.target.value;
                  return updated;
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={`Link ${index + 1}`}
              variant="outlined"
              fullWidth
              value={bannerLinks[index]}
              onChange={(e) =>
                setBannerLinks((prev) => {
                  const updated = [...prev];
                  updated[index] = e.target.value;
                  return updated;
                })
              }
            />
          </Grid>
        </Grid>
      ))}

      <Button variant="contained" color="primary" onClick={handleAddBanner} sx={{ marginTop: 2 }}>
        Add Banner
      </Button>
    </>
  );
}

export default BannerManager;
