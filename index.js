const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));


app.use(express.json());
app.use(express.urlencoded( { extended: false}));

const log = function (request, response, next){
	console.log(`${new Date()}: ${request.protocol}://&{request.get('host')}&{request.originalUrl}`);
	console.log(request.body);
	next();
}
app.use(log);



app.post("/ajax/email", function(request, response){
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "your_account@gmail.com", // this should be YOUR GMAIL account
			pass: "your_password" // this should be your password
		}
	});

	var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
	var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;
	var mail = {
		from: "your_account@gmail.com", 
		to: "your_account@gmail.com", 
		subject: "Mail From Contact Form", 
		text: textBody,
		html: htmlBody
	};

	// send mail with defined transport object
	transporter.sendMail(mail, function (err, info) {
		if(err) {
			console.log(err);
			response.json({ message: "message not sent: an error occured; check the server's console log" });
		}
		else {
			response.json({ message: `message sent: ${info.messageId}` });
		}
	});

});
