const express = require('express');
const app = express();

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const data = [
  {
    "id": 1,
    "name": "Mondsteradt",
    "alias": "City of Freedom",
    "rulers": "Barbara",
    "Minings": [
      {
        "id": 1,
        "name": "Anemoculi",
        "type": "Oculus",
        "amount": 65,
        "RegionId": 1
      },
      {
        "id": 2,
        "name": "Dandelion Seed",
        "type": "Plants",
        "amount": 10,
        "RegionId": 1
      },
      {
        "id": 3,
        "name": "Electric Crystal",
        "type": "Minerals",
        "amount": 21,
        "RegionId": 1
      }
    ]
  },
  {
    "id": 2,
    "name": "Yueli",
    "alias": "City of Harbor",
    "rulers": "Rex Lazuli",
    "Minings": [
      {
        "id": 4,
        "name": "Geoculi",
        "type": "Oculus",
        "amount": 131,
        "RegionId": 2
      },
      {
        "id": 5,
        "name": "Cor Lazuli",
        "type": "Minerals",
        "amount": 53,
        "RegionId": 2
      },
      {
        "id": 6,
        "name": "Jueyun Sambal",
        "type": "Plants",
        "amount": 32,
        "RegionId": 2
      }
    ]
  }
];

app.get('/', (req, res) => {
  res.render('index', {
    dataCombo: data
  });
});

app.get('/minings/add', (req, res) => {
  res.render('add');
});

app.post('/minings/add', (req, res) => {
  
});

app.get('/minings/edit/:id', (req, res) => {

});

app.post('/minings/edit/:id', (req, res) => {

});

app.get('/minings/delete/:id', (req, res) => {

});

app.listen(port, () => {
  console.log(`Application is working at ${port}`);
});