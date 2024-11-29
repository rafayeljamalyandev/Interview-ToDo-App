export const VALIDATION_PIPE_OPTIONS = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1d',
  },
};

export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
