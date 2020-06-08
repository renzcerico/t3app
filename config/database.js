module.exports = {
  hrPool: {
    // user: process.env.HR_USER,
    // password: process.env.HR_PASSWORD,
    // connectString: process.env.HR_CONNECTIONSTRING,
    user: 't3',
    password: 'oracle',
    connectString: '//localhost:1521/xe',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
};