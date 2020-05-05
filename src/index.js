import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"

import server from "./server"

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB, PORT } = process.env

const createServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cst-3icgb.gcp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
      { useUnifiedTopology: true }
    )
    mongoose.set('useFindAndModify', false);

    const app = express()

    server.applyMiddleware({ app })

    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    )
  } catch (error) {
    console.log(error)
  }
}

createServer()
