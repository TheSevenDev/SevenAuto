export const getFirstImageInContent = (content: string) => {
  if (!content) return '';
  // get first image with src or srcset
  const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*>/g;
  const match = regex.exec(content);
  if (match && match[1]) return match[1];
  const regex2 = /<img[^>]+srcset="?([^"\s]+)"?[^>]*>/g;
  const match2 = regex2.exec(content);
  if (match2 && match2[1]) return match2[1];
  return '';
};
