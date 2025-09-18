import React, { useState } from "react";

const CustomForm = ({ initialValues, onFormSubmit, showExtraFields }) => {
  const [formData, setFormData] = useState(initialValues || {
    name: "",
    company: "",
    phone: "",
    email: "",
    numberofpeople: "",
    traveldate: "",
    budgetPerPerson: "",
    preferredLocation: "",
    message: "",
    finalPackage: "",       // 👈 added
    durationoftour: "",     // 👈 added
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onFormSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form
      className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >
      {/* Existing Inputs */}
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-3 rounded-lg"/>
      <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="border p-3 rounded-lg"/>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-3 rounded-lg"/>
      <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-3 rounded-lg"/>
      <input type="number" name="numberofpeople" value={formData.numberofpeople} onChange={handleChange} placeholder="Group Size" className="border p-3 rounded-lg"/>
      <input type="text" name="traveldate" value={formData.traveldate} onChange={handleChange} placeholder="Preferred Date" 
        onFocus={(e) => (e.target.type = "date")} 
        onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} 
        className="border p-3 rounded-lg"/>
      <input type="text" name="budgetPerPerson" value={formData.budgetPerPerson} onChange={handleChange} placeholder="Budget Per Person" className="border p-3 rounded-lg"/>
      <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="Preferred Destination" className="border p-3 rounded-lg"/>

      {/* 👇 Conditional Extra Inputs */}
      {showExtraFields && (
        <>
          <input
            type="text"
            name="finalPackage"
            value={formData.finalPackage}
            onChange={handleChange}
            placeholder="Final Package"
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            name="durationoftour"
            value={formData.durationoftour}
            onChange={handleChange}
            placeholder="Duration of Tour"
            className="border p-3 rounded-lg"
          />
        </>
      )}

      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="border p-3 rounded-lg md:col-span-2"/>
      
      <button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg md:col-span-2 font-semibold">
        Request a Proposal
      </button>
    </form>
  );
};

export default CustomForm;
