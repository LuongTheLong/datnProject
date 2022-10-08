const imgToBase64 = (file: File | undefined): Promise<string | null> => {
  return new Promise(resolve => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        return resolve(reader.result as string);
      };
    }

    return resolve(null);
  });
};

export { imgToBase64 };
