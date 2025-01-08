import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import DepartmentContainer from './components/DepartmentContainer'; // Import top-level component

const loadData = async () => {
  const response = await fetch('./public/data.json'); // Adjust path to JSON file
  const data = await response.json();
  return data;
};

const saveData = async (updatedData) => {
  console.log('Data to be saved:', updatedData);
};

const App = () => {
  const [data, setData] = useState({ departments: [] });

  useEffect(() => {
    loadData().then((fetchedData) => setData(fetchedData));
  }, []);

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4">Department Management</Typography>
      <DepartmentContainer data={data} setData={setData} />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={() => saveData(data)}
      >
        Save Data
      </Button>
    </Box>
  );
};

export default App;
