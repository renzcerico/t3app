module.exports = {
  hrPool: {
    // user: process.env.HR_USER,
    // password: process.env.HR_PASSWORD,
    // connectString: process.env.HR_CONNECTIONSTRING,
    user: 'APPS',
    password: 'PNIRZCH',
    connectString: '//192.168.50.51:1521/PROD',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
};