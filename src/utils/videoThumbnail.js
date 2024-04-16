export const convertThumbnail = (url) => {
  if (url) return `${import.meta.env.VITE_API_URL}/static${url}`;
  else return undefined;
};
