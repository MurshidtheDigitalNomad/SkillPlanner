const express = require('express');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/users/users.routes');
const resourceRoutes = require('./routes/resources/resources.routes');
const roadmapRoutes = require('./routes/roadmaps/roadmap.routes');
const taskRoutes = require('./routes/tasks/task.routes');
const milestoneRoutes = require('./routes/milestoneGoals/milestone.routes');
const postroutes = require('./routes/posts/post.route');
const likeRoutes = require('./routes/likes/like.routes');
const commentRoutes = require('./routes/comments/comment.routes');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/milestone', milestoneRoutes);
app.use('/api/posts', postroutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

module.exports= app;