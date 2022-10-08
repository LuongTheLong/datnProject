const slugGenerator = (codeName: string) => {
  codeName = codeName.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  codeName = codeName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  codeName = codeName.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  codeName = codeName.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  codeName = codeName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  codeName = codeName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  codeName = codeName.replace(/đ/g, "d");
  codeName = codeName.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
  codeName = codeName.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
  codeName = codeName.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
  codeName = codeName.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
  codeName = codeName.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
  codeName = codeName.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
  codeName = codeName.replace(/Đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  codeName = codeName.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  codeName = codeName.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  codeName = codeName.replace(/ + /g, " ");
  codeName = codeName.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  codeName = codeName.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  codeName = codeName.toLowerCase().replace(/\s/g, "-");
  return codeName;
};

export { slugGenerator };
