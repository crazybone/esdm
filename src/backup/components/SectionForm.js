import React from "react";
import BannerForm from "./BannerForm";

const SectionForm = ({
  section,
  departmentIndex,
  sectionIndex,
  data,
  setData,
}) => {
  return (
    <div>
      <h3>{section.name}</h3>
      {section.banner.map((banner) => (
        <div key={banner.bannerid}>{banner.name}</div>
      ))}
      <BannerForm
        departmentIndex={departmentIndex}
        sectionIndex={sectionIndex}
        data={data}
        setData={setData}
      />
    </div>
  );
};

export default SectionForm;
