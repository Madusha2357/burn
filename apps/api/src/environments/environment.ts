export const environment = {
  production: false,
  // Minio
  MINIO_ENDPOINT: 'localhost',
  MINIO_PORT: 9000,
  MINIO_ACCESS_KEY: '',
  MINIO_SECRET_KEY: '',
  MINIO_BUCKET_NAME: 'damen',
  // twilio
  TWILIO_SID: 'AC40a443fcdf96d2be5604690c5621edfa',
  TWILIO_TOKEN: '5264f8409433e2afe2120773afe85ab0',
  TWILIO_VERIFY_SID: 'VA6c12d5ffacd4a51bb3892f9558db89d3',

  // Mongo
  MONGODB_URI:
    'mongodb://super_kolla:G2DJXVQtHp3v2yXlOQ@localhost:27017/burn?authSource=admin&readPreference=primary&ssl=false',
  JWT_TOKEN_SECRET_KEY: 'secretKey',
  TOKEN_EXPIRES_IN: '86400s',
  HOST: 'http://localhost:4200',
};
