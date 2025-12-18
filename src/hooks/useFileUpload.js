import { useRef } from 'react';

export function useFileUpload(onUpload) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    // Reset value to allow re-uploading same file
    if (inputRef.current) {
        inputRef.current.value = '';
    }
  };

  return {
    inputRef,
    handleClick,
    handleChange,
    inputProps: {
      type: 'file',
      ref: inputRef,
      onChange: handleChange,
      style: { display: 'none' },
      multiple: true,
      accept: 'image/png, image/jpeg, image/webp, image/svg+xml'
    }
  };
}
