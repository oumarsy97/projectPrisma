import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { report } from "process";
import upload from '../config/multerConfig.js';
import { da } from "@faker-js/faker";

const prisma = new PrismaClient();

export default class ShareController {
//share
   static createShare = async (req: Request, res: Response) => {
       try {
        const userId = req.params.userId
        const fromId = req.body.fromId
        const idPost = req.body.idPost
        const user = await prisma.user.findUnique({
            where: {
                id: Number(fromId)
            }
        })
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(idPost)
            }
        })
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const share = await prisma.share.create({
               data: {
                   fromUserId: Number(userId),
                   toUserId: Number(fromId),
                   idPost: Number(idPost),
               },
           });
           res.json(share);
       } catch (error: any) {
           res.status(500).json({
               message: "Internal server error",
               error: error.message,
           });
       }
   }

   static getSharedMe = async (req: Request, res: Response) => {
       const userId = req.params.userId
       try {
           const shares = await prisma.share.findMany({
               where: {
                   fromUserId: Number(userId)
               }
           })
           res.json({ message: "Shares fetched successfully",
               data: shares,
               status: 200
           });
       }
       catch (error: any) {
           res.status(500).json({
               message: "Internal server error",
               error: error.message,
           });
       }
   }

   static getSharesToMe = async (req: Request, res: Response) => {
       const userId = req.params.userId
       try {
           const shares = await prisma.share.findMany({
               where: {
                   toUserId: Number(userId)
               }
           })
           res.json({ message: "Shares fetched successfully",
               data: shares,
               status: 200
           });
       }
       catch (error: any) {
           res.status(500).json({
               message: "Internal server error",
               error: error.message,
           });
       }
   }

   static deleteShare = async (req: Request, res: Response) => {
       const shareId = req.params.shareId
       try {
           const share = await prisma.share.delete({
               where: {
                   id: Number(shareId)
               }
           })
           res.json({ message: "Share deleted successfully",
               data: share,
               status: 200
           });
       }
       catch (error: any) {
           res.status(500).json({
               message: "Internal server error",
               error: error.message,
           });
       }
   }

//faire report d'un post
   static createReport = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }

        //verifier si l'utilisateur a deja signale
        const signale = await prisma.report.findMany({
            where: {
                idUser: Number(userId),
                idPost: Number(postId),
            }
        })

        if (signale.length > 0) {
            //remover le signale
            await prisma.report.deleteMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            })
            return res.status(200).json({ message: "Report removed successfully",
                status: 200
            });
        }

        const newreport = await prisma.report.create({
            data: {
                idUser: Number(userId),
                idPost: Number(postId),
            },
        });

        res.json({ message: "Report created successfully",
            data: newreport,
            status: 200
        });
        
    
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//like
static likePost = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const like = await prisma.like.findMany({
            where: {
                idUser: Number(userId),
                idPost: Number(postId),
            }
        })

        if (like.length > 0) {
            //remover le signale
            await prisma.like.deleteMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            })
            return res.status(200).json({ message: "Like removed successfully",
                status: 200,
                data: null
            });
        }
        const newlike = await prisma.like.create({
            data: {
                idUser: Number(userId),
                idPost: Number(postId),
            },
        });
        res.json({ message: "Like created successfully",
            data: newlike,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//dislike
static dislikePost = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.body.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const dislike = await prisma.dislike.findMany({
            where: {
                idUser: Number(userId),
                idPost: Number(postId),
            }
        })

        if (dislike.length > 0) {
            //remover le signale
            await prisma.dislike.deleteMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            })
            return res.status(200).json({ message: "Dislike removed successfully",
                status: 200
            });
        }

        const newdislike = await prisma.dislike.create({
            data: {
                idUser: Number(userId),
                idPost: Number(postId),
            },
        });

        res.json({ message: "Dislike created successfully",
            data: newdislike,
            status: 200
        });
        
    
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//comment 
static commentPost = async (req: Request, res: Response) => {
    try {  

        const userId = req.params.userId;
        const postId = req.params.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const newComment = await prisma.comment.create({
            data: {
                idUser: Number(userId),
                idPost: Number(postId),
                content: req.body.content
            },
        });

        res.json({ message: "Comment created successfully",
            data: newComment,
            status: 200
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

static deleteComment = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const commentId = req.params.commentId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(commentId)
            }
        });
        if (comment === null) {
            return res.status(400).json({ message: "Comment not found" });
        }

        await prisma.comment.delete({
            where: {
                id: Number(commentId)
            }
        });
        res.json({ message: "Comment deleted successfully",
            status: 200
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}


static updateComment = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const commentId = req.params.commentId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(commentId)
            }
        });
        if (comment === null) {
            return res.status(400).json({ message: "Comment not found" });
        }

        const newComment = await prisma.comment.update({
            where: {
                id: Number(commentId)
            },
            data: {
                content: req.body.content
            },
        });

        res.json({ message: "Comment updated successfully",
            data: newComment,
            status: 200
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//les commentaires d'un post
static getComments = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const comments = await prisma.comment.findMany({
            where: {
                idPost: Number(postId),
            },
            include: {
                author: true
            
            }

        });
        res.json({ message: "Comments retrieved successfully",
            data: comments,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//post
static createPost = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      console.log(req?.file?.path);

      try {
        const userId = req.params.userId;
        const user = await prisma.user.findUnique({
          where: { id: Number(userId) },
        });

        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        const actor = await prisma.actor.findUnique({
          where: { idUser: Number(userId) },
        });

        if (!actor) {
          return res.status(400).json({ message: "Actor not found" });
        }

        if (actor.credits < 10) {
          return res
            .status(400)
            .json({ message: "Actor does not have enough credits" });
        } 

        const newPost = await prisma.post.create({
          data: {
            idActor: Number(actor.id),
            title: req.body.title,
            category: req.body.category,
            size: req.body.size,
            description: req.body.description,
            photo: req.file?.path || '', // Utilisez null au lieu d'une chaîne vide si aucune photo n'est téléchargée
          },
        });

        await prisma.actor.update({
          where: { id: Number(actor.id) },
          data: { credits: { decrement: 10 } },
        });

        res.json({
          message: "Post created successfully",
          data: newPost,
          status: 200,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  };
//supprimer un post
static deletePost = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        });
        res.json({ message: "Post deleted successfully",
            status: 200
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
//mypost
static mypost = async (req:Request,res:Response) => {
    try{
        const userId = req.params.userId;
        const actor = await prisma.actor.findUnique({
            where: {
                idUser: Number(userId)
            }
        })
        if(actor === null) {
            return res.status(400).json({ message: "Actor not found" });
        }
        const posts = await prisma.post.findMany({
            where: {
                idActor: Number(actor?.id)
            }
        });
        res.json({ message: "Posts retrieved successfully",
            data: posts,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

static allposts = async (req:Request,res:Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                tags: true,
                comments: true,
                likes: true,
                share: true,
                favoris: true,
                user: {
                    
                    include: {
                        user: true,
                
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            
        });
        res.json({ message: "Posts retrieved successfully",
            data: posts,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
}
static getPostActor = async (req:Request,res:Response) => {
    try {
        const idActor  = req.query.actor;
        const actor = await prisma.actor.findUnique({
            where: {
                id: Number(idActor)
            }     
        }) 
        if(actor === null) {
            return res.status(400).json({ message: "actor not found" });
        }
        const posts = await prisma.post.findMany({
            where: {
                idActor: Number(actor?.id)
            }
        });
        res.json({ message: "Posts retrieved successfully",
            data: posts,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
}
static updatepost = async (req:Request,res:Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (user === null) {
            return res.status(400).json({ message: "User not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const newPost = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                title: req.body.title,
                category: req.body.image,
                description: req.body.description,
            },
        });
        res.json({ message: "Post updated successfully",
            data: newPost,
            status: 200
        });
    } catch (error) {
         res.status(500).json({ message: "Internal server error" });
    }

}

static createtag = async (req:Request,res:Response) => {
    try {
        const postId = req.body.postId;
        const userId = req.params.userId;
        const actor = await prisma.actor.findUnique({
            where: {
                idUser: Number(userId)
            }
            
        })
        if(actor === null) {
            return res.status(400).json({ message: "Actor not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        // //verifier si cest son post
        if(actor?.id !== post?.idActor) {
            return res.status(400).json({ message: "Not your post" });
        }
        const tag = await prisma.tag.create({
            data: {
                name: req.body.name,
                idPost: Number(postId),
                
            }
        });
        res.json({ message: "Tag created successfully",
            data: tag,
            status: 200
        });
    

    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
   
       
}

//creer des tage à partir d'un tableau de tag 
static createtagarray = async (req:Request,res:Response) => {
    try {
        const postId = req.body.postId;
        const userId = req.params.userId;
        const tags = req.body.tags;
        console.log(tags); 
        const actor = await prisma.actor.findUnique({
            where: {
                idUser: Number(userId)
            }
        })
        if(actor === null) {
            return res.status(400).json({ message: "Actor not found" });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        // //verifier si cest son post
        if(actor?.id !== post?.idActor) {
            return res.status(400).json({ message: "Not your post" });
        }
        tags.forEach(async (tag: any) => {
            await prisma.tag.create({
                data: {
                    name: tag,
                    idPost: Number(postId),
                    
                }
            });
        })
        
        res.json({ message: "Tag created successfully",
            data: null,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

static updatetag = async (req:Request,res:Response) => {
    try {
        const postId = req.params.postId;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        }); 

        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const tag = await prisma.tag.update({
            where: {
                id: Number(req.body.id)
            },
            data: {
                name: req.body.name,
                idPost: Number(req.body.idPost),
                
            }
        });
        res.json({ message: "Tag updated successfully",
            data: tag,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

    
}

static gettag = async (req:Request,res:Response) => {
    try {
        const postId = req.params.postId;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const tag = await prisma.tag.findMany();
        res.json({ message: "Tag retrieved successfully",
            data: tag,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
}

static deletetag = async (req:Request,res:Response) => {
    try {
        const tagId = req.params.tagId;
        const tag = await prisma.tag.delete({
            where: {
                id: Number(tagId)
            }
        });
        res.json({ message: "Tag deleted successfully",
            data: tag,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
}

static gettagbypost = async (req:Request,res:Response) => {
    try {
        const postId = req.params.postId;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const tag = await prisma.tag.findMany({
            where: {
                idPost: Number(postId)
            }
        });
        res.json({ message: "Tag retrieved successfully",
            data: tag,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//add favoris
static addfavoris = async (req:Request,res:Response) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if(post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        const actor = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })
        if(actor === null) {
            return res.status(400).json({ message: "Actor not found" });
        }
        if(actor?.id === post?.idActor) {
            return res.status(400).json({ message: "this is your post" });
        }
        const fv = await prisma.favori.findMany({
            where: {
                idUser: Number(userId),
                idPost: Number(postId)
            }
        })
        if(fv.length > 0) {
            const fvs = await prisma.favori.deleteMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId)
                }
            })
            res.json({ message: "Favori deleted successfully",
                data: fvs,
                status: 200
            });
        }


        const favor = await prisma.favori.create({
            data: {
                idUser: Number(userId),
                idPost: Number(postId)
            }
        });
        res.json({ message: "Favori created successfully",
            data: favor,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
}

//my favoris
static getfavoris = async (req:Request,res:Response) => {
    try {
        const userId = req.params.userId;
        const favoris = await prisma.favori.findMany({
            where: {
                idUser: Number(userId)
            },
            include: {
                post: true
            }
        });
        res.json({ message: "Favoris retrieved successfully",
            data: favoris,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

static noterPost = async (req: Request, res: Response) => {
    try {
        const { idPost, note } = req.body;
        const idUser = req.params.userId;
        let newNote = null;
        console.log('first', idPost, note, idUser);

        if (note < 1 || note > 5) {
            return res.status(400).json({ message: "La note doit être comprise entre 1 et 5", status: false });
        }

       
        const post = await prisma.post.findUnique({
            where: { id: Number(idPost) },
            include: { notes: true }
        });
        if (!post) return res.status(404).json({ message: "Post non trouvé", data: null, status: 404 });

 const notesExist = post.notes.findIndex(r => r.idUser === Number(idUser));
if (notesExist !== -1) {
   newNote = await prisma.notes.update({
        where: { id: post.notes[notesExist].id },
        data: { note }
    });
} else {
    newNote = await prisma.notes.create({
        data: {
            note,
            idUser: Number(idUser),
            postId: Number(idPost)
        }
    });
}

const actor = await prisma.actor.findUnique({
    where: { idUser: post.idActor }
});
if (actor) {
    actor.votes = (actor.votes || 0) + note;
    await prisma.actor.update({
        where: { id: actor.id },
        data: { votes: actor.votes }
    });
}

res.status(200).json({ message: "Post noté avec succès", status: true,data : newNote });
} catch (error: any) {
res.status(500).json({ message: error.message, data: null, status: false });
}
}

// note pour un post
static getNotes = async (req: Request, res: Response) => {
    try {
        const idPost = req.params.idPost;
        const idUser = req.params.userId;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(idPost)
            }
        })
        if(!post) {
            return res.status(400).json({ message: "Post not found" });
        }

        const notes = await prisma.notes.findMany({
            where: {
                postId: Number(idPost),
                idUser: Number(idUser)
            },
           
        });
        res.json({ message: "Notes retrieved successfully",
            data: notes[0],
            status: 200
        });
    }
    catch (error :any) {
        res.status(500).json({ message:error.message });
    }
}

static getPostsWithoutMe = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const actor = await prisma.actor.findUnique({
            where: {
                idUser: Number(userId)
            }
        })
        const posts = await prisma.post.findMany({
            where: {
                idActor: {
                    not: Number(actor?.id)
                }
            },
            include: {
                tags: true,
                likes: true,
                comments: true,
                share: true,
                favoris: true,
                user: {
                    
                    include: {
                        user: true,
                
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            
             
        });
        res.json({ message: "Posts retrieved successfully",
            data: posts,
            status: 200
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

static viewPost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
  
      if (post === null) {
        return res.status(400).json({ message: "Post not found" });
      }
  
      // Incrémenter le nombre de vues
      const updatedPost = await prisma.post.update({
        where: { id: Number(postId) },
        data: { vues: { increment: 1 } },
      });
  
      res.json({
        message: "Post viewed successfully",
        data: updatedPost,
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //update post selon le statut
  static updatePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const { state } = req.body;
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
  
      if (post === null) {
        return res.status(400).json({ message: "Post not found" });
      }
  
      const updatedPost = await prisma.post.update({
        where: { id: Number(postId) },
        data: { state },
      });
  
      res.json({
        message: "Post updated successfully",
        data: updatedPost,
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };



}