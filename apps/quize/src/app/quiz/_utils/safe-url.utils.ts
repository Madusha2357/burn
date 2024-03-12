export function parseVimeo(url: string) {
  console.log(url);

  const re = /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i;
  const matches = re.exec(url);
  console.log('matches', matches);
  return url + '?autoplay=1&showinfo=0&controls=0';
}
