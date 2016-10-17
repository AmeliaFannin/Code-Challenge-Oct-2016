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

function getTopSalesCategories(length) {
  return productSalesData.map(function(salesEntry) {  
    for (var i = 0; i < productCategoryData.length; i++) {
      if (productCategoryData[i].product === salesEntry.product) {
        salesEntry.category = productCategoryData[i].category;
        break;
      }
    }
    salesEntry.sales = parseFloat(salesEntry.sales);
    return salesEntry;
  }).reduce(function(acc, cur) {
    if (!acc.find(function(total) {
        if (total.category === cur.category) {
          total.sales += cur.sales;
        }
        return total.category === cur.category;
      })
    ) {
      acc.push({'category': cur.category, 'sales': cur.sales});
    }
    return acc;
  }, [])
  .sort(function(a, b) {
    return a.sales - b.sales;
  })
  .slice(-length);
}

function getTopSellingProducts(category) {
  return productSalesData
    .filter(function(salesEntry) {
      for (var i = 0; i < productCategoryData.length; i++) {
        if (productCategoryData[i].product === salesEntry.product) {
          salesEntry.category = productCategoryData[i].category;
          break;
        }
      }
      salesEntry.sales = parseFloat(salesEntry.sales);
      return salesEntry.category === category;
    })
    .reduce(function(acc, cur) {
      if (!acc.find(function(total){
          if (total.product === cur.product) {
            total.sales += cur.sales;
          }
          return total.product === cur.product;
        })
      ) {
        acc.push({'product': cur.product, 'sales': cur.sales});
      }
      return acc;
    }, [])
    .sort(function(a, b) {
      return a.sales - b.sales;
    })
    .slice(-1);
}

console.log(getTopSellingProducts('Candy'));

console.log(getTopSalesCategories(5));