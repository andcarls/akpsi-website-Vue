<template>
    <h1 @click="showSendEmailReminders = !showSendEmailReminders" style="text-decoration: underline;">Send Email
        Reminders</h1>
    <div v-if="showSendEmailReminders">
        <p>Note: you can only send 100 emails per day. Trying to make a request above this number means some emails will be
            sent, but some lost. Be mindful of how many emails you send.</p>
        <h2 @click="showAllUserEmail = !showAllUserEmail" style="text-decoration: underline;">Send Reminder to all users
            (with debts)</h2>
        <div v-if="showAllUserEmail">
            <p>Brothers only</p>
            <button @click="sendToAllWithDebts">Send to all</button>
            {{ emails }}
        </div>

    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
export default {
    name: 'sendEmails',
    data() {
        return {
            showSendEmailReminders: false,
            showAllUserEmail: false,
            emails: {},
        }
    },
    methods: {
        // async sendMassReminders() {
        //     const { data, error } = await supabase.from('user_charges')
        //         .select(`
        //         user_id,
        //         amount,
        //         due_date,
        //         user_information (
        //         first_name,
        //         email,
        //         graduation_year
        //     ),
        //     events (
        //         event_name
        //     )
        //         `).eq('paid', false);
        //     let currDate = new Date();
        //     let gradYear;
        //     if (currDate.getMonth() > 6) {
        //         gradYear = currDate.getFullYear();
        //     }
        //     else {
        //         gradYear = currDate.getFullYear() - 1;
        //     }
        //     let userCharges = null;
        //     if (data && data.length != 0) {
        //         userCharges = data.filter(item => item.user_information.graduation_year > gradYear);
        //     }
        //     console.log(userCharges);
        //     if (error) {
        //         alert(error.message);
        //         return;
        //     }

        //     let chargesByEvent = {};
        //     userCharges.forEach(charge => {
        //         const eventName = charge.events.event_name;

        //         if (!chargesByEvent[eventName]) {
        //             chargesByEvent[eventName] = {

        //             };
        //             numEmails++;
        //         }
        //         chargesByUser[userId].charges.push({
        //             event_name: charge.events.event_name,
        //             amount: charge.amount,
        //             due_date: charge.due_date || 'N/A'
        //         });
        //     });
        // },
        async sendToAllWithDebts() {
            const { data, error } = await supabase.from('user_charges')
                .select(`
                user_id,
                amount,
                due_date,
                user_information (
                first_name,
                email,
                graduation_year
            ),
            events (
                event_name
            )
                `).eq('paid', false);
            let currDate = new Date();
            let gradYear;
            if (currDate.getMonth() > 6) {
                gradYear = currDate.getFullYear();
            }
            else {
                gradYear = currDate.getFullYear() - 1;
            }
            let userCharges = null;
            if (data && data.length != 0) {
                userCharges = data.filter(item => item.user_information.graduation_year > gradYear);
            }
            console.log(userCharges);
            if (error) {
                alert(error.message);
                return;
            }

            // 1. get all charges, filter out paid.
            // 2. iterate through each charge, mapping to unique uuid
            // 2a. add each charge to object under uuid
            let chargesByUser = {};
            let numEmails = 0;
            userCharges.forEach(charge => {
                const userId = charge.user_id;

                if (!chargesByUser[userId]) {
                    chargesByUser[userId] = {
                        email: charge.user_information.email,
                        name: charge.user_information.first_name,
                        charges: []
                    };
                    numEmails++;
                }
                chargesByUser[userId].charges.push({
                    event_name: charge.events.event_name,
                    amount: charge.amount,
                    due_date: charge.due_date || 'N/A'
                });
            });
            if (!confirm(numEmails + " emails will be sent (daily limit 100)")) {
                return;
            }
            console.log(chargesByUser);
            let count = 0;
            for (const userId in chargesByUser) {
                ++count;
                const user = chargesByUser[userId];
                const html_body = `
        <html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        p {
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <p>Hello ${user.name},</p>
    <p>You have outstanding debts due to AKPsi-Phi. Please see the details below:</p>
    <table>
        <tr>
            <th>Event Name</th>
            <th>Amount</th>
            <th>Due Date</th>
        </tr>
        ${user.charges.map(charge => `
        <tr>
            <td>${charge.event_name}</td>
            <td>${charge.amount}</td>
            <td>${charge.due_date}</td>
        </tr>
        `).join('')}
    </table>
    <br>
    <p>Zelle can be sent to vp.finance@akpsi-phi.com.</p>
    <p>You may <a href="https://akpsi-phi-access.netlify.app/">log in</a> to view your charges. Reply to this email if
        you believe it was sent in error.</p>
    <br>
    <p>Best,<br />VP-Finance</p>
</body>

</html>
    `;
                let message = {
                    sender: 'AKPsi-Phi VP-Finance <vp.finance@akpsi-phi.com>',
                    recipient: user.email,
                    subject: '[ACTION REQUIRED] Outstanding Debts to AKPsi-Phi',
                    html_body: html_body,
                };
                if (count % 20 == 0) {
                    alert('10s cooldown....');
                    setTimeout(null, 10000);
                }
                const { data, error } = await supabase.rpc('send_email_message', { message });
                if (error) {
                    alert(error.message + " see console...");
                    console.log('waiting 10s and reattempting');
                    setTimeout(null, 10000);
                    const { data, error: e2 } = await supabase.rpc('send_email_message', { message });
                    if (e2) {
                        console.log(e2.message);
                        console.log('failed second attempt, continuing without ' + message.recipient + " message sent");
                    }
                    else {
                        this.emails += message.recipient;
                        console.log(message.recipient + data);

                    }
                    // alert('Stopping emails... see messages table on Supabase for error logs and sent emails');
                    return;
                }
                else {
                    this.emails += message.recipient;
                    console.log(message.recipient + data);
                }
            }
            alert('emails successfully sent');

        },
    }

}
</script>
<!--  -->