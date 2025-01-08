import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Banner from './BannerContainer';

const SectionContainer = ({ section, onSaveSection }) => {
  const [banners, setBanners] = useState(section.banner || []);

  const handleSaveBanner = (updatedBanner) => {
    // Update the specific banner in the banners list
    const updatedBanners = banners.map((b) =>
      b.bannerid === updatedBanner.bannerid ? updatedBanner : b
    );
    setBanners(updatedBanners);

    // Pass the updated banners back to the parent through onSaveSection
    const updatedSection = {
      ...section,
      banner: updatedBanners,
    };
    onSaveSection(updatedSection);
  };

  const handleAddBanner = () => {
    const newBannerId = banners.length + 1; // Generate a new ID
    const newBanner = {
      bannerid: newBannerId,
      type: 1, // Default type (1-column for example)
      name: `New Banner ${newBannerId}`,
      content: '',
    };
    setBanners([...banners, newBanner]);
  };

  return (
    <Box>
      <Typography variant="h6">{section.name}</Typography>

      {banners.map((banner) => (
        <Banner key={banner.bannerid} banner={banner} onSaveBanner={handleSaveBanner} />
      ))}

      <Button onClick={handleAddBanner} variant="contained" color="secondary" style={{ marginTop: '1rem' }}>
        Add New Banner
      </Button>
    </Box>
  );
};

export default SectionContainer;
