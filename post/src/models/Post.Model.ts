import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../helpers/sql.connect';

interface PostAttributes {
  id: number;
  description: string | null;
  voice: string | null;
  image: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PostCreateAttributes = Optional<PostAttributes, 'id'>;

class Post
  extends Model<PostAttributes, PostCreateAttributes>
  implements PostAttributes
{
  public id!: number;
  public description!: string | null;
  public voice!: string | null;
  public image!: string | null;
}

Post.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    voice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

export default Post;
