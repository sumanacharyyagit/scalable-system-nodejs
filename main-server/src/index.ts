import express from "express";
import { Queue } from "bullmq";
import { addUserToCourseQuery } from "./utils/course";
import { mockSendEmail } from "./utils/email";

const app = express();
const PORT = process.env.PORT ?? 8080;

const emailQueue = new Queue("email-queue", {
    connection: {
        host: "redis-361736c5-sumanacharyya.a.aivencloud.com",
        port: 12375,
        username: "default",
        password: "AVNS_TMOKYJFWJrCGhpNMw39",
    },
});

app.get("/", (req, res) => {
    return res.json({
        status: "success",
        message: "Hello from Express Server",
    });
});

app.post("/add-user-to-course", async (req, res) => {
    console.log("Adding user to course");
    // Critical
    await addUserToCourseQuery();

    // Non Critical
    // await mockSendEmail({
    //     from: "sumanacharyya@gmail.com",
    //     to: "student@gmail.com",
    //     subject: "Congrats on enrolling in Twitter Course",
    //     body: "Dear Student, You have been enrolled to Twitter Clone Course.",
    // });

    await emailQueue.add(`${Date.now()}`, {
        from: "sumanacharyya@gmail.com",
        to: "student@gmail.com",
        subject: "Congrats on enrolling in Test Program",
        body: "Dear employee, You have been enrolled to Test Program.",
    });

    return res.json({
        status: "success",
        data: { message: "Enrolled Success" },
    });
});

app.listen(PORT, () =>
    console.log(
        `Express Server Started on PORT:${PORT} --> http://localhost:${PORT}`
    )
);
