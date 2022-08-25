const mongoose = require('mongoose')
try
{
  mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true,  useUnifiedTopology: true  })
    .then(() => {
      console.log('database connected')
    })
}
catch(error)
{
  console.log(error.message)
}