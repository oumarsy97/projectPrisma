var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ActorController {
}
_a = ActorController;
//create a new actor
ActorController.createActor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.body;
    if (role !== "TAILOR" && role !== "VENDOR") {
        return res.status(400).json({
            message: "Invalid role provided. Please choose either 'TAILOR' or 'VENDOR'.",
            status: 400
        });
    }
    try {
        const actor = yield prisma.actor.create({
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
});
ActorController.getActors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actors = yield prisma.actor.findMany();
    res.json({ message: "Actors fetched successfully",
        data: actors,
        status: 200
    });
});
ActorController.getActorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = yield prisma.actor.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });
    res.json({ message: "Actor fetched successfully",
        data: actor,
        status: 200
    });
});
//update actor
ActorController.updateActor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const actor = yield prisma.actor.update({
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
});
//delete actor
ActorController.deleteActor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const actor = yield prisma.actor.delete({
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
});
export default ActorController;
