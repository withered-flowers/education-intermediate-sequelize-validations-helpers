## Table of Content
1. [Sequelize Validation](#sequelize-validation)
1. [Helpers Method](#helpers-method)
1. [Let's Make the App](#let's-make-the-app)
1. [References](#references)

### Sequelize Validation
Validation adalah sebuah proses dimana kita akan menguji `kebenaran` akan
suatu logic yang kita miliki. 

Dalam konteks web form, artinya kita akan menguji data yang diinput dalam 
suatu form, terhadap logic yang digunakan untuk pengujian konten dari input 
tersebut (level aplikasi)

Dalam konteks per-database-an, artinya kita akan menguji data yang diinput
ke dalam database, terhadap logic yang digunakan untuk pengujian konten dari
input sebelum masuk ke database (level database).

Sequelize sendiri sudah menyediakan juga built-in validator yang dapat digunakan
pada level aplikasi, yang dapat kita definisikan di model yang menggunakan
sequelize.

Cara penggunaannya pun cukup sederhana:

Contoh Kasus:
- Misalnya pada sebuah model bernama `Region`, memiliki 3 data sbb:
    - name
    - alias
    - rulers
- Diketahui bahwa `name` tidak boleh memiliki angka
- Diketahui bahwa `alias` harus dalam bentuk 

```javascript
// file: models/region.js
  Region.init({
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    rulers: DataTypes.STRING
  }
```


### Helpers Method

### Let's Make the App
1. Diketahui ada sebuah aplikasi 


`npx sequelize model:generate --name Region --attributes name:string,alias:string,rulers:string`
- Jangan lupa mengganti async / await

`npx sequelize model:generate --name Mining --attributes name:string,type:string,amount:integer`
- Jangan lupa mengganti async / await

`relation model nya declare`
```javascript
// File: models/region.js
  static associate(models) {
    Region.hasMany(models.Mining);
  }

// File: models/mining.js
  static associate(models) {
    // define association here
    Mining.belongsTo(models.Region);
  }
```

`npx sequelize migration:generate --name add-column-regionid-to-minings`
- Jangan lupa mengganti async / await
```javascript
// File: migrations/<timestamps>-add-column-regionid-to-minings.js
up: (queryInterface, Sequelize) => {
  return queryInterface.addColumn('Minings', 'RegionId', {
    type: Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'Regions'
      },
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
},
down: (queryInterface, Sequelize) => {
  return queryInterface.removeColumn('Minings', 'RegionId');
}
```

`npx sequelize seed:generate --name seed-regions`
- Jangan lupa mengganti async / await
```javascript
// File: seeders/<timestamps>-seed-regions.js
up: (queryInterface, Sequelize) => {
  let dataRegions = require('../data/regions.json');

  dataRegions = dataRegions.map(elem => {
    elem.createdAt = new Date();
    elem.updatedAt = new Date();

    return elem;
  });

  return queryInterface.bulkInsert('Regions', dataRegions, {});
},
down: (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Regions', null, {});
}
```

`npx sequelize seed:generate --name seed-minings`
- Jangan lupa mengganti async / await
```javascript
// File: seeders/<timestamps>-seed-minings.js
up: (queryInterface, Sequelize) => {
  let dataMinings = require('../data/minings.json');

  dataMinings = dataMinings.map(elem => {
    elem.createdAt = new Date();
    elem.updatedAt = new Date();

    return elem;
  });

  return queryInterface.bulkInsert('Minings', dataMinings, {});
},
down: (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Minings', null, {});
}
```

### References