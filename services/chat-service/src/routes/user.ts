import fastify, { FastifyInstance } from "fastify";
import { z } from "zod";
import { errorResponse, ErrorResponse } from "@repo/types";
import { User } from "@repo/types";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

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
          500: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password, first_name, last_name } = request.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      try {
        const [rows] = await fastify.mysql.query<any>(
          "INSERT INTO Users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
          [email, hashedPassword, first_name, last_name]
        );

        const [user] = await fastify.mysql.query<any>(
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
          500: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        const [rows] = await fastify.mysql.query<
          User.User[] & RowDataPacket[][]
        >("SELECT * FROM Users WHERE email = ?", [email]);

        if (rows.length === 0) {
          return reply.status(400).send({
            error_code: 400,
            error_title: "not found",
            error_message: "User not found",
          });
        }

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return reply.status(400).send({
            error_code: 400,
            error_title: "Invalid password",
            error_message: "Invalid password",
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
          error_title: "Failed to get user",
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
    "/:userId",
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

      try {
        // TODO Type support here is terrible or maybe its just me.
        const [rows] = await fastify.mysql.query<
          User.UserTransport[] & RowDataPacket[][]
        >("SELECT * FROM Users WHERE  user_id != ?", [userId]);

        const transport = rows.map((row) => {
          return {
            user_id: row.user_id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
          };
        });

        console.log(transport);
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
