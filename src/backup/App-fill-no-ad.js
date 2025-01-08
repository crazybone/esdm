import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { readFile, saveFile } from './utils/fileUtils';
import DepartmentManager from './components/DepartmentManager';

function App() {
  const [data, setData] = useState({ departments: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const jsonData = await readFile('data.json');
        setData(jsonData || { departments: [] }); // Ensure data is properly initialized
      } catch (error) {
        console.error("Error loading JSON file:", error);
        setData({ departments: [] });
      }
    }
    fetchData();
  }, []);

  const handleSaveData = async () => {
    try {
      await saveFile('data.json', data);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving JSON file:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>
      <DepartmentManager data={data} setData={setData} />
      <Button variant="contained" color="primary" onClick={handleSaveData} sx={{ marginTop: 4 }}>
        Save Data
      </Button>
    </Box>
  );
}

export default App;
