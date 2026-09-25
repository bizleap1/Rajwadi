async function test() {
  const images = [
    '/yellow.jpeg',
    '/brown.jpeg',
    '/pink3.jpeg',
    '/pink5.jpeg',
    '/red.jpeg',
    '/red2.jpeg',
    '/red3.jpeg',
    '/products/Unstiched/Kesari Noor Rajputi Poshak/1.webp',
    '/products/Unstiched/Rajrani Maroon Ivory Poshak/1.webp',
    '/products/Unstiched/Surkh Rajsi Poshak Material/1.webp',
  ];
  for (const img of images) {
    const url = 'http://localhost:3000' + encodeURI(img);
    const res = await fetch(url);
    console.log(img, '=>', res.status, res.statusText);
  }
}
test().then(() => process.exit(0));
