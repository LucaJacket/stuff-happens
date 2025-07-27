import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "@entities/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async one(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const derivedKey = (await promisify(scrypt)(
      password,
      user.salt,
      32,
    )) as Buffer;
    const storedKey = Buffer.from(user.password, "hex");
    if (!timingSafeEqual(storedKey, derivedKey))
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json(user);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;

    const user = Object.assign(new User(), {
      firstName,
      lastName,
      age,
    });

    return this.userRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.userRepository.remove(userToRemove);

    return "user has been removed";
  }
}
