import fastify, { FastifyInstance } from "fastify";
import { z } from "zod";
import { errorResponse, ErrorResponse } from "@repo/types";
import { User } from "@repo/types";
import bcrypt from "bcrypt";
import { Entity } from "../utility/dbQueryType";

export const user = async (fastify: FastifyInstance) => {
  //////////////////////////////////////////////////
  // USER SIGNUP
  //////////////////////////////////////////////////
  fastify.post<{
    Body: User.UserCreateTransport;
    Reply: User.UserTransport | ErrorResponse;
  }>(
    "/signup",
    {
      schema: {
        body: User.userCreateTransport,
        response: {
          200: User.userTransport,
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password, first_name, last_name } = request.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      try {
        // TODO Need proper return type post insert
        const [rows] = await fastify.mysql.query<any>(
          "INSERT INTO Users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
          [email, hashedPassword, first_name, last_name]
        );

        const [user] = await fastify.mysql.query<Entity<User.UserEntity>>(
          "SELECT * FROM Users WHERE user_id = ?",
          [rows.insertId]
        );

        const foundUser = user[0];

        return {
          user_id: foundUser.user_id,
          email: foundUser.email,
          first_name: foundUser.first_name,
          last_name: foundUser.last_name,
        };
      } catch (err: any) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Failed to create user",
          error_message: err.message,
        });
      }
    }
  );

  //////////////////////////////////////////////////
  // USER LOGIN
  //////////////////////////////////////////////////
  fastify.post<{
    body: {
      email: string;
      password: string;
    };
    Reply: User.UserTransport | ErrorResponse;
  }>(
    "/login",
    {
      schema: {
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
        response: {
          200: User.userTransport,
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        const [rows] = await fastify.mysql.query<Entity<User.UserEntity>>(
          "SELECT * FROM Users WHERE email = ?",
          [email]
        );

        if (rows.length === 0) {
          return reply.status(400).send({
            error_code: 400,
            error_title: "User not found",
            error_message: "Could not find user with that email",
          });
        }

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return reply.status(400).send({
            error_code: 400,
            error_title: "Invalid password",
            error_message: "Password is incorrect",
          });
        }

        return {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        };
      } catch (err: any) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Something went wrong",
          error_message: err.message,
        });
      }
    }
  );

  //////////////////////////////////////////////////
  // GET ALL USERS EXCEPT SELF
  //////////////////////////////////////////////////
  fastify.get<{
    Params: { userId: string };
    Reply: User.UserTransport[] | ErrorResponse;
  }>(
    "/list_all_users/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string(),
        }),
        response: {
          200: z.array(User.userTransport),
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      if (isNaN(parseInt(userId))) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Invalid User ID",
          error_message: "Provided user id is not valid",
        });
      }

      try {
        const [rows] = await fastify.mysql.query<Entity<User.UserEntity>>(
          "SELECT * FROM Users WHERE  user_id != ?",
          [userId]
        );

        const transport = rows.map((row) => {
          return {
            user_id: row.user_id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
          };
        });

        return transport;
      } catch (err: any) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Failed to get user",
          error_message: err.message,
        });
      }
    }
  );
};
