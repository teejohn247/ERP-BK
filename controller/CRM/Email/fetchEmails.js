import dotenv from 'dotenv';
import { simpleParser } from 'mailparser';
import Imap from 'imap';
import Email from '../../../model/Email';
import Customer from '../../../model/Employees';
import HTTP_STATUS from 'http-status-codes';

dotenv.config();

const fetchEmails = async (req, res) => {
    try {
        const imap = new Imap({
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false  // This disables SSL certificate validation
              }
        });

        console.log(imap);

        const openInbox = (cb) => {
            imap.openBox('INBOX', false, cb);
        };

        let email_array = [];

        return new Promise((resolve, reject) => {
            imap.once('ready', function() {
                console.log("start open inbox");
                try {
                    openInbox(function (err, box) {
                        imap.search(['UNSEEN', ['SINCE', new Date()]], function(err, results) {
                            if (!results || !results.length) {
                                console.log("The server didn't find any emails matching the specified criteria");
                                imap.end();
                                return;
                            }

                            var f = imap.fetch(results, {
                                bodies: '',
                                struct: true
                            });

                            f.on('message', function(msg, seqno) {
                                msg.on('body', (stream, info) => {
                                    simpleParser(stream, async (err, parsed) => {
                                        if (err) throw err;

                                        const { from, subject, text, html, date } = parsed;

                                        // Extract the email address from the 'from' object
                                        const fromEmail = from.value[0].address;

                                        // Check if the recipient email is registered in our CRM
                                        const customer = await Customer.findOne({ email: 'teejohn247@gmail.com'});

                                        if (customer) {
                                            // Save the email in our database
                                            const newEmail = new Email({
                                                userId: customer._id,
                                                from: fromEmail, // Use the extracted email address
                                                subject,
                                                body: text || html,
                                                receivedDate: date
                                            });


                                            await newEmail.save();

                                            // Add the email to the array
                                            await email_array.push(newEmail);

                                            console.log({email_array});
                                        }
                                    });
                                });
                            });

                            f.once('error', function(err) {
                                console.log('Fetch error: ' + err);
                            });

                            f.once('end', function() {
                                console.log('Done fetching all messages!');
                                imap.end();
                               return res.status(HTTP_STATUS.OK).json({
                                    status: HTTP_STATUS.OK,
                                    success: true,
                                    message: 'Email fetching process completed',
                                    data: email_array
                                });

                                // Resolve the promise with the email array once all messages are fetched
                                // resolve(email_array);
                            });
                        });
                    });
                } catch (err) {
                    console.log("Error when request open inbox mail", err);
                    reject(err); // Reject the promise if there's an error
                }
            });

            imap.once('error', (err) => {
                console.error('IMAP connection error:', err);
            });

            imap.once('end', () => {
                console.log('IMAP connection ended');
            });

            imap.connect();

            console.log({email_array});
              // Process the fetched emails
        // for (const email of email_array) {
        //     const { from, subject, content, attachment, date } = email;

        //     // Check if the recipient email is registered in our CRM
        //     const customer = await Customer.findOne({ email: 'teejohn247@gmail.com' });

        //     if (customer) {
        //         // Save the email in our database
        //         const newEmail = new Email({
        //             userId: customer._id,
        //             from,
        //             subject,
        //             body: content,
        //             attachment,
        //             receivedDate: date
        //         });

        //         await newEmail.save();
        //     }
        // }

 
        });

      

    } catch (error) {
        console.error('Error in fetchEmails:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error: 'An error occurred while fetching emails'
        });
    }
};

export default fetchEmails;
