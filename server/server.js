const app= require('./app');

const PORT = process.env.PORT || 8000;

//server is listening to request coming from the fking app, and sends back response
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});                                           