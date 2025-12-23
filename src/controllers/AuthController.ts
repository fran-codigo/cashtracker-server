import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Prevenir duplicados
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      const error = new Error("El correo ya está registrado, inicia sesión");
      return res.status(409).json({ error: error.message });
    }
    try {
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.json("Cuenta creada correctamente");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Token no válido");
      return res.status(401).json({ error: error.message });
    }

    user.confirmed = true;
    user.token = null;
    await user.save();

    res.json("Cuenta confirmada correctamente");
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Prevenir duplicados
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Credenciales Inválidas");
      return res.status(404).json({ error: error.message });
    }

    if (!user.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      return res.status(403).json({ error: error.message });
    }

    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("Credenciales inválidas");
      return res.status(401).json({ error: error.message });
    }

    const token = generateJWT(user.id);

    res.json(token);
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("El correo no existe, crea una cuenta");
      return res.status(404).json({ error: error.message });
    }

    if (!user.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      return res.status(403).json({ error: error.message });
    }

    user.token = generateToken();
    await user.save();

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res.json("Revisa tu correo para ver las instrucciones");
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokenExists = await User.findOne({ where: { token } });

    if (!tokenExists) {
      const error = new Error("Token no válido");
      return res.status(404).json({ error: error.message });
    }

    res.json("Token válido, asigna una nueva contraseña");
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Token no válido");
      return res.status(404).json({ error: error.message });
    }

    // Asignar la nueva contraseña
    user.password = await hashPassword(password);
    user.token = null;
    await user.save();

    res.json("La contraseña ha sido actualizada correctamente");
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    return res.json("Desde updateProfile");
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(404).json({ error: error.message });
    }

    user.password = await hashPassword(password);
    await user.save();

    res.json("La contraseña se ha actualizado correctamente");
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(404).json({ error: error.message });
    }

    res.json("Contraseña correcta");
  };
}
