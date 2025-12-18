import { v4 as uuidv4 } from 'uuid';

export const createFileObject = (file) => {
  return {
    id: uuidv4(),
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
    type: file.type,
    processed: false,
    processing: false,
    error: null
  };
};

export const loadFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
