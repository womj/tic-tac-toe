import { Request, Response } from "express";
import { multiply } from "../services/multplication-service";

function multiplyController(req: Request, res: Response) {
    const { a, b } = req.body
    const result = multiply(a, b)

    res.send({
        result
    })
}

export {
    multiplyController
}