import React from "react";
import SectionForm from "./SectionForm";

const DepartmentForm = ({ department, departmentIndex, data, setData }) => {
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      name: "New Section",
      banner: [],
    };
    const updatedData = { ...data };
    updatedData.departments[departmentIndex].sections.push(newSection);
    setData(updatedData);
  };

  return (
    <div>
      <h2>{department.name}</h2>
      {department.sections.map((section, sectionIndex) => (
        <SectionForm
          key={section.id}
          section={section}
          departmentIndex={departmentIndex}
          sectionIndex={sectionIndex}
          data={data}
          setData={setData}
        />
      ))}
      <button onClick={handleAddSection}>Add Section</button>
    </div>
  );
};

export default DepartmentForm;
