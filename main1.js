// See the two tab delimited files attached:
// products.tab = A list of product names tab delimited with categories
// sales.tab = A list of product names tab delimited with sales amount

// From this data answer two questions:
// 1. What are the top 5 categories by sales
// 2. What is the top product by sales in category 'Candy'

// I added keys at the top of each TAB file so I could have keyed info. 
// there are some problems in formatting of the data, so some values are undefined.

// new rules
// 1. no defined functions
// 2. no top-level variables
// 3. map, reduce, filter, sort
//   1. same level
//   2. once per each

// additional guidelines:
// your function should have one statement,
// that acts upon produceSalesData, not productCategoryData
// return productSalesData[map||filter||reduce]

var fs = require('fs');
var d3 = require('d3');

var productCategoryFileData = fs.readFileSync('products.tab', 'utf8');
var productCategoryData = d3.tsvParse(productCategoryFileData);

var productSalesFileData = fs.readFileSync('sales.tab', 'utf8');
var productSalesData = d3.tsvParse(productSalesFileData);

var combinedData = productSalesData
  .map(function(salesEntry) {  
    productCategoryData.find(function(i) {
      if (i.product === salesEntry.product) {
        salesEntry.category = i.category;
      }
    })      
    salesEntry.sales = parseFloat(salesEntry.sales);
    return salesEntry;
  });

function updateOrAddItem(array, item, prop) {
  var itemMatch = array.find(function(i) {
    return i[prop] === item[prop];
  });

  if (itemMatch) {
    itemMatch.sales += item.sales;
    return array;
  }
  
  array.push({[prop]: item[prop], 'sales': item.sales});
  return array;
}

function getTopSalesCategories(length) {
  return combinedData
    .reduce(function(acc, cur) {
      return updateOrAddItem(acc, cur, 'category');
    }, [])
    .sort(function(a, b) {
      return b.sales - a.sales;
    })
    .slice(0, length);
}

function getTopSellingProductInCategory(category) {
  return combinedData
    .filter(function(salesEntry) {
      return salesEntry.category === category;
    })
    .reduce(function(acc, cur) {
      return updateOrAddItem(acc, cur, 'product');
    }, [])
    .sort(function(a, b) {
      return b.sales - a.sales;
    })[0];
}

console.log(getTopSellingProductInCategory('Candy'));

console.log(getTopSalesCategories(5));