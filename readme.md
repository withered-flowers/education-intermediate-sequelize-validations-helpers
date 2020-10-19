## Table of Content
1. [Sequelize Validation](#sequelize-validation)
1. [Helper's Class](#helpers-class)
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


### Helper's Class


### Let's Make the App
Sekarang mari kita mencoba untuk membuat aplikasi yang akan mengimplementasikan
validasi dan helper's class ini

Requirement dari aplikasi ini adalah:
* Diberikan sebuah database pada `postgresql` dengan nama `development`
* Dengan diberikan sebuah data `data/regions.json` dan `data/minings.json`,
  buatlah tabel dengan nama `Regions` dan `Minings`.
* Tabel `Creators` dan `Videos` akan memiliki kolom yang dapat dilihat pada 
  [Tabel 1](#tabel-1)

* Buatlah sebuah aplikasi web sederhana yang akan memiliki endpoint yang dapat
  dilihat pada [Tabel 2](#tabel-2)

#### Tabel 1

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


* Pada `GET /`, tampilkan sebuah `anchor` mengarah ke `GET /minings/add` dan
  action per baris data untuk mengarah ke `GET /minings/del/:id`
* Pada `GET /minings/add`, tampilkan form untuk memasukkan data dengan ketentuan
  sebagai berikut:
  - Input Text untuk Mining `name`
  - Input Number untuk Mining `amount`
  - Select option untuk Mining `type` yaitu (Oculus, Plants, Minerals)
  - Select option untuk Mining `RegionId` yang akan menampilkan data dari 
    Region `name` dan value Region `id`
* Lakukan juga validasi untuk input yang ada dengan ketentuan sebagai berikut:
  - `name` tidak boleh ada angka
  - `amount` hanya boleh angka dari rentang 1 s.d. 150, dan hanya boleh
     berupa angka yang habis dibagi lima
  - `type` hanya boleh berisi `Oculus` atau `Plants` atau `Minerals`
* Pada `Get /`, modifikasilah tulisan amount dengan menambahkan 2 digit angka 
  decimal di belakang koma dengan menggunakan helper class.

Jadi setelah melihat requirement seperti, apa sajakah yang harus kita lakukan?

### Langkah 1 - Inisialisasi & Install module yang dibutuhkan terlebih dahulu
**Disclaimer**:
Pada pembelajaran kali ini, sudah disediakan `starter-pack`, yang akan
digunakan untuk mempelajari bahan ini, sehingga diharapkan sebelum mempelajari
bahan ini, Anda sudah mengerti pembuatan `views` pada `express` dengan `ejs`
dan `routing endpoint` pada `express`.

Pertama-tama kita harus menginisialisasi folder dan module yang dibutuhkan
dengan cara:
* Melakukan `npm init -y`
* Menginstall module yang dibutuhkan `express`, `ejs`, `pg`, dan `sequelize`
  dengan `npm install express ejs pg sequelize`
* Menginstall module yang dibutuhkan pada saat `development` yaitu `nodemon`
  dan `sequelize-cli` dengan `npm install -D nodemon sequelize-cli`

Maka setelah menjalankan langkah di atas, bentuk folder `starter-pack` 
akan menjadi seperti ini:
```
.
├── controllers
│   └── controller.js
├── data
│   ├── minings.json
│   └── regions.json
├── node_modules
│   └── ...
├── routes
│   └── ...
├── views
│   └── ...
├── .gitignore
├── app.js
├── package.json
└── package-lock.json
```

### Langkah 2 - Inisialisasi dan Konfigurasi sequelize
Selanjutnya setelah kita melakukan inisialisasi dan konfigurasi `sequelize` 
dengan cara:
* Inisialisasi sequelize dengan `npx sequelize-cli init`
* Setelah perintah di atas diketik, maka akan terbentuk folder:
    * `config`, yang digunakan untuk menyimpan konfigurasi database
    * `migrations`, yang digunakan untuk membuat atau mengubah tabel pada 
       database
    * `models`, yang digunakan untuk membuat Model representasi tabel data
    * `seeders`, yang digunakan untuk memasukkan data awal.
* Mengedit file konfigurasi pada `config/config.json` dengan memasukkan 
  credential yang tepat, dan `dialect` yang diubah ke `postgres`
* Setelah melakukan konfigurasi di atas, dengan menggunakan GUI / CLI untuk 
  `postgresql` buatlah database dengan nama `development`. 

### Langkah 3 - Membuat tabel Regions dan Minings
Selanjutnya adalah kita akan membuat model `Region` dengan tabel `Minings` 
dan model `Mining` dengan tabel `Minings` sekaligus dengan menggunakan 
`sequelize`. Caranya adalah dengan:
* Melihat ulang terlebih dahulu struktur tabel yang dibutuhkan, perhatikan 
  bahwa pada struktur tabel memiliki `id`, namun pada saat kita menggunakan
  `sequelize` kita tidak perlu menuliskan hal tersebut, karena akan dibuat
  secara otomatis. 
* Berdasarkan info ini, maka pada tabel `Regions`, yang butuh dibuat adalah
  `name`, `alias`, dan `rulers`.
* Berdasarkan info ini, maka pada tabel `Minings`, yang butuh dibuat adalah
  `name`, `type`, dan `amount`.
* Harus diingat juga ketika membuat model dan tables / migrations, perhatikan
  bahwa nama pada Model = `Singular` dan nama table = `Plurals`.
  `Jangan sampai terbalik yah !`
* Sehingga, berdasarkan data ini, maka yang harus diketik adalah 
  `npx sequelize model:generate --name Region --attributes \
   name:string,alias:string,rulers:string` dan
  `npx sequelize model:generate --name Mining --attributes \
   name:string,type:string,amount:integer`
* Setelah perintah di atas diketik, maka akan terbentuk sebuah file pada 
  folder `models` dan sebuah file pada folder `migrations`, coba lihat file
  pad `models` dan `migrations`  untuk mengetahui lebih lanjut bagaimaan kode
  dibuat.
* Dikarenakan kita di sini masih ingin menggunakan `promise` instead of
  `async / await`, maka kita akan melakukan edit pada file `migrations` yang
  baru dibuat oleh `sequelize`, contoh perubahan untuk mengubah `async / await`
  menjadi `promise`.
* Jangan lupakan untuk seluruh data ditambahkan property `allowNull: false`
  pada file `migrations` yang terbentuk.
* Selanjutnya, kita akan menjalankan perintah untuk membuat tabel ini dengan 
  menjalankan perintah `npx sequelize-cli db:migrate`
* Setelah menjalankan perintah ini, maka dapat dilihat pada postgresql bahwa 
  tabel `Regions` dan `Minings` sudah terbentuk.

### Langkah 4 - Memodifikasi Model untuk mendefinisikan asosiasi
Karena ada relasi satu Region bisa memiliki banyak Mining, maka selanjutnya
kita akan menambahkan sebuah kolom di Mining, dengan nama `RegionId` dan
menyambungkan dengan asosiasinya.

Caranya adalah dengan:
* Membuat file migration baru dengan cara mengetik perintah:
  `npx sequelize migration:generate --name add-column-regionid-to-minings`
* Menambahkan kode untuk menambah kolom `RegionId` pada migration file yang
  dibuat. Kode dapat dilihat di bawah ini.

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

* Selanjutnya, kita akan menambahkan asosiasi pada `models/region.js` dan 
  `models/mining.js`. Kode dapat dilihat di bawah ini.

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

* Selanjutnya, kita akan menjalankan perintah untuk membuat perubahan tabel ini 
  dengan menjalankan perintah `npx sequelize-cli db:migrate`

### Langkah 5 - Membuat seeder
Selanjutnya, setelah tabel terbentuk, kita akan memasukkan data yang kita
miliki dalam `data/regions.json` dan `data/minings.json` menjadi data dalam
tabel kita, oleh karena itu langkah-langkahnya adalah:
* Membuat file seed dengan cara mengetik perintah 
  `npx sequelize-cli seed:generate --name seed-regions` dan
  `npx sequelize-cli seed:generate --name seed-minings`
* Setelah mengetik perintah di atas, maka akan terbentuk file baru dengan nama
  `seeders/<timestamp>-seed-regions.js` dan 
  `seeders/<timestamp>-seed-minings.js`, buka file tersebut dan kita akan 
  mengedit file tersebut. Kode yang akan ditulis dapat dilihat di bawah ini.

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

* Setelah menuliskan kode tersebut, kita akan melakukan *seeding* dengan cara 
  mengetik `npx sequelize db:seed:all`

Sampai dengan tahap ini, artinya kita sudah berhasil mendefinisikan asosiasi
pada `sequelize` dengan baik.

### Langkah 6 - Load the Data
Selanjutnya kita akan membuat kode untuk menampilkan data kombinasi dari
tabel `Regions` dan `Minings` agar dapat ditampilkan pada `GET /`.

Kita akan mencobanya dengan memodifikasi kode yang terdapat pada 
`controllers/controller.js`.

Langkah-langkahnya adalah:
- Comment variabel `dataCombination`
- Tambahkan object `Mining` dan `Region` dengan require `models/index.js`
- Modifikasi method `getRootHandler` sehingga menjadi seperti kode 
  di bawah ini:

```javascript
// File: controllers/controller.js
const { Mining, Region } = require('../models/index.js');
...
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
...
```

### References