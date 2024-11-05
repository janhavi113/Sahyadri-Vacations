import React, { useEffect,useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function Editor(props){
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: [] }],
      [{ background: [] }]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
  ];

  useEffect(() => {
    setValue(props.value);
  }, []);

  const [value, setValue] = useState('');
  const changeValue= async (data) => {
    props.sendDataToParent(value);
  }
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setValue(content);
  };
  return (
    <>
      <ReactQuill theme="snow" modules={modules} formats={formats} value={value} onChange={handleProcedureContentChange} onBlur={changeValue} onKeyUp={changeValue} />
    
    </>
  );
}

export default Editor;
