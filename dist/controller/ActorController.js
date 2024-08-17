import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class ActorController {
    //create a new actor
    static createActor = async (req, res) => {
        const { role } = req.body;
        if (role !== "TAILOR" && role !== "VENDOR") {
            return res.status(400).json({
                message: "Invalid role provided. Please choose either 'TAILOR' or 'VENDOR'.",
                status: 400
            });
        }
        try {
            const actor = await prisma.actor.create({
                data: {
                    idUser: req.body.idUser,
                    address: req.body.address,
                    bio: req.body.bio,
                    role: req.body.role,
                    credits: req.body.credits,
                    vote: req.body.vote
                }
            });
            res.json({ message: `${role} created successfully`,
                data: actor,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    static getActors = async (req, res) => {
        const actors = await prisma.actor.findMany();
        res.json({ message: "Actors fetched successfully",
            data: actors,
            status: 200
        });
    };
    static getActorById = async (req, res) => {
        const actor = await prisma.actor.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({ message: "Actor fetched successfully",
            data: actor,
            status: 200
        });
    };
    //update actor
    static updateActor = async (req, res) => {
        try {
            const { id } = req.params;
            const validFields = ['idUser', 'address', 'bio', 'credits', 'vote', 'role'];
            const dataUpdate = {};
            for (const key in req.body) {
                if (validFields.includes(key)) {
                    dataUpdate[key] = req.body[key];
                }
            }
            if (Object.keys(dataUpdate).length == 0) {
                return res.status(400).json({
                    message: "No valid fields provided to update",
                    status: 400
                });
            }
            const actor = await prisma.actor.update({
                where: {
                    id: Number(id)
                },
                data: dataUpdate
            });
            if (!actor) {
                return res.status(404).json({
                    message: "actor not found",
                    status: 404
                });
            }
            res.json({ message: "actor updated successfully",
                data: actor,
                status: 200
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message,
            });
        }
    };
    //delete actor
    static deleteActor = async (req, res) => {
        try {
            const { id } = req.params;
            const actor = await prisma.actor.delete({
                where: {
                    id: Number(id)
                }
            });
            if (!actor) {
                return res.status(404).json({
                    message: "Actor not found",
                    status: 404
                });
            }
            res.json({ message: "Actor deleted successfully",
                data: actor,
                status: 200
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message,
            });
        }
    };
}
