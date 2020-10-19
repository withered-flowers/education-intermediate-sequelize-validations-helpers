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
- Diketahui bahwa `alias` harus dalam bentuk huruf kecil semua

```javascript
// file: models/region.js
  
  // sebelumnya begini
  Region.init({
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    rulers: DataTypes.STRING
  }

  // akan kita ubah menjadi
  Region.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    alias: {
      type: DataTypes.STRING,
      isLowerCase: true
    },
    rulers: DataTypes.STRING
  }
```


### Helpers Method


### Let's Make the App
Mari kita membuat aplikasi yang akan menampilkan data kota dari sebuah 
game dan hasil produksi tiap kota yang ada.

Diketahui tabelnya adalah sebagai berikut:
```
Regions
```

| Kolom              | Tipe         | Deskripsi   |
|:-------------------|:-------------|:------------|
| id                 | SERIAL       | PRIMARY KEY |
| name               | VARCHAR(255) | NOT NULL    |
| alias              | VARCHAR(255) | NOT NULL    |
| rulers             | VARCHAR(255) | NOT NULL    |
| createdAt          | TIMESTAMP    | NOT NULL    |
| updatedAt          | TIMESTAMP    | NOT NULL    |

```
Minings
```

| Kolom              | Tipe         | Deskripsi   |
|:-------------------|:-------------|:------------|
| id                 | SERIAL       | PRIMARY KEY |
| name               | VARCHAR(255) | NOT NULL    |
| type               | VARCHAR(255) | NOT NULL    |
| amount             | INTEGER      | NOT NULL    |
| createdAt          | TIMESTAMP    | NOT NULL    |
| updatedAt          | TIMESTAMP    | NOT NULL    |

#### Tabel 2

| Endpoint            | Deskripsi                                              |
|:--------------------|:-------------------------------------------------------|
| GET /               | Menampilkan Regions(name) dan Minings(name, type, amt) |
| GET /minings/add    | Menampilkan Form untuk menambahkan data Minings        |
| POST /minings/add   | Memproses form untuk penambahan data                   |
| GET /minings/del/:id| Menghapus data Minings berdasar id yang terpilih       |

- Pada `GET /`, tampilkan sebuah `anchor` mengarah ke `GET /minings/add` dan
  action per baris data untuk mengarah ke `GET /minings/del/:id`
- Pada `GET /minings/add`, tampilkan form untuk memasukkan data dengan ketentuan
  sebagai berikut:
  - Input Text untuk Mining `name`
  - Input Number untuk Mining `amount`
  - Select option untuk Mining `type` yaitu (Oculus, Plants, Minerals)
  - Select option untuk Mining `RegionId` yang akan menampilkan data dari 
    Region `name` dan value Region `id`
- Lakukan juga validasi untuk input yang ada dengan ketentuan sebagai berikut:
  - `name` tidak boleh ada angka
  - `amount` hanya boleh angka dari rentang 1 s.d. 150, dan hanya boleh
     berupa angka yang habis dibagi lima
  - `type` hanya boleh berisi `Oculus` atau `Plants` atau `Minerals`

Jadi setelah melihat requirement seperti, apa sajakah yang harus kita lakukan?

### Langkah 1 - Inisialisasi & Install module yang dibutuhkan terlebih dahulu
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