import cron from 'node-cron';
import { endOfYesterday, startOfYesterday } from 'date-fns';
import { Request } from '../models/requests.js';
import sendEmail from './sendEmail.js';

cron.schedule('0 8 * * *', async () => {
  const yesterdayStart = startOfYesterday();
  const yesterdayEnd = endOfYesterday();

  try {
    // Query for the requests that are "interested" and created yesterday
    const pendingRequests = await Request.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      }
    }).populate("fromUserId toUserId");

    // Extract unique emails from the requests
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email))
    ];

    console.log("Sending reminder emails to the following users:", listOfEmails);

    // Loop through each email and send a reminder email
    for (const email of listOfEmails) {
      try {
        const subject = "New Friend Requests Pending from:"+email;
        const body = "There are pending friend requests for you. Please login to DevHub.in and accept or reject the requests.";

        const res = await sendEmail(subject, body, email);
        console.log(`Email sent to ${email}:`);
      } catch (err) {
        console.error(`Error sending email to ${email}:`, err);
      }
    }
  } catch (err) {
    console.error("Error fetching pending requests:", err);
  }
});
