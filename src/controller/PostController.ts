import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class CommentController {
    static comment = async (req: Request, res: Response) => {
        try {
            const { idPost } = req.params;
            const idUser = (req as any).userId;
            const postId = parseInt(idPost, 10);  // Conversion de l'ID du post en nombre
            const { comment } = req.body;
    
            const user = await prisma.user.findUnique({ where: { id: idUser } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
    
            const post = await prisma.post.findUnique({ where: { id: postId }, include: { comments: true } });
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
    
            const newComment = {
                idUser: user.id,
                content: comment,
                idPost: post.id
            };
    
            await prisma.comment.create({ data: newComment });
    
            res.status(200).json({ message: "Post commented successfully", data: post, status: 200 });
        } catch (error: any) {  // Cast de 'error' en 'any'
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    }
    

  static deleteComment = async (req: Request, res: Response) => {
    try {
      const { idComment, idPost } = req.params;
      const idUser = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: idUser }
      });

      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });

      const post = await prisma.post.findUnique({
        where: { id: Number(idPost) },
        include: { comments: true }
      });

      if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });

      const comment = await prisma.comment.findUnique({
        where: { id: Number(idComment) }
      });

      if (!comment || comment.idPost !== post.id) {
        return res.status(404).json({ message: "Comment not found", data: null, status: 404 });
      }

      await prisma.comment.delete({
        where: { id: Number(idComment) }
      });

      res.status(200).json({ message: "Comment deleted successfully", data: comment, status: 200 });
    } catch (error: any) {  // Cast de 'error' en 'any'
        res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
    }
  }
}
