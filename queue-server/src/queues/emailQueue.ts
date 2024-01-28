import { Worker, Job } from "bullmq";

interface SendEmailPayload {
    from: string;
    to: string;
    subject: string;
    body: string;
}

async function mockSendEmail(payload: SendEmailPayload) {
    const { from, to, subject, body } = payload;
    return new Promise((resolve, reject) => {
        console.log(`Sending Email to ${to}....`);
        setTimeout(() => resolve(1), 2 * 1000);
    });
}

export const emailWorker = new Worker(
    "email-queue",
    async (job: Job) => {
        const data = job.data;
        console.log("Job Received.. ", job.id);
        await mockSendEmail({
            from: data.from,
            to: data.to,
            subject: data.subject,
            body: data.body,
        });
    },
    {
        connection: {
            host: "redis-361736c5-sumanacharyya.a.aivencloud.com",
            port: 12375,
            username: "default",
            password: "AVNS_TMOKYJFWJrCGhpNMw39",
        },
        // concurrency: 10,
        limiter: {
            max: 5,
            duration: 1 * 1000,
        },
    }
);
