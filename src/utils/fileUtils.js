// src/fileUtils.js
export async function readFile(filename) {
  const response = await fetch(filename);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}`);
  }
  return await response.json();
}

export async function saveFile(filename, data) {
  // This function needs to interact with a backend API to save the file.
  // Fetch API does not support saving directly to files.
  console.error("Save functionality requires server-side implementation.");
}
