// mailgun

import FormData from 'form-data';
import config from 'config';
import axios from 'axios';

export const sendEmail = async (
  to: string,
  templateName: string,
  subject: string,
  templateVars: Record<string, any> = {},
) => {
  try {
    const form = new FormData();
    form.append('to', to);
    form.append('template', templateName);
    form.append('subject', subject);
    form.append(
      'from',
      // 'mailgun@sandboxe970f1f68f2148ab81c24419ca006632.mailgun.org',
      'iamfaizanshahid@gmail.com',
    );

    Object.keys(templateVars).forEach((key) => {
      form.append(`v:${key}`, templateVars[key]);
    });

    const username = 'api';
    const password = config.get('MAILGUN.PRIVATE_API_KEY');
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    const response = await axios({
      method: 'post',
      url: `https://api.mailgun.net/v3/${config.get('MAILGUN.TEST_DOMAIN')}/messages`,
      headers: {
        Authorization: `Basic ${token}`,
        ContentType: 'multipart/form-data',
      },
      data: form,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
