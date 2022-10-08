const imgToBase64 = (file: File | undefined): Promise<string> => {
  return new Promise(resolve => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      return;
    }

    return resolve("");
  });
};

export { imgToBase64 };
