'use strict';

const slService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping list service object`, () => {
  let db;
  let testList = [
    {
      id: 1,
      name: 'Test food 1',
      price: '6.99',
      category: 'Lunch',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      name: 'Test food 2',
      price: '3.99',
      category: 'Breakfast',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 3,
      name: 'Test food 3',
      price: '9.99',
      category: 'Main',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
  console.log(process.env.SHOPPING_TEST_DB_URL);
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.SHOPPING_TEST_DB_URL,
    });
  });

  afterEach(() => db('shopping_list').truncate()); 

  after(() => db.destroy());

  before(() => db('shopping_list').truncate());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testList);
    });
    it(`getAllItems() resolves all items from 'shopping_list table`, () => {
      // test that ArticlesService.getAllArticles gets data from the table
      return slService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testList);
        });
    });
    it(`getById() resolves an item with matching id`, () => {
      const testId = 2;
      const testGetByIdItem = testList[testId - 1];

      return slService.getItemById(db, testId)
        .then(actual => {
          expect(actual).to.eql(testGetByIdItem);
        });
    });
    it(`deleteItem() removes an item by id from 'shopping_list'`, () => {
      const testId = 2;
      return slService.deleteItem(db, testId)
        .then(() => slService.getAllItems(db))
        .then(response => {
          const expected = testList.filter(item => item.id !== testId);
          expect(response).to.eql(expected);
        });
    });
    it(`updateItem() finds and updates an item by id`, () => {
      const itemToUpdateId = 2;
      const updateItemData  = {
        name: 'updated',  
        price: '0.00',
        category: 'Main',
        checked: true,
        date_added: new Date()
      };
      return slService.updateItem(db, itemToUpdateId, updateItemData)
        .then(() => slService.getItemById(db, itemToUpdateId))
        .then(response => {
          expect(response).to.eql({
            id: itemToUpdateId,
            ...updateItemData
          });
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it('Resolves an empty array', () => {
      return slService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
    it(`addItem() inserts a new item into 'shopping_list' with an 'id'`, () => {
      const newItem = {
        name: 'NewItem!',
        price: '999.99',
        category: 'Main',
        checked: false,
        date_added: new Date('2029-01-22T16:28:32.615Z')
      };

      return slService.addItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            checked: newItem.checked,
            date_added: newItem.date_added
          });
        });
    });
  });

});