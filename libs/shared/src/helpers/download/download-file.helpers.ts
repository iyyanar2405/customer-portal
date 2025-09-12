export const downloadFileFromByteArray = (
  inputArray: number[],
  fileName: string,
  mimeType: string,
) => {
  const uint8Array = new Uint8Array(inputArray);
  const blob = new Blob([uint8Array], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadFileFromBase64 = (
  base64String: string,
  fileName: string,
  mimeType: string,
) => {
  const byteCharacters = atob(base64String);
  const byteArrays = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteArrays], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
