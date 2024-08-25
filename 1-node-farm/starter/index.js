// sys
const http = require('http');
const url = require('url');
const fs = require('fs');

// dep
const slugify = require('slugify');

// local
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);

    // product
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // About
  } else if (pathname === '/about') {
    res.end('About');

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-head': 'hahah',
    });
    res.end('<h1>Page not found.</h2>');
  }
});

server.listen(9527, '0.0.0.0', () => {
  console.log('Server is running on port 9527');
});
