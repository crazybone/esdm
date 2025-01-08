import React, { useState } from "react";

const BannerForm = ({ departmentIndex, sectionIndex, data, setData }) => {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([""]);

  const handleAddBanner = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));

    const response = await fetch("/upload", { method: "POST", body: formData });
    const result = await response.json();
    if (result.success) {
      const updatedData = { ...data };
      const content = `
        <td>
          <a href="${links[0]}"><img src="${result.filePath}" /></a>
        </td>
      `;
      updatedData.departments[departmentIndex].sections[sectionIndex].banner.push({
        bannerid: Date.now(),
        type: 1,
        name: "New Banner",
        content,
      });
      setData(updatedData);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
      <input
        type="text"
        placeholder="Link URL"
        value={links[0]}
        onChange={(e) => setLinks([e.target.value])}
      />
      <button onClick={handleAddBanner}>Add Banner</button>
    </div>
  );
};

export default BannerForm;
