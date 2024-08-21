import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
const prisma = new PrismaClient();
const storySchema = z.object({
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
});
export default class StoryController {
    static create = async (req, res) => {
        const { title, description } = req.body;
        const photo = req.file?.path || "";
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing", data: null, status: false });
        }
        const idActory = Number(req.userId);
        if (isNaN(idActory)) {
            return res.status(400).json({ message: "Invalid User ID format", data: null, status: false });
        }
        const validation = storySchema.safeParse({ title, description });
        if (!validation.success) {
            return res.status(400).json({ message: validation.error.errors[0].message, data: null, status: false });
        }
        try {
            const newStory = await prisma.story.create({
                data: {
                    title,
                    description,
                    photo,
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
        try {
            const { idStory } = req.params;
            const userId = req.userId;
            const story = await prisma.story.findUnique({ where: { id: Number(idStory) } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            if (story.idActory !== userId) {
                return res.status(400).json({ message: "You can't delete this story", data: null, status: false });
            }
            const deleteStory = await prisma.story.delete({ where: { id: Number(idStory) } });
            res.status(200).json({ message: "Story deleted successfully", data: deleteStory, status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static viewStory = async (req, res) => {
        try {
            const { idStory } = req.params;
            const viewerId = req.userId;
            const story = await prisma.story.findUnique({ where: { id: Number(idStory) } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            if (story.idActory === viewerId) {
                return res.status(400).json({ message: "You can't view your own story", data: null, status: false });
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
            const userId = req.userId;
            const story = await prisma.story.findUnique({ where: { id: Number(idStory) } });
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }
            if (story.idActory !== userId) {
                return res.status(403).json({ message: "You are not authorized to see this information", data: null, status: false });
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
            const iduser = req.userId;
            const stories = await prisma.story.findMany({ where: { idActory: iduser } });
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
            const idUser = req.userId;
            if (!idUser) {
                return res.status(401).json({ message: "Unauthorized", data: null, status: false });
            }
            const user = await prisma.user.findUnique({ where: { id: idUser }, include: { actor: true } });
            if (!user) {
                return res.status(404).json({ message: "User not found", data: null, status: false });
            }
            const follows = await prisma.follow.findMany({ where: { idUser: idUser } });
            const followedActorIds = follows.map(follow => follow.idActor);
            // if (user.actor) {
            //   followedActorIds.push(actor.id);
            // }
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
