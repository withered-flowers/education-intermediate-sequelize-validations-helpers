const { Mining, Region } = require('../models/index.js');

// data dummy untuk testing
// const dataCombination = [
//   {
//     "id": 1,
//     "name": "Mondsteradt",
//     "alias": "City of Freedom",
//     "rulers": "Barbara",
//     "Minings": [
//       {
//         "id": 1,
//         "name": "Anemoculi",
//         "type": "Oculus",
//         "amount": 65,
//         "RegionId": 1
//       },
//       {
//         "id": 2,
//         "name": "Dandelion Seed",
//         "type": "Plants",
//         "amount": 10,
//         "RegionId": 1
//       },
//       {
//         "id": 3,
//         "name": "Electric Crystal",
//         "type": "Minerals",
//         "amount": 21,
//         "RegionId": 1
//       }
//     ]
//   },
//   {
//     "id": 2,
//     "name": "Yueli",
//     "alias": "City of Harbor",
//     "rulers": "Rex Lazuli",
//     "Minings": [
//       {
//         "id": 4,
//         "name": "Geoculi",
//         "type": "Oculus",
//         "amount": 131,
//         "RegionId": 2
//       },
//       {
//         "id": 5,
//         "name": "Cor Lazuli",
//         "type": "Minerals",
//         "amount": 53,
//         "RegionId": 2
//       },
//       {
//         "id": 6,
//         "name": "Jueyun Sambal",
//         "type": "Plants",
//         "amount": 32,
//         "RegionId": 2
//       }
//     ]
//   }
// ];

const dataRegion = [
  {
    "id": 1,
    "name": "Mondsteradt",
    "alias": "City of Freedom",
    "rulers": "Barbara"
  },
  {
    "id": 2,
    "name": "Yueli",
    "alias": "City of Harbor",
    "rulers": "Rex Lazuli"
  }
]

class Controller {
  static getRootHandler(req, res) {
    // Menampilkan halaman index.ejs
    // Membutuhkan data sebagai berikut:
    // dataCombo -> Seluruh data region yang memiliki data mining nya juga.

    Region.findAll({ include: Mining })
      .then(dataCombination => {
        res.render('index', {
          dataCombo: dataCombination
        });
      })
      .catch(err => {
        res.send(err);
      });
  }

  static getMiningsAddHandler(req, res) {
    // Menampilkan halaman add.ejs
    // Membutuhkan data sebagai berikut:
    // dataReg -> Seluruh data region yang ada.

    res.render('add', {
      dataReg: dataRegion
    });
  }

  static postMiningsAddHandler(req, res) {
    // Menerima data dari input form dengan nama
    // req.body.mining_name   => nama dari Mining
    // req.body.mining_amount => jumlah dari Mining
    // req.body.mining_type   => tipe dari Mining (Oculus / Plants / Minerals)
    // req.body.mining_region => RegionId tempat Mining berada

    // bentuk datanya terlebih dahulu
    let objMining = {
      name: req.body.mining_name,
      amount: req.body.mining_amount,
      type: req.body.mining_type,
      RegionId: +req.body.mining_region
    };

    Mining.create(objMining)
      .then(result => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(JSON.stringify(err, null, 2));
        res.send(err);
      });
  }

  static getMiningsDelHandler(req, res) {
    res.send('GET /minings/del/:id');
  }
}

module.exports = Controller;