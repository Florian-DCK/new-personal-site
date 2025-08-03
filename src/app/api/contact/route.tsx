'use';
import { NextResponse, NextRequest } from 'next/server';
const mail = require('@sendgrid/mail');

mail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET() {
	return NextResponse.json({ status: 'Ok' }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	const message = `
	Name: ${body.name}\r\n
	Email: ${body.email}\r\n
	Message: ${body.message}\r\n
	Subject: ${body.subject}\r\n
	`;

	console.log(message);

	const data = {
		to: 'fdonckersf@gmail.com',
		from: 'contact@floriandonckers.com',
		subject: body.subject || 'No Subject',
		text: message,
		html: message.replace(/\r\n/g, '<br>'),
	};

	try {
		await mail.send(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ status: 'Error' }, { status: 500 });
	}

	return NextResponse.json({ status: 'Ok' }, { status: 200 });
}
