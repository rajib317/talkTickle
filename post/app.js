const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PostRouter = require('./routes/Post.Router');
const createHttpError = require('http-errors');

const dotenv = require('dotenv');
const Post = require('./models/Post.Model');
const verifyAcessToken = require('./helpers/jwtVerify');
dotenv.config();

app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
app.use('/posts', verifyAcessToken, PostRouter);
// app.use('/posts', PostRouter);
// 404
app.use(async (req, res, next) => {
  next(createHttpError.NotFound());
});

// Errror handeler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

Post.sync();
// Post.sync({ alter: true, force: true });

app.listen(port, () => `Server running on port ${port}`);
