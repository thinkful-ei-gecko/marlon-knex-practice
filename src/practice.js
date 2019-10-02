'use strict';

require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// const searchTerm = 'holo';
// knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where('name', 'ILIKE', `%${searchTerm}%`)
//   .then(result => {
//     console.log(result);
//   });

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

//searchByProduceName('holo');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    });
}

//paginateProducts(2);

function getProductsWithImage(){
  knexInstance.select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result);
    });
}

//getProductsWithImage();

function mostPopularVideosForDays(days){
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days' ::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      {column: 'region', order: 'ASC'},
      {column: 'views', order: 'DESC'}
    ])
    .then(result => {
      console.log(result);
    });
}

//mostPopularVideosForDays(30);

function grocerySearch(searchTerm){
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(response => {
      console.log(response);
    });
}

// grocerySearch('beef');  

function paginateGroceries(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateGroceries(2);

function groceriesDateAdded(daysAgo){
  knexInstance
    .select('name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days' ::INTERVAL`, daysAgo)
    )
    .then(response => {
      console.log(response);
    });
}

// groceriesDateAdded(5);

function categoryTotalCost(){
  knexInstance
    .select('category')
    .sum('price as totalCost')
    .from('shopping_list')
    .groupBy('category')
    .then(response => {
      console.log(response);
    });
}

categoryTotalCost();