const mongoose = require('mongoose')
try
{
  mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true,  useUnifiedTopology: true  })
    .then(() => {
      console.log('database connected')
    })
}
catch(error)
{
  console.log(error)
}