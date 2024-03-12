export const environment = {
  production: false,
  // Minio
  MINIO_ENDPOINT: 'localhost',
  MINIO_PORT: 9000,
  MINIO_ACCESS_KEY: '',
  MINIO_SECRET_KEY: '',
  MINIO_BUCKET_NAME: 'damen',
  // Mongo
  MONGODB_URI:
    'mongodb://super_kolla:G2DJXVQtHp3v2yXlOQ@localhost:27017/burn?authSource=admin&readPreference=primary&ssl=false',
  JWT_TOKEN_SECRET_KEY: 'secretKey',
  TOKEN_EXPIRES_IN: '86400s',
  HOST: 'http://localhost:4200',
};
