// See the two tab delimited files attached:
// products.tab = A list of product names tab delimited with categories
// sales.tab = A list of product names tab delimited with sales amount
 
// From this data answer two questions:
// 1. What are the top 5 categories by sales
// 2. What is the top product by sales in category 'Candy'
 
// I added keys at the top of each TAB file so I could have keyed info. 
// there are some problems in formatting of the data, so some values are undefined.

var fs = require('fs');
var d3 = require('d3');

var productCategoryFileData = fs.readFileSync('products.tab', 'utf8');
var productCategoryData = d3.tsvParse(productCategoryFileData);

var productSalesFileData = fs.readFileSync('sales.tab', 'utf8');
var productSalesData = d3.tsvParse(productSalesFileData);

function lookUpCategory(product) {
	for (var i = 0; i < productCategoryData.length; i ++) {
		if (productCategoryData[i].product === product) {
			return productCategoryData[i].category;
		}
	}
}

function getTopSalesCategories(length) {
	var salesByCategory = [];
	
  var salesEntries = productSalesData.map(function(entry) {
      return {'category': lookUpCategory(entry.product), 'sales': parseFloat(entry.sales)};
    });

	salesEntries.reduce(function(a, b) {
      return a.concat(b.category);
    }, [])
    .filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })
    .map(function(cat) {
		  var total = salesEntries.filter(function(i) {
			  return i.category === cat;
		  })
      .reduce(function(a, b){
			  return a + b.sales;
		  }, 0);

		salesByCategory.push({'category': cat, 'sales': total});
	});
	
	return salesByCategory.sort(function(a, b) {
      if (a.sales > b.sales) {
        return -1;
      }
      if (a.sales < b.sales) {
        return 1;
      }
      if (a.sales === b.sales) {
        return 0;
      }
    }).slice(0, length);;
}

console.log(getTopSalesCategories(5));