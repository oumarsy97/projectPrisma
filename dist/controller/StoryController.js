import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class StoryController {
    static create = async (req, res) => {
        const userId = req.params.userId;
        const { title, description } = req.body;
        const photo = req.file?.path || "";
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized: User ID is missing", data: null, status: false });
            }
            const actor = await prisma.actor.findUnique({ where: { idUser: +userId } });
            if (!actor) {
                return res.status(404).json({ message: "Actor not found", data: null, status: false });
            }
            const idActory = actor.id;
            const newStory = await prisma.story.create({
                data: {
                    title,
                    description,
                    photo, // This field is always a string
                    idActory,
                },
            });
            res.status(201).json({ message: "Story created successfully", data: newStory, status: true });
        }
        catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    };
    static deleteStory = async (req, res) => {
        const { idStory } = req.params;
        const userId = req.params.userId;
        try {
            const actor = await prisma.actor.findUnique({ where: { idUser: +userId } });
            if (!actor) {
                return res.status(404).json({ message: "Actor not found", data: null, status: false });
            }
            const story = await prisma.story.findFirst({ where: { id: Number(idStory), idActory: actor.id } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            await prisma.story.delete({ where: { id: Number(idStory) } });
            res.status(200).json({ message: "Story deleted successfully", data: null, status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static viewStory = async (req, res) => {
        try {
            const { idStory } = req.params;
            const viewerId = req.params.userId;
            const story = await prisma.story.findUnique({ where: { id: Number(idStory) } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            const updatedStory = await prisma.story.update({
                where: { id: Number(idStory) },
                data: { vues: { increment: 1 } },
            });
            res.status(200).json({
                message: "Story viewed successfully",
                data: { vues: updatedStory.vues },
                status: true
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static getStoryViews = async (req, res) => {
        try {
            const { idStory } = req.params;
            const userId = req.params.userId;
            const story = await prisma.story.findUnique({ where: { id: Number(idStory) } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            res.status(200).json({
                message: "Story views retrieved successfully",
                data: { vues: story.vues },
                status: true
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static getMyStories = async (req, res) => {
        try {
            const iduser = req.params.userId;
            const actor = await prisma.actor.findUnique({ where: { idUser: +iduser } });
            if (!actor) {
                return res.status(404).json({ message: "Actor not found", data: null, status: false });
            }
            const stories = await prisma.story.findMany({ where: { idActory: actor.id } });
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static getAllStories = async (_req, res) => {
        try {
            const stories = await prisma.story.findMany();
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static getMyFollowingStories = async (req, res) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(401).json({ message: "Unauthorized", data: null, status: false });
            }
            const user = await prisma.user.findUnique({ where: { id: +idUser }, include: { actor: true } });
            if (!user) {
                return res.status(404).json({ message: "User not found", data: null, status: false });
            }
            const follows = await prisma.follow.findMany({ where: { idUser: +idUser } });
            const followedActorIds = follows.map(follow => follow.idActor);
            const stories = await prisma.story.findMany({
                where: {
                    idActory: {
                        in: followedActorIds
                    }
                }
            });
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
}
